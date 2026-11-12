#!/usr/bin/env node
// QA de um vídeo: gate, ffprobe (duração, resolução, fps), loudness e tempo máximo sem texto novo.
//
//   node motor/qa/qa-video.mjs <pasta em render/> <video.mp4> [--rascunho] [--mudo] [--sem-duracao] [--duracao 30,90]
//
//   --rascunho     espera 540x960 a 15 fps e não cobra loudness
//   --mudo         não cobra loudness (render antes da narração)
//   --sem-duracao  não cobra a duração (para testes curtos)
//   --duracao a,b  troca a faixa padrão de 30 a 90 s
//   --sem-texto    não cobra o tempo sem texto novo (séries com diálogo, como o Tico)
//   --checklist p  caminho da lista de conferência à vista mostrada no fim
//
// O limite de tela parada é do template: o que film.html declara em window.HOLDS o gate não cobra.
// Saída: 0 aprovado, 1 algum item reprovado, 2 não conseguiu rodar.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const iDur = args.indexOf('--duracao');
const iLeitura = args.indexOf('--leitura');
const faixa = iDur >= 0 ? args[iDur + 1].split(',').map(Number) : [30, 90];
const [pasta, video] = args.filter((a, i) => !a.startsWith('--') && (iDur < 0 || i !== iDur + 1) && (iLeitura < 0 || i !== iLeitura + 1) && args[i - 1] !== '--checklist');
const uso = 'uso: node motor/qa/qa-video.mjs <pasta em render/> <video.mp4> [--rascunho] [--mudo] [--sem-duracao] [--duracao a,b]';
const parar = (msg) => { console.error(msg); process.exit(2); };

if (!pasta || !video) parar(uso);
const rascunho = flags.has('--rascunho');
const ALVO = rascunho ? { w: 540, h: 960, fps: 15 } : { w: 1080, h: 1920, fps: 30 };
const DURACAO = faixa, MAX_SEM_TEXTO = 2.5, LUFS = -16, TOLERANCIA_LU = 1;

const aqui = path.dirname(fileURLToPath(import.meta.url));
const raiz = path.resolve(aqui, '..', '..');
const gate = path.join(aqui, '..', 'take-one', 'gate.mjs');
const pastaAbs = path.resolve(pasta), videoAbs = path.resolve(video);

for (const cmd of ['ffmpeg', 'ffprobe']) {
  if (spawnSync(cmd, ['-version']).error) parar(`${cmd} não encontrado no PATH. Abra um terminal novo ou instale o FFmpeg.`);
}
if (!fs.existsSync(path.join(pastaAbs, 'film.html'))) parar(`film.html não encontrado em ${pastaAbs}.`);
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
if (rascunho || flags.has('--mudo')) anotar('Loudness', 'NÃO COBRADO', rascunho ? 'rascunho' : 'render mudo');
else if (!temAudio) aprovar('Loudness', false, 'vídeo sem áudio');
else {
  const medida = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', videoAbs, '-map', '0:a:0', '-af', `loudnorm=I=${LUFS}:TP=-1.5:LRA=11:print_format=json`, '-f', 'null', '-'], { encoding: 'utf8', maxBuffer: 1 << 26 });
  const json = (medida.stderr || '').match(/\{[^{}]*"input_i"[^{}]*\}/);
  const lufs = json ? Number(JSON.parse(json[0]).input_i) : NaN;
  if (!Number.isFinite(lufs)) aprovar('Loudness', false, 'não foi possível medir');
  else aprovar('Loudness', Math.abs(lufs - LUFS) <= TOLERANCIA_LU, `${lufs.toFixed(1)} LUFS (esperado ${LUFS} ±${TOLERANCIA_LU})`);
}

// tempo sem texto novo: o intervalo entre o fim de uma fala e o início da próxima, no tempo real
const lerConst = (arq, nome) => {
  const p = path.join(pastaAbs, arq);
  if (!fs.existsSync(p)) return null;
  const m = fs.readFileSync(p, 'utf8').match(new RegExp(`const ${nome} = ([\\[{][\\s\\S]*[\\]}]);?`));
  return m ? JSON.parse(m[1]) : null;
};
const falas = lerConst('falas.js', 'FALAS');
if (falas?.length && !flags.has('--sem-texto')) {
  const tempos = lerConst('tempos.js', 'TEMPOS');
  const real = (t) => {
    const n = tempos?.nos; if (!n) return t;
    for (let i = 1; i < n.length; i++) if (t <= n[i][0]) return n[i - 1][1] + (n[i][1] - n[i - 1][1]) * (t - n[i - 1][0]) / (n[i][0] - n[i - 1][0]);
    return n[n.length - 1][1];
  };
  let maior = 0, onde = 0;
  for (let i = 1; i < falas.length; i++) {
    const v = real(falas[i].ini) - real(falas[i - 1].fim);
    if (v > maior) { maior = v; onde = falas[i].n; }
  }
  aprovar('Tempo sem texto novo', maior <= MAX_SEM_TEXTO, `${maior.toFixed(2)} s antes da fala ${onde} (limite ${MAX_SEM_TEXTO} s)`);
}

