'use strict';
// Se Vira, Tico: cenários e objetos em SVG. Carregar depois de chars.js.
// Cada cenário devolve camadas [{ f, svg }]: f é o fator de paralaxe (1 = acompanha a câmera por inteiro).
// O mundo tem 1080 x 1920, com o chão em CHAO.
const CHAO = 1590;
const FONTE = 'Arial Black, Arial, sans-serif';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ret = (x, y, w, h, fill, rx = 0, sw = T) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${sw ? OUT : 'none'}" stroke-width="${sw}"/>`;
const txt = (x, y, s, tam, fill = OUT, anc = 'middle', rot = 0) => `<text x="${x}" y="${y}" font-family="${FONTE}" font-size="${tam}" font-weight="900" fill="${fill}" text-anchor="${anc}"${rot ? ` transform="rotate(${rot} ${x} ${y})"` : ''}>${esc(s)}</text>`;
const placa = (x, y, w, h, fill, linhas, tam = 28, cor = OUT, rot = 0) => `<g${rot ? ` transform="rotate(${rot} ${x + w / 2} ${y + h / 2})"` : ''}>` + ret(x, y, w, h, fill, 4) + linhas.map((l, i) => txt(x + w / 2, y + (h - (linhas.length - 1) * tam * 1.2) / 2 + tam * .36 + i * tam * 1.2, l, tam, cor)).join('') + '</g>';
const reboco = (pts, cor) => pts.map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="9" fill="${cor}"/>`).join('');

/* ---------- objetos ---------- */
function pneuSVG(x, y, r, murcho, giro = 0) {
  if (murcho) {
    // Aro quase no chão, com a borracha achatada embaixo e um rasgo com tiras soltas.
    const cy = y + r * .28, ch = y + r * .92;
    return shape(`M${x - r * 1.5} ${ch + r * .08} Q${x - r * 1.35} ${ch - r * .3} ${x - r * .85} ${ch - r * .22} Q${x - r * .55} ${ch - r * .34} ${x - r * .3} ${ch - r * .16} Q${x + r * .1} ${ch - r * .32} ${x + r * .45} ${ch - r * .16} Q${x + r * .85} ${ch - r * .34} ${x + r * 1.2} ${ch - r * .18} Q${x + r * 1.55} ${ch - r * .1} ${x + r * 1.5} ${ch + r * .08}Z`, '#26262b')
      + `<circle cx="${x}" cy="${cy}" r="${r * .78}" fill="#26262b" stroke="${OUT}" stroke-width="${T}"/><circle cx="${x}" cy="${cy}" r="${r * .6}" fill="#a7adb5" stroke="${OUT}" stroke-width="${T}"/><circle cx="${x}" cy="${cy}" r="${r * .14}" fill="#3a3a40"/>`
      + `<path d="M${x - r * .5} ${cy} L${x + r * .5} ${cy} M${x} ${cy - r * .5} L${x} ${cy + r * .5}" stroke="#6c727a" stroke-width="${r * .08}"/>`
      + shape(`M${x - r * .35} ${cy - r * .68} L${x - r * .1} ${cy - r * 1.12} L${x + r * .05} ${cy - r * .78} L${x + r * .32} ${cy - r * 1.05} L${x + r * .38} ${cy - r * .66}Z`, '#26262b')
      + stroke(`M${x + r * .68} ${cy - r * .4} l${r * .4} ${-r * .18} M${x - r * .7} ${cy - r * .38} l${-r * .34} ${-r * .24}`, '#26262b', r * .13);
  }
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="#26262b" stroke="${OUT}" stroke-width="${T}"/><circle cx="${x}" cy="${y}" r="${r * .55}" fill="#8a9099" stroke="${OUT}" stroke-width="${T}"/><g transform="rotate(${giro} ${x} ${y})"><path d="M${x - r * .5} ${y} L${x + r * .5} ${y} M${x} ${y - r * .5} L${x} ${y + r * .5}" stroke="#3a3a40" stroke-width="${r * .08}"/></g><circle cx="${x}" cy="${y}" r="${r * .15}" fill="#3a3a40"/>`;
}
function motoSVG(x, y, s, o = {}) {
  const r = 72, chao = -r, tras = o.furado ? -r * .35 : chao;
  return `<g transform="translate(${x} ${y}) scale(${s})">`
    + pneuSVG(-170, -r, r, o.furado, o.giro || 0) + pneuSVG(180, -r, r, false, o.giro || 0)
    + `<g transform="rotate(${o.furado ? -3.5 : 0} 180 -72)">`
    + shape('M-170 -80 L-60 -170 L90 -170 L180 -72 L150 -60 L60 -130 L-60 -130 L-150 -66Z', '#55606c')
    + shape('M-110 -175 Q-120 -215 -40 -212 L40 -205 L50 -170 L-60 -165Z', '#ae5d49')
    + shape('M30 -235 Q110 -245 120 -180 Q80 -160 30 -165Z', '#c9412f')
    + `<g transform="translate(74 -198)">` + txt(0, 6, 'Companheira', 15, '#fff3d6') + `</g>`
    + stroke('M116 -180 L160 -260 L132 -282', OUT, 12) + stroke('M116 -180 L160 -260 L132 -282', '#8a9099', 6)
    + ell(172, -232, 18, 22, '#f2d36b', OUT, T)
    + shape('M-60 -128 L60 -128 L50 -92 L-46 -92Z', '#3a3a40')
    + '</g></g>';
}
function bagAbertaSVG(x, y, s, conteudo = '') {
  return `<g transform="translate(${x} ${y}) scale(${s})">` + shape('M-140 -120 L140 -120 L160 -240 L-160 -240Z', '#7c1f2b') + conteudo + shape('M-150 -130 L150 -130 L135 30 L-135 30Z', '#b3303c') + `<rect x="-142" y="-40" width="284" height="14" fill="#e3c04a"/>` + '</g>';
}
function bagFechadaSVG(x, y, s) {
  return `<g transform="translate(${x} ${y}) scale(${s})">` + shape('M-150 -240 L150 -240 L135 30 L-135 30Z', '#b3303c') + `<rect x="-145" y="-40" width="290" height="14" fill="#e3c04a"/>` + stroke('M-150 -190 L150 -190', '#7c1f2b', 4) + '</g>';
}
function boloSVG(x, y, s, velaAcesa, comFatia = true) {
  const chama = velaAcesa ? shape('M0 -112 Q10 -96 0 -84 Q-10 -96 0 -112Z', '#f2b632', 1.6) : '';
  return `<g transform="translate(${x} ${y}) scale(${s})">`
    + shape('M-120 8 L120 8 L128 24 L-128 24Z', '#d8d4d0')
    + shape('M-108 -60 Q-108 -74 -88 -74 L88 -74 Q108 -74 108 -60 L108 8 L-108 8Z', '#fdf1dd')
    + shape('M-108 -60 Q-108 -74 -88 -74 L88 -74 Q108 -74 108 -60 Q90 -36 70 -56 Q40 -30 10 -54 Q-20 -32 -48 -54 Q-80 -32 -108 -60Z', '#e8736f')
    + txt(0, -20, 'Feliz 80 anos,', 18, '#814538') + txt(0, 2, 'Marlene', 22, '#814538')
    + ret(-5, -84, 10, 24, '#7fd6ee', 2, 1.8) + chama + '</g>';
}
function balaoPalavraoSVG(x, y) {
  return `<g transform="translate(${x} ${y})">` + shape('M-210 -70 Q-210 -110 -170 -110 L170 -110 Q210 -110 210 -70 L210 20 Q210 60 170 60 L30 60 L-10 104 L-20 60 L-170 60 Q-210 60 -210 20Z', '#fff') + txt(0, 0, '@*#&(*!@&#!', 50, '#c23b3b') + '</g>';
}
function lampadaSVG(x, y, p) {
  const r = 58 * p;
  return `<g transform="translate(${x} ${y})">` + [0, 1, 2, 3, 4, 5, 6].map((i) => { const a = -150 + i * 20; const c = Math.cos(a * Math.PI / 180), n = Math.sin(a * Math.PI / 180); return stroke(`M${c * r * 1.25} ${n * r * 1.25} L${c * r * 1.7} ${n * r * 1.7}`, '#f2d36b', 7); }).join('') + `<circle r="${r}" fill="#f2d36b" stroke="${OUT}" stroke-width="${T}"/>` + ret(-20 * p, 50 * p, 40 * p, 30 * p, '#8a9099', 4) + '</g>';
}
function estouroSVG(x, y, p) {
  const pts = []; for (let i = 0; i < 16; i++) { const a = i / 16 * 6.283, r = (i % 2 ? 60 : 130) * p; pts.push(`${(x + Math.cos(a) * r).toFixed(1)} ${(y + Math.sin(a) * r).toFixed(1)}`); }
  return shape('M' + pts.join('L') + 'Z', '#f2d36b') + txt(x, y + 18, 'POW!', 52 * p, '#c23b3b');
}
function placaCrushSVG(x, y) {
  return `<g transform="translate(${x} ${y})">` + stroke('M-70 -170 L-70 -80 M70 -170 L70 -80', OUT, 5) + ret(-210, -80, 420, 90, '#f2d36b', 8) + txt(0, -20, 'Crush de infância', 40, OUT) + shape('M-20 16 L20 16 L20 44 L44 44 L0 92 L-44 44 L-20 44Z', '#c23b3b') + '</g>';
}
function interfoneSVG(x, y, s, fala) {
  return `<g transform="translate(${x} ${y}) scale(${s})">` + ret(-58, -100, 116, 200, '#c7cbd0', 10) + [-50, -30, -10].map((yy) => stroke(`M-34 ${yy} L34 ${yy}`, OUT, 5)).join('') + ell(0, 42, 21, 21, '#b3303c', OUT, T)
    + (fala ? [0, 1, 2].map((i) => `<path d="M${74 + i * 22} -48 Q${94 + i * 26} -10 ${74 + i * 22} 30" fill="none" stroke="#f2d36b" stroke-width="8" stroke-linecap="round"/>`).join('') : '') + '</g>';
}
function notasSVG(x, y, t) {
  return [0, 1, 2].map((i) => { const f = (t * .9 + i * .33) % 1; return `<g transform="translate(${x + i * 70 + Math.sin(f * 6) * 12} ${y - f * 180})" opacity="${(1 - f).toFixed(2)}">` + txt(0, 0, '♪', 60, '#f2d36b') + '</g>'; }).join('');
}

