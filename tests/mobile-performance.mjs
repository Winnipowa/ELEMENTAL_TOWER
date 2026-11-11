import assert from 'node:assert/strict';
import fs from 'node:fs';
import {startBrowserServer} from './browser-server.mjs';
import {OUT,launch,artReady,go,useArtMode,openCollection,writeResult} from './mobile-helpers.mjs';
const server=await startBrowserServer();let browser;
const report={method:'Local HTTP no-store; cold browser contexts; real original/optimized PNG requests, same art-module interception; desktop CDP shaping, not a physical-device score',samples:[],safeArea:null,memory:null};
const profiles=[{name:'local-unthrottled',latency:0,downloadThroughput:-1,uploadThroughput:-1,cpu:1},{name:'constrained-4Mbps-80ms-cpu4',latency:80,downloadThroughput:500000,uploadThroughput:125000,cpu:4}];
try{
 browser=await launch('edge');report.browserVersion=browser.version();
 for(const profile of profiles){
  for(let trial=1;trial<=3;trial++)for(const mode of trial%2?['original','optimized']:['optimized','original']){
   const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true,reducedMotion:'reduce'});
   const page=await context.newPage(),cdp=await context.newCDPSession(page),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
   await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:profile.latency,downloadThroughput:profile.downloadThroughput,uploadThroughput:profile.uploadThroughput});
   await cdp.send('Emulation.setCPUThrottlingRate',{rate:profile.cpu});
   await cdp.send('Performance.enable');
   await page.addInitScript(()=>{window.qaLongTasks=[];new PerformanceObserver(list=>window.qaLongTasks.push(...list.getEntries().map(e=>({start:e.startTime,duration:e.duration})))).observe({type:'longtask',buffered:true});});
   await useArtMode(page,mode);await openCollection(page);
   const metrics=await page.evaluate(()=>{
    const resources=performance.getEntriesByType('resource');const navigation=performance.getEntriesByType('navigation')[0];
    return {artReadyMs:performance.now(),domContentLoadedMs:navigation.domContentLoadedEventEnd,fcpMs:performance.getEntriesByName('first-contentful-paint')[0]?.startTime??null,resourceEncodedBytes:resources.reduce((n,r)=>n+r.encodedBodySize,0),imageEncodedBytes:resources.filter(r=>/\.(png|webp)$/.test(r.name)).reduce((n,r)=>n+r.encodedBodySize,0),resources:resources.map(r=>({name:new URL(r.name).pathname,bytes:r.encodedBodySize,duration:r.duration})),longTasks:window.qaLongTasks};
   });
   const heap=Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(m=>[m.name,m.value]));
   assert.deepEqual(errors,[]);assert.ok(metrics.imageEncodedBytes>0);assert.ok(metrics.artReadyMs<60000,'Provisional smoke ceiling, not beta performance approval');
   report.samples.push({profile:profile.name,trial,mode,...metrics,jsHeapUsedBytes:heap.JSHeapUsedSize});
   console.log(`${profile.name} ${mode} trial ${trial}: ${Math.round(metrics.artReadyMs)}ms art ready; ${metrics.imageEncodedBytes} image bytes`);
   writeResult('performance',report);await context.close();
  }
 }
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const page=await context.newPage(),cdp=await context.newCDPSession(page);await openCollection(page);
 await cdp.send('Emulation.setSafeAreaInsetsOverride',{insets:{top:47,bottom:34,left:0,right:0}});
 const safe=await page.evaluate(()=>({headerPaddingTop:parseFloat(getComputedStyle(document.querySelector('header')).paddingTop),navPaddingBottom:parseFloat(getComputedStyle(document.querySelector('nav')).paddingBottom),navBottom:document.querySelector('nav').getBoundingClientRect().bottom,viewport:innerHeight}));
 assert.ok(safe.headerPaddingTop>=61);assert.ok(safe.navPaddingBottom>=42);assert.ok(safe.navBottom<=safe.viewport+1);
 report.safeArea={...safe,syntheticInsets:{top:47,bottom:34},physicalNotchTested:false};
 await page.screenshot({path:OUT+'/screens/edge-safe-area-47-34.png'});
 await cdp.send('Emulation.setSafeAreaInsetsOverride',{insets:{top:0,bottom:0,left:0,right:0}});
 await cdp.send('Performance.enable');await cdp.send('HeapProfiler.collectGarbage');
 const memory=async()=>{
  const m=Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(m=>[m.name,m.value]));
  return {jsHeapUsedBytes:m.JSHeapUsedSize,domNodes:await page.locator('*').count()};
 };
 const checkpoints=[{cycles:0,...await memory()}];
 for(let cycle=1;cycle<=30;cycle++){
  for(const route of ['guardian/demo-luma','synergies','shop','settings','collection'])await go(page,route);
  if(cycle%10===0){await artReady(page);await cdp.send('HeapProfiler.collectGarbage');checkpoints.push({cycles:cycle,...await memory()});}
 }
 assert.equal(checkpoints.at(-1).domNodes,checkpoints[0].domNodes,'DOM count must return to the same collection');
 const manifest=JSON.parse(fs.readFileSync('meta/art/mobile/provenance.json','utf8'));
 report.memory={checkpoints,fullSheetRgbaBytes:manifest.records.reduce((n,r)=>n+r.width*r.height*4,0),note:'JS heap after forced GC is diagnostic only; excludes decoded images, compositor/GPU and native WebView. Lossless encoding does not reduce decoded dimensions. No total-memory leak certification.'};
 await context.close();writeResult('performance',report);
}finally{await browser?.close();server.kill();}
