"use client"
import { useEffect, useId, useRef, useState } from "react"
import Calculator from "@/app/panel-calculator/calculator"
import type { Panel } from "@/lib/products"
import { panelSize } from "@/lib/panel-calculator"
import { Arrow } from "./icons"

export function ProductCalculator({ panel, finish }: { panel: Panel; finish: string }) {
  const [open, setOpen] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const id = useId()
  useEffect(() => {
    if (open && !dialog.current?.open) dialog.current?.showModal()
    if (!open && dialog.current?.open) dialog.current?.close()
  }, [open])
  return <>
    <button className="button button-dark product-quote product-calculator-trigger" type="button" aria-haspopup="dialog" onClick={() => setOpen(true)}>Panel calculator<Arrow diagonal /></button>
    <dialog ref={dialog} className="product-calculator-dialog" aria-labelledby={`${id}-title`} onClose={() => setOpen(false)} onClick={event => { if (event.target === event.currentTarget) setOpen(false) }}>
      <div className="product-calculator-content"><header><div><p className="eyebrow">Plan your wall</p><h2 id={`${id}-title`}>Panel calculator</h2></div><button type="button" className="product-calculator-close" aria-label="Close panel calculator" autoFocus onClick={() => setOpen(false)}>Close ×</button></header>
        <p className="product-calculator-intro">Enter your wall dimensions to estimate how many {panel.title} panels you need.</p>
        <p className="product-calculator-scope">For one rectangular wall, without subtracting doors or windows or reusing offcuts. We’ll confirm the layout and quantity when quoting.</p>
        {open && <Calculator key={`${panel.handle}-${finish}`} panels={[{handle:panel.handle,title:panel.title,size:panelSize(panel.specifications),image:panel.productImage,finishes:panel.finishes.map(f=>({name:f.name,image:f.image}))}]} initialPanel={panel.handle} initialFinish={finish} fixedPanel />}
      </div>
    </dialog>
  </>
}
