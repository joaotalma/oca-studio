// Prepara o Dia 3 em HQ V10: node preparar.mjs   (cópia adaptada de ../../dia02/hq/preparar.mjs, 15/11/2026)
// Base: ../../dia01/estudos/hq-v10-15s-v2/direcao-hq.js (linhas 1 a 63, cópia em tempo de preparação) + ../../dia02/hq/pecas.js
// (rig do elenco, ator(), cabelo, cutout; só ferramentas, nada específico do Dia 2 é desenhado) + final.js (cenas do Dia 3).
// dados.js: tempos globais das falas e das palavras (falas.js + audio/demitido-gta6-dia03/alinhamento).
// Saída: animacoes/render/demitido-gta6/dia03-hq/ (fora do Git).
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
const aqui = path.dirname(fileURLToPath(import.meta.url));
const raiz = path.resolve(aqui, '../../../../..');
const serie = path.resolve(aqui, '../../..');
const nome = process.argv[2] || '';   // '' = episódio; 'capa' = fonte da capa
const dest = path.join(raiz, 'render', 'demitido-gta6', nome ? `dia03-hq-${nome}` : 'dia03-hq');
fs.mkdirSync(dest, { recursive: true });
const { FALAS, MARCOS } = vm.runInNewContext(fs.readFileSync(path.join(aqui, '../falas.js'), 'utf8') + ';({FALAS,MARCOS})');
const falas = FALAS.map((f) => {
  const al = JSON.parse(fs.readFileSync(path.join(serie, 'audio/demitido-gta6-dia03/alinhamento', `${f.n}.json`), 'utf8'));
  const palavras = al.palavras.map((p) => [p.palavra, +(f.ini + p.ini).toFixed(3), +(f.ini + p.fim).toFixed(3)]);
  return { n: f.n, ini: f.ini, fim: f.fim, quem: f.quem, palavras, frases: [] };
});
// Legendas por alinhamento real, grupos de até 3 palavras (mesma regra do Dia 2).
const legendas = [];
for (const f of falas) { let g = []; const flush = () => { if (g.length) legendas.push({ ini: +(g[0][1] - .025).toFixed(3), fim: +(g.at(-1)[2] + .10).toFixed(3), texto: g.map((p) => p[0]).join(' ') }); g = []; };
  for (const p of f.palavras) { if (g.length && (g.length >= 3 || g.map((x) => x[0]).join(' ').length + p[0].length > 23)) flush(); g.push(p); if (/[.!?:]$/.test(p[0])) flush(); } flush(); }
for (let i = 0; i < legendas.length - 1; i++) legendas[i].fim = Math.min(legendas[i].fim, legendas[i + 1].ini);
fs.writeFileSync(path.join(dest, 'dados.js'), `const DADOS=${JSON.stringify({ tAbre: 0, falas, marcos: MARCOS, legendas, faixas: FALAS.map((f) => ({ ini: f.ini - .03, fim: f.fim + .12 })) })};
`);
const estudo = fs.readFileSync(path.join(aqui, '../../dia01/estudos/hq-v10-15s-v2/direcao-hq.js'), 'utf8').split('\n');
const base = estudo.slice(0, 63).join('\n');
if (!base.includes('const HQ=(()=>{') || !/function star\(/.test(base)) throw new Error('A base do estudo V10 mudou; revisar as linhas copiadas.');
const pecas = fs.readFileSync(path.join(aqui, '../../dia02/hq/pecas.js'), 'utf8');
let final = fs.readFileSync(path.join(aqui, nome ? `final-${nome}.js` : 'final.js'), 'utf8');
if (nome === 'capa') { const base3 = fs.readFileSync(path.join(aqui, 'final.js'), 'utf8'); final = base3.slice(0, base3.indexOf(' // ===== cenas =====')) + final; }
fs.writeFileSync(path.join(dest, 'hq-dia03.js'), base + '\n' + pecas + '\n' + final);
fs.writeFileSync(path.join(dest, 'film.html'), fs.readFileSync(path.join(aqui, 'film.html'), 'utf8').replace('<script src="chars.js"></script>', '<script src="chars.js"></script><script src="dados.js"></script>'));
fs.copyFileSync(path.join(raiz, 'motor/personagem/chars.js'), path.join(dest, 'chars.js'));
for (const f of ['export.mjs', 'serve.mjs', 'still.mjs']) fs.copyFileSync(path.join(aqui, '../../dia02/3d', f), path.join(dest, f));
console.log('preparado em', path.relative(raiz, dest), '|', falas.length, 'falas');
// QA legado lê só FALAS como JSON; os marcos ficam em falas.js do episódio.
fs.writeFileSync(path.join(dest, 'falas.js'), `const FALAS = ${JSON.stringify(FALAS, null, 2)};\n`);
