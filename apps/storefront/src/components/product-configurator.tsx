"use client"
import Image from "next/image"
import { useState } from "react"
import type { Panel } from "@/lib/products"
import { Arrow } from "./icons"
export function ProductConfigurator({ panel }: { panel: Panel }) {
  const [finishId, setFinishId] = useState(panel.finishes[0]?.id || "")
  const finish = panel.finishes.find(f => f.id === finishId) || panel.finishes[0]
  const size = panel.specifications.find(s=>s.name==="Size")?.value
  const image = finish?.image || panel.thumbnail
  return <section className="product-stage" aria-labelledby="product-heading"><div className="product-gallery"><div className="product-main-image"><span className="product-image-label">The details make the difference.</span>{image&&<Image unoptimized src={image} alt={`${panel.title} acoustic panel${finish ? ` in ${finish.name}` : ""}`} width={768} height={768} priority />}<div className="product-image-footer"><span>{panel.title}</span><span>{size}</span></div></div><p className="gallery-note">Product imagery is illustrative. Actual colour and finish may vary.</p></div><div className="product-info"><p className="eyebrow">Acoustic wall panel</p><h1 id="product-heading">{panel.title}</h1><p className="product-description">{panel.description}</p><fieldset className="finish-selector"><legend>Choose your finish</legend><div className="finish-options">{panel.finishes.map(f=><label className={`finish-option ${finish?.id===f.id?"selected":""}`} key={f.id}><input type="radio" name="panel-finish" value={f.id} checked={finish?.id===f.id} onChange={()=>setFinishId(f.id)} />{f.image&&<Image unoptimized src={f.image} alt="" width={64} height={64} />}<span>{f.name}</span><span className="finish-check" aria-hidden="true">{finish?.id===f.id?"✓":""}</span></label>)}</div></fieldset><p className="selected-finish" aria-live="polite">{finish?`Selected: ${finish.name}`:"Contact us for available finishes."}</p><a className="button button-dark product-quote" href={`/contact?${new URLSearchParams({panel:panel.handle,finish:finish?.name||"",subject:`Quietex quote enquiry — ${panel.title}`}).toString()}`}>Request a Quote<Arrow diagonal /></a><p className="quote-note">Send an enquiry with your selected panel and finish.</p><a className="text-link" href="#retailers">Speak with a retailer<Arrow /></a></div></section>
}
