import {SiteHeader} from "@/components/site-header"
import {SiteFooter} from "@/components/site-footer"
import {getPanels} from "@/lib/products"
import RoomPreviewForm from "./form"
export const dynamic="force-dynamic"
export const metadata={title:"Request a panel mockup",alternates:{canonical:"/room-preview/"},description:"Send us photos of your room and our team will prepare a Quietex panel mockup for you."}
export default async function RoomPreview({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const [panels,params]=await Promise.all([getPanels(),searchParams]);const text=(key:string)=>typeof params[key]==="string"?params[key] as string:""
 return <><SiteHeader/><main id="main" className="contact-page room-preview-page section-wrap"><div className="contact-intro"><p className="eyebrow">SEE IT IN YOUR SPACE</p><h1>Your room.<br/><em>Your Quietex.</em></h1><p>Wondering how acoustic panels could look on your wall? Send us a few photos and your preferred panel and finish.</p><p>Our team will create a mockup showing Quietex panels in your space and help estimate the panels needed. We’ll email it to you and may get in touch if we need more details.</p><p className="contact-note">This is a visual concept. Colours, panel sizes and installation details will be confirmed separately. For the best result, photograph the full wall in good light.</p></div><RoomPreviewForm panels={panels.map(p=>({handle:p.handle,title:p.title,finishes:p.finishes.map(f=>f.name)}))} initialPanel={text("panel")} initialFinish={text("finish")}/></main><SiteFooter/></>
}
