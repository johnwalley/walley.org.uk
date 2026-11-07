import portraitImage from '@/images/portrait.jpg'
import { siteUrl } from '@/lib/siteUrl'

// Canonical Person entity, embedded on the homepage and as the mainEntity of
// the /about ProfilePage. Shared so the two can't drift apart.
export const personJsonLd = {
  '@type': 'Person',
  '@id': `${siteUrl}/#person`,
  name: 'John Walley',
  givenName: 'John',
  familyName: 'Walley',
  image: new URL(portraitImage.src, siteUrl).href,
  jobTitle: 'Senior Software Engineer',
  url: siteUrl,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Cambridge',
    addressCountry: 'GB',
  },
  worksFor: {
    '@type': 'Organization',
    name: 'Cambridge Intelligence',
    url: 'https://cambridge-intelligence.com/',
  },
  alumniOf: [
    {
      '@type': 'CollegeOrUniversity',
      name: 'University of Cambridge',
      url: 'https://www.cam.ac.uk/',
    },
    {
      '@type': 'CollegeOrUniversity',
      name: 'University of Oxford',
      url: 'https://www.ox.ac.uk/',
    },
  ],
  knowsAbout: [
    'Data visualisation',
    'TypeScript',
    'React',
    'D3.js',
    'Frontend architecture',
    'Developer tools',
  ],
  sameAs: [
    'https://github.com/johnwalley',
    'https://www.linkedin.com/in/johnwalley',
    'https://www.npmjs.com/~johnwalley',
    'https://www.youtube.com/@johnwalley',
    'https://www.youtube.com/channel/UCC3Xz6EXWE4jLIUVikQOvcw',
  ],
}
