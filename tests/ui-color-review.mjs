// DA-04 UI light distribution against DA-03; structure and state remain unchanged.
import {chromium} from 'playwright';
import {spawn,execFileSync} from 'node:child_process';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const baseline=execFileSync('git',['show','36da594:meta/shell.css'],{encoding:'utf8'});
const server=spawn(process.execPath,['tests/server.mjs'],{stdio:'ignore'});
const dir='test-results/da-04';fs.mkdirSync(dir,{recursive:true});
let browser;
const geometry=new Map();
const coverage=[];
try{
 await new Promise(r=>setTimeout(r,500));browser=await chromium.launch({channel:'msedge',headless:true});
 for(const width of [320,390,430])for(const mode of ['before','after']){
  const page=await browser.newPage({viewport:{width,height:844},isMobile:true,hasTouch:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  if(mode==='before')await page.route('**/shell.css',route=>route.fulfill({contentType:'text/css',body:baseline}));
  await page.goto('http://127.0.0.1:4173/meta/index.html');await page.getByRole('heading',{name:'Un monde à découvrir'}).waitFor();
  const storage=await page.evaluate(()=>JSON.stringify({...localStorage}));
  async function capture(name){
   await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(img=>img.complete?Promise.resolve():new Promise(r=>{img.addEventListener('load',r,{once:true});img.addEventListener('error',r,{once:true});})));window.scrollTo(0,0);});
   await page.evaluate(async()=>{for(const el of document.querySelectorAll('.art-sprite image')){const im=new Image();im.src=el.getAttribute('href');await im.decode();}});
   const layout=await page.evaluate(()=>[...document.querySelectorAll('header,aside,main,nav,main h1,main h2,main p,main a,main button,main .card')].map(el=>{const r=el.getBoundingClientRect();return [el.tagName,el.textContent.trim(),r.x,r.y,r.width,r.height];}));
   const key=`${name}-${width}`;
   if(mode==='before')geometry.set(key,layout);else assert.deepEqual(layout,geometry.get(key),`Layout changed: ${key}`);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
   await page.screenshot({path:`${dir}/${name}-${width}-${mode}.png`,fullPage:true});
   if(mode==='after'){
    const deepBluePercent=await page.evaluate(async url=>{
     const image=new Image();image.src=url;await image.decode();
     const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;
     const context=canvas.getContext('2d');context.drawImage(image,0,0);const pixels=context.getImageData(0,0,image.width,image.height).data;
     let count=0;for(let i=0;i<pixels.length;i+=4){const [r,g,b]=pixels.slice(i,i+3);if(b>r && b>=g && Math.max(r,g,b)<=110)count++;}
     return Math.round(1000*count/(pixels.length/4))/10;
    },`http://127.0.0.1:4173/${dir}/${name}-${width}-${mode}.png`);
    coverage.push({screen:name,width,deepBluePercent});
   }
  }
  await capture('home');
  for(const [route,title] of [['collection','Collection'],['guardian/demo-nyx','Gardien'],['missions','Missions'],['shop','Boutique'],['profile','Profil'],['settings','Paramètres'],['pass','Pass'],['synergies','Synergies'],['prepare','Préparation']]){
   await page.evaluate(route=>location.hash='/'+route,route);await page.getByRole('heading',{name:title,level:1,exact:true}).waitFor();await capture(route.replace('/','-'));
   if(route==='collection'){
    await page.locator('#family').selectOption('Sylve');
    await page.locator('#family').focus();
    await capture('collection-filter-active');
    await page.locator('#family').selectOption('Toutes');
   }
  }
  await page.getByRole('button',{name:'Lancer la démonstration',exact:true}).click();await page.getByRole('heading',{name:'GameBridge · Démonstration',exact:true}).waitFor();await capture('bridge');
  await page.getByRole('button',{name:'Afficher le résultat simulé',exact:true}).click();await page.getByRole('heading',{name:'Victoire · Démonstration',exact:true}).waitFor();await capture('results');
  assert.equal(await page.evaluate(()=>JSON.stringify({...localStorage})),storage);assert.deepEqual(errors,[]);
  await page.close();console.log(`${width}px ${mode}: 13 captures, layout/overflow/storage OK`);
 }
}finally{await browser?.close();server.kill();}
const luminance=hex=>{const rgb=hex.match(/\w\w/g).map(x=>parseInt(x,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};
const ratio=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
const contrasts=[];
for(const [fg,bg] of [['F3F7FF','132345'],['B8C7E6','132345'],['7DDCFF','132345'],['A6F0FF','132345'],['B8A7FF','132345'],['B7FFB0','132345'],['07111F','7DDCFF'],['07111F','A6F0FF']]){const value=ratio(fg,bg);assert.ok(value>=4.5);contrasts.push({foreground:'#'+fg,background:'#'+bg,ratio:Number(value.toFixed(2))});}
fs.writeFileSync(`${dir}/validation.json`,JSON.stringify({widths:[320,390,430],screens:coverage.length/3,layoutUnchanged:true,storageUnchanged:true,textContrast:contrasts,coverageMethod:"Approximate blue-dominant RGB pixels, max channel <=110; excludes text, portraits and accents",coverage},null,2));
console.log('Text palette contrast >= 4.5:1 on tested pairs.');

console.log('Approximate deep-blue area range:',Math.min(...coverage.map(x=>x.deepBluePercent)),Math.max(...coverage.map(x=>x.deepBluePercent)));
