import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {finalizar} from '../finalizar.mjs';
import {fileURLToPath} from 'node:url';
import {hashArquivo,hashFonte,validarRascunho,validarFinal} from '../qa/registro.mjs';
function fixture(t){
 const p=fs.mkdtempSync(path.join(os.tmpdir(),'oca-fluxo-'));t.after(()=>fs.rmSync(p,{recursive:true,force:true}));
 fs.writeFileSync(path.join(p,'film.html'),'canvas original');
 const dir=path.join(p,'qa-resultados');fs.mkdirSync(dir);
 const video=path.join(dir,'rascunho.mp4');fs.writeFileSync(video,'mp4 representativo');
 const audio=path.join(p,'master.wav');fs.writeFileSync(audio,'audio original');
 const politica={faixa:[30,90]};
 const q={schema:1,modo:'rascunho',aprovado:true,mudo:false,temAudio:true,gateCompleto:true,fonte:hashFonte(p),video,videoHash:hashArquivo(video),audioOrigemHash:hashArquivo(audio),politica,dimensoes:[540,960],fps:15};
 const rel=path.join(dir,'qa-rascunho.json');fs.writeFileSync(rel,JSON.stringify(q));
 return {p,video,audio,politica,q,rel};
}
test('resultado gerado não invalida inputs; cena e asset alterados invalidam',t=>{
 const f=fixture(t);fs.writeFileSync(path.join(f.p,'qa-resultados','final.mp4'),'novo');
 assert.doesNotThrow(()=>validarRascunho(f.rel,f.p,f.audio,f.politica));
 fs.writeFileSync(path.join(f.p,'film.html'),'canvas corrigido');
 assert.throws(()=>validarRascunho(f.rel,f.p,f.audio,f.politica),/Fonte mudou/);
});
test('mudar áudio, MP4 ou política impede reuso',t=>{
 const f=fixture(t);
 assert.throws(()=>validarRascunho(f.rel,f.p,f.audio,{faixa:[1,200]}),/Regras/);
 fs.writeFileSync(f.audio,'troca de voz');assert.throws(()=>validarRascunho(f.rel,f.p,f.audio,f.politica),/Áudio/);
 fs.writeFileSync(f.video,'outro mp4');assert.throws(()=>validarRascunho(f.rel,f.p,f.audio,f.politica),/rascunho mudou/);
});
test('rascunho mudo ou reprovado não habilita final',t=>{
 const f=fixture(t);
 for(const patch of [{mudo:true},{aprovado:false},{temAudio:false},{gateCompleto:false}]){
  fs.writeFileSync(f.rel,JSON.stringify({...f.q,...patch}));
  assert.throws(()=>validarRascunho(f.rel,f.p,f.audio,f.politica));
 }
});
test('finalização rejeita rascunho, QA reprovado e MP4 alterado',t=>{
 const f=fixture(t);
 assert.throws(()=>validarFinal(f.q,f.p,f.video));
 const final={...f.q,modo:'final-completo',dimensoes:[1080,1920],fps:30};
 assert.equal(validarFinal(final,f.p,f.video),true);
 assert.throws(()=>validarFinal({...final,aprovado:false},f.p,f.video));
 fs.appendFileSync(f.video,'alterado');assert.throws(()=>validarFinal(final,f.p,f.video),/mudou/);
});
test('vídeo usado como asset também participa do hash',t=>{
 const f=fixture(t),assets=path.join(f.p,'assets');fs.mkdirSync(assets);
 const asset=path.join(assets,'fundo.mp4');fs.writeFileSync(asset,'antes');const h=hashFonte(f.p);
 fs.writeFileSync(asset,'depois');assert.notEqual(hashFonte(f.p),h);
});

function entregaTeste(t,f){
 const raiz=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../entregas');
 const serie=fs.mkdtempSync(path.join(raiz,'_teste-fluxo-'));t.after(()=>fs.rmSync(serie,{recursive:true,force:true}));
 const entrega=path.join(serie,'ep01');fs.mkdirSync(path.join(entrega,'instagram'),{recursive:true});
 fs.writeFileSync(path.join(entrega,'instagram','capa.png'),'capa');
 fs.writeFileSync(path.join(entrega,'instagram','postagem.md'),'postagem');
 const q={...f.q,modo:'final-completo',dimensoes:[1080,1920],fps:30};
 const qa=path.join(f.p,'qa-resultados','qa-final.json');fs.writeFileSync(qa,JSON.stringify(q));
 const revisao=path.join(f.p,'qa-resultados','revisao-final.json');
 const dados={fonte:q.fonte,videoHash:q.videoHash,visual:true,conteudoDireitos:true,bloqueios:[],responsavel:'Teste automatizado (fixture)'};
 return {entrega,qa,revisao,dados};
}
test('finalização automática grava origem do aceite e não inventa que João assistiu',t=>{
 const f=fixture(t),e=entregaTeste(t,f);fs.writeFileSync(e.revisao,JSON.stringify(e.dados));
 fs.writeFileSync(path.join(f.p,'roteiro.md'),'# Teste\n\n**Estado:** aguardando aprovação.\n');
 const registro=finalizar({pasta:f.p,video:f.video,qa:e.qa,entrega:e.entrega});
 assert.match(fs.readFileSync(path.join(f.p,'roteiro.md'),'utf8'),/vídeo final aprovado automaticamente/);
 assert.equal(registro.estado,'aprovado');assert.equal(registro.modo,'automatico_autorizado');assert.equal(registro.assistidoPeloJoao,false);
 assert.equal(registro.videoHash,hashArquivo(path.join(e.entrega,'video.mp4')));
 assert.ok(fs.existsSync(path.join(e.entrega,'STATUS.md')));
});
test('falta de revisão, bloqueio editorial ou capa impede finalizar',t=>{
 const f=fixture(t),e=entregaTeste(t,f),go=()=>finalizar({pasta:f.p,video:f.video,qa:e.qa,entrega:e.entrega});
 assert.throws(go,/revisão artística/);
 fs.writeFileSync(e.revisao,JSON.stringify({...e.dados,bloqueios:['braço quebrado']}));assert.throws(go,/bloqueios/);
 fs.writeFileSync(e.revisao,JSON.stringify(e.dados));fs.unlinkSync(path.join(e.entrega,'instagram','capa.png'));assert.throws(go,/capa/);
});
test('áudio ou rascunho alterado depois do QA final leve bloqueia entrega',t=>{
 const f=fixture(t),q={...f.q,modo:'final-leve',dimensoes:[1080,1920],fps:30,rascunho:f.rel,audioOrigem:f.audio};
 assert.equal(validarFinal(q,f.p,f.video),true);
 fs.writeFileSync(f.audio,'outra mixagem');assert.throws(()=>validarFinal(q,f.p,f.video),/Áudio/);
});

test('asset de vídeo na raiz é incluído quando referenciado pelo filme',t=>{
 const f=fixture(t),v=path.join(f.p,'clipe.mp4');fs.writeFileSync(v,'original');
 fs.appendFileSync(path.join(f.p,'film.html'),'<video src="clipe.mp4"></video>');const h=hashFonte(f.p);
 fs.writeFileSync(v,'alterado');assert.notEqual(hashFonte(f.p),h);
});
