import schemaData from "../data/site-sections.json"
import { Modules, MedusaError } from "@medusajs/framework/utils"
import type { MedusaContainer } from "@medusajs/framework/types"
export const sectionSchema = schemaData
export type SiteSection = { id: string; type: string; enabled: boolean; settings: Record<string, string> }
export type SiteDocument = { version: 1; announcement: string; sections: SiteSection[] }
export const defaultContent: SiteDocument = {
  version: 1, announcement: "Considered design. Better acoustics.",
  sections: sectionSchema.filter(s => s.type !== "banner").map(s => ({
    id: s.type, type: s.type, enabled: true,
    settings: Object.fromEntries(s.fields.map(f => [f.key, f.default])),
  })),
}
export type ContentState = { revision: number; draft: SiteDocument; published: SiteDocument; previousPublished: SiteDocument | null; updatedAt: string | null; publishedAt: string | null }
const bad = (message: string): never => { throw new MedusaError(MedusaError.Types.INVALID_DATA, message) }
export function validateContent(value: unknown): SiteDocument {
  if (!value || typeof value !== "object") return bad("Content must be an object")
  const doc = value as SiteDocument
  if (doc.version !== 1 || typeof doc.announcement !== "string" || doc.announcement.length > 250) return bad("Invalid announcement")
  if (!Array.isArray(doc.sections) || doc.sections.length < 1 || doc.sections.length > 20) return bad("Use between 1 and 20 sections")
  const ids = new Set<string>()
  const sections = doc.sections.map(section => {
    const definition = sectionSchema.find(s => s.type === section?.type)
    if (!definition || !/^[a-zA-Z0-9_-]{1,80}$/.test(section.id) || ids.has(section.id) || typeof section.enabled !== "boolean") return bad("Invalid or duplicate section")
    ids.add(section.id)
    if (!section.settings || typeof section.settings !== "object") return bad("Missing section settings")
    const settings = Object.fromEntries(definition.fields.map(field => {
      const text = section.settings[field.key]
      if (typeof text !== "string" || text.length > (field.kind === "textarea" ? 5000 : 2000)) return bad(`Invalid ${field.label}`)
      if (field.kind === "image" && text && !/^https:\/\/[^\s]+$/i.test(text)) return bad("Image URLs must use HTTPS")
      if (field.kind === "link" && text && !/^(https:\/\/[^\s]+|\/(?!\/)[^\s]*|#[^\s]*)$/i.test(text)) return bad("Links must be HTTPS, a site path or a section anchor")
      return [field.key, text]
    }))
    return { id: section.id, type: section.type, enabled: section.enabled, settings }
  })
  return { version: 1, announcement: doc.announcement, sections }
}
export async function readContent(container: MedusaContainer) {
  const storeService = container.resolve(Modules.STORE)
  const [store] = await storeService.listStores({}, { take: 1 })
  if (!store) throw new Error("Store is not configured")
  const saved = store.metadata?.quietex_site as ContentState | undefined
  const state: ContentState = saved || { revision: 0, draft: defaultContent, published: defaultContent, previousPublished: null, updatedAt: null, publishedAt: null }
  return { store, state, storeService }
}
export async function writeContent(container: MedusaContainer, action: string, revision: number, content: unknown) {
  if (!["draft", "publish", "restore"].includes(action)) return bad("Unknown content action")
  const document = action === "restore" ? null : validateContent(content)
  return container.resolve(Modules.LOCKING).execute("quietex-website-content", async () => {
    const { store, state, storeService } = await readContent(container)
    if (revision !== state.revision) throw new MedusaError(MedusaError.Types.CONFLICT, "Another editor saved changes. Reload before saving to avoid overwriting them.")
    const now = new Date().toISOString()
    const next: ContentState = { ...state, revision: state.revision + 1, updatedAt: now }
    if (action === "restore") {
      if (!state.previousPublished) return bad("There is no previous published version")
      next.draft = state.previousPublished
      next.published = state.previousPublished
      next.previousPublished = state.published
      next.publishedAt = now
    } else {
      next.draft = document!
      if (action === "publish") {
        next.previousPublished = state.published
        next.published = document!
        next.publishedAt = now
      }
    }
    await storeService.updateStores(store.id, { metadata: { ...store.metadata, quietex_site: next } })
    return next
  }, { timeout: 10 })
}
