import Image from "next/image"
import Link from "next/link"
import { Arrow, SoundLines } from "./icons"
import { SiteHeader } from "./site-header"
import { EnquirySection, Retailers, SiteFooter } from "./site-footer"
import { PanelCard } from "./panel-card"
import { enquiryHref, featuredPanels, media } from "@/lib/catalogue"

const faqs = [
  ["Will acoustic panels soundproof my room?", "Acoustic panels help reduce echo and reflected sound inside a room. Soundproofing between rooms usually needs additional building treatments. Tell us what you’re trying to achieve and we can help you explore the options."],
  ["How do I choose the right panel?", "Start with the room, the surfaces you want to treat and the look you prefer. Send us your room dimensions and a few details about how you use the space, and we can discuss suitable panels."],
  ["Can I buy Quietex panels online?", "Quietex panels are currently sold through our retail partners, including Digital Cinema, Audio Junction and Instyle HiFi. Contact a retailer for pricing and availability, or send us a project enquiry."],
  ["Can panels be cut to fit?", "Panels can be cut to suit your layout. Check the product material, dimensions and installation requirements with us before cutting or fitting around corners, switches and power points."],
]

export default function HomeView() {
  return <>
    <SiteHeader />
    <main id="main">
      <section className="hero" aria-labelledby="hero-heading">
        <Image unoptimized src={media.theatre} alt="A home theatre interior with dark acoustic wall panels and upholstered cinema seating" fill priority sizes="100vw" className="hero-image" />
        <div className="hero-shade" />
        <div className="hero-copy"><p className="eyebrow">Quietex acoustic panels</p><h1 id="hero-heading">Beautiful spaces.<br /><em>Better sound.</em></h1><p className="hero-description">Less echo. More of what you want to hear.<br />Acoustic panels that belong in your space.</p><div className="hero-actions"><Link href="#panels" className="button button-light">Explore Panels<Arrow /></Link><Link href="#enquire" className="underlined-link">Request a Quote<Arrow diagonal /></Link></div></div>
        <div className="hero-caption"><span>01 — The home theatre</span><span>Room visualisation</span></div>
      </section>
      <section className="benefit-strip" aria-label="Acoustic panel benefits"><div><SoundLines /><span>Less echo, more clarity</span></div><div><span className="material-icon" aria-hidden="true" /><span>Texture you can see and feel</span></div><div><span className="square-icon" aria-hidden="true" /><span>For homes and workspaces</span></div></section>
      <section className="collection section-wrap" id="panels" aria-labelledby="collection-heading">
        <div className="section-heading"><div><p className="eyebrow">01 / Explore the collection</p><h2 id="collection-heading">A quieter room.<br /><em>Your kind of finish.</em></h2></div><div className="section-description"><p>From understated textures to sculpted patterns, find a panel that feels at home in your interior.</p><a className="text-link" href="https://quietex.com.au/our-products/">View the full range<Arrow diagonal /></a></div></div>
        <div className="panel-grid">{featuredPanels.map(panel => <PanelCard panel={panel} key={panel.name} />)}</div>
      </section>
      <section className="about-section" id="about" aria-labelledby="about-heading">
        <div className="about-image"><Image unoptimized src={media.interior} alt="Home cinema interior with textured acoustic panels" fill sizes="(max-width: 850px) 100vw, 50vw" /><span className="image-caption">Quietex room visualisation</span></div>
        <div className="about-copy"><p className="eyebrow">02 / Sound meets design</p><h2 id="about-heading">A room should feel<br />as good as it looks.</h2><p>Bare walls and hard surfaces can leave a room sounding busy. Acoustic panels help soften reflected sound, making space for clearer conversations, music and movie nights.</p><p>Quietex brings acoustic treatment into the design of your room, with finishes you’ll want to make a feature of.</p><div className="about-points"><div><span>01</span><p><strong>Consider the sound.</strong> Reduce unwanted reflections within your room.</p></div><div><span>02</span><p><strong>Make it your own.</strong> Explore colour, material and pattern.</p></div></div><Link href="#enquire" className="text-link">Let’s talk about your space<Arrow diagonal /></Link></div>
      </section>
      <section className="spaces section-wrap" id="spaces" aria-labelledby="spaces-heading"><div className="section-heading"><div><p className="eyebrow">03 / A place for better sound</p><h2 id="spaces-heading">Different spaces.<br /><em>The same consideration.</em></h2></div><p className="section-description">For the films you love, the work you do and the moments in between.</p></div>
        <div className="space-grid">{[
          { title: "At home", caption: "Home theatres, listening rooms & living spaces", image: media.theatre, alt: "Dark home theatre with acoustic wall treatment", subject: "Quietex home project enquiry" },
          { title: "At work", caption: "Offices, studios & commercial interiors", image: media.office, alt: "Workplace interior with acoustic panel finishes", subject: "Quietex commercial project enquiry" },
        ].map(space => <a className="space-card" href={enquiryHref(space.subject)} key={space.title}><div className="space-image"><Image unoptimized src={space.image} alt={space.alt} fill sizes="(max-width: 650px) 100vw, 50vw" /><span className="space-arrow"><Arrow diagonal /></span><span className="image-caption">Room visualisation</span></div><h3>{space.title}</h3><p>{space.caption}</p></a>)}</div>
      </section>
      <section className="faq-section section-wrap" aria-labelledby="faq-heading"><div><p className="eyebrow">A few useful answers</p><h2 id="faq-heading">Good questions.<br /><em>Clear answers.</em></h2><p className="faq-intro">Not sure where to start?<br />We’re happy to help.</p><a className="text-link" href={enquiryHref("A question about Quietex panels")}>Ask us a question<Arrow diagonal /></a></div><div className="faq-list">{faqs.map(([question, answer], index) => <details key={question}><summary><span className="faq-number">0{index + 1}</span><span>{question}</span><span className="plus" aria-hidden="true" /></summary><p>{answer}</p></details>)}</div></section>
      <Retailers /><EnquirySection />
    </main>
    <SiteFooter />
  </>
}
