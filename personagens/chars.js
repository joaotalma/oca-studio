'use strict';
// Se Vira, Tico: rig dos personagens (V12).
/* ================= RIG =================
   Mesma API do personagens/chars.js: drawChar(CHARS.tico, pose) e drawDog(pose) devolvem texto SVG,
   com os pés em y = 0. Pose: armL/armR/legL/legR = [junta de cima, junta de baixo], em graus absolutos a
   partir de "reto para baixo" (negativo = esquerda da tela). Também: lean, head, expr, mouth, detalhe, blink,
   breath, liftL, liftR, propL, propR e frente ('L' ou 'R': braço à frente do rosto).
   Regra da montagem: peças da mesma cor viram uma silhueta só (contorno por baixo, preenchimento por cima). */
const OUT = '#2a1f22', T = 2.6;
const r2 = n => Math.round(n * 100) / 100;
const rad = d => d * Math.PI / 180;
const lerp = (a, b, p) => a + (b - a) * p;
const P2 = (x, y, a, l) => [x + Math.sin(rad(a)) * l, y + Math.cos(rad(a)) * l];
const on = (a, b, p) => [lerp(a[0], b[0], p), lerp(a[1], b[1], p)];
const quad = (a, b, ra, rb) => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, n = [-dy / l, dx / l];
  return { d: `M${r2(a[0] + n[0] * ra)} ${r2(a[1] + n[1] * ra)}L${r2(b[0] + n[0] * rb)} ${r2(b[1] + n[1] * rb)}L${r2(b[0] - n[0] * rb)} ${r2(b[1] - n[1] * rb)}L${r2(a[0] - n[0] * ra)} ${r2(a[1] - n[1] * ra)}Z` }; };
const circ = (c, r) => ({ c, r });
const el = (s, attrs) => s.c ? `<circle cx="${r2(s.c[0])}" cy="${r2(s.c[1])}" r="${r2(s.r)}" ${attrs}/>` : `<path d="${s.d}" ${attrs}/>`;
const union = (list, fill, t = T) => list.map(s => el(s, `fill="${OUT}" stroke="${OUT}" stroke-width="${t * 2}" stroke-linejoin="round"`)).join('') + list.map(s => el(s, `fill="${fill}"`)).join('');
const fillOnly = (d, fill, extra = '') => `<path d="${d}" fill="${fill}" ${extra}/>`;
const shape = (d, fill, sw = T, extra = '') => `<path d="${d}" fill="${fill}" stroke="${OUT}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round" ${extra}/>`;
const stroke = (d, col = OUT, sw = 2) => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
const ell = (cx, cy, rx, ry, fill, st = 'none', sw = 0, extra = '') => `<ellipse cx="${r2(cx)}" cy="${r2(cy)}" rx="${r2(rx)}" ry="${r2(ry)}" fill="${fill}" stroke="${st}" stroke-width="${sw}" ${extra}/>`;

