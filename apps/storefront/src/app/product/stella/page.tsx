import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { Retailers, EnquirySection, SiteFooter } from "@/components/site-footer"
import { StellaConfigurator } from "@/components/stella-configurator"
import { Arrow } from "@/components/icons"

export const metadata: Metadata = {
  title: "Stella Acoustic Wall Panel",
  description: "Explore Stella, a 600 × 600 mm acoustic wall panel in wood veneer and polyester fibre. Choose your finish and enquire about your project.",
}

export default function StellaPage() {
  return <><SiteHeader /><main id="main" className="product-page"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/#panels">Our panels</Link><span>/</span><span aria-current="page">Stella</span></nav><StellaConfigurator />
    <section className="specification-section section-wrap" aria-labelledby="specification-heading"><div><p className="eyebrow">Get to know Stella</p><h2 id="specification-heading">The finer details.</h2><p>Materials, dimensions and finishes<br />to help you plan your space.</p><Link className="text-link" href="/#enquire">Have a technical question?<Arrow diagonal /></Link></div><div><table className="specification-table"><caption className="sr-only">Stella product specifications</caption><tbody>{[
      ["Material", "Premium wood veneer, polyester fibre"], ["Application", "Decorative wall panel"], ["Panel dimensions", "600 × 600 mm"], ["Thickness", "23 mm"], ["Face area per panel", "0.36 m²"], ["Finishes", "Navy Blue / Walnut · Sky Grey / Blackwood"],
    ].map(([name, value]) => <tr key={name}><th scope="row">{name}</th><td>{value}</td></tr>)}</tbody></table><p className="technical-note">For installation guidance and current acoustic or fire performance documentation, please contact us before specifying your project.</p></div></section>
    <section className="product-next section-wrap"><p className="eyebrow">Find your finish</p><h2>There’s more to explore.</h2><p>Discover the textures, colours and patterns across the Quietex collection.</p><Link href="/#panels" className="button button-outline">Back to the collection<Arrow /></Link></section>
    <Retailers /><EnquirySection /></main><SiteFooter /></>
}
