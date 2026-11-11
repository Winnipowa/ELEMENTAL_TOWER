/** Transport-only derivatives. Original dimensions and presentation mappings remain authoritative. */
export function sheetHref(file){return `./art/mobile/${file}`;}

/** One PNG fallback per image; no retries loop, storage or remote network dependency. */
export function bindArtFallbacks(root){
 for(const image of root.querySelectorAll('.art-sprite image[data-source-href]')){
  image.addEventListener('error',()=>{
   if(!image.dataset.sourceRetried){
    image.dataset.sourceRetried='true';
    image.setAttribute('href',image.dataset.sourceHref);
    return;
   }
   const portrait=image.closest('.portrait');
   if(portrait&&image.closest('.guardian-figure')){
    portrait.classList.add('art-unavailable');
    portrait.querySelector('.portrait-fallback').hidden=false;
   }
  });
 }
}
