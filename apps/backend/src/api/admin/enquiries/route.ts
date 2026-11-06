import type { AuthenticatedMedusaRequest,MedusaResponse } from "@medusajs/framework/http"
import { enquiries } from "../../../lib/enquiries"
export async function GET(req:AuthenticatedMedusaRequest,res:MedusaResponse){
 const status=typeof req.query.status==="string"&&["new","contacted","closed"].includes(req.query.status)?req.query.status:undefined
 const offset=Math.max(0,Math.min(Number(req.query.offset)||0,100000))
 const [items,count]=await enquiries(req.scope).listAndCountEnquiries(status?{status:status as "new"|"contacted"|"closed"}:{},{take:25,skip:offset,order:{created_at:"DESC"}})
 res.setHeader("Cache-Control","no-store");res.json({enquiries:items,count,offset,limit:25})
}
