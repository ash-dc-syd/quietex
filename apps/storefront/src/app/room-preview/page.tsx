import {SiteHeader} from "@/components/site-header"
import {SiteFooter} from "@/components/site-footer"
import {getPanels} from "@/lib/products"
import RoomPreviewForm from "./form"
export const dynamic="force-dynamic"
export const metadata={title:"Request a room preview | Quietex",description:"Send us photos of your room and we’ll prepare a Quietex panel visualisation for you."}
export default async function RoomPreview({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const [panels,params]=await Promise.all([getPanels(),searchParams]);const text=(key:string)=>typeof params[key]==="string"?params[key] as string:""
 return <><SiteHeader/><main id="main" className="contact-page room-preview-page section-wrap"><div className="contact-intro"><p className="eyebrow">SEE IT IN YOUR SPACE</p><h1>Your room.<br/><em>Your Quietex.</em></h1><p>Wondering how acoustic panels could look on your wall? Send us a few photos and your preferred panel and finish.</p><p>Our team will prepare an AI-assisted visualisation, review it and email it back to you. We may contact you if we need more details.</p><p className="contact-note">This is a visual concept. Colours, panel sizes and installation details will be confirmed separately. For the best result, photograph the full wall in good light.</p></div><RoomPreviewForm panels={panels.map(p=>({handle:p.handle,title:p.title,finishes:p.finishes.map(f=>f.name)}))} initialPanel={text("panel")} initialFinish={text("finish")}/></main><SiteFooter/></>
}
