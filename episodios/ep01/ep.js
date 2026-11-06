'use strict';
// Episódio 1: dados de planos, poses e telas. Falas e tempos vêm de falas.js, gerado do roteiro.
// TEMPOS PROVISÓRIOS: estimados até termos as vozes.
const sai = (p) => { p = Math.max(0, Math.min(1, p)); return 1 - (1 - p) * (1 - p); };
const DOWN = { armL: [-9, -5], armR: [9, 5] };
const CELULAR = { armR: [18, 150], propR: 'phone' };

// Moto em tamanho real: cerca de 2 m ao lado de um personagem de 1,75 m.
const MOTO_S = 1.9, MOTO_Y = CHAO + 10, MOTO_X = 700;
const moto = (x, o) => motoSVG(x, MOTO_Y, MOTO_S, o);
const BAG_X = MOTO_X - 95, BAG_Y = MOTO_Y - 395;

const ep01Planos = [
  // Cena 1: esquina
  { ini: 0, fim: 8, cena: 'rua', cam: [[0, 540, 990, 1.02], [5.7, 760, 830, 1.5, .5]],
    fundo: () => moto(540),
    atores: [
      { id: 'tico', x: 220, poses: [[0, { expr: 'envergonhado', armL: [-35, 150], armR: [35, -150], frente: 'R' }], [5, { expr: 'feliz', ...DOWN, armR: [50, 70], propR: 'chave', frente: null }]] },
      { id: 'jao', x: 850, s: 1.3, poses: [[0, { expr: 'neutro', bag: false, armL: [-14, -8], armR: [12, 8] }], [2.9, { armL: [-58, -70], propL: 'chave' }], [5.1, { armL: [-14, -8], propL: null }], [6, { armR: [150, 170] }]] },
    ] },
  { ini: 8, fim: 10, cena: 'rua', cam: [[8, 540, 990, 1.02]],
    fundo: () => moto(540),
    atores: [
      { id: 'tico', x: 220, movX: [8.2, 10, 220, 420], poses: [[8, { expr: 'feliz', bag: true }]] },
      { id: 'jao', x: 850, s: 1.3, poses: [[8, { expr: 'feliz', bag: false, armL: [-40, -60], armR: [12, 8] }]] },
    ] },
  // Cena 2: câmera presa no guidão, com o Tico de frente e a estrada fugindo atrás dele
  { ini: 10, fim: 12.2, cena: 'vazio', cam: [[10, 540, 960, 1]],
    fundo: (t) => { const tr = Math.min(t, 11.95), tremor = t > 11.95 ? Math.sin(t * 90) * 16 : Math.sin(t * 24) * 2; return `<g transform="translate(${tremor.toFixed(1)} 0)">${estradaSVG(tr)}</g>` + (t >= 11.9 ? estouroSVG(190, 700, sai((t - 11.9) / .12)) : '') + guidaoFundoSVG(); },
    frente: () => guidaoFrenteSVG(),
    atores: [{ id: 'tico', x: 540, s: 2.1, yF: (t) => 2230 + (t > 11.95 ? -34 : Math.sin(t * 19) * 5), poses: [[10, { expr: 'feliz', bag: true, semPernas: true, armL: [-60, -62], armR: [60, 62] }], [11.95, { expr: 'surpreso', detalhe: 'suor' }]] }] },
  // Tico vê o pneu; a bag sai das costas e vai para a moto
  { ini: 12.2, fim: 24, cena: 'rua', cam: [[12.2, 400, 1400, 1.7], [13.3, 470, 880, 1.2, .7], [17, 200, 690, 1.75, .6], [20.5, 440, 960, 1.22, .6]],
    fundo: (t) => moto(MOTO_X, { furado: true }) + (t >= 20.5 ? (t < 21.3 ? bagFechadaSVG(BAG_X, BAG_Y - 200 * (1 - sai((t - 20.5) / .3)), .8) : bagAbertaSVG(BAG_X, BAG_Y, .8, boloSVG(0, -190, 1.25, false))) : ''),
    frente: (t) => t >= 12.7 && t < 14.4 ? `<g opacity="${Math.min(1, (t - 12.7) / .15, (14.4 - t) / .25).toFixed(2)}">${balaoPalavraoSVG(230, 330)}</g>` : '',
    atores: [{ id: 'tico', x: 140, poses: [[12.2, { expr: 'surpreso', bag: true, ...DOWN }], [12.75, { expr: 'bravo', detalhe: 'veia', armL: [-60, -130], armR: [60, 130] }], [14.5, { expr: 'preocupado', detalhe: null, armL: [-130, 150], armR: [130, -150] }], [17, { expr: 'pensando', ...DOWN, ...CELULAR }], [20.3, { ...DOWN, propR: null, bag: false }], [20.6, { armR: [70, 80] }], [21.4, { expr: 'surpreso', armR: [14, 8] }], [22, { expr: 'triste' }]] }] },
  // A placa, depois a ideia
  { ini: 24, fim: 25.3, cena: 'ruaBorracharia', cam: [[24, 1267, 1087, 1.3]] },
  { ini: 25.3, fim: 27, cena: 'rua', cam: [[25.3, 230, 690, 1.65]],
    fundo: () => moto(MOTO_X, { furado: true }),
    frente: (t) => t >= 25.9 ? lampadaSVG(140, 250, sai((t - 25.9) / .3)) : '',
    atores: [{ id: 'tico', x: 140, poses: [[25.3, { expr: 'pensando', bag: false }], [26, { expr: 'feliz', armR: [120, 170] }]] }] },
  // Cena 3: borracharia, com o bolo na mão como bandeja
  { ini: 27, fim: 37, cena: 'borracharia', cam: [[27, 430, 930, 1.05], [30, 480, 840, 1.25, .7], [32.2, 460, 890, 1.15, .7], [34, 640, 800, 1.65, .5]],
    frente: (t) => t < 31.5 ? notasSVG(420, 620, t) : '',
    atores: [
      { id: 'borracheiro', x: 680, poses: [[27, { expr: 'neutro', armL: [-14, -8], armR: [14, 20], propR: 'chaveRoda' }], [30, { expr: 'surpreso' }], [34, { expr: 'bravo', armL: [-85, -90] }]] },
      { id: 'tico', x: 250, movX: [27, 29, 20, 250], poses: [[27, { expr: 'feliz', bag: false, armL: [-14, 20], armR: [32, 105], propR: 'bolo' }], [31.9, { expr: 'neutro', armL: [35, 80], frente: 'L' }]] },
    ] },
  // Fora: o pneu furado está na rua
  { ini: 37, fim: 39, cena: 'ruaBorracharia', cam: [[37, 620, 1090, 1.08], [39, 500, 1240, 1.4, 2]],
    fundo: () => moto(640, { furado: true }) },
  { ini: 39, fim: 44.5, cena: 'borracharia', cam: [[39, 470, 860, 1.25], [42, 640, 760, 1.6, .5], [43.2, 470, 860, 1.25, 1]],
    atores: [
      { id: 'borracheiro', x: 680, poses: [[39, { expr: 'cansado', armL: [-14, -8], armR: [14, 20], propR: 'chaveRoda' }], [41.8, { expr: 'pensando', armR: [40, 120], propR: 'fatia' }]] },
      { id: 'tico', x: 250, poses: [[39, { expr: 'pensando', bag: false, armL: [-14, 20], armR: [32, 105], propR: 'bolo' }], [40.6, { expr: 'forcado', armR: [58, 95] }], [43.4, { expr: 'feliz', propR: 'boloApagado' }]] },
    ] },
  { ini: 44.5, fim: 47, cena: 'rua', cam: [[44.5, 330, 700, 1.7]],
    fundo: () => moto(MOTO_X),
    atores: [{ id: 'tico', x: 270, poses: [[44.5, { expr: 'feliz', bag: true, ...CELULAR }]] }] },
  // Cena 4: interfone
  { ini: 47, fim: 63, cena: 'porta', cam: [[47, 560, 900, 1.12], [53.2, 850, 1100, 2.0, .6], [54.8, 640, 690, 1.6, .5], [57.1, 850, 1100, 2.0, .5], [59.1, 640, 690, 1.6, .5], [61.6, 700, 900, 1.2, .5]],
    frente: (t) => interfoneSVG(860, 1120, .8, FALAS.some((f) => f.quem === 'Lua' && t >= f.ini && t < f.fim && t < 63)),
    atores: [
      { id: 'fiscal', x: 190, s: .85, flip: true, poses: [[47, { expr: 'neutro' }]] },
      { id: 'tico', x: 640, poses: [[47, { expr: 'feliz', bag: true, armR: [70, 95] }], [50, { expr: 'neutro', armR: [14, 8] }], [54.5, { expr: 'preocupado' }], [59, { expr: 'forcado', armR: [80, 110] }], [61.5, { expr: 'surpreso', armR: [14, 8] }]] },
    ] },
  // Dez minutos depois: Tico brincando com o Fiscal
  { ini: 63, fim: 65, cena: 'porta', cam: [[63, 540, 1080, 1.05]],
    fundo: () => `<rect x="150" y="${CHAO - 62}" width="520" height="62" fill="#b9b4ac" stroke="${OUT}" stroke-width="${T}"/>`,
    frente: () => interfoneSVG(860, 1120, .8, false),
    atores: [
      { id: 'tico', x: 400, y: CHAO + 10, poses: [[63, { expr: 'rindo', bag: false, sentado: true, legL: [-40, -6], legR: [40, 6], armL: [-16, 20], armR: [58, 72] }]] },
      { id: 'fiscal', x: 790, s: .95, poses: [[63, { expr: 'feliz', tail: 40 }]] },
    ] },
  // Cena 5: a Lua
  { ini: 65, fim: 77, cena: 'portaAberta', cam: [[65, 540, 880, 1.1], [67, 690, 680, 1.6, .5], [69, 330, 690, 1.6, .5], [71.5, 520, 720, 1.4, .7], [74.1, 700, 680, 1.65, .6], [75.5, 330, 690, 1.65, .5]],
    frente: (t) => interfoneSVG(980, 1120, .8, false) + (t >= 66 && t < 69 ? placaCrushSVG(720, 180 + 30 * sai((t - 66) / .25) - 240 * (1 - sai((t - 66) / .25))) : ''),
    atores: [
      { id: 'tico', x: 300, poses: [[65, { expr: 'surpreso', bag: true }], [69, { expr: 'envergonhado', armR: [128, 150] }], [71, { expr: 'rindo', ...DOWN }], [73.5, { expr: 'surpreso', detalhe: 'suor' }], [75.5, { mouth: 'wide' }]] },
      { id: 'lua', x: 720, s: 1.4, poses: [[65, { expr: 'bravo', armR: [75, 140] }], [66, { expr: 'surpreso' }], [67, { armR: [12, 8] }], [71.5, { expr: 'rindo' }], [73.5, { expr: 'preocupado' }]] },
    ] },
  // Votação em preto e branco
  { ini: 77, fim: 84, cena: 'porta', cam: [[77, 540, 680, 1.35]],
    cor: (t) => 1 - sai((t - 77) / .4),
    atores: [{ id: 'tico', x: 540, poses: [[77, { expr: 'forcado', detalhe: 'suor', bag: true, armL: [-18, 60], armR: [14, 8], head: 4 }], [80.5, { expr: 'lado' }]] }] },
  // Cena 6: Dona Marlene apaga a vela, triste e sozinha
  { ini: 84, fim: 90, cena: 'casa', cam: [[84, 540, 960, 1.0], [85.5, 540, 900, 1.45, 1.4]],
    frente: (t) => mesaSVG(1180) + (t < 85.6 ? `<g transform="translate(860 1230) rotate(-10)">` + ret(-44, -24, 88, 48, '#23252f', 8) + ret(-36, -18, 72, 36, '#7fd6ee', 2, 0) + '</g>' : ''),
    atores: [{ id: 'marlene', x: 540, y: 1560, s: 1.35, poses: [[84, { expr: 'triste', armL: [-20, 30], armR: [20, -30] }], [85.5, { armR: [24, 170], propR: 'pao' }], [86, { propR: 'paoAceso' }], [87.4, { mouth: 'small' }], [87.8, { propR: 'pao', mouth: null }], [88.3, { armR: [20, -30], propR: 'pao' }]] }] },
];

