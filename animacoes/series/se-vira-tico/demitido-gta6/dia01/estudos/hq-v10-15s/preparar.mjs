import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {fileURLToPath}from'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));const root=path.resolve(here,'../../../../../..');const source=path.resolve(here,'../..');const dest=path.join(root,'render/demitido-gta6/estudo-hq-v10-15s');fs.mkdirSync(dest,{recursive:true});
for(const f of ['film.html','direcao-hq.js'])fs.copyFileSync(path.join(here,f),path.join(dest,f));
fs.copyFileSync(path.join(root,'motor/personagem/chars.js'),path.join(dest,'chars.js'));
for(const f of ['falas.js','tempos.js'])fs.copyFileSync(path.join(source,f),path.join(dest,f));
for(const f of ['export.mjs','serve.mjs'])fs.copyFileSync(path.join(root,'motor/take-one',f),path.join(dest,f));
const ep=fs.readFileSync(path.join(source,'ep.js'),'utf8');const a=ep.indexOf('function controle('),b=ep.indexOf('function maosNoControle(');if(a<0||b<a)throw Error('Revisar helper do controle');fs.writeFileSync(path.join(dest,'controle.js'),ep.slice(a,b));
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');fs.writeFileSync(path.join(dest,'entradas.json'),JSON.stringify({duracao:15,origem:path.relative(root,source),fontes:Object.fromEntries(['falas.js','tempos.js','ep.js'].map(f=>[f,sha(path.join(source,f))])),audio:'entregas/demitido-antes-do-gta/dia01-hibrido-r2/video.mp4',audioHash:sha(path.join(root,'entregas/demitido-antes-do-gta/dia01-hibrido-r2/video.mp4'))},null,2));console.log(dest);
