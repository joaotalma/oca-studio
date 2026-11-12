'use strict';
ESTILO_RIG = 'classico'; // fixado na Oca Studio (2026-11-12): episódio feito com o rig clássico
// Episódio 4: É Só Uma Corrida. Planos, poses e telas. Falas e tempos vêm de falas.js e tempos.js.
const sai = (p) => { p = Math.max(0, Math.min(1, p)); return 1 - (1 - p) * (1 - p); };
const suave = (p) => { p = Math.max(0, Math.min(1, p)); return p * p * (3 - 2 * p); };
const clamp01 = (p) => Math.max(0, Math.min(1, p));
const F = Object.fromEntries(FALAS.map((f) => [f.n, f]));
const I = (n) => F[n].ini, E = (n) => F[n].fim;
const FIM_DO_EP = 61.8;
const NOITE = { ambiente: 'noite', lado: 'direita' };
const SEM_COR = () => .1; // mesmo filtro de lembrança dos eps. 2 e 3

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
const passo = (t, ritmo, amp = 1) => { const f = Math.sin(t * ritmo * Math.PI); return { liftL: Math.max(0, f) * amp, liftR: Math.max(0, -f) * amp, armL: [-14 - f * 20 * amp, -20 - f * 30 * amp], armR: [14 - f * 20 * amp, 20 - f * 30 * amp] }; };

/* ---------- telas de celular ---------- */
function quebra(texto, max) {
  const linhas = []; let a = '';
  for (const w of texto.split(' ')) { if (a && (a + ' ' + w).length > max) { linhas.push(a); a = w; } else a = a ? a + ' ' + w : w; }
  if (a) linhas.push(a);
  return linhas;
}
const moldura = (conteudo) => `<rect x="-200" y="-200" width="1480" height="2320" fill="#1c2a45"/>` + ret(190, 110, 700, 1500, '#23252f', 60) + ret(220, 170, 640, 1380, '#efe8dc', 18, 0) + conteudo;
const cabecalho = (nome, cor = '#2f8f4e') => ret(220, 170, 640, 140, cor, 18, 0) + `<circle cx="300" cy="240" r="40" fill="${nome === 'Lua' ? '#e9b18b' : '#d59a6e'}" stroke="#fff" stroke-width="4"/>` + txt(370, 258, nome, 46, '#fff', 'start');
const RASCUNHO = 'Mudando de assunto... Sobre aquele dia, eu queria explicar que não foi bem do jeito que pareceu. Primeiro: a moto. Segundo: o cheiro, que não era meu, era da situação. Terceiro: eu ensaiei um discurso. Quarto: eu sei que você disse agora não, mas tecnicamente isso aqui é outro assunto.';
// O rascunho rola para cima; ao apagar, some do fim para o começo
const telaRascunho = (t0, t1, apagando) => (t) => {
  const linhas = quebra(RASCUNHO, 26), q = clamp01((t - t0) / (t1 - t0));
  const vis = apagando ? linhas.slice(0, Math.max(0, Math.round(linhas.length * (1 - suave(q / .8))))) : linhas;
  const rola = apagando ? 0 : -q * 220;
  let s = cabecalho('Lua') + `<clipPath id="rascunho"><rect x="240" y="330" width="600" height="760"/></clipPath><g clip-path="url(#rascunho)"><g transform="translate(0 ${rola.toFixed(1)})">`;
  s += ret(250, 360, 580, 60 + Math.max(1, vis.length) * 44, '#ffffff', 26, 2) + vis.map((l, i) => txt(275, 412 + i * 44, l, 30, '#2a1f22', 'start')).join('') + '</g></g>';
  if (apagando && q > .82) s += `<g opacity="${sai((q - .82) / .12).toFixed(2)}">` + ret(300, 900, 480, 90, '#2a1f22', 20) + txt(540, 958, 'Rascunho apagado', 38, '#fff') + '</g>';
  return moldura(s + ret(220, 1130, 640, 420, '#d8d2c6', 0, 0) + txt(540, 1300, apagando ? '⌫' : '', 90, '#55606c'));
};
const telaDiaria = () => moldura(ret(220, 170, 640, 140, '#2a4f8a', 18, 0) + txt(540, 262, 'App de corridas', 46, '#fff')
  + ret(260, 470, 560, 600, '#fff6e6', 26, 3) + txt(540, 580, 'Nota 5,0!', 70, '#1f9e33') + txt(540, 690, 'Sua primeira', 44) + txt(540, 750, 'diária de carro', 44) + txt(540, 810, 'é grátis.', 44)
  + ret(330, 890, 420, 100, '#f2d36b', 20, 3) + txt(540, 955, 'Diária: R$ 0,00', 40));
const telaCorrida = () => moldura(ret(220, 170, 640, 140, '#2a4f8a', 18, 0) + txt(540, 262, 'Nova corrida', 50, '#fff')
  + ret(260, 470, 560, 560, '#fff6e6', 26, 3) + `<circle cx="540" cy="600" r="80" fill="#e9b18b" stroke="${OUT}" stroke-width="5"/>` + txt(540, 760, 'Lua M.', 64) + txt(540, 830, '★ 4,9', 46, '#e2a91f') + txt(540, 910, 'Conjunto Esperança', 36, '#55606c')
  + ret(320, 1100, 440, 110, '#1f9e33', 30, 3) + txt(540, 1172, 'Aceitar', 50, '#fff'));
