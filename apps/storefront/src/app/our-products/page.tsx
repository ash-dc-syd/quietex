import { SiteHeader } from "@/components/site-header"
import { EnquirySection, SiteFooter } from "@/components/site-footer"
import { PanelCard } from "@/components/panel-card"
import { getPanels } from "@/lib/products"
export const dynamic = "force-dynamic"
export const metadata = { title: "Our Acoustic Panels" }
export default async function Catalogue() {
  const panels = await getPanels()
  return <><SiteHeader /><main id="main"><section className="section-wrap"><p className="eyebrow">The Quietex collection</p><h1 style={{fontSize:"clamp(40px,5vw,70px)",marginBottom:24}}>Find your kind of quiet.</h1><p>Explore acoustic panels, materials and finishes for your space.</p><p className="eyebrow">{panels.length} panels</p><div className="panel-grid">{panels.map(panel=><PanelCard panel={panel} key={panel.id} />)}</div>{!panels.length&&<p>Our collection is being updated. Please enquire about your project.</p>}</section><EnquirySection /></main><SiteFooter /></>
}
