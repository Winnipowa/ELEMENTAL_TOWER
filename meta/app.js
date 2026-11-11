import {ProductScreens} from './products/screens.js';
import {DemoPreferences,applyPreferences} from './products/preferences.js';
import {guardianPage,collectionPage,codexPage,profilePage,demoPage,preparationPage,resultsPage} from './views.js';
import {guardianVisual,elementBadge,referenceStudy,abilityArt,codexArt,GUARDIAN_ART} from './art.js';
import {DemoProgression,completedChapters,chapterAvailable} from './progression.js';
import { bridge } from './bridge.js';
import { ExpeditionSession } from './expedition.js';
const main=document.querySelector('main'), nav=document.querySelector('nav'), dialog=document.querySelector('dialog');
const sections=[['home','⌂','Monde'],['collection','✦','Collection'],['missions','☷','Missions'],['shop','◇','Boutique'],['profile','♙','Profil']];
const names={product:'Cosmétique',demo:'Démonstration et outils QA',run:'GameBridge · Démonstration',settings:'Paramètres',pass:'Pass',challenges:'Défis',prepare:'Préparation',results:'Résultats',synergies:'Synergies',guardian:'Gardien'};
let data,loadState='loading',filter={family:'Toutes',classId:'Toutes',status:'Tous',query:''};
let scenario='victory',progression;
let catalogData;
function preferenceStorage(){try{return window.localStorage;}catch{return {getItem(){throw new Error('Stockage inaccessible');},setItem(){throw new Error('Stockage inaccessible');},removeItem(){throw new Error('Stockage inaccessible');}};}}
const preferences=new DemoPreferences(preferenceStorage());
applyPreferences(preferences.values);
const products=new ProductScreens({preferences,onChange:()=>{const route=location.hash.replace(/^#\//,'').split('/')[0];if(['missions','shop','product','pass','demo'].includes(route))render();}});

function projectProgression(){data={...catalogData,guardians:catalogData.guardians.map(g=>({...g,unlocked:progression.state.unlockedGuardianIds.includes(g.id)}))};bridge.setDemoCollection(progression.state.unlockedGuardianIds);}

const expedition=new ExpeditionSession(bridge,()=>{
 if(expedition.state==='completed')location.hash='/results';
 else if(expedition.state==='running')location.hash='/run';
 render();
});
const outcomes={victory:'Victoire',defeat:'Défaite',abandoned:'Abandon'};
function preparation(){return preparationPage(data,scenario,expedition,ui());}
function runView(){return expedition.state==='running'?`<span class="pill">Démonstration · Connecteur fictif</span>${card('Session ouverte','Session de démonstration. Affichez son résultat fictif quand vous le souhaitez.')}<button class="primary wide" data-finish>Afficher le résultat simulé</button><button class="wide" data-abandon>Abandonner la démonstration</button><p>Quitter cet écran abandonne la session. Un rechargement efface cette session locale.</p>`:empty('Aucune session active','Retournez au monde pour préparer une démonstration.')+link('home','Retour au monde','primary wide');}
function resultsView(){return resultsPage(expedition.result,outcomes,ui());}
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link=(route,text,cls='')=>`<a class="${cls}" href="#/${route}">${text}</a>`;
const empty=(title,copy)=>`<div class="empty"><b aria-hidden="true">✧</b><h2>${title}</h2><p>${copy}</p></div>`;
const card=(title,copy)=>`<article class="card"><h3>${title}</h3><p>${copy}</p></article>`;
function portrait(g){const visual=guardianVisual(g);if(visual)return visual;return g.portraitKey?`<div class="portrait"><img src="./portraits/${esc(g.portraitKey)}.svg" alt="Portrait provisoire de ${esc(g.name)}" loading="lazy"><span class="portrait-fallback" hidden aria-label="Portrait indisponible">✧</span></div>`:`<div class="portrait" aria-label="Portrait indisponible">✧</div>`;}
function ui(){return {data,portrait,elementBadge,abilityArt,referenceStudy,codexArt,link,empty,tone:g=>GUARDIAN_ART[g.portraitKey]?.tone||'neutral',chapterAvailable:ch=>chapterAvailable(ch,progression.state,data)};}
function codex(){return codexPage(data,ui());}
function profileView(){return profilePage(data,progression,completedChapters(progression.state,data),ui());}
function notice(title,copy,visual=''){document.querySelector('#dialog-preview').innerHTML=visual;document.querySelector('#dialog-title').textContent=title;document.querySelector('#dialog-copy').textContent=copy;dialog.showModal();}
document.querySelector('#close-dialog').onclick=()=>dialog.close();
dialog.addEventListener('click',e=>{if(e.target===dialog && (e.clientX<dialog.getBoundingClientRect().left || e.clientX>dialog.getBoundingClientRect().right))dialog.close();});
function parent(route){return ({product:'shop',demo:'settings',settings:'profile',pass:'shop',challenges:'home',prepare:'home',results:'home',synergies:'collection',guardian:'collection'})[route]||'home';}
function home(){return `<span class="eyebrow">Les îles oubliées · Démo</span><h1>Un monde à découvrir</h1><p>Choisissez une destination. Votre aventure commence à Aurore.</p><div class="map" aria-label="Carte du monde"><svg viewBox="0 0 400 350" aria-hidden="true"><defs><linearGradient id="island" x2="0" y2="1"><stop stop-color="#b09bbd"/><stop offset="1" stop-color="#533971"/></linearGradient></defs><path d="M95 90Q310 80 290 175T100 270L290 320" fill="none" stroke="#c0a4d4" stroke-dasharray="4 9" stroke-width="2"/>${[[100,65],[290,145],[100,235],[290,285]].map(([x,y])=>`<path d="M${x-68} ${y}l68-32 68 32-68 56z" fill="#38233f"/><path d="M${x-68} ${y}l68-32 68 32-68 32z" fill="url(#island)"/><path d="M${x-18} ${y-5}v-33l18-18 18 18v33z" fill="#e1c4dc"/><path d="M${x-26} ${y-38}l26-26 26 26z" fill="#82659b"/>`).join('')}</svg>${data.regions.map(r=>`<button class="region" data-region="${esc(r.id)}">${esc(r.title)}<small>${r.status==='available'?'Explorer · Démo':r.status==='locked'?'Verrouillé · Démo':'À venir · Concept'}</small></button>`).join('')}</div><article class="card"><span class="eyebrow">Votre prochaine étape</span><h2>Les portes d’Aurore</h2><p>Un aperçu du premier chapitre. Aucun combat ni déblocage dans ce prototype.</p>${link('prepare','Préparer l’expédition','primary wide')}</article><div class="row">${link('challenges','⚑ Défis','card')}${link('pass','✧ Pass','card')}</div>`;}
function collection(){return collectionPage(data,filter,ui());}
function content(route,id){switch(route){
 case 'home':return home();
 case 'collection':return collection();
 case 'guardian':{const g=data.guardians.find(g=>g.id===id);return g?guardianPage(g,ui()):empty('Gardien introuvable','Revenez à la collection pour choisir un gardien.');}
 case 'missions':case 'shop':case 'product':case 'pass':case 'settings':return products.render(route,id);
 case 'profile':return profileView();
 case 'demo':return demoPage(data,progression,completedChapters(progression.state,data),scenario,expedition.result,ui())+products.qaView()+`<h2>Tester les états UI</h2><div class="row"><button data-state="empty">Catalogue vide</button><button data-state="error">Erreur catalogue</button><button data-reload>Recharger</button></div>`;
 case 'prepare':return preparation();
 case 'run':return runView();
 case 'results':return resultsView();
 case 'synergies':return codex();
 case 'challenges':return `${card('Défis d’expédition · Concept','Comparaison future avec la collection personnelle réellement débloquée. Règles et vérification serveur à concevoir.')}${empty('Aucun défi disponible','Aucun adversaire ni classement connecté.')}`;
 default:return empty('Page introuvable','Utilisez la navigation pour retrouver le monde.');
}}
function render(focus=false){
 if(dialog.open)dialog.close();
 const [route='home',id]=(location.hash.replace(/^#\//,'')||'home').split('/');
 const sameView=!focus&&main.dataset.view===route;
 const openPanels=sameView?[...main.querySelectorAll('details')].map((el,index)=>el.open?index:-1):[];
 const focused=sameView&&document.activeElement?.closest('main')?document.activeElement:null;
 const focusSelector=focused?.id?'#'+CSS.escape(focused.id):focused?[...focused.attributes].filter(a=>a.name.startsWith('data-')).map(a=>'['+a.name+']').join(''):'';
 let active=route;
 while(!sections.some(([r])=>r===active))active=parent(active);
 nav.innerHTML=sections.map(([r,icon,label])=>`<a href="#/${r}" ${r===active?'aria-current="page"':''}><span aria-hidden="true">${icon}</span>${label}</a>`).join('');
 const guardian=route==='guardian'&&loadState==='ready'?data.guardians.find(g=>g.id===id):null;
 const title=(route==='product'?products.title(id):null)||guardian?.name||sections.find(([r])=>r===route)?.[2]||names[route]||'Page introuvable';
 const destination=parent(route),destinationName=sections.find(([r])=>r===destination)?.[2]||names[destination]||'Monde';
 document.title=`${title} · Elemental Tower · Démo`;
 main.dataset.view=route;
 main.setAttribute('aria-label',title);
 const back=route==='home'?'':`<a class="back" href="#/${destination}" aria-label="Retour à ${esc(destinationName)}">‹ ${esc(destinationName)}</a>`;
 const standalone=['missions','shop','product','pass','settings'].includes(route);
 const body=standalone?content(route,id):loadState==='loading'?'<p role="status" class="loading">Chargement du catalogue de démonstration…</p>':loadState==='error'?empty('Catalogue indisponible','Réessayez pour retrouver le catalogue.')+'<button data-reload>Réessayer</button>':content(route,id);
 main.innerHTML=`${back}${route==='home'?'':`<h1>${esc(title)}</h1>`}${body}`;
 if(sameView){main.querySelectorAll('details').forEach((el,index)=>{if(openPanels.includes(index))el.open=true;});if(focusSelector)main.querySelector(focusSelector)?.focus({preventScroll:true});}
 if(focus){main.focus();main.scrollTop=0;window.scrollTo(0,0);}
 bind();
}
function bind(){
 products.bind(main,{render,preview:notice,confirmReset:()=>window.confirm('Effacer uniquement les préférences de démonstration sur cet appareil ?')});
 main.querySelectorAll('.portrait-reference .guardian-figure image').forEach(image=>image.addEventListener('error',()=>{
  const container=image.closest('.portrait');container.classList.add('art-unavailable');container.querySelector('.portrait-fallback').hidden=false;
 }));

 main.querySelectorAll('.portrait img').forEach(img=>{img.onerror=()=>{img.hidden=true;img.nextElementSibling.hidden=false;};});
 main.querySelector('[data-save-profile]')?.addEventListener('click',()=>{progression.save({...progression.state,profile:{name:main.querySelector('#profile-name').value.trim()||'Voyageur · Démo'}});projectProgression();render();});
 main.querySelectorAll('[data-objective]').forEach(b=>b.onclick=()=>{try{progression.complete(b.dataset.objective);}catch(e){progression.status=e.message;}projectProgression();render();});
 main.querySelector('[data-save]')?.addEventListener('click',()=>{progression.save();render();});
 main.querySelector('[data-reread]')?.addEventListener('click',()=>{progression.read();projectProgression();render();});
 main.querySelector('[data-reset-save]')?.addEventListener('click',()=>{if(window.confirm('Effacer uniquement la progression fictive META-03 sur cet appareil ?')){progression.reset();projectProgression();render();}});

 main.querySelector('#scenario')?.addEventListener('change',e=>{scenario=e.target.value;});
 main.querySelector('[data-start]')?.addEventListener('click',()=>{
  bridge.configureDemo(scenario);
  expedition.start({regionId:'demo-dawn',rulesetVersion:data.rulesetVersion,playerUnlockedGuardianIds:data.guardians.filter(g=>g.unlocked).map(g=>g.id),settings:{reduceMotion:document.body.classList.contains('reduce-motion')}});
 });
 main.querySelector('[data-finish]')?.addEventListener('click',()=>expedition.finish());
 main.querySelector('[data-abandon]')?.addEventListener('click',()=>expedition.abandon());
main.querySelectorAll('[data-region]').forEach(b=>b.onclick=()=>{const r=data.regions.find(r=>r.id===b.dataset.region);if(r.status==='available')location.hash='/prepare';else notice(r.title,r.status==='locked'?'Région verrouillée dans cette démonstration. Condition définitive à valider.':'Région conceptuelle, indisponible dans cette démonstration.');});main.querySelector('[data-launch]')?.addEventListener('click',async()=>{notice('Combat indisponible','Le moteur canonique est absent. Seule la démonstration du connecteur est disponible.');});main.querySelectorAll('[data-reload]').forEach(b=>b.onclick=load);main.querySelectorAll('[data-state]').forEach(b=>b.onclick=()=>{if(b.dataset.state==='error')loadState='error';else {data={...data,guardians:[]};loadState='ready';}location.hash='/collection';render();});main.querySelector('[data-reset]')?.addEventListener('click',()=>{filter={family:'Toutes',classId:'Toutes',status:'Tous',query:''};render();});for(const [selector,key] of [['#class-filter','classId'],['#family','family'],['#status','status'],['#search','query']])main.querySelector(selector)?.addEventListener('change',e=>{filter[key]=e.target.value;render();});}
async function load(){loadState='loading';render();try{catalogData=await bridge.getCatalog();let storage;try{storage=window.localStorage;}catch{storage={getItem(){throw new Error('Stockage inaccessible');}};}progression=new DemoProgression(storage,catalogData);projectProgression();loadState='ready';}catch{loadState='error';}render();}
window.addEventListener('hashchange',()=>{if(expedition.state==='running' && location.hash!=='#/run'){expedition.abandon();return;}render(true);});load();products.load();
