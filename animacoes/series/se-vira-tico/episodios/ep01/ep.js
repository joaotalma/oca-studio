'use strict';
ESTILO_RIG = 'classico'; // fixado na Oca Studio (2026-11-12): episódio feito com o rig clássico
// Episódio 1: dados de planos, poses e telas. Falas e tempos vêm de falas.js, gerado do roteiro.
// Os tempos aqui são os do roteiro; tempos.js os leva para o tempo real das vozes.
const sai = (p) => { p = Math.max(0, Math.min(1, p)); return 1 - (1 - p) * (1 - p); };
const DOWN = { armL: [-9, -5], armR: [9, 5] };
const CELULAR = { armR: [18, 150], propR: 'phone' };

// Moto em tamanho real: cerca de 2 m ao lado de um personagem de 1,75 m.
const MOTO_S = 1.9, MOTO_Y = CHAO + 10, MOTO_X = 700;
const moto = (x, o) => motoSVG(x, MOTO_Y, MOTO_S, o);
const BAG_X = MOTO_X - 95, BAG_Y = MOTO_Y - 395;
const POW = 2.7;
const LEMBRANCA = () => .1; // lembrança: quase sem cor

// Enquadramentos: rosto grande a 1,9x, centrado acima da legenda
const C_TICO = 897, C_JAO = 1000, C_BORR = 1035, C_LUA = 955;

// Atores por cenário: o mesmo elenco vale para todos os planos do cenário
const ESQUINA = [
  { id: 'tico', x: 220, poses: [[4.6, { expr: 'envergonhado', bag: false, armL: [-35, 150], armR: [35, -150], frente: 'R' }], [9.6, { expr: 'feliz', ...DOWN, armR: [50, 70], propR: 'chave', frente: null }], [12.4, { bag: true, propR: null, ...DOWN }]] },
  { id: 'jao', x: 850, s: 1.3, poses: [[4.6, { expr: 'neutro', bag: true, armL: [-14, -8], armR: [12, 8] }], [7.5, { armL: [-58, -70], propL: 'chave' }], [9.8, { armL: [-14, -8], propL: null }], [10.4, { armR: [150, 170] }], [12.4, { expr: 'feliz', bag: false, armR: [12, 8], armL: [-40, -60] }]] },
];
const RUA_TICO = [{ id: 'tico', x: 140, poses: [[3, { expr: 'surpreso', bag: true, ...DOWN }], [3.5, { expr: 'bravo', detalhe: 'veia', armL: [-60, -130], armR: [60, 130] }], [13.4, { expr: 'preocupado', detalhe: null, armL: [-130, 150], armR: [130, -150] }], [15.8, { expr: 'pensando', ...DOWN, ...CELULAR }], [19, { ...DOWN, propR: null, bag: false }], [19.3, { armR: [70, 80] }], [20, { expr: 'surpreso', armR: [14, 8] }], [20.6, { expr: 'triste' }], [22, { expr: 'preocupado' }], [25, { expr: 'feliz', armR: [120, 170] }]] }];
const motoFurada = () => moto(MOTO_X, { furado: true });
const bagNaMoto = (t) => t < 19 ? '' : (t < 19.9 ? bagFechadaSVG(BAG_X, BAG_Y - 200 * (1 - sai((t - 19) / .3)), .8) : bagAbertaSVG(BAG_X, BAG_Y, .8, boloSVG(0, -190, 1.25, false)));
const OFICINA = [
  { id: 'borracheiro', x: 680, poses: [[26, { expr: 'neutro', armL: [-14, -8], armR: [14, 20], propR: 'chaveRoda' }], [29, { expr: 'surpreso' }], [33, { expr: 'bravo', armL: [-85, -90] }], [38, { expr: 'cansado', armL: [-14, -8] }], [40.5, { expr: 'pensando', armR: [40, 120], propR: 'fatia' }]] },
  { id: 'tico', x: 250, movX: [26, 27.6, 20, 250], poses: [[26, { expr: 'feliz', bag: false, armL: [-14, 20], armR: [32, 105], propR: 'bolo' }], [30.5, { expr: 'neutro', armL: [35, 80], frente: 'L' }], [36, { expr: 'pensando', armL: [-14, 20], frente: null }], [39.5, { expr: 'forcado', armR: [58, 95] }], [41.6, { expr: 'feliz', propR: 'boloApagado' }]] },
];
const PORTA = [
  { id: 'fiscal', x: 190, s: .85, flip: true, poses: [[46, { expr: 'neutro' }]] },
  { id: 'tico', x: 640, poses: [[46, { expr: 'feliz', bag: true, armR: [70, 95] }], [49, { expr: 'neutro', armR: [14, 8] }], [53.5, { expr: 'preocupado' }], [58, { expr: 'forcado', armR: [80, 110] }], [60.5, { expr: 'surpreso', armR: [14, 8] }]] },
];
const interfoneFala = (t) => interfoneSVG(860, 1120, .8, FALAS.some((f) => f.quem === 'Lua' && t >= f.ini && t < f.fim));
const NA_PORTA = [
  { id: 'tico', x: 300, poses: [[64, { expr: 'surpreso', bag: true }], [68, { expr: 'envergonhado', armR: [128, 150] }], [69.8, { expr: 'rindo', ...DOWN }], [72, { expr: 'surpreso', detalhe: 'suor' }], [74, { mouth: 'wide' }]] },
  { id: 'lua', x: 720, s: 1.4, poses: [[64, { expr: 'bravo', armR: [75, 140] }], [65, { expr: 'surpreso' }], [66.1, { armR: [12, 8] }], [69.8, { expr: 'rindo' }], [72, { expr: 'preocupado' }]] },
];
const interfoneLua = () => interfoneSVG(980, 1120, .8, false);

