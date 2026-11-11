import {APP_URL} from './browser-target.mjs';
import assert from 'node:assert/strict';
export async function testExpedition(page,width){
 const root=APP_URL;
 await page.goto(root);
 await page.evaluate(()=>localStorage.setItem('meta02-preservation-probe','unchanged'));
 const snapshot=await page.evaluate(()=>JSON.stringify({...localStorage}));
 for(const scenario of ['victory','defeat','abandoned','connection-error','open-error']){
  await page.getByRole('link',{name:'Monde',exact:true}).click();
  await page.getByRole('button',{name:/Aurore/}).click();
  await page.getByRole('link',{name:'Changer le scénario · Outils QA'}).click();await page.getByLabel('Scénario de démonstration').selectOption(scenario);await page.getByRole('link',{name:'Revenir à la préparation'}).click();
  await page.screenshot({path:`test-results/meta02-prepare-${scenario}-${width}.png`,fullPage:true});
  await page.getByRole('button',{name:'Lancer la démonstration',exact:true}).click();
  if(scenario.includes('error')){
   await page.getByRole('heading',{name:'Connexion impossible'}).waitFor();
   await page.screenshot({path:`test-results/meta02-${scenario}-${width}.png`,fullPage:true});
   await page.getByRole('link',{name:'Changer le scénario · Outils QA'}).click();await page.getByLabel('Scénario de démonstration').selectOption('victory');await page.getByRole('link',{name:'Revenir à la préparation'}).click();
   await page.getByRole('button',{name:'Lancer la démonstration',exact:true}).click();
   await page.getByRole('button',{name:'Abandonner la démonstration',exact:true}).click();
   await page.getByRole('heading',{name:'Abandon · Démonstration',exact:true}).waitFor();
  }else{
   await page.getByRole('heading',{name:'GameBridge · Démonstration',exact:true}).waitFor();
   await page.screenshot({path:`test-results/meta02-bridge-${scenario}-${width}.png`,fullPage:true});
   await page.getByRole('button',{name:'Afficher le résultat simulé',exact:true}).click();
   const label={victory:'Victoire',defeat:'Défaite',abandoned:'Abandon'}[scenario];
   await page.getByRole('heading',{name:`${label} · Démonstration`,exact:true}).waitFor();
   await page.screenshot({path:`test-results/meta02-result-${scenario}-${width}.png`,fullPage:true});
  }
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  assert.equal(await page.evaluate(()=>JSON.stringify({...localStorage})),snapshot);
  await page.getByRole('link',{name:'Retour au monde',exact:true}).click();
  await page.getByRole('heading',{name:'Un monde à découvrir'}).waitFor();
 }
 // Leaving an active connector through the browser history is an explicit abandonment.
 await page.getByRole('button',{name:/Aurore/}).click();
 await page.getByRole('button',{name:'Lancer la démonstration',exact:true}).click();
 await page.getByRole('button',{name:'Abandonner la démonstration',exact:true}).waitFor();
 await page.goBack();
 await page.getByRole('heading',{name:'Abandon · Démonstration',exact:true}).waitFor();
 await page.reload();await page.getByRole('heading',{name:'Aucun résultat disponible'}).waitFor();
 assert.equal(await page.evaluate(()=>JSON.stringify({...localStorage})),snapshot);
 console.log(`${width}px META-02: victory/defeat/abandon, start/open errors + retry, history abandonment, refresh and storage preservation OK`);
}
