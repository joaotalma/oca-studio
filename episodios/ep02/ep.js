'use strict';
// Episódio 2: dados de planos, poses e telas. Falas e tempos vêm de falas.js, gerado do roteiro.
// Os planos se prendem às falas, então acompanham qualquer ajuste de tempo no roteiro.
const sai = (p) => { p = Math.max(0, Math.min(1, p)); return 1 - (1 - p) * (1 - p); };
const clamp01 = (p) => Math.max(0, Math.min(1, p));
const F = Object.fromEntries(FALAS.map((f) => [f.n, f]));
const I = (n) => F[n].ini, E = (n) => F[n].fim;
const DOWN = { armL: [-9, -5], armR: [9, 5] };
const LEMBRANCA = () => .1;
const C_TICO = 897, C_LUA = 955;
const FIM_DO_EP = E(37) + 1.35;

// Tempos das ações sem fala
const VOA = E(3) - .32;                 // a lombada chega no "voa"
const POUSO = E(17) + .12;              // volta à lombada, na cena das 5h
const FIM_POUSO = I(18);
const FISCAL_LONGE = E(32) + .05;
const TOSSE = E(33) + .1;
const MAPA_PE = E(34) + .12;
const MONTAGEM = MAPA_PE + 1.2;
const LUA_LONGE = MONTAGEM + 3;
const RISO = E(35) + .1;
const VOTO = I(36);
const COMPRA = E(37) + .1;

// Céu da manhã: da madrugada ao sol alto
const mistura = (a, b, q) => { const p = (s, i) => parseInt(s.substr(1 + i * 2, 2), 16); return '#' + [0, 1, 2].map((i) => Math.round(p(a, i) + (p(b, i) - p(a, i)) * q).toString(16).padStart(2, '0')).join(''); };
const manha = (t) => clamp01((t - POUSO) / (E(32) - POUSO));
const ceu = (t) => { if (t < I(4)) return '#c98a6a'; const q = manha(t); return q < .5 ? mistura('#c98a6a', '#f4a65a', q * 2) : mistura('#f4a65a', '#ffd9a0', (q - .5) * 2); };
const sol = (t) => { const q = t < I(4) ? 0 : manha(t); return [760, 830 - 460 * q]; };

// Suor: a camiseta escurece e o fedor cresce, do treino até o fim
const suorEm = (t) => t < I(22) ? 0 : t < E(33) ? .15 + .35 * clamp01((t - I(22)) / (E(33) - I(22))) : clamp01(.5 + .5 * (t - MONTAGEM) / 3);
const cacheSuado = {};
const ticoSuado = (t) => { const n = Math.round(suorEm(t) * 6); return cacheSuado[n] || (cacheSuado[n] = { ...CHARS.tico, cloth: mistura('#a8b94c', '#6d7c2c', n / 6), clothD: mistura('#7f9419', '#4f5c1f', n / 6) }); };

// Moto voando: 0 no chão, 1 no alto
const voo = (t) => t < I(4) ? sai((t - VOA) / .34) + Math.sin((t - VOA) * 5) * .012 * (t > VOA ? 1 : 0)
  : (t >= POUSO && t < FIM_POUSO ? Math.max(0, 1 - clamp01((t - POUSO) / .38) ** 2) : 0);
const choque = (t) => { const s = t - (POUSO + .38); return s > 0 && s < .36 ? Math.sin(s * 42) * 13 * (1 - s / .36) : 0; };

/* ---------- plano do guidão, com a Letícia na garupa ---------- */
const fundoGuidao = (t) => {
  const v = voo(t), velocidade = t < I(4) ? Math.min(t, VOA + .05) : t;
  return `<g transform="translate(0 ${(v * 170 + choque(t)).toFixed(1)})">${estradaSVG(velocidade, ceu(t), sol(t), '#f7d774')}</g>` + guidaoFundoSVG();
};
const frenteGuidao = (t) => `<g transform="translate(0 ${(voo(t) * 60).toFixed(1)})">${guidaoFrenteSVG()}</g>`;
const tremeTico = (t) => voo(t) > .02 ? -voo(t) * 330 : Math.sin(t * 19) * 5 + choque(t);
const tremeLeticia = (t) => voo(t) > .02 ? -voo(t) * 390 : Math.sin(t * 19 + 1) * 7 + choque(t);
const GARUPA = [
  { id: 'leticia', x: 765, s: 1.95, yF: (t) => 2148 + tremeLeticia(t), poses: [
    [0, { expr: 'feliz', semPernas: true, armL: [-30, -40], armR: [38, 158], propR: 'phone' }],
    [I(3), { expr: 'rindo', armL: [-110, -130] }],
    [I(4), { expr: 'feliz', armL: [-30, -40] }],
    [POUSO, { expr: 'surpreso' }],
    [I(19), { expr: 'feliz', armL: [-80, -140] }],
    [I(20), { armL: [-30, -40] }],
    [I(23), { expr: 'rindo' }],
    [I(25), { expr: 'feliz', armL: [-82, -30] }],
    [I(26), { armL: [-30, -40] }],
    [I(27), { expr: 'rindo' }],
    [I(29), { expr: 'feliz', armR: [-34, 170], frente: 'R' }],
    [I(31), { expr: 'neutro' }],
  ] },
  { id: 'tico', x: 395, s: 2.1, yF: (t) => 2230 + tremeTico(t), char: ticoSuado, poses: [
    [0, { expr: 'bravo', bag: false, semPernas: true, armL: [-60, -62], armR: [60, 62] }],
    [I(3), { expr: 'surpreso' }],
    [I(4), { expr: 'cansado' }],
    [POUSO, { expr: 'surpreso' }],
    [I(18), { expr: 'bravo' }],
    [I(20), { expr: 'preocupado' }],
    [I(22), { expr: 'bravo', detalhe: 'suor' }],
    [I(28), { expr: 'preocupado' }],
    [I(30), { expr: 'forcado' }],
    [I(32), { expr: 'triste' }],
  ] },
];
const guidao = (ini, fim, cam, extra = {}) => ({ ini, fim, cena: 'vazio', cam, fundo: fundoGuidao, frente: frenteGuidao, atores: GARUPA, painel: true, ...extra });
const WIDE = (t) => [[t, 540, 960, 1]];
const CTICO = (t) => [[t, 395, 800, 1.5]];
const CLET = (t) => [[t, 765, 640, 1.5]];

