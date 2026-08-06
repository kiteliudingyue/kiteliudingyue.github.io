# Hero Sky Scenes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage hero's static cloud backdrop with six hand-coded CSS/SVG sky scenes, one picked at random per page load, filtered by the active light/dark theme.

**Architecture:** A single new `HeroScene.astro` component ships all six scenes as hidden static markup plus an inline pre-paint script that sets `data-sky="<id>"` on the wrapper (from a `?sky=` URL override or a random theme-filtered pick); scoped CSS reveals exactly one scene. No hydration, no images, no new dependencies.

**Tech Stack:** Astro 5 (static output), scoped component CSS, inline vanilla JS, inline SVG. Site deploys to GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-08-06-hero-sky-scenes-design.md`

## Global Constraints

- Scene ids, exactly: `dawn`, `sea`, `breeze` (light pool); `night`, `storm`, `aurora` (dark pool).
- URL override parameter is named `sky` (e.g. `/?sky=storm`).
- The theme-toggle event is named `theme:change`, dispatched on `window`.
- Scene code must NEVER write `localStorage.theme` (cross-pool override applies the theme class only).
- No new npm dependencies. No image/video assets. No React/hydrated islands.
- All animations use `transform`/`opacity` only, and every animation in the component is disabled under `prefers-reduced-motion: reduce` (scenes hold static compositions; rain and lightning hidden entirely).
- The scene layer is `aria-hidden="true"` with `pointer-events: none`, absolutely positioned behind hero content (no layout shift).
- Lightning: single soft flash (peak opacity 0.35), period ≥ 7s.
- Verification gate is `npm run build` (the repo does not include `@astrojs/check`, so `astro check` is not used — do not install it).

**Dev server for verification steps:** from the repo root, run `npm run dev` as a background task; the site serves at `http://localhost:4321`. Browser checks use the attached-Chrome MCP tools (`navigate_page`, `evaluate_script`, `take_screenshot`). Each task states the exact JS to evaluate and the expected result. Stop the dev server only at the end of the whole plan.

**Commit trailer:** end every commit message body with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

---

### Task 1: HeroScene component with picker script + breeze scene; wire into homepage

**Files:**
- Create: `src/components/HeroScene.astro`
- Modify: `src/pages/index.astro:3` (import) and `src/pages/index.astro:26` (element)
- Delete: `src/components/AmbientClouds.astro`

