const {test}=require('node:test');const assert=require('node:assert/strict')
const {validateGallery}=require('../apps/backend/.medusa/server/src/lib/gallery-data')
const {readGallery,saveGallery}=require('../apps/backend/.medusa/server/src/lib/lifestyle-gallery')
const {writeContent,defaultContent}=require('../apps/backend/.medusa/server/src/lib/site-content')
const {GET}=require('../apps/backend/.medusa/server/src/api/store/lifestyle-gallery/route')
const photo={id:'room-one',url:'https://example.com/room.jpg',alt:'A room with blue wall panels',caption:'Home theatre inspiration',space:'home',panelHandle:'caroline'}
function mock(){let store={id:'store',metadata:{keep:'preserved'}};let gate=Promise.resolve();return {resolve:key=>({store:{listStores:async()=>[structuredClone(store)],updateStores:async(_id,value)=>{store={...store,...structuredClone(value)}}},locking:{execute:(_key,job)=>{const next=gate.then(job);gate=next.catch(()=>{});return next}}}[key])}}
test('gallery rejects unsafe URLs, unknown spaces, duplicate IDs and oversized metadata',()=>{
 for(const mutate of [p=>p.url='javascript:alert(1)',p=>p.space='other',p=>p.alt='',p=>p.panelHandle='../admin',p=>p.caption='x'.repeat(501)]){const p={...photo};mutate(p);assert.throws(()=>validateGallery([p]))}
 assert.throws(()=>validateGallery([photo,photo]));assert.throws(()=>validateGallery(Array(101).fill(photo)));assert.deepEqual(validateGallery([photo]),[photo])
})
test('gallery saves, filters by explicit category, and returns only public gallery content',async()=>{
 const scope=mock();await saveGallery(scope,0,[photo,{...photo,id:'office',space:'work'}]);const res={setHeader(){},json(value){this.value=value}}
 await GET({scope},res);assert.equal(res.value.images.length,2);assert.equal(res.value.images.filter(p=>p.space==='work')[0].id,'office');assert.deepEqual(Object.keys(res.value),['images'])
 const saved=await readGallery(scope);assert.equal(saved.store.metadata.keep,'preserved')
 await saveGallery(scope,1,[]);assert.deepEqual((await readGallery(scope)).state.images,[])
})
test('gallery and homepage saves preserve one another, and stale gallery saves fail',async()=>{
 const scope=mock();await saveGallery(scope,0,[photo]);await writeContent(scope,'publish',0,defaultContent);assert.deepEqual((await readGallery(scope)).state.images,[photo]);await assert.rejects(saveGallery(scope,0,[]),/gallery changed/)
 const results=await Promise.allSettled([saveGallery(scope,1,[]),saveGallery(scope,1,[photo])]);assert.equal(results.filter(x=>x.status==='fulfilled').length,1)
})
