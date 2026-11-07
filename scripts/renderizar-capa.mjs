// Gera a capa de um episódio a partir de episodios/<ep>/capa.html.
// Uso: node scripts/renderizar-capa.mjs ep01 render/ep01_capa.png
import { chromium } from 'playwright-core';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const [ep = 'ep01', saida = `render/${ep}_capa.png`] = process.argv.slice(2);
const pagina = pathToFileURL(path.resolve('episodios', ep, 'capa.html')).href;

const navegador = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const aba = await navegador.newPage({ viewport: { width: 1080, height: 1920 } });
  aba.on('pageerror', (e) => { console.error(e.message); process.exitCode = 1; });
  await aba.goto(pagina);
  await aba.waitForFunction(() => window.READY === true);
  await aba.screenshot({ path: saida, type: 'png' });
  console.log('capa:', saida);
} finally {
  await navegador.close();
}