const CHARS = {
  tico: { key: 'tico', name: 'Tico', emoji: '🩴', papel: 'Protagonista', desc: 'Protagonista, vive de bicos: exausto, irônico e persistente. Prefere inventar a confessar.', paleta: ['#d59a6e', '#272023', '#a8b94c', '#465a72'],
    skin: '#d59a6e', shade: '#ad714f', hair: '#272023', hairHi: '#4b3934', iris: '#584334', cloth: '#a8b94c', clothD: '#7d9136', pants: '#465a72', pantsD: '#304054', shoe: 'chinelo',
    hs: 1.28, neck: 15, neckW: 21, torso: 172, sw: 66, waist: 54, hem: 56, hw: 44, armU: 92, armF: 88, ru: 15, re: 13, rw: 10.5, sleeve: .34, thigh: 140, shin: 136, rt: 25, rk: 20, ra: 18, cuff: true, lid: .3, bags: true, stubble: true, prop: 'phone', browW: 4.2, jaw: 'm' },
  lua: { key: 'lua', name: 'Lua', emoji: '🌙', papel: 'Vizinha de infância', desc: 'Vizinha de infância e primeiro crush do Tico, analista: gentil e perspicaz. Responde "tá tudo ótimo" para tudo.', paleta: ['#e9b18b', '#bd8641', '#ae5d49', '#454044'],
    skin: '#e9b18b', shade: '#c98767', hair: '#bd8641', hairHi: '#e4b16c', iris: '#568276', cloth: '#ae5d49', clothD: '#814538', pants: '#454044', pantsD: '#2f2c31', shoe: 'tenis',
    hs: 1.17, neck: 15, neckW: 16, torso: 152, sw: 50, waist: 37, hem: 47, hw: 44, armU: 82, armF: 78, ru: 11.5, re: 10, rw: 8, sleeve: .42, thigh: 128, shin: 126, rt: 23, rk: 16.5, ra: 14, lid: .1, lashes: true, prop: 'cup', browW: 3.2, jaw: 'f' },
  jao: { key: 'jao', name: 'Jão', emoji: '🎒', papel: 'Motoboy', desc: 'Motoboy e galo de luta: forte, de pavio curto e coração mole. Dono da moto Companheira.', paleta: ['#805039', '#3d4049', '#665e50', '#bd303c'],
    skin: '#805039', shade: '#563327', hair: '#1e1b1e', hairHi: '#3a2f2c', iris: '#2a2521', cloth: '#3d4049', clothD: '#282b33', pants: '#665e50', pantsD: '#49453e', shoe: 'bota',
    hs: 1.19, neck: 8, neckW: 31, torso: 170, sw: 90, waist: 74, hem: 74, hw: 56, armU: 90, armF: 84, ru: 23, re: 20, rw: 15, sleeve: .3, thigh: 124, shin: 122, rt: 32, rk: 25, ra: 21, lid: .34, beard: true, browW: 6, jaw: 'm', handS: 1.3 },
  leticia: { key: 'leticia', name: 'Letícia', emoji: '📱', papel: 'Coach de mindset', desc: 'Coach de mindset: confiante e exigente. "Gratidão!" por fora, cartão estourado por dentro.', paleta: ['#e7ac87', '#342326', '#bf842a', '#c8b094'],
    skin: '#e7ac87', shade: '#bc7d60', hair: '#342326', hairHi: '#5c3e38', iris: '#49372f', cloth: '#bf842a', clothD: '#8f601f', pants: '#c8b094', pantsD: '#a48d73', shoe: 'scarpin',
    hs: 1.32, neck: 19, neckW: 15, torso: 164, sw: 48, waist: 36, hem: 47, hw: 40, armU: 90, armF: 86, ru: 11.5, re: 10, rw: 8, sleeve: .94, thigh: 150, shin: 146, rt: 22, rk: 15.5, ra: 13, lid: .16, lashes: true, prop: 'phone', browW: 3.4, jaw: 'f' },
  borracheiro: { key: 'borracheiro', name: 'Borracheiro', emoji: '🔧', papel: 'Borracheiro', desc: 'Dono da borracharia: cansado, sem dinheiro e bom de negócio.', paleta: ['#b57f5c', '#3a3331', '#4f7f9e', '#355a73'],
    skin: '#b57f5c', shade: '#8f6145', hair: '#3a3331', hairHi: '#6a5f5a', iris: '#4a3a2e', cloth: '#4f7f9e', clothD: '#355a73', pants: '#4f7f9e', pantsD: '#355a73', shoe: 'bota',
    hs: 1.11, neck: 8, neckW: 27, torso: 150, sw: 74, waist: 76, hem: 74, hw: 50, armU: 84, armF: 78, ru: 19, re: 17, rw: 13, sleeve: .3, thigh: 120, shin: 116, rt: 30, rk: 24, ra: 20, lid: .4, bags: true, browW: 6, jaw: 'm', bigode: true },
  marlene: { key: 'marlene', name: 'Dona Marlene', emoji: '🎂', papel: 'A dona do bolo', desc: 'Fez 80 anos e esperava um bolo.', paleta: ['#e3b597', '#d8d4d0', '#9c5f8a', '#6f4464'],
    skin: '#e3b597', shade: '#bf8c70', hair: '#d8d4d0', hairHi: '#f2efec', iris: '#5a6a72', cloth: '#9c5f8a', clothD: '#6f4464', pants: '#6f4464', pantsD: '#4f2f47', shoe: 'scarpin',
    hs: 1.0, neck: 10, neckW: 16, torso: 130, sw: 50, waist: 44, hem: 50, hw: 44, armU: 74, armF: 70, ru: 12, re: 10.5, rw: 8.5, sleeve: .9, thigh: 110, shin: 105, rt: 22, rk: 16, ra: 14, lid: .3, bags: true, lashes: false, browW: 3, jaw: 'f', oculos: true, chapeu: true, prop: 'pao' },
  vendedor: { key: 'vendedor', name: 'Vendedor', emoji: '🍬', papel: 'Vendedor de paçoca', desc: 'Vende paçoca na rua e acredita em si mais do que o Tico acredita.', paleta: ['#c98f68', '#4a403c', '#e9e4d8', '#6b5a48'],
    skin: '#c98f68', shade: '#a06e4e', hair: '#4a403c', hairHi: '#7a6e68', iris: '#4a3a2e', cloth: '#e9e4d8', clothD: '#c4bdac', pants: '#6b5a48', pantsD: '#4f4234', shoe: 'chinelo',
    hs: 1.08, neck: 8, neckW: 26, torso: 150, sw: 70, waist: 92, hem: 90, hw: 48, armU: 82, armF: 76, ru: 17, re: 15, rw: 12, sleeve: .12, thigh: 116, shin: 112, rt: 29, rk: 23, ra: 19, lid: .24, bags: true, browW: 5, jaw: 'm' },
  ceo: { key: 'ceo', name: 'CEO', emoji: '💼', papel: 'Dono da empresa da Lua', desc: 'Dono da empresa em que a Lua trabalha: simpático, distraído e pai do Júnior.', paleta: ['#d8a07a', '#9a9690', '#2f3a52', '#b8323c'],
    skin: '#d8a07a', shade: '#b07a58', hair: '#9a9690', hairHi: '#c9c5bf', iris: '#4a3a2e', cloth: '#2f3a52', clothD: '#1f2738', pants: '#2f3a52', pantsD: '#1f2738', shoe: 'bota',
    hs: 1.12, neck: 9, neckW: 24, torso: 165, sw: 78, waist: 84, hem: 82, hw: 52, armU: 86, armF: 80, ru: 19, re: 16.5, rw: 13, sleeve: .94, thigh: 126, shin: 122, rt: 30, rk: 24, ra: 20, lid: .38, bags: true, browW: 5.4, jaw: 'm', oculos: true, gravata: '#b8323c', cracha: 'CEO' },
  junior: { key: 'junior', name: 'Júnior', emoji: '🧴', papel: 'Filho do CEO', desc: 'Recém-chegado e recém-promovido: educado, perfumado e sem saber abrir um arquivo.', paleta: ['#f0c09a', '#3a2a20', '#cfe3ef', '#3e4450'],
    skin: '#f0c09a', shade: '#cf9a76', hair: '#3a2a20', hairHi: '#9a7a5e', iris: '#5a4a3a', cloth: '#cfe3ef', clothD: '#9fbccc', pants: '#3e4450', pantsD: '#2a2f38', shoe: 'bota',
    hs: 1.24, neck: 14, neckW: 18, torso: 160, sw: 58, waist: 46, hem: 50, hw: 44, armU: 88, armF: 84, ru: 13, re: 11, rw: 9, sleeve: .9, thigh: 120, shin: 116, rt: 25, rk: 18, ra: 15.5, lid: .12, browW: 3.6, jaw: 'm', gravata: '#2a4f8a' },
};
const EXPR = {
  neutro: { mouth: 'flat' }, cansado: { lid: .55, bags: true, browIn: -2, browY: 2, mouth: 'flat' },
  feliz: { lid: .04, low: .22, browY: -3, mouth: 'smile' }, rindo: { eye: 'arco', browY: -6, mouth: 'laugh' },
  surpreso: { lid: 0, open: 1.2, pupil: .8, browY: -9, mouth: 'o' }, preocupado: { lid: .1, browIn: -7, browY: -1, mouth: 'wavy' },
  envergonhado: { lid: .22, look: [2, 2], browIn: -5, blush: true, mouth: 'small' }, forcado: { lid: .04, low: .14, pupil: .78, browY: -4, mouth: 'teeth' },
  bravo: { lid: .3, browIn: 9, browY: 2, mouth: 'frown' }, triste: { lid: .3, look: [0, 2], browIn: -8, browY: 1, mouth: 'sad' },
  lado: { lid: .28, look: [4.5, 0], browIn: -1, mouth: 'side' }, pensando: { lid: .14, look: [3, -3], browL: -7, browIn: 1, mouth: 'side' },
  aliviado: { eye: 'suave', browIn: -3, mouth: 'smallsmile' },
};
const EXPR_ORDER = Object.keys(EXPR);
const NOMES_EXPR = { neutro: 'Neutro', cansado: 'Cansado', feliz: 'Feliz', rindo: 'Rindo', surpreso: 'Surpreso', preocupado: 'Preocupado', envergonhado: 'Sem graça', forcado: 'Forçado', bravo: 'Bravo', triste: 'Triste', lado: 'De lado', pensando: 'Pensando', aliviado: 'Aliviado' };