/* ---------- porta do conjunto, na noite anterior ---------- */
const NA_PORTA = [
  { id: 'fiscal', x: 95, y: 1600, s: .8, flip: true, poses: [[0, { expr: 'neutro' }], [I(8), { expr: 'alerta' }]] },
  { id: 'tico', x: 330, poses: [[0, { expr: 'surpreso', detalhe: 'suor', bag: true }],
    [I(5), { expr: 'envergonhado', detalhe: null }],
    [I(6) + .9, { expr: 'triste' }],
    [I(7), { expr: 'neutro' }],
    [I(8), { expr: 'forcado', armR: [58, 170], frente: 'R' }],
    [I(9), { armR: [9, 5], frente: null }],
    [I(10), { expr: 'forcado', armR: [50, 120] }],
    [I(11), { expr: 'surpreso', armR: [9, 5] }],
    [I(12), { expr: 'preocupado', ...DOWN, armR: [18, 150], propR: 'phone' }],
    [I(13), { expr: 'forcado', head: -5 }]] },
  { id: 'lua', x: 735, s: 1.4, poses: [[0, { expr: 'preocupado', armR: [8, 150], propR: 'cup' }],
    [I(6), { expr: 'feliz' }],
    [I(7), { expr: 'pensando', armL: [-18, -150], propL: 'phone' }],
    [I(9), { expr: 'surpreso', armL: [-9, -5], propL: null, head: 5 }],
    [I(11), { expr: 'rindo', head: 0 }]] },
];
const porta = (ini, fim, cam, frente) => ({ ini, fim, cena: 'portaAberta', cam, cor: LEMBRANCA, atores: NA_PORTA, frente, painel: ini >= I(12) });
const placaEm = (t0, x = 735) => (t) => t >= t0 ? placaCrushSVG(x, 150 + 30 * sai((t - t0) / .25) - 260 * (1 - sai((t - t0) / .25))) : '';

/* ---------- telas de celular ---------- */
const moldura = (conteudo) => `<rect x="-200" y="-200" width="1480" height="2320" fill="#1c2a45"/>` + ret(190, 110, 700, 1500, '#23252f', 60) + ret(220, 170, 640, 1380, '#f7f4ef', 18, 0) + conteudo;
const telaRegra = (t0) => (t) => {
  const e = sai((t - t0) / .4), y = 600 - 110 * e;
  return moldura(txt(540, 280, 'Seu app de corridas', 34, '#55606c') + `<g opacity="${e.toFixed(2)}">` + ret(250, y, 580, 430, '#fff6e6', 24)
    + txt(540, y + 90, 'MOTOTÁXI', 60, '#2a4f8a') + txt(540, y + 170, 'libera com', 40) + txt(540, y + 256, '★★★★★', 72, '#e2a91f') + txt(540, y + 330, 'na corrida', 40) + txt(540, y + 384, 'de teste', 40) + '</g>');
};
const telaPassageiros = () => moldura(txt(540, 280, 'Corrida de teste', 40, '#55606c') + ret(250, 480, 580, 240, '#fff6e6', 24) + txt(540, 560, 'Passageiros', 50) + txt(540, 630, 'disponíveis:', 50) + txt(540, 900, '1', 240, '#c23b3b'));
const telaAudio = (t) => {
  const barras = []; for (let i = 0; i < 18; i++) { const h = 28 + Math.abs(Math.sin(i * 1.7 + t * 9)) * 92; barras.push(`<rect x="${312 + i * 26}" y="${900 - h / 2}" width="15" height="${h}" rx="7" fill="#2f8f4e"/>`); }
  return moldura(ret(220, 170, 640, 150, '#2f8f4e', 18, 0) + txt(540, 262, 'Lua', 64, '#fff') + ret(258, 800, 564, 200, '#d9f2c8', 30) + barras.join(''));
};
const pacocaLive = (t) => t >= I(23);
const fundoLive = (t) => `<rect x="-200" y="-200" width="1480" height="2320" fill="${ceu(t)}"/>` + estradaSVG(t, ceu(t), sol(t));
const ATOR_LIVE = [{ id: 'leticia', x: 540, s: 2.6, y: 2500, poses: [[0, { expr: 'rindo', semPernas: true, armL: [-70, -130], armR: [14, 8] }]] }];

