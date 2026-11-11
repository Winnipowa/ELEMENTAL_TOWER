import {test} from 'node:test';
import assert from 'node:assert/strict';
import {loadCatalog} from '../meta/catalog.js';
import {initialState} from '../meta/progression.js';
import {collectionPage,guardianPage,codexPage,profilePage,demoPage,preparationPage,resultsPage} from '../meta/views.js';
const freeze=o=>{if(o&&typeof o==='object'){Object.values(o).forEach(freeze);Object.freeze(o);}return o;};
const data=freeze(await loadCatalog()),state=freeze(initialState(data));
const ui={data,portrait:()=>'<span>portrait</span>',elementBadge:()=>'',referenceStudy:()=>'',abilityArt:()=>'',codexArt:()=>'',link:()=>'<a>link</a>',empty:()=>'<p>empty</p>',tone:()=> 'neutral',chapterAvailable:()=>true};
test('presentation renderers accept frozen catalog and progression without changing them',()=>{
 const before=JSON.stringify({data,state});const p=freeze({state,writable:true,status:'Démonstration'});
 for(const html of [collectionPage(data,{family:'Toutes',classId:'Toutes',status:'Tous',query:''},ui),guardianPage(data.guardians[0],ui),codexPage(data,ui),profilePage(data,p,[],ui),demoPage(data,p,[],'victory',null,ui),preparationPage(data,'victory',{state:'idle'},ui),resultsPage({outcome:'victory',wavesCleared:12,durationSeconds:630},{victory:'Victoire'},ui)])assert.ok(html.length>0);
 assert.equal(JSON.stringify({data,state}),before);
});
test('guardian descriptive strings remain text rather than executable markup',()=>{
 const g={...data.guardians[0],description:'<script>unsafe</script>',abilitySummary:'<img src=x onerror=unsafe>',unlockHint:'<svg onload=unsafe>'};const html=guardianPage(g,ui);
 assert.ok(html.includes('&lt;script&gt;unsafe&lt;/script&gt;'));assert.ok(html.includes('&lt;img'));assert.ok(html.includes('&lt;svg'));assert.doesNotMatch(html,/<script|<img src=x|<svg onload/);
});
