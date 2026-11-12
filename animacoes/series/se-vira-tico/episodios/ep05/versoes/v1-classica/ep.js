'use strict';
ESTILO_RIG = 'classico'; // fixado na Oca Studio (2026-11-12): episódio feito com o rig clássico
// Episódio 5: Dá Tempo? Planos, poses e telas. Falas e tempos vêm de falas.js e tempos.js.
const sai = (p) => { p = Math.max(0, Math.min(1, p)); return 1 - (1 - p) * (1 - p); };
const suave = (p) => { p = Math.max(0, Math.min(1, p)); return p * p * (3 - 2 * p); };
const clamp01 = (p) => Math.max(0, Math.min(1, p));
const F = Object.fromEntries(FALAS.map((f) => [f.n, f]));
const I = (n) => F[n].ini, E = (n) => F[n].fim;
const FIM_DO_EP = 65.1;
const NOITE = { ambiente: 'noite', lado: 'direita' };
const SEM_COR = () => .1; // filtro de lembrança dos episódios anteriores

/* ---------- medidas do rig ---------- */
const raizLocal = (d) => -(10 + d.thigh + d.shin + SHOE_H[d.shoe]);
const cabecaLocal = (d) => raizLocal(d) - d.torso - d.neck - 73 * d.hs;
const yParaCabeca = (d, s, alvo) => alvo - s * cabecaLocal(d);
const cabecaY = (d, y, s) => y + s * cabecaLocal(d);
const pescocoY = (d, y, s) => y + s * (raizLocal(d) - d.torso);
function ombroDe(lado, d, x, y, s) { return [x + s * lado * (d.sw - d.ru * .62), y + s * (raizLocal(d) - d.torso + d.ru * 1.05)]; }
function bracoAte(lado, alvo, d, x, y, s) {
  const [ox, oy] = ombroDe(lado, d, x, y, s);
  const a = d.armU * s, b = d.armF * s, dx = alvo[0] - ox, dy = alvo[1] - oy, dist = Math.min(a + b - 2, Math.hypot(dx, dy));
  const base = Math.atan2(dx, dy) * 180 / Math.PI, abre = Math.acos(clamp01((a * a + dist * dist - b * b) / (2 * a * dist))) * 180 / Math.PI;
  const curva = Math.acos(clamp01((a * a + b * b - dist * dist) / (2 * a * b))) * 180 / Math.PI;
  const up = base - lado * abre;
  return [up, up + lado * (180 - curva)];
}
const mao = (d, p, s, r = 1) => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${(d.rw * 1.75 * s * r).toFixed(1)}" fill="${d.skin}" stroke="${OUT}" stroke-width="3.2"/>`;
const passo = (t, ritmo, amp = 1) => { const f = Math.sin(t * ritmo * Math.PI); return { liftL: Math.max(0, f) * amp, liftR: Math.max(0, -f) * amp }; };

