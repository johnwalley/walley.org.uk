import { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/siteUrl'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteUrl

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
