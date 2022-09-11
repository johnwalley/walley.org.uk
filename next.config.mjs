import nextMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import rehypePrism from '@mapbox/rehype-prism'
import rehypeMathJax from 'rehype-mathjax'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['jsx', 'mdx'],
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    newNextLinkBehavior: true,
    scrollRestoration: true,
  },
  async redirects() {
    return [
      {
        source: '/blog/2016/4/27/youre-making-it-hard-to-like-you-github-desktop',
        destination: '/articles/youre-making-it-hard-to-like-you-github-desktop',
        permanent: true,
      },      {
        source: '/blog/2016/4/18/algorithm-visualization',
        destination: '/articles/algorithm-visualization',
        permanent: true,
      },
      {
        source: '/blog/2016/3/17/bf2jrx3gapi8fgl48cuk8wl3p67fox',
        destination: '/articles/taking-docker-for-a-spin',
        permanent: true,
      },
      {
        source: '/blog/2016/3/17/83w51wvhfsk3gzlhzlqgfqxyw0avns',
        destination: '/articles/what-no-one-tells-you-about-gpu-benchmarks',
        permanent: true,
      },
      {
        source: '/blog/2016/3/17/deranged',
        destination: '/articles/deranged',
        permanent: true,
      },
    ]
  },
}

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [rehypePrism, rehypeKatex],
  },
})

export default withMDX(nextConfig)
