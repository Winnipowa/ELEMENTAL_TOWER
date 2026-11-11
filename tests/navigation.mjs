import {testProgression} from './progression-ui.mjs';
import {testExpedition} from './expedition-ui.mjs';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const {spawn}=await import('node:child_process');
const server=spawn(process.execPath,['tests/server.mjs'],{stdio:'ignore'});
await new Promise(r=>setTimeout(r,500));
process.on('exit',()=>server.kill());
const browser=await chromium.launch({channel:'msedge',headless:true});
fs.mkdirSync('test-results',{recursive:true});
for(const width of [320,390,430]){
 const page=await browser.newPage({viewport:{width,height:844},isMobile:true,hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4173/meta/index.html');await page.getByRole('heading',{name:'Un monde à découvrir'}).waitFor();
 await page.screenshot({path:`test-results/home-${width}.png`,fullPage:true});
 for(const route of ['collection','missions','shop','profile','settings','pass','challenges','prepare','results','synergies','guardian/demo-luma','guardian/demo-nyx','guardian/missing','unknown']){
  await page.evaluate(r=>location.hash='/'+r,route);await page.waitForTimeout(50);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${width} overflow ${route}`);
  if(route!=='unknown')await page.screenshot({path:`test-results/${route.replaceAll('/','-')}-${width}.png`,fullPage:true});
  await page.getByRole('link',{name:'‹ Retour',exact:true}).click();
 }
 await page.evaluate(()=>location.hash='/home');await page.getByRole('button',{name:/Sylve/}).click();assert.equal(await page.locator('dialog').isVisible(),true);await page.keyboard.press('Escape');
 await page.getByRole('button',{name:/Aurore/}).click();await page.getByRole('button',{name:'Vérifier l’accès au combat'}).click();assert.equal(await page.locator('dialog').isVisible(),true);await page.getByRole('button',{name:'Fermer',exact:true}).click();await page.goBack();await page.getByRole('heading',{name:'Un monde à découvrir'}).waitFor();
 await page.evaluate(()=>location.hash='/collection');await page.getByLabel('Rechercher').fill('inexistant');await page.getByLabel('Rechercher').press('Tab');await page.getByRole('heading',{name:'Aucun gardien'}).waitFor();await page.getByRole('button',{name:'Réinitialiser les filtres'}).click();
 await page.evaluate(()=>location.hash='/settings');await page.getByRole('button',{name:'Catalogue vide'}).click();await page.getByRole('heading',{name:'Aucun gardien'}).waitFor();
 await page.evaluate(()=>location.hash='/settings');await page.getByRole('button',{name:'Erreur catalogue'}).click();await page.getByRole('heading',{name:'Catalogue indisponible'}).waitFor();await page.getByRole('button',{name:'Réessayer'}).click();await page.getByRole('heading',{name:'Collection',exact:true}).waitFor();await page.locator('.guardian').first().waitFor();assert.equal(await page.locator('.guardian').count(),3);
 await testExpedition(page,width);
 await testProgression(page,width);
 assert.deepEqual(errors,[]);console.log(`${width}px: routes, retours, modales, recherche vide, catalogue vide/erreur/reprise, overflow OK`);await page.close();
}
await browser.close();

server.kill();
