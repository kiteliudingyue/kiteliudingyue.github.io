# Hero Sky Scenes — Design

**Date:** 2026-08-06
**Status:** Approved by Kite

## Summary

Replace the homepage hero's static `AmbientClouds` backdrop with a pool of six
hand-coded CSS/SVG "sky scenes." One scene is picked at random on every page
load, filtered by the active color theme, so the hero looks different on each
visit. Inspired by pear.no's random-hero mechanic, rebuilt in this site's
drawn-with-code aesthetic: zero images, zero hydration, fully static
(GitHub Pages compatible).

## Requirements

- Six scenes in two theme-filtered pools:
  - **Light pool:** `dawn`, `sea`, `breeze`
  - **Dark pool:** `night`, `storm`, `aurora`
- Random pick per page load (no session stickiness) from the pool matching the
  active theme.
- `?sky=<id>` URL parameter forces a specific scene for sharing/debugging.
- Scene affects the hero background only — buttons, cards, kite companion, and
  the rest of the page are untouched.
- Toggling the theme re-rolls a scene from the new pool.
- No added image weight, no React hydration, no flash of unstyled/missing
  scene, no layout shift.

## Architecture

### Files

| File | Change |
|---|---|
| `src/components/HeroScene.astro` | **New.** All six scenes as hidden static markup, scoped styles, and an inline pre-paint picker script. |
| `src/pages/index.astro` | Swap `<AmbientClouds />` for `<HeroScene />`. |
| `src/components/AmbientClouds.astro` | **Deleted.** Its cloud markup/styles are absorbed verbatim by the `breeze` scene; it is only used on the homepage. |
| `src/components/Header.astro` | Add one line after the theme class toggle: `window.dispatchEvent(new CustomEvent('theme:change'))` (matches the existing `kite:toggle` event idiom). |

### Scene container

`HeroScene.astro` renders a wrapper matching the current `AmbientClouds`
placement contract: `position: absolute; inset: 0; overflow: hidden;
pointer-events: none;` with `aria-hidden="true"`. Inside it, six `.scene`
children (`.scene-dawn`, `.scene-sea`, …), each fully self-contained
(backdrop + effect layers). All are hidden by default; CSS reveals exactly one:

```css
[data-sky='storm'] .scene-storm { opacity: 1; }
```

Scenes crossfade via a short `opacity` transition when `data-sky` changes.

### Selection logic

Inline `<script is:inline>` inside the component, running before paint (same
pattern as the theme anti-flicker script in `BaseLayout.astro`, and reusing
the `window.__theme` global it sets):

```js
const POOLS = { light: ['dawn', 'sea', 'breeze'], dark: ['night', 'storm', 'aurora'] };
```

1. Read `?sky=` from `location.search`. If it names a valid scene, use it
   (see cross-pool rule below).
2. Otherwise pick uniformly at random from `POOLS[theme]`.
3. Set `data-sky="<id>"` on the hero scene wrapper.

**Cross-pool override rule:** if `?sky=` names a scene from the *other*
theme's pool (e.g. `?sky=storm` while in light mode), apply the matching theme
class to `document.documentElement` for that visit only — **do not write
`localStorage.theme`**. This keeps all six scenes shareable with readable text;
the visitor's saved preference is untouched and the next navigation renders
normally. Invalid `?sky=` values are ignored (falls through to random).

**Theme toggle:** a listener on `theme:change` re-picks randomly from the new
pool and updates `data-sky` (any active `?sky=` override is superseded — the
override only applies at load).

**No-JS fallback:** with no `data-sky` attribute present, CSS defaults to
`breeze` (and `night` under `.dark`), so the hero never renders bare.

## Scene specifications

Each scene = one backdrop gradient + 2–3 effect layers. All animations use
`transform`/`opacity` only (compositor-friendly, matching the existing cloud
drift). Every backdrop fades to transparent at its bottom edge so it blends
into the page background with no hard seam above the cards section.

| Scene | Pool | Backdrop | Effects |
|---|---|---|---|
| `dawn` | light | peach → rose → pale blue, vertical | radial sun glow low on the horizon; pink-tinted drifting clouds |
| `sea` | light | sky blue → seafoam | two layered SVG wave bands bobbing at the base; 1–2 small SVG gull glyphs; one cloud |
| `breeze` | light | white + faint sky tint at top | the current three `AmbientClouds` clouds unchanged, plus one small extra |
| `night` | dark | deep navy | ~40 star dots with staggered opacity twinkle; SVG crescent moon; one dim drifting cloud |
| `storm` | dark | slate → charcoal | dark cloud masses; angled rain via animated `repeating-linear-gradient` layer; soft lightning glow ~every 7s |
| `aurora` | dark | deep indigo | 2–3 blurred (≈30px) green/teal/violet ribbon shapes slowly undulating; sparse stars |

Palettes reuse existing tokens (`--color-sky`, `--color-coral`) where they
fit; per-scene literals stay scoped inside `HeroScene.astro`. Nothing is added
to `global.css`.

## Guardrails

- **Text contrast:** backdrops are palest (light pool) / darkest (dark pool)
  behind the hero text block. Riskiest pairing: dawn's peach zone under the
  coral end (`#e85d45`) of the gradient headline, which was tuned for ≥3:1 on
  white — dawn stays very pale near center. Verify all six scenes against
  headline, body text, and buttons.
- **Photosensitivity:** lightning is a soft radial glow easing in/out (max
  ~0.35 opacity), single flash, ~7s period — far below the WCAG
  three-flashes-per-second threshold — and disabled under reduced motion.
- **Reduced motion:** under `prefers-reduced-motion: reduce`, animations stop
  and each scene holds a pleasant static composition (stars stay lit, waves
  hold shape, rain hidden) — the same pattern `AmbientClouds` uses today.
- **Weight/perf:** ~8KB HTML + scoped CSS, zero images, zero hydration. Scene
  layer is absolutely positioned behind existing content — no layout shift.
  Inactive scenes are `visibility: hidden` (not just transparent) so their
  animations don't consume compositor work; the crossfade transitions
  visibility together with opacity.
- **A11y:** entire scene layer is `aria-hidden="true"` and
  `pointer-events: none`.

## Verification

1. `npm run build` passes. (`astro check` is not used: `@astrojs/check` is not a
   project dependency and adding it would violate the no-new-dependencies
   constraint.)
2. Dev-server screenshots of all six scenes in both themes via `?sky=`
   (browser-driven), checking visual quality and the bottom-edge blend.
3. Contrast spot-checks of the headline/body/buttons over each backdrop.
4. Reduced-motion emulation: scenes render static, lightning disabled.
5. Theme toggle re-rolls to a scene from the new pool with a crossfade.
6. Cross-pool `?sky=` applies the matching theme for the visit without
   persisting to `localStorage`.

## Out of scope (deliberately)

- Scene-tinted page accents and kite-companion weather reactions (possible
  later layers; the `theme:change` event and `data-sky` attribute give them
  clean hooks).
- Rare/easter-egg scenes (festival, meteor night).
- AI-generated imagery of any kind.
