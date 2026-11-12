import { timingSafeEqual } from "node:crypto"
import type { MedusaRequest,MedusaResponse } from "@medusajs/framework/http"
import { Modules,MedusaError } from "@medusajs/framework/utils"
import type { IFileModuleService } from "@medusajs/framework/types"
import {consumeLimit,enquiries,validateEnquiry} from "../../../lib/enquiries"
import {validateRoomPhotos,type RoomPhoto} from "../../../lib/room-photos"
export async function POST(req:MedusaRequest,res:MedusaResponse){
 const expected=process.env.ENQUIRY_API_SECRET,provided=req.headers["x-quietex-enquiry-key"]
 if(!expected||typeof provided!=="string"||Buffer.byteLength(expected)!==Buffer.byteLength(provided)||!timingSafeEqual(Buffer.from(expected),Buffer.from(provided))){res.status(403).json({message:"Unable to submit this request."});return}
 const body=req.body as Record<string,unknown>,input=validateEnquiry(body)
 if(!input.phone||input.phone.replace(/\D/g,"").length<8||body.consent!==true)throw new MedusaError(MedusaError.Types.INVALID_DATA,"Please provide a phone number and permission to prepare your preview.")
 const photos=validateRoomPhotos(body.photos)
 const service=enquiries(req.scope)
 const result=await req.scope.resolve(Modules.LOCKING).execute(`enquiry-submit-${input.submission_key}`,async()=>{
 const [existing]=await service.listEnquiries({submission_key:input.submission_key})
 if(existing)return existing
 const client=String(req.headers["x-quietex-client"]||"unknown")
 const allowed=await consumeLimit(req.scope,`room-ip:${client}`,2,900)&&await consumeLimit(req.scope,`room-email:${input.email}`,2,900)&&await consumeLimit(req.scope,"room-global",20,3600)
 if(!allowed)return null
 if(!process.env.S3_BUCKET)throw new Error("Room photo storage unavailable")
 const files=req.scope.resolve<IFileModuleService>(Modules.FILE),stored:RoomPhoto[]=[]
 try{
 for(const p of photos){const file=await files.createFiles({filename:`room-requests/${input.submission_key}/${p.filename}`,mimeType:p.mime,content:p.bytes.toString("base64"),access:"private"});stored.push({key:file.id,mime:p.mime,filename:p.filename,size:p.bytes.length})}
 return await service.createEnquiries({...input,kind:"room_preview",room_photos:{files:stored},consent_at:new Date()})
 }catch(error){for(const photo of stored){try{await files.deleteFiles(photo.key)}catch{/* Preserve original failure. */}}throw error}
 })
 if(!result){res.status(429).json({message:"Too many preview requests. Please wait before trying again."});return}
 try{await req.scope.resolve(Modules.EVENT_BUS).emit({name:"quietex.enquiry.created",data:{id:result.id}})}catch{/* Saved pending record is retried by the scheduled job. */}
 res.setHeader("Cache-Control","no-store");res.status(201).json({reference:result.id})
}
