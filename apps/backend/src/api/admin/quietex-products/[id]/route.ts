import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules, MedusaError } from "@medusajs/framework/utils"
import { updateProductsWorkflow } from "@medusajs/medusa/core-flows"
async function read(req: AuthenticatedMedusaRequest) {
 const product=await req.scope.resolve(Modules.PRODUCT).retrieveProduct(req.params.id,{relations:["variants","images"]})
 return {id:product.id,handle:product.handle,updatedAt:String(product.updated_at),specifications:product.metadata?.specifications||[],images:product.images||[],variants:(product.variants||[]).map(v=>({id:v.id,title:v.title,image:v.thumbnail||String((product.metadata?.finish_images as Record<string,string>)?.[v.title]||"")}))}
}
export async function GET(req:AuthenticatedMedusaRequest,res:MedusaResponse){res.setHeader("Cache-Control","no-store");res.json({panel:await read(req),storefrontUrl:process.env.STOREFRONT_URL||"https://quietex-production.up.railway.app"})}
export async function POST(req:AuthenticatedMedusaRequest,res:MedusaResponse){
 const body=req.body as {updatedAt:string;specifications:{name:string;value:string}[];variants:{id:string;image:string}[]}
 const invalid=()=>{throw new MedusaError(MedusaError.Types.INVALID_DATA,"Use valid specification names, values and HTTPS image URLs.")}
 if(!body||!Array.isArray(body.specifications)||body.specifications.length>30||!Array.isArray(body.variants))return invalid()
 for(const s of body.specifications)if(!s||typeof s.name!=="string"||!s.name.trim()||s.name.length>80||typeof s.value!=="string"||s.value.length>1000)return invalid()
 for(const v of body.variants)if(!v||typeof v.id!=="string"||typeof v.image!=="string"||v.image.length>2000||(v.image&&!/^https:\/\/[^\s]+$/i.test(v.image)))return invalid()
 await req.scope.resolve(Modules.LOCKING).execute(`quietex-product-${req.params.id}`,async()=>{
 const service=req.scope.resolve(Modules.PRODUCT)
 const current=await service.retrieveProduct(req.params.id,{relations:["variants"]})
 if(body.updatedAt!==String(current.updated_at))throw new MedusaError(MedusaError.Types.CONFLICT,"This product changed. Reload the editor before saving.")
 const ids=new Set(current.variants.map(v=>v.id))
 if(body.variants.length!==ids.size||new Set(body.variants.map(v=>v.id)).size!==ids.size||body.variants.some(v=>!ids.has(v.id)))return invalid()
 await updateProductsWorkflow(req.scope).run({input:{products:[{id:current.id,metadata:{...current.metadata,specifications:body.specifications.map(s=>({name:s.name.trim(),value:s.value.trim()})),finish_images:Object.fromEntries(body.variants.map(v=>[current.variants.find(c=>c.id===v.id)!.title,v.image]))},variants:body.variants.map(v=>({id:v.id,thumbnail:v.image||null}))}]}})
 },{timeout:15})
 res.json({panel:await read(req)})
}
