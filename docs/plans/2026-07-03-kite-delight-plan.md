# Kite Delight Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Site-wide "subtle delight" upgrade — Fraunces display type, sky/coral kite palette, a kite cursor companion, easter eggs, a playful 404, and ambient touches — per `docs/plans/2026-07-03-kite-delight-design.md`.

**Architecture:** Vanilla JS + CSS + hand-drawn inline SVG. Behaviors live in small Astro components (`KiteCompanion.astro`, `KiteEggs.astro`, `AmbientClouds.astro`) and two shared scripts (`reveal.js`, `tilt.js`) loaded from `BaseLayout.astro`. Everything is progressive enhancement; nothing hides content without JS.

**Tech Stack:** Astro 5, Tailwind 4 (CSS-first config), `@fontsource-variable/fraunces` (static font files only — no runtime dep).

## Global Constraints

- No new runtime JS dependencies; no React on pages that don't already use it.
- Total added client JS under ~10KB minified.
- Every animation gated on `prefers-reduced-motion: reduce`.
- All decorative layers: `aria-hidden="true"`, `pointer-events: none` (except the companion kite itself, which is clickable to dismiss).
- No content depends on JS (reveals must never leave content hidden pre-JS).
- Dark mode variants for every visual addition.
- This repo has no test framework (static site). Each task's test cycle is: `npm run build` passes with no errors + targeted browser verification in the final task.
- Palette (exact values): coral `244 116 94` (#F4745E) light / `251 143 125` (#FB8F7D) dark; sky `125 211 252` (#7DD3FC) light / `56 130 199` dark. Hero gradient: `#2563EB → #7C6AF0 → #F4745E`.

---

### Task 1: Typography + palette foundation

**Files:**
- Modify: `package.json` (via npm install)
- Modify: `src/styles/global.css`
- Modify: `src/layouts/BaseLayout.astro` (remove unused Google Fonts preconnect)
- Modify: `src/components/Header.astro` (wordmark display font)

**Interfaces:**
- Produces: CSS vars `--color-sky`, `--color-coral`, `--font-display`; utility class `.font-display`; keyframes `kite-bob`; classes `.reveal-init`/`.reveal-in`, `.tilt-card`, `.squiggle` used by later tasks.

- [ ] **Step 1: Install Fraunces**

Run: `npm install @fontsource-variable/fraunces`
Expected: added to `dependencies`, no errors.

- [ ] **Step 2: Extend global.css**

Replace the `@import` line and `:root`/`.dark` blocks at the top of `src/styles/global.css` with:

```css
@import "tailwindcss";
@import "@fontsource-variable/fraunces";

@custom-variant dark (&:where(.dark, .dark *));

:root {
  /* Light theme colors */
  --color-background: 255 255 255;
  --color-foreground: 17 24 39;
  --color-primary: 37 99 235;
  --color-secondary: 107 114 128;
  --color-accent: 99 102 241;
  --color-muted: 243 244 246;
  --color-border: 229 231 235;
  /* Kite palette */
  --color-sky: 125 211 252;
  --color-coral: 244 116 94;
  --font-display: 'Fraunces Variable', Georgia, 'Times New Roman', serif;
}

.dark {
  /* Dark theme colors */
  --color-background: 17 24 39;
  --color-foreground: 243 244 246;
  --color-primary: 96 165 250;
  --color-secondary: 156 163 175;
  --color-accent: 129 140 248;
  --color-muted: 31 41 55;
  --color-border: 55 65 81;
  /* Kite palette */
  --color-sky: 56 130 199;
  --color-coral: 251 143 125;
}
```

Append to the end of `global.css`:

```css
/* --- Kite identity ------------------------------------------------ */

h1, h2, h3,
.font-display {
  font-family: var(--font-display);
  font-variation-settings: "SOFT" 40, "WONK" 0;
  letter-spacing: -0.015em;
}

/* The hero name gets the playful cut of Fraunces */
.wonky {
  font-variation-settings: "SOFT" 100, "WONK" 1;
}

/* Kite-string squiggle under page titles */
.squiggle {
  display: block;
  margin-top: 0.35rem;
  color: rgb(var(--color-coral));
}

/* Scroll reveals — only ever applied by JS, so no-JS never hides content */
.reveal-init {
  opacity: 0;
  transform: translateY(16px);
}
.reveal-in {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

/* Card tilt */
.tilt-card {
  transition: transform 0.15s ease-out, box-shadow 0.3s ease, border-color 0.3s ease;
  will-change: transform;
}

@keyframes kite-bob {
  0%, 100% { transform: translateY(0) rotate(-3deg); }
  50% { transform: translateY(-5px) rotate(4deg); }
}

@media (prefers-reduced-motion: reduce) {
  .reveal-init { opacity: 1; transform: none; }
  * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }
}
```

- [ ] **Step 3: Remove the unused Google Fonts preconnect from BaseLayout.astro**

Delete these lines (font is now self-hosted):

```html
    <!-- Performance Optimization -->
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />
    <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
```

- [ ] **Step 4: Wordmark font in Header.astro**

On the logo `<a>` (line 14), add `font-display` to the class list:

```
class="flex items-center gap-2 text-xl font-bold font-display text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
```

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: completes with no errors.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/styles/global.css src/layouts/BaseLayout.astro src/components/Header.astro
git commit -m "feat: Fraunces display type + sky/coral kite palette"
```

---

### Task 2: Squiggle component, page-title squiggles, card surfaces

**Files:**
- Create: `src/components/Squiggle.astro`
- Modify: `src/pages/research.astro`, `src/pages/projects.astro`, `src/pages/fun.astro`, `src/pages/index.astro`

**Interfaces:**
- Consumes: `.squiggle` CSS class from Task 1.
- Produces: `<Squiggle width={n} />` component (default width 150, height 10, stroke `currentColor`).

- [ ] **Step 1: Create `src/components/Squiggle.astro`**

```astro
---
interface Props {
  width?: number;
  class?: string;
}
const { width = 150, class: className = '' } = Astro.props;
---
<svg
  class={`squiggle ${className}`}
  width={width}
  height="10"
  viewBox="0 0 150 10"
  fill="none"
  preserveAspectRatio="none"
  aria-hidden="true"
>
  <path
    d="M3 7 C 20 2, 36 9, 54 5 S 92 2, 110 6 S 138 4, 147 5"
    stroke="currentColor"
    stroke-width="2.5"
    stroke-linecap="round"
  />
</svg>
```

- [ ] **Step 2: Add squiggles under the page `<h1>`s**

In `research.astro`, `projects.astro`, `fun.astro`: import `Squiggle` and place `<Squiggle width={120} />` immediately after the closing `</h1>` inside the header block. Example for research.astro:

```astro
import Squiggle from '../components/Squiggle.astro';
...
      <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
        Research
      </h1>
      <Squiggle width={120} class="mb-5 -mt-2" />
```

Also in `fun.astro`, add `<Squiggle width={90} class="mb-4 -mt-1" />` after the "Vlogs" `<h2>`.

In `research.astro`, section `<h2>`s: keep the `border-b` (the squiggle marks page titles only — one signature per level).

- [ ] **Step 3: Soften card surfaces**

- `index.astro` cards: change `rounded-lg` → `rounded-xl` and append `hover:shadow-lg hover:-translate-y-1 transition-all duration-300` (replace `transition-colors`) on the card `<a>`.
- `projects.astro` article cards: same change: `rounded-lg` → `rounded-xl`, `transition-colors` → `transition-all duration-300`, add `hover:shadow-lg hover:-translate-y-1`.

- [ ] **Step 4: Build**

Run: `npm run build` — Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/Squiggle.astro src/pages/research.astro src/pages/projects.astro src/pages/fun.astro src/pages/index.astro
git commit -m "feat: kite-string squiggle titles + softer card surfaces"
```

---

### Task 3: Scroll reveals + card tilt scripts

**Files:**
- Create: `src/scripts/reveal.js`
- Create: `src/scripts/tilt.js`
- Modify: `src/layouts/BaseLayout.astro` (load scripts)
- Modify: `src/pages/index.astro`, `src/pages/research.astro`, `src/pages/projects.astro`, `src/pages/fun.astro` (data attributes)

**Interfaces:**
- Consumes: `.reveal-init`/`.reveal-in`/`.tilt-card` from Task 1.
- Produces: `data-reveal` and `data-tilt` attribute contracts, usable on any element.

- [ ] **Step 1: Create `src/scripts/reveal.js`**

```js
// Scroll-into-view reveals. Progressive enhancement: elements are fully
// visible unless this script runs and reduced motion is off.
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduce && 'IntersectionObserver' in window) {
  const els = document.querySelectorAll('[data-reveal]');
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-in');
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12 }
  );
  els.forEach((el, i) => {
    el.classList.add('reveal-init');
    el.style.transitionDelay = `${(i % 4) * 70}ms`;
    io.observe(el);
  });
}
```

- [ ] **Step 2: Create `src/scripts/tilt.js`**

```js
// Subtle 3D tilt toward the cursor for [data-tilt] cards.
const fine = window.matchMedia('(pointer: fine)').matches;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (fine && !reduce) {
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.classList.add('tilt-card');
    let raf = 0;
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.transform = `perspective(700px) rotateX(${(-py * 4).toFixed(2)}deg) rotateY(${(px * 5).toFixed(2)}deg) translateY(-4px)`;
      });
    });
    card.addEventListener('mouseleave', () => {
      cancelAnimationFrame(raf);
      card.style.transform = '';
    });
  });
}
```

- [ ] **Step 3: Load both from `BaseLayout.astro`** (before `</body>`, after `<Footer />`):

```astro
<script>
  import '../scripts/reveal.js';
  import '../scripts/tilt.js';
</script>
```

- [ ] **Step 4: Annotate elements**

- `index.astro`: add `data-tilt` to each home card `<a>`. (No `data-reveal` in the hero — it has its own entrance animation.)
- `projects.astro`: add `data-tilt` and `data-reveal` to each project `<article>`.
- `research.astro`: add `data-reveal` to each `<section>`.
- `fun.astro`: add `data-reveal` to the Vlogs `<section>`.
  (Concert cards are React islands with their own hover behavior — leave them.)

Note: home cards deliberately get tilt but not reveal (they're above the fold and already animated by `.animate-fade-in-up-delay-2`).

- [ ] **Step 5: Build**

Run: `npm run build` — Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/scripts/reveal.js src/scripts/tilt.js src/layouts/BaseLayout.astro src/pages
git commit -m "feat: scroll reveals + cursor card tilt (reduced-motion aware)"
```

---

### Task 4: Hero — sky-to-sunset gradient + ambient clouds

**Files:**
- Create: `src/components/AmbientClouds.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `--color-sky` from Task 1; `.wonky` class.
- Produces: `<AmbientClouds />` (absolute overlay; parent must be `relative overflow-hidden`).

- [ ] **Step 1: Create `src/components/AmbientClouds.astro`**

```astro
<div class="clouds" aria-hidden="true">
  <div class="cloud cloud-1"></div>
  <div class="cloud cloud-2"></div>
  <div class="cloud cloud-3"></div>
</div>

<style>
  .clouds {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
  }
  .cloud {
    position: absolute;
    border-radius: 9999px;
    background: rgb(var(--color-sky) / 0.3);
    filter: blur(18px);
  }
  :global(.dark) .cloud {
    background: rgb(var(--color-sky) / 0.07);
  }
  .cloud-1 { width: 180px; height: 44px; top: 16%; animation: cloud-drift 75s linear infinite; animation-delay: -15s; }
  .cloud-2 { width: 120px; height: 32px; top: 58%; animation: cloud-drift 95s linear infinite; animation-delay: -50s; }
  .cloud-3 { width: 240px; height: 56px; top: 34%; animation: cloud-drift 120s linear infinite; animation-delay: -85s; }

  @keyframes cloud-drift {
    from { transform: translateX(-280px); }
    to { transform: translateX(calc(100vw + 280px)); }
  }

  @media (prefers-reduced-motion: reduce) {
    .cloud { animation: none; }
  }
</style>
```

- [ ] **Step 2: Wire into `index.astro`**

- Import `AmbientClouds`; hero `<section>` gets `relative overflow-hidden` added to its class, `<AmbientClouds />` as first child, and the inner `<div class="max-w-4xl mx-auto text-center">` gets `relative` added.
- Update `.gradient-text` CSS: replace the `background` line with

```css
background: linear-gradient(120deg, #2563eb 0%, #7c6af0 45%, #f4745e 100%);
background-size: 200% 200%;
```

- Add `wonky` to the gradient name span's class list (playful Fraunces cut, Task 1).

- [ ] **Step 3: Build**

Run: `npm run build` — Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/AmbientClouds.astro src/pages/index.astro
git commit -m "feat: drifting hero clouds + sky-to-sunset name gradient"
```

---

### Task 5: Kite cursor companion + footer kite toggle

**Files:**
- Create: `src/components/KiteCompanion.astro`
- Modify: `src/layouts/BaseLayout.astro` (include component)
- Modify: `src/components/Footer.astro` (bobbing kite toggle)

**Interfaces:**
- Consumes: `--color-primary`, `--color-coral`, `kite-bob` keyframes from Task 1.
- Produces: listens for `window` CustomEvent `'kite:toggle'`; persists `localStorage.kiteCompanion` (`'on'`/`'off'`, default on).

- [ ] **Step 1: Create `src/components/KiteCompanion.astro`**

```astro
<div id="kite-companion" aria-hidden="true" hidden>
  <svg class="kc-string-svg" width="100%" height="100%">
    <path class="kc-string" d="" fill="none"></path>
  </svg>
  <button class="kc-kite" tabindex="-1" title="Click to send the kite away">
    <svg width="34" height="46" viewBox="0 0 40 54" fill="none">
      <path class="kc-sail" d="M20 2 L36 20 L20 40 L4 20 Z" />
      <path d="M20 2 L20 40 M4 20 L36 20" stroke="rgba(255,255,255,0.5)" stroke-width="1.5" />
      <path class="kc-tail" d="M20 40 C 15 45, 26 47, 21 53" stroke-width="2" fill="none" stroke-linecap="round" />
      <path class="kc-bow" d="M15 43.5 l5.5 2.5 M25.5 48.5 l-5.5 2" stroke-width="2" stroke-linecap="round" />
    </svg>
  </button>
</div>

<style>
  #kite-companion {
    position: fixed;
    inset: 0;
    z-index: 60;
    pointer-events: none;
  }
  .kc-string-svg {
    position: absolute;
    inset: 0;
  }
  .kc-string {
    stroke: rgb(var(--color-secondary) / 0.45);
    stroke-width: 1;
  }
  .kc-kite {
    position: absolute;
    left: 0;
    top: 0;
    padding: 2px;
    background: none;
    border: 0;
    cursor: pointer;
    pointer-events: auto;
    filter: drop-shadow(0 2px 3px rgb(0 0 0 / 0.18));
  }
  .kc-sail { fill: rgb(var(--color-primary)); }
  .kc-tail, .kc-bow { stroke: rgb(var(--color-coral)); }

  /* Perch mode (touch devices): parked below the header, bobbing */
  #kite-companion.kc-perch .kc-string-svg { display: none; }
  #kite-companion.kc-perch .kc-kite {
    left: auto;
    right: 1.25rem;
    top: 4.5rem;
    animation: kite-bob 4.5s ease-in-out infinite;
    transition: translate 0.5s ease;
  }
  #kite-companion.kc-perch.kc-lift .kc-kite { translate: 0 -12px; }

  @media (prefers-reduced-motion: reduce) {
    #kite-companion { display: none; }
  }
