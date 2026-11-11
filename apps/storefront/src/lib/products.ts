import "server-only"
import { resolveImageRoles, type RoleImage } from "./image-roles"
import { medusaFetch } from "./medusa"

export type Panel = {
  id: string; title: string; handle: string; description: string; thumbnail: string;
  images: string[]; productImage: string; lifestyleImage: string; hasLifestyle: boolean;
  specifications: { name: string; value: string }[];
  finishes: { id: string; name: string; image: string }[];
}
type ApiProduct = {
  id: string; title: string; handle: string; description?: string; thumbnail?: string;
  images?: {url:string}[];
  metadata?: { image_roles?: RoleImage[]; specifications?: { name: string; value: string }[]; finish_images?: Record<string, string> };
  variants?: { id: string; title: string; thumbnail?: string }[];
}
export async function getPanels(handle?: string): Promise<Panel[]> {
  const query = new URLSearchParams({ limit: "100", fields: "id,title,handle,description,thumbnail,images.url,metadata,variants.id,variants.title,variants.thumbnail" })
  if (handle) query.set("handle", handle)
  const result = await medusaFetch<{ products: ApiProduct[] }>(`/store/products?${query}`)
  return result.products.map(p => {
    const media = resolveImageRoles(p)
    return ({
    id: p.id, title: p.title, handle: p.handle, description: p.description || "", thumbnail: p.thumbnail || "",
    images: media.gallery, productImage:media.productImage, lifestyleImage:media.lifestyleImage, hasLifestyle:media.hasLifestyle,
    specifications: Array.isArray(p.metadata?.specifications) ? p.metadata.specifications : [],
    finishes: (p.variants || []).map(v => ({ id: v.id, name: v.title, image: v.thumbnail || p.metadata?.finish_images?.[v.title] || p.thumbnail || "" })),
  })}).sort((a,b) => a.title.localeCompare(b.title))
}
