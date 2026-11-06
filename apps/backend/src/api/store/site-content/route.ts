import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { readContent } from "../../../lib/site-content"
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { state } = await readContent(req.scope)
  res.setHeader("Cache-Control", "no-store")
  res.json({ content: state.published })
}
