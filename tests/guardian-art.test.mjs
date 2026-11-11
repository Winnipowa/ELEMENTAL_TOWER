import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {GUARDIAN_ART,SHEETS,guardianVisual,elementBadge,referenceStudy} from '../meta/art.js';
const provenance=JSON.parse(fs.readFileSync(new URL('../meta/art/provenance.json',import.meta.url),'utf8'));
test('six original reference sheets remain byte-identical with transparent PNG alpha',()=>{
 for(const record of provenance.records){const bytes=fs.readFileSync(new URL(`../meta/art/sources/${record.file}`,import.meta.url));assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),record.sha256);assert.equal(bytes[25],6);assert.equal(bytes.readUInt32BE(16),record.width);assert.equal(bytes.readUInt32BE(20),record.height);}
});
test('presentation mapping only uses existing named guardians and valid source viewports',()=>{
 assert.deepEqual(Object.keys(GUARDIAN_ART),['demo-luma','demo-mousse','demo-nyx']);
 const check=(key,rect)=>{const s=SHEETS[key];const[x,y,w,h]=rect;assert.ok(x>=0&&y>=0&&w>0&&h>0&&x+w<=s.width&&y+h<=s.height);};
 for(const art of Object.values(GUARDIAN_ART)){check('guardians',art.portrait);check('projectiles',art.spell);check('areas',art.aura);check('halos',art.pedestal);for(const r of art.ranks||[])check('ranks',r);}
 assert.equal(guardianVisual({portraitKey:'unknown'}),null);assert.equal(guardianVisual({portraitKey:'constructor'}),null);assert.equal(elementBadge({portraitKey:'unknown'}),'');assert.match(referenceStudy({portraitKey:'demo-nyx'}),/Pose de capacité/);assert.doesNotMatch(referenceStudy({portraitKey:'demo-nyx'}),/5★/);
});
