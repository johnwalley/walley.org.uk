import Head from 'next/head'

import { Card } from '@/components/Card'
import { Section } from '@/components/Section'
import { SimpleLayout } from '@/components/SimpleLayout'

function InfographicsSection({ children, ...props }) {
  return (
    <Section {...props}>
      <div className="space-y-16">{children}</div>
    </Section>
  )
}

function Infographic({ title, description, cta, href }) {
  return (
    <Card as="article">
      <Card.Title as="h3" href={href}>
        {title}
      </Card.Title>
      <Card.Description>{description}</Card.Description>
      <Card.Cta>{cta}</Card.Cta>
    </Card>
  )
}

export default function Infographics() {
  return (
    <>
      <Head>
        <title>Infographics - John Walley</title>
        <meta
          name="description"
          content="Some of the infographics and videos I've created."
        />
      </Head>
      <SimpleLayout
        title="Some of the infographics and videos I've created."
        intro="One of my favorite ways to share my ideas is through posters and videos."
      >
        <div className="space-y-20">
          <InfographicsSection title="Videos">
            <Infographic
              href="https://youtu.be/qEQZKhyIDAA"
              title="United States Center of Population"
              description="Where do people live in the United States? We take a look at the top five most and least densely populated states before seeing how the center of population has changed over more than two centuries."
              cta="Watch video"
            />
          </InfographicsSection>
          <InfographicsSection title="Posters">
            <Infographic
              href="/posters/The ten oldest universities in the UK.pdf"
              title="The 10 oldest universities in the UK"
              description="A quick overview of the oldest universities in the United Kingdom."
              cta="View poster"
            />
            <Infographic
              href="/posters/Pedestrian Crossings.pdf"
              title="Pedestrian crossings in the United Kingdom"
              description="The use of amusing animal names began in 1951
              with the introduction of 'Zebra' Crossings."
              cta="View poster"
            />
            <Infographic
              href="/posters/How long is a rowing boat.pdf"
              title="How long is a rowing boat?"
              description="Modern rowing boats are made from composite materials such as carbon fibre and kevlar. They are extremely narrow and long to maximise speed."
              cta="View poster"
            />
            <Infographic
              href="/posters/Britain's Bike Theft Capital.pdf"
              title="Britain’s Bike Theft Capital?"
              description="Oxford and Cambridge are the UK’s top cycling cities. We’ve crunched through 6 million reported crimes over the past 12 months to find out how they compare."
              cta="View poster"
            />
            <Infographic
              href="/posters/World Marathon Courses.pdf"
              title="World marathon courses"
              description="Popular marathon courses visualised."
              cta="View poster"
            />{' '}
            <Infographic
              href="/posters/Twenty-five ways to cross the River Cam.pdf"
              title="Twenty-five ways to cross the River Cam"
              description="Cambridge's bridges."
              cta="View poster"
            />
          </InfographicsSection>
          <InfographicsSection title="Websites">
            <Infographic
              href="https://www.tynebridges.com/"
              title="Tyne Bridges"
              description="Interactive infographic about the bridges across the Tyne between Newcastle and Gateshead."
              cta="Visit website"
            />
          </InfographicsSection>
        </div>
      </SimpleLayout>
    </>
  )
}