/* ---------- visão do guidão ---------- */
const FUGA = [540, 900];
function estradaSVG(t, ceu = '#f4a65a', sol = [760, 620], solCor = '#f7d774') {
  const prof = (p) => p * p, ALT = 1020;
  let s = `<rect x="-200" y="-200" width="1480" height="1300" fill="${ceu}"/>` + (sol ? ell(sol[0], sol[1], 90, 90, solCor) : '')
    + `<rect x="-200" y="${FUGA[1]}" width="1480" height="1200" fill="#8f8a84"/>`
    + `<path d="M${FUGA[0] - 8} ${FUGA[1]} L${FUGA[0] + 8} ${FUGA[1]} L1500 2000 L-420 2000Z" fill="#55535a"/>`;
  for (let i = 0; i < 8; i++) {
    const p = (t * 1.3 + i / 8) % 1, a = prof(p), b = prof(Math.min(1, p + .055));
    const ya = FUGA[1] + ALT * a, yb = FUGA[1] + ALT * b, la = 2 + 22 * a, lb = 2 + 22 * b;
    s += `<path d="M${540 - la} ${ya.toFixed(1)} L${540 + la} ${ya.toFixed(1)} L${540 + lb} ${yb.toFixed(1)} L${540 - lb} ${yb.toFixed(1)}Z" fill="#f2d36b"/>`;
  }
  const itens = [];
  for (let i = 0; i < 14; i++) itens.push({ i, p: (t * .85 + i / 14) % 1 });
  itens.sort((x, y) => x.p - y.p);
  for (const { i, p } of itens) {
    const lado = i % 2 ? 1 : -1, k = prof(p) * 2.4 + .02, x = 540 + lado * 620 * k, y = FUGA[1] + ALT * prof(p);
    const op = Math.min(1, p / .12).toFixed(2), tipo = i % 7;
    let g = '';
    if (tipo === 3) g = ret(-8, -520, 16, 520, '#55606c', 0) + ret(-90, -420, 180, 110, '#fff6e6', 4);
    else if (tipo === 5) g = ret(-10, -560, 20, 560, '#55606c', 0) + stroke('M0 -560 Q-70 -590 -130 -560', '#55606c', 12) + ell(-130, -552, 24, 13, '#f2d36b', OUT, 2);
    else { const w = 300 + (i * 37) % 90, h = 620 + (i * 53) % 280, cor = i % 3 ? '#d9a860' : '#c48a4e'; g = ret(-w / 2, -h, w, h, cor, 0, 3); for (let a = 0; a < 3; a++) for (let b = 0; b < 5; b++) g += `<rect x="${-w / 2 + 26 + a * (w - 34) / 3}" y="${-h + 34 + b * (h - 60) / 5}" width="44" height="66" fill="${(a + b * 2 + i) % 3 ? '#8a5a2e' : '#f2d36b'}"/>`; }
    s += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${k.toFixed(3)})" opacity="${op}">${g}</g>`;
  }
  return s;
}
function guidaoFundoSVG() {
  const lado = (s) => `<g transform="translate(540 0) scale(${s} 1)">`
    + stroke('M90 1500 Q260 1470 390 1420', OUT, 44) + stroke('M90 1500 Q260 1470 390 1420', '#8a9099', 34)
    + stroke('M385 1422 L515 1372', OUT, 66) + stroke('M385 1422 L515 1372', '#26262b', 54) + '</g>';
  return lado(1) + lado(-1);
}
function guidaoFrenteSVG() {
  const espelho = (s) => `<g transform="translate(540 0) scale(${s} 1)">` + stroke('M410 1390 L470 950', OUT, 14) + stroke('M410 1390 L470 950', '#8a9099', 8) + `<ellipse cx="475" cy="880" rx="70" ry="90" fill="#26262b" stroke="${OUT}" stroke-width="${T}"/><ellipse cx="475" cy="880" rx="54" ry="74" fill="#c9dfe6"/>` + '</g>';
  return espelho(1) + espelho(-1)
    + shape('M150 2000 Q170 1560 350 1500 Q540 1450 730 1500 Q910 1560 930 2000Z', '#c9412f')
    + `<circle cx="540" cy="1560" r="62" fill="#fff6e6" stroke="${OUT}" stroke-width="${T}"/>` + stroke('M540 1560 L580 1530', '#c23b3b', 6) + txt(540, 1600, 'km/h', 18, OUT);
}

/* ---------- cenários ---------- */
function predios(cor1, cor2, janela, ceu) {
  let s = `<rect x="-700" y="-300" width="3600" height="2300" fill="${ceu}"/>`;
  const pr = [[-500, 520, 300, cor1], [-180, 300, 280, cor2], [120, 460, 250, cor1], [390, 240, 300, cor2], [710, 400, 280, cor1], [1010, 280, 320, cor2], [1350, 500, 320, cor1], [1690, 330, 300, cor2], [2010, 450, 300, cor1]];
  for (const [x, y, w, c] of pr) { s += ret(x, y, w, 1400, c, 0, 0); for (let i = 0; i < 4; i++) for (let j = 0; j < 8; j++) s += `<rect x="${x + 24 + i * (w - 40) / 4}" y="${y + 30 + j * 96}" width="34" height="56" fill="${janela[(i * 3 + j * 5) % janela.length]}"/>`; }
  return s;
}
const FIOS = `<path d="M-700 430 Q300 500 2800 390 M-700 480 Q300 560 2800 440" fill="none" stroke="#2a1f22" stroke-width="4"/>`;
function cenaRua(comBorracharia = false, noite = false) {
  const fundo = noite ? predios('#2c3a4f', '#233044', ['#f2d36b', '#1b2533', '#1b2533'], '#18223a') : predios('#d9a860', '#c48a4e', ['#f2d36b', '#8a5a2e', '#8a5a2e'], '#f4a65a');
  const meio = FIOS
    + ret(-40, 780, 30, 830, '#55606c', 0) + placa(-120, 840, 190, 110, '#fff6e6', ['Trago a pessoa', 'amada em 3x', 'no Pix'], 18)
    + ret(90, 1050, comBorracharia ? 720 : 2400, 560, '#e6b98a', 0) + reboco([[120, 1110, 90, 44], [420, 1190, 120, 50], [640, 1300, 90, 40], [230, 1380, 110, 44], [1050, 1160, 110, 46], [1400, 1330, 100, 44], [1800, 1200, 120, 50]], '#cf9c6f')
    + placa(620, 1120, 170, 90, '#f2d36b', ['Previsão de', 'entrega: 2009'], 18)
    + (comBorracharia ? ret(850, 960, 500, 650, '#3aa39f', 0) + ret(900, 1160, 360, 450, '#2d2a2c', 0)
      + placa(860, 980, 450, 150, '#f2d36b', ['BORRACHARIA', 'Pneu: R$ 120', 'Fiado só amanhã'], 34)
      + pneuSVG(960, 1510, 64) + pneuSVG(1110, 1520, 58) : placa(1500, 1120, 240, 90, '#fff6e6', ['Aluga-se', 'kitnet: R$ 1.900'], 22));
  const chao = `<rect x="-900" y="${CHAO - 40}" width="3900" height="420" fill="#8f8a84"/><rect x="-900" y="${CHAO - 40}" width="3900" height="14" fill="#2a1f22"/><rect x="-900" y="${CHAO + 150}" width="3900" height="240" fill="#55535a"/>`;
  return [{ f: .3, svg: fundo }, { f: .75, svg: meio }, { f: 1, svg: chao }];
}
function cenaBorracharia() {
  const fundo = `<rect x="-700" y="-300" width="2500" height="2300" fill="#3aa39f"/>` + reboco([[80, 420, 150, 60], [640, 340, 120, 50], [240, 780, 100, 46], [820, 860, 150, 60]], '#2e8783');
  const meio = placa(90, 470, 330, 170, '#fff6e6', ['0 dias sem', 'prejuízo'], 40)
    + placa(480, 500, 240, 120, '#f2d36b', ['Fiado só', 'amanhã'], 34)
    + ret(760, 660, 340, 950, '#f4a65a', 0) + ret(760, 660, 340, 950, 'none', 0)
    + [0, 1, 2, 3].map((i) => pneuSVG(70, 1520 - i * 72, 90)).join('') + [0, 1].map((i) => pneuSVG(240, 1530 - i * 72, 74)).join('')
    + stroke('M450 700 L720 700', OUT, 8) + [0, 1, 2, 3].map((i) => shape(`M${480 + i * 60} 700 L${490 + i * 60} 790 L${510 + i * 60} 790 L${520 + i * 60} 700Z`, '#8a9099', 2)).join('');
  const chao = `<rect x="-900" y="${CHAO - 40}" width="2900" height="420" fill="#6c6a6e"/><rect x="-900" y="${CHAO - 40}" width="2900" height="14" fill="#2a1f22"/>`;
  return [{ f: .6, svg: fundo }, { f: .85, svg: meio }, { f: 1, svg: chao }];
}
function cenaPortaClassica(aberta, dia = false) {
  const fundo = dia ? predios('#d9a860', '#c48a4e', ['#8a5a2e', '#8a5a2e', '#fff3d6'], '#ffd9a0') : predios('#2c3a4f', '#233044', ['#f2d36b', '#1b2533', '#1b2533'], '#18223a');
  const meio = FIOS + ret(-300, 560, 1700, 1100, '#d9834c', 0) + reboco([[60, 640, 160, 60], [820, 700, 150, 60], [120, 1180, 120, 50], [880, 1250, 110, 50], [420, 610, 100, 40]], '#bd6f3d')
    + placa(330, 590, 420, 96, '#fff6e6', ['CONJUNTO ESPERANÇA'], 30) + placa(430, 696, 220, 56, '#f2d36b', ['Bloco 4'], 30)
    + ret(350, 780, 380, 830, '#3b2c26', 0)
    + (aberta ? ret(350, 780, 380, 830, '#f7e3a8', 0) + shape('M730 780 L830 740 L830 1640 L730 1610Z', '#7a5a44') : ret(370, 800, 340, 810, '#7a5a44', 0) + ell(680, 1220, 12, 12, '#e2b13f', OUT, 2))
    + placa(40, 980, 270, 170, '#fff6e6', ['Proibido latir', 'após as 22h', 'A Administração'], 24, OUT, -1)
    + `<rect x="900" y="1400" width="110" height="200" rx="12" fill="#4f7f9e" stroke="${OUT}" stroke-width="${T}"/>` + shape('M60 1600 L60 1500 Q60 1460 110 1460 Q160 1460 160 1500 L160 1600Z', '#ae5d49') + stroke('M90 1460 Q70 1400 100 1370 M130 1460 Q150 1400 120 1360', '#7f9419', 8);
  const chao = `<rect x="-900" y="${CHAO - 40}" width="2900" height="420" fill="#8f8a84"/><rect x="-900" y="${CHAO - 40}" width="2900" height="14" fill="#2a1f22"/>`;
  return [{ f: .3, svg: fundo }, { f: .9, svg: meio }, { f: 1, svg: chao }];
}
function cenaPorta(aberta, dia = false) { return organico() ? PortaRica.porta(aberta, dia) : cenaPortaClassica(aberta, dia); }
/* ---------- porta do Conjunto, versão rica (padrão desde 10/11/2026) ----------
   Estudo estudos/visual-2d, aprovado pelo João: camadas com profundidade, materiais e luz motivada (sol
   pela direita de dia; poste, janela e porta acesas à noite). Mantém placas, vaso, lixeira, fios e reboco
   da versão clássica, que continua em cenaPortaClassica para o estilo 'classico'. */
