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
function cenaPorta(aberta, dia = false) {
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
/* ---------- moto de frente, em três quartos ---------- */
// Origem no chão, sob a roda da frente. As pontas do guidão estão em MOTO_FRENTE, para as mãos alcançarem.
const MOTO_FRENTE = { gripL: [-72, -452], gripR: [118, -432] };
function motoFrenteSVG(x, y, s, o = {}) {
  const giro = o.giro || 0, r = 150, ex = .46;
  const raios = [0, 1, 2, 3].map((i) => { const a = (giro + i * 45) * Math.PI / 180, c = Math.cos(a) * r * .6, n = Math.sin(a) * r * .6; return stroke(`M${-110 + c * ex} ${-r + n} L${-110 - c * ex} ${-r - n}`, '#3a3a40', 3.5); }).join('');
  return `<g transform="translate(${x} ${y}) scale(${s})">`
    + `<ellipse cx="225" cy="-92" rx="42" ry="92" fill="#26262b" stroke="${OUT}" stroke-width="${T}"/><ellipse cx="225" cy="-92" rx="22" ry="52" fill="#8a9099" stroke="${OUT}" stroke-width="${T}"/>`
    + stroke('M60 -240 L225 -110', OUT, 22) + stroke('M60 -240 L225 -110', '#55606c', 13) + shape('M-6 -236 L112 -226 L128 -128 L14 -122Z', '#3a3a40') + stroke('M34 -196 L100 -192 M34 -166 L104 -162', '#6c727a', 5) + stroke('M60 -118 L250 -92', OUT, 20) + stroke('M60 -118 L250 -92', '#a7adb5', 12)
    + shape('M95 -345 Q210 -350 290 -300 L285 -262 Q190 -280 100 -282Z', '#ae5d49')
    + shape('M-34 -372 Q40 -408 112 -360 Q130 -300 104 -252 Q30 -218 -30 -254 Q-52 -310 -34 -372Z', '#c9412f')
    + `<g transform="translate(68 -318) rotate(8)">` + txt(0, 6, 'Compa-', 15, '#fff3d6') + txt(0, 24, 'nheira', 15, '#fff3d6') + `</g>`
    + stroke('M-16 -395 L-92 -128', OUT, 21) + stroke('M-16 -395 L-92 -128', '#8a9099', 14)
    + stroke('M42 -384 L-34 -120', OUT, 21) + stroke('M42 -384 L-34 -120', '#8a9099', 14)
    + `<ellipse cx="-110" cy="${-r}" rx="${r * ex}" ry="${r}" fill="#26262b" stroke="${OUT}" stroke-width="${T}"/>`
    + `<ellipse cx="-110" cy="${-r}" rx="${r * ex * .62}" ry="${r * .62}" fill="#a7adb5" stroke="${OUT}" stroke-width="${T}"/>` + raios
    + `<ellipse cx="-110" cy="${-r}" rx="${r * ex * .18}" ry="${r * .18}" fill="#3a3a40" stroke="${OUT}" stroke-width="2"/>`
    + shape('M-178 -228 Q-120 -320 -38 -258 L-52 -218 Q-112 -262 -158 -196Z', '#c9412f')
    + stroke('M-72 -452 L24 -442 L118 -432', OUT, 18) + stroke('M-72 -452 L24 -442 L118 -432', '#8a9099', 10)
    + stroke('M-72 -452 L-50 -450', '#26262b', 15) + stroke('M96 -434 L118 -432', '#26262b', 15)
    + stroke('M-44 -448 L-64 -540', OUT, 8) + stroke('M100 -434 L136 -476', OUT, 8)
    + ell(-68, -564, 25, 31, '#26262b', OUT, T) + ell(-68, -564, 17, 23, '#c9dfe6')
    + ell(146, -494, 21, 25, '#26262b', OUT, T) + ell(146, -494, 14, 18, '#c9dfe6')
    + ell(10, -398, 42, 46, '#f2d36b', OUT, T) + ell(4, -402, 22, 25, '#fff6d8')
    + '</g>';
}
function fedorSVG(x, y, t, forca = 1) {
  return [-1, 0, 1].map((i) => {
    const o = Math.sin(t * 5 + i * 2) * 11, h = 150 * forca, a = x + i * 72;
    return `<path d="M${a} ${y} Q${a + 34 + o} ${y - h * .25} ${a} ${y - h * .5} Q${a - 34 - o} ${y - h * .75} ${a} ${y - h}" fill="none" stroke="#7f9419" stroke-width="9" stroke-linecap="round" opacity="${(.82 * Math.min(1, forca)).toFixed(2)}"/>`;
  }).join('');
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

const CENARIOS = { vazio: () => [], rua: () => cenaRua(false), ruaNoite: () => cenaRua(false, true), ruaBorracharia: () => cenaRua(true), borracharia: cenaBorracharia, porta: () => cenaPorta(false), portaAberta: () => cenaPorta(true), portaDiaAberta: () => cenaPorta(true, true), predioChique: cenaPredioChique, casa: cenaCasa };
