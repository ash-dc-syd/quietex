import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter, EnquirySection } from "@/components/site-footer"
import { medusaFetch } from "@/lib/medusa"
import { defaultContent, type SiteDocument } from "@/lib/site-content"
export const dynamic = "force-dynamic"
export const metadata = { title: "About Quietex", description: "Acoustic panels that bring sound and design together, for homes and workspaces.", alternates: { canonical: "/about/" } }
export default async function About() {
  const { content } = await medusaFetch<{content:SiteDocument}>("/store/site-content").catch(()=>({content:defaultContent}))
  const s = content.sections.find(s=>s.type==="about")?.settings || defaultContent.sections.find(s=>s.type==="about")!.settings
  return <><SiteHeader/><main id="main"><section className="section-wrap about-page-intro"><div><p className="eyebrow">About Quietex</p><h1>{s.heading}</h1><p>{s.body}</p>{s.bodyTwo&&<p>{s.bodyTwo}</p>}<p><strong>{s.pointOneTitle}</strong> {s.pointOne}</p><p><strong>{s.pointTwoTitle}</strong> {s.pointTwo}</p><Link className="text-link" href="/our-products/">Explore the panels ↗</Link></div>{s.image&&<Image unoptimized src={s.image} alt={s.alt||"Quietex acoustic panels"} width={900} height={900}/>}</section><EnquirySection/></main><SiteFooter/></>
}