const telaAvaliacao = (t0) => (t) => {
  const q = sai((t - t0 - .5) / .5), nota = (5 - 2 * q).toFixed(1).replace('.', ',');
  return moldura(ret(220, 170, 640, 140, '#2a4f8a', 18, 0) + txt(540, 262, 'Avaliação', 50, '#fff')
    + ret(260, 470, 560, 520, '#fff6e6', 26, 3) + txt(540, 580, 'Passageiro avaliou:', 40) + txt(540, 690, '★☆☆☆☆', 80, '#e2a91f') + txt(540, 790, '"Não deixou ligar', 36, '#55606c') + txt(540, 840, 'o ventilador."', 36, '#55606c')
    + ret(330, 1060, 420, 110, '#2a1f22', 20, 3) + txt(540, 1132, `Nota: ${nota}`, 50, q > .5 ? '#ff6a5a' : '#7fe08a'));
};

/* ---------- papéis na janela (mesma mecânica do ep. 3) ---------- */
let idPapel = 0;
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
const ALTURA_CABECA = 690, PAPEL_BAIXO = 1095, PAPEL_ALTO = 985;
// o.pronto: o papel já começa escrito e no alto. o.desce: [t0, t1] em que o papel baixa até sumir atrás do parapeito.
function batidaPapel(quem, t0, t1, texto, o = {}) {
  const d = CHARS[quem], s = 1.9, x = 540, y = yParaCabeca(d, s, ALTURA_CABECA);
  const espera = o.espera || 0, dur = t1 - t0, fimEscrita = o.pronto ? t0 - 1 : t0 + .1 + espera + dur * (o.escrita || .5), fimSobe = fimEscrita + .4;
  const prog = (t) => o.pronto ? 1 : clamp01((t - t0 - .1 - espera) / (fimEscrita - t0 - .1 - espera));
  const sobe = (t) => o.pronto ? 1 : suave((t - fimEscrita) / .4);
  const desce = (t) => o.desce ? suave((t - o.desce[0]) / (o.desce[1] - o.desce[0])) : 0;
  const centro = (t) => [540, PAPEL_BAIXO + (PAPEL_ALTO - PAPEL_BAIXO) * sobe(t) + 260 * desce(t)];
  const escala = (t) => .92 + .1 * sobe(t);
  const estado = (t) => { idPapel = 0; const [cx, cy] = centro(t); return papelSVG(cx, cy, escala(t), texto, prog(t), quem === 'lua'); };
  const maoEsq = (t) => { const [cx, cy] = centro(t); return [cx - 300 * escala(t) + 26, cy + 20]; };
  const naCaneta = (t) => { const p = estado(Math.min(t, fimEscrita)).pen, pr = prog(t), treme = pr > 0 && pr < 1 ? Math.sin(t * 46) * 6 : 0, ar = 30 * (1 - suave(pr / .08)); return [p[0] + 30, p[1] - 44 + treme - ar]; };
  const maoDir = (t) => {
    const q = sobe(t), a = naCaneta(t); if (q <= 0) return a;
    const [cx, cy] = centro(t), b = [cx + 300 * escala(t) - 26, cy + 20];
    return [a[0] + (b[0] - a[0]) * q, a[1] + (b[1] - a[1]) * q];
  };
  const dentro = (p, t) => { const [cx, cy] = centro(t); return [p[0] + (cx - p[0]) * .18, p[1] + (cy - p[1]) * .55 + 40]; };
  const parede = quem === 'tico' ? '#9a6a55' : '#5f7a7a';
  return {
    ini: t0, fim: t1, cena: quem === 'tico' ? 'janelaTico' : 'janelaLua', cobrePernas: true, visual: { ambiente: 'noite', lado: quem === 'tico' ? 'direita' : 'esquerda' },
    cam: [[t0, 540, 900, 1.3], [t1, 540, 890, 1.36, dur]],
    atores: [{ id: quem, x, y, s, dyn: (t) => ({ semPernas: true, armL: bracoAte(-1, dentro(maoEsq(t), t), d, x, y, s), armR: bracoAte(1, dentro(maoDir(t), t), d, x, y, s), head: 5 * (1 - sobe(t)) + 7 * desce(t), lean: 0 }),
      poses: [[0, { expr: o.expr || 'neutro' }], ...(o.depois ? [[fimSobe + .2, { expr: o.depois }]] : [])] }],
    frente: (t) => {
      const e = estado(t), md = maoDir(t);
      return e.svg + mao(d, maoEsq(t), s) + canetao([md[0] - 30 + 40 * sobe(t), md[1] + 44 - 14 * sobe(t)]) + mao(d, md, s)
        + ret(-200, 1240, 1480, 900, parede, 0, 0) + ret(110, 1222, 860, 40, '#e9e1d2', 6, 3);
    },
  };
}
const LUA_PENSA = (ini, fim, cam, extra = {}) => {
  const d = CHARS.lua, s = 1.9, y = yParaCabeca(d, s, ALTURA_CABECA), pena = [588, 838];
  return { ini, fim, cena: 'janelaLua', cobrePernas: true, visual: { ambiente: 'noite', lado: 'esquerda' }, cam, ...extra,
    atores: [{ id: 'lua', x: 540, y, s, dyn: (t) => ({ semPernas: true, armR: bracoAte(1, [pena[0] + 6, pena[1] + 12], d, 540, y, s), armL: [-12, -6], frente: 'R', head: Math.sin((t - ini) * 1.3) * 4 }), poses: [[0, { expr: 'pensando' }]] }],
    frente: () => ret(-200, 1240, 1480, 900, '#5f7a7a', 0, 0) + ret(110, 1222, 860, 40, '#e9e1d2', 6, 3) + canetao([pena[0] + 40, pena[1] - 10]) + mao(d, pena, s) };
};

