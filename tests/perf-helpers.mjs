import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {visibleArtReady} from './art-ready.mjs';
export const PERF_OUT='test-results/perf-01';fs.mkdirSync(PERF_OUT+'/screens',{recursive:true});
export const crops=JSON.parse(fs.readFileSync('meta/art/sprites/provenance.json','utf8'));
const full=JSON.parse(fs.readFileSync('meta/art/mobile/provenance.json','utf8'));
export const imageInfo=new Map([...crops.records.map(r=>['/meta/art/sprites/'+r.file,{bytes:r.bytes,rgbaBytes:r.rgbaBytes}]),...full.records.flatMap(r=>[['/meta/art/mobile/'+r.file,{bytes:r.bytes,rgbaBytes:r.width*r.height*4}],['/meta/art/sources/'+r.source,{bytes:r.sourceBytes,rgbaBytes:r.width*r.height*4}]])]);
export function writePerf(name,data){fs.writeFileSync(`${PERF_OUT}/${name}.json`,JSON.stringify(data,null,2)+'\n');}
const baseline=new Map(['app.js','art.js','mobile-assets.js'].map(file=>[file,execFileSync('git',['show','50329e3:meta/'+file],{encoding:'utf8'})]));
export async function usePerfMode(page,mode){
 // Both variants intercept the same module URLs. Image requests use actual shaped localhost HTTP.
 for(const file of baseline.keys()){
  const body=mode==='before'?baseline.get(file):fs.readFileSync('meta/'+file,'utf8');
  await page.route('**/meta/'+file,route=>route.fulfill({body,contentType:'text/javascript'}));
 }
}
export async function perfReady(page){await visibleArtReady(page);}
export async function imageMetrics(page){
 const resources=await page.evaluate(()=>performance.getEntriesByType('resource').filter(r=>/\.png$/.test(r.name)).map(r=>({path:new URL(r.name).pathname,bytes:r.encodedBodySize,duration:r.duration})));
 const unique=[...new Map(resources.map(r=>[r.path,r])).values()];
 return {requests:resources.length,uniqueImages:unique.length,encodedImageBytes:resources.reduce((n,r)=>n+r.bytes,0),decodedRgbaEstimate:unique.reduce((n,r)=>{if(!imageInfo.has(r.path))throw new Error('Unknown image '+r.path);return n+imageInfo.get(r.path).rgbaBytes;},0),images:unique};
}