/* ---------- rosto ---------- */
function mouthSVG(kind) {
  const M = {
    flat: () => stroke('M-12 23 Q0 25 12 22', '#5a3a34', 2.4), smile: () => stroke('M-16 18 Q0 33 16 18', '#4a2a2a', 2.6) + stroke('M-18 16 Q-17 18 -15 18 M18 16 Q17 18 15 18', '#4a2a2a', 2),
    laugh: () => shape('M-19 14 Q0 20 19 14 Q17 40 0 42 Q-17 40 -19 14Z', '#51242b', 2.4) + fillOnly('M-15 16 Q0 21 15 16 L13 22 Q0 26 -13 22Z', '#f7e9d8') + ell(0, 36, 8, 5, '#c85a5e'),
    o: () => shape('M-8 20 Q-9 12 0 12 Q9 12 8 20 Q9 32 0 33 Q-9 32 -8 20Z', '#542c30', 2.4), frown: () => stroke('M-13 27 Q0 18 13 26', '#4a2a2a', 2.8), sad: () => stroke('M-12 30 Q0 19 12 30', '#4a2a2a', 2.6),
    small: () => stroke('M-6 24 Q0 26 6 24', '#5a3a34', 2.4), smallsmile: () => stroke('M-10 21 Q0 29 10 21', '#4a2a2a', 2.4), wavy: () => stroke('M-13 25 Q-7 20 0 24 Q7 28 13 22', '#4a2a2a', 2.4),
    side: () => stroke('M-5 25 Q4 27 13 20', '#4a2a2a', 2.5), teeth: () => shape('M-18 17 Q0 22 18 17 Q15 32 0 32 Q-15 32 -18 17Z', '#f7ecdc', 2.2) + stroke('M-16 24 L16 24 M-8 19 L-7 31 M0 20 L0 32 M8 19 L7 31', '#b9a48f', 1),
    closed: () => stroke('M-10 23 L10 23', '#4a2a2a', 2.6), vsmall: () => shape('M-7 22 Q0 18 7 22 Q6 29 0 29 Q-6 29 -7 22Z', '#51242b', 2.2),
    vopen: () => shape('M-11 18 Q0 13 11 18 Q10 34 0 35 Q-10 34 -11 18Z', '#4a2027', 2.3) + fillOnly('M-8 18 Q0 15 8 18 L7 21 Q0 19 -7 21Z', '#f8e7d5') + ell(0, 30, 6, 3.6, '#c85a5e'),
    vwide: () => shape('M-17 17 Q0 13 17 17 Q15 33 0 34 Q-15 33 -17 17Z', '#4a2027', 2.3) + fillOnly('M-14 17 Q0 14 14 17 L13 22 Q0 19 -13 22Z', '#f8e7d5') + ell(0, 29, 8, 3.6, '#c85a5e'),
  };
  return (M[kind] || M.flat)();
}
const VISEME = { closed: 'closed', small: 'vsmall', open: 'vopen', wide: 'vwide' };

