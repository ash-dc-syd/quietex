import Image from "next/image"
import Link from "next/link"
import type { Panel } from "@/lib/products"
import { Arrow } from "./icons"

export function PanelCard({ panel }: { panel: Panel }) {
  return <Link href={`/product/${panel.handle}`} className="panel-card">
    <div className="panel-image">{panel.thumbnail && <Image unoptimized src={panel.thumbnail} width={768} height={768} alt={`${panel.title} acoustic panel`} />}<span className="panel-open"><Arrow diagonal /></span></div>
    <div className="panel-name"><h3>{panel.title}</h3></div>
    <p>{panel.finishes.length} {panel.finishes.length === 1 ? "finish" : "finishes"} available</p>
  </Link>
}
