import Image from "next/image"
import Link from "next/link"
import { Arrow, SoundLines } from "./icons"
import { SiteHeader } from "./site-header"
import { EnquirySection, Retailers, SiteFooter } from "./site-footer"
import { PanelCard } from "./panel-card"
import { enquiryHref } from "@/lib/catalogue"
import { defaultContent, type SiteDocument } from "@/lib/site-content"
import type { Panel } from "@/lib/products"
const lines = (text: string) => text.split("\n").map((line, i) => <span key={i}>{i > 0 && <br />}{line}</span>)
export default function HomeView({ panels, content = defaultContent }: { panels: Panel[]; content?: SiteDocument }) {
 return <div className="homepage"><SiteHeader announcement={content.announcement} /><main id="main">{content.sections.filter(s=>s.enabled).map((section,index)=>{
 const s=section.settings
 const id=(type:string,anchor:string)=>content.sections.find(x=>x.type===type&&x.enabled)?.id===section.id?anchor:section.id
 let node
 switch(section.type) {
 case "hero": node=<section className="hero" aria-label={s.heading}>{s.image&&<Image unoptimized src={s.image} alt={s.alt} fill priority={index===0} sizes="100vw" className="hero-image" />}<div className="hero-shade" /><div className="hero-copy"><p className="eyebrow">{s.eyebrow}</p><h1>{s.heading}<br /><em>{s.accent}</em></h1><p className="hero-description">{lines(s.body)}</p><div className="hero-actions"><Link href={s.primaryUrl||"#panels"} className="button button-light">{s.primaryLabel}<Arrow /></Link><Link href={s.secondaryUrl||"#enquire"} className="underlined-link">{s.secondaryLabel}<Arrow diagonal /></Link></div></div><div className="hero-caption"><span>{s.caption}</span><span>Room visualisation</span></div></section>;break
 case "benefits": node=<section className="benefit-strip" aria-label="Acoustic panel benefits"><div><SoundLines /><span>{s.one}</span></div><div><span className="material-icon" aria-hidden="true" /><span>{s.two}</span></div><div><span className="square-icon" aria-hidden="true" /><span>{s.three}</span></div></section>;break
 case "collection": {
 const featured=s.handles.split(",").map(handle=>panels.find(p=>p.handle===handle.trim())).filter((p):p is Panel=>!!p)
 node=<section className="collection section-wrap" id={id("collection","panels")}><div className="section-heading"><div><p className="eyebrow">{s.eyebrow}</p><h2>{s.heading}<br /><em>{s.accent}</em></h2></div><div className="section-description"><p>{s.body}</p><Link className="text-link" href="/our-products">{s.linkLabel}<Arrow diagonal /></Link></div></div><div className="panel-grid">{(featured.length?featured:panels.slice(0,4)).map(panel=><PanelCard panel={panel} key={panel.id}/>)}</div></section>;break }
 case "about": node=<section className="about-section" id={id("about","about")}><div className="about-image">{s.image&&<Image unoptimized src={s.image} alt={s.alt} fill sizes="(max-width: 850px) 100vw, 50vw"/>}<span className="image-caption">Quietex room visualisation</span></div><div className="about-copy"><p className="eyebrow">{s.eyebrow}</p><h2>{lines(s.heading)}</h2><p>{s.body}</p><p>{s.bodyTwo}</p><div className="about-points"><div><span>01</span><p><strong>{s.pointOneTitle}</strong> {s.pointOne}</p></div><div><span>02</span><p><strong>{s.pointTwoTitle}</strong> {s.pointTwo}</p></div></div><Link href="#enquire" className="text-link">{s.linkLabel}<Arrow diagonal/></Link></div></section>;break
 case "spaces": node=<section className="spaces section-wrap" id={id("spaces","spaces")}><div className="section-heading"><div><p className="eyebrow">{s.eyebrow}</p><h2>{s.heading}<br/><em>{s.accent}</em></h2></div><p className="section-description">{s.body}</p></div><div className="space-grid">{["one","two"].map(key=><a className="space-card" href={enquiryHref(`Quietex ${s[key+"Title"]} project enquiry`)} key={key}><div className="space-image">{s[key+"Image"]&&<Image unoptimized src={s[key+"Image"]} alt={s[key+"Caption"]} fill sizes="(max-width: 650px) 100vw, 50vw"/>}<span className="space-arrow"><Arrow diagonal/></span><span className="image-caption">Room visualisation</span></div><h3>{s[key+"Title"]}</h3><p>{s[key+"Caption"]}</p></a>)}</div></section>;break
 case "faq": node=<section className="faq-section section-wrap"><div><p className="eyebrow">{s.eyebrow}</p><h2>{s.heading}<br/><em>{s.accent}</em></h2><p className="faq-intro">{lines(s.body)}</p><a className="text-link" href={enquiryHref("A question about Quietex panels")}>Ask us a question<Arrow diagonal/></a></div><div className="faq-list">{[1,2,3,4].filter(i=>s[`question${i}`]).map(i=><details key={i}><summary><span className="faq-number">0{i}</span><span>{s[`question${i}`]}</span><span className="plus" aria-hidden="true"/></summary><p>{s[`answer${i}`]}</p></details>)}</div></section>;break
 case "retailers": node=<Retailers settings={s} id={id("retailers","retailers")}/>;break
 case "enquiry": node=<EnquirySection settings={s} id={id("enquiry","enquire")}/>;break
 case "banner": node=<section className="editor-banner section-wrap"><div>{s.image&&<Image unoptimized src={s.image} alt={s.alt} width={1200} height={800}/>}</div><div><p className="eyebrow">{s.eyebrow}</p><h2>{s.heading}</h2><p>{lines(s.body)}</p><Link className="button button-dark" href={s.buttonUrl||"#enquire"}>{s.buttonLabel}<Arrow diagonal/></Link></div></section>;break
 default:return null
 }
 return <div data-content-section={section.id} key={section.id}>{node}</div>
 })}</main><SiteFooter/></div>
}
