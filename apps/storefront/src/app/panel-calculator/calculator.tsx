"use client"

import { useState } from "react"
import Link from "next/link"
import { Arrow } from "@/components/icons"
import { calculatePanels, type PanelSize } from "@/lib/panel-calculator"

type Panel = { handle: string; title: string; size: PanelSize | null; finishes: string[] }
type Estimate = ReturnType<typeof calculatePanels>

export default function Calculator({ panels }: { panels: Panel[] }) {
  const [panel, setPanel] = useState(""), [finish, setFinish] = useState("")
  const [width, setWidth] = useState(""), [height, setHeight] = useState("")
  const [rotated, setRotated] = useState(false), [allowance, setAllowance] = useState(10)
  const [result, setResult] = useState<Estimate | null>(null), [error, setError] = useState("")
  const selected = panels.find(p => p.handle === panel)
  const size = selected?.size ? (rotated ? { widthMm: selected.size.heightMm, heightMm: selected.size.widthMm } : selected.size) : null
  function clear() { setResult(null); setError("") }
  function calculate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); clear()
    if (!size) { setError("Choose a panel with published dimensions, or contact us for help."); return }
    try { setResult(calculatePanels(Number(width), Number(height), size, allowance)) }
    catch (e) { setError((e as Error).message) }
  }
  const quote = result && size && selected ? `/contact?${new URLSearchParams({
    panel, finish, quantity: String(result.total), subject: "Panel calculator quote request",
    message: `Panel calculator estimate — please confirm layout and quantity.\nWall: ${width} m wide × ${height} m high (${result.area.toFixed(2)} m²).\nPanel: ${selected.title}, ${size.widthMm} mm wide × ${size.heightMm} mm high.\nLayout: ${result.columns} columns × ${result.rows} rows = ${result.base} panels.\nExtra allowance: ${allowance}% (${result.extra} panels). Estimated total: ${result.total} panels.\nFull rectangular coverage; openings not deducted and offcuts not reused.`,
  })}` : "/contact"

  return <div className="calculator-card enquiry-form">
    {panels.length === 0 ? <p role="status">Panel sizes are temporarily unavailable. <Link href="/contact">Send us your wall dimensions</Link> and we’ll help with an estimate.</p> : <>
    <form onSubmit={calculate}>
      <fieldset><legend className="sr-only">Calculate your panel quantity</legend>
        <div className="form-two"><label>Wall width (metres) *<input type="number" inputMode="decimal" min="0.01" max="30" step="0.001" required value={width} placeholder="e.g. 3.6" onChange={e => { setWidth(e.target.value); clear() }}/></label>
        <label>Wall height (metres) *<input type="number" inputMode="decimal" min="0.01" max="30" step="0.001" required value={height} placeholder="e.g. 2.4" onChange={e => { setHeight(e.target.value); clear() }}/></label></div>
        <div className="form-two"><label>Panel *<select required value={panel} onChange={e => { setPanel(e.target.value); setFinish(""); setRotated(false); clear() }}><option value="">Choose a panel</option>{panels.map(p => <option key={p.handle} value={p.handle}>{p.title}</option>)}</select></label>
        <label>Finish <small>optional</small><select value={finish} disabled={!selected} onChange={e => setFinish(e.target.value)}><option value="">Please advise</option>{selected?.finishes.map(f => <option key={f}>{f}</option>)}</select></label></div>
        {selected && !size && <p className="form-error">This panel needs a custom estimate. <Link href={`/contact?${new URLSearchParams({ panel, subject: "Panel quantity advice" })}`}>Ask us about quantities.</Link></p>}
        {size && <p className="calculator-size">Panel layout: <strong>{size.widthMm} mm wide × {size.heightMm} mm high</strong></p>}
        <div className="form-two"><label>Panel orientation<select value={rotated ? "rotated" : "upright"} disabled={!size || size.widthMm === size.heightMm} onChange={e => { setRotated(e.target.value === "rotated"); clear() }}><option value="upright">Tall edge upright</option><option value="rotated">Wide edge across</option></select></label>
        <label>Extra allowance<select value={allowance} onChange={e => { setAllowance(Number(e.target.value)); clear() }}><option value={0}>None</option><option value={10}>10% extra</option><option value={15}>15% extra</option></select></label></div>
        <p className="form-privacy">Whole panels are counted before any extra allowance. Rotation may affect the pattern or grain direction; confirm your preferred layout with us.</p>
        {error && <p role="alert" className="form-error">{error}</p>}
        <button type="submit" className="button button-dark" disabled={!!selected && !size}>Calculate panels<Arrow diagonal/></button>
      </fieldset>
    </form>
    {result && size && <section className="calculator-result" aria-label="Panel estimate" aria-live="polite">
      <p className="eyebrow">YOUR ESTIMATED QUANTITY</p><h2>{result.total}<span> panels</span></h2>
      <p>{result.base} for the layout + {result.extra} extra ({allowance}% allowance)</p>
      <svg className="calculator-wall" viewBox={`0 0 ${result.wallWidthMm} ${result.wallHeightMm}`} role="img" aria-label={`Wall layout: ${result.columns} columns and ${result.rows} rows, with edge panels trimmed to fit`}>
        <defs><pattern id="panel-grid" width={size.widthMm} height={size.heightMm} patternUnits="userSpaceOnUse"><rect width={size.widthMm} height={size.heightMm} fill="#d7dfd1" stroke="#63735e" strokeWidth="2" vectorEffect="non-scaling-stroke"/></pattern></defs>
        <rect width={result.wallWidthMm} height={result.wallHeightMm} fill="url(#panel-grid)"/>
      </svg>
      <p className="calculator-layout">{result.area.toFixed(2)} m² wall · {result.columns} columns × {result.rows} rows</p>
      <p className="form-privacy">Layout illustration only. Edge panels may need trimming. Cutting, pattern matching, gaps and installation details can change the final quantity.</p>
      <Link className="button button-dark" href={quote}>Request a Quote<Arrow diagonal/></Link>
    </section>}
    </>}
  </div>
}