/* ---------- personagens nas janelas do plano aberto ---------- */
const NA_JANELA = (quem, xJan, expr, extra = {}) => { const d = CHARS[quem], s = .62; return { id: quem, x: xJan + 100, y: yParaCabeca(d, s, 1030), s, dyn: () => ({ semPernas: true }), poses: [[0, { expr, ...extra }]] }; };

/* ---------- o caderno da avó ---------- */
const PAGINA_TXT = ['Bolo de fubá da vó', '3 ovos', '2 xícaras de fubá', '1 xícara de açúcar', '1 copo de leite', 'Descansar 40 minutos.'];
const paginaCaderno = (t, t0, t1) => {
  const q = clamp01((t - t0 - .3) / (t1 - t0 - .5));
  let s = `<rect x="-200" y="-200" width="1480" height="2320" fill="#6b4a36"/>` + `<g transform="rotate(-3 540 960)">`
    + ret(90, 420, 900, 1080, '#c9774f', 18, 5) + ret(120, 440, 410, 1040, '#f4e7c9', 6, 3) + ret(550, 440, 410, 1040, '#f4e7c9', 6, 3) + stroke('M540 440 V1480', '#a26a4a', 8);
  for (let i = 0; i < 16; i++) s += stroke(`M140 ${520 + i * 58} H510 M570 ${520 + i * 58} H940`, '#d8c7a4', 2);
  s += `<circle cx="300" cy="1230" r="70" fill="none" stroke="#b68b5c" stroke-width="10" opacity=".35"/>` + txt(320, 600, 'Pudim', 40, '#7a3f1f', 'middle', -2);
  s += PAGINA_TXT.map((l, i) => `<text x="575" y="${560 + i * 116 + (i === 5 ? 60 : 0)}" textLength="${Math.min(370, l.length * (i ? 17 : 19))}" lengthAdjust="spacingAndGlyphs" font-family="Segoe Script, Comic Sans MS, cursive" font-size="${i ? 34 : 38}" font-weight="${i ? 400 : 700}" fill="#4a3a8a">${esc(l)}</text>`).join('');
  s += stroke('M575 1205 Q750 1220 940 1200', '#4a3a8a', 4);
  const dx = 590 + 340 * suave(q), d = CHARS.lua;
  s += `<g transform="translate(${dx.toFixed(1)} 1215)">` + ret(-14, 0, 28, 120, d.skin, 14, 3) + `<circle cx="0" cy="170" r="70" fill="${d.skin}" stroke="${OUT}" stroke-width="4"/>` + '</g>';
  return s + '</g>';
};

