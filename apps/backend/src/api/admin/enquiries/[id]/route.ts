import type { AuthenticatedMedusaRequest,MedusaResponse } from "@medusajs/framework/http"
import { MedusaError,Modules } from "@medusajs/framework/utils"
import { enquiries } from "../../../../lib/enquiries"
export async function GET(req:AuthenticatedMedusaRequest,res:MedusaResponse){res.setHeader("Cache-Control","no-store");res.json({enquiry:await enquiries(req.scope).retrieveEnquiry(req.params.id)})}
export async function POST(req:AuthenticatedMedusaRequest,res:MedusaResponse){
 const service=enquiries(req.scope),body=req.body as {status?:string;retry?:boolean}
 if(body.retry){
 const item=await service.retrieveEnquiry(req.params.id)
 if(item.email_status!=="sent"){
 await service.updateEnquiries({id:item.id,email_attempts:0,email_status:"pending"})
 await req.scope.resolve(Modules.EVENT_BUS).emit({name:"quietex.enquiry.created",data:{id:item.id}})
 }
 }else{
 if(!["new","contacted","closed"].includes(body.status||""))throw new MedusaError(MedusaError.Types.INVALID_DATA,"Invalid enquiry status")
 await service.updateEnquiries({id:req.params.id,status:body.status as "new"|"contacted"|"closed"})
 }
 res.json({enquiry:await service.retrieveEnquiry(req.params.id)})
}
