export type ImageRole = "product" | "detail" | "lifestyle"
export type RoleImage = { url: string; role: ImageRole }
export function resolveImageRoles(input: { thumbnail?: string | null; images?: { url: string }[]; variants?: { thumbnail?: string | null }[]; metadata?: { image_roles?: RoleImage[] } | null }) {
 const urls = [...new Set([...(input.images || []).map(i=>i.url),input.thumbnail,...(input.variants || []).map(v=>v.thumbnail)].filter((u):u is string=>!!u))]
 const assigned = new Map<string,ImageRole>()
 const ordered: RoleImage[] = []
 for(const image of Array.isArray(input.metadata?.image_roles)?input.metadata!.image_roles!:[]) {
  if(image&&urls.includes(image.url)&&["product","detail","lifestyle"].includes(image.role)&&!assigned.has(image.url)){assigned.set(image.url,image.role);ordered.push(image)}
 }
 for(const url of urls)if(!assigned.has(url))ordered.push({url,role:"product"})
 const product=ordered.filter(i=>i.role==="product"),detail=ordered.filter(i=>i.role==="detail"),lifestyle=ordered.filter(i=>i.role==="lifestyle")
 const gallery=[...product,...detail,...lifestyle]
 const productImage=product[0]?.url||detail[0]?.url||lifestyle[0]?.url||""
 return {imageRoles:ordered,gallery:gallery.map(i=>i.url),productImage,lifestyleImage:lifestyle[0]?.url||productImage,hasLifestyle:lifestyle.length>0}
}
