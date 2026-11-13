'use strict';
// Se Vira, Tico: rig dos personagens (V13: formas orgânicas, pupila preta, arcada curva e sombra da silhueta).
/* ================= RIG =================
   Mesma API do personagens/chars.js: drawChar(CHARS.tico, pose) e drawDog(pose) devolvem texto SVG,
   com os pés em y = 0. Pose: armL/armR/legL/legR = [junta de cima, junta de baixo], em graus absolutos a
   partir de "reto para baixo" (negativo = esquerda da tela). Também: lean, head, expr, mouth, detalhe, blink,
   breath, liftL, liftR, propL, propR, frente ('L' ou 'R': braço à frente do rosto) e look ([x, y], foco dos dois olhos).
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
// Estilo do desenho: 'organico' (padrão) ou 'classico' (o rig até o ep. 4). Luz da cena: 1 = da direita, -1 = da esquerda.
let ESTILO_RIG = 'organico', LUZ_LADO = 1;
const organico = () => ESTILO_RIG !== 'classico';
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
  cida: { key: 'cida', name: 'Dona Cida', emoji: '🛍️', papel: 'Avó coruja', desc: 'Passageira cheia de sacolas que só fala da "netinha".', paleta: ['#d9a47f', '#ece8e3', '#5f9e7a', '#7a5a8a'],
    skin: '#d9a47f', shade: '#b07f60', hair: '#ece8e3', hairHi: '#ffffff', iris: '#4a3a2e', cloth: '#5f9e7a', clothD: '#457a5c', pants: '#7a5a8a', pantsD: '#5a3f68', shoe: 'scarpin',
    hs: 1.0, neck: 10, neckW: 16, torso: 128, sw: 50, waist: 48, hem: 54, hw: 46, armU: 72, armF: 68, ru: 12, re: 10.5, rw: 8.5, sleeve: .9, thigh: 106, shin: 100, rt: 22, rk: 16, ra: 14, lid: .3, bags: true, lashes: false, browW: 3, jaw: 'f', oculos: true },
  neta: { key: 'neta', name: 'Kelly', emoji: '🎈', papel: 'A "netinha", de 40 anos', desc: 'Neta da Dona Cida. Tem 40 anos, emprego e aluguel, e ainda ganha chapeuzinho de festa.', paleta: ['#d9a07e', '#5a3a2a', '#3f6fa8', '#2f3b52'],
    skin: '#d9a07e', shade: '#b07a5c', hair: '#5a3a2a', hairHi: '#7a5644', iris: '#49372f', cloth: '#3f6fa8', clothD: '#2f5486', pants: '#2f3b52', pantsD: '#222b3d', shoe: 'scarpin',
    hs: 1.3, neck: 18, neckW: 15, torso: 162, sw: 48, waist: 40, hem: 48, hw: 42, armU: 90, armF: 86, ru: 11.5, re: 10, rw: 8, sleeve: .94, thigh: 148, shin: 144, rt: 22, rk: 15.5, ra: 13, lid: .22, lashes: true, browW: 3.6, jaw: 'f', bags: true, chapeu: true },
  vendedor: { key: 'vendedor', name: 'Vendedor', emoji: '🍬', papel: 'Vendedor de paçoca', desc: 'Vende paçoca na rua e acredita em si mais do que o Tico acredita.', paleta: ['#c98f68', '#4a403c', '#e9e4d8', '#6b5a48'],
    skin: '#c98f68', shade: '#a06e4e', hair: '#4a403c', hairHi: '#7a6e68', iris: '#4a3a2e', cloth: '#e9e4d8', clothD: '#c4bdac', pants: '#6b5a48', pantsD: '#4f4234', shoe: 'chinelo',
    hs: 1.08, neck: 8, neckW: 26, torso: 150, sw: 70, waist: 92, hem: 90, hw: 48, armU: 82, armF: 76, ru: 17, re: 15, rw: 12, sleeve: .12, thigh: 116, shin: 112, rt: 29, rk: 23, ra: 19, lid: .24, bags: true, browW: 5, jaw: 'm' },
  ceo: { key: 'ceo', name: 'CEO', emoji: '💼', papel: 'Dono da empresa da Lua', desc: 'Dono da empresa em que a Lua trabalha: simpático, distraído e pai do Júnior.', paleta: ['#d8a07a', '#9a9690', '#2f3a52', '#b8323c'],
    skin: '#d8a07a', shade: '#b07a58', hair: '#9a9690', hairHi: '#c9c5bf', iris: '#4a3a2e', cloth: '#2f3a52', clothD: '#1f2738', pants: '#2f3a52', pantsD: '#1f2738', shoe: 'bota',
    hs: 1.12, neck: 9, neckW: 24, torso: 165, sw: 78, waist: 84, hem: 82, hw: 52, armU: 86, armF: 80, ru: 19, re: 16.5, rw: 13, sleeve: .94, thigh: 126, shin: 122, rt: 30, rk: 24, ra: 20, lid: .38, bags: true, browW: 5.4, jaw: 'm', oculos: true, gravata: '#b8323c', cracha: 'CEO' },
  junior: { key: 'junior', name: 'Júnior', emoji: '🧴', papel: 'Filho do CEO', desc: 'Recém-chegado e recém-promovido: educado, perfumado e sem saber abrir um arquivo.', paleta: ['#f0c09a', '#3a2a20', '#cfe3ef', '#3e4450'],
    skin: '#f0c09a', shade: '#cf9a76', hair: '#3a2a20', hairHi: '#9a7a5e', iris: '#5a4a3a', cloth: '#cfe3ef', clothD: '#9fbccc', pants: '#3e4450', pantsD: '#2a2f38', shoe: 'bota',
    hs: 1.24, neck: 14, neckW: 18, torso: 160, sw: 58, waist: 46, hem: 50, hw: 44, armU: 88, armF: 84, ru: 13, re: 11, rw: 9, sleeve: .9, thigh: 120, shin: 116, rt: 25, rk: 18, ra: 15.5, lid: .12, browW: 3.6, jaw: 'm', gravata: '#2a4f8a' },
  kaua: { key: 'kaua', name: 'Kauã', emoji: '🎮', papel: 'Demitido antes do GTA', desc: 'Ex-estagiário de TI, 21 anos, sobrinho do Jão. Foi demitido por e-mail seis dias antes do GTA 6 e disse aos amigos que "já garantiu".', paleta: ['#a86b48', '#1d1716', '#2f6f5e', '#4a4f5a'],
    skin: '#a86b48', shade: '#80503a', hair: '#1d1716', hairHi: '#3e302b', iris: '#3a2a20', cloth: '#2f6f5e', clothD: '#225247', pants: '#4a4f5a', pantsD: '#363a42', shoe: 'chinelo', meia: '#e9e6df',
    hs: 1.27, neck: 13, neckW: 20, torso: 166, sw: 64, waist: 54, hem: 56, hw: 46, armU: 90, armF: 86, ru: 14.5, re: 12.5, rw: 10, sleeve: .96, thigh: 134, shin: 130, rt: 25, rk: 19, ra: 16, lid: .28, bags: true, browW: 4.6, jaw: 'm', capuz: true, headset: '#22252b' },
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
function mouthSVGClassico(kind) {
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

function eyeSVGClassico(d, side, E, blink) {
  const x = side * 21, y = -20, rx = 12.5, ry = 9.5 * (E.open || 1), line = '#2b2024';
  const look = E.look || [0, 0], px = x + look[0] - side * 1, py = y + 1 + look[1];
  if (E.graphicEyes && blink > 0) return `<g transform="translate(0 -20) scale(1 ${Math.max(.025,1-blink)}) translate(0 20)">${eyeSVG(d, side, E, 0)}</g>`;
  const kind = blink ? 'suave' : E.eye;
  let s = '';
  if (kind === 'arco') return stroke(`M${x - 12} ${y + 4} Q${x} ${y - 9} ${x + 12} ${y + 4}`, line, 3);
  if (kind === 'suave') return stroke(`M${x - 12} ${y} Q${x} ${y + 7} ${x + 12} ${y}`, line, 3) + (d.lashes ? stroke(`M${x + side * 12} ${y} l${side * 4} -3`, line, 2) : '');
  s += ell(x, y, rx, ry, '#f8f3e8', line, 2.2);
  const pS = E.pupil || 1;
  s += E.graphicEyes ? ell(px, py, 4.7 * pS, 5.4 * pS, '#171719') + ell(px - 1.4, py - 2.2, 1.5, 1.6, '#fff') : ell(px, py, 5.6 * pS, 6.4 * pS, d.iris) + ell(px, py, 3 * pS, 3.8 * pS, '#171719') + ell(px - 1.4, py - 2.2, 1.6, 1.8, '#fff');
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
  if (d.key === 'leticia' || d.key === 'neta') return shape('M26 -94 Q66 -104 72 -62 Q80 -8 58 44 Q46 16 40 -12 Q38 -46 30 -60Z', d.hair) + stroke('M60 -64 Q66 -22 56 20', d.hairHi, 2.6);
  if (d.key === 'marlene' || d.key === 'cida') return ell(0, -100, 25, 21, d.hair, OUT, T);
  return '';
}
function hairFront(d) {
  const h = d.hair, hi = d.hairHi;
  if (d.key === 'tico') return shape('M-44 -43 L-52 -68 -42 -65 -48 -88 -29 -78 -27 -102 -10 -85 0 -111 13 -89 29 -105 29 -81 47 -94 41 -71 55 -74 45 -54 47 -37 Q24 -63 3 -60 Q-18 -65 -44 -43Z', h) + stroke('M-37 -66 L-26 -78 -15 -71 0 -90 11 -73 27 -84 26 -64 40 -68', hi, 2.6);
  if (d.key === 'lua') return shape('M-44 -36 C-58 -90 -32 -108 -6 -101 C22 -113 52 -88 45 -36 Q38 -64 14 -80 Q-10 -56 -44 -36Z', h) + stroke('M-34 -74 Q-42 -60 -41 -48 M-12 -92 Q-24 -74 -32 -58 M20 -92 Q38 -76 41 -56', hi, 2.6);
  if (d.key === 'jao') return shape('M-45 -44 Q-49 -90 -14 -99 Q24 -106 45 -74 L46 -42 Q0 -66 -45 -44Z', '#963a48') + stroke('M-42 -58 Q0 -82 44 -56', '#b65e68', 2.6) + stroke('M-22 -92 Q0 -94 22 -88', '#b65e68', 2)
    + shape('M43 -68 Q62 -76 68 -60 Q58 -60 48 -56Z', '#963a48') + shape('M44 -60 Q62 -54 62 -36 Q52 -44 42 -48Z', '#7c2f3c');
  if (d.key === 'leticia' || d.key === 'neta') return shape('M-44 -34 Q-53 -88 -22 -100 Q8 -113 34 -94 Q52 -74 44 -34 Q40 -66 16 -82 Q-16 -82 -44 -34Z', h) + stroke('M-26 -84 Q2 -98 30 -80', hi, 2.6) + shape('M28 -96 Q38 -100 42 -90 Q40 -82 31 -83Z', '#bf842a', 2);
  if (d.key === 'borracheiro') return shape('M-44 -30 Q-52 -52 -38 -70 Q-40 -50 -34 -38Z', h) + shape('M44 -30 Q52 -52 38 -70 Q40 -50 34 -38Z', h);
  if (d.key === 'vendedor') return shape('M-45 -26 Q-53 -46 -42 -60 Q-44 -44 -37 -32Z', h) + shape('M45 -26 Q53 -46 42 -60 Q44 -44 37 -32Z', h) + stroke('M-20 -86 Q0 -92 20 -86', d.shade, 2.2);
  if (d.key === 'ceo') return shape('M-45 -24 Q-54 -50 -40 -70 Q-30 -82 -14 -86 Q-26 -70 -34 -40Z', h) + shape('M45 -24 Q54 -50 40 -70 Q30 -82 14 -86 Q26 -70 34 -40Z', h) + stroke('M-10 -90 Q0 -94 12 -90 M-4 -84 Q4 -88 10 -84', hi, 2.4);
  if (d.key === 'junior' && d.despenteado) return shape('M-45 -40 L-56 -70 -38 -66 -44 -96 -22 -82 -16 -112 0 -88 12 -116 22 -88 42 -104 38 -78 58 -80 46 -54 47 -38 Q20 -62 0 -60 Q-22 -62 -45 -40Z', h) + stroke('M-30 -72 L-18 -84 M6 -96 L14 -80 M30 -90 L34 -76', hi, 2.4);
  if (d.key === 'junior') return shape('M-45 -38 Q-52 -84 -16 -98 Q-4 -126 30 -122 Q52 -118 50 -100 Q40 -106 28 -102 Q50 -86 47 -38 Q30 -66 0 -68 Q-26 -66 -45 -38Z', h) + stroke('M-32 -70 Q-12 -88 18 -92 M-20 -60 Q4 -78 34 -80 M4 -106 Q22 -118 42 -112', hi, 3) + ell(22, -104, 7, 3, '#ffffff', 'none', 0, 'opacity=".75"') + ell(-14, -84, 6, 2.5, '#ffffff', 'none', 0, 'opacity=".6"');
  if (d.key === 'kaua') return union([{ d: 'M-45 -40 Q-52 -86 -20 -100 Q0 -106 20 -100 Q52 -86 45 -40 Q34 -60 0 -62 Q-34 -60 -45 -40Z' },
      circ([-38, -72], 10), circ([-30, -91], 12), circ([-12, -104], 13), circ([8, -106], 13), circ([26, -97], 12), circ([38, -79], 10)], h)
    + stroke('M-35 -96 Q-30 -102 -23 -99 M-17 -111 Q-11 -116 -4 -112 M3 -113 Q9 -118 16 -113 M22 -104 Q28 -106 32 -100', hi, 2.4);
  if (d.key === 'marlene' || d.key === 'cida') return shape('M-44 -34 C-58 -66 -38 -92 -14 -88 C4 -100 40 -92 44 -60 Q50 -46 43 -32 Q36 -58 14 -66 Q-14 -60 -44 -34Z', h) + stroke('M-30 -68 Q-20 -80 -6 -78 M14 -82 Q28 -78 34 -62', hi, 2.6);
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
  const blink = pose.graphicEyes ? pose.blink : pose.blink >= .5;
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
  if (sh === 'chinelo') s = shape('M-11 -14 L-12 7 Q-19 13 -22 21 L25 21 Q20 12 12 7 L12 -14Z', d.meia || d.skin) + (d.meia ? '' : ell(-14, 18, 3, 2.3, '#f0b28d', d.shade, .7) + ell(-5, 18, 3, 2.3, '#f0b28d', d.shade, .7) + ell(4, 18, 3, 2.3, '#f0b28d', d.shade, .7) + ell(13, 18, 3, 2.3, '#f0b28d', d.shade, .7)) + shape('M-27 20 Q0 15 30 20 Q35 26 28 28 L-25 28 Q-32 26 -27 20Z', '#2c2c30') + stroke('M-20 19 Q-6 6 1 13 Q9 6 23 19', '#c88739', 3.4);
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
function lowerSVGClassico(d, L) {
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
function torsoSVGClassico(d, sy, comBag) {
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
  if (d.capuz) s += shape(`M${-nw - 12} ${base - 10} Q${-nw - 18} ${base + 10} ${-nw + 2} ${base + 14} Q0 ${base + 24} ${nw - 2} ${base + 14} Q${nw + 18} ${base + 10} ${nw + 12} ${base - 10} Q0 ${base + 8} ${-nw - 12} ${base - 10}Z`, d.clothD, 2.4)
    + stroke(`M-7 ${base + 18} L-9 ${base + 46} M7 ${base + 18} L9 ${base + 44}`, '#ece8df', 2.2) + ell(-9, base + 48, 2.4, 2.4, '#ece8df') + ell(9, base + 46, 2.4, 2.4, '#ece8df');
  if (d.headset) s += stroke(`M${-nw - 6} ${base - 2} Q0 ${base + 20} ${nw + 6} ${base - 2}`, d.headset, 5) + ell(-nw - 11, base - 4, 12, 15, d.headset, OUT, 2.4) + ell(nw + 11, base - 4, 12, 15, d.headset, OUT, 2.4)
    + ell(-nw - 11, base - 4, 7, 9, '#3a3f48') + ell(nw + 11, base - 4, 7, 9, '#3a3f48') + ell(-nw - 11, base - 4, 2.2, 2.2, '#3fd17a') + ell(nw + 11, base - 4, 2.2, 2.2, '#3fd17a');
  if (d.key === 'lua') s += shape(`M${-nw - 3} ${sy - 7} L-3 ${sy + 18} L${-nw - 15} ${sy + 22} Z`, '#c56f59', 2.2) + shape(`M${nw + 3} ${sy - 7} L3 ${sy + 18} L${nw + 15} ${sy + 22} Z`, '#c56f59', 2.2);
  return s;
}
function badgeSVG(d, sy) {
  if (d.semCracha) return ''; // figurino de encontro, opcional; desenho legado preservado.
  if (d.cracha) return stroke(`M-16 ${sy + 18} L-26 ${sy + 70} M16 ${sy + 18} L-14 ${sy + 70}`, '#3c4a5a', 2.4) + `<rect x="-50" y="${sy + 70}" width="60" height="36" rx="4" fill="#eef0f0" stroke="${OUT}" stroke-width="2.4"/><text x="-20" y="${sy + 96}" text-anchor="middle" font-family="Arial Black, Arial" font-weight="900" font-size="19" fill="#b8323c">${d.cracha}</text>`;
  if (d.key !== 'lua') return '';
  return stroke(`M-14 ${sy + 16} L0 ${sy + 52} L14 ${sy + 16}`, '#566d86', 2.6) + `<rect x="-14" y="${sy + 52}" width="28" height="36" rx="3" fill="#eef0f0" stroke="${OUT}" stroke-width="2.4"/><rect x="-9" y="${sy + 58}" width="18" height="10" rx="1" fill="#566d86"/><rect x="-9" y="${sy + 73}" width="18" height="3" fill="#a7afb7"/><rect x="-9" y="${sy + 79}" width="12" height="3" fill="#a7afb7"/>`;
}
function backpackSVG(d, sy, comBag) {
  if (!comBag) return '';
  const w = d.sw + 26, y = sy - 22, h = d.torso + 2;
  return `<rect x="${-w}" y="${y}" width="${w * 2}" height="${h}" rx="12" fill="#b3303c" stroke="${OUT}" stroke-width="${T}"/>` + `<rect x="${-w}" y="${y + h * .56}" width="${w * 2}" height="10" fill="#e3c04a"/>` + stroke(`M${-w} ${y + 18} L${w} ${y + 18}`, '#7c1f2b', 3);
}
function armSVGClassico(d, side, a, sy, prop) {
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

/* ---------- escolha do estilo ---------- */
function mouthSVG(kind) { const b = organico() ? RigOrganico.mouth(kind) : null; return b == null ? mouthSVGClassico(kind) : b; }
function eyeSVG(d, side, E, blink) { return organico() ? RigOrganico.eye(d, side, E, blink) : eyeSVGClassico(d, side, E, blink); }
function lowerSVG(d, L) { return organico() ? RigOrganico.lower(d, L) : lowerSVGClassico(d, L); }
function torsoSVG(d, sy, comBag) { return organico() ? RigOrganico.torso(d, sy, comBag) : torsoSVGClassico(d, sy, comBag); }
function armSVG(d, side, a, sy, prop) { return organico() ? RigOrganico.arm(d, side, a, sy, prop) : armSVGClassico(d, side, a, sy, prop); }
function drawChar(d, pose = {}) {
  const Pz = Object.assign({ armL: [-9, -5], armR: [9, 5], legL: [-4, -2], legR: [4, 2], lean: 0, head: 0, expr: 'neutro', mouth: null, blink: 0, breath: 0, liftL: 0, liftR: 0, propL: null, propR: null, frente: null, sentado: false, bag: null, semPernas: false }, pose);
  const comBag = Pz.bag != null ? Pz.bag : d.key === 'jao';
  const E = Object.assign({}, EXPR[Pz.expr] || EXPR.neutro);
  if (Pz.look) E.look = Pz.look;
  if (Pz.pupil != null) E.pupil = Pz.pupil;
  if (Pz.graphicEyes) E.graphicEyes = true;
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


/* ================= RIG ORGÂNICO (padrão desde 10/11/2026) =================
   Técnicas aprovadas no Plotline (estudo ator-organico-v4) e adaptadas ao rig do Tico no estudo
   estudo visual-2d (commit 4b2fae3), aprovado pelo João em 10/11/2026: membros com curva e junta redonda (ribbon), pupila
   preta com foco e tamanho por emoção (pupil/eyeFocus), boca com arcada curva (roundMouth) e sombra da
   silhueta. Nada é importado do Plotline. setEstiloRig('classico') volta ao desenho até o ep. 4. */
const RigOrganico = (() => {
  const unit = (x, y) => { const n = Math.hypot(x, y) || 1; return [x / n, y / n]; };
  const cubic = (a, b, c, d, t) => { const u = 1 - t; return [0, 1].map(k => u * u * u * a[k] + 3 * u * u * t * b[k] + 3 * u * t * t * c[k] + t * t * t * d[k]); };
  const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); };
  const f2 = (n) => r2(n).toString();

  /* ---------- membros: linha central curva e tubo de espessura variável ---------- */
  // Mesma ideia do ribbon do Plotline: duas cúbicas com tangente comum na junta, para o cotovelo e o
  // joelho ficarem arredondados. Em dobra fechada (grampo), a tangente vira a perpendicular do braço.
  function membro(A, J, B) {
    const u = unit(J[0] - A[0], J[1] - A[1]), v = unit(B[0] - J[0], B[1] - J[1]);
    let tg = [u[0] + v[0], u[1] + v[1]];
    if (Math.hypot(tg[0], tg[1]) < .35) { const n = [-u[1], u[0]], k = n[0] * (B[0] - A[0]) + n[1] * (B[1] - A[1]); tg = [n[0] * Math.sign(k || 1), n[1] * Math.sign(k || 1)]; }
    tg = unit(tg[0], tg[1]);
    const d1 = Math.hypot(J[0] - A[0], J[1] - A[1]), d2 = Math.hypot(B[0] - J[0], B[1] - J[1]), f = d1 / (d1 + d2 || 1);
    const c1 = [A, [A[0] + u[0] * d1 * .45, A[1] + u[1] * d1 * .45], [J[0] - tg[0] * d1 * .24, J[1] - tg[1] * d1 * .24], J];
    const c2 = [J, [J[0] + tg[0] * d2 * .24, J[1] + tg[1] * d2 * .24], [B[0] - v[0] * d2 * .4, B[1] - v[1] * d2 * .4], B];
    const at = (s) => s <= f ? cubic(...c1, s / f) : cubic(...c2, (s - f) / (1 - f));
    const dir = (s) => { const a = at(Math.max(0, s - .01)), b = at(Math.min(1, s + .01)); return unit(b[0] - a[0], b[1] - a[1]); };
    return { at, dir, f, A, J, B, u, v, tg };
  }
  // Círculos e trapézios ao longo da curva, desenhados com union(): uma silhueta só, sem quina na junta.
  // pontaReta: termina com corte reto (barra de manga ou de calça), sem a bola da ponta.
  function tubo(c, s0, s1, raio, n, pontaReta = false) {
    const list = []; let prev = null, rp = 0;
    for (let i = 0; i <= n; i++) {
      const s = s0 + (s1 - s0) * i / n, p = c.at(s), r = raio(s);
      if (!(pontaReta && i === n)) list.push(circ(p, r)); if (prev) list.push(quad(prev, p, rp, r)); prev = p; rp = r;
    }
    return list;
  }
  // Linha paralela à central, do lado oposto à luz: dá volume ao tecido sem gradiente.
  function sombraInterna(c, s0, s1, raio, cor, op) {
    let d = '';
    for (let i = 0; i <= 10; i++) {
      const s = s0 + (s1 - s0) * i / 10, p = c.at(s), t = c.dir(s); let n = [-t[1], t[0]];
      if (n[0] * LUZ_LADO > 0) n = [-n[0], -n[1]];
      const r = raio(s) * .48; d += `${i ? 'L' : 'M'}${f2(p[0] + n[0] * r)} ${f2(p[1] + n[1] * r)}`;
    }
    return `<path d="${d}" fill="none" stroke="${cor}" stroke-width="${f2(raio((s0 + s1) / 2) * .62)}" stroke-linecap="round" stroke-linejoin="round" opacity="${op}"/>`;
  }
  // Dobras curtas no lado de dentro da junta, só quando ela dobra de verdade.
  function dobras(c, r, cor, forca) {
    if (forca < .15) return '';
    const J = c.J, m = unit((c.A[0] + c.B[0]) / 2 - J[0], (c.A[1] + c.B[1]) / 2 - J[1]), t = c.tg;
    const p = (k, l) => [J[0] + m[0] * r * k + t[0] * r * l, J[1] + m[1] * r * k + t[1] * r * l];
    const a = p(.15, -.55), b = p(.55, 0), e = p(.15, .55), a2 = p(.45, -.35), b2 = p(.75, 0), e2 = p(.45, .35);
    return stroke(`M${f2(a[0])} ${f2(a[1])} Q${f2(b[0])} ${f2(b[1])} ${f2(e[0])} ${f2(e[1])}`, cor, 2) + (forca > .45 ? stroke(`M${f2(a2[0])} ${f2(a2[1])} Q${f2(b2[0])} ${f2(b2[1])} ${f2(e2[0])} ${f2(e2[1])}`, cor, 1.6) : '');
  }

  function armV2(d, side, a, sy, prop) {
    const S = [side * (d.sw - d.ru * .62), sy + d.ru * 1.05], E = P2(S[0], S[1], a[0], d.armU), W = P2(E[0], E[1], a[1], d.armF);
    const c = membro(S, E, W), f = c.f, hem = Math.min(1, d.sleeve), solta = 2.2;
    const bend = Math.abs(((a[1] - a[0]) + 540) % 360 - 180);
    const r = (s) => s < f ? lerp(d.ru, d.re, s / f) : lerp(d.re, d.rw, (s - f) / (1 - f));
    const musculo = (s) => Math.sin(Math.PI * (s < f ? s / f : (s - f) / (1 - f))) * .9;
    const pano = (s) => r(s) + solta + .7 * Math.sin(Math.PI * Math.min(1, s / Math.max(hem, .05)));
    let s = '';
    if (hem < .985) s += union(tubo(c, Math.max(0, hem - .07), 1, (q) => r(q) + musculo(q) * .55, 22), d.skin);
    s += union(tubo(c, 0, hem, pano, Math.max(8, Math.round(30 * hem)), hem < .985), d.cloth);
    s += el(circ(S, d.ru + solta - 1.5), `fill="${d.cloth}"`);
    s += sombraInterna(c, .06, Math.max(.08, hem - .05), pano, d.clothD, .26);
    if (hem > f + .05) s += dobras(c, d.re + solta, d.clothD, Math.min(1, (bend - 25) / 90));
    else { // manga curta: barra com uma dobra leve
      const p = c.at(hem - .03), t = c.dir(hem - .03), n = [-t[1], t[0]], R = pano(hem) * .8;
      s += stroke(`M${f2(p[0] - n[0] * R)} ${f2(p[1] - n[1] * R)} Q${f2(p[0] - t[0] * 4)} ${f2(p[1] - t[1] * 4)} ${f2(p[0] + n[0] * R)} ${f2(p[1] + n[1] * R)}`, d.clothD, 1.8);
    }
    if (d.key === 'leticia' && hem < .985) { const p = c.at(hem), t = c.dir(hem), n = [-t[1], t[0]], R = pano(hem) + 1;
      s += stroke(`M${f2(p[0] - n[0] * R)} ${f2(p[1] - n[1] * R)} L${f2(p[0] + n[0] * R)} ${f2(p[1] + n[1] * R)}`, '#f2ead8', 3.4); }
    s += handSVG(d, side, W, a[1], prop);
    return s;
  }

  function lowerV2(d, L) {
    let s = '';
    for (const k of ['L', 'R']) s += footSVG(d, L[k].side, L[k].A);
    const pelvis = { d: `M${-d.hw} -22 L${d.hw} -22 Q${d.hw + 4} 8 ${d.hw - 1} 36 Q0 46 ${-d.hw + 1} 36 Q${-d.hw - 4} 8 ${-d.hw} -22Z` };
    const list = [pelvis], cuffs = [], curvas = {}, fins = {};
    // A barra termina pela distância real até o tornozelo (a curva não anda em velocidade constante), e a canela
    // aparece entre a barra e o calçado: o pé nunca fica solto da perna.
    const folga = (1 - (d.cuff ? .87 : .97)) * d.shin;
    for (const k of ['L', 'R']) {
      const { H, K, A } = L[k], c = membro(H, K, A), f = c.f; curvas[k] = c;
      let end = 1; for (let q = 1; q > f; q -= .004) { const p = c.at(q); if (Math.hypot(p[0] - A[0], p[1] - A[1]) >= folga) { end = q; break; } }
      fins[k] = end;
      const r = (q) => (q < f ? lerp(d.rt, d.rk, q / f) : lerp(d.rk, d.ra, (q - f) / (1 - f))) + Math.sin(Math.PI * (q < f ? q / f : (q - f) / (1 - f))) * (q < f ? 1.8 : 1.1);
      const t = c.dir(1), topoPe = [A[0] - t[0] * 10, A[1] - t[1] * 10];
      s += union([quad(c.at(Math.max(f, end - .04)), topoPe, d.ra * .82, d.ra * .78), circ(topoPe, d.ra * .78)], d.skin);
      list.push(...tubo(c, 0, end, r, 28, true));
      if (d.cuff) cuffs.push(quad(c.at(end - .05), c.at(Math.min(1, end + .025)), d.ra + 1.5, d.ra + 2.4));
    }
    s += union(list, d.pants);
    s += cuffs.map(q => el(q, `fill="#9aa2a6" stroke="${OUT}" stroke-width="${T}" stroke-linejoin="round"`)).join('');
    s += stroke(`M0 8 L0 ${r2(Math.min(L.L.K[1], L.R.K[1]) * .28 + 8)}`, OUT, 2);
    for (const k of ['L', 'R']) {
      const c = curvas[k], { H, K, A } = L[k], f = c.f;
      const r = (q) => q < f ? lerp(d.rt, d.rk, q / f) : lerp(d.rk, d.ra, (q - f) / (1 - f));
      s += sombraInterna(c, .08, fins[k] - .06, r, d.pantsD, .3);
      const kb = Math.abs(((Math.atan2(A[0] - K[0], A[1] - K[1]) - Math.atan2(K[0] - H[0], K[1] - H[1])) * 180 / Math.PI + 540) % 360 - 180);
      s += dobras(c, d.rk, d.pantsD, Math.min(1, (kb - 6) / 40));
      // vinco da frente da calça, que segue a curva da perna
      let v = ''; for (let i = 0; i <= 8; i++) { const p = c.at(.12 + i * .1); v += `${i ? 'L' : 'M'}${f2(p[0] + L[k].side * 3)} ${f2(p[1])}`; }
      s += `<path d="${v}" fill="none" stroke="${d.pantsD}" stroke-width="1.4" opacity=".55" stroke-linecap="round"/>`;
    }
    return s;
  }

  function torsoV2(d, sy, comBag) {
    const base = torsoSVGClassico(d, sy, comBag);
    const w = d.sw, wa = d.waist, he = d.hem, th = d.torso, nw = d.neckW + 4;
    const p = `M${-nw} ${sy - 4} Q${-w + 8} ${sy - 3} ${-w} ${sy + 18} Q${-w - 1} ${sy + th * .42} ${-wa} ${sy + th * .66} Q${-he} ${sy + th * .84} ${-he} ${sy + th + 8} Q0 ${sy + th + 17} ${he} ${sy + th + 8} Q${he} ${sy + th * .84} ${wa} ${sy + th * .66} Q${w + 1} ${sy + th * .42} ${w} ${sy + 18} Q${w - 8} ${sy - 3} ${nw} ${sy - 4}Z`;
    const id = 'tr' + hash(d.key + p);
    const lado = -LUZ_LADO; // sombra do lado oposto à luz
    let s = `<clipPath id="${id}"><path d="${p}"/></clipPath><g clip-path="url(#${id})">`;
    s += ell(lado * w * .95, sy + th * .55, w * .42, th * .75, d.clothD, 'none', 0, 'opacity=".38"');
    s += stroke(`M${-wa + 6} ${sy + th * .9} Q0 ${sy + th * .98} ${wa - 6} ${sy + th * .9}`, d.clothD, 2);
    s += stroke(`M${lado * (w - 10)} ${sy + 26} Q${lado * (w - 20)} ${sy + 44} ${lado * (w - 16)} ${sy + 62}`, d.clothD, 1.8);
    s += '</g>';
    return base.replace(/^(<path[^>]*\/>)/, `$1${s}`);
  }

  /* ---------- olhos: pupila preta, foco comum e tamanho por emoção ---------- */
  function eyeV2(d, side, E, blink) {
    const x = side * 21, y = -20, line = '#2b2024';
    const kind = blink ? 'suave' : E.eye;
    if (kind === 'arco') return stroke(`M${x - 13} ${y + 5} Q${x} ${y - 10} ${x + 13} ${y + 5}`, line, 3.4) + stroke(`M${x - 9} ${y + 10} Q${x} ${y + 6.5} ${x + 9} ${y + 10}`, d.shade, 1.6);
    if (kind === 'suave') return stroke(`M${x - 13} ${y} Q${x} ${y + 7.5} ${x + 13} ${y}`, line, 3.4) + (d.lashes ? stroke(`M${x + side * 12.5} ${y} l${side * 4} -3`, line, 2) : '');
    const lid = E.lid != null ? E.lid : d.lid, open = E.open || 1, cheek = E.low || 0;
    const desconf = E.mouth === 'side', alegre = ['smile', 'laugh', 'smallsmile'].includes(E.mouth), susto = open > 1.05;
    const w = 13.4 + (susto ? 1 : 0);
    const asym = desconf ? (side < 0 ? .68 : 1.06) : 1;
    const h = Math.max(1.5, 12.8 * open * (1 - lid * .9) * asym);
    const fundo = y + 12.5 * Math.min(open, 1.15) - cheek * 15 - (desconf && side < 0 ? 3 : 0);
    const bi = E.browIn || 0, tensao = bi > 0 ? bi * .75 : bi * .3;
    const tL = side > 0 ? tensao : 0, tR = side < 0 ? tensao : 0;
    const topo = `M${f2(x - w)} ${y} C${f2(x - w)} ${f2(y - h * 1.33 + tL)} ${f2(x + w)} ${f2(y - h * 1.33 + tR)} ${f2(x + w)} ${y}`;
    const forma = `${topo} C${f2(x + w * .65)} ${f2(fundo)} ${f2(x - w * .65)} ${f2(fundo)} ${f2(x - w)} ${y}Z`;
    const id = 'ol' + hash(d.key + forma);
    const look = E.look || [0, 0];
    let rp = 5.1 + (alegre ? 1.1 : 0) - (susto ? 1.5 : 0);
    if (E.pupil && !susto) rp *= Math.max(.86, E.pupil);
    const ph = rp * 1.12, lim = w - rp * .7;
    const px = Math.max(x - lim, Math.min(x + lim, x + look[0] * 1.1 - side * .6)), py = y - 1.2 + look[1] * .9 - cheek * 1.5;
    const brilho = ell(px + rp * .3 * LUZ_LADO, py - ph * .38, 1.3 + (alegre ? .3 : 0), 1.45 + (alegre ? .3 : 0), '#fffbed');
    let s = `<clipPath id="${id}"><path d="${forma}"/></clipPath>`;
    s += `<path d="${forma}" fill="#f8f2e6"/><g clip-path="url(#${id})">` + ell(px, py, rp, ph, '#1f1a20') + brilho
      + `<path d="${topo} L${f2(x + w)} ${f2(y - h * .75)} L${f2(x - w)} ${f2(y - h * .75)}Z" fill="#5d3d28" opacity=".14"/></g>`;
    s += `<path d="${forma}" fill="none" stroke="#53382b" stroke-width="1.5"/>` + `<path d="${topo}" fill="none" stroke="${line}" stroke-width="3.3" stroke-linecap="round"/>`;
    if (d.lashes) s += stroke(`M${f2(x + side * (w - 1.5))} ${f2(y - h * .5)} l${side * 4.5} -3.5 M${f2(x + side * (w - 5))} ${f2(y - h * .9)} l${side * 3} -4`, line, 2);
    if (E.bags || d.bags) s += stroke(`M${x - 10} ${f2(fundo + 4)} Q${x} ${f2(fundo + 7)} ${x + 10} ${f2(fundo + 4)}`, d.shade, 1.6);
    if (alegre && cheek > .1) s += stroke(`M${x - 8} ${f2(fundo + 3)} Q${x} ${f2(fundo + 5.5)} ${x + 8} ${f2(fundo + 3)}`, d.shade, 1.4);
    return s;
  }

  /* ---------- boca: arcada curva, língua e lábios juntos ---------- */
  function contornoBoca(w, cy, prof, topo) {
    return `M${f2(-w)} ${f2(cy)} Q0 ${f2(cy + topo)} ${f2(w)} ${f2(cy)} C${f2(w * .92)} ${f2(cy + prof * .82)} ${f2(w * .42)} ${f2(cy + prof * 1.2)} 0 ${f2(cy + prof)} C${f2(-w * .42)} ${f2(cy + prof * 1.2)} ${f2(-w * .92)} ${f2(cy + prof * .82)} ${f2(-w)} ${f2(cy)}Z`;
  }
  function bocaAberta(o) {
    const { w, cy, prof, topo } = o, forma = contornoBoca(w, cy, prof, topo), id = 'bc' + hash(forma + (o.cima || 0) + (o.baixo || 0) + (o.lingua ? 1 : 0));
    let s = `<clipPath id="${id}"><path d="${forma}"/></clipPath><path d="${forma}" fill="#4c2231"/><g clip-path="url(#${id})">`;
    if (o.cima) { // arcada de cima: uma faixa curva, com dois sulcos discretos
      const y0 = cy + topo * .5 - 6, y1 = cy + topo * .5 + o.cima;
      s += `<path d="M${-w - 2} ${f2(y0)} L${w + 2} ${f2(y0)} L${w + 2} ${f2(y1 - 2)} Q0 ${f2(y1 + 3)} ${-w - 2} ${f2(y1 - 2)}Z" fill="#fbf4e3"/>`;
      s += stroke(`M${f2(-w * .34)} ${f2(y1 - 2.5)} l0 2.4 M${f2(w * .34)} ${f2(y1 - 2.5)} l0 2.4`, '#cbbd9f', 1.1);
    }
    if (o.baixo) { const yb = cy + prof - o.baixo; s += `<path d="M${-w - 2} ${f2(cy + prof + 8)} L${-w - 2} ${f2(yb + 2)} Q0 ${f2(yb - 3)} ${w + 2} ${f2(yb + 2)} L${w + 2} ${f2(cy + prof + 8)}Z" fill="#efe5cf"/>`; }
    if (o.lingua) s += ell(0, cy + prof - 1, w * .55, 3.6 + prof * .14, '#d9727f') + stroke(`M0 ${f2(cy + prof - 4)} l0 3`, '#b85971', 1.2);
    s += '</g>' + `<path d="${forma}" fill="none" stroke="${OUT}" stroke-width="2.4" stroke-linejoin="round"/>`;
    s += stroke(`M${f2(-w * .42)} ${f2(cy + prof + 4.5)} Q0 ${f2(cy + prof + 7)} ${f2(w * .42)} ${f2(cy + prof + 4.5)}`, '#4a2a2a', 1.3).replace('/>', ' opacity=".45"/>');
    return s;
  }
  const BOCAS = {
    smile: () => bocaAberta({ w: 16, cy: 16, prof: 11, topo: 4, cima: 5 }) + stroke('M-20 12 Q-23 15 -21 19 M20 12 Q23 15 21 19', '#4a2a2a', 1.4),
    laugh: () => bocaAberta({ w: 19, cy: 13, prof: 25, topo: 4.5, cima: 6, lingua: true }) + stroke('M-23 9 Q-27 13 -24 18 M23 9 Q27 13 24 18', '#4a2a2a', 1.5),
    // forçado: cantos esticados para os lados, sem subir; as duas arcadas fechadas e um pouco de tensão
    teeth: () => bocaAberta({ w: 19.5, cy: 19, prof: 10, topo: -.5, cima: 5, baixo: 5 }) + stroke('M-22 16 L-21.5 23 M22 16 L21.5 23', '#4a2a2a', 1.6) + stroke('M-6 34 Q0 36 6 34', '#4a2a2a', 1.2).replace('/>', ' opacity=".5"/>'),
    o: () => { const f = 'M0 11 C7 11 9 17 9 22 C9 29 5 33 0 33 C-5 33 -9 29 -9 22 C-9 17 -7 11 0 11Z', id = 'bo' + hash(f);
      return `<clipPath id="${id}"><path d="${f}"/></clipPath><path d="${f}" fill="#4c2231"/><g clip-path="url(#${id})">` + ell(0, 32, 6, 4, '#d9727f') + '</g>' + `<path d="${f}" fill="none" stroke="${OUT}" stroke-width="2.4"/>`; },
    vsmall: () => bocaAberta({ w: 7.5, cy: 21, prof: 7, topo: -1 }),
    vopen: () => bocaAberta({ w: 11, cy: 17, prof: 16, topo: -1, cima: 3.5, lingua: true }),
    vwide: () => bocaAberta({ w: 17, cy: 16, prof: 15, topo: -1, cima: 4.5, lingua: true }),
  };

  /* ---------- sombra da silhueta e contato dos pés ---------- */
  // Projeção afim da silhueta no chão, para o lado oposto à luz, mais o contato denso sob cada sola.
  function sombra(d, pose = {}, o = {}) {
    if (pose.semPernas) return '';
    const noite = !!o.noite, lado = o.lado ?? LUZ_LADO, id = o.id || 'sm' + hash(d.key);
    const base = drawChar(d, pose);
    const Pz = Object.assign({ legL: [-4, -2], legR: [4, 2], liftL: 0, liftR: 0 }, pose), L = legs(d, Pz);
    const low = Math.max(L.L.A[1], L.R.A[1]);
    let s = `<filter id="${id}p" x="-60%" y="-60%" width="220%" height="220%" color-interpolation-filters="sRGB"><feFlood flood-color="#2e2231"/><feComposite in2="SourceAlpha" operator="in"/><feGaussianBlur stdDeviation="${noite ? 3.2 : 4.2}"/></filter>`;
    s += `<filter id="${id}c" x="-50%" y="-200%" width="200%" height="500%"><feGaussianBlur stdDeviation="2.2"/></filter>`;
    // O chão de todos os cenários começa 40 unidades atrás dos pés. A sombra corre nesse chão e, com naParede,
    // sobe pela parede logo atrás, deslocada para longe da luz.
    const parede = o.parede ?? -40, naParede = !!o.naParede;
    s += `<clipPath id="${id}ch"><rect x="-3000" y="${parede}" width="6000" height="400"/></clipPath><clipPath id="${id}pa"><rect x="-3000" y="-4000" width="6000" height="${4000 + parede}"/></clipPath>`;
    s += `<g clip-path="url(#${id}ch)"><g filter="url(#${id}p)" opacity="${noite ? .32 : .26}"><g transform="matrix(1 0 ${-.42 * lado} .17 0 0)">${base}</g></g></g>`;
    if (naParede) s += `<g clip-path="url(#${id}pa)"><g filter="url(#${id}p)" opacity="${noite ? .22 : .16}"><g transform="translate(${-92 * lado} 34)">${base}</g></g></g>`;
    for (const k of ['L', 'R']) {
      const A = L[k].A, chao = A[1] >= low - 6; if (!chao) continue;
      const x = A[0] + L[k].side * 3;
      s += `<ellipse cx="${f2(x - lado * 8)}" cy="0" rx="46" ry="10" fill="#2e2231" opacity=".3" filter="url(#${id}c)"/>`;
      s += `<ellipse cx="${f2(x)}" cy="-1" rx="31" ry="5.5" fill="#2e2231" opacity=".62"/>`;
    }
    return s;
  }

  return { eye: eyeV2, arm: armV2, lower: lowerV2, torso: torsoV2, mouth: (k) => (BOCAS[k] ? BOCAS[k]() : null), sombra };
})();
function setEstiloRig(v) { ESTILO_RIG = v === 'classico' ? 'classico' : 'organico'; }
function setLuzLado(l) { LUZ_LADO = l < 0 ? -1 : 1; }
// Sombra de um ator, nas coordenadas dele (pés em y = 0): contato sob as solas, projeção no chão e, com
// o.naParede, na parede logo atrás. o = { noite, lado: 1 luz da direita | -1 da esquerda, id, naParede }.
function sombraSVG(d, pose = {}, o = {}) { return RigOrganico.sombra(d, pose, o); }

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

if (typeof module === 'object' && module.exports) module.exports = { CHARS, FISCAL, EXPR, EXPR_ORDER, NOMES_EXPR, SHOE_H, OUT, drawChar, drawDog, sombraSVG, setEstiloRig, setLuzLado };
