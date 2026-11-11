import fs from 'node:fs';
import {chromium,webkit} from 'playwright';
import {APP_URL} from './browser-target.mjs';

export const OUT='test-results/meta-05';
fs.mkdirSync(OUT+'/screens',{recursive:true});
export const launch=(engine,software=false)=>engine==='webkit'?webkit.launch({headless:true}):chromium.launch({channel:'msedge',headless:true,...software?{args:['--disable-gpu']}:{}});
export function writeResult(name,data){fs.writeFileSync(`${OUT}/${name}.json`,JSON.stringify(data,null,2)+'\n');}
export async function artReady(page){
 await page.evaluate(async()=>{
  await Promise.all([...document.querySelectorAll('.art-sprite image')].map(async el=>{const image=new Image();image.src=el.getAttribute('href');await image.decode();}));
  await document.fonts.ready;
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
 });
}
export async function go(page,route){
 await page.evaluate(r=>location.hash='/'+r,route);
 await page.waitForFunction(r=>document.querySelector('main')?.dataset.view===r.split('/')[0],route);
 await page.locator('main h1').waitFor();
}
export async function useArtMode(page,mode){
 const original=fs.readFileSync('meta/art.js','utf8');
 const body=mode==='original'?original.replace('${sheetHref(sheet.file)}','./art/sources/${sheet.file}'):original;
 // Same tiny module interception for both modes; PNG bodies use actual HTTP/network shaping.
 await page.route('**/meta/art.js',route=>route.fulfill({body,contentType:'text/javascript'}));
}
export async function openCollection(page){
 await page.goto(APP_URL+'#/collection');
 await page.locator('.guardian').first().waitFor();await artReady(page);
}
