// Rodar da variante dia01/visual-hibrido. Recria somente a saída local de revisão.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../../../../..');
const source=path.dirname(here);
const nome=process.argv[2]||'dia01-hibrido';
if(!/^dia01-hibrido(?:-r\d+)?$/.test(nome))throw Error('Nome de revisão inválido');
const dest=path.join(root,'render/demitido-gta6',nome);
fs.mkdirSync(dest,{recursive:true});
for(const f of ['ep.js','falas.js','falas.md','tempos.js','roteiro.md'])fs.copyFileSync(path.join(source,f),path.join(dest,f));
for(const f of ['chars.js','cenarios.js'])fs.copyFileSync(path.join(root,'motor/personagem',f),path.join(dest,f));
for(const f of ['export.mjs','serve.mjs','springs.js'])fs.copyFileSync(path.join(root,'motor/take-one',f),path.join(dest,f));
fs.copyFileSync(path.join(here,'hybrid-visual.js'),path.join(dest,'hybrid-visual.js'));
fs.copyFileSync(path.join(root,'motor/personagem/expressao-hibrida.js'),path.join(dest,'expressao-hibrida.js'));
let m=fs.readFileSync(path.join(root,'motor/personagem/acabamento.js'),'utf8')+'\n'+fs.readFileSync(path.join(root,'motor/personagem/motor.js'),'utf8');
const changes=[
 ['    const nome = typeof pl.cena', '    s += HybridGTA.defs;\n    const nome = typeof pl.cena'],
 ['if (pl.fundo) s += pl.fundo(t);','if (pl.fundo) s += HybridGTA.background(pl.fundo(t),t,pl);'],
 ['s += atorSVG(a, t, pl, cy, z, indice);','s += HybridGTA.actor(HybridGTA.before(t,pl,()=>atorSVG(a, t, pl, cy, z, indice)),a,t,pl);'],
 ["    return s + '</svg>';","    return HybridGTA.finish(s,t,pl) + '</svg>';"],
];
for(const [a,b]of changes){if(!m.includes(a))throw Error('Motor mudou; revisar adaptação antes de preparar: '+a);m=m.replace(a,b);}
fs.writeFileSync(path.join(dest,'motor.js'),m);
let html=fs.readFileSync(path.join(source,'film.html'),'utf8');
if(!html.includes('<script src="motor.js">'))throw Error('film.html mudou');
html=html.replace('<script src="motor.js">','<script src="expressao-hibrida.js"></script>\n<script src="hybrid-visual.js"></script>\n<script src="motor.js">');
fs.writeFileSync(path.join(dest,'film.html'),html);
const sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
fs.writeFileSync(path.join(dest,'fontes-preservadas.json'),JSON.stringify({origem:path.relative(root,source),preservados:Object.fromEntries(['ep.js','falas.js','falas.md','tempos.js','roteiro.md'].map(f=>[f,sha(path.join(source,f))]))},null,2));
console.log(dest);
