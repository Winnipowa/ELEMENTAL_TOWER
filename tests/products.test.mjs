import {test} from 'node:test';
import assert from 'node:assert/strict';
import {LocalProductCatalogs,validateProductCatalogs,ProductDemoState,VERIFIED_EVENT_PORT} from '../meta/products/service.js';
import {DemoPreferences,PREFERENCE_KEY,applyPreferences} from '../meta/products/preferences.js';
import {ProductScreens} from '../meta/products/screens.js';
const bundle=await new LocalProductCatalogs().load();
function memory(){const map=new Map([['elemental-tower.meta-demo.v2','meta03-original'],['et_v09','v09-original']]);return{map,getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};}
test('versioned external catalogs cover all cosmetic categories, mission periods and cosmetic-only Pass refs',()=>{
 assert.equal(new Set(bundle.cosmetics.products.map(p=>p.category)).size,5);assert.equal(new Set(bundle.missions.missions.map(m=>m.period)).size,3);
 assert.equal(VERIFIED_EVENT_PORT.acceptsMockRunResults,false);assert.equal(VERIFIED_EVENT_PORT.requiresVerifiedEvents,true);
 for(const mutate of [b=>b.missions.schemaVersion=99,b=>b.cosmetics.source='production',b=>b.cosmetics.products[0].category='power',b=>b.missions.missions[0].reward.kind='gold',b=>b.missions.missions[0].reward.productId='missing',b=>b.missions.missions[0].target=0,b=>b.missions.missions[0].requiresMissionIds=['demo-m-garden'],b=>b.pass.tiers[0].freeProductId='missing',b=>b.pass.tiers[1].level=1,b=>b.cosmetics.products.push(b.cosmetics.products[0])]){const data=structuredClone(bundle);mutate(data);assert.throws(()=>validateProductCatalogs(data));}
});
test('catalog port propagates transport failures and supports a completely empty bundle',async()=>{
 await assert.rejects(new LocalProductCatalogs(async()=>{throw new Error('offline');}).load(),/offline/);
 const empty=structuredClone(bundle);empty.cosmetics.products=[];empty.missions.missions=[];empty.pass.tiers=[];assert.doesNotThrow(()=>validateProductCatalogs(empty));
});
test('mission QA handles all four states, prerequisite rollback and invalid/mock caller rejection',()=>{
 const qa=new ProductDemoState(bundle),m=bundle.missions.missions[1],locked=bundle.missions.missions[3],prerequisite=bundle.missions.missions[0];const before=JSON.stringify(bundle);
 assert.equal(qa.missionState(m),'available');assert.equal(qa.missionState(locked),'locked');assert.throws(()=>qa.qaSetMission(locked.id,1,'qa'));
 assert.throws(()=>qa.qaSetMission(m.id,1,'mock'));assert.equal(qa.missionState(m),'available');qa.qaSetMission(m.id,1,'qa');assert.equal(qa.missionState(m),'in_progress');qa.qaSetMission(m.id,m.target,'qa');assert.equal(qa.missionState(m),'completed');
 qa.qaSetMission(prerequisite.id,1,'qa');qa.qaSetMission(locked.id,1,'qa');qa.qaSetMission(prerequisite.id,0,'qa');assert.equal(qa.missionState(locked),'locked');assert.equal(qa.missionProgress[locked.id],undefined);assert.throws(()=>qa.qaSetMission(m.id,NaN,'qa'));assert.throws(()=>qa.qaSetMission(m.id,99,'qa'));assert.equal(JSON.stringify(bundle),before);
});
test('Pass markers require QA, do not grant anything and reconcile when points are lowered',()=>{
 const qa=new ProductDemoState(bundle),tier=bundle.pass.tiers[1];assert.equal(qa.tierState(tier,'premium'),'locked');assert.throws(()=>qa.qaMarkTier(tier.id,'premium','qa'));assert.throws(()=>qa.qaSetPass(50,'mock'));qa.qaSetPass(50,'qa');assert.equal(qa.tierState(tier,'premium'),'available');qa.qaMarkTier(tier.id,'premium','qa');qa.qaMarkTier(tier.id,'premium','qa');assert.equal(qa.obtained.size,1);assert.equal(qa.tierState(tier,'premium'),'obtained');qa.qaSetPass(0,'qa');assert.equal(qa.obtained.size,0);assert.throws(()=>qa.qaSetPass(-1,'qa'));qa.reset();assert.deepEqual(qa.missionProgress,{});assert.equal(qa.passPoints,0);
});
test('preference changes persist only in the new key, reset preserves META-03/V0.9',()=>{
 const store=memory(),before=[...store.map];const p=new DemoPreferences(store);assert.deepEqual([...store.map],before);p.update('reduceMotion',true);p.update('largeText',true);assert.equal(new DemoPreferences(store).values.largeText,true);assert.equal(store.getItem('elemental-tower.meta-demo.v2'),'meta03-original');assert.equal(store.getItem('et_v09'),'v09-original');assert.throws(()=>p.update('unknown',true));assert.throws(()=>p.update('softGlows','yes'));p.reset();assert.equal(store.getItem(PREFERENCE_KEY),null);assert.deepEqual([...store.map],before);
});
test('corrupt/future preferences, quota and cross-tab writes never overwrite originals or report success',()=>{
 const store=memory();for(const raw of ['{broken',JSON.stringify({schemaVersion:99})]){store.setItem(PREFERENCE_KEY,raw);const p=new DemoPreferences(store);assert.equal(p.writable,false);assert.equal(p.update('largeText',true),false);assert.equal(store.getItem(PREFERENCE_KEY),raw);}
 const quota=new DemoPreferences({getItem:()=>null,setItem(){throw new Error('quota');}});assert.equal(quota.update('largeText',true),false);assert.equal(quota.values.largeText,false);
 store.removeItem(PREFERENCE_KEY);const p=new DemoPreferences(store);store.setItem(PREFERENCE_KEY,'another-tab');assert.equal(p.update('largeText',true),false);assert.equal(store.getItem(PREFERENCE_KEY),'another-tab');
 const blocked=new DemoPreferences({getItem(){throw new Error('blocked');}});assert.equal(blocked.writable,false);
});
test('preference presentation applies only the requested UI classes',()=>{
 const classes=new Set();applyPreferences({reduceMotion:true,largeText:true,highContrast:false,softGlows:false},{classList:{toggle(k,v){if(v)classes.add(k);else classes.delete(k);}}});assert.deepEqual([...classes],['reduce-motion','large-text','quiet-glows']);
});
test('module is replaceable, preserves loading/error/retry, and ignores stale catalog responses',async()=>{
 const prefs=new DemoPreferences(memory());let reject;const screens=new ProductScreens({preferences:prefs,catalogs:{load:()=>new Promise((_,r)=>reject=r)}});const pending=screens.load();assert.equal(screens.status,'loading');reject(new Error('offline'));await pending;assert.equal(screens.status,'error');assert.match(screens.render('shop'),/Réessayer/);
 screens.catalogs={load:async()=>structuredClone(bundle)};await screens.load();assert.equal(screens.status,'ready');assert.match(screens.render('product','missing'),/introuvable/);
 let resolve; screens.catalogs={load:()=>new Promise(r=>resolve=r)};const old=screens.load();screens.catalogs={load:async()=>structuredClone(bundle)};await screens.load();resolve({...bundle,cosmetics:{...bundle.cosmetics,catalogVersion:'stale'}});await old;assert.equal(screens.data.cosmetics.catalogVersion,bundle.cosmetics.catalogVersion);
});