**Interfaces:**
- Consumes: `document.documentElement.classList` `dark` class (set pre-paint by `BaseLayout.astro`'s inline theme script).
- Produces: `.hero-scene` wrapper element carrying `data-sky` (later tasks add `.scene-<id>` children inside it and their CSS inside its `<style>` block); shared `.cloud` base class + `cloud-drift` keyframes + `.cloud-1..4` position variants (reused by dawn/sea/night/storm); shared `.scene` base class (absolute, hidden, crossfade); a `window` listener on `theme:change` that re-rolls the scene (Task 2 adds the dispatcher).

- [ ] **Step 1: Create `src/components/HeroScene.astro`**

```astro
<div class="hero-scene" aria-hidden="true">
	<div class="scene scene-breeze">
		<div class="breeze-tint"></div>
		<div class="cloud cloud-1"></div>
		<div class="cloud cloud-2"></div>
		<div class="cloud cloud-3"></div>
		<div class="cloud cloud-4"></div>
	</div>
</div>

<script is:inline>
	(() => {
		const POOLS = {
			light: ['dawn', 'sea', 'breeze'],
			dark: ['night', 'storm', 'aurora'],
		};
		const ALL = POOLS.light.concat(POOLS.dark);
		const el = document.querySelector('.hero-scene');
		if (!el) return;

		const theme = () =>
			document.documentElement.classList.contains('dark') ? 'dark' : 'light';
		const pick = (pool) => pool[Math.floor(Math.random() * pool.length)];

		const param = new URLSearchParams(location.search).get('sky');
		if (param && ALL.includes(param)) {
			// Explicit share/debug override. If it belongs to the other pool,
			// apply the matching theme for this visit only — never persist it.
			const needed = POOLS.dark.includes(param) ? 'dark' : 'light';
			document.documentElement.classList.toggle('dark', needed === 'dark');
			window.__theme = needed;
			el.dataset.sky = param;
		} else {
			el.dataset.sky = pick(POOLS[theme()]);
		}

		window.addEventListener('theme:change', () => {
			el.dataset.sky = pick(POOLS[theme()]);
		});
	})();
</script>

<style>
	.hero-scene {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
	}
	.scene {
		position: absolute;
		inset: 0;
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 0.6s ease,
			visibility 0.6s;
	}
	[data-sky='breeze'] .scene-breeze {
		opacity: 1;
		visibility: visible;
	}
	/* No-JS fallback: without data-sky, show breeze (night in dark mode). */
	.hero-scene:not([data-sky]) .scene-breeze {
		opacity: 1;
		visibility: visible;
	}
	:global(.dark) .hero-scene:not([data-sky]) .scene-breeze {
		opacity: 0;
		visibility: hidden;
	}

	/* Shared cloud primitives (breeze/dawn/sea/night/storm reuse these). */
	.cloud {
		position: absolute;
		border-radius: 9999px;
		background: rgb(var(--color-sky) / 0.3);
		filter: blur(18px);
	}
	/* static left offsets keep the clouds scattered when the drift
	   animation is disabled under prefers-reduced-motion */
	.cloud-1 { width: 180px; height: 44px; top: 16%; left: 8%; animation: cloud-drift 75s linear infinite; animation-delay: -15s; }
	.cloud-2 { width: 120px; height: 32px; top: 58%; left: 55%; animation: cloud-drift 95s linear infinite; animation-delay: -50s; }
	.cloud-3 { width: 240px; height: 56px; top: 34%; left: 30%; animation: cloud-drift 120s linear infinite; animation-delay: -85s; }
	.cloud-4 { width: 90px; height: 26px; top: 74%; left: 78%; animation: cloud-drift 85s linear infinite; animation-delay: -30s; }

	@keyframes cloud-drift {
		from { transform: translateX(-280px); }
		to { transform: translateX(calc(100vw + 280px)); }
	}

	/* breeze: today's look plus a faint sky wash at the top */
	.breeze-tint {
		position: absolute;
		inset: 0;
		background: linear-gradient(to bottom, rgb(var(--color-sky) / 0.12), transparent 55%);
	}

	@media (prefers-reduced-motion: reduce) {
		.hero-scene :global(*) {
			animation: none !important;
		}
	}
</style>
```

- [ ] **Step 2: Swap the component into `src/pages/index.astro`**

Replace line 3:

```astro
import AmbientClouds from '../components/AmbientClouds.astro';
```

with:

```astro
import HeroScene from '../components/HeroScene.astro';
```

and replace line 26 `<AmbientClouds />` with `<HeroScene />`.

- [ ] **Step 3: Delete `src/components/AmbientClouds.astro`**

```bash
git rm src/components/AmbientClouds.astro
```

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: completes with no errors.

- [ ] **Step 5: Verify picker behavior in the browser**

With the dev server running, navigate to `http://localhost:4321/?sky=breeze` and evaluate:

```js
JSON.stringify({
	sky: document.querySelector('.hero-scene').dataset.sky,
	breezeVisible: getComputedStyle(document.querySelector('.scene-breeze')).opacity,
	clouds: document.querySelectorAll('.scene-breeze .cloud').length,
})
```

Expected: `{"sky":"breeze","breezeVisible":"1","clouds":4}`.

Then pin the theme so the next checks are deterministic regardless of the machine's system color scheme — evaluate:

```js
localStorage.setItem('theme', 'light')
```

Navigate to `http://localhost:4321/` (no param) and evaluate:

```js
['dawn', 'sea', 'breeze'].includes(document.querySelector('.hero-scene').dataset.sky)
```

Expected: `true` (dawn/sea markup doesn't exist yet, so those picks render an empty hero — that's fine at this task).

Then verify the cross-pool override applies dark without persisting — navigate to `http://localhost:4321/?sky=night` and evaluate:

```js
JSON.stringify({
	sky: document.querySelector('.hero-scene').dataset.sky,
	darkApplied: document.documentElement.classList.contains('dark'),
	stored: localStorage.getItem('theme'),
})
```

Expected: `{"sky":"night","darkApplied":true,"stored":"light"}` — the stored preference must NOT have become `"dark"` from this visit.

- [ ] **Step 6: Commit**

```bash
git add src/components/HeroScene.astro src/pages/index.astro
git commit -m "feat: HeroScene component with random theme-filtered sky picker

Replaces AmbientClouds; breeze scene absorbs its clouds verbatim.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Theme toggle dispatches `theme:change`; toggle re-rolls the scene

**Files:**
- Modify: `src/components/Header.astro:94-99`

**Interfaces:**
- Consumes: the `theme:change` listener installed by Task 1's picker script.
- Produces: `window` `CustomEvent('theme:change')` fired after every theme toggle (also available to future features, matching the existing `kite:toggle` idiom).

- [ ] **Step 1: Add the dispatch**

In `src/components/Header.astro`, replace:

```js
  document.querySelectorAll('.theme-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  });
```

with:

```js
  document.querySelectorAll('.theme-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      window.dispatchEvent(new CustomEvent('theme:change'));
    });
  });
