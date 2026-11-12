// Folha de personagem do Kauã: poses e expressões, ao lado do Tico e do Júnior para escala.
// Uso (de animacoes/): node series/se-vira-tico/demitido-gta6/arte/ficha-kaua.mjs
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const R = require(path.resolve(aqui, '../../../../motor/personagem/chars.js'));
const { CHARS, drawChar } = R;

const cel = (d, pose, rotulo) => `<div class="c"><svg viewBox="-170 -720 340 750" width="230" height="507">${drawChar(d, pose)}</svg><p>${rotulo}</p></div>`;
const linha1 = [
  cel(CHARS.kaua, { expr: 'neutro' }, 'Kauã · neutro'),
  cel(CHARS.kaua, { expr: 'cansado', armL: [-20, -60], armR: [20, 60] }, 'cansado (3h da manhã)'),
  cel(CHARS.kaua, { expr: 'feliz', armR: [150, 30] }, '"BRABOOO"'),
  cel(CHARS.kaua, { expr: 'surpreso', armL: [-40, -100], armR: [40, 100] }, 'o e-mail'),
  cel(CHARS.kaua, { expr: 'preocupado', propR: 'phone', armR: [140, -10] }, 'digitando...'),
].join('');
const linha2 = [
  cel(CHARS.tico, { expr: 'neutro' }, 'Tico (escala)'),
  cel(CHARS.kaua, { expr: 'envergonhado' }, 'Kauã · envergonhado'),
  cel(CHARS.junior, { expr: 'feliz' }, 'Júnior (escala)'),
].join('');
const html = `<!doctype html><meta charset="utf-8"><style>
body{margin:0;background:#f4efe6;font-family:Arial,sans-serif}
h1{font-size:26px;margin:16px 24px 0} .r{display:flex;gap:6px;padding:8px 16px}
.c{background:#fff;border-radius:12px;padding:6px;text-align:center} p{margin:2px 0 6px;font-size:15px}
</style><h1>Kauã, 21 — "Demitido Antes do GTA" · ficha para aprovação</h1><div class="r">${linha1}</div><div class="r">${linha2}</div>`;

const b = await chromium.launch({ channel: 'chrome', headless: true });
const pg = await b.newPage({ viewport: { width: 1260, height: 1100 } });
await pg.setContent(html);
const saida = path.join(aqui, 'kaua-ficha.png');
await pg.screenshot({ path: saida, fullPage: true });
await b.close();
console.log(saida);
