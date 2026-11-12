"use client"
import { useRef,useState } from "react"
import { Arrow } from "@/components/icons"
type Panel={handle:string;title:string;finishes:string[]}
export default function EnquiryForm({panels,initialPanel,initialFinish,subject,initialQuantity="",initialMessage="",submitLabel}:{panels:Panel[];initialPanel:string;initialFinish:string;subject:string;initialQuantity?:string;initialMessage?:string;submitLabel?:string}){
 const initial=panels.find(p=>p.handle===initialPanel)
 const [panel,setPanel]=useState(initial?.handle||""),[finish,setFinish]=useState(initial?.finishes.includes(initialFinish)?initialFinish:"")
 const [busy,setBusy]=useState(false),[error,setError]=useState(""),[receipt,setReceipt]=useState("")
 const key=useRef(""),started=useRef(Date.now())
 const selected=panels.find(p=>p.handle===panel)
 async function submit(event:React.FormEvent<HTMLFormElement>){
 event.preventDefault();if(busy)return
 const form=event.currentTarget,values=new FormData(form)
 key.current||=crypto.randomUUID()
 setBusy(true);setError("")
 try{
 const response=await fetch("/api/enquiries",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:values.get("name"),email:values.get("email"),phone:values.get("phone"),postcode:values.get("postcode"),product:selected?.title||"",finish,quantity:values.get("quantity"),message:values.get("message"),website:values.get("website"),subject:subject.slice(0,200),submission_key:key.current,started_at:started.current})})
 const result=await response.json();if(!response.ok||!result.reference)throw new Error(result.message||"We couldn’t confirm receipt. Please try again.")
 setReceipt(result.reference)
 }catch(e){setError((e as Error).message)}finally{setBusy(false)}
 }
 if(receipt)return <section className="enquiry-success" role="status"><span className="success-tick" aria-hidden="true">✓</span><h2>Thanks for getting in touch.</h2><p>Your enquiry has been received. We’ll be in touch to discuss your project.</p><p className="receipt-reference">Reference: {receipt}</p><a className="button button-dark" href="/our-products">Explore the panels<Arrow diagonal/></a></section>
 return <form className="enquiry-form" onSubmit={submit}><fieldset disabled={busy}><legend className="sr-only">Your enquiry details</legend><div className="form-two"><label>Your name <span>*</span><input name="name" autoComplete="name" required maxLength={120}/></label><label>Email address <span>*</span><input name="email" type="email" autoComplete="email" required maxLength={254}/></label><label>Phone <small>optional</small><input name="phone" type="tel" autoComplete="tel" maxLength={40}/></label><label>Postcode <span>*</span><input name="postcode" inputMode="numeric" pattern="[0-9]{4}" autoComplete="postal-code" required maxLength={4} title="Four-digit Australian postcode"/></label></div><div className="form-two"><label>Panel <small>optional</small><select value={panel} onChange={e=>{setPanel(e.target.value);setFinish("")}}><option value="">Not sure yet / general enquiry</option>{panels.map(p=><option key={p.handle} value={p.handle}>{p.title}</option>)}</select></label><label>Finish <small>optional</small><select value={finish} disabled={!selected||busy} onChange={e=>setFinish(e.target.value)}><option value="">Please advise</option>{selected?.finishes.map(f=><option key={f}>{f}</option>)}</select></label></div><label>Quantity <small>optional</small><input name="quantity" defaultValue={initialQuantity} type="number" min={1} max={100000} step={1}/></label><label>Project details <small>optional</small><textarea name="message" defaultValue={initialMessage} rows={5} maxLength={5000} placeholder="Room dimensions, what you’re planning, or a question for us…"/></label><div className="form-honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div><p className="form-privacy">We’ll use these details to respond to your enquiry. Fields marked * are required.</p>{error&&<p className="form-error" role="alert">{error}</p>}<button type="submit" className="button button-dark">{busy?"Sending…":submitLabel||"Send enquiry"}<Arrow diagonal/></button></fieldset></form>
}
