'use strict';
ESTILO_RIG = 'classico'; // fixado na Oca Studio (2026-11-12): episódio feito com o rig clássico
// Episódio 3: O Dia Errado. Planos, poses e telas. Falas e tempos vêm de falas.js, gerado do roteiro.
// PROVISÓRIO: os tempos sem fala são do roteiro (2,96 palavras/s) e mudam quando a voz for medida.
const sai = (p) => { p = Math.max(0, Math.min(1, p)); return 1 - (1 - p) * (1 - p); };
const suave = (p) => { p = Math.max(0, Math.min(1, p)); return p * p * (3 - 2 * p); };
const clamp01 = (p) => Math.max(0, Math.min(1, p));
const F = Object.fromEntries(FALAS.map((f) => [f.n, f]));
const I = (n) => F[n].ini, E = (n) => F[n].fim;
// Encurtamento depois da voz real: o trecho sem fala das janelas foi comprimido para caber em 68 s.
// J(t) leva os tempos originais do roteiro (até 67,1 s) para os novos.
const J = (t) => t <= 42.5 ? t : t <= 57.3 ? 42.5 + (t - 42.5) * .82 : t <= 59.1 ? 54.636 + (t - 57.3) * 1.3 / 1.8 : t <= 64.1 ? 55.936 + (t - 59.1) * .9 : t - 3.664;
const FIM_DO_EP = J(66.1) + .5;
const NOITE = { ambiente: 'noite', lado: 'direita' };
const SEM_COR = () => .1; // mesmo filtro de lembrança do ep. 2

/* ---------- medidas do rig ---------- */
const raizLocal = (d) => -(10 + d.thigh + d.shin + SHOE_H[d.shoe]);
const cabecaLocal = (d) => raizLocal(d) - d.torso - d.neck - 73 * d.hs;
const yParaCabeca = (d, s, alvo) => alvo - s * cabecaLocal(d);
const cabecaY = (d, y, s) => y + s * cabecaLocal(d);
const pescocoY = (d, y, s) => y + s * (raizLocal(d) - d.torso);
function ombroDe(lado, d, x, y, s) {
  return [x + s * lado * (d.sw - d.ru * .62), y + s * (raizLocal(d) - d.torso + d.ru * 1.05)];
}
// Braço que alcança um ponto do mundo, com o cotovelo para baixo
function bracoAte(lado, alvo, d, x, y, s) {
  const [ox, oy] = ombroDe(lado, d, x, y, s);
  const a = d.armU * s, b = d.armF * s, dx = alvo[0] - ox, dy = alvo[1] - oy, dist = Math.min(a + b - 2, Math.hypot(dx, dy));
  const base = Math.atan2(dx, dy) * 180 / Math.PI, abre = Math.acos(clamp01((a * a + dist * dist - b * b) / (2 * a * dist))) * 180 / Math.PI;
  const curva = Math.acos(clamp01((a * a + b * b - dist * dist) / (2 * a * b))) * 180 / Math.PI;
  const up = base - lado * abre;
  return [up, up + lado * (180 - curva)];
}
const mao = (d, p, s, r = 1) => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${(d.rw * 1.75 * s * r).toFixed(1)}" fill="${d.skin}" stroke="${OUT}" stroke-width="3.2"/>`;

/* ---------- variações de figurino ---------- */
const TICO_SUADO = { ...CHARS.tico, cloth: '#6d7c2c', clothD: '#4f5c1f' };
const TICO_BANHO = { ...CHARS.tico, cloth: CHARS.tico.skin, clothD: CHARS.tico.shade };
const JUNIOR_BAGUNCA = { ...CHARS.junior, despenteado: true };

// Passo sem sair do lugar: pernas e braços alternam; o deslocamento vem de xF
const passo = (t, ritmo, amp = 1) => {
  const f = Math.sin(t * ritmo * Math.PI);
  return { liftL: Math.max(0, f) * amp, liftR: Math.max(0, -f) * amp, armL: [-14 - f * 26 * amp, -20 - f * 40 * amp], armR: [14 - f * 26 * amp, 20 - f * 40 * amp] };
};

/* ---------- toalha no pescoço ---------- */
const toalha = (d, x, y, s) => {
  const py = pescocoY(d, y, s), w = d.sw * s;
  return `<path d="M${x - w * .78} ${py + 18} Q${x} ${py - 22} ${x + w * .78} ${py + 18} L${x + w * .56} ${py + 150 * s / 1.32} L${x + w * .22} ${py + 144 * s / 1.32} L${x + w * .3} ${py + 40} Q${x} ${py + 12} ${x - w * .3} ${py + 40} L${x - w * .22} ${py + 144 * s / 1.32} L${x - w * .56} ${py + 150 * s / 1.32}Z" fill="#f2f0ea" stroke="${OUT}" stroke-width="3"/>`
    + `<path d="M${x + w * .3} ${py + 118 * s / 1.32} L${x + w * .55} ${py + 124 * s / 1.32} M${x - w * .3} ${py + 118 * s / 1.32} L${x - w * .55} ${py + 124 * s / 1.32}" stroke="#4f7f9e" stroke-width="7"/>`;
};

