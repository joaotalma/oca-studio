#!/usr/bin/env node
// Filme já preparado e áudio já mixado: nunca gera voz, roteiro ou imagens.
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { hashFonte } from './qa/registro.mjs';
import { finalizar } from './finalizar.mjs';
const motor=path.dirname(fileURLToPath(import.meta.url));
const args=process.argv.slice(2), pasta=path.resolve(args.shift()||'.');
const op={}, qa=[];
for(let i=0;i<args.length;i++) {
  if(['--audio','--saida','--entrega','--origem'].includes(args[i])) op[args[i]]=args[++i];
  else if(args[i]==='--rascunho') op.rascunho=true;
  else if(['--sem-duracao','--sem-texto','--mudo'].includes(args[i])) qa.push(args[i]);
  else if(['--duracao','--leitura','--checklist'].includes(args[i])) { qa.push(args[i],args[++i]); }
  else throw new Error(`Opção desconhecida: ${args[i]}`);
}
const audio=op['--audio']?path.resolve(op['--audio']):null;
if(!audio && !op.rascunho) throw new Error('Sem áudio: use --rascunho; render mudo nunca vira final aprovado.');
if(audio && !fs.existsSync(audio)) throw new Error('Áudio não encontrado.');
if(!fs.existsSync(path.join(pasta,'film.html'))) throw new Error('Prepare film.html antes de produzir.');
const dir=path.join(pasta,'qa-resultados');fs.mkdirSync(dir,{recursive:true});
const run=(cmd,argv,env={})=>new Promise((resolve,reject)=>{
  const p=spawn(cmd,argv,{cwd:pasta,env:{...process.env,...env},stdio:'inherit'});
  p.on('error',reject);p.on('close',code=>code===0?resolve():reject(new Error(`${path.basename(cmd)} falhou (${code}). Produção interrompida.`)));
});
async function render(w,h,fps,nome) {
  const fonteAntes=hashFonte(pasta);
  const imagem=path.join(dir,`${nome}-imagem.mp4`),video=path.join(dir,`${nome}.mp4`);
  await run(process.execPath,[path.join(pasta,'export.mjs'),String(fps),imagem],{W:String(w),H:String(h),SLOW:'1',START:'0',END:'',SUB:'1',ALPHA:'',FILM:'film.html'});
  if(audio) await run('ffmpeg',['-v','error','-y','-i',imagem,'-i',audio,'-c:v','copy','-c:a','aac','-b:a','192k','-ar','48000','-shortest','-movflags','+faststart',video]);
  else fs.copyFileSync(imagem,video);
  if(fonteAntes!==hashFonte(pasta)) throw new Error('Fonte mudou durante o render. Volte ao rascunho.');
  return video;
}
try {
  const base=[...qa,...(!audio?['--mudo']:[]),...(audio?['--audio-origem',audio]:[])];
  const draft=await render(540,960,15,'rascunho'), rd=path.join(dir,'qa-rascunho.json');
  await run(process.execPath,[path.join(motor,'qa/qa-video.mjs'),pasta,draft,'--rascunho',...base,'--relatorio',rd]);
  if(op.rascunho) {
    if(op['--saida']) fs.copyFileSync(draft,path.resolve(op['--saida']));
    console.log(`Rascunho aprovado nos itens medidos: ${draft}`);
  } else {
    // Só se chega ao render caro depois do gate completo passar no rascunho.
    const final=await render(1080,1920,30,'final'), rf=path.join(dir,'qa-final.json');
    await run(process.execPath,[path.join(motor,'qa/qa-video.mjs'),pasta,final,...base,'--final-leve','--qa-rascunho',rd,'--relatorio',rf]);
    if(op['--saida']) fs.copyFileSync(final,path.resolve(op['--saida']));
    if(op['--entrega']) finalizar({pasta,video:final,qa:rf,entrega:op['--entrega'],origem:op['--origem']});
    console.log(op['--entrega']?'Entrega finalizada e aprovada automaticamente.':`Master pronto: ${final}. Para finalizar, informe --entrega com capa e postagem prontas.`);
  }
} catch(e) { console.error(e.message);process.exitCode=1; }
