// Render em partes (export.mjs PARTES=N): mesmo número de quadros e mesmas imagens do render sequencial.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const motor = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const raiz = path.resolve(motor, '..');

// Filme mínimo: cada quadro depende só de t, como os filmes reais.
const FILME = `<!doctype html><canvas id=c width=64 height=96></canvas><script>
const g=document.getElementById('c').getContext('2d');
window.FILM_DURATION=2;
window.renderFrame=async t=>{g.fillStyle='hsl('+(t*170%360)+',70%,50%)';g.fillRect(0,0,64,96);
  g.fillStyle='#fff';g.fillRect((t*25)%64,40,10,10);};
window.READY=true;</script>`;

const temFfmpeg = () => {
  try { return spawnSync('ffmpeg', ['-version']).status === 0; } catch { return false; }
};

test('render em partes tem os mesmos quadros do sequencial', { skip: !temFfmpeg() && 'sem ffmpeg', timeout: 120000 }, t => {
  // Dentro de animacoes/ para o playwright-core resolver; .tmp/ fica fora do git.
  fs.mkdirSync(path.join(raiz, '.tmp'), { recursive: true });
  const dir = fs.mkdtempSync(path.join(raiz, '.tmp', 'partes-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.writeFileSync(path.join(dir, 'film.html'), FILME);
  for (const f of ['export.mjs', 'serve.mjs']) fs.copyFileSync(path.join(motor, 'take-one', f), path.join(dir, f));
  const roda = (saida, partes) => spawnSync(process.execPath, ['export.mjs', '10', saida],
    { cwd: dir, env: { ...process.env, W: '64', H: '96', PARTES: String(partes) }, encoding: 'utf8' });
  const a = roda('seq.mp4', 1), b = roda('par.mp4', 2);
  if (/Executable doesn't exist|chrome.*not found/i.test(a.stderr + a.stdout)) return t.skip('sem Chrome');
  assert.equal(a.status, 0, a.stderr); assert.equal(b.status, 0, b.stderr);
  const quadros = f => Number(spawnSync('ffprobe', ['-v', 'error', '-count_frames', '-select_streams', 'v', '-show_entries',
    'stream=nb_read_frames', '-of', 'csv=p=0', f], { cwd: dir, encoding: 'utf8' }).stdout.trim());
  assert.equal(quadros('par.mp4'), 20);
  assert.equal(quadros('seq.mp4'), quadros('par.mp4'));
  assert.ok(!fs.readdirSync(dir).some(f => /\.parte\d|\.partes\.txt$/.test(f)), 'sobraram arquivos de parte');
  const psnr = spawnSync('ffmpeg', ['-i', 'seq.mp4', '-i', 'par.mp4', '-lavfi', 'psnr', '-f', 'null', '-'], { cwd: dir, encoding: 'utf8' }).stderr;
  const min = Number((psnr.match(/min:([\d.]+|inf)/) || [])[1]?.replace('inf', '99'));
  assert.ok(min >= 40, `PSNR mínimo ${min} dB: as partes não batem com o sequencial`);
});
