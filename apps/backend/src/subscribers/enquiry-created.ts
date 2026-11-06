import type { SubscriberArgs,SubscriberConfig } from "@medusajs/framework"
import { sendEnquiryEmail } from "../lib/enquiries"
export default async function handler({event:{data},container}:SubscriberArgs<{id:string}>){await sendEnquiryEmail(container,data.id)}
export const config:SubscriberConfig={event:"quietex.enquiry.created"}
