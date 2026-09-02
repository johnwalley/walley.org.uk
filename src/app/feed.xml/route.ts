import * as cheerio from 'cheerio'
import { Feed } from 'feed'

import { getAllArticles } from '@/lib/articles'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.walley.org.uk'

// Rewrite root-relative URLs so images and links still resolve in feed readers,
// which render the content on a different origin.
function absolutiseUrls(html: string) {
  let $ = cheerio.load(html, null, false)

  $('[src], [href]').each((_, element) => {
    for (let attribute of ['src', 'href']) {
      let value = $(element).attr(attribute)
      if (value?.startsWith('/')) {
        $(element).attr(attribute, `${siteUrl}${value}`)
      }
    }
  })

  // srcset holds a comma-separated list of candidates, each "url descriptor".
  $('[srcset]').each((_, element) => {
    let srcset = $(element).attr('srcset')
    if (!srcset) return

    $(element).attr(
      'srcset',
      srcset
        .split(',')
        .map((candidate) => {
          let trimmed = candidate.trim()
          return trimmed.startsWith('/') ? `${siteUrl}${trimmed}` : trimmed
        })
        .join(', '),
    )
  })

  return $.html()
}

export async function GET(req: Request) {
  let author = {
    name: 'John Walley',
    email: 'john@walley.org.uk',
  }

  let feed = new Feed({
    title: author.name,
    description:
      'Software engineer, data visualisation specialist, and amateur coxswain.',
    author,
    id: siteUrl,
    link: siteUrl,
    image: `${siteUrl}/favicon.ico`,
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}`,
    feedLinks: {
      rss2: `${siteUrl}/feed.xml`,
    },
  })

  let articles = await getAllArticles()

  // Article bodies only exist as rendered HTML, so fetch each page. Titles and
  // dates come from the article exports rather than the markup.
  let contents = await Promise.all(
    articles.map(async (article) => {
      try {
        let response = await fetch(
          String(new URL(`/articles/${article.slug}`, req.url)),
        )
        if (!response.ok) return null

        let $ = cheerio.load(await response.text())
        let content = $('article').find('[data-mdx-content]').first().html()

        return content ? absolutiseUrls(content) : null
      } catch {
        return null
      }
    }),
  )

  articles.forEach((article, index) => {
    let publicUrl = `${siteUrl}/articles/${article.slug}`

    feed.addItem({
      title: article.title,
      id: publicUrl,
      link: publicUrl,
      description: article.description,
      // Fall back to the description so an item is never empty if a page fails
      // to fetch or the layout markup changes.
      content: contents[index] ?? article.description,
      author: [author],
      contributor: [author],
      date: new Date(article.date),
    })
  })

  return new Response(feed.rss2(), {
    status: 200,
    headers: {
      'content-type': 'application/xml',
      'cache-control': 's-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
