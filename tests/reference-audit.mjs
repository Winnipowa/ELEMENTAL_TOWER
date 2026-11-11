import assert from 'node:assert/strict';
import fs from 'node:fs';import path from 'node:path';import {execFileSync,spawnSync} from 'node:child_process';import crypto from 'node:crypto';
import {loadCatalog} from '../meta/catalog.js';import {LocalProductCatalogs} from '../meta/products/service.js';import {PROTOTYPE_VERSION} from '../meta/version.js';
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const files=[...walk('meta'),...walk('tests'),...walk('scripts')];const js=files.filter(f=>/\.(js|mjs)$/.test(f));const imports=[];
for(const file of js){const result=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});assert.equal(result.status,0,result.stderr);const source=fs.readFileSync(file,'utf8');for(const match of source.matchAll(/(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s*)['"]([^'"]+)['"]/g)){const target=match[1];if(target.startsWith('.'))assert.ok(fs.existsSync(path.resolve(path.dirname(file),target)),`${file}: missing import ${target}`);imports.push({file:file.replaceAll('\\','/'),target});}}
for(const entry of imports.filter(x=>x.file.startsWith('meta/')))assert.ok(!/prototypes|game-data|playable-expedition/.test(entry.target),'Engine imported by meta UI');
const catalog=await loadCatalog(),products=await new LocalProductCatalogs().load();
const pkg=JSON.parse(fs.readFileSync('package.json','utf8')),lock=JSON.parse(fs.readFileSync('package-lock.json','utf8'));
assert.equal(pkg.version,PROTOTYPE_VERSION);assert.equal(lock.version,pkg.version);assert.equal(lock.packages[''].version,pkg.version);assert.equal(pkg.private,true);assert.equal(pkg.devDependencies.playwright,lock.packages['node_modules/playwright'].version);
const provenance=JSON.parse(fs.readFileSync('meta/art/provenance.json','utf8'));for(const record of provenance.records)assert.equal(crypto.createHash('sha256').update(fs.readFileSync('meta/art/sources/'+record.file)).digest('hex'),record.sha256);
const protectedFiles=['meta/bridge.js','meta/expedition.js','meta/progression.js','meta/catalog.js','meta/products/service.js','meta/products/preferences.js','meta/data/catalog.demo.json','meta/products/cosmetics.demo.json','meta/products/missions.demo.json','meta/products/pass.demo.json','meta/art.js','meta/art/provenance.json','meta/shell.css','docs/GAME_BRIDGE_CONTRACT_V0.md','docs/META_APP_SCOPE_V1.md','docs/GDD_V1.1.md',...provenance.records.map(x=>'meta/art/sources/'+x.file)];
for(const file of protectedFiles){
 if(file==='meta/art.js'){
  // PERF-01 changes only image delivery. Reverse it to prove all logical mappings/viewBoxes remain exact.
  const transportImport=['import','{spriteImage}','from',"'./mobile-assets.js';"].join(' ')+'\n';
  const oldImage='<image clip-path="url(#${clip})" href="./art/sources/${sheet.file}" width="${sheet.width}" height="${sheet.height}"/>';
  const reversed=fs.readFileSync(file,'utf8').replaceAll('\r\n','\n').replace(transportImport,'').replace('${spriteImage(sheet,rect,clip)}',oldImage).trim();
  assert.equal(reversed,git('show','832959f:'+file),'Art mappings/viewBoxes changed beyond PERF-01 transport exception');
 }else assert.equal(git('hash-object','--path='+file,file),git('rev-parse','832959f:'+file),'Protected file changed: '+file);
}
const prs=JSON.parse(fs.readFileSync('docs/audit/int-01/pr-history.json','utf8')).map(p=>({...p,inherited:spawnSync('git',['merge-base','--is-ancestor',p.head_sha,'832959f']).status===0}));assert.deepEqual(prs.filter(p=>!p.inherited).map(p=>p.number),[9]);
const docLinks=[];for(const file of ['README.md',...walk('docs').filter(f=>f.endsWith('.md'))]){const source=fs.readFileSync(file,'utf8');for(const match of source.matchAll(/\]\(([^)]+)\)/g)){const target=match[1];if(/^(?:https?:|#|mailto:|codex:)/.test(target))continue;const clean=target.split('#')[0].split('?')[0];if(clean&& !fs.existsSync(path.resolve(path.dirname(file),clean)))docLinks.push({file,target});}}
const hashes=new Map();for(const file of walk('meta')){const key=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');hashes.set(key,[...(hashes.get(key)||[]),file.replaceAll('\\','/')]);}
const report={version:PROTOTYPE_VERSION,syntaxFiles:js.length,imports,protectedFiles,prs,missingDocumentLinks:docLinks,identicalRuntimeFiles:[...hashes.values()].filter(x=>x.length>1),catalogCounts:{guardians:catalog.guardians.length,regions:catalog.regions.length,families:catalog.families.length,classes:catalog.classes.length,synergies:catalog.synergies.length,chapters:catalog.chapters.length,objectives:catalog.objectives.length,missions:products.missions.missions.length,products:products.cosmetics.products.length,tiers:products.pass.tiers.length},dependencies:{production:pkg.dependencies||{},development:pkg.devDependencies,node:process.version}};
fs.mkdirSync('test-results/int-01',{recursive:true});fs.writeFileSync('test-results/int-01/static-audit.json',JSON.stringify(report,null,2)+'\n');assert.deepEqual(docLinks,[],'Missing documentation links');console.log(`Static audit OK: ${js.length} syntax files, ${imports.length} imports, ${protectedFiles.length} protected files, PR #9 documentary-only gap confirmed.`);
