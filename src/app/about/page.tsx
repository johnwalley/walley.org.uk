import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import { Button } from '@/components/Button'
import {
  TwitterIcon,
  YouTubeIcon,
  GitHubIcon,
  LinkedInIcon,
} from '@/components/SocialIcons'
import portraitImage from '@/images/portrait.jpg'
import { createPageMetadata } from '@/lib/metadata'

function SocialLink({
  className,
  href,
  children,
  icon: Icon,
}: {
  className?: string
  href: string
  children: React.ReactNode
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <li className={clsx(className, 'flex')}>
      <Link
        href={href}
        className="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
      >
        <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-teal-500" />
        <span className="ml-4">{children}</span>
      </Link>
    </li>
  )
}

function MailIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M6 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6Zm.245 2.187a.75.75 0 0 0-.99 1.126l6.25 5.5a.75.75 0 0 0 .99 0l6.25-5.5a.75.75 0 0 0-.99-1.126L12 12.251 6.245 7.187Z"
      />
    </svg>
  )
}

export const metadata = createPageMetadata({
  title: 'About',
  description:
    'Software engineer in Cambridge, passionate about data visualisation and making complex information accessible.',
  path: '/about',
})

export default function About() {
  return (
    <Container className="mt-16 sm:mt-32">
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
        <div className="lg:pl-20">
          <div className="max-w-xs px-2.5 lg:max-w-none">
            <Image
              src={portraitImage}
              alt=""
              sizes="(min-width: 1024px) 32rem, 20rem"
              className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
            />
          </div>
        </div>
        <div className="lg:order-first lg:row-span-2">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            Hi, I&apos;m John Walley. I live in the beautiful city of Cambridge.
          </h1>
          <div className="prose mt-6 space-y-7 text-base text-zinc-600 dark:prose-invert dark:text-zinc-400">
            <p>
              I&apos;m a senior software engineer at Cambridge Intelligence,
              where I work on visualisation tools that analysts use to explore
              complex graph, temporal and geospatial data. Most of my time goes
              on performance-critical interfaces, API design, and the kind of
              frontend architecture that has to stay maintainable for years.
            </p>
            <p>
              Before that I spent nine years running Mulberry House Software, my
              own consultancy, building data-driven applications for clients in
              pensions, property and finance. Along the way I created{' '}
              <Link
                href="https://allotment.mulberryhousesoftware.com/"
                className="font-semibold text-teal-500 transition hover:text-teal-600 dark:hover:text-teal-400"
              >
                Allotment
              </Link>
              , an open-source React component for resizable split views, which
              is now downloaded around a quarter of a million times a week.
            </p>
            <p>
              The thread running through all of it is making complicated
              information legible. That is my job, and it is also what I do for
              fun: interactive charts covering two centuries of Cambridge bumps
              racing, a map of the city&apos;s pubs drawn in the style of the
              London Underground, and posters about everything from marathon
              courses to the UK&apos;s strangely named pedestrian crossings.
            </p>
            <p>
              When I&apos;m not at a keyboard I&apos;m usually somewhere near
              the Cam, coxing.
            </p>
          </div>
          <Link href="/cv">
            <Button variant="secondary" className="group mt-6 w-full">
              CV
            </Button>
          </Link>
        </div>
        <div className="lg:pl-20">
          <ul role="list">
            <SocialLink
              href="https://twitter.com/johnmwalley"
              icon={TwitterIcon}
            >
              Follow on Twitter
            </SocialLink>
            <SocialLink
              href="https://www.youtube.com/channel/UCC3Xz6EXWE4jLIUVikQOvcw/"
              icon={YouTubeIcon}
              className="mt-4"
            >
              Follow on YouTube
            </SocialLink>
            <SocialLink
              href="https://github.com/johnwalley"
              icon={GitHubIcon}
              className="mt-4"
            >
              Follow on GitHub
            </SocialLink>
            <SocialLink
              href="https://www.linkedin.com/in/johnwalley"
              icon={LinkedInIcon}
              className="mt-4"
            >
              Follow on LinkedIn
            </SocialLink>
            <SocialLink
              href="mailto:john@walley.org.uk"
              icon={MailIcon}
              className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40"
            >
              john@walley.org.uk
            </SocialLink>
          </ul>
        </div>
      </div>
    </Container>
  )
}