/* ---------- telas ---------- */
function quebra(texto, max) {
  const linhas = []; let a = '';
  for (const w of texto.split(' ')) { if (a && (a + ' ' + w).length > max) { linhas.push(a); a = w; } else a = a ? a + ' ' + w : w; }
  if (a) linhas.push(a);
  return linhas;
}
const moldura = (conteudo) => `<rect x="-200" y="-200" width="1480" height="2320" fill="#1c2a45"/>` + ret(190, 110, 700, 1500, '#23252f', 60) + ret(220, 170, 640, 1380, '#efe8dc', 18, 0) + conteudo;
const cabecalho = (nome, cor = '#2f8f4e') => ret(220, 170, 640, 140, cor, 18, 0) + `<circle cx="300" cy="240" r="40" fill="${nome === 'Lua' ? '#e9b18b' : nome === 'Jão' ? '#805039' : '#d59a6e'}" stroke="#fff" stroke-width="4"/>` + txt(370, 258, nome, 46, '#fff', 'start');
const balao = (texto, enviado, y, tam = 44, larg = 540) => {
  const linhas = quebra(texto, 20), h = 40 + linhas.length * tam * 1.25, x = enviado ? 860 - 30 - larg : 250;
  return ret(x, y, larg, h, enviado ? '#d9f2c8' : '#ffffff', 26, 2) + linhas.map((l, i) => txt(x + 28, y + 30 + tam + i * tam * 1.25 - tam * .2, l, tam, '#2a1f22', 'start')).join('');
};
const appCard = (titulo, corpo, cor = '#2a4f8a') => moldura(ret(220, 170, 640, 140, cor, 18, 0) + txt(540, 262, titulo, 48, '#fff') + corpo);
const telaEntrega = () => appCard('Doces da Lua', ret(260, 470, 560, 520, '#fff6e6', 26, 3) + txt(540, 580, 'Entrega combinada', 44) + txt(540, 720, 'R$ 20', 120, '#1f9e33') + txt(540, 840, '6 caixas · sábado, 20h', 34, '#55606c'), '#c23b3b');
const telaGanhos = (t, t0) => {
  const q = sai((t - t0 - .9) / .4);
  return appCard('Ganhos hoje', ret(260, 420, 560, 420, '#fff6e6', 26, 3) + txt(540, 520, 'Corridas: R$ 142', 42, '#1f9e33') + txt(540, 600, 'Gasolina: R$ 58', 42, '#c23b3b') + txt(540, 680, 'Diária: R$ 0', 42, '#55606c') + txt(540, 780, 'Sobrou: R$ 84', 48)
    + `<g opacity="${q.toFixed(2)}" transform="translate(0 ${(60 * (1 - q)).toFixed(1)})">` + ret(250, 920, 580, 150, '#ffffff', 26, 3) + txt(280, 975, 'Jão', 34, '#805039', 'start') + txt(280, 1035, 'Quanto sobrou?', 42, '#2a1f22', 'start') + '</g>');
};
const telaAgenda = () => ret(560, 1010, 340, 90, '#2a4f8a', 18, 3) + txt(730, 1050, 'Corrida agendada', 24, '#fff') + txt(730, 1085, '18h30', 30, '#ffd83a');
const telaResposta = (t0, t1) => (t) => {
  const q = clamp01((t - t0) / (t1 - t0));
  const apagando = q < .45, rascunho = 'tô chegando'.slice(0, Math.max(0, Math.round(11 * (1 - q / .45))));
  return moldura(cabecalho('Lua') + balao('Você chega até as oito? Senão eu chamo outra entrega.', false, 360, 36)
    + (apagando ? ret(240, 1040, 600, 76, '#fff', 38, 2) + txt(270, 1090, rascunho + (Math.floor(t * 3) % 2 ? '|' : ''), 32, '#2a1f22', 'start')
      : `<g opacity="${sai((q - .5) / .2).toFixed(2)}">` + balao('Tô a 34 min. Mas eu chego.', true, 640, 44) + txt(800, 830, '✓✓', 32, '#3b8fd6', 'end') + '</g>'));
};
const telaOutraEntrega = (t0) => (t) => {
  const q = sai((t - t0) / .5);
  return appCard('Entregas', ret(260, 430, 560, 420, '#fff6e6', 26, 3) + txt(540, 530, '6 caixas', 50) + txt(540, 610, 'Conjunto → Festa', 36, '#55606c') + txt(540, 690, '19h41', 44, '#c23b3b')
    + ret(300, 940, 480, 120, '#1f9e33', 30, 4) + txt(540, 1015, 'Chamar outra entrega', 36, '#fff')
    + `<circle cx="${(560 + 20 * (1 - q)).toFixed(1)}" cy="${(1150 - 80 * q).toFixed(1)}" r="70" fill="${CHARS.lua.skin}" stroke="${OUT}" stroke-width="6"/>`);
};
const telaInscricao = (t0, clique) => (t) => {
  const premido = t > clique, cx = 540 + 220 * (1 - suave((t - t0) / (clique - t0 - .1))), cy = 1100 + 150 * (1 - suave((t - t0) / (clique - t0 - .1)));
  
  let s = `<rect x="-300" y="-300" width="1680" height="2520" fill="#3b3f4a"/>` + ret(80, 300, 920, 1100, '#f7f4ef', 20, 6) + ret(80, 300, 920, 90, '#2a4f8a', 20, 0)
    + txt(540, 360, 'Escola de Confeitaria', 40, '#fff') + txt(940, 360, '19:00', 30, '#ffd83a', 'end')
    + txt(140, 500, 'Inscrição', 60, OUT, 'start') + txt(140, 580, 'Curso de Confeitaria', 44, '#2a4f8a', 'start') + txt(140, 640, 'Porto Alegre, RS', 40, '#55606c', 'start')
    + ret(140, 700, 800, 70, '#fff', 10, 3) + txt(165, 748, 'Nome: Luana M.', 34, '#2a1f22', 'start')
    + ret(140, 800, 800, 70, '#fff', 10, 3) + txt(165, 848, 'Por que confeitaria? A vó.', 34, '#2a1f22', 'start');
  // O botão "Enviar" se transforma em "Inscrição enviada" em 0,4 s
  const q = suave((t - clique - .1) / .4), w = 400 + 160 * q;
  s += ret(540 - w / 2, 960, w, 130, q > 0 ? '#1f9e33' : premido ? '#155f8c' : '#3b8fd6', 30, 4)
    + `<g opacity="${(1 - q).toFixed(2)}">` + txt(540, 1040, 'Enviar', 54, '#fff') + '</g>' + `<g opacity="${q.toFixed(2)}">` + txt(540, 1040, 'Inscrição enviada', 44, '#fff') + '</g>';
  s += `<path transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${premido ? .9 : 1})" d="M0 0 L0 64 L16 50 L28 76 L40 70 L28 46 L48 46Z" fill="#fff" stroke="${OUT}" stroke-width="4"/>`;
  return s;
};