```

- [ ] **Step 2: Verify re-roll in the browser**

Navigate to `http://localhost:4321/` and evaluate:

```js
(() => {
	const before = document.querySelector('.hero-scene').dataset.sky;
	document.querySelector('.theme-toggle').click();
	const after = document.querySelector('.hero-scene').dataset.sky;
	document.querySelector('.theme-toggle').click(); // restore theme
	return JSON.stringify({
		before,
		after,
		swappedPools:
			['dawn', 'sea', 'breeze'].includes(before) !==
			['dawn', 'sea', 'breeze'].includes(after),
	});
})()
```

Expected: `swappedPools` is `true` (the pools are disjoint, so the scene always changes pool with the theme).

- [ ] **Step 3: Commit**

```bash
git add src/components/Header.astro
git commit -m "feat: dispatch theme:change so the hero sky re-rolls on toggle

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Dawn scene

**Files:**
- Modify: `src/components/HeroScene.astro` (markup inside `.hero-scene`, CSS inside the existing `<style>`)

**Interfaces:**
- Consumes: `.scene` base class, `.cloud`/`.cloud-1`/`.cloud-3` primitives and `cloud-drift` keyframes from Task 1.
- Produces: `.scene-dawn` (light pool).

- [ ] **Step 1: Add markup** (as a sibling of `.scene-breeze`, inside `.hero-scene`)

```astro
	<div class="scene scene-dawn">
		<div class="dawn-sky"></div>
		<div class="dawn-sun"></div>
		<div class="cloud cloud-1 dawn-cloud"></div>
		<div class="cloud cloud-3 dawn-cloud"></div>
	</div>
```

- [ ] **Step 2: Add CSS** (inside the component `<style>`, after the breeze rules)

```css
	[data-sky='dawn'] .scene-dawn {
		opacity: 1;
		visibility: visible;
	}
	/* Alphas stay low mid-viewport so the coral end of the headline
	   gradient (#e85d45, tuned for ≥3:1 on white) keeps its contrast. */
	.dawn-sky {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to bottom,
			rgb(255 205 178 / 0.5) 0%,
			rgb(255 194 203 / 0.22) 40%,
			rgb(191 219 254 / 0.14) 72%,
			transparent 100%
		);
	}
	.dawn-sun {
		position: absolute;
		bottom: -10%;
		left: 50%;
		width: 340px;
		height: 340px;
		transform: translateX(-50%);
		background: radial-gradient(
			circle,
			rgb(255 200 130 / 0.45),
			rgb(255 170 120 / 0.16) 45%,
			transparent 70%
		);
		animation: sun-pulse 9s ease-in-out infinite alternate;
	}
	@keyframes sun-pulse {
		from { transform: translateX(-50%) scale(1); opacity: 0.85; }
		to { transform: translateX(-50%) scale(1.06); opacity: 1; }
	}
	.dawn-cloud {
		background: rgb(255 170 160 / 0.35);
	}
```

- [ ] **Step 3: Verify in the browser**

Navigate to `http://localhost:4321/?sky=dawn`, take a screenshot, and check: peach/rose wash strongest at the top, sun glow low behind the buttons, pink clouds drifting, backdrop fading to plain white before the cards section, headline/subtitle/buttons clearly legible.

