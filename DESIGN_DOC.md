# Personal Website Architecture & Implementation Design Doc

**Version:** 0.1.0  
**Status:** Draft  
**Last Updated:** 2026-01-28

---

## Problem Statement

The current Google Sites-hosted personal website lacks flexibility for custom interactivity,
direct data visualization embedding, and project showcase capabilities. A GitHub Pages-hosted
solution will enable full frontend control, version-controlled content, and seamless integration
of interactive data analysis notebooks and media elements.

---

## Definition of Done

| # | Criterion | Test |
|---|-----------|------|
| 1 | Site deploys to `https://<username>.github.io` on push to `main` | GitHub Actions workflow succeeds; URL returns 200 |
| 2 | Lighthouse Performance score ≥ 90 on mobile | Run `lighthouse` CLI against production URL |
| 3 | All navigation links resolve without 404 | Automated link-checker passes |
| 4 | Interactive project cards display embedded visualizations | Manual verification; charts render without console errors |
| 5 | Video hover-to-play works on desktop browsers | Hover triggers `play()`; mouse-out triggers `pause()` |
| 6 | Site is responsive (mobile, tablet, desktop) | Visual regression tests at 375px, 768px, 1440px widths |
| 7 | Contact form or mailto link functional | Submit test message; verify receipt |
| 8 | Dark/light theme toggle persists across sessions | Toggle, refresh, verify `localStorage` |

---

## High-level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          GitHub Repository                              │
│  ┌──────────────┐   push    ┌──────────────────┐   deploy   ┌────────┐ │
│  │ Source Code  │ ───────▶  │ GitHub Actions   │ ─────────▶ │ Pages  │ │
│  │ (Astro/React)│           │ (Build & Deploy) │            │ CDN    │ │
│  └──────────────┘           └──────────────────┘            └────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                       │
                              serves static assets
                                       ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                             Browser Client                              │
│  ┌────────────┐  ┌───────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Landing    │  │ Projects      │  │ Blog/Notes   │  │ About/Contact│ │
│  │ (Hero +    │  │ (Cards +      │  │ (MDX render) │  │ (Bio + Form) │ │
│  │ Animation) │  │ Embeds)       │  │              │  │              │ │
│  └────────────┘  └───────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

**Main Modules**

| Module | Responsibility |
|--------|----------------|
| `pages/` | Route definitions; static page shells |
| `components/` | Reusable UI atoms (Button, Card, VideoPlayer, Chart) |
| `content/` | Markdown/MDX posts, project metadata YAML/JSON |
| `layouts/` | Page templates (BaseLayout, BlogLayout) |
| `lib/` | Utilities: theme toggle, analytics helper, data loaders |
| `public/` | Static assets: images, videos, fonts |
| `styles/` | Global CSS / Tailwind config |

**External Services**

- **GitHub Pages** – static hosting & CDN  
- **GitHub Actions** – CI/CD pipeline  
- **Observable / Jupyter (optional)** – embedded notebook iframes  
- **Formspree or Netlify Forms** – serverless contact form backend (optional)

---

## Directory / File Skeleton

```
personal-website/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── public/
│   ├── images/
│   ├── videos/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── ProjectCard.astro
│   │   ├── VideoPlayer.tsx
│   │   ├── ChartEmbed.tsx
│   │   └── ThemeToggle.tsx
│   ├── content/
│   │   ├── projects/
│   │   │   └── project-1.md
│   │   └── blog/
│   │       └── hello-world.mdx
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── BlogLayout.astro
│   ├── lib/
│   │   ├── theme.ts
│   │   └── utils.ts
│   ├── pages/
│   │   ├── index.astro
│   │   ├── projects.astro
│   │   ├── blog/
│   │   │   └── [...slug].astro
│   │   └── about.astro
│   └── styles/
│       └── global.css
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
├── AGENT_README.md
└── README.md
```

---

## Detailed Implementation Plan

> **Pre-condition:** All Definition-of-Done criteria are unambiguous.

### Phase 0 – Scaffolding & CI/CD

1. Initialize repo with `npm create astro@latest` (template: minimal + Tailwind + React).
2. Configure `astro.config.mjs` with `output: 'static'` and `site: 'https://<user>.github.io'`.
3. Add `.github/workflows/deploy.yml` using `withastro/action@v3`.
4. Push to `main`; verify Pages deployment URL returns placeholder page.

### Phase 1 – Core Pages & Navigation

