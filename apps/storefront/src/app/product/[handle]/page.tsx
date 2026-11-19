import { LifestylePhotos } from "@/components/lifestyle-photos"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getPanels } from "@/lib/products"
import { ProductConfigurator } from "@/components/product-configurator"
import { SiteHeader } from "@/components/site-header"
import { Retailers, SiteFooter } from "@/components/site-footer"
export const dynamic = "force-dynamic"
type Props = { params: Promise<{ handle: string }> }
export async function generateMetadata({ params }: Props) {
  const [panel] = await getPanels((await params).handle)
  if (!panel) return { title: "Panel not found", robots: { index: false, follow: false } }
  const description = panel.description.slice(0, 200)
  return { title: `${panel.title} Acoustic Panel`, description, alternates: { canonical: `/product/${panel.handle}/` }, openGraph: { title: `${panel.title} Acoustic Panel | Quietex`, description, images: panel.productImage ? [panel.productImage] : [] } }
}
export default async function ProductPage({ params }: Props) {
  const [panel] = await getPanels((await params).handle)
  if (!panel) notFound()
  return <><SiteHeader /><main id="main" className="product-page"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/our-products">Our panels</Link><span>/</span><span aria-current="page">{panel.title}</span></nav><ProductConfigurator panel={panel} /><section className="specification-section section-wrap"><div><p className="eyebrow">Get to know {panel.title}</p><h2>The finer details.</h2><p>Materials, dimensions and finishes to help you plan.</p></div><div><table className="specification-table"><caption className="sr-only">{panel.title} specifications</caption><tbody>{panel.specifications.map(s=><tr key={s.name}><th scope="row">{s.name}</th><td>{s.value}</td></tr>)}</tbody></table><p className="technical-note">For installation guidance and current acoustic or fire performance documentation, please contact us before specifying your project.</p></div></section>{panel.lifestyleImages.length>0&&<section className="product-lifestyle section-wrap" aria-labelledby="product-lifestyle-title"><div className="section-heading"><div><p className="eyebrow">Room inspiration</p><h2 id="product-lifestyle-title">{panel.title}<br/><em>in a room.</em></h2></div><p>Take a closer look at the lifestyle photos. Select an image to enlarge it.</p></div><LifestylePhotos photos={panel.lifestyleImages.map((url,index)=>({id:`${panel.id}-${index}`,url,alt:`${panel.title} room view ${index+1}`}))}/></section>}<Retailers /></main><SiteFooter /></>
}
