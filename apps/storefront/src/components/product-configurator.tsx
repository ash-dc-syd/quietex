"use client"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import type { Panel } from "@/lib/products"
import { Arrow } from "./icons"
export function ProductConfigurator({ panel }: { panel: Panel }) {
  const [finishId, setFinishId] = useState(panel.finishes[0]?.id || "")
  const [galleryImage, setGalleryImage] = useState<string|null>(panel.productImage||null)
  const finish = panel.finishes.find(f => f.id === finishId) || panel.finishes[0]
  const size = panel.specifications.find(s=>s.name==="Size")?.value
  const image = galleryImage || finish?.image || panel.thumbnail
  const gallery = panel.images
  const thumbsRef = useRef<HTMLDivElement>(null)
  const [scrollEdges, setScrollEdges] = useState({ start: true, end: true })
  const updateScrollEdges = () => {
    const strip = thumbsRef.current
    if (strip) setScrollEdges({ start: strip.scrollLeft <= 1, end: strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 1 })
  }
  useEffect(() => {
    const strip = thumbsRef.current
    if (!strip) return
    const observer = new ResizeObserver(updateScrollEdges)
    observer.observe(strip)
    updateScrollEdges()
    return () => observer.disconnect()
  }, [panel.id, gallery.length])
  useEffect(() => {
    const strip = thumbsRef.current
    const selected = strip?.querySelector<HTMLButtonElement>('[aria-pressed="true"]')
    if (!strip || !selected) return
    if (selected.offsetLeft < strip.scrollLeft) strip.scrollTo({ left: selected.offsetLeft })
    else if (selected.offsetLeft + selected.offsetWidth > strip.scrollLeft + strip.clientWidth) strip.scrollTo({ left: selected.offsetLeft + selected.offsetWidth - strip.clientWidth })
  }, [image])
  const scrollGallery = (direction: number) => {
    const strip = thumbsRef.current
    if (strip) strip.scrollBy({ left: direction * Math.max(80, strip.clientWidth * 0.75), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }
  return <section className="product-stage" aria-labelledby="product-heading"><div className="product-gallery"><div className="product-main-image"><span className="product-image-label">The details make the difference.</span>{image&&<Image unoptimized src={image} alt={galleryImage||!finish?.image?`${panel.title} gallery image`:`${panel.title} acoustic panel${finish ? ` in ${finish.name}` : ""}`} width={768} height={768} priority />}<div className="product-image-footer"><span>{panel.title}</span><span>{size}</span></div></div><div className="product-gallery-navigation"><button className="gallery-scroll gallery-scroll-prev" type="button" aria-label="Scroll to previous thumbnails" disabled={scrollEdges.start} onClick={()=>scrollGallery(-1)}><Arrow /></button><div className="product-gallery-thumbs" ref={thumbsRef} onScroll={updateScrollEdges} aria-label="Product images">{gallery.map((url,i)=><button type="button" key={url} aria-label={`View product image ${i+1}`} aria-pressed={image===url} onClick={()=>setGalleryImage(url)}><Image unoptimized src={url} width={80} height={80} alt={`${panel.title} image ${i+1}`}/></button>)}</div><button className="gallery-scroll" type="button" aria-label="Scroll to next thumbnails" disabled={scrollEdges.end} onClick={()=>scrollGallery(1)}><Arrow /></button></div><p className="gallery-note">Product imagery is illustrative. Actual colour and finish may vary.</p></div><div className="product-info"><p className="eyebrow">Acoustic wall panel</p><h1 id="product-heading">{panel.title}</h1><p className="product-description">{panel.description}</p><fieldset className="finish-selector"><legend>Choose your finish</legend><div className="finish-options">{panel.finishes.map(f=><label className={`finish-option ${finish?.id===f.id?"selected":""}`} key={f.id}><input type="radio" name="panel-finish" value={f.id} checked={finish?.id===f.id} onChange={()=>{setFinishId(f.id);setGalleryImage(null)}} />{f.image&&<Image unoptimized src={f.image} alt="" width={64} height={64} />}<span>{f.name}</span><span className="finish-check" aria-hidden="true">{finish?.id===f.id?"✓":""}</span></label>)}</div></fieldset><p className="selected-finish" aria-live="polite">{finish?`Selected: ${finish.name}${finish.image?"":" — finish photo not yet available"}`:"Contact us for available finishes."}</p><a className="button button-dark product-quote" href={`/contact-us/?${new URLSearchParams({panel:panel.handle,finish:finish?.name||"",subject:`Quietex quote enquiry — ${panel.title}`}).toString()}`}>Request a Quote<Arrow diagonal /></a><p className="quote-note">Send an enquiry with your selected panel and finish.</p><div className="product-secondary-actions"><a className="text-link room-preview-link" href={`/room-preview?${new URLSearchParams({panel:panel.handle,finish:finish?.name||""}).toString()}`}>See it in your room<Arrow diagonal/></a><a className="text-link" href="#retailers">Speak with a retailer<Arrow /></a></div></div></section>
}
