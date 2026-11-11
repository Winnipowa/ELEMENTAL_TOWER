import net from 'node:net';
import fs from 'node:fs';import {spawnSync} from 'node:child_process';
if(!process.env.ELEMENTAL_TEST_PORT){const probe=net.createServer();await new Promise(r=>probe.listen(0,'127.0.0.1',r));process.env.ELEMENTAL_TEST_PORT=String(probe.address().port);await new Promise(r=>probe.close(r));}
console.log('Isolated test port:',process.env.ELEMENTAL_TEST_PORT);
const out='test-results/int-01';fs.mkdirSync(out,{recursive:true});
const unitFiles=fs.readdirSync('tests').filter(x=>x.endsWith('.test.mjs')).map(x=>'tests/'+x);
const steps=[['static',['tests/reference-audit.mjs']],['unit',['--test',...unitFiles]],['navigation',['tests/navigation.mjs']],['products',['tests/products-browser.mjs']],['reference-browser',['tests/reference-browser.mjs']],['visual-history',['tests/replay-visuals.mjs']]];
const results=[];
for(const [name,args]of steps){console.log(`\nINT-01 ${name}...`);const start=Date.now();const result=spawnSync(process.execPath,args,{encoding:'utf8',timeout:300000,maxBuffer:8000000});const log=(result.stdout||'')+(result.stderr||'')+(result.error?'\n'+result.error:'');fs.writeFileSync(`${out}/${name}.log`,log);console.log(log.trim());results.push({name,args,status:result.status,elapsedMs:Date.now()-start});fs.writeFileSync(`${out}/test-results.json`,JSON.stringify(results,null,2)+'\n');if(result.status!==0){process.exitCode=1;break;}}