function eyeSVG(d, side, E, blink) {
  const x = side * 21, y = -20, rx = 12.5, ry = 9.5 * (E.open || 1), line = '#2b2024';
  const look = E.look || [0, 0], px = x + look[0] - side * 1, py = y + 1 + look[1];
  const kind = blink ? 'suave' : E.eye;
  let s = '';
  if (kind === 'arco') return stroke(`M${x - 12} ${y + 4} Q${x} ${y - 9} ${x + 12} ${y + 4}`, line, 3);
  if (kind === 'suave') return stroke(`M${x - 12} ${y} Q${x} ${y + 7} ${x + 12} ${y}`, line, 3) + (d.lashes ? stroke(`M${x + side * 12} ${y} l${side * 4} -3`, line, 2) : '');
  s += ell(x, y, rx, ry, '#f8f3e8', line, 2.2);
  const pS = E.pupil || 1;
  s += ell(px, py, 5.6 * pS, 6.4 * pS, d.iris) + ell(px, py, 3 * pS, 3.8 * pS, '#171719') + ell(px - 1.4, py - 2.2, 1.6, 1.8, '#fff');
  const lid = E.lid != null ? E.lid : d.lid;
  if (lid > 0) { const ly = y - ry + 2 * ry * lid;
    s += fillOnly(`M${x - rx - 2.5} ${y - ry - 3.5}L${x + rx + 2.5} ${y - ry - 3.5}L${x + rx + 2.5} ${ly}Q${x} ${ly - 2.5} ${x - rx - 2.5} ${ly}Z`, d.skin);
    s += stroke(`M${x - rx} ${ly + .6}Q${x} ${ly - 2.6} ${x + rx} ${ly + .6}`, line, 2.5); }
  if (E.low) { const ly = y + ry - 2 * ry * E.low;
    s += fillOnly(`M${x - rx - 2.5} ${y + ry + 3.5}L${x + rx + 2.5} ${y + ry + 3.5}L${x + rx + 2.5} ${ly}Q${x} ${ly + 2.5} ${x - rx - 2.5} ${ly}Z`, d.skin);
    s += stroke(`M${x - rx + 1} ${ly}Q${x} ${ly + 2.5} ${x + rx - 1} ${ly}`, line, 1.8); }
  if (d.lashes) s += stroke(`M${x + side * 11} ${y - 7} l${side * 4.5} -4 M${x + side * 7} ${y - 9.5} l${side * 3} -4.5`, line, 2);
  if (E.bags || d.bags) s += stroke(`M${x - 10} ${y + ry + 3.5} Q${x} ${y + ry + 7} ${x + 10} ${y + ry + 3.5}`, d.shade, 1.6);
  return s;
}
function browSVG(d, side, E) {
  const dy = (E.browY || 0) + (side < 0 ? (E.browL || 0) : 0), inn = E.browIn || 0;
  const o = [side * 35, -38 + dy], i = [side * 9, -37 + dy + inn];
  return stroke(`M${o[0]} ${o[1]} Q${(o[0] + i[0]) / 2} ${(o[1] + i[1]) / 2 - 3.5} ${i[0]} ${i[1]}`, d.key === 'lua' ? '#8d6028' : d.hair, d.browW);
}
function faceShape(d) {
  return d.jaw === 'f' ? 'M-42 -42 Q-45 -76 -20 -86 Q2 -99 28 -81 Q46 -62 42 -38 L41 8 Q35 36 9 49 Q0 52 -8 49 Q-35 36 -42 8Z'
    : 'M-43 -42 Q-46 -76 -20 -86 Q2 -99 28 -81 Q47 -62 44 -38 L43 12 Q38 42 13 51 L-10 51 Q-38 41 -44 13Z';
}
function hairBack(d) {
  if (d.key === 'lua') return shape('M-47 -66 C-72 -30 -72 28 -58 58 Q-48 80 -34 62 Q-22 70 -18 46 L20 46 Q24 70 36 62 Q50 80 60 58 C74 28 72 -30 47 -66Z', d.hair) + stroke('M-58 -18 Q-66 18 -52 52 M58 -18 Q66 18 52 52', d.hairHi, 2.6);
  if (d.key === 'leticia') return shape('M26 -94 Q66 -104 72 -62 Q80 -8 58 44 Q46 16 40 -12 Q38 -46 30 -60Z', d.hair) + stroke('M60 -64 Q66 -22 56 20', d.hairHi, 2.6);
  if (d.key === 'marlene') return ell(0, -100, 25, 21, d.hair, OUT, T);
  return '';
}
function hairFront(d) {
  const h = d.hair, hi = d.hairHi;
  if (d.key === 'tico') return shape('M-44 -43 L-52 -68 -42 -65 -48 -88 -29 -78 -27 -102 -10 -85 0 -111 13 -89 29 -105 29 -81 47 -94 41 -71 55 -74 45 -54 47 -37 Q24 -63 3 -60 Q-18 -65 -44 -43Z', h) + stroke('M-37 -66 L-26 -78 -15 -71 0 -90 11 -73 27 -84 26 -64 40 -68', hi, 2.6);
  if (d.key === 'lua') return shape('M-44 -36 C-58 -90 -32 -108 -6 -101 C22 -113 52 -88 45 -36 Q38 -64 14 -80 Q-10 -56 -44 -36Z', h) + stroke('M-34 -74 Q-42 -60 -41 -48 M-12 -92 Q-24 -74 -32 -58 M20 -92 Q38 -76 41 -56', hi, 2.6);
  if (d.key === 'jao') return shape('M-45 -44 Q-49 -90 -14 -99 Q24 -106 45 -74 L46 -42 Q0 -66 -45 -44Z', '#963a48') + stroke('M-42 -58 Q0 -82 44 -56', '#b65e68', 2.6) + stroke('M-22 -92 Q0 -94 22 -88', '#b65e68', 2)
    + shape('M43 -68 Q62 -76 68 -60 Q58 -60 48 -56Z', '#963a48') + shape('M44 -60 Q62 -54 62 -36 Q52 -44 42 -48Z', '#7c2f3c');
  if (d.key === 'leticia') return shape('M-44 -34 Q-53 -88 -22 -100 Q8 -113 34 -94 Q52 -74 44 -34 Q40 -66 16 -82 Q-16 -82 -44 -34Z', h) + stroke('M-26 -84 Q2 -98 30 -80', hi, 2.6) + shape('M28 -96 Q38 -100 42 -90 Q40 -82 31 -83Z', '#bf842a', 2);
  if (d.key === 'borracheiro') return shape('M-44 -30 Q-52 -52 -38 -70 Q-40 -50 -34 -38Z', h) + shape('M44 -30 Q52 -52 38 -70 Q40 -50 34 -38Z', h);
  if (d.key === 'vendedor') return shape('M-45 -26 Q-53 -46 -42 -60 Q-44 -44 -37 -32Z', h) + shape('M45 -26 Q53 -46 42 -60 Q44 -44 37 -32Z', h) + stroke('M-20 -86 Q0 -92 20 -86', d.shade, 2.2);
  if (d.key === 'ceo') return shape('M-45 -24 Q-54 -50 -40 -70 Q-30 -82 -14 -86 Q-26 -70 -34 -40Z', h) + shape('M45 -24 Q54 -50 40 -70 Q30 -82 14 -86 Q26 -70 34 -40Z', h) + stroke('M-10 -90 Q0 -94 12 -90 M-4 -84 Q4 -88 10 -84', hi, 2.4);
  if (d.key === 'junior' && d.despenteado) return shape('M-45 -40 L-56 -70 -38 -66 -44 -96 -22 -82 -16 -112 0 -88 12 -116 22 -88 42 -104 38 -78 58 -80 46 -54 47 -38 Q20 -62 0 -60 Q-22 -62 -45 -40Z', h) + stroke('M-30 -72 L-18 -84 M6 -96 L14 -80 M30 -90 L34 -76', hi, 2.4);
  if (d.key === 'junior') return shape('M-45 -38 Q-52 -84 -16 -98 Q-4 -126 30 -122 Q52 -118 50 -100 Q40 -106 28 -102 Q50 -86 47 -38 Q30 -66 0 -68 Q-26 -66 -45 -38Z', h) + stroke('M-32 -70 Q-12 -88 18 -92 M-20 -60 Q4 -78 34 -80 M4 -106 Q22 -118 42 -112', hi, 3) + ell(22, -104, 7, 3, '#ffffff', 'none', 0, 'opacity=".75"') + ell(-14, -84, 6, 2.5, '#ffffff', 'none', 0, 'opacity=".6"');
  if (d.key === 'marlene') return shape('M-44 -34 C-58 -66 -38 -92 -14 -88 C4 -100 40 -92 44 -60 Q50 -46 43 -32 Q36 -58 14 -66 Q-14 -60 -44 -34Z', h) + stroke('M-30 -68 Q-20 -80 -6 -78 M14 -82 Q28 -78 34 -62', hi, 2.6);
  return '';
}
function detalheSVG(tipo) {
  if (tipo === 'suor') return shape('M36 -56 Q46 -40 41 -34 Q34 -29 30 -36 Q29 -44 36 -56Z', '#8fd3e8', 2) + stroke('M36 -43 Q34 -39 36 -37', '#eaf8fc', 1.6);
  if (tipo === 'lagrima') return shape('M-29 -8 Q-21 6 -25 11 Q-31 15 -35 9 Q-36 3 -29 -8Z', '#8fd3e8', 2) + stroke('M-30 2 Q-32 6 -30 8', '#eaf8fc', 1.6);
  if (tipo === 'veia') return stroke('M22 -68 Q27 -62 22 -56 M38 -68 Q33 -62 38 -56 M23 -70 Q30 -65 37 -70 M23 -54 Q30 -59 37 -54', '#c23b3b', 2.8);
  if (tipo === 'brilho') { const b = (x, y, r) => fillOnly(`M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r}Z`, '#fff'); return b(-27, -27, 5) + b(15, -27, 5) + b(-16, -16, 2.6) + b(26, -16, 2.6); }
  return '';
}
function headSVG(d, E, pose) {
  const sk = d.skin, sh = d.shade;
  let s = ell(-44, -7, 7.5, 12, sk, OUT, T) + ell(44, -7, 7.5, 12, sk, OUT, T) + stroke('M-46 -11 Q-41 -7 -44 0 M46 -11 Q41 -7 44 0', sh, 1.6);
  s += shape(faceShape(d), sk);
  if (d.stubble) s += fillOnly('M-41 14 Q-37 42 -10 49 L13 49 Q37 40 41 14 Q27 31 15 32 Q0 25 -14 32 Q-28 30 -41 14Z', sh, 'opacity=".42"');
  if (d.beard) s += fillOnly('M-44 6 Q-43 47 -10 56 Q0 62 13 56 Q43 46 44 6 Q34 15 25 15 Q0 8 -24 15 Q-35 15 -44 6Z', '#211c1d') + fillOnly('M-17 21 Q0 15 17 21 Q19 34 0 37 Q-19 34 -17 21Z', sk, 'opacity=".28"');
  if (E.blush) s += ell(-28, 2, 11, 6.5, '#d9604f', 'none', 0, 'opacity=".42"') + ell(28, 2, 11, 6.5, '#d9604f', 'none', 0, 'opacity=".42"');
  s += stroke('M-5 -8 Q-10 5 -6 10 Q0 14 7 10', sh, 2.2);
  const blink = pose.blink >= .5;
  for (const side of [-1, 1]) s += eyeSVG(d, side, E, blink);
  for (const side of [-1, 1]) s += browSVG(d, side, E);
  const kind = pose.mouth ? VISEME[pose.mouth] : E.mouth;
  if (kind === 'smile' && !pose.mouth) s += stroke('M-30 6 Q-27 11 -25 14 M30 6 Q27 11 25 14', sh, 1.5);
  const boca = mouthSVG(kind);
  s += d.beard ? boca.replaceAll('#4a2a2a', '#d8a98f').replaceAll('#5a3a34', '#d8a98f') : boca; // boca clara para aparecer na barba
  if (d.bigode) s += shape('M-20 15 Q-9 8 0 13 Q9 8 20 15 Q12 22 0 18 Q-12 22 -20 15Z', '#2c2725', 1.6);
  if (d.oculos) s += `<circle cx="-21" cy="-20" r="16" fill="none" stroke="${OUT}" stroke-width="2.6"/><circle cx="21" cy="-20" r="16" fill="none" stroke="${OUT}" stroke-width="2.6"/>` + stroke('M-5 -21 Q0 -24 5 -21', OUT, 2.6);
  s += hairFront(d);
  if (d.chapeu) s += shape('M-26 -84 L4 -146 L30 -86 Q2 -74 -26 -84Z', '#e8736f') + stroke('M-16 -100 L20 -92 M-6 -120 L14 -114', '#f2d36b', 3) + ell(4, -150, 8, 8, '#f2d36b', OUT, 2.2);
  for (const t of [].concat(pose.detalhe || [])) s += detalheSVG(t);
  return s;
}

