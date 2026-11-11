import {APP_URL,TEST_ORIGIN} from './browser-target.mjs';
import {chromium} from 'playwright';import assert from 'node:assert/strict';import fs from 'node:fs';
import {startBrowserServer} from './browser-server.mjs';import {loadCatalog} from '../meta/catalog.js';import {initialState,SAVE_KEY} from '../meta/progression.js';import {PREFERENCE_KEY,DEFAULT_PREFERENCES} from '../meta/products/preferences.js';
const server=await startBrowserServer();let browser;const dir='test-results/int-01/screens';fs.mkdirSync(dir,{recursive:true});const results=[];
try{
 browser=await chromium.launch({channel:'msedge',headless:true});const catalog=await loadCatalog();
 for(const [width,height]of [[320,844],[390,844],[430,844],[320,568]]){
  const page=await browser.newPage({viewport:{width,height},isMobile:true,hasTouch:true});const errors=[],forbidden=[],resources=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>resources.push({url:r.url(),status:r.status()}));
  await page.route('**/*',route=>{const req=route.request(),url=new URL(req.url());if(url.origin!==TEST_ORIGIN||/\/(prototypes|game-data)\//.test(url.pathname)||req.method()!=='GET'){forbidden.push(req.url());return route.abort();}return route.continue();});
  await page.goto(APP_URL);await page.getByRole('heading',{name:'Un monde à découvrir'}).waitFor();
  await page.evaluate(([saveKey,state,prefKey,prefs])=>{localStorage.setItem(saveKey,JSON.stringify(state));localStorage.setItem(prefKey,JSON.stringify({schemaVersion:1,source:'demonstration',preferences:prefs}));localStorage.setItem('int01-v09-sentinel','preserve-exactly');},[SAVE_KEY,initialState(catalog),PREFERENCE_KEY,DEFAULT_PREFERENCES]);await page.reload();await page.getByRole('heading',{name:'Un monde à découvrir'}).waitFor();
  const before=await page.evaluate(()=>JSON.stringify({...localStorage}));
  const routes=['home','collection','guardian/demo-luma','guardian/demo-mousse','guardian/demo-nyx','guardian/missing','synergies','missions','shop','product/demo-skin-luma','product/demo-skill-bloom','product/demo-animation-stars','product/demo-decor-crystal','product/demo-profile-moon','product/missing','pass','profile','settings','demo','prepare','run','results','challenges','unknown'];
  for(const route of routes){await page.evaluate(r=>location.hash='/'+r,route);await page.waitForFunction(r=>document.querySelector('main').dataset.view===r.split('/')[0],route);await page.locator('main h1').waitFor({state:'visible'});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,route);
   const duplicateIds=await page.evaluate(()=>{const seen=new Set(),duplicates=[];for(const el of document.querySelectorAll('[id]')){if(seen.has(el.id))duplicates.push(el.id);seen.add(el.id);}return duplicates;});assert.deepEqual(duplicateIds,[],route);
   if(['home','collection','guardian/demo-luma','missions','shop','pass','profile','settings','prepare','challenges'].includes(route)){
    await page.evaluate(async()=>{for(const el of document.querySelectorAll('.art-sprite image')){const image=new Image();image.src=el.getAttribute('href');await image.decode();}});
    await page.screenshot({path:`${dir}/${route.replaceAll('/','-')}-${width}x${height}.png`});
   }
  }
  await page.evaluate(()=>location.hash='/demo');await page.getByLabel('Progression QA — Carnet de voyage',{exact:true}).fill('1');await page.getByRole('button',{name:'Appliquer · Carnet de voyage',exact:true}).click();
  await page.evaluate(()=>location.hash='/prepare');await page.getByRole('button',{name:'Lancer la démonstration',exact:true}).click();await page.getByRole('button',{name:'Afficher le résultat simulé',exact:true}).click();await page.getByRole('heading',{name:'Victoire · Démonstration',exact:true}).waitFor();await page.screenshot({path:`${dir}/result-${width}x${height}.png`});
  await page.evaluate(()=>location.hash='/missions');await page.locator('[data-mission="demo-m-journeys"]').getByText('1 / 3 · progression fictive',{exact:true}).waitFor();
  assert.equal(await page.evaluate(()=>JSON.stringify({...localStorage})),before);assert.deepEqual(errors,[]);assert.deepEqual(forbidden,[]);assert.deepEqual(resources.filter(r=>r.status>=400),[]);
  results.push({width,height,routes:routes.length,engineRequests:forbidden.length,jsErrors:errors.length,storageUnchanged:true,resources:[...new Map(resources.map(r=>[r.url,r])).values()]});await page.close();console.log(`${width}x${height}: 24 routes, unique DOM IDs, local resources, zero engine request and byte-preserved saves OK`);
 }
 // Read-only audit of legacy/corrupt/future formats. These bytes are seeded in a fresh test context, never the user's browser.
 const page=await browser.newPage();await page.goto(APP_URL);await page.getByRole('heading',{name:'Un monde à découvrir'}).waitFor();
 const cases=[JSON.stringify({schemaVersion:1,source:'demonstration',catalogVersion:'older-demo',unlockedGuardianIds:['demo-luma'],completedObjectiveIds:[]}),'{broken',JSON.stringify({schemaVersion:999,source:'demonstration'}),JSON.stringify({...initialState(catalog),catalogVersion:'retired-catalog',unlockedGuardianIds:['demo-luma','retired-id']})];
 for(const raw of cases){await page.evaluate(([key,raw])=>localStorage.setItem(key,raw),[SAVE_KEY,raw]);await page.goto(APP_URL+'#/profile');await page.reload();await page.locator('.profile-identity').waitFor();assert.equal(await page.evaluate(key=>localStorage.getItem(key),SAVE_KEY),raw);}
 await page.close();
}finally{await browser?.close();server.kill();}
fs.writeFileSync('test-results/int-01/browser-audit.json',JSON.stringify({viewports:results,legacyReadOnlyCases:4},null,2)+'\n');
