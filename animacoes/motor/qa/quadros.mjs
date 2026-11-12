// Quadros de referência: captura quadros fixos de um filme (film.html com window.renderFrame) e,
// se houver uma referência, compara byte a byte. Serve para mudar o motor sem mudar o vídeo.
//
// Uso (rodar de dentro da pasta preparada do filme, a mesma do export.mjs):
//   node <motor>/qa/quadros.mjs gravar  <saida/>  [n=16]
//   node <motor>/qa/quadros.mjs comparar <referencia/> [n=16]
// env: W=540 H=960 (padrão), FILM=film.html
// A comparação diz quantos quadros são idênticos. Os diferentes ficam em <referencia>/../diferencas/.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';

const [modo, dir, nArg] = process.argv.slice(2);
if (!['gravar', 'comparar'].includes(modo) || !dir) {
  console.error('uso: node quadros.mjs gravar|comparar <pasta> [n=16]');
  process.exit(2);
}
const N = Number(nArg || 16);
const W = Number(process.env.W || 540), H = Number(process.env.H || 960);
const FILM = process.env.FILM || 'film.html';
const serveFile = fs.existsSync('serve.mjs') ? path.resolve('serve.mjs') : path.resolve(import.meta.dirname, '../take-one/serve.mjs');
const { serve } = await import(pathToFileURL(serveFile).href);

const { srv, url } = await serve('.');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: W, height: H } });
const erros = [];
page.on('pageerror', e => erros.push(String(e)));
await page.goto(url + '/' + FILM + (H > W ? '?portrait=1' : ''));
await page.waitForFunction(() => typeof window.renderFrame === 'function' && window.READY === true, null, { timeout: 120000 });
const dur = await page.evaluate(() => window.FILM_DURATION || 30);
// Tempos fixos e distribuídos, evitando o quadro 0 e o último.
const tempos = Array.from({ length: N }, (_, i) => Math.round(((i + 0.5) / N) * dur * 30) / 30);

const hash = b => createHash('sha256').update(b).digest('hex');
let iguais = 0;
const difs = [];
fs.mkdirSync(dir, { recursive: true });
for (const [i, t] of tempos.entries()) {
  const b64 = await page.evaluate(async (t) => { await window.renderFrame(t); const c = [...document.querySelectorAll('canvas')].sort((a, b) => b.width * b.height - a.width * a.height)[0]; return c.toDataURL('image/png').split(',')[1]; }, t);
  const png = Buffer.from(b64, 'base64');
  const nome = `q${String(i).padStart(2, '0')}-${t.toFixed(2)}s.png`;
  if (modo === 'gravar') { fs.writeFileSync(path.join(dir, nome), png); continue; }
  const ref = path.join(dir, nome);
  if (fs.existsSync(ref) && hash(fs.readFileSync(ref)) === hash(png)) { iguais++; continue; }
  const out = path.join(dir, '..', 'diferencas');
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, nome), png);
  difs.push(nome);
}
await browser.close(); srv.close();
if (erros.length) console.log('Erros na página:\n  ' + erros.slice(0, 5).join('\n  '));
if (modo === 'gravar') console.log(`${N} quadros gravados em ${dir} (duração ${dur.toFixed(2)} s)`);
else {
  console.log(`${iguais} de ${N} quadros idênticos à referência (duração ${dur.toFixed(2)} s)`);
  if (difs.length) { console.log('Diferentes: ' + difs.join(', ')); process.exitCode = 1; }
}
