"use client"
import { useEffect,useState } from "react"
import HomeView from "@/components/home-view"
import type { Panel } from "@/lib/products"
import type { SiteDocument } from "@/lib/site-content"
export default function Preview({panels,initial,editorOrigin}:{panels:Panel[];initial:SiteDocument;editorOrigin:string}) {
 const [content,setContent]=useState(initial)
 useEffect(()=>{
 const receive=(event:MessageEvent)=>{
 if(event.origin!==editorOrigin||event.source!==window.parent)return
 if(event.data?.type==="quietex:focus"){
 document.querySelectorAll<HTMLElement>("[data-content-section]").forEach(element=>{
 const active=element.dataset.contentSection===event.data.id
 element.style.outline=active?"3px solid #72977d":""
 element.style.outlineOffset="-3px"
 if(active)element.scrollIntoView({behavior:"smooth",block:"start"})
 });return
 }
 if(event.data?.type!=="quietex:preview")return
 const doc=event.data.content
 if(doc?.version===1&&Array.isArray(doc.sections)&&doc.sections.length<=20&&typeof doc.announcement==="string")setContent(doc)
 }
 window.addEventListener("message",receive)
 window.parent.postMessage({type:"quietex:ready"},editorOrigin)
 return()=>window.removeEventListener("message",receive)
 },[editorOrigin])
 return <div onClickCapture={event=>{
 const target=event.target as HTMLElement
 if(target.closest("a"))event.preventDefault()
 const section=target.closest<HTMLElement>("[data-content-section]")
 if(section)window.parent.postMessage({type:"quietex:select",id:section.dataset.contentSection},editorOrigin)
 }}><div style={{background:"#f2ebd9",padding:8,textAlign:"center",fontSize:12}}>Editor preview · links are disabled · unpublished changes are only visible here</div><HomeView panels={panels} content={content}/></div>
}
