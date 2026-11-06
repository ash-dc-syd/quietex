import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { readContent, writeContent, sectionSchema } from "../../../lib/site-content"
export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const { state } = await readContent(req.scope)
  res.setHeader("Cache-Control", "no-store")
  const { data: products } = await req.scope.resolve(ContainerRegistrationKeys.QUERY).graph({ entity: "product", fields: ["id", "title", "handle", "thumbnail"], filters: { status: "published" } })
  res.json({ state, products, schema: sectionSchema, storefrontUrl: process.env.STOREFRONT_URL || "https://quietex-production.up.railway.app" })
}
export async function POST(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const body = req.body as { action: string; revision: number; content: unknown }
  const state = await writeContent(req.scope, body?.action, body?.revision, body?.content)
  res.json({ state })
}
