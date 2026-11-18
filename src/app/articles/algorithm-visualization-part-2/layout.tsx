// The visualization's styles live in a layout, not in page.mdx or viz.tsx,
// because getAllArticles() imports every page.mdx (and so everything it
// imports) for its metadata, which would pull this CSS into the homepage and
// article index too.
import './style.css'

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