/* ---------- objetos, mão e pé ---------- */
const ret2 = (x, y, w, h, fill) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${fill}" stroke="${OUT}" stroke-width="1.8"/>`;
function propSVG(kind) {
  const live = typeof kind === 'object' && kind ? kind.live : null;
  if (typeof kind === 'object' && kind) kind = kind.tipo;
  if (kind === 'phone') {
    const label = live ? 'AO VIVO' + (live.audiencia == null ? '' : ' · ' + String(live.audiencia).replace(/[^0-9]/g,'')) : '';
    return '<g transform="translate(-2 6) rotate(-8)"><rect x="-25" y="-47" width="50" height="90" rx="5" fill="#23252f" stroke="'+OUT+'" stroke-width="2"/><g transform="rotate(180 0 -2) scale(-1 1)"><rect x="-21" y="-41" width="42" height="76" rx="2" fill="#8ca9be"/>'+(live?'<rect x="-21" y="-41" width="42" height="25" rx="1" fill="#bd3548"/><text x="0" y="-31" text-anchor="middle" font-family="Arial" font-weight="900" font-size="5.5" fill="#fff">'+label+'</text>':'')+'<ellipse cx="0" cy="1" rx="11" ry="13" fill="#e7ac87"/><rect x="-15" y="16" width="30" height="15" rx="3" fill="#bf842a"/></g></g>';
  }
  if (kind === 'cup') return `<g transform="translate(0 15)">` + stroke('M15 -14 Q33 -14 31 2 Q29 14 12 12', OUT, 7.5) + stroke('M15 -14 Q33 -14 31 2 Q29 14 12 12', '#fff6e6', 3.4) + shape('M-17 -22 L17 -22 L13 20 Q0 25 -13 20Z', '#fff6e6') + fillOnly('M-15 -20 L15 -20 L14 -12 L-14 -12Z', '#6b3f2a') + stroke('M-7 -32 Q-2 -40 -7 -48 M6 -32 Q11 -40 6 -48', '#c9c1b4', 3) + `</g>`;
  if (kind === 'chave') return `<g transform="translate(2 28)">` + shape('M-3 0 L3 0 L3 28 L8 28 L8 33 L3 33 L3 38 L-3 38Z', '#c7cbd0', 1.8) + ell(0, -7, 10, 10, '#e2b13f', OUT, 2.2) + `</g>`;
  if (kind === 'chaveRoda') return `<g transform="translate(2 18)">` + shape('M-5 0 L5 0 L6 96 L-6 96Z', '#8a9099', 2.4) + shape('M-20 92 L20 92 L16 118 L-16 118Z', '#6c727a', 2.4) + `</g>`;
  if (kind === 'fatia') return `<g transform="translate(2 -2)">` + shape('M-24 -6 L24 -6 L14 26 L-14 26Z', '#fdf1dd') + fillOnly('M-23 -3 L23 -3 L20 6 L-20 6Z', '#e8736f') + `</g>`;
  if (kind === 'pao' || kind === 'paoAceso') return `<g transform="translate(2 8)">` + ret2(-4, 12, 8, 42, '#7fd6ee') + (kind === 'paoAceso' ? shape('M0 82 Q10 68 0 54 Q-10 68 0 82Z', '#f2b632', 1.6) : '') + shape('M-30 -2 Q-30 -22 0 -22 Q30 -22 30 -2 Q30 14 0 14 Q-30 14 -30 -2Z', '#d99b55') + stroke('M-14 -18 Q-8 -4 -14 8 M2 -21 Q8 -6 2 11 M16 -18 Q22 -6 17 6', '#a96f35', 2.2) + `</g>`;
  return '';
}
function handSVG(d, side, w, a, prop) {
  if (prop === 'phone' || (prop && prop.tipo === 'phone')) {
  const k = Math.max(1.12, d.rw / 10.5 * 1.08);
  const palma = shape('M-9 -6 L9 -6 L12 9 Q19 13 17 23 Q13 30 1 28 Q-11 27 -12 17Z',d.skin);
  const aparelho = propSVG(prop);
  // O vidro termina em x=21 no espaço do aparelho. O dedo começa em 21.6.
  const polegar = `<g transform="translate(-2 6) rotate(-8)">`+
    shape('M25.5 -2 C31 -3 32 3 30 10 Q28 17 24 16 Q21.6 15 21.6 11 L21.6 3 Q21.6 -1 25.5 -2Z',d.skin,1.2)+
    stroke('M25 4 L27 4',d.shade,.8)+'</g>';
  return `<g transform="translate(${r2(w[0])} ${r2(w[1])}) rotate(${r2(-a)}) scale(${r2(k * -side)} ${r2(k)})">${palma}${aparelho}${polegar}</g>`;
  }
  const k = Math.max(1.12, d.rw / 10.5 * 1.08);
  const palm = 'M-9.5 -3 C-12.5 5 -13 13 -11 20 Q-9 28 -2 28 L5 27.5 Q11 25 11 16 L10 -3Z', thumb = 'M8 5 Q18 6 18 15 Q17 21 10 18Z';
  const body = shape(palm, d.skin) + shape(thumb, d.skin) + fillOnly('M6 3 L11 3 L12 17 L6 17Z', d.skin) + fillOnly('M-8 -6 L8 -6 L8.5 4 L-8.5 4Z', d.skin) + stroke('M-5 19 L-5 27 M1 20 L1 28 M6 19 L6 26', d.shade, 1.3);
  const flip = -side;
  const nivelado = prop === 'bolo' || prop === 'boloApagado';
  return `<g transform="translate(${r2(w[0])} ${r2(w[1])}) rotate(${r2(-a)}) scale(${r2(k * flip)} ${r2(k)})">${prop && !nivelado ? propSVG(prop) : ''}${body}</g>` + (nivelado ? boloSVG(r2(w[0]), r2(w[1] - 22), .8, prop === 'bolo') : '');
}
function footSVG(d, side, c) {
  const sh = d.shoe; let s = '';
  if (sh === 'chinelo') s = shape('M-11 -14 L-12 7 Q-19 13 -22 21 L25 21 Q20 12 12 7 L12 -14Z', d.skin) + ell(-14, 18, 3, 2.3, '#f0b28d', d.shade, .7) + ell(-5, 18, 3, 2.3, '#f0b28d', d.shade, .7) + ell(4, 18, 3, 2.3, '#f0b28d', d.shade, .7) + ell(13, 18, 3, 2.3, '#f0b28d', d.shade, .7) + shape('M-27 20 Q0 15 30 20 Q35 26 28 28 L-25 28 Q-32 26 -27 20Z', '#2c2c30') + stroke('M-20 19 Q-6 6 1 13 Q9 6 23 19', '#c88739', 3.4);
  if (sh === 'tenis') s = shape('M-12 -14 L-13 4 Q-23 11 -24 22 L27 22 Q26 10 13 4 L13 -14Z', '#f1ece2') + stroke('M-7 2 L7 2 M-9 8 L9 8 M-11 14 L12 14', '#ae5d49', 2) + shape('M-27 20 Q0 17 30 20 L30 26 Q0 30 -27 26Z', '#ae5d49', 2.2);
  if (sh === 'bota') s = shape('M-18 -18 L-19 6 Q-29 12 -30 24 L33 24 Q32 11 19 6 L19 -18Z', '#4f3c2e') + stroke('M-7 -10 L7 -10 M-8 -2 L8 -2 M-9 6 L9 6', '#c9a877', 2.2) + shape('M-33 22 L36 22 L36 30 Q0 33 -33 30Z', '#262226');
  if (sh === 'scarpin') s = shape('M-9 -14 L-10 6 Q-14 11 -15 15 L17 15 Q15 10 10 6 L10 -14Z', d.skin) + shape('M-17 11 Q0 20 19 11 Q24 20 20 27 L-16 27 Q-21 20 -17 11Z', '#26212b');
  return `<g transform="translate(${r2(c[0] + side * 3)} ${r2(c[1])}) scale(${side} 1)">${s}</g>`;
}
const SHOE_H = { chinelo: 28, tenis: 27, bota: 31, scarpin: 27 };

