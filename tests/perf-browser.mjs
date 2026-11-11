import assert from 'node:assert/strict';
import {launch,go} from './mobile-helpers.mjs';
import {APP_URL,TEST_ORIGIN} from './browser-target.mjs';
import {startBrowserServer} from './browser-server.mjs';
import {PERF_OUT,crops,usePerfMode,perfReady,imageMetrics,writePerf} from './perf-helpers.mjs';

const server=await startBrowserServer(),report={physicalDevices:false,pixels:[],coldScreens:[],lazy:[],comparisons:[]};
const sizes=[[320,844],[390,844],[430,844],[320,568]];
const waitScreen=async(page,route)=>{
 await page.goto(APP_URL+'#/'+route);await page.locator('main h1').waitFor();
 await page.locator('main .loading').waitFor({state:'hidden'});
 if(route==='collection')await page.locator('.guardian').first().waitFor();
 if(route.startsWith('guardian/'))await page.locator('.guardian-hero').waitFor();
 if(route==='synergies')await page.locator('.codex-art-strip').waitFor();
 if(route==='shop')await page.locator('.product-card').first().waitFor();
 if(route==='missions')await page.locator('.mission-card').first().waitFor();
 if(route==='pass')await page.locator('.pass-tier').first().waitFor();
 if(route.startsWith('product/'))await page.locator('main .product-art').waitFor();
 await perfReady(page);
};
try{
 for(const engine of ['edge','webkit']){
  const browser=await launch(engine);
  try{
   // Browser decoder parity over the entire padded crop, not just the opaque character.
   const pixelPage=await browser.newPage();await pixelPage.goto(APP_URL+'#/settings');
   const pixels=await pixelPage.evaluate(async records=>{
    const sources=new Map(),decode=async url=>{const image=new Image();image.src=url;await image.decode();const c=document.createElement('canvas');c.width=image.naturalWidth;c.height=image.naturalHeight;const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0);return ctx;};
    const results=[];
    for(const r of records){
     if(!sources.has(r.source))sources.set(r.source,await decode('./art/sources/'+r.source));
     const [x,y,w,h]=r.cropRect,a=sources.get(r.source).getImageData(x,y,w,h).data,b=(await decode('./art/sprites/'+r.file)).getImageData(0,0,w,h).data;let differences=0;
     for(let i=0;i<a.length;i++)if(a[i]!==b[i])differences++;
     results.push({key:r.key,differences});
    }return results;
   },crops.records);
   for(const r of pixels)assert.equal(r.differences,0,engine+' RGBA '+r.key);
   report.pixels.push({engine,records:pixels});await pixelPage.close();
   for(const [width,height]of sizes){
    const context=await browser.newContext({viewport:{width,height},isMobile:true,hasTouch:true,reducedMotion:'reduce'}),page=await context.newPage(),errors=[],badRequests=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.route('**/*',route=>{if(new URL(route.request().url()).origin!==TEST_ORIGIN){badRequests.push(route.request().url());return route.abort();}return route.continue();});
    await waitScreen(page,'collection');await page.evaluate(()=>localStorage.setItem('perf-preservation','exact-bytes'));
    const storage=await page.evaluate(()=>JSON.stringify({...localStorage}));
    assert.equal(await page.locator('image[href*="/mobile/"],image[href*="/sources/"]').count(),0);
    const initial=await imageMetrics(page);assert.ok(initial.images.every(r=>r.path.includes('/sprites/')));
    // Scrolling must expose deferred portraits/badges without changing layout or navigation.
    await page.locator('main').evaluate(el=>el.scrollTop=el.scrollHeight);await perfReady(page);
    const scrolled=await imageMetrics(page);assert.ok(scrolled.uniqueImages>=initial.uniqueImages);
    await go(page,'guardian/demo-luma');await perfReady(page);
    assert.equal(await page.locator('.art-study image[href]').count(),0,'Closed evolutions must have no resource URLs');
    await page.locator('.art-study summary').scrollIntoViewIfNeeded();await perfReady(page);
    assert.equal(await page.locator('.art-study image[href]').count(),0);
    await page.locator('.art-study summary').click();
    for(const figure of await page.locator('.rank-gallery figure').all()){await figure.scrollIntoViewIfNeeded();await perfReady(page);}
    assert.equal(await page.locator('.art-study image[data-art-state="loaded"]').count(),5);
    const ranksBefore=await imageMetrics(page);await page.locator('.art-study summary').click();await page.locator('.art-study summary').click();await perfReady(page);
    assert.equal((await imageMetrics(page)).requests,ranksBefore.requests,'Reopening unchanged loaded DOM must not refetch ranks');
    await go(page,'guardian/demo-mousse');await perfReady(page);
    await page.evaluate(()=>window.detachedArtStudy=document.querySelector('.art-study'));
    await go(page,'settings');const beforeDetached=(await imageMetrics(page)).requests;
    await page.evaluate(()=>{window.detachedArtStudy.open=true;dispatchEvent(new Event('resize'));});
    await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
    assert.equal(await page.evaluate(()=>window.detachedArtStudy.querySelectorAll('image[href]').length),0);
    assert.equal((await imageMetrics(page)).requests,beforeDetached,'Disposed screen must not load detached artwork');
    await go(page,'product/demo-skin-luma');await page.locator('main .product-art').waitFor();await perfReady(page);
    await page.getByRole('button',{name:/Prévisualiser/}).click();await page.locator('dialog[open] .guardian-figure image[data-art-state="loaded"]').waitFor();await perfReady(page);
    await page.getByRole('button',{name:'Fermer',exact:true}).click();
    assert.equal(await page.evaluate(()=>JSON.stringify({...localStorage})),storage);assert.deepEqual(errors,[]);assert.deepEqual(badRequests,[]);
    report.lazy.push({engine,width,height,initial,scrolled,closedDetailsNotRequested:true,openedRanksLoaded:5,reopenNoRefetch:true,detachedScreenNoLoad:true,previewLoaded:true,storageUnchanged:true});
    await context.close();console.log(`${engine} ${width}x${height}: lazy portraits/ranks/preview, cleanup, storage OK`);
   }
   // Fallback without IntersectionObserver: geometry + scroll/toggle/resize still defer closed ranks.
   const fallback=await browser.newPage({viewport:{width:320,height:568}});await fallback.addInitScript(()=>window.IntersectionObserver=undefined);
   await waitScreen(fallback,'guardian/demo-luma');assert.equal(await fallback.locator('.art-study image[href]').count(),0);
   await fallback.locator('.art-study summary').scrollIntoViewIfNeeded();await fallback.locator('.art-study summary').click();
   await fallback.locator('.rank-gallery figure').first().scrollIntoViewIfNeeded();await perfReady(fallback);assert.ok(await fallback.locator('.art-study image[href]').count()>0);
   await fallback.close();
   // Matched before/after captures on all mobile geometries; no change to CSS or logical viewBoxes.
   for(const [width,height]of sizes)for(const mode of ['before','after']){
    const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});await usePerfMode(page,mode);
    for(const route of ['collection','guardian/demo-luma','guardian/demo-mousse','guardian/demo-nyx','synergies','shop']){
     await waitScreen(page,route);const name=route.replaceAll('/','-');
     await page.screenshot({path:`${PERF_OUT}/screens/${engine}-${mode}-${name}-${width}x${height}.png`});
     const boxes=await page.locator('.art-sprite').evaluateAll(els=>els.map(e=>({viewBox:e.querySelector('svg').getAttribute('viewBox'),width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height})));
     report.comparisons.push({engine,width,height,mode,route,boxes});
     if(route==='guardian/demo-luma'){
      await page.locator('.ability-reference').scrollIntoViewIfNeeded();await perfReady(page);
      await page.screenshot({path:`${PERF_OUT}/screens/${engine}-${mode}-luma-fx-${width}x${height}.png`});
      await page.locator('.art-study summary').scrollIntoViewIfNeeded();await page.locator('.art-study summary').click();
      await page.locator('.rank-gallery figure').first().scrollIntoViewIfNeeded();await perfReady(page);
      await page.screenshot({path:`${PERF_OUT}/screens/${engine}-${mode}-luma-ranks-start-${width}x${height}.png`});
      await page.locator('.rank-gallery figure').last().scrollIntoViewIfNeeded();await perfReady(page);
      await page.screenshot({path:`${PERF_OUT}/screens/${engine}-${mode}-luma-ranks-end-${width}x${height}.png`});
     }
    }await page.close();
   }
  }finally{await browser.close();}
 }
 // Cold screen inventory before/after. Do not contaminate it with screenshot scrolling/decoding of hidden assets.
 const browser=await launch('edge');
 try{
  for(const route of ['home','collection','guardian/demo-luma','guardian/demo-mousse','guardian/demo-nyx','synergies','missions','shop','product/demo-skin-luma','pass','profile','settings','prepare','run','results','challenges','demo'])for(const mode of ['before','after']){
   const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await usePerfMode(page,mode);await waitScreen(page,route);
   await page.waitForLoadState('networkidle');const metrics=await imageMetrics(page);report.coldScreens.push({route,mode,...metrics});await page.close();
  }
 }finally{await browser.close();}
 for(const before of report.comparisons.filter(r=>r.mode==='before')){
  const after=report.comparisons.find(r=>r.mode==='after'&&r.engine===before.engine&&r.width===before.width&&r.height===before.height&&r.route===before.route);
  assert.deepEqual(after.boxes,before.boxes,'Artwork layout/viewBoxes changed');
 }
 writePerf('browser',report);
}finally{server.kill();}
