import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {avaliarEditorial,relatorioMarkdown} from '../roteiro/rubrica-roteiros.mjs';
import {compilar,gerar} from '../roteiro/gerar-roteiro.mjs';

function contrato(){return {promessa:'Tico tenta esconder da Lua que perdeu a corrida.',contextoNovo:'Lua espera na calçada; Tico chega com o aplicativo cancelado.',perguntaLocal:'Tico vai contar por que ficou para trás?',payoffLocal:'Lua percebe o cancelamento e chama outro motorista.',escalada:['Tico esconde a tela cancelada quando Lua se aproxima.','O telefone anuncia a corrida cancelada na frente dela.'],continuidade:{entrada:'Lua ainda espera a carona combinada.',saida:'Lua parte com outro motorista e Tico fica com o bilhete.'},participacao:{tipo:'retrospectiva',pergunta:'Você teria contado antes ou esperado a pergunta dela?'},publicadoAnteriormente:true,hipoteseTeste:'Comparar uma abertura pela consequência, mantendo o restante da edição estável e a mesma idade de coleta.'};}
function estrutura(){return {slug:'teste-editorial',titulo:'Teste',pergunta:'Qual consequência?',mecanismo:'tentativa e consequência',pista:'tela apagada',virada:'o aviso toca',resposta:'ela percebe',fontes:{},falas:Array.from({length:6},(_,i)=>({texto:i===0?'Sua corrida sumiu.':'Ele tenta explicar e ela olha a tela.',camada:'seria',funcao:i===0?'gancho':'desenvolvimento',acao:'O telefone mostra o cancelamento.',revela:'A tentativa muda a situação.',causa:'A tela contradiz a desculpa.'}))};}

test('reconstrução publicada não pode declarar voto futuro sem revisão',()=>{
  const editorial=contrato();editorial.participacao.tipo='futura';
  const r=avaliarEditorial({editorial});
  assert.equal(r.estado,'revisar-campos');assert.ok(r.avisos.some(a=>a.codigo==='FUTURA_EM_PUBLICADO'));
  assert.ok(!Object.hasOwn(r,'nota'));assert.ok(!Object.hasOwn(r,'score'));
});
test('retrospectiva nos publicados e participação futura no episódio novo são distintas',()=>{
  assert.deepEqual(avaliarEditorial({editorial:contrato()}).avisos,[]);
  const ep6=contrato();ep6.publicadoAnteriormente=false;ep6.participacao.tipo='futura';
  const r=avaliarEditorial({editorial:ep6});assert.equal(r.estado,'campos-presentes');assert.deepEqual(r.avisos,[]);
});
test('reabertura exige declaração explícita e motivo, sem inferir pelo CTA',()=>{
  const editorial=contrato();editorial.participacao.tipo='futura';editorial.participacao.reabertura={confirmada:true};
  assert.ok(avaliarEditorial({editorial}).avisos.some(a=>a.codigo==='REABERTURA_INCOMPLETA'));
  editorial.participacao.reabertura.motivo='Nova votação em edição alternativa, separada do cânone já publicado.';
  assert.ok(!avaliarEditorial({editorial}).avisos.some(a=>a.codigo==='FUTURA_EM_PUBLICADO'));
});
test('contrato incompleto e rótulos de escalada geram avisos localizados',()=>{
  const editorial=contrato();delete editorial.contextoNovo;delete editorial.payoffLocal;editorial.continuidade={entrada:''};editorial.escalada=['Aumenta a tensão','Algo acontece'];
  const r=avaliarEditorial({editorial});
  for(const campo of ['editorial.contextoNovo','editorial.payoffLocal','editorial.continuidade.entrada','editorial.continuidade.saida'])assert.ok(r.avisos.some(a=>a.campo===campo));
  assert.equal(r.avisos.filter(a=>a.codigo==='ESCALADA_GENERICA').length,2);
  editorial.escalada=[];assert.ok(avaliarEditorial({editorial}).avisos.some(a=>a.codigo==='ESCALADA_AUSENTE'));
  assert.match(relatorioMarkdown(r),/não comprovam compreensão/);
});
test('metadados editoriais são opcionais e não alteram saída legada',()=>{
  const e=estrutura(),base=compilar(e),comMetadados=compilar({...e,plataformas:['youtube-shorts','tiktok'],formato:'narracao',observacao:'rascunho'});
  assert.deepEqual(comMetadados,base);assert.ok(!Object.hasOwn(base,'auditoriaEditorial'));
  const auditado=compilar({...e,editorial:contrato()});assert.deepEqual(auditado.falas,base.falas);assert.deepEqual(auditado.direcao,base.direcao);assert.equal(auditado.auditoriaEditorial.estado,'campos-presentes');
  assert.doesNotThrow(()=>compilar({...e,editorial:null}));
});
test('auditoria não substitui a validação de fontes factuais do compilador',()=>{
  const e=estrutura();e.editorial=contrato();e.falas[0].camada='foi';e.falas[0].fonte='nao-existe';
  assert.throws(()=>compilar(e),/fato sem fonte conferida/);
});
test('CLI emite JSON/Markdown e não bloqueia conteúdo por aviso editorial',()=>{
  fs.mkdirSync(path.resolve('.tmp'),{recursive:true});const dir=fs.mkdtempSync(path.resolve('.tmp/rubrica-teste-'));
  const file=path.join(dir,'estrutura.json'),json=path.join(dir,'auditoria.json'),md=path.join(dir,'auditoria.md');
  const e=estrutura();e.editorial=contrato();e.editorial.participacao.tipo='futura';fs.writeFileSync(file,JSON.stringify(e));
  const run=spawnSync(process.execPath,[path.resolve('motor/roteiro/rubrica-roteiros.mjs'),file,'--json','--saida-json',json,'--saida-md',md],{encoding:'utf8'});
  assert.equal(run.status,0,run.stderr);const r=JSON.parse(run.stdout);assert.ok(r.avisos.some(a=>a.codigo==='FUTURA_EM_PUBLICADO'));
  assert.deepEqual(JSON.parse(fs.readFileSync(json,'utf8')),r);assert.match(fs.readFileSync(md,'utf8'),/FUTURA_EM_PUBLICADO/);
  const produzido=gerar(file);assert.equal(produzido.auditoriaEditorial.estado,'revisar-campos');assert.ok(fs.existsSync(path.join(dir,'auditoria-editorial.json')));assert.ok(fs.existsSync(path.join(dir,'falas.js')));
});