Evaluate:

```js
getComputedStyle(document.querySelector('.scene-dawn')).opacity
```

Expected: `"1"`.

- [ ] **Step 4: Commit**

```bash
git add src/components/HeroScene.astro
git commit -m "feat: dawn hero scene

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Sea scene

**Files:**
- Modify: `src/components/HeroScene.astro`

**Interfaces:**
- Consumes: `.scene` base, `.cloud`/`.cloud-2` primitive, `cloud-drift` keyframes from Task 1.
- Produces: `.scene-sea` (light pool).

- [ ] **Step 1: Add markup** (as a sibling of the existing `.scene-*` divs, inside `.hero-scene`)

```astro
	<div class="scene scene-sea">
		<div class="sea-sky"></div>
		<div class="cloud cloud-2"></div>
		<svg class="gull gull-1" viewBox="0 0 32 12" fill="none">
			<path d="M1 10 Q 8 2 16 9 Q 24 2 31 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
		</svg>
		<svg class="gull gull-2" viewBox="0 0 32 12" fill="none">
			<path d="M1 10 Q 8 2 16 9 Q 24 2 31 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
		</svg>
		<svg class="sea-waves" viewBox="0 0 1440 120" preserveAspectRatio="none">
			<path class="wave wave-back" d="M-40 70 Q 80 50 200 70 T 440 70 T 680 70 T 920 70 T 1160 70 T 1400 70 T 1640 70 V 120 H -40 Z" />
			<path class="wave wave-front" d="M-40 92 Q 80 74 200 92 T 440 92 T 680 92 T 920 92 T 1160 92 T 1400 92 T 1640 92 V 120 H -40 Z" />
		</svg>
	</div>
```

- [ ] **Step 2: Add CSS**

```css
	[data-sky='sea'] .scene-sea {
		opacity: 1;
		visibility: visible;
	}
	.sea-sky {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to bottom,
			rgb(var(--color-sky) / 0.3) 0%,
			rgb(153 246 228 / 0.12) 65%,
			transparent 100%
		);
	}
	.sea-waves {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 90px;
	}
	/* Paths extend 40px past each edge so the ±14px bob never shows a gap. */
	.wave-back {
		fill: rgb(var(--color-sky) / 0.3);
		animation: wave-bob 7s ease-in-out infinite alternate;
	}
	.wave-front {
		fill: rgb(45 170 191 / 0.25);
		animation: wave-bob 5s ease-in-out infinite alternate-reverse;
	}
	@keyframes wave-bob {
		from { transform: translateX(-14px); }
		to { transform: translateX(14px); }
	}
	.gull {
		position: absolute;
		width: 26px;
		color: rgb(71 85 105 / 0.5);
		animation: cloud-drift 55s linear infinite;
	}
	.gull-1 { top: 20%; animation-delay: -8s; }
	.gull-2 { top: 27%; width: 18px; animation-delay: -34s; }
```

- [ ] **Step 3: Verify in the browser**

Navigate to `http://localhost:4321/?sky=sea`, screenshot, and check: two wave bands gently bobbing at the base of the hero (no gaps at the edges), two gull glyphs gliding across, sky-to-seafoam wash fading out before the cards, text legible.

Evaluate:

```js
JSON.stringify({
	opacity: getComputedStyle(document.querySelector('.scene-sea')).opacity,
	waves: document.querySelectorAll('.scene-sea .wave').length,
})
```

Expected: `{"opacity":"1","waves":2}`.

- [ ] **Step 4: Commit**

