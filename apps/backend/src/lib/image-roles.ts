export type ImageRole = "product" | "detail" | "lifestyle"
export type RoleImage = { url: string; role: ImageRole }
// Existing Quietex assets reviewed visually; explicit editor assignments override these defaults.
const reviewedRoles: Record<string,ImageRole> = {
  "https://quietex.com.au/wp-content/uploads/2026/02/adele-profile-image-2-1024x1024.webp": "detail",
  "https://quietex.com.au/wp-content/uploads/2026/02/green-stripe-panel-2-1024x1024.webp": "detail",
  "https://quietex.com.au/wp-content/uploads/2026/02/olive-panel-home-theatre-copy-1024x665.webp": "lifestyle",
  "https://quietex.com.au/wp-content/uploads/2026/02/navy-stripe-panel-2-1024x1024.webp": "detail",
  "https://quietex.com.au/wp-content/uploads/2026/02/charlotte-profile-image-2-1024x1024.webp": "detail",
  "https://quietex.com.au/wp-content/uploads/2026/02/charlotte-profile-image-walnut-3-1024x1024.webp": "detail",
  "https://quietex.com.au/wp-content/uploads/2026/02/charlotte-profile-image-walnut-2-1024x1024.webp": "detail",
  "https://quietex.com.au/wp-content/uploads/2026/02/navy-wide-stripe-panel-2-1024x1024.webp": "detail",
  "https://quietex.com.au/wp-content/uploads/2025/12/black-panel-plain-3-1-1024x1024.webp": "detail",
  "https://quietex.com.au/wp-content/uploads/2025/12/navy-panel-plain-2-1024x1024.webp": "detail",
  "https://quietex.com.au/wp-content/uploads/2025/12/navy-panel-pattern-3-1024x1024.webp": "detail",
  "https://quietex.com.au/wp-content/uploads/2025/12/black-panel-pattern-3-1024x1024.webp": "detail",
  "https://quietex.com.au/wp-content/uploads/2025/10/home-theatre-hero.webp": "lifestyle",
  "https://quietex.com.au/wp-content/uploads/2025/12/navy-lin-pattern-home-theatre-copy-1024x682.webp": "lifestyle",
  "https://quietex.com.au/wp-content/uploads/2025/10/office-hero-1024x684.webp": "lifestyle",
  "https://quietex.com.au/wp-content/uploads/2025/12/01-9-1024x576.jpg": "lifestyle",
  "https://quietex.com.au/wp-content/uploads/2026/02/black-soundwave-panel-3-1024x1024.webp": "detail",
  "https://quietex.com.au/wp-content/uploads/2026/02/madeleine-walnut-blue-2-1024x1024.webp": "detail",
  "https://quietex.com.au/wp-content/uploads/2026/02/madeleine-walnut-blue-3-1024x1024.webp": "detail",
  "https://quietex.com.au/wp-content/uploads/2026/02/margot-feat-1-1024x1024.webp": "detail",
  "https://quietex.com.au/wp-content/uploads/2026/02/margot-feat-2-1024x1024.webp": "detail"
}
export function resolveImageRoles(input: { thumbnail?: string | null; images?: { url: string }[]; variants?: { thumbnail?: string | null }[]; metadata?: { image_roles?: RoleImage[] } | null }) {
 const urls = [...new Set([...(input.images || []).map(i=>i.url),input.thumbnail,...(input.variants || []).map(v=>v.thumbnail)].filter((u):u is string=>!!u))]
 const assigned = new Map<string,ImageRole>()
 const ordered: RoleImage[] = []
 for(const image of Array.isArray(input.metadata?.image_roles)?input.metadata!.image_roles!:[]) {
  if(image&&urls.includes(image.url)&&["product","detail","lifestyle"].includes(image.role)&&!assigned.has(image.url)){assigned.set(image.url,image.role);ordered.push(image)}
 }
 for(const url of urls)if(!assigned.has(url))ordered.push({url,role:reviewedRoles[url]||"product"})
 const product=ordered.filter(i=>i.role==="product"),detail=ordered.filter(i=>i.role==="detail"),lifestyle=ordered.filter(i=>i.role==="lifestyle")
 const gallery=[...product,...detail,...lifestyle]
 const productImage=product[0]?.url||detail[0]?.url||lifestyle[0]?.url||""
 return {imageRoles:ordered,gallery:gallery.map(i=>i.url),productImage,lifestyleImage:lifestyle[0]?.url||productImage,hasLifestyle:lifestyle.length>0}
}
