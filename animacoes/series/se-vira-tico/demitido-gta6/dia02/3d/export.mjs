// Cópia de ../../dia01/export.mjs (Oca Studio, 14/11/2026), sem alterações; renderiza window.renderFrame(t) quadro a quadro.
// Export film.html to MP4 frame by frame via window.renderFrame(t).
// Usage: node export.mjs [fps=60] [out=film.mp4]     env: FILM=film.html W=1920 H=1080 SLOW=1 (time-stretch)
// START/END (seconds, output time): render only that range, for re-rendering changed shots and splicing (see pipeline.md)
// PARTES=N: renders N ranges at once (one Chrome each) and joins them without re-encoding. 2-3 on an 8 GB laptop.
// SUB=N: subframe motion blur. Renders N subframes per output frame (t + k/(fps*N), k=0..N-1) and averages them
//        in ffmpeg (tmix). Default off (1). SUB=8 for the final master of smooth-motion styles; never for stepped
//        art (pixel, pencil test, crayon boil), where the hold IS the look. Costs N x the render time.
// ALPHA=1: the page draws a transparent overlay (HUD) instead of a full frame; writes ProRes 4444 with alpha (use out=hud.mov)
//          then composite: ffmpeg -i footage.mp4 -i hud.mov -filter_complex overlay -c:v libx264 -crf 14 -pix_fmt yuv420p final.mp4
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import { serve } from './serve.mjs';
const fps = Number(process.argv[2] || 60), out = process.argv[3] || 'film.mp4';
const W = Number(process.env.W || 1920), H = Number(process.env.H || 1080), SLOW = Number(process.env.SLOW || 1);
const SUB = Math.max(1, Math.round(Number(process.env.SUB || 1)));
const FILM = process.env.FILM || 'film.html';
const { srv, url } = await serve('.');
// Metal is the Mac's graphics engine: ask for it on a Mac only, every other system keeps Chrome's own choice
const GPU = process.platform === 'darwin' ? ['--use-angle=metal', '--ignore-gpu-blocklist'] : ['--ignore-gpu-blocklist'];
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: GPU });
const page = await browser.newPage({ viewport: { width: W, height: H } });
await page.goto(url + '/' + FILM + (H > W ? '?portrait=1' : ''));
await page.waitForFunction(() => typeof window.renderFrame === 'function' && window.READY === true, null, { timeout: 120000 });
const duration = await page.evaluate(() => window.FILM_DURATION || 30);
const T0 = Number(process.env.START || 0), T1 = Number(process.env.END || duration * SLOW);
const f0 = Math.round(T0 * fps), frames = Math.round(T1 * fps);
// PARTES=N (Oca Studio, 12/11/2026): divide os quadros em N trechos renderizados ao mesmo tempo, cada um no seu
// Chrome, e emenda sem recodificar. Sem PARTES (ou 1), o caminho é o de sempre.
const PARTES = Math.max(1, Math.round(Number(process.env.PARTES || 1)));
if (PARTES > 1 && frames - f0 >= PARTES * fps) {
  await browser.close(); srv.close();
  await renderEmPartes({ fps, out, f0, frames, partes: PARTES });
  process.exit(0);
}
const enc = process.env.ALPHA ? ['-c:v', 'prores_ks', '-profile:v', '4444', '-pix_fmt', 'yuva444p10le'] : ['-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-pix_fmt', 'yuv420p', '-movflags', '+faststart'];
// SUB > 1: input runs at fps*SUB; tmix averages each run of SUB, select keeps the last of each group (= one whole group), setpts re-times to fps
const blur = SUB > 1 ? `tmix=frames=${SUB},select='eq(mod(n\\,${SUB})\\,${SUB - 1})',setpts=N/(${fps}*TB),` : '';
const ff = spawn('ffmpeg', ['-y', '-f', 'image2pipe', '-framerate', String(fps * SUB), '-i', '-', '-vf', `${blur}scale=${W}:${H}:flags=lanczos`, '-r', String(fps), ...enc, out], { stdio: ['pipe', 'ignore', 'inherit'] });
const terminou = new Promise(resolve => { ff.once('error', e=>resolve({error:e})); ff.once('close', code=>resolve({code})); });
for (let i = f0; i < frames; i++) {
  for (let k = 0; k < SUB; k++) {
    const b64 = await page.evaluate(async (t) => { await window.renderFrame(t); const c = [...document.querySelectorAll('canvas')].sort((a, b) => b.width * b.height - a.width * a.height)[0]; return c.toDataURL('image/png').split(',')[1]; }, (i + k / SUB) / fps / SLOW);
    if (!ff.stdin.write(Buffer.from(b64, 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
  }
  if (i % fps === 0) process.stdout.write(`\r${(i / fps).toFixed(0)}s / ${(duration * SLOW).toFixed(1)}s${SUB > 1 ? `  (SUB=${SUB})` : ''}`);
}
ff.stdin.end(); const resultado = await terminou; await browser.close(); srv.close();
if(resultado.error || resultado.code !== 0) throw new Error(`FFmpeg falhou: ${resultado.error?.message || resultado.code}`);
console.log(`\nwrote ${out}`);

async function renderEmPartes({ fps, out, f0, frames, partes }) {
  const { default: fs } = await import('node:fs');
  const { default: path } = await import('node:path');
  const ext = path.extname(out) || '.mp4', base = out.slice(0, out.length - ext.length);
  const limites = Array.from({ length: partes + 1 }, (_, k) => f0 + Math.round((frames - f0) * k / partes));
  const arquivos = limites.slice(0, -1).map((_, k) => `${base}.parte${k + 1}${ext}`);
  const roda = (cmd, argv, env) => new Promise((resolve, reject) => {
    const p = spawn(cmd, argv, { env: { ...process.env, ...env }, stdio: ['ignore', 'ignore', 'inherit'] });
    p.once('error', reject); p.once('close', code => code === 0 ? resolve() : reject(new Error(`${path.basename(cmd)} saiu com ${code}`)));
  });
  const ini = Date.now();
  console.log(`render em ${partes} partes: quadros ${f0}–${frames} a ${fps} fps`);
  try {
    await Promise.all(arquivos.map((arq, k) => roda(process.execPath, [process.argv[1], String(fps), arq],
      { PARTES: '1', START: String(limites[k] / fps), END: String(limites[k + 1] / fps) })
      .then(() => console.log(`  parte ${k + 1}/${partes} pronta (${((Date.now() - ini) / 1000).toFixed(0)} s)`))));
    const lista = `${base}.partes.txt`;
    fs.writeFileSync(lista, arquivos.map(a => `file '${path.resolve(a).replace(/\\/g, '/').replace(/'/g, "'\\''")}'`).join('\n') + '\n');
    await roda('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lista, '-c', 'copy',
      ...(ext === '.mp4' ? ['-movflags', '+faststart'] : []), out]);
    fs.rmSync(lista, { force: true });
  } finally {
    for (const a of arquivos) fs.rmSync(a, { force: true });
  }
  console.log(`wrote ${out} (${partes} partes, ${((Date.now() - ini) / 1000).toFixed(0)} s)`);
}
