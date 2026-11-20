const {test}=require('node:test');const assert=require('node:assert/strict')
const {defaultAboutHeader,validateAboutHeader,readAboutPage,writeAboutPage}=require('../apps/backend/.medusa/server/src/lib/about-page')
const {writeContent,defaultContent}=require('../apps/backend/.medusa/server/src/lib/site-content')
const {GET}=require('../apps/backend/.medusa/server/src/api/store/about-page/route')
function mock(){let store={id:'store',metadata:{keep:'preserved'}};let gate=Promise.resolve();return {resolve:key=>({store:{listStores:async()=>[structuredClone(store)],updateStores:async(_id,value)=>{store={...store,...structuredClone(value)}}},locking:{execute:(_key,job)=>{const next=gate.then(job);gate=next.catch(()=>{});return next}}}[key])}}
test('About header validates uploads and rejects unsafe URLs or invalid text',()=>{
 for(const change of [{image:'javascript:alert(1)'},{image:'//example.com/a.jpg'},{heading:''},{alt:''},{description:'x'.repeat(1001)}])assert.throws(()=>validateAboutHeader({...defaultAboutHeader,...change}))
 assert.equal(validateAboutHeader({...defaultAboutHeader,image:'https://example.com/header.jpg'}).image,'https://example.com/header.jpg')
})
test('About header and homepage saves preserve independent content and unrelated metadata',async()=>{
 const scope=mock();const header={...defaultAboutHeader,image:'https://example.com/about.jpg'}
 await writeAboutPage(scope,0,header);await writeContent(scope,'publish',0,defaultContent)
 const {state,store}=await readAboutPage(scope);assert.equal(state.header.image,header.image);assert.equal(store.metadata.keep,'preserved');assert.deepEqual(store.metadata.quietex_site.published,defaultContent)
 await assert.rejects(writeAboutPage(scope,0,header),/Another editor/)
 const results=await Promise.allSettled([writeAboutPage(scope,1,header),writeAboutPage(scope,1,header)]);assert.equal(results.filter(r=>r.status==='fulfilled').length,1)
})
test('public About endpoint returns only the header with no admin metadata',async()=>{
 const scope=mock();const res={setHeader(){},json(value){this.value=value}};await GET({scope},res)
 assert.deepEqual(Object.keys(res.value),['header']);assert.deepEqual(res.value.header,defaultAboutHeader)
})

test('material photo saves independently from the header and old settings retain defaults',async()=>{
 const scope=mock();const header={...defaultAboutHeader,image:'https://example.com/hero.jpg',materialImage:'https://example.com/panel.jpg',materialAlt:'Panel detail',materialCaption:'Panel close-up'}
 await writeAboutPage(scope,0,header);const saved=(await readAboutPage(scope)).state.header;assert.equal(saved.image,header.image);assert.equal(saved.materialImage,header.materialImage);assert.equal(saved.materialCaption,'Panel close-up')
 assert.throws(()=>validateAboutHeader({...header,materialImage:'javascript:alert(1)'}));assert.throws(()=>validateAboutHeader({...header,materialAlt:''}))
 const {materialImage,materialAlt,materialCaption,...old}=defaultAboutHeader;assert.equal(validateAboutHeader(old).materialImage,defaultAboutHeader.materialImage)
})
