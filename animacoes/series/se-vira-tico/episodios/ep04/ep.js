'use strict';
ESTILO_RIG = 'classico'; // fixado na Oca Studio (2026-11-12): episódio publicado com o rig clássico
// Episódio 4: É Só Uma Corrida. Planos, poses e telas. Falas e tempos vêm de falas.js e tempos.js.
const sai = (p) => { p = Math.max(0, Math.min(1, p)); return 1 - (1 - p) * (1 - p); };
const suave = (p) => { p = Math.max(0, Math.min(1, p)); return p * p * (3 - 2 * p); };
const clamp01 = (p) => Math.max(0, Math.min(1, p));
const F = Object.fromEntries(FALAS.map((f) => [f.n, f]));
const I = (n) => F[n].ini, E = (n) => F[n].fim;
const FIM_DO_EP = 67.2;
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
function bracoFora(lado, alvo, d, x, y, s) {
  const [ox, oy] = ombroDe(lado, d, x, y, s);
  const a = d.armU * s, b = d.armF * s, dx = alvo[0] - ox, dy = alvo[1] - oy, dist = Math.min(a + b - 2, Math.hypot(dx, dy));
  const base = Math.atan2(dx, dy) * 180 / Math.PI, abre = Math.acos(clamp01((a * a + dist * dist - b * b) / (2 * a * dist))) * 180 / Math.PI;
  const curva = Math.acos(clamp01((a * a + b * b - dist * dist) / (2 * a * b))) * 180 / Math.PI;
  const up = base + lado * abre;
  return [up, up - lado * (180 - curva)];
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
const FUNDO_TELA = `<defs><radialGradient id="brilhoTela" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#34507a"/><stop offset="1" stop-color="#16203a"/></radialGradient></defs><rect x="-200" y="-200" width="1480" height="2320" fill="url(#brilhoTela)"/>`
  + [[120, 300, 70], [980, 420, 50], [90, 1500, 90], [1000, 1650, 60], [960, 980, 34]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#ffd98a" opacity=".1"/>`).join('');
const PAPEL_PAREDE = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<circle cx="${270 + (i % 4) * 160}" cy="${400 + Math.floor(i / 4) * 420 + (i % 2) * 90}" r="26" fill="none" stroke="#d9cfbf" stroke-width="5"/>`).join('');
const moldura = (conteudo) => FUNDO_TELA + `<rect x="200" y="124" width="700" height="1500" rx="60" fill="#000" opacity=".25"/>` + ret(190, 110, 700, 1500, '#23252f', 60)
  + ret(884, 420, 14, 120, '#23252f', 6, 0) + ret(884, 580, 14, 80, '#23252f', 6, 0) + ret(220, 170, 640, 1380, '#efe8dc', 18, 0) + PAPEL_PAREDE + conteudo + `<circle cx="540" cy="140" r="9" fill="#3b3f4a"/>`;
const cabecalho = (nome, cor = '#2f8f4e') => ret(220, 170, 640, 140, cor, 18, 0) + `<circle cx="300" cy="240" r="40" fill="${nome === 'Lua' ? '#e9b18b' : '#d59a6e'}" stroke="#fff" stroke-width="4"/>` + txt(370, 258, nome, 46, '#fff', 'start');
const RASCUNHO = 'Mudando de assunto... Sobre aquele dia, eu queria explicar que não foi bem do jeito que pareceu. Primeiro: a moto. Segundo: o cheiro, que não era meu, era da situação. Terceiro: eu ensaiei um discurso. Quarto: eu sei que você disse agora não, mas tecnicamente isso aqui é outro assunto.';
// Conversa: [quem, texto, tempo em que chega]. Antes de cada mensagem da Lua, "digitando...".
const telaConversa = (msgs) => (t) => {
  let s = cabecalho('Lua') + ret(470, 345, 140, 50, '#e1f0f7', 25, 0) + txt(540, 380, 'Hoje', 28, '#55606c'), y = 430;
  const digitando = msgs.some(([q, , tm]) => q === 'lua' && t > tm - .45 && t < tm);
  for (const [q, texto, tm] of msgs) {
    if (t < tm) continue;
    const a = sai((t - tm) / .2), linhas = quebra(texto, 18), h = 70 + linhas.length * 52, w = Math.min(560, 70 + Math.max(...linhas.map((l) => l.length)) * 23), x = q === 'lua' ? 245 : 835 - w;
    s += `<g opacity="${a.toFixed(2)}" transform="translate(0 ${(16 * (1 - a)).toFixed(1)})">` + ret(x, y, w, h, q === 'lua' ? '#ffffff' : '#d4f5c4', 24, 2) + linhas.map((l, i) => txt(x + 30, y + 62 + i * 52, l, 40, '#2a1f22', 'start')).join('') + txt(x + w - 20, y + h - 14, q === 'lua' ? '23:41' : '23:42 ✓✓', 22, '#7a8a90', 'end') + '</g>';
    y += h + 28;
  }
  if (digitando) s += ret(250, y, 150, 70, '#ffffff', 30, 2) + [0, 1, 2].map((i) => `<circle cx="${290 + i * 36}" cy="${y + 35}" r="${(9 + 3 * Math.max(0, Math.sin(t * 9 - i))).toFixed(1)}" fill="#9aa3aa"/>`).join('');
  return moldura(s + ret(220, 1430, 640, 120, '#f7f3ec', 0, 0) + ret(250, 1452, 480, 76, '#ffffff', 38, 2) + txt(290, 1502, 'Mensagem', 32, '#9aa3aa', 'start') + `<circle cx="790" cy="1490" r="38" fill="#2f8f4e"/>`);
};
const CONVERSA = [['lua', 'Aceito o lanche.', 2.0], ['lua', 'Mas outro dia? Hoje tô sem cabeça.', 3.0], ['tico', 'Fechado. Quando você quiser.', 5.8]];

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
  const nota = '5,0';
  return moldura(ret(220, 170, 640, 140, '#2a4f8a', 18, 0) + txt(540, 262, 'Avaliação', 50, '#fff')
    + ret(260, 470, 560, 520, '#fff6e6', 26, 3) + txt(540, 580, 'Passageira avaliou:', 40) + txt(540, 690, '★★★★★', 80, '#e2a91f') + txt(540, 790, '"Motorista ótimo,', 36, '#55606c') + txt(540, 840, 'concordou com tudo."', 36, '#55606c')
    + ret(330, 1060, 420, 110, '#2a1f22', 20, 3) + txt(540, 1132, `Nota: ${nota}`, 50, '#7fe08a'));
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
    atores: [{ id: 'lua', x: 540, y, s, dyn: (t) => ({ semPernas: true, armR: [9, 5], armL: [-9, -5], head: Math.sin((t - ini) * 1.3) * 4 }), poses: [[0, { expr: 'pensando' }]] }],
    frente: () => ret(-200, 1240, 1480, 900, '#5f7a7a', 0, 0) + ret(110, 1222, 860, 40, '#e9e1d2', 6, 3) };
};

/* ---------- o Tico na janela, lendo no celular ---------- */
const TICO_CELULAR = (ini, fim, poses, cam) => {
  const d = CHARS.tico, s = 1.9, y = yParaCabeca(d, s, ALTURA_CABECA), mD = [590, 1120];
  return { ini, fim, cena: 'janelaTico', cobrePernas: true, visual: { ambiente: 'noite', lado: 'direita' }, cam,
    atores: [{ id: 'tico', x: 540, y, s, dyn: (t) => ({ semPernas: true, armL: [-9, -5], armR: bracoFora(1, mD, d, 540, y, s), head: 6 + Math.sin((t - ini) * 1.6) * 2 }), poses }],
    frente: () => `<ellipse cx="540" cy="760" rx="230" ry="260" fill="#cfe8ff" opacity=".16"/>`
      + `<g transform="rotate(-6 590 1060)">` + ret(535, 950, 110, 190, '#23252f', 18, 4) + ell(561, 976, 10, 10, '#55606c', OUT, 2) + '</g>'
      + mao(d, mD, s) + ret(-200, 1240, 1480, 900, '#9a6a55', 0, 0) + ret(110, 1222, 860, 40, '#e9e1d2', 6, 3) };
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
  return [[VOL[0] - 92 * CK, VOL[1] - 34 + tr], [VOL[0] + 92 * CK, VOL[1] - 34 - tr]];
};
const motorista = (t, expr, extra = {}) => {
  const [a, b] = pegaVolante(t, extra.aperta || 0), d = CHARS.tico;
  return { id: 'tico', x: MOT.x, y: MOT.y + Math.sin(t * 9) * 1.5, s: MOT.s,
    dyn: (tt) => { const [aa, bb] = pegaVolante(tt, extra.aperta || 0); return { semPernas: true, armL: bracoFora(-1, aa, d, MOT.x, MOT.y, MOT.s), armR: extra.armR || bracoFora(1, bb, d, MOT.x, MOT.y, MOT.s) }; },
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
const nuvem = (x, y, k) => `<path transform="translate(${x.toFixed(1)} ${y}) scale(${k})" d="M-120 0 Q-120 -60 -60 -60 Q-40 -120 30 -100 Q90 -140 130 -70 Q190 -60 180 0Z" fill="#ffffff" opacity=".95"/>`;
const ESCOLA = (t, t0) => {
  const dx = -((t - t0) * 520);
  let s = `<defs><linearGradient id="ceuEscola" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fb6e0"/><stop offset="1" stop-color="#cfe6f2"/></linearGradient></defs><rect x="-300" y="-300" width="1680" height="2520" fill="url(#ceuEscola)"/>`
    + nuvem(260 + dx * .15, 470, 1) + nuvem(820 + dx * .15, 400, .8) + nuvem(1400 + dx * .15, 520, .9);
  s += `<g transform="translate(${dx.toFixed(1)} 0)">` + ret(-400, 700, 3200, 760, '#efe1c2', 0, 4) + ret(-400, 690, 3200, 40, '#c9774f', 0, 3) + ret(-400, 1400, 3200, 220, '#c9b893', 0, 0)
    + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => stroke(`M${-380 + k * 330} 1420 l120 0`, '#b5a47f', 6)).join('')
    + `<circle cx="160" cy="900" r="70" fill="#f2d36b" stroke="${OUT}" stroke-width="4"/>` + [0, 1, 2, 3, 4, 5, 6, 7].map((k) => stroke(`M${(160 + Math.cos(k * .785) * 85).toFixed(1)} ${(900 + Math.sin(k * .785) * 85).toFixed(1)} l${(Math.cos(k * .785) * 35).toFixed(1)} ${(Math.sin(k * .785) * 35).toFixed(1)}`, '#e2a91f', 6)).join('')
    + shape('M-40 1250 L60 1150 L160 1250Z', '#e8736f', 4) + ret(-20, 1250, 160, 120, '#8fd3e8', 0, 4) + ret(300, 1150, 30, 220, '#7a5a44', 0, 3) + `<circle cx="315" cy="1120" r="80" fill="#5fae5a" stroke="${OUT}" stroke-width="4"/>`
    + ret(720, 820, 560, 600, '#3f8f5c', 10, 5) + [0, 1, 2, 3, 4, 5].map((k) => stroke(`M${760 + k * 96} 840 V1400`, '#2e6b44', 10)).join('')
    + ret(660, 560, 680, 170, '#fff6e6', 12, 5) + txt(1000, 632, 'ESCOLA ESTADUAL', 46, '#2a4f8a') + txt(1000, 692, 'VILA ESPERANÇA', 46, '#c23b3b')
    + SerieVisual.arvore(1750, 1450, 1.1) + SerieVisual.arvore(2250, 1460, .9) + '</g>';
  return s;
};
const janelaDoCarro = () => `<path fill-rule="evenodd" d="M-300 -300 H1380 V2220 H-300Z M90 420 Q90 320 220 320 H900 Q990 320 990 420 V1260 H90Z" fill="#4a4f5c" stroke="${OUT}" stroke-width="6"/>`
  + ret(60, 1420, 960, 120, '#5b606d', 30, 4) + ret(700, 1600, 220, 70, '#3b3f4a', 30, 4) + ret(740, 1618, 140, 34, '#c7cbd0', 17, 3)
  + ret(90, 1260, 900, 40, '#2a2d34', 10, 4) + `<path d="M120 380 L300 380 L180 900 L110 900Z" fill="#ffffff" opacity=".12"/>`;

