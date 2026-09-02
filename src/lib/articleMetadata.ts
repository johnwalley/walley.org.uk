import { type Metadata } from 'next'

interface Article {
  title: string
  description: string
  author: string
  date: string
}

export function createArticleMetadata(
  article: Article,
  slug: string,
): Metadata {
  const path = `/articles/${slug}`
  const ogImage = `/og?title=${encodeURIComponent(article.title)}`

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: 'article',
      locale: 'en_GB',
      siteName: 'John Walley',
      title: article.title,
      description: article.description,
      url: path,
      publishedTime: article.date,
      authors: [article.author],
      images: [{ url: ogImage, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      creator: '@johnmwalley',
      images: [ogImage],
    },
  }
}
