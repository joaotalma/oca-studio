'use strict';
ESTILO_RIG = 'classico'; // fixado na Oca Studio (2026-11-12): episódio feito com o rig clássico
// Episódio 2: dados de planos, poses e telas. Falas e tempos vêm de falas.js, gerado do roteiro.
// Os planos se prendem às falas, então acompanham qualquer ajuste de tempo no roteiro.
const sai = (p) => { p = Math.max(0, Math.min(1, p)); return 1 - (1 - p) * (1 - p); };
const clamp01 = (p) => Math.max(0, Math.min(1, p));
const F = Object.fromEntries(FALAS.map((f) => [f.n, f]));
const I = (n) => F[n].ini, E = (n) => F[n].fim;
const DOWN = { armL: [-9, -5], armR: [9, 5] };
const SEM_COR = () => .1;
const C_TICO = 897, C_LUA = 955;
const FIM_DO_EP = E(39) + 1.35;

// Tempos das ações sem fala
const VOA = E(3) - .32;                 // a lombada chega no "voa"
const POUSO = E(19) + .12;              // volta à lombada, na cena das 5h
const FIM_POUSO = I(20);
const TOSSE = E(35) + .1;
const MAPA_PE = E(36) + .12;
const MONTAGEM = MAPA_PE + 1.2;
const LUA_LONGE = MONTAGEM + 3;
const RISO = E(37) + .1;
const VOTO = I(38);
const COMPRA = E(39) + .1;

// Céu da manhã: da madrugada ao sol alto
const mistura = (a, b, q) => { const p = (s, i) => parseInt(s.substr(1 + i * 2, 2), 16); return '#' + [0, 1, 2].map((i) => Math.round(p(a, i) + (p(b, i) - p(a, i)) * q).toString(16).padStart(2, '0')).join(''); };
const manha = (t) => clamp01((t - POUSO) / (E(34) - POUSO));
const ceu = (t) => { if (t < I(4)) return '#c98a6a'; const q = manha(t); return q < .5 ? mistura('#c98a6a', '#f4a65a', q * 2) : mistura('#f4a65a', '#ffd9a0', (q - .5) * 2); };
const sol = (t) => { const q = t < I(4) ? 0 : manha(t); return [790, 830 - 460 * q]; };

// Suor: a camiseta escurece e o fedor cresce, do treino até o fim
const suorEm = (t) => t < I(24) ? 0 : t < E(35) ? .15 + .35 * clamp01((t - I(24)) / (E(35) - I(24))) : clamp01(.5 + .5 * (t - MONTAGEM) / 3);
const cacheSuado = {};
const ticoSuado = (t) => { const n = Math.round(suorEm(t) * 6); return cacheSuado[n] || (cacheSuado[n] = { ...CHARS.tico, cloth: mistura('#a8b94c', '#6d7c2c', n / 6), clothD: mistura('#7f9419', '#4f5c1f', n / 6) }); };

/* ---------- braço que alcança um ponto do mundo ---------- */
function ombroDe(lado, d, x, y, s, pernas) {
  const perna = (a, lift) => { const f = 1 - .34 * (lift || 0); return 10 + d.thigh * f * (pernas.sentado ? .3 : 1) * Math.cos(a[0] * Math.PI / 180) + d.shin * f * Math.cos(a[1] * Math.PI / 180); };
  const raiz = -(Math.max(perna(pernas.legL, pernas.liftL), perna(pernas.legR, pernas.liftR)) + SHOE_H[d.shoe]);
  return [x + s * lado * (d.sw - d.ru * .62), y + s * (raiz - d.torso + d.ru * 1.05)];
}
function bracoAte(lado, alvo, d, x, y, s, pernas) {
  const [ox, oy] = ombroDe(lado, d, x, y, s, pernas);
  const a = d.armU * s, b = d.armF * s, dx = alvo[0] - ox, dy = alvo[1] - oy, dist = Math.min(a + b - 2, Math.hypot(dx, dy));
  const base = Math.atan2(dx, dy) * 180 / Math.PI, abre = Math.acos(clamp01((a * a + dist * dist - b * b) / (2 * a * dist))) * 180 / Math.PI;
  const curva = Math.acos(clamp01((a * a + b * b - dist * dist) / (2 * a * b))) * 180 / Math.PI;
  // Cotovelo para baixo: o braço desce do ombro e o antebraço sobe até a manopla
  const up = base - lado * abre;
  return [up, up + lado * (180 - curva)];
}

/* ---------- a moto de frente, com os dois sentados ---------- */
const voo = (t) => t < I(4) ? (t > VOA ? sai((t - VOA) / .34) + Math.sin((t - VOA) * 5) * .012 : 0)
  : (t >= POUSO && t < FIM_POUSO ? Math.max(0, 1 - clamp01((t - POUSO) / .38) ** 2) : 0);
