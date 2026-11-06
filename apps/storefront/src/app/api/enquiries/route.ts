import { createHmac } from "node:crypto"
import { NextRequest,NextResponse } from "next/server"
export async function POST(request:NextRequest){
 const origin=request.headers.get("origin"),host=request.headers.get("host")
 let trustedOrigin=false
 try{trustedOrigin=!!origin&&new URL(origin).host===host}catch{/* Malformed origins are rejected. */}
 if(!trustedOrigin)return NextResponse.json({message:"Please submit the form from this website."},{status:403})
 const secret=process.env.ENQUIRY_API_SECRET,base=process.env.MEDUSA_BACKEND_URL,key=process.env.MEDUSA_PUBLISHABLE_KEY
 if(!secret||!base||!key)return NextResponse.json({message:"The form is temporarily unavailable. Please try again shortly."},{status:503})
 let body:Record<string,unknown>
 try{
 const reader=request.body?.getReader()
 if(!reader)return NextResponse.json({message:"Please check your form details."},{status:400})
 const decoder=new TextDecoder();let text="",size=0
 while(true){
 const {done,value}=await reader.read();if(done)break
 size+=value.byteLength
 if(size>32768){await reader.cancel();return NextResponse.json({message:"Please shorten your message."},{status:413})}
 text+=decoder.decode(value,{stream:true})
 }
 text+=decoder.decode()
 body=JSON.parse(text)
 if(!body||typeof body!=="object"||typeof body.started_at!=="number"||Date.now()-body.started_at<1200||Date.now()-body.started_at>86400000||body.website)return NextResponse.json({message:"Please reload the form and try again."},{status:400})
 }catch{return NextResponse.json({message:"Please check your form details."},{status:400})}
 const ip=request.headers.get("x-railway-client-ip")||request.headers.get("x-forwarded-for")?.split(",").pop()?.trim()||"unknown"
 try{
 const response=await fetch(`${base.replace(/\/$/,"")}/store/enquiries`,{method:"POST",headers:{"Content-Type":"application/json","x-publishable-api-key":key,"x-quietex-enquiry-key":secret,"x-quietex-client":createHmac("sha256",secret).update(ip).digest("hex")},body:JSON.stringify(body),cache:"no-store",signal:AbortSignal.timeout(15000)})
 const result=await response.json()
 if(!response.ok)return NextResponse.json({message:response.status===400||response.status===429?result.message:"We couldn’t confirm receipt. Please try again."},{status:response.status===429?429:response.status===400?400:502})
 if(!result.reference)throw new Error("Missing reference")
 return NextResponse.json({reference:result.reference},{status:201})
 }catch{return NextResponse.json({message:"We couldn’t confirm receipt. Please try again—your enquiry won’t be duplicated."},{status:502})}
}
