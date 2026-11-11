import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {SPRITES} from '../meta/art/sprites/index.js';
import {SHEETS,sprite} from '../meta/art.js';
const provenance=JSON.parse(fs.readFileSync('meta/art/sprites/provenance.json','utf8'));
test('all cropped PNGs have traceable sources, exact dimensions and unchanged logical coordinates',()=>{
 const originals=JSON.parse(fs.readFileSync('meta/art/provenance.json','utf8'));
 assert.equal(provenance.records.length,24);assert.equal(new Set(provenance.records.map(r=>r.key)).size,24);
 for(const record of provenance.records){
  const source=originals.records.find(r=>r.file===record.source);assert.equal(record.sourceSha256,source.sha256);
  const [x,y,w,h]=record.mappingRect,[cx,cy,cw,ch]=record.cropRect;
  assert.ok(cx<=x&&cy<=y&&cx+cw>=x+w&&cy+ch>=y+h&&cx>=0&&cy>=0&&cx+cw<=source.width&&cy+ch<=source.height);
  assert.deepEqual(SPRITES[record.key],{file:record.file,x:cx,y:cy,width:cw,height:ch});
  const bytes=fs.readFileSync('meta/art/sprites/'+record.file);assert.equal(bytes.length,record.bytes);
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),record.sha256);
  assert.equal(bytes.readUInt32BE(16),cw);assert.equal(bytes.readUInt32BE(20),ch);assert.equal(bytes[25],6);assert.equal(record.rgbaIdentical,true);
 }
 const html=sprite('guardians',[225,5,215,210]);assert.match(html,/viewBox="225 5 215 210"/);assert.match(html,/data-art-state="pending"/);
 assert.doesNotMatch(html,/(?:^|\s)href=/);assert.match(html,/x="201" y="0" width="263" height="239"/);
 assert.equal(SHEETS.guardians.width,1122);assert.equal(SHEETS.guardians.height,1402);
});
