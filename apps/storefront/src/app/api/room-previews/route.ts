import {createHmac} from "node:crypto"
import {NextRequest,NextResponse} from "next/server"
export const runtime="nodejs"
export async function POST(request:NextRequest){
 let trusted=false;try{trusted=new URL(request.headers.get("origin")||"").host===request.headers.get("host")}catch{}
 if(!trusted)return NextResponse.json({message:"Please use the form on this website."},{status:403})
 const secret=process.env.ENQUIRY_API_SECRET,base=process.env.MEDUSA_BACKEND_URL,key=process.env.MEDUSA_PUBLISHABLE_KEY
 if(!secret||!base||!key)return NextResponse.json({message:"The preview form is temporarily unavailable."},{status:503})
 try{
 const reader=request.body?.getReader();if(!reader)throw Error("Missing form")
 const chunks:Uint8Array[]=[];let size=0
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>6*1024*1024+65536){await reader.cancel();return NextResponse.json({message:"Please use up to three photos, 2 MB each."},{status:413})}chunks.push(value)}
 const form=await new Request("http://localhost/form",{method:"POST",headers:{"Content-Type":request.headers.get("content-type")||""},body:Buffer.concat(chunks)}).formData()
 const started=Number(form.get("started_at"))
 if(!Number.isFinite(started)||Date.now()-started<1200||Date.now()-started>86400000||form.get("website"))return NextResponse.json({message:"Please reload the form and try again."},{status:400})
 const uploads=form.getAll("photos")
 if(uploads.length<1||uploads.length>3||uploads.some(p=>!(p instanceof File)||p.size>2*1024*1024||!['image/jpeg','image/png','image/webp'].includes(p.type)))return NextResponse.json({message:"Please choose 1–3 JPG, PNG or WebP photos."},{status:400})
 const photos=await Promise.all((uploads as File[]).map(async p=>({mime:p.type,content:Buffer.from(await p.arrayBuffer()).toString("base64")})))
 const text=(name:string)=>String(form.get(name)||"")
 const body={name:text("name"),email:text("email"),phone:text("phone"),postcode:text("postcode"),product:text("product"),finish:text("finish"),message:text("message"),subject:"Room preview request",submission_key:text("submission_key"),consent:form.get("consent")==="yes",photos}
 const ip=request.headers.get("x-railway-client-ip")||request.headers.get("x-forwarded-for")?.split(",").pop()?.trim()||"unknown"
 const response=await fetch(`${base.replace(/\/$/,"")}/store/room-previews`,{method:"POST",headers:{"Content-Type":"application/json","x-publishable-api-key":key,"x-quietex-enquiry-key":secret,"x-quietex-client":createHmac("sha256",secret).update(ip).digest("hex")},body:JSON.stringify(body),cache:"no-store",signal:AbortSignal.timeout(60000)})
 const result=await response.json()
 if(!response.ok)return NextResponse.json({message:[400,429].includes(response.status)?result.message:"We couldn’t confirm receipt. Please retry; your request won’t be duplicated."},{status:[400,429].includes(response.status)?response.status:502})
 if(!result.reference)throw Error("No receipt")
 return NextResponse.json({reference:result.reference},{status:201})
 }catch{return NextResponse.json({message:"We couldn’t confirm receipt. Please check your photos and try again; your request won’t be duplicated."},{status:502})}
}
