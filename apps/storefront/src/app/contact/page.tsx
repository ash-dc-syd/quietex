import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { getPanels } from "@/lib/products"
import EnquiryForm from "./form"
export const dynamic="force-dynamic"
export const metadata={title:"Contact Quietex · Request a Quote",alternates:{canonical:"/contact-us/"},description:"Tell us about your space or request a quote for Quietex acoustic panels."}
export default async function Contact({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const [query,panels]=await Promise.all([searchParams,getPanels().catch(()=>[])])
 const text=(key:string)=>typeof query[key]==="string"?query[key] as string:""
 const quantity=/^[1-9]\d{0,5}$/.test(text("quantity"))&&Number(text("quantity"))<=100000?text("quantity"):""
 return <><SiteHeader/><main id="main" className="contact-page section-wrap"><div className="contact-intro"><p className="eyebrow">LET’S TALK ABOUT YOUR SPACE</p><h1>How can we<br/><em>help?</em></h1><p>Tell us what you have in mind. Whether you’re choosing a panel or planning a whole room, send us a few details and we’ll be in touch.</p><p className="contact-note">Panels are supplied through our retail partners. Ask us about finishes, quantities or your project.</p></div><EnquiryForm panels={panels.map(p=>({handle:p.handle,title:p.title,finishes:p.finishes.map(f=>f.name)}))} initialPanel={text("panel")} initialFinish={text("finish")} subject={text("subject")} initialQuantity={quantity} initialMessage={text("message").slice(0,5000)}/></main><SiteFooter/></>
}
