import assert from 'node:assert/strict';
import {launch} from './mobile-helpers.mjs';
import {APP_URL,TEST_ORIGIN} from './browser-target.mjs';
import {startBrowserServer} from './browser-server.mjs';
import {usePerfMode,perfReady,imageMetrics,writePerf} from './perf-helpers.mjs';

const server=await startBrowserServer();let browser;
const report={baseline:'50329e3d9bf09602b821e79f42975967dc678c9b (PR #17)',physicalDevices:false,method:'Cold contexts, real localhost HTTP image bodies, cache disabled, same module interception for both modes. Readiness is visible artwork loaded/decoded + fonts + two composition frames, not all hidden images.',profile:{downloadBytesPerSecond:500000,uploadBytesPerSecond:125000,latencyMs:80,cpuRate:4},samples:[]};
const cases=[...[[320,844],[390,844],[430,844],[320,568]].map(([width,height])=>({route:'collection',width,height,trials:3})),...['guardian/demo-luma','synergies','shop'].map(route=>({route,width:390,height:844,trials:1}))];
try{
 browser=await launch('edge');report.browserVersion=browser.version();
 for(const task of cases)for(let trial=1;trial<=task.trials;trial++)for(const mode of trial%2?['before','after']:['after','before']){
  const context=await browser.newContext({viewport:{width:task.width,height:task.height},isMobile:true,hasTouch:true,deviceScaleFactor:2,reducedMotion:'reduce'}),page=await context.newPage(),cdp=await context.newCDPSession(page),errors=[],external=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',route=>{if(new URL(route.request().url()).origin!==TEST_ORIGIN){external.push(route.request().url());return route.abort();}return route.continue();});
  await usePerfMode(page,mode);
  await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
  await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:80,downloadThroughput:500000,uploadThroughput:125000});
  await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
  await page.goto(APP_URL+'#/'+task.route,{waitUntil:'domcontentloaded'});await page.locator('main h1').waitFor();
  await page.locator('main .loading').waitFor({state:'hidden'});
  if(task.route==='collection')await page.locator('.guardian').first().waitFor();
  if(task.route.startsWith('guardian/'))await page.locator('.guardian-hero').waitFor();
  if(task.route==='synergies')await page.locator('.codex-art-strip').waitFor();
  if(task.route==='shop')await page.locator('.product-card').first().waitFor();
  await perfReady(page);
  const timing=await page.evaluate(()=>({visibleArtReadyMs:performance.now(),fcpMs:performance.getEntriesByName('first-contentful-paint')[0]?.startTime??null,domContentLoadedMs:performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd}));
  const imagesAtReady=await imageMetrics(page);
  // Report the entire initial request wave, including hidden eager baseline sheets, separately from readiness.
  await page.waitForLoadState('networkidle');const metrics=await imageMetrics(page);
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);assert.ok(timing.visibleArtReadyMs<60000);
  if(mode==='after')assert.ok(metrics.images.every(r=>r.path.includes('/sprites/')),'No full sheet may load in the normal path');
  report.samples.push({...task,trial,mode,...timing,completedImagesAtVisibleReady:imagesAtReady,...metrics});writePerf('performance',report);
  console.log(`${task.route} ${task.width}x${task.height} ${mode} #${trial}: ${Math.round(timing.visibleArtReadyMs)}ms, ${metrics.encodedImageBytes} bytes, ${metrics.decodedRgbaEstimate} RGBA bytes (${metrics.uniqueImages} images)`);
  await context.close();
 }
 // Regression budgets relative to the matched baseline: bytes and decoded-image estimate, not hardware RAM.
 for(const task of cases){
  const entries=report.samples.filter(r=>r.route===task.route&&r.width===task.width&&r.height===task.height);
  const median=(mode,key)=>{const values=entries.filter(r=>r.mode===mode).map(r=>r[key]).sort((a,b)=>a-b);return values[Math.floor(values.length/2)];};
  assert.ok(median('after','encodedImageBytes')<median('before','encodedImageBytes')*.4,task.route+' byte reduction below 60%');
  assert.ok(median('after','decodedRgbaEstimate')<median('before','decodedRgbaEstimate')*.4,task.route+' decoded estimate reduction below 60%');
  assert.ok(median('after','visibleArtReadyMs')<median('before','visibleArtReadyMs')*.6,task.route+' simulated readiness reduction below 40%');
 }
 report.relativeBudgetsPassed=true;writePerf('performance',report);
}finally{await browser?.close();server.kill();}
