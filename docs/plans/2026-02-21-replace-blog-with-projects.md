# Replace Blog with Projects Tab — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove the empty Blog tab and replace it with a Projects page that showcases external/interactive work as link cards.

**Architecture:** Static hardcoded project data in a single Astro page file. Each project is an object with title, description, url, and tags. Rendered as clean link cards matching the site's existing style.

**Tech Stack:** Astro, Tailwind CSS (v4, class-based dark mode)

---

### Task 1: Update navigation — replace Blog with Projects

**Files:**
- Modify: `src/components/Header.astro:4-10`

**Step 1: Edit the navItems array**

In `src/components/Header.astro`, change line 7 from:

```js
  { name: 'Blog', href: '/blog' },
```

to:

```js
  { name: 'Projects', href: '/projects' },
```

**Step 2: Verify the nav renders**

Run: `npm run dev`

Open `http://localhost:4321` — confirm "Projects" appears in nav where "Blog" was. Clicking it will 404 (expected — page doesn't exist yet).

**Step 3: Commit**

```bash
git add src/components/Header.astro
git commit -m "feat: replace Blog nav link with Projects"
```

---

### Task 2: Create the Projects page

**Files:**
- Create: `src/pages/projects.astro`

**Step 1: Create the projects page**

Create `src/pages/projects.astro` with this content:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';

const projects = [
  {
    title: 'DeFi Workshop',
    description: 'A seminar series exploring decentralized finance concepts, protocols, and research. Co-organized at UC Santa Barbara to bridge academic research with DeFi practitioners.',
    url: 'https://ucsbdefi.wixsite.com/seminar',
    tags: ['DeFi', 'Education'],
  },
  {
    title: 'NYC Rideshare Tipping Patterns',
    description: 'Analyzing tipping behavior across Uber and Lyft rides using the NYC FHVHV TLC dataset. Exploring how trip distance, time of day, and pickup location affect driver tips.',
    url: null,
    tags: ['Data Science', 'Transportation'],
  },
];
---

<BaseLayout
  title="Projects - Dingyue (Kite) Liu"
  description="Interactive projects and tools in DeFi, data science, and economics."
>
  <div class="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
    <header class="mb-12">
      <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
        Projects
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400">
        Interactive tools, data explorations, and workshops I've built or co-organized.
      </p>
    </header>

    <div class="grid gap-6">
      {projects.map((project) => (
        <article class="group border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
          {project.url ? (
            <a href={project.url} target="_blank" rel="noopener noreferrer" class="block">
              <div class="flex items-start justify-between mb-2">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h2>
                <svg class="w-5 h-5 text-gray-400 dark:text-gray-500 mt-1 flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
              <p class="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                {project.description}
              </p>
              <div class="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span class="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ) : (
            <div>
              <div class="flex items-start justify-between mb-2">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                  {project.title}
                </h2>
                <span class="text-xs font-medium px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full flex-shrink-0 ml-4">
                  Coming Soon
                </span>
              </div>
              <p class="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                {project.description}
              </p>
              <div class="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span class="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      ))}
    </div>
  </div>
</BaseLayout>
```

**Step 2: Verify the page renders**

Run: `npm run dev`

Open `http://localhost:4321/projects` — confirm:
- "Projects" heading and subtitle visible
- DeFi Workshop card with external link icon
- NYC Rideshare card with "Coming Soon" badge
- Tags render on both cards
- Dark mode works (toggle theme)

**Step 3: Commit**

```bash
git add src/pages/projects.astro
git commit -m "feat: add Projects page with DeFi Workshop and placeholder"
```

---

### Task 3: Delete blog files and clean up config

**Files:**
- Delete: `src/pages/blog/index.astro`
- Delete: `src/pages/blog/[...slug].astro`
- Delete: `src/layouts/BlogLayout.astro`
- Modify: `src/content/config.ts:21-32,48`

**Step 1: Delete blog page files and layout**

```bash
rm src/pages/blog/index.astro
rm src/pages/blog/\[...slug\].astro
rmdir src/pages/blog
rm src/layouts/BlogLayout.astro
```

**Step 2: Remove blog collection from config.ts**

In `src/content/config.ts`, remove the blog collection definition (lines 21-32) and remove `blog` from the exports (line 48).

The file should become:

```ts
import { defineCollection, z } from 'astro:content';

const research = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    authors: z.array(z.object({
      name: z.string(),
      url: z.string().optional(),
    })).default([]),
    venue: z.string().optional(),
    pdfUrl: z.string().optional(),
    hook: z.string().optional(),
    status: z.enum(['Published', 'Working Paper', 'Whitepaper']),
    sortOrder: z.number(),
  }),
});

const concerts = defineCollection({
  type: 'content',
  schema: z.object({
    artist: z.string(),
    venue: z.string(),
    date: z.coerce.date(),
    location: z.string(),
    posterUrl: z.string(),
    videoUrl: z.string(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
  }),
});

export const collections = { research, concerts };
```

**Step 3: Verify the build**

Run: `npm run build`

Expected: Build succeeds with no errors. No references to blog remain.

**Step 4: Commit**

```bash
git add -A
git commit -m "refactor: remove blog collection, pages, and layout"
```

---

### Task 4: Final verification

**Step 1: Full dev check**

Run: `npm run dev`

Verify:
- Nav shows: Home, Research, Projects, About, Fun
- `/projects` page loads with both project cards
- DeFi Workshop card links to `https://ucsbdefi.wixsite.com/seminar` in new tab
- NYC Rideshare card shows "Coming Soon" badge, no link
- `/blog` returns 404 (expected)
- All other pages (Home, Research, About, Fun) still work
- Dark mode toggle works on Projects page

**Step 2: Production build check**

Run: `npm run build && npm run preview`

Verify the production build serves correctly.
