const {test}=require('node:test'),assert=require('node:assert/strict')
const {validateRoomPhotos}=require('../apps/backend/.medusa/server/src/lib/room-photos')
const {POST}=require('../apps/backend/.medusa/server/src/api/store/room-previews/route')
const png='iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a3foAAAAASUVORK5CYII='
const good={name:'Room test',email:'customer@example.com',phone:'0400 123 456',postcode:'2158',submission_key:'room_submission_123456',consent:true,photos:[{mime:'image/png',content:png}]}
function response(){return {status(n){this.code=n;return this},setHeader(){},json(b){this.body=b;return this}}}
test('only bounded raster photo payloads pass validation',()=>{
 assert.equal(validateRoomPhotos(good.photos)[0].filename,'room-photo-1.png')
 for(const v of [[],Array(4).fill(good.photos[0]),[{mime:'image/jpeg',content:png}],[{mime:'image/png',content:Buffer.from('<svg>bad</svg>').toString('base64')}],[{mime:'image/png',content:'a'.repeat(3000000)}]])assert.throws(()=>validateRoomPhotos(v))
})
test('phone and AI processing consent are required; proxy authentication is checked first',async()=>{
 process.env.ENQUIRY_API_SECRET='test-secret'
 const req={body:good,headers:{'x-quietex-enquiry-key':'test-secret'},scope:{}}
 for(const change of [{phone:''},{phone:'1234567'},{consent:false}])await assert.rejects(POST({...req,body:{...good,...change}},response()),/phone number/)
 const res=response();await POST({...req,headers:{}},res);assert.equal(res.code,403)
})
test('private upload is durable and retries do not create more files or records',async()=>{
 process.env.S3_BUCKET='test';process.env.ENQUIRY_API_SECRET='test-secret';let saved,uploads=0,creates=0;const cache=new Map()
 const scope={resolve:key=>({enquiry:{listEnquiries:async()=>saved?[saved]:[],createEnquiries:async input=>{creates++;return saved={id:'enq_room',...input}}},locking:{execute:(_key,job)=>job()},caching:{get:async({key})=>cache.get(key),set:async({key,data})=>cache.set(key,data)},file:{createFiles:async f=>{uploads++;assert.equal(f.access,'private');assert.match(f.filename,/^room-requests\//);return{id:f.filename,url:'private-unused'}},deleteFiles:async()=>{}},event_bus:{emit:async()=>{throw Error('queue offline')}}}[key])}
 const req={body:good,headers:{'x-quietex-enquiry-key':'test-secret'},scope};const first=response();await POST(req,first);assert.equal(first.code,201);assert.equal(saved.kind,'room_preview');assert.equal(saved.room_photos.files.length,1);assert(saved.consent_at)
 await POST(req,response());assert.equal(creates,1);assert.equal(uploads,1)
})
test('database failure cleans up newly uploaded files',async()=>{
 process.env.S3_BUCKET='test';let deleted=0
 const scope={resolve:key=>({enquiry:{listEnquiries:async()=>[],createEnquiries:async()=>{throw Error('database unavailable')}},locking:{execute:(_key,job)=>job()},caching:{get:async()=>null,set:async()=>{}},file:{createFiles:async f=>({id:f.filename}),deleteFiles:async()=>{deleted++}}}[key])}
 await assert.rejects(POST({body:good,headers:{'x-quietex-enquiry-key':'test-secret'},scope},response()),/database unavailable/);assert.equal(deleted,1)
})
test('room-preview notification explains attachments and escapes customer text',()=>{
 const {renderEmail}=require('../apps/backend/.medusa/server/src/modules/resend/service');const email=renderEmail('enquiry-received',{kind:'room_preview',name:'<script>bad</script>'});assert.match(email.subject,/photos attached/);assert(!email.html.includes('<script>'));assert.match(email.text,/ChatGPT/)
})
