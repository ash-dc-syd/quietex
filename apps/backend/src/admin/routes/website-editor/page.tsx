import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Photo } from "@medusajs/icons"
import { useEffect, useRef, useState } from "react"
import type { SiteDocument, ContentState, SiteSection } from "../../../lib/site-content"
import "./style.css"
type Field = { key:string;label:string;kind:string;default:string }
type Definition = { type:string;label:string;fields:Field[] }
type Payload = { state:ContentState;schema:Definition[];storefrontUrl:string;products:{id:string;title:string;handle:string;thumbnail:string|null}[] }
async function request(method="GET",body?:unknown) {
 const response=await fetch("/admin/site-content",{method,credentials:"include",headers:{"Content-Type":"application/json"},...(body?{body:JSON.stringify(body)}:{})})
 const result=await response.json()
 if(!response.ok)throw new Error(response.status===401?"Please sign in to Medusa again.":result.message||"Could not save website content")
 return result
}
export default function WebsiteEditor() {
 const [data,setData]=useState<Payload|null>(null)
 const [draft,setDraft]=useState<SiteDocument|null>(null)
 const [selected,setSelected]=useState("hero")
 const [saved,setSaved]=useState("")
 const [message,setMessage]=useState("")
 const [error,setError]=useState("")
 const [busy,setBusy]=useState(false)
 const [uploading,setUploading]=useState("")
 const [mobile,setMobile]=useState(false)
 const [ready,setReady]=useState(false)
 const [newType,setNewType]=useState("banner")
 const [confirm,setConfirm]=useState<"publish"|"restore"|null>(null)
 const frame=useRef<HTMLIFrameElement>(null)
 const current=useRef<SiteDocument|null>(null)
 current.current=draft
 const dirty=!!draft&&JSON.stringify(draft)!==saved
 const unpublished=!!draft&&!!data&&JSON.stringify(draft)!==JSON.stringify(data.state.published)
 const load=async()=>{
 try{const next:Payload=await request();setData(next);setDraft(next.state.draft);setSaved(JSON.stringify(next.state.draft));setError("")}catch(e){setError((e as Error).message)}
 }
 useEffect(()=>{void load()},[])
 useEffect(()=>{
 if(!data)return
 const origin=new URL(data.storefrontUrl).origin
 const receive=(event:MessageEvent)=>{
 if(event.origin!==origin||event.source!==frame.current?.contentWindow)return
 if(event.data?.type==="quietex:ready"){
 setReady(true);frame.current?.contentWindow?.postMessage({type:"quietex:preview",content:current.current},origin)
 }
 if(event.data?.type==="quietex:select"&&current.current?.sections.some(s=>s.id===event.data.id))setSelected(event.data.id)
 }
 window.addEventListener("message",receive)
 return()=>window.removeEventListener("message",receive)
 },[data?.storefrontUrl])
 useEffect(()=>{
 if(data&&draft&&ready)frame.current?.contentWindow?.postMessage({type:"quietex:preview",content:draft},new URL(data.storefrontUrl).origin)
 },[draft,ready,data?.storefrontUrl])
 useEffect(()=>{
 if(data&&ready)frame.current?.contentWindow?.postMessage({type:"quietex:focus",id:selected},new URL(data.storefrontUrl).origin)
 },[selected,ready,data?.storefrontUrl])
 useEffect(()=>{
 const warn=(event:BeforeUnloadEvent)=>{if(dirty){event.preventDefault();event.returnValue=""}}
 window.addEventListener("beforeunload",warn);return()=>window.removeEventListener("beforeunload",warn)
 },[dirty])
 const save=async(action:"draft"|"publish"|"restore")=>{
 if(!data||!draft)return
 setBusy(true);setError("");setMessage("");setConfirm(null)
 try{
 const next=await request("POST",{action,revision:data.state.revision,content:draft})
 setData({...data,state:next.state});setDraft(next.state.draft);setSaved(JSON.stringify(next.state.draft))
 setMessage(action==="draft"?"Draft saved. Your website has not changed.":action==="publish"?"Published. Refresh the website to see your changes.":"Previous published version restored.")
 }catch(e){setError((e as Error).message)}finally{setBusy(false)}
 }
 if(!data||!draft)return <div className="qe"><h1>Website editor</h1>{error?<><p role="alert">{error}</p><button onClick={load}>Retry</button></>:<p>Loading your homepage…</p>}</div>
 const section=draft.sections.find(s=>s.id===selected)
 const definition=data.schema.find(s=>s.type===section?.type)
 const update=(key:string,value:string)=>setDraft({...draft,sections:draft.sections.map(s=>s.id===selected?{...s,settings:{...s.settings,[key]:value}}:s)})
 const uploadImage=async(file:File,fieldKey:string,sectionId:string)=>{
 if(!["image/png","image/jpeg","image/webp","image/gif","image/avif"].includes(file.type)||file.size>10*1024*1024){setError("Choose a PNG, JPG, WebP, GIF or AVIF image up to 10 MB.");return}
 setUploading(`${sectionId}:${fieldKey}`);setError("");setMessage("")
 try{
 const body=new FormData();body.append("files",file)
 const response=await fetch("/admin/uploads",{method:"POST",credentials:"include",body})
 const result=await response.json()
 if(!response.ok||!result.files?.[0]?.url)throw new Error(result.message||"Image upload failed. Please try again.")
 const url=result.files[0].url
 setDraft(current=>current?{...current,sections:current.sections.map(s=>s.id===sectionId?{...s,settings:{...s.settings,[fieldKey]:url}}:s)}:current)
 setMessage("Image uploaded. Publish changes to show it on the storefront.")
 }catch(e){setError((e as Error).message)}finally{setUploading("")}
 }
 const move=(id:string,direction:number)=>{
 const sections=[...draft.sections];const i=sections.findIndex(s=>s.id===id);const j=i+direction
 if(j<0||j>=sections.length)return
 ;[sections[i],sections[j]]=[sections[j],sections[i]];setDraft({...draft,sections})
 }
 const add=()=>{
 const type=data.schema.find(s=>s.type===newType)!
 const section:SiteSection={id:`${type.type}-${Date.now()}`,type:type.type,enabled:true,settings:Object.fromEntries(type.fields.map(f=>[f.key,f.default]))}
 setDraft({...draft,sections:[...draft.sections,section]});setSelected(section.id)
 }
 return <div className="qe">
 <header className="qe-top"><div><p className="qe-eyebrow">QUIETEX / WEBSITE</p><h1>Homepage editor</h1><p>Choose a section or click it in the preview. Save draft keeps changes private. Publish changes updates the storefront.</p></div><div className="qe-actions"><a href={data.storefrontUrl} target="_blank" rel="noreferrer">View website ↗</a><button disabled={busy||!!uploading||!dirty} onClick={()=>save("draft")}>Save draft</button><button className="qe-primary" disabled={busy||!!uploading} onClick={()=>setConfirm("publish")}>Publish changes</button></div></header>
 <div className="qe-status"><span>{busy?"Saving…":dirty?"● Unsaved changes":unpublished?"● Draft saved · not published":"✓ Published homepage is up to date"}</span><span>{data.state.publishedAt?`Last published ${new Date(data.state.publishedAt).toLocaleString()}`:"Original website · no content changes published"}</span>{data.state.previousPublished&&<button disabled={busy} onClick={()=>setConfirm("restore")}>Restore previous version</button>}</div>
 {message&&<p className="qe-success" role="status">{message}</p>}{error&&<div className="qe-error" role="alert">{error} <button disabled={busy} onClick={()=>{if(window.confirm("Reload saved content? Your unsaved changes will be lost."))void load()}}>Reload saved content</button></div>}
 <div className="qe-workspace"><aside className="qe-controls"><label className="qe-field">Announcement<input value={draft.announcement} maxLength={250} onChange={e=>setDraft({...draft,announcement:e.target.value})}/></label><h2>Sections</h2><p className="qe-hint">Use ↑ ↓ to reorder. Switch off a section to hide it.</p>
 <div className="qe-sections">{draft.sections.map((s,index)=><div key={s.id} className={`qe-section ${selected===s.id?"qe-active":""}`}><button className="qe-section-label" onClick={()=>setSelected(s.id)}>{data.schema.find(d=>d.type===s.type)?.label}{!s.enabled&&<small>Hidden</small>}</button><button aria-label={`Move ${index+1} up`} disabled={index===0||busy} onClick={()=>move(s.id,-1)}>↑</button><button aria-label={`Move ${index+1} down`} disabled={index===draft.sections.length-1||busy} onClick={()=>move(s.id,1)}>↓</button><input type="checkbox" aria-label={`Show section ${index+1}`} checked={s.enabled} onChange={e=>setDraft({...draft,sections:draft.sections.map(x=>x.id===s.id?{...x,enabled:e.target.checked}:x)})}/></div>)}</div>
 <div className="qe-add"><label className="qe-sr" htmlFor="qe-section-type">New section type</label><select id="qe-section-type" value={newType} onChange={e=>setNewType(e.target.value)}>{data.schema.map(s=><option value={s.type} key={s.type}>{s.label}</option>)}</select><button disabled={draft.sections.length>=20||busy} onClick={add}>+ Add section</button></div>
 {section&&definition&&<div className="qe-fields"><div className="qe-fields-title"><h2>{definition.label}</h2><button disabled={draft.sections.length<=1||busy} onClick={()=>{if(window.confirm("Remove this section from the draft?")){setDraft({...draft,sections:draft.sections.filter(s=>s.id!==selected)});setSelected(draft.sections.find(s=>s.id!==selected)!.id)}}}>Remove</button></div>
 {definition.fields.filter(field=>field.key!=="caption"||section.type!=="hero").map(field=><div className="qe-field" key={field.key}><label htmlFor={`qe-${field.key}`}>{field.label}</label>{field.key==="handles"?<div className="qe-product-picker">{data.products.map(product=><label key={product.id}><input type="checkbox" checked={section.settings.handles.split(",").includes(product.handle)} onChange={e=>{const handles=section.settings.handles.split(",").filter(Boolean);update("handles",e.target.checked?[...handles,product.handle].join(","):handles.filter(h=>h!==product.handle).join(","))}}/>{product.title}</label>)}</div>:field.kind==="textarea"?<textarea id={`qe-${field.key}`} rows={4} value={section.settings[field.key]} maxLength={5000} onChange={e=>update(field.key,e.target.value)}/>:<input id={`qe-${field.key}`} type={field.kind==="image"?"url":"text"} maxLength={2000} value={section.settings[field.key]} onChange={e=>update(field.key,e.target.value)}/>}{field.kind==="image"&&<><span className="qe-hint">Upload an image, paste an HTTPS URL, or choose an existing image below. Uploads are stored permanently; publish to update the storefront.</span><label className="qe-upload">{uploading===`${section.id}:${field.key}`?"Uploading…":"Upload image"}<input aria-label={`Upload ${field.label}`} type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" disabled={!!uploading||busy} onChange={e=>{const file=e.target.files?.[0];if(file)void uploadImage(file,field.key,section.id);e.target.value=""}}/></label><div className="qe-image-options">{[...new Set([...data.products.map(p=>p.thumbnail).filter((url):url is string=>!!url),...draft.sections.flatMap(s=>data.schema.find(d=>d.type===s.type)?.fields.filter(f=>f.kind==="image").map(f=>s.settings[f.key])||[])])].filter(Boolean).map(url=><button type="button" title="Use this image" aria-label={`Use image ${url.split('/').pop()}`} key={url} onClick={()=>update(field.key,url)}><img src={url} alt=""/></button>)}</div>{section.settings[field.key]&&<img className="qe-image-preview" src={section.settings[field.key]} alt="Selected image preview"/>}</>}{field.key==="handles"&&<span className="qe-hint">Select the panels to feature. Uncheck all to use the first four panels.</span>}</div>)}
 </div>}</aside>
 <section className="qe-preview" aria-label="Website preview"><div className="qe-preview-toolbar"><strong>Live preview</strong><div><button aria-pressed={!mobile} onClick={()=>setMobile(false)}>Desktop</button><button aria-pressed={mobile} onClick={()=>setMobile(true)}>Mobile</button></div><span>{ready?"Click a section to edit":"Connecting preview…"}</span></div><div className="qe-frame-wrap"><iframe ref={frame} title="Quietex homepage draft preview" src={`${data.storefrontUrl.replace(/\/$/,"")}/editor-preview`} sandbox="allow-scripts allow-same-origin" style={{width:mobile?390:"100%"}}/></div></section></div>
 {confirm&&<div className="qe-modal-backdrop"><div className="qe-modal" role="dialog" aria-modal="true" aria-labelledby="qe-confirm"><h2 id="qe-confirm">{confirm==="publish"?"Publish this homepage?":"Restore the previous homepage?"}</h2><p>{confirm==="publish"?"Your current draft will replace the published homepage. You can restore the previous version afterwards.":"This replaces both your draft and published homepage with the previous published version."}</p><div className="qe-actions"><button autoFocus onClick={()=>setConfirm(null)}>Cancel</button><button className="qe-primary" onClick={()=>save(confirm)}>{confirm==="publish"?"Publish homepage":"Restore version"}</button></div></div></div>}
 </div>
}
export const config=defineRouteConfig({label:"Website editor",icon:Photo})
