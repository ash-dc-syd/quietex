/** Serve migrated WordPress media from this storefront on both preview and live domains. */
export function legacyMediaUrl(value: string): string {
  try {
    const url = new URL(value)
    if (["http:", "https:"].includes(url.protocol) && ["quietex.com.au", "www.quietex.com.au"].includes(url.hostname) && url.pathname.startsWith("/wp-content/uploads/")) {
      return `${url.pathname}${url.search}${url.hash}`
    }
  } catch { /* Relative paths and empty image fields remain unchanged. */ }
  return value
}
