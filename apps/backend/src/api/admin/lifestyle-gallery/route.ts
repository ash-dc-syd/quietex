import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { readGallery, saveGallery } from "../../../lib/lifestyle-gallery"
export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const { state } = await readGallery(req.scope)
  const { data: products } = await req.scope.resolve(ContainerRegistrationKeys.QUERY).graph({ entity: "product", fields: ["id", "title", "handle", "images.url", "metadata"], filters: { status: "published" } })
  res.setHeader("Cache-Control", "no-store")
  res.json({ state, products, storefrontUrl: process.env.STOREFRONT_URL || "https://quietex-production.up.railway.app" })
}
export async function POST(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const body = req.body as { revision: number; images: unknown }
  res.json({ state: await saveGallery(req.scope, body?.revision, body?.images) })
}
