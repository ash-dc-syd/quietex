import { createHash } from "node:crypto"
import type { MedusaContainer } from "@medusajs/framework/types"
import { Modules,MedusaError,ContainerRegistrationKeys } from "@medusajs/framework/utils"
import type EnquiryService from "../modules/enquiry/service"
export const enquiries=(container:MedusaContainer)=>container.resolve<EnquiryService>("enquiry")
const invalid=(text:string):never=>{throw new MedusaError(MedusaError.Types.INVALID_DATA,text)}
export function validateEnquiry(raw:unknown){
 if(!raw||typeof raw!=="object")return invalid("Please check your enquiry details.")
 const data=raw as Record<string,unknown>
 const text=(key:string,max:number,required=false)=>{
 const value=typeof data[key]==="string"?(data[key] as string).trim():""
 if((required&&!value)||value.length>max||(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)))return invalid(`Please check ${key}.`)
 return value
 }
 if(text("website",200))return invalid("Unable to submit this enquiry.")
 const name=text("name",120,true),email=text("email",254,true).toLowerCase(),phone=text("phone",40),postcode=text("postcode",4,true)
 if(/[\r\n]/.test(name)||!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email))return invalid("Please enter a valid name and email.")
 if(!/^\d{4}$/.test(postcode))return invalid("Please enter a four-digit Australian postcode.")
 if(phone&&!/^[+()\d .-]{5,40}$/.test(phone))return invalid("Please check your phone number.")
 const key=text("submission_key",80,true)
 if(!/^[a-zA-Z0-9_-]{16,80}$/.test(key))return invalid("Please reload the form and try again.")
 const quantity=data.quantity===""||data.quantity===null||data.quantity===undefined?null:Number(data.quantity)
 if(quantity!==null&&(!Number.isInteger(quantity)||quantity<1||quantity>100000))return invalid("Quantity must be a whole number greater than zero.")
 return {name,email,phone,postcode,product:text("product",150),finish:text("finish",150),quantity,message:text("message",5000),subject:text("subject",200),submission_key:key}
}
export async function consumeLimit(container:MedusaContainer,key:string,max:number,seconds:number){
 const digest=createHash("sha256").update(key).digest("hex")
 return container.resolve(Modules.LOCKING).execute(`enquiry-limit-${digest}`,async()=>{
 const cache=container.resolve(Modules.CACHING),cacheKey=`enquiry-limit-${digest}`
 const previous=await cache.get({key:cacheKey}) as {count:number}|null
 if((previous?.count||0)>=max)return false
 await cache.set({key:cacheKey,data:{count:(previous?.count||0)+1},ttl:seconds,tags:["enquiry-rate-limit"]})
 return true
 })
}
export async function sendEnquiryEmail(container:MedusaContainer,id:string){
 return container.resolve(Modules.LOCKING).execute(`enquiry-email-${id}`,async()=>{
 const service=enquiries(container),enquiry=await service.retrieveEnquiry(id)
 if(enquiry.email_status==="sent"||enquiry.email_attempts>=5)return
 await service.updateEnquiries({id,email_attempts:enquiry.email_attempts+1})
 try{
 const to=process.env.ENQUIRY_TO_EMAIL
 if(!to||!process.env.RESEND_API_KEY)throw new Error("Enquiry email is not configured")
 const notifications=container.resolve(Modules.NOTIFICATION)
 const previousNotifications=await notifications.listNotifications({resource_id:id},{take:10})
 const alreadySent=previousNotifications.find(notification=>notification.status==="success")
 const notice=alreadySent||await notifications.createNotifications({
 to,channel:"email",template:"enquiry-received",idempotency_key:`quietex-enquiry-${id}`,resource_id:id,resource_type:"quietex_enquiry",
 data:{...enquiry,admin_url:`${process.env.MEDUSA_BACKEND_URL?.replace(/\/$/,"")}/app/enquiries`},
 })
 if(notice?.status!=="success")throw new Error("Enquiry notification was not sent")
 await service.updateEnquiries({id,email_status:"sent",emailed_at:new Date()})
 }catch{
 await service.updateEnquiries({id,email_status:"failed"})
 container.resolve(ContainerRegistrationKeys.LOGGER).warn(`Enquiry ${id} saved; notification will be retried`)
 }
 })
}