/* ---------- a Dona Cida e as sacolas da festa ---------- */
const sacola = (x, y, k, cor, alca = '#2a1f22') => `<g transform="translate(${x} ${y}) scale(${k})">` + shape('M-60 0 L-50 -130 L50 -130 L60 0Z', cor, 4) + stroke('M-28 -130 Q-28 -175 0 -175 Q28 -175 28 -130', alca, 6) + '</g>';
const balao = (x, y, k, cor, t = 0, fio = 260, texto = '') => { const b = Math.sin(t * 2.2 + x) * 8;
  return stroke(`M${x + b} ${y + 70 * k} Q${x - 20} ${y + 70 * k + fio / 2} ${x} ${y + 70 * k + fio}`, '#55606c', 3) + `<ellipse cx="${(x + b).toFixed(1)}" cy="${y}" rx="${56 * k}" ry="${70 * k}" fill="${cor}" stroke="${OUT}" stroke-width="4"/>`
    + `<ellipse cx="${(x + b - 18 * k).toFixed(1)}" cy="${y - 26 * k}" rx="${12 * k}" ry="${20 * k}" fill="#ffffff" opacity=".45"/>` + (texto ? txt(x + b, y + 16 * k, texto, 44 * k, '#fff6e6') : ''); };
const ursinho = (x, y, k) => `<g transform="translate(${x} ${y}) scale(${k})">` + ell(-34, -96, 18, 18, '#b57f5c', OUT, 3) + ell(34, -96, 18, 18, '#b57f5c', OUT, 3) + ell(0, -70, 46, 42, '#c9956c', OUT, 4) + ell(0, -56, 18, 13, '#e9c9a8', OUT, 2) + ell(-15, -78, 5, 5, OUT, OUT, 0) + ell(15, -78, 5, 5, OUT, OUT, 0) + '</g>';
const sacolasNoBanco = (t) => sacola(PAS.x - 150, 1040, 1.05, '#e8736f') + sacola(PAS.x + 160, 1050, .95, '#8fd3e8') + ursinho(PAS.x + 40, 1010, .6) + balao(PAS.x - 110, 800, .75, '#f2d36b', t, 160);

