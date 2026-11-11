import fs from 'node:fs';
import {chromium,webkit} from 'playwright';
import {APP_URL} from './browser-target.mjs';
import {visibleArtReady} from './art-ready.mjs';
import {execFileSync} from 'node:child_process';

export const OUT='test-results/meta-05';
fs.mkdirSync(OUT+'/screens',{recursive:true});
export const launch=(engine,software=false)=>engine==='webkit'?webkit.launch({headless:true}):chromium.launch({channel:'msedge',headless:true,...software?{args:['--disable-gpu']}:{}});
export function writeResult(name,data){fs.writeFileSync(`${OUT}/${name}.json`,JSON.stringify(data,null,2)+'\n');}
export async function artReady(page){
 await visibleArtReady(page);
}
export async function go(page,route){
 await page.evaluate(r=>location.hash='/'+r,route);
 await page.waitForFunction(r=>document.querySelector('main')?.dataset.view===r.split('/')[0],route);
 await page.locator('main h1').waitFor();
}
export async function useArtMode(page,mode){
 // Preserve META-05's original-sheet comparison; current optimized mode is PERF-01.
 if(mode==='original'){
  for(const file of ['art.js','mobile-assets.js']){
   let body=execFileSync('git',['show','50329e3:meta/'+file],{encoding:'utf8'});
   if(file==='mobile-assets.js')body=body.replace('./art/mobile/','./art/sources/');
   await page.route('**/meta/'+file,route=>route.fulfill({body,contentType:'text/javascript'}));
  }
 }
}
export async function openCollection(page){
 await page.goto(APP_URL+'#/collection');
 await page.locator('.guardian').first().waitFor();await artReady(page);
}
