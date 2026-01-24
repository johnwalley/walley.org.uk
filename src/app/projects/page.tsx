import Image from 'next/image'

import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'
import logoAllotment from '@/images/logos/allotment.svg'
import logoPennant from '@/images/logos/pennant.svg'
import logoPubMap from '@/images/logos/pubmap.png'
import logoCambridgeBumps from '@/images/logos/cambridgebumps.svg'
import logoChangingPlaces from '@/images/logos/changing-places.svg'
import logoWallE from '@/images/logos/wall-e.png'

const projects = [
  {
    name: 'Allotment',
    description:
      'A VSCode-inspired React component for creating resizable split views. Built on the same codebase as VSCode with support for dynamic panes. 1.2k+ GitHub stars.',
    link: {
      href: 'https://allotment.mulberryhousesoftware.com/',
      label: 'Allotment',
    },
    logo: logoAllotment,
  },
  {
    name: 'Pennant',
    description:
      'High-performance React charting library for financial data. Built on Canvas API for 60fps rendering with technical indicators like Bollinger Bands, EMA, and MACD.',
    link: { href: 'https://pennant.vega.xyz/', label: 'Pennant' },
    logo: logoPennant,
  },
  {
    name: 'Cambridge Pub Map',
    description:
      'An interactive map of Cambridge pubs styled after the iconic London Underground map. A fun way to explore the city\'s pub scene.',
    link: { href: 'https://www.pubmap.co.uk/', label: 'pubmap.co.uk' },
    logo: logoPubMap,
  },
  {
    name: 'Cambridge Bumps',
    description:
      'Interactive charts and historical results for Cambridge University rowing races. Explore over 200 years of bumps racing data with visualisations and statistics.',
    link: {
      href: 'https://www.cambridgebumps.com/',
      label: 'cambridgebumps.com',
    },
    logo: logoCambridgeBumps,
  },
  {
    name: 'Changing Places International Map',
    description:
      'Interactive map helping people find Changing Places toilets worldwide. These fully accessible facilities enable people with complex disabilities to participate in everyday life.',
    link: {
      href: 'https://app.changingplacesinternational.org/',
      label: 'app.changingplacesinternational.org',
    },
    logo: logoChangingPlaces,
  },
  {
    name: "Where's Wall-E?",
    description:
      'A travel photo album documenting Wall-E\'s adventures around the world. A fun personal project capturing memorable moments from different destinations.',
    link: {
      href: 'https://photos.app.goo.gl/ygstkZKUJw7rYdzAA',
      label: 'Google Photos album',
    },
    logo: logoWallE,
  },
]

function LinkIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M15.712 11.823a.75.75 0 1 0 1.06 1.06l-1.06-1.06Zm-4.95 1.768a.75.75 0 0 0 1.06-1.06l-1.06 1.06Zm-2.475-1.414a.75.75 0 1 0-1.06-1.06l1.06 1.06Zm4.95-1.768a.75.75 0 1 0-1.06 1.06l1.06-1.06Zm3.359.53-.884.884 1.06 1.06.885-.883-1.061-1.06Zm-4.95-2.12 1.414-1.415L12 6.344l-1.415 1.413 1.061 1.061Zm0 3.535a2.5 2.5 0 0 1 0-3.536l-1.06-1.06a4 4 0 0 0 0 5.656l1.06-1.06Zm4.95-4.95a2.5 2.5 0 0 1 0 3.535L17.656 12a4 4 0 0 0 0-5.657l-1.06 1.06Zm1.06-1.06a4 4 0 0 0-5.656 0l1.06 1.06a2.5 2.5 0 0 1 3.536 0l1.06-1.06Zm-7.07 7.07.176.177 1.06-1.06-.176-.177-1.06 1.06Zm-3.183-.353.884-.884-1.06-1.06-.884.883 1.06 1.06Zm4.95 2.121-1.414 1.414 1.06 1.06 1.415-1.413-1.06-1.061Zm0-3.536a2.5 2.5 0 0 1 0 3.536l1.06 1.06a4 4 0 0 0 0-5.656l-1.06 1.06Zm-4.95 4.95a2.5 2.5 0 0 1 0-3.535L6.344 12a4 4 0 0 0 0 5.656l1.06-1.06Zm-1.06 1.06a4 4 0 0 0 5.657 0l-1.061-1.06a2.5 2.5 0 0 1-3.535 0l-1.061 1.06Zm7.07-7.07-.176-.177-1.06 1.06.176.178 1.06-1.061Z"
        fill="currentColor"
      />
    </svg>
  )
}

export const metadata = {
  title: 'Projects',
  description: 'Open-source libraries, data visualisations, and side projects.',
}

export default function Projects() {
  return (
    <SimpleLayout
      title="Projects and open-source work"
      intro="I enjoy building tools that help developers and creating data visualisations that make information more accessible. From React component libraries to interactive maps and charts, these are the projects I'm most proud of."
    >
      <ul
        role="list"
        className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((project) => (
          <Card as="li" key={project.name}>
            <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
              <Image
                src={project.logo}
                alt=""
                className="h-8 w-8"
                unoptimized
              />
            </div>
            <h2 className="mt-6 text-base font-semibold text-zinc-800 dark:text-zinc-100">
              <Card.Link href={project.link.href}>{project.name}</Card.Link>
            </h2>
            <Card.Description>{project.description}</Card.Description>
            <p className="relative z-10 mt-6 flex text-sm font-medium text-zinc-400 transition group-hover:text-teal-500 dark:text-zinc-200">
              <LinkIcon className="h-6 w-6 flex-none" />
              <span className="ml-2">{project.link.label}</span>
            </p>
          </Card>
        ))}
      </ul>
    </SimpleLayout>
  )
}