const PortaRica = (() => {
  const pr = (n) => r2(n).toString();
  function porta(aberta, dia) {
    const k = dia ? 'd' : 'n';
    // ---------- fundo: céu em gradiente, nuvens ou estrelas, prédios com névoa de distância ----------
    let fundo = `<defs><linearGradient id="crCeu${k}" x1="0" y1="0" x2="0" y2="1">`
      + (dia ? '<stop offset="0" stop-color="#7fc3e8"/><stop offset=".62" stop-color="#cdeaf4"/><stop offset="1" stop-color="#fbe6c2"/>'
        : '<stop offset="0" stop-color="#121c33"/><stop offset=".7" stop-color="#34395a"/><stop offset="1" stop-color="#5e5170"/>')
      + `</linearGradient><linearGradient id="crNevoa${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${dia ? '#fbe6c2' : '#5e5170'}" stop-opacity="0"/><stop offset="1" stop-color="${dia ? '#fbe6c2' : '#5e5170'}" stop-opacity=".55"/></linearGradient></defs>`;
    fundo += `<rect x="-900" y="-600" width="3900" height="2600" fill="url(#crCeu${k})"/>`;
    if (dia) for (const [x, y, s] of [[-120, 120, 1], [420, 60, .8], [900, 150, 1.1], [1400, 90, .9]])
      fundo += `<g transform="translate(${x} ${y}) scale(${s})" opacity=".9">` + ell(0, 0, 90, 30, '#fffaf0') + ell(-60, 10, 60, 24, '#fffaf0') + ell(70, 12, 70, 22, '#f4f0e6') + '</g>';
    else for (let i = 0; i < 40; i++) fundo += `<circle cx="${(i * 191) % 2200 - 500}" cy="${(i * 113) % 420 - 40}" r="${1.2 + i % 3 * .8}" fill="#fff4d6" opacity="${.45 + (i % 4) * .12}"/>`;
    if (!dia) fundo += ell(860, 60, 46, 46, '#fff1c9') + ell(842, 50, 40, 40, '#2a3150', 'none', 0, 'opacity=".9"');
    fundo += predios(dia ? '#e2b06c' : '#2c3a4f', dia ? '#cf9558' : '#233044', dia ? ['#8a5a2e', '#9a6a3e', '#fff3d6'] : ['#f2d36b', '#1b2533', '#1b2533', '#e8b85a'], 'none');
    fundo += `<rect x="-900" y="200" width="3900" height="700" fill="url(#crNevoa${k})"/>`;

    // ---------- meio: a fachada do bloco ----------
    const parede = dia ? '#e08a52' : '#8a5038', paredeSombra = dia ? '#c9743f' : '#6e3d2b', azulejo = dia ? '#e9e2cf' : '#8f8a80';
    let meio = FIOS + ret(-300, 560, 1700, 1100, parede, 0);
    meio += reboco([[60, 640, 160, 60], [820, 700, 150, 60], [120, 1180, 120, 50], [880, 1250, 110, 50], [420, 610, 100, 40]], paredeSombra);
    // tijolo aparente num buraco do reboco
    meio += `<g opacity=".8">` + ret(840, 905, 130, 70, '#b55b3a', 10, 0) + [0, 1, 2].map(i => stroke(`M846 ${922 + i * 18} L964 ${922 + i * 18}`, '#8e4129', 2)).join('') + stroke('M880 905 L880 922 M920 922 L920 940 M870 940 L870 958 M930 958 L930 975', '#8e4129', 2) + '</g>';
    // janela gradeada à esquerda, com cortina
    meio += ret(30, 640, 230, 220, '#5a3c33', 8) + ret(44, 654, 202, 192, dia ? '#bfe2ef' : '#f4c96b', 4, 0)
      + (dia ? shape('M44 654 L130 654 Q118 740 132 846 L44 846Z', '#e8736f', 2) : shape('M44 654 L120 654 Q108 740 122 846 L44 846Z', '#c2584f', 2))
      + [0, 1, 2, 3].map(i => stroke(`M${70 + i * 50} 654 L${70 + i * 50} 846`, OUT, 4)).join('') + stroke('M44 750 L246 750', OUT, 4)
      + ret(22, 856, 246, 20, '#c9c2b8', 4);
    // placa "Proibido latir" (a da cena original) e caixas de correio
    meio += placa(40, 960, 270, 170, '#fff6e6', ['Proibido latir', 'após as 22h', 'A Administração'], 24, OUT, -1);
    meio += ret(70, 1185, 210, 150, '#6e7f8c', 6);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) { const x = 82 + i * 66, y = 1196 + j * 68;
      meio += ret(x, y, 56, 58, '#8fa0ad', 4, 2) + stroke(`M${x + 12} ${y + 18} L${x + 44} ${y + 18}`, OUT, 3) + `<text x="${x + 28}" y="${y + 46}" font-family="Arial" font-weight="700" font-size="15" text-anchor="middle" fill="${OUT}">${41 + i + j * 3}</text>`; }
    // rodapé de azulejo
    meio += `<rect x="-300" y="1420" width="1700" height="140" fill="${azulejo}"/>` + [...Array(30)].map((_, i) => stroke(`M${-300 + i * 60} 1420 L${-300 + i * 60} 1560`, '#c8bfa9', 1.6)).join('') + stroke('M-300 1490 L1400 1490', '#c8bfa9', 1.6) + stroke('M-300 1420 L1400 1420', OUT, 3);
    // cano descendo pela parede
    meio += stroke('M1040 560 L1040 1560', OUT, 16) + stroke('M1040 560 L1040 1560', '#9aa3aa', 10) + [700, 1000, 1300].map(y => ret(1026, y, 28, 12, '#6c737a', 3, 2)).join('');
    // placas da fachada (as da cena original)
    meio += placa(330, 590, 420, 96, '#fff6e6', ['CONJUNTO ESPERANÇA'], 30) + placa(430, 696, 220, 56, '#f2d36b', ['Bloco 4'], 30);
    // entrada recuada: batente com espessura, porta, marquise
    meio += shape('M330 790 L350 800 L350 1600 L330 1600Z', dia ? '#c9c2b8' : '#8e877d') + shape('M750 790 L730 800 L730 1600 L750 1600Z', dia ? '#a39b90' : '#6f685f');
    meio += ret(350, 800, 380, 800, dia ? '#3b2c26' : '#2c201c', 0);
    if (aberta) { // porta aberta: corredor com luz, escada ao fundo
      meio += ret(350, 800, 380, 800, dia ? '#f7e3a8' : '#f2cf7a', 0) + shape('M430 880 L650 880 L650 1600 L430 1600Z', dia ? '#e9cf8e' : '#e2b866', 0)
        + [0, 1, 2, 3, 4, 5].map(i => stroke(`M${470 + i * 8} ${1040 + i * 60} L${610 - i * 8} ${1040 + i * 60}`, '#c9a868', 4)).join('') + shape('M730 800 L830 760 L830 1640 L730 1610Z', '#7a5a44');
    } else { // porta fechada, com vidro (aceso por dentro à noite)
      meio += ret(370, 820, 340, 780, '#7a5a44', 0) + ret(420, 870, 240, 260, dia ? '#cfe6f2' : '#f2cf7a', 6) + stroke('M540 870 L540 1130 M420 1000 L660 1000', '#7a5a44', 6) + ell(680, 1220, 12, 12, '#e2b13f', OUT, 2);
    }
    meio += shape('M300 760 L780 760 L806 792 L274 792Z', dia ? '#d8d1c6' : '#9f988d') + ret(274, 792, 532, 16, dia ? '#b9b1a4' : '#7d766c', 0, 2);
    if (dia) meio += `<path d="M274 808 L806 808 L760 870 L320 870Z" fill="#3b2a24" opacity=".22"/>`;
    // interfone, ao lado da porta
    meio += ret(770, 1050, 64, 150, '#c7cbd0', 8) + ell(802, 1072, 7, 7, '#2a2f36') + [0, 1, 2].map(i => ell(788, 1104 + i * 26, 6, 6, '#e8ecef', OUT, 1.6) + ell(816, 1104 + i * 26, 6, 6, '#e8ecef', OUT, 1.6)).join('') + stroke('M786 1180 L818 1180 M786 1188 L818 1188', '#6c737a', 2);
    // vaso com folhas (da cena original, com mais volume) e lixeira
    meio += shape('M52 1600 L60 1500 L160 1500 L168 1600Z', '#ae5d49') + ret(48, 1488, 124, 22, '#c26d57', 6) + `<path d="M60 1510 L160 1510 L156 1560 L64 1560Z" fill="#8e4636" opacity=".35"/>`
      + shape('M110 1490 Q60 1420 86 1350 Q118 1410 110 1490Z', '#6f9a2c') + shape('M112 1490 Q150 1400 190 1380 Q170 1460 112 1490Z', '#87b23a') + shape('M108 1490 Q40 1470 20 1420 Q80 1420 108 1490Z', '#5d8a26')
      + stroke('M110 1488 Q96 1420 88 1360 M114 1488 Q150 1430 186 1384 M106 1488 Q66 1452 26 1424', '#3f6a1c', 1.6);
    meio += `<rect x="900" y="1400" width="110" height="200" rx="12" fill="#4f7f9e" stroke="${OUT}" stroke-width="${T}"/>` + ret(892, 1388, 126, 24, '#3f6b87', 8) + ret(924, 1460, 62, 40, '#e9e2cf', 4, 2) + stroke('M934 1474 L976 1474 M934 1486 L966 1486', '#6c737a', 2);
    // luz motivada
    if (dia) meio += `<defs><linearGradient id="crSol" gradientUnits="userSpaceOnUse" x1="1300" y1="0" x2="300" y2="0"><stop offset="0" stop-color="#fff2c2" stop-opacity=".3"/><stop offset="1" stop-color="#fff2c2" stop-opacity="0"/></linearGradient></defs><rect x="300" y="560" width="1100" height="1040" fill="url(#crSol)"/>`;
    else meio += `<defs><linearGradient id="crCone" gradientUnits="userSpaceOnUse" x1="0" y1="560" x2="0" y2="1600"><stop offset="0" stop-color="#ffe3a0" stop-opacity=".34"/><stop offset="1" stop-color="#ffe3a0" stop-opacity=".1"/></linearGradient></defs><path d="M880 540 L960 540 L1300 1600 L520 1600Z" fill="url(#crCone)"/><defs><radialGradient id="crJanela"><stop offset="0" stop-color="#ffd27a" stop-opacity=".45"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient></defs>` + ell(145, 760, 240, 200, 'url(#crJanela)') + ell(540, 1000, 300, 260, 'url(#crJanela)');

    // ---------- chão: degraus, calçada em perspectiva, meio-fio ----------
    const piso = dia ? '#b9b2a6' : '#7f7a74', junta = dia ? '#968f84' : '#5f5a55', CH = CHAO;
    let chao = `<rect x="-900" y="${CH - 40}" width="2900" height="440" fill="${piso}"/>`;
    // juntas que fogem para um ponto acima da porta: o chão recua em vez de ser uma faixa plana
    const vpY = CH - 520, fr = (CH - 40 - vpY) / (CH + 380 - vpY);
    for (let i = -12; i <= 12; i++) { const xb = 540 + i * 170; chao += stroke(`M${pr(540 + (xb - 540) * fr)} ${CH - 40} L${xb} ${CH + 380}`, junta, 2); }
    for (const y of [CH + 6, CH + 66, CH + 146, CH + 250]) chao += stroke(`M-900 ${y} L2000 ${y}`, junta, 2);
    chao += stroke(`M180 ${CH + 90} l40 18 l-10 26 M820 ${CH + 170} l-30 12 l22 30`, junta, 1.8);
    // degrau junto da parede, atrás dos pés: os atores pisam na calçada, à frente dele
    chao += shape(`M320 ${CH - 40} L760 ${CH - 40} L770 ${CH - 33} L310 ${CH - 33}Z`, dia ? '#d6cfc3' : '#9a948b', 2) + `<rect x="310" y="${CH - 33}" width="460" height="9" fill="${dia ? '#a39b90' : '#6f685f'}" stroke="${OUT}" stroke-width="2"/>`;
    chao += `<rect x="-900" y="${CH + 300}" width="2900" height="26" fill="${dia ? '#cfc8bb' : '#8d877e'}" stroke="${OUT}" stroke-width="2.5"/><rect x="-900" y="${CH + 326}" width="2900" height="200" fill="${dia ? '#55535a' : '#3c3a40'}"/>`;
    chao += ret(880, CH + 330, 120, 28, '#3a3a40', 4, 2) + [0, 1, 2, 3, 4].map(i => stroke(`M${894 + i * 22} ${CH + 334} L${894 + i * 22} ${CH + 354}`, '#77777f', 3)).join('');
    if (!dia) { // poste à direita: luz no chão e brilho na lâmpada
      chao += `<defs><radialGradient id="crPoca"><stop offset="0" stop-color="#ffdf8f" stop-opacity=".42"/><stop offset="1" stop-color="#ffdf8f" stop-opacity="0"/></radialGradient></defs>` + ell(820, CH + 40, 560, 150, 'url(#crPoca)');
    }
    chao += `<rect x="-900" y="${CH - 40}" width="2900" height="10" fill="${OUT}" opacity=".85"/>`;
    const camadas = [{ f: .3, svg: fundo }, { f: .9, svg: meio }, { f: 1, svg: chao }];
    if (!dia) camadas.push({ f: 1, svg: poste(1010) });
    return camadas;
  }
  // Poste de primeiro plano (noite). A luz dele motiva o brilho do chão e a sombra dos atores para a esquerda.
  function poste(x) {
    return `<defs><radialGradient id="crLampada"><stop offset="0" stop-color="#fff0b8" stop-opacity=".8"/><stop offset=".4" stop-color="#ffd77a" stop-opacity=".25"/><stop offset="1" stop-color="#ffd77a" stop-opacity="0"/></radialGradient></defs>`
      + `<rect x="${x - 14}" y="560" width="28" height="1080" fill="#4a5058" stroke="${OUT}" stroke-width="3"/>` + shape(`M${x} 572 Q${x - 10} 520 ${x - 90} 512 L${x - 96} 528 Q${x - 26} 534 ${x - 16} 572Z`, '#4a5058', 3)
      + shape(`M${x - 130} 510 L${x - 60} 510 L${x - 70} 534 L${x - 120} 534Z`, '#2e3238', 3) + ell(x - 95, 540, 30, 8, '#fff3c4', OUT, 2) + ell(x - 95, 560, 190, 150, 'url(#crLampada)');
  }
  return { porta };
})();
function cenaCasa() {
  const fundo = `<rect x="-700" y="-300" width="2500" height="2300" fill="#efc76c"/>` + reboco([[120, 330, 150, 50], [770, 1040, 120, 50]], '#d9ae57');
  const meio = stroke('M60 340 Q540 470 1020 340', OUT, 5) + placa(350, 400, 380, 140, '#e8736f', ['80 ANOS'], 80, '#fff6e6')
    + `<circle cx="880" cy="620" r="76" fill="#fff6e6" stroke="${OUT}" stroke-width="${T}"/>` + stroke('M880 620 L880 566 M880 620 L922 640', OUT, 6)
    + ret(90, 640, 200, 250, '#d9834c', 6) + ret(110, 660, 160, 210, '#fff3d6', 2, 2);
  const chao = `<rect x="-900" y="${CHAO - 40}" width="2900" height="420" fill="#a9754a"/>`;
  return [{ f: .7, svg: fundo }, { f: .9, svg: meio }, { f: 1, svg: chao }];
}
function mesaSVG(y) {
  let s = shape(`M40 ${y} L1040 ${y} L1070 ${y + 600} L10 ${y + 600}Z`, '#fff6e6');
  for (const [x, yy] of [[190, 40], [360, 90], [720, 90], [890, 40]]) s += ell(x, y + yy, 70, 22, '#f7f4ef', OUT, 2.4) + ell(x, y + yy, 38, 11, '#e5e1da', 'none', 0);
  return s;
}
/* ---------- moto vista de frente ---------- */
// Origem no chão, sob a roda. parte 'fundo' vai atrás do piloto; parte 'frente', na frente dele; sem parte, a moto inteira.
const MOTO_RETA = { gripL: [-150, -376], gripR: [150, -376] };
function motoRetaSVG(x, y, s, o = {}) {
  const giro = o.giro || 0;
  const fundo = `<ellipse cx="0" cy="-92" rx="27" ry="92" fill="#26262b" stroke="${OUT}" stroke-width="${T}"/>`
    + stroke('M-70 -150 L-132 -124 M70 -150 L132 -124', OUT, 17) + stroke('M-70 -150 L-132 -124 M70 -150 L132 -124', '#a7adb5', 9)
    + shape('M-98 -348 Q0 -376 98 -348 L104 -284 Q0 -262 -104 -284Z', '#ae5d49')
    + stroke('M-74 -326 Q0 -348 74 -326', '#8f4c3b', 3.4);
  const pedaleiras = stroke('M-124 -106 L-58 -118 M124 -106 L58 -118', OUT, 14) + stroke('M-124 -106 L-58 -118 M124 -106 L58 -118', '#6c727a', 7);
  const riscos = [0, 1, 2, 3, 4, 5].map((i) => { const q = ((giro / 60 + i / 6) % 1 + 1) % 1, yy = -240 + q * 230, l = 30 * Math.sin(q * Math.PI); return stroke(`M${-l} ${yy.toFixed(1)} L${l} ${yy.toFixed(1)}`, '#55535a', 5); }).join('');
  const frente = pedaleiras + shape('M-48 -258 L48 -258 L40 -172 L-40 -172Z', '#3a3a40') + stroke('M-34 -228 L34 -228 M-32 -200 L32 -200', '#6c727a', 5)
    + `<ellipse cx="0" cy="-125" rx="36" ry="125" fill="#26262b" stroke="${OUT}" stroke-width="${T}"/>` + riscos
    + shape('M-44 -196 Q0 -262 44 -196 L34 -158 Q0 -196 -34 -158Z', '#c9412f')
    + stroke('M-27 -130 L-34 -345 M27 -130 L34 -345', OUT, 19) + stroke('M-27 -130 L-34 -345 M27 -130 L34 -345', '#a7adb5', 12)
    + shape('M-68 -372 Q0 -402 68 -372 L58 -272 Q0 -246 -58 -272Z', '#c9412f')
    + stroke('M-112 -384 L-176 -470 M112 -384 L176 -470', OUT, 8)
    + ell(-182, -496, 27, 34, '#26262b', OUT, T) + ell(-182, -496, 18, 25, '#c9dfe6') + ell(182, -496, 27, 34, '#26262b', OUT, T) + ell(182, -496, 18, 25, '#c9dfe6')
    + stroke('M-150 -376 Q0 -404 150 -376', OUT, 18) + stroke('M-150 -376 Q0 -404 150 -376', '#a7adb5', 10)
    + stroke('M-162 -374 L-124 -380 M162 -374 L124 -380', '#26262b', 17)
    + ell(0, -338, 46, 46, '#f2d36b', OUT, T) + ell(-5, -343, 25, 25, '#fff6d8')
    + txt(0, -268, 'Companheira', 15, '#fff3d6');
  const miolo = o.parte === 'fundo' ? fundo : o.parte === 'frente' ? frente : fundo + frente;
  return `<g transform="translate(${x} ${y}) scale(${s})">${miolo}</g>`;
}
function fedorSVG(x, y, t, forca = 1) {
  return [-1, 0, 1].map((i) => {
    const o = Math.sin(t * 5 + i * 2) * 11, h = 150 * forca, a = x + i * 72;
    return `<path d="M${a} ${y} Q${a + 34 + o} ${y - h * .25} ${a} ${y - h * .5} Q${a - 34 - o} ${y - h * .75} ${a} ${y - h}" fill="none" stroke="#7f9419" stroke-width="9" stroke-linecap="round" opacity="${(.82 * Math.min(1, forca)).toFixed(2)}"/>`;
  }).join('');
}
// Suor pingando: cada gota cai do rosto até o chão, acelera e respinga ao bater
function pingosSVG(x, y, chao, t, n = 3) {
  const lados = [-30, 22, -8, 30, -18];
  let s = '';
  for (let i = 0; i < n; i++) {
    const q = (t * .95 + i * .37 + i * i * .11) % 1, x0 = x + lados[i % lados.length];
    if (q < .82) {
      const p = q / .82, yy = y + (chao - y) * p * p, g = 1 + p * .35;
      s += `<path transform="translate(${x0} ${yy.toFixed(1)}) scale(${g.toFixed(2)})" d="M0 -17 Q12 -2 9 6 Q6 14 0 14 Q-6 14 -9 6 Q-12 -2 0 -17Z" fill="#7fd6ee" stroke="${OUT}" stroke-width="2.6"/>`;
    } else {
      const p = (q - .82) / .18, a = (1 - p).toFixed(2), r = 8 + p * 26;
      s += `<g opacity="${a}"><ellipse cx="${x0}" cy="${chao}" rx="${r.toFixed(1)}" ry="${(r * .28).toFixed(1)}" fill="none" stroke="#7fd6ee" stroke-width="4"/>`
        + `<circle cx="${x0 - r * .9}" cy="${chao - 14 * Math.sin(p * 3.14)}" r="4" fill="#7fd6ee"/><circle cx="${x0 + r * .9}" cy="${chao - 14 * Math.sin(p * 3.14)}" r="4" fill="#7fd6ee"/></g>`;
    }
  }
  return s;
}
function gasolinaSVG(x, y, s, nivel) {
  const a = (-58 + 116 * nivel) * Math.PI / 180, cor = nivel < .12 ? '#c23b3b' : '#2a1f22';
  return `<g transform="translate(${x} ${y}) scale(${s})"><circle r="104" fill="#fff6e6" stroke="${OUT}" stroke-width="7"/>`
    + txt(-68, 46, 'V', 32, '#c23b3b') + txt(68, 46, 'C', 32, OUT) + txt(0, 62, 'GASOLINA', 18, OUT)
    + stroke(`M0 24 L${(Math.sin(a) * 82).toFixed(1)} ${(24 - Math.cos(a) * 82).toFixed(1)}`, cor, 9) + `<circle cy="24" r="12" fill="${OUT}"/></g>`;
}

