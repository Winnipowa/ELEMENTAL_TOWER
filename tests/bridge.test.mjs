import {test} from 'node:test';
import assert from 'node:assert/strict';
import {MockGameBridge} from '../meta/bridge.js';
import {ExpeditionSession} from '../meta/expedition.js';
const catalog=await new MockGameBridge().getCatalog();
const request=()=>({regionId:'demo-dawn',rulesetVersion:catalog.rulesetVersion,playerUnlockedGuardianIds:['demo-luma'],settings:{}});
test('isolated catalog and missing request rejection',async()=>{const b=new MockGameBridge();const a=await b.getCatalog();a.guardians.length=0;assert.equal((await b.getCatalog()).guardians.length,3);await assert.rejects(b.startRun(),/Version/);await assert.rejects(b.openRun(),/indisponible/);});
for(const outcome of ['victory','defeat','abandoned'])test(`lifecycle ${outcome}, exactly one result, no catalog mutation`,async()=>{const b=new MockGameBridge();b.configureDemo(outcome);const before=await b.getCatalog();let count=0;b.subscribeRunCompleted(()=>count++);const s=new ExpeditionSession(b);await s.start(request());assert.equal(s.state,'running');await s.finish();assert.equal(s.state,'completed');assert.equal(s.result.outcome,outcome);assert.equal(s.result.verificationStatus,'mock');assert.deepEqual(s.result.earnedUnlocks,[]);await b.stopRun(s.runId);assert.equal(count,1);assert.deepEqual(await b.getCatalog(),before);s.dispose();});
test('locked regions, locked guardians, invalid version and doctrines refused',async()=>{const b=new MockGameBridge();for(const patch of [{regionId:'demo-forest'},{playerUnlockedGuardianIds:['demo-nyx']},{playerUnlockedGuardianIds:[]},{rulesetVersion:'wrong'},{selectedDoctrineId:'unknown'}])await assert.rejects(b.startRun({...request(),...patch}));});
for(const scenario of ['connection-error','open-error'])test(`recover from ${scenario}`,async()=>{const b=new MockGameBridge();const s=new ExpeditionSession(b);b.configureDemo(scenario);await s.start(request());assert.equal(s.state,'error');assert.equal(s.result,null);b.configureDemo('victory');await s.start(request());await s.abandon();assert.equal(s.result.outcome,'abandoned');s.dispose();});
test('duplicate start guarded and unsubscribe supported',async()=>{const b=new MockGameBridge();const s=new ExpeditionSession(b);await Promise.all([s.start(request()),s.start(request())]);assert.equal(s.runId,'demo-run-1');s.dispose();await b.completeDemo(s.runId);assert.equal(s.result,null);});
test('foreign and duplicate results cannot replace the active result',async()=>{
 let handler;const adapter={subscribeRunCompleted(fn){handler=fn;return()=>{};},async startRun(){return{runId:'current'};},async openRun(){}};
 let updates=0;const s=new ExpeditionSession(adapter,()=>updates++);await s.start(request());
 const result={runId:'current',verificationStatus:'mock',outcome:'victory',earnedUnlocks:[]};
 handler({...result,runId:'foreign'});handler({...result,verificationStatus:'server'});assert.equal(s.result,null);
 handler(result);const count=updates;handler({...result,outcome:'defeat'});assert.equal(s.result.outcome,'victory');assert.equal(updates,count);s.dispose();
});