/* ---------- o caderno da avó ---------- */
const paginaCaderno = (t, t0, linhas, destaque, toca) => {
  let s = `<rect x="-200" y="-200" width="1480" height="2320" fill="#6b4a36"/>` + `<g transform="rotate(-3 540 960)">`
    + ret(90, 420, 900, 1080, '#c9774f', 18, 5) + ret(120, 440, 410, 1040, '#f4e7c9', 6, 3) + ret(550, 440, 410, 1040, '#f4e7c9', 6, 3) + stroke('M540 440 V1480', '#a26a4a', 8);
  for (let i = 0; i < 16; i++) s += stroke(`M140 ${520 + i * 58} H510 M570 ${520 + i * 58} H940`, '#d8c7a4', 2);
  s += txt(320, 600, 'Pão de mel', 40, '#7a3f1f', 'middle', -2);
  s += linhas.map((l, i) => `<text x="575" y="${560 + i * 116}" textLength="${Math.min(370, l.length * (i ? 17 : 19))}" lengthAdjust="spacingAndGlyphs" font-family="Segoe Script, Comic Sans MS, cursive" font-size="${i ? 34 : 38}" font-weight="${i ? 400 : 700}" fill="#4a3a8a">${esc(l)}</text>`).join('');
  s += `<rect x="565" y="${560 + destaque * 116 - 44}" width="380" height="62" fill="#f2d36b" opacity=".45"/>`;
  return s + '</g>' + (toca != null ? timerSVG(260, 1500, 1.2, toca) : '');
};

/* ---------- o carro (mesmo do ep. 4) ---------- */
const CX = 540, CY = 1660, CK = .95;
const VOL = [CX + CARRO.volante[0] * CK, CY + CARRO.volante[1] * CK];
const MOT = { x: VOL[0], s: 1.0 }; MOT.y = yParaCabeca(CHARS.tico, MOT.s, 820);
const PAS = { x: 370, s: .8 };
const pasY = (id) => yParaCabeca(CHARS[id], PAS.s, 805);
const pegaVolante = (t, aperta = 0) => { const tr = Math.sin(t * 3.1) * 4 + (aperta ? Math.sin(t * 40) * 3 * aperta : 0); return [[VOL[0] - 112 * CK, VOL[1] - 8 + tr], [VOL[0] + 112 * CK, VOL[1] - 8 - tr]]; };
const motorista = (expr, extra = {}) => {
  const d = CHARS.tico;
  return { id: 'tico', x: MOT.x, y: MOT.y, s: MOT.s, char: extra.char,
    dyn: (tt) => { const [aa, bb] = pegaVolante(tt, extra.aperta || 0); return { semPernas: true, armL: bracoAte(-1, aa, d, MOT.x, MOT.y, MOT.s), armR: extra.armR ? extra.armR(tt) : bracoAte(1, bb, d, MOT.x, MOT.y, MOT.s) }; },
    poses: extra.poses || [[0, { expr, head: extra.head || 0, detalhe: extra.detalhe || null }]] };
};
const passageiro = (id, poses, extra = {}) => ({ id, x: PAS.x, y: pasY(id), s: PAS.s, dyn: (t) => ({ semPernas: true, ...(extra.dyn ? extra.dyn(t) : {}) }), poses });
const tom = (tarde) => tarde === 'noite' ? `<rect x="-300" y="-300" width="1680" height="2520" fill="#1a2440" opacity=".38"/>` : tarde ? `<rect x="-300" y="-300" width="1680" height="2520" fill="#f08a3c" opacity=".2"/>` : '';
const ruaCarro = (tarde) => (t) => SerieVisual.rua(t * 1.4, { ambiente: tarde === 'noite' ? 'noite' : 'claro' }) + tom(tarde) + carroSVG(CX, CY + Math.sin(t * 9) * 2, CK, { parte: 'fundo' });
const frenteCarro = (extra = () => '', o = {}) => (t) => {
  const [a, b] = pegaVolante(t, o.aperta || 0), d = CHARS.tico;
  return extra(t) + mao(d, a, MOT.s) + (o.semMaoDir ? '' : mao(d, b, MOT.s)) + carroSVG(CX, CY + Math.sin(t * 9) * 2, CK, {}) + (o.depois ? o.depois(t) : '');
};
const caixinhaPainel = () => caixaDoceSVG(CX - 250 * CK, CY - 612 * CK, .55, '#e8736f');
const carroPlano = (ini, fim, cam, atores, o = {}) => ({ ini, fim, cena: 'vazio', cobrePernas: true, cam, fundo: ruaCarro(o.tarde), atores, frente: frenteCarro(o.extra, { ...o, depois: (t) => (o.caixinha ? caixinhaPainel() : '') + (o.depois ? o.depois(t) : '') }), ...(o.plano || {}) });
const ESPELHO = [220, 330, 640, 260];
const retrovisor = (ini, fim, id, poses, o = {}) => {
  const d = CHARS[id], s = o.s || 1.9, y = yParaCabeca(d, s, o.cab || 470);
  return { ini, fim, cena: 'vazio', cobrePernas: true, cam: o.cam || [[ini, 540, 760, 1.25], [fim, 540, 740, 1.32, fim - ini]], cor: o.cor,
    fundo: () => `<rect x="-300" y="-300" width="1680" height="2520" fill="#3b3f4a"/>` + ret(-200, 300, 1480, 900, '#2c2f38', 0, 0) + ret(80, 620, 300, 260, '#4a4f5c', 40, 3),
    atores: [{ id, x: 540, y, s, flip: true, dyn: () => ({ semPernas: true, ...(o.dyn || {}) }), poses }],
    frente: (t) => { const [x, yy, w, h] = ESPELHO;
      return (o.dentro ? o.dentro(t) : '') + `<defs><clipPath id="foraEspelho"><path clip-rule="evenodd" d="M-300 -300 H1380 V2220 H-300Z M${x} ${yy} h${w} v${h} h${-w}Z"/></clipPath></defs>`
        + `<g clip-path="url(#foraEspelho)">` + SerieVisual.rua(t * 1.4, { ambiente: o.tarde === 'noite' ? 'noite' : 'claro' }) + tom(o.tarde) + `<rect x="-300" y="-300" width="1680" height="330" fill="#262931"/>` + '</g>'
        + `<rect x="${x}" y="${yy}" width="${w}" height="${h}" rx="40" fill="#ffffff" opacity=".07"/>` + ret(x - 14, yy - 14, w + 28, h + 28, 'none', 52, 18) + ret(530, 250, 20, 70, '#262931', 6, 3); } };
};
const malaGigante = () => `<g transform="translate(${PAS.x + 150} 700)">` + ret(-90, 0, 180, 300, '#8a4a6a', 22, 5) + ret(-30, -40, 60, 50, 'none', 14, 8) + stroke('M-60 60 V260 M60 60 V260', '#6b3a52', 6) + ret(-50, 120, 100, 40, '#f2d36b', 6, 3) + '</g>';

