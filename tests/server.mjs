import {TEST_PORT,TEST_ORIGIN} from './browser-target.mjs';
import fs from 'node:fs';import path from 'node:path';import http from 'node:http';import {pathToFileURL} from 'node:url';
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.md':'text/plain; charset=utf-8'};
/** Local-only development/test server. Not a deployment target. */
export function createReferenceServer(root=process.cwd()){
 root=path.resolve(root);
 return http.createServer((req,res)=>{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'}).end();return;}
  let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(pathname.includes('\0'))throw new Error('Invalid path');}catch{res.writeHead(400).end();return;}
  if(pathname==='/'){res.writeHead(302,{Location:'/meta/index.html'}).end();return;}
  const file=path.resolve(root,'.'+pathname),relative=path.relative(root,file);
  if(relative.startsWith('..'+path.sep)||relative==='..'||path.isAbsolute(relative)){res.writeHead(403).end();return;}
  fs.readFile(file,(err,body)=>{if(err){res.writeHead(404).end();return;}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(req.method==='HEAD'?undefined:body);});
 });
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
 const server=createReferenceServer();server.on('error',error=>{process.stderr.write(`Local test server failed: ${error.message}\n`);process.exitCode=1;});server.listen(TEST_PORT,'127.0.0.1',()=>console.log(TEST_ORIGIN+'/meta/index.html'));
}
