// Normalised via URL so a malformed env value (e.g. "https:/host" or a
// trailing slash) can't leak into the sitemap, robots.txt, feed or JSON-LD.
export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.walley.org.uk',
).origin
