import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
export const hashArquivo = p => createHash('sha256').update(fs.readFileSync(p)).digest('hex');
// A pasta preparada é autocontida: código, imagens, fontes e dados. Resultados nunca entram no hash.
export function hashFonte(dir) {
  const hash = createHash('sha256');
  const referencias = [];
  const textos = base => {
    for(const e of fs.readdirSync(base,{withFileTypes:true})) {
      if(e.isSymbolicLink()) continue;
      if(e.isDirectory()) { if(!/^(node_modules|review.*|qa-resultados|\.git)$/.test(e.name)) textos(path.join(base,e.name)); }
      else if(/\.(html?|[cm]?js|css|json)$/.test(e.name) && !['export.mjs','serve.mjs','gate.mjs','frames.mjs','qa-video.mjs'].includes(e.name)) referencias.push(fs.readFileSync(path.join(base,e.name),'utf8'));
    }
  };
  textos(dir);

  const walk = (base, prefix = '') => {
    for (const e of fs.readdirSync(base, { withFileTypes: true }).sort((a,b)=>a.name.localeCompare(b.name))) {
      const rel = prefix + e.name, p = path.join(base,e.name);
      if (e.isSymbolicLink()) throw new Error(`Fonte deve ser autocontida, sem links: ${rel}`);
      if (e.isDirectory()) { if (!/^(node_modules|review.*|qa-resultados|\.git)$/.test(e.name)) walk(p,rel+'/'); }
      else if (/\.(html?|[cm]?js|css|json|svg|png|jpe?g|webp|gif|woff2?|ttf|otf|mp3|wav|m4a|mp4)$/i.test(e.name)
        && !/^(aprovacao|qa-rascunho|qa-final|producao)\.json$/.test(e.name)
        && (!/\.(mp4|wav|mp3|m4a)$/i.test(e.name) || prefix !== '' || referencias.some(s=>s.includes(e.name)))) {
        hash.update(rel); hash.update('\0'); hash.update(hashArquivo(p));
      }
    }
  };
  walk(dir); return hash.digest('hex');
}
export function validarRascunho(relatorio, pasta, audioOrigem, politica) {
  const q = JSON.parse(fs.readFileSync(relatorio,'utf8'));
  if (q.dimensoes?.join('x') !== '540x960' || q.fps !== 15 || q.schema !== 1 || q.modo !== 'rascunho' || !q.aprovado || q.mudo || !q.temAudio || !q.gateCompleto)
    throw new Error('Rascunho precisa passar pelo gate completo com áudio.');
  if (q.fonte !== hashFonte(pasta)) throw new Error('Fonte mudou depois do QA do rascunho.');
  if (!fs.existsSync(q.video) || q.videoHash !== hashArquivo(q.video)) throw new Error('Arquivo do rascunho mudou ou não existe.');
  if (!audioOrigem || q.audioOrigemHash !== hashArquivo(audioOrigem)) throw new Error('Áudio mudou ou não foi vinculado ao rascunho.');
  if (JSON.stringify(q.politica) !== JSON.stringify(politica)) throw new Error('Regras de QA mudaram depois do rascunho.');
  return q;
}
export function validarFinal(q,pasta,video) {
  if (q.dimensoes?.join('x') !== '1080x1920' || q.fps !== 30 || q.schema !== 1 || !['final-leve','final-completo'].includes(q.modo) || !q.aprovado || q.mudo || !q.temAudio)
    throw new Error('Finalização exige QA final aprovado e vídeo com áudio.');
  if (q.fonte !== hashFonte(pasta) || q.videoHash !== hashArquivo(video) || path.resolve(q.video)!==path.resolve(video))
    throw new Error('O final ou a fonte mudou depois do QA.');
  if(q.modo === 'final-leve') validarRascunho(q.rascunho,pasta,q.audioOrigem,q.politica);
  else if(!q.gateCompleto) throw new Error('Gate final não executado.');
  return true;
}
