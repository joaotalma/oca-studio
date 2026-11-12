'use strict';
// Demitido Antes do GTA, Dia 1: Três e Vinte. Planos, poses e telas. Falas e tempos vêm de falas.js e tempos.js.
// Rig orgânico (padrão). Helpers de braço e de tela copiados do ep. 5 do Tico.
const sai = (p) => { p = Math.max(0, Math.min(1, p)); return 1 - (1 - p) * (1 - p); };
const suave = (p) => { p = Math.max(0, Math.min(1, p)); return p * p * (3 - 2 * p); };
const clamp01 = (p) => Math.max(0, Math.min(1, p));
const F = Object.fromEntries(FALAS.map((f) => [f.n, f]));
const I = (n) => F[n].ini, E = (n) => F[n].fim;
const NOITE = { ambiente: 'noite', lado: 'direita' };
const TARDE = { ambiente: 'dia', lado: 'esquerda' };
const LEMBRA = (ini) => (t) => (t < ini + .8 ? .1 : .1 + .9 * suave((t - ini - .8) / .3));
const K = CHARS.kaua;

/* ---------- medidas do rig (do ep. 5) ---------- */
const raizLocal = (d) => -(10 + d.thigh + d.shin + SHOE_H[d.shoe]);
function ombroDe(lado, d, x, y, s) { return [x + s * lado * (d.sw - d.ru * .62), y + s * (raizLocal(d) - d.torso + d.ru * 1.05)]; }
function bracoAte(lado, alvo, d, x, y, s) {
  const [ox, oy] = ombroDe(lado, d, x, y, s);
  const a = d.armU * s, b = d.armF * s, dx = alvo[0] - ox, dy = alvo[1] - oy, dist = Math.min(a + b - 2, Math.hypot(dx, dy));
  const base = Math.atan2(dx, dy) * 180 / Math.PI, abre = Math.acos(clamp01((a * a + dist * dist - b * b) / (2 * a * dist))) * 180 / Math.PI;
  const curva = Math.acos(clamp01((a * a + b * b - dist * dist) / (2 * a * b))) * 180 / Math.PI;
  const up = base + lado * abre;
  return [up, up - lado * (180 - curva)];
}
const peitoY = (d, y, s) => y + s * (raizLocal(d) - d.torso * .55);

/* ---------- o controle arregaçado ---------- */
// cx, cy no mundo; k é a escala; deriva é o analógico esquerdo puxando para a esquerda
function controle(cx, cy, k, t, o = {}) {
  const deriva = -9 - Math.sin(t * 5) * 3, balanca = Math.sin(t * 4) * 6;
  let s = `<g transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${k.toFixed(4)}) rotate(${(o.rot || 0).toFixed(2)})">`;
  // gatilho R2 solto, pendurado por um fio
  s += stroke(`M96 -58 Q104 -84 ${(118 + balanca).toFixed(1)} -98`, '#2b2d34', 2.4) + `<g transform="rotate(${(22 + balanca).toFixed(1)} 118 -98)">` + shape('M100 -112 L140 -112 Q148 -100 140 -88 L100 -88Z', '#d8d4cc', 2.6) + '</g>';
  s += shape('M-126 -76 L-80 -76 L-74 -60 L-120 -60Z', '#d8d4cc', 2.6);
  s += shape('M-120 -30 Q-110 -62 -60 -60 L60 -60 Q110 -62 120 -30 L146 50 Q152 92 116 96 Q92 98 76 62 L-76 62 Q-92 98 -116 96 Q-152 92 -146 50Z', o.gelado ? '#dfe9f2' : '#e4e0d6', 4);
  // encardido e rachaduras
  s += ell(-112, 60, 26, 20, '#b9b2a2', 'none', 0, 'opacity=".55"') + ell(100, 70, 22, 16, '#b9b2a2', 'none', 0, 'opacity=".5"');
  s += stroke('M-20 62 L-12 40 L-24 26 L-10 8', '#5a5a5a', 2.2) + stroke('M128 10 L112 22 L120 36', '#5a5a5a', 2) + stroke('M-138 30 L-120 38', '#5a5a5a', 2);
  s += shape('M-56 -60 L56 -60 L48 4 L-48 4Z', '#2b2d34', 3) + stroke('M-40 -50 L-10 -20 L20 -46', '#55585f', 2);
  // fita isolante em três pedaços, um descolando
  s += `<rect x="-132" y="-10" width="70" height="22" rx="3" fill="#23252b" transform="rotate(-18 -98 2)"/><rect x="60" y="22" width="64" height="20" rx="3" fill="#23252b" transform="rotate(14 90 28)"/>`;
  s += `<path d="M-30 50 L30 50 L34 70 Q10 64 -2 76 L-30 70Z" fill="#23252b"/><path d="M30 50 Q48 46 52 30" fill="none" stroke="#23252b" stroke-width="10" stroke-linecap="round"/>`;
  if (o.fitaExtra) s += `<rect x="-150" y="18" width="300" height="24" rx="3" fill="#23252b" opacity="${o.fitaExtra.toFixed(2)}"/>`;
  // analógicos: o esquerdo torto e sem borracha
  s += ell(-38 + deriva, 30, 22, 22, '#2b2d34', OUT, 3) + ell(-38 + deriva * 1.5, 26, 10, 10, '#6b6e76') + stroke(`M${(-38 + deriva).toFixed(1)} 30 L${(-38 + deriva * 1.5).toFixed(1)} 26`, '#1b1b1f', 3);
  s += ell(38, 30, 22, 22, '#2b2d34', OUT, 3) + ell(38, 28, 12, 12, '#43464f');
  // botões: um faltando (buraco), o X colado com chiclete
  s += ell(92, -18, 9, 9, '#d8d4cc', OUT, 2) + ell(110, -2, 9, 9, '#3a3a3a', OUT, 2) + ell(110, -2, 4, 4, '#111111') + ell(74, -2, 9, 9, '#d8d4cc', OUT, 2);
  s += shape('M80 8 Q92 2 104 10 Q108 22 92 26 Q78 24 80 8Z', '#f29bb8', 2) + stroke('M86 14 Q92 18 98 14', '#d86a92', 1.6);
  s += shape('M-104 -22 L-86 -22 L-86 -4 L-104 -4Z', '#d8d4cc', 2) + (o.gelado ? `<path d="M-120 -40 L-100 -50 M110 -48 L130 -36" stroke="#9fd0ee" stroke-width="4"/>` : '');
  return s + '</g>';
}
function maosNoControle(d, x, y, s, alvo) {
  return { armL: bracoAte(-1, [alvo[0] - 70 * s, alvo[1] + 10 * s], d, x, y, s), armR: bracoAte(1, [alvo[0] + 70 * s, alvo[1] + 10 * s], d, x, y, s) };
}