/* ---------- o carro ---------- */
const CX = 540, CY = 1660, CK = .95;                 // carro de frente
const VOL = [CX + CARRO.volante[0] * CK, CY + CARRO.volante[1] * CK];
const MOT = { x: VOL[0], s: 1.0 }; MOT.y = yParaCabeca(CHARS.tico, MOT.s, 820);
const PAS = { x: 370, s: .8 };                         // banco de trás
const pasY = (id) => yParaCabeca(CHARS[id], PAS.s, 805);
const pegaVolante = (t, aperta = 0) => {
  const tr = Math.sin(t * 3.1) * 4 + (aperta ? Math.sin(t * 40) * 3 * aperta : 0);
  return [[VOL[0] - 112 * CK, VOL[1] - 8 + tr], [VOL[0] + 112 * CK, VOL[1] - 8 - tr]];
};
const motorista = (t, expr, extra = {}) => {
  const [a, b] = pegaVolante(t, extra.aperta || 0), d = CHARS.tico;
  return { id: 'tico', x: MOT.x, y: MOT.y + Math.sin(t * 9) * 1.5, s: MOT.s,
    dyn: (tt) => { const [aa, bb] = pegaVolante(tt, extra.aperta || 0); return { semPernas: true, armL: bracoAte(-1, aa, d, MOT.x, MOT.y, MOT.s), armR: extra.armR || bracoAte(1, bb, d, MOT.x, MOT.y, MOT.s) }; },
    poses: extra.poses || [[0, { expr, head: extra.head || 0 }]] };
};
const passageiro = (id, poses, extra = {}) => ({ id, x: PAS.x, y: pasY(id), s: PAS.s, dyn: (t) => ({ semPernas: true, ...(extra.dyn ? extra.dyn(t) : {}) }), poses });
const ruaCarro = (tarde) => (t) => SerieVisual.rua(t * 1.4, { ambiente: 'claro' }) + (tarde ? `<rect x="-300" y="-300" width="1680" height="2520" fill="#f08a3c" opacity=".2"/>` : '') + carroSVG(CX, CY + Math.sin(t * 9) * 2, CK, { parte: 'fundo' });
const frenteCarro = (extra = () => '', o = {}) => (t) => {
  const [a, b] = pegaVolante(t, o.aperta || 0), d = CHARS.tico;
  return extra(t) + mao(d, a, MOT.s) + (o.semMaoDir ? '' : mao(d, b, MOT.s)) + carroSVG(CX, CY + Math.sin(t * 9) * 2, CK, { telaApp: o.telaApp });
};
const vento = (t) => [0, 1, 2, 3, 4].map((i) => { const q = (t * 2.4 + i * .2) % 1; return stroke(`M${300 + q * 520} ${700 + i * 38} q40 -14 80 0`, '#ffffff', 5); }).join('');
const carroPlano = (ini, fim, cam, atores, o = {}) => ({ ini, fim, cena: 'vazio', cobrePernas: true, cam, fundo: ruaCarro(o.tarde), atores, frente: frenteCarro(o.extra, o), ...(o.plano || {}) });
// Retrovisor: o passageiro aparece dentro do espelho; fora dele, a vista da rua pelo para-brisa
const ESPELHO = [220, 330, 640, 260];
const retrovisor = (ini, fim, id, poses, o = {}) => {
  const d = CHARS[id], s = o.s || 1.9, y = yParaCabeca(d, s, o.cab || 470);
  return { ini, fim, cena: 'vazio', cobrePernas: true, cam: o.cam || [[ini, 540, 760, 1.25], [fim, 540, 740, 1.32, fim - ini]],
    fundo: () => `<rect x="-300" y="-300" width="1680" height="2520" fill="#3b3f4a"/>` + ret(-200, 300, 1480, 900, '#2c2f38', 0, 0) + ret(80, 620, 300, 260, '#4a4f5c', 40, 3),
    atores: [{ id, x: 540, y, s, flip: true, dyn: () => ({ semPernas: true, ...(o.dyn || {}) }), poses }],
    frente: (t) => { const [x, yy, w, h] = ESPELHO;
      return `<defs><clipPath id="foraEspelho"><path clip-rule="evenodd" d="M-300 -300 H1380 V2220 H-300Z M${x} ${yy} h${w} v${h} h${-w}Z"/></clipPath></defs>`
        + `<g clip-path="url(#foraEspelho)">` + SerieVisual.rua(t * 1.4, { ambiente: 'claro' }) + (o.tarde ? `<rect x="-300" y="-300" width="1680" height="2520" fill="#f08a3c" opacity=".2"/>` : '') + `<rect x="-300" y="-300" width="1680" height="330" fill="#262931"/>` + '</g>'
        + (o.extra ? o.extra(t) : '') + `<rect x="${x}" y="${yy}" width="${w}" height="${h}" rx="40" fill="#ffffff" opacity=".07"/>` + ret(x - 14, yy - 14, w + 28, h + 28, 'none', 52, 18) + ret(530, 250, 20, 70, '#262931', 6, 3); } };
};
// Muro da escola passando pela janela do carro
const ESCOLA = (t, t0) => {
  const dx = -((t - t0) * 520) % 2600;
  let s = `<rect x="-300" y="-300" width="1680" height="2520" fill="#9ec4dc"/>` + `<g transform="translate(${dx.toFixed(1)} 0)">`;
  for (let k = 0; k < 2; k++) {
    const o = k * 2600;
    s += ret(o - 200, 700, 2600, 900, '#e9dcc0', 0, 4) + ret(o - 200, 1400, 2600, 200, '#c9b893', 0, 0)
      + ret(o + 700, 760, 600, 700, '#3f8f5c', 10, 5) + [0, 1, 2, 3, 4, 5].map((i) => stroke(`M${o + 740 + i * 100} 780 V1440`, '#2e6b44', 10)).join('')
      + ret(o + 560, 600, 880, 120, '#fff6e6', 10, 5) + txt(o + 1000, 680, 'ESCOLA ESTADUAL VILA ESPERANÇA', 40, '#2a4f8a')
      + `<circle cx="${o + 250}" cy="1050" r="110" fill="#f2d36b" stroke="${OUT}" stroke-width="4"/>` + txt(o + 250, 1070, 'Sorria', 40, '#c23b3b')
      + SerieVisual.arvore(o + 1700, 1450, 1.1) + SerieVisual.arvore(o + 2200, 1460, .9);
  }
  return s + '</g>';
};
const janelaDoCarro = () => `<path fill-rule="evenodd" d="M-300 -300 H1380 V2220 H-300Z M90 420 Q90 320 220 320 H900 Q990 320 990 420 V1260 H90Z" fill="#d9dde0" stroke="${OUT}" stroke-width="6"/>`
  + ret(90, 1260, 900, 40, '#2a2d34', 10, 4) + `<path d="M120 380 L300 380 L180 900 L110 900Z" fill="#ffffff" opacity=".12"/>`;

