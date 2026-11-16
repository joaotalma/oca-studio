// Cópia adaptada da capa aprovada do Dia 1, com o mascote e o saldo final do Dia 2.
import fs from 'node:fs';import path from 'node:path';import{fileURLToPath}from'node:url';import{spawnSync}from'node:child_process';
const aqui=path.dirname(fileURLToPath(import.meta.url));
const run=spawnSync(process.execPath,[path.join(aqui,'preparar.mjs'),'capa'],{encoding:'utf8'});if(run.status)throw new Error(run.stderr);
let s=fs.readFileSync(path.join(aqui,'../../dia01/capa.mjs'),'utf8');
s='// Origem: ../dia01/capa.mjs, capa aprovada em 12/11/2026; adaptação do Dia 2.\n'+s;
s=s.replace("path.join(aqui, 'serve.mjs')","path.join(aqui, '3d/serve.mjs')");
s=s.replace("serve(aqui)","serve(path.resolve(aqui,'../../../../render/demitido-gta6/dia02-hq-capa'))");
const a=s.indexOf(' const ator=await page.evaluate('),b=s.indexOf(' // Palmeira desenhada',a);
s=s.slice(0,a)+` const ator=await page.evaluate(()=>'<g transform="translate(130 120) scale(.78)">'+window.HQ.scene(6)+'</g>');\n`+s.slice(b);
s=s.replaceAll('dia01_capa.png','dia02_capa.png').replace('dia01/instagram/capa.png','dia02/instagram/capa.png').replace('DIA 1</div>','DIA 2</div>');
s=s.replace('ELE SÓ TEM <strong>R$ 3,20</strong>','SOBROU SÓ <strong>R$ 13,20</strong>');
s=s.replace('fs.copyFileSync(saida,entrega);','fs.mkdirSync(path.dirname(entrega),{recursive:true});fs.copyFileSync(saida,entrega);');
fs.writeFileSync(path.join(aqui,'../capa.mjs'),s);console.log('Capa preparada.');