/* ---------- o quarto ---------- */
function tvJogo(x, y, w, h, t) {
  // jogo genérico nosso: um bonequinho anda sozinho para a esquerda e bate na parede
  const ciclo = (t * .9) % 1, bx = x + w * (.85 - .62 * sai(ciclo)), bate = ciclo > .92;
  let s = ret(x, y, w, h, '#20293f', 6, 0) + ret(x, y + h * .78, w, h * .22, '#3c6b4a', 0, 0) + ret(x + w * .12, y + h * .3, 26, h * .48, '#8a5a3a', 0, 0);
  s += `<g transform="translate(${bx.toFixed(1)} ${(y + h * .78).toFixed(1)}) rotate(${bate ? -12 : 0})">` + ret(-9, -44, 18, 24, '#f2c14e', 3, 0) + ell(0, -54, 10, 10, '#f0c09a') + ret(-9, -20, 7, 20, '#3a4a8a', 0, 0) + ret(2, -20, 7, 20, '#3a4a8a', 0, 0) + '</g>';
  if (bate) s += txt(x + w * .12 + 40, y + h * .3, 'TUM', 26, '#ffffff');
  return s;
}
function quarto(t, o = {}) {
  let s = `<rect x="-600" y="-400" width="2300" height="${CHAO + 400}" fill="#4a5784"/>`;
  s += `<rect x="-600" y="180" width="2300" height="14" fill="#b26bff" opacity=".55"/><rect x="-600" y="194" width="2300" height="70" fill="#b26bff" opacity=".12"/>`; // fita de LED
  s += ret(80, 360, 300, 260, '#22304f', 8) + `<rect x="92" y="372" width="276" height="236" fill="#16203a"/>` + [0, 1, 2, 3].map((i) => ret(110 + i * 64, 470 - (i % 2) * 40, 44, 138 + (i % 2) * 40, '#2c3a5c', 0, 0) + ret(122 + i * 64, 500, 10, 14, '#ffd98a', 0, 0)).join('') + stroke('M230 360 L230 620 M80 490 L380 490', '#22304f', 8);
  // calendário: dia 5 circulado, dia 19 com coração e controle
  s += ret(440, 380, 220, 250, '#fbf7ef', 6) + ret(440, 380, 220, 44, '#d84a4a', 6, 0) + txt(550, 412, 'NOVEMBRO', 24, '#ffffff');
  for (let i = 0; i < 30; i++) { const cx = 462 + (i % 7) * 29, cy = 452 + Math.floor(i / 7) * 34; s += txt(cx + 8, cy + 10, String(i + 1), 15, '#6a6a6a'); if (i < 12) s += stroke(`M${cx - 3} ${cy - 6} L${cx + 19} ${cy + 16} M${cx + 19} ${cy - 6} L${cx - 3} ${cy + 16}`, '#d84a4a', 2.6); if (i === 12) s += `<rect x="${cx - 5}" y="${cy - 9}" width="26" height="28" fill="none" stroke="#2f6fd8" stroke-width="2.6"/>`; }
  s += `<circle cx="${462 + 4 * 29 + 8}" cy="${452 + 4}" r="15" fill="none" stroke="#d84a4a" stroke-width="3.5"/>`;
  s += txt(462 + 4 * 29 + 8, 452 + 2 * 34 + 2, '❤', 22, '#d84a4a');
  // camisas de time na parede
  s += ret(700, 360, 130, 150, '#f4f1ea', 4) + shape('M720 380 L745 370 L765 384 L785 370 L810 380 L815 420 L800 420 L800 495 L730 495 L730 420 L715 420Z', '#2f6fd8', 2.4) + txt(765, 450, '10', 30, '#ffffff');
  // cama à esquerda
  s += ret(-120, CHAO - 260, 520, 90, '#8a6a4a', 10) + ret(-120, CHAO - 180, 520, 180, '#5a3f2e', 0) + shape(`M-110 ${CHAO - 262} Q140 ${CHAO - 300} 390 ${CHAO - 262} L390 ${CHAO - 196} L-110 ${CHAO - 196}Z`, '#c75b5b', 2.6) + ret(-90, CHAO - 320, 170, 70, '#f4efe6', 24);
  // mesa, TV, PS5 genérico e salgadinho
  s += ret(560, CHAO - 520, 500, 26, '#6b4a34', 6) + ret(590, CHAO - 494, 20, 494, '#4e3626', 0) + ret(1010, CHAO - 494, 20, 494, '#4e3626', 0);
  s += ret(610, CHAO - 840, 420, 280, '#15161a', 12) + tvJogo(626, CHAO - 824, 388, 248, t) + ret(790, CHAO - 560, 60, 40, '#15161a', 0, 0);
  s += shape(`M1036 ${CHAO - 700} Q1050 ${CHAO - 704} 1060 ${CHAO - 690} L1060 ${CHAO - 524} L1036 ${CHAO - 524}Z`, '#f2f2f2', 2.4) + ret(1042, CHAO - 690, 8, 166, '#202226', 2, 0);
  if (!o.semSalgadinho) s += shape(`M640 ${CHAO - 600} L700 ${CHAO - 610} L708 ${CHAO - 520} L636 ${CHAO - 520}Z`, '#f2a63a', 2.4) + txt(672, CHAO - 562, 'SALG', 16, '#8a2a12', 'middle', -6);
  // porta à direita
  s += ret(1110, CHAO - 900, 300, 900, o.porta ? '#f6e2b8' : '#8a6a4a', 0) + (o.porta ? `<rect x="1110" y="${CHAO - 900}" width="300" height="900" fill="#ffe8b0" opacity="${o.porta.toFixed(2)}"/>` : '');
  s += `<rect x="-600" y="${CHAO}" width="2300" height="500" fill="#6b5240"/>`;
  return s;
}