/* ---------- a festa: a "netinha" de 40 anos ---------- */
const fachadaFesta = (t) => `<rect x="-300" y="-300" width="1680" height="2520" fill="#9fd0ea"/>` + ret(-300, 360, 1680, 1300, '#f2c7a0', 0, 4) + ret(-300, 340, 1680, 40, '#c9774f', 0, 3)
  + ret(380, 760, 330, 840, '#7a5a44', 8, 5) + ell(660, 1200, 14, 14, '#f2d36b', OUT, 3) + ret(-60, 760, 300, 260, '#cfe6f2', 8, 5) + stroke('M90 760 V1020 M-60 890 H240', OUT, 5) + ret(840, 760, 300, 260, '#cfe6f2', 8, 5) + stroke('M990 760 V1020 M840 890 H1140', OUT, 5)
  + stroke('M-40 520 Q540 660 1120 520', OUT, 4) + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => { const x = 20 + k * 110, y = 540 + Math.sin(k / 9 * Math.PI) * 70; return shape(`M${x} ${y} L${x + 70} ${y + 4} L${x + 36} ${y + 80}Z`, ['#e8736f', '#f2d36b', '#8fd3e8', '#a8b94c'][k % 4], 3); }).join('')
  + ret(250, 410, 580, 110, '#fff6e6', 14, 4) + txt(540, 482, 'FELIZ ANIVERSÁRIO!', 50, '#c23b3b')
  + balao(330, 820, 1, '#e8736f', t, 220) + balao(250, 900, .9, '#8fd3e8', t, 180) + balao(930, 760, 1.35, '#f2d36b', t, 260, '40') + balao(170, 930, .9, '#a8b94c', t, 170)
  + `<rect x="-300" y="${CHAO - 40}" width="1680" height="420" fill="#c9b893"/>` + ret(-300, CHAO - 40, 1680, 14, '#2a1f22', 0, 0);