/* ---------- empurrando a moto, com a câmera de frente ---------- */
const PASSO = 1.7;
const MOTO_X = 500, MOTO_Y = 1622, MOTO_S = 1.3;
const EMPURRA_X = 690, EMPURRA_S = 1.32;
// Dois segmentos: acha os ângulos do braço para a mão chegar a um ponto do mundo
function bracoAte(lado, alvo, d, x, y) {
  const s = EMPURRA_S, ombroX = x + lado * d.sw * s * .86, ombroY = y - (10 + d.thigh + d.shin + 28 + d.torso - 6) * s;
  const a = d.armU * s, b = d.armF * s, dx = alvo[0] - ombroX, dy = alvo[1] - ombroY, dist = Math.min(a + b - 2, Math.hypot(dx, dy));
  const base = Math.atan2(dx, dy) * 180 / Math.PI, abre = Math.acos(clamp01((a * a + dist * dist - b * b) / (2 * a * dist))) * 180 / Math.PI;
  const curva = Math.acos(clamp01((a * a + b * b - dist * dist) / (2 * a * b))) * 180 / Math.PI;
  const up = base + lado * abre;
  return [up, up - lado * (180 - curva)];
}
const grip = (nome, t) => { const [gx, gy] = MOTO_FRENTE[nome], sobe = Math.sin(t * PASSO * Math.PI) * 3; return [MOTO_X + gx * MOTO_S, MOTO_Y + gy * MOTO_S + sobe]; };
const empurra = (expr, detalhe) => [{ id: 'tico', x: EMPURRA_X, s: EMPURRA_S, char: ticoSuado,
  yF: () => CHAO,
  dyn: (t) => { const f = Math.sin(t * PASSO * Math.PI); return { armL: bracoAte(-1, grip('gripL', t), CHARS.tico, EMPURRA_X, CHAO), armR: bracoAte(1, grip('gripR', t), CHARS.tico, EMPURRA_X, CHAO), liftL: Math.max(0, f), liftR: Math.max(0, -f), lean: -5 }; },
  poses: [[0, { expr, detalhe, bag: false, frente: 'R', head: -4 }]] }];
const fundoEmpurra = (ceuCor, solPos) => (t) => {
  // Rua em perspectiva, avançando no ritmo de quem anda
  const ru = estradaSVG(t * .1, ceuCor, solPos);
  return ru + `<rect x="-200" y="${CHAO + 180}" width="1480" height="400" fill="#55535a"/>`;
};
const frenteEmpurra = (forca) => (t) => motoFrenteSVG(MOTO_X, MOTO_Y, MOTO_S, { giro: t * 80 }) + fedorSVG(EMPURRA_X, 730 + Math.sin(t * 3) * 6, t, forca);

