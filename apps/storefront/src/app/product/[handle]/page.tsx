import { notFound } from "next/navigation"
import Link from "next/link"
import { getPanels } from "@/lib/products"
import { ProductConfigurator } from "@/components/product-configurator"
import { SiteHeader } from "@/components/site-header"
import { Retailers, EnquirySection, SiteFooter } from "@/components/site-footer"
export const dynamic = "force-dynamic"
type Props = { params: Promise<{ handle: string }> }
export async function generateMetadata({ params }: Props) {
  const [panel] = await getPanels((await params).handle)
  return { title: panel ? `${panel.title} Acoustic Panel` : "Panel not found" }
}
export default async function ProductPage({ params }: Props) {
  const [panel] = await getPanels((await params).handle)
  if (!panel) notFound()
  return <><SiteHeader /><main id="main" className="product-page"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/our-products">Our panels</Link><span>/</span><span aria-current="page">{panel.title}</span></nav><ProductConfigurator panel={panel} /><section className="specification-section section-wrap"><div><p className="eyebrow">Get to know {panel.title}</p><h2>The finer details.</h2><p>Materials, dimensions and finishes to help you plan.</p></div><div><table className="specification-table"><caption className="sr-only">{panel.title} specifications</caption><tbody>{panel.specifications.map(s=><tr key={s.name}><th scope="row">{s.name}</th><td>{s.value}</td></tr>)}</tbody></table><p className="technical-note">For installation guidance and current acoustic or fire performance documentation, please contact us before specifying your project.</p></div></section><Retailers /><EnquirySection /></main><SiteFooter /></>
}
