import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules, MedusaError } from "@medusajs/framework/utils"
import { updateProductsWorkflow } from "@medusajs/medusa/core-flows"
import { resolveImageRoles, type RoleImage } from "../../../../lib/image-roles"
async function read(req: AuthenticatedMedusaRequest) {
 const product=await req.scope.resolve(Modules.PRODUCT).retrieveProduct(req.params.id,{relations:["variants","images"]})
 const active=new Set((product.images||[]).map(i=>i.url))
 return {id:product.id,handle:product.handle,updatedAt:String(product.updated_at),specifications:product.metadata?.specifications||[],images:product.images||[],imageRoles:resolveImageRoles(product as any).imageRoles,variants:(product.variants||[]).map(v=>({id:v.id,title:v.title,image:[v.thumbnail,String((product.metadata?.finish_images as Record<string,string>)?.[v.title]||"")].find(url=>!!url&&active.has(url))||""}))}
}
export async function GET(req:AuthenticatedMedusaRequest,res:MedusaResponse){res.setHeader("Cache-Control","no-store");res.json({panel:await read(req),storefrontUrl:process.env.STOREFRONT_URL||"https://quietex-production.up.railway.app"})}
export async function POST(req:AuthenticatedMedusaRequest,res:MedusaResponse){
 const body=req.body as {imageRoles?:RoleImage[];updatedAt:string;specifications:{name:string;value:string}[];variants:{id:string;image:string}[]}
 const invalid=()=>{throw new MedusaError(MedusaError.Types.INVALID_DATA,"Use valid specification names, values and HTTPS image URLs.")}
 if(!body||!Array.isArray(body.specifications)||body.specifications.length>30||!Array.isArray(body.variants))return invalid()
 for(const s of body.specifications)if(!s||typeof s.name!=="string"||!s.name.trim()||s.name.length>80||typeof s.value!=="string"||s.value.length>1000)return invalid()
 for(const v of body.variants)if(!v||typeof v.id!=="string"||typeof v.image!=="string"||v.image.length>2000||(v.image&&!/^https:\/\/[^\s]+$/i.test(v.image)))return invalid()
 if(body.imageRoles!==undefined&&(!Array.isArray(body.imageRoles)||body.imageRoles.length>100||new Set(body.imageRoles.map(i=>i?.url)).size!==body.imageRoles.length||body.imageRoles.some(i=>!i||typeof i.url!=="string"||i.url.length>2000||!/^https:\/\/[^\s]+$/i.test(i.url)||!["product","detail","lifestyle"].includes(i.role))))return invalid()
 await req.scope.resolve(Modules.LOCKING).execute(`quietex-product-${req.params.id}`,async()=>{
 const service=req.scope.resolve(Modules.PRODUCT)
 const current=await service.retrieveProduct(req.params.id,{relations:["variants","images"]})
 if(body.updatedAt!==String(current.updated_at))throw new MedusaError(MedusaError.Types.CONFLICT,"This product changed. Reload the editor before saving.")
 const ids=new Set(current.variants.map(v=>v.id))
 if(body.variants.length!==ids.size||new Set(body.variants.map(v=>v.id)).size!==ids.size||body.variants.some(v=>!ids.has(v.id)))return invalid()
 const allowedImages=new Set([current.thumbnail,...(current.images||[]).map(i=>i.url),...current.variants.map(v=>v.thumbnail),...body.variants.map(v=>v.image)].filter(Boolean))
 if(body.imageRoles?.some(i=>!allowedImages.has(i.url)))return invalid()
 const images=[...new Set([...(current.images||[]).map(i=>i.url),...body.variants.map(v=>v.image).filter(Boolean)])]
 await updateProductsWorkflow(req.scope).run({input:{products:[{id:current.id,images:images.map(url=>({url})),thumbnail:images.includes(current.thumbnail||"")?current.thumbnail:(images[0]||null),metadata:{...current.metadata,...(body.imageRoles?{image_roles:body.imageRoles}:{}),specifications:body.specifications.map(s=>({name:s.name.trim(),value:s.value.trim()})),finish_images:Object.fromEntries(body.variants.map(v=>[current.variants.find(c=>c.id===v.id)!.title,v.image]))},variants:body.variants.map(v=>({id:v.id,thumbnail:v.image||null}))}]}})
 },{timeout:15})
 res.json({panel:await read(req)})
}