/* ---------- telas de celular ---------- */
const moldura = (conteudo) => `<rect x="-200" y="-200" width="1480" height="2320" fill="#1c2a45"/>` + ret(190, 110, 700, 1500, '#23252f', 60) + ret(220, 170, 640, 1380, '#efe8dc', 18, 0) + conteudo;
const cabecalho = (nome, cor = '#2f8f4e') => ret(220, 170, 640, 140, cor, 18, 0) + `<circle cx="300" cy="240" r="40" fill="${nome === 'Lua' ? '#e9b18b' : '#d59a6e'}" stroke="#fff" stroke-width="4"/>` + txt(370, 258, nome, 46, '#fff', 'start');
const teclado = () => { let s = ret(220, 1130, 640, 420, '#d8d2c6', 0, 0); for (let r = 0; r < 4; r++) for (let c = 0; c < 9; c++) s += ret(240 + c * 68, 1150 + r * 92, 58, 76, '#fbf8f0', 8, 1.5); return s; };
const balao = (texto, enviado, y, tam = 40, larg = 520) => {
  const linhas = quebra(texto, 20), h = 40 + linhas.length * tam * 1.25, x = enviado ? 860 - 30 - larg : 250;
  return ret(x, y, larg, h, enviado ? '#d9f2c8' : '#ffffff', 26, 2) + linhas.map((l, i) => txt(x + 28, y + 30 + tam + i * tam * 1.25 - tam * .2, l, tam, '#2a1f22', 'start')).join('');
};
const telaDigitando = (t0, t1, texto, para) => (t) => {
  const q = clamp01((t - t0) / ((t1 - t0) * .62)), n = Math.round(texto.length * q), e = suave((t - t0 - (t1 - t0) * .68) / .3);
  const cursor = Math.floor(t * 3) % 2 ? '|' : '';
  // Ao enviar, o balão sobe e aparece, e o teclado desce: nada some de um quadro para o outro
  return moldura(cabecalho(para) + `<g opacity="${e.toFixed(2)}" transform="translate(0 ${(120 * (1 - e)).toFixed(1)})">` + balao(texto, true, 420) + txt(800, 420 + 40 + quebra(texto, 20).length * 50 + 30, '✓✓', 30, '#3b8fd6', 'end') + '</g>'
    + `<g transform="translate(0 ${(520 * e).toFixed(1)})">` + ret(240, 1040, 600, 76, '#fff', 38, 2) + txt(270, 1090, (e > 0 ? '' : texto.slice(0, n).slice(-24) + cursor), 30, '#2a1f22', 'start') + teclado() + '</g>' + ret(190, 1550, 700, 400, '#1c2a45', 0, 0));
};
const telaEnviada = (texto, para) => () => moldura(cabecalho(para) + balao(texto, true, 420, 46) + txt(800, 420 + 40 + quebra(texto, 20).length * 58 + 34, '✓✓', 32, '#3b8fd6', 'end'));
const telaRecebida = (texto, de) => () => moldura(cabecalho(de) + balao(texto, false, 420, 46));

/* ---------- papéis na janela ---------- */
function quebra(texto, max) {
  const linhas = []; let a = '';
  for (const w of texto.split(' ')) { if (a && (a + ' ' + w).length > max) { linhas.push(a); a = w; } else a = a ? a + ' ' + w : w; }
  if (a) linhas.push(a);
  return linhas;
}
let idPapel = 0;
// Papel com texto revelado da esquerda para a direita, linha por linha. Devolve o desenho e a ponta do canetão.
function papelSVG(cx, cy, k, texto, prog, verso) {
  const w = 600 * k, h = 330 * k, linhas = quebra(texto, 12), fs = (linhas.length === 1 ? 92 : linhas.length === 2 ? 70 : 58) * k, lh = fs * 1.18;
  const id = 'pp' + (idPapel++ % 1000);
  let s = `<g transform="rotate(-1.5 ${cx} ${cy})">` + `<rect x="${cx - w / 2 + 10}" y="${cy - h / 2 + 12}" width="${w}" height="${h}" rx="6" fill="#181e2b" opacity=".25"/>` + ret(cx - w / 2, cy - h / 2, w, h, '#fbf8f0', 6, 3);
  if (verso) s += `<g opacity=".14">` + [0, 1, 2, 3].map((i) => `<rect x="${cx + w / 2 - 70 - i * 60}" y="${cy + h / 2 - 40 - (i + 1) * 40 * k}" width="${40 * k}" height="${(i + 1) * 40 * k}" fill="#2a4f8a"/>`).join('') + '</g>';
  const tot = linhas.reduce((a, l) => a + l.length, 0);
  let feito = prog * tot, pen = null;
  linhas.forEach((l, i) => {
    const y = cy - (linhas.length - 1) * lh / 2 + i * lh + fs * .36, lw = Math.min(w - 70 * k, l.length * fs * .66), x0 = cx - lw / 2;
    const f = clamp01(feito / l.length); feito -= l.length;
    if (f <= 0) return;
    s += `<clipPath id="${id}c${i}"><rect x="${x0 - 12}" y="${y - fs * 1.1}" width="${(lw + 24) * f}" height="${fs * 1.5}"/></clipPath>`
      + `<text x="${x0}" y="${y}" textLength="${lw}" lengthAdjust="spacingAndGlyphs" font-family="Comic Sans MS, Arial Black, sans-serif" font-weight="900" font-size="${fs}" fill="#1d1d2b" clip-path="url(#${id}c${i})">${esc(l)}</text>`;
    if (f < 1 || (i === linhas.length - 1)) pen = [x0 + lw * f, y - fs * .35];
  });
  if (!pen) { const l0 = linhas[0], lw = Math.min(w - 70 * k, l0.length * fs * .66); pen = [cx - lw / 2, cy - (linhas.length - 1) * lh / 2 + fs * .01]; }
  return { svg: s + '</g>', pen };
}
const canetao = (p, cor = '#1d1d2b') => `<g transform="translate(${p[0].toFixed(1)} ${p[1].toFixed(1)}) rotate(38)">` + ret(-9, -96, 18, 82, '#f2f0ea', 4, 2.4) + ret(-9, -112, 18, 22, cor, 4, 2.4) + shape('M-7 -14 L7 -14 L3 0 L-3 0Z', cor, 2) + '</g>';

