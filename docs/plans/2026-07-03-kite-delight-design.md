# Kite Delight — Design Spec

**Date:** 2026-07-03
**Status:** Approved by Kite
**Scope:** Site-wide "subtle delight" upgrade — light visual identity refresh plus cute kite-themed interactive elements. The site stays professional; the fun is woven in, not splashed on.

## Goals

1. Make the site feel personal and memorable (the "Kite" identity) without compromising its credibility as a researcher's site.
2. Add cute, interactive moments that reward curiosity.
3. Keep the site fast: no new runtime dependencies, no framework JS on pages that don't already have it, total added JS under ~10KB (minified), all features progressive enhancement.

## Non-goals

- No layout restructuring or content changes.
- No change to the Fun page's concert cards or vlogs (YouTube migration is a separate, pending task).
- No change to the March Madness standalone page.

## Decisions (from brainstorming)

- **Tone:** subtle delight everywhere (not fun-page-only, not a full redesign).
- **Interactive elements:** all four — kite cursor companion, logo/name easter eggs, playful 404, ambient page life.
- **Visual polish:** light identity upgrade — new heading font, sky/kite accent palette, softer surfaces, nicer motion.
- **Implementation approach:** vanilla JS + CSS + hand-drawn SVG; zero new runtime dependencies (font files via `@fontsource-variable/fraunces` are static assets, not runtime JS).

## Design

### 1. Visual identity upgrade (all pages)

- **Typography:** *Fraunces* (variable) for `h1–h3` and the wordmark; body remains system-ui. Self-hosted via `@fontsource-variable/fraunces` imported in `global.css` — no Google Fonts request (remove the now-unused `fonts.googleapis.com` preconnect from `BaseLayout.astro`).
- **Palette:** primary blue stays. Add semantic accents in `global.css` `:root`/`.dark`:
  - `--color-sky` (light sky blue) — subtle backgrounds, gradients.
  - `--color-coral` (warm sunset coral) — the kite tail, tag pill hover, small highlights. Used sparingly.
  - Hero name gradient becomes a slow-shifting sky-to-sunset gradient (blue → violet → coral).
- **Surfaces:** cards move from `rounded-lg` + border-only to `rounded-xl`, soft layered shadow on hover, gentle `-translate-y` lift. Consistent across home cards, project cards, concert cards (class-level tweak only).
- **Heading accent:** section `h1`/`h2` on Research/Projects/Fun get a short hand-drawn SVG squiggle underline (kite-string motif) in the accent color, replacing the plain `border-b` on Research section headers.
- **Scroll reveals:** sections/cards fade-and-rise in once on first scroll into view. One shared IntersectionObserver script (`data-reveal` attribute); elements are visible by default and only animated when JS is present AND `prefers-reduced-motion: no-preference` (no content hidden if JS fails).

### 2. Kite cursor companion (site-wide signature)

- A small (~30px) hand-drawn SVG kite — brand blue diamond, coral tail bows — that trails the pointer on a sagging string.
- **Physics:** `requestAnimationFrame` loop; kite position lerps toward a point offset above/behind the cursor; tilt angle from horizontal velocity; slow bob when idle. String rendered as a quadratic-bezier SVG path from cursor to kite with sag proportional to slack.
- **Touch devices (no fine pointer):** companion instead perches near the top-right below the header, bobbing gently; drifts upward briefly on scroll. Detected via `matchMedia('(pointer: fine)')`.
- **Dismissal:** clicking/tapping the kite makes it fly away off-screen; preference stored in `localStorage.kiteCompanion = 'off'`. A tiny "🪁" toggle in the footer brings it back.
- **Guardrails:** container is `position: fixed`, `pointer-events: none` (only the kite itself accepts clicks), `aria-hidden="true"`, hidden entirely under `prefers-reduced-motion: reduce`, rAF paused when tab hidden.
- **Placement:** `KiteCompanion.astro` component included once in `BaseLayout.astro`.

### 3. Easter eggs

- **Hero name launch:** clicking the gradient name on the homepage launches a kite from the click point that sails across the viewport with wind-trail lines, then despawns. ~1-in-8 launches instead release a small burst of confetti in kite colors. Cursor becomes pointer over the name; `title="✨"` hint. Keyboard-accessible (Enter/Space on a focusable span) but decorative — `aria-hidden` animation layer.
- **Konami code** (↑↑↓↓←→←→BA) on any page: a flock of 5–7 mini kites crosses the sky over ~4s with a brief translucent sky-gradient wash. One-shot per activation.
- **Console greeting:** a small styled `console.log` — a kite ASCII/emoji and a friendly line with the GitHub URL.
- All ephemeral animation layers: `position: fixed`, `pointer-events: none`, `aria-hidden`, removed from DOM on animation end, disabled under reduced motion.

### 4. Playful 404 page

- New `src/pages/404.astro` (Astro emits `404.html`; GitHub Pages serves it automatically).
- Copy: "Looks like this page flew away." with a big interactive kite scene: the kite hangs on a string anchored near the bottom; users can drag it with pointer events and it swings/settles with simple spring physics; gentle idle sway otherwise.
- Prominent "Take me home" button; header/footer retained so nav still works.
- Static-friendly: without JS, shows the kite illustration + copy + button (no interaction needed to be useful).

### 5. Ambient page life

- **Hero clouds:** 2–3 very faint blurred cloud shapes drifting slowly across the homepage hero (pure CSS animation, `aria-hidden`, ~40–80s loops, opacity ≤ 0.5 in light / ≤ 0.15 in dark).
- **Card tilt:** home + project cards tilt subtly (≤4°) toward the cursor via one shared script (`data-tilt` attribute, `perspective` transform, resets on leave). Skipped on touch and reduced-motion.
- **Footer kite:** a tiny inline SVG kite beside the copyright line, bobbing on a 4–6s CSS loop; doubles as the companion re-enable toggle (see §2).

## Architecture

```
src/
  components/
    KiteCompanion.astro     — companion SVG + inline <script> (physics, dismissal)
    KiteEggs.astro          — hero-launch + konami + console egg script layer
    SquiggleHeading.astro   — heading with kite-string squiggle underline (optional helper)
  pages/404.astro           — flew-away page with draggable kite
  scripts/
    reveal.js               — shared IntersectionObserver scroll reveals
    tilt.js                 — shared data-tilt card tilt
  styles/global.css         — palette vars, Fraunces import, heading font rules,
                              cloud/bob keyframes, reduced-motion overrides
  layouts/BaseLayout.astro  — includes KiteCompanion + KiteEggs, loads reveal/tilt
```

- Scripts are plain `<script>` in Astro components (Astro bundles/dedupes them); no React.
- Each unit is independent: removing any one component leaves the rest working.

## Accessibility & performance

- Every animation gated on `prefers-reduced-motion`; decorative layers `aria-hidden="true"` and `pointer-events: none`.
- No content depends on JS; reveals never hide content pre-JS.
- Color contrast: coral/sky used decoratively or on large text only; text colors unchanged.
- Font subset: Fraunces variable latin subset only (~30–50KB woff2, cached, self-hosted).
- rAF loops pause on `visibilitychange`; listeners passive.

## Testing & verification

1. `npm run build` passes; no TS/console errors.
2. Browser verification via attached Chrome: home/research/projects/fun/404 in light + dark, desktop + mobile emulation; screenshots reviewed.
3. Interactions exercised: companion follow/dismiss/re-enable, hero launch, Konami, 404 drag, tilt, reveals.
4. Reduced-motion emulation: no companion, no ambient motion, content fully visible.
5. Multi-lens review pass (correctness, a11y, perf, dark-mode) before commit.
