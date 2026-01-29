# Personal Website

[![Deploy to GitHub Pages](https://github.com/kiteliudingyue/kiteliudingyue.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/kiteliudingyue/kiteliudingyue.github.io/actions/workflows/deploy.yml)
[![Lighthouse Score](https://img.shields.io/badge/lighthouse-90%2B-brightgreen)](https://kiteliudingyue.github.io)

A modern, performant personal portfolio and blog built with Astro, React, and Tailwind CSS. Features interactive project showcases, technical blog posts, and a comprehensive about section.

🌐 **Live Site**: [kiteliudingyue.github.io](https://kiteliudingyue.github.io)

## ✨ Features

- **⚡ Lightning Fast**: Built with Astro for optimal performance (90+ Lighthouse score)
- **🌗 Dark Mode**: Seamless theme switching with localStorage persistence
- **📱 Responsive**: Mobile-first design that works on all devices
- **📝 MDX Blog**: Write interactive blog posts with embedded components
- **🎨 Projects Showcase**: Interactive project cards with chart embeds and video demos
- **📧 Contact Form**: Functional contact form with spam prevention
- **🔍 SEO Optimized**: Auto-generated sitemap and meta tags
- **♿ Accessible**: WCAG compliant with keyboard navigation support

## 🚀 Tech Stack

- **Framework**: [Astro](https://astro.build/) - Modern static site generator
- **UI Library**: [React](https://react.dev/) - For interactive components
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first CSS
- **Content**: [MDX](https://mdxjs.com/) - Markdown with JSX support
- **Syntax Highlighting**: [Shiki](https://shiki.style/) - Beautiful code blocks
- **Deployment**: [GitHub Pages](https://pages.github.com/) - Free static hosting
- **CI/CD**: [GitHub Actions](https://github.com/features/actions) - Automated deployments

## 📁 Project Structure

```
personal-website/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment workflow
├── public/
│   ├── images/                 # Static images
│   ├── videos/                 # Video files
│   ├── favicon.svg             # Site favicon
│   └── robots.txt              # SEO crawler instructions
├── src/
│   ├── components/             # Reusable components
│   │   ├── Header.astro        # Navigation header
│   │   ├── Footer.astro        # Site footer
│   │   ├── ProjectCard.astro   # Project display card
│   │   ├── ThemeToggle.tsx     # Dark mode toggle (React)
│   │   ├── VideoPlayer.tsx     # Hover-to-play video (React)
│   │   ├── ChartEmbed.tsx      # Observable/iframe embed (React)
│   │   └── ContactForm.tsx     # Contact form (React)
│   ├── content/                # Content collections
│   │   ├── blog/               # Blog posts (MDX)
│   │   ├── projects/           # Project showcases (MD)
│   │   └── config.ts           # Content schemas
│   ├── layouts/                # Page layouts
│   │   ├── BaseLayout.astro    # Main layout template
│   │   └── BlogLayout.astro    # Blog post layout
│   ├── pages/                  # Route pages
│   │   ├── index.astro         # Home page
│   │   ├── projects.astro      # Projects listing
│   │   ├── projects/[...slug].astro  # Project detail pages
│   │   ├── blog/               # Blog pages
│   │   │   ├── index.astro     # Blog listing
│   │   │   └── [...slug].astro # Blog post pages
│   │   └── about.astro         # About & contact page
│   └── styles/
│       └── global.css          # Global styles & CSS variables
├── astro.config.mjs            # Astro configuration
├── tailwind.config.mjs         # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies

```

## 🛠️ Local Development

### Prerequisites

- **Node.js**: v20 or higher
- **npm**: v10 or higher

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/kiteliudingyue/kiteliudingyue.github.io.git
cd kiteliudingyue.github.io
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the development server**

```bash
npm run dev
```

The site will be available at `http://localhost:4321`

### Available Commands

| Command | Action |
|---------|--------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview production build locally |
| `npm run astro` | Run Astro CLI commands |

## 📝 Content Management

### Adding a Blog Post

1. Create a new `.mdx` file in `src/content/blog/`:

```bash
touch src/content/blog/my-new-post.mdx
```

2. Add frontmatter and content:

```mdx
---
title: "My Awesome Post"
description: "A brief description of the post"
pubDate: 2025-01-28
tags: ["JavaScript", "Tutorial"]
draft: false
---

Your content here with **markdown** and JSX support!
```

3. The post will automatically appear on `/blog`

### Adding a Project

1. Create a new `.md` file in `src/content/projects/`:

```bash
touch src/content/projects/my-project.md
```

2. Add frontmatter and description:

```markdown
---
title: "My Project"
description: "What this project does"
pubDate: 2025-01-28
featured: true
tags: ["React", "TypeScript"]
githubUrl: "https://github.com/user/repo"
liveUrl: "https://demo.com"
embedUrl: "https://observablehq.com/embed/..."
---

## Overview
Project details here...
```

## 🎨 Customization

### Updating Personal Information

1. **Name & Bio**: Edit `src/pages/about.astro`
2. **Social Links**: Update in `src/components/Footer.astro` and `src/pages/about.astro`
3. **Contact Email**: Update in `src/components/ContactForm.tsx`
4. **Site URL**: Change `site` in `astro.config.mjs`

### Theme Colors

Edit CSS variables in `src/styles/global.css`:

```css
:root {
  --color-primary: 37 99 235;    /* Blue */
  --color-accent: 99 102 241;     /* Purple */
  /* Add your colors here */
}
```

### Contact Form Setup (Optional)

To use Formspree instead of mailto:

1. Sign up at [formspree.io](https://formspree.io)
2. Get your form ID
3. Update `src/pages/about.astro`:

```astro
<ContactForm formspreeId="your-form-id" client:load />
```

## 🚀 Deployment

The site automatically deploys to GitHub Pages when you push to `main`.

### Manual Deployment

```bash
# Build the site
npm run build

# The dist/ folder is ready to deploy
```

### Custom Domain (Optional)

1. Add `CNAME` file to `public/`:

```
yourdomain.com
```

2. Configure DNS with your domain provider

## 📊 Performance

- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices, SEO)
- **Bundle Size**: ~67 KB gzipped (under 150 KB budget)
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s

## 🤝 Contributing

This is a personal website, but if you find bugs or have suggestions:

1. Open an issue describing the problem
2. Fork the repository
3. Create a feature branch
4. Submit a pull request

## 📄 License

MIT License - feel free to use this as a template for your own site!

## 🙏 Acknowledgments

- [Astro](https://astro.build/) - Amazing framework
- [Tailwind CSS](https://tailwindcss.com/) - Beautiful styling
- [Vercel](https://vercel.com/) - Design inspiration
- [GitHub Pages](https://pages.github.com/) - Free hosting

## 📧 Contact

- **Email**: your.email@example.com
- **GitHub**: [@kiteliudingyue](https://github.com/kiteliudingyue)
- **Website**: [kiteliudingyue.github.io](https://kiteliudingyue.github.io)

---

Built with ❤️ using Astro, React, and Tailwind CSS