/* ---------- mapa do GPS ---------- */
// O trajeto vira um novelo, como em desenho animado; depois sai uma única linha reta até o conjunto.
function mapaPonto(q) {
  const u = q * 21;
  return [540 + Math.sin(u * .93) * 300 * (.45 + .55 * q) + Math.sin(u * 2.37) * 62, 1010 + Math.cos(u * .61) * 400 * (.4 + .6 * q) + Math.cos(u * 1.91) * 62];
}
function mapaSVG(q, reta = 0, t = 0) {
  let s = `<rect x="-200" y="-200" width="1480" height="2320" fill="#efe6d2"/>`;
  for (const x of [120, 330, 560, 790, 980]) s += `<rect x="${x - 21}" y="-200" width="42" height="2320" fill="#fff"/>`;
  for (const y of [300, 560, 820, 1080, 1340, 1600]) s += `<rect x="-200" y="${y - 21}" width="1480" height="42" fill="#fff"/>`;
  s += `<g transform="rotate(16 540 960)"><rect x="-300" y="930" width="1700" height="60" fill="#f7d774"/></g>`
    + ret(160, 340, 150, 200, '#bcd59a', 10, 0) + ret(600, 860, 170, 190, '#bcd59a', 10, 0) + ret(810, 1120, 150, 200, '#9fd0d8', 10, 0);
  const pts = []; const q2 = Math.max(.002, q);
  for (let i = 0; i <= 500; i++) pts.push(mapaPonto(q2 * i / 500));
  const fim = pts[pts.length - 1];
  s += `<path d="M${pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L')}" fill="none" stroke="#c23b3b" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1 25"/>`;
  const pinoX = reta > 0 ? 880 : 900, pinoY = reta > 0 ? 330 : 280;
  s += shape(`M${pinoX} ${pinoY} Q${pinoX - 56} ${pinoY - 66} ${pinoX - 40} ${pinoY - 104} Q${pinoX} ${pinoY - 138} ${pinoX + 40} ${pinoY - 104} Q${pinoX + 56} ${pinoY - 66} ${pinoX} ${pinoY}Z`, reta > 0 ? '#3aa39f' : '#35a24a') + `<circle cx="${pinoX}" cy="${pinoY - 84}" r="18" fill="#fff"/>`;
  let mx = fim[0], my = fim[1];
  if (reta > 0) {
    mx = fim[0] + (pinoX - fim[0]) * reta; my = fim[1] + (pinoY - fim[1]) * reta;
    s += `<path d="M${fim[0].toFixed(1)} ${fim[1].toFixed(1)} L${mx.toFixed(1)} ${my.toFixed(1)}" fill="none" stroke="#2a4f8a" stroke-width="13" stroke-linecap="round" stroke-dasharray="1 25"/>`;
  }
  return s + `<g transform="translate(${mx.toFixed(1)} ${my.toFixed(1)}) rotate(${(Math.sin(t * 9) * 7).toFixed(1)})"><circle r="36" fill="#c9412f" stroke="${OUT}" stroke-width="5"/><circle cx="-13" cy="4" r="8" fill="${OUT}"/><circle cx="13" cy="4" r="8" fill="${OUT}"/><rect x="-13" y="-12" width="26" height="8" fill="#fff"/></g>`;
}

