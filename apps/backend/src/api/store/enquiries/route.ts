import { timingSafeEqual } from "node:crypto"
import type { MedusaRequest,MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { consumeLimit,enquiries,validateEnquiry } from "../../../lib/enquiries"
export async function POST(req:MedusaRequest,res:MedusaResponse){
 const expected=process.env.ENQUIRY_API_SECRET,provided=req.headers["x-quietex-enquiry-key"]
 if(!expected||typeof provided!=="string"||Buffer.byteLength(expected)!==Buffer.byteLength(provided)||!timingSafeEqual(Buffer.from(expected),Buffer.from(provided))){res.status(403).json({message:"Unable to submit this enquiry."});return}
 const input=validateEnquiry(req.body),service=enquiries(req.scope)
 const result=await req.scope.resolve(Modules.LOCKING).execute(`enquiry-submit-${input.submission_key}`,async()=>{
 const [existing]=await service.listEnquiries({submission_key:input.submission_key})
 if(existing)return existing
 const client=String(req.headers["x-quietex-client"]||"unknown")
 const allowed=await consumeLimit(req.scope,`ip:${client}`,5,900)&&await consumeLimit(req.scope,`email:${input.email}`,3,900)&&await consumeLimit(req.scope,"global",100,3600)
 if(!allowed)return null
 return service.createEnquiries(input)
 })
 if(!result){res.status(429).json({message:"Too many enquiries. Please wait a little before trying again."});return}
 try{await req.scope.resolve(Modules.EVENT_BUS).emit({name:"quietex.enquiry.created",data:{id:result.id}})}catch{/* Durable pending record is picked up by the retry job. */}
 res.setHeader("Cache-Control","no-store")
 res.status(201).json({reference:result.id})
}
