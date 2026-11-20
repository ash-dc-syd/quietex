import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { readAboutPage } from "../../../lib/about-page"
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { state } = await readAboutPage(req.scope)
  res.setHeader("Cache-Control", "no-store")
  res.json({ header: state.header })
}
