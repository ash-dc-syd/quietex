import Image from "next/image"
import Link from "next/link"
import { Arrow } from "@/components/icons"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter, EnquirySection, Retailers } from "@/components/site-footer"
import { legacyMediaUrl } from "@/lib/legacy-media"
import { medusaFetch } from "@/lib/medusa"
import { defaultContent, type SiteDocument } from "@/lib/site-content"

export const dynamic = "force-dynamic"
export const metadata = {
  title: "About Quietex",
  description: "Get to know Quietex: acoustic panels for Australian homes, home theatres and workspaces, with considered patterns, finishes and help choosing your panels.",
  alternates: { canonical: "/about/" },
}
const qualities = [
  { title: "Consider the sound.", body: "Acoustic felt helps soften reflected sound, making it a considered addition to rooms with bare walls and hard surfaces." },
  { title: "Find your finish.", body: "From understated neutrals to richer colours and timber tones, explore the finishes available for each panel." },
  { title: "Work with your space.", body: "Create a feature behind your screen, bring texture to a living room or plan a panel layout for your workspace." },
  { title: "Choose with confidence.", body: "Ask us about panel dimensions, finishes and product documentation before you make your selection." },
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
        <div className="about-hero-copy"><p className="eyebrow">About Quietex</p><h1 id="about-title">Sound, texture.<br /><em>A sense of quiet.</em></h1><p>Acoustic panels that bring the sound of a room<br className="about-desktop-break" /> and the way it looks together.</p><Link className="underlined-link" href="/our-products/">Explore our panels <Arrow diagonal /></Link></div>
      </section>
      <section className="section-wrap about-story" aria-labelledby="about-story-title">
        <div><p className="eyebrow">Sound meets design</p><h2 id="about-story-title">{settings.heading}</h2></div>
        <div className="about-story-body"><p className="about-lead">Quietex brings acoustic panels to homes, home theatres and workspaces across Australia.</p><p>{settings.body}</p>{settings.bodyTwo && <p>{settings.bodyTwo}</p>}<p>We believe sound deserves a place in the design of a room. Our range brings together different patterns, textures and finishes so you can choose panels that feel at home in your space.</p><Link className="text-link" href="/contact-us/">Tell us about your project <Arrow diagonal /></Link></div>
      </section>
      <section className="section-wrap about-material" aria-labelledby="about-material-title">
        <figure className="about-material-photo"><Image unoptimized src="/wp-content/uploads/2026/02/adele-profile-image.webp" alt="Close view of the Adele acoustic panel’s felt texture and profile" width={1024} height={1024} sizes="(max-width: 800px) 100vw, 45vw" /><figcaption>A closer look at Adele. Explore each panel for its available finishes.</figcaption></figure>
        <div className="about-material-copy"><p className="eyebrow">Our material, considered</p><h2 id="about-material-title">Texture you can see.<br /><em>Sound you can shape.</em></h2><p className="about-material-intro">PET felt is at the heart of our acoustic panels. It brings a tactile surface to interiors while helping manage reflections within the room.</p><div className="about-qualities">{qualities.map(quality => <div key={quality.title}><h3>{quality.title}</h3><p>{quality.body}</p></div>)}</div></div>
      </section>
      <section className="section-wrap about-guidance" aria-labelledby="about-guidance-title"><p className="eyebrow">A little help picturing it</p><h2 id="about-guidance-title">Your room.<br /><em>Let’s find its Quietex.</em></h2><div><p>Not sure where to start? Send us a photo of your space and tell us which panels you like. Our team will create a mockup showing the panels in your room and help estimate what you need.</p><Link className="text-link" href="/room-preview/">See it in your space <Arrow diagonal /></Link></div></section>
      <Retailers />
      <EnquirySection />
    </main>
    <SiteFooter />
  </div>
}
