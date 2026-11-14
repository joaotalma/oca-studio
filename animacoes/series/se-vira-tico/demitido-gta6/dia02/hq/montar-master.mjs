// Monta o master do Dia 2: parte 1 (HQ, 0-24 s) + luta (3D, 24-39,9 s) + parte 2 (HQ, 39,9-117,8 s) e mixa todo o áudio.
// Entradas (animacoes/render/demitido-gta6/): dia02-hq-parte1/parte1-mudo.mp4, dia02-amostra-3d/luta-mudo.mp4, dia02-hq-parte2/parte2-mudo.mp4.
// Áudio: falas em series/se-vira-tico/audio/demitido-gta6-dia02 (tempos de falas.js) e locutor em anunciador/. Saída: dia02-master/.
// Uso (de dia02/hq/): node montar-master.mjs
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const raiz = path.resolve(aqui, '../../../../..');             // animacoes/
const R = path.join(raiz, 'render', 'demitido-gta6');
const A = path.resolve(aqui, '../../../audio/demitido-gta6-dia02');
const OUT = path.join(R, 'dia02-master');
fs.mkdirSync(OUT, { recursive: true });
const { FALAS } = vm.runInNewContext(fs.readFileSync(path.join(aqui, '../falas.js'), 'utf8') + ';({FALAS})');
const run = (args) => { const r = spawnSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', ...args], { encoding: 'utf8' }); if (r.status) { console.error(r.stderr); process.exit(1); } };

// 1) vídeo: concatena as três partes sem recodificar (mesmo exportador, mesmos parâmetros)
const lista = path.join(OUT, 'lista.txt');
fs.writeFileSync(lista, ['dia02-hq-parte1/parte1-mudo.mp4', 'dia02-amostra-3d/luta-mudo.mp4', 'dia02-hq-parte2/parte2-mudo.mp4'].map((p) => `file '${path.join(R, p).replace(/\\/g, '/')}'`).join('\n'));
run(['-f', 'concat', '-safe', '0', '-i', lista, '-c', 'copy', path.join(OUT, 'video-mudo.mp4')]);

// 2) áudio: cada fala no tempo global; locutor da luta no início da luta (24,0 s)
const itens = [];
for (const f of FALAS) {
  const base = String(f.n).padStart(2, '0');
  const arq = fs.readdirSync(A).find((x) => x.startsWith(base + '_') && x.endsWith('.mp3'));
  itens.push([path.join(A, arq), f.ini]);
}
const L0 = 24.0;
itens.push([path.join(A, 'anunciador/round.mp3'), L0 + 0.05], [path.join(A, 'anunciador/fight.mp3'), L0 + 1.3], [path.join(A, 'anunciador/ko.mp3'), L0 + 14.2]);
const entradas = itens.flatMap(([p]) => ['-i', p]);
const filtros = itens.map(([, t], i) => `[${i}:a]adelay=${Math.round(t * 1000)}|${Math.round(t * 1000)}[a${i}]`).join(';');
const mix = `${filtros};${itens.map((_, i) => `[a${i}]`).join('')}amix=inputs=${itens.length}:normalize=0:duration=longest,apad=whole_dur=117.8[m]`;
run([...entradas, '-filter_complex', mix, '-map', '[m]', '-c:a', 'pcm_s16le', '-t', '117.8', path.join(OUT, 'audio.wav')]);

// 3) junta e grava o master
run(['-i', path.join(OUT, 'video-mudo.mp4'), '-i', path.join(OUT, 'audio.wav'), '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-t', '117.8', path.join(OUT, 'dia02-master.mp4')]);
console.log('master em', path.relative(raiz, path.join(OUT, 'dia02-master.mp4')));
