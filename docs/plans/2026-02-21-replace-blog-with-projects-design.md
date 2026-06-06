# Replace Blog with Projects Tab

## Summary

Remove the Blog tab (which has no content) and replace it with a Projects tab that showcases interactive/external work with link cards.

## Changes

### 1. Header.astro — Update navigation

Replace `{ name: 'Blog', href: '/blog' }` with `{ name: 'Projects', href: '/projects' }`.

Nav order: Home, Research, Projects, About, Fun.

### 2. New file: `src/pages/projects.astro`

- Page header with title "Projects" and subtitle
- Hardcoded array of project objects with fields: `title`, `description`, `url`, `tags[]`
- Rendered as link cards (consistent with site's clean, minimal style)
- Seed data:
  - **DeFi Workshop** — https://ucsbdefi.wixsite.com/seminar — tags: DeFi, Education
  - Placeholder for Uber/Lyft FHVHV tips project (Coming Soon)
- Dark mode support via existing Tailwind classes

### 3. Delete blog files

- `src/pages/blog/index.astro`
- `src/pages/blog/[...slug].astro`
- `src/layouts/BlogLayout.astro`
- Remove `blog` collection from `src/content/config.ts`

### What stays the same

- All other pages (Home, Research, About, Fun) unchanged
- BaseLayout, styling, dark mode reused as-is

## Approach

Static hardcoded — projects defined as a simple array in the page file. Lightweight, easy to add/edit. Can migrate to a content collection later if needed.
