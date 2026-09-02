import { type Metadata } from 'next'

interface Article {
  title: string
  description: string
  author: string
  date: string
}

function ogImageUrl(title: string) {
  return `/og?title=${encodeURIComponent(title)}`
}

export function createPageMetadata({
  title,
  description,
  path,
  ogTitle = `${title} - John Walley`,
}: {
  title: string
  description: string
  path: string
  ogTitle?: string
}): Metadata {
  const ogImage = ogImageUrl(ogTitle)

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: 'website',
      locale: 'en_GB',
      siteName: 'John Walley',
      title: ogTitle,
      description,
      url: path,
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
      creator: '@johnmwalley',
      images: [ogImage],
    },
  }
}

export function createArticleMetadata(
  article: Article,
  slug: string,
): Metadata {
  const path = `/articles/${slug}`
  const ogImage = ogImageUrl(article.title)

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
