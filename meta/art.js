import {sheetHref} from './mobile-assets.js';
/** Presentation-only viewports into the supplied, byte-identical PNG sheets.
 * Keys refer to existing demo portrait keys, never canonical engine IDs.
 * Element labels and FX associations are visual proposals, not mechanics.
 */
export const SHEETS={
 guardians:{file:'guardians-primary.png',width:1122,height:1402},
 secondary:{file:'guardians-secondary.png',width:1122,height:1402},
 ranks:{file:'ranks-luma-mousse-raika.png',width:1122,height:1402},
 areas:{file:'spell-areas.png',width:1122,height:1402},
 projectiles:{file:'spell-projectiles.png',width:1122,height:1402},
 halos:{file:'halos-pedestals.png',width:1122,height:1402}
};
export const GUARDIAN_ART=Object.freeze(Object.assign(Object.create(null),{
 'demo-luma':{name:'Luma',tone:'light',element:'Lumière',portrait:[225,5,215,210],spell:[0,0,225,235],aura:[0,0,280,235],pedestal:[0,1090,280,310],ranks:[[15,145,185,150],[225,130,205,165],[440,85,210,210],[650,60,220,235],[875,8,240,287]]},
 'demo-mousse':{name:'Mousse',tone:'nature',element:'Nature',portrait:[225,590,215,175],spell:[675,0,225,235],aura:[825,280,295,220],pedestal:[560,1090,280,310],ranks:[[15,450,185,150],[225,430,205,170],[435,395,215,205],[655,395,220,205],[875,355,240,245]]},
 'demo-nyx':{name:'Nyx',tone:'shadow',element:'Ombre',portrait:[225,1170,220,220],spell:[235,300,205,170],aura:[0,810,280,205],pedestal:[840,1090,280,310]}
}));
let spriteSequence=0;
export function sprite(sheetName,rect,label='',className=''){
 const sheet=SHEETS[sheetName],clip=`guardian-art-clip-${++spriteSequence}`;
 // All rectangles and file names are trusted application presentation constants.
 return `<span class="art-sprite ${className}" ${label?`role="img" aria-label="${label}"`:'aria-hidden="true"'}><svg viewBox="${rect.join(' ')}" aria-hidden="true" focusable="false"><defs><clipPath id="${clip}"><rect x="${rect[0]}" y="${rect[1]}" width="${rect[2]}" height="${rect[3]}"/></clipPath></defs><image clip-path="url(#${clip})" href="${sheetHref(sheet.file)}" data-source-href="./art/sources/${sheet.file}" width="${sheet.width}" height="${sheet.height}"/></svg></span>`;
}
export function guardianVisual(g){
 const art=GUARDIAN_ART[g.portraitKey];if(!art)return null;
 return `<div class="portrait portrait-reference tone-${art.tone}">${sprite('halos',art.pedestal,'','guardian-pedestal')}${sprite('guardians',art.portrait,`Portrait fourni de ${art.name}`,'guardian-figure')}<span class="portrait-fallback" hidden aria-label="Portrait indisponible">✧</span></div>`;
}
export function elementBadge(g){const art=GUARDIAN_ART[g.portraitKey];return art?`<span class="element-badge tone-${art.tone}">${sprite('projectiles',art.spell)}<span>${art.element}<small>Identité visuelle</small></span></span>`:'';}
export function referenceStudy(g){
 const art=GUARDIAN_ART[g.portraitKey];if(!art)return '';
 const poses=art.ranks?Array.from({length:5},(_,i)=>`<figure>${sprite('ranks',art.ranks[i],`${art.name}, référence ${i+1} étoiles`)}<figcaption>${i+1}★ · Référence</figcaption></figure>`).join(''):`<figure>${sprite('guardians',[430,1170,330,220],'Nyx, pose d’attaque')}<figcaption>Pose d’attaque</figcaption></figure><figure>${sprite('guardians',[770,1150,340,245],'Nyx, pose de capacité')}<figcaption>Pose de capacité</figcaption></figure>`;
 return `<details class="art-study card tone-${art.tone}"><summary>Références visuelles · ${art.name}</summary><p>Aperçus artistiques uniquement. Aucun rang, sort ou déblocage modifié.</p><div class="rank-gallery">${poses}</div></details>`;
}
export function abilityArt(g){const art=GUARDIAN_ART[g.portraitKey];return art?`<div class="ability-reference tone-${art.tone}">${sprite('projectiles',art.spell,`Projectile de référence — ${art.element}`)}${sprite('areas',art.aura,`Effet de zone de référence — ${art.element}`)}<small>FX fournis · association visuelle à valider</small></div>`:'';}
export function codexArt(){return `<div class="codex-art-strip" aria-label="Références magiques fournies">${Object.values(GUARDIAN_ART).map(art=>`<figure class="tone-${art.tone}">${sprite('areas',art.aura,`FX de référence ${art.element}`)}<figcaption>${art.element}</figcaption></figure>`).join('')}</div>`;}
