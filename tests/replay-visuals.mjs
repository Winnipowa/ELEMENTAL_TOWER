import {TEST_PORT} from './browser-target.mjs';
import fs from 'node:fs';import path from 'node:path';import {execFileSync,spawnSync} from 'node:child_process';
const targets=[['DA-01','2346dcf','palette-review.mjs'],['DA-02','9f6070b','soft-fantasy-review.mjs'],['DA-03','36da594','guardian-art-review.mjs'],['DA-04','66814ef','ui-color-review.mjs'],['UX-01','bf7524a','ux-review.mjs']];
const base=path.resolve('test-results/int-01/replays');fs.mkdirSync(base,{recursive:true});const results=[];
for(const [lot,revision,script]of targets){
 const dir=fs.mkdtempSync(path.join(base,lot+'-'));const archive=dir+'.tar';
 execFileSync('git',['archive','--format=tar','--output='+archive,revision,'meta','tests','package.json','package-lock.json']);execFileSync('tar',['-xf',archive,'-C',dir]);
 const adapt=folder=>{for(const item of fs.readdirSync(folder,{withFileTypes:true})){const file=path.join(folder,item.name);if(item.isDirectory())adapt(file);else if(/\.(js|mjs)$/.test(item.name)){const source=fs.readFileSync(file,'utf8');fs.writeFileSync(file,source.replaceAll('4173',String(TEST_PORT)));}}};adapt(path.join(dir,'tests'));
 console.log(`Historical replay ${lot} at ${revision}...`);const start=Date.now();const run=spawnSync(process.execPath,['tests/'+script],{cwd:dir,encoding:'utf8',timeout:120000,maxBuffer:4000000});const log=(run.stdout||'')+(run.stderr||'')+(run.error?'\n'+run.error:'');fs.writeFileSync(path.join(dir,'replay.log'),log);console.log(log.trim());results.push({lot,revision,script,port:TEST_PORT,portAdaptationOnly:true,status:run.status,elapsedMs:Date.now()-start,directory:path.relative(process.cwd(),dir).replaceAll('\\','/')});
 if(run.status!==0){process.exitCode=1;break;}
}
fs.writeFileSync('test-results/int-01/visual-history.json',JSON.stringify(results,null,2)+'\n');
