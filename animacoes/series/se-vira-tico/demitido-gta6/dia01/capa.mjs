// Capa do Dia 1 (1080x1920). Quadro do próprio filme, sem legenda, com o título dentro da faixa 3:4
// (y de 240 a 1680), que é a parte que a grade do perfil mostra.
// Uso (de series/se-vira-tico/, com a pasta já preparada por scripts/preparar-film.sh): node demitido-gta6/dia01/capa.mjs
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
const aqui = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.resolve(aqui, '../../../../package.json'));
const { chromium } = require('playwright-core');
const { serve } = await import(pathToFileURL(path.join(aqui, 'serve.mjs')).href);
const render = path.resolve(aqui, '../../render/demitido-gta6');
const T = 2.4; // close do Kauã com o controle

const { srv, url } = await serve(aqui);
const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto(url + '/film.html?portrait=1');
await p.waitForFunction(() => typeof window.renderFrame === 'function' && window.READY === true);
const fundo = await p.evaluate(async (t) => { EPISODIO.falas.forEach((f) => { f.semLegenda = true; }); await window.renderFrame(t); return document.querySelector('canvas').toDataURL('image/jpeg', .92); }, T);
srv.close();
const html = `<!doctype html><meta charset="utf-8"><style>
body{margin:0;width:1080px;height:1920px;position:relative;font-family:'Arial Black',Arial,sans-serif;overflow:hidden}
img{position:absolute;inset:0;width:1080px;height:1920px}
.faixa{position:absolute;left:0;right:0;top:1060px;text-align:center}
.dia{display:inline-block;background:#ffd83a;color:#1b1d24;font-size:84px;padding:4px 36px;border-radius:22px;border:8px solid #1b1d24;transform:rotate(-3deg)}
.t{color:#fff;font-size:112px;line-height:1.0;margin-top:18px;-webkit-text-stroke:10px #1b1d24;paint-order:stroke fill}
.t b{color:#ffd83a}
.sub{display:inline-block;margin-top:22px;background:#1b1d24e6;color:#fff;font-size:50px;padding:12px 30px;border-radius:20px}
.sub em{color:#5fd0a8;font-style:normal}
</style><img src="${fundo}"><div class="faixa"><div class="dia">DIA 1</div><div class="t">DEMITIDO ANTES<br>DO <b>GTA 6</b></div><div class="sub">Saldo: <em>R$ 3,20</em> · faltam 6 dias</div></div>`;
await p.setContent(html);
const saida = path.join(render, 'dia01_capa.png');
await p.screenshot({ path: saida });
await b.close();
console.log(saida);
