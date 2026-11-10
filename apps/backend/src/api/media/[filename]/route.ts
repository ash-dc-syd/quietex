import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import type { IFileModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { pipeline } from "node:stream/promises"
import type { Readable } from "node:stream"

const imageTypes: Record<string, string> = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp", gif: "image/gif", avif: "image/avif" }
// Only raster images are public. Bucket exports and other private files stay private.
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const key = req.params.filename
  const extension = key.split(".").pop()?.toLowerCase() || ""
  if (!process.env.S3_BUCKET || !/^[^/\\\x00-\x1f]{1,240}-[0-9A-HJKMNP-TV-Z]{26}\.[a-zA-Z0-9]+$/.test(key) || !imageTypes[extension]) {
    res.status(404).end(); return
  }
  try {
    const files = req.scope.resolve<IFileModuleService>(Modules.FILE)
    const stream = await files.getDownloadStream(key) as Readable
    res.setHeader("Content-Type", imageTypes[extension])
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable")
    res.setHeader("X-Content-Type-Options", "nosniff")
    res.setHeader("Content-Security-Policy", "default-src 'none'; sandbox")
    await pipeline(stream, res)
  } catch (error) {
    if (!res.headersSent) { res.setHeader("Cache-Control", "no-store"); res.status(404).end() }
    else res.destroy()
  }
}
