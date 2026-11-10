const {test}=require('node:test');const assert=require('node:assert/strict')
const {POST}=require('../apps/backend/.medusa/server/src/api/admin/quietex-products/[id]/route')
const current={id:'prod_one',updated_at:'version-2',variants:[{id:'variant_one',title:'Finish'}],metadata:{unrelated:'keep'}}
const scope={resolve:key=>key==='locking'?{execute:(_key,fn)=>fn()}:{retrieveProduct:async()=>current}}
const body={updatedAt:'version-2',specifications:[{name:'Size',value:'600 mm'}],variants:[{id:'variant_one',image:'https://example.com/image.png'}]}
test('invalid URLs and foreign or missing variant IDs cannot update a product',async()=>{
 for(const change of [b=>b.variants[0].image='javascript:bad',b=>b.variants[0].id='foreign_variant',b=>b.variants=[],b=>b.specifications[0].name='']){const b=structuredClone(body);change(b);await assert.rejects(POST({body:b,params:{id:current.id},scope},{}),/valid specification/)}
})
test('stale product edits are rejected before a workflow runs',async()=>{await assert.rejects(POST({body:{...body,updatedAt:'version-1'},params:{id:current.id},scope},{}),/product changed/)})
