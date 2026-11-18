// KaTeX styles live in a layout, not in page.mdx, because getAllArticles()
// imports every page.mdx for its metadata, which would pull this CSS into the
// homepage and article index too.
import 'katex/dist/katex.min.css'

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
