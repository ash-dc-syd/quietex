import type { MedusaContainer } from "@medusajs/framework/types"
import { enquiries,sendEnquiryEmail } from "../lib/enquiries"
export default async function retryEmails(container:MedusaContainer){
 const pending=await enquiries(container).listEnquiries({email_status:["pending","failed"],email_attempts:{$lt:5}},{take:50,order:{created_at:"ASC"}})
 for(const item of pending)await sendEnquiryEmail(container,item.id)
}
export const config={name:"retry-quietex-enquiry-emails",schedule:"*/2 * * * *"}
