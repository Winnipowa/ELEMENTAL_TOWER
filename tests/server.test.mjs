import {test} from 'node:test';import assert from 'node:assert/strict';
import {createReferenceServer} from './server.mjs';
test('local server serves correct MIME, rejects malformed/escaping paths and stays alive',async()=>{
 const server=createReferenceServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const root=`http://127.0.0.1:${server.address().port}`;
 try{
  for(const [file,type]of [['/meta/index.html','text/html'],['/meta/app.js','text/javascript'],['/meta/data/catalog.demo.json','application/json'],['/meta/art/sources/guardians-primary.png','image/png']]){const response=await fetch(root+file);assert.equal(response.status,200);assert.ok(response.headers.get('content-type').startsWith(type));await response.arrayBuffer();}
  assert.equal((await fetch(root+'/%bad')).status,400);assert.equal((await fetch(root+'/%2e%2e%2foutside.txt')).status,403);assert.equal((await fetch(root+'/missing')).status,404);assert.equal((await fetch(root+'/meta/index.html',{method:'POST'})).status,405);
  assert.equal((await fetch(root+'/',{redirect:'manual'})).headers.get('location'),'/meta/index.html');assert.equal((await fetch(root+'/meta/index.html')).status,200);
 }finally{await new Promise(resolve=>server.close(resolve));}
});
