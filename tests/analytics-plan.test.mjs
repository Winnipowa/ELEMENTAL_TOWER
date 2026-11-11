import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
test('proposed analytics plan stays inactive, distinguishes missing onboarding/engine, and excludes personal fields',()=>{
 const plan=JSON.parse(fs.readFileSync('docs/analytics/events.v1.json','utf8'));
 assert.equal(plan.schemaVersion,1);assert.equal(plan.transport,'none');assert.equal(plan.instrumentation,'none');assert.equal(plan.enabledByDefault,false);
 const names=plan.events.map(e=>e.name);assert.equal(new Set(names).size,names.length);
 for(const name of ['app_opened','collection_viewed','expedition_prepared','run_launch_requested','run_started','run_finished','cosmetic_previewed'])assert.ok(names.includes(name));
 for(const event of plan.events){
  for(const key of Object.keys(event.properties))assert.ok(!plan.forbiddenProperties.includes(key));
  if(event.name.startsWith('onboarding_'))assert.equal(event.availability,'onboarding-absent');
  if(['run_started','run_finished'].includes(event.name))assert.equal(event.availability,'requires-engine-event-contract');
 }
 for(const key of ['profile_text','search_text','save_payload','device_id','run_id','session_id'])assert.ok(plan.forbiddenProperties.includes(key));
});