</style>

<script>
  const root = document.getElementById('kite-companion');
  const kiteEl = root.querySelector('.kc-kite');
  const stringEl = root.querySelector('.kc-string');
  const fine = window.matchMedia('(pointer: fine)').matches;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let mx = window.innerWidth * 0.72;
  let my = window.innerHeight * 0.4;
  let kx = mx + 46, ky = my - 92;
  let t = 0, raf = 0, running = false;
  let liftTimer = 0;

  const on = () => localStorage.getItem('kiteCompanion') !== 'off';

  function frame() {
    t += 0.016;
    const tx = mx + 46;
    const ty = my - 92 + Math.sin(t * 1.6) * 6;
    const nx = kx + (tx - kx) * 0.085;
    const ny = ky + (ty - ky) * 0.085;
    const vx = nx - kx;
    kx = nx; ky = ny;
    const rot = Math.max(-24, Math.min(24, vx * 6 + Math.sin(t * 1.6) * 3));
    kiteEl.style.transform = `translate(${kx - 17}px, ${ky - 23}px) rotate(${rot}deg)`;
    const bx = kx, by = ky + 20;
    const sag = Math.max(10, 80 - Math.hypot(bx - mx, by - my) * 0.22);
    stringEl.setAttribute('d', `M ${mx} ${my} Q ${(mx + bx) / 2} ${(my + by) / 2 + sag}, ${bx} ${by}`);
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running || !fine) return;
    running = true;
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  function show() {
    root.hidden = false;
    if (fine) start();
    else root.classList.add('kc-perch');
  }
  function flyAway() {
    stop();
    const anim = kiteEl.animate(
      [
        { transform: kiteEl.style.transform || 'translate(0,0)' },
        { transform: `translate(${window.innerWidth + 80}px, -140px) rotate(38deg)` },
      ],
      { duration: 900, easing: 'cubic-bezier(0.4, 0, 1, 1)' }
    );
    stringEl.setAttribute('d', '');
    anim.onfinish = () => { root.hidden = true; };
  }

  if (!reduce) {
    if (on()) show();

    window.addEventListener('pointermove', (e) => {
      mx = e.clientX;
      my = e.clientY;
    }, { passive: true });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
      else if (!root.hidden && fine) start();
    });

    window.addEventListener('scroll', () => {
      if (!root.classList.contains('kc-perch') || root.hidden) return;
      root.classList.add('kc-lift');
      clearTimeout(liftTimer);
      liftTimer = setTimeout(() => root.classList.remove('kc-lift'), 500);
    }, { passive: true });

    kiteEl.addEventListener('click', () => {
      localStorage.setItem('kiteCompanion', 'off');
      flyAway();
    });

    window.addEventListener('kite:toggle', () => {
      if (on()) {
        localStorage.setItem('kiteCompanion', 'off');
        if (!root.hidden) flyAway();
      } else {
        localStorage.setItem('kiteCompanion', 'on');
        show();
      }
    });
  }
