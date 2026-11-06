'use strict';
// Episódio 1: dados de planos, poses e telas. Falas e tempos vêm de falas.js, gerado do roteiro.
// TEMPOS PROVISÓRIOS: estimados até termos as vozes.
const sai = (p) => { p = Math.max(0, Math.min(1, p)); return 1 - (1 - p) * (1 - p); };
const NOTIF = { ini: 17, fim: 20.5 };
const DOWN = { armL: [-9, -5], armR: [9, 5] };
const CELULAR = { armR: [18, 150], propR: 'phone' };
const CABECA_Y = (id, s = 1.32) => CHAO - CHARS[id].H * s;

const ep01Planos = [
  // Cena 1: esquina
  { ini: 0, fim: 8, cena: 'rua', cam: [[0, 540, 990, 1.02], [5.7, 760, 830, 1.5, .5]],
    fundo: () => motoSVG(520, CHAO + 10, 1.2),
    atores: [
      { id: 'tico', x: 250, poses: [[0, { expr: 'envergonhado', armL: [-35, 150], armR: [35, -150], frente: 'R' }], [5, { expr: 'feliz', ...DOWN, armR: [50, 70], propR: 'chave', frente: null }]] },
      { id: 'jao', x: 790, s: 1.3, poses: [[0, { expr: 'neutro', bag: false, armL: [-14, -8], armR: [12, 8] }], [2.9, { armR: [-58, -70], propR: 'chave' }], [5.1, { armR: [12, 8], propR: null }], [6, { armR: [150, 170] }]] },
    ] },
  { ini: 8, fim: 10, cena: 'rua', cam: [[8, 620, 990, 1.0]],
    fundo: () => motoSVG(470, CHAO + 10, 1.2),
    atores: [
      { id: 'tico', x: 330, movX: [8, 10, 300, 150], poses: [[8, { expr: 'feliz', bag: true }]] },
      { id: 'jao', x: 800, s: 1.3, poses: [[8, { expr: 'feliz', bag: false, armL: [-14, -8], armR: [40, 60] }]] },
    ] },
  // Cena 2: o pneu
  { ini: 10, fim: 12.5, cena: 'rua', cam: [[10, 480, 830, 1.32]],
    fundo: (t) => motoSVG(800, CHAO + 10, 1.2, { furado: t >= 12 }),
    frente: (t) => t >= 12 ? estouroSVG(650, 1500, sai((t - 12) / .12)) : '',
    atores: [{ id: 'tico', x: 380, poses: [[10, { expr: 'feliz', bag: true, armR: [50, 100] }], [12, { expr: 'surpreso', armR: [14, 8] }]] }] },
  { ini: 12.5, fim: 24, continua: true, cena: 'rua', cam: [[12.5, 480, 830, 1.32], [13.4, 520, 880, 1.2, .8], [17, 400, 690, 1.75, .6], [20.5, 490, 1040, 1.28, .6]],
    fundo: () => motoSVG(800, CHAO + 10, 1.2, { furado: true }),
    frente: (t) => (t >= 12.5 && t < 14.4 ? `<g opacity="${Math.min(1, (t - 12.5) / .15, (14.4 - t) / .25).toFixed(2)}">${balaoPalavraoSVG(480, 390)}</g>` : '') + (t >= 20.5 ? bagAbertaSVG(490, 1290 + 700 * (1 - sai((t - 20.5) / .35)), 1.1, boloSVG(0, -170, 1.15, false)) : ''),
    atores: [{ id: 'tico', x: 380, poses: [[12.5, { expr: 'surpreso', bag: true, armL: [-9, -5], armR: [14, 8] }], [12.75, { expr: 'bravo', detalhe: 'veia', armL: [-60, -130], armR: [60, 130] }], [14.5, { expr: 'preocupado', detalhe: null, armL: [-130, 150], armR: [130, -150] }], [17, { expr: 'pensando', ...DOWN, ...CELULAR }], [20.5, { expr: 'triste', ...DOWN, propR: null }]] }] },
  { ini: 24, fim: 27, cena: 'rua', cam: [[24, 1267, 1087, 1.3], [25.7, 430, 680, 1.65, 1.3]],
    frente: (t) => t >= 25.9 ? lampadaSVG(380, 290, sai((t - 25.9) / .3)) : '',
    atores: [{ id: 'tico', x: 380, poses: [[24, { expr: 'pensando', bag: true }], [26, { expr: 'feliz', armR: [120, 170] }]] }] },
  // Cena 3: borracharia
  { ini: 27, fim: 31.5, cena: 'borracharia', cam: [[27, 430, 930, 1.05], [30, 480, 840, 1.25, .7]],
    frente: (t) => { const x = 40 + 230 * Math.max(0, Math.min(1, (t - 27) / 2)); return boloSVG(x, 1230, .95, true) + notasSVG(x + 40, 620, t); },
    atores: [
      { id: 'borracheiro', x: 640, poses: [[27, { expr: 'neutro', armL: [-14, -8], armR: [14, 20], propR: 'chaveRoda' }], [30, { expr: 'surpreso' }]] },
      { id: 'tico', x: 270, movX: [27, 29, 40, 270], poses: [[27, { expr: 'feliz', bag: true, armL: [-50, 70], armR: [55, -70] }]] },
    ],
    fundo2: null },
  { ini: 31.5, fim: 39, continua: true, cena: 'borracharia', cam: [[31.5, 480, 840, 1.25], [32.2, 460, 890, 1.15, .7], [34, 640, 800, 1.65, .5], [37, 990, 1250, 1.25, .7]],
    frente: () => boloSVG(270, 1230, .95, true),
    atores: [
      { id: 'borracheiro', x: 640, poses: [[31.5, { expr: 'surpreso', armL: [-14, -8], armR: [14, 20], propR: 'chaveRoda' }], [34, { expr: 'bravo', armL: [-85, -90] }], [37, { expr: 'neutro', armL: [-14, -8] }]] },
      { id: 'tico', x: 270, poses: [[31.5, { expr: 'feliz', bag: true, armL: [-50, 70], armR: [55, -70] }], [31.9, { expr: 'neutro', armR: [55, 75], armL: [-14, -8] }], [37, { expr: 'pensando', armR: [14, 8] }]] },
    ] },
  { ini: 39, fim: 41.5, continua: true, cena: 'borracharia', cam: [[39, 990, 1250, 1.25], [39.7, 470, 860, 1.25, .7]],
    frente: (t) => { const q = sai((t - 39) / .5); return boloSVG(270 + 170 * q, 1230 - 40 * q, .95, true); },
    atores: [
      { id: 'borracheiro', x: 640, poses: [[39, { expr: 'cansado', armR: [14, 20], propR: 'chaveRoda' }]] },
      { id: 'tico', x: 270, poses: [[39, { expr: 'pensando', bag: true, armR: [14, 8], armL: [-14, -8] }], [39.4, { expr: 'forcado', armR: [55, 75], armL: [-20, 10] }]] },
    ] },
  { ini: 41.5, fim: 44.5, continua: true, cena: 'borracharia', cam: [[41.5, 470, 860, 1.25], [42, 640, 760, 1.6, .5], [43.2, 470, 860, 1.25, 1]],
    frente: () => boloSVG(440, 1190, .95, false),
    atores: [
      { id: 'borracheiro', x: 640, poses: [[41.5, { expr: 'cansado', armR: [14, 20], propR: 'chaveRoda' }], [41.8, { expr: 'pensando', armR: [40, 120], propR: 'fatia' }]] },
      { id: 'tico', x: 270, poses: [[41.5, { expr: 'forcado', bag: true, armR: [55, 75], armL: [-20, 10] }], [41.9, { expr: 'feliz', armR: [40, 60], armL: [-9, -5] }]] },
    ] },
  { ini: 44.5, fim: 47, cena: 'rua', cam: [[44.5, 450, 700, 1.7]],
    fundo: () => motoSVG(800, CHAO + 10, 1.2),
    atores: [{ id: 'tico', x: 400, poses: [[44.5, { expr: 'feliz', bag: true, ...CELULAR }]] }] },
  // Cena 4: interfone
  { ini: 47, fim: 52.5, cena: 'porta', cam: [[47, 560, 900, 1.12]],
    frente: () => interfoneSVG(860, 1120, .8, false),
    atores: [
      { id: 'fiscal', x: 190, s: .85, flip: true, poses: [[47, { expr: 'neutro' }]] },
      { id: 'tico', x: 640, poses: [[47, { expr: 'feliz', bag: true, armR: [70, 95] }], [50, { expr: 'neutro', armR: [14, 8] }]] },
    ] },
  { ini: 52.5, fim: 63, continua: true, cena: 'porta', cam: [[52.5, 560, 900, 1.12], [53.2, 850, 1100, 2.0, .6], [54.8, 640, 690, 1.6, .5], [57.1, 850, 1100, 2.0, .5], [59.1, 640, 690, 1.6, .5], [61.6, 700, 900, 1.2, .5]],
    frente: (t) => interfoneSVG(860, 1120, .8, FALAS.some((f) => f.quem === 'Lua' && t >= f.ini && t < f.fim)),
    atores: [
      { id: 'fiscal', x: 190, s: .85, flip: true, poses: [[52.5, { expr: 'neutro' }]] },
      { id: 'tico', x: 640, poses: [[52.5, { expr: 'neutro', bag: true, armR: [14, 8] }], [54.5, { expr: 'preocupado' }], [59, { expr: 'forcado', armR: [80, 110] }], [61.5, { expr: 'surpreso', armR: [14, 8] }]] },
    ] },
  { ini: 63, fim: 65, cena: 'porta', cam: [[63, 540, 1080, 1.05]],
    fundo: () => `<rect x="180" y="${CHAO - 62}" width="760" height="62" fill="#b9b4ac" stroke="${OUT}" stroke-width="${T}"/>`,
    frente: (t) => interfoneSVG(860, 1120, .8, false) + (t < 64.2 ? bagAbertaSVG(790, 1430, .5) : ''),
    atores: [
      { id: 'tico', x: 400, y: CHAO + 10, poses: [[63, { expr: 'cansado', bag: false, sentado: true, legL: [-40, -6], legR: [40, 6], armL: [-16, 20], armR: [16, -20] }]] },
      { id: 'fiscal', x: 860, s: .85, poses: [[63, { expr: 'feliz', head: 18 }], [64.2, { head: 0, expr: 'feliz' }]] },
    ] },
  // Cena 5: a Lua
  { ini: 65, fim: 73.5, cena: 'portaAberta', cam: [[65, 540, 880, 1.1], [67, 690, 680, 1.6, .5], [69, 330, 690, 1.6, .5], [71.5, 520, 720, 1.4, .7]],
    frente: (t) => interfoneSVG(980, 1120, .8, false) + (t >= 66 && t < 69 ? placaCrushSVG(720, 180 + 30 * sai((t - 66) / .25) - 240 * (1 - sai((t - 66) / .25))) : ''),
    atores: [
      { id: 'tico', x: 300, poses: [[65, { expr: 'surpreso', bag: true }], [69, { expr: 'envergonhado', armR: [128, 150] }], [71, { expr: 'rindo', ...DOWN }]] },
      { id: 'lua', x: 720, s: 1.4, poses: [[65, { expr: 'bravo', armR: [75, 140] }], [66, { expr: 'surpreso' }], [67, { armR: [12, 8] }], [71.5, { expr: 'rindo' }]] },
    ] },
  { ini: 73.5, fim: 76.3, continua: true, cena: 'portaAberta', cam: [[73.5, 520, 720, 1.4], [74.1, 700, 680, 1.65, .6], [75.5, 330, 690, 1.65, .5]],
    frente: () => interfoneSVG(980, 1120, .8, false),
    atores: [
      { id: 'tico', x: 300, poses: [[73.5, { expr: 'surpreso', detalhe: 'suor', bag: true }], [75.5, { mouth: 'wide' }]] },
      { id: 'lua', x: 720, s: 1.4, poses: [[73.5, { expr: 'preocupado' }]] },
    ] },
  { ini: 76.3, fim: 77, cena: 'portaAberta', cam: [[76.3, 300, 1180, 1.9]],
    atores: [{ id: 'fiscal', x: 340, s: 1.15, poses: [[76.3, { expr: 'bravo', boca: 'embalagem', breath: 18, head: -8 }]] }] },
  // Votação
  { ini: 77, fim: 84, cena: 'porta', cam: [[77, 540, 680, 1.35]],
    atores: [{ id: 'tico', x: 540, poses: [[77, { expr: 'forcado', detalhe: 'suor', bag: true, armL: [-18, 60], armR: [14, 8], head: 4 }], [80.5, { expr: 'lado' }]] }] },
  // Cena 6: Dona Marlene
  { ini: 84, fim: 90, cena: 'casa', cam: [[84, 540, 960, 1.0], [85.5, 540, 900, 1.45, 1.4]],
    frente: (t) => mesaSVG(1180) + (t < 85.6 ? `<g transform="translate(860 1230) rotate(-10)">` + ret(-44, -24, 88, 48, '#23252f', 8) + ret(-36, -18, 72, 36, '#7fd6ee', 2, 0) + '</g>' : ''),
    atores: [{ id: 'marlene', x: 540, y: 1560, s: 1.35, poses: [[84, { expr: 'triste', armL: [-20, 30], armR: [20, -30] }], [85.5, { armR: [24, 170], propR: 'pao' }], [86, { propR: 'paoAceso' }], [87.6, { mouth: 'small', propR: 'pao' }], [88.2, { mouth: null }], [89, { armR: [20, -168], frente: 'R', mouth: 'open' }]] }] },
];

