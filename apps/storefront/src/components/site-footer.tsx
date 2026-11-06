import Image from "next/image"
import Link from "next/link"
import { enquiryHref, media, retailers } from "@/lib/catalogue"
import { Arrow } from "./icons"

export function Retailers({ settings = {}, id = "retailers" }: { settings?: Record<string,string>; id?: string }) {
  return <section className="retailer-section section-wrap" id={id} aria-labelledby="retailers-heading">
    <div className="retailer-intro"><p className="eyebrow">{settings.eyebrow ?? "Find your Quietex"}</p><h2 id="retailers-heading">{settings.heading ?? "Available through our retail partners."}</h2><p>{settings.body ?? "Speak with a retailer about pricing, availability and purchasing."}</p></div>
    <div className="retailer-list">{retailers.map(retailer => <a href={retailer.url} key={retailer.name}><span>{retailer.name}</span><Arrow diagonal /></a>)}</div>
  </section>
}

export function EnquirySection({ settings = {}, id = "enquire" }: { settings?: Record<string,string>; id?: string }) {
  return <section className="enquiry-section" id={id} aria-labelledby="enquiry-heading">
    <div className="enquiry-top"><p className="eyebrow">{settings.eyebrow ?? "A little guidance goes a long way"}</p><span className="small-circle"><Arrow diagonal /></span></div>
    <div className="enquiry-content"><h2 id="enquiry-heading">{settings.heading ?? "Let’s find the right panel for your space."}</h2><div><p>{settings.body ?? "Tell us what you have in mind. Share your room dimensions, preferred finish or a question about the range."}</p><a className="button button-light" href={enquiryHref("Quietex project enquiry", "Hi Quietex,\n\nI'd like some help with my project.\n\nSpace / room type:\nRoom dimensions:\nPreferred panels or finishes:\nPostcode:\n\nThank you.")}>{settings.buttonLabel ?? "Request a Quote"}<Arrow diagonal /></a><span className="email-note">Opens your email app · enquiries@quietex.com.au</span></div></div>
  </section>
}

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-main"><div className="footer-brand"><Link href="/" aria-label="Quietex home"><Image unoptimized src={media.logoLight} width={210} height={38} alt="Quietex" /></Link><p>Sound considered.<br />Design, uninterrupted.</p></div><nav aria-label="Footer navigation"><p className="eyebrow">Explore</p><Link href="/#panels">Our panels</Link><Link href="/#spaces">Spaces</Link><Link href="/#about">About Quietex</Link><Link href="/#retailers">Where to buy</Link></nav><div className="footer-contact"><p className="eyebrow">Let’s talk</p><a href="mailto:enquiries@quietex.com.au">enquiries@quietex.com.au <Arrow diagonal /></a><p>For your home, your workspace<br />or your next project.</p></div></div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Quietex</span><p>Images are illustrative. Colours may vary by screen and production batch. Product dimensions may vary by ±5 mm.</p><a href="#main">Back to top ↑</a></div>
  </footer>
}
