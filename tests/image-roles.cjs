const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs')
const {resolveImageRoles}=require('../apps/backend/.medusa/server/src/lib/image-roles')
test('cards use lifestyle while the gallery starts with product, then detail, then lifestyle',()=>{
 const r=resolveImageRoles({thumbnail:'life',images:[{url:'life'},{url:'detail'},{url:'p2'},{url:'p1'}],metadata:{image_roles:[{url:'life',role:'lifestyle'},{url:'p1',role:'product'},{url:'p2',role:'product'},{url:'detail',role:'detail'}]}})
 assert.equal(r.lifestyleImage,'life');assert.equal(r.productImage,'p1');assert.deepEqual(r.gallery,['p1','p2','detail','life'])
})
test('deleted images are not resurrected, duplicates are removed and missing roles fall back safely',()=>{
 const r=resolveImageRoles({thumbnail:'p',images:[{url:'p'}],variants:[{thumbnail:'finish'}],metadata:{image_roles:[{url:'deleted',role:'lifestyle'},{url:'p',role:'bad'},{url:'p',role:'product'},{url:'p',role:'lifestyle'}]}})
 assert.equal(r.hasLifestyle,false);assert.equal(r.lifestyleImage,'p');assert.deepEqual(r.gallery,['p','finish']);assert.deepEqual(resolveImageRoles({}).gallery,[])
})
test('only-lifestyle products still have an image and frontend ordering matches backend',()=>{
 const r=resolveImageRoles({images:[{url:'life'}],metadata:{image_roles:[{url:'life',role:'lifestyle'}]}});assert.equal(r.productImage,'life');assert.equal(r.lifestyleImage,'life')
 assert.equal(fs.readFileSync('apps/backend/src/lib/image-roles.ts','utf8'),fs.readFileSync('apps/storefront/src/lib/image-roles.ts','utf8'))
})

test('reviewed existing room photos default to lifestyle, but explicit assignments win',()=>{
 const room='https://quietex.com.au/wp-content/uploads/2025/10/home-theatre-hero.webp'
 assert.equal(resolveImageRoles({images:[{url:room}]}).hasLifestyle,true)
 assert.equal(resolveImageRoles({images:[{url:room}],metadata:{image_roles:[{url:room,role:'product'}]}}).hasLifestyle,false)
})
