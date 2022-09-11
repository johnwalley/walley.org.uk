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
              href="https://static1.squarespace.com/static/590dd8261b10e3154459c549/t/5fb2a8899c914c7cb4d427a1/1605544080144/The+ten+oldest+universities+in+the+UK.pdf"
              title="The 10 oldest universities in the UK"
              description="A quick overview of the oldest universities in the United Kingdom."
              cta="View poster"
            />
            <Infographic
              href="https://static1.squarespace.com/static/590dd8261b10e3154459c549/t/5f2ea03acd0ccc32567de5d0/1596891197001/Pedestrian+Crossings.pdf"
              title="Pedestrian crossings in the United Kingdom"
              description="The use of amusing animal names began in 1951
              with the introduction of 'Zebra' Crossings."
              cta="View poster"
            />
          </InfographicsSection>
        </div>
      </SimpleLayout>
    </>
  )
}
