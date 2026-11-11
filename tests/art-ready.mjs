/** Wait only for artwork exposed by actual layout; never assign URLs to deferred images. */
export async function visibleArtReady(page){
 const ready=await page.waitForFunction(()=>{
  const exposed=el=>{
   if(el.closest('details:not([open])'))return false;
   const r=el.getBoundingClientRect();let l=Math.max(0,r.left),t=Math.max(0,r.top),right=Math.min(innerWidth,r.right),b=Math.min(innerHeight,r.bottom);
   if(!r.width||!r.height)return false;
   for(let p=el.parentElement;p;p=p.parentElement){const c=getComputedStyle(p),a=p.getBoundingClientRect();if(c.display==='none'||c.visibility==='hidden')return false;if(/auto|scroll|hidden|clip/.test(c.overflowX)){l=Math.max(l,a.left);right=Math.min(right,a.right);}if(/auto|scroll|hidden|clip/.test(c.overflowY)){t=Math.max(t,a.top);b=Math.min(b,a.bottom);}}
   return right>l&&b>t;
  };
  const images=[...document.querySelectorAll('.art-sprite')].filter(exposed).map(el=>el.querySelector('image'));
  return images.every(i=>i.hasAttribute('href')&&!['pending','loading'].includes(i.dataset.artState))?{urls:images.filter(i=>i.dataset.artState!=='unavailable').map(i=>i.getAttribute('href'))}:false;
 });
 const {urls}=await ready.jsonValue();await ready.dispose();
 await page.evaluate(async urls=>{
  // Only exposed, assigned URLs: do not wait for or activate hidden art, even in the eager baseline.
  await Promise.all([...new Set(urls)].map(async url=>{const i=new Image();i.src=url;await i.decode();}));
  await document.fonts.ready;await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
 },urls);
}
