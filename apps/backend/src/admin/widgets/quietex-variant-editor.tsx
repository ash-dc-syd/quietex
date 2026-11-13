import { defineWidgetConfig } from "@medusajs/admin-sdk"
import type { DetailWidgetProps, AdminProductVariant } from "@medusajs/framework/types"
import ProductPageEditor from "../components/product-page-editor"
export default function QuietexVariantEditor({data}:DetailWidgetProps<AdminProductVariant>){
 return data.product_id ? <ProductPageEditor productId={data.product_id} variantId={data.id} updatedAt={data.updated_at}/> : null
}
export const config=defineWidgetConfig({zone:"product_variant.details.before"})
