const {test}=require('node:test'),assert=require('node:assert/strict')
const {validateEnquiry,consumeLimit,sendEnquiryEmail}=require('../apps/backend/.medusa/server/src/lib/enquiries')
const {renderEmail}=require('../apps/backend/.medusa/server/src/modules/resend/service')
const valid={name:'Customer',email:'CUSTOMER@example.com',postcode:'2158',phone:'0400 123 456',quantity:'12',product:'Stella',finish:'Navy Blue/Walnut',message:'Room <script>test</script>',submission_key:'test_submission_123456'}
test('validates and normalizes enquiry; blocks spam and invalid fields',()=>{
 const result=validateEnquiry(valid);assert.equal(result.email,'customer@example.com');assert.equal(result.quantity,12)
 for(const changed of [{website:'spam'},{email:'a\nb@example.com'},{name:'a\nb'},{postcode:'abcd'},{quantity:-1},{quantity:1.5},{message:'x'.repeat(5001)},{submission_key:'short'}])assert.throws(()=>validateEnquiry({...valid,...changed}))
 assert.equal(validateEnquiry({...valid,quantity:''}).quantity,null)
})
test('distributed rate limiter rejects requests after its limit',async()=>{
 const map=new Map();const container={resolve:key=>key==='locking'?{execute:(_key,job)=>job()}:{get:async({key})=>map.get(key),set:async({key,data})=>map.set(key,data)}}
 assert(await consumeLimit(container,'client',2,900));assert(await consumeLimit(container,'client',2,900));assert.equal(await consumeLimit(container,'client',2,900),false)
 assert([...map.keys()].every(k=>!k.includes('client')))
})
test('notification failure preserves record and can be retried without duplicate send',async()=>{
 process.env.ENQUIRY_TO_EMAIL='recipient@example.com';process.env.RESEND_API_KEY='test-only'
 let item={id:'enq_test',...validateEnquiry(valid),email_status:'pending',email_attempts:0},sends=0,fail=true
 const service={retrieveEnquiry:async()=>({...item}),updateEnquiries:async(data)=>{item={...item,...data}}}
 const container={resolve:key=>({enquiry:service,locking:{execute:(_key,job)=>job()},notification:{listNotifications:async()=>[],createNotifications:async()=>{sends++;if(fail)throw Error('failure');return{status:'success'}}},logger:{warn:()=>{}}}[key])}
 await sendEnquiryEmail(container,item.id);assert.equal(item.email_status,'failed');assert.equal(item.email_attempts,1)
 fail=false;await sendEnquiryEmail(container,item.id);assert.equal(item.email_status,'sent');assert.equal(sends,2)
 await sendEnquiryEmail(container,item.id);assert.equal(sends,2)
})
test('enquiry email escapes untrusted text',()=>{
 const output=renderEmail('enquiry-received',{...valid,id:'enq_test'})
 assert(!output.html.includes('<script>'));assert(output.html.includes('&lt;script&gt;'));assert(output.text.includes(valid.message))
})
test('submission retries return the same saved reference, even if event delivery fails',async()=>{
 const {POST}=require('../apps/backend/.medusa/server/src/api/store/enquiries/route')
 process.env.ENQUIRY_API_SECRET='test-proxy-secret';let stored=null,creates=0
 const cache=new Map(),service={listEnquiries:async()=>stored?[stored]:[],createEnquiries:async input=>{creates++;stored={id:'enq_saved',...input};return stored}}
 const container={resolve:key=>({enquiry:service,locking:{execute:(_key,job)=>job()},caching:{get:async({key})=>cache.get(key),set:async({key,data})=>cache.set(key,data)},event_bus:{emit:async()=>{throw Error('queue unavailable')}}}[key])}
 const req={body:valid,headers:{'x-quietex-enquiry-key':'test-proxy-secret','x-quietex-client':'test-client'},scope:container}
 const response=()=>({code:200,status(code){this.code=code;return this},setHeader(){},json(body){this.body=body;return this}})
 const first=response();await POST(req,first);assert.equal(first.code,201);assert.equal(first.body.reference,'enq_saved')
 const second=response();await POST(req,second);assert.equal(second.body.reference,first.body.reference);assert.equal(creates,1)
 const blocked=response();await POST({...req,headers:{}},blocked);assert.equal(blocked.code,403)
})
