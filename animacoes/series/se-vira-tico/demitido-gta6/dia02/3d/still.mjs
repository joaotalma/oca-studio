// Quadros avulsos da amostra 3D: node still.mjs <filme.html> <saida-dir> <t1,t2,...>
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import { serve } from './serve.mjs';
const [filme, saida, ts] = process.argv.slice(2);
fs.mkdirSync(saida, { recursive: true });
const { srv, url } = await serve('.');
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) console.log('[página]', m.text()); });
page.on('pageerror', (e) => console.log('[erro]', e.message));
await page.goto(url + '/' + filme);
await page.waitForFunction(() => window.READY === true, null, { timeout: 60000 });
for (const t of ts.split(',').map(Number)) {
  const b64 = await page.evaluate(async (t) => { await window.renderFrame(t); return document.querySelector('canvas').toDataURL('image/png').split(',')[1]; }, t);
  fs.writeFileSync(`${saida}/t${String(t).replace('.', '_')}.png`, Buffer.from(b64, 'base64'));
}
await browser.close(); srv.close(); console.log('ok');
