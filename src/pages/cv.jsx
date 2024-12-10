import Image from 'next/future/image'
import Head from 'next/head'
import Link from 'next/link'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import {
  TwitterIcon,
  YouTubeIcon,
  GitHubIcon,
  LinkedInIcon,
} from '@/components/SocialIcons'
import portraitImage from '@/images/portrait.jpg'

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
  return <ul className="list-disc">{children}</ul>
}

function H2({ children }) {
  return (
    <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-200">
      {children}
    </h2>
  )
}

function H3({ left, right }) {
  return (
    <h3 className="font-bold text-slate-900 dark:text-slate-200">
      {left} / <span className="font-normal">{right}</span>
    </h3>
  )
}

function Subtitle({ children }) {
  return <h4 className="mb-2 text-slate-500 dark:text-slate-400">{children}</h4>
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-start-1 md:row-start-1">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-200">
              John Walley
            </h1>
            <h2 className="text-4xl font-bold text-[#0d71ba]">
              Software Developer
            </h2>
          </div>
          <div className="md:col-start-2 md:row-start-1">
            <div>
              <span>
                <Anchor href="https://www.walley.org.uk">
                  www.walley.org.uk
                </Anchor>
              </span>
            </div>
            <div>
              <Anchor href="https://www.mulberryhousesoftware.com">
                www.mulberryhousesoftware.com
              </Anchor>
            </div>
            <div>
              <Anchor href="mailto:john@walley.org.uk">
                john@walley.org.uk
              </Anchor>
            </div>
            <div>
              <Anchor href="https://github.com/johnwalley">
                github.com/johnwalley
              </Anchor>
            </div>
          </div>
          <div className="left">
            <div className="experience">
              <H2>Work experience</H2>
              <div>
                <H3 left="Mulberry House Software" right="CEO & Founder" />
                <Subtitle>2016 - present</Subtitle>
                <Description>
                  <Ul>
                    <li>
                      Founded and led a software company delivering innovative
                      solutions across multiple industries.
                    </li>
                    <li>
                      Created a floor planner with leading UK home
                      renovation startup{' '}
                      <Anchor href="https://www.renovatewithreno.co.uk/">
                        Reno
                      </Anchor>
                      .
                    </li>
                    <li>
                      Led development of a visualisation tools for the pension
                      industry with{' '}
                      <Anchor href="https://www.financialcanvas.co.uk/">
                        Financial Canvas
                      </Anchor>
                      .
                    </li>
                    <li>
                      Developed visualisation components for{' '}
                      <Anchor href="https://vega.xyz/">Vega</Anchor> a
                      decentralised network for creating and trading derivatives
                      including two open-source libraries:{' '}
                      <Anchor href="https://pennant.vega.xyz/">Pennant</Anchor>{' '}
                      and{' '}
                      <Anchor href="https://allotment.mulberryhousesoftware.com/">
                        Allotment
                      </Anchor>.
                    </li>
                  </Ul>
                </Description>
              </div>
              <div>
                <H3 left="Redgate" right="Trainee Product Manager" />
                <Subtitle>2015 - 2016</Subtitle>
                <Description>
                  <Ul>
                    <li>
                      Improved awareness and increased usage of a newly acquired
                      database deployment tool.
                    </li>
                    <li>
                      Developed in-product analytics functionality to provide
                      actionable insights.
                    </li>
                    <li>
                      Coordinated content marketing initiatives, increasing
                      product visibility and customer engagement.
                    </li>
                    <li>
                      Partnered with UX specialists to prioritise features and
                      improve user experience.
                    </li>
                  </Ul>
                </Description>
              </div>
              <div>
                <H3 left="Redgate" right="Software Developer" />
                <Subtitle className="subtitle">2014 - 2015</Subtitle>
                <Description>
                  <Ul>
                    <li>
                      Helped to solve SQL Server database deployment for users
                      of the most popular release management tools.
                    </li>
                  </Ul>
                </Description>
              </div>
              <div>
                <H3 left="Sungard" right="Software Developer" />
                <Subtitle className="subtitle">2012 - 2014</Subtitle>
                <Description>
                  <Ul>
                    <li>
                      Contributed to a scalable and extensible framework used by
                      a high-performance risk analytics service.
                    </li>
                    <li>
                      Developed a tracing just-in-time compiler, enabling C#
                      financial models to run on GPUs.
                    </li>
                  </Ul>
                </Description>
              </div>
              <div>
                <H3 left="Various" right="Freelance Developer" />
                <Subtitle className="subtitle">2011 - 2012</Subtitle>
                <Description>
                  <Ul>
                    <li>
                      Designed and implemented algorithms for human motion
                      capture using low-cost inertial sensors.
                    </li>
                    <li>
                      Developed a bespoke financial trading tool tailored to an
                      for an independent trader's needs.
                    </li>
                  </Ul>
                </Description>
              </div>
              <div>
                <H3
                  left="Fidelity"
                  right="High Performance Computing Developer"
                />
                <Subtitle className="subtitle">2010 - 2011</Subtitle>
                <Description>
                  <Ul>
                    <li>
                      Designed and implemented quantitative-based methods as
                      part of the newly-formed applied HPC team.
                    </li>
                    <li>
                      Advocated agile development practices, including iterative
                      approaches and frequent stakeholder feedback.
                    </li>
                  </Ul>
                </Description>
              </div>
              <div>
                <H3 left="MathWorks" right="Application Engineer" />
                <Subtitle className="subtitle">2007 - 2010</Subtitle>
                <Description>
                  <Ul>
                    <li>
                      Worked directly with customers to understand their
                      technical and business challenges.
                    </li>
                    <li>
                      Acted as the main point of contact for customers
                      evaluating and using MathWorks parallel computing tools in
                      the UK.
                    </li>
                    <li>
                      Prepared and delivered presentations to customers and
                      prospects.
                    </li>
                    <li>
                      Provided feedback to the commercial and R&D organisations.
                    </li>
                  </Ul>
                </Description>
              </div>
              <div>
                <H3 left="QinetiQ" right="Research Scientist" />
                <Subtitle className="subtitle">2004 - 2007</Subtitle>
                <Description>
                  <Ul>
                    <li>Assessed and improved warship stealth.</li>
                    <li>
                      Combined radar and infra-red output through sensor fusion
                      to improve situational awareness.
                    </li>
                    <li>
                      Developed object tracking algorithms, including a{' '}
                      <Anchor href="https://en.wikipedia.org/wiki/Lidar">
                        LIDAR
                      </Anchor>{' '}
                      simulator (C++),{' '}
                      <Anchor href="https://en.wikipedia.org/wiki/Markov_chain_Monte_Carlo">
                        Markov chain Monte Carlo
                      </Anchor>{' '}
                      tracking application (MATLAB), and visualisation tools
                      (Python).
                    </li>
                  </Ul>
                </Description>
              </div>
              <div>
                <H3 left="Newcastle University" right="Research Assistant" />
                <Subtitle>Summer 1998 & 1999</Subtitle>
                <Description>
                  <Ul>
                    <li>
                      Conducted data analysis and modelling for a mass
                      spectrometry experiment in Fortran.
                    </li>
                    <li>
                      Co-authored a peer-reviewed paper:{' '}
                      <Anchor
                        className="hover:underline"
                        href="https://journals.aps.org/pra/abstract/10.1103/PhysRevA.61.050501"
                      >
                        'Hyperfine-resolved spectrum of the molecular dication
                        DCl<sup>2+</sup>'.
                      </Anchor>
                    </li>
                  </Ul>
                </Description>
              </div>
            </div>
          </div>
          <div className="right">
            <div className="pb-6">
              <H2>Education</H2>
              <div>
                <H3
                  left="University of Oxford"
                  right="MSc in Mathematical Modelling and Scientific Computing"
                />
                <Subtitle className="subtitle">2002 - 2003</Subtitle>
                <Ul>
                  <li>
                    Studied mathematical modelling, numerical linear algebra,
                    numerical optimisation and distributed computing for
                    computational finance.
                  </li>
                  <li>
                    Explored the numerical solution of magnetic fluid flow in my
                    dissertation.
                  </li>
                </Ul>
              </div>
              <div>
                <H3 left="University of Cambridge" right="BA in Mathematics" />
                <Subtitle className="subtitle">1999 - 2002</Subtitle>
                <Ul>
                  <li>
                    Studied a wide variety of topics with an emphasis on applied
                    mathematics, statistics and theoretical physics.
                  </li>
                </Ul>
              </div>
            </div>
            <div className="text-black dark:text-white">
              <H2>Skills</H2>
              <div>
                <span className="font-bold">Software development: </span>
                <span>TypeScript • JavaScript • C# • MATLAB</span>
              </div>
              <div>
                <span className="font-bold">Communication: </span>
                <span>Public speaking • Technical presentations</span>
              </div>
              <div>
                <span className="font-bold">Specialised expertise: </span>
                <span>Data visualisation • API design • Data analysis</span>
              </div>
              <div>
                <span className="font-bold">Management experience: </span>
                <span>Technical mentoring • Product management</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}
