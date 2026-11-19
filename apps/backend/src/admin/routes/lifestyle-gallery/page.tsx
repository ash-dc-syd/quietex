import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Photo } from "@medusajs/icons"
import { useEffect, useState } from "react"
import type { GalleryImage } from "../../../lib/gallery-data"
import "./style.css"
type Product = { id: string; title: string; handle: string; images?: { url: string }[]; metadata?: { image_roles?: { url: string; role: string }[] } }
export default function LifestyleGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]), [revision, setRevision] = useState(0), [saved, setSaved] = useState("")
  const [products, setProducts] = useState<Product[]>([]), [space, setSpace] = useState<"home" | "work">("home"), [url, setUrl] = useState("")
  const [busy, setBusy] = useState(false), [loaded, setLoaded] = useState(false), [error, setError] = useState(""), [message, setMessage] = useState("")
  const dirty = loaded && saved !== JSON.stringify(images)
  const load = async () => {
    setBusy(true); setError("")
    try { const r = await fetch("/admin/lifestyle-gallery", { credentials: "include", cache: "no-store" }); const d = await r.json(); if (!r.ok) throw Error(d.message || "Could not load gallery"); setImages(d.state.images); setSaved(JSON.stringify(d.state.images)); setRevision(d.state.revision); setProducts(d.products); setUrl(d.storefrontUrl); setLoaded(true) } catch (e) { setError((e as Error).message) } finally { setBusy(false) }
  }
  useEffect(() => { void load() }, [])
  useEffect(() => { const leave = (e: BeforeUnloadEvent) => { if (dirty) e.preventDefault() }; window.addEventListener("beforeunload", leave); return () => window.removeEventListener("beforeunload", leave) }, [dirty])
  const save = async () => {
    setBusy(true); setError(""); setMessage("")
    try { const r = await fetch("/admin/lifestyle-gallery", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ revision, images }) }); const d = await r.json(); if (!r.ok) throw Error(d.message || "Could not save gallery"); setRevision(d.state.revision); setImages(d.state.images); setSaved(JSON.stringify(d.state.images)); setMessage("Gallery published. Refresh the website to see the changes.") } catch (e) { setError((e as Error).message) } finally { setBusy(false) }
  }
  const add = (url: string, panelHandle = "", alt = "Room inspiration") => setImages(current => [...current, { id: crypto.randomUUID(), url, alt, caption: "", space, panelHandle }])
  const upload = async (files: File[]) => {
    if (files.length + images.length > 100 || files.some(f => !["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"].includes(f.type) || f.size > 10 * 1024 * 1024)) { setError("Use up to 100 photos. Each photo must be JPG, PNG, WebP, AVIF or GIF, up to 10 MB."); return }
    setBusy(true); setError(""); setMessage("")
    try { for (const file of files) { const body = new FormData(); body.append("files", file); const r = await fetch("/admin/uploads", { method: "POST", credentials: "include", body }); const d = await r.json(); if (!r.ok || !d.files?.[0]?.url) throw Error(d.message || "Upload failed"); add(d.files[0].url) } setMessage("Photos uploaded. Check the descriptions and choose Save and publish gallery.") } catch (e) { setError((e as Error).message) } finally { setBusy(false) }
  }
  const change = (id: string, patch: Partial<GalleryImage>) => setImages(current => current.map(image => image.id === id ? { ...image, ...patch } : image))
  const move = (index: number, step: number) => setImages(current => { const next = [...current]; [next[index], next[index + step]] = [next[index + step], next[index]]; return next })
  const library = products.flatMap(product => (product.metadata?.image_roles || []).filter(image => image.role === "lifestyle" && product.images?.some(active => active.url === image.url)).map(image => ({ ...image, product })))
  return <div className="lg-admin"><header><div><p>QUIETEX / PHOTOGRAPHY</p><h1>Lifestyle gallery</h1><p>Manage the At home and At work galleries. Only add photos you have permission to display publicly. Product page photos are managed within each product.</p></div><a href={`${url}/gallery`} target="_blank" rel="noreferrer">View gallery ↗</a></header>
    {error && <p role="alert">{error}</p>}{message && <p role="status">{message}</p>}
    <div className="lg-actions"><span>{busy ? "Working…" : dirty ? "Unsaved gallery changes" : "Saved gallery"}</span><button onClick={() => { if (!dirty || window.confirm("Discard your unsaved gallery changes and reload?")) void load() }} disabled={busy}>Reload gallery</button><button disabled={busy || !dirty} onClick={save}>Save and publish gallery</button></div>
    {!loaded ? <p>{error ? "Reload to try again." : "Loading gallery…"}</p> : <fieldset disabled={busy} className="lg-fields"><legend className="lg-legend">Gallery photos</legend><div className="lg-upload"><label>Add photos to<select value={space} onChange={e => setSpace(e.target.value as "home" | "work")}><option value="home">At home</option><option value="work">At work</option></select></label><label>Upload lifestyle photos<input type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif,image/gif" onChange={e => { const files = Array.from(e.target.files || []); if (files.length) void upload(files); e.target.value = "" }} /></label><p>Upload, add descriptions and captions, then save to publish. Removing a photo here removes it from this gallery only.</p></div>
      {library.length > 0 && <details><summary>Choose from existing product lifestyle photos</summary><div className="lg-library">{library.map(({ url: photoUrl, product }, i) => <button key={`${product.id}-${i}`} disabled={images.length >= 100} onClick={() => add(photoUrl, product.handle, `${product.title} room inspiration`)}><img src={photoUrl} alt="" /><span>Add {product.title}</span></button>)}</div></details>}
      <div className="lg-list">{images.map((image, i) => <article key={image.id}><img src={image.url} alt={image.alt} /><div><label>Gallery<select value={image.space} aria-label={`Photo ${i + 1} gallery`} onChange={e => change(image.id, { space: e.target.value as "home" | "work" })}><option value="home">At home</option><option value="work">At work</option></select></label><label>Photo description (for accessibility)<input maxLength={250} required value={image.alt} onChange={e => change(image.id, { alt: e.target.value })} /></label><label>Caption (optional)<textarea maxLength={500} value={image.caption} onChange={e => change(image.id, { caption: e.target.value })} /></label><label>Featured panel (optional)<select value={image.panelHandle} onChange={e => change(image.id, { panelHandle: e.target.value })}><option value="">No product link</option>{products.map(product => <option key={product.id} value={product.handle}>{product.title}</option>)}</select></label><div className="lg-row-actions"><button disabled={i === 0} aria-label={`Move photo ${i + 1} up`} onClick={() => move(i, -1)}>↑ Move up</button><button disabled={i === images.length - 1} aria-label={`Move photo ${i + 1} down`} onClick={() => move(i, 1)}>↓ Move down</button><button onClick={() => setImages(current => current.filter(item => item.id !== image.id))}>Remove photo {i + 1}</button></div></div></article>)}</div>{!images.length && <p>No gallery photos yet. Upload a photo or choose an existing product photo.</p>}</fieldset>}
  </div>
}
export const config = defineRouteConfig({ label: "Lifestyle gallery", icon: Photo })