/* ---------- Planos ---------- */
const ep02Planos = [
  // Abertura
  guidao(0, I(2), WIDE(0), { painel: false }),
  guidao(I(2), I(3), CTICO(I(2)), { painel: false }),
  guidao(I(3), I(4), WIDE(I(3)), { painel: false }),
  // Cena 1: na noite anterior
  porta(I(4), I(5), [[I(4), 735, C_LUA, 1.7]], placaEm(I(4) + .2)),
  porta(I(5), I(6), [[I(5), 330, C_TICO, 1.8]]),
  porta(I(6), I(7), [[I(6), 540, 760, 1.15]]),
  porta(I(7), I(8), [[I(7), 735, C_LUA, 1.8]]),
  porta(I(8), I(9), [[I(8), 330, C_TICO, 1.8]]),
  porta(I(9), I(10), [[I(9), 735, C_LUA, 1.9]]),
  porta(I(10), I(11), [[I(10), 330, C_TICO, 1.9]]),
  porta(I(11), I(12), [[I(11), 480, 880, 1.02]]),
  // Cena 2: a regra das cinco estrelas
  { ini: I(12), fim: I(12) + (E(12) - I(12)) * .72, cena: 'vazio', cam: [[I(12), 540, 960, 1], [E(12), 540, 880, 1.12, 1.6]], fundo: telaRegra(I(12)) },
  porta(I(12) + (E(12) - I(12)) * .72, I(13), [[I(12), 330, C_TICO, 1.8]]),
  porta(I(13), I(14) - 1, [[I(13), 225, 1130, 1.18]]),
  // Cena 3: cinco da manhã
  { ini: I(14) - 1, fim: I(14) - .5, cena: 'vazio', cam: [[I(14) - 1, 540, 960, 1]], fundo: telaPassageiros },
  { ini: I(14) - .5, fim: I(14), cena: 'ruaNoite', cam: [[I(14) - .5, 540, 960, 1.02]], fundo: () => motoSVG(620, CHAO + 10, 1.9),
    atores: [{ id: 'leticia', x: 250, s: 1.32, poses: [[0, { expr: 'feliz', armR: [18, 150], propR: 'phone' }]] }, { id: 'tico', x: 880, poses: [[0, { expr: 'cansado', bag: false }]] }], painel: true },
  ...[[14, 880, 'tico', C_TICO], [15, 250, 'leticia', 880], [16, 540, null, 960], [17, 880, 'tico', C_TICO]].map(([n, cx, , cy], i, arr) => ({
    ini: I(n), fim: n === 17 ? POUSO : I(n + 1), cena: 'ruaNoite',
    cam: [[I(n), cx, cy, n === 16 ? 1.02 : 1.8]], fundo: () => motoSVG(620, CHAO + 10, 1.9), painel: true,
    atores: [{ id: 'leticia', x: 250, s: 1.32, poses: [[0, { expr: 'feliz', armR: [18, 150], propR: 'phone' }], [I(15), { armL: [-34, 110] }], [I(16), { armL: [-9, -5] }]] },
      { id: 'tico', x: 880, poses: [[0, { expr: 'cansado', bag: false }], [I(17), { expr: 'neutro', armR: [40, 70] }]] }] })),
  guidao(POUSO, I(18), WIDE(POUSO)),
  // As voltas
  { ini: I(18), fim: I(19) - .35, cena: 'vazio', cam: [[I(18), 540, 960, 1], [I(19), 540, 880, 1.12, 1.6]], fundo: (t) => mapaSVG(.1 + .25 * clamp01((t - I(18)) / 2), 0, t) },
  guidao(I(19) - .35, I(19), CTICO(I(18))),
  guidao(I(19), I(20), CLET(I(19))),
  guidao(I(20), I(21), CTICO(I(20))),
  { ini: I(21), fim: I(22), cena: 'vazio', cam: [[I(21), 540, 960, 1.04]], fundo: (t) => mapaSVG(.35 + .3 * clamp01((t - I(21)) / 2), 0, t) },
  guidao(I(22), I(23), CTICO(I(22))),
  { ini: I(23), fim: I(24), cena: 'vazio', cam: [[I(23), 540, 900, 1]], fundo: fundoLive, atores: ATOR_LIVE, live: true },
  guidao(I(24), I(25), CTICO(I(24)), { frente: (t) => frenteGuidao(t) + placa(1120 - (t - I(24)) * 900, 760, 190, 110, '#fff6e6', ['Trago a pessoa', 'amada em 3x', 'no Pix'], 18) }),
  guidao(I(25), I(26), CLET(I(25))),
  guidao(I(26), I(27), CTICO(I(26)), { frente: (t) => frenteGuidao(t) + gasolinaSVG(610, 1090, .62, .3) }),
  { ini: I(27), fim: I(28), cena: 'vazio', cam: [[I(27), 540, 900, 1]], fundo: fundoLive, atores: ATOR_LIVE, live: true },
  { ini: I(28), fim: I(28) + (E(28) - I(28)) * .4, cena: 'vazio', cam: [[I(28), 540, 960, 1.1]], fundo: (t) => mapaSVG(.65 + .3 * clamp01((t - I(28)) / 2), 0, t), relogio: '7h20' },
  guidao(I(28) + (E(28) - I(28)) * .4, I(29), CTICO(I(28))),
  guidao(I(29), E(29) + .05, CLET(I(29)), { estrelas: true }),
  // Silêncio: estrelas, ponteiro, rosto
  { ini: E(29) + .05, fim: E(29) + .4, cena: 'vazio', cam: [[E(29), 540, 960, 1]], fundo: () => `<rect x="-200" y="-200" width="1480" height="2320" fill="#23252f"/>`, estrelasCheias: true },
  { ini: E(29) + .4, fim: E(29) + .75, cena: 'vazio', cam: [[E(29) + .4, 540, 960, 1], [E(29) + .75, 540, 960, 1.14, .35]], fundo: (t) => `<rect x="-200" y="-200" width="1480" height="2320" fill="#efc76c"/>` + gasolinaSVG(540, 900, 3, .08 + Math.sin(t * 34) * .02) },
  guidao(E(29) + .75, I(31), CTICO(E(29))),
  guidao(I(31), I(32), CLET(I(31))),
  guidao(I(32), FISCAL_LONGE, [[I(32), 395, 780, 1.7]]),
  { ini: FISCAL_LONGE, fim: I(33), cena: 'portaDiaAberta', cam: [[FISCAL_LONGE, 300, 1270, 1.8]], atores: [{ id: 'fiscal', x: 300, y: 1600, s: .95, flip: true, poses: [[0, { expr: 'neutro' }]] }] },
  // Cena 3b: o prédio chique e a volta a pé
  { ini: I(33), fim: TOSSE, cena: 'predioChique', cam: [[I(33), 540, 1000, 1.02]], painel: true, nota50: true,
    fundo: () => motoSVG(330, CHAO + 40, 1.7),
    atores: [{ id: 'tico', x: 145, char: ticoSuado, poses: [[0, { expr: 'cansado', detalhe: 'suor', bag: false }]] },
      { id: 'leticia', x: 720, s: 1.32, movX: [I(33) + 1, I(33) + 2.4, 720, 560], poses: [[0, { expr: 'feliz', armR: [50, 100], propR: 'phone' }]] }] },
  { ini: TOSSE, fim: TOSSE + .55, cena: 'vazio', cam: [[TOSSE, 540, 960, 1.02]], fundo: (t) => `<rect x="-200" y="-200" width="1480" height="2320" fill="#efc76c"/>` + gasolinaSVG(540 + Math.sin(t * 60) * 8, 900, 3, .1 * (1 - clamp01((t - TOSSE) / .4))) },
  { ini: TOSSE + .55, fim: I(34), cena: 'predioChique', cam: [[TOSSE + .55, 245, 870, 1.5]], painel: true, nota50: true, relogio: '7h31',
    fundo: () => motoSVG(330, CHAO + 40, 1.7), atores: [{ id: 'tico', x: 145, char: ticoSuado, poses: [[0, { expr: 'surpreso', detalhe: 'suor', bag: false, armR: [60, 70] }]] }] },
  { ini: I(34), fim: MAPA_PE, cena: 'predioChique', cam: [[I(34), 200, 860, 1.8]], painel: true, nota50: true,
    fundo: () => motoSVG(330, CHAO + 40, 1.7), atores: [{ id: 'tico', x: 145, char: ticoSuado, poses: [[0, { expr: 'triste', detalhe: 'suor', bag: false, armR: [60, 70], head: 5 }]] }] },
  { ini: MAPA_PE, fim: MONTAGEM, cena: 'vazio', cam: [[MAPA_PE, 540, 960, 1]], fundo: (t) => mapaSVG(1, sai((t - MAPA_PE) / 1.1), t), recalc: true },
  // Montagem, com a referência de enquadramento do autor
  { ini: MONTAGEM, fim: MONTAGEM + 1, cena: 'vazio', cam: [[MONTAGEM, 560, 930, 1.02]], fundo: fundoEmpurra(mistura('#f4a65a', '#ffd9a0', .4), [810, 560]), atores: empurra('cansado', 'suor'), frente: frenteEmpurra(.45), painel: true, nota50: true },
  { ini: MONTAGEM + 1, fim: MONTAGEM + 2, cena: 'vazio', cam: [[MONTAGEM + 1, 640, 800, 1.32]], fundo: fundoEmpurra(mistura('#f4a65a', '#ffd9a0', .75), [260, 430]), atores: empurra('bravo', 'suor'), frente: frenteEmpurra(.75), painel: true, nota50: true },
  { ini: MONTAGEM + 2, fim: LUA_LONGE, cena: 'vazio', cam: [[MONTAGEM + 2, 560, 930, 1.02]], fundo: fundoEmpurra('#ffd9a0', [800, 340]), atores: empurra('cansado', 'suor'), frente: frenteEmpurra(1), painel: true, nota50: true },
  // Cena 4: Lua sozinha, de longe
  { ini: LUA_LONGE, fim: I(35), cena: 'portaDiaAberta', cam: [[LUA_LONGE, 540, 1190, 1.15]], painel: true, nota50: true, cartaz: '7h58',
    atores: [{ id: 'fiscal', x: 170, y: 1600, s: .8, flip: true, poses: [[0, { expr: 'neutro' }]] }, { id: 'lua', x: 540, s: 1.4, poses: [[0, { expr: 'feliz', detalhe: 'brilho', armR: [8, 150], propR: 'cup' }]] }] },
  { ini: I(35), fim: I(35) + (E(35) - I(35)) * .55, cena: 'portaDiaAberta', cam: [[I(35), 540, 880, 1.45]], painel: true, nota50: true,
    atores: [{ id: 'lua', x: 540, s: 1.4, poses: [[0, { expr: 'feliz', detalhe: 'brilho', armR: [8, 150], propR: 'cup', armL: [-18, -150], propL: 'phone' }]] }] },
  { ini: I(35) + (E(35) - I(35)) * .55, fim: RISO, cena: 'vazio', cam: [[I(35), 540, 960, 1.02]], fundo: telaAudio },
  // Riso que engasga: sem olhar para a câmera
  { ini: RISO, fim: VOTO, cena: 'rua', cam: [[RISO, 330, 900, 1.5], [VOTO, 330, 820, 2, 3.2]], painel: true, nota50: true,
    fundo: () => motoSVG(780, CHAO + 10, 1.9),
    frente: (t) => fedorSVG(330, 640 + Math.sin(t * 3) * 5, t, 1) + (t > RISO + 1 && t < RISO + 2.5 ? fedorSVG(452, 900, t, .55) : ''),
    atores: [{ id: 'tico', x: 330, char: ticoSuado, poses: [[0, { expr: 'envergonhado', detalhe: 'suor', bag: false, armR: [18, 150], propR: 'phone' }],
      [RISO + .8, { expr: 'lado', propR: null, armR: [112, 196], head: -17, lean: 5 }],
      [RISO + 1.7, { expr: 'surpreso' }],
      [RISO + 2.6, { expr: 'envergonhado', armR: [14, 8], head: 2, lean: 0 }]] }] },
  // Votação
  { ini: VOTO, fim: I(37) - 1.4, cena: 'rua', cam: [[VOTO, 540, 665, 1.28]], cor: (t) => 1 - sai((t - VOTO) / .4),
    frente: (t) => fedorSVG(540, 600 + Math.sin(t * 3) * 5, t, .7),
    atores: [{ id: 'tico', x: 540, char: ticoSuado, poses: [[0, { expr: 'forcado', detalhe: 'suor', bag: false, armL: [-18, 60], armR: [14, 8], head: 4 }], [E(36), { expr: 'lado', armR: [112, 196], head: -17, lean: 5 }]] }] },
  // Cena 5: o vendedor de paçoca
  { ini: I(37) - 1.4, fim: I(37) - .75, cena: 'rua', cam: [[I(37) - 1.4, 540, 1000, 1.02]], canto: true,
    fundo: () => bancoSVG(540), frente: () => caixaPacocaSVG(540, 1500),
    atores: [{ id: 'vendedor', x: 540, y: CHAO - 20, s: 1.32, poses: [[0, { expr: 'neutro', sentado: true, legL: [-40, -6], legR: [40, 6], armL: [-16, 20], armR: [18, 150], propR: 'phone' }]] }] },
  { ini: I(37) - .75, fim: I(37), cena: 'vazio', cam: [[I(37) - .75, 540, 960, 1]], canto: true,
    fundo: () => `<rect x="-200" y="-200" width="1480" height="2320" fill="#ffd9a0"/>` + estradaSVG(0, '#ffd9a0', [800, 340]),
    atores: [{ id: 'ticoNoCelular', x: 540, y: 2100, s: 2.1, char: () => ticoSuado(LUA_LONGE), poses: [[0, { expr: 'triste', detalhe: 'suor', bag: false, semPernas: true }]] }],
    frente: () => `<path fill-rule="evenodd" d="M-200 -200 H1280 V2120 H-200Z M220 170 V1550 H860 V170Z" fill="#1c2a45"/>` + `<rect x="190" y="110" width="700" height="1500" rx="60" fill="none" stroke="#23252f" stroke-width="60"/>` + ret(250, 210, 230, 70, '#c23b3b', 12) + txt(365, 258, 'AO VIVO', 36, '#fff') },
  { ini: I(37), fim: COMPRA, cena: 'rua', cam: [[I(37), 540, 860, 1.75]], canto: true,
    fundo: () => bancoSVG(540), frente: () => caixaPacocaSVG(540, 1500),
    atores: [{ id: 'vendedor', x: 540, y: CHAO - 20, s: 1.32, poses: [[0, { expr: 'pensando', sentado: true, legL: [-40, -6], legR: [40, 6], armL: [-16, 20], armR: [18, 150], propR: 'phone' }], [E(37) - .1, { expr: 'feliz' }]] }] },
  { ini: COMPRA, fim: FIM_DO_EP, cena: 'vazio', cam: [[COMPRA, 540, 960, 1]], canto: true, fundo: (t) => moldura(ret(250, 330, 580, 500, '#3a3a40', 18) + txt(540, 600, 'Mente Milionária', 46, '#ffd83a') + ret(290, 930, 500, 170, t > COMPRA + .55 ? '#1f9e33' : '#35d04a', 26) + txt(540, 1035, 'Comprar curso', 50, '#fff') + `<circle cx="${(800 - 60 * sai((t - COMPRA) / .5)).toFixed(1)}" cy="${(1340 - 240 * sai((t - COMPRA) / .5)).toFixed(1)}" r="56" fill="#c98f68" stroke="${OUT}" stroke-width="6"/>`) },
];
function bancoSVG(x) { return ret(x - 240, CHAO - 150, 480, 34, '#7a5a44', 6) + ret(x - 210, CHAO - 116, 26, 126, '#55606c', 0) + ret(x + 184, CHAO - 116, 26, 126, '#55606c', 0); }
function caixaPacocaSVG(x, y) { return `<g transform="translate(${x} ${y})">` + shape('M-120 -60 L120 -60 L104 40 L-104 40Z', '#d9a860') + txt(0, -10, 'PAÇOCA', 34, '#7a3f1f') + txt(0, 26, 'R$ 2', 26, '#7a3f1f') + '</g>'; }

