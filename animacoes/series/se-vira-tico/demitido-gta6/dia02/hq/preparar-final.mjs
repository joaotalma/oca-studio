// Integra as duas sequências HQ e a luta aprovada em um filme autocontido.
// Origem HQ: Dia 1/estudos/hq-v10-15s-v2, copiada por preparar.mjs.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../../../../..');
const out=path.join(root,'render/demitido-gta6/dia02-final');
fs.mkdirSync(out,{recursive:true});
for(const [name,ids] of [['parte1','1,2,5,6'],['parte2','9,10,11,12,17,13,14,15,16,3,4,18']]){
 const run=spawnSync(process.execPath,[path.join(here,'preparar.mjs'),name],{env:{...process.env,FALAS:ids},encoding:'utf8'});
 if(run.status)throw new Error(run.stderr); console.log(run.stdout.trim());
 const src=path.join(root,`render/demitido-gta6/dia02-hq-${name}`),dest=path.join(out,name);
 fs.mkdirSync(dest,{recursive:true});
 for(const f of ['film.html','hq-dia02.js','dados.js','chars.js'])fs.copyFileSync(path.join(src,f),path.join(dest,f));
}
fs.mkdirSync(path.join(out,'luta'),{recursive:true});
fs.cpSync(path.join(here,'../3d/vendor'),path.join(out,'vendor'),{recursive:true});
let luta=fs.readFileSync(path.join(here,'../3d/luta/film.html'),'utf8');
luta=luta.replace('if (f) { const larg','if (f && !window.LEGENDAS_EXTERNAS) { const larg');
luta=luta.replace("faixa(110, 1500, 860, 120)","faixa(100, 1580, 880, 150)").replace("540, 1540, 44","540, 1642, 56").replaceAll('roundRect(150, 1580,','roundRect(150, 1680,');
fs.writeFileSync(path.join(out,'luta/film.html'),luta);
const {FALAS,MARCOS}=vm.runInNewContext(fs.readFileSync(path.join(here,'../falas.js'),'utf8')+';({FALAS,MARCOS})');
const audio=path.resolve(here,'../../../audio/demitido-gta6-dia02/alinhamento');
const falas=FALAS.map(f=>({...f,palavras:JSON.parse(fs.readFileSync(path.join(audio,`${f.n}.json`),'utf8')).palavras.map(p=>[p.palavra,+(f.ini+p.ini).toFixed(3),+(f.ini+p.fim).toFixed(3)])}));
const legendas=[];
for(const f of falas){let g=[];const flush=()=>{if(g.length)legendas.push({ini:g[0][1]-.025,fim:g.at(-1)[2]+.10,texto:g.map(p=>p[0]).join(' ')});g=[];};
 for(const p of f.palavras){if(g.length&&(g.length>=3||g.map(p=>p[0]).join(' ').length+p[0].length>23))flush();g.push(p);if(/[.!?:]$/.test(p[0]))flush();}flush();}
for(let i=0;i<legendas.length-1;i++)legendas[i].fim=Math.min(legendas[i].fim,legendas[i+1].ini);
fs.writeFileSync(path.join(out,'timeline.json'),JSON.stringify({duracao:117.8,falas,marcos:MARCOS,legendas},null,2));
fs.writeFileSync(path.join(out,'dados.js'),`const DADOS=${JSON.stringify({legendas,falas:FALAS.map(f=>({ini:f.ini-.03,fim:f.fim+.12}))})};\n`);
// QA legado lê só FALAS como JSON; MARCOS permanece em timeline.json.
fs.writeFileSync(path.join(out,'falas.js'),`const FALAS = ${JSON.stringify(FALAS,null,2)};\n`);
for(const f of ['film-final.html','controle-final.js'])fs.copyFileSync(path.join(here,f),path.join(out,f==='film-final.html'?'film.html':'controle-final.js'));
for(const f of ['export.mjs','serve.mjs','still.mjs'])fs.copyFileSync(path.join(here,'../3d',f),path.join(out,f));
console.log(out);