</script>
```

- [ ] **Step 2: Include in `BaseLayout.astro`** after `<Footer />`:

```astro
<KiteCompanion />
```

(with `import KiteCompanion from '../components/KiteCompanion.astro';` in frontmatter)

- [ ] **Step 3: Footer kite toggle in `Footer.astro`**

Next to the copyright `<p>`, add:

```astro
<button
  id="kite-footer-toggle"
  class="kite-footer-toggle"
  aria-label="Toggle the kite cursor companion"
  title="Toggle the kite companion"
>
  <svg width="16" height="20" viewBox="0 0 40 54" fill="none" aria-hidden="true">
    <path d="M20 2 L36 20 L20 40 L4 20 Z" fill="rgb(var(--color-primary))" />
    <path d="M20 40 C 15 45, 26 47, 21 53" stroke="rgb(var(--color-coral))" stroke-width="3" fill="none" stroke-linecap="round" />
  </svg>
</button>

<style>
  .kite-footer-toggle {
    background: none;
    border: 0;
    padding: 0.25rem;
    cursor: pointer;
    line-height: 0;
  }
  .kite-footer-toggle svg {
    animation: kite-bob 5s ease-in-out infinite;
  }
</style>

<script>
  document.getElementById('kite-footer-toggle')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('kite:toggle'));
  });
