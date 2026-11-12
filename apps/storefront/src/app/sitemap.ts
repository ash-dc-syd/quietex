import type { MetadataRoute } from "next"
import { headers } from "next/headers"
import { isIndexable, siteOrigin } from "@/lib/site-url"
import { getPanels } from "@/lib/products"
export const dynamic = "force-dynamic"
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isIndexable((await headers()).get("host"))) return []
  const panels = await getPanels()
  const paths = ["/", "/our-products/", "/about/", "/contact-us/", "/panel-calculator/", "/room-preview/", ...panels.map(p=>`/product/${p.handle}/`)]
  return paths.map(path => ({ url: `${siteOrigin()}${path}` }))
}
