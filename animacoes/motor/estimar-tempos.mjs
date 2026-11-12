#!/usr/bin/env node
// Preenche ini e fim de cada fala em falas.js a partir do texto e do campo "pausa" (segundos antes da fala).
// Serve para ver o ritmo antes de gravar. A narração real substitui esses tempos em motor/sincronizar.py.
//
//   node motor/estimar-tempos.mjs series/misterios-do-brasil/roteiros/<slug>/falas.js [--ppm 150]
//
// 150 palavras por minuto é um ponto de partida, não uma medida do seu ritmo. Troque depois de gravar.
import fs from 'node:fs';

const [arquivo] = process.argv.slice(2);
if (!arquivo) { console.error('uso: node motor/estimar-tempos.mjs series/misterios-do-brasil/roteiros/<slug>/falas.js [--ppm 150]'); process.exit(2); }
const i = process.argv.indexOf('--ppm');
const ppm = i > 0 ? Number(process.argv[i + 1]) : 150;
const MIN_FALA = 0.45;

const fonte = fs.readFileSync(arquivo, 'utf8');
const m = fonte.match(/const FALAS = (\[[\s\S]*\]);?/);
if (!m) { console.error(`não achei "const FALAS = [...]" em ${arquivo}`); process.exit(2); }
const falas = JSON.parse(m[1]);

let t = 0, palavras = 0;
for (const f of falas) {
  const n = f.texto.trim().split(/\s+/).length;
  palavras += n;
  f.ini = +(t + (f.pausa ?? 0.25)).toFixed(2);
  f.fim = +(f.ini + Math.max(MIN_FALA, n / ppm * 60)).toFixed(2);
  t = f.fim;
}
const linhas = falas.map((f) => '  ' + JSON.stringify(f)).join(',\n');
fs.writeFileSync(arquivo, `const FALAS = [\n${linhas}\n];\n`);
console.log(`${falas.length} falas, ${palavras} palavras, ${t.toFixed(1)} s a ${ppm} ppm`);
