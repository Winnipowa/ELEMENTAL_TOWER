import {chromium} from 'playwright';
import {spawn,execFileSync} from 'node:child_process';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const baselineFile=path=>execFileSync('git',['show',`9f6070b:${path}`],{encoding:'utf8'});
const baselineCSS=baselineFile('meta/shell.css'),baselineApp=baselineFile('meta/app.js');
const server=spawn(process.execPath,['tests/server.mjs'],{stdio:'ignore'});let browser;
const dir='test-results/da-03';fs.mkdirSync(dir,{recursive:true});const results=[];
try{
 await new Promise(r=>setTimeout(r,500));browser=await chromium.launch({channel:'msedge',headless:true});
 for(const width of [320,390,430])for(const mode of ['before','after']){
  const page=await browser.newPage({viewport:{width,height:844},isMobile:true,hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  if(mode==='before'){
   await page.route('**/shell.css',r=>r.fulfill({contentType:'text/css',body:baselineCSS}));
   await page.route('**/app.js',r=>r.fulfill({contentType:'text/javascript',body:baselineApp}));
  }
  await page.goto('http://127.0.0.1:4173/meta/index.html#/collection');await page.locator('.guardian').first().waitFor();
  const storage=await page.evaluate(()=>JSON.stringify({...localStorage}));
  async function capture(name){
   await page.evaluate(async()=>{await document.fonts.ready;for(const el of document.querySelectorAll('img')){if(!el.complete)await new Promise(r=>{el.onload=r;el.onerror=r;});}window.scrollTo(0,0);});
   if(mode==='after')await page.evaluate(async()=>{for(const el of document.querySelectorAll('.art-sprite image')){const image=new Image();image.src=el.getAttribute('href');await image.decode();}});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${width}/${mode}/${name}`);
   await page.screenshot({path:`${dir}/${name}-${width}-${mode}.png`,fullPage:true});
   const dark=await page.evaluate(async url=>{const im=new Image();im.src=url;await im.decode();const canvas=document.createElement('canvas');canvas.width=im.width;canvas.height=im.height;const cx=canvas.getContext('2d');cx.drawImage(im,0,0);const d=cx.getImageData(0,0,im.width,im.height).data;let count=0;for(let i=0;i<d.length;i+=4)if(d[i+2]>d[i]&&d[i+2]>=d[i+1]&&Math.max(d[i],d[i+1],d[i+2])<=110)count++;return Math.round(1000*count/(d.length/4))/10;},`http://127.0.0.1:4173/${dir}/${name}-${width}-${mode}.png`);
   results.push({screen:name,width,mode,deepBluePercent:dark});
  }
  await capture('collection');
  for(const id of ['luma','mousse','nyx']){
   await page.evaluate(id=>location.hash='/guardian/demo-'+id,id);await page.getByRole('heading',{name:{luma:'Luma',mousse:'Mousse',nyx:'Nyx'}[id],level:2,exact:true}).waitFor();
   await capture(id);
   if(mode==='after'){await page.locator('summary').click();await capture(`${id}-references`);}
  }
  await page.evaluate(()=>location.hash='/synergies');await page.getByRole('heading',{name:'Synergies',level:1,exact:true}).waitFor();await capture('codex');
  assert.equal(await page.evaluate(()=>JSON.stringify({...localStorage})),storage);
  if(mode==='after'){
   await page.route('**/guardians-primary.png',r=>r.abort());
   await page.goto('http://127.0.0.1:4173/meta/index.html#/collection');await page.reload();
   await page.locator('.portrait-reference.art-unavailable').first().waitFor();
   assert.equal(await page.locator('.portrait-reference.art-unavailable').count(),3);
  }
  assert.deepEqual(errors,[]);await page.close();console.log(`${width}px ${mode}: portraits, FX, details, codex and storage OK`);
 }
}finally{await browser?.close();server.kill();}
fs.writeFileSync(`${dir}/validation.json`,JSON.stringify({baseline:'9f6070b',widths:[320,390,430],storageUnchanged:true,coverageMethod:'RGB blue-dominant, max channel <=110; approximate, not perceptual',captures:results},null,2));