/* ---------- prédio chique ---------- */
function cenaPredioChique() {
  const fundo = predios('#d9a860', '#c48a4e', ['#8a5a2e', '#8a5a2e', '#fff3d6'], '#ffd9a0');
  let meio = ret(-250, 190, 1580, 1500, '#7fb6c9', 0, 0);
  for (let i = 0; i < 9; i++) for (let j = 0; j < 8; j++) meio += ret(-230 + i * 176, 220 + j * 118, 158, 100, (i + j * 2) % 3 ? '#a9d6e3' : '#c9e8f0', 2, 2);
  meio += ret(250, 940, 580, 670, '#3b3236', 0) + ret(275, 975, 250, 635, '#bfe2ec', 0) + ret(555, 975, 250, 635, '#bfe2ec', 0)
    + ret(150, 880, 780, 72, '#e2b13f', 4) + txt(540, 932, 'EDIFÍCIO PROSPERITÀ', 40, OUT)
    + `<rect x="60" y="1400" width="110" height="200" rx="12" fill="#55606c" stroke="${OUT}" stroke-width="${T}"/>` + ell(115, 1350, 66, 92, '#6f9b3f', OUT, T)
    + `<rect x="910" y="1400" width="110" height="200" rx="12" fill="#55606c" stroke="${OUT}" stroke-width="${T}"/>` + ell(965, 1350, 66, 92, '#6f9b3f', OUT, T);
  const chao = `<rect x="-900" y="${CHAO - 40}" width="2900" height="420" fill="#c9c4bb"/><rect x="-900" y="${CHAO - 40}" width="2900" height="14" fill="#2a1f22"/><rect x="-900" y="${CHAO + 150}" width="2900" height="240" fill="#55535a"/>`;
  return [{ f: .3, svg: fundo }, { f: .9, svg: meio }, { f: 1, svg: chao }];
}

/* ---------- ep. 3: céu e silhueta no tom da ficha visual ---------- */
function ceuSerie(noite = true, id = 'ceuS') {
  const [a, b] = noite ? ['#172540', '#816579'] : ['#7f9ec0', '#f5c690'];
  let s = `<defs><linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="-300" x2="0" y2="1300"><stop stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect x="-900" y="-600" width="2900" height="2900" fill="url(#${id})"/>`;
  if (noite) for (let i = 0; i < 40; i++) s += `<circle cx="${(i * 173) % 1500 - 200}" cy="${(i * 97) % 600 - 120}" r="${1 + i % 3}" fill="#ffefd2" opacity=".6"/>`;
  return s;
}
function silhuetaSerie(base = 820, noite = true) {
  let s = '';
  for (let i = 0; i < 16; i++) { const x = -400 + i * 125, h = 120 + (i * 61) % 210; s += ret(x, base - h, 118, h + 600, noite ? '#39435b' : '#8b8fa3', 0, 0); for (let j = 0; j < 3; j++) s += ret(x + 18 + j * 31, base - h + 30, 12, 20, (i + j) % 3 ? (noite ? '#667080' : '#a9adbb') : '#e5bf75', 0, 0); }
  return s;
}
function janelaPredio(x, y, w, h, acesa) { return ret(x, y, w, h, acesa ? '#f4cf89' : '#544a54', 2, 2) + ret(x - 4, y + h, w + 8, 6, '#302e3d', 0, 0); }

