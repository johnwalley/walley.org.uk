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
        source: '/blog/2017/1/15/prioritization',
        destination: '/articles/prioritization',
        permanent: true,
      },
      {
        source: '/blog/2017/1/8/memoization',
        destination: '/articles/memoization',
        permanent: true,
      },
      {
        source: '/blog/2016/11/14/whats-the-biggest-number-you-can-think-of',
        destination: '/articles/whats-the-biggest-number-you-can-think-of',
        permanent: true,
      },
      {
        source: '/blog/2016/11/8/react-and-d3',
        destination: '/articles/react-and-d3',
        permanent: true,
      },
      {
        source: '/blog/2016/9/4/rollup-and-d3-plugins',
        destination: '/articles/rollup-and-d3-plugins',
        permanent: true,
      },
      {
        source: '/blog/2016/7/24/cambridge-bumps-launch-post-mortem',
        destination: '/articles/cambridge-bumps-launch-post-mortem',
        permanent: true,
      },
      {
        source:
          '/blog/2016/4/27/youre-making-it-hard-to-like-you-github-desktop',
        destination:
          '/articles/youre-making-it-hard-to-like-you-github-desktop',
        permanent: true,
      },
      {
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
