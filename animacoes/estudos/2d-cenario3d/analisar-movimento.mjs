// Diagnostic using the local gate's video-difference criterion; no browser.
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
const dir='render/exemplo-2d-3d',video=`${dir}/exemplo-2d-3d-v3.mp4`;
const r=spawnSync('ffmpeg',['-v','error','-i',video,'-vf','scale=270:480:flags=area,format=gray','-f','rawvideo','-'],{maxBuffer:100*1024*1024});
if(r.status!==0)throw Error(r.stderr?.toString()||'decode failed');
const buf=r.stdout,size=270*480,n=buf.length/size,diff=[0],changed=[0];
for(let f=1;f<n;f++){let sum=0,count=0;for(let i=0;i<size;i++){const d=Math.abs(buf[f*size+i]-buf[(f-1)*size+i]);sum+=d;if(d>4)count++;}diff.push(sum/size);changed.push(count/size);}
const spikes=[];for(let f=1;f<n;f++){const near=[];for(let k=Math.max(1,f-3);k<=Math.min(n-1,f+3);k++)if(k!==f)near.push(diff[k]);near.sort((a,b)=>a-b);const ref=Math.max(.5,(near[(near.length-1)>>1]+near[near.length>>1])/2);if(diff[f]>2&&diff[f]>3*ref)spikes.push({frame:f,t:f/30,ratio:diff[f]/ref,difference:diff[f],declared:[4,8,12].some(t=>Math.abs(t*30-f)<=1.01)});}
const out={frames:n,spikes,minChanged:Math.min(...changed.slice(1)),medianChanged:changed.slice(1).sort((a,b)=>a-b)[239]};
fs.writeFileSync(`${dir}/movimento-v3.json`,JSON.stringify(out,null,2));console.log(out);
for(const s of spikes.filter(s=>!s.declared)){
 const a=spawnSync('ffmpeg',['-v','error','-y','-ss',String(s.t-.07),'-i',video,'-vf','fps=30,scale=270:-1,tile=5x1','-frames:v','1',`${dir}/salto-${s.frame}.png`],{encoding:'utf8'});if(a.status!==0)throw Error(a.stderr);
}
