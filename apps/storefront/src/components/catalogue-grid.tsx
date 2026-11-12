"use client"
import { useState } from "react"
import type { Panel } from "@/lib/products"
import { PanelCard } from "./panel-card"

const filters = ["All panels", "Dark", "Light", "Colour", "Timber tones"] as const
function matches(panel: Panel, filter: string) {
  const finishes = panel.finishes.map(f => f.name).join(" ")
  if (filter === "Dark") return /black|navy|midnight|dark/i.test(finishes)
  if (filter === "Light") return /white|grey|gray|sandstone/i.test(finishes)
  if (filter === "Colour") return /blue|moss|green/i.test(finishes)
  if (filter === "Timber tones") return /wood|walnut|oak/i.test(finishes)
  return true
}
export default function CatalogueGrid({ panels }: { panels: Panel[] }) {
  const [filter, setFilter] = useState<string>("All panels")
  const visible = panels.filter(p => matches(p, filter))
  return <><div className="catalogue-bar"><div className="catalogue-filters" role="group" aria-label="Filter by finish tone">{filters.map(name => <button key={name} type="button" aria-pressed={filter===name} onClick={()=>setFilter(name)}>{name}</button>)}</div><p aria-live="polite">{visible.length} {visible.length===1?"panel":"panels"}</p></div>
    <div className="panel-grid">{visible.map(panel=><PanelCard panel={panel} key={panel.id} showViewLabel/>)}</div>
    {visible.length===0 && <p className="catalogue-empty">No panels match this finish group. <button type="button" onClick={()=>setFilter("All panels")}>Show all panels</button></p>}
  </>
}