```bash
git add src/components/HeroScene.astro
git commit -m "feat: over-the-sea hero scene

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: Night scene (defines shared star layers)

**Files:**
- Modify: `src/components/HeroScene.astro`

**Interfaces:**
- Consumes: `.scene` base, `.cloud`/`.cloud-2` primitive from Task 1.
- Produces: `.scene-night` (dark pool); shared `.stars`/`.stars-a`/`.stars-b` classes and `twinkle` keyframes (Task 7's aurora reuses `.stars.stars-a`).

- [ ] **Step 1: Add markup** (as a sibling of the existing `.scene-*` divs, inside `.hero-scene`)

```astro
	<div class="scene scene-night">
		<div class="night-sky"></div>
		<div class="stars stars-a"></div>
		<div class="stars stars-b"></div>
		<svg class="moon" viewBox="0 0 40 40">
			<defs>
				<mask id="hero-moon-cut">
					<rect width="40" height="40" fill="white" />
					<circle cx="26" cy="15" r="10" fill="black" />
				</mask>
			</defs>
			<circle cx="20" cy="20" r="12" fill="rgb(226 232 240)" mask="url(#hero-moon-cut)" opacity="0.85" />
		</svg>
		<div class="cloud cloud-2 night-cloud"></div>
	</div>
```

- [ ] **Step 2: Add CSS**

```css
	[data-sky='night'] .scene-night {
		opacity: 1;
		visibility: visible;
	}
	.night-sky {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to bottom,
			rgb(23 30 66 / 0.65) 0%,
			rgb(30 41 59 / 0.35) 60%,
			transparent 100%
		);
	}
	/* Star fields: one 2px dot plus box-shadow copies. Base opacity is the
	   pleasant static state under reduced motion; twinkle dims from there. */
	.stars {
		position: absolute;
		top: 0;
		left: 0;
		width: 2px;
		height: 2px;
		border-radius: 9999px;
		background: currentColor;
	}
	.stars-a {
		color: rgb(226 232 240 / 0.75);
		box-shadow:
			40px 60px, 120px 30px, 210px 90px, 300px 45px, 380px 130px,
			460px 20px, 540px 80px, 620px 150px, 700px 40px, 780px 110px,
			860px 25px, 930px 70px, 1010px 140px, 1090px 55px, 160px 170px,
			520px 200px, 840px 190px, 80px 220px;
		animation: twinkle 4s ease-in-out infinite alternate;
	}
	.stars-b {
		color: rgb(191 219 254 / 0.9);
		box-shadow:
			90px 45px, 180px 120px, 270px 20px, 350px 95px, 430px 160px,
			590px 50px, 660px 120px, 740px 180px, 820px 60px, 900px 130px,
			980px 30px, 1060px 100px;
		animation: twinkle 3s ease-in-out infinite alternate-reverse;
	}
	@keyframes twinkle {
		from { opacity: 1; }
		to { opacity: 0.35; }
	}
	.moon {
		position: absolute;
		top: 14%;
		right: 12%;
		width: 44px;
		height: 44px;
	}
	.night-cloud {
		background: rgb(148 163 184 / 0.12);
	}
```

- [ ] **Step 3: Verify in the browser**

Navigate to `http://localhost:4321/?sky=night` (this auto-applies dark mode via the cross-pool override), screenshot, and check: deep navy wash, ~30 twinkling stars, crescent moon top-right, dim drifting cloud, dark-mode text clearly legible.

Evaluate:

```js
JSON.stringify({
	dark: document.documentElement.classList.contains('dark'),
	opacity: getComputedStyle(document.querySelector('.scene-night')).opacity,
})
```

Expected: `{"dark":true,"opacity":"1"}`.

- [ ] **Step 4: Commit**

```bash
git add src/components/HeroScene.astro
git commit -m "feat: night hero scene with twinkling stars and crescent moon

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: Storm scene

**Files:**
- Modify: `src/components/HeroScene.astro`

**Interfaces:**
- Consumes: `.scene` base, `.cloud`/`.cloud-1`/`.cloud-3` primitives from Task 1.
- Produces: `.scene-storm` (dark pool).

- [ ] **Step 1: Add markup** (as a sibling of the existing `.scene-*` divs, inside `.hero-scene`)

```astro
	<div class="scene scene-storm">
		<div class="storm-sky"></div>
		<div class="cloud cloud-1 storm-cloud"></div>
		<div class="cloud cloud-3 storm-cloud"></div>
		<div class="rain-wrap">
			<div class="rain rain-a"></div>
			<div class="rain rain-b"></div>
		</div>
		<div class="lightning"></div>
	</div>
