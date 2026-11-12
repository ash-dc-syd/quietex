const {test}=require('node:test')
const assert=require('node:assert/strict')
const fs=require('node:fs'),Module=require('node:module')
const ts=require('../apps/storefront/node_modules/typescript')
const filename=require('node:path').resolve(__dirname,'../apps/storefront/src/lib/panel-calculator.ts')
const compiled=new Module(filename)
compiled._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,filename)
const {panelSize,calculatePanels}=compiled.exports

test('only explicit catalogue dimensions are accepted and normalised upright',()=>{
 for(const value of ['2700mm X 600mm','2700 mm × 600 mm'])assert.deepEqual(panelSize([{name:'Size',value}]),{widthMm:600,heightMm:2700})
 for(const value of ['unknown','1200 x 600','0mm x 600mm','600mm x 600mm approx.','600mm x 600mm x 12mm'])assert.equal(panelSize([{name:'Size',value}]),null)
 assert.equal(panelSize([]),null)
})
test('exact fit has no extra row or column, including decimal wall input',()=>{
 const r=calculatePanels(.6*3,2.4,{widthMm:600,heightMm:600},0)
 assert.equal(r.columns,3);assert.equal(r.rows,4);assert.equal(r.total,12);assert.equal(r.area,4.32)
})
test('partial edge panels round up in each direction rather than using area alone',()=>{
 const r=calculatePanels(1.21,1.21,{widthMm:600,heightMm:600},0)
 assert.equal(r.base,9);assert.equal(r.columns,3);assert.equal(r.rows,3)
})
test('extra allowance rounds up separately and rotation changes the layout',()=>{
 const upright=calculatePanels(3.6,2.4,{widthMm:1220,heightMm:2700},10)
 assert.equal(upright.base,3);assert.equal(upright.extra,1);assert.equal(upright.total,4)
 const rotated=calculatePanels(3.6,2.4,{widthMm:2700,heightMm:1220},15)
 assert.equal(rotated.base,4);assert.equal(rotated.extra,1);assert.equal(rotated.total,5)
})
test('invalid measurements and excessive requests cannot produce a quote quantity',()=>{
 for(const n of [0,-1,NaN,Infinity,30.001])assert.throws(()=>calculatePanels(n,2,{widthMm:600,heightMm:600},10))
 assert.throws(()=>calculatePanels(2,2,{widthMm:0,heightMm:600},10))
 assert.throws(()=>calculatePanels(2,2,{widthMm:600,heightMm:600},-10))
 assert.throws(()=>calculatePanels(30,30,{widthMm:1,heightMm:1},15))
})