// Cada papel: escreve (letras aparecem no ritmo do traço), levanta e segura.
const ALTURA_CABECA = 690, PAPEL_BAIXO = 1095, PAPEL_ALTO = 985;
function batidaPapel(quem, t0, t1, texto, o = {}) {
  const d = CHARS[quem], s = 1.9, x = 540, y = yParaCabeca(d, s, ALTURA_CABECA);
  const espera = o.espera || 0, dur = t1 - t0, fimEscrita = t0 + .1 + espera + dur * (o.escrita || .5), fimSobe = fimEscrita + .4;
  const prog = (t) => clamp01((t - t0 - .1 - espera) / (fimEscrita - t0 - .1 - espera));
  const sobe = (t) => suave((t - fimEscrita) / .4);
  const centro = (t) => [540, PAPEL_BAIXO + (PAPEL_ALTO - PAPEL_BAIXO) * sobe(t)];
  const escala = (t) => .92 + .1 * sobe(t);
  // A ponta do canetão vem do próprio papel; a mão do canetão fica um pouco acima e à direita
  const estado = (t) => { idPapel = 0; const [cx, cy] = centro(t); return papelSVG(cx, cy, escala(t), texto, prog(t), quem === 'lua'); };
  const maoEsq = (t) => { const [cx, cy] = centro(t); return [cx - 300 * escala(t) + 26, cy + 20]; };
  // Mão do canetão: segue a ponta enquanto escreve e desliza até a borda do papel quando ele sobe
  const naCaneta = (t) => { const p = estado(Math.min(t, fimEscrita)).pen, pr = prog(t), treme = pr > 0 && pr < 1 ? Math.sin(t * 46) * 6 : 0, ar = 30 * (1 - suave(pr / .08)); return [p[0] + 30, p[1] - 44 + treme - ar]; };
  const maoDir = (t) => {
    const q = sobe(t), a = naCaneta(t); if (q <= 0) return a;
    const [cx, cy] = centro(t), b = [cx + 300 * escala(t) - 26, cy + 20];
    return [a[0] + (b[0] - a[0]) * q, a[1] + (b[1] - a[1]) * q];
  };
  // Alvo do braço puxado para o miolo do papel: a mão do rig fica coberta e só a mão desenhada aparece
  const dentro = (p, t) => { const [cx, cy] = centro(t); return [p[0] + (cx - p[0]) * .18, p[1] + (cy - p[1]) * .55 + 40]; };
  const parede = quem === 'tico' ? '#9a6a55' : '#5f7a7a';
  return {
    ini: t0, fim: t1, cena: quem === 'tico' ? 'janelaTico' : 'janelaLua', cobrePernas: true, visual: { ambiente: 'noite', lado: quem === 'tico' ? 'direita' : 'esquerda' },
    cam: [[t0, 540, 900, 1.3], [t1, 540, 890, 1.36, dur]],
    atores: [{ id: quem, x, y, s, dyn: (t) => ({ semPernas: true, armL: bracoAte(-1, dentro(maoEsq(t), t), d, x, y, s), armR: bracoAte(1, dentro(maoDir(t), t), d, x, y, s), head: 5 * (1 - sobe(t)), lean: 0 }),
      poses: [[0, { expr: o.expr || 'neutro' }], ...(o.depois ? [[fimSobe + .2, { expr: o.depois }]] : [])] }],
    frente: (t) => {
      const e = estado(t), md = maoDir(t);
      return ret(-200, 1240, 1480, 900, parede, 0, 0) + ret(110, 1222, 860, 40, '#e9e1d2', 6, 3)
        + e.svg + mao(d, maoEsq(t), s) + canetao([md[0] - 30 + 40 * sobe(t), md[1] + 44 - 14 * sobe(t)]) + mao(d, md, s);
    },
  };
}

/* ---------- personagens nas janelas do plano aberto ---------- */
const NA_JANELA = (quem, xJan, t0, paperFrom, expr = 'neutro') => {
  const d = CHARS[quem], s = .62, x = xJan + 100, y = yParaCabeca(d, s, 1030);
  return { id: quem, x, y, s, dyn: () => ({ semPernas: true }), poses: [[0, { expr, armL: [-9, -5], armR: quem === 'tico' && t0 < 41.2 ? [18, 150] : [9, 5], propR: quem === 'tico' && t0 < 41.2 ? 'phone' : null }]] };
};
const frenteJanelas = (papelTico, papelLua) => (t) => {
  let s = ret(130, 1200, 230, 400, '#9a6a55', 0, 0) + ret(730, 1200, 230, 400, '#5f7a7a', 0, 0) + ret(128, 1196, 224, 12, '#e9e1d2', 2, 2) + ret(728, 1196, 224, 12, '#e9e1d2', 2, 2);
  if (papelTico) { idPapel = 0; s += papelSVG(240, papelTico(t), .3, 'TE PAGO UM LANCHE, QUE TAL?', 1, false).svg; }
  if (papelLua) s += canetao([905, 1150]);
  return s;
};

