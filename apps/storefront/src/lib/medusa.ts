import "server-only"

/** Server-only catalogue transport. Do not call during static page generation. */
export async function medusaFetch<T>(path: string): Promise<T> {
  const baseUrl = process.env.MEDUSA_BACKEND_URL
  const key = process.env.MEDUSA_PUBLISHABLE_KEY
  if (!baseUrl || !key) throw new Error("Medusa catalogue connection is not configured")
  if (!path.startsWith("/store/")) throw new Error("Only Store API paths are supported")

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}${path}`, {
    headers: { "x-publishable-api-key": key },
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  })
  if (!response.ok) throw new Error(`Catalogue request failed (${response.status})`)
  return response.json() as Promise<T>
}
