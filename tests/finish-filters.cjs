const {test}=require('node:test')
const assert=require('node:assert/strict')
const fs=require('node:fs'),Module=require('node:module'),path=require('node:path')
const ts=require('../apps/storefront/node_modules/typescript')
const file=path.resolve(__dirname,'../apps/storefront/src/lib/finish-filters.ts'),m=new Module(file)
m._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,file)
const {finishesForTone}=m.exports
const timber=[{name:'Navy Blue/Walnut',image:'walnut.jpg'},{name:'Sky Grey/Blackwood',image:'blackwood.jpg'}]
test('composite backing colours do not put timber in Light or Colour',()=>{
 assert.deepEqual(finishesForTone(timber,'Light'),[])
 assert.deepEqual(finishesForTone(timber,'Colour'),[])
 assert.equal(finishesForTone(timber,'Dark')[0].image,'blackwood.jpg')
 assert.equal(finishesForTone(timber,'Timber tones').length,2)
})
test('filter returns the matching finish image instead of the default colour',()=>{
 const finishes=[{name:'Olive Moss',image:'green.jpg'},{name:'Midnight Black',image:'black.jpg'}]
 assert.equal(finishesForTone(finishes,'Dark')[0].image,'black.jpg')
 assert.equal(finishesForTone(finishes,'Colour')[0].image,'green.jpg')
 assert.deepEqual(finishesForTone([{name:'Dark Blue'}],'Dark'),[])
 assert.equal(finishesForTone([{name:'Dark Blue'}],'Colour').length,1)
})
test('Light includes the real neutral finishes; unknown names stay in All panels',()=>{
 const finishes=[{name:'Artic White'},{name:'Sandstone'},{name:'Future finish'}]
 assert.equal(finishesForTone(finishes,'Light').length,2)
 assert.equal(finishesForTone(finishes,'All panels').length,3)
 assert.deepEqual(finishesForTone([{name:'Blacklisted greyish backing'}],'Light'),[])
 assert.equal(finishesForTone([{name:' Sky Grey / Blackwood '}],'Timber tones').length,1)
})
