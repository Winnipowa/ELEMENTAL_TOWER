import {loadCatalog} from './catalog.js';
/** Proposed V0 port. Only this adapter owns mock lifecycle and fixtures.
 * Scenario selection is mock-only configuration, never part of StartRunRequest.
 * No persistence, rewards, gameplay simulation or canonical engine imports.
 */
export class MockGameBridge {
 #runs = new Map();
 #catalog;
 #loader;
 #unlocked;
 constructor(loader=loadCatalog){this.#loader=loader;}
 // Mock-only player collection projection. Never authoritative for a real engine.
 setDemoCollection(ids){this.#unlocked=[...ids];}

 #handlers = new Set();
 #sequence = 0;
 #scenario = 'victory';
 configureDemo(scenario) {
  if (!['victory','defeat','abandoned','connection-error','open-error'].includes(scenario)) throw new Error('Scénario inconnu');
  this.#scenario = scenario;
 }
 async getCatalog(){ this.#catalog=await this.#loader(); return structuredClone(this.#catalog); }
 async startRun(request){
  const catalog=this.#catalog || await this.getCatalog();
  if (!request || request.rulesetVersion !== catalog.rulesetVersion) throw new Error('Version du catalogue incompatible.');
  if (!catalog.regions.some(r=>r.id===request.regionId && r.status==='available')) throw new Error('Région indisponible.');
  const ids=request.playerUnlockedGuardianIds;
  if (!Array.isArray(ids) || !ids.length || new Set(ids).size!==ids.length || ids.some(id=>!catalog.guardians.some(g=>g.id===id && (this.#unlocked?this.#unlocked.includes(id):g.unlocked)))) throw new Error('Collection admissible invalide.');
  if (request.selectedDoctrineId) throw new Error('Doctrine non disponible dans cette démonstration.');
  if (this.#scenario==='connection-error') throw new Error('Connexion au moteur simulée impossible. Réessayez avec un autre scénario.');
  const runId=`demo-run-${++this.#sequence}`;
  this.#runs.set(runId,{request:structuredClone(request),scenario:this.#scenario,status:'created'});
  return {runId};
 }
 async openRun(runId, mountTarget){
  const run=this.#runs.get(runId);
  if (!run || run.status!=='created') throw new Error('Session indisponible.');
  if (run.scenario==='open-error') throw new Error('Ouverture du moteur simulée impossible.');
  // mountTarget is deliberately opaque until the canonical engine contract is reviewed.
  run.status='open';
 }
 async completeDemo(runId){
  const run=this.#runs.get(runId);
  if (!run || run.status!=='open') throw new Error('Session non ouverte.');
  this.#finish(runId,run.scenario);
 }
 async stopRun(runId){
  const run=this.#runs.get(runId);
  if (run && run.status!=='done') this.#finish(runId,'abandoned');
 }
 #finish(runId,outcome){
  const run=this.#runs.get(runId);
  if (run.status==='done') return;
  run.status='done';
  const result={runId,rulesetVersion:run.request.rulesetVersion,regionId:run.request.regionId,outcome,
   wavesCleared:outcome==='victory'?12:outcome==='defeat'?7:0,
   durationSeconds:outcome==='victory'?630:outcome==='defeat'?380:0,
   compositionSummary:[],earnedUnlocks:[],verificationStatus:'mock'};
  for (const handler of this.#handlers) handler(structuredClone(result));
 }
 subscribeRunCompleted(handler){ this.#handlers.add(handler); return ()=>this.#handlers.delete(handler); }
}
export const bridge = new MockGameBridge();