```

- [ ] **Step 2: Add CSS**

```css
	[data-sky='storm'] .scene-storm {
		opacity: 1;
		visibility: visible;
	}
	.storm-sky {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to bottom,
			rgb(30 41 59 / 0.75) 0%,
			rgb(51 65 85 / 0.4) 60%,
			transparent 100%
		);
	}
	.storm-cloud {
		background: rgb(71 85 105 / 0.45);
		filter: blur(14px);
	}
	/* Rain: 12px dashes in 1.5px columns (dash pattern scrolls behind a
	   static column mask). translateY by the 26px vertical period loops
	   seamlessly. Wrapper tilts the whole curtain. */
	.rain-wrap {
		position: absolute;
		inset: -30%;
		transform: rotate(10deg);
	}
	.rain {
		position: absolute;
		inset: 0;
		background-image: repeating-linear-gradient(
			to bottom,
			rgb(148 163 184 / 0.28) 0 12px,
			transparent 12px 26px
		);
		-webkit-mask-image: repeating-linear-gradient(to right, black 0 1.5px, transparent 1.5px 26px);
		mask-image: repeating-linear-gradient(to right, black 0 1.5px, transparent 1.5px 26px);
		animation: rain-fall 0.9s linear infinite;
	}
	.rain-b {
		background-position: 0 13px;
		-webkit-mask-position: 13px 0;
		mask-position: 13px 0;
		animation-duration: 1.15s;
	}
	@keyframes rain-fall {
		from { transform: translateY(-26px); }
		to { transform: translateY(0); }
	}
	/* Single soft flash per 7.5s cycle — well under the WCAG
	   three-flashes-per-second threshold. */
	.lightning {
		position: absolute;
		inset: 0;
		background: radial-gradient(
			ellipse at 68% 10%,
			rgb(226 232 240 / 0.9),
			rgb(148 163 184 / 0.25) 35%,
			transparent 65%
		);
		opacity: 0;
		animation: lightning-flash 7.5s ease-out infinite;
	}
	@keyframes lightning-flash {
		0%, 91%, 97%, 100% { opacity: 0; }
		92.5% { opacity: 0.35; }
	}
```

Also extend the existing reduced-motion block (from Task 1) with rain/lightning removal, so the whole block becomes:

```css
	@media (prefers-reduced-motion: reduce) {
		.hero-scene :global(*) {
			animation: none !important;
		}
		.rain-wrap,
		.lightning {
			display: none;
		}
	}
```

- [ ] **Step 3: Verify in the browser**

Navigate to `http://localhost:4321/?sky=storm`, screenshot, and check: slate wash, blurred storm clouds, two offset curtains of thin falling rain dashes at a slight angle, no visible looping seam. Wait ~8s and confirm one soft lightning glow eases in and out (no strobe). Text legible in dark mode.

Evaluate:

```js
JSON.stringify({
	opacity: getComputedStyle(document.querySelector('.scene-storm')).opacity,
	rainLayers: document.querySelectorAll('.scene-storm .rain').length,
})
```

Expected: `{"opacity":"1","rainLayers":2}`.

- [ ] **Step 4: Commit**

```bash
git add src/components/HeroScene.astro
git commit -m "feat: storm hero scene with rain curtains and soft lightning

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 7: Aurora scene

**Files:**
- Modify: `src/components/HeroScene.astro`

**Interfaces:**
- Consumes: `.scene` base from Task 1; `.stars`/`.stars-a` and `twinkle` from Task 5.
- Produces: `.scene-aurora` (dark pool). Completes the six-scene lineup.

- [ ] **Step 1: Add markup** (as a sibling of the existing `.scene-*` divs, inside `.hero-scene`)

```astro
	<div class="scene scene-aurora">
		<div class="aurora-sky"></div>
		<div class="ribbon ribbon-1"></div>
		<div class="ribbon ribbon-2"></div>
		<div class="ribbon ribbon-3"></div>
		<div class="stars stars-a"></div>
	</div>
