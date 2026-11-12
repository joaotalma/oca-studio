#!/usr/bin/env node
// QA de um episódio do Tico. Usa o QA único da Oca Studio (animacoes/motor/qa/qa-video.mjs) com as
// regras da série: duração por episódio, sem a cobrança de "tempo sem texto novo" (série com diálogo)
// e a lista de conferência do Tico.
//
//   node .claude/skills/se-vira-tico/scripts/qa-episodio.mjs <pasta do filme> <video.mp4> [--rascunho] [--sem-duracao]
//
//   --rascunho     espera 540x960 a 15 fps e não cobra loudness
//   --sem-duracao  não cobra a duração (85-95 s nos eps. 1 e 2, 61-68 s do 3 em diante) (para testes curtos)
//
// Saída: 0 aprovado, 1 algum item reprovado, 2 não conseguiu rodar.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const flags = args.filter((a) => a.startsWith('--'));
const [pasta, video] = args.filter((a) => !a.startsWith('--'));
if (!pasta || !video) { console.error('uso: node qa-episodio.mjs <pasta do filme> <video.mp4> [--rascunho] [--sem-duracao]'); process.exit(2); }

const tico = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const qa = path.resolve(tico, '../../motor/qa/qa-video.mjs');
if (!fs.existsSync(path.join(path.resolve(pasta), 'chars.js'))) {
  console.error(`chars.js não encontrado em ${path.resolve(pasta)}. Rode: bash scripts/preparar-film.sh ${pasta}`);
  process.exit(2);
}
// Eps. 1 e 2 têm cerca de 90 s; do ep. 3 em diante, pouco mais de 60 s (decisão do autor em 7/11/2026; acima de 1 min por causa da monetização)
const NUM_EP = Number((pasta.match(/ep(\d+)/) || [])[1] || 0);
const duracao = NUM_EP >= 3 ? '61,68' : '85,95';
const r = spawnSync(process.execPath, [qa, pasta, video, ...flags, '--duracao', duracao, '--sem-texto',
  '--checklist', 'membros, boca, legenda e voto A/B (references/qa-checklist.md)'], { stdio: 'inherit' });
process.exit(r.status ?? 2);