/* ---------- Telas sobre a imagem ---------- */
const nota = (t) => t < I(33) + .35 ? '-0,3' : '5,0';
const dias = (t) => t < I(14) - 1 ? 92 : 93;
const audiencia = (t) => t < I(18) ? 11 : t < I(19) ? 11 + Math.round(69 * clamp01((t - I(18)) / (I(19) - I(18)))) : t < I(27) ? 80 + Math.round(120 * clamp01((t - I(19)) / (I(27) - I(19)))) : 200 + Math.round(140 * clamp01((t - I(27)) / .8));
const painel = (t, u, pb) => {
  u.cartao(30, 70, 500, 138, pb ? '#222222' : '#2a1f22');
  u.texto(`Desempregado: ${dias(t)} dias`, 56, 105, 32, '#ffffff', 'left');
  u.texto(`Nota: ${nota(t)}`, 56, 148, 32, nota(t) === '5,0' ? (pb ? '#ffffff' : '#7fe08a') : '#ffffff', 'left');
  u.texto('Dívida: R$ 0', 56, 188, 32, '#ffffff', 'left');
};
const chipLive = (t, u, x = 760, y = 90) => { u.cartao(x, y, 270, 76, '#c23b3b'); u.texto(`Ao vivo: ${audiencia(t)}`, x + 135, y + 39, 34, '#ffffff'); };
const nome = (u, s, dur, txtN, cor = '#a8b94c', y = 240) => { u.g.globalAlpha = Math.min(1, s / .2, Math.max(0, (dur - s) / .2)); u.cartao(90, y, 900, 90, cor); u.texto(txtN, 540, y + 45, 38, '#2a1f22'); u.g.globalAlpha = 1; };
const cartaz = (u, tx, cor = '#ffd83a', w = 700) => { u.cartao(540 - w / 2, 250, w, 120, '#2a1f22'); u.texto(tx, 540, 310, 58, cor); };

