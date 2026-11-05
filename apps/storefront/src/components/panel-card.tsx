import Image from "next/image"
import Link from "next/link"
import { featuredPanels } from "@/lib/catalogue"
import { Arrow } from "./icons"

export function PanelCard({ panel }: { panel: typeof featuredPanels[number] }) {
  return <Link href={panel.href} className="panel-card">
    <div className="panel-image"><Image unoptimized src={panel.image} width={768} height={768} alt={`${panel.name} acoustic panel`} sizes="(max-width: 600px) 80vw, (max-width: 1000px) 45vw, 23vw" /><span className="panel-open"><Arrow diagonal /></span></div>
    <div className="panel-name"><h3>{panel.name}</h3><div className="colour-dots" aria-hidden="true">{panel.tones.map(tone => <span style={{ backgroundColor: tone }} key={tone} />)}</div></div>
    <p>{panel.detail}<span className="sr-only">. {panel.external ? "View on Quietex’s existing website" : "View panel"}.</span></p>
  </Link>
}
