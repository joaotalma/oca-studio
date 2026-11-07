import { chromium } from 'playwright-core';
import fs from 'node:fs';
import { serve } from './serve.mjs';
const [saida, lista] = process.argv.slice(2);
fs.mkdirSync(saida, { recursive: true });
const { srv, url } = await serve('.');
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: 540, height: 960 } });
const errs = []; p.on('pageerror', (e) => errs.push(e.message));
await p.goto(url + '/film.html');
await p.waitForFunction(() => window.READY === true && typeof window.renderFrame === 'function', null, { timeout: 30000 }).catch(() => {});
if (errs.length) { console.log('ERROS', errs.slice(0, 4)); await b.close(); srv.close(); process.exit(1); }
console.log('dur', await p.evaluate(() => window.FILM_DURATION));
let i = 0;
for (const t of lista.split(',').map(Number)) {
  const d = await p.evaluate(async (t) => { await window.renderFrame(t); return document.querySelector('canvas').toDataURL('image/jpeg', .8).split(',')[1]; }, t);
  fs.writeFileSync(`${saida}/q${String(i++).padStart(3, '0')}.jpg`, Buffer.from(d, 'base64'));
}
console.log('erros', errs.length, errs.slice(0, 3)); await b.close(); srv.close();
