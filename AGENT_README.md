# AGENT_README.md

## Current State

- **Phase:** 0 – Not Started  
- **Last Agent:** (none)  
- **Blocking Issues:** None  

## Quick Start

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs to dist/
```

## Next-Agent Hints

1. Start with scaffolding (Step 1-4). Verify deploy before proceeding.
2. Tailwind is pre-configured; extend `tailwind.config.mjs` for custom colors.
3. Use Astro content collections for projects/blog—schema enforces frontmatter.
4. React components (`.tsx`) are "islands"; hydrate with `client:visible`.
5. Keep bundle < 150 KB JS for performance budget.

## Open Questions

- Confirm GitHub username for `site` config.
- Decide on contact form provider (Formspree vs mailto).

## File Checklist

| File | Status |
|------|--------|
| `deploy.yml` | ⬜ |
| `BaseLayout.astro` | ⬜ |
| `ThemeToggle.tsx` | ⬜ |
| `ProjectCard.astro` | ⬜ |
| `VideoPlayer.tsx` | ⬜ |
