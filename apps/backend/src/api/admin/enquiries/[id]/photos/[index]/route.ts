import type {AuthenticatedMedusaRequest,MedusaResponse} from "@medusajs/framework/http"
import {enquiries} from "../../../../../../lib/enquiries"
import {readRoomPhoto,type RoomPhoto} from "../../../../../../lib/room-photos"
export async function GET(req:AuthenticatedMedusaRequest,res:MedusaResponse){
 const item=await enquiries(req.scope).retrieveEnquiry(req.params.id)
 const index=Number(req.params.index),photos=((item.room_photos as {files?:RoomPhoto[]}|null)?.files||[])
 const photo=Number.isInteger(index)&&index>=0?photos[index]:null
 if(!photo){res.status(404).end();return}
 const bytes=await readRoomPhoto(photo)
 res.setHeader("Cache-Control","private, no-store");res.setHeader("Content-Type",photo.mime)
 res.setHeader("Content-Disposition",`${req.query.inline==="1"?"inline":"attachment"}; filename="${photo.filename}"`)
 res.setHeader("X-Content-Type-Options","nosniff");res.setHeader("Content-Security-Policy","default-src 'none'; sandbox")
 res.send(bytes)
}