const ep01Telas = [
  // Nome no depoimento
  { ini: 10, fim: 12.2, desenha: (p, s, u) => { u.g.globalAlpha = Math.min(1, s / .2, (2.2 - s) / .25); u.cartao(120, 1500, 840, 96, '#a8b94c'); u.texto('Tiago Almeida, entregador há 4 minutos', 540, 1548, 38, '#2a1f22'); u.g.globalAlpha = 1; } },
  // Notificação
  { ini: NOTIF.ini, fim: NOTIF.fim, desenha: (p, s, u) => { const y = 180 + (u.sai(s / .4) - 1) * 260; u.cartao(70, y, 940, 180, '#fff6e6'); u.texto('ENTREGA PERDIDA', 540, y + 62, 62, '#c23b3b'); u.texto('Sua nota caiu', 540, y + 128, 44, '#2a1f22'); } },
  // Dez minutos depois
  { ini: 63, fim: 65, desenha: (p, s, u) => { u.cartao(190, 240, 700, 120, '#2a1f22'); u.texto('Dez minutos depois', 540, 300, 58, '#ffd83a'); } },
  // Votação
  { ini: 77, fim: 84, desenha: (p, s, u) => {
    u.g.fillStyle = 'rgba(20,16,20,.72)'; u.g.fillRect(0, 0, 1080, 850);
    const e = u.sai(s / .35);
    u.g.globalAlpha = e;
    u.texto('O que vai acontecer', 540, 250, 64, '#ffd83a'); u.texto('no próximo?', 540, 330, 64, '#ffd83a');
    u.cartao(90, 430, 900, 170, '#a8b94c'); u.texto('A) Fala a verdade', 540, 515, 62, '#2a1f22');
    u.cartao(90, 640, 900, 170, '#f0a48c'); u.texto('B) Inventa uma história', 540, 725, 56, '#2a1f22');
    u.g.globalAlpha = 1;
    u.cartao(240, 1500, 600, 80, '#a8b94c'); u.texto('Tiago Almeida, indeciso', 540, 1540, 38, '#2a1f22');
  } },
  // Opções no canto, durante a cena da Marlene
  { ini: 84, fim: 90, desenha: (p, s, u) => { u.cartao(640, 120, 390, 140, 'rgba(255,246,230,.95)'); u.texto('A) Verdade', 835, 164, 36, '#2a1f22'); u.texto('B) História', 835, 216, 36, '#2a1f22'); } },
];

const EPISODIO = {
  duracao: 90,
  falas: FALAS.map((f) => f.n === 7 ? { ...f, semLegenda: true } : f),
  planos: ep01Planos,
  telas: ep01Telas,
  latidos: [61.9, 62.3, 80.8],
  impactos: [12, 66.13],
  destaques: { 1: 'companheira', 2: 'prejuízo', 4: 'sobe', 6: 'tudo', 9: 'nota', 10: 'bolo', 12: 'dia', 14: 'reais', 18: 'aniversário', 20: 'você', 21: 'chance', 24: 'sobe', 28: 'isso', 34: 'entregador', 35: 'falo' },
};
