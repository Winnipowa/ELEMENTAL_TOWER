import {test} from 'node:test';
import assert from 'node:assert/strict';
import {loadCatalog,validateCatalog} from '../meta/catalog.js';
import {DemoProgression,SAVE_KEY,decodeSave,initialState,completeObjective,completedChapters,syncPreview} from '../meta/progression.js';
const c=await loadCatalog();
function storage(){const map=new Map([['et_v09','untouched']]);return{getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k),map};}
test('external catalog validation, references, duplicates, empty catalog, cycles',()=>{
 assert.equal(c.guardians.length,3);
 for(const mutate of [x=>x.schemaVersion=9,x=>x.source='canonical',x=>x.guardians.push(x.guardians[0]),x=>x.guardians[0].familyId='unknown',x=>x.guardians[0].traitIds=['unknown'],x=>x.chapters[0].requiresChapterId=x.chapters[1].id]){const x=structuredClone(c);mutate(x);assert.throws(()=>validateCatalog(x));}
 const empty=structuredClone(c);for(const key of ['guardians','regions','families','classes','synergies','chapters','objectives'])empty[key]=[];assert.doesNotThrow(()=>validateCatalog(empty));
 const safe=structuredClone(c);safe.guardians[0].portraitKey='../unsafe';safe.guardians[0].color='url(unsafe)';const valid=validateCatalog(safe);assert.equal(valid.guardians[0].portraitKey,undefined);assert.equal(valid.guardians[0].color,'#cf9bfb');
});
test('save/reopen, deterministic chapter progression, duplicate objective, V0.9 untouched',()=>{
 const store=storage(),p=new DemoProgression(store,c);assert.equal(store.getItem(SAVE_KEY),null);assert.throws(()=>p.complete('demo-study'));
 assert.equal(p.complete('demo-read'),true);assert.ok(p.state.unlockedGuardianIds.includes('demo-nyx'));assert.deepEqual(completedChapters(p.state,c),['demo-chapter-1']);
 const again=completeObjective(p.state,c,'demo-read');assert.deepEqual(again,p.state);
 const reopened=new DemoProgression(store,c);assert.deepEqual(reopened.state,p.state);reopened.complete('demo-study');assert.equal(completedChapters(reopened.state,c).length,2);assert.equal(store.getItem('et_v09'),'untouched');
 assert.equal(syncPreview(p.state).uploadAllowed,false);assert.equal(syncPreview(p.state).authority,'untrusted-local');
});
test('known V1 migration deferred until save; corrupt/future saves preserved',()=>{
 const store=storage();const v1=JSON.stringify({schemaVersion:1,source:'demonstration',catalogVersion:c.catalogVersion,unlockedGuardianIds:['demo-luma'],completedObjectiveIds:[]});store.setItem(SAVE_KEY,v1);const p=new DemoProgression(store,c);assert.equal(p.state.schemaVersion,2);assert.equal(store.getItem(SAVE_KEY),v1);assert.equal(p.save(),true);
 for(const raw of ['{broken',JSON.stringify({schemaVersion:999}),JSON.stringify({...initialState(c),source:'server'}),JSON.stringify({...initialState(c),revision:-1})]){store.setItem(SAVE_KEY,raw);const broken=new DemoProgression(store,c);assert.equal(broken.writable,false);assert.equal(broken.save(),false);assert.equal(store.getItem(SAVE_KEY),raw);}
});
test('catalog change preserves known IDs, archives missing, no automatic grant or unarchive',()=>{
 const state=initialState(c);state.catalogVersion='older';state.unlockedGuardianIds=['demo-luma','removed-id'];state.completedObjectiveIds=['removed-objective'];
 const {state:next,status}=decodeSave(JSON.stringify(state),c);assert.match(status,/Catalogue changé/);assert.deepEqual(next.unlockedGuardianIds,['demo-luma']);assert.deepEqual(next.archivedGuardianIds,['removed-id']);assert.deepEqual(next.archivedObjectiveIds,['removed-objective']);assert.equal(next.unlockedGuardianIds.includes('demo-mousse'),false);
});
test('quota, blocked storage and concurrent edits fail without false success; reset only dedicated key',()=>{
 const store=storage(),p=new DemoProgression(store,c);store.setItem(SAVE_KEY,'another-tab');assert.equal(p.save(),false);assert.equal(store.getItem(SAVE_KEY),'another-tab');p.reset();assert.equal(store.getItem('et_v09'),'untouched');assert.equal(store.getItem(SAVE_KEY),null);
 const quota={getItem:()=>null,setItem(){throw new Error('quota');}};const q=new DemoProgression(quota,c);const before=structuredClone(q.state);assert.equal(q.complete('demo-read'),false);assert.deepEqual(q.state,before);
 const blocked=new DemoProgression({getItem(){throw new Error('blocked');}},c);assert.equal(blocked.writable,false);assert.equal(blocked.save(),false);
});
