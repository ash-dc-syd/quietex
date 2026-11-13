import Image from "next/image"
import Link from "next/link"
import { PetPerformance } from "@/components/pet-performance"
import { Arrow } from "@/components/icons"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter, EnquirySection, Retailers } from "@/components/site-footer"
import { legacyMediaUrl } from "@/lib/legacy-media"
import { medusaFetch } from "@/lib/medusa"
import { defaultContent, type SiteDocument } from "@/lib/site-content"

export const dynamic = "force-dynamic"
export const metadata = {
  title: "About Quietex",
  description: "About Quietex, an Australian acoustic panel brand. Find panels for home theatres, living rooms and workspaces, with help choosing finishes and quantities.",
  alternates: { canonical: "/about/" },
}
const qualities = [
  { title: "Reduce echo.", body: "PET felt helps absorb reflected sound in rooms with bare walls and hard surfaces." },
  { title: "Patterns and finishes.", body: "See each panel’s product page for the colours, patterns and finishes available." },
  { title: "Panel layouts.", body: "Use panels behind a screen, along a living room wall or in an office. We can help you plan the layout." },
  { title: "Product details.", body: "Need dimensions, material details or test documentation? Ask us about the panel you’re considering." },
]
export default async function About() {
  const { content } = await medusaFetch<{ content: SiteDocument }>("/store/site-content").catch(() => ({ content: defaultContent }))
  const defaults = defaultContent.sections.find(section => section.type === "about")!.settings
  const settings = { ...defaults, ...content.sections.find(section => section.type === "about")?.settings }
  const image = legacyMediaUrl(settings.image || defaults.image)
  return <div className="about-page">
    <SiteHeader announcement={content.announcement} />
    <main id="main">
      <section className="about-hero" aria-labelledby="about-title">
        <Image unoptimized src={image} alt={settings.alt || "Quietex panels in a home theatre"} fill priority sizes="100vw" className="about-hero-image" />
        <div className="about-hero-shade" />
        <div className="about-hero-copy"><p className="eyebrow">About Quietex</p><h1 id="about-title">We help you find<br /><em>the right panels.</em></h1><p>Acoustic wall panels for home theatres,<br className="about-desktop-break" /> living rooms and workspaces.</p><Link className="underlined-link" href="/our-products/">Explore our panels <Arrow diagonal /></Link></div>
      </section>
      <section className="section-wrap about-story" aria-labelledby="about-story-title">
        <div><p className="eyebrow">About us</p><h2 id="about-story-title">{settings.heading}</h2></div>
        <div className="about-story-body"><p className="about-lead">Quietex is an Australian acoustic panel brand. You can buy our panels through Digital Cinema, Audio Junction and Instyle HiFi.</p><p>{settings.body}</p>{settings.bodyTwo && <p>{settings.bodyTwo}</p>}<Link className="text-link" href="/contact-us/">Get in touch <Arrow diagonal /></Link></div>
      </section>
      <section className="section-wrap about-material" aria-labelledby="about-material-title">
        <figure className="about-material-photo"><Image unoptimized src="/wp-content/uploads/2026/02/adele-profile-image.webp" alt="Close view of the Adele acoustic panel’s felt texture and profile" width={1024} height={1024} sizes="(max-width: 800px) 100vw, 45vw" /><figcaption>Adele acoustic panel. See the product page for available finishes.</figcaption></figure>
        <div className="about-material-copy"><p className="eyebrow">What our panels are made from</p><h2 id="about-material-title">Made from<br /><em>PET felt.</em></h2><p className="about-material-intro">Our panels use PET felt to help absorb sound reflections. The range includes different surface patterns and finishes to suit your room.</p><div className="about-qualities">{qualities.map(quality => <div key={quality.title}><h3>{quality.title}</h3><p>{quality.body}</p></div>)}</div></div>
      </section>
      <PetPerformance />
      <section className="section-wrap about-guidance" aria-labelledby="about-guidance-title"><p className="eyebrow">Not sure how it will look?</p><h2 id="about-guidance-title">Send us a photo.<br /><em>We’ll show you.</em></h2><div><p>Send us a photo of your wall and tell us which panels you like. We’ll put together a mockup and help estimate how many panels you’ll need.</p><Link className="text-link" href="/room-preview/">See it in your space <Arrow diagonal /></Link></div></section>
      <Retailers />
      <EnquirySection />
    </main>
    <SiteFooter />
  </div>
}