/* ---------- vidro do escritório ---------- */
const vidro = (x, w, y0 = 300, y1 = 1700, a = .2) => `<rect x="${x}" y="${y0}" width="${w}" height="${y1 - y0}" fill="#bcd8e2" opacity="${a}"/>` + `<path d="M${x + 40} ${y0 + 120} L${x + 160} ${y0} M${x + 80} ${y0 + 360} L${x + w - 40} ${y0 + 40}" stroke="#ffffff" stroke-width="14" opacity=".35"/>` + `<rect x="${x}" y="${y0}" width="${w}" height="${y1 - y0}" fill="none" stroke="#5a6672" stroke-width="16"/>`;

/* ---------- Planos ---------- */
const CORRE = 7.95, T_FUGA = 8.15, BANHO = 8.8;
const AUDIO_TELA = I(37) + (E(37) - I(37)) * .55;
const VOTO = J(59.1), DEPOIS = J(64.1);
const ESCRITA = [
  ['tico', J(42.5), J(44.1), 'DESCULPA.', { expr: 'envergonhado' }],
  ['lua', J(44.1), J(45.6), 'ACONTECE.', { expr: 'cansado' }],
  ['tico', J(45.6), J(47.2), 'COMO FOI LÁ?', { expr: 'preocupado' }],
  ['lua', J(47.2), J(48.6), 'NÃO FOI.', { expr: 'triste', escrita: .4 }],
  ['tico', J(48.6), J(50.4), 'A CULPA É MINHA.', { expr: 'triste', escrita: .55 }],
  ['lua', J(50.4), J(51.9), 'TALVEZ.', { expr: 'pensando', espera: .35, escrita: .35, depois: 'lado' }],
  ['tico', J(51.9), J(54.1), 'PRECISO COMPENSAR DE ALGUMA FORMA.', { expr: 'pensando', escrita: .6 }],
  ['lua', J(54.1), J(55.3), 'COMO?', { expr: 'pensando', escrita: .4 }],
  ['tico', J(55.3), J(57.3), 'TE PAGO UM LANCHE, QUE TAL?', { expr: 'envergonhado', escrita: .55 }],
];
// Ponto do afago: o alto da cabeça do Júnior, já inclinado, com um vaivém curto
const afago = (t) => {
  const d = CHARS.junior, s = 1.32, quadril = CHAO + s * raizLocal(d), alt = s * (d.torso + d.neck + 73 * d.hs) + s * d.hs * 80, a = -10 * Math.PI / 180;
  const vai = t > J(64.7) && t < J(65.6) ? Math.sin(t * 12) * 12 : 0;
  return [700 + alt * Math.sin(a) + vai, quadril - alt * Math.cos(a) + 10];
};
const LUA_PENSA = (ini, fim, cam) => {
  const d = CHARS.lua, s = 1.9, y = yParaCabeca(d, s, ALTURA_CABECA), pena = [588, 838];
  return { ini, fim, cena: 'janelaLua', cobrePernas: true, visual: { ambiente: 'noite', lado: 'esquerda' }, cam,
    atores: [{ id: 'lua', x: 540, y, s, dyn: (t) => ({ semPernas: true, armR: bracoAte(1, [pena[0] + 6, pena[1] + 12], d, 540, y, s), armL: [-12, -6], frente: 'R', head: Math.sin((t - ini) * 1.3) * 4 }), poses: [[0, { expr: 'pensando' }], [ini + 1.1, { expr: 'lado' }], [ini + 2.4, { expr: 'pensando' }]] }],
    frente: () => ret(-200, 1240, 1480, 900, '#5f7a7a', 0, 0) + ret(110, 1222, 860, 40, '#e9e1d2', 6, 3) + canetao([pena[0] + 40, pena[1] - 10]) + mao(d, pena, s) };
};
const ULTIMO_PAPEL = batidaPapel('tico', J(55.3), J(57.3), 'TE PAGO UM LANCHE, QUE TAL?', { expr: 'envergonhado', escrita: .55 });

// Posições fixas da cena do Jão
const J_TICO = 400, J_JAO = 680, MOTO_J = 980;
const tanque = [MOTO_J + 75 * 1.5, CHAO + 10 - 200 * 1.5];
const DAR_PERFUME = 33.4, BORRIFA = 34.8, BATE = 38.9;
const yTico = CHAO, yJao = CHAO;
const ombroTicoAlvo = (t) => [J_TICO + 40, pescocoY(CHARS.tico, yTico, 1.32) + 70];

