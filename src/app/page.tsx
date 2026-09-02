import { type Metadata } from 'next'
import Image, { type ImageProps } from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Container } from '@/components/Container'
import {
  TwitterIcon,
  YouTubeIcon,
  GitHubIcon,
  LinkedInIcon,
} from '@/components/SocialIcons'
import image1 from '@/images/photos/image-1.jpg'
import image2 from '@/images/photos/image-2.jpg'
import image3 from '@/images/photos/image-3.jpg'
import image4 from '@/images/photos/image-4.jpg'
import image5 from '@/images/photos/image-5.jpg'
import logoRedgate from '@/images/logos/redgate.svg'
import logoMulberryHouseSoftware from '@/images/logos/mulberry-house-software.svg'
import logoCambridgeIntelligence from '@/images/logos/cambridge-intelligence.png'
import logoAllotment from '@/images/logos/allotment.svg'
import logoPennant from '@/images/logos/pennant.svg'
import logoCambridgeBumps from '@/images/logos/cambridgebumps.svg'
import { getAllArticles } from '@/lib/articles'
import { formatDate } from '@/lib/formatDate'
import { type ArticleWithSlug } from '@/lib/articles'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.walley.org.uk'

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
}

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'John Walley',
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
    'https://twitter.com/johnmwalley',
  ],
}

const selectedProjects = [
  {
    name: 'Allotment',
    description:
      'A VS Code-inspired React component for building resizable split views. 240k+ weekly npm downloads and 1.2k+ GitHub stars.',
    link: {
      href: 'https://allotment.mulberryhousesoftware.com/',
      label: 'Allotment',
    },
    logo: logoAllotment,
  },
  {
    name: 'Cambridge Bumps',
    description:
      'Interactive charts and historical results for Cambridge University rowing races. Explore over 200 years of bumps racing data.',
    link: {
      href: 'https://www.cambridgebumps.com/',
      label: 'cambridgebumps.com',
    },
    logo: logoCambridgeBumps,
  },
  {
    name: 'Pennant',
    description:
      'High-performance React charting library for financial data. Built on Canvas API for 60fps rendering with technical indicators.',
    link: { href: 'https://pennant.vega.xyz/', label: 'Pennant' },
    logo: logoPennant,
  },
]

const selectedArticleSlugs = [
  'web-workers',
  'typescript-monorepos',
  'programming-advice',
]

function BriefcaseIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M2.75 9.75a3 3 0 0 1 3-3h12.5a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H5.75a3 3 0 0 1-3-3v-8.5Z"
        className="fill-zinc-100 stroke-zinc-400 dark:fill-zinc-100/10 dark:stroke-zinc-500"
      />
      <path
        d="M3 14.25h6.249c.484 0 .952-.002 1.316.319l.777.682a.996.996 0 0 0 1.316 0l.777-.682c.364-.32.832-.319 1.316-.319H21M8.75 6.5V4.75a2 2 0 0 1 2-2h2.5a2 2 0 0 1 2 2V6.5"
        className="stroke-zinc-400 dark:stroke-zinc-500"
      />
    </svg>
  )
}

function ArrowDownIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4.75 8.75 8 12.25m0 0 3.25-3.5M8 12.25v-8.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

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

function Article({ article }: { article: ArticleWithSlug }) {
  return (
    <Card as="article">
      <Card.Title href={`/articles/${article.slug}`}>
        {article.title}
      </Card.Title>
      <Card.Eyebrow as="time" dateTime={article.date} decorate>
        {formatDate(article.date)}
      </Card.Eyebrow>
      <Card.Description>{article.description}</Card.Description>
      <Card.Cta>Read article</Card.Cta>
    </Card>
  )
}

