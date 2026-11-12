import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { getPanels } from "@/lib/products"
import { panelSize } from "@/lib/panel-calculator"
import Calculator from "./calculator"

export const dynamic = "force-dynamic"
export const metadata = { title: "Panel Calculator", description: "Estimate how many Quietex panels you need for your wall and include the result in a quote request." }

export default async function PanelCalculator() {
  const panels = await getPanels().catch(() => [])
  return <><SiteHeader/><main id="main" className="contact-page calculator-page section-wrap">
    <div className="contact-intro"><p className="eyebrow">PLAN YOUR WALL</p><h1>A little measure.<br/><em>A clearer plan.</em></h1>
      <p>Enter the width and height of the wall you want to cover. Choose a panel to estimate the quantity for your project.</p>
      <p className="contact-note">For full coverage of one rectangular wall. The estimate rounds up to whole panels in each row and column, without reusing offcuts or subtracting doors and windows. It does not determine how much acoustic treatment your room needs. We’ll confirm the layout and quantity when quoting.</p>
    </div>
    <Calculator panels={panels.map(p => ({ handle: p.handle, title: p.title, size: panelSize(p.specifications), finishes: p.finishes.map(f => f.name) }))}/>
  </main><SiteFooter/></>
}
