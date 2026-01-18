# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Production build
npm run lint     # Run ESLint
npm start        # Start production server
```

## Architecture

This is a personal website/blog built with Next.js 15 and the Tailwind Plus "Spotlight" template.

### Key Technologies
- **Next.js 15** with App Router (`src/app/`)
- **React 19** with Server and Client Components
- **TypeScript** with strict mode
- **MDX 3** for blog articles with math support (KaTeX) and syntax highlighting (Prism)
- **Tailwind CSS v4** with `@tailwindcss/postcss` and typography plugin
- **D3.js** for data visualizations in some articles

### Project Structure

- `src/app/` - Next.js App Router pages and layouts
  - `layout.tsx` - Root layout with metadata and providers
  - `page.tsx` - Homepage
  - `providers.tsx` - Theme provider (next-themes) and context
  - `articles/` - Blog articles, each in `{slug}/page.mdx`
  - `about/`, `cv/`, `projects/`, `infographics/` - Static pages
  - `feed.xml/route.ts` - RSS feed route handler
- `src/components/` - Reusable React components (`.tsx`)
- `src/lib/` - Utility functions (date formatting, article loading) (`.ts`)
- `src/images/` - Static images and logos
- `src/styles/` - Global CSS (Tailwind and Prism)
- `typography.ts` - Tailwind typography configuration
- `mdx-components.tsx` - MDX component overrides

### Article Format

Articles are MDX files in `src/app/articles/{slug}/page.mdx`. Each article exports an `article` object and uses `ArticleLayout`:

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

Articles can include images (co-located in the article folder) and custom React components for interactive visualizations. D3-based visualization components must include `'use client'` directive.

### Client Components

Components that use browser APIs, D3, or React hooks like `useEffect` must include `'use client'` directive at the top:
- `src/components/Header.tsx`
- `src/components/ArticleLayout.tsx`
- `src/app/providers.tsx`
- D3 visualization components in article folders (e.g., `viz.tsx`, `chart.tsx`)

### Path Aliases

Uses `@/` alias pointing to `src/` directory (configured in `tsconfig.json`).
