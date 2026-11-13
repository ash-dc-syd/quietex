import { test } from 'node:test'
import assert from 'node:assert/strict'
import { resolveImageRoles as storefront } from '../apps/storefront/src/lib/image-roles.ts'
import { resolveImageRoles as backend } from '../apps/backend/src/lib/image-roles.ts'
for(const [name,resolve] of [['storefront',storefront],['backend',backend]] as const){
 test(`${name}: deleted photos cannot return through thumbnail, finish or role metadata`,()=>{
  const media=resolve({images:[{url:'https://media/new'}],thumbnail:'https://media/deleted',variants:[{thumbnail:'https://media/deleted'}],metadata:{image_roles:[{url:'https://media/deleted',role:'lifestyle'}]}})
  assert.deepEqual(media.gallery,['https://media/new']);assert.equal(media.productImage,'https://media/new');assert.equal(media.lifestyleImage,'https://media/new')
 })
 test(`${name}: removing all media leaves no stale images`,()=>{
  const media=resolve({images:[],thumbnail:'https://media/old',variants:[{thumbnail:'https://media/old'}]})
  assert.deepEqual(media.gallery,[]);assert.equal(media.productImage,'');assert.equal(media.lifestyleImage,'')
 })
 test(`${name}: explicit roles order product before room photos and control hover`,()=>{
  const media=resolve({images:[{url:'room'},{url:'detail'},{url:'panel'}],variants:[{thumbnail:'detail'}],metadata:{image_roles:[{url:'room',role:'lifestyle'},{url:'detail',role:'detail'},{url:'panel',role:'product'}]}})
  assert.deepEqual(media.gallery,['panel','detail','room']);assert.equal(media.productImage,'panel');assert.equal(media.lifestyleImage,'room')
 })
 test(`${name}: untagged catalogue thumbnail can hover to an active finish photo`,()=>{
  const media=resolve({images:[{url:'catalogue'},{url:'panel'}],thumbnail:'catalogue',variants:[{thumbnail:'panel'}]})
  assert.equal(media.lifestyleImage,'catalogue');assert.equal(media.productImage,'panel');assert.equal(media.hasLifestyle,false)
 })
}
