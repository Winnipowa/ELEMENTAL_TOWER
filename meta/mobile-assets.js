import {SPRITES} from './art/sprites/index.js';
/** META-05 full-sheet derivatives remain available, but are not the normal delivery path. */
export function sheetHref(file){return `./art/mobile/${file}`;}
export function spriteImage(sheet,rect,clip){
 const key=sheet.file+':'+rect.join(','),crop=SPRITES[key];
 const image=crop||{x:0,y:0,width:sheet.width,height:sheet.height};
 const href=crop?'./art/sprites/'+crop.file:sheetHref(sheet.file);
 return `<image clip-path="url(#${clip})" x="${image.x}" y="${image.y}" width="${image.width}" height="${image.height}" data-asset-href="${href}" data-source-href="./art/sources/${sheet.file}" data-sheet-width="${sheet.width}" data-sheet-height="${sheet.height}" data-art-state="pending"/>`;
}
export function attachArtFallback(image){
 image.addEventListener('load',()=>{image.dataset.artState='loaded';});
 image.addEventListener('error',()=>{
   if(!image.dataset.sourceRetried){
    image.dataset.sourceRetried='true';image.dataset.artState='loading';
    image.setAttribute('x','0');image.setAttribute('y','0');
    image.setAttribute('width',image.dataset.sheetWidth);image.setAttribute('height',image.dataset.sheetHeight);
    image.setAttribute('href',image.dataset.sourceHref);return;
   }
   image.dataset.artState='unavailable';
   const portrait=image.closest('.portrait');
   if(portrait&&image.closest('.guardian-figure')){
    portrait.classList.add('art-unavailable');
    portrait.querySelector('.portrait-fallback').hidden=false;
   }
 });
}
/** Respect closed disclosures, nested scroll galleries and the actual content viewport. */
export function artIsVisible(target){
 if(!target.isConnected||target.closest('details:not([open])'))return false;
 const r=target.getBoundingClientRect();let left=Math.max(0,r.left),top=Math.max(0,r.top),right=Math.min(innerWidth,r.right),bottom=Math.min(innerHeight,r.bottom);
 if(r.width<=0||r.height<=0)return false;
 for(let parent=target.parentElement;parent;parent=parent.parentElement){
  const css=getComputedStyle(parent),bounds=parent.getBoundingClientRect();
  if(css.display==='none'||css.visibility==='hidden')return false;
  if(/auto|scroll|hidden|clip/.test(css.overflowX)){left=Math.max(left,bounds.left);right=Math.min(right,bounds.right);}
  if(/auto|scroll|hidden|clip/.test(css.overflowY)){top=Math.max(top,bounds.top);bottom=Math.min(bottom,bounds.bottom);}
 }
 return right>left&&bottom>top;
}
const bindings=new WeakMap();
/** One disposable lazy-loading lifecycle per content root; no storage or application image cache. */
export function bindArtFallbacks(root){
 bindings.get(root)?.();
 const images=[...root.querySelectorAll('.art-sprite image[data-asset-href]')],pending=new Set(images),listeners=new AbortController();
 let frame=0,disposed=false;
 for(const image of images)attachArtFallback(image);
 const activate=image=>{
  if(disposed||!pending.has(image)||!artIsVisible(image.closest('.art-sprite')))return;
  pending.delete(image);observer?.unobserve(image.closest('.art-sprite'));
  image.dataset.artState='loading';image.setAttribute('href',image.dataset.assetHref);
 };
 const observer=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{
  for(const entry of entries)if(entry.isIntersecting)activate(entry.target.querySelector('image'));
 },{root,rootMargin:'0px',threshold:0}):null;
 const scan=()=>{frame=0;for(const image of pending)activate(image);};
 const schedule=()=>{if(!frame&&!disposed)frame=requestAnimationFrame(scan);};
 for(const image of images)observer?.observe(image.closest('.art-sprite'));
 root.addEventListener('toggle',schedule,{capture:true,signal:listeners.signal});
 if(!observer){
  root.addEventListener('scroll',schedule,{capture:true,passive:true,signal:listeners.signal});
  window.addEventListener('resize',schedule,{passive:true,signal:listeners.signal});
 }
 schedule();
 const dispose=()=>{disposed=true;observer?.disconnect();listeners.abort();if(frame)cancelAnimationFrame(frame);pending.clear();};
 bindings.set(root,dispose);return dispose;
}
