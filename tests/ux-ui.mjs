import assert from 'node:assert/strict';
export async function testUX(page,width){
 const root='http://127.0.0.1:4173/meta/index.html';await page.goto(root+'#/collection');await page.reload();await page.locator('.guardian').first().waitFor();
 const before=await page.evaluate(()=>JSON.stringify({...localStorage}));
 await page.getByRole('link',{name:/Voir le déblocage/}).click();await page.getByRole('heading',{name:'Nyx',level:1,exact:true}).waitFor();assert.equal(await page.locator('main h1').count(),1);
 assert.equal(await page.getByRole('heading',{name:'Nyx',level:2,exact:true}).count(),0);
 await page.getByRole('heading',{name:'Compétence',level:2,exact:true}).waitFor();
 assert.equal(await page.locator('details[open]').count(),0);await page.getByText('Histoire et liens du codex',{exact:true}).click();assert.equal(await page.locator('details[open]').count(),1);
 await page.getByRole('link',{name:'Explorer le codex',exact:true}).click();await page.getByRole('heading',{name:'Familles',exact:true}).waitFor();
 await page.getByRole('link',{name:'Voir Luma',exact:true}).first().click();await page.getByRole('heading',{name:'Luma',level:1,exact:true}).waitFor();
 await page.getByRole('link',{name:'Retour à Collection',exact:true}).click();await page.locator('.guardian').first().waitFor();
 assert.equal(await page.locator('.guardian.is-locked').count(),1);assert.equal(await page.locator('.guardian.is-available').count(),2);
 for(const route of ['home','collection','guardian/demo-luma','guardian/demo-nyx','synergies','profile','settings','demo','prepare','shop','pass','results']){
  await page.evaluate(r=>location.hash='/'+r,route);await page.waitForFunction(r=>document.querySelector('main').dataset.view===r.split('/')[0],route);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  const navTop=(await page.locator('nav').boundingBox()).y;
  await page.locator('main').evaluate(el=>el.scrollTop=el.scrollHeight);
  assert.equal((await page.locator('nav').boundingBox()).y,navTop);
  const controls=page.locator('main a:visible, main button:visible, main summary:visible, main input:visible, main select:visible');
  for(let i=0;i<await controls.count();i++){
   const control=controls.nth(i);await control.scrollIntoViewIfNeeded();const b=await control.boundingBox();const nav=await page.locator('nav').boundingBox();const main=await page.locator('main').boundingBox();
   assert.ok(b.y>=main.y-1&&b.y+b.height<=nav.y+1,`${width} ${route}: control obscured by nav`);
   const reached=await control.evaluate(el=>{const r=el.getBoundingClientRect();const target=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return target===el||el.contains(target);});assert.ok(reached,`${width} ${route}: control hit blocked`);
  }
 }
 // Disclosure keyboard interaction and bottom action can be reached without overlap.
 await page.evaluate(()=>location.hash='/guardian/demo-luma');await page.getByRole('heading',{name:'Luma',level:1,exact:true}).waitFor();
 const summary=page.locator('.art-study summary');await summary.focus();await page.keyboard.press('Enter');assert.equal(await page.locator('.art-study').getAttribute('open'),'');
 await page.locator('main').evaluate(el=>el.scrollTop=el.scrollHeight);await page.getByRole('link',{name:'Synergies',exact:true}).click();await page.getByRole('heading',{name:'Synergies',level:1,exact:true}).waitFor();
 assert.equal(await page.locator('main').evaluate(el=>el.scrollTop),0);
 assert.equal(await page.evaluate(()=>JSON.stringify({...localStorage})),before);
 console.log(`${width}px UX-01: name title, disclosures/keyboard, codex links, all visible controls reachable, nav stable, scroll reset, storage unchanged OK`);
}
