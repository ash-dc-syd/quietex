"use client"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Arrow } from "./icons"
export type LifestylePhoto = { id: string; url: string; alt: string; caption?: string; panelHandle?: string; panelTitle?: string }
export function LifestylePhotos({ photos }: { photos: LifestylePhoto[] }) {
  const [selected, setSelected] = useState<number | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if (selected !== null && !dialog.current?.open) dialog.current?.showModal()
    if (selected === null && dialog.current?.open) dialog.current?.close()
  }, [selected])
  const step = (amount: number) => setSelected(index => index === null ? null : (index + amount + photos.length) % photos.length)
  const current = selected === null ? null : photos[selected]
  return <><div className="lifestyle-photo-grid">{photos.map((photo, index) => <figure key={photo.id}><button type="button" className="lifestyle-photo-open" aria-label={`Enlarge ${photo.alt}`} onClick={() => setSelected(index)}><Image unoptimized src={photo.url} alt={photo.alt} width={1000} height={750} loading="lazy" /><span className="lifestyle-photo-zoom" aria-hidden="true">↗</span></button>{(photo.caption || photo.panelHandle) && <figcaption>{photo.caption && <p>{photo.caption}</p>}{photo.panelHandle && <Link className="text-link" href={`/product/${photo.panelHandle}/`}>View {photo.panelTitle || "panel"}<Arrow diagonal /></Link>}</figcaption>}</figure>)}</div>
    <dialog ref={dialog} className="lifestyle-lightbox" aria-label="Lifestyle photo viewer" onClose={() => setSelected(null)} onClick={e => { if (e.target === e.currentTarget) setSelected(null) }} onKeyDown={e => { if (e.key === "ArrowLeft") { e.preventDefault(); step(-1) } if (e.key === "ArrowRight") { e.preventDefault(); step(1) } }}>
      {current && <div className="lifestyle-lightbox-content"><header><span aria-live="polite">{selected! + 1} / {photos.length}</span><button type="button" autoFocus aria-label="Close photo viewer" onClick={() => setSelected(null)}>Close ×</button></header><img src={current.url} alt={current.alt} /><footer>{photos.length > 1 && <button type="button" aria-label="Previous photo" onClick={() => step(-1)}>← Previous</button>}<p>{current.caption || current.alt}</p>{photos.length > 1 && <button type="button" aria-label="Next photo" onClick={() => step(1)}>Next →</button>}</footer></div>}
    </dialog>
  </>
}