// Banheiro da kitnet: azulejo, registro e chuveiro. A cortina entra pela frente, no plano.
function cenaBox() {
  let fundo = `<rect x="-700" y="-300" width="2500" height="2400" fill="#cfd8d6"/>`;
  for (let i = -6; i < 18; i++) for (let j = 0; j < 22; j++) fundo += `<rect x="${i * 96 + (j % 2) * 48}" y="${j * 96 - 200}" width="92" height="92" fill="${(i * 7 + j * 3) % 11 ? '#dfe7e4' : '#c4d3d0'}"/>`;
  fundo += ret(-700, 1250, 2500, 900, '#9fb3b4', 0, 0) + ret(-700, 1240, 2500, 14, '#7c8f90', 0, 0);
  const meio = stroke('M700 -100 L700 380 Q700 420 650 420 L560 420', '#9aa3aa', 16) + shape('M500 410 L620 410 L600 450 L520 450Z', '#b5bcc2', 3)
    + ell(760, 760, 26, 26, '#b5bcc2', OUT, 3) + stroke('M760 760 L800 760', OUT, 6)
    + ret(150, 600, 110, 150, '#f0e6d2', 8) + ell(205, 640, 22, 12, '#e8736f', OUT, 2) + txt(205, 712, 'XAMPU', 18, '#4c4a4c')
    + ret(880, 520, 140, 30, '#b5bcc2', 4, 2) + ell(915, 505, 22, 18, '#f2d36b', OUT, 2) + ell(975, 500, 18, 22, '#8fd3e8', OUT, 2);
  return [{ f: .9, svg: fundo }, { f: 1, svg: meio }];
}
// Kitnet: parede com reboco, janela, cama, abajur e pôster. dia = manhã; senão, noite.
function cenaKitnet(dia = true) {
  const fundo = ceuSerie(!dia, dia ? 'ceuKd' : 'ceuKn') + silhuetaSerie(900, !dia);
  const parede = dia ? '#e3b07c' : '#9c7a64', rb = dia ? '#c9935f' : '#84624f';
  const meio = `<path fill-rule="evenodd" d="M-700 -300 H1800 V1700 H-700Z M640 360 H980 V860 H640Z" fill="${parede}"/>` + reboco([[60, 300, 150, 56], [120, 1060, 120, 50], [420, 980, 90, 40], [260, 620, 110, 44]], rb)
    + ret(630, 350, 360, 520, 'none', 0, 10) + stroke('M810 350 V870 M630 610 H990', OUT, 8) + ret(610, 860, 400, 26, '#efe3cf', 3)
    + placa(90, 380, 300, 200, '#2a4f8a', ['TRANSIÇÃO', 'DE CARREIRA', '2.0'], 32, '#fff3d9', -3)
    + ret(-200, 1190, 820, 140, '#5a6f8a', 14) + ret(-200, 1140, 820, 70, '#e9e4d8', 20) + ell(470, 1160, 110, 40, '#f6f0e2', OUT, T)
    + ret(830, 1090, 190, 260, '#7a5a44', 6) + ret(850, 1110, 150, 100, '#8a6a52', 4, 2) + ell(925, 1060, 40, 40, dia ? '#d9d1c2' : '#ffe6a0', OUT, 3)
    + (dia ? '' : `<ellipse cx="925" cy="1060" rx="210" ry="190" fill="#ffd98a" opacity=".22"/>`);
  const chao = `<rect x="-900" y="${CHAO - 40}" width="2900" height="420" fill="${dia ? '#b98f6a' : '#7a5f4c'}"/><rect x="-900" y="${CHAO - 40}" width="2900" height="12" fill="#2a1f22"/>`;
  return [{ f: .25, svg: fundo }, { f: .9, svg: meio }, { f: 1, svg: chao }];
}
// Corredor do escritório: porta de vidro da sala de reunião, bebedouro, planta e quadro motivacional.
function cenaEscritorio() {
  const fundo = `<rect x="-700" y="-300" width="2500" height="2400" fill="#e8e3d8"/>` + ret(-700, 1200, 2500, 400, '#d5cfc2', 0, 0) + stroke('M-700 1200 H1800', '#b8b0a2', 6);
  const meio = ret(330, 520, 420, 1080, '#5a6672', 0) + ret(352, 540, 376, 1060, '#bcd8e2', 0) + stroke('M380 600 L470 520 M420 760 L600 560 M560 900 L720 720', '#e9f5f8', 10)
    + ret(352, 980, 376, 36, '#f2f2ee', 0, 0) + txt(540, 1006, 'SALA DE REUNIÃO', 22, '#55606c')
    + placa(-60, 600, 330, 210, '#fff6e6', ['MISSÃO:', 'Gratidão', 'com resultado'], 30, OUT, -2)
    + ret(860, 1180, 120, 410, '#cfd6da', 10) + ell(920, 1150, 52, 52, '#8fd3e8', OUT, 3) + ret(890, 1300, 60, 20, '#55606c', 4, 2)
    + ret(-150, 1420, 120, 180, '#b96d53', 10) + ell(-90, 1330, 80, 110, '#637351', OUT, 3) + ell(-60, 1260, 50, 70, '#738058', OUT, 3)
    + ell(1000, 420, 58, 58, '#fff6e6', OUT, 4) + stroke('M1000 420 L1000 382 M1000 420 L1026 432', OUT, 5) + txt(1000, 510, '8h20', 26, '#c23b3b');
  const chao = `<rect x="-900" y="${CHAO - 40}" width="2900" height="420" fill="#a9a39a"/><rect x="-900" y="${CHAO - 40}" width="2900" height="12" fill="#2a1f22"/>`;
  return [{ f: .85, svg: fundo }, { f: .92, svg: meio }, { f: 1, svg: chao }];
}
// Sala de reunião, vista de dentro: telão com o gráfico da Lua, mesa e janela da cidade.
function cenaSalaReuniao() {
  const fundo = `<rect x="-700" y="-300" width="2500" height="2400" fill="#dcd6ca"/>` + ret(-300, 300, 520, 700, '#9fb3c4', 0, 4) + ret(-280, 320, 480, 660, '#bcd0dc', 0, 0) + stroke('M-40 320 V980 M-280 650 H200', '#8fa3b4', 6);
  const meio = ret(330, 330, 620, 400, '#2a2f38', 10) + ret(350, 350, 580, 360, '#f7f4ef', 4, 0) + txt(640, 400, 'METAS DO TRIMESTRE', 30, '#2a4f8a')
    + [0, 1, 2, 3].map((i) => ret(420 + i * 120, 660 - (i + 1) * 55, 70, (i + 1) * 55, i === 3 ? '#e0304f' : '#2a4f8a', 2, 2)).join('')
    + placa(560, 760, 380, 80, '#f2d36b', ['PROMOÇÃO DO MÊS'], 30)
    + ret(-200, 1360, 1480, 70, '#7a5a44', 8) + ret(-160, 1430, 40, 170, '#55606c', 0) + ret(1160, 1430, 40, 170, '#55606c', 0);
  const chao = `<rect x="-900" y="${CHAO - 40}" width="2900" height="420" fill="#9c958b"/>`;
  return [{ f: .7, svg: fundo }, { f: .9, svg: meio }, { f: 1, svg: chao }];
}
// Frente da casa do Jão, à noite: laje com caixa-d'água, portão, muro baixo, poste e varal.
function cenaCasaJao(dia = false) {
  const fundo = ceuSerie(!dia, dia ? 'ceuJd' : 'ceuJ') + silhuetaSerie(860, !dia);
  const meio = FIOS + ret(-260, 560, 1080, 1100, '#c08a62', 0) + reboco([[-180, 640, 150, 56], [380, 720, 120, 50], [60, 980, 100, 44]], '#a7744f')
    + ret(-260, 520, 1080, 50, '#8e6a52', 0) + ret(40, 380, 220, 150, '#3c6f9a', 10) + txt(150, 470, '1000 L', 30, '#e9f2f8')
    + janelaPredio(-160, 700, 200, 180, true) + janelaPredio(300, 700, 200, 180, false)
    + ret(560, 900, 260, 700, '#3b4d5e', 0) + [0, 1, 2, 3, 4, 5].map((i) => stroke(`M${580 + i * 40} 920 V1590`, '#2a3742', 8)).join('')
    + placa(80, 980, 300, 110, '#fff6e6', ['Garagem da', 'Companheira'], 28, OUT, -2)
    + ret(-400, 1300, 960, 300, '#d9a07a', 0) + reboco([[-300, 1360, 120, 44], [200, 1420, 140, 50]], '#bd8660')
    + ret(820, 1300, 700, 300, '#d9a07a', 0)
    + stroke('M900 700 Q1050 760 1200 700', '#5d5e66', 3) + shape('M960 720 L1000 720 L996 790 L964 790Z', '#e8736f', 2) + shape('M1050 735 L1110 735 L1104 800 L1056 800Z', '#8fd3e8', 2)
    + (!dia && typeof SerieVisual !== 'undefined' ? SerieVisual.lampada(1000, 560) : '');
  const chao = `<rect x="-900" y="${CHAO - 40}" width="2900" height="420" fill="#77707a"/><rect x="-900" y="${CHAO - 40}" width="2900" height="14" fill="#2a1f22"/><rect x="-900" y="${CHAO + 150}" width="2900" height="240" fill="#454955"/>`;
  return [{ f: .3, svg: fundo }, { f: .9, svg: meio }, { f: 1, svg: chao }];
}
// Duas fachadas do mesmo condomínio, de frente uma para a outra; a câmera fica no vão entre elas.
function fachadaBloco(x, w, cor, nome, acesa) {
  let s = ret(x, 260, w, 1700, cor, 0, 3) + reboco([[x + 40, 420, 120, 46], [x + w - 170, 1040, 110, 44]], 'rgba(0,0,0,.13)');
  for (let r = 0; r < 4; r++) for (let c = 0; c < 2; c++) { const xx = x + 70 + c * (w - 260), yy = 360 + r * 300; s += janelaPredio(xx, yy, 120, 170, (r * 3 + c * 5) % 4 === 1); }
  s += janelaPredio(acesa[0], acesa[1], 200, 260, true) + placa(x + w / 2 - 110, 290, 220, 52, '#fff6e6', [nome], 24);
  return s;
}
function cenaJanelas() {
  const fundo = ceuSerie(true, 'ceuJn') + silhuetaSerie(980, true);
  const meio = fachadaBloco(-420, 760, '#9a6a55', 'Bloco 4', [140, 940]) + fachadaBloco(740, 760, '#5f7a7a', 'Bloco 5', [740, 940])
    + `<path d="M340 600 Q540 690 740 590" stroke="#343646" stroke-width="3" fill="none"/>` + shape('M500 640 L540 640 L536 700 L504 700Z', '#f2d36b', 2) + shape('M570 655 L610 655 L606 710 L574 710Z', '#e8736f', 2)
    + (typeof SerieVisual !== 'undefined' ? SerieVisual.arvore(540, 1640, .9) : '');
  const chao = `<rect x="-900" y="1580" width="2900" height="460" fill="#454955"/>`;
  return [{ f: .3, svg: fundo }, { f: .85, svg: meio }, { f: 1, svg: chao }];
}
// Close de uma janela, por fora: parede, moldura e o interior aceso. O parapeito vem pela frente, no plano.
function cenaJanelaClose(cor, interior, fundoInt) {
  const fundo = `<rect x="-700" y="-300" width="2500" height="2400" fill="${fundoInt}"/>` + interior;
  const meio = `<path fill-rule="evenodd" d="M-700 -300 H1800 V2300 H-700Z M140 380 H940 V1500 H140Z" fill="${cor}"/>` + reboco([[-20, 200, 140, 50], [960, 1600, 120, 44], [980, 300, 90, 40]], 'rgba(0,0,0,.13)')
    + ret(130, 370, 820, 1140, 'none', 0, 14);
  return [{ f: .85, svg: fundo }, { f: 1, svg: meio }];
}
const INT_TICO = () => `<g transform="rotate(-4 330 600)">` + stroke('M200 470 L200 760', '#6a5a4a', 8) + ret(200, 470, 300, 190, '#1d1d22', 2, 3) + shape('M200 560 L500 520 L500 560 L200 600Z', '#f4f1ea', 0) + `<circle cx="350" cy="565" r="30" fill="#f4f1ea" stroke="#1d1d22" stroke-width="5"/>` + '</g>'
  + ell(820, 600, 46, 46, '#ffe6a0', OUT, 3) + `<ellipse cx="820" cy="600" rx="230" ry="200" fill="#ffd98a" opacity=".25"/>`;