const celularSVG = (t) => {
  const e = sai((t - 15.85) / .25), y = 620 - 120 * e;
  return `<rect x="-100" y="-100" width="1300" height="2200" fill="#1c2a45"/>`
    + ret(240, 180, 600, 1240, '#23252f', 54) + ret(268, 240, 544, 1120, '#f7f4ef', 16, 0)
    + txt(540, 320, 'Seu app de entregas', 30, '#55606c')
    + `<g opacity="${e.toFixed(2)}">` + ret(290, y, 500, 260, '#fff6e6', 22) + txt(540, y + 96, 'ENTREGA', 52, '#c23b3b') + txt(540, y + 156, 'PERDIDA', 52, '#c23b3b') + txt(540, y + 216, 'Sua nota caiu', 32, OUT) + '</g>';
};

const ep01Planos = [
  // Abertura: câmera presa no guidão
  { ini: 0, fim: 3, cena: 'vazio', cobrePernas: true, cam: [[0, 540, 960, 1]],
    fundo: (t) => { const tr = Math.min(t, POW), tremor = t > POW ? Math.sin(t * 90) * 16 : Math.sin(t * 24) * 2; return `<g transform="translate(${tremor.toFixed(1)} 0)">${estradaSVG(tr)}</g>` + (t >= POW - .05 ? estouroSVG(190, 700, sai((t - POW + .05) / .12)) : '') + guidaoFundoSVG(); },
    frente: () => guidaoFrenteSVG(),
    atores: [{ id: 'tico', x: 540, s: 2.1, yF: (t) => 2230 + (t > POW ? -34 : Math.sin(t * 19) * 5), poses: [[0, { expr: 'feliz', bag: true, semPernas: true, armL: [-60, -62], armR: [60, 62] }], [POW, { expr: 'surpreso', detalhe: 'suor' }]] }] },
  { ini: 3, fim: 3.4, cena: 'rua', cam: [[3, 370, 1400, 1.9]], fundo: motoFurada },
  { ini: 3.4, fim: 4.6, cena: 'rua', cam: [[3.4, 140, C_TICO, 1.9]], fundo: motoFurada, atores: RUA_TICO,
    frente: (t) => `<g opacity="${Math.min(1, (t - 3.4) / .1, (4.6 - t) / .32).toFixed(2)}">${balaoPalavraoSVG(140, 560)}</g>` },
  // Cena 1: duas horas antes
  { ini: 4.6, fim: 7.4, cena: 'rua', cam: [[4.6, 540, 990, 1.02]], fundo: () => moto(540), cor: LEMBRANCA, atores: ESQUINA },
  { ini: 7.4, fim: 9.6, cena: 'rua', cam: [[7.4, 850, C_JAO, 1.9]], fundo: () => moto(540), cor: LEMBRANCA, atores: ESQUINA },
  { ini: 9.6, fim: 10.2, cena: 'rua', cam: [[9.6, 220, C_TICO, 1.9]], fundo: () => moto(540), cor: LEMBRANCA, atores: ESQUINA },
  { ini: 10.2, fim: 12.4, cena: 'rua', cam: [[10.2, 850, C_JAO, 1.7]], fundo: () => moto(540), cor: LEMBRANCA, atores: ESQUINA },
  { ini: 12.4, fim: 13.4, cena: 'rua', cam: [[12.4, 540, 990, 1.02]], fundo: () => moto(540), cor: LEMBRANCA, atores: ESQUINA },
  // Cena 2: o bolo
  { ini: 13.4, fim: 15.8, cena: 'rua', cam: [[13.4, 450, 960, 1.2]], fundo: motoFurada, atores: RUA_TICO },
  { ini: 15.8, fim: 17.4, cena: 'vazio', cam: [[15.8, 540, 960, 1], [17.4, 540, 900, 1.12, 1.6]], fundo: celularSVG },
  { ini: 17.4, fim: 19, cena: 'rua', cam: [[17.4, 140, C_TICO, 1.9]], fundo: motoFurada, atores: RUA_TICO },
  { ini: 19, fim: 22, cena: 'rua', cam: [[19, 420, 1040, 1.22]], fundo: (t) => motoFurada() + bagNaMoto(t), atores: RUA_TICO },
  { ini: 22, fim: 23, cena: 'rua', cam: [[22, BAG_X, 1050, 2.3]], fundo: (t) => motoFurada() + bagNaMoto(t) },
  { ini: 23, fim: 24, cena: 'rua', cam: [[23, 140, C_TICO, 1.9]], fundo: (t) => motoFurada() + bagNaMoto(t), atores: RUA_TICO },
  { ini: 24, fim: 25, cena: 'ruaBorracharia', cam: [[24, 1267, 1087, 1.15], [25, 1267, 1087, 1.5, 1]] },
  { ini: 25, fim: 26, cena: 'rua', cam: [[25, 200, 830, 1.65]], fundo: (t) => motoFurada() + bagNaMoto(t), atores: RUA_TICO,
    frente: (t) => lampadaSVG(140, 250, sai((t - 25) / .25)) },
  // Cena 3: borracharia
  { ini: 26, fim: 29, cena: 'borracharia', cam: [[26, 430, 930, 1.05]], frente: (t) => notasSVG(420, 620, t), atores: OFICINA },
  { ini: 29, fim: 30.5, cena: 'borracharia', cam: [[29, 680, C_BORR, 1.9]], atores: OFICINA },
  { ini: 30.5, fim: 33, cena: 'borracharia', cam: [[30.5, 300, C_TICO, 1.7]], atores: OFICINA },
  { ini: 33, fim: 36, cena: 'borracharia', cam: [[33, 680, C_BORR, 1.9]], atores: OFICINA },
  { ini: 36, fim: 38, cena: 'ruaBorracharia', cam: [[36, 560, 1170, 1.15], [38, 380, 1370, 1.55, 2]], fundo: () => moto(640, { furado: true }) },
  { ini: 38, fim: 39.5, cena: 'borracharia', cam: [[38, 680, C_BORR, 1.9]], atores: OFICINA },
  { ini: 39.5, fim: 40.5, cena: 'borracharia', cam: [[39.5, 300, C_TICO, 1.7]], atores: OFICINA },
  { ini: 40.5, fim: 41.5, cena: 'borracharia', cam: [[40.5, 600, 920, 1.5]], atores: OFICINA },
  { ini: 41.5, fim: 43.5, cena: 'borracharia', cam: [[41.5, 470, 860, 1.25]], atores: OFICINA },
  { ini: 43.5, fim: 46, cena: 'rua', cam: [[43.5, 330, 700, 1.7]], fundo: () => moto(MOTO_X),
    atores: [{ id: 'tico', x: 270, poses: [[43.5, { expr: 'feliz', bag: true, ...CELULAR }]] }] },
  // Cena 4: interfone, com cada resposta cortando para quem reage
  { ini: 46, fim: 47.5, cena: 'porta', cam: [[46, 560, 900, 1.12]], frente: interfoneFala, atores: PORTA },
  { ini: 47.5, fim: 49, cena: 'porta', cam: [[47.5, 850, 1100, 2.0]], frente: interfoneFala, atores: PORTA },
  { ini: 49, fim: 51.5, cena: 'porta', cam: [[49, 640, C_TICO, 1.9]], frente: interfoneFala, atores: PORTA },
  { ini: 51.5, fim: 53.5, cena: 'porta', cam: [[51.5, 850, 1100, 2.0]], frente: interfoneFala, atores: PORTA },
  { ini: 53.5, fim: 56, cena: 'porta', cam: [[53.5, 640, C_TICO, 1.9]], frente: interfoneFala, atores: PORTA },
  { ini: 56, fim: 58, cena: 'porta', cam: [[56, 850, 1100, 2.0]], frente: interfoneFala, atores: PORTA },
  { ini: 58, fim: 60.5, cena: 'porta', cam: [[58, 640, C_TICO, 1.9]], frente: interfoneFala, atores: PORTA },
  { ini: 60.5, fim: 62, cena: 'porta', cam: [[60.5, 170, 1270, 2.0]], atores: PORTA },
  // Dez minutos depois: Tico brincando com o Fiscal
  { ini: 62, fim: 64, cena: 'porta', cam: [[62, 540, 1080, 1.05]],
    fundo: () => `<rect x="150" y="${CHAO - 62}" width="520" height="62" fill="#b9b4ac" stroke="${OUT}" stroke-width="${T}"/>`,
    frente: () => interfoneSVG(860, 1120, .8, false),
    atores: [
      { id: 'tico', x: 400, y: CHAO + 10, poses: [[62, { expr: 'rindo', bag: true, sentado: true, legL: [-40, -6], legR: [40, 6], armL: [-16, 20], armR: [58, 72] }]] },
      { id: 'fiscal', x: 790, s: .95, poses: [[62, { expr: 'feliz', tail: 40 }]] },
    ] },
  // Cena 5: a Lua
  { ini: 64, fim: 66, cena: 'portaAberta', cam: [[64, 540, 880, 1.1]], atores: NA_PORTA,
    frente: (t) => interfoneLua() + (t >= 65 ? placaCrushSVG(720, 180 + 30 * sai((t - 65) / .25) - 240 * (1 - sai((t - 65) / .25))) : '') },
  { ini: 66, fim: 68, cena: 'portaAberta', cam: [[66, 720, C_LUA, 1.8]], atores: NA_PORTA, frente: interfoneLua },
  { ini: 68, fim: 69.6, cena: 'portaAberta', cam: [[68, 300, C_TICO, 1.8]], atores: NA_PORTA, frente: interfoneLua },
  { ini: 69.6, fim: 72, cena: 'portaAberta', cam: [[69.6, 520, 720, 1.4]], atores: NA_PORTA, frente: interfoneLua },
  { ini: 72, fim: 74, cena: 'portaAberta', cam: [[72, 720, C_LUA, 1.9]], atores: NA_PORTA, frente: interfoneLua },
  { ini: 74, fim: 75.5, cena: 'portaAberta', cam: [[74, 300, C_TICO, 2.0]], atores: NA_PORTA, frente: interfoneLua },
  // Votação em preto e branco
  { ini: 75.5, fim: 82, cena: 'porta', cam: [[75.5, 540, 680, 1.35]],
    cor: (t) => 1 - sai((t - 75.5) / .4),
    atores: [{ id: 'tico', x: 540, poses: [[75.5, { expr: 'forcado', detalhe: 'suor', bag: true, armL: [-18, 60], armR: [14, 8], head: 4 }], [78.5, { expr: 'lado' }]] }] },
  // Cena 6: Dona Marlene apaga a vela, triste e sozinha
  { ini: 82, fim: 87, cena: 'casa', cam: [[82, 540, 960, 1.0], [83.2, 540, 900, 1.45, 1.2], [87.6, 540, 860, 1.9, 3.6]],
    frente: (t) => mesaSVG(1180) + (t < 83.3 ? `<g transform="translate(860 1230) rotate(-10)">` + ret(-44, -24, 88, 48, '#23252f', 8) + ret(-36, -18, 72, 36, '#7fd6ee', 2, 0) + '</g>' : ''),
    atores: [{ id: 'marlene', x: 540, y: 1560, s: 1.35, poses: [[82, { expr: 'triste', armL: [-20, 30], armR: [20, -30] }], [83.2, { armR: [24, 170], propR: 'pao' }], [83.6, { propR: 'paoAceso' }], [84.9, { mouth: 'small' }], [85.3, { propR: 'pao', mouth: null }], [85.8, { armR: [20, -30], propR: 'pao' }]] }] },
];

