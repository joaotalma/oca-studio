import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const pacote=path.dirname(fileURLToPath(import.meta.url));
const raiz=path.resolve(pacote,'..');
const animacoes=path.join(raiz,'animacoes');
const manifesto=JSON.parse(fs.readFileSync(path.join(pacote,'manifesto.json'),'utf8'));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
for(const f of [manifesto.video,manifesto.comparativo]) {
  if(hash(path.join(pacote,f.arquivo))!==f.sha256)throw Error('Arquivo diferente do pacote verificado: '+f.arquivo);
}
const source=path.join(raiz,manifesto.fontes);
for(const f of ['preparar.mjs','direcao-hq.js','film.html'])if(!fs.existsSync(path.join(source,f)))throw Error('Fonte ausente: '+f);
console.log('Vídeo, comparativo e fontes do pacote conferidos.');
if(!process.argv.includes('--render')) {
  console.log('Para refazer os 15 segundos: node teste_visual/reproduzir.mjs --render');
  console.log('Requer npm ci em animacoes/, Chrome e FFmpeg. Não gera voz nem usa créditos.');
  process.exit(0);
}
const run=(cmd,args,cwd,env={})=>new Promise((resolve,reject)=>{
  const p=spawn(cmd,args,{cwd,env:{...process.env,...env},stdio:'inherit'});
  p.on('error',reject);p.on('close',n=>n===0?resolve():reject(Error(path.basename(cmd)+' terminou com código '+n)));
});
const dest=path.join(animacoes,'render/demitido-gta6/estudo-hq-v10-15s-v2');
const audio=path.join(animacoes,'entregas/demitido-antes-do-gta/dia01-hibrido-r2/video.mp4');
if(!fs.existsSync(audio))throw Error('Entrega do Dia 1 ausente: '+audio);
await run(process.execPath,[path.join(source,'preparar.mjs')],raiz);
await run(process.execPath,[path.join(dest,'export.mjs'),'30','reproducao-muda.mp4'],dest,{W:'1080',H:'1920',PARTES:'1',START:'0',END:'15',SUB:'1',SLOW:'1'});
await run('ffmpeg',['-v','error','-y','-i','reproducao-muda.mp4','-i',audio,'-map','0:v:0','-map','1:a:0','-t','15','-c','copy','-movflags','+faststart','reproducao.mp4'],dest);
await run(process.execPath,[path.join(animacoes,'motor/qa/qa-video.mjs'),dest,path.join(dest,'reproducao.mp4'),'--duracao','14.9,15.1','--sem-texto','--audio-origem',audio,'--relatorio',path.join(dest,'qa-resultados/qa-reproducao.json')],raiz);
console.log('Reprodução verificada: '+path.join(dest,'reproducao.mp4'));
console.log('O MP4 preservado em teste_visual/video.mp4 não foi substituído.');