/* ---------- telas de celular (moldura do ep. 5) ---------- */
function quebra(texto, max) {
  const linhas = []; let a = '';
  for (const w of texto.split(' ')) { if (a && (a + ' ' + w).length > max) { linhas.push(a); a = w; } else a = a ? a + ' ' + w : w; }
  if (a) linhas.push(a);
  return linhas;
}
const FUNDO_TELA = `<defs><radialGradient id="brilhoTela" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#34507a"/><stop offset="1" stop-color="#16203a"/></radialGradient></defs><rect x="-200" y="-200" width="1480" height="2320" fill="url(#brilhoTela)"/>`;
const brilhos = (t) => t == null ? '' : [0, 1, 2, 3].map((i) => `<circle cx="${(540 + Math.sin(t * .8 + i * 1.6) * 520).toFixed(1)}" cy="${(960 + Math.cos(t * .6 + i * 2.1) * 820).toFixed(1)}" r="${220 + i * 40}" fill="#ffd98a" opacity=".1"/>`).join('');
const moldura = (conteudo, t) => FUNDO_TELA + brilhos(t) + `<rect x="200" y="124" width="700" height="1500" rx="60" fill="#000" opacity=".25"/>` + ret(190, 110, 700, 1500, '#23252f', 60)
  + ret(220, 170, 640, 1380, '#efe8dc', 18, 0) + conteudo + `<circle cx="540" cy="140" r="9" fill="#3b3f4a"/>`;
