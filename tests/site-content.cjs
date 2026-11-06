const {test}=require('node:test')
const assert=require('node:assert/strict')
const {defaultContent,validateContent,writeContent,readContent}=require('../apps/backend/.medusa/server/src/lib/site-content')
const admin=require('../apps/backend/.medusa/server/src/api/admin/site-content/route')
const storeApi=require('../apps/backend/.medusa/server/src/api/store/site-content/route')
function mock(){
 let store={id:'store_test',metadata:{unrelated:'preserved'}}
 let gate=Promise.resolve()
 const container={resolve:key=>({
 store:{listStores:async()=>[structuredClone(store)],updateStores:async(id,data)=>{store={...store,...structuredClone(data)}}},
 locking:{execute:(_key,job)=>{const next=gate.then(job);gate=next.catch(()=>{});return next}},
 }[key])}
 return container
}
test('draft isolation, publish, restore and metadata preservation',async()=>{
 const container=mock();const draft=structuredClone(defaultContent);draft.announcement='Draft only'
 let state=await writeContent(container,'draft',0,draft)
 assert.equal(state.published.announcement,defaultContent.announcement)
 const res={setHeader(){},json(value){this.value=value}}
 await storeApi.GET({scope:container},res)
 assert.equal(res.value.content.announcement,defaultContent.announcement)
 assert(!JSON.stringify(res.value).includes('Draft only'))
 state=await writeContent(container,'publish',1,draft);assert.equal(state.published.announcement,'Draft only')
 await writeContent(container,'restore',2,null)
 const read=await readContent(container);assert.deepEqual(read.state.published,defaultContent);assert.equal(read.store.metadata.unrelated,'preserved')
})
test('concurrent saves cannot silently overwrite a revision',async()=>{
 const container=mock()
 const results=await Promise.allSettled([writeContent(container,'draft',0,defaultContent),writeContent(container,'draft',0,defaultContent)])
 assert.equal(results.filter(x=>x.status==='fulfilled').length,1)
 assert.match(results.find(x=>x.status==='rejected').reason.message,/Another editor/)
})
test('unsafe URLs, invalid IDs, oversized fields and unknown blocks are rejected',()=>{
 for(const change of [d=>d.sections[0].settings.primaryUrl='javascript:alert(1)',d=>d.sections[0].settings.image='data:image/svg+xml,bad',d=>d.sections.push(d.sections[0]),d=>d.sections[0].type='script',d=>d.announcement='a'.repeat(251)]){
 const doc=structuredClone(defaultContent);change(doc);assert.throws(()=>validateContent(doc))
 }
 assert.deepEqual(validateContent(defaultContent),defaultContent)
})
test('frontend and backend section definitions match',()=>{
 assert.deepEqual(require('../apps/backend/src/data/site-sections.json'),require('../apps/storefront/src/data/site-sections.json'))
})
