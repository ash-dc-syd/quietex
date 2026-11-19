import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { readGallery } from "../../../lib/lifestyle-gallery"
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { state } = await readGallery(req.scope)
  res.setHeader("Cache-Control", "no-store")
  res.json({ images: state.images })
}