/* ---------- a cozinha ---------- */
const BANCADA = 1180;
const cozinha = (ini, fim, cam, atores, o = {}) => ({ ini, fim, cena: o.noite ? 'cozinhaLuaNoite' : 'cozinhaLua', cobrePernas: true, cam, visual: o.noite ? NOITE : undefined, cor: o.cor, atores,
  frente: (t) => bancadaSVG(BANCADA) + (o.caixas === false ? '' : pilhaCaixasSVG(o.caixasX || 250, BANCADA, .9)) + (o.pia ? piaSVG(870, BANCADA, t, o.pia(t)) : '') + (o.extra ? o.extra(t) : '') });
const LUA_K = 380, TICO_K = 720;

/* ---------- Planos ---------- */
const COR = 1.5, TITULO = 12.8, SABADO = 13.8, TROCA = 28.1, CARRO_T = 29.6, APONTA = 31.4, MALA = 34.1, GPS = 36.2, GANHOS = 37.6;
const NOTE = 40.1, CLIQUE = 42.6, FECHA = 43.0, AUDIO = 44.6, MAPA = 49.2, TRANSITO = 50.6, RESPOSTA = 52.1, DECIDE = 53.6, POLEGAR = 54.3;
const VOTO = 55.1, TIMER = 60.1, QUARTO = 61.6, COBRE = 63.4;

