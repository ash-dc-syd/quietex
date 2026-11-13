import { defineWidgetConfig } from "@medusajs/admin-sdk"
import type { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"
import ProductPageEditor from "../components/product-page-editor"
export default function QuietexProductEditor({data}:DetailWidgetProps<AdminProduct>){
 return <ProductPageEditor productId={data.id} updatedAt={data.updated_at}/>
}
export const config=defineWidgetConfig({zone:"product.details.before"})
