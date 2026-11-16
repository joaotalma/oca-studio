// Prepara o Dia 2 em HQ V10 para renderizar: node preparar.mjs [parte1]
// Origem da base: ../../dia01/estudos/hq-v10-15s-v2/direcao-hq.js (linhas 1 a 63: rig do Kauã e do Júnior, cabelo com cachos,
// definições SVG e a explosão "star"), copiada em tempo de preparação (cópia, não importação). Rig compartilhado: motor/personagem/chars.js,
// carregado em cópia preparada (não editar a cópia). Exportador: ../3d/export.mjs e serve.mjs (cópias do Dia 1).
// dados.js: tempos globais das falas (falas.js) e de cada palavra (audio/demitido-gta6-dia02/alinhamento), para legendas e boca.
// Saída: animacoes/render/demitido-gta6/dia02-hq-<nome>/ (fora do Git).
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const raiz = path.resolve(aqui, '../../../../..');            // animacoes/
const serie = path.resolve(aqui, '../../..');                 // series/se-vira-tico/
const nome = process.argv[2] || 'parte1';
const dest = path.join(raiz, 'render', 'demitido-gta6', `dia02-hq-${nome}`);
fs.mkdirSync(dest, { recursive: true });

// tempos globais das falas e das palavras
const falasSrc = fs.readFileSync(path.join(aqui, '../falas.js'), 'utf8');
const { FALAS } = vm.runInNewContext(falasSrc + ';({FALAS})');
const quais = (process.env.FALAS || '1,2,5,6').split(',').map(Number);
const falas = quais.map((n) => {
  const f = FALAS.find((x) => x.n === n);
  const al = JSON.parse(fs.readFileSync(path.join(serie, 'audio/demitido-gta6-dia02/alinhamento', `${n}.json`), 'utf8'));
  const palavras = al.palavras.map((p) => [p.palavra, +(f.ini + p.ini).toFixed(3), +(f.ini + p.fim).toFixed(3)]);
  const frases = []; let atual = [];
  for (const p of palavras) { atual.push(p); if (/[.!?]$/.test(p[0])) { frases.push([+(atual[0][1] - 0.05).toFixed(2), +(p[2] + 0.15).toFixed(2), atual.map((x) => x[0]).join(' ')]); atual = []; } }
  if (atual.length) frases.push([+(atual[0][1] - 0.05).toFixed(2), +(atual.at(-1)[2] + 0.15).toFixed(2), atual.map((x) => x[0]).join(' ')]);
  return { n, ini: f.ini, fim: f.fim, quem: f.quem, palavras, frases };
});
const e = falas.find((f) => f.n === 1)?.palavras.find((p) => p[0] === 'E');
const dados = { tAbre: e ? +(e[1] - 0.07).toFixed(2) : 5.3, falas };
fs.writeFileSync(path.join(dest, 'dados.js'), `const DADOS=${JSON.stringify(dados)};\n`);

const estudo = fs.readFileSync(path.join(aqui, '../../dia01/estudos/hq-v10-15s-v2/direcao-hq.js'), 'utf8').split('\n');
const base = estudo.slice(0, 63).join('\n');                   // até o fim da função star()
if (!base.includes('const HQ=(()=>{') || !/function star\(/.test(base)) throw new Error('A base do estudo V10 mudou; revisar as linhas copiadas.');
const pecas = fs.readFileSync(path.join(aqui, 'pecas.js'), 'utf8');
const final = fs.readFileSync(path.join(aqui, `final-${nome}.js`), 'utf8');
fs.writeFileSync(path.join(dest, 'hq-dia02.js'), base + '\n' + pecas + '\n' + final);
fs.writeFileSync(path.join(dest, 'film.html'), fs.readFileSync(path.join(aqui, 'film.html'), 'utf8').replace('<script src="chars.js"></script>', '<script src="chars.js"></script><script src="dados.js"></script>'));
fs.copyFileSync(path.join(raiz, 'motor/personagem/chars.js'), path.join(dest, 'chars.js'));
for (const f of ['export.mjs', 'serve.mjs', 'still.mjs']) fs.copyFileSync(path.join(aqui, '../3d', f), path.join(dest, f));
console.log('preparado em', path.relative(raiz, dest), '| falas', quais.join(','), '| tAbre', dados.tAbre);
