import Image from "next/image"
import Link from "next/link"
import type { Panel } from "@/lib/products"
import { Arrow } from "./icons"

export function PanelCard({ panel, showFinishes = false, displayFinish }: { panel: Panel; showFinishes?: boolean; displayFinish?: Panel["finishes"][number] }) {
  const lifestyleImage = panel.hasLifestyle ? panel.lifestyleImage : displayFinish?.image || panel.lifestyleImage
  const productImage = displayFinish?.image || panel.productImage
  const hasLifestyle = panel.hasLifestyle
  return <Link href={`/product/${panel.handle}`} className="panel-card">
    <div className={`panel-image${hasLifestyle?" panel-image-lifestyle":""}${lifestyleImage!==productImage?" panel-image-swap":""}`}>{lifestyleImage && <Image className="panel-default-image" unoptimized src={lifestyleImage} width={768} height={768} alt={`${panel.title}${displayFinish?` in ${displayFinish.name}`:hasLifestyle?" in a room":" acoustic panel"}`} />}{productImage&&lifestyleImage!==productImage&&<Image className="panel-hover-image" unoptimized src={productImage} width={768} height={768} alt="" aria-hidden="true"/>}<span className="panel-open"><Arrow diagonal /></span></div>
    <div className="panel-name"><h3>{panel.title}</h3></div>
    {displayFinish&&<p className="panel-matching-finish">{displayFinish.name}</p>}
    <p>{showFinishes&&<span className="finish-preview-dots" aria-hidden="true">{panel.finishes.map(f=><span key={f.id} title={f.name}>{f.image&&<Image unoptimized src={f.image} width={20} height={20} alt=""/>}</span>)}</span>}{panel.finishes.length} {panel.finishes.length === 1 ? "finish" : "finishes"} available</p>
  </Link>
}