const ep03Planos = [
  // Abertura: o fim do ep. 2, em preto e branco, com o áudio original
  { ini: 0, fim: I(37), cena: 'portaDiaAberta', cam: [[0, 540, 1190, 1.15]], cor: SEM_COR, cartaz: '7h58',
    atores: [{ id: 'fiscal', x: 170, y: 1600, s: .8, flip: true, poses: [[0, { expr: 'neutro' }]] }, { id: 'lua', x: 540, s: 1.4, poses: [[0, { expr: 'feliz', detalhe: 'brilho', armR: [14, 8] }]] }] },
  { ini: I(37), fim: AUDIO_TELA, cena: 'portaDiaAberta', cam: [[I(37), 540, 880, 1.45], [AUDIO_TELA, 540, 860, 1.52, AUDIO_TELA - I(37)]], cor: SEM_COR,
    atores: [{ id: 'lua', x: 540, s: 1.4, poses: [[0, { expr: 'feliz', detalhe: 'brilho', armR: [18, 150], propR: 'phone' }]] }] },
  { ini: AUDIO_TELA, fim: E(37) + .1, cena: 'vazio', cam: [[AUDIO_TELA, 540, 960, 1.02], [E(37) + .1, 540, 900, 1.14, E(37) + .1 - AUDIO_TELA]], cor: SEM_COR, fundo: (t) => telaAudio(t) },
  // A cor volta quando ele cheira a axila
  { ini: E(37) + .1, fim: T_FUGA, cena: 'rua', cam: [[E(37), 330, 900, 1.5], [T_FUGA, 330, 860, 1.7, 1]], painel: true, cor: (t) => .1 + .9 * sai((t - 7.45) / .45),
    fundo: () => motoSVG(780, CHAO + 10, 1.9), frente: (t) => fedorSVG(330, 640 + Math.sin(t * 3) * 5, t, 1),
    atores: [{ id: 'tico', x: 330, char: () => TICO_SUADO, poses: [[0, { expr: 'envergonhado', detalhe: 'suor', armR: [18, 150], propR: 'phone' }],
      [7.4, { expr: 'lado', propR: null, armR: [112, 196], head: -17, lean: 5 }], [CORRE, { expr: 'surpreso', armR: [14, 8], head: 2, lean: 0 }]] }] },
  { ini: T_FUGA, fim: BANHO, cena: 'rua', cam: [[T_FUGA, 560, 980, 1.08]],
    fundo: () => motoSVG(780, CHAO + 10, 1.9), frente: (t) => fedorSVG(330 + 900 * suave((t - T_FUGA) / .65) - 40, 650, t, .8),
    atores: [{ id: 'tico', xF: (t) => 330 + 900 * suave((t - T_FUGA) / .65), char: () => TICO_SUADO, dyn: (t) => ({ ...passo(t, 4.2, 1), lean: 9 }), poses: [[0, { expr: 'envergonhado', detalhe: 'suor' }]] }] },
  // Em casa, ainda suado: encosta na porta e pega o celular
  { ini: BANHO, fim: 10, cena: 'kitnet', cam: [[BANHO, 540, 960, 1.1], [10, 540, 900, 1.25, 1.2]],
    frente: (t) => fedorSVG(500, 620 + Math.sin(t * 3) * 5, t, .6),
    atores: [{ id: 'tico', x: 540, char: () => TICO_SUADO, poses: [[0, { expr: 'triste', detalhe: 'suor', head: 6, lean: -2 }], [9.4, { armR: [18, 150], propR: 'phone' }]] }] },
  // Título
  { ini: 10, fim: 11.5, cena: 'vazio', cam: [[10, 540, 960, 1], [11.5, 540, 940, 1.04, 1.5]], fundo: () => SerieVisual.abertura({ linha1: 'O DIA ERRADO', linha2: '' }) },
  // A mensagem, triste
  { ini: 11.5, fim: 12.3, cena: 'kitnet', cam: [[11.5, 540, 880, 1.7], [12.3, 540, 860, 1.78, .8]],
    atores: [{ id: 'tico', x: 540, char: () => TICO_SUADO, poses: [[0, { expr: 'triste', detalhe: 'suor', armR: [18, 150], propR: 'phone', head: 6 }]] }] },
  { ini: 12.3, fim: 13.5, cena: 'vazio', cheia: true, cam: [[12.3, 540, 960, 1], [13.5, 540, 900, 1.12, 1.2]], fundo: telaEnviada('Não vou conseguir te levar, aconteceu algumas coisas aqui.', 'Lua') },
  { ini: 13.5, fim: 14.7, cena: 'portaDiaAberta', cam: [[13.5, 540, 860, 1.55], [14.7, 540, 840, 1.65, 1.2]],
    atores: [{ id: 'lua', x: 540, s: 1.4, poses: [[0, { expr: 'surpreso', armR: [18, 150], propR: 'phone' }], [14.05, { expr: 'triste', detalhe: null }]] }] },
  // O ônibus e o corredor
  { ini: 14.7, fim: 15.6, cena: 'rua', cam: [[14.7, 540, 1000, 1.05]],
    fundo: (t) => onibusSVG(560 + 700 * sai((t - 14.75) / .85), CHAO + 30, .75),
    atores: [{ id: 'lua', xF: (t) => 760 - 480 * suave((t - 14.7) / .9), dyn: (t) => ({ ...passo(t, 4.4, .9), lean: -6 }), poses: [[0, { expr: 'preocupado' }]] }] },
  { ini: 15.6, fim: 16.5, cena: 'escritorio', cam: [[15.6, 540, 1000, 1]],
    atores: [{ id: 'lua', xF: (t) => 980 - 420 * suave((t - 15.6) / .9), sF: (t) => 1.32 - .16 * suave((t - 15.6) / .9), dyn: (t) => ({ ...passo(t, 4.4, .9), lean: -6 }), poses: [[0, { expr: 'preocupado' }]] }] },
  { ini: 16.5, fim: I(3) - .1, cena: 'escritorio', cam: [[16.5, 540, 840, 1.6]],
    atores: [{ id: 'lua', x: 540, poses: [[0, { expr: 'preocupado', armR: [24, 40] }], [16.95, { expr: 'surpreso', armR: [14, 8] }]] }],
    frente: (t) => vidro(1120 - 780 * sai((t - 16.6) / .35), 420) },
  { ini: I(3) - .1, fim: I(4) - .1, cena: 'salaReuniao', cam: [[I(3) - .1, 555, 860, 1.3]],
    atores: [
      { id: 'ceo', x: 420, dyn: (t) => ({ armL: bracoAte(-1, [555, 1150 + Math.sin(t * 14) * 10], CHARS.ceo, 420, CHAO, 1.32), frente: 'L' }), poses: [[0, { expr: 'rindo' }]] },
      { id: 'junior', x: 690, dyn: (t) => ({ armL: bracoAte(-1, [560, 1150 + Math.sin(t * 14) * 10], CHARS.junior, 690, CHAO, 1.32) }), poses: [[0, { expr: 'feliz' }]] }],
    frente: (t) => vidro(-40, 1160, 200, 1800, .16) + [0, 1, 2].map((i) => `<text x="${150 + i * 380}" y="${560 + Math.sin(t * 9 + i) * 12}" font-family="${FONTE}" font-size="54" fill="#f2d36b" stroke="${OUT}" stroke-width="2" text-anchor="middle">👏</text>`).join('') },
  { ini: I(4) - .1, fim: I(5) - .2, cena: 'escritorio', cam: [[I(4) - .1, 520, 880, 1.25]],
    atores: [
      { id: 'lua', x: 300, poses: [[0, { expr: 'surpreso' }], [I(4) + .8, { expr: 'preocupado' }]] },
      { id: 'junior', x: 720, dyn: () => ({ armL: bracoAte(-1, [600, 1150], CHARS.junior, 720, CHAO, 1.32) }), poses: [[0, { expr: 'feliz' }]] }],
    frente: () => vidro(610, 440) + ret(586, 520, 30, 1080, '#5a6672', 0, 0) },
  { ini: I(5) - .2, fim: 21.4, cena: 'escritorio', cam: [[I(5) - .2, 300, 800, 1.85]],
    atores: [{ id: 'lua', x: 300, poses: [[0, { expr: 'forcado' }]] }] },
  { ini: 21.4, fim: 22.9, cena: 'vazio', cheia: true, cam: [[21.4, 540, 960, 1], [22.9, 540, 930, 1.06, 1.5]], fundo: telaRecebida('Cheguei atrasada.', 'Lua') },
  { ini: 22.9, fim: 23.8, cena: 'kitnet', cam: [[22.9, 540, 860, 1.85]],
    atores: [{ id: 'tico', x: 540, char: () => TICO_SUADO, poses: [[0, { expr: 'triste', detalhe: 'suor', armR: [18, 150], propR: 'phone', head: 5 }]] }] },
  // 20h: a Companheira volta ao Jão
  { ini: 23.8, fim: I(6) - .1, cena: 'casaJao', visual: NOITE, cam: [[23.8, 600, 1000, 1], [I(6), 600, 960, 1.08, 1.2]], cartaz: '20h', painel: true,
    fundo: () => motoSVG(MOTO_J, CHAO + 10, 1.5),
    atores: [
      { id: 'tico', x: J_TICO, poses: [[0, { expr: 'triste', propR: 'chave', armR: [18, 60], head: 5 }]] },
      { id: 'jao', x: J_JAO, poses: [[0, { expr: 'neutro', armL: [-38, 32], armR: [38, -32] }]] }] },
  { ini: I(6) - .1, fim: I(7) - .15, cena: 'casaJao', visual: NOITE, cam: [[I(6) - .1, 600, 880, 1.25], [I(7), 620, 860, 1.32, 2.5]],
    fundo: () => motoSVG(MOTO_J, CHAO + 10, 1.5),
    atores: [
      { id: 'tico', x: J_TICO, poses: [[0, { expr: 'triste', propR: 'chave', armR: [18, 60], head: 5 }], [I(6) + 1.6, { expr: 'triste', armR: bracoAte(1, [540, 1150], CHARS.tico, J_TICO, CHAO, 1.32) }]] },
      { id: 'jao', x: J_JAO, poses: [[0, { expr: 'neutro', armL: [-38, 32], armR: [38, -32] }], [I(6) + 1.8, { expr: 'lado', armL: bracoAte(-1, [545, 1150], CHARS.jao, J_JAO, CHAO, 1.32), armR: [14, 8] }]] }] },
  { ini: I(7) - .15, fim: E(7) + .2, cena: 'casaJao', visual: NOITE, cam: [[I(7) - .15, 760, 860, 1.5]],
    fundo: () => motoSVG(MOTO_J, CHAO + 10, 1.5),
    frente: (t) => (t > I(7) + .5 && t < I(7) + 1.1 ? txt(tanque[0] + 40, tanque[1] - 80, 'TOC', 46, '#fff3d9') : ''),
    atores: [{ id: 'jao', x: J_JAO, dyn: (t) => ({ armR: bracoAte(1, [tanque[0], tanque[1] - (t > I(7) + .45 ? 0 : 60)], CHARS.jao, J_JAO, CHAO, 1.32) }), poses: [[0, { expr: 'lado', propL: 'chave', armL: [-20, 60] }]] }] },
  { ini: E(7) + .2, fim: E(8) + .1, cena: 'casaJao', visual: NOITE, cam: [[E(7) + .2, J_TICO, 800, 1.85]],
    atores: [{ id: 'tico', x: J_TICO, poses: [[0, { expr: 'triste', head: 6 }]] }] },
  { ini: E(8) + .1, fim: 36.0, cena: 'casaJao', visual: NOITE, cam: [[E(8) + .1, 540, 880, 1.3]],
    fundo: () => motoSVG(MOTO_J, CHAO + 10, 1.5),
    frente: (t) => {
      const pT = t < DAR_PERFUME + .45 ? null : t < BORRIFA - .15 ? [J_TICO + 120, 1130] : [J_TICO + 90, cabecaY(CHARS.tico, CHAO, 1.32) - 30];
      const pJ = [J_JAO - 120 - 80 * sai((t - DAR_PERFUME) / .4), 1130];
      const garrafa = pT ? perfumeSVG(pT[0], pT[1] + 6, 1.2) + mao(CHARS.tico, pT, 1.32) : perfumeSVG(pJ[0], pJ[1] + 6, 1.2) + mao(CHARS.jao, pJ, 1.32);
      return garrafa + nuvemPerfumeSVG(J_TICO + 40, cabecaY(CHARS.tico, CHAO, 1.32) - 20, (t - BORRIFA) / 1.4);
    },
    atores: [
      { id: 'tico', x: J_TICO, dyn: (t) => t < DAR_PERFUME + .45 ? {} : t < BORRIFA - .15 ? { armR: bracoAte(1, [J_TICO + 120, 1130], CHARS.tico, J_TICO, CHAO, 1.32) } : { armR: bracoAte(1, [J_TICO + 90, cabecaY(CHARS.tico, CHAO, 1.32) - 30], CHARS.tico, J_TICO, CHAO, 1.32) },
        poses: [[0, { expr: 'triste' }], [DAR_PERFUME + .3, { expr: 'surpreso' }], [BORRIFA + .25, { expr: 'cansado', mouth: 'wide', head: 8 }]] },
      { id: 'jao', x: J_JAO, dyn: (t) => t < DAR_PERFUME + .45 ? { armL: bracoAte(-1, [J_JAO - 120 - 80 * sai((t - DAR_PERFUME) / .4), 1130], CHARS.jao, J_JAO, CHAO, 1.32) } : {},
        poses: [[0, { expr: 'preocupado' }], [BORRIFA + .3, { expr: 'surpreso' }]] }] },
  { ini: 36.0, fim: E(10) + .1, cena: 'casaJao', visual: NOITE, cam: [[36.0, J_JAO, 800, 1.75]],
    frente: (t) => nuvemPerfumeSVG(J_JAO - 200, 760, .45 + (t - 36) * .2),
    atores: [{ id: 'jao', x: J_JAO, dyn: (t) => ({ armL: [-120 + Math.sin(t * 12) * 20, -170 + Math.sin(t * 12) * 25] }), poses: [[0, { expr: 'rindo' }]] }] },
  { ini: E(10) + .1, fim: I(12) - .1, cena: 'casaJao', visual: NOITE, cam: [[E(10) + .1, J_TICO, 800, 1.85]],
    atores: [{ id: 'tico', x: J_TICO, poses: [[0, { expr: 'envergonhado', armL: [-30, 120] }]] }] },
  { ini: I(12) - .1, fim: 39.7, cena: 'casaJao', visual: NOITE, cam: [[I(12) - .1, 540, 880, 1.3]],
    fundo: () => motoSVG(MOTO_J, CHAO + 10, 1.5),
    atores: [
      { id: 'tico', x: J_TICO, poses: [[0, { expr: 'envergonhado' }], [BATE + .1, { expr: 'pensando' }]] },
      { id: 'jao', x: J_JAO, dyn: (t) => t > BATE - .2 ? { armL: bracoAte(-1, ombroTicoAlvo(t), CHARS.jao, J_JAO, CHAO, 1.32) } : {}, poses: [[0, { expr: 'neutro' }]] }] },
  // As janelas
  { ini: 39.7, fim: 40.5, cena: 'vazio', cheia: true, cam: [[39.7, 540, 960, 1], [40.5, 540, 900, 1.12, .8]], fundo: telaEnviada('Olha pra janela.', 'Lua') },
  { ini: 40.5, fim: 41.2, cena: 'janelaTico', cobrePernas: true, visual: NOITE, cam: [[40.5, 540, 960, 1], [41.2, 540, 940, 1.04, .7]],
    atores: [{ id: 'tico', x: 540, y: yParaCabeca(CHARS.tico, 1.9, ALTURA_CABECA), s: 1.9, dyn: () => ({ semPernas: true }), poses: [[0, { expr: 'preocupado', armR: [24, 160], propR: 'phone' }]] }],
    frente: () => ret(-200, 1240, 1480, 900, '#9a6a55', 0, 0) + ret(110, 1222, 860, 40, '#e9e1d2', 6, 3) + ret(260, 1170, 520, 60, '#fbf8f0', 4, 2) + canetao([820, 1215]) },
  { ini: 41.2, fim: 42.5, cena: 'janelas', cobrePernas: true, visual: NOITE, cam: [[41.2, 540, 1000, 1], [42.5, 540, 1000, 1.06, 1.3]],
    atores: [NA_JANELA('tico', 140, 40, null, 'preocupado'), { ...NA_JANELA('lua', 740, 41.2, null, 'cansado'), dyn: (t) => ({ semPernas: true, head: t < 41.7 ? 14 : 0 }) }],
    frente: frenteJanelas(null, null) },
  ...ESCRITA.map(([q, a, b, tx, o]) => batidaPapel(q, a, b, tx, o)),
  // Foco na Lua: ela lê o papel e pensa. A votação aparece sobre ela.
  LUA_PENSA(J(57.3), VOTO, [[J(57.3), 540, 900, 1.3], [VOTO, 540, 860, 1.5, VOTO - J(57.3)]]),
  { ...LUA_PENSA(VOTO, DEPOIS, [[VOTO, 540, 640, .95], [DEPOIS, 540, 630, .99, 5]]), cor: () => 0 },
  // Depois do voto: o CEO, maior, passa a mão no alto da cabeça do Júnior, que se inclina
  { ini: DEPOIS, fim: FIM_DO_EP, cena: 'salaReuniao', canto: true, cam: [[DEPOIS, 570, 860, 1.32], [FIM_DO_EP, 570, 830, 1.42, FIM_DO_EP - DEPOIS]],
    frente: (t) => t > J(64.45) ? mao(CHARS.ceo, afago(t), 1.5) : '',
    atores: [
      // O braço do CEO passa atrás da cabeça do Júnior; só a mão aparece, por cima do cabelo
      { id: 'ceo', x: 450, s: 1.5, dyn: (t) => ({ armR: t < J(64.45) ? [14, 8] : bracoAte(1, afago(t), CHARS.ceo, 450, CHAO, 1.5) }), poses: [[0, { expr: 'rindo' }]] },
      { id: 'junior', x: 700, char: (t) => t > J(65.1) ? JUNIOR_BAGUNCA : CHARS.junior, dyn: (t) => ({ lean: -10 * suave((t - J(64.3)) / .3) }), poses: [[0, { expr: 'feliz' }], [J(65.3), { expr: 'envergonhado' }]] }] },
];

