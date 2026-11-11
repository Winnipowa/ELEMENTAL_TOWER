import assert from 'node:assert/strict';
import fs from 'node:fs';
import {APP_URL,TEST_ORIGIN} from './browser-target.mjs';
import {startBrowserServer} from './browser-server.mjs';
import {OUT,launch,artReady,go,useArtMode,openCollection,writeResult} from './mobile-helpers.mjs';

const server=await startBrowserServer();
const report={physicalDevicesTested:false,engines:[],pixels:[],visualComparisons:[],degraded:[]};
const routes=['home','collection','guardian/demo-luma','guardian/demo-mousse','guardian/demo-nyx','guardian/missing','synergies','missions','shop','product/demo-skin-luma','product/demo-skill-bloom','product/demo-animation-stars','product/demo-decor-crystal','product/demo-profile-moon','product/missing','pass','profile','settings','demo','prepare','run','results','challenges','unknown'];
try{
 for(const engine of ['edge','webkit']){
  const browser=await launch(engine);
  try{
   for(const [width,height]of [[320,844],[390,844],[430,844],[320,568]]){
    const context=await browser.newContext({viewport:{width,height},isMobile:true,hasTouch:true,deviceScaleFactor:2,reducedMotion:'reduce'});
    const page=await context.newPage(),errors=[],external=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.route('**/*',route=>{if(new URL(route.request().url()).origin!==TEST_ORIGIN){external.push(route.request().url());return route.abort();}return route.continue();});
    await openCollection(page);
    await page.evaluate(()=>localStorage.setItem('meta05-v09-sentinel','do-not-modify'));
    const storage=await page.evaluate(()=>JSON.stringify({...localStorage}));
    for(const route of routes){
     await go(page,route);
     assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${engine} ${width}: overflow ${route}`);
     if(['collection','guardian/demo-luma','synergies','missions','shop','pass','prepare','settings'].includes(route)){
      await artReady(page);await page.screenshot({path:`${OUT}/screens/${engine}-${route.replaceAll('/','-')}-${width}x${height}.png`});
      // Exercise visible interactive controls in the actual content scroll container.
      const controls=page.locator('main a:visible, main button:visible, main input:visible, main select:visible, main summary:visible');
      for(let i=0;i<await controls.count();i++){
       const control=controls.nth(i);await control.scrollIntoViewIfNeeded();
       const r=await control.boundingBox(),m=await page.locator('main').boundingBox(),n=await page.locator('nav').boundingBox();
       assert.ok(r.y>=m.y-1&&r.y+r.height<=n.y+1,`${engine} control outside main: ${route}`);
      }
     }
    }
    await go(page,'collection');await go(page,'guardian/demo-luma');await page.goBack();await page.getByRole('heading',{name:'Collection',exact:true}).waitFor();
    // Visual viewport resizing represents geometry only, not an actual software keyboard.
    await page.setViewportSize({width,height:568});await page.getByLabel('Rechercher').focus();
    assert.ok(await page.evaluate(()=>document.querySelector('nav').getBoundingClientRect().bottom<=innerHeight+1));
    const support=await page.evaluate(()=>({dvh:CSS.supports('height','100dvh'),colorMix:CSS.supports('color','color-mix(in srgb,red,blue)'),safeArea:CSS.supports('padding-top','env(safe-area-inset-top)'),inputFont:getComputedStyle(document.querySelector('#search')).fontSize,headerTop:getComputedStyle(document.querySelector('header')).paddingTop,navBottom:getComputedStyle(document.querySelector('nav')).paddingBottom}));
    assert.deepEqual(errors,[]);assert.deepEqual(external,[]);assert.equal(await page.evaluate(()=>JSON.stringify({...localStorage})),storage);
    report.engines.push({engine,version:browser.version(),width,height,routes:routes.length,historyBack:true,controlsReachable:true,storageUnchanged:true,support});
    await context.close();console.log(`${engine} ${width}x${height}: routes, controls, history, viewport resize, local-only network OK`);
   }
   // Decode original and optimized PNGs through each browser, verifying all RGBA channels.
   const pixelsPage=await browser.newPage();await pixelsPage.goto(APP_URL);
   const manifest=JSON.parse(fs.readFileSync('meta/art/mobile/provenance.json','utf8'));
   for(const r of manifest.records){
    const comparison=await pixelsPage.evaluate(async r=>{
     const decode=async(url,background)=>{const img=new Image();img.src=url;await img.decode();const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const ctx=c.getContext('2d',{willReadFrequently:true});if(background){ctx.fillStyle=background;ctx.fillRect(0,0,c.width,c.height);}ctx.drawImage(img,0,0);return {width:c.width,height:c.height,data:ctx.getImageData(0,0,c.width,c.height).data};};
     const results=[];
     for(const background of [null,'#07111F','#132345','#FFFFFF']){
      const a=await decode('./art/sources/'+r.source,background),b=await decode('./art/mobile/'+r.file,background);let differingChannels=0,maxChannelDelta=0,alphaDifferences=0;
      for(let i=0;i<a.data.length;i++){const delta=Math.abs(a.data[i]-b.data[i]);if(delta){differingChannels++;maxChannelDelta=Math.max(maxChannelDelta,delta);if(i%4===3)alphaDifferences++;}}
      results.push({background,differingChannels,maxChannelDelta,alphaDifferences});
     }
     const dimensions=new Image();dimensions.src='./art/mobile/'+r.file;await dimensions.decode();
     return {width:dimensions.naturalWidth,height:dimensions.naturalHeight,results};
    },r);
    assert.equal(comparison.width,r.width);assert.equal(comparison.height,r.height);
    for(const result of comparison.results)assert.equal(result.maxChannelDelta,0,engine+' RGBA '+r.source);
    report.pixels.push({engine,file:r.file,...comparison});
   }
   await pixelsPage.close();
   // Compare the same UI under original vs optimized PNG at identical viewport/settings.
   // Edge's GPU raster cache varies even in A/A captures. Software rendering isolates asset parity.
   // Functional QA and performance measurements keep the normal renderer.
   const visualBrowser=engine==='edge'?await launch(engine,true):browser;
   try{
   for(const width of [320,390,430]){
    const captures={};
    for(const mode of ['original','optimized']){
     const page=await visualBrowser.newPage({viewport:{width,height:844},deviceScaleFactor:1,reducedMotion:'reduce'});await useArtMode(page,mode);await openCollection(page);
     captures[mode]={};
     for(const route of ['collection','guardian/demo-luma','guardian/demo-mousse','guardian/demo-nyx','synergies','product/demo-skin-luma']){
      await go(page,route);await artReady(page);
      const file=`${OUT}/screens/${engine}-${mode}-${route.replaceAll('/','-')}-${width}.png`;
      await page.screenshot({path:file});captures[mode][route]=TEST_ORIGIN+'/'+file;
     }
     await page.close();
    }
    const comparePage=await visualBrowser.newPage();await comparePage.goto(APP_URL);const screens=[];
    for(const route of Object.keys(captures.original)){
     const delta=await comparePage.evaluate(async([original,optimized])=>{
      const decode=async url=>{const image=new Image();image.src=url;await image.decode();const c=document.createElement('canvas');c.width=image.naturalWidth;c.height=image.naturalHeight;const ctx=c.getContext('2d');ctx.drawImage(image,0,0);return ctx.getImageData(0,0,c.width,c.height).data;};
      const a=await decode(original),b=await decode(optimized);let max=0,differences=0;const pixels=new Set();for(let i=0;i<a.length;i++){const d=Math.abs(a[i]-b[i]);if(d){max=Math.max(max,d);differences++;pixels.add(Math.floor(i/4));}}return {maxChannelDelta:max,differingChannels:differences,differingPixels:pixels.size};
     },[captures.original[route],captures.optimized[route]]);
     // The exact asset RGBA gate above is authoritative. Whole-page GPU/filter rasterization
     // varies in A/A captures too: keep these differences as review evidence, not a false parity claim.
     screens.push({route,...delta});
    }
    await comparePage.close();report.visualComparisons.push({engine,width,screens,pixelEqualityGate:false,requiresHumanReview:true,exactAssetRgbaGate:true,renderer:engine==='edge'?'software-for-comparison':'default',note:'Whole-page raster differences are informational; A/A raster-cache variation observed. No claim of screenshot pixel identity.'});
   }
   }finally{if(visualBrowser!==browser)await visualBrowser.close();}
   const page=await browser.newPage({viewport:{width:320,height:568}});await openCollection(page);
   // Derivative failure falls back to original; failure of both keeps the portrait label.
   await page.route('**/art/sprites/guardians-primary_*.png',route=>route.abort());await page.reload();
   await page.waitForFunction(()=>{const images=[...document.querySelectorAll('.guardian-figure image[href]')];return images.length>0&&images.every(x=>x.getAttribute('href').includes('/sources/'));});await artReady(page);
   await page.route('**/art/sources/guardians-primary.png',route=>route.abort());await page.reload();await page.locator('.portrait-fallback:not([hidden])').first().waitFor();
   await page.screenshot({path:`${OUT}/screens/${engine}-asset-unavailable-320x568.png`});await page.unrouteAll();
   let release;const held=new Promise(resolve=>release=resolve);
   await page.route('**/data/catalog.demo.json',async route=>{await held;await route.fulfill({status:503,body:'QA offline'});});
   await page.reload({waitUntil:'domcontentloaded'});await page.getByText('Chargement du catalogue de démonstration…',{exact:true}).waitFor();
   release();await page.getByRole('heading',{name:'Catalogue indisponible'}).waitFor();
   await page.screenshot({path:`${OUT}/screens/${engine}-catalog-error-320x568.png`});await page.unrouteAll();
   await page.getByRole('button',{name:'Réessayer',exact:true}).click();await page.locator('.guardian').first().waitFor();await artReady(page);
   await page.context().setOffline(true);await go(page,'settings');await page.getByRole('heading',{name:'Paramètres',exact:true}).waitFor();
   let reloadFailed=false;try{await page.reload({timeout:10000});}catch{reloadFailed=true;}
   assert.equal(reloadFailed,true,'No service worker: offline reload must not be advertised as supported');
   await page.context().setOffline(false);await page.goto(APP_URL+'#/collection');await page.locator('.guardian').first().waitFor();
   report.degraded.push({engine,derivativeFallback:true,missingPortraitLabel:true,delayedCatalogLoading:true,http503Retry:true,warmInMemoryNavigationOffline:true,offlineReloadSupported:false,recoveryAfterOffline:true});
   await page.close();
  }finally{await browser.close();}
 }
 writeResult('browser',report);
}finally{server.kill();}
