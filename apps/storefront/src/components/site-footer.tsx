import Image from "next/image"
import Link from "next/link"
import { enquiryHref, media, retailers } from "@/lib/catalogue"
import { Arrow } from "./icons"
import type { Panel } from "@/lib/products"
import EnquiryForm from "@/app/contact/form"

export function Retailers({ settings = {}, id = "retailers" }: { settings?: Record<string,string>; id?: string }) {
  return <section className="retailer-section section-wrap" id={id} aria-labelledby={`${id}-heading`}>
    <div className="retailer-intro"><p className="eyebrow">{settings.eyebrow ?? "Find your Quietex"}</p><h2 id={`${id}-heading`}>{settings.heading ?? "Available through our retail partners."}</h2><p>{settings.body ?? "Speak with a retailer about pricing, availability and purchasing."}</p></div>
    <div className="retailer-list">{retailers.map(retailer => <a href={retailer.url} key={retailer.name}><h3>{retailer.name}</h3><span>Visit store <Arrow diagonal /></span></a>)}</div>
  </section>
}

export function EnquirySection({ settings = {}, id = "enquire", panels }: { settings?: Record<string,string>; id?: string; panels?: Panel[] }) {
  if (panels) return <section className="homepage-enquiry section-wrap" id={id} aria-labelledby={`${id}-heading`}>
    <div><p className="eyebrow">{settings.eyebrow ?? "A little guidance goes a long way"}</p><h2 id={`${id}-heading`}>{settings.heading ?? "Let’s find the right panel for your space."}</h2><p>{settings.body ?? "Share your wall dimensions and preferred finish and we’ll be in touch."}</p></div>
    <EnquiryForm panels={panels.map(p=>({handle:p.handle,title:p.title,finishes:p.finishes.map(f=>f.name)}))} initialPanel="" initialFinish="" subject="Quietex project enquiry" submitLabel={settings.buttonLabel}/>
  </section>
  return <section className="enquiry-section" id={id} aria-labelledby={`${id}-heading`}>
    <div className="enquiry-top"><p className="eyebrow">{settings.eyebrow ?? "A little guidance goes a long way"}</p><span className="small-circle"><Arrow diagonal /></span></div>
    <div className="enquiry-content"><h2 id={`${id}-heading`}>{settings.heading ?? "Let’s find the right panel for your space."}</h2><div><p>{settings.body ?? "Tell us what you have in mind. Share your room dimensions, preferred finish or a question about the range."}</p><a className="button button-light" href={enquiryHref("Quietex project enquiry")}>{settings.buttonLabel ?? "Request a Quote"}<Arrow diagonal /></a><span className="email-note">Send us your project details using our enquiry form.</span></div></div>
  </section>
}

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-main">
      <div className="footer-brand"><Link href="/" aria-label="Quietex home"><Image unoptimized src={media.logoLight} width={170} height={30} alt="Quietex" /></Link></div>
      <nav aria-label="Footer navigation"><Link href="/#panels">Our panels</Link><Link href="/#spaces">Spaces</Link><Link href="/#about">About Quietex</Link><Link href="/#retailers">Where to buy</Link><Link href="/panel-calculator">Panel calculator</Link></nav>
      <div className="footer-contact"><a href="mailto:enquiries@quietex.com.au">enquiries@quietex.com.au <Arrow diagonal /></a></div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Quietex</span><a href="#main">Back to top ↑</a><p>Images are illustrative. Colours may vary by screen and production batch. Product dimensions may vary by ±5 mm.</p></div>
  </footer>
}
