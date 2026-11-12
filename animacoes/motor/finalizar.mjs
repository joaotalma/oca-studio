#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { hashArquivo, validarFinal } from './qa/registro.mjs';
export function finalizar({pasta,video,qa,entrega,origem}) {
  const q = JSON.parse(fs.readFileSync(qa,'utf8'));
  validarFinal(q,pasta,video);
  const revisaoPath=path.join(pasta,'qa-resultados','revisao-final.json');
  if(!fs.existsSync(revisaoPath)) throw new Error('Registrar revisão artística/editorial em qa-resultados/revisao-final.json antes de finalizar; não precisa novo aceite do João.');
  const revisao=JSON.parse(fs.readFileSync(revisaoPath,'utf8'));
  if(revisao.fonte!==q.fonte || revisao.videoHash!==q.videoHash || revisao.visual!==true || revisao.conteudoDireitos!==true || !Array.isArray(revisao.bloqueios) || revisao.bloqueios.length || !revisao.responsavel)
    throw new Error('Revisão pendente, com bloqueios ou de outra versão.');
  const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../entregas');
  entrega=path.resolve(entrega);
  const rel=path.relative(raiz,entrega);
  if(!rel || rel.startsWith('..') || path.isAbsolute(rel) || rel.split(path.sep).length!==2)
    throw new Error('Entrega deve ser entregas/<serie>/<episodio>.');
  if(fs.statSync(video).size>=100_000_000) throw new Error('Final acima do limite de 100 MB.');
  const redes=['instagram','tiktok','youtube'].filter(rede=>fs.existsSync(path.join(entrega,rede,'postagem.md')) && fs.existsSync(path.join(entrega,rede,'capa.png')));
  if(!redes.length) throw new Error('Prepare capa.png e postagem.md em pelo menos uma rede antes de finalizar.');
  const origemAbs=path.resolve(origem||pasta);
  const baseAnimacoes=path.dirname(raiz), relOrigem=path.relative(baseAnimacoes,origemAbs);
  if(origem && (relOrigem.startsWith('..') || path.isAbsolute(relOrigem))) throw new Error('Origem do roteiro fora de animacoes/.');
  const destino=path.join(entrega,'video.mp4');
  if(path.resolve(video)!==destino) fs.copyFileSync(video,destino);
  const registro={schema:1,estado:'aprovado',modo:'automatico_autorizado',autorizadoPor:'João',
    autorizacao:'Pedido de aprovação automática ao finalizar, 2026-11-12',quando:new Date().toISOString(),
    assistidoPeloJoao:false,video:'video.mp4',videoHash:hashArquivo(destino),qa:q,revisao,
    publicacao:'manual_pelo_Joao',redes,
    limite:'Aprovação delegada após QA técnico; não afirma que João assistiu nem que houve julgamento artístico automático.'};
  fs.writeFileSync(path.join(entrega,'aprovacao.json'),JSON.stringify(registro,null,2)+'\n');
  fs.writeFileSync(path.join(entrega,'STATUS.md'),'# Entrega aprovada\n\nAprovação automática autorizada pelo João em 12/11/2026, após QA técnico.\n\nRegistro e hash do vídeo: `aprovacao.json`. Publicação manual pelo João.\n');
  const roteiro=path.join(origemAbs,'roteiro.md');
  if(fs.existsSync(roteiro)) {
    let texto=fs.readFileSync(roteiro,'utf8');
    texto=texto.replace(/^(\*\*(?:Estado|Status):\*\*).*$/m,'$1 vídeo final aprovado automaticamente, por autorização do João em 12/11/2026.');
    const marcador='<!-- aprovacao-final-automatica -->';
    const bloco=`${marcador}\n## Aprovação final\n\nVídeo final aprovado pelo fluxo autorizado pelo João em 12/11/2026. Registro: ${path.join(entrega,'aprovacao.json')}. SHA-256: ${registro.videoHash}. Publicação manual pelo João.\n<!-- /aprovacao-final-automatica -->`;
    texto=texto.includes(marcador)?texto.replace(/<!-- aprovacao-final-automatica -->[\s\S]*?<!-- \/aprovacao-final-automatica -->/,bloco):texto.trimEnd()+'\n\n'+bloco+'\n';
    fs.writeFileSync(roteiro,texto);
  }
  return registro;
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const [pasta,video,qa,entrega,origem]=process.argv.slice(2);
  try { if(!entrega) throw new Error('uso: node motor/finalizar.mjs <filme preparado> <video> <qa-final.json> <entregas/serie/ep>'); finalizar({pasta,video,qa,entrega,origem}); console.log('Entrega aprovada automaticamente. João publica.'); }
  catch(e){console.error(e.message);process.exitCode=1;}
}