const cabecalho = (nome, cor, sub = '') => ret(220, 170, 640, 150, cor, 18, 0) + `<circle cx="296" cy="245" r="40" fill="#ffffff" opacity=".9"/>` + txt(296, 258, nome.slice(-2), 30, cor) + txt(356, 238, nome, 38, '#ffffff', 'start') + (sub ? txt(356, 282, sub, 24, '#e8f0ff', 'start') : '');
function balao(y, quem, texto, minha, cor = '#ffffff') {
  const linhas = quebra(texto, 20), w = Math.min(560, Math.max(...linhas.map((l) => l.length)) * 22 + 56), h = 40 + linhas.length * 44 + (quem && !minha ? 34 : 0);
  const x = minha ? 840 - w : 240;
  let s = ret(x, y, w, h, minha ? '#d6f5c8' : cor, 20, 2.4);
  let ty = y + 46;
  if (quem && !minha) { s += txt(x + 24, y + 38, quem, 24, '#2f6fd8', 'start'); ty += 34; }
  linhas.forEach((l, i) => { s += txt(x + 24, ty + i * 44, l, 32, '#1b1b1f', 'start'); });
  return { s, h };
}
// lista de mensagens [{t, quem, texto, minha}] que aparecem conforme o tempo, de baixo para cima
function chat(t, nome, cor, msgs, extra = '') {
  let corpo = cabecalho(nome, cor, 'Léo, Rafa, Pedrão, Você'), y = 360;
  const vis = msgs.filter((m) => t >= m.t);
  // a conversa rola suavemente: cada bolha nova entra ocupando espaço aos poucos (0,35 s)
  const ent = (m) => suave(clamp01((t - m.t) / .35));
  const total = vis.reduce((acc, m) => acc + (balao(0, m.quem, m.texto, m.minha, m.cor).h + 22) * ent(m), 0), topo = Math.min(360, 1440 - total);
  y = topo;
  vis.forEach((m) => { const a = ent(m); const b = balao(y, m.quem, m.texto, m.minha, m.cor); corpo += `<g opacity="${a.toFixed(3)}">${b.s}</g>`; y += (b.h + 22) * a; });
  return moldura(`<g>${corpo}</g>` + extra, t);
}
function digitando(t, ini) { return `<g opacity="${clamp01((t - ini) / .2).toFixed(2)}">` + ret(240, 1470, 420, 60, '#ffffff', 20, 2) + txt(270, 1508, 'Kauã está digitando' + '.'.repeat(1 + Math.floor(t * 3) % 3), 26, '#6a6a6a', 'start') + '</g>'; }
function telaEmail(t) {
  let c = ret(220, 170, 640, 120, '#3a6fd0', 18, 0) + txt(256, 245, 'Caixa de entrada', 36, '#ffffff', 'start');
  const linha = (y, de, assunto, prev, hora, forte) => ret(236, y, 608, 170, forte ? '#ffffff' : '#f4f1ea', 14, forte ? 3 : 1.5) + txt(262, y + 48, de, 30, forte ? '#1b1b1f' : '#8a8a8a', 'start') + txt(820, y + 48, hora, 22, '#8a8a8a', 'end') + txt(262, y + 96, assunto, forte ? 34 : 26, forte ? '#1b1b1f' : '#9a9a9a', 'start') + txt(262, y + 140, prev, 22, '#8a8a8a', 'start');
  c += linha(320, 'Diretoria', 'Ajuste de estrutura 😊', 'Olá, Kauã! Agradecemos sua dedicação...', '16:00', true);
  c += linha(510, 'Loja Promo', 'Ofertas da semana', 'Só hoje!', '11:02', false) + linha(700, 'Banco', 'Seu saldo: R$ 3,20', 'Consulte seu extrato', 'ontem', false);
  return moldura(c, t);
}
function telaCalc(t, ini) {
  const fase = t - ini, VALS = ['449,90 − 3,20', '446,70', '446,70 ÷ 6', '74,45'];
  const i = Math.min(3, Math.max(0, Math.floor(fase / 1.4))), q = i === 0 ? 1 : clamp01((fase - i * 1.4) / .3);
  const treme = fase > 4.2 ? Math.sin(t * 40) * 4 : 0;
  const num = (v, a, k) => `<g opacity="${a.toFixed(3)}">` + txt(820 + treme, 620, v, v.length > 8 ? 70 : 110, k === 3 ? '#ff5a5a' : '#ffffff', 'end') + '</g>';
  let c = ret(220, 170, 640, 1380, '#1b1d24', 18, 0) + (i > 0 && q < 1 ? num(VALS[i - 1], 1 - q, i - 1) : '') + num(VALS[i], q, i);
  const teclas = ['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '−', '0', ',', '=', '+'];
  teclas.forEach((k, i) => { const x = 250 + (i % 4) * 150, y = 760 + Math.floor(i / 4) * 170; c += ell(x + 65, y + 65, 62, 62, i % 4 === 3 ? '#f29a3a' : '#3a3d48') + txt(x + 65, y + 82, k, 50, '#ffffff'); });
  return moldura(c, t);
}
function fantasiaCelular(x, y, k, t) {
  // mascote: celular gigante de pé, com tela-rosto, bracinhos e tênis; y é o chão sob os pés
  const b = Math.sin(t * 3) * 4, aceno = Math.sin(t * 5) * 14;
  let s = `<g transform="translate(${x} ${(y + b).toFixed(1)}) scale(${k})">`;
  s += ret(-62, -40, 40, 40, '#3a3d48', 8) + ret(22, -40, 40, 40, '#3a3d48', 8) + ret(-72, -8, 60, 22, '#ffffff', 10) + ret(12, -8, 60, 22, '#ffffff', 10);
  s += `<g transform="rotate(${(-30 + aceno).toFixed(1)} -96 -220)">` + ret(-150, -236, 64, 32, '#f28a2a', 16) + ell(-150, -220, 22, 22, '#ffffff', OUT, 3) + '</g>';
  s += ret(86, -236, 64, 32, '#f28a2a', 16) + ell(150, -220, 22, 22, '#ffffff', OUT, 3);
  s += ret(-100, -380, 200, 350, '#f28a2a', 34) + ret(-80, -350, 160, 250, '#fff6e6', 18) + ell(0, -66, 16, 16, '#d0661c', OUT, 2);
  s += ell(-34, -270, 13, 17, '#1b1b1f') + ell(34, -270, 13, 17, '#1b1b1f') + ell(-30, -276, 4, 5, '#ffffff') + ell(38, -276, 4, 5, '#ffffff');
  s += shape('M-42 -210 Q0 -160 42 -210 Q0 -186 -42 -210Z', '#d84a4a', 3) + ell(-56, -222, 12, 7, '#f6a8a8', 'none', 0, 'opacity=".8"') + ell(56, -222, 12, 7, '#f6a8a8', 'none', 0, 'opacity=".8"');
  return s + '</g>';
}
function telaBicos(t, ini) {
  let c = cabecalho('BICOS DO BAIRRO', '#2f8f4e', '214 participantes');
  const a1 = clamp01((t - ini - .3) / .3), a2 = clamp01((t - ini - 7.8) / .3);
  c += `<g opacity="${a1.toFixed(2)}">` + ret(240, 350, 600, 520, '#ffffff', 20, 2.6) + ret(260, 370, 560, 300, '#ffe9cf', 12, 0) + fantasiaCelular(540, 650, .64, t)
    + txt(262, 720, 'PRECISA-SE DE MASCOTE', 30, '#1b1b1f', 'start') + txt(262, 766, 'p/ loja de celular. Shopping.', 26, '#3a3a3a', 'start') + txt(262, 810, '8h às 18h. R$ 80/dia.', 30, '#2f8f4e', 'start') + '</g>';
  c += `<g opacity="${a2.toFixed(2)}">` + ret(240, 900, 600, 520, '#ffffff', 20, 2.6) + ret(260, 920, 560, 300, '#dfeefc', 12, 0)
    + [[330, 1190, .32], [430, 1200, .28], [530, 1196, .36], [640, 1204, .26], [740, 1200, .3]].map(([x, y, k]) => `<g transform="translate(${x} ${y}) scale(${k})">${drawDog({ expr: 'feliz', tail: 20 + Math.sin(t * 8 + x) * 12 })}</g>`).join('')
    + `<g transform="translate(560 1214) scale(.62)">${drawDog({ expr: 'bravo', tail: 10, mouth: Math.sin(t * 9) > .3 ? 1 : 0 })}</g>`
    + txt(262, 1270, 'PASSEADOR DE CÃES', 30, '#1b1b1f', 'start') + txt(262, 1316, 'R$ 15 por cachorro.', 30, '#2f6fd8', 'start') + '</g>';
  return moldura(c, t);
}

function telaEscolha(t) {
  let c = cabecalho('BICOS DO BAIRRO', '#2f8f4e', 'escolha uma vaga');
  c += ret(240, 360, 290, 900, '#ffe9cf', 18, 2.6) + fantasiaCelular(385, 960, .62, t) + txt(385, 1050, 'MASCOTE', 30, '#3a1a02') + txt(385, 1094, 'R$ 80/dia', 28, '#3a1a02') + ret(260, 1150, 250, 80, '#ff9a3a', 20, 2.4) + txt(385, 1202, 'Quero a vaga', 28, '#3a1a02');
  c += ret(550, 360, 290, 900, '#dfeefc', 18, 2.6) + `<g transform="translate(695 960) scale(.62)">${drawDog({ expr: 'bravo', mouth: Math.sin(t * 9) > .2 ? 1 : 0, tail: 10 })}</g>` + txt(695, 1050, 'CACHORROS', 30, '#062a4a') + txt(695, 1094, 'R$ 15 cada', 28, '#062a4a') + ret(570, 1150, 250, 80, '#4aa8ff', 20, 2.4) + txt(695, 1202, 'Quero a vaga', 28, '#062a4a');
  return moldura(c, t);
}
// mão do Kauã vinda de baixo, com o polegar levantado sobre a tela
function maoPolegar(x, y) {
  return shape(`M${x - 90} 2000 L${x - 80} ${y + 140} Q${x - 70} ${y + 70} ${x - 20} ${y + 80} L${x + 40} ${y + 90} Q${x + 90} ${y + 110} ${x + 80} ${y + 180} L${x + 70} 2000Z`, '#2f6f5e', 4)
    + shape(`M${x - 70} ${y + 150} Q${x - 80} ${y + 70} ${x - 30} ${y + 60} L${x + 50} ${y + 70} Q${x + 80} ${y + 90} ${x + 70} ${y + 160}Z`, '#a86b48', 4)
    + shape(`M${x - 34} ${y + 74} Q${x - 46} ${y - 20} ${x - 10} ${y - 34} Q${x + 22} ${y - 30} ${x + 14} ${y + 70}Z`, '#a86b48', 4) + shape(`M${x - 28} ${y - 10} Q${x - 26} ${y - 30} ${x - 8} ${y - 30} Q${x + 8} ${y - 26} ${x + 6} ${y - 8}Z`, '#e8c3a8', 2);
}

// a cama vista de cima: lençol, travesseiro atrás da cabeça e cobertor da cintura para baixo
const camaDeCima = () => `<rect x="-400" y="-200" width="1880" height="2400" fill="#3a3550"/>` + ret(60, 520, 640, 1500, '#e9e4f2', 30) + ret(KX - 230, 640, 460, 230, '#f8f6fb', 70) + stroke(`M${KX - 190} 700 Q${KX} 680 ${KX + 190} 700 M${KX - 190} 820 Q${KX} 840 ${KX + 190} 820`, '#d8d2e6', 3);
const cobertor = () => shape(`M40 1215 Q${KX} 1180 720 1215 L720 2100 L40 2100Z`, '#c75b5b', 4) + [0, 1, 2, 3].map((i) => stroke(`M60 ${1290 + i * 90} Q${KX} ${1260 + i * 90} 700 ${1290 + i * 90}`, '#a84848', 3)).join('');

/* ---------- a mãe (fora de quadro: só avental, braço e marmita) ---------- */
function maeComMarmita(x, t, entra) {
  const dx = (1 - sai(entra)) * 420, mx = 760 + dx, my = 1040 + Math.sin(t * 2) * 4;
  // sombra na parede (de avental, com a colher)
  let s = `<g opacity=".28"><path d="M${1000 + dx * .6} ${CHAO} L${1010 + dx * .6} 700 Q${1060 + dx * .6} 600 ${1110 + dx * .6} 700 L${1120 + dx * .6} ${CHAO}Z" fill="#141826"/><circle cx="${1060 + dx * .6}" cy="640" r="70" fill="#141826"/></g>`;
  // braço com manga roxa e mão segurando a marmita
  s += shape(`M1200 ${my - 60} L${mx + 110} ${my - 40} Q${mx + 90} ${my + 20} ${mx + 110} ${my + 50} L1200 ${my + 70}Z`, '#7a5aa8', 3);
  s += ret(mx - 90, my - 70, 190, 110, '#d4473f', 14) + `<path d="M${mx - 90} ${my - 30} L${mx + 100} ${my - 30}" stroke="#ffffff" stroke-width="7" stroke-dasharray="14 10"/>` + shape(`M${mx - 20} ${my - 70} Q${mx + 5} ${my - 110} ${mx + 30} ${my - 70}`, '#d4473f', 3);
  s += ell(mx + 108, my, 34, 40, '#c48a6a', OUT, 3) + stroke(`M${mx + 84} ${my - 16} L${mx + 70} ${my - 22} M${mx + 84} ${my} L${mx + 68} ${my - 2} M${mx + 84} ${my + 16} L${mx + 70} ${my + 18}`, '#8e5a3e', 2.4);
  return s;
}

/* ---------- a mesa do escritório (frente) ---------- */
function mesaEscritorio(t, o = {}) {
  let s = ret(250, 1250, 640, 30, '#c9ced6', 6) + ret(250, 1280, 640, 330, '#9aa2ae', 0);
  const em = o.email || 0;
  s += ret(470, 1010, 230, 160, '#23252f', 10) + ret(484, 1024, 202, 132, '#f4f1ea', 4, 0) + ret(570, 1170, 30, 80, '#23252f', 0, 0) + ret(530, 1240, 110, 14, '#23252f', 4, 0);
  s += `<g opacity="${(1 - em).toFixed(3)}">` + ret(540, 1040, 90, 104, '#ffffff', 4, 2) + ret(540, 1040, 90, 30, '#d84a4a', 4, 0) + txt(585, 1062, 'PDF', 20, '#ffffff') + '</g>';
  if (em > 0) s += `<g opacity="${em.toFixed(3)}">` + ret(484, 1024, 202, 132, '#3a6fd0', 4, 0) + txt(585, 1100, '😊', 50) + '</g>';
  if (o.celular) s += `<g opacity="${Math.min(1, o.celular).toFixed(3)}">` + `<g transform="translate(${(400 + Math.sin(t * 60) * 3).toFixed(1)} 1238)">` + ret(-46, -16, 92, 28, '#23252f', 8) + ret(-38, -12, 76, 20, '#3a6fd0', 4, 0) + '</g></g>';
  return s;
}

// divisória da baia da Lua: ela espia por cima, do peito para cima
const divisoria = () => ret(860, 1110, 320, 520, '#8fa0b4', 8) + ret(860, 1110, 320, 22, '#6f7f92', 6, 0) + [0, 1, 2].map((i) => ret(880 + i * 100, 1150, 80, 50, '#e8edf2', 4, 1.5)).join('');
const caixa = (x) => ret(x - 85, 1070, 170, 110, '#c9a06a', 6) + txt(x - 20, 1066, '🌵', 40) + txt(x + 40, 1066, '☕', 34);

/* ---------- tempos dos planos ---------- */
const FLASH = 10.0, DATAS = 27.0, CTRL = 33.0, ASSOPRA = 39.2, FITA = 40.4, GELA = 41.4, FICA = 43.4, GRUPO = 50.0, REGRA = 66.0, MAE = 74.0, CONTA = 90.0, FICA2 = 98.0, MARCA = 104.0, BICOS = 115.0, VOTO = 128.3, FIM = 133.3, FIM_DO_EP = 134.1;
const KX = 380, KS = 1.32, KY = CHAO;
const kauaCom = (t0, poseBase, extra = {}) => ({ id: 'kaua', x: KX, s: KS, poses: [[0, { ...maosNoControle(K, KX, KY, KS, [KX, peitoY(K, KY, KS) + 40]), ...poseBase }]], ...extra });
const ctrlFrente = (o = {}) => (t) => controle(KX, peitoY(K, KY, KS) + 50, .62, t, o);

/* ---------- planos ---------- */
const dia01Planos = [
  // abertura: close no controle e nas moedas
  { ini: 0, fim: 5.0, cena: 'vazio', visual: NOITE, cam: [[0, KX + 40, 980, 2.0], [5.0, KX + 40, 990, 2.15, 5.0]], fundo: (t) => quarto(t), atores: [kauaCom(0, { expr: 'cansado', look: [0, 4] }), ],
    frente: (t) => ctrlFrente()(t) + (t > 3.2 ? [0, 1, 2, 3].map((i) => ell(KX + 120 + i * 18, peitoY(K, KY, KS) - 10 + i * 4, 12, 12, i === 3 ? '#c9c2b0' : '#e0b24a', OUT, 2)).join('') : '') },
  // o e-mail
  { ini: 5.0, fim: FLASH, cena: 'vazio', cheia: true, cam: [[5.0, 540, 960, 1], [FLASH, 640, 560, 1.7, 4.0]], fundo: telaEmail },
  // ontem, 16h: escritório
  { ini: FLASH, fim: 19.4, cena: 'escritorio', visual: TARDE, cor: LEMBRA(FLASH), cam: [[FLASH, 560, 1080, 1.15], [19.4, 600, 1060, 1.25, 9.4]], atores: [
    { id: 'kaua', x: 420, s: 1.2, poses: [[0, { expr: 'neutro', look: [4, 0] }], [I(5), { expr: 'cansado' }]] },
    { id: 'junior', x: 720, s: 1.2, poses: [[0, { expr: 'feliz', armL: bracoAte(-1, [610, 1090], CHARS.junior, 720, CHAO, 1.2), look: [-4, 0] }], [E(4), { expr: 'feliz' }]] },
    { id: 'lua', x: 990, s: 1.15, poses: [[0, { expr: 'neutro', look: [-3, 0] }]] }], frente: (t) => mesaEscritorio(t) + divisoria() },
  { ini: 19.4, fim: DATAS - 1.6, cena: 'escritorio', visual: TARDE, cam: [[19.4, 560, 1080, 1.2], [23.0, 520, 1100, 1.35, 3.6]], atores: [
    { id: 'kaua', x: 420, s: 1.2, poses: [[0, { expr: 'feliz' }], [I(7) - .2, { expr: 'surpreso' }]] },
    { id: 'ceo', x: 640, s: 1.2, movX: [19.4, 20.4, 1200, 640], poses: [[0, { expr: 'feliz', armL: bracoAte(-1, [500, 1010], CHARS.ceo, 640, CHAO, 1.2) }]] },
    { id: 'lua', x: 990, s: 1.15, poses: [[0, { expr: 'neutro' }], [I(7), { expr: 'preocupado', look: [-4, 0] }]] }],
    frente: (t) => mesaEscritorio(t, { celular: clamp01((t - I(7) + .3) / .3), email: clamp01((t - I(7)) / .35) }) + divisoria() },
  { ini: DATAS - 1.6, fim: DATAS, cena: 'escritorio', visual: TARDE, cam: [[DATAS - 1.6, 600, 1080, 1.15]], atores: [
    { id: 'kaua', x: 420, s: 1.2, movX: [DATAS - 1.6, DATAS, 420, 250], poses: [[0, { expr: 'triste', armL: bracoAte(-1, [350, 1110], K, 420, CHAO, 1.2), armR: bracoAte(1, [490, 1110], K, 420, CHAO, 1.2) }]] },
    { id: 'lua', x: 990, s: 1.15, poses: [[0, { expr: 'preocupado', look: [-5, 0] }]] }],
    frente: (t) => { const x = 420 + (250 - 420) * suave((t - DATAS + 1.6) / 1.6); return divisoria() + caixa(x); }, _x: (t) => { const x = 0; return ''; } },
  // as datas: calendário
  { ini: DATAS, fim: CTRL, cena: 'vazio', visual: NOITE, cam: [[DATAS, 560, 520, 2.0], [CTRL, 600, 500, 2.4, 6]], fundo: (t) => quarto(t) },
  // o controle que anda sozinho
  { ini: CTRL, fim: ASSOPRA, cena: 'vazio', visual: NOITE, cam: [[CTRL, 620, 1060, 1.0], [ASSOPRA, 680, 1040, 1.08, 6]], fundo: (t) => quarto(t), atores: [kauaCom(CTRL, { expr: 'preocupado', look: [6, -2] })], frente: ctrlFrente() },
  { ini: ASSOPRA, fim: FITA, cena: 'vazio', visual: NOITE, cam: [[ASSOPRA, KX, 860, 2.8]], fundo: (t) => quarto(t), atores: [kauaCom(ASSOPRA, { expr: 'surpreso', mouth: 'o' })], frente: (t) => ctrlFrente()(t) + `<g opacity="${(.5 + .5 * Math.sin(t * 20)).toFixed(2)}">${stroke(`M${KX + 30} 470 Q${KX + 20} 520 ${KX + 40} 560`, '#ffffff', 4)}</g>` },
  { ini: FITA, fim: GELA, cena: 'vazio', visual: NOITE, cam: [[FITA, KX, 1110, 3.0]], fundo: (t) => quarto(t), atores: [kauaCom(FITA, { expr: 'bravo' })], frente: (t) => controle(KX, peitoY(K, KY, KS) + 50, .62, t, { fitaExtra: clamp01((t - FITA) / .7) }) },
  { ini: GELA, fim: FICA, cena: 'vazio', cam: [[GELA, 540, 960, 1.0], [FICA, 540, 940, 1.05, 2]], fundo: (t) => `<rect x="-200" y="-200" width="1480" height="2320" fill="#d7e6ef"/>` + ret(160, 300, 760, 1380, '#f7fbff', 30) + [700, 1050].map((y) => ret(190, y, 700, 16, '#c8d6e0', 4, 0)).join('')
      + ret(260, 560, 260, 120, '#d4473f', 12) + `<path d="M260 600 L520 600" stroke="#fff" stroke-width="6" stroke-dasharray="12 10"/>` + controle(700, 620, .9, t, { gelado: true }) + ret(240, 880, 160, 160, '#f2e6c8', 10) + ret(560, 900, 120, 140, '#9fd17a', 10) },
  { ini: FICA, fim: GRUPO, cena: 'vazio', visual: NOITE, cam: [[FICA, 620, 1060, 1.0], [GRUPO, 600, 1000, 1.12, 6]], fundo: (t) => quarto(t), atores: [kauaCom(FICA, { expr: 'bravo', look: [6, -2] }, { dyn: (t) => (t > I(11) && t < E(11) ? { head: Math.sin(t * 25) * 3 } : {}) })], frente: (t) => controle(KX + (t > I(11) && t < E(11) ? Math.sin(t * 30) * 8 : 0), peitoY(K, KY, KS) + 50, .62, t, { gelado: true, fitaExtra: 1 }) },
  // o grupo
  { ini: GRUPO, fim: REGRA, cena: 'vazio', cheia: true, cam: [[GRUPO, 540, 960, 1], [REGRA, 540, 940, 1.05, 16]], fundo: (t) => chat(t, 'RESENHA 19/11 🎮', '#5a3fb0', [
    { t: GRUPO + 1.6, quem: 'Léo', texto: '🧾 comprei ✅ ULTIMATE' }, { t: GRUPO + 3.0, quem: 'Rafa', texto: '✅' }, { t: GRUPO + 4.2, quem: 'Pedrão', texto: '✅ garantido' },
    { t: GRUPO + 6.0, quem: 'Léo', texto: 'noite do lançamento aqui em casa 🍕 cada um traz seu controle' }, { t: GRUPO + 9.5, quem: 'Pedrão', texto: 'o do Kauã joga sozinho kkkkk' }]) },
  // a regra e o salgadinho
  { ini: REGRA, fim: MAE, cena: 'vazio', visual: NOITE, cam: [[REGRA, 640, 1000, 1.6], [MAE, 600, 1020, 1.4, 8]], fundo: (t) => quarto(t), atores: [kauaCom(REGRA, { expr: 'cansado', look: [8, 2] })], frente: ctrlFrente() },
  // a mãe
  { ini: MAE, fim: CONTA, cena: 'vazio', visual: NOITE, cam: [[MAE, 640, 1040, 1.0], [I(18), 560, 1000, 1.2, 2]], fundo: (t) => quarto(t, { porta: clamp01((t - MAE) / .5) }), atores: [kauaCom(MAE, { expr: 'surpreso', look: [8, 0] }, { poses: [[0, { ...maosNoControle(K, KX, KY, KS, [KX, peitoY(K, KY, KS) + 40]), expr: 'surpreso', look: [8, 0] }], [E(16), { expr: 'forcado', look: [8, 0] }], [I(18), { expr: 'triste', look: [0, 5] }]] })],
    frente: (t) => { const q = clamp01((t - I(18) + .7) / .5); return ctrlFrente()(t) + (q < 1 ? `<g opacity="${(1 - q).toFixed(3)}">${maeComMarmita(900, t, clamp01((t - MAE - .3) / .6))}</g>` : '') + (q > 0 ? `<g opacity="${q.toFixed(3)}">${ret(KX - 80, peitoY(K, KY, KS) + 120, 160, 90, '#d4473f', 10)}</g>` : ''); } },
  // a conta
  { ini: CONTA, fim: FICA2, cena: 'vazio', cheia: true, cam: [[CONTA, 540, 960, 1], [FICA2, 540, 900, 1.12, 8]], fundo: (t) => telaCalc(t, CONTA + .4) },
  // fica comigo
  { ini: FICA2, fim: MARCA, cena: 'vazio', visual: NOITE, sombra: false, cam: [[FICA2, KX, 1060, 1.25], [MARCA, KX, 1000, 1.45, 6]], fundo: () => camaDeCima(), atores: [kauaCom(FICA2, { expr: 'cansado', look: [0, -6], head: 0 })], frente: (t) => ctrlFrente()(t) + cobertor() },
  // a marcação e a mentira
  { ini: MARCA, fim: BICOS, cena: 'vazio', cheia: true, cam: [[MARCA, 540, 960, 1], [BICOS, 540, 990, 1.06, 11]], fundo: (t) => chat(t, 'RESENHA 19/11 🎮', '#5a3fb0', [
    { t: MARCA, quem: 'Pedrão', texto: 'o do Kauã joga sozinho kkkkk' }, { t: MARCA + 1.0, quem: 'Léo', texto: '@Kauã e tu? garantiu?' },
    { t: MARCA + 3.6, quem: 'Pedrão', texto: 'tá digitando faz 3 min kkkk' }, { t: MARCA + 5.2, minha: true, texto: 'já garanti 😎' }, { t: MARCA + 6.2, quem: 'Léo', texto: 'BRABOOO 🔥' }],
    t > MARCA + 1.6 && t < MARCA + 5.2 ? digitando(t, MARCA + 1.6) : '') },
  // os bicos
  { ini: BICOS, fim: VOTO, cena: 'vazio', cheia: true, cam: [[BICOS, 540, 960, 1], [I(25), 540, 1000, 1.04, 2], [VOTO, 540, 1140, 1.12, 2.5]], fundo: (t) => telaBicos(t, BICOS) },
  // votação e fim
  { ini: VOTO, fim: FIM, cena: 'vazio', cheia: true, cam: [[VOTO, 540, 960, 1], [FIM, 540, 940, 1.04, 6]], fundo: (t) => `<rect x="-200" y="-200" width="1480" height="2320" fill="#1c1f29"/>` + [0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${(540 + Math.sin(t * .7 + i * 1.7) * 420).toFixed(1)}" cy="${(960 + Math.cos(t * .5 + i * 2.3) * 700).toFixed(1)}" r="${160 + i * 30}" fill="${i % 2 ? '#ff9a3a' : '#4aa8ff'}" opacity=".09"/>`).join('') },
  { ini: FIM, fim: FIM_DO_EP, cena: 'vazio', cheia: true, cam: [[FIM, 540, 960, 1], [FIM_DO_EP, 540, 1040, 1.12, 1]], fundo: (t) => telaEscolha(t), frente: (t) => maoPolegar(540 + Math.sin(t * 7) * 60, 1500 - Math.sin(t * 3) * 10) },
];

// Câmera em deriva contínua: do primeiro ao último enquadramento de cada plano, em passos de 0,5 s,
// para nenhum trecho ficar parado. Se o plano não tinha movimento, ganha uma aproximação de 6%.
for (const pl of dia01Planos) {
  const a = pl.cam[0], b = pl.cam[pl.cam.length - 1];
  const fim = [b[1], b[2], b[3] === a[3] && b[1] === a[1] && b[2] === a[2] ? a[3] * 1.06 : b[3]];
  const n = Math.max(2, Math.ceil((pl.fim - pl.ini) / .5)), cam = [];
  for (let i = 0; i <= n; i++) { const q = i / n; cam.push([pl.ini + (pl.fim - pl.ini) * q, a[1] + (fim[0] - a[1]) * q, a[2] + (fim[1] - a[2]) * q, a[3] + (fim[2] - a[3]) * q, (pl.fim - pl.ini) / n]); }
  pl.cam = cam;
}

/* ---------- telas sobre a imagem ---------- */
const relogio = 'GTA 6 EM 6 DIAS';
const dia01Telas = [
  // HUD: relógio e barra, fora das telas cheias e do voto
  { ini: 0, fim: VOTO, desenha: (p, s, u) => {
    const t = s; if (dia01Planos.some((pl) => pl.cheia && t >= pl.ini && t < pl.fim)) return;
    const g = u.g; g.globalAlpha = Math.min(1, t / .2);
    g.font = '900 34px Arial Black, Arial, sans-serif'; const w = g.measureText('⏰ ' + relogio).width;
    u.cartao(24, 60, w + 60, 74, 'rgba(28,31,41,.9)'); u.texto('⏰ ' + relogio, 54, 110, 34, '#ffd83a', 'left');
    u.cartao(560, 60, 496, 74, 'rgba(28,31,41,.9)'); g.fillStyle = '#3a3d48'; g.fillRect(586, 112, 444, 12); g.fillStyle = '#5fd0a8'; g.fillRect(586, 112, Math.max(6, 444 * 3.2 / 449.9), 12);
    u.texto('R$ 3,20 DE R$ 449,90', 808, 92, 28, '#ffffff'); g.globalAlpha = 1; } },
  // cartão da regra do grupo nº 1
  { ini: REGRA, fim: REGRA + 4.2, desenha: (p, s, u) => { const g = u.g; g.globalAlpha = Math.min(1, s / .25, (4.2 - s) / .25);
    u.cartao(90, 1180, 900, 230, '#fff6e6'); u.texto('REGRA DO GRUPO Nº 1', 540, 1250, 46, '#5a3fb0'); u.texto('"Quem não tem o jogo', 540, 1320, 40, '#2a1f22'); u.texto('leva o salgadinho."', 540, 1372, 40, '#2a1f22'); g.globalAlpha = 1; } },
  // votação: as opções só na tela, sem legenda, e "Vocês decidem"
  { ini: VOTO, fim: FIM, desenha: (p, s, u) => {
    const g = u.g; g.globalAlpha = u.sai(s / .35);
    u.texto('QUE BICO O KAUÃ PEGA?', 540, 330, 64, '#ffffff');
    const opcao = (y, cor, grande, l1, l2, tinta, fase) => { const k = 1 + Math.sin(s * 4 + fase) * .025; g.save(); g.translate(540, y + 150); g.scale(k, k); g.translate(-540, -(y + 150)); u.cartao(110, y, 860, 300, cor); u.texto(grande, 540, y + 110, 96, tinta); u.texto(l1, 540, y + 192, 34, tinta); u.texto(l2, 540, y + 240, 34, tinta); g.restore(); };
    opcao(470, '#ff9a3a', 'FANTASIA', 'Mascote de celular. R$ 80/dia, 34 °C.', 'Ninguém pode ver o rosto.', '#3a1a02', 0);
    opcao(840, '#4aa8ff', 'CACHORROS', 'R$ 15 por cachorro.', 'Ele tem medo de cachorro.', '#062a4a', Math.PI);
    g.save(); const kd = 1 + Math.sin(s * 5) * .04; g.translate(540, 1290); g.scale(kd, kd); g.translate(-540, -1290); u.texto('VOCÊS DECIDEM.', 540, 1290, 70, '#ffd83a'); g.restore();
    if (typeof SerieVisual !== 'undefined' && SerieVisual.seta) { SerieVisual.seta(g, 52, 560, s); SerieVisual.seta(g, 52, 930, s); }
    g.globalAlpha = 1; } },
];

const EPISODIO = {
  duracao: FIM_DO_EP,
  falas: FALAS,
  planos: dia01Planos,
  telas: dia01Telas,
  visual: NOITE,
  sombra: { parede: false },
  latidos: [],
  impactos: [],
  // legenda some na votação (as opções já estão na tela) e nos planos sem fala
  destaques: { 1: 'vinte', 2: 'emoji', 4: 'PDF', 5: 'dono', 6: 'futuro', 7: 'e-mail', 8: 'dezenove', 9: 'esquerda', 10: 'geladeira', 11: 'parado', 12: 'sugere', 14: 'controle', 15: 'salgadinho', 16: 'marmita', 18: 'nenhum', 19: 'empregado', 20: 'comigo', 22: 'verdade', 24: 'oitenta', 25: 'cachorro', 26: 'medo' },
};
