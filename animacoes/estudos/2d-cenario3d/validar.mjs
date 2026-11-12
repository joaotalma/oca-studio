import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
const dir='render/exemplo-2d-3d',video=`${dir}/exemplo-2d-3d-v3.mp4`;
const qa=spawnSync(process.execPath,['motor/qa/qa-video.mjs',dir,video,'--mudo','--sem-duracao'],{encoding:'utf8',maxBuffer:64*1024*1024});
const log=(qa.stdout||'')+(qa.stderr||'');fs.writeFileSync(`${dir}/qa-automatico-v3.txt`,log);console.log(log);
const probe=spawnSync('ffprobe',['-v','error','-show_entries','stream=codec_type,width,height,r_frame_rate,nb_frames:format=duration,size','-of','json',video],{encoding:'utf8'});
fs.writeFileSync(`${dir}/arquivo-v3.json`,probe.stdout||'{}');console.log(probe.stdout);
for(const [name,args] of [
 ['folha',['-i',video,'-vf','fps=1,scale=270:-1,tile=4x4','-frames:v','1',`${dir}/folha-v3.png`]],
 ['transicao',['-ss','7.8','-i',video,'-vf','fps=10,scale=270:-1,tile=4x1','-frames:v','1',`${dir}/transicao-v3.png`]],
 ['poster',['-ss','12','-i',video,'-frames:v','1',`${dir}/poster-v3.png`]]
]){
 const result=spawnSync('ffmpeg',['-v','error','-y',...args],{encoding:'utf8'});if(result.status!==0)throw Error(`${name}: ${result.stderr}`);
}
process.exitCode=qa.status||0;