const INT_LUA = () => { let s = ret(160, 470, 330, 520, '#7a5a44', 4, 3); const cores = ['#ae5d49', '#2a4f8a', '#e2b13f', '#637351', '#c9b8a0', '#8a4a6a'];
  for (let r = 0; r < 4; r++) { s += ret(160, 470 + r * 130 + 118, 330, 12, '#5d4434', 0, 0); for (let i = 0; i < 7; i++) { const h = 80 + (i * 13 + r * 7) % 30; s += ret(176 + i * 42, 470 + r * 130 + 118 - h, 34, h, cores[(i + r * 2) % cores.length], 2, 2); } }
  return s + ell(820, 560, 50, 50, '#ffe6a0', OUT, 3) + `<ellipse cx="820" cy="560" rx="240" ry="200" fill="#ffd98a" opacity=".22"/>`; };

/* ---------- ep. 3: objetos ---------- */
function onibusSVG(x, y, s) {
  let c = `<g transform="translate(${x} ${y}) scale(${s})">` + ell(0, 6, 520, 26, '#181e2b', 'none', 0, 'opacity=".25"') + ret(-500, -460, 1000, 440, '#2f8f86', 30) + ret(-500, -150, 1000, 40, '#f2d36b', 0, 0);
  for (let i = 0; i < 6; i++) { c += ret(-470 + i * 160, -420, 140, 160, '#bcd8e2', 8, 3); for (let k = 0; k < 3; k++) c += ell(-440 + i * 160 + k * 42, -300, 18, 20, ['#d59a6e', '#805039', '#e9b18b'][(i + k) % 3], OUT, 2); }
  return c + pneuSVG(-300, -20, 64) + pneuSVG(300, -20, 64) + txt(330, -180, 'CENTRO', 40, '#fff3d9') + '</g>';
}
function perfumeSVG(x, y, s = 1) { return `<g transform="translate(${x} ${y}) scale(${s})">` + ret(-22, -50, 44, 60, '#bfe2ec', 10) + ret(-8, -66, 16, 18, '#e2b13f', 3, 2) + txt(0, -14, 'N°1', 14, '#2a4f8a') + '</g>'; }
function nuvemPerfumeSVG(x, y, q) { if (q <= 0 || q >= 1) return ''; let s = ''; for (let i = 0; i < 7; i++) { const a = i * .9, r = 40 + q * 160; s += `<circle cx="${(x + Math.cos(a) * r * .8).toFixed(1)}" cy="${(y + Math.sin(a) * r * .5 - q * 60).toFixed(1)}" r="${(30 + q * 70).toFixed(1)}" fill="#f3e6f5" opacity="${(.55 * (1 - q)).toFixed(2)}"/>`; } return s; }

/* ---------- ep. 4: quarto da Lua, à noite, com a estante e a janela ---------- */
function estanteLua(x, y, k = 1) {
  let s = `<g transform="translate(${x} ${y}) scale(${k})">` + ret(0, 0, 360, 640, '#7a5a44', 4, 3);
  const cores = ['#ae5d49', '#2a4f8a', '#e2b13f', '#637351', '#c9b8a0', '#8a4a6a'];
  for (let r = 0; r < 4; r++) { s += ret(0, r * 160 + 146, 360, 14, '#5d4434', 0, 0); for (let i = 0; i < 8; i++) { if (r === 2 && i === 5) continue; const h = 96 + (i * 13 + r * 7) % 34; s += ret(16 + i * 42, r * 160 + 146 - h, 34, h, cores[(i + r * 2) % cores.length], 2, 2); } }
  return s + '</g>';
}
function cenaQuartoLua() {
  const fundo = ceuSerie(true, 'ceuQL') + silhuetaSerie(980, true) + janelaPredio(600, 520, 120, 170, true);
  const meio = `<path fill-rule="evenodd" d="M-700 -300 H1800 V1700 H-700Z M560 380 H1000 V900 H560Z" fill="#d9b48c"/>` + reboco([[80, 260, 140, 50], [1040, 1000, 110, 44]], 'rgba(0,0,0,.08)')
    + ret(550, 370, 460, 540, 'none', 0, 10) + stroke('M780 370 V910 M550 640 H1010', OUT, 8) + ret(530, 900, 500, 26, '#efe3cf', 3)
    + estanteLua(60, 560) + ell(900, 1080, 60, 22, '#f2d36b', OUT, 3) + stroke('M900 1080 V1200', OUT, 6) + `<ellipse cx="900" cy="1060" rx="220" ry="180" fill="#ffd98a" opacity=".2"/>`;
  const chao = `<rect x="-900" y="${CHAO - 40}" width="2900" height="420" fill="#8a6a52"/><rect x="-900" y="${CHAO - 40}" width="2900" height="12" fill="#2a1f22"/>`;
  return [{ f: .3, svg: fundo }, { f: .92, svg: meio }, { f: 1, svg: chao }];
}
// Caderno de receitas da avó, fechado (para mão e estante)
function cadernoSVG(x, y, k = 1, rot = 0) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${k})">` + ret(-46, -64, 92, 128, '#c9774f', 6, 3) + ret(-46, -64, 14, 128, '#8e4f33', 3, 0) + ret(-22, -30, 58, 34, '#f4e7c9', 3, 2) + txt(7, -8, 'Receitas', 12, '#7a3f1f') + '</g>';
}

/* ---------- ep. 4: carro alugado, visto de frente ---------- */
// Desenha em camadas: 'fundo' (interior e bancos) e 'frente' (vidro, painel e carroceria).
// x, y: centro do para-choque no chão. As medidas internas têm o carro com 1000 px de largura em k = 1.
const CARRO = { volante: [160, -585], banco: -560 };
function carroSVG(x, y, k, o = {}) {
  const T0 = `<g transform="translate(${x} ${y}) scale(${k})">`;
  if (o.parte === 'fundo') {
    return T0 + `<path d="M-400 -980 L400 -980 L470 -600 L-470 -600Z" fill="#2c2f38"/>` + ret(-430, -760, 860, 200, '#3b3f4a', 20, 0)
      + ret(-330, -920, 140, 110, '#4a4f5c', 26, 3) + ret(90, -920, 140, 110, '#4a4f5c', 26, 3) + '</g>';
  }
  const cor = o.cor || '#d9dde0', escura = o.corEscura || '#aab0b6';
  return T0
    // vidro do para-brisa: tom azulado e um reflexo
    + `<path d="M-400 -980 L400 -980 L470 -600 L-470 -600Z" fill="#a9d6e3" opacity=".16"/>`
    + `<path d="M-330 -970 L-250 -970 L-380 -610 L-450 -610Z M250 -975 L290 -975 L170 -610 L130 -610Z" fill="#ffffff" opacity=".18"/>`
    + `<path fill-rule="evenodd" d="M-470 -1030 L470 -1030 L540 -600 L540 -560 L-540 -560 L-540 -600Z M-400 -980 L400 -980 L470 -600 L-470 -600Z" fill="${cor}" stroke="${OUT}" stroke-width="5"/>`
    + ret(-150, -1000, 300, 16, escura, 6, 0)
    // painel e volante
    + ret(-470, -610, 940, 60, '#262931', 10, 4)
    + `<ellipse cx="${CARRO.volante[0]}" cy="${CARRO.volante[1]}" rx="135" ry="52" fill="none" stroke="#1b1d22" stroke-width="22"/>`
    + `<ellipse cx="${CARRO.volante[0]}" cy="${CARRO.volante[1]}" rx="135" ry="52" fill="none" stroke="#3c4048" stroke-width="8"/>`
    + ret(-80, -700, 140, 92, '#1b1d22', 10, 3) + ret(-72, -692, 124, 76, o.telaApp || '#3b8fd6', 6, 0)
    // capô, faróis, grade, placa e para-choque
    + `<path d="M-540 -560 L540 -560 L560 -300 L-560 -300Z" fill="${cor}" stroke="${OUT}" stroke-width="5"/>` + stroke('M-300 -540 Q0 -500 300 -540', escura, 6)
    + `<path d="M-560 -300 L560 -300 L560 -90 Q560 -40 510 -40 L-510 -40 Q-560 -40 -560 -90Z" fill="${cor}" stroke="${OUT}" stroke-width="5"/>`
    + ell(-400, -230, 95, 46, '#fff6d5', OUT, 5) + ell(400, -230, 95, 46, '#fff6d5', OUT, 5)
    + ret(-220, -270, 440, 90, '#2a2d34', 20, 4) + [0, 1, 2, 3].map((i) => stroke(`M${-190 + i * 127} -255 V-195`, '#4a4f5c', 6)).join('')
    + ret(-130, -160, 260, 66, '#f4f6f8', 6, 4) + txt(0, -114, o.placa || 'LOC-4D10', 38, OUT)
    + ret(-560, -90, 1120, 50, '#2a2d34', 16, 4)
    + ret(-520, -40, 150, 70, '#1b1d22', 16, 0) + ret(370, -40, 150, 70, '#1b1d22', 16, 0)
    + ret(300, -985, 130, 44, '#f2d36b', 6, 3) + txt(365, -955, 'LOCADORA', 17, OUT)
    + '</g>';
}
function ventiladorSVG(x, y, k, t) {
  const a = (t * 1400) % 360;
  return `<g transform="translate(${x} ${y}) scale(${k})">` + ret(-14, 40, 28, 70, '#c7cbd0', 4, 2.5) + ell(0, 118, 50, 14, '#9aa3aa', OUT, 2.5)
    + `<circle cx="0" cy="0" r="62" fill="#e9f2f8" fill-opacity=".35" stroke="${OUT}" stroke-width="3"/>`
    + `<g transform="rotate(${a.toFixed(1)})">` + [0, 120, 240].map((r) => `<ellipse transform="rotate(${r})" cx="0" cy="-30" rx="16" ry="30" fill="#8fd3e8" stroke="${OUT}" stroke-width="2"/>`).join('') + '</g>'
    + `<circle cx="0" cy="0" r="10" fill="#55606c" stroke="${OUT}" stroke-width="2"/>` + '</g>';
}

/* ---------- cozinha da Lua (ep. 5 em diante) ----------
   Estilo orgânico: luz motivada e visível (sol pela janela de dia; luminária pendente, luz sob o armário e
   janela da cidade à noite), camadas, materiais e objetos ligados à ação. A bancada da frente fica em
   bancadaLua() e é desenhada na frente dos atores: quem está atrás dela não precisa de semPernas. */