/* ---------- corpo ---------- */
function legs(d, pose) {
  const out = {};
  for (const [side, nome] of [[-1, 'L'], [1, 'R']]) {
    const ang = nome === 'L' ? pose.legL : pose.legR, lift = (nome === 'L' ? pose.liftL : pose.liftR) || 0, f = 1 - .34 * lift;
    const H = [side * d.hw * .52, 10], K = P2(H[0], H[1], ang[0], d.thigh * f * (pose.sentado ? .3 : 1)), A = P2(K[0], K[1], ang[1], d.shin * f);
    out[nome] = { H, K, A, side, lift };
  }
  return out;
}
function lowerSVG(d, L) {
  let s = '';
  for (const k of ['L', 'R']) s += footSVG(d, L[k].side, L[k].A);
  const pelvis = { d: `M${-d.hw} -22 L${d.hw} -22 Q${d.hw + 3} 8 ${d.hw - 2} 34 L${-d.hw + 2} 34 Q${-d.hw - 3} 8 ${-d.hw} -22Z` };
  const list = [pelvis], cuffs = [], end = d.cuff ? .87 : .97;
  for (const k of ['L', 'R']) { const { H, K, A } = L[k], e = on(K, A, end), re = lerp(d.rk, d.ra, end);
    list.push(circ(H, d.rt), quad(H, K, d.rt, d.rk), circ(K, d.rk), quad(K, e, d.rk, re));
    if (d.cuff) cuffs.push(quad(on(K, A, end - .05), on(K, A, end + .03), d.ra + 1, d.ra + 1.8)); }
  s += union(list, d.pants);
  s += cuffs.map(c => el(c, `fill="#9aa2a6" stroke="${OUT}" stroke-width="${T}" stroke-linejoin="round"`)).join('');
  s += stroke(`M0 8 L0 ${r2(Math.min(L.L.K[1], L.R.K[1]) * .28 + 8)}`, OUT, 2);
  for (const k of ['L', 'R']) { const { H, K, side } = L[k]; const m = on(H, K, .55); s += stroke(`M${r2(m[0] - side * d.rt * .45)} ${r2(m[1])} Q${r2(m[0])} ${r2(m[1] + 9)} ${r2(m[0] + side * d.rt * .2)} ${r2(m[1] + 2)}`, d.pantsD, 2); }
  return s;
}
function torsoSVG(d, sy, comBag) {
  const w = d.sw, wa = d.waist, he = d.hem, th = d.torso, nw = d.neckW + 4;
  const p = `M${-nw} ${sy - 4} Q${-w + 8} ${sy - 3} ${-w} ${sy + 18} Q${-w - 1} ${sy + th * .42} ${-wa} ${sy + th * .66} Q${-he} ${sy + th * .84} ${-he} ${sy + th + 8} Q0 ${sy + th + 17} ${he} ${sy + th + 8} Q${he} ${sy + th * .84} ${wa} ${sy + th * .66} Q${w + 1} ${sy + th * .42} ${w} ${sy + 18} Q${w - 8} ${sy - 3} ${nw} ${sy - 4}Z`;
  let s = shape(p, d.cloth);
  if (d.key === 'tico') s += stroke(`M${-wa + 10} ${sy + th * .6} Q${-wa + 28} ${sy + th * .72} ${-wa + 42} ${sy + th * .7} M${wa - 8} ${sy + th * .78} Q${wa - 24} ${sy + th * .86} ${wa - 44} ${sy + th * .82}`, d.clothD, 2.4);
  if (d.key === 'lua') s += stroke(`M0 ${sy + 18} L0 ${sy + th + 8}`, d.clothD, 2.2) + [40, 72, 104, 136].map(y => ell(2, sy + y, 2, 2, '#f2b88f')).join('');
  if (d.gravata) s += fillOnly(`M${-nw + 2} ${sy - 3} L0 ${sy + 30} L${nw - 2} ${sy - 3}Z`, '#f4f1ea') + shape(`M-7 ${sy + 2} L7 ${sy + 2} L5 ${sy + 14} L10 ${sy + th * .62} L0 ${sy + th * .7} L-10 ${sy + th * .62} L-5 ${sy + 14}Z`, d.gravata, 2);
  if (comBag) s += stroke(`M${-w + 34} ${sy + 2} L${-wa + 22} ${sy + th * .82} M${w - 34} ${sy + 2} L${wa - 22} ${sy + th * .82}`, '#171c23', 13) + stroke(`M${-wa + 16} ${sy + 72} L${wa - 16} ${sy + 72}`, '#171c23', 7) + `<rect x="-11" y="${sy + 65}" width="22" height="14" rx="3" fill="#a9acb3" stroke="${OUT}" stroke-width="2"/>`;
  if (d.key === 'leticia') s += fillOnly(`M${-nw + 2} ${sy - 3} L0 ${sy + 76} L${nw - 2} ${sy - 3}Z`, '#24252d') + shape(`M${-nw} ${sy - 4} L-6 ${sy + 78} L-20 ${sy + 54} L${-nw - 15} ${sy + 28} L${-nw - 9} ${sy + 6}Z`, '#d09936') + shape(`M${nw} ${sy - 4} L6 ${sy + 78} L20 ${sy + 54} L${nw + 15} ${sy + 28} L${nw + 9} ${sy + 6}Z`, '#d09936') + stroke(`M0 ${sy + 78} L0 ${sy + th + 11}`, d.clothD, 2.4) + ell(6, sy + 98, 3, 3, '#e5c28a', OUT, 1.4);
  return s;
}
function neckSVG(d, sy, hy) {
  const nw = d.neckW, top = hy + 30 * d.hs, base = sy + 7;
  let s = shape(`M${-nw} ${top} L${-nw} ${base - 4} Q0 ${base + 16} ${nw} ${base - 4} L${nw} ${top}Z`, d.skin);
  s += fillOnly(`M${-nw + 1.4} ${top} L${-nw + 1.4} ${sy - 5} Q0 ${sy + 8} ${nw - 1.4} ${sy - 5} L${nw - 1.4} ${top}Z`, d.shade, 'opacity=".75"');
  if (d.key === 'tico' || d.key === 'jao') s += stroke(`M${-nw - 3} ${base - 5} Q0 ${base + 18} ${nw + 3} ${base - 5}`, d.clothD, 4.5);
  if (d.key === 'lua') s += shape(`M${-nw - 3} ${sy - 7} L-3 ${sy + 18} L${-nw - 15} ${sy + 22} Z`, '#c56f59', 2.2) + shape(`M${nw + 3} ${sy - 7} L3 ${sy + 18} L${nw + 15} ${sy + 22} Z`, '#c56f59', 2.2);
  return s;
}
function badgeSVG(d, sy) {
  if (d.cracha) return stroke(`M-16 ${sy + 18} L-26 ${sy + 70} M16 ${sy + 18} L-14 ${sy + 70}`, '#3c4a5a', 2.4) + `<rect x="-50" y="${sy + 70}" width="60" height="36" rx="4" fill="#eef0f0" stroke="${OUT}" stroke-width="2.4"/><text x="-20" y="${sy + 96}" text-anchor="middle" font-family="Arial Black, Arial" font-weight="900" font-size="19" fill="#b8323c">${d.cracha}</text>`;
  if (d.key !== 'lua') return '';
  return stroke(`M-14 ${sy + 16} L0 ${sy + 52} L14 ${sy + 16}`, '#566d86', 2.6) + `<rect x="-14" y="${sy + 52}" width="28" height="36" rx="3" fill="#eef0f0" stroke="${OUT}" stroke-width="2.4"/><rect x="-9" y="${sy + 58}" width="18" height="10" rx="1" fill="#566d86"/><rect x="-9" y="${sy + 73}" width="18" height="3" fill="#a7afb7"/><rect x="-9" y="${sy + 79}" width="12" height="3" fill="#a7afb7"/>`;
}
function backpackSVG(d, sy, comBag) {
  if (!comBag) return '';
  const w = d.sw + 26, y = sy - 22, h = d.torso + 2;
  return `<rect x="${-w}" y="${y}" width="${w * 2}" height="${h}" rx="12" fill="#b3303c" stroke="${OUT}" stroke-width="${T}"/>` + `<rect x="${-w}" y="${y + h * .56}" width="${w * 2}" height="10" fill="#e3c04a"/>` + stroke(`M${-w} ${y + 18} L${w} ${y + 18}`, '#7c1f2b', 3);
}
function armSVG(d, side, a, sy, prop) {
  const S = [side * (d.sw - d.ru * .62), sy + d.ru * 1.05], E = P2(S[0], S[1], a[0], d.armU), W = P2(E[0], E[1], a[1], d.armF);
  const total = d.armU + d.armF, hem = d.sleeve * total, rAt = t => t < d.armU ? lerp(d.ru, d.re, t / d.armU) : lerp(d.re, d.rw, (t - d.armU) / d.armF);
  const at = t => t <= d.armU ? on(S, E, t / d.armU) : on(E, W, (t - d.armU) / d.armF), H = at(hem), rH = rAt(hem), solta = 2.2;
  let s = '';
  const bend = Math.abs(((a[1] - a[0]) + 540) % 360 - 180), dobra = hem > d.armU && bend > 55;
  const upper = [circ(S, d.ru + solta)], fore = [];
  if (hem <= d.armU) upper.push(quad(S, H, d.ru + solta, rH + solta));
  else { upper.push(quad(S, E, d.ru + solta, d.re + solta), circ(E, d.re + solta)); (dobra ? fore : upper).push(quad(E, H, d.re + solta, rH + solta)); if (dobra) fore.unshift(circ(E, d.re + solta)); }
  s += union(upper, d.cloth);
  s += el(circ(S, d.ru + solta - 1.5), `fill="${d.cloth}"`);
  const skin = hem <= d.armU ? [quad(H, E, rH, d.re), circ(E, d.re), quad(E, W, d.re, d.rw)] : [quad(H, W, rH, d.rw)];
  if (dobra) s += union(fore, d.cloth);
  s += union(skin, d.skin);
  if (d.key === 'leticia') s += stroke(`M${r2(H[0] - (W[1] - E[1]) / d.armF * (rH + 1))} ${r2(H[1] + (W[0] - E[0]) / d.armF * (rH + 1))} L${r2(H[0] + (W[1] - E[1]) / d.armF * (rH + 1))} ${r2(H[1] - (W[0] - E[0]) / d.armF * (rH + 1))}`, '#f2ead8', 3.4);
  s += handSVG(d, side, W, a[1], prop);
  return s;
}
function drawChar(d, pose = {}) {
  const Pz = Object.assign({ armL: [-9, -5], armR: [9, 5], legL: [-4, -2], legR: [4, 2], lean: 0, head: 0, expr: 'neutro', mouth: null, blink: 0, breath: 0, liftL: 0, liftR: 0, propL: null, propR: null, frente: null, sentado: false, bag: null, semPernas: false }, pose);
  const comBag = Pz.bag != null ? Pz.bag : d.key === 'jao';
  const E = Object.assign({}, EXPR[Pz.expr] || EXPR.neutro);
  const L = legs(d, Pz), low = Pz.semPernas ? 10 + d.thigh + d.shin : Math.max(L.L.A[1], L.R.A[1]), rootY = -(low + SHOE_H[d.shoe]);
  const sy = -d.torso, hy = sy - d.neck - 49 * d.hs;
  const up = `<g transform="rotate(${r2(Pz.lean)}) translate(0 ${r2(-Pz.breath)})">`;
  const head = `<g transform="translate(0 ${r2(hy)}) rotate(${r2(Pz.head)} 0 ${r2(40 * d.hs)}) scale(${d.hs})">`;
  const braco = { L: armSVG(d, -1, Pz.armL, sy, Pz.propL), R: armSVG(d, 1, Pz.armR, sy, Pz.propR) };
  let s = `<g transform="translate(0 ${r2(rootY)})">`;
  s += up + backpackSVG(d, sy, comBag) + head + hairBack(d) + '</g></g>';
  if (!Pz.semPernas) s += lowerSVG(d, L);
  s += up + torsoSVG(d, sy, comBag) + neckSVG(d, sy, hy) + badgeSVG(d, sy);
  if (Pz.frente !== 'L') s += braco.L;
  if (Pz.frente !== 'R') s += braco.R;
  s += head + headSVG(d, E, Pz) + '</g>';
  if (Pz.frente) s += braco[Pz.frente];
  return s + '</g></g>';
}

