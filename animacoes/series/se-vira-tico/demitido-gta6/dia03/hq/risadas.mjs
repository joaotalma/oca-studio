// Risadas de plateia do Dia 3: recorta a faixa "Risadas de Fundo" enviada pelo João em 15/11/2026 (pack de edição dele) em trechos
// e posiciona cada um numa lacuna de fala. A fonte NÃO entra no Git (origem e licença não verificadas; ver PRODUCAO.md).
// Uso: node risadas.mjs   (env RISADAS_FONTE para outro caminho). Saídas em render/demitido-gta6/dia03-final/: risadas/*.wav e risadas.wav.
import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import{spawnSync}from'node:child_process';import{fileURLToPath}from'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)),out=path.resolve(here,'../../../../../render/demitido-gta6/dia03-final'),DUR=107.2;
const fonte=process.env.RISADAS_FONTE||path.join(os.homedir(),'Downloads','PACK DE EDIÇÂO_iGust','sonoros','Outros efeitos sonoros','chaves','Risadas de Fundo da Estúdios Gábia.mp3');
if(!fs.existsSync(fonte))throw new Error('Fonte das risadas não encontrada: '+fonte);
const run=(args)=>{const r=spawnSync('ffmpeg',['-y','-hide_banner','-nostats',...args],{encoding:'utf8',maxBuffer:1<<26});if(r.status)throw new Error(r.stderr);return r;};
// Rajadas de risada achadas na faixa (a "pausa" entre elas tem só ruído de plateia): início e fim em segundos da fonte.
const R={A:[10.3,12.0],B:[22.9,24.7],C:[27.7,29.0],D:[33.8,36.2],E:[36.3,37.9],F:[39.5,41.2],G:[44.1,46.0],H:[53.6,55.7]};
// Onde cada risada entra no episódio (tempo global), clipe e duração máxima (lacuna sem fala).
const SLOTS=[[33.15,'B',1.4],[41.45,'D',1.85],[52.4,'H',2.1],[96.9,'C',.55]];   // só 4 risadas: CRAAC, "se aposentando", gol contra e CLANK (pedido do João, 15/11/2026)
fs.mkdirSync(path.join(out,'risadas'),{recursive:true});
// 1) trechos individuais, com fade e pico normalizado a -9 dBFS
const clips=SLOTS.map(([t,k,max],i)=>{
  const [a,b]=R[k],d=Math.min(b-a,max),f=path.join(out,'risadas',`${String(i+1).padStart(2,'0')}_${k}.wav`);
  const fo=Math.min(.35,d*.4);
  run(['-v','error','-ss',String(a),'-t',String(d),'-i',fonte,'-af',`afade=t=in:d=0.04,afade=t=out:st=${(d-fo).toFixed(3)}:d=${fo.toFixed(3)}`,'-ar','48000','-ac','2',f]);
  const v=run(['-i',f,'-af','volumedetect','-f','null','-']).stderr.match(/max_volume: (-?[\d.]+) dB/);
  const ganho=-9-Number(v[1]);
  const g=f.replace('.wav','_n.wav');run(['-v','error','-i',f,'-af',`volume=${ganho.toFixed(2)}dB`,'-ar','48000','-ac','2',g]);fs.renameSync(g,f);
  return [f,t];
});
// 2) barramento de risadas, alinhado ao tempo global
const filt=clips.map(([,t],i)=>`[${i}:a]adelay=${Math.round(t*1000)}:all=1[a${i}]`).join(';')+';'+clips.map((_,i)=>`[a${i}]`).join('')+`amix=inputs=${clips.length}:normalize=0:duration=longest,apad=whole_dur=${DUR}[m]`;
run(['-v','error',...clips.flatMap(([f])=>['-i',f]),'-filter_complex',filt,'-map','[m]','-t',String(DUR),'-ar','48000','-ac','2',path.join(out,'risadas.wav')]);
console.log(clips.length,'risadas ->',path.join(out,'risadas.wav'));
