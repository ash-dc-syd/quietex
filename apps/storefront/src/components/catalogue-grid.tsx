"use client"
import { useState } from "react"
import type { Panel } from "@/lib/products"
import { finishesForTone, toneFilters, type FinishTone } from "@/lib/finish-filters"
import { PanelCard } from "./panel-card"

export default function CatalogueGrid({ panels }: { panels: Panel[] }) {
  const [filter, setFilter] = useState<FinishTone>("All panels")
  const visible = panels.map(panel => ({ panel, finishes: finishesForTone(panel.finishes, filter) }))
    .filter(item => filter === "All panels" || item.finishes.length > 0)
  return <><div className="catalogue-bar"><div className="catalogue-filters" role="group" aria-label="Filter by finish tone">{toneFilters.map(name => <button key={name} type="button" aria-pressed={filter===name} onClick={()=>setFilter(name)}>{name}</button>)}</div><p aria-live="polite">{visible.length} {visible.length===1?"panel":"panels"}</p></div>
    <div className="panel-grid">{visible.map(({panel,finishes})=><PanelCard panel={panel} key={panel.id} showFinishes displayFinish={filter==="All panels"?undefined:finishes[0]}/>)}</div>
    {visible.length===0 && <p className="catalogue-empty">No panels match this finish group. <button type="button" onClick={()=>setFilter("All panels")}>Show all panels</button></p>}
  </>
}
