export const SAVE_KEY='elemental-tower.meta-demo.v2';
export const SCHEMA_VERSION=2;
const strings=v=>Array.isArray(v)&&v.every(x=>typeof x==='string'&&x.length>0)&&new Set(v).size===v.length;
export function initialState(catalog){return {schemaVersion:2,source:'demonstration',catalogVersion:catalog.catalogVersion,revision:0,profile:{name:'Voyageur · Démo'},unlockedGuardianIds:catalog.guardians.filter(g=>g.unlocked).map(g=>g.id),completedObjectiveIds:[],archivedGuardianIds:[],archivedObjectiveIds:[]};}
export function decodeSave(raw,catalog){
 if(raw===null)return {state:initialState(catalog),status:'Nouvelle démonstration, pas encore sauvegardée.',writable:true};
 let s=JSON.parse(raw),migrated=false;
 // Only this explicitly documented META demo V1 format is migrated. Never inspect V0.9.
 if(s?.schemaVersion===1){
  if(s.source!=='demonstration'||!strings(s.unlockedGuardianIds)||!strings(s.completedObjectiveIds)||typeof s.catalogVersion!=='string')throw new Error('Ancien format invalide.');
  s={...initialState(catalog),catalogVersion:s.catalogVersion,unlockedGuardianIds:s.unlockedGuardianIds,completedObjectiveIds:s.completedObjectiveIds};migrated=true;
 }
 if(s?.schemaVersion!==2)throw new Error('Version de sauvegarde inconnue.');
 if(s.source!=='demonstration'||typeof s.catalogVersion!=='string'||!Number.isSafeInteger(s.revision)||s.revision<0||typeof s.profile?.name!=='string'||s.profile.name.length>40||!['unlockedGuardianIds','completedObjectiveIds','archivedGuardianIds','archivedObjectiveIds'].every(k=>strings(s[k])))throw new Error('Sauvegarde invalide.');
 const state={schemaVersion:2,source:'demonstration',catalogVersion:catalog.catalogVersion,revision:s.revision,profile:{name:s.profile.name},unlockedGuardianIds:s.unlockedGuardianIds.filter(id=>catalog.guardians.some(g=>g.id===id)),completedObjectiveIds:s.completedObjectiveIds.filter(id=>catalog.objectives.some(o=>o.id===id)),archivedGuardianIds:[...new Set([...s.archivedGuardianIds,...s.unlockedGuardianIds.filter(id=>!catalog.guardians.some(g=>g.id===id))])],archivedObjectiveIds:[...new Set([...s.archivedObjectiveIds,...s.completedObjectiveIds.filter(id=>!catalog.objectives.some(o=>o.id===id))])]};
 return {state,status:migrated?'Ancien format démo migré en mémoire. Enregistrer pour conserver la migration.':s.catalogVersion!==catalog.catalogVersion?'Catalogue changé : IDs connus conservés, IDs retirés archivés, aucun nouveau déblocage automatique.':'Sauvegarde locale de démonstration chargée.',writable:true};
}
export function completedChapters(state,c){return c.chapters.filter(ch=>ch.objectiveIds.every(id=>state.completedObjectiveIds.includes(id))).map(ch=>ch.id);}
export function chapterAvailable(ch,state,c){return !ch.requiresChapterId||completedChapters(state,c).includes(ch.requiresChapterId);}
export function completeObjective(state,c,id){
 const objective=c.objectives.find(o=>o.id===id);
 const allowed=c.chapters.some(ch=>ch.objectiveIds.includes(id)&&chapterAvailable(ch,state,c));
 if(!objective||!allowed)throw new Error('Objectif indisponible.');
 if(state.completedObjectiveIds.includes(id))return structuredClone(state);
 return {...structuredClone(state),completedObjectiveIds:[...state.completedObjectiveIds,id],unlockedGuardianIds:[...new Set([...state.unlockedGuardianIds,...objective.unlockGuardianIds])]};
}
/** Local demo repository only. No engine results, cloud transport or reward API. */
export class DemoProgression {
 constructor(storage,catalog){this.storage=storage;this.catalog=catalog;this.read();}
 read(){
  this.raw=null;this.writable=false;this.state=initialState(this.catalog);
  try{this.raw=this.storage.getItem(SAVE_KEY);Object.assign(this,decodeSave(this.raw,this.catalog));}
  catch{this.status='Sauvegarde illisible, inconnue ou stockage inaccessible : données originales préservées, écriture bloquée.';}
 }
 save(next=this.state){
  if(!this.writable){this.status='Écriture bloquée. Réinitialisez explicitement la démo ou rechargez une sauvegarde compatible.';return false;}
  try{
   if(this.storage.getItem(SAVE_KEY)!==this.raw){this.writable=false;this.status='Sauvegarde modifiée dans un autre onglet. Rechargez avant de continuer.';return false;}
   const state=decodeSave(JSON.stringify(next),this.catalog).state;state.revision=this.state.revision+1;
   const raw=JSON.stringify(state);this.storage.setItem(SAVE_KEY,raw);this.state=state;this.raw=raw;this.status='Démonstration enregistrée sur cet appareil.';return true;
  }catch{this.status='Enregistrement impossible : espace ou stockage indisponible. Aucun changement enregistré.';return false;}
 }
 complete(id){return this.save(completeObjective(this.state,this.catalog,id));}
 reset(){
  try{this.storage.removeItem(SAVE_KEY);this.read();this.status='Démonstration réinitialisée. Autres sauvegardes préservées.';return true;}
  catch{this.status='Réinitialisation impossible : stockage inaccessible.';return false;}
 }
}
/** Read-only boundary for discussion. Untrusted local demo must never become server authority. */
export function syncPreview(state){return {contractVersion:'proposed-0',source:'demonstration',authority:'untrusted-local',catalogVersion:state.catalogVersion,localRevision:state.revision,requiresServerReconciliation:true,uploadAllowed:false};}
