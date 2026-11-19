import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { LifestylePhotos } from "@/components/lifestyle-photos"
import { medusaFetch } from "@/lib/medusa"
import { legacyMediaUrl } from "@/lib/legacy-media"
import { getPanels } from "@/lib/products"
export const dynamic = "force-dynamic"
export const metadata = { title: "At home & at work — Gallery", description: "Browse Quietex lifestyle photos for home theatres, living rooms and workspaces.", alternates: { canonical: "/gallery/" } }
type Photo = { id: string; url: string; alt: string; caption: string; space: "home" | "work"; panelHandle: string }
export default async function GalleryPage({ searchParams }: { searchParams: Promise<{ space?: string }> }) {
  const space = (await searchParams).space
  const active = space === "home" || space === "work" ? space : "all"
  const [data, panels] = await Promise.all([medusaFetch<{ images: Photo[] }>("/store/lifestyle-gallery"), getPanels()])
  const photos = data.images.filter(image => active === "all" || image.space === active).map(image => {
    const panel = panels.find(panel => panel.handle === image.panelHandle)
    return { ...image, url: legacyMediaUrl(image.url), panelHandle: panel?.handle, panelTitle: panel?.title }
  })
  return <><SiteHeader /><main id="main" className="lifestyle-gallery-page section-wrap"><div className="lifestyle-gallery-heading"><p className="eyebrow">Room inspiration</p><h1>At home.<br /><em>At work.</em></h1><p>See how panels can look in different rooms. Browse the photos and open any image for a closer look.</p></div><nav className="lifestyle-gallery-filters" aria-label="Gallery spaces">{[{ key: "all", label: "All spaces", href: "/gallery/" }, { key: "home", label: "At home", href: "/gallery/?space=home" }, { key: "work", label: "At work", href: "/gallery/?space=work" }].map(filter => <Link key={filter.key} href={filter.href} aria-current={active === filter.key ? "page" : undefined}>{filter.label}</Link>)}</nav>{photos.length ? <LifestylePhotos key={active} photos={photos} /> : <div className="lifestyle-gallery-empty"><h2>More room photos are on the way.</h2><p>Browse our panels or ask our team to help you picture them in your room.</p><Link className="button button-dark" href="/our-products">Explore the panels</Link></div>}<p className="gallery-note">Images are for inspiration. Colours and finishes may vary by screen and installation.</p></main><SiteFooter /></>
}
