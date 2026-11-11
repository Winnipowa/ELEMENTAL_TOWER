import fs from 'node:fs';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';

// Offline build tool only. FFmpeg is not a runtime or npm dependency.
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const provenance=JSON.parse(fs.readFileSync('meta/art/provenance.json','utf8'));
const ffmpeg=process.env.FFMPEG_PATH||'ffmpeg';
const decode=file=>execFileSync(ffmpeg,['-v','error','-i',file,'-f','rawvideo','-pix_fmt','rgba','pipe:1'],{maxBuffer:16000000});
fs.mkdirSync('meta/art/mobile',{recursive:true});
const records=[];
for(const source of provenance.records){
 const input='meta/art/sources/'+source.file,output='meta/art/mobile/'+source.file;
 if(hash(fs.readFileSync(input))!==source.sha256)throw new Error('Source provenance mismatch: '+input);
 execFileSync(ffmpeg,['-v','error','-i',input,'-c:v','png','-compression_level','9','-pred','mixed','-pix_fmt','rgba','-y',output],{timeout:120000});
 const before=decode(input),after=decode(output);
 if(!before.equals(after))throw new Error('RGBA/alpha changed: '+source.file);
 const sourceBytes=fs.statSync(input).size,bytes=fs.statSync(output).size;
 if(bytes>=sourceBytes)throw new Error('Derivative is not smaller: '+source.file);
 records.push({source:source.file,sourceSha256:source.sha256,file:output.split('/').at(-1),sha256:hash(fs.readFileSync(output)),width:source.width,height:source.height,sourceBytes,bytes,rgbaSha256:hash(before),rgbaIdentical:true});
 console.log(`${source.file}: ${sourceBytes} -> ${bytes} bytes; full RGBA identical`);
}
const manifest={schemaVersion:1,source:'Derived from unchanged DA-03 source sheets',encoder:execFileSync(ffmpeg,['-version'],{encoding:'utf8'}).split(/\r?\n/)[0],recipe:'PNG compression_level=9 pred=mixed pix_fmt=rgba; dimensions unchanged',verification:'Full decoded RGBA exact including transparent pixels; no resizing, cropping or mapping changes',records};
fs.writeFileSync('meta/art/mobile/provenance.json',JSON.stringify(manifest,null,2)+'\n');
