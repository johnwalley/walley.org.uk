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

function H2({ children }) {
  return (
    <h2 className="mb-4 text-lg font-bold text-gray-400 dark:text-gray-400">
      {children}
    </h2>
  )
}

function H3({ left, right }) {
  return (
    <h3 className="font-bold dark:text-white">
      {left} / <span class="font-normal">{right}</span>
    </h3>
  )
}

function Subtitle({ children }) {
  return <h4 className="mb-2 text-gray-400 dark:text-gray-400">{children}</h4>
}

function Description({ children }) {
  return (
    <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{children}</p>
  )
}

export default function CV() {
  return (
    <>
      <Head>
        <title>CV - John Walley</title>
        <meta name="description" content="CV" />
      </Head>
      <Container className="mt-16 text-black dark:text-white sm:mt-32">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div class="md:col-start-1 md:row-start-1">
            <h1 className="text-4xl font-bold text-black dark:text-white">
              John Walley
            </h1>
            <h2 class="text-4xl font-bold text-[#0d71ba]">
              Software Developer
            </h2>
          </div>
          <div class="text-black dark:text-white md:col-start-2 md:row-start-1">
            <div>
              <span>
                <a className="hover:underline" href="https://www.walley.org.uk">
                  www.walley.org.uk
                </a>
              </span>
            </div>
            <div>
              <a className="hover:underline" href="mailto:john@walley.org.uk">
                john@walley.org.uk
              </a>
            </div>
            <div>
              <a
                className="hover:underline"
                href="https://github.com/johnwalley"
              >
                github.com/johnwalley
              </a>
            </div>
          </div>
          <div class="left">
            <div class="experience">
              <H2>Work experience</H2>
              <div>
                <H3 left="Mulberry House Software" right="CEO & Founder" />
                <Subtitle>2016 - present</Subtitle>
                <Description>
                  <p>Describe role and experience here</p>
                  <p>Reno</p>
                  <ul className="list-disc">
                    <li>Floorplanner tool</li>
                    <li>Coordinated content marketing</li>
                    <li>
                      Set development priorities through closely working with UX
                      specialists
                    </li>
                  </ul>
                  <p>Financial Canvas</p>
                  <p>Vega</p>
                </Description>
              </div>
              <div>
                <H3 left="Redgate" right="Trainee Product Manager" />
                <Subtitle>2015 - 2016</Subtitle>
                <Description>
                  <p>
                    Improved awareness and increased usage of a newly acquired
                    database deployment tool.
                  </p>
                  <ul className="list-disc">
                    <li>Developed in-product analytics functionality</li>
                    <li>Coordinated content marketing</li>
                    <li>
                      Set development priorities through closely working with UX
                      specialists
                    </li>
                  </ul>
                </Description>
              </div>
              <div>
                <H3 left="Redgate" right="Software Developer" />
                <Subtitle class="subtitle">2014 - 2015</Subtitle>
                <Description>
                  <p>
                    Helped to solve SQL Server database deployment for users of
                    the most popular release management tools.
                  </p>
                </Description>
              </div>
              <div>
                <H3 left="Sungard" right="Software Developer" />
                <Subtitle class="subtitle">2012 - 2014</Subtitle>
                <Description>
                  <p>
                    Contributed to a scalable and extensible framework used by a
                    high-performance risk analytics service. Technical highlight
                    was developing a tracing just-in-time compiler enabling
                    clients to run C# financial models on GPUs.
                  </p>
                </Description>
              </div>
              <div>
                <H3 left="Various" right="Freelance Developer" />
                <Subtitle class="subtitle">2011 - 2012</Subtitle>
                <Description>
                  <ul className="list-disc">
                    <li>
                      Designed and implemented algorithms for human motion
                      capture using low-cost inertial sensors, e.g.
                      accelerometers and gyroscopes
                    </li>
                    <li>
                      Developed a bespoke financial trading tool for an
                      independent trader
                    </li>
                  </ul>
                </Description>
              </div>
              <div>
                <H3
                  left="Fidelity"
                  right="High Performance Computing Developer"
                />
                <Subtitle class="subtitle">2010 - 2011</Subtitle>
                <Description>
                  <p>
                    A core member of the newly founded applied team. I was
                    instrumental in designing, implementing and introducing
                    quant-based methods to the wider organization.
                  </p>
                  <p>
                    I promoted components of agile development to the team.
                    Particularly moving to a more iterative approach with more
                    frequent stakeholder feedback.
                  </p>
                </Description>
              </div>
              <div>
                <H3 left="MathWorks" right="Application Engineer" />
                <Subtitle class="subtitle">2007 - 2010</Subtitle>
                <Description>
                  <p>
                    Worked directly with customers to understand their technical
                    and business challenges. Acted as the main point of contact
                    for customers evaluating and using MathWorks parallel
                    computing tools in the UK.
                  </p>

                  <ul className="list-disc">
                    <li>
                      Analyzed users’ problems to determine the best solution
                    </li>
                    <li>Developed demos and proofs of concept</li>
                    <li>
                      Prepared and delivered presentations to customers and
                      prospects
                    </li>
                    <li>
                      Provided feedback to the commercial and R&D organizations
                    </li>
                  </ul>
                </Description>
              </div>
              <div>
                <H3 left="QinetiQ" right="Research Scientist" />
                <Subtitle class="subtitle">2004 - 2007</Subtitle>
                <Description>
                  <p>Contributed to a diverse range of projects:</p>
                  <ul className="list-disc">
                    <li>Assessing and improving warship stealth</li>
                    <li>
                      Sensor fusion - combining radar and infra-red sensor
                      output to improve situational awareness
                    </li>
                    <li>
                      Development of object tracking algorithms. Including a
                      LIDAR simulator (C++), Markov Chain Monte Carlo tracking
                      application (MATLAB) which I also modified to run on a
                      cluster, and a Google Earth based visualization tool
                      (Python)
                    </li>
                  </ul>
                </Description>
              </div>
              <div>
                <H3 left="Newcastle University" right="Research Assistant" />
                <Subtitle>Summer 1998 & 1999</Subtitle>
                <Description>
                  <p>
                    Data analysis and modelling of a mass spectrometry
                    experiment in Fortran. Joint author of a paper:{' '}
                    <a
                      className="hover:underline"
                      href="https://journals.aps.org/pra/abstract/10.1103/PhysRevA.61.050501"
                    >
                      'Hyperfine-resolved spectrum of the molecular dication
                      DCL2+'
                    </a>
                  </p>
                </Description>
              </div>
            </div>
          </div>

          <div class="right">
            <div class="education">
              <H2>Education</H2>
              <div>
                <H3
                  left="University of Oxford"
                  right="MSc in Mathematical Modelling and Scientific Computing"
                />
                <Subtitle class="subtitle">2002 - 2003</Subtitle>
              </div>
              <div>
                <H3 left="University of Cambridge" right="BA in Mathematics" />
                <Subtitle class="subtitle">1999 - 2002</Subtitle>
              </div>
            </div>
            <div class="text-black dark:text-white">
              <H2>Skills</H2>
              <div>
                <span className="font-bold">Software development: </span>
                <span>TypeScript • JavaScript</span>
              </div>
              <div>
                <span className="font-bold">Communication: </span>
                <span>Public speaking</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}
