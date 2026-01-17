import Link from 'next/link'
import data from './resume.json'

import { Container } from '@/components/Container'
import { Button } from '@/components/Button'

function formatYearMonth(value) {
  if (!value) return ''

  const parts = value.split('-')

  // YYYY
  if (parts.length === 1) {
    const year = Number(parts[0])
    if (Number.isNaN(year)) return value
    return String(year)
  }

  // YYYY-MM
  if (parts.length === 2) {
    const [year, month] = parts.map(Number)
    if (
      Number.isNaN(year) ||
      Number.isNaN(month) ||
      month < 1 ||
      month > 12
    ) {
      return value
    }

    const date = new Date(Date.UTC(year, month - 1, 1))
    return date.toLocaleString('en-GB', {
      month: 'long',
      year: 'numeric',
    })
  }

  // Anything else → pass through unchanged
  return value
}

function parseMarkdownLinks(text) {
  if (!text) return ''

  const parts = []
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index))
    }

    // Add the link
    const [, linkText, href] = match
    parts.push(
      <a
        key={match.index}
        href={href}
        className="border-b border-sky-600 font-semibold text-[#0f172a] hover:border-b-2 dark:text-white"
      >
        {linkText}
      </a>
    )

    lastIndex = regex.lastIndex
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex))
  }

  return parts.length > 0 ? parts : text
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
      {left}
      {right && (
        <>
          {' / '}
          <span className="font-normal">{right}</span>
        </>
      )}
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

export const metadata = {
  title: 'CV',
  description: 'CV - John Walley',
}

export default function CV() {
  return (
    <Container className="mt-16 text-base text-black sm:mt-32 dark:text-white">
      <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
        <div className="md:col-start-1 md:row-start-1">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-200">
            {data.basics.name}
          </h1>
          <h2 className="text-4xl font-bold text-[#0d71ba]">
            {data.basics.label}
          </h2>
          <div className="mt-4">
            <a href="/John_Walley_CV.pdf" download className="inline-block">
              <Button variant="secondary">Download CV</Button>
            </a>
          </div>
        </div>
        <div></div>
        <div className="">
          <div className="">
            <H2>Experience</H2>
            {data.work.map(
              (
                {
                  name,
                  position,
                  startDate,
                  endDate,
                  date,
                  summary,
                  highlights,
                },
                index
              ) => (
                <div key={index}>
                  <H3 left={name} right={position} />
                  <Subtitle>
                    {date
                      ? date
                      : `${formatYearMonth(startDate)} - ${endDate ? formatYearMonth(endDate) : 'Present'}`}
                  </Subtitle>
                  <Description>
                    {summary && (
                      <p className="mb-4">{parseMarkdownLinks(summary)}</p>
                    )}
                    {highlights && highlights.length > 0 && (
                      <Ul>
                        {highlights.map((highlight, index) => (
                          <li key={index}>{parseMarkdownLinks(highlight)}</li>
                        ))}
                      </Ul>
                    )}
                  </Description>
                </div>
              )
            )}
          </div>
        </div>
        <div className="">
          <div className="pb-6">
            <H2>Skills</H2>
            {data.skills.map(({ name, keywords }) => (
              <div key={name}>
                <span className="font-bold">{name}: </span>
                <span>{keywords.join(' • ')}</span>
              </div>
            ))}
          </div>
          <div className="">
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
              )
            )}
          </div>
        </div>
      </div>
    </Container>
  )
}
