import type { MetadataRoute } from "next"
import { headers } from "next/headers"
import { isIndexable, siteOrigin } from "@/lib/site-url"
export const dynamic = "force-dynamic"
export default async function robots(): Promise<MetadataRoute.Robots> {
  const index = isIndexable((await headers()).get("host"))
  return index ? { rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/editor-preview"] }, sitemap: `${siteOrigin()}/sitemap.xml` }
    : { rules: { userAgent: "*", disallow: "/" } }
}