const choque = (t) => { const s = t - (POUSO + .38); return s > 0 && s < .36 ? Math.sin(s * 42) * 13 * (1 - s / .36) : 0; };
const ANDA_X = 540, ANDA_Y = 1650, ANDA_S = 1.35;
const altura = (t) => voo(t) * 310;
// Preparação antes de subir e acomodação depois do pouso: a suspensão afunda e os corpos afundam mais
const afunda = (t) => {
  const pre = t > VOA - .18 && t <= VOA ? Math.sin((t - VOA + .18) / .18 * Math.PI) : 0;
  const s = t - (POUSO + .38), pos = s > 0 && s < .42 ? Math.sin(s / .42 * Math.PI) * (1 - s / .84) : 0;
  return Math.max(pre, pos);
};
const treme = (t, fase = 0) => voo(t) > .02 ? 0 : Math.sin(t * 19 + fase) * 4 + choque(t);
const motoY = (t) => ANDA_Y - altura(t) + treme(t) + afunda(t) * 9;
const fundoMoto = (t) => {
  const v = voo(t), velocidade = t < I(4) ? Math.min(t, VOA + .05) : t;
  return estradaSVG(velocidade, ceu(t), sol(t))
    + `<ellipse cx="${ANDA_X}" cy="${ANDA_Y + 8}" rx="${(190 * (1 - v * .35)).toFixed(1)}" ry="${(32 * (1 - v * .4)).toFixed(1)}" fill="#2a1f22" opacity="${(.34 - v * .14).toFixed(2)}"/>`
    + motoRetaSVG(ANDA_X, motoY(t), ANDA_S, { parte: 'fundo', giro: t * 300 });
};
const manopla = (n, t) => [ANDA_X + MOTO_RETA[n][0] * ANDA_S, motoY(t) + (MOTO_RETA[n][1] + 2) * ANDA_S];
const punho = (p) => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="20" fill="${CHARS.tico.skin}" stroke="${OUT}" stroke-width="3.4"/>`;
const frenteMoto = (t) => motoRetaSVG(ANDA_X, motoY(t), ANDA_S, { parte: 'frente', giro: t * 300 }) + punho(manopla('gripL', t)) + punho(manopla('gripR', t));
// Pés nas pedaleiras: joelhos dobrados e canela encurtada pela perspectiva
const PERNAS_TICO = { sentado: true, legL: [-62, -9], legR: [62, 9], liftL: 1, liftR: 1 };
const TICO_S = 1.6, TICO_PE = 1 * -112 * ANDA_S;
const ticoY = (t) => motoY(t) + TICO_PE + afunda(t) * 9;
// A Letícia fica quase toda atrás dele, com o quadril no banco: só cabeça, ombro, celular e uma perna aparecem
const LET_X = 646, LET_S = 1.42, LET_PE = -122 * ANDA_S;
const letY = (t) => motoY(t) + LET_PE + afunda(Math.max(0, t - .05)) * 14;
const GARUPA = [
  { id: 'leticia', x: LET_X, s: LET_S, yF: letY, dyn: (t) => ({ head: voo(t) > .05 && voo(Math.max(0, t - .1)) < .9 ? 4 : 0 }), poses: [
    [0, { expr: 'feliz', sentado: true, legL: [-40, -6], legR: [66, 6], liftL: 1, liftR: 1, lean: 9, armL: [-14, -8], armR: [44, 150], propR: 'phone' }],
    [I(3), { expr: 'rindo' }],
    [I(4), { expr: 'feliz' }],
    [POUSO, { expr: 'surpreso' }],
    [I(21), { expr: 'feliz' }],
    [I(25), { expr: 'rindo' }],
    [I(27), { expr: 'feliz' }],
    [I(29), { expr: 'rindo' }],
    [I(31), { expr: 'feliz', armR: [-16, 172], frente: 'R' }],
    [I(33), { expr: 'neutro' }],
  ] },
  { id: 'tico', x: ANDA_X, s: TICO_S, yF: ticoY, char: ticoSuado,
    dyn: (t) => ({ ...PERNAS_TICO, armL: bracoAte(-1, manopla('gripL', t), CHARS.tico, ANDA_X, ticoY(t), TICO_S, PERNAS_TICO), armR: bracoAte(1, manopla('gripR', t), CHARS.tico, ANDA_X, ticoY(t), TICO_S, PERNAS_TICO), lean: 0 }),
    poses: [
    [0, { expr: 'bravo', bag: false }],
    [I(3), { expr: 'surpreso' }],
    [I(4), { expr: 'cansado' }],
    [POUSO, { expr: 'surpreso' }],
    [I(20), { expr: 'bravo' }],
    [I(22), { expr: 'preocupado' }],
    [I(24), { expr: 'bravo', detalhe: 'suor' }],
    [I(30), { expr: 'preocupado' }],
    [I(32), { expr: 'forcado' }],
    [I(34), { expr: 'triste' }],
  ] },
];
const andando = (ini, fim, cam, extra = {}) => ({ ini, fim, cena: 'vazio', cam, fundo: fundoMoto, frente: frenteMoto, atores: GARUPA, painel: true, ...extra });
const WIDE = (t) => [[t, 545, 930, 1.04]];
const CTICO = (t) => [[t, ANDA_X, 790, 1.7]];
const CLET = (t) => [[t, 690, 770, 1.75]];

/* ---------- porta do conjunto, na noite anterior ---------- */
const NA_PORTA = [
  { id: 'fiscal', x: 95, y: 1600, s: .8, flip: true, poses: [[0, { expr: 'neutro' }], [I(10), { expr: 'alerta' }]] },
  { id: 'tico', x: 330, poses: [[0, { expr: 'surpreso', detalhe: 'suor', bag: true }],
    [I(5), { expr: 'envergonhado', detalhe: null }],
    [E(6) + .05, { expr: 'triste' }],
    [I(8), { expr: 'surpreso' }],
    [I(9), { expr: 'neutro' }],
    [I(10), { expr: 'forcado', armR: [58, 170], frente: 'R' }],
    [I(11), { armR: [9, 5], frente: null }],
    [I(12), { expr: 'forcado', armR: [50, 120] }],
    [I(13), { expr: 'surpreso', armR: [9, 5] }],
    [I(14), { expr: 'preocupado', ...DOWN, armR: [18, 150], propR: 'phone' }],
    [I(15), { expr: 'forcado', head: -5 }]] },
  { id: 'lua', x: 735, s: 1.4, poses: [[0, { expr: 'preocupado', armR: [8, 150], propR: 'cup' }],
    [I(6), { expr: 'feliz' }],
    [I(7), { expr: 'pensando' }],
    [I(9), { expr: 'preocupado', armL: [-48, -128] }],
    [I(10), { expr: 'surpreso', armL: [-9, -5] }],
    [I(11), { head: 5 }],
    [I(13), { expr: 'rindo', head: 0 }]] },
];
// Só a pergunta fica sem cor: a resposta já é o presente
const porta = (ini, fim, cam, frente) => ({ ini, fim, cena: 'portaAberta', cam, cor: fim <= I(5) ? SEM_COR : undefined, atores: NA_PORTA, frente, painel: ini >= I(14) });
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
// Tudo que aparece em celular fica dentro desta moldura: o corpo termina na borda da tela do aparelho
const mascaraCelular = () => `<path fill-rule="evenodd" d="M-300 -300 H1380 V2220 H-300Z M220 170 V1550 H860 V170Z" fill="#1c2a45"/>` + `<rect x="190" y="110" width="700" height="1500" rx="60" fill="none" stroke="#23252f" stroke-width="60"/>`;
const fundoLive = (t) => `<rect x="-200" y="-200" width="1480" height="2320" fill="${ceu(t)}"/>` + estradaSVG(t, ceu(t), sol(t));
const ATOR_LIVE = [{ id: 'leticia', x: 540, s: 3.2, y: 2621, yF: (t) => 2621 + Math.sin(t * 9) * 5, poses: [[0, { expr: 'rindo', semPernas: true, armL: [-16, -10], armR: [16, 10] }]] }];
const CORACOES = [0, 1, 2, 3, 4];
const frenteLive = (t) => CORACOES.map((i) => { const q = ((t * .7 + i * .21) % 1), x = 790 - Math.sin(q * 9 + i) * 28 - i * 8; return `<text x="${x.toFixed(1)}" y="${(1270 - q * 420).toFixed(1)}" font-size="${44 + i * 3}" font-family="${FONTE}" fill="#e0304f" opacity="${(1 - q).toFixed(2)}" text-anchor="middle">♥</text>`; }).join('') + mascaraCelular();

/* ---------- a pé: a moto vem de frente e ele anda ao lado ---------- */
const PASSO = 1.7;
const PE_MOTO_X = 395, PE_MOTO_Y = 1645, PE_MOTO_S = 1.5, PE_X = 832, PE_S = 1.32;
const gripPe = (t) => [PE_MOTO_X + MOTO_RETA.gripR[0] * PE_MOTO_S, PE_MOTO_Y + (MOTO_RETA.gripR[1] + 2) * PE_MOTO_S + Math.sin(t * PASSO * Math.PI) * 2];
const empurra = (expr) => [{ id: 'tico', x: PE_X, s: PE_S, char: ticoSuado,
  dyn: (t) => {
    const f = Math.sin(t * PASSO * Math.PI), pernas = { legL: [-4, -2], legR: [4, 2], liftL: Math.max(0, f), liftR: Math.max(0, -f) };
    const alvo = gripPe(t);
    return { ...pernas, armL: bracoAte(-1, alvo, CHARS.tico, PE_X, CHAO, PE_S, pernas), armR: [14 + f * 9, 8 + f * 13], lean: -5 };
  },
  poses: [[0, { expr, detalhe: 'suor', bag: false, head: -3 }]] }];
const fundoEmpurra = (ceuCor, solPos) => (t) => {
  const bob = Math.sin(t * PASSO * Math.PI * 2) * 2;
  return estradaSVG(t * .24, ceuCor, solPos)
    + `<ellipse cx="${PE_MOTO_X}" cy="${PE_MOTO_Y + 6}" rx="150" ry="24" fill="#2a1f22" opacity=".3"/><ellipse cx="${PE_X}" cy="${CHAO + 6}" rx="108" ry="19" fill="#2a1f22" opacity=".3"/>`
    + motoRetaSVG(PE_MOTO_X, PE_MOTO_Y + bob, PE_MOTO_S, { giro: t * 60 });
};
const frenteEmpurra = (forca) => (t) => pingosSVG(PE_X - 26, 868, CHAO + 6, t, Math.round(2 + forca * 3)) + punho(gripPe(t)) + fedorSVG(PE_X - 22, 670 + Math.sin(t * 3) * 6, t, forca);

/* ---------- a Letícia caminha até a porta do prédio ---------- */
const ANDA_LET_I = I(35) + .85, ANDA_LET_F = E(35) + .08;
const qLet = (t) => clamp01((t - ANDA_LET_I) / (ANDA_LET_F - ANDA_LET_I));
const LETICIA_DESCE = { id: 'leticia', xF: (t) => 610 + 80 * qLet(t), yF: (t) => CHAO - 62 * qLet(t), sF: (t) => 1.32 - .3 * qLet(t),
  dyn: (t) => { const q = qLet(t), anda = q > 0 && q < 1 ? 1 : 0, f = Math.sin((t - ANDA_LET_I) * 2.6 * Math.PI) * anda; return { liftL: Math.max(0, f), liftR: Math.max(0, -f), armL: [-9 - f * 12, -5 - f * 16], armR: [50 + f * 6, 100] }; },
  poses: [[0, { expr: 'feliz', propR: 'phone' }]] };

/* ---------- Planos ---------- */
const ep02Planos = [
  // Abertura
  andando(0, I(2), WIDE(0), { painel: false }),
  andando(I(2), I(3), CTICO(I(2)), { painel: false }),
  andando(I(3), I(4), WIDE(I(3)), { painel: false }),
  // Cena 1: a pergunta sem cor; a resposta já vem em cor
  porta(I(4), I(5), [[I(4), 735, C_LUA, 1.7]], placaEm(I(4) + .2)),
  porta(I(5), I(6), [[I(5), 330, C_TICO, 1.8]]),
  porta(I(6), E(6) + .05, [[I(6), 540, 760, 1.15]]),
  porta(E(6) + .05, I(7), [[E(6), 330, C_TICO, 1.9]]),
  porta(I(7), I(8), [[I(7), 735, C_LUA, 1.8]]),
  porta(I(8), I(9), [[I(8), 330, C_TICO, 1.8]]),
  porta(I(9), I(10), [[I(9), 735, C_LUA, 1.8]]),
  porta(I(10), I(11), [[I(10), 330, C_TICO, 1.8]]),
  porta(I(11), I(12), [[I(11), 735, C_LUA, 1.9]]),
  porta(I(12), I(13), [[I(12), 330, C_TICO, 1.9]]),
  porta(I(13), I(14), [[I(13), 480, 880, 1.02]]),
  // Cena 2: a regra das cinco estrelas
  { ini: I(14), fim: I(14) + (E(14) - I(14)) * .72, cena: 'vazio', cam: [[I(14), 540, 960, 1], [E(14), 540, 880, 1.12, 1.6]], fundo: telaRegra(I(14)) },
  porta(I(14) + (E(14) - I(14)) * .72, I(15), [[I(14), 330, C_TICO, 1.8], [I(15), 330, C_TICO, 1.98, .55]]),
  porta(I(15), I(16) - 1, [[I(15), 225, 1130, 1.18]]),
  // Cena 3: cinco da manhã
  { ini: I(16) - 1, fim: I(16) - .5, cena: 'vazio', cam: [[I(16) - 1, 540, 960, 1]], fundo: telaPassageiros },
  { ini: I(16) - .5, fim: I(16), cena: 'ruaNoite', cam: [[I(16) - .5, 540, 960, 1.02]], fundo: () => motoSVG(620, CHAO + 10, 1.9),
    atores: [{ id: 'leticia', x: 250, s: 1.32, poses: [[0, { expr: 'feliz', armR: [18, 150], propR: 'phone' }]] }, { id: 'tico', x: 880, poses: [[0, { expr: 'cansado', bag: false }]] }], painel: true },
  ...[[16, 880, C_TICO], [17, 250, 880], [18, 540, 960], [19, 880, C_TICO]].map(([n, cx, cy]) => ({
    ini: I(n), fim: n === 19 ? POUSO : I(n + 1), cena: 'ruaNoite',
    cam: [[I(n), cx, cy, n === 18 ? 1.02 : 1.8]], fundo: () => motoSVG(620, CHAO + 10, 1.9), painel: true,
    atores: [{ id: 'leticia', x: 250, s: 1.32, poses: [[0, { expr: 'feliz', armR: [18, 150], propR: 'phone' }], [I(17), { armL: [-34, 110] }], [I(18), { armL: [-9, -5] }]] },
      { id: 'tico', x: 880, poses: [[0, { expr: 'cansado', bag: false }], [I(19), { expr: 'neutro', armR: [40, 70] }]] }] })),
  andando(POUSO, I(20), WIDE(POUSO)),
  // As voltas
  { ini: I(20), fim: I(21) - .35, cena: 'vazio', mapa: true, cam: [[I(20), 540, 960, 1], [I(21), 540, 880, 1.12, 1.6]], fundo: (t) => mapaSVG(.1 + .25 * clamp01((t - I(20)) / 2), 0, t) },
  andando(I(21) - .35, I(21), CTICO(I(20))),
  andando(I(21), I(22), CLET(I(21))),
  andando(I(22), I(23), CTICO(I(22))),
  { ini: I(23), fim: I(24), cena: 'vazio', mapa: true, cam: [[I(23), 540, 960, 1.04], [I(24), 540, 920, 1.12, I(24) - I(23)]], fundo: (t) => mapaSVG(.35 + .3 * clamp01((t - I(23)) / 2), 0, t) },
  andando(I(24), I(25), CTICO(I(24))),
  { ini: I(25), fim: I(26), cena: 'vazio', cobrePernas: true, cam: [[I(25), 540, 960, 1]], fundo: fundoLive, atores: ATOR_LIVE, frente: frenteLive, live: true },
  andando(I(26), I(27), CTICO(I(26)), { frente: (t) => frenteMoto(t) + placa(1120 - (t - I(26)) * 900, 760, 190, 110, '#fff6e6', ['Trago a pessoa', 'amada em 3x', 'no Pix'], 18) }),
  andando(I(27), I(28), CLET(I(27))),
  andando(I(28), I(29), CTICO(I(28)), { frente: (t) => frenteMoto(t) + gasolinaSVG(330, 870, .62, .3) }),
  { ini: I(29), fim: I(30), cena: 'vazio', cobrePernas: true, cam: [[I(29), 540, 960, 1]], fundo: fundoLive, atores: ATOR_LIVE, frente: frenteLive, live: true },
  { ini: I(30), fim: I(30) + (E(30) - I(30)) * .4, cena: 'vazio', mapa: true, cam: [[I(30), 540, 960, 1.1]], fundo: (t) => mapaSVG(.65 + .3 * clamp01((t - I(30)) / 2), 0, t), relogio: '7h20' },
  andando(I(30) + (E(30) - I(30)) * .4, I(31), CTICO(I(30))),
  andando(I(31), E(31) + .05, CLET(I(31)), { estrelas: true }),
  // Silêncio: estrelas, ponteiro, rosto
  { ini: E(31) + .05, fim: E(31) + .4, cena: 'vazio', cheia: true, cam: [[E(31), 540, 960, 1]], fundo: () => `<rect x="-200" y="-200" width="1480" height="2320" fill="#23252f"/>`, estrelasCheias: true },
  { ini: E(31) + .4, fim: E(31) + .75, cena: 'vazio', cheia: true, cam: [[E(31) + .4, 540, 960, 1], [E(31) + .75, 540, 960, 1.14, .35]], fundo: (t) => `<rect x="-200" y="-200" width="1480" height="2320" fill="#efc76c"/>` + gasolinaSVG(540, 900, 3, .08 + Math.sin(t * 34) * .02) },
  andando(E(31) + .75, I(33), CTICO(E(31))),
  andando(I(33), I(34), CLET(I(33))),
  andando(I(34), I(35), [[I(34), ANDA_X, 790, 1.85]]),
  // Cena 3b: o prédio chique e a volta a pé
  { ini: I(35), fim: TOSSE, cena: 'predioChique', cam: [[I(35), 540, 1000, 1.02]], painel: true,
    fundo: () => motoSVG(300, CHAO + 40, 1.7),
    atores: [{ id: 'tico', x: 120, char: ticoSuado, poses: [[0, { expr: 'cansado', detalhe: 'suor', bag: false }]] }, LETICIA_DESCE] },
  { ini: TOSSE, fim: TOSSE + .55, cena: 'vazio', cheia: true, cam: [[TOSSE, 540, 960, 1.02]], fundo: (t) => `<rect x="-200" y="-200" width="1480" height="2320" fill="#efc76c"/>` + gasolinaSVG(540 + Math.sin(t * 60) * 8, 900, 3, .1 * (1 - clamp01((t - TOSSE) / .4))) },
  { ini: TOSSE + .55, fim: I(36), cena: 'predioChique', cam: [[TOSSE + .55, 230, 870, 1.5]], painel: true, relogio: '7h31',
    fundo: () => motoSVG(300, CHAO + 40, 1.7), atores: [{ id: 'tico', x: 120, char: ticoSuado, poses: [[0, { expr: 'surpreso', detalhe: 'suor', bag: false, armR: [60, 70] }]] }] },
  { ini: I(36), fim: MAPA_PE, cena: 'predioChique', cam: [[I(36), 190, 860, 1.8]], painel: true,
    fundo: () => motoSVG(300, CHAO + 40, 1.7), atores: [{ id: 'tico', x: 120, char: ticoSuado, poses: [[0, { expr: 'triste', detalhe: 'suor', bag: false, armR: [60, 70], head: 5 }]] }] },
  { ini: MAPA_PE, fim: MONTAGEM, cena: 'vazio', cam: [[MAPA_PE, 540, 960, 1], [MONTAGEM, 540, 920, 1.08, MONTAGEM - MAPA_PE]], fundo: (t) => mapaSVG(1, sai((t - MAPA_PE) / 1.1), t), recalc: true },
  // Montagem: a moto de frente, e ele ao lado, de corpo inteiro nos três planos
  { ini: MONTAGEM, fim: MONTAGEM + 1, cena: 'vazio', cam: [[MONTAGEM, 575, 960, 1.04]], fundo: fundoEmpurra(mistura('#f4a65a', '#ffd9a0', .4), [860, 560]), atores: empurra('cansado'), frente: frenteEmpurra(.45), painel: true },
  { ini: MONTAGEM + 1, fim: MONTAGEM + 2, cena: 'vazio', cam: [[MONTAGEM + 1, 620, 1000, 1.12]], fundo: fundoEmpurra(mistura('#f4a65a', '#ffd9a0', .75), [260, 430]), atores: empurra('bravo'), frente: frenteEmpurra(.75), painel: true },
  { ini: MONTAGEM + 2, fim: LUA_LONGE, cena: 'vazio', cam: [[MONTAGEM + 2, 575, 960, 1.04]], fundo: fundoEmpurra('#ffd9a0', [860, 340]), atores: empurra('cansado'), frente: frenteEmpurra(1), painel: true },
  // Cena 4: Lua sozinha, de longe, com um único objeto: o celular
  { ini: LUA_LONGE, fim: I(37), cena: 'portaDiaAberta', cam: [[LUA_LONGE, 540, 1190, 1.15]], painel: true, cartaz: '7h58',
    atores: [{ id: 'fiscal', x: 170, y: 1600, s: .8, flip: true, poses: [[0, { expr: 'neutro' }]] }, { id: 'lua', x: 540, s: 1.4, poses: [[0, { expr: 'feliz', detalhe: 'brilho', armR: [14, 8] }]] }] },
  { ini: I(37), fim: I(37) + (E(37) - I(37)) * .55, cena: 'portaDiaAberta', cam: [[I(37), 540, 880, 1.45]], painel: true,
    atores: [{ id: 'lua', x: 540, s: 1.4, poses: [[0, { expr: 'feliz', detalhe: 'brilho', armR: [18, 150], propR: 'phone' }]] }] },
  { ini: I(37) + (E(37) - I(37)) * .55, fim: RISO, cena: 'vazio', cam: [[I(37), 540, 960, 1.02]], fundo: telaAudio },
  // Riso que engasga: sem olhar para a câmera
  { ini: RISO, fim: VOTO, cena: 'rua', cam: [[RISO, 330, 900, 1.5], [VOTO, 330, 820, 2, 3.2]], painel: true,
    fundo: () => motoSVG(780, CHAO + 10, 1.9),
    frente: (t) => fedorSVG(330, 640 + Math.sin(t * 3) * 5, t, 1) + (t > RISO + 1 && t < RISO + 2.5 ? fedorSVG(452, 900, t, .55) : ''),
    atores: [{ id: 'tico', x: 330, char: ticoSuado, poses: [[0, { expr: 'envergonhado', detalhe: 'suor', bag: false, armR: [18, 150], propR: 'phone' }],
      [RISO + .8, { expr: 'lado', propR: null, armR: [112, 196], head: -17, lean: 5 }],
      [RISO + 1.7, { expr: 'surpreso' }],
      [RISO + 2.6, { expr: 'envergonhado', armR: [14, 8], head: 2, lean: 0 }]] }] },
  // Votação
  { ini: VOTO, fim: I(39) - 1.4, cena: 'rua', cam: [[VOTO, 540, 665, 1.28]], cor: (t) => 1 - sai((t - VOTO) / .4),
    frente: (t) => fedorSVG(540, 600 + Math.sin(t * 3) * 5, t, .7),
    atores: [{ id: 'tico', x: 540, char: ticoSuado, poses: [[0, { expr: 'forcado', detalhe: 'suor', bag: false, armL: [-18, 60], armR: [14, 8], head: 4 }], [E(38), { expr: 'lado', armR: [112, 196], head: -17, lean: 5 }]] }] },
  // Cena 5: o vendedor de paçoca
  { ini: I(39) - 1.4, fim: I(39) - .75, cena: 'rua', cam: [[I(39) - 1.4, 540, 1000, 1.02]], canto: true,
    fundo: () => bancoSVG(540), frente: () => caixaPacocaSVG(540, 1500),
    atores: [{ id: 'vendedor', x: 540, y: CHAO - 20, s: 1.32, poses: [[0, { expr: 'neutro', sentado: true, legL: [-40, -6], legR: [40, 6], armL: [-16, 20], armR: [18, 150], propR: 'phone' }]] }] },
  { ini: I(39) - .75, fim: I(39), cena: 'vazio', cobrePernas: true, cam: [[I(39) - .75, 540, 960, 1]], canto: true,
    fundo: () => `<rect x="-200" y="-200" width="1480" height="2320" fill="#ffd9a0"/>` + estradaSVG(0, '#ffd9a0', [800, 340]),
    atores: [{ id: 'ticoNoCelular', x: 540, y: 2579, s: 3, char: () => ticoSuado(LUA_LONGE), poses: [[0, { expr: 'triste', detalhe: 'suor', bag: false, semPernas: true, armL: [-14, -8], armR: [14, 8] }]] }],
    frente: () => mascaraCelular() + ret(250, 210, 230, 70, '#c23b3b', 12) + txt(365, 258, 'AO VIVO', 36, '#fff') },
  { ini: I(39), fim: COMPRA, cena: 'rua', cam: [[I(39), 540, 860, 1.75]], canto: true,
    fundo: () => bancoSVG(540), frente: () => caixaPacocaSVG(540, 1500),
    atores: [{ id: 'vendedor', x: 540, y: CHAO - 20, s: 1.32, poses: [[0, { expr: 'pensando', sentado: true, legL: [-40, -6], legR: [40, 6], armL: [-16, 20], armR: [18, 150], propR: 'phone' }], [E(39) - .1, { expr: 'feliz' }]] }] },
  { ini: COMPRA, fim: FIM_DO_EP, cena: 'vazio', cam: [[COMPRA, 540, 960, 1], [FIM_DO_EP, 540, 930, 1.07, FIM_DO_EP - COMPRA]], canto: true, fundo: (t) => moldura(ret(250, 330, 580, 500, '#3a3a40', 18) + txt(540, 600, 'Mente Milionária', 46, '#ffd83a') + ret(290, 930, 500, 170, t > COMPRA + .55 ? '#1f9e33' : '#35d04a', 26) + txt(540, 1035, 'Comprar curso', 50, '#fff') + `<circle cx="${(800 - 60 * sai((t - COMPRA) / .5)).toFixed(1)}" cy="${(1340 - 240 * sai((t - COMPRA) / .5)).toFixed(1)}" r="56" fill="#c98f68" stroke="${OUT}" stroke-width="6"/>`) },
];
function bancoSVG(x) { return ret(x - 240, CHAO - 150, 480, 34, '#7a5a44', 6) + ret(x - 210, CHAO - 116, 26, 126, '#55606c', 0) + ret(x + 184, CHAO - 116, 26, 126, '#55606c', 0); }
function caixaPacocaSVG(x, y) { return `<g transform="translate(${x} ${y})">` + shape('M-120 -60 L120 -60 L104 40 L-104 40Z', '#d9a860') + txt(0, -10, 'PAÇOCA', 34, '#7a3f1f') + txt(0, 26, 'R$ 2', 26, '#7a3f1f') + '</g>'; }

/* ---------- Telas sobre a imagem ---------- */
const nota = (t) => t < I(35) + .35 ? '-0,3' : '5,0';
const dias = (t) => t < I(16) - 1 ? 92 : 93;
const audiencia = (t) => t < I(20) ? 11 : t < I(21) ? 11 + Math.round(69 * clamp01((t - I(20)) / (I(21) - I(20)))) : t < I(29) ? 80 + Math.round(120 * clamp01((t - I(21)) / (I(29) - I(21)))) : 200 + Math.round(140 * clamp01((t - I(29)) / .8));
const painel = (t, u, pb) => {
  u.cartao(30, 70, 500, 138, pb ? '#222222' : '#2a1f22');
  u.texto(`Desempregado: ${dias(t)} dias`, 56, 105, 32, '#ffffff', 'left');
  u.texto(`Nota: ${nota(t)}`, 56, 148, 32, nota(t) === '5,0' ? (pb ? '#ffffff' : '#7fe08a') : '#ffffff', 'left');
  u.texto('Dívida: R$ 0', 56, 188, 32, '#ffffff', 'left');
};
const chipLive = (t, u, x = 760, y = 90) => { u.cartao(x, y, 270, 76, '#c23b3b'); u.texto(`Ao vivo: ${audiencia(t)}`, x + 135, y + 39, 34, '#ffffff'); };
const nome = (u, s, dur, txtN, cor = '#a8b94c', y = 240) => { u.g.globalAlpha = Math.min(1, s / .2, Math.max(0, (dur - s) / .2)); u.cartao(90, y, 900, 90, cor); u.texto(txtN, 540, y + 45, 38, '#2a1f22'); u.g.globalAlpha = 1; };
const cartaz = (u, tx, cor = '#ffd83a', w = 700) => { u.cartao(540 - w / 2, 250, w, 120, '#2a1f22'); u.texto(tx, 540, 310, 58, cor); };
const bordasEscuras = (p, s, u) => { const v = u.g.createRadialGradient(540, 860, 420, 540, 960, 1120); v.addColorStop(0, 'rgba(20,20,20,0)'); v.addColorStop(1, 'rgba(20,20,20,.62)'); u.g.fillStyle = v; u.g.fillRect(0, 0, 1080, 1920); };
const emTelaCheia = (t) => ep02Planos.some((pl) => t >= pl.ini && t < pl.fim && (pl.live || pl.mapa || pl.cheia));

const ep02Telas = [
  // Abertura: nomes e audiência
  { ini: .1, fim: I(2), desenha: (p, s, u) => nome(u, s, I(2) - .1, 'Letícia Campos, mentora', '#f2c14e') },
  { ini: I(2), fim: I(3), desenha: (p, s, u) => nome(u, s, I(3) - I(2), 'Tiago Almeida, mototaxista há 3 minutos') },
  { ini: 0, fim: I(4), desenha: (p, s, u) => chipLive(s, u) },
  { ini: E(3) + .1, fim: I(4), desenha: (p, s, u) => { u.g.globalAlpha = Math.min(1, s / .3); u.cartao(180, 1190, 720, 120, '#2a1f22'); u.texto('Na noite anterior', 540, 1250, 58, '#ffffff'); u.g.globalAlpha = 1; } },
  // Bordas escuras só na pergunta, junto do preto e branco
  { ini: I(4), fim: I(5), desenha: bordasEscuras },
  // Cartão das 5h
  { ini: I(16) - 1, fim: I(16) + .3, desenha: (p, s, u) => { u.g.globalAlpha = Math.min(1, s / .2, (1.3 - s) / .35); cartaz(u, '5h da manhã', '#ffd83a', 560); u.g.globalAlpha = 1; } },
  // Mapa
  ...ep02Planos.filter((pl) => pl.mapa).map((pl) => ({ ini: pl.ini, fim: pl.fim, desenha: (p, s, u) => { u.cartao(240, 110, 600, 96, '#2a4f8a'); u.texto('Recalculando...', 540, 158, 46, '#ffffff'); } })),
  ...ep02Planos.filter((pl) => pl.relogio).map((pl) => ({ ini: pl.ini, fim: pl.fim, desenha: (p, s, u) => { u.cartao(760, 220, 270, 90, '#2a1f22'); u.texto(pl.relogio, 895, 265, 52, '#ff6a5a'); } })),
  ...ep02Planos.filter((pl) => pl.recalc).map((pl) => ({ ini: pl.ini, fim: pl.fim, desenha: (p, s, u) => { u.cartao(150, 130, 780, 110, '#2a4f8a'); u.texto('Recalculando: a pé. 27 min', 540, 186, 44, '#ffffff'); } })),
  // Live dentro do celular: cabeçalho, audiência e comentários presos à tela do aparelho
  ...ep02Planos.filter((pl) => pl.live).map((pl) => ({ ini: pl.ini, fim: pl.fim, desenha: (p, s, u) => {
    const t = pl.ini + s, g = u.g;
    g.beginPath(); g.arc(280, 240, 40, 0, 6.283); g.fillStyle = '#bf842a'; g.fill(); g.lineWidth = 5; g.strokeStyle = '#ff4f6e'; g.stroke();
    u.texto('leticia.mentora', 335, 222, 28, '#ffffff', 'left');
    u.cartao(335, 244, 130, 46, '#c23b3b'); u.texto('AO VIVO', 400, 268, 22, '#ffffff');
    u.texto(`${audiencia(t)} assistindo`, 480, 268, 24, '#ffffff', 'left');
    g.fillStyle = 'rgba(15,15,25,.62)'; g.beginPath(); g.roundRect(240, 1060, 600, 190, 20); g.fill();
    u.texto('maria_gratidao', 262, 1096, 24, '#ffd83a', 'left'); u.texto('chorei', 262, 1128, 28, '#ffffff', 'left');
    u.texto('paçoca_do_nilton', 262, 1174, 24, '#ffd83a', 'left'); u.texto('funciona msm?', 262, 1208, 28, '#ffffff', 'left');
  } })),
  // Audiência durante as voltas
  { ini: POUSO, fim: I(35), desenha: (p, s, u) => { const t = POUSO + s; if (!emTelaCheia(t)) chipLive(t, u); } },
  // Estrelas à espera do polegar
  ...ep02Planos.filter((pl) => pl.estrelas || pl.estrelasCheias).map((pl) => ({ ini: pl.ini, fim: pl.fim, desenha: (p, s, u) => { const y = pl.estrelasCheias ? 860 : 1540, tam = (pl.estrelasCheias ? 150 : 78) * (1 + Math.sin(s * 9) * .05); if (!pl.estrelasCheias) u.cartao(250, y - 66, 580, 132, '#2a1f22'); u.texto('★★★★★', 540, y, tam, '#ffd83a'); } })),
  // Cartões e placares
  ...ep02Planos.filter((pl) => pl.cartaz).map((pl) => ({ ini: pl.ini, fim: pl.fim, desenha: (p, s, u) => { u.cartao(690, 90, 340, 118, '#2a1f22'); u.texto(pl.cartaz, 860, 150, 62, '#ffd83a'); } })),
  // Corrida concluída
  { ini: I(35), fim: I(35) + 1.4, desenha: (p, s, u) => { u.g.globalAlpha = Math.min(1, s / .35, (1.4 - s) / .3); u.cartao(150, 260, 780, 120, '#1f9e33'); u.texto('Corrida concluída. Mototáxi liberado', 540, 320, 34, '#ffffff'); u.g.globalAlpha = 1; } },
  // Notificação do áudio
  { ini: I(37), fim: I(37) + 1.5, desenha: (p, s, u) => { u.g.globalAlpha = Math.min(1, s / .35, (1.5 - s) / .3); u.cartao(130, 260, 820, 110, '#2f8f4e'); u.texto('Lua: áudio 0:06', 540, 315, 46, '#ffffff'); u.g.globalAlpha = 1; } },
  // Painel
  ...ep02Planos.filter((pl) => pl.painel).map((pl) => ({ ini: pl.ini, fim: pl.fim, desenha: (p, s, u) => painel(pl.ini + s, u, pl.cor && pl.cor(pl.ini + s) < .5) })),
  // Votação: só as palavras que o público comenta em destaque
  { ini: VOTO, fim: I(39) - 1.4, desenha: (p, s, u) => {
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
  // Só quando alguém diz o que sabe ser falso. No caminho da história: dois em H5 e vários em H12.
  latidos: [E(5) - .1, E(10) - .05, E(12) - .05],
  impactos: [VOA - .02, POUSO + .36, COMPRA + .55],
  destaques: { 1: 'ninguém', 2: 'nome', 3: 'voa', 5: 'temporário', 7: 'mototáxi', 9: 'oito', 10: 'mototáxi', 12: 'oito', 14: 'estrelas', 15: 'fácil', 17: 'agradecer', 18: 'estrelas', 20: 'três', 21: 'volta', 23: 'pobre', 24: 'cabo', 25: 'bala', 26: 'vez', 28: 'emprestada', 29: 'moto', 31: 'salvou', 34: 'curso', 35: 'mototáxi', 36: 'companheira', 37: 'mudar', 38: 'sentir', 39: 'fácil' },
};
