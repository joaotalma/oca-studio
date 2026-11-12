// Capa autoral do Dia 1: GTA 6 domina, sem usar o logotipo ou imagens do jogo.
// Usa o próprio rig do Kauã; não altera o episódio nem renderiza o MP4.
// Uso: node demitido-gta6/dia01/capa.mjs (de series/se-vira-tico/)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
const aqui = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.resolve(aqui, '../../../../package.json'));
const { chromium } = require('playwright-core');
const { serve } = await import(pathToFileURL(path.join(aqui, 'serve.mjs')).href);
const render = path.resolve(aqui, '../../render/demitido-gta6');
const entrega = path.resolve(aqui, '../../../../entregas/demitido-antes-do-gta/dia01/instagram/capa.png');
fs.mkdirSync(render,{recursive:true});
const { srv, url } = await serve(aqui);
const browser = await chromium.launch({channel:'chrome',headless:true});
try {
 const page=await browser.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url+'/film.html?portrait=1');
 await page.waitForFunction(()=>typeof window.renderFrame==='function' && window.READY===true);
 const ator=await page.evaluate(()=>{
   const x=488,y=1810,s=2.15,alvo=[490,1080];
   const pose={armL:[-50,70],armR:[50,-70],expr:'preocupado',look:[5,1],head:-3,mouth:'small',blink:0,breath:0};
   const original=controle(alvo[0],alvo[1],1.45,2.4);
   // Na miniatura, omitir os gatilhos soltos: parecem peças de um braço em escala pequena.
   const corpo=original.indexOf('<path d="M-120 -30');
   if(corpo<0)throw new Error('Corpo do controle não encontrado');
   const controleCapa=original.slice(0,original.indexOf('>')+1)+original.slice(corpo);
   return `<g transform="translate(${x} ${y}) scale(${s})">${drawChar(CHARS.kaua,pose)}</g>`+controleCapa;
 });
 // Palmeira desenhada para esta capa, não um asset extraído da marca.
 const palma=`<path d="M0 390 Q28 185 4 0" fill="none" stroke="currentColor" stroke-width="18"/><path d="M4 0 Q-124 -94 -190 4 Q-89 -32 -10 13 Q-121 -3 -139 97 Q-57 42 3 21 Q58 -35 153 21 Q106 -64 14 -9 Q92 -114 170 -65 Q76 -139 4 -20 Q-39 -106 -111 -71 Q-57 -57 4 0Z" fill="currentColor"/>`;
 const html=`<!doctype html><meta charset="utf-8"><style>
 *{box-sizing:border-box}body{margin:0;width:1080px;height:1920px;position:relative;overflow:hidden;background:#aa79b5;font-family:'Arial Black',Arial,sans-serif}
 .fundo{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 42%,#ffe2b2 0%,#f5b7b8 28%,transparent 60%),linear-gradient(180deg,#705dba 0%,#ce83bf 17%,#ffbda5 49%,#b37db6 74%,#332a60 100%)}
 .sol{position:absolute;left:105px;top:455px;width:870px;height:870px;border-radius:50%;background:linear-gradient(#ffecc2c9,#ffcfb23d);box-shadow:0 0 150px #ffd1ac66}
 svg{position:absolute;inset:0;width:1080px;height:1920px}
 .titulo{position:absolute;left:70px;right:70px;top:270px;text-align:center;color:#fff9ef;font-size:102px;letter-spacing:-5px;line-height:1.05;-webkit-text-stroke:12px #322246;paint-order:stroke fill;filter:drop-shadow(0 8px 0 #32224650)}
 .titulo span{display:block;font-size:58px;letter-spacing:5px;margin-top:14px}
 .dia{position:absolute;top:440px;right:84px;color:#322246;font-size:35px;letter-spacing:2px;background:#fff4d7;padding:9px 23px;border:5px solid #322246;border-radius:14px;transform:rotate(4deg)}
 .saldo{position:absolute;top:1510px;left:110px;right:110px;background:#2b2348;border:5px solid #fff0dd;border-radius:26px;padding:20px 15px;text-align:center;color:#fff6e7;font-size:48px;line-height:1.05;box-shadow:0 12px 0 #35264d33}
 .saldo strong{color:#ffd79d;font-size:70px;letter-spacing:-2px}
 .linha{position:absolute;top:1641px;width:100%;text-align:center;color:#fff0dc;font-size:30px;letter-spacing:4px}
 </style><div class="fundo"></div><div class="sol"></div>
 <svg viewBox="0 0 1080 1920" aria-hidden="true"><g color="#73578b" opacity=".48" transform="translate(70 770) scale(1.8) rotate(-15)">${palma}</g><g color="#624e85" opacity=".48" transform="translate(1005 640) scale(1.7) rotate(12)">${palma}</g>
 <g fill="#625582" opacity=".24"><path d="M0 1550V1150H60V1100H115V1200H180V1110H245V1230H320V1080H385V1180H445V1250H510V1140H590V1190H665V1120H720V1210H800V1070H885V1180H970V1090H1080V1920H0Z"/></g>
 <g style="filter:drop-shadow(11px 13px 0 #51344c33)">${ator}</g></svg>
 <div class="titulo">DEMITIDO<span>ANTES DO</span></div><div class="dia">DIA 1</div>
 <svg viewBox="0 0 1080 1920" role="img" aria-label="GTA 6"><defs>
 <linearGradient id="sunset6" x1="0" x2="0.12" y1="0" y2="1"><stop offset="0" stop-color="#ffe2b0"/><stop offset=".35" stop-color="#ff9ebd"/><stop offset=".66" stop-color="#d789cc"/><stop offset="1" stop-color="#9675d5"/></linearGradient>
 <clipPath id="seis"><text x="670" y="1460" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="445" textLength="302" lengthAdjust="spacingAndGlyphs">6</text></clipPath>
 </defs>
 <g transform="rotate(-3 540 1320)" font-family="Arial Black,Arial,sans-serif" font-weight="900" stroke-linejoin="round" paint-order="stroke fill">
 <text x="73" y="1451" font-size="310" textLength="594" lengthAdjust="spacingAndGlyphs" fill="#fff9ee" stroke="#30213f" stroke-width="29">GTA</text>
 <text x="670" y="1460" font-size="445" textLength="302" lengthAdjust="spacingAndGlyphs" fill="url(#sunset6)" stroke="#30213f" stroke-width="34">6</text>
 <text x="670" y="1460" font-size="445" textLength="302" lengthAdjust="spacingAndGlyphs" fill="url(#sunset6)" stroke="#fff6e7" stroke-width="12">6</text>
 <g clip-path="url(#seis)" color="#76509f" opacity=".7"><g transform="translate(858 1300) scale(.72)">${palma}</g></g></g></svg>
 <div class="saldo">ELE SÓ TEM <strong>R$ 3,20</strong></div>`;
 await page.setContent(html);await page.evaluate(()=>document.fonts.ready);
 if(errors.length)throw new Error(errors.join('\n'));
 const saida=path.join(render,'dia01_capa.png');
 await page.screenshot({path:saida});
 fs.copyFileSync(saida,entrega);
 console.log(saida+'\n'+entrega);
} finally {await browser.close();srv.closeAllConnections?.();await new Promise(resolve=>srv.close(resolve));}
