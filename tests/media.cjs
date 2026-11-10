const {test}=require('node:test')
const assert=require('node:assert/strict')
const {Readable,Writable}=require('node:stream')
const {GET}=require('../apps/backend/.medusa/server/src/api/media/[filename]/route')
const key='quietex-test-01M6QJXF7W4CSGZKSMKM3JJ2VA.png'
function response(){const r=new Writable({write(_data,_encoding,done){done()}});r.headers={};r.setHeader=(k,v)=>r.headers[k]=v;r.status=n=>{r.statusCode=n;return r};return r}
test('only immutable raster image keys are publicly served',async()=>{
 process.env.S3_BUCKET='test'
 for(const filename of ['report.csv','../'+key,'bad.svg','private-01M6QJXF7W4CSGZKSMKM3JJ2VA.pdf','photo.png']){
  const res=response();await GET({params:{filename},scope:{resolve(){throw Error('must not access storage')}}},res);assert.equal(res.statusCode,404)
 }
 const res=response();await GET({params:{filename:key},scope:{resolve:()=>({getDownloadStream:async id=>{assert.equal(id,key);return Readable.from(Buffer.from('image'))}})}},res)
 assert.equal(res.headers['Content-Type'],'image/png');assert.match(res.headers['Cache-Control'],/immutable/);assert.equal(res.headers['X-Content-Type-Options'],'nosniff')
})
test('missing objects are not cached',async()=>{
 process.env.S3_BUCKET='test';const res=response();await GET({params:{filename:key},scope:{resolve:()=>({getDownloadStream:async()=>{throw Error('missing')}})}},res);assert.equal(res.statusCode,404);assert.equal(res.headers['Cache-Control'],'no-store')
})