/* ---------- Planos ---------- */
const COR = 1.5, TUDO = 4.0, QUARTO = 6.0, PAGINA = 7.4, ABRACA = 9.0, APAGA = 10.0, SOZINHO = 10.8, TITULO = 12.3, GARAGEM = 13.3;
const RASCUNHO_T = 14.6, APAGANDO = 21.3, DIARIA = 22.8, CHAVE = 26.9, GPS = 27.4, VENTILA = 31.4, CORRIDA = 31.9, PORTA = 33.1;
const CHEIRA = 35.8, ESCOLA_T = 41.2, OLHOS = 48.1, APERTA = 51.7, VOTO = 53.3, DEPOIS = 57.8, SO_ELE = 59.2;
const ombroTico = (x) => [x + 40, pescocoY(CHARS.tico, CHAO, 1.32) + 70];

const ep04Planos = [
  // Abertura: o fim do ep. 3 com o filtro de lembrança; a cor volta quando ela escreve
  LUA_PENSA(0, COR, [[0, 540, 900, 1.3], [COR, 540, 880, 1.36, COR]], { cor: SEM_COR }),
  { ...batidaPapel('lua', COR, TUDO, 'AGORA NÃO. NÃO TÔ COM CABEÇA.', { expr: 'cansado', escrita: .55 }), cor: (t) => .1 + .9 * sai((t - COR) / .4) },
  batidaPapel('tico', TUDO, QUARTO, 'TUDO BEM.', { expr: 'triste', escrita: .5 }),
  // O caderno da avó
  { ini: QUARTO, fim: PAGINA, cena: 'quartoLua', visual: NOITE, cam: [[QUARTO, 520, 960, 1.15], [PAGINA, 500, 940, 1.22, 1.4]],
    frente: (t) => { const q = suave((t - 6.45) / .75), p = [300 + 170 * q, 900 + 180 * q]; return cadernoSVG(p[0], p[1], 1.25, -10 + 10 * q) + (t > 6.3 ? mao(CHARS.lua, [p[0] + 30, p[1] + 10], 1.32) : ''); },
    atores: [{ id: 'lua', x: 520, dyn: (t) => { const q = suave((t - 6.45) / .75); return { armL: bracoAte(-1, [330 + 170 * q, 910 + 180 * q], CHARS.lua, 520, CHAO, 1.32) }; }, poses: [[0, { expr: 'cansado', head: -6 }], [6.6, { expr: 'pensando', head: 4 }]] }] },
  { ini: PAGINA, fim: ABRACA, cena: 'vazio', cam: [[PAGINA, 560, 980, 1.05], [ABRACA, 620, 1050, 1.18, 1.6]], fundo: (t) => paginaCaderno(t, PAGINA, ABRACA) },
  { ini: ABRACA, fim: APAGA, cena: 'quartoLua', visual: NOITE, cam: [[ABRACA, 520, 840, 1.7], [APAGA, 520, 830, 1.78, 1]],
    frente: () => cadernoSVG(520, 1030, 1.6, -4) + mao(CHARS.lua, [470, 1050], 1.32) + mao(CHARS.lua, [575, 1015], 1.32),
    atores: [{ id: 'lua', x: 520, dyn: () => ({ armL: bracoAte(-1, [470, 1050], CHARS.lua, 520, CHAO, 1.32), armR: bracoAte(1, [575, 1015], CHARS.lua, 520, CHAO, 1.32) }), poses: [[0, { expr: 'aliviado', head: 5 }]] }] },
  // A janela dela apaga
  { ini: APAGA, fim: SOZINHO, cena: 'janelas', cobrePernas: true, visual: NOITE, cam: [[APAGA, 540, 1000, 1], [SOZINHO, 540, 1000, 1.05, .8]],
    atores: [NA_JANELA('tico', 140, 'triste'), NA_JANELA('lua', 740, 'aliviado')],
    frente: (t) => { const a = sai((t - APAGA - .25) / .15); idPapel = 0;
      return ret(130, 1200, 230, 400, '#9a6a55', 0, 0) + ret(730, 1200, 230, 400, '#5f7a7a', 0, 0) + ret(128, 1196, 224, 12, '#e9e1d2', 2, 2) + ret(728, 1196, 224, 12, '#e9e1d2', 2, 2)
        + papelSVG(240, 1080, .3, 'TUDO BEM.', 1, false).svg + `<rect x="740" y="940" width="200" height="260" fill="#1a1f2c" opacity="${(a * .93).toFixed(2)}"/>`; } },
  // Riso que engasga: ele sozinho, o papel descendo
  batidaPapel('tico', SOZINHO, TITULO, 'TUDO BEM.', { pronto: true, expr: 'triste', desce: [SOZINHO + .4, TITULO - .1] }),
  { ini: TITULO, fim: GARAGEM, cena: 'vazio', cam: [[TITULO, 540, 960, 1], [GARAGEM, 540, 945, 1.03, 1]], fundo: () => SerieVisual.abertura({ linha1: 'É SÓ UMA CORRIDA', linha2: '' }) },
  // Três dias depois, na garagem do Jão
  { ini: GARAGEM, fim: RASCUNHO_T, cena: 'casaJaoDia', cam: [[GARAGEM, 560, 900, 1.25]], cartaz: 'Três dias depois', painel: true,
    fundo: () => motoSVG(980, CHAO + 10, 1.5),
    atores: [{ id: 'tico', x: 400, poses: [[0, { expr: 'pensando' }]] }, { id: 'jao', x: 680, poses: [[0, { expr: 'lado', armR: [18, 150], propR: 'phone', head: 6 }]] }] },
  { ini: RASCUNHO_T, fim: E(1) + .1, cena: 'vazio', cheia: true, cam: [[RASCUNHO_T, 540, 960, 1], [E(1) + .1, 540, 930, 1.06, 1.3]], fundo: telaRascunho(RASCUNHO_T, E(1) + .1, false) },
  { ini: E(1) + .1, fim: I(3) - .1, cena: 'casaJaoDia', cam: [[E(1) + .1, 400, 800, 1.85]],
    atores: [{ id: 'tico', x: 400, dyn: (t) => ({ armR: [80 + Math.sin(t * 6) * 8, 150] }), poses: [[0, { expr: 'envergonhado' }]] }] },
  // O Jão devolve o celular; a troca de mão acontece no corte para o plano mais fechado
  { ini: I(3) - .1, fim: I(3) + 1.2, cena: 'casaJaoDia', cam: [[I(3) - .1, 560, 880, 1.3]],
    fundo: () => motoSVG(980, CHAO + 10, 1.5),
    atores: [{ id: 'tico', x: 400, poses: [[0, { expr: 'envergonhado' }]] },
      { id: 'jao', x: 680, poses: [[0, { expr: 'neutro', armL: bracoAte(-1, [545, 1150], CHARS.jao, 680, CHAO, 1.32), propL: 'phone' }]] }] },
  { ini: I(3) + 1.2, fim: APAGANDO, cena: 'casaJaoDia', cam: [[I(3) + 1.2, 520, 820, 1.55]],
    fundo: () => motoSVG(980, CHAO + 10, 1.5),
    atores: [{ id: 'tico', x: 400, poses: [[0, { expr: 'triste', armR: [18, 150], propR: 'phone' }]] },
      { id: 'jao', x: 680, poses: [[0, { expr: 'neutro', armL: [-38, 32], armR: [38, -32] }]] }] },
  { ini: APAGANDO, fim: DIARIA, cena: 'vazio', cheia: true, cam: [[APAGANDO, 540, 960, 1], [DIARIA, 540, 940, 1.05, 1.5]], fundo: telaRascunho(APAGANDO, DIARIA, true) },
  { ini: DIARIA, fim: I(4) - .1, cena: 'vazio', cheia: true, cam: [[DIARIA, 540, 960, 1], [I(4), 540, 920, 1.08, 1.5]], fundo: telaDiaria },
  { ini: I(4) - .1, fim: CHAVE, cena: 'casaJaoDia', cam: [[I(4) - .1, 560, 880, 1.3]],
    fundo: () => motoSVG(980, CHAO + 10, 1.5),
    atores: [{ id: 'tico', x: 400, poses: [[0, { expr: 'feliz', armR: [18, 150], propR: 'phone' }]] },
      { id: 'jao', x: 680, dyn: (t) => ({ armL: bracoAte(-1, ombroTico(400 + 30 * (t > I(4) + .9 ? Math.sin((t - I(4)) * 14) * .4 : 0)), CHARS.jao, 680, CHAO, 1.32) }), poses: [[0, { expr: 'rindo' }]] }] },
  { ini: CHAVE, fim: GPS, cena: 'vazio', cam: [[CHAVE, 540, 960, 1.1], [GPS, 540, 940, 1.16, .5]],
    fundo: (t) => `<rect x="-300" y="-300" width="1680" height="2520" fill="#e3b07c"/>` + `<circle cx="540" cy="1100" r="230" fill="${CHARS.tico.skin}" stroke="${OUT}" stroke-width="6"/>`
      + `<g transform="translate(560 ${880 + Math.sin(t * 8) * 10}) rotate(${Math.sin(t * 6) * 6})">` + ell(0, 0, 60, 60, '#c7cbd0', OUT, 5) + ret(-14, 50, 28, 210, '#c7cbd0', 6, 4) + ret(-40, -260, 220, 120, '#f2d36b', 14, 4) + txt(70, -185, 'LOCADORA', 30, OUT) + '</g>'
      + ret(380, 1010, 320, 70, CHARS.tico.skin, 30, 5) },
  // Motorista
  { ini: GPS, fim: I(5) - .2, cena: 'vazio', cheia: true, cam: [[GPS, 540, 960, 1], [I(5), 540, 960, 1.06, 1.2]],
    fundo: (t) => SerieVisual.gps({ pontos: [[.5, 1], [.5, .55], [.15, .4], [0, .1]], progresso: .15 + .2 * sai((t - GPS) / 1.2), hora: '09:40', prazo: 'Rota: 14 km' }) },
  retrovisor(I(5) - .2, E(5) + .1, 'vendedor', [[0, { expr: 'feliz', armR: [18, 60] }]], { s: 2.2, cab: 520, extra: (t) => ventiladorSVG(330, 560, 1.2, t * .05) }),
  carroPlano(E(5) + .1, VENTILA, [[E(5) + .1, MOT.x, 820, 1.9]], [passageiro('vendedor', [[0, { expr: 'feliz' }]]), motorista(0, 'cansado')]),
  carroPlano(VENTILA, CORRIDA, [[VENTILA, 540, 1000, 1.05]], [passageiro('vendedor', [[0, { expr: 'surpreso' }]]), motorista(0, 'surpreso')],
    { extra: (t) => ventiladorSVG(PAS.x, 1000, .9, t) + vento(t) }),
  // É corrida
  { ini: CORRIDA, fim: PORTA, cena: 'vazio', cheia: true, cam: [[CORRIDA, 540, 960, 1], [PORTA, 540, 930, 1.07, 1.2]], fundo: telaCorrida },
  { ini: PORTA, fim: I(7) - .1, cena: 'portaDiaAberta', cam: [[PORTA, 540, 1000, 1.05]],
    atores: [{ id: 'lua', xF: () => 540, sF: (t) => 1.32 + .2 * suave((t - PORTA) / .5), yF: (t) => CHAO + 60 * suave((t - PORTA) / .5), dyn: (t) => passo(t, 3, .7), poses: [[0, { expr: 'cansado' }]] }] },
  carroPlano(I(7) - .1, E(7) + .1, [[I(7) - .1, PAS.x, 800, 2.0]], [passageiro('lua', [[0, { expr: 'neutro' }]]), motorista(0, 'envergonhado')], { tarde: true }),
  carroPlano(E(7) + .1, CHEIRA, [[E(7) + .1, MOT.x, 820, 1.9]], [passageiro('lua', [[0, { expr: 'neutro' }]]), motorista(0, 'envergonhado', { armR: [80, 150] })], { tarde: true, semMaoDir: true }),
  retrovisor(CHEIRA, I(9) - .1, 'lua', [[0, { expr: 'pensando', head: 6 }]], { s: 1.7, cab: 500, tarde: true }),
  carroPlano(I(9) - .1, E(9) + .1, [[I(9) - .1, PAS.x, 800, 2.0]], [passageiro('lua', [[0, { expr: 'surpreso', armR: [60, 120] }]]), motorista(0, 'envergonhado')],
    { tarde: true, extra: () => stroke(`M${PAS.x + 62} 880 Q${PAS.x + 120} 930 ${PAS.x + 95} 990 M${PAS.x - 40} 1010 L${PAS.x + 40} 900`, '#2a2d34', 14) + stroke(`M${PAS.x + 62} 880 Q${PAS.x + 120} 930 ${PAS.x + 95} 990 M${PAS.x - 40} 1010 L${PAS.x + 40} 900`, '#4a4f5c', 6) }),
  carroPlano(E(9) + .1, ESCOLA_T, [[E(9) + .1, MOT.x, 820, 1.9]], [passageiro('lua', [[0, { expr: 'lado' }]]), motorista(0, 'forcado')], { tarde: true }),
  // A pergunta
  { ini: ESCOLA_T, fim: I(11) - .1, cena: 'vazio', cam: [[ESCOLA_T, 540, 900, 1.05], [I(11), 540, 900, 1.1, 1.6]], fundo: (t) => ESCOLA(t, ESCOLA_T), frente: janelaDoCarro },
  carroPlano(I(11) - .1, E(11) + .1, [[I(11) - .1, PAS.x, 800, 2.0]], [passageiro('lua', [[0, { expr: 'feliz', head: -6 }]]), motorista(0, 'neutro')], { tarde: true }),
  carroPlano(E(11) + .1, E(12) + .05, [[E(11) + .1, MOT.x, 820, 1.9]], [passageiro('lua', [[0, { expr: 'feliz' }]]), motorista(0, 'feliz')], { tarde: true }),
  carroPlano(E(12) + .05, OLHOS, [[E(12) + .05, PAS.x, 800, 2.1]], [passageiro('lua', [[0, { expr: 'rindo' }], [OLHOS - .25, { expr: 'neutro' }]]), motorista(0, 'feliz')], { tarde: true }),
  retrovisor(OLHOS, APERTA, 'lua', [[0, { expr: 'neutro' }], [I(13) - .1, { expr: 'triste' }]], { s: 2.4, cab: 520, tarde: true, cam: [[OLHOS, 540, 600, 1.6], [APERTA, 540, 580, 1.75, APERTA - OLHOS]] }),
  carroPlano(APERTA, VOTO, [[APERTA, MOT.x, 860, 1.6], [VOTO, MOT.x, 840, 1.85, VOTO - APERTA]], [motorista(0, 'surpreso', { aperta: 1, poses: [[0, { expr: 'surpreso', mouth: 'small' }]] })], { tarde: true, aperta: 1 }),
  // Votação: o close do Tico em preto e branco
  { ...carroPlano(VOTO, DEPOIS, [[VOTO, MOT.x, 640, 1.15]], [motorista(0, 'surpreso', { aperta: 1, poses: [[0, { expr: 'surpreso', mouth: 'small' }]] })], { tarde: true, aperta: 1 }), cor: () => 0 },
  // Depois do voto
  { ini: DEPOIS, fim: SO_ELE, cena: 'vazio', cheia: true, cam: [[DEPOIS, 540, 960, 1], [SO_ELE, 540, 940, 1.05, 1.4]], fundo: telaAvaliacao(DEPOIS), canto: true },
  { ...carroPlano(SO_ELE, FIM_DO_EP, [[SO_ELE, MOT.x, 820, 1.9], [FIM_DO_EP, MOT.x, 810, 2.0, FIM_DO_EP - SO_ELE]], [motorista(0, 'cansado', { armR: [18, 150], poses: [[0, { expr: 'cansado', propR: 'phone' }]] })], { semMaoDir: true }), canto: true, painel: true, notaBaixa: true },
];

