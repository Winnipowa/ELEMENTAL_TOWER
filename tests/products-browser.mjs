import {APP_URL} from './browser-target.mjs';
import {startBrowserServer} from './browser-server.mjs';
import {chromium} from 'playwright';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {loadCatalog} from '../meta/catalog.js';
import {initialState,SAVE_KEY} from '../meta/progression.js';
import {PREFERENCE_KEY} from '../meta/products/preferences.js';
import {LocalProductCatalogs} from '../meta/products/service.js';
const fixtures=await new LocalProductCatalogs().load(),core=await loadCatalog();
const server=await startBrowserServer();let browser;
const dir='test-results/meta-04';fs.mkdirSync(dir,{recursive:true});const captures=[];
try{
 browser=await chromium.launch({channel:'msedge',headless:true});
 for(const [width,height]of [[320,844],[390,844],[430,844],[320,568]]){
  const size=`${width}x${height}`,page=await browser.newPage({viewport:{width,height},isMobile:true,hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const root=APP_URL;await page.goto(root+'#/missions');await page.locator('.mission-card').first().waitFor();
  await page.evaluate(([key,state])=>{localStorage.setItem(key,JSON.stringify(state));localStorage.setItem('meta04-v09-probe','unchanged');},[SAVE_KEY,initialState(core)]);await page.reload();await page.locator('.mission-card').first().waitFor();
  const protectedStorage=await page.evaluate(key=>{const state={...localStorage};delete state[key];return JSON.stringify(state);},PREFERENCE_KEY);
  const checkProtected=async()=>assert.equal(await page.evaluate(key=>{const state={...localStorage};delete state[key];return JSON.stringify(state);},PREFERENCE_KEY),protectedStorage);
  async function go(route){await page.evaluate(r=>location.hash='/'+r,route);await page.waitForFunction(r=>document.querySelector('main').dataset.view===r.split('/')[0],route);}
  async function capture(name){await page.evaluate(async()=>{await document.fonts.ready;for(const el of document.querySelectorAll('.art-sprite image')){const im=new Image();im.src=el.getAttribute('href');await im.decode();}});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${size} ${name}`);await page.screenshot({path:`${dir}/${name}-${size}.png`});captures.push({name,width,height});}
  assert.equal(await page.locator('.mission-card').count(),6);assert.equal(await page.locator('[data-qa-mission]').count(),0);await capture('missions');await page.locator('.mission-card').first().locator('summary').click();await page.locator('.mission-card').first().getByText('Aperçu cosmétique fictif — aucune attribution.',{exact:true}).waitFor();await capture('mission-conditions');
  await page.locator('#mission-period').selectOption('weekly');assert.equal(await page.locator('.mission-card').count(),2);await page.locator('#mission-status').selectOption('locked');assert.equal(await page.locator('.mission-card').count(),1);await page.locator('#mission-period').selectOption('all');await page.locator('#mission-status').selectOption('all');
  await go('demo');await page.locator('.qa-products').waitFor();
  await page.getByLabel('Progression QA — Carnet de voyage',{exact:true}).fill('1');await page.getByRole('button',{name:'Appliquer · Carnet de voyage',exact:true}).click();
  await page.getByLabel('Progression QA — Explorer Aurore',{exact:true}).fill('1');await page.getByRole('button',{name:'Appliquer · Explorer Aurore',exact:true}).click();
  await page.getByLabel('Points QA du Pass',{exact:true}).fill('50');await page.getByRole('button',{name:'Appliquer les points QA',exact:true}).click();
  await page.getByRole('button',{name:'Marquer obtenu · Gratuit · Palier 1',exact:true}).click();await page.getByRole('button',{name:'Marquer obtenu · Premium · Palier 2',exact:true}).click();
  await page.locator('.qa-products').scrollIntoViewIfNeeded();await capture('qa-products');await go('missions');for(const state of ['available','in_progress','completed','locked'])assert.ok(await page.locator('.mission-card.state-'+state).count()>0);await capture('missions-qa');
  // A mock expedition cannot become a verified mission event or cosmetic grant.
  await go('home');await page.getByRole('button',{name:/Aurore/}).click();await page.getByRole('button',{name:'Lancer la démonstration',exact:true}).click();await page.getByRole('button',{name:'Afficher le résultat simulé',exact:true}).click();await page.getByRole('heading',{name:'Victoire · Démonstration',exact:true}).waitFor();await go('missions');await page.locator('[data-mission="demo-m-journeys"]').getByText('1 / 3 · progression fictive',{exact:true}).waitFor();await checkProtected();
  await go('pass');await page.locator('.pass-tier').first().waitFor();assert.equal(await page.locator('.pass-tier.state-obtained').count(),1);assert.equal(await page.locator('.pass-tier.state-locked').count(),1);await capture('pass-free');
  await page.getByRole('button',{name:'Voie premium · Aperçu',exact:true}).click();assert.equal(await page.locator('.pass-tier.state-obtained').count(),1);assert.equal(await page.getByRole('button',{name:'Voie premium · Aperçu',exact:true}).getAttribute('aria-pressed'),'true');await capture('pass-premium');
  await go('shop');await page.locator('.product-card').first().waitFor();assert.equal(await page.locator('.product-card').count(),5);await capture('shop');
  await page.locator('#product-category').selectOption('skill_effect');assert.equal(await page.locator('.product-card').count(),1);await page.locator('.product-card').click();await page.getByRole('heading',{name:'Floraison magique',level:1,exact:true}).waitFor();await capture('product');
  await page.getByRole('button',{name:'Prévisualiser le cosmétique',exact:true}).click();await page.getByRole('dialog').waitFor();await capture('preview-dialog');await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').isVisible(),false);await checkProtected();
  await page.getByRole('link',{name:'Retour à Boutique',exact:true}).click();await page.getByLabel('Rechercher un cosmétique',{exact:true}).fill('inconnu');await page.getByLabel('Rechercher un cosmétique',{exact:true}).press('Tab');await page.getByRole('heading',{name:'Aucun cosmétique',exact:true}).waitFor();await page.getByRole('button',{name:'Réinitialiser les filtres',exact:true}).click();assert.equal(await page.locator('.product-card').count(),5);
  await page.locator('#product-availability').selectOption('coming_soon');await page.locator('.product-card').click();await page.getByRole('heading',{name:'Cadre des songes',level:1,exact:true}).waitFor();assert.equal(await page.getByRole('button',{name:'Prévisualiser le cosmétique',exact:true}).isDisabled(),true);await capture('illustration-slot');
  await go('product/missing');await page.getByRole('heading',{name:'Cosmétique introuvable',exact:true}).waitFor();
  await go('settings');await page.getByRole('heading',{name:'Audio à raccorder',exact:true}).waitFor();assert.equal(await page.locator('fieldset:disabled input').count(),3);await capture('settings');
  await page.getByLabel('Réduire les animations',{exact:true}).check();await page.getByLabel('Texte agrandi',{exact:true}).check();await page.getByLabel('Contraste renforcé',{exact:true}).check();await page.getByLabel('Halos d’interface',{exact:true}).uncheck();await capture('settings-accessible');
  for(const route of ['missions','shop','pass']){
   await go(route);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
   const items=page.locator('main a:visible,main button:visible,main select:visible,main input:visible');
   for(let i=0;i<await items.count();i++){const item=items.nth(i);await item.scrollIntoViewIfNeeded();const r=await item.boundingBox(),m=await page.locator('main').boundingBox(),n=await page.locator('nav').boundingBox();assert.ok(r.y>=m.y-1&&r.y+r.height<=n.y+1,`${size} large text control obscured in ${route}`);}
  }
  await go('settings');await page.reload();await page.getByLabel('Texte agrandi',{exact:true}).waitFor();assert.equal(await page.getByLabel('Texte agrandi',{exact:true}).isChecked(),true);assert.equal(await page.locator('body.reduce-motion.large-text.high-contrast.quiet-glows').count(),1);await checkProtected();
  await go('missions');await page.locator('.mission-card').first().waitFor();await page.locator('[data-mission="demo-m-journeys"]').getByText('0 / 3 · progression fictive',{exact:true}).waitFor();await go('pass');assert.equal(await page.locator('.pass-tier.state-obtained').count(),0);
  // Test explicit loading, HTTP error/retry and completely empty catalogs.
  let release;const hold=new Promise(r=>release=r);await page.route('**/products/missions.demo.json',async route=>{await hold;await route.continue();});await page.goto(root+'#/shop');await page.reload({waitUntil:'domcontentloaded'});await page.getByText('Chargement des catalogues de démonstration…',{exact:true}).waitFor();await capture('loading');release();await page.locator('.product-card').first().waitFor();await page.unroute('**/products/missions.demo.json');
  await page.route('**/products/missions.demo.json',route=>route.fulfill({status:503,body:'offline'}));await page.reload();await page.getByRole('heading',{name:'Catalogues indisponibles',exact:true}).waitFor();await capture('catalog-error');await page.unroute('**/products/missions.demo.json');await page.getByRole('button',{name:'Réessayer les catalogues',exact:true}).click();await page.locator('.product-card').first().waitFor();
  const empty=structuredClone(fixtures);empty.missions.missions=[];empty.cosmetics.products=[];empty.pass.tiers=[];
  for(const [key,file]of [['missions','missions'],['cosmetics','cosmetics'],['pass','pass']])await page.route(`**/products/${file}.demo.json`,route=>route.fulfill({json:empty[key]}));
  await page.goto(root+'#/missions');await page.reload();await page.getByRole('heading',{name:'Aucune mission',exact:true}).waitFor();await capture('missions-empty');await go('shop');await page.getByRole('heading',{name:'Aucun cosmétique',exact:true}).waitFor();await capture('shop-empty');await go('pass');await page.getByRole('heading',{name:'Aucun palier',exact:true}).waitFor();await capture('pass-empty');await page.unrouteAll();
  await page.evaluate(key=>localStorage.setItem(key,'{broken'),PREFERENCE_KEY);await page.goto(root+'#/settings');await page.reload();await page.getByText(/Préférences illisibles/).waitFor();await page.getByLabel('Texte agrandi',{exact:true}).click();assert.equal(await page.getByLabel('Texte agrandi',{exact:true}).isChecked(),false);assert.equal(await page.evaluate(key=>localStorage.getItem(key),PREFERENCE_KEY),'{broken');await capture('preferences-error');await checkProtected();
  page.once('dialog',dialog=>dialog.accept());await page.getByRole('button',{name:'Réinitialiser les préférences démo',exact:true}).click();assert.equal(await page.evaluate(key=>localStorage.getItem(key),PREFERENCE_KEY),null);await checkProtected();
  // At normal size and with the stored accessibility options, visible controls stay outside nav.
  for(const route of ['missions','shop','product/demo-skin-luma','pass','settings']){await go(route);if(route==='shop')await page.locator('.product-card').first().waitFor();const controls=page.locator('main a:visible,main button:visible,main input:visible,main select:visible,main summary:visible');for(let i=0;i<await controls.count();i++){const item=controls.nth(i);await item.scrollIntoViewIfNeeded();const r=await item.boundingBox(),m=await page.locator('main').boundingBox(),n=await page.locator('nav').boundingBox();assert.ok(r.y>=m.y-1&&r.y+r.height<=n.y+1,`${size} control covered in ${route}`);}}
  assert.deepEqual(errors,[]);await page.close();console.log(`${size}: missions QA-only, product filters/preview, both Pass tracks, preferences/persistence, loading/error/empty states and storage isolation OK`);
 }
}finally{await browser?.close();server.kill();}
fs.writeFileSync(`${dir}/validation.json`,JSON.stringify({viewports:[[320,844],[390,844],[430,844],[320,568]],captures,protectedStorageUnchanged:true,noAttribution:true},null,2));