/* ---------- Telas sobre a imagem ---------- */
const painel = (u, pb) => {
  u.cartao(30, 70, 500, 138, pb ? '#222222' : '#2a1f22');
  u.texto('Desempregado: 93 dias', 56, 105, 32, '#ffffff', 'left');
  u.texto('Nota: 5,0', 56, 148, 32, pb ? '#ffffff' : '#7fe08a', 'left');
  u.texto('Dívida: R$ 0', 56, 188, 32, '#ffffff', 'left');
};
const bordasEscuras = (p, s, u) => { const v = u.g.createRadialGradient(540, 860, 420, 540, 960, 1120); v.addColorStop(0, 'rgba(20,20,20,0)'); v.addColorStop(1, 'rgba(20,20,20,.62)'); u.g.fillStyle = v; u.g.fillRect(0, 0, 1080, 1920); };
const ep03Telas = [
  ...ep03Planos.filter((pl) => pl.cartaz).map((pl) => ({ ini: pl.ini, fim: pl.fim, desenha: (p, s, u) => { u.g.globalAlpha = Math.min(1, s / .2); u.cartao(690, 90, 340, 118, '#2a1f22'); u.texto(pl.cartaz, 860, 150, 62, '#ffd83a'); u.g.globalAlpha = 1; } })),
  ...ep03Planos.filter((pl) => pl.painel).map((pl) => ({ ini: pl.ini, fim: pl.fim, desenha: (p, s, u) => painel(u, false) })),
  // Bordas escuras da lembrança, como no ep. 2, somem com a cor
  { ini: 0, fim: 7.9, desenha: (p, s, u) => { u.g.globalAlpha = 1 - sai((s - 7.45) / .45); bordasEscuras(p, s, u); u.g.globalAlpha = 1; } },
  // Notificação do áudio, como no ep. 2
  { ini: I(37), fim: I(37) + 1.5, desenha: (p, s, u) => { u.g.globalAlpha = Math.min(1, s / .35, (1.5 - s) / .3); u.cartao(130, 260, 820, 110, '#2f8f4e'); u.texto('Lua: áudio 0:06', 540, 315, 46, '#ffffff'); u.g.globalAlpha = 1; } },
  // Votação, no layout da ficha: título, duas opções e as setas
  { ini: VOTO, fim: DEPOIS, desenha: (p, s, u) => {
    const g = u.g; g.globalAlpha = u.sai(s / .35);
    g.fillStyle = '#1c1f29'; g.fillRect(0, 0, 1080, 860);
    u.texto('QUAL VAI SER, LUA?', 540, 140, 62, '#ffffff');
    u.texto('Comente ACEITA ou AGORA NÃO', 540, 210, 34, '#d9d9d9');
    const opcao = (y, cor, grande, peq, tinta) => { u.cartao(170, y, 820, 210, cor); u.texto(grande, 580, y + 92, 96, tinta); u.texto(peq, 580, y + 168, 34, tinta); };
    opcao(290, '#35d04a', 'ACEITA', 'Topa o lanche, sem pressa', '#08280d');
    opcao(570, '#ff4f6e', 'AGORA NÃO', 'Hoje ela não tem cabeça', '#3a0612');
    SerieVisual.seta(g, 52, 330, s); SerieVisual.seta(g, 52, 610, s);
    g.globalAlpha = 1;
  } },
  { ini: DEPOIS, fim: FIM_DO_EP, desenha: (p, s, u) => { u.cartao(620, 120, 410, 110, 'rgba(255,246,230,.95)'); u.texto('Aceita', 825, 156, 34, '#1f9e33'); u.texto('ou agora não?', 825, 198, 34, '#e0304f'); } },
];

// Tela do áudio, igual ao ep. 2
function telaAudio(t) {
  const barras = []; for (let i = 0; i < 18; i++) { const h = 28 + Math.abs(Math.sin(i * 1.7 + t * 9)) * 92; barras.push(`<rect x="${312 + i * 26}" y="${900 - h / 2}" width="15" height="${h}" rx="7" fill="#2f8f4e"/>`); }
  return moldura(ret(220, 170, 640, 150, '#2f8f4e', 18, 0) + txt(540, 262, 'Lua', 64, '#fff') + ret(258, 800, 564, 200, '#d9f2c8', 30) + barras.join(''));
}

const EPISODIO = {
  duracao: FIM_DO_EP,
  falas: FALAS,
  planos: ep03Planos,
  telas: ep03Telas,
  visual: { ambiente: 'claro', lado: 'direita' },
  latidos: [],
  impactos: [],
  destaques: { 37: 'obrigada', 3: 'júnior', 4: 'arquivo', 5: 'mando', 6: 'compensar', 7: 'mancada', 8: 'causa', 9: 'presente', 10: 'dedetização', 11: 'encontro', 12: 'ouvindo', 18: 'menino' },
};
