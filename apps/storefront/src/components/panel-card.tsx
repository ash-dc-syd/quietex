import Image from "next/image"
import Link from "next/link"
import type { Panel } from "@/lib/products"
import { Arrow } from "./icons"

export function PanelCard({ panel, showViewLabel = false }: { panel: Panel; showViewLabel?: boolean }) {
  return <Link href={`/product/${panel.handle}`} className="panel-card">
    <div className={`panel-image${panel.hasLifestyle?" panel-image-lifestyle":""}${panel.lifestyleImage!==panel.productImage?" panel-image-swap":""}`}>{panel.lifestyleImage && <Image className="panel-default-image" unoptimized src={panel.lifestyleImage} width={768} height={768} alt={`${panel.title}${panel.hasLifestyle?" in a room":" acoustic panel"}`} />}{panel.productImage&&panel.lifestyleImage!==panel.productImage&&<Image className="panel-hover-image" unoptimized src={panel.productImage} width={768} height={768} alt="" aria-hidden="true"/>}{showViewLabel&&<span className="panel-view-label">{panel.hasLifestyle?<><span className="panel-view-default">Lifestyle</span><span className="panel-view-hover">Panel</span></>:"Panel"}</span>}<span className="panel-open"><Arrow diagonal /></span></div>
    <div className="panel-name"><h3>{panel.title}</h3></div>
    <p>{showViewLabel&&<span className="finish-preview-dots" aria-hidden="true">{panel.finishes.map(f=><span key={f.id} title={f.name}>{f.image&&<Image unoptimized src={f.image} width={20} height={20} alt=""/>}</span>)}</span>}{panel.finishes.length} {panel.finishes.length === 1 ? "finish" : "finishes"} available</p>
  </Link>
}