function cenaCozinhaLua(dia) {
  const k = dia ? 'd' : 'n';
  const parede = dia ? '#f6e3c3' : '#b99a7e', paredeB = dia ? '#e9cfa6' : '#9c7f66', azul = dia ? '#bfe3ec' : '#7d9aa6';
  let fundo = `<rect x="-600" y="-400" width="2300" height="2500" fill="${parede}"/>`;
  // janela com a cidade lá fora
  fundo += ret(40, 470, 330, 410, '#7a5a44', 10) + `<rect x="58" y="488" width="294" height="374" fill="${dia ? '#9fd6f0' : '#1f2a48'}"/>`;
  fundo += dia ? ell(130, 560, 60, 22, '#fffaf0') + ell(250, 610, 70, 20, '#fffaf0') + [80, 160, 250].map((x, i) => ret(58 + x * .9, 720 - i * 40, 70, 160 + i * 40, '#e6b97a', 0, 0)).join('')
    : [80, 170, 260].map((x, i) => ret(58 + x * .9, 700 - i * 30, 70, 180 + i * 30, '#2c3a4f', 0, 0) + `<rect x="${78 + x * .9}" y="${740 - i * 30}" width="16" height="22" fill="#f2d36b"/><rect x="${102 + x * .9}" y="${790 - i * 30}" width="16" height="22" fill="#f2d36b"/>`).join('') + ell(300, 540, 20, 20, '#fff1c9');
  fundo += stroke('M205 488 L205 862 M58 675 L352 675', '#7a5a44', 8) + shape('M58 488 L120 488 Q110 680 130 862 L58 862Z', '#e8736f', 2) + shape('M352 488 L300 488 Q312 680 296 862 L352 862Z', '#e8736f', 2) + ret(30, 870, 350, 20, '#d8c8b0', 4);
  // azulejos atrás da pia
  fundo += `<rect x="-600" y="930" width="2300" height="300" fill="${azul}"/>` + [...Array(40)].map((_, i) => stroke(`M${-600 + i * 60} 930 L${-600 + i * 60} 1230`, dia ? '#a8cfd9' : '#6c8794', 1.6)).join('') + [990, 1050, 1110, 1170].map(y => stroke(`M-600 ${y} L1700 ${y}`, dia ? '#a8cfd9' : '#6c8794', 1.6)).join('');
  // armários de cima, com luz embaixo à noite
  fundo += ret(470, 430, 400, 270, '#c98f5a', 8) + stroke('M670 430 L670 700', OUT, 3) + ret(640, 560, 8, 40, '#8a5a2e', 3, 2) + ret(692, 560, 8, 40, '#8a5a2e', 3, 2);
  if (!dia) fundo += `<defs><linearGradient id="czLuzArm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe7a8" stop-opacity=".55"/><stop offset="1" stop-color="#ffe7a8" stop-opacity="0"/></linearGradient></defs><path d="M470 700 L870 700 L920 1090 L420 1090Z" fill="url(#czLuzArm)"/>` + ret(480, 696, 380, 8, '#fff3c4', 3, 0);
  // pia do fundo com louça empilhada e torneira
  fundo += ret(380, 1060, 600, 30, '#d9d4cc', 4) + ret(390, 1090, 580, 150, dia ? '#e3d6c3' : '#b3a593', 0) + stroke('M690 1060 L690 1010 Q690 990 720 990 L740 990', '#8a9099', 8);
  fundo += [0, 1, 2, 3].map(i => ell(560, 1052 - i * 9, 54 - i * 3, 9, '#fbfbf7', OUT, 2)).join('') + ret(600, 980, 90, 70, '#6c737a', 10) + ell(645, 980, 46, 9, '#8a9099', OUT, 2) + ret(760, 1010, 40, 46, '#e8736f', 6) + ret(805, 1000, 36, 56, '#8fd3e8', 6);
  // geladeira com ímãs e bilhete
  fundo += ret(910, 560, 190, 1040, '#eef0f0', 16) + stroke('M910 900 L1100 900', OUT, 3) + ret(930, 760, 10, 90, '#9aa3aa', 4, 2) + ret(930, 960, 10, 110, '#9aa3aa', 4, 2)
    + ret(985, 620, 90, 70, '#fff6e6', 2, 2) + txt(1030, 650, 'Doces', 18, '#c2584f') + txt(1030, 674, 'da Lua', 18, '#c2584f') + ell(1030, 616, 8, 8, '#e8736f', OUT, 1.6) + ell(980, 960, 12, 12, '#f2d36b', OUT, 1.6) + ell(1040, 1010, 12, 12, '#8fd3a8', OUT, 1.6);
  // ganchinho com o crachá do trabalho (o emprego que ela não larga)
  fundo += ell(410, 560, 7, 7, '#8a9099', OUT, 2) + stroke('M410 566 L392 640 M410 566 L428 640', '#566d86', 2.6) + ret(386, 638, 48, 62, '#eef0f0', 4) + ret(394, 648, 32, 18, '#566d86', 1, 0) + ret(394, 674, 32, 5, '#a7afb7', 1, 0);
  // piso de ladrilho em perspectiva
  let chao = `<rect x="-900" y="${CHAO - 40}" width="2900" height="440" fill="${dia ? '#e8dcc6' : '#a99c86'}"/>`;
  const vpY = CHAO - 600, fr = (CHAO - 40 - vpY) / (CHAO + 380 - vpY);
  for (let i = -12; i <= 12; i++) { const xb = 540 + i * 150; chao += stroke(`M${r2(540 + (xb - 540) * fr)} ${CHAO - 40} L${xb} ${CHAO + 380}`, dia ? '#cbbd9f' : '#86795f', 2); }
  for (const y of [CHAO + 10, CHAO + 80, CHAO + 180, CHAO + 310]) chao += stroke(`M-900 ${y} L2000 ${y}`, dia ? '#cbbd9f' : '#86795f', 2);
  // luz: sol pela janela (dia) ou luminária pendente acesa (noite)
  let luz = '';
  if (dia) luz = `<defs><linearGradient id="czSol" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff2c2" stop-opacity=".45"/><stop offset="1" stop-color="#fff2c2" stop-opacity="0"/></linearGradient></defs><path d="M58 488 L352 488 L900 1600 L300 1600Z" fill="url(#czSol)"/>`;
  else luz = `<defs><radialGradient id="czPendente"><stop offset="0" stop-color="#ffe2a0" stop-opacity=".5"/><stop offset=".5" stop-color="#ffd58a" stop-opacity=".18"/><stop offset="1" stop-color="#ffd58a" stop-opacity="0"/></radialGradient></defs>` + ell(560, 520, 520, 560, 'url(#czPendente)');
  const pendente = stroke('M560 -300 L560 330', '#3a302a', 4) + shape('M480 400 Q480 330 560 330 Q640 330 640 400Z', dia ? '#2f8f8a' : '#2f8f8a') + ell(560, 404, 26, 12, dia ? '#e9e1d2' : '#fff3c4', OUT, 2);
  return [{ f: .95, svg: fundo }, { f: 1, svg: chao + luz + pendente }];
}
// Bancada da frente (a ilha onde a Lua trabalha). Desenhe por último, na frente dos atores.
function bancadaLua(dia, y = 1215) {
  return `<rect x="-300" y="${y}" width="1680" height="34" rx="6" fill="${dia ? '#d9c3a1' : '#a8916f'}" stroke="${OUT}" stroke-width="3"/>`
    + `<rect x="-300" y="${y + 34}" width="1680" height="800" fill="${dia ? '#5f8f86' : '#46695f'}" stroke="${OUT}" stroke-width="3"/>`
    + [0, 1, 2, 3, 4].map(i => ret(-40 + i * 250, y + 70, 220, 400, dia ? '#6fa196' : '#527a6f', 10, 2.5) + ret(140 + i * 250, y + 240, 12, 60, '#c7cbd0', 4, 2)).join('')
    + `<rect x="-300" y="${y + 34}" width="1680" height="22" fill="#2a1f22" opacity=".18"/>`;
}
// Caixa de doce com laço; aberta = sem tampa.
function caixaDoceSVG(x, y, k = 1, cor = '#f3d1d9') {
  return `<g transform="translate(${x} ${y}) scale(${k})">` + shape('M-60 0 L60 0 L56 -70 L-56 -70Z', cor) + shape('M-64 -70 L64 -70 L64 -86 L-64 -86Z', '#fff6e6')
    + stroke('M0 -86 L0 0', '#c2584f', 7) + stroke('M-64 -78 L64 -78', '#c2584f', 7) + shape('M0 -88 Q-30 -112 -26 -92 Q-22 -80 0 -88Z', '#e8736f', 2) + shape('M0 -88 Q30 -112 26 -92 Q22 -80 0 -88Z', '#e8736f', 2) + '</g>';
}
function timerSVG(x, y, k = 1, toca = 0) {
  const t = toca ? Math.sin(toca * 60) * 6 : 0;
  return `<g transform="translate(${x} ${y}) rotate(${r2(t)}) scale(${k})">` + ell(0, 0, 40, 40, '#e8736f', OUT, 3) + ell(0, 0, 28, 28, '#fff6e6', OUT, 2) + stroke('M0 0 L0 -20 M0 0 L12 6', OUT, 3) + ret(-8, -52, 16, 12, '#c2584f', 3, 2)
    + (toca ? stroke('M-52 -40 Q-62 -28 -54 -16 M52 -40 Q62 -28 54 -16', OUT, 3) : '') + '</g>';
}
function notebookSVG(x, y, k = 1, aberto = true, tela = '') {
  if (!aberto) return `<g transform="translate(${x} ${y}) scale(${k})">` + shape('M-120 0 L120 0 L128 14 L-128 14Z', '#9aa3aa') + shape('M-118 -10 L118 -10 L120 0 L-120 0Z', '#c7cbd0') + '</g>';
  return `<g transform="translate(${x} ${y}) scale(${k})">` + shape('M-110 -150 L110 -150 L116 -6 L-116 -6Z', '#3b3f4a') + `<rect x="-100" y="-140" width="200" height="124" fill="#e9eef2"/>` + tela + shape('M-130 -6 L130 -6 L140 12 L-140 12Z', '#c7cbd0') + '</g>';
}

const CENARIOS = { vazio: () => [], rua: () => cenaRua(false), ruaNoite: () => cenaRua(false, true), ruaBorracharia: () => cenaRua(true), borracharia: cenaBorracharia, porta: () => cenaPorta(false), portaAberta: () => cenaPorta(true), portaDiaAberta: () => cenaPorta(true, true), predioChique: cenaPredioChique, casa: cenaCasa,
  box: cenaBox, kitnet: () => cenaKitnet(true), kitnetNoite: () => cenaKitnet(false), escritorio: cenaEscritorio, salaReuniao: cenaSalaReuniao, casaJao: () => cenaCasaJao(false), casaJaoDia: () => cenaCasaJao(true), quartoLua: cenaQuartoLua, janelas: cenaJanelas,
  janelaTico: () => cenaJanelaClose('#9a6a55', INT_TICO(), '#c9a27a'), janelaLua: () => cenaJanelaClose('#5f7a7a', INT_LUA(), '#d9b48c'),
  cozinhaLua: () => cenaCozinhaLua(true), cozinhaLuaNoite: () => cenaCozinhaLua(false) };
