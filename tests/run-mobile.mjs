import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

if(!process.env.PLAYWRIGHT_BROWSERS_PATH&&fs.existsSync('../browser-runtimes'))process.env.PLAYWRIGHT_BROWSERS_PATH=path.resolve('../browser-runtimes');
if(!process.env.ELEMENTAL_TEST_PORT){
 const probe=net.createServer();await new Promise(resolve=>probe.listen(0,'127.0.0.1',resolve));
 process.env.ELEMENTAL_TEST_PORT=String(probe.address().port);await new Promise(resolve=>probe.close(resolve));
}
const out='test-results/meta-05';fs.mkdirSync(out,{recursive:true});
const steps=[['reference',['tests/run-reference.mjs']],['mobile-browser',['tests/mobile-browser.mjs']],['mobile-performance',['tests/mobile-performance.mjs']]];
const results=[];
for(const [name,args]of steps){
 console.log(`META-05 ${name} (isolated port ${process.env.ELEMENTAL_TEST_PORT})...`);
 const start=Date.now(),run=spawnSync(process.execPath,args,{encoding:'utf8',timeout:600000,maxBuffer:16000000});
 const log=(run.stdout||'')+(run.stderr||'')+(run.error?'\n'+run.error:'');fs.writeFileSync(`${out}/${name}.log`,log);console.log(log.trim());
 results.push({name,args,status:run.status,elapsedMs:Date.now()-start});fs.writeFileSync(`${out}/test-results.json`,JSON.stringify(results,null,2)+'\n');
 if(run.status!==0){process.exitCode=1;break;}
}
