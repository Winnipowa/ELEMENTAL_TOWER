export const CATEGORIES={guardian_skin:'Apparences de gardiens',skill_effect:'Effets de compétences',animation:'Animations',decor:'Décors',profile:'Éléments de profil'};
export const PERIODS={daily:'Quotidiennes',weekly:'Hebdomadaires',permanent:'Permanentes'};
export const MISSION_STATES={available:'Disponible',in_progress:'En cours',completed:'Terminée',locked:'Verrouillée'};
export const PASS_STATES={locked:'Verrouillé',available:'Disponible',obtained:'Obtenu · Démo'};
const own=(o,k)=>Object.hasOwn(o,k);
const text=x=>typeof x==='string'&&x.length>0&&x.length<=2000;
const id=x=>typeof x==='string'&&/^demo-[a-z0-9-]+$/.test(x);
const integer=x=>Number.isSafeInteger(x)&&x>=0;
const unique=(items)=>Array.isArray(items)&&items.every(x=>id(x?.id))&&new Set(items.map(x=>x.id)).size===items.length;
export function validateProductCatalogs(bundle){
 const b=structuredClone(bundle);
 for(const c of [b?.missions,b?.cosmetics,b?.pass])if(!c||c.schemaVersion!==1||c.source!=='demonstration'||!text(c.catalogVersion))throw new Error('Format de catalogue META-04 non compatible.');
 if(!unique(b.cosmetics.products)||!unique(b.missions.missions)||!unique(b.pass.tiers)||!text(b.pass.title)||!integer(b.pass.maxPoints)||b.pass.maxPoints===0)throw new Error('Liste META-04 invalide.');
 const hasProduct=productId=>b.cosmetics.products.some(p=>p.id===productId);
 for(const p of b.cosmetics.products)if(!text(p.title)||!text(p.description)||!own(CATEGORIES,p.category)||!['preview','coming_soon'].includes(p.availability)||!text(p.illustrationNote)||!['luma','bloom','stars','pedestal','pending'].includes(p.previewKey))throw new Error('Cosmétique invalide.');
 for(const m of b.missions.missions){
  if(!text(m.title)||!own(PERIODS,m.period)||!integer(m.target)||!m.target||!text(m.condition)||!text(m.eventType)||m.reward?.kind!=='cosmetic'||!hasProduct(m.reward.productId)||!text(m.reward.label)||!Array.isArray(m.requiresMissionIds)||new Set(m.requiresMissionIds).size!==m.requiresMissionIds.length||m.requiresMissionIds.some(id=>!b.missions.missions.some(x=>x.id===id)))throw new Error('Mission ou récompense invalide.');
 }
 const visit=(m,path)=>{if(path.has(m.id))throw new Error('Cycle de missions.');for(const id of m.requiresMissionIds)visit(b.missions.missions.find(x=>x.id===id),new Set([...path,m.id]));};
 b.missions.missions.forEach(m=>visit(m,new Set()));
 for(const t of b.pass.tiers)if(!integer(t.level)||!t.level||!integer(t.requiredPoints)||t.requiredPoints>b.pass.maxPoints||!hasProduct(t.freeProductId)||!hasProduct(t.premiumProductId))throw new Error('Palier cosmétique invalide.');
 if(new Set(b.pass.tiers.map(t=>t.level)).size!==b.pass.tiers.length)throw new Error('Niveaux du Pass dupliqués.');
 return b;
}
async function readJSON(file){
 const url=new URL('./'+file,import.meta.url);
 if(typeof window==='undefined')return JSON.parse(await (await import('node:fs/promises')).readFile(url,'utf8'));
 const response=await fetch(url,{cache:'no-store'});if(!response.ok)throw new Error('Catalogue hors combat indisponible.');return response.json();
}
/** Replaceable catalog port. No gameplay, transaction or entitlement methods. */
export class LocalProductCatalogs{
 constructor(read=readJSON){this.read=read;}
 async load(){const [missions,cosmetics,pass]=await Promise.all(['missions.demo.json','cosmetics.demo.json','pass.demo.json'].map(file=>this.read(file)));return validateProductCatalogs({missions,cosmetics,pass});}
}
/** Proposed future port metadata, not an event processor. No mock run can feed it. */
export const VERIFIED_EVENT_PORT=Object.freeze({contractVersion:'proposed-0',requiresVerifiedEvents:true,acceptsMockRunResults:false,authority:'server-to-be-designed'});
export class ProductDemoState{
 constructor(bundle){this.bundle=bundle;this.reset();}
 reset(){this.missionProgress={};this.passPoints=0;this.obtained=new Set();}
 missionState(m){if(m.requiresMissionIds.some(id=>(this.missionProgress[id]||0)<this.bundle.missions.missions.find(x=>x.id===id).target))return 'locked';const value=this.missionProgress[m.id]||0;return value>=m.target?'completed':value>0?'in_progress':'available';}
 qaSetMission(id,value,source){
  if(source!=='qa')throw new Error('Progression simulée réservée aux outils QA.');
  const m=this.bundle.missions.missions.find(m=>m.id===id);if(!m||this.missionState(m)==='locked'||!integer(value)||value>m.target)throw new Error('Progression QA indisponible ou invalide.');
  this.missionProgress[id]=value;
  // Lowering a prerequisite must also reset all newly locked dependent missions.
  for(let i=0;i<this.bundle.missions.missions.length;i++)for(const x of this.bundle.missions.missions)if(this.missionState(x)==='locked')delete this.missionProgress[x.id];
 }
 tierState(t,track){return this.passPoints<t.requiredPoints?'locked':this.obtained.has(`${t.id}:${track}`)?'obtained':'available';}
 qaSetPass(value,source){if(source!=='qa'||!integer(value)||value>this.bundle.pass.maxPoints)throw new Error('Points QA invalides.');this.passPoints=value;for(const t of this.bundle.pass.tiers)if(value<t.requiredPoints)for(const track of ['free','premium'])this.obtained.delete(`${t.id}:${track}`);}
 qaMarkTier(id,track,source){const t=this.bundle.pass.tiers.find(t=>t.id===id);if(source!=='qa'||!t||!['free','premium'].includes(track)||this.tierState(t,track)==='locked')throw new Error('Marqueur QA indisponible.');this.obtained.add(`${id}:${track}`);}
}
