import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { readAboutPage, writeAboutPage } from "../../../lib/about-page"
export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const { state } = await readAboutPage(req.scope)
  res.setHeader("Cache-Control", "no-store")
  res.json({ state, storefrontUrl: process.env.STOREFRONT_URL || "https://quietex-production.up.railway.app" })
}
export async function POST(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const body = req.body as { revision: number; header: unknown }
  const state = await writeAboutPage(req.scope, body?.revision, body?.header)
  res.json({ state })
}