function SocialLink({
  icon: Icon,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link> & {
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <Link className="group -m-1 p-1" {...props}>
      <Icon className="h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300" />
    </Link>
  )
}

function Project({
  project,
}: {
  project: (typeof selectedProjects)[number]
}) {
  return (
    <Card as="li">
      <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
        <Image src={project.logo} alt="" className="h-8 w-8" unoptimized />
      </div>
      <h3 className="mt-6 text-base font-semibold text-zinc-800 dark:text-zinc-100">
        <Card.Link href={project.link.href}>{project.name}</Card.Link>
      </h3>
      <Card.Description>{project.description}</Card.Description>
      <p className="relative z-10 mt-6 flex text-sm font-medium text-zinc-400 transition group-hover:text-teal-500 dark:text-zinc-200">
        <LinkIcon className="h-6 w-6 flex-none" />
        <span className="ml-2">{project.link.label}</span>
      </p>
    </Card>
  )
}

function SelectedWork() {
  return (
    <Container className="mt-24 md:mt-28">
      <div className="mx-auto max-w-xl lg:max-w-none">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
          Selected work
        </h2>
        <ul
          role="list"
          className="mt-10 grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
        >
          {selectedProjects.map((project) => (
            <Project key={project.name} project={project} />
          ))}
        </ul>
        <div className="mt-10">
          <Link
            href="/projects"
            className="text-sm font-medium text-teal-500 transition hover:text-teal-600 dark:hover:text-teal-400"
          >
            View all projects <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </Container>
  )
}

interface Role {
  company: string
  title: string
  logo: ImageProps['src']
  start: string | { label: string; dateTime: string }
  end: string | { label: string; dateTime: string }
}

function Role({ role }: { role: Role }) {
  let startLabel =
    typeof role.start === 'string' ? role.start : role.start.label
  let startDate =
    typeof role.start === 'string' ? role.start : role.start.dateTime

  let endLabel = typeof role.end === 'string' ? role.end : role.end.label
  let endDate = typeof role.end === 'string' ? role.end : role.end.dateTime

  return (
    <li className="flex gap-4">
      <div className="relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full shadow-md ring-1 shadow-zinc-800/5 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
        <Image src={role.logo} alt="" className="h-7 w-7" unoptimized />
      </div>
      <dl className="flex flex-auto flex-wrap gap-x-2">
        <dt className="sr-only">Company</dt>
        <dd className="w-full flex-none text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {role.company}
        </dd>
        <dt className="sr-only">Role</dt>
        <dd className="text-xs text-zinc-500 dark:text-zinc-400">
          {role.title}
        </dd>
        <dt className="sr-only">Date</dt>
        <dd
          className="ml-auto text-xs text-zinc-400 dark:text-zinc-500"
          aria-label={`${startLabel} until ${endLabel}`}
        >
          <time dateTime={startDate}>{startLabel}</time>{' '}
          <span aria-hidden="true">—</span>{' '}
          <time dateTime={endDate}>{endLabel}</time>
        </dd>
      </dl>
    </li>
  )
}

function Resume() {
  let resume: Role[] = [
    {
      company: 'Cambridge Intelligence',
      title: 'Senior Software Engineer',
      logo: logoCambridgeIntelligence,
      start: '2025',
      end: {
        label: 'Present',
        dateTime: new Date().getFullYear().toString(),
      },
    },
    {
      company: 'Mulberry House Software',
      title: 'Founder & Principal Engineer',
      logo: logoMulberryHouseSoftware,
      start: '2016',
      end: '2025',
    },
    {
      company: 'Redgate',
      title: 'Product Manager',
      logo: logoRedgate,
      start: '2014',
      end: '2016',
    },
  ]

  return (
    <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
      <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <BriefcaseIcon className="h-6 w-6 flex-none" />
        <span className="ml-3">Work</span>
      </h2>
      <ol className="mt-6 space-y-4">
        {resume.map((role, roleIndex) => (
          <Role key={roleIndex} role={role} />
        ))}
      </ol>
      <p className="mt-6 text-xs text-zinc-500 dark:text-zinc-400">
        Earlier: SunGard · Fidelity · MathWorks · QinetiQ
      </p>
      <Button href="/cv" variant="secondary" className="group mt-6 w-full">
        CV
        <ArrowDownIcon className="h-4 w-4 stroke-zinc-400 transition group-active:stroke-zinc-600 dark:group-hover:stroke-zinc-50 dark:group-active:stroke-zinc-50" />
      </Button>
    </div>
  )
}

function Photos() {
  let rotations = ['rotate-2', '-rotate-2', 'rotate-2', 'rotate-2', '-rotate-2']

  return (
    <div className="mt-16 sm:mt-20">
      <div className="-my-4 flex justify-center gap-5 overflow-hidden py-4 sm:gap-8">
        {[image1, image2, image3, image4, image5].map((image, imageIndex) => (
          <div
            key={image.src}
            className={clsx(
              'relative w-44 flex-none overflow-hidden rounded-xl bg-zinc-100 sm:w-72 sm:rounded-2xl dark:bg-zinc-800',
              rotations[imageIndex % rotations.length],
            )}
          >
            <div className="aspect-9/10">
              <Image
                src={image}
                alt=""
                sizes="(min-width: 640px) 18rem, 11rem"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default async function Home() {
  let allArticles = await getAllArticles()
  let articles = selectedArticleSlugs
    .map((slug) => allArticles.find((article) => article.slug === slug))
    .filter((article): article is ArticleWithSlug => article !== undefined)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Container className="mt-9">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            Software engineer, data visualisation specialist, and amateur coxswain.
          </h1>
          <p className="prose mt-6 text-base dark:prose-invert">
            I&apos;m John, a senior software engineer based in Cambridge. I build data visualisations, developer tools and complex frontend systems.
          </p>
          <div className="mt-6 flex gap-6">
            <SocialLink
              href="https://twitter.com/johnmwalley"
              aria-label="Follow on Twitter"
              icon={TwitterIcon}
            />
            <SocialLink
              href="https://www.youtube.com/channel/UCC3Xz6EXWE4jLIUVikQOvcw/"
              aria-label="Follow on YouTube"
              icon={YouTubeIcon}
            />
            <SocialLink
              href="https://github.com/johnwalley"
              aria-label="Follow on GitHub"
              icon={GitHubIcon}
            />
            <SocialLink
              href="https://www.linkedin.com/in/johnwalley"
              aria-label="Follow on LinkedIn"
              icon={LinkedInIcon}
            />
          </div>
        </div>
      </Container>
      <Photos />
      <SelectedWork />
      <Container className="mt-24 md:mt-28">
        <div className="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none lg:grid-cols-2">
          <div className="flex flex-col gap-16">
            <h2 className="-mb-6 text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
              Selected writing
            </h2>
            {articles.map((article) => (
              <Article key={article.slug} article={article} />
            ))}
            <Link
              href="/articles"
              className="text-sm font-medium text-teal-500 transition hover:text-teal-600 dark:hover:text-teal-400"
            >
              View all articles <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          <div className="space-y-10 lg:pl-16 xl:pl-24">
            <Resume />
          </div>
        </div>
      </Container>
    </>
  )
}
