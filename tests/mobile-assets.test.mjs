import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {SHEETS,GUARDIAN_ART,sprite} from '../meta/art.js';
import {bindArtFallbacks,sheetHref} from '../meta/mobile-assets.js';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const originals=JSON.parse(fs.readFileSync('meta/art/provenance.json','utf8'));
const manifest=JSON.parse(fs.readFileSync('meta/art/mobile/provenance.json','utf8'));

test('mobile derivatives retain all six original sheets, provenance, dimensions and exact mappings',async()=>{
 const baseline=execFileSync('git',['show','d2184f5:meta/art.js'],{encoding:'utf8'});
 const previous=await import('data:text/javascript;base64,'+Buffer.from(baseline).toString('base64'));
 assert.deepEqual(SHEETS,previous.SHEETS);assert.deepEqual(GUARDIAN_ART,previous.GUARDIAN_ART);
 assert.equal(manifest.records.length,6);
 for(const original of originals.records){
  const r=manifest.records.find(r=>r.source===original.file);
  assert.equal(r.sourceSha256,original.sha256);assert.equal(hash(fs.readFileSync('meta/art/sources/'+r.source)),original.sha256);
  const bytes=fs.readFileSync('meta/art/mobile/'+r.file);
  assert.equal(hash(bytes),r.sha256);assert.equal(bytes.subarray(1,4).toString(),'PNG');
  assert.equal(bytes.readUInt32BE(16),original.width);assert.equal(bytes.readUInt32BE(20),original.height);assert.equal(bytes[25],6);
  assert.equal(bytes.length,r.bytes);assert.ok(r.bytes<r.sourceBytes);assert.equal(r.width,original.width);assert.equal(r.height,original.height);
  assert.equal(r.rgbaIdentical,true);assert.equal(sheetHref(original.file),'./art/mobile/'+r.file);
 }
 assert.match(sprite('guardians',[225,5,215,210]),/viewBox="225 5 215 210"/);
 assert.match(sprite('guardians',[225,5,215,210]),/data-source-href="\.\/art\/sources\/guardians-primary.png"/);
});

test('asset fallback retries PNG once, then exposes portrait fallback without a retry loop',()=>{
 let listener,changes=0;const fallback={hidden:true};let unavailable=false;
 const portrait={classList:{add(){unavailable=true;}},querySelector(){return fallback;}};
 const image={dataset:{sourceHref:'./art/sources/guardians-primary.png'},addEventListener(type,fn){assert.equal(type,'error');listener=fn;},setAttribute(key,value){assert.equal(key,'href');assert.equal(value,this.dataset.sourceHref);changes++;},closest(selector){return selector==='.portrait'?portrait:{};}};
 bindArtFallbacks({querySelectorAll(){return [image];}});listener();assert.equal(changes,1);assert.equal(fallback.hidden,true);
 listener();listener();assert.equal(changes,1);assert.equal(fallback.hidden,false);assert.equal(unavailable,true);
});
