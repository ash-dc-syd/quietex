export const LIVE_ORIGIN = "https://quietex.com.au"
export function siteOrigin(value = process.env.NEXT_PUBLIC_SITE_URL): string {
  const url = new URL(value || LIVE_ORIGIN)
  if (!["https:", "http:"].includes(url.protocol)) throw new Error("Invalid public site URL")
  return url.origin
}
export function isIndexable(host: string | null, enabled = process.env.SITE_INDEXABLE, origin = siteOrigin()): boolean {
  return enabled === "true" && origin === LIVE_ORIGIN && host?.toLowerCase() === new URL(LIVE_ORIGIN).host
}