// Painel fixo: os valores seguem de episódio em episódio
const nota = (t) => t < 17.2 ? '-' : '-0,3';
const divida = (t) => t < 24.3 ? 'R$ 0' : t < 44 ? 'R$ 120' : 'R$ 0';
const painel = (t, u, pb) => {
  u.g.globalAlpha = Math.min(1, (t - 13.4) / .3);
  u.cartao(30, 70, 500, 138, pb ? '#222222' : '#2a1f22');
  u.texto('Desempregado: 92 dias', 56, 105, 32, '#ffffff', 'left');
  u.texto(`Nota: ${nota(t)}`, 56, 148, 32, t >= 17.2 && t < 17.8 && !pb ? '#ff6a5a' : '#ffffff', 'left');
  u.texto(`Dívida: ${divida(t)}`, 56, 188, 32, divida(t) !== 'R$ 0' && !pb ? '#ffd83a' : '#ffffff', 'left');
  u.g.globalAlpha = 1;
};

const ep01Telas = [
  // Nome no depoimento
  { ini: .1, fim: 2.65, desenha: (p, s, u) => { u.g.globalAlpha = Math.min(1, s / .2, (2.55 - s) / .25); u.cartao(120, 180, 840, 96, '#a8b94c'); u.texto('Tiago Almeida, entregador há 4 minutos', 540, 228, 38, '#2a1f22'); u.g.globalAlpha = 1; } },
  { ini: 4.6, fim: 13.4, desenha: (p, s, u) => { const v = u.g.createRadialGradient(540, 860, 420, 540, 960, 1120); v.addColorStop(0, 'rgba(20,20,20,0)'); v.addColorStop(1, 'rgba(20,20,20,.62)'); u.g.fillStyle = v; u.g.fillRect(0, 0, 1080, 1920); } },
  { ini: 4.6, fim: 5.7, desenha: (p, s, u) => { u.g.globalAlpha = Math.min(1, s / .15, (1.1 - s) / .2); u.cartao(240, 220, 600, 110, '#222222'); u.texto('Duas horas antes', 540, 275, 54, '#ffffff'); u.g.globalAlpha = 1; } },
  // Painel: some no celular em tela cheia
  { ini: 13.4, fim: 15.8, desenha: (p, s, u) => painel(13.4 + s, u) },
  { ini: 17.4, fim: 75.5, desenha: (p, s, u) => painel(17.4 + s, u) },
  // Dez minutos depois
  { ini: 62, fim: 64, desenha: (p, s, u) => { u.cartao(190, 250, 700, 120, '#2a1f22'); u.texto('Dez minutos depois', 540, 310, 58, '#ffd83a'); } },
  // Votação, em preto e branco
  { ini: 75.5, fim: 82, desenha: (p, s, u) => {
    u.g.fillStyle = 'rgba(0,0,0,.78)'; u.g.fillRect(0, 0, 1080, 850);
    u.g.globalAlpha = u.sai(s / .35);
    u.texto('Comenta sua escolha:', 540, 290, 60, '#ffffff');
    // As duas opções se alternam, chamando o voto
    const opcao = (y, cor, txt, tam, fase) => {
      const e = 1 + .03 * Math.sin(s * 4.2 + fase);
      u.g.save(); u.g.translate(540, y + 100); u.g.scale(e, e); u.g.translate(-540, -y - 100);
      u.cartao(90, y, 900, 200, cor); u.texto(txt, 540, y + 100, tam, fase ? '#3a0612' : '#08280d');
      u.g.restore();
    };
    opcao(370, '#35d04a', 'Conte a Verdade', 72, 0);
    opcao(600, '#ff4f6e', 'Inventa uma História', 62, Math.PI);
    u.g.globalAlpha = 1;
    painel(75.5 + s, u, true);
    u.cartao(240, 1500, 600, 80, '#d9d9d9'); u.texto('Tiago Almeida, indeciso', 540, 1540, 38, '#111111');
  } },
  // Pergunta no canto, durante a cena da Marlene
  { ini: 82, fim: 87, desenha: (p, s, u) => { u.cartao(620, 120, 410, 110, 'rgba(255,246,230,.95)'); u.texto('Verdade', 825, 156, 34, '#1f9e33'); u.texto('ou História?', 825, 198, 34, '#e0304f'); } },
];

const EPISODIO = {
  duracao: 87,
  falas: FALAS.map((f) => f.n === 2 ? { ...f, semLegenda: true } : f),
  planos: ep01Planos,
  telas: ep01Telas,
  latidos: [61.2, 78.6],
  impactos: [POW - .03, 3.5, 19.9, 65.2],
  destaques: { 1: 'tudo', 3: 'companheira', 4: 'prejuízo', 6: 'sobe', 9: 'nota', 10: 'bolo', 12: 'dia', 14: 'reais', 18: 'aniversário', 20: 'você', 21: 'chance', 24: 'sobe', 28: 'isso', 34: 'entregador', 35: 'falo' },
};
