import {chromium} from 'playwright';
import {spawn,execFileSync} from 'node:child_process';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const baseline=path=>execFileSync('git',['show',`66814ef:${path}`],{encoding:'utf8'});
const server=spawn(process.execPath,['tests/server.mjs'],{stdio:'ignore'});let browser;
const dir='test-results/ux-01';fs.mkdirSync(dir,{recursive:true});const captures=[];
try{
 await new Promise(r=>setTimeout(r,500));browser=await chromium.launch({channel:'msedge',headless:true});
 for(const width of [320,390,430])for(const mode of ['before','after']){
  const page=await browser.newPage({viewport:{width,height:844},isMobile:true,hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  if(mode==='before')for(const [file,type] of [['shell.css','text/css'],['app.js','text/javascript']]){const body=baseline('meta/'+file);await page.route('**/'+file,r=>r.fulfill({contentType:type,body}));}
  await page.goto('http://127.0.0.1:4173/meta/index.html');await page.getByRole('heading',{name:'Un monde à découvrir'}).waitFor();
  const storage=await page.evaluate(()=>JSON.stringify({...localStorage}));
  async function scroll(bottom=false){await page.evaluate(bottom=>{const m=document.querySelector('main');m.scrollTop=bottom?m.scrollHeight:0;window.scrollTo(0,bottom?document.documentElement.scrollHeight:0);},bottom);}
  async function capture(name){
   await page.evaluate(async()=>{await document.fonts.ready;for(const im of document.images){try{await im.decode();}catch{}}for(const el of document.querySelectorAll('.art-sprite image')){const im=new Image();im.src=el.getAttribute('href');await im.decode();}});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
   await page.screenshot({path:`${dir}/${name}-${width}-${mode}.png`});captures.push({name,width,mode});
  }
  await capture('home');
  for(const [route,title,name] of [['collection','Collection','collection'],['guardian/demo-luma',mode==='before'?'Gardien':'Luma','luma'],['guardian/demo-nyx',mode==='before'?'Gardien':'Nyx','nyx'],['synergies','Synergies','codex'],['profile','Profil','profile'],['prepare','Préparation','prepare']]){
   await page.evaluate(r=>location.hash='/'+r,route);await page.getByRole('heading',{name:title,level:1,exact:true}).waitFor();await scroll();await capture(name);
   if(name==='luma'){await page.locator('.art-study summary').click();await scroll(true);await capture('luma-evolutions-bottom');}
   if(name==='codex'){await scroll(true);await capture('codex-bottom');}
  }
  await page.getByRole('button',{name:'Lancer la démonstration',exact:true}).click();await page.getByRole('button',{name:'Afficher le résultat simulé',exact:true}).click();await page.getByRole('heading',{name:'Victoire · Démonstration'}).waitFor();await scroll();await capture('results');
  if(mode==='after'){await page.getByRole('link',{name:'Détails de la démonstration',exact:true}).click();await page.getByRole('heading',{name:'Démonstration et outils QA',level:1}).waitFor();await scroll();await capture('demo-tools');}
  assert.deepEqual(errors,[]);assert.equal(await page.evaluate(()=>JSON.stringify({...localStorage})),storage);await page.close();console.log(`${width}px ${mode}: viewport captures, overflow, asset load and storage OK`);
 }
}finally{await browser?.close();server.kill();}
fs.writeFileSync(`${dir}/validation.json`,JSON.stringify({baseline:'66814ef',widths:[320,390,430],viewportHeight:844,captures,storageUnchanged:true,scope:'UX layout comparison; viewport captures include explicit lower scroll positions.'},null,2));
