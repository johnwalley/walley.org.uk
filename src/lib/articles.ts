import glob from 'fast-glob'

interface Article {
  title: string
  description: string
  author: string
  date: string
  /** ISO date of the last substantive edit, if any. */
  dateModified?: string
}

export interface ArticleWithSlug extends Article {
  slug: string
}

async function importArticle(
  articleFilename: string,
): Promise<ArticleWithSlug> {
  let slug = articleFilename.replace(/(\/page)?\.mdx$/, '')

  // Keep the literal `/page.mdx` suffix: webpack bundles every file matching
  // this template, and a bare `${articleFilename}` would also pull in each
  // article's layout.tsx and its CSS (e.g. KaTeX) on every listing page.
  let { article } = (await import(`../app/articles/${slug}/page.mdx`)) as {
    default: React.ComponentType
    article: Article
  }

  return {
    slug,
    ...article,
  }
}

export async function getAllArticles() {
  let articleFilenames = await glob('*/page.mdx', {
    cwd: './src/app/articles',
  })

  let articles = await Promise.all(articleFilenames.map(importArticle))

  return articles.sort((a, z) => +new Date(z.date) - +new Date(a.date))
}