const ep02Telas = [
  // Abertura: nomes e audiência
  { ini: .1, fim: I(2), desenha: (p, s, u) => nome(u, s, I(2) - .1, 'Letícia Campos, mentora', '#f2c14e') },
  { ini: I(2), fim: I(3), desenha: (p, s, u) => nome(u, s, I(3) - I(2), 'Tiago Almeida, mototaxista há 3 minutos') },
  { ini: 0, fim: I(4), desenha: (p, s, u) => chipLive(s, u) },
  { ini: E(3) + .1, fim: I(4), desenha: (p, s, u) => { u.g.globalAlpha = Math.min(1, s / .3); cartaz(u, 'Na noite anterior', '#ffffff', 720); u.g.globalAlpha = 1; } },
  // Lembrança: bordas escurecidas até as 5h
  { ini: I(4), fim: I(12), desenha: (p, s, u) => { const v = u.g.createRadialGradient(540, 860, 420, 540, 960, 1120); v.addColorStop(0, 'rgba(20,20,20,0)'); v.addColorStop(1, 'rgba(20,20,20,.62)'); u.g.fillStyle = v; u.g.fillRect(0, 0, 1080, 1920); } },
  { ini: I(12) + (E(12) - I(12)) * .72, fim: I(14) - 1, desenha: (p, s, u) => { const v = u.g.createRadialGradient(540, 860, 420, 540, 960, 1120); v.addColorStop(0, 'rgba(20,20,20,0)'); v.addColorStop(1, 'rgba(20,20,20,.62)'); u.g.fillStyle = v; u.g.fillRect(0, 0, 1080, 1920); } },
  // Cartão das 5h
  { ini: I(14) - 1, fim: I(14) + .3, desenha: (p, s, u) => { u.g.globalAlpha = Math.min(1, s / .2, (1.3 - s) / .35); cartaz(u, '5h da manhã', '#ffd83a', 560); u.g.globalAlpha = 1; } },
  // Mapa
  ...ep02Planos.filter((pl) => pl.fundo && String(pl.fundo).includes('mapaSVG(.')).map((pl) => ({ ini: pl.ini, fim: pl.fim, desenha: (p, s, u) => { u.cartao(240, 110, 600, 96, '#2a4f8a'); u.texto('Recalculando...', 540, 158, 46, '#ffffff'); } })),
  ...ep02Planos.filter((pl) => pl.relogio).map((pl) => ({ ini: pl.ini, fim: pl.fim, desenha: (p, s, u) => { u.cartao(760, 220, 270, 90, '#2a1f22'); u.texto(pl.relogio, 895, 265, 52, '#ff6a5a'); } })),
  ...ep02Planos.filter((pl) => pl.recalc).map((pl) => ({ ini: pl.ini, fim: pl.fim, desenha: (p, s, u) => { u.cartao(150, 130, 780, 110, '#2a4f8a'); u.texto('Recalculando: a pé. 27 min', 540, 186, 44, '#ffffff'); } })),
  // Live em tela cheia
  ...ep02Planos.filter((pl) => pl.live).map((pl) => ({ ini: pl.ini, fim: pl.fim, desenha: (p, s, u) => {
    const t = pl.ini + s; chipLive(t, u, 40, 90);
    u.g.fillStyle = 'rgba(20,20,30,.55)'; u.g.fillRect(40, 1120, 900, 160);
    u.texto('maria_gratidao: chorei', 70, 1160, 36, '#ffffff', 'left');
    u.texto('paçoca_do_nilton: funciona msm?', 70, 1230, 36, '#ffd83a', 'left');
  } })),
  // Audiência durante as voltas
  { ini: POUSO, fim: FISCAL_LONGE, desenha: (p, s, u) => { const t = POUSO + s; if (!ep02Planos.some((pl) => pl.live && t >= pl.ini && t < pl.fim) && !ep02Planos.some((pl) => t >= pl.ini && t < pl.fim && (String(pl.fundo || '').includes('mapa') || pl.estrelasCheias || String(pl.fundo || '').includes('gasolinaSVG')))) chipLive(t, u); } },
  // Estrelas à espera do polegar
  ...ep02Planos.filter((pl) => pl.estrelas || pl.estrelasCheias).map((pl) => ({ ini: pl.ini, fim: pl.fim, desenha: (p, s, u) => { const y = pl.estrelasCheias ? 860 : 1050, tam = (pl.estrelasCheias ? 150 : 78) * (1 + Math.sin(s * 9) * .05); if (!pl.estrelasCheias) u.cartao(250, y - 66, 580, 132, '#2a1f22'); u.texto('★★★★★', 540, y, tam, '#ffd83a'); } })),
  // Cartões e placares
  ...ep02Planos.filter((pl) => pl.cartaz).map((pl) => ({ ini: pl.ini, fim: pl.fim, desenha: (p, s, u) => { u.cartao(690, 90, 340, 118, '#2a1f22'); u.texto(pl.cartaz, 860, 150, 62, '#ffd83a'); } })),
  // Depoimento da corrida concluída
  { ini: I(33), fim: I(33) + 1.4, desenha: (p, s, u) => { u.g.globalAlpha = Math.min(1, s / .35, (1.4 - s) / .3); u.cartao(150, 260, 780, 120, '#1f9e33'); u.texto('Corrida concluída. Mototáxi liberado', 540, 320, 34, '#ffffff'); u.g.globalAlpha = 1; } },
  // Notificação do áudio
  { ini: I(35), fim: I(35) + 1.5, desenha: (p, s, u) => { u.g.globalAlpha = Math.min(1, s / .35, (1.5 - s) / .3); u.cartao(130, 260, 820, 110, '#2f8f4e'); u.texto('Lua: áudio 0:06', 540, 315, 46, '#ffffff'); u.g.globalAlpha = 1; } },
  // Painel
  ...ep02Planos.filter((pl) => pl.painel).map((pl) => ({ ini: pl.ini, fim: pl.fim, desenha: (p, s, u) => painel(pl.ini + s, u, pl.cor && pl.cor(pl.ini + s) < .5) })),
  // Votação: só as palavras que o público comenta em destaque
  { ini: VOTO, fim: I(37) - 1.4, desenha: (p, s, u) => {
    u.g.fillStyle = 'rgba(0,0,0,.8)'; u.g.fillRect(0, 0, 1080, 910);
    u.g.globalAlpha = u.sai(s / .35);
    u.texto('Comenta sua escolha:', 540, 280, 58, '#ffffff');
    const opcao = (y, cor, peq, grande, peq2, tinta, fase) => {
      const e = 1 + .03 * Math.sin(s * 4.2 + fase);
      u.g.save(); u.g.translate(540, y + 120); u.g.scale(e, e); u.g.translate(-540, -y - 120);
      u.cartao(90, y, 900, 240, cor);
      u.texto(peq, 540, y + 42, 40, tinta); u.texto(grande, 540, y + 122, 112, tinta); if (peq2) u.texto(peq2, 540, y + 204, 40, tinta);
      u.g.restore();
    };
    opcao(360, '#35d04a', 'Tentar dar a', 'CARONA', 'Fedida', '#08280d', 0);
    opcao(630, '#ff4f6e', 'Dar uma Fugida para o', 'CHUVEIRO', '', '#3a0612', Math.PI);
    u.g.globalAlpha = 1;
    painel(VOTO + s, u, true);
    u.cartao(240, 1500, 600, 80, '#d9d9d9'); u.texto('Tiago Almeida, nota 5,0', 540, 1540, 38, '#111111');
  } },
  // Pergunta no canto, depois da votação
  ...ep02Planos.filter((pl) => pl.canto).map((pl) => ({ ini: pl.ini, fim: pl.fim, desenha: (p, s, u) => { u.cartao(620, 120, 410, 110, 'rgba(255,246,230,.95)'); u.texto('Carona', 825, 156, 34, '#1f9e33'); u.texto('ou Chuveiro?', 825, 198, 34, '#e0304f'); } })),
];

const EPISODIO = {
  duracao: FIM_DO_EP,
  falas: FALAS,
  planos: ep02Planos,
  telas: ep02Telas,
  latidos: [E(5) - .1, E(10) - .05, E(13) + .05, FISCAL_LONGE + .2, E(36) - .2],
  impactos: [VOA - .02, POUSO + .36, FISCAL_LONGE + .2, FISCAL_LONGE + .52, COMPRA + .55],
  destaques: { 1: 'ninguém', 2: 'nome', 3: 'voa', 5: 'temporário', 8: 'mototáxi', 10: 'oito', 12: 'estrelas', 13: 'fácil', 15: 'agradecer', 16: 'estrelas', 18: 'três', 19: 'volta', 21: 'pobre', 22: 'cabo', 23: 'bala', 24: 'vez', 26: 'emprestada', 27: 'moto', 29: 'salvou', 32: 'curso', 33: 'mototáxi', 34: 'companheira', 35: 'mudar', 36: 'sentir', 37: 'fácil' },
};
