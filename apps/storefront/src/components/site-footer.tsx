import Image from "next/image"
import Link from "next/link"
import { enquiryHref, media, retailers } from "@/lib/catalogue"
import { Arrow } from "./icons"
import EnquiryForm from "@/app/contact/form"

export function Retailers({ settings = {}, id = "retailers" }: { settings?: Record<string,string>; id?: string }) {
  return <section className="retailer-section section-wrap" id={id} aria-labelledby={`${id}-heading`}>
    <div className="retailer-intro"><p className="eyebrow">{settings.eyebrow ?? "Where to buy"}</p><h2 id={`${id}-heading`}>{settings.heading ?? "Buy through our retail partners."}</h2><p>{settings.body ?? "Contact Digital Cinema, Audio Junction or Instyle HiFi for pricing and availability."}</p></div>
    <div className="retailer-list">{retailers.map(retailer => <a href={retailer.url} key={retailer.name}><h3>{retailer.name}</h3><span>Visit store <Arrow diagonal /></span></a>)}</div>
  </section>
}

export function EnquirySection({ settings = {}, id = "enquire" }: { settings?: Record<string,string>; id?: string }) {
  return <section className="homepage-enquiry section-wrap" id={id} aria-labelledby={`${id}-heading`}>
    <div><p className="eyebrow">{settings.eyebrow ?? "Get in touch"}</p><h2 id={`${id}-heading`}>{settings.heading ?? "Need help choosing panels?"}</h2><p>{settings.body ?? "Send us your wall dimensions and the finish you’re considering. We’ll help with the panel choice and quantity."}</p></div>
    <EnquiryForm compact panels={[]} initialPanel="" initialFinish="" subject="Quietex project enquiry" submitLabel={settings.buttonLabel}/>
  </section>
}

export function QuoteCallout() {
  return <section className="quote-callout section-wrap" aria-labelledby="quote-callout-heading"><div><h2 id="quote-callout-heading">Need help choosing panels?</h2><p>Send us your wall dimensions or ask us about a panel.</p></div><Link className="button button-dark" href="/contact-us/">Request a Quote <Arrow diagonal /></Link></section>
}

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-main">
      <div className="footer-brand"><Link href="/" aria-label="Quietex home"><Image unoptimized src={media.logoLight} width={170} height={30} alt="Quietex" /></Link></div>
      <nav aria-label="Footer navigation"><Link href="/our-products">Our panels</Link><Link href="/#spaces">Spaces</Link><Link href="/about/">About Quietex</Link><Link href="/#retailers">Where to buy</Link><Link href="/panel-calculator">Panel calculator</Link><Link href="/contact-us/">Contact</Link></nav>
      <div className="footer-contact"><a href="mailto:enquiries@quietex.com.au">enquiries@quietex.com.au <Arrow diagonal /></a></div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Quietex</span><a href="#main">Back to top ↑</a><p>Images are illustrative. Colours may vary by screen and production batch. Product dimensions may vary by ±5 mm.</p></div>
  </footer>
}
