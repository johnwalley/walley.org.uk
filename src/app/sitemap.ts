import { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/siteUrl'

import { getAllArticles } from '@/lib/articles'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteUrl

  const articles = await getAllArticles()

  const articleUrls = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: new Date(article.dateModified ?? article.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // The article index only changes when an article is published or updated,
  // so it takes the newest article date.
  const latestArticleDate = new Date(
    Math.max(...articleUrls.map(({ lastModified }) => +lastModified)),
  )

  // The other pages have no reliable modification date, so they omit
  // lastModified. A build timestamp would claim every page changes on every
  // deploy, which makes search engines distrust the field.
  const staticPages = [
    {
      url: baseUrl,
      changeFrequency: 'monthly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cv`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: latestArticleDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/infographics`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ]

  return [...staticPages, ...articleUrls]
}