const ep05Planos = [
  // Abertura: o fim do ep. 4, os olhos dela no retrovisor, com o filtro de lembrança
  retrovisor(0, COR, 'lua', [[0, { expr: 'triste' }]], { s: 2.4, cab: 520, tarde: true, cor: SEM_COR, cam: [[0, 540, 600, 1.6], [COR, 540, 590, 1.66, COR]] }),
  { ...carroPlano(COR, E(1) + .05, [[COR, MOT.x, 860, 1.6], [E(1), MOT.x, 840, 1.75, E(1) - COR]], [passageiro('lua', [[0, { expr: 'triste' }]]), motorista('envergonhado', { aperta: 1, head: 4 })], { tarde: true, aperta: 1 }), cor: (t) => .1 + .9 * sai((t - COR) / .4) },
  retrovisor(E(1) + .05, I(2) - .1, 'lua', [[0, { expr: 'surpreso' }]], { s: 2.4, cab: 520, tarde: true, cam: [[E(1), 540, 600, 1.6]] }),
  carroPlano(I(2) - .1, E(2) + .1, [[I(2) - .1, PAS.x, 800, 2.0]], [passageiro('lua', [[0, { expr: 'triste', armL: [-30, 60], armR: [30, -60] }]]), motorista('triste')], { tarde: true }),
  carroPlano(E(2) + .1, I(3) - .1, [[E(2) + .1, MOT.x, 820, 1.9]], [passageiro('lua', [[0, { expr: 'triste' }]]), motorista('triste', { head: 8 })], { tarde: true }),
  carroPlano(I(3) - .1, E(3) + .1, [[I(3) - .1, PAS.x, 800, 2.0]], [passageiro('lua', [[0, { expr: 'pensando' }]]), motorista('triste')], { tarde: true }),
  carroPlano(E(3) + .1, E(4) + .05, [[E(3) + .1, MOT.x, 820, 1.9]], [passageiro('lua', [[0, { expr: 'pensando' }]]), motorista('envergonhado')], { tarde: true }),
  carroPlano(E(4) + .05, TITULO, [[E(4) + .05, 540, 900, 1.25], [TITULO, 540, 880, 1.32, TITULO - E(4)]],
    [passageiro('lua', [[0, { expr: 'rindo' }]], { dyn: () => ({ armR: bracoAte(1, [PAS.x + 20, cabecaY(CHARS.lua, pasY('lua'), PAS.s) + 50], CHARS.lua, PAS.x, pasY('lua'), PAS.s), frente: 'R' }) }), motorista('feliz')], { tarde: true }),
  { ini: TITULO, fim: SABADO, cena: 'vazio', cam: [[TITULO, 540, 960, 1], [SABADO, 540, 945, 1.03, 1]], fundo: () => SerieVisual.abertura({ linha1: 'DÁ TEMPO?', linha2: '' }) },
  // Sábado, 14h: seis caixas
  { ...cozinha(SABADO, I(5) - .1, [[SABADO, 560, 1060, 1.6], [I(5), 560, 1040, 1.7, I(5) - SABADO]], [], { caixasX: 560 }), cartaz: 'Sábado, 14h' },
  cozinha(I(5) - .1, E(5) + .1, [[I(5) - .1, 560, 900, 1.2]],
    [{ id: 'lua', x: LUA_K, dyn: (t) => ({ armR: bracoAte(1, [470 + Math.sin(t * 5) * 10, BANCADA - 110], CHARS.lua, LUA_K, CHAO, 1.32) }), poses: [[0, { expr: 'envergonhado' }]] }, { id: 'tico', x: TICO_K, poses: [[0, { expr: 'feliz' }]] }], { caixasX: 560 }),
  cozinha(E(5) + .1, E(6) + .1, [[E(5) + .1, TICO_K, 800, 1.8]], [{ id: 'tico', x: TICO_K, poses: [[0, { expr: 'feliz', armL: [-100, -120] }]] }], { caixasX: 560 }),
  cozinha(E(6) + .1, E(7) + .1, [[E(6) + .1, 620, 900, 1.15]],
    [{ id: 'lua', x: LUA_K, poses: [[0, { expr: 'cansado', head: 8 }]] }, { id: 'tico', x: TICO_K, poses: [[0, { expr: 'surpreso' }]] }], { caixasX: 160, pia: (t) => clamp01((t - I(7) - .8) / .3) * (1 - clamp01((t - I(7) - 1.6) / .4)) }),
  cozinha(E(7) + .1, E(8) + .1, [[E(7) + .1, TICO_K, 800, 1.8]], [{ id: 'tico', x: TICO_K, poses: [[0, { expr: 'forcado', lean: -3 }]] }],
    { caixasX: 560, extra: (t) => t > I(8) + .3 ? `<g opacity="${suave((t - I(8) - .3) / .7).toFixed(2)}" transform="translate(0 ${(40 * (1 - suave((t - I(8) - .3) / .7))).toFixed(1)})">` + telaAgenda() + '</g>' : '' }),
  cozinha(E(8) + .1, E(9) + .1, [[E(8) + .1, LUA_K, 800, 1.8]], [{ id: 'lua', x: LUA_K, poses: [[0, { expr: 'neutro' }]] }], { caixasX: 560 }),
  cozinha(E(9) + .1, E(10) + .1, [[E(9) + .1, TICO_K, 800, 1.8]], [{ id: 'tico', x: TICO_K, dyn: (t) => ({ armR: [60 + Math.sin(t * 14) * 18, 150] }), poses: [[0, { expr: 'feliz' }]] }], { caixasX: 560 }),
  cozinha(E(10) + .1, TROCA, [[E(10) + .1, LUA_K, 800, 1.8]], [{ id: 'lua', x: LUA_K, poses: [[0, { expr: 'lado' }]] }], { caixasX: 560 }),
  { ini: TROCA, fim: CARRO_T, cena: 'vazio', cheia: true, cam: [[TROCA, 540, 960, 1], [CARRO_T, 540, 930, 1.06, CARRO_T - TROCA]], fundo: telaEntrega },
  // A mesma tarde, no carro
  carroPlano(CARRO_T, I(12) - .1, [[CARRO_T, 540, 1000, 1.05]], [passageiro('vendedor', [[0, { expr: 'pensando', head: -8 }]]), motorista('feliz')], { caixinha: true }),
  retrovisor(I(12) - .1, APONTA, 'vendedor', [[0, { expr: 'aliviado' }]], { s: 2.2, cab: 520 }),
  carroPlano(APONTA, I(13) - .1, [[APONTA, 540, 1000, 1.05]], [passageiro('vendedor', [[0, { expr: 'feliz', armR: [-60, -110] }]]), motorista('feliz', { armR: () => bracoAte(1, [MOT.x + 30, pescocoY(CHARS.tico, MOT.y, 1) + 10], CHARS.tico, MOT.x, MOT.y, 1) })], { caixinha: true, semMaoDir: true }),
  carroPlano(I(13) - .1, MALA, [[I(13) - .1, MOT.x, 820, 1.9]], [motorista('envergonhado', { armR: () => [150, 230] })],
    { caixinha: true, semMaoDir: true, extra: () => ret(MOT.x + 90, 640, 120, 74, '#fff6e6', 6, 3) + txt(MOT.x + 150, 672, 'Doces', 20, '#c23b3b') + txt(MOT.x + 150, 698, 'da Lua', 20, '#c23b3b') }),
  carroPlano(MALA, I(14) - .1, [[MALA, 540, 1000, 1.05]], [passageiro('leticia', [[0, { expr: 'feliz', propR: 'phone', armR: [18, 150] }]]), motorista('surpreso')], { caixinha: true, extra: malaGigante }),
  retrovisor(I(14) - .1, GPS, 'leticia', [[0, { expr: 'feliz' }]], { s: 2.2, cab: 520 }),
  { ini: GPS, fim: GANHOS, cena: 'vazio', cheia: true, cam: [[GPS, 540, 960, 1], [GANHOS, 540, 960, 1.06, GANHOS - GPS]],
    fundo: (t) => SerieVisual.gps({ pontos: [[.5, 1], [.5, .6], [.9, .4], [1, .05]], progresso: .1 + .15 * sai((t - GPS) / 1.4), hora: '17:52', prazo: 'Destino: 38 km · chegada 19h05' }) },
  { ini: GANHOS, fim: NOTE, cena: 'vazio', cheia: true, cam: [[GANHOS, 540, 960, 1], [NOTE, 540, 930, 1.07, NOTE - GANHOS]], fundo: (t) => telaGanhos(t, GANHOS) },
  // 19h: a inscrição
  { ini: NOTE, fim: FECHA, cena: 'vazio', cheia: true, cam: [[NOTE, 540, 900, 1.05], [FECHA, 540, 960, 1.15, FECHA - NOTE]], fundo: telaInscricao(NOTE, CLIQUE) },
  cozinha(FECHA, AUDIO, [[FECHA, LUA_K + 60, 900, 1.6]], [{ id: 'lua', x: LUA_K, poses: [[0, { expr: 'aliviado' }]] }],
    { noite: true, caixasX: 120, extra: (t) => notebookSVG(LUA_K + 80, BANCADA, 1, 1 - suave((t - FECHA - .3) / 1.0), ret(-160, -230, 320, 200, '#1f9e33', 4, 0)) }),
  // 19h40: dá tempo?
  cozinha(AUDIO, I(15) - .1, [[AUDIO, 520, 920, 1.2], [I(15), 470, 860, 1.45, I(15) - AUDIO]], [{ id: 'lua', x: LUA_K, dyn: (t) => ({ head: Math.sin((t - AUDIO) * 4) * 5 }), poses: [[0, { expr: 'preocupado', armR: [18, 150], propR: 'phone' }]] }], { noite: true, caixasX: 700 }),
  cozinha(I(15) - .1, MAPA, [[I(15) - .1, LUA_K, 800, 1.8]], [{ id: 'lua', x: LUA_K, poses: [[0, { expr: 'preocupado', armR: [18, 150], propR: 'phone' }]] }], { noite: true, caixasX: 700 }),
  { ini: MAPA, fim: TRANSITO, cena: 'vazio', cheia: true, cam: [[MAPA, 540, 960, 1], [TRANSITO, 540, 960, 1.06, TRANSITO - MAPA]],
    fundo: () => SerieVisual.gps({ pontos: [[1, .05], [.9, .4], [.5, .6], [.5, 1]], progresso: .2, hora: '19:40', prazo: '34 min até a Lua' }) },
  carroPlano(TRANSITO, RESPOSTA, [[TRANSITO, MOT.x, 840, 1.7]], [passageiro('leticia', [[0, { expr: 'rindo', propR: 'phone', armR: [18, 150] }]]), motorista('preocupado', { detalhe: 'suor' })], { tarde: 'noite', caixinha: true }),
  { ini: RESPOSTA, fim: DECIDE, cena: 'vazio', cheia: true, cam: [[RESPOSTA, 540, 960, 1], [DECIDE, 540, 930, 1.06, DECIDE - RESPOSTA]], fundo: telaResposta(RESPOSTA, DECIDE) },
  cozinha(DECIDE, POLEGAR, [[DECIDE, LUA_K, 800, 1.85]], [{ id: 'lua', x: LUA_K, poses: [[0, { expr: 'pensando', armR: [18, 150], propR: 'phone' }]] }], { noite: true, caixasX: 700 }),
  { ini: POLEGAR, fim: VOTO, cena: 'vazio', cheia: true, cam: [[POLEGAR, 540, 960, 1], [VOTO, 540, 1000, 1.1, VOTO - POLEGAR]], fundo: telaOutraEntrega(POLEGAR) },
  // Votação: a Lua decide, em preto e branco
  cozinha(VOTO, TIMER, [[VOTO, LUA_K, 640, 1.15], [TIMER, LUA_K + 40, 600, 1.32, TIMER - VOTO]], [{ id: 'lua', x: LUA_K, dyn: (t) => ({ head: Math.sin((t - VOTO) * 1.6) * 4 }), poses: [[0, { expr: 'pensando', armR: [18, 150], propR: 'phone' }]] }], { noite: true, caixasX: 700, cor: () => 0 }),
  // Retorno: a massa descansa, ela não
  { ini: TIMER, fim: QUARTO, cena: 'vazio', cam: [[TIMER, 600, 1000, 1.05], [QUARTO, 620, 1060, 1.15, QUARTO - TIMER]],
    fundo: (t) => paginaCaderno(t, TIMER, ['Pão de mel da vó', '2 xícaras de farinha', '1 de mel', '1 de leite', 'Descansar a massa.'], 4, t - TIMER) },
  { ini: QUARTO, fim: COBRE, cena: 'quartoLuaCama', visual: NOITE, cam: [[QUARTO, 600, 1000, 1.05]],
    frente: (t) => { const q = suave((t - QUARTO) / 1.4), x = 330 + 470 * q, y = 1120 + 140 * q; return potePoteSVG(x, y) + (q < .95 ? mao(CHARS.lua, [x - 60, y + 10], 1.32) + mao(CHARS.lua, [x + 60, y + 10], 1.32) : ''); },
    atores: [{ id: 'lua', xF: (t) => 300 + 320 * suave((t - QUARTO) / 1.4), dyn: (t) => { const q = suave((t - QUARTO) / 1.4), x = 300 + 320 * q, px = 330 + 470 * q, py = 1120 + 140 * q;
      return { ...passo(t, 2.6, q < .98 ? .6 : 0), armL: bracoAte(-1, [px - 60, py + 10], CHARS.lua, x, CHAO, 1.32), armR: bracoAte(1, [px + 60, py + 10], CHARS.lua, x, CHAO, 1.32) }; }, poses: [[0, { expr: 'pensando' }]] }] },
  { ini: COBRE, fim: FIM_DO_EP, cena: 'quartoLuaCama', visual: NOITE, cam: [[COBRE, 720, 1120, 1.35], [FIM_DO_EP, 720, 1100, 1.48, FIM_DO_EP - COBRE]],
    frente: (t) => potePoteSVG(800, 1260) + cobertorSVG(800, 1300, suave((t - COBRE - .2) / .9)),
    atores: [{ id: 'lua', x: 560, dyn: (t) => { const q = suave((t - COBRE - .2) / .9); return q < 1 ? { armR: bracoAte(1, [700 + 60 * q, 1190 + 60 * q], CHARS.lua, 560, CHAO, 1.32) } : {}; }, poses: [[0, { expr: 'pensando' }], [COBRE + 1.2, { expr: 'aliviado' }]] }] },
];
function potePoteSVG(x, y) { return `<g transform="translate(${x} ${y})">` + shape('M-80 -60 L80 -60 L66 40 Q0 60 -66 40Z', '#e9f2f8') + `<path d="M-74 -60 Q0 -110 74 -60Z" fill="#f2d39b" stroke="${OUT}" stroke-width="3"/>` + ret(-86, -70, 172, 18, '#c7cbd0', 8, 3) + '</g>'; }
function cobertorSVG(x, y, q) {
  if (q <= 0) return '';
  const w = 160 + 140 * q, top = y - 60 - 70 * q;
  return `<path d="M${x - w} ${y + 40} Q${x - w * .9} ${top + 40} ${x - 40} ${top} Q${x} ${top - 20} ${x + 40} ${top} Q${x + w * .9} ${top + 40} ${x + w} ${y + 40}Z" fill="#4f7f9e" stroke="${OUT}" stroke-width="4" opacity="${Math.min(1, q * 3).toFixed(2)}"/>`
    + [-1, 0, 1].map((i) => stroke(`M${x + i * w * .5} ${top + 30} Q${x + i * w * .55} ${y} ${x + i * w * .6} ${y + 30}`, '#355a73', 4)).join('');
}