/* ---------- rua do GPS: perspectiva até o horizonte, sem cobrir o aparelho ---------- */
const ruaGps = (t) => {
  const furo = 'M142 1176 H628 A46 46 0 0 1 674 1222 V1818 A46 46 0 0 1 628 1864 H142 A46 46 0 0 1 96 1818 V1222 A46 46 0 0 1 142 1176Z';
  const off = (-t * 260) % 115;
  return `<defs><clipPath id="semGps"><path clip-rule="evenodd" d="M-300 898 H1380 V2300 H-300Z ${furo}"/></clipPath></defs><g clip-path="url(#semGps)">`
    + `<rect x="-300" y="898" width="1680" height="1400" fill="#a29282"/>`
    + shape('M530 900 L590 900 Q700 1300 1240 2300 L180 2300 Q470 1300 530 900Z', '#464b57', 0)
    + stroke('M560 902 Q600 1300 710 2300', '#e4c27d', 9).replace('/>', ` stroke-dasharray="60 55" stroke-dashoffset="${off.toFixed(1)}"/>`)
    + stroke('M533 902 Q470 1300 180 2300 M587 902 Q700 1300 1240 2300', '#2a2d34', 6) + '</g>';
};

/* ---------- cinto da Lua no banco de trás ---------- */
const CINTO = `M${PAS.x + 78} 830 L${PAS.x + 34} 884 L${PAS.x - 22} 1004`;
const cintoLua = () => stroke(CINTO, '#2a2d34', 16) + stroke(CINTO, '#4a4f5c', 8) + ret(PAS.x - 36, 992, 34, 22, '#c7cbd0', 4, 3);

/* ---------- Planos ---------- */
const COR = 1.5, TUDO = 4.6, RESPOSTA = 5.6, QUARTO = 6.4, PAGINA = 7.6, ABRACA = 9.0, APAGA = 10.0, SOZINHO = 10.8, TITULO = 12.3, GARAGEM = 13.3;
const RASCUNHO_T = 14.6, APAGANDO = 21.3, DIARIA = 22.8, CHAVE = 26.9, GPS = 27.4, CORRIDA = 36.3, PORTA = 37.5;
const CHEIRA = 40.2, ESCOLA_T = 45.6, OLHOS = 52.5, APERTA = 56.1, VOTO = 57.7, DEPOIS = 62.2, SO_ELE = 63.6;
const ombroTico = (x) => [x + 40, pescocoY(CHARS.tico, CHAO, 1.32) + 70];