const ep01Telas = [
  // Nome no depoimento
  { ini: 10, fim: 11.9, desenha: (p, s, u) => { u.g.globalAlpha = Math.min(1, s / .2, (1.9 - s) / .25); u.cartao(120, 180, 840, 96, '#a8b94c'); u.texto('Tiago Almeida, entregador há 4 minutos', 540, 228, 38, '#2a1f22'); u.g.globalAlpha = 1; } },
  // Notificação
  { ini: 17, fim: 20.5, desenha: (p, s, u) => { const y = 180 + (u.sai(s / .4) - 1) * 260; u.cartao(70, y, 940, 180, '#fff6e6'); u.texto('ENTREGA PERDIDA', 540, y + 62, 62, '#c23b3b'); u.texto('Sua nota caiu', 540, y + 128, 44, '#2a1f22'); } },
  // Dez minutos depois
  { ini: 63, fim: 65, desenha: (p, s, u) => { u.cartao(190, 240, 700, 120, '#2a1f22'); u.texto('Dez minutos depois', 540, 300, 58, '#ffd83a'); } },
  // Votação, em preto e branco
  { ini: 77, fim: 84, desenha: (p, s, u) => {
    u.g.fillStyle = 'rgba(0,0,0,.78)'; u.g.fillRect(0, 0, 1080, 850);
    const e = u.sai(s / .35);
    u.g.globalAlpha = e;
    u.texto('O que vai acontecer', 540, 250, 64, '#ffffff'); u.texto('no próximo?', 540, 330, 64, '#ffffff');
    u.cartao(90, 430, 900, 170, '#f2f2f2'); u.texto('A) Fala a verdade', 540, 515, 62, '#111111');
    u.cartao(90, 640, 900, 170, '#bdbdbd'); u.texto('B) Inventa uma história', 540, 725, 56, '#111111');
    u.g.globalAlpha = 1;
    u.cartao(240, 1500, 600, 80, '#d9d9d9'); u.texto('Tiago Almeida, indeciso', 540, 1540, 38, '#111111');
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
  impactos: [11.93, 66.13],
  destaques: { 1: 'companheira', 2: 'prejuízo', 4: 'sobe', 6: 'tudo', 9: 'nota', 10: 'bolo', 12: 'dia', 14: 'reais', 18: 'aniversário', 20: 'você', 21: 'chance', 24: 'sobe', 28: 'isso', 34: 'entregador', 35: 'falo' },
};
