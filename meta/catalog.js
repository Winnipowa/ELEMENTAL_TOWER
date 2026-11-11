const listNames=['guardians','regions','families','classes','synergies','chapters','objectives'];
const text=(v)=>typeof v==='string' && v.length>0 && v.length<=2000;
const ids=(v)=>Array.isArray(v) && v.every(text) && new Set(v).size===v.length;
export function validateCatalog(input){
 const c=structuredClone(input);
 if(!c || c.schemaVersion!==1 || c.source!=='demonstration' || !text(c.catalogVersion) || !text(c.rulesetVersion))throw new Error('Format ou source de catalogue non pris en charge.');
 for(const key of listNames){
  if(!Array.isArray(c[key]) || !ids(c[key].map(x=>x?.id)))throw new Error(`Liste de catalogue invalide : ${key}`);
 }
 const has=(key,id)=>c[key].some(x=>x.id===id);
 for(const g of c.guardians){
  if(!text(g.name)||!has('families',g.familyId)||!has('classes',g.classId)||!ids(g.traitIds)||g.traitIds.some(id=>!has('synergies',id))||typeof g.unlocked!=='boolean')throw new Error('Gardien ou référence invalide.');
  // Presentation data is never inserted as markup, CSS or remote executable content.
  if(!/^#[\da-f]{6}$/i.test(g.color||''))g.color='#cf9bfb';
  if(!/^[a-z0-9-]+$/.test(g.portraitKey||''))delete g.portraitKey;
 }
 for(const key of ['families','classes','synergies'])for(const x of c[key])if(!text(x.name))throw new Error('Libellé de codex manquant.');
 for(const r of c.regions)if(!text(r.title)||!['locked','available','coming_soon'].includes(r.status))throw new Error('Région invalide.');
 for(const o of c.objectives)if(!text(o.title)||!ids(o.unlockGuardianIds)||o.unlockGuardianIds.some(id=>!has('guardians',id)))throw new Error('Objectif invalide.');
 for(const ch of c.chapters){
  if(!text(ch.title)||!has('regions',ch.regionId)||!ids(ch.objectiveIds)||!ch.objectiveIds.length||ch.objectiveIds.some(id=>!has('objectives',id))||(ch.requiresChapterId&&!has('chapters',ch.requiresChapterId)))throw new Error('Chapitre invalide.');
  const seen=new Set([ch.id]);let prev=ch;
  while(prev.requiresChapterId){if(seen.has(prev.requiresChapterId))throw new Error('Cycle de chapitres.');seen.add(prev.requiresChapterId);prev=c.chapters.find(x=>x.id===prev.requiresChapterId);}
 }
 return c;
}
/** Versioned external JSON; loader injection permits future transports without UI changes. */
export async function loadCatalog(){
 const url=new URL('./data/catalog.demo.json',import.meta.url);
 let input;
 if(typeof window==='undefined')input=JSON.parse(await (await import('node:fs/promises')).readFile(url,'utf8'));
 else {const res=await fetch(url,{cache:'no-store'});if(!res.ok)throw new Error('Catalogue indisponible.');input=await res.json();}
 return validateCatalog(input);
}
