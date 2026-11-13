import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {createHash} from 'node:crypto';import {gzipSync} from 'node:zlib';import {fileURLToPath} from 'node:url';
import {restaurar} from '../audio/restaurar-fontes.mjs';import {deduplicarCamadas} from '../cenas/assets.mjs';
const hash=b=>createHash('sha256').update(b).digest('hex');
function temp(t){const p=fs.mkdtempSync(path.join(os.tmpdir(),'oca-organizacao-'));t.after(()=>fs.rmSync(p,{recursive:true,force:true}));return p;}
test('áudio comprimido é restaurado byte a byte, preservando nomes e subpastas',t=>{
 const p=temp(t),wav=Buffer.from('WAV original, sem reconversão'),mp3=Buffer.from('MP3 original');
 fs.writeFileSync(path.join(p,'voz.wav.gz'),gzipSync(wav));fs.writeFileSync(path.join(p,'voz.mp3'),mp3);
 const cat={padrao:'final',arquivos:{[hash(wav)]:{arquivo:'voz.wav.gz',compressao:'gzip'},[hash(mp3)]:{arquivo:'voz.mp3',compressao:'nenhuma'}},pacotes:{final:[{caminho:'audio/master.wav',sha256:hash(wav)},{caminho:'audio/01.mp3',sha256:hash(mp3)}]}};
 const f=path.join(p,'fontes.json');fs.writeFileSync(f,JSON.stringify(cat));const out=path.join(p,'saida');
 assert.equal(restaurar(f,out),2);assert.deepEqual(fs.readFileSync(path.join(out,'audio/master.wav')),wav);assert.deepEqual(fs.readFileSync(path.join(out,'audio/01.mp3')),mp3);
 cat.pacotes.final[0].caminho='../fora.wav';fs.writeFileSync(f,JSON.stringify(cat));assert.throws(()=>restaurar(f,out),/fora do destino/);
});
test('restauração não sobrescreve uma mixagem diferente',t=>{
 const p=temp(t),b=Buffer.from('voz');fs.writeFileSync(path.join(p,'voz.mp3'),b);
 const cat={padrao:'f',arquivos:{[hash(b)]:{arquivo:'voz.mp3',compressao:'nenhuma'}},pacotes:{f:[{caminho:'voz.mp3',sha256:hash(b)}]}};
 const f=path.join(p,'fontes.json');fs.writeFileSync(f,JSON.stringify(cat));const out=path.join(p,'saida');fs.mkdirSync(out);fs.writeFileSync(path.join(out,'voz.mp3'),'edição diferente');assert.throws(()=>restaurar(f,out),/diferente já existe/);
});
test('deduplicar camadas mantém identidades dos planos, composição e bytes',t=>{
 const p=temp(t);fs.mkdirSync(path.join(p,'assets'));for(const n of ['a-fundo.png','b-fundo.png'])fs.writeFileSync(path.join(p,'assets',n),'pixels idênticos');fs.writeFileSync(path.join(p,'assets','c-voce.png'),'outros pixels');
 const c={'assets/plano-a.png':{fundo:'assets/a-fundo.png',pivo:[540,900]},'assets/plano-b.png':{fundo:'assets/b-fundo.png',voce:'assets/c-voce.png',chao:true}};
 const keys=Object.keys(c);const res=deduplicarCamadas(p,c);assert.equal(res.arquivos,1);assert.deepEqual(Object.keys(c),keys);assert.equal(c[keys[0]].fundo,c[keys[1]].fundo);assert.deepEqual(c[keys[0]].pivo,[540,900]);assert.equal(c[keys[1]].chao,true);assert.equal(fs.readFileSync(path.join(p,c[keys[1]].fundo),'utf8'),'pixels idênticos');assert.ok(fs.existsSync(path.join(p,'assets/c-voce.png')));
 assert.equal(deduplicarCamadas(p,c).arquivos,0);
});
test('atalhos dos dois agentes são iguais e apontam para fontes únicas',()=>{
 const raiz=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
 for(const base of [raiz,path.join(raiz,'series/se-vira-tico')]){
  const dir=path.join(base,'.agents/skills');
  for(const e of fs.readdirSync(dir,{withFileTypes:true}).filter(e=>e.isDirectory())){
   const rel=path.join('skills',e.name,'SKILL.md');const a=fs.readFileSync(path.join(base,'.agents',rel),'utf8'),b=fs.readFileSync(path.join(base,'.claude',rel),'utf8');assert.equal(a,b);assert.match(a,/gerada/i);assert.ok(a.length<1800);
  }
 }
});