</script>
```

Wrap it in the same flex row as the copyright text (`flex items-center gap-2`).

- [ ] **Step 4: Build**

Run: `npm run build` — Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/KiteCompanion.astro src/components/Footer.astro src/layouts/BaseLayout.astro
git commit -m "feat: kite cursor companion with footer toggle"
```

---

### Task 6: Easter eggs — hero kite launch, Konami flock, console greeting

**Files:**
- Create: `src/components/KiteEggs.astro`
- Modify: `src/layouts/BaseLayout.astro` (include component)
- Modify: `src/pages/index.astro` (hero name hook)

**Interfaces:**
- Consumes: `--color-*` palette vars.
- Produces: `data-kite-launch` attribute contract (any element becomes a kite launcher).

- [ ] **Step 1: Create `src/components/KiteEggs.astro`** (script + minimal CSS; full code)

```astro
<style is:global>
  .egg-layer {
    position: fixed;
    inset: 0;
    z-index: 70;
    pointer-events: none;
    overflow: hidden;
  }
  .egg-wash {
    position: absolute;
    inset: 0;
    background: linear-gradient(160deg, rgb(var(--color-sky) / 0.35), rgb(var(--color-coral) / 0.2));
    opacity: 0;
    animation: egg-wash 4.5s ease-in-out forwards;
  }
  @keyframes egg-wash {
    0%, 100% { opacity: 0; }
    30%, 60% { opacity: 1; }
  }
  .egg-flock-kite {
    position: absolute;
    left: -60px;
    animation: egg-fly var(--fly-dur, 4s) ease-in var(--fly-delay, 0s) forwards;
  }
  .egg-flock-kite svg {
    animation: kite-bob 1.4s ease-in-out infinite;
  }
  @keyframes egg-fly {
    from { transform: translateX(0) rotate(8deg); }
    to { transform: translateX(calc(100vw + 140px)) rotate(14deg); }
  }
  [data-kite-launch] { cursor: pointer; }
</style>

<script>
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const KITE_SVG = (size) => `
    <svg width="${size}" height="${size * 1.3}" viewBox="0 0 40 54" fill="none" aria-hidden="true">
      <path d="M20 2 L36 20 L20 40 L4 20 Z" fill="rgb(var(--color-primary))"/>
      <path d="M20 2 L20 40 M4 20 L36 20" stroke="rgba(255,255,255,0.5)" stroke-width="1.5"/>
      <path d="M20 40 C 15 45, 26 47, 21 53" stroke="rgb(var(--color-coral))" stroke-width="2" fill="none" stroke-linecap="round"/>
    </svg>`;

  console.log(
    '%c🪁 hi, curious one.',
    'font-size:14px; font-weight:bold;',
    '\nThe kite says hello. Code lives at https://github.com/kiteliudingyue' +
    '\nPsst… try ↑ ↑ ↓ ↓ ← → ← → B A'
  );

  function makeLayer() {
    const layer = document.createElement('div');
    layer.className = 'egg-layer';
    layer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(layer);
    return layer;
  }

  // --- Konami flock ---
  const SEQ = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let seqIdx = 0;
  let flockActive = false;

  window.addEventListener('keydown', (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    seqIdx = key === SEQ[seqIdx] ? seqIdx + 1 : (key === SEQ[0] ? 1 : 0);
    if (seqIdx === SEQ.length) {
      seqIdx = 0;
      flock();
    }
  });

  function flock() {
    if (reduce || flockActive) return;
    flockActive = true;
    const layer = makeLayer();
    layer.insertAdjacentHTML('beforeend', '<div class="egg-wash"></div>');
    for (let i = 0; i < 6; i++) {
      const k = document.createElement('div');
      k.className = 'egg-flock-kite';
      k.style.top = `${8 + ((i * 13) % 62)}vh`;
      k.style.setProperty('--fly-dur', `${3 + (i % 3)}s`);
      k.style.setProperty('--fly-delay', `${i * 0.25}s`);
      k.innerHTML = KITE_SVG(22 + ((i * 7) % 18));
      layer.appendChild(k);
    }
    setTimeout(() => { layer.remove(); flockActive = false; }, 7000);
  }

  // --- Hero name launch ---
  const CONFETTI_COLORS = ['#2563eb', '#f4745e', '#7dd3fc', '#7c6af0', '#fbbf24'];

  function kiteFlight(x, y) {
    const layer = makeLayer();
    const k = document.createElement('div');
    k.style.cssText = `position:absolute; left:0; top:0;`;
    k.innerHTML = KITE_SVG(30);
    layer.appendChild(k);
    const endX = window.innerWidth - x + 100;
    k.animate(
      [
        { transform: `translate(${x - 15}px, ${y - 20}px) rotate(0deg)`, offset: 0 },
        { transform: `translate(${x + endX * 0.35}px, ${Math.max(40, y - 180)}px) rotate(18deg)`, offset: 0.45 },
        { transform: `translate(${x + endX * 0.7}px, ${Math.max(20, y - 120)}px) rotate(6deg)`, offset: 0.75 },
        { transform: `translate(${x + endX}px, ${Math.max(-60, y - 260)}px) rotate(24deg)`, offset: 1 },
      ],
      { duration: 2300, easing: 'cubic-bezier(0.3, 0.1, 0.4, 1)' }
    ).onfinish = () => layer.remove();
  }

  function confetti(x, y) {
    const layer = makeLayer();
    for (let i = 0; i < 26; i++) {
      const p = document.createElement('span');
      const size = 5 + (i % 4) * 2;
      p.style.cssText = `position:absolute; left:${x}px; top:${y}px; width:${size}px; height:${size * 0.6}px; background:${CONFETTI_COLORS[i % CONFETTI_COLORS.length]}; border-radius:1px;`;
      layer.appendChild(p);
      const angle = (i / 26) * Math.PI * 2;
      const dist = 70 + ((i * 37) % 110);
      p.animate(
        [
          { transform: 'translate(0,0) rotate(0)', opacity: 1 },
          { transform: `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist * 0.7 - 40 + 90}px) rotate(${180 + i * 40}deg)`, opacity: 0 },
        ],
        { duration: 950 + (i % 5) * 110, easing: 'cubic-bezier(0.2, 0.6, 0.4, 1)' }
      );
    }
    setTimeout(() => layer.remove(), 1600);
  }

  let launchCount = 0;
  function launch(x, y) {
    if (reduce) return;
    launchCount++;
    // every so often, a surprise
    if (launchCount % 8 === 3 || Math.random() < 0.08) confetti(x, y);
    else kiteFlight(x, y);
  }

  document.querySelectorAll('[data-kite-launch]').forEach((el) => {
    el.addEventListener('click', (e) => launch(e.clientX, e.clientY));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const r = el.getBoundingClientRect();
        launch(r.left + r.width / 2, r.top + r.height / 2);
      }
    });
  });
</script>
```

