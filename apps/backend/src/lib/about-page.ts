import { Modules, MedusaError } from "@medusajs/framework/utils"
import type { MedusaContainer } from "@medusajs/framework/types"
export type AboutHeader = { image: string; alt: string; heading: string; accent: string; description: string }
export type AboutPageState = { revision: number; header: AboutHeader }
export const defaultAboutHeader: AboutHeader = { image: "", alt: "Quietex panels in a home theatre", heading: "We help you find", accent: "the right panels.", description: "Acoustic wall panels for home theatres, living rooms and workspaces." }
export function validateAboutHeader(value: unknown): AboutHeader {
  const invalid = (): never => { throw new MedusaError(MedusaError.Types.INVALID_DATA, "Enter a valid About header. Images must use HTTPS and text fields must be within their limits.") }
  if (!value || typeof value !== "object") return invalid()
  const input = value as Record<string, unknown>
  const header = {} as AboutHeader
  for (const key of Object.keys(defaultAboutHeader) as (keyof AboutHeader)[]) {
    const text = input[key]
    if (typeof text !== "string" || text.length > (key === "image" ? 2000 : key === "description" ? 1000 : 200)) return invalid()
    header[key] = text.trim()
  }
  if (!header.heading || !header.alt || (header.image && !/^https:\/\/[^\s]+$/i.test(header.image))) return invalid()
  return header
}
export async function readAboutPage(container: MedusaContainer) {
  const service = container.resolve(Modules.STORE)
  const [store] = await service.listStores({}, { take: 1 })
  if (!store) throw new Error("Store is not configured")
  const saved = store.metadata?.quietex_about_page as AboutPageState | undefined
  const state: AboutPageState = { revision: saved?.revision || 0, header: { ...defaultAboutHeader, ...saved?.header } }
  return { service, store, state }
}
export async function writeAboutPage(container: MedusaContainer, revision: number, value: unknown) {
  const header = validateAboutHeader(value)
  return container.resolve(Modules.LOCKING).execute("quietex-website-content", async () => {
    const { service, store, state } = await readAboutPage(container)
    if (revision !== state.revision) throw new MedusaError(MedusaError.Types.CONFLICT, "Another editor saved this page. Reload before saving.")
    const next = { revision: state.revision + 1, header }
    await service.updateStores(store.id, { metadata: { ...store.metadata, quietex_about_page: next } })
    return next
  }, { timeout: 10 })
}