/* ---------- Telas sobre a imagem ---------- */
const painel = (u, nota) => {
  u.cartao(30, 70, 500, 138, '#2a1f22');
  u.texto('Desempregado: 96 dias', 56, 105, 32, '#ffffff', 'left');
  u.texto(`Nota: ${nota}`, 56, 148, 32, nota === '5,0' ? '#7fe08a' : '#ff6a5a', 'left');
  u.texto('Dívida: R$ 0', 56, 188, 32, '#ffffff', 'left');
};
const bordasEscuras = (p, s, u) => { const v = u.g.createRadialGradient(540, 860, 420, 540, 960, 1120); v.addColorStop(0, 'rgba(20,20,20,0)'); v.addColorStop(1, 'rgba(20,20,20,.62)'); u.g.fillStyle = v; u.g.fillRect(0, 0, 1080, 1920); };
const ep04Telas = [
  { ini: 0, fim: COR + .4, desenha: (p, s, u) => { u.g.globalAlpha = 1 - sai((s - COR) / .4); bordasEscuras(p, s, u); u.g.globalAlpha = 1; } },
  ...ep04Planos.filter((pl) => pl.cartaz).map((pl) => ({ ini: pl.ini, fim: pl.fim, desenha: (p, s, u) => { u.g.globalAlpha = Math.min(1, s / .2); u.cartao(560, 230, 490, 100, '#2a1f22'); u.texto(pl.cartaz, 805, 282, 46, '#ffd83a'); u.g.globalAlpha = 1; } })),
  ...ep04Planos.filter((pl) => pl.painel).map((pl) => ({ ini: pl.ini, fim: pl.fim, desenha: (p, s, u) => painel(u, pl.notaBaixa ? '3,0' : '5,0') })),
  { ini: VOTO, fim: DEPOIS, desenha: (p, s, u) => {
    const g = u.g; g.globalAlpha = u.sai(s / .35);
    g.fillStyle = '#1c1f29'; g.fillRect(0, 0, 1080, 860);
    u.texto('QUAL VAI SER, TICO?', 540, 140, 62, '#ffffff');
    u.texto('Comente VERDADE ou DESCULPA', 540, 210, 34, '#d9d9d9');
    const opcao = (y, cor, grande, peq, tinta) => { u.cartao(170, y, 820, 210, cor); u.texto(grande, 580, y + 92, 96, tinta); u.texto(peq, 580, y + 168, 32, tinta); };
    opcao(290, '#35d04a', 'VERDADE', 'Conta que fugiu do próprio cheiro', '#08280d');
    opcao(570, '#ff4f6e', 'DESCULPA', 'Inventa um problema na moto', '#3a0612');
    SerieVisual.seta(g, 52, 330, s); SerieVisual.seta(g, 52, 610, s);
    g.globalAlpha = 1;
  } },
  ...ep04Planos.filter((pl) => pl.canto).map((pl) => ({ ini: pl.ini, fim: pl.fim, desenha: (p, s, u) => { u.cartao(620, 250, 410, 110, 'rgba(255,246,230,.95)'); u.texto('Verdade', 825, 286, 34, '#1f9e33'); u.texto('ou desculpa?', 825, 328, 34, '#e0304f'); } })),
];

const EPISODIO = {
  duracao: FIM_DO_EP,
  falas: FALAS,
  planos: ep04Planos,
  telas: ep04Telas,
  visual: { ambiente: 'claro', lado: 'direita' },
  latidos: [],
  impactos: [],
  destaques: { 1: 'parágrafos', 2: 'nunca', 3: 'apaga', 4: 'estrelas', 5: 'ligar', 6: 'cinto', 7: 'corrida', 8: 'sei', 9: 'perfume', 10: 'precisando', 11: 'aula', 12: 'junto', 13: 'sumiu', 14: 'jeito' },
};
