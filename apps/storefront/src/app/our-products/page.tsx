import { SiteHeader } from "@/components/site-header"
import { EnquirySection, SiteFooter } from "@/components/site-footer"
import CatalogueGrid from "@/components/catalogue-grid"
import { getPanels } from "@/lib/products"
export const dynamic = "force-dynamic"
export const metadata = { title: "Our Acoustic Panels", alternates: { canonical: "/our-products/" }, description: "Explore Quietex acoustic panels, materials and finishes for your space." }
export default async function Catalogue() {
  const panels = await getPanels()
  return <><SiteHeader/><main id="main" className="catalogue-page"><section className="section-wrap catalogue-section"><p className="eyebrow">The Quietex collection</p><h1>Find your kind <em>of quiet.</em></h1><p className="catalogue-lead">Explore acoustic panels, materials and finishes for your space.</p><CatalogueGrid panels={panels}/>{!panels.length&&<p>Our collection is being updated. Please enquire about your project.</p>}</section><EnquirySection panels={panels}/></main><SiteFooter/></>
}
