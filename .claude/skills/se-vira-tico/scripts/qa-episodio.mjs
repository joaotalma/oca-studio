#!/usr/bin/env node
// QA de um episódio: gate do Take One, ffprobe (duração, resolução, fps) e loudness (ffmpeg loudnorm).
//
//   node .claude/skills/se-vira-tico/scripts/qa-episodio.mjs <pasta do filme> <video.mp4> [--rascunho] [--sem-duracao]
//
//   --rascunho     espera 540x960 a 15 fps e não cobra loudness
//   --sem-duracao  não cobra 85-95 s (para testes curtos)
//
// Saída: 0 aprovado, 1 algum item reprovado, 2 não conseguiu rodar.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const [pasta, video] = args.filter((a) => !a.startsWith('--'));
const uso = 'uso: node qa-episodio.mjs <pasta do filme> <video.mp4> [--rascunho] [--sem-duracao]';
const parar = (msg) => { console.error(msg); process.exit(2); };

if (!pasta || !video) parar(uso);
const rascunho = flags.has('--rascunho');
const ALVO = rascunho ? { w: 540, h: 960, fps: 15 } : { w: 1080, h: 1920, fps: 30 };
const DURACAO = [85, 95], LUFS = -16, TOLERANCIA_LU = 1;

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const motor = process.env.TAKE_ONE || path.join(os.homedir(), '.claude/skills/take-one/scripts');
const gate = path.join(motor, 'gate.mjs');
const pastaAbs = path.resolve(pasta), videoAbs = path.resolve(video);

for (const cmd of ['ffmpeg', 'ffprobe']) {
  if (spawnSync(cmd, ['-version']).error) parar(`${cmd} não encontrado no PATH. Abra um terminal novo ou instale o FFmpeg.`);
}
if (!fs.existsSync(gate)) parar(`gate.mjs não encontrado em ${motor}. Instale a skill take-one ou defina TAKE_ONE.`);
if (!fs.existsSync(path.join(pastaAbs, 'film.html'))) parar(`film.html não encontrado em ${pastaAbs}.`);
if (!fs.existsSync(path.join(pastaAbs, 'chars.js'))) parar(`chars.js não encontrado em ${pastaAbs}. Rode: bash scripts/preparar-film.sh ${pasta}`);
if (!fs.existsSync(videoAbs)) parar(`vídeo não encontrado: ${videoAbs}`);

const itens = [];
const anotar = (nome, estado, detalhe) => itens.push({ nome, estado, detalhe });
const aprovar = (nome, ok, detalhe) => anotar(nome, ok ? 'APROVADO' : 'REPROVADO', detalhe);

// ffprobe
const sonda = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=codec_type,width,height,r_frame_rate:format=duration', '-of', 'json', videoAbs], { encoding: 'utf8' });
let info;
try { info = JSON.parse(sonda.stdout); } catch { parar(`ffprobe não conseguiu ler o vídeo: ${sonda.stderr}`); }
const streamVideo = (info.streams || []).find((s) => s.codec_type === 'video');
if (!streamVideo) parar('o arquivo não tem faixa de vídeo.');
const temAudio = (info.streams || []).some((s) => s.codec_type === 'audio');
const duracao = Number(info.format?.duration);
const [num, den] = String(streamVideo.r_frame_rate).split('/').map(Number);
const fps = num / (den || 1);

if (flags.has('--sem-duracao')) anotar('Duração', 'NÃO COBRADO', `${duracao.toFixed(2)} s`);
else aprovar('Duração', duracao >= DURACAO[0] && duracao <= DURACAO[1], `${duracao.toFixed(2)} s (esperado ${DURACAO[0]}-${DURACAO[1]} s)`);
aprovar('Resolução', streamVideo.width === ALVO.w && streamVideo.height === ALVO.h, `${streamVideo.width}x${streamVideo.height} (esperado ${ALVO.w}x${ALVO.h})`);
aprovar('Quadros por segundo', Math.abs(fps - ALVO.fps) < 0.01, `${fps.toFixed(2)} (esperado ${ALVO.fps})`);

// loudness
if (rascunho) anotar('Loudness', 'NÃO COBRADO', 'rascunho');
else if (!temAudio) aprovar('Loudness', false, 'vídeo sem áudio');
else {
  const medida = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', videoAbs, '-map', '0:a:0', '-af', `loudnorm=I=${LUFS}:TP=-1.5:LRA=11:print_format=json`, '-f', 'null', '-'], { encoding: 'utf8', maxBuffer: 1 << 26 });
  const json = (medida.stderr || '').match(/\{[^{}]*"input_i"[^{}]*\}/);
  const lufs = json ? Number(JSON.parse(json[0]).input_i) : NaN;
  if (!Number.isFinite(lufs)) aprovar('Loudness', false, 'não foi possível medir');
  else aprovar('Loudness', Math.abs(lufs - LUFS) <= TOLERANCIA_LU, `${lufs.toFixed(1)} LUFS (esperado ${LUFS} ±${TOLERANCIA_LU})`);
}

// gate do Take One, rodado na pasta do filme
const resultadoGate = spawnSync(process.execPath, [gate, 'film.html', '--mp4', videoAbs], {
  cwd: pastaAbs, encoding: 'utf8', maxBuffer: 1 << 26,
  env: { ...process.env, W: String(streamVideo.width), H: String(streamVideo.height), PLAYWRIGHT_NODE_MODULES: path.join(raiz, 'node_modules') },
});
const saidaGate = `${resultadoGate.stdout || ''}${resultadoGate.stderr || ''}`;
const linhasGate = saidaGate.split(/\r?\n/);
if (resultadoGate.status === 0 || resultadoGate.status === 1) {
  const falhas = linhasGate.filter((l) => /^\s*FAIL\b/.test(l)).map((l) => l.trim().replace(/^FAIL\s+/, ''));
  const total = linhasGate.filter((l) => /^\s*(PASS|FAIL)\b/.test(l)).length;
  aprovar('Gate do Take One', resultadoGate.status === 0, resultadoGate.status === 0 ? `${total} de ${total} itens` : `${falhas.length} de ${total} itens falharam`);
  falhas.forEach((f) => anotar('  falha no gate', 'REPROVADO', f));
} else {
  aprovar('Gate do Take One', false, `não rodou (saída ${resultadoGate.status}): ${linhasGate.filter(Boolean).slice(-1)[0] || resultadoGate.error?.message || ''}`);
}

// relatório
const largura = Math.max(...itens.map((i) => i.nome.length));
console.log(`\nQA  ${path.basename(videoAbs)}${rascunho ? '  (rascunho)' : ''}\n${'-'.repeat(60)}`);
for (const { nome, estado, detalhe } of itens) console.log(`${estado.padEnd(11)}  ${nome.padEnd(largura)}  ${detalhe}`);
console.log(`${'-'.repeat(60)}\nConferir à vista: membros, boca, legenda e voto A/B (references/qa-checklist.md).`);
const reprovou = itens.some((i) => i.estado === 'REPROVADO');
console.log(`\nRESULTADO: ${reprovou ? 'REPROVADO' : 'APROVADO nos itens medidos'}`);
process.exitCode = reprovou ? 1 : 0;
