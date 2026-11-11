import {TEST_ORIGIN} from './browser-target.mjs';
import {spawn} from 'node:child_process';
/** Resolve only when our child is listening; never silently reuse an occupied port. */
export async function startBrowserServer(){
 const child=spawn(process.execPath,['tests/server.mjs'],{stdio:['ignore','pipe','pipe']});
 await new Promise((resolve,reject)=>{
  let errors='';const timer=setTimeout(()=>{child.kill();reject(new Error('Local test server readiness timeout'));},10000);
  const fail=error=>{clearTimeout(timer);child.kill();reject(error);};
  child.once('error',fail);child.once('exit',code=>fail(new Error(`Local test server exited (${code}): ${errors}`)));
  child.stderr.on('data',data=>{errors+=data;});
  child.stdout.on('data',data=>{if(String(data).includes(TEST_ORIGIN+'/')){clearTimeout(timer);resolve();}});
 });return child;
}
