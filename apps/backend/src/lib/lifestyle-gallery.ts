import type { MedusaContainer } from "@medusajs/framework/types"
import { MedusaError, Modules } from "@medusajs/framework/utils"
import { readContent } from "./site-content"
import { validateGallery, type GalleryImage } from "./gallery-data"
export type GalleryState = { revision: number; images: GalleryImage[] }
export async function readGallery(container: MedusaContainer) {
  const { store, state, storeService } = await readContent(container)
  const saved = store.metadata?.quietex_gallery as GalleryState | undefined
  // Start with the existing homepage space photos, without implying customer installations.
  const spaces = state.published.sections.find(section => section.type === "spaces")?.settings
  const images: GalleryImage[] = spaces ? (["one", "two"] as const).flatMap((key, index) => spaces[key + "Image"] ? [{ id: `homepage-${key}`, url: spaces[key + "Image"], alt: spaces[key + "Caption"] || spaces[key + "Title"] || "Quietex room inspiration", caption: spaces[key + "Caption"] || "", space: index === 0 ? "home" as const : "work" as const, panelHandle: "" }] : []) : []
  return { store, storeService, state: saved || { revision: 0, images } }
}
export async function saveGallery(container: MedusaContainer, revision: number, value: unknown) {
  let images: GalleryImage[]
  try { images = validateGallery(value) } catch (error) { throw new MedusaError(MedusaError.Types.INVALID_DATA, (error as Error).message) }
  // Share the homepage lock because both settings live on the same Store metadata.
  return container.resolve(Modules.LOCKING).execute("quietex-website-content", async () => {
    const { store, storeService, state } = await readGallery(container)
    if (revision !== state.revision) throw new MedusaError(MedusaError.Types.CONFLICT, "The gallery changed. Reload before saving.")
    const next = { revision: state.revision + 1, images }
    await storeService.updateStores(store.id, { metadata: { ...store.metadata, quietex_gallery: next } })
    return next
  }, { timeout: 10 })
}