const ep04Planos = [
  // Abertura: o fim do ep. 3 com o filtro de lembrança; a cor volta quando ela escreve
  LUA_PENSA(0, COR, [[0, 540, 900, 1.3], [COR, 540, 880, 1.36, COR]], { cor: SEM_COR }),
  { ini: COR, fim: TUDO, cena: 'vazio', cheia: true, cam: [[COR, 540, 960, 1], [TUDO, 540, 930, 1.06, TUDO - COR]], fundo: telaConversa(CONVERSA), cor: (t) => .1 + .9 * sai((t - COR) / .4) },
  TICO_CELULAR(TUDO, RESPOSTA, [[0, { expr: 'surpreso' }], [TUDO + .45, { expr: 'rindo' }]], [[TUDO, 540, 900, 1.3], [RESPOSTA, 540, 880, 1.38, RESPOSTA - TUDO]]),
  { ini: RESPOSTA, fim: QUARTO, cena: 'vazio', cheia: true, cam: [[RESPOSTA, 540, 930, 1.06]], fundo: telaConversa(CONVERSA) },
  // O caderno da avó
  { ini: QUARTO, fim: PAGINA, cena: 'quartoLua', visual: NOITE, cam: [[QUARTO, 520, 960, 1.15], [PAGINA, 500, 940, 1.22, 1.4]],
    frente: (t) => { const q = suave((t - 6.85) / .75), p = [300 + 170 * q, 900 + 180 * q]; return cadernoSVG(p[0], p[1], 1.25, -10 + 10 * q) + (t > 6.7 ? mao(CHARS.lua, [p[0] + 30, p[1] + 10], 1.32) : ''); },
    atores: [{ id: 'lua', x: 520, dyn: (t) => { const q = suave((t - 6.85) / .75); return { armL: bracoAte(-1, [330 + 170 * q, 910 + 180 * q], CHARS.lua, 520, CHAO, 1.32) }; }, poses: [[0, { expr: 'cansado', head: -6 }], [7.0, { expr: 'pensando', head: 4 }]] }] },
  { ini: PAGINA, fim: ABRACA, cena: 'vazio', cam: [[PAGINA, 560, 980, 1.05], [ABRACA, 620, 1050, 1.18, 1.6]], fundo: (t) => paginaCaderno(t, PAGINA, ABRACA) },
  { ini: ABRACA, fim: APAGA, cena: 'quartoLua', visual: NOITE, cam: [[ABRACA, 520, 840, 1.7], [APAGA, 520, 830, 1.78, 1]],
    frente: () => cadernoSVG(520, 1030, 1.6, -4) + mao(CHARS.lua, [470, 1050], 1.32) + mao(CHARS.lua, [575, 1015], 1.32),
    atores: [{ id: 'lua', x: 520, dyn: () => ({ armL: bracoAte(-1, [470, 1050], CHARS.lua, 520, CHAO, 1.32), armR: bracoAte(1, [575, 1015], CHARS.lua, 520, CHAO, 1.32) }), poses: [[0, { expr: 'aliviado', head: 5 }]] }] },
  // A janela dela apaga
  { ini: APAGA, fim: SOZINHO, cena: 'janelas', cobrePernas: true, visual: NOITE, cam: [[APAGA, 540, 1000, 1], [SOZINHO, 540, 1000, 1.05, .8]],
    atores: [NA_JANELA('tico', 140, 'triste'), NA_JANELA('lua', 740, 'aliviado')],
    frente: (t) => { const a = sai((t - APAGA - .25) / .15); idPapel = 0;
      return ret(130, 1200, 230, 400, '#9a6a55', 0, 0) + ret(730, 1200, 230, 400, '#5f7a7a', 0, 0) + ret(128, 1196, 224, 12, '#e9e1d2', 2, 2) + ret(728, 1196, 224, 12, '#e9e1d2', 2, 2)
        + `<ellipse cx="240" cy="1010" rx="60" ry="70" fill="#cfe8ff" opacity=".3"/>` + ret(222, 1080, 36, 60, '#23252f', 6, 2) + `<rect x="740" y="940" width="200" height="260" fill="#1a1f2c" opacity="${(a * .93).toFixed(2)}"/>`; } },
  // Riso que engasga: o sorriso fica sozinho no escuro
  TICO_CELULAR(SOZINHO, TITULO, [[0, { expr: 'rindo' }], [SOZINHO + .55, { expr: 'neutro' }], [SOZINHO + 1.05, { expr: 'triste' }]], [[SOZINHO, 540, 860, 1.3], [TITULO, 540, 820, 1.5, TITULO - SOZINHO]]),
  { ini: TITULO, fim: GARAGEM, cena: 'vazio', cam: [[TITULO, 540, 960, 1], [GARAGEM, 540, 945, 1.03, 1]], fundo: () => SerieVisual.abertura({ linha1: 'É SÓ UMA CORRIDA', linha2: '' }) },
  // Três dias depois, na garagem do Jão
  { ini: GARAGEM, fim: RASCUNHO_T, cena: 'casaJaoDia', cam: [[GARAGEM, 540, 900, 1.12], [RASCUNHO_T, 560, 890, 1.18, RASCUNHO_T - GARAGEM]], cartaz: 'Três dias depois', painel: true,
    fundo: () => motoSVG(980, CHAO + 10, 1.5),
    atores: [{ id: 'tico', x: 470, poses: [[0, { expr: 'pensando' }]] }, { id: 'jao', x: 740, poses: [[0, { expr: 'lado', armR: [18, 150], propR: 'phone', head: 6 }]] }] },
  { ini: RASCUNHO_T, fim: E(1) + .1, cena: 'vazio', cheia: true, cam: [[RASCUNHO_T, 540, 960, 1], [E(1) + .1, 540, 930, 1.06, 1.3]], fundo: telaRascunho(RASCUNHO_T, E(1) + .1, false) },
  { ini: E(1) + .1, fim: I(3) - .1, cena: 'casaJaoDia', cam: [[E(1) + .1, 470, 800, 1.85]],
    atores: [{ id: 'tico', x: 470, dyn: (t) => ({ armR: [80 + Math.sin(t * 6) * 8, 150] }), poses: [[0, { expr: 'envergonhado' }]] }] },
  // O Jão devolve o celular; a troca de mão acontece no corte para o plano mais fechado
  { ini: I(3) - .1, fim: I(3) + 1.2, cena: 'casaJaoDia', cam: [[I(3) - .1, 600, 880, 1.3]],
    fundo: () => motoSVG(980, CHAO + 10, 1.5),
    atores: [{ id: 'tico', x: 470, poses: [[0, { expr: 'envergonhado' }]] },
      { id: 'jao', x: 740, poses: [[0, { expr: 'neutro', armL: [-14, -158], propL: 'phone' }]] }] },
  { ini: I(3) + 1.2, fim: APAGANDO, cena: 'casaJaoDia', cam: [[I(3) + 1.2, 600, 820, 1.55]],
    fundo: () => motoSVG(980, CHAO + 10, 1.5),
    atores: [{ id: 'tico', x: 470, poses: [[0, { expr: 'triste', armR: [18, 150], propR: 'phone' }]] },
      { id: 'jao', x: 740, poses: [[0, { expr: 'neutro', armL: [-38, 32], armR: [38, -32] }]] }] },
  { ini: APAGANDO, fim: DIARIA, cena: 'vazio', cheia: true, cam: [[APAGANDO, 540, 960, 1], [DIARIA, 540, 940, 1.05, 1.5]], fundo: telaRascunho(APAGANDO, DIARIA, true) },
  { ini: DIARIA, fim: I(4) - .1, cena: 'vazio', cheia: true, cam: [[DIARIA, 540, 960, 1], [I(4), 540, 920, 1.08, 1.5]], fundo: telaDiaria },
  { ini: I(4) - .1, fim: CHAVE, cena: 'casaJaoDia', cam: [[I(4) - .1, 600, 880, 1.3]],
    fundo: () => motoSVG(980, CHAO + 10, 1.5),
    atores: [{ id: 'tico', x: 470, poses: [[0, { expr: 'feliz', armR: [18, 150], propR: 'phone' }]] },
      { id: 'jao', x: 740, dyn: (t) => ({ armL: bracoAte(-1, ombroTico(470 + 30 * (t > I(4) + .9 ? Math.sin((t - I(4)) * 14) * .4 : 0)), CHARS.jao, 740, CHAO, 1.32) }), poses: [[0, { expr: 'rindo' }]] }] },
  { ini: CHAVE, fim: GPS, cena: 'vazio', cam: [[CHAVE, 540, 960, 1.1], [GPS, 540, 940, 1.16, .5]],
    fundo: (t) => { const pele = CHARS.tico.skin;
      return `<defs><filter id="desfoca" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="26"/></filter></defs>`
        + `<rect x="-300" y="-300" width="1680" height="2520" fill="#c08a62"/>` + `<g filter="url(#desfoca)">` + ret(560, 600, 420, 1400, '#3b4d5e', 0, 0) + ret(-100, 300, 420, 300, '#3c6f9a', 20, 0)
        + `<ellipse cx="880" cy="1500" rx="260" ry="190" fill="#c23b3b"/><ellipse cx="880" cy="1330" rx="90" ry="80" fill="#f2d36b"/>` + ret(-300, 1500, 1680, 700, '#77707a', 0, 0) + `<ellipse cx="200" cy="700" rx="200" ry="160" fill="#fff1c9" opacity=".7"/>` + '</g>'
        + `<g transform="rotate(${(Math.sin(t * 5) * 7).toFixed(2)} 540 690)">` + ell(540, 740, 54, 54, '#c7cbd0', OUT, 6) + ell(540, 740, 36, 36, '#c08a62', 'none', 0)
          + `<g transform="translate(540 780)">` + ell(0, 30, 44, 44, '#c7cbd0', OUT, 5) + ell(0, 30, 16, 16, '#c08a62', OUT, 3) + ret(-13, 70, 26, 230, '#c7cbd0', 6, 4) + ret(-13, 235, 44, 20, '#c7cbd0', 3, 3) + ret(-13, 270, 34, 20, '#c7cbd0', 3, 3) + '</g>'
          + `<g transform="rotate(16 540 760)">` + ret(600, 720, 230, 120, '#f2d36b', 14, 4) + `<circle cx="624" cy="780" r="11" fill="#c08a62" stroke="${OUT}" stroke-width="3"/>` + txt(725, 792, 'LOCADORA', 32, OUT) + '</g>' + '</g>'
        + ret(495, -200, 90, 930, pele, 45, 5) + ret(512, 640, 56, 62, '#f3d3c0', 22, 0) + stroke('M495 560 Q540 575 585 560', '#a86d4e', 4); } },
  // Motorista
  { ini: GPS, fim: I(5) - .2, cena: 'vazio', cheia: true, cam: [[GPS, 540, 960, 1], [I(5), 540, 960, 1.06, 1.2]],
    fundo: (t) => SerieVisual.gps({ pontos: [[.5, 1], [.5, .55], [.15, .4], [0, .1]], progresso: .15 + .2 * sai((t - GPS) / 1.2), hora: '09:40', prazo: 'Rota: 14 km' }) + ruaGps(t) },
  retrovisor(I(5) - .2, E(5) + .1, 'cida', [[0, { expr: 'feliz' }]], { s: 2.2, cab: 520, extra: (t) => balao(330, 470, 1, '#f2d36b', t, 120) + balao(760, 440, .8, '#e8736f', t, 120) }),
  carroPlano(E(5) + .1, E(6) + .1, [[E(5) + .1, MOT.x, 820, 1.9]], [passageiro('cida', [[0, { expr: 'feliz' }]]), motorista(0, 'cansado')], { extra: sacolasNoBanco }),
  carroPlano(E(6) + .1, E(7) + .1, [[E(6) + .1, 540, 1000, 1.05], [E(7) + .1, 520, 980, 1.12, E(7) - E(6)]], [passageiro('cida', [[0, { expr: 'triste', head: -5 }]]), motorista(0, 'neutro')], { extra: sacolasNoBanco }),
  carroPlano(E(7) + .1, CORRIDA, [[E(7) + .1, 540, 1000, 1.1]], [passageiro('cida', [[0, { expr: 'feliz', mouth: 'o' }], [E(7) + .4, { expr: 'feliz' }], [E(7) + .7, { expr: 'feliz', mouth: 'o' }], [E(8) + .1, { expr: 'feliz' }], [E(8) + .35, { expr: 'feliz', mouth: 'o' }]]),
    motorista(0, 'neutro', { poses: [0, .25, .5, .75, 1, 1.25, 1.5].map((k, i) => [E(7) + .1 + k, { expr: 'neutro', head: i % 2 ? -5 : 4 }]) })], { extra: sacolasNoBanco }),
  // É corrida
  { ini: CORRIDA, fim: PORTA, cena: 'vazio', cheia: true, cam: [[CORRIDA, 540, 960, 1], [PORTA, 540, 930, 1.07, 1.2]], fundo: telaCorrida },
  { ini: PORTA, fim: I(9) - .1, cena: 'portaDiaAberta', cam: [[PORTA, 540, 1000, 1.05]],
    atores: [{ id: 'lua', xF: () => 540, sF: (t) => 1.32 + .2 * suave((t - PORTA) / .5), yF: (t) => CHAO + 60 * suave((t - PORTA) / .5), dyn: (t) => passo(t, 3, .7), poses: [[0, { expr: 'cansado' }]] }] },
  carroPlano(I(9) - .1, E(9) + .1, [[I(9) - .1, PAS.x, 800, 2.0]], [passageiro('lua', [[0, { expr: 'neutro' }]]), motorista(0, 'envergonhado')], { tarde: true, extra: cintoLua }),
  carroPlano(E(9) + .1, CHEIRA, [[E(9) + .1, MOT.x, 820, 1.9]], [passageiro('lua', [[0, { expr: 'neutro' }]]), motorista(0, 'envergonhado', { armR: [80, 150] })], { tarde: true, semMaoDir: true, extra: cintoLua }),
  retrovisor(CHEIRA, I(11) - .1, 'lua', [[0, { expr: 'pensando', head: 6 }]], { s: 1.7, cab: 500, tarde: true }),
  carroPlano(I(11) - .1, E(11) + .1, [[I(11) - .1, PAS.x, 800, 2.0]], [passageiro('lua', [[0, { expr: 'surpreso' }]]), motorista(0, 'envergonhado')], { tarde: true, extra: cintoLua }),
  carroPlano(E(11) + .1, ESCOLA_T, [[E(11) + .1, MOT.x, 820, 1.9]], [passageiro('lua', [[0, { expr: 'lado' }]]), motorista(0, 'forcado')], { tarde: true, extra: cintoLua }),
  // A pergunta
  { ini: ESCOLA_T, fim: I(13) - .1, cena: 'vazio', cam: [[ESCOLA_T, 540, 900, 1.05], [I(13), 540, 900, 1.1, 1.6]], fundo: (t) => ESCOLA(t, ESCOLA_T), frente: janelaDoCarro },
  carroPlano(I(13) - .1, E(13) + .1, [[I(13) - .1, PAS.x, 800, 2.0]], [passageiro('lua', [[0, { expr: 'feliz', head: -6 }]]), motorista(0, 'neutro')], { tarde: true, extra: cintoLua }),
  carroPlano(E(13) + .1, E(14) + .05, [[E(13) + .1, MOT.x, 820, 1.9]], [passageiro('lua', [[0, { expr: 'feliz' }]]), motorista(0, 'feliz')], { tarde: true, extra: cintoLua }),
  carroPlano(E(14) + .05, OLHOS, [[E(14) + .05, PAS.x, 800, 2.1]], [passageiro('lua', [[0, { expr: 'rindo' }], [OLHOS - .25, { expr: 'neutro' }]]), motorista(0, 'feliz')], { tarde: true, extra: cintoLua }),
  retrovisor(OLHOS, APERTA, 'lua', [[0, { expr: 'neutro' }], [I(15) - .1, { expr: 'triste' }]], { s: 2.4, cab: 520, tarde: true, cam: [[OLHOS, 540, 600, 1.6], [APERTA, 540, 580, 1.75, APERTA - OLHOS]] }),
  carroPlano(APERTA, VOTO, [[APERTA, MOT.x, 860, 1.6], [VOTO, MOT.x, 840, 1.85, VOTO - APERTA]], [motorista(0, 'surpreso', { aperta: 1, poses: [[0, { expr: 'surpreso', mouth: 'small' }]] })], { tarde: true, aperta: 1 }),
  // Votação: o close do Tico em preto e branco
  { ...carroPlano(VOTO, DEPOIS, [[VOTO, MOT.x, 640, 1.15]], [motorista(0, 'surpreso', { aperta: 1, poses: [[0, { expr: 'surpreso', mouth: 'small' }]] })], { tarde: true, aperta: 1 }), cor: () => 0 },
  // Depois do voto
  { ini: DEPOIS, fim: SO_ELE, cena: 'vazio', cheia: true, cam: [[DEPOIS, 540, 960, 1], [SO_ELE, 540, 940, 1.05, 1.4]], fundo: telaAvaliacao(DEPOIS), canto: true },
  { ini: SO_ELE, fim: FIM_DO_EP, cena: 'vazio', canto: true, fundo: fachadaFesta,
    cam: [[SO_ELE, 560, 1000, 1.02], [I(16), 640, 860, 1.35, .5]],
    atores: [{ id: 'cida', x: 470, s: 1.32, dyn: (t) => ({ armR: t > E(16) ? bracoAte(1, [598 + Math.sin(t * 14) * 6, 1130], CHARS.cida, 470, CHAO, 1.32) : [18, 30] }), poses: [[0, { expr: 'feliz' }], [E(16) + .1, { expr: 'rindo' }]] },
      { id: 'neta', x: 660, s: 1.32, poses: [[0, { expr: 'cansado' }], [E(16) + .2, { expr: 'envergonhado' }]] }] },
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
  destaques: { 1: 'parágrafos', 2: 'qual', 3: 'apaga', 4: 'estrelas', 5: 'netinha', 6: 'legal', 7: 'acesa', 8: 'Uhum', 9: 'corrida', 10: 'sei', 11: 'perfume', 12: 'precisando', 13: 'aula', 14: 'junto', 15: 'sumiu', 16: 'quarenta' },
};
