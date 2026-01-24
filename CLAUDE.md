# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev      # Start development server at http://localhost:3000
pnpm build    # Production build
pnpm lint     # Run ESLint
pnpm start    # Start production server
```

## Environment Setup

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to the site's public URL (used for RSS feed generation).

## Architecture

Personal website/blog built with Next.js 15 and the Tailwind Plus "Spotlight" template.

### Key Technologies
- **Next.js 15** with App Router (`src/app/`)
- **React 19** with Server and Client Components
- **TypeScript** with strict mode
- **MDX 3** for blog articles with remark-gfm, remark-math/rehype-katex (math), and rehype-prism (syntax highlighting)
- **Tailwind CSS v4** with typography plugin; Prettier uses tailwindcss plugin for class sorting
- **D3.js** for data visualizations in some articles

### Project Structure

- `src/app/` - Next.js App Router pages and layouts
  - `articles/` - Blog articles, each in `{slug}/page.mdx`
  - `about/`, `cv/`, `projects/`, `infographics/` - Static pages
  - `feed.xml/route.ts` - RSS feed route handler
- `src/components/` - Reusable React components
- `src/lib/` - Utility functions (date formatting, article loading via fast-glob)
- `src/styles/` - Global CSS (Tailwind and Prism themes)

### Article Format

Articles are MDX files in `src/app/articles/{slug}/page.mdx`. Each exports an `article` object:

```tsx
import { ArticleLayout } from '@/components/ArticleLayout'

export const article = {
  author: 'John Walley',
  date: 'YYYY-MM-DD',
  title: 'Article Title',
  description: 'Article description',
}

export const metadata = {
  title: article.title,
  description: article.description,
}

export default (props) => <ArticleLayout article={article} {...props} />

// MDX content here
```

Articles can include co-located images and custom React components. D3-based visualization components require the `'use client'` directive.

### Client Components

Components using browser APIs, D3, or React hooks like `useEffect` must include `'use client'` directive at the top.

### Path Aliases

Uses `@/` alias pointing to `src/` directory.
