import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Photo } from "@medusajs/icons"
import { useEffect, useState } from "react"
import type { AboutHeader, AboutPageState } from "../../../lib/about-page"
import "./style.css"
type Payload = { state: AboutPageState; storefrontUrl: string }
async function request(method = "GET", body?: unknown): Promise<Payload> {
  const response = await fetch("/admin/about-page", { method, credentials: "include", headers: { "Content-Type": "application/json" }, ...(body ? { body: JSON.stringify(body) } : {}) })
  const result = await response.json()
  if (!response.ok) throw new Error(result.message || "Could not load or save the About page")
  return result
}
export default function AboutPageEditor() {
  const [data, setData] = useState<Payload | null>(null)
  const [header, setHeader] = useState<AboutHeader | null>(null)
  const [saved, setSaved] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const dirty = !!header && JSON.stringify(header) !== saved
  const load = async () => { try { const next = await request(); setData(next); setHeader(next.state.header); setSaved(JSON.stringify(next.state.header)); setError("") } catch (e) { setError((e as Error).message) } }
  useEffect(() => { void load() }, [])
  useEffect(() => { const warn = (e: BeforeUnloadEvent) => { if (dirty) { e.preventDefault(); e.returnValue = "" } }; window.addEventListener("beforeunload", warn); return () => window.removeEventListener("beforeunload", warn) }, [dirty])
  const update = (key: keyof AboutHeader, value: string) => setHeader(current => current ? { ...current, [key]: value } : current)
  const upload = async (file: File, field: "image" | "materialImage" = "image") => {
    if (!["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"].includes(file.type) || file.size > 10 * 1024 * 1024) { setError("Choose a JPG, PNG, WebP, AVIF or GIF up to 10 MB."); return }
    setBusy(true); setError(""); setMessage("")
    try { const body = new FormData(); body.append("files", file); const response = await fetch("/admin/uploads", { method: "POST", credentials: "include", body }); const result = await response.json(); if (!response.ok || !result.files?.[0]?.url) throw new Error(result.message || "Image upload failed"); update(field, result.files[0].url); setMessage("Image uploaded. Save About page to publish it.") } catch (e) { setError((e as Error).message) } finally { setBusy(false) }
  }
  const save = async () => {
    if (!data || !header) return
    setBusy(true); setError(""); setMessage("")
    try { const result = await request("POST", { revision: data.state.revision, header }); setData({ ...data, state: result.state }); setHeader(result.state.header); setSaved(JSON.stringify(result.state.header)); setMessage("About page saved. Your images and header are live.") } catch (e) { setError((e as Error).message) } finally { setBusy(false) }
  }
  return <div className="qa-editor"><header><div><h1>About page</h1><p>Manage the header and material-section panel photo separately. Upload an image, then save to publish.</p></div>{data && <a href={`${data.storefrontUrl.replace(/\/$/, "")}/about/`} target="_blank" rel="noreferrer">View About page</a>}</header>{error && <p role="alert">{error}</p>}{message && <p role="status">{message}</p>}{header ? <><div className="qa-actions"><span>{busy ? "Saving or uploading…" : dirty ? "Unsaved page changes" : "Page is up to date"}</span><button disabled={busy || !dirty} onClick={save}>Save About page</button><button disabled={busy} onClick={() => { if (!dirty || window.confirm("Reload saved page? Unsaved changes will be lost.")) void load() }}>Reload saved page</button></div><div className="qa-layout"><fieldset disabled={busy}><legend>Page header</legend><label>Header image URL<input type="url" value={header.image} maxLength={2000} placeholder="https://…" onChange={e => update("image", e.target.value)} /></label><label>Upload header image<input type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" onChange={e => { const file = e.target.files?.[0]; if (file) void upload(file); e.target.value = "" }} /></label><p className="qa-hint">Use a landscape photo. Until you choose one, the current About image remains visible. This image only appears in the About page header.</p><label>Image description<input value={header.alt} maxLength={200} onChange={e => update("alt", e.target.value)} /></label><label>Heading<input value={header.heading} maxLength={200} required onChange={e => update("heading", e.target.value)} /></label><label>Second heading line<input value={header.accent} maxLength={200} onChange={e => update("accent", e.target.value)} /></label><label>Short description<textarea rows={4} value={header.description} maxLength={1000} onChange={e => update("description", e.target.value)} /></label></fieldset><section className="qa-preview" aria-label="Header preview"><p className="qa-hint">Header preview</p>{header.image && <img src={header.image} alt={header.alt} />}<p className="qa-eyebrow">About Quietex</p><h2>{header.heading}<em>{header.accent}</em></h2><p>{header.description}</p></section><fieldset disabled={busy}><legend>Material section · panel photo</legend><label>Panel photo URL<input type="url" value={header.materialImage} maxLength={2000} onChange={e => update("materialImage", e.target.value)} /></label><label>Upload panel photo<input type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" onChange={e => { const file = e.target.files?.[0]; if (file) void upload(file, "materialImage"); e.target.value = "" }} /></label><p className="qa-hint">Appears beside “Made from PET felt.” on the About page. Product gallery photos stay unchanged.</p><label>Panel photo description<input value={header.materialAlt} maxLength={200} onChange={e => update("materialAlt", e.target.value)} /></label><label>Photo caption<input value={header.materialCaption} maxLength={200} onChange={e => update("materialCaption", e.target.value)} /></label></fieldset><section className="qa-preview qa-material-preview" aria-label="Panel photo preview"><p className="qa-hint">Panel photo preview</p>{header.materialImage && <img src={header.materialImage} alt={header.materialAlt} />}<p>{header.materialCaption}</p></section></div></> : <button onClick={load}>Reload About page</button>}</div>
}
export const config = defineRouteConfig({ label: "About page", icon: Photo })
