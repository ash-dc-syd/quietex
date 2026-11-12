import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
import { MedusaError } from "@medusajs/framework/utils"
export type RoomPhoto = { key:string; mime:string; filename:string; size:number }
export const MAX_PHOTO_BYTES=2*1024*1024
export function validateRoomPhotos(value:unknown){
 const bad=():never=>{throw new MedusaError(MedusaError.Types.INVALID_DATA,"Upload 1–3 JPG, PNG or WebP photos, up to 2 MB each.")}
 if(!Array.isArray(value)||value.length<1||value.length>3)return bad()
 return value.map((photo,index)=>{
 if(!photo||typeof photo.content!=="string"||photo.content.length>Math.ceil(MAX_PHOTO_BYTES/3)*4||!/^[A-Za-z0-9+/]+={0,2}$/.test(photo.content))return bad()
 const bytes=Buffer.from(photo.content,"base64")
 const mime=bytes.subarray(0,3).equals(Buffer.from([255,216,255]))?"image/jpeg":bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))?"image/png":bytes.toString("ascii",0,4)==="RIFF"&&bytes.toString("ascii",8,12)==="WEBP"?"image/webp":""
 if(!mime||mime!==photo.mime||!bytes.length||bytes.length>MAX_PHOTO_BYTES)return bad()
 const ext=mime==="image/jpeg"?"jpg":mime==="image/png"?"png":"webp"
 return {bytes,mime,filename:`room-photo-${index+1}.${ext}`}
 })
}
let client:S3Client|undefined
export async function readRoomPhoto(photo:RoomPhoto){
 if(!/^room-requests\/[a-zA-Z0-9_-]{16,80}\/[a-zA-Z0-9_.-]+$/.test(photo.key))throw new Error("Invalid room photo key")
 client ||= new S3Client({region:process.env.S3_REGION||"auto",endpoint:process.env.S3_ENDPOINT,credentials:{accessKeyId:process.env.S3_ACCESS_KEY_ID||"",secretAccessKey:process.env.S3_SECRET_ACCESS_KEY||""}})
 const result=await client.send(new GetObjectCommand({Bucket:process.env.S3_BUCKET,Key:photo.key}))
 if(!result.Body||(result.ContentLength||0)>MAX_PHOTO_BYTES)throw new Error("Invalid room photo")
 const bytes=Buffer.from(await result.Body.transformToByteArray())
 if(bytes.length>MAX_PHOTO_BYTES)throw new Error("Room photo too large")
 return bytes
}