/* ---------- Telas sobre a imagem ---------- */
const bordasEscuras = (p, s, u) => { const v = u.g.createRadialGradient(540, 860, 420, 540, 960, 1120); v.addColorStop(0, 'rgba(20,20,20,0)'); v.addColorStop(1, 'rgba(20,20,20,.62)'); u.g.fillStyle = v; u.g.fillRect(0, 0, 1080, 1920); };
const ep05Telas = [
  { ini: 0, fim: COR + .4, desenha: (p, s, u) => { u.g.globalAlpha = 1 - sai((s - COR) / .4); bordasEscuras(p, s, u); u.g.globalAlpha = 1; } },
  ...ep05Planos.filter((pl) => pl.cartaz).map((pl) => ({ ini: pl.ini, fim: pl.fim, desenha: (p, s, u) => { u.g.globalAlpha = Math.min(1, s / .2); u.cartao(640, 230, 410, 100, '#2a1f22'); u.texto(pl.cartaz, 845, 282, 48, '#ffd83a'); u.g.globalAlpha = 1; } })),
  { ini: I(15) - .1, fim: I(15) + 1.4, desenha: (p, s, u) => { u.g.globalAlpha = Math.min(1, s / .3, (1.5 - s) / .3); u.cartao(130, 260, 820, 110, '#2f8f4e'); u.texto('Lua: áudio 0:04', 540, 315, 46, '#ffffff'); u.g.globalAlpha = 1; } },
  { ini: VOTO, fim: TIMER, desenha: (p, s, u) => {
    const g = u.g; g.globalAlpha = u.sai(s / .35);
    g.fillStyle = '#1c1f29'; g.fillRect(0, 0, 1080, 860);
    u.texto('QUAL VAI SER, LUA?', 540, 140, 62, '#ffffff');
    u.texto('Comente CONFIA ou OUTRO MOTORISTA', 540, 210, 32, '#d9d9d9');
    const opcao = (y, cor, grande, tam, peq, tinta) => { u.cartao(170, y, 820, 210, cor); u.texto(grande, 580, y + 92, tam, tinta); u.texto(peq, 580, y + 168, 32, tinta); };
    opcao(290, '#35d04a', 'CONFIA', 96, 'Espera o Tico chegar', '#08280d');
    opcao(570, '#ff4f6e', 'OUTRO MOTORISTA', 66, 'Chama outra entrega agora', '#3a0612');
    SerieVisual.seta(g, 52, 330, s); SerieVisual.seta(g, 52, 610, s);
    g.globalAlpha = 1;
  } },
  { ini: TIMER, fim: FIM_DO_EP, desenha: (p, s, u) => { u.cartao(620, 120, 410, 110, 'rgba(255,246,230,.95)'); u.texto('Confia', 825, 156, 34, '#1f9e33'); u.texto('ou outro motorista?', 825, 198, 28, '#e0304f'); } },
];

const EPISODIO = {
  duracao: FIM_DO_EP,
  falas: FALAS,
  planos: ep05Planos,
  telas: ep05Telas,
  visual: { ambiente: 'claro', lado: 'direita' },
  latidos: [],
  impactos: [],
  destaques: { 1: 'fugi', 2: 'avisado', 3: 'quanto', 4: 'calçada', 5: 'fábrica', 6: 'fábrica', 7: 'pia', 8: 'oito', 9: 'quanto', 10: 'imagina', 11: 'imaginando', 12: 'cheiro', 13: 'dirijo', 14: 'pertinho', 15: 'oito' },
};
