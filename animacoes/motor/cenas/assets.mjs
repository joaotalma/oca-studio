import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';
export function deduplicarCamadas(pasta,camadas){
 const raiz=path.resolve(pasta),assets=path.join(raiz,'assets'),campos=['fundo','frente','voce','pisca','albedo','piscaAlbedo'];
 const nomes=[...new Set(Object.values(camadas).flatMap(c=>campos.map(k=>c[k]).filter(Boolean)))].sort(),porHash=new Map(),aliases=new Map();let bytes=0;
 for(const nome of nomes){
  const p=path.resolve(raiz,nome);if(path.dirname(p)!==assets)throw new Error('Camada fora de assets/: '+nome);
  const b=fs.readFileSync(p),sha=createHash('sha256').update(b).digest('hex');
  if(porHash.has(sha)){aliases.set(nome,porHash.get(sha));bytes+=b.length;}else porHash.set(sha,nome);
 }
 // Keep the keys (= scene identities) and all composition/animation metadata unchanged.
 for(const c of Object.values(camadas))for(const k of campos)if(aliases.has(c[k]))c[k]=aliases.get(c[k]);
 for(const [nome,destino] of aliases){
  const p=path.resolve(raiz,nome),keep=path.resolve(raiz,destino),mtime=Math.max(fs.statSync(p).mtimeMs,fs.statSync(keep).mtimeMs);
  fs.utimesSync(keep,new Date(mtime),new Date(mtime));fs.unlinkSync(p);
 }
 return {arquivos:aliases.size,bytes};
}
