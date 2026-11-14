// Aperta as pausas dentro das falas do Dia 2 (pedido do João, 14/11/2026) sem regravar nada.
// Cada silêncio de 0,25 s ou mais (abaixo de -38 dB) é reduzido ao limite da fala (padrão 0,15 s); as pausas de piada têm
// limite maior (ver LIMITES). Preserva os originais em audio/demitido-gta6-dia02/originais/ e reescreve o alinhamento
// por palavra com os novos tempos. Rodar de series/se-vira-tico/, com ffmpeg no PATH: node scripts/apertar-pausas-dia02.mjs
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const DIR = path.resolve(import.meta.dirname, '..', 'audio', 'demitido-gta6-dia02');
const ORIG = path.join(DIR, 'originais');
const PADRAO = 0.15;
// Fala -> limite de pausa (s). São as pausas que fazem parte da piada ou do contraste de tom.
const LIMITES = { 1: 0.3, 5: 0.4, 10: 0.5, 16: 0.4 };
const MIN = 0.25;

fs.mkdirSync(path.join(ORIG, 'alinhamento'), { recursive: true });
// Aceita uma lista de falas (ex.: node scripts/apertar-pausas-dia02.mjs 18) para não refazer as outras.
const so = process.argv[2] ? new Set(process.argv[2].split(',').map(Number)) : null;
const arquivos = fs.readdirSync(DIR).filter((f) => /^\d+_\w+\.mp3$/.test(f) && (!so || so.has(Number(f.slice(0, 2))))).sort();
let antes = 0, depois = 0;
for (const arq of arquivos) {
  const n = Number(arq.slice(0, 2));
  const origem = path.join(ORIG, arq);
  if (!fs.existsSync(origem)) fs.copyFileSync(path.join(DIR, arq), origem);          // 1ª vez: guarda o original
  const alOrig = path.join(ORIG, 'alinhamento', `${n}.json`);
  if (!fs.existsSync(alOrig)) fs.copyFileSync(path.join(DIR, 'alinhamento', `${n}.json`), alOrig);

  const det = spawnSync('ffmpeg', ['-hide_banner', '-i', origem, '-af', `silencedetect=noise=-38dB:d=${MIN}`, '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
  const dur = (() => { const m = det.match(/Duration: (\d+):(\d+):([\d.]+)/); return +m[1] * 3600 + +m[2] * 60 + +m[3]; })();
  const sil = []; let ini = null;
  for (const l of det.split('\n')) {
    let m = l.match(/silence_start: ([\d.]+)/); if (m) ini = +m[1];
    m = l.match(/silence_end: ([\d.]+)/); if (m && ini !== null) { sil.push([ini, +m[1]]); ini = null; }
  }
  if (ini !== null) sil.push([ini, dur]); // silêncio até o fim do arquivo

  const cap = LIMITES[n] ?? PADRAO;
  const cortes = []; // trechos removidos [a, b]
  for (const [s, e] of sil) {
    const nas_pontas = s < 0.05 || e >= dur - 0.05;
    const lim = nas_pontas ? 0.03 : cap;
    if (e - s > lim) {
      if (s < 0.05) cortes.push([0, e - lim]);               // começo: tira o silêncio e deixa lim
      else if (e >= dur - 0.05) cortes.push([s + lim, dur]);  // fim
      else cortes.push([s + lim / 2, e - lim / 2]);           // meio
    }
  }
  // Mantém os trechos entre os cortes.
  const mantem = []; let pos = 0;
  for (const [a, b] of cortes) { if (a > pos) mantem.push([pos, a]); pos = b; }
  if (pos < dur) mantem.push([pos, dur]);
  const filtro = mantem.map(([a, b], i) => `[0:a]atrim=${a.toFixed(3)}:${b.toFixed(3)},asetpts=PTS-STARTPTS[a${i}]`).join(';')
    + ';' + mantem.map((_, i) => `[a${i}]`).join('') + `concat=n=${mantem.length}:v=0:a=1[o]`;
  const r = spawnSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-i', origem, '-filter_complex', filtro, '-map', '[o]', '-c:a', 'libmp3lame', '-b:a', '128k', path.join(DIR, arq)], { encoding: 'utf8' });
  if (r.status !== 0) { console.error(arq, r.stderr); process.exit(1); }

  // Novo tempo de cada palavra: desconta o que foi removido antes dela.
  const mapa = (t) => { let tirado = 0; for (const [a, b] of cortes) { if (t >= b) tirado += b - a; else if (t > a) tirado += t - a; } return +(t - tirado).toFixed(3); };
  const al = JSON.parse(fs.readFileSync(alOrig, 'utf8'));
  al.palavras = al.palavras.map((p) => ({ ...p, ini: mapa(p.ini), fim: mapa(p.fim) }));
  fs.writeFileSync(path.join(DIR, 'alinhamento', `${n}.json`), JSON.stringify(al, null, 1));

  const nova = dur - cortes.reduce((s, [a, b]) => s + (b - a), 0);
  antes += dur; depois += nova;
  console.log(`${arq}  ${dur.toFixed(1)} s -> ${nova.toFixed(1)} s  (${cortes.length} pausas apertadas)`);
}
console.log(`Total: ${antes.toFixed(1)} s -> ${depois.toFixed(1)} s`);
