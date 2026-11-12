// Imagens-âncora: captura quadros em tempos escolhidos e monta uma folha para aprovação.
// Uso (de dentro da pasta preparada do filme):
//   node <motor>/qa/ancoras.mjs <saida.png> t1,t2,t3,... [colunas=5]
// env: W=540 H=960. Erros da página saem no console.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';

const [saida, lista, colArg] = process.argv.slice(2);
if (!saida || !lista) { console.error('uso: node ancoras.mjs <saida.png> t1,t2,... [colunas]'); process.exit(2); }
const tempos = lista.split(',').map(Number), COL = Number(colArg || 5);
const W = Number(process.env.W || 540), H = Number(process.env.H || 960);
const serveFile = fs.existsSync('serve.mjs') ? path.resolve('serve.mjs') : path.resolve(import.meta.dirname, '../take-one/serve.mjs');
const { serve } = await import(pathToFileURL(serveFile).href);
const { srv, url } = await serve('.');
const b = await chromium.launch({ channel: 'chrome', headless: true });
const pg = await b.newPage({ viewport: { width: W, height: H } });
const erros = [];
pg.on('pageerror', (e) => erros.push(String(e)));
pg.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') erros.push(m.text()); });
await pg.goto(url + '/film.html?portrait=1');
await pg.waitForFunction(() => typeof window.renderFrame === 'function' && window.READY === true, null, { timeout: 120000 });
const imgs = [];
for (const t of tempos) {
  const b64 = await pg.evaluate(async (t) => { await window.renderFrame(t); return [...document.querySelectorAll('canvas')].sort((a, b) => b.width * b.height - a.width * a.height)[0].toDataURL('image/jpeg', .85); }, t);
  imgs.push({ t, b64 });
}
const html = `<body style="margin:0;background:#222;font-family:Arial"><div style="display:grid;grid-template-columns:repeat(${COL},${W / 2}px);gap:6px;padding:6px">` +
  imgs.map(({ t, b64 }) => `<div style="color:#fff;font-size:14px"><img src="${b64}" width="${W / 2}" height="${H / 2}"><div>${t.toFixed(1)} s</div></div>`).join('') + '</div></body>';
await pg.setViewportSize({ width: COL * (W / 2 + 6) + 6, height: 400 });
await pg.setContent(html);
await pg.screenshot({ path: saida, fullPage: true });
await b.close(); srv.close();
console.log(saida);
if (erros.length) console.log('Avisos e erros da página:\n  ' + [...new Set(erros)].slice(0, 10).join('\n  '));
