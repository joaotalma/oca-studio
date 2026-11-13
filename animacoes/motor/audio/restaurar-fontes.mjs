#!/usr/bin/env node
import fs from 'node:fs';import path from 'node:path';import {gunzipSync} from 'node:zlib';import {createHash} from 'node:crypto';import {fileURLToPath} from 'node:url';
export function restaurar(catalogo,destino,pacote){
 const cat=JSON.parse(fs.readFileSync(catalogo,'utf8'));const itens=cat.pacotes[pacote||cat.padrao];
 if(!itens)throw new Error('Pacote inexistente no catálogo');
 const base=path.dirname(path.resolve(catalogo)),out=path.resolve(destino);
 const fila=itens.map(item=>{
  const target=path.resolve(out,item.caminho),rel=path.relative(out,target);
  if(!rel||rel.startsWith('..')||path.isAbsolute(rel))throw new Error('Caminho de áudio fora do destino');
  const fonte=path.resolve(base,cat.arquivos[item.sha256].arquivo);
  if(path.relative(base,fonte).startsWith('..'))throw new Error('Fonte fora do catálogo');
  let dados=fs.readFileSync(fonte);if(cat.arquivos[item.sha256].compressao==='gzip')dados=gunzipSync(dados);
  if(createHash('sha256').update(dados).digest('hex')!==item.sha256)throw new Error('Áudio não confere com o original');
  if(fs.existsSync(target)&&createHash('sha256').update(fs.readFileSync(target)).digest('hex')!==item.sha256)throw new Error('Arquivo diferente já existe: '+target);
  return {target,dados};
 });
 for(const {target,dados} of fila){fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,dados);}
 return fila.length;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const [catalogo,destino,pacote]=process.argv.slice(2);
 try{if(!destino)throw new Error('uso: node motor/audio/restaurar-fontes.mjs <fontes.json> <destino> [pacote]');console.log(restaurar(catalogo,destino,pacote)+' arquivos restaurados, idênticos aos originais.');}
 catch(e){console.error(e.message);process.exitCode=1;}
}
