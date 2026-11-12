const {test}=require('node:test'),assert=require('node:assert/strict')
const fs=require('node:fs'),Module=require('node:module'),path=require('node:path')
const ts=require('../apps/storefront/node_modules/typescript')
const file=path.resolve(__dirname,'../apps/storefront/src/lib/site-url.ts'),m=new Module(file)
m._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,file)
const {siteOrigin,isIndexable,LIVE_ORIGIN}=m.exports

test('only the live apex can be indexable after explicit launch configuration',()=>{
 assert.equal(isIndexable('quietex.com.au','true',LIVE_ORIGIN),true)
 for(const host of ['quietex-production.up.railway.app','localhost:3000','www.quietex.com.au',null])assert.equal(isIndexable(host,'true',LIVE_ORIGIN),false)
 assert.equal(isIndexable('quietex.com.au','false',LIVE_ORIGIN),false)
 assert.equal(isIndexable('quietex.com.au','true','https://quietex-production.up.railway.app'),false)
})
test('metadata origins are valid and do not accidentally default to localhost',()=>{
 assert.equal(siteOrigin(''),LIVE_ORIGIN)
 assert.equal(siteOrigin('https://quietex.com.au/'),LIVE_ORIGIN)
 assert.throws(()=>siteOrigin('javascript:alert(1)'))
})
