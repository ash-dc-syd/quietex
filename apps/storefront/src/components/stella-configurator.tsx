"use client"

import Image from "next/image"
import { useState } from "react"
import { enquiryHref, stellaFinishes } from "@/lib/catalogue"
import { Arrow } from "./icons"

export function StellaConfigurator() {
  const [finishId, setFinishId] = useState<string>(stellaFinishes[0].id)
  const finish = stellaFinishes.find(option => option.id === finishId) || stellaFinishes[0]
  return <section className="product-stage" aria-labelledby="product-heading">
    <div className="product-gallery"><div className="product-main-image"><span className="product-image-label">The details make the difference.</span><Image unoptimized key={finish.id} src={finish.image} alt={`Stella acoustic panel in ${finish.name}`} width={768} height={768} priority sizes="(max-width: 850px) 100vw, 55vw" /><div className="product-image-footer"><span>Stella / {finish.shortName}</span><span>600 × 600 mm</span></div></div><p className="gallery-note">Product imagery is illustrative. Actual colour and finish may vary.</p></div>
    <div className="product-info"><p className="eyebrow">Decorative acoustic wall panel</p><h1 id="product-heading">Stella</h1><p className="product-intro">A pattern with a rhythm of its own.</p><p className="product-description">A soundwave-inspired design in wood veneer and polyester fibre. Stella brings texture to your walls while helping reduce echo and reflected sound within the room.</p><div className="product-quick-specs"><span>600 × 600 mm</span><span>23 mm thick</span><span>Wall panel</span></div>
      <fieldset className="finish-selector"><legend>Choose your finish</legend><div className="finish-options">{stellaFinishes.map(option => <label className={`finish-option ${finishId === option.id ? "selected" : ""}`} key={option.id}><input type="radio" name="stella-finish" value={option.id} checked={finishId === option.id} onChange={() => setFinishId(option.id)} /><Image unoptimized src={option.image} alt="" width={64} height={64} /><span>{option.name}</span><span className="finish-check" aria-hidden="true">{finishId === option.id ? "✓" : ""}</span></label>)}</div></fieldset>
      <p className="selected-finish" aria-live="polite">Selected: {finish.name}</p>
      <a className="button button-dark product-quote" href={enquiryHref("Quietex quote enquiry — Stella", `Hi Quietex,\n\nI'm interested in Stella acoustic panels.\n\nFinish: ${finish.name}\nPanel size: 600 × 600 mm\nQuantity required:\nRoom / project details:\nPostcode:\n\nThank you.`)}>Request a Quote<Arrow diagonal /></a><p className="quote-note">Opens your email app with your selected panel and finish.</p><a className="product-retailer-link text-link" href="#retailers">Prefer to speak with a retailer?<Arrow /></a>
      <details className="product-help"><summary>Not sure how many panels you need?<span className="plus" aria-hidden="true" /></summary><p>Each panel measures 600 × 600 mm, covering 0.36 m². Tell us your room dimensions and what you want to achieve. The right amount of acoustic treatment depends on the room and its surfaces.</p></details>
    </div>
  </section>
}