/* ---------- Fiscal ---------- */
const FISCAL = { key: 'fiscal', name: 'Fiscal', emoji: '🐕', papel: 'Vira-lata do prédio', desc: 'Vira-lata do prédio: curioso e leal. Late sempre que alguém mente.', paleta: ['#b97539', '#855029', '#342923', '#e2b13f'], skin: '#b97539', shade: '#855029', muzzle: '#d99759', iris: '#4c3525' };
function drawDog(pose = {}) {
  const c = FISCAL;
  const est = typeof pose === 'string' ? pose : pose.state;
  const D = Object.assign({ head: 0, tail: 18, fN: [8, 3], fF: [-7, -3], bN: [-7, 12], bF: [7, 18], expr: 'neutro', mouth: 0, blink: 0, breath: 0 }, typeof pose === 'object' ? pose : {});
  if (est === 'alerta') { D.expr = 'surpreso'; D.tail = 36; D.head = -5; }
  if (est === 'latindo') { D.expr = 'bravo'; D.mouth = 1; D.head = -8; }
  const thigh = 54, shin = 54, paw = 13;
  const hips = { fN: [-82, -128], fF: [-58, -128], bN: [84, -130], bF: [60, -130] };
  const chain = k => { const a = D[k], H = hips[k], K = P2(H[0], H[1], a[0], thigh), A = P2(K[0], K[1], a[1], shin); return { H, K, A }; };
  const G = { fN: chain('fN'), fF: chain('fF'), bN: chain('bN'), bF: chain('bF') };
  const low = Math.max(G.fN.A[1], G.fF.A[1], G.bN.A[1], G.bF.A[1]), rootY = -(low + paw);
  const legShapes = g => [circ(g.H, 20), quad(g.H, g.K, 20, 15), circ(g.K, 15), quad(g.K, g.A, 15, 13), { d: `M${r2(g.A[0] - 25)} ${r2(g.A[1] + paw)} Q${r2(g.A[0] - 27)} ${r2(g.A[1] - 4)} ${r2(g.A[0] - 11)} ${r2(g.A[1] - 8)} L${r2(g.A[0] + 13)} ${r2(g.A[1] - 8)} L${r2(g.A[0] + 14)} ${r2(g.A[1] + paw)}Z` }];
  const toes = g => stroke(`M${r2(g.A[0] - 16)} ${r2(g.A[1] + 4)} l0 8 M${r2(g.A[0] - 7)} ${r2(g.A[1] + 4)} l0 8 M${r2(g.A[0] + 2)} ${r2(g.A[1] + 4)} l0 8`, OUT, 1.8);
  let s = `<g transform="translate(0 ${r2(rootY)})">`;
  s += union(legShapes(G.fF), c.shade) + toes(G.fF) + union(legShapes(G.bF), c.shade) + toes(G.bF);
  // rabo: corrente curva que sai da anca
  const t0 = [116, -176 - D.breath * .4], t1 = P2(t0[0], t0[1], 180 - 74 + D.tail, 34), t2 = P2(t1[0], t1[1], 180 - 40 + D.tail * 1.3, 32), t3 = P2(t2[0], t2[1], 180 - 8 + D.tail * 1.6, 26);
  s += union([circ(t0, 13), quad(t0, t1, 13, 10), circ(t1, 10), quad(t1, t2, 10, 7), circ(t2, 7), quad(t2, t3, 7, 2.5)], c.skin);
  // corpo + patas do lado de perto: uma silhueta só
  const peito = [-78, -176], anca = [80, -178], br = D.breath;
  const corpo = [circ(peito, 49 + br * .6), quad(peito, anca, 49 + br * .6, 44), circ(anca, 44)];
  s += union([...corpo, ...legShapes(G.fN), ...legShapes(G.bN)], c.skin);
  s += toes(G.fN) + toes(G.bN);
  s += fillOnly('M-60 -134 Q10 -122 84 -138 Q40 -150 -20 -148Z', c.muzzle, 'opacity=".55"') + stroke('M-30 -214 Q10 -226 50 -214 M26 -160 Q40 -150 58 -158', c.shade, 2.4);
  // pescoço e cabeça (ponto de giro na base do pescoço)
  const nb = [-96, -196];
  s += union([circ(nb, 34), quad(nb, [-104, -248], 34, 30)], c.skin);
  s += stroke('M-133 -212 Q-100 -192 -64 -222', '#3a302a', 9);
  s += ell(-103, -192, 12.5, 12.5, '#e2b13f', '#8b6227', 2.4) + stroke('M-108 -190 L-98 -190', '#8b6227', 2);
  const E = Object.assign({}, EXPR[D.expr] || EXPR.neutro), alegre = D.expr === 'feliz' || D.expr === 'rindo', fala = D.mouth > .15 || alegre;
  const ouvido = est === 'alerta' || D.expr === 'surpreso' ? -10 : D.expr === 'triste' ? 34 : 0;
  s += `<g transform="translate(-112 -262) rotate(${r2(D.head)} 8 40) scale(1.28)">`;
  s += `<g transform="rotate(${-ouvido} -36 -42)">` + shape('M-33 -40 L-52 -74 Q-68 -80 -64 -42 L-44 -20Z', c.shade) + `</g>`;
  s += `<g transform="rotate(${ouvido} 36 -42)">` + shape('M24 -42 L52 -78 Q68 -70 54 -30 L39 -20Z', c.shade) + `</g>`;
  s += shape('M-41 -30 Q-49 -58 -29 -60 L-13 -48 Q0 -55 20 -48 L38 -60 Q52 -44 41 -20 L36 16 Q11 38 -15 26 Q-41 16 -41 -30Z', c.skin);
  if (D.blink >= .5 || E.eye) s += stroke('M-27 -16 Q-17 -9 -7 -16 M7 -16 Q17 -9 27 -16', OUT, 3);
  else { const o = E.open || 1; s += ell(-17, -16, 11 * o, 12 * o, '#f5e7d6', OUT, 2.2) + ell(17, -16, 11 * o, 12 * o, '#f5e7d6', OUT, 2.2) + ell(-15, -14, 5, 6.5, c.iris) + ell(15, -14, 5, 6.5, c.iris) + ell(-15, -14, 2.8, 4, '#181719') + ell(15, -14, 2.8, 4, '#181719') + ell(-16.4, -17, 1.5, 1.7, '#fff') + ell(13.6, -17, 1.5, 1.7, '#fff'); }
  const bi = E.browIn || 0;
  s += stroke(`M-29 ${-33 + (E.browY || 0)} L-8 ${-33 + (E.browY || 0) + bi * .7}`, c.shade, 3.6) + stroke(`M29 ${-33 + (E.browY || 0)} L8 ${-33 + (E.browY || 0) + bi * .7}`, c.shade, 3.6);
  if (fala) { const ab = alegre ? 1 : D.mouth; s += shape(`M-15 20 Q0 ${r2(24 + 46 * ab)} 15 20Z`, '#722e37', 2.4) + (alegre ? shape('M-7 30 Q-8 49 0 49 Q8 49 7 30Z', '#d8646c', 1.8) : ''); }
  s += shape('M-20 7 Q0 -8 20 7 L15 25 Q0 33 -15 25Z', c.muzzle, 2.2) + ell(0, 7, 12, 7.5, '#2c2323') + ell(-3, 5, 3, 1.8, '#6f5b58');
  s += stroke('M0 14 L0 22', '#6a402e', 1.8) + (fala ? '' : stroke('M-11 23 Q0 30 11 23', '#6a402e', 2));
  s += '</g></g>';
  return s;
}
// Altura aproximada de cada personagem, do chão ao topo do cabelo, com a perna reta.
for (const d of Object.values(CHARS)) d.H = Math.round(10 + d.thigh + d.shin + SHOE_H[d.shoe] + d.torso + d.neck + 160 * d.hs);

if (typeof module === 'object' && module.exports) module.exports = { CHARS, FISCAL, EXPR, EXPR_ORDER, NOMES_EXPR, SHOE_H, OUT, drawChar, drawDog };
