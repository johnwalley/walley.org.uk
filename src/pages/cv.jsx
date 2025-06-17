import Image from 'next/future/image'
import Head from 'next/head'
import Link from 'next/link'
import clsx from 'clsx'
import data from './resume.json'

import { Container } from '@/components/Container'
import {
  TwitterIcon,
  YouTubeIcon,
  GitHubIcon,
  LinkedInIcon,
} from '@/components/SocialIcons'
import portraitImage from '@/images/portrait.jpg'

function formatYearMonth(ym) {
  const [year, month] = ym.split('-')
  const date = new Date(`${year}-${month}-01`)
  return date.toLocaleString('en-GB', { month: 'long', year: 'numeric' })
}

function SocialLink({ className, href, children, icon: Icon }) {
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

function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M6 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6Zm.245 2.187a.75.75 0 0 0-.99 1.126l6.25 5.5a.75.75 0 0 0 .99 0l6.25-5.5a.75.75 0 0 0-.99-1.126L12 12.251 6.245 7.187Z"
      />
    </svg>
  )
}

function Ul({ children }) {
  return (
    <ul className="list-inside list-disc space-y-2 leading-normal">
      {children}
    </ul>
  )
}

function H2({ children }) {
  return (
    <h2 className="mb-4 text-4xl font-bold text-slate-900 dark:text-slate-200">
      {children}
    </h2>
  )
}

function H3({ left, right }) {
  return (
    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-200">
      {left} / <span className="font-normal">{right}</span>
    </h3>
  )
}

function Subtitle({ children }) {
  return (
    <h4 className="mb-2 text-base italic text-slate-500 dark:text-slate-400">
      {children}
    </h4>
  )
}

function Description({ children }) {
  return (
    <div className="mb-4 text-base text-slate-900 dark:text-slate-200">
      {children}
    </div>
  )
}

function Anchor({ children, href }) {
  return (
    <a
      className="border-b border-sky-600 font-semibold text-[#0f172a] hover:border-b-2 dark:text-white"
      href={href}
    >
      {children}
    </a>
  )
}

export default function CV() {
  return (
    <>
      <Head>
        <title>CV - John Walley</title>
        <meta name="description" content="CV" />
      </Head>
      <Container className="mt-16 text-base text-black dark:text-white sm:mt-32">
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
          <div className="md:col-start-1 md:row-start-1">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-200">
              {data.basics.name}
            </h1>
            <h2 className="text-4xl font-bold text-[#0d71ba]">
              {data.basics.label}
            </h2>
          </div>
          <div></div>
          {/*           <div className="md:col-start-2 md:row-start-1">
            {data.basics.profiles.map(({ url, username }) => (
              <div key={url}>
                <span>
                  <Anchor href={url}>{username}</Anchor>
                </span>
              </div>
            ))}
          </div> */}
          <div className="">
            <div className="">
              <H2>Experience</H2>
              {data.work.map(
                (
                  { name, position, startDate, endDate, summary, highlights },
                  index,
                ) => (
                  <div key={index}>
                    <H3 left={name} right={position} />
                    <Subtitle>
                      {formatYearMonth(startDate)} -{' '}
                      {endDate ? formatYearMonth(endDate) : 'Present'}
                    </Subtitle>
                    <Description>
                      {summary && <p>{summary}</p>}
                      {highlights && (
                        <Ul>
                          {highlights.map((highlight, index) => (
                            <li key={index}>{highlight}</li>
                          ))}
                        </Ul>
                      )}
                    </Description>
                  </div>
                ),
              )}
            </div>
          </div>
          <div className="">
            <div className="pb-6">
              <H2>Education</H2>
              {data.education.map(
                ({ institution, area, studyType, startDate, endDate }) => (
                  <div key={institution}>
                    <H3 left={institution} right={`${studyType} in ${area}`} />
                    <Subtitle>
                      {formatYearMonth(startDate)} -{' '}
                      {endDate ? formatYearMonth(endDate) : 'Present'}
                    </Subtitle>
                  </div>
                ),
              )}
            </div>
            <div className="text-black dark:text-white">
              <H2>Skills</H2>
              {data.skills.map(({ name, keywords }) => (
                <div key={name}>
                  <span className="font-bold">{name}: </span>
                  <span>{keywords.join(' • ')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}