```

- [ ] **Step 2: Add CSS**

```css
	[data-sky='aurora'] .scene-aurora {
		opacity: 1;
		visibility: visible;
	}
	.aurora-sky {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to bottom,
			rgb(30 27 75 / 0.65) 0%,
			rgb(30 41 59 / 0.35) 55%,
			transparent 100%
		);
	}
	.ribbon {
		position: absolute;
		top: -12%;
		width: 42%;
		height: 65%;
		border-radius: 9999px;
		filter: blur(32px);
		opacity: 0.4;
		transform-origin: top center;
		transform: rotate(var(--tilt));
		animation: aurora-sway 14s ease-in-out infinite alternate;
	}
	.ribbon-1 {
		--tilt: -14deg;
		left: 6%;
		background: linear-gradient(to bottom, rgb(52 211 153 / 0.55), transparent 80%);
		animation-duration: 11s;
	}
	.ribbon-2 {
		--tilt: -4deg;
		left: 36%;
		background: linear-gradient(to bottom, rgb(45 212 191 / 0.45), transparent 75%);
		animation-direction: alternate-reverse;
	}
	.ribbon-3 {
		--tilt: 10deg;
		left: 62%;
		background: linear-gradient(to bottom, rgb(167 139 250 / 0.45), transparent 80%);
		animation-duration: 17s;
	}
	@keyframes aurora-sway {
		from { transform: rotate(var(--tilt)) scaleY(1); }
		to { transform: rotate(calc(var(--tilt) + 8deg)) scaleY(1.12); }
	}
```

- [ ] **Step 3: Verify in the browser**

Navigate to `http://localhost:4321/?sky=aurora`, screenshot, and check: indigo wash, three blurred green/teal/violet ribbons slowly swaying from the top, sparse stars, no ribbon color bleeding over the headline enough to hurt legibility.

Evaluate:

```js
JSON.stringify({
	opacity: getComputedStyle(document.querySelector('.scene-aurora')).opacity,
	ribbons: document.querySelectorAll('.scene-aurora .ribbon').length,
})
```

Expected: `{"opacity":"1","ribbons":3}`.

- [ ] **Step 4: Commit**

```bash
git add src/components/HeroScene.astro
git commit -m "feat: aurora hero scene

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 8: Full verification sweep

**Files:**
- Modify: none expected (fixes only if checks fail)

**Interfaces:**
- Consumes: everything above.
- Produces: verified feature, ready for review/merge.

- [ ] **Step 1: All twelve scene/theme states**

For each id in `dawn`, `sea`, `breeze`, `night`, `storm`, `aurora`: navigate to `http://localhost:4321/?sky=<id>` and take a screenshot. Confirm for each: correct theme applied (light pool → light page, dark pool → dark page), scene renders as specced, backdrop fades cleanly above the cards, and headline / subtitle / buttons are comfortably legible. If any scene's wash hurts headline contrast, reduce that backdrop's alpha values by ~25% and re-check.

- [ ] **Step 2: Random pick and refresh variation**

Evaluate `localStorage.setItem('theme', 'light')` first (deterministic pool regardless of system color scheme). Then navigate to `http://localhost:4321/` and evaluate this 10× (reloading between evaluations):

```js
document.querySelector('.hero-scene').dataset.sky
```

Expected: only light-pool values; at least two distinct values across the 10 loads.

- [ ] **Step 3: Reduced motion**

Emulate `prefers-reduced-motion: reduce` (CDP: `emulate` with `reducedMotion: 'reduce'`), then check `?sky=storm` (no rain, no lightning, static clouds), `?sky=night` (stars lit, not twinkling), and `?sky=sea` (waves static). Screenshot each.

- [ ] **Step 4: No layout shift and no console errors**

On `http://localhost:4321/`, evaluate:

```js
JSON.stringify({
	heroHeight: document.querySelector('.hero-section').offsetHeight > 0,
	scenePointer: getComputedStyle(document.querySelector('.hero-scene')).pointerEvents,
	ariaHidden: document.querySelector('.hero-scene').getAttribute('aria-hidden'),
})
```

Expected: `{"heroHeight":true,"scenePointer":"none","ariaHidden":"true"}`. Also confirm the browser console shows no errors.

- [ ] **Step 5: Production build**

Run: `npm run build`
Expected: success. Then `grep -c 'scene-' dist/index.html` — expected ≥ 6 (all scenes present in static output).

- [ ] **Step 6: Stop the dev server, final commit if fixes were made**

```bash
git add -A && git status
```

If anything changed in this task:

```bash
git commit -m "fix: hero scene polish from verification sweep

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```