5. Implement `BaseLayout.astro` with `<Header>`, `<main slot />`, `<Footer>`.
6. Build responsive `Header` with nav links: Home, Projects, Blog, About.
7. Create `index.astro` hero section with animated headline (CSS keyframes).
8. Add `ThemeToggle.tsx` (React island); persist choice to `localStorage`.
9. Style with Tailwind; define CSS variables for theme colors.

### Phase 2 – Projects Showcase

10. Define content collection schema in `src/content/config.ts` for `projects`.
11. Populate 2–3 sample project markdown files with frontmatter (title, tags, embed URL).
12. Build `projects.astro` listing page with filterable `ProjectCard` grid.
13. Implement `ChartEmbed.tsx` for Observable/iframe embeds; lazy-load.
14. Implement `VideoPlayer.tsx` with hover-to-play using `onMouseEnter/Leave`.

### Phase 3 – Blog / Notes

15. Configure MDX integration (`@astrojs/mdx`).
16. Create dynamic route `blog/[...slug].astro` rendering MDX content.
17. Add syntax highlighting via Shiki (built-in).
18. Build blog index with date-sorted post list.

### Phase 4 – About & Contact

19. Write `about.astro` with bio, skills list, and social links.
20. Integrate contact form via Formspree `<form action>` or simple `mailto:` link.
21. Add reCAPTCHA or honeypot if using form backend.

### Phase 5 – Polish & Performance

22. Optimize images with `astro:assets` (auto WebP, lazy load).
23. Compress videos; add `poster` frames.
24. Run Lighthouse; fix any score < 90 issues.
25. Add `sitemap.xml` and `robots.txt` via Astro integrations.
26. Write `README.md` with local dev instructions.

### Phase 6 – QA & Launch

27. Run automated link checker (`lychee` or `broken-link-checker`).
28. Perform cross-browser smoke tests (Chrome, Firefox, Safari).
29. Merge final PR; confirm production deploy.
30. Announce launch; update `AGENT_README.md` with Phase 0 ✅.

---

## Agent README Bootstrap

See `AGENT_README.md` in repository root.

---

## Risks & Mitigations

| # | Risk | Impact | Mitigation |
|---|------|--------|------------|
| 1 | **Large video files bloat repo** | Slow clones; GitHub LFS limits | Host videos externally (YouTube unlisted, Cloudflare R2) or use compressed MP4 < 5 MB |
| 2 | **Embedded notebooks break on API changes** | Broken project demos | Pin Observable embed versions; add fallback screenshot + link |
| 3 | **Lighthouse score regression** | Fails DoD #2 | Add CI Lighthouse check; block merge if < 90 |
| 4 | **Theme flicker on page load** | Poor UX | Inline blocking `<script>` to set `data-theme` before paint |
| 5 | **GitHub Pages 404 on client routes** | SPA navigation fails | Use static output mode; avoid client-side routing or add 404.html redirect hack |

---

## Reference Links / Prior Art

- [Astro Docs – GitHub Pages Deploy](https://docs.astro.build/en/guides/deploy/github/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Observable Embed API](https://observablehq.com/@observablehq/embeds)
- [Formspree](https://formspree.io/docs)
- [Lighthouse CI Action](https://github.com/treosh/lighthouse-ci-action)

---

## Milestone Roadmap

| Phase | Scope | Success Tests | Deferred Nice-to-Haves | Status |
|-------|-------|---------------|------------------------|--------|
| **0 – MVP Scaffold** | Repo + CI/CD + placeholder deploy | Deploy URL returns 200 | — | ⬜ |
| **1 – Core Pages** | Layout, nav, hero, theme toggle | All nav links work; theme persists | Advanced animations | ⬜ |
| **2 – Projects** | Project cards, chart embeds, video hover | Embeds render; video plays on hover | Filtering by tag | ⬜ |
| **3 – Blog** | MDX posts, syntax highlight, index | Posts render; code highlighted | RSS feed | ⬜ |
| **4 – About/Contact** | Bio page, contact form | Form submits successfully | Testimonials section | ⬜ |
| **5 – Polish** | Perf optimization, SEO, accessibility | Lighthouse ≥ 90; no a11y errors | Analytics integration | ⬜ |
| **6 – Launch** | QA, cross-browser, go-live | Link checker passes; announce | Custom domain | ⬜ |

---

## Change-log / Version History

- **v0.1.0** (2026-01-28) – Initial design doc created; Phase 0 defined.