- [ ] **Step 2: Include `<KiteEggs />` in `BaseLayout.astro`** after `<KiteCompanion />`.

- [ ] **Step 3: Hook the hero name in `index.astro`**

The gradient name span becomes:

```astro
<span
  class="block gradient-text wonky"
  data-kite-launch
  role="button"
  tabindex="0"
  title="✨ click me"
>Dingyue (Kite) Liu</span>
```

- [ ] **Step 4: Build**

Run: `npm run build` — Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/KiteEggs.astro src/layouts/BaseLayout.astro src/pages/index.astro
git commit -m "feat: hero kite launch, Konami kite flock, console greeting"
```

---

### Task 7: Playful 404 page

**Files:**
- Create: `src/pages/404.astro`

**Interfaces:**
- Consumes: `BaseLayout`, palette vars, `kite-bob` keyframes.

- [ ] **Step 1: Create `src/pages/404.astro`** (full code)

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Page not found - Dingyue (Kite) Liu" description="This page flew away.">
  <div class="container mx-auto px-4 py-16 text-center">
    <p class="text-sm font-medium tracking-widest text-gray-500 dark:text-gray-400 uppercase mb-2">404</p>
    <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
      Looks like this page flew away.
    </h1>
    <p class="text-lg text-gray-600 dark:text-gray-400 mb-2 max-w-xl mx-auto">
      The page you're looking for drifted off with the wind. You can play with the kite while you're here — grab it!
    </p>

    <div id="kite-scene" class="relative mx-auto max-w-2xl h-[45vh] min-h-[300px] select-none touch-none">
      <svg id="scene-string-svg" class="absolute inset-0 w-full h-full" aria-hidden="true">
        <path id="scene-string" fill="none" stroke="rgb(var(--color-secondary) / 0.5)" stroke-width="1.5"></path>
      </svg>
      <div id="scene-kite" class="absolute cursor-grab active:cursor-grabbing" style="left: 0; top: 0;">
        <svg width="90" height="118" viewBox="0 0 40 54" fill="none" aria-hidden="true">
          <path d="M20 2 L36 20 L20 40 L4 20 Z" fill="rgb(var(--color-primary))" />
          <path d="M20 2 L20 40 M4 20 L36 20" stroke="rgba(255,255,255,0.5)" stroke-width="1" />
          <path d="M20 40 C 15 45, 26 47, 21 53" stroke="rgb(var(--color-coral))" stroke-width="1.6" fill="none" stroke-linecap="round" />
          <path d="M15 43.5 l5.5 2.5 M25.5 48.5 l-5.5 2" stroke="rgb(var(--color-coral))" stroke-width="1.6" stroke-linecap="round" />
        </svg>
      </div>
    </div>

    <a
      href="/"
      class="inline-block mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
    >
      Take me home
    </a>
  </div>
</BaseLayout>

<script>
  const scene = document.getElementById('kite-scene');
  const kite = document.getElementById('scene-kite');
  const string = document.getElementById('scene-string');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const KW = 90, KH = 118;
  let w = scene.clientWidth, h = scene.clientHeight;
  let restX = w / 2, restY = h * 0.3;
  let px = restX, py = restY, vx = 0, vy = 0;
  let dragging = false, t = 0;

  function anchor() {
    return { x: w / 2, y: h - 6 };
  }

  function layout() {
    w = scene.clientWidth;
    h = scene.clientHeight;
    restX = w / 2;
    restY = h * 0.3;
  }
  window.addEventListener('resize', layout);

  function render() {
    kite.style.transform = `translate(${px - KW / 2}px, ${py - KH / 2}px) rotate(${Math.max(-20, Math.min(20, vx * 2))}deg)`;
    const a = anchor();
    const bx = px, by = py + KH * 0.32;
    const sag = dragging ? 14 : Math.max(14, 70 - Math.hypot(bx - a.x, by - a.y) * 0.15);
    string.setAttribute('d', `M ${a.x} ${a.y} Q ${(a.x + bx) / 2 + 18} ${(a.y + by) / 2 + sag}, ${bx} ${by}`);
  }

  function tick() {
    t += 0.016;
    if (!dragging) {
      const swayX = reduce ? 0 : Math.sin(t * 0.9) * 26;
      const swayY = reduce ? 0 : Math.cos(t * 1.3) * 10;
      vx += (restX + swayX - px) * 0.02;
      vy += (restY + swayY - py) * 0.02;
      vx *= 0.94;
      vy *= 0.94;
      px += vx;
      py += vy;
    }
    render();
    requestAnimationFrame(tick);
  }

  function clientPos(e) {
    const r = scene.getBoundingClientRect();
    return {
      x: Math.max(KW / 2, Math.min(w - KW / 2, e.clientX - r.left)),
      y: Math.max(KH / 2, Math.min(h - KH / 2, e.clientY - r.top)),
    };
  }

  kite.addEventListener('pointerdown', (e) => {
    dragging = true;
    kite.setPointerCapture(e.pointerId);
    vx = vy = 0;
  });
  kite.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const p = clientPos(e);
    vx = p.x - px;
    vy = p.y - py;
    px = p.x;
    py = p.y;
  });
  kite.addEventListener('pointerup', () => { dragging = false; });
  kite.addEventListener('pointercancel', () => { dragging = false; });

  layout();
  render();
  requestAnimationFrame(tick);
</script>
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: no errors; `dist/404.html` exists.

- [ ] **Step 3: Commit**

```bash
git add src/pages/404.astro
git commit -m "feat: playful 404 with draggable kite"
```

---

### Task 8: Verification matrix + review

**Files:** none (verification only; fixes as needed)

- [ ] **Step 1:** `npm run build` clean.
- [ ] **Step 2:** Start `npm run dev`; in the browser verify each page (/, /research, /projects, /fun, /404-test-nonexistent) in light and dark, desktop and mobile emulation. Screenshot each.
- [ ] **Step 3:** Exercise interactions: companion follows cursor and dismisses/re-enables via footer; hero name launches kite (repeat ≥8× to see confetti); Konami flock; 404 drag; card tilt; scroll reveals.
- [ ] **Step 4:** Emulate `prefers-reduced-motion: reduce`: companion absent, clouds static, reveals inert, content visible.
- [ ] **Step 5:** Multi-lens review pass (correctness, a11y, perf, dark-mode) on the full diff; fix findings.
- [ ] **Step 6:** Final commit of any fixes.