// isca de engajamento: pedir comentário, envio ou marcação derruba a recomendação (Meta, "engagement bait").
// Vale para o texto da tela e para as falas. O voto fecha com "Vocês decidem", e as opções ficam só na tela.
// Ver referencias/videos-analisados/temporada-viral-metodo.md.
const ISCA = /\b(comente|comenta|comentem|marque|marquem|envie|enviem|mande pra|mandem pra|compartilhe|compartilhem)\b/i;
const iscas = [];
for (const arq of ['ep.js', 'video.js', 'falas.js']) {
  const p = path.join(pastaAbs, arq);
  if (!fs.existsSync(p)) continue;
  for (const m of fs.readFileSync(p, 'utf8').matchAll(/(['"`])((?:(?!\1)[^\\\n]|\\.){3,200})\1/g)) if (ISCA.test(m[2])) iscas.push(`${arq}: "${m[2].slice(0, 60)}"`);
}
aprovar('Sem isca de engajamento', iscas.length === 0, iscas.length ? iscas.slice(0, 3).join(' | ') : 'nenhum pedido de comentário, envio ou marcação');

// gate, rodado na pasta do filme
const pausas = iLeitura>=0 ? JSON.parse(fs.readFileSync(args[iLeitura+1],'utf8')) : [];
if(!Array.isArray(pausas)||pausas.some(p=>!Number.isFinite(p.ini)||!Number.isFinite(p.fim)||p.ini<0||p.fim<=p.ini||p.fim>duracao+.05||!p.motivo))parar('Pausas de leitura precisam de intervalo válido e justificativa.');
if(pausas.length)anotar('Pausas visuais','DECLARADAS',`${pausas.length} intervalos justificados, ver ${args[iLeitura+1]}; exigem conferência à vista, não aprovação automática.`);
const resultadoGate = spawnSync(process.execPath, [gate, 'film.html', '--mp4', videoAbs,...(pausas.length?['--holds',pausas.map(p=>`${p.ini}-${p.fim}`).join(',')]:[])], {
  cwd: pastaAbs, encoding: 'utf8', maxBuffer: 1 << 26,
  env: { ...process.env, W: String(streamVideo.width), H: String(streamVideo.height), PLAYWRIGHT_NODE_MODULES: path.join(raiz, 'node_modules') },
});
const saidaGate = `${resultadoGate.stdout || ''}${resultadoGate.stderr || ''}`;
const linhasGate = saidaGate.split(/\r?\n/);
if (resultadoGate.status === 0 || resultadoGate.status === 1) {
  const falhas = linhasGate.filter((l) => /^\s*FAIL\b/.test(l)).map((l) => l.trim().replace(/^FAIL\s+/, ''));
  const total = linhasGate.filter((l) => /^\s*(PASS|FAIL)\b/.test(l)).length;
  aprovar('Gate', resultadoGate.status === 0, resultadoGate.status === 0 ? `${total} de ${total} itens` : `${falhas.length} de ${total} itens falharam`);
  falhas.forEach((f) => anotar('  falha no gate', 'REPROVADO', f));
} else {
  aprovar('Gate', false, `não rodou (saída ${resultadoGate.status}): ${linhasGate.filter(Boolean).slice(-1)[0] || resultadoGate.error?.message || ''}`);
}

// relatório
const largura = Math.max(...itens.map((i) => i.nome.length));
console.log(`\nQA  ${path.basename(videoAbs)}${rascunho ? '  (rascunho)' : ''}\n${'-'.repeat(60)}`);
for (const { nome, estado, detalhe } of itens) console.log(`${estado.padEnd(11)}  ${nome.padEnd(largura)}  ${detalhe}`);
const iCheck = args.indexOf('--checklist');
console.log(`${'-'.repeat(60)}\nConferir à vista: ${iCheck >= 0 ? args[iCheck + 1] : '.claude/skills/qa/qa-checklist.md'}.`);
const reprovou = itens.some((i) => i.estado === 'REPROVADO');
console.log(`\nRESULTADO: ${reprovou ? 'REPROVADO' : 'APROVADO nos itens medidos'}`);
process.exitCode = reprovou ? 1 : 0;
