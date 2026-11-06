import { model } from "@medusajs/framework/utils"
export default model.define("quietex_enquiry", {
 id:model.id({prefix:"enq"}).primaryKey(),
 name:model.text(),email:model.text(),phone:model.text().default(""),postcode:model.text(),
 product:model.text().default(""),finish:model.text().default(""),quantity:model.number().nullable(),
 message:model.text().default(""),subject:model.text().default(""),
 submission_key:model.text().unique(),
 status:model.enum(["new","contacted","closed"]).default("new"),
 email_status:model.enum(["pending","sent","failed"]).default("pending"),
 email_attempts:model.number().default(0),emailed_at:model.dateTime().nullable(),
})
