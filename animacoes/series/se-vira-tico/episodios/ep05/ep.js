'use strict';
// Episódio 5: Dá Tempo? Planos, poses e telas. Falas e tempos vêm de falas.js e tempos.js.
// Recursos de carro, telas e medidas do rig herdados do ep. 4.
const sai = (p) => { p = Math.max(0, Math.min(1, p)); return 1 - (1 - p) * (1 - p); };
const suave = (p) => { p = Math.max(0, Math.min(1, p)); return p * p * (3 - 2 * p); };
const clamp01 = (p) => Math.max(0, Math.min(1, p));
const F = Object.fromEntries(FALAS.map((f) => [f.n, f]));
const I = (n) => F[n].ini, E = (n) => F[n].fim;
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

/* ================= Episódio 5: Dá Tempo? ================= */
const FIM_DO_EP = 65.1;
const TARDE = { ambiente: 'claro', lado: 'direita' };
const LUA_CINTO = () => stroke(CINTO, '#2a2d34', 16) + stroke(CINTO, '#4a4f5c', 8) + ret(PAS.x - 36, 992, 34, 22, '#c7cbd0', 4, 3);

/* ---------- objetos e telas do episódio ---------- */
const fundoBorrado = (cena, dia) => `<g filter="url(#borra5)">` + cena + `</g><defs><filter id="borra5"><feGaussianBlur stdDeviation="9"/></filter></defs>`;
const cozinhaSVG = (dia) => CENARIOS[dia ? 'cozinhaLua' : 'cozinhaLuaNoite']().map((c) => c.svg).join('');
// Seis caixas na bancada; a da ponta ganha o laço no começo do episódio.
const caixasNaBancada = (y = 1215, x0 = 330) => [0, 1, 2, 3, 4, 5].map((i) => caixaDoceSVG(x0 + (i % 3) * 120 + (i > 2 ? 60 : 0), y - (i > 2 ? 78 : 0), .85, ['#f3d1d9', '#fbe7b5', '#cfe8e2'][i % 3])).join('');
const cadernoAberto = (x, y, k = 1) => `<g transform="translate(${x} ${y}) scale(${k})">` + shape('M-90 0 L0 -12 L90 0 L90 -110 L0 -122 L-90 -110Z', '#fff9ec') + stroke('M0 -12 L0 -122', '#c9b48e', 2) + [0, 1, 2, 3].map((i) => stroke(`M-78 ${-90 + i * 20} L-12 ${-96 + i * 20} M12 ${-96 + i * 20} L78 ${-90 + i * 20}`, '#8a7ab8', 2)).join('') + '</g>';
const relogioEm = (t) => t < 28.6 ? 'ENTREGA 20h00 · faltam 5h46' : t < 32.9 ? '18h30 · faltam 1h30' : t < 33.9 ? '19h20 · faltam 40 min' : t < 40.1 ? '19h25 · faltam 35 min' : t < 51.55 ? '19h40 · faltam 20 min' : '19h41 · faltam 19 min';

// Bolso da calça com o celular acendendo: "Corrida agendada: 18h30" (ele não olha)
const telaBolso = (t, t0) => {
  const a = sai((t - t0 - .15) / .25), vib = Math.sin(t * 70) * 3 * a;
  return `<rect x="-300" y="-300" width="1680" height="2520" fill="#3f5a7a"/>` + [...Array(30)].map((_, i) => stroke(`M${-200 + i * 50} -300 L${-100 + i * 50} 2300`, '#4a6789', 3)).join('')
    + shape('M180 700 Q540 620 900 700 L880 1500 Q540 1560 200 1500Z', '#46668a', 5) + stroke('M210 760 Q540 690 870 760', '#e3c04a', 3).replace('/>', ' stroke-dasharray="14 10"/>')
    + `<g transform="translate(${r2(vib)} 0)">` + ret(380, 420, 320, 520, '#23252f', 40, 5) + ret(400, 440, 280, 480, '#1b1d22', 26, 0) + `<rect x="400" y="440" width="280" height="480" rx="26" fill="#ffffff" opacity="${a.toFixed(3)}"/>`
    + (a > 0 ? `<g opacity="${r2(a)}">` + ret(420, 470, 240, 150, '#2a4f8a', 18, 0) + txt(540, 530, 'Corrida', 34, '#fff') + txt(540, 576, 'agendada', 34, '#fff') + txt(540, 700, '18h30', 72, '#2a4f8a') + '</g>' : '') + '</g>'
    + shape('M180 700 Q540 780 900 700 L900 1100 L180 1100Z', '#46668a', 5) + stroke('M200 720 Q540 800 880 720', '#e3c04a', 3).replace('/>', ' stroke-dasharray="14 10"/>')
    + (a > 0 ? stroke('M330 470 l-40 -20 M330 540 l-50 0 M750 470 l40 -20 M750 540 l50 0', '#ffffff', 6) : '');
};
// Live da Letícia no celular, com comentários subindo
const telaLive = (t0) => (t) => {
  const p = t - t0;
  let s = `<clipPath id="vidLive"><rect x="220" y="170" width="640" height="620"/></clipPath><g clip-path="url(#vidLive)"><rect x="220" y="170" width="640" height="620" fill="#d9c3e6"/>`
    + `<g transform="translate(540 1180) scale(1.15)">${drawChar(CHARS.leticia, { expr: 'rindo', armR: [40, 150], head: Math.sin(t * 4) * 4 })}</g></g>`;
  s += ret(240, 190, 180, 60, '#e0304f', 14, 0) + txt(330, 232, 'AO VIVO', 32, '#fff') + ret(440, 190, 170, 60, 'rgba(0,0,0,.45)', 14, 0) + txt(525, 232, '👁 1,2 mil', 28, '#fff');
  s += ret(220, 740, 640, 60, '#2a1f22', 0, 0) + txt(540, 782, 'Motorista da gratidão 🙏', 32, '#fff');
  const com = [['@bia', 'ele chega a tempo?'], ['@ju_m', 'tá suando kkk'], ['@rafa', 'gratidão 🙏'], ['@lu', 'pertinho onde??']];
  com.forEach(([u, c], i) => { const a = sai((p - i * .22) / .2); if (a <= 0) return; const y = 820 + i * 100;
    s += `<g opacity="${r2(a)}">` + ell(270, y + 30, 26, 26, ['#f2c14e', '#8fd3e8', '#e8736f', '#a8b94c'][i], OUT, 2) + txt(310, y + 22, u, 26, '#55606c', 'start') + txt(310, y + 58, c, 34, '#2a1f22', 'start') + '</g>'; });
  return moldura(s);
};
// Notebook da Lua: inscrição no curso de Porto Alegre
const telaInscricao = (t0, enviado) => (t) => {
  const z = 1 + .04 * clamp01((t - t0) / 2);
  let s = `<rect x="-300" y="-300" width="1680" height="2520" fill="#2b2433"/>` + ell(540, 900, 700, 600, '#5a7aa8', 'none', 0, 'opacity=".25"');
  s += `<g transform="translate(540 980) scale(${z.toFixed(5)}) translate(-540 -980)">` + ret(90, 480, 900, 620, '#3b3f4a', 30) + ret(120, 510, 840, 560, '#f4f6f8', 8, 0);
  s += ret(120, 510, 840, 70, '#2f8f8a', 8, 0) + txt(540, 556, 'Escola de Confeitaria do Sul', 34, '#fff');
  if (!enviado) {
    s += txt(160, 640, 'Inscrição', 44, '#2a1f22', 'start') + txt(160, 700, 'Curso de Confeitaria', 34, '#55606c', 'start') + txt(160, 750, 'Porto Alegre, RS', 34, '#c2584f', 'start')
      + ret(160, 790, 760, 56, '#ffffff', 8, 2) + txt(180, 830, 'Lua Martins', 30, '#2a1f22', 'start') + ret(160, 860, 760, 56, '#ffffff', 8, 2) + txt(180, 900, 'Início: em 30 dias', 30, '#2a1f22', 'start')
      + ret(620, 950, 300, 84, '#e8736f', 14) + txt(770, 1006, 'Enviar', 40, '#fff') + txt(940, 1060, '19h25', 26, '#55606c', 'end');
  } else s += ell(540, 760, 90, 90, '#2f8f4e') + stroke('M490 760 L530 800 L600 720', '#fff', 16) + txt(540, 940, 'Inscrição enviada.', 46, '#2a1f22');
  s += shape('M40 1100 L1040 1100 L1080 1150 L0 1150Z', '#c7cbd0') + '</g>';
  return s;
};
// Dedo da Lua parado sobre "Enviar"
// No notebook, o cursor do mouse vai até "Enviar" (sem dedo desenhado sobre a tela)
const dedoEnviar = (t, t0) => { const q = suave((t - t0) / 1.1), x = 760 + 120 * (1 - q), y = 1000 + 140 * (1 - q);
  return `<g transform="translate(${r2(x)} ${r2(y)}) scale(2.2)">` + shape('M0 0 L0 40 L10 30 L18 46 L25 43 L17 27 L31 27Z', '#ffffff', 2.4) + '</g>'; };
// Notebook visto por trás: a Lua olha a tela, o público vê a tampa
const notebookCostas = (x, y, k = 1) => `<g transform="translate(${x} ${y}) scale(${k})">` + shape('M-120 -170 L120 -170 L126 -6 L-126 -6Z', '#c7cbd0') + ell(0, -90, 18, 18, '#e9eef2', OUT, 2) + shape('M-136 -6 L136 -6 L146 12 L-146 12Z', '#9aa3aa') + '</g>';
// Mapa: 34 min até a Lua
const telaMapa = () => moldura(`<rect x="220" y="170" width="640" height="1380" fill="#e6efe2"/>` + [300, 520, 760, 1000, 1240].map((y) => stroke(`M220 ${y} L860 ${y + 60}`, '#ffffff', 26)).join('') + [320, 560, 780].map((x) => stroke(`M${x} 170 L${x + 40} 1550`, '#ffffff', 26)).join('')
  + stroke('M340 1380 L360 1120 L600 1080 L620 820 L760 560', '#3989c7', 18) + ell(340, 1380, 22, 22, '#fff', '#3989c7', 6) + ell(760, 540, 30, 30, '#e8736f', OUT, 4) + txt(760, 500, 'Lua', 32, '#2a1f22')
  + ret(220, 170, 640, 130, '#2a4f8a', 18, 0) + txt(540, 255, '19h40', 60, '#fff') + ret(250, 1400, 580, 120, '#ffffff', 20, 3) + txt(540, 1478, '34 min até a Lua', 46, '#c2584f'));
// Conversa com a Lua no celular do Tico: o áudio dela e o que ele digita ou manda
const telaDigita = (t0, fase) => (t) => {
  let s = cabecalho('Lua') + ret(245, 360, 360, 90, '#ffffff', 24, 2) + txt(290, 418, '▶', 34, '#2f8f4e', 'start') + stroke('M340 405 L540 405', '#9aa3aa', 6) + txt(560, 418, '0:04', 26, '#7a8a90', 'start');
  if (fase === 'manda') s += ret(395, 480, 440, 150, '#d4f5c4', 24, 2) + txt(420, 540, 'Tô a 34 min.', 40, '#2a1f22', 'start') + txt(420, 592, 'Mas eu chego.', 40, '#2a1f22', 'start') + txt(815, 618, '19h41 ✓✓', 22, '#7a8a90', 'end');
  const alvo = 'tô chegando', n = fase === 'digita' ? Math.min(alvo.length, Math.floor((t - t0) * 9)) : 0;
  s += ret(220, 1430, 640, 120, '#f7f3ec', 0, 0) + ret(250, 1452, 480, 76, '#ffffff', 38, 2)
    + (n > 0 ? txt(290, 1502, alvo.slice(0, n) + (Math.floor(t * 3) % 2 ? '|' : ''), 34, '#2a1f22', 'start') : txt(290, 1502, 'Mensagem', 32, '#9aa3aa', 'start')) + `<circle cx="790" cy="1490" r="38" fill="#2f8f4e"/>`;
  return moldura(s);
};
// Celular da Lua: a mensagem do Tico e, por cima, o aviso do cliente
const telaCliente = (t0) => (t) => { const a = sai((t - t0 - .3) / .25);
  return moldura(cabecalho('Tico', '#2a4f8a') + ret(245, 380, 440, 150, '#ffffff', 24, 2) + txt(270, 440, 'Tô a 34 min.', 40, '#2a1f22', 'start') + txt(270, 492, 'Mas eu chego.', 40, '#2a1f22', 'start')
    + `<g opacity="${r2(a)}" transform="translate(0 ${r2(-30 * (1 - a))})">` + ret(230, 180, 620, 170, '#fff6e6', 22, 3) + txt(260, 236, '🔔 Cliente', 30, '#c2584f', 'start') + txt(260, 300, 'se atrasar, cancelo.', 38, '#2a1f22', 'start') + '</g>'); };
// App de entregas: o polegar sobre "Chamar outra entrega"
const telaChamar = (t0) => (t) => { const q = suave((t - t0) / 2.6), d = CHARS.lua;
  return moldura(ret(220, 170, 640, 130, '#e2702f', 18, 0) + txt(540, 255, 'Entregas', 50, '#fff') + txt(830, 210, '19h41', 26, '#fff', 'end')
    + ret(250, 340, 580, 280, '#ffffff', 20, 3) + txt(280, 400, '6 caixas · Doces da Lua', 34, '#2a1f22', 'start') + txt(280, 460, 'Entrega: R$ 20', 32, '#55606c', 'start') + txt(280, 530, 'Entregador: Tico', 32, '#55606c', 'start') + txt(280, 585, 'chega em 34 min', 32, '#c2584f', 'start')
    + ret(270, 1180, 540, 130, '#e2702f', 30, 4) + txt(540, 1262, 'Chamar outra entrega', 40, '#fff')
    + `<g transform="translate(${r2(640 + 20 * (1 - q))} ${r2(1500 - 150 * q)}) rotate(-28)">` + shape('M-58 520 L-62 40 Q-62 -40 0 -44 Q62 -40 62 40 L70 520Z', d.skin, 5) + shape('M-34 -10 Q-34 -32 0 -34 Q34 -32 34 -10 Q34 30 0 32 Q-34 30 -34 -10Z', '#f6d6c2', 3) + stroke('M-40 120 Q0 132 40 120', d.shade, 3) + '</g>'); };
// Caderno da avó: "Descansar a massa", com o timer tocando
const telaCaderno = (t) => `<rect x="-300" y="-300" width="1680" height="2520" fill="#a8916f"/>` + ret(140, 380, 800, 1160, '#fff9ec', 12) + stroke('M540 380 L540 1540', '#c9b48e', 4)
  + [...Array(14)].map((_, i) => stroke(`M170 ${500 + i * 70} L520 ${500 + i * 70} M560 ${500 + i * 70} L910 ${500 + i * 70}`, '#dbe6f2', 2)).join('')
  + txt(345, 470, 'Pão de mel', 44, '#4a3a8a') + ['2 xíc. de farinha', '1 xíc. de mel', '1 ovo', 'canela e cravo'].map((l, i) => txt(180, 560 + i * 70, l, 32, '#4a3a8a', 'start')).join('')
  + ret(570, 760, 340, 80, '#fbe7b5', 6, 0) + txt(740, 812, 'Descansar a massa', 32, '#4a3a8a') + timerSVG(800, 1260, 2.2, t);
// Quarto: a massa dormindo na cama, coberta
const camaComMassa = (x, y) => shape(`M${x - 260} ${y} L${x + 260} ${y} L${x + 260} ${y + 160} L${x - 260} ${y + 160}Z`, '#8a5a44') + shape(`M${x - 250} ${y - 60} L${x + 250} ${y - 60} L${x + 250} ${y + 20} L${x - 250} ${y + 20}Z`, '#e9e1d2')
  + ell(x - 160, y - 70, 70, 34, '#fff6e6', OUT, 3) + shape(`M${x - 60} ${y - 40} Q${x + 30} ${y - 140} ${x + 120} ${y - 40}Z`, '#8fb8e8') + shape(`M${x - 250} ${y - 30} Q${x + 30} ${y - 70} ${x + 250} ${y - 30} L${x + 250} ${y + 30} L${x - 250} ${y + 30}Z`, '#8fb8e8') + stroke(`M${x - 40} ${y - 50} Q${x + 30} ${y - 120} ${x + 100} ${y - 50}`, '#6f9ac8', 3);
const abajur = (x, y, aceso = true) => (aceso ? `<defs><radialGradient id="abaj5"><stop offset="0" stop-color="#ffe2a0" stop-opacity=".55"/><stop offset="1" stop-color="#ffe2a0" stop-opacity="0"/></radialGradient></defs>` + ell(x, y - 60, 340, 300, 'url(#abaj5)') : '')
  + ret(x - 50, y, 100, 140, '#7a5a44', 6) + stroke(`M${x} ${y} L${x} ${y - 70}`, '#3a302a', 6) + shape(`M${x - 60} ${y - 70} L${x + 60} ${y - 70} L${x + 40} ${y - 150} L${x - 40} ${y - 150}Z`, aceso ? '#fff0b8' : '#e9e1d2');
// Rua com a placa do aeroporto passando atrás do carro
const placaEmbarque = (t, t0) => { const x = 760 - (t - t0) * 420;
  return ret(x, 520, 520, 200, '#1f7a4a', 14) + txt(x + 260, 600, '✈ EMBARQUE', 60, '#fff') + txt(x + 260, 670, 'Aeroporto', 40, '#d4f5c4') + ret(x + 240, 720, 40, 400, '#6c737a', 0, 3); };
// Letícia no banco de trás: mala gigante e ring light
const bagagemLeticia = (t) => ret(PAS.x - 250, 760, 150, 260, '#e8736f', 18) + ret(PAS.x - 220, 740, 90, 24, '#2a1f22', 8, 2) + stroke(`M${PAS.x - 250} 840 L${PAS.x - 100} 840`, '#c2584f', 4)
  + LUA_CINTO();
// Fiscal atravessando a rua de focinho erguido (o que o Tico conta)
const fiscalNaRua = (ini, fim) => ({ ini, fim, cena: 'rua', cam: [[ini, 540, 1250, 1.25]], atores: [{ id: 'fiscal', x: 0, y: CHAO, s: 1.1, movX: [ini, fim, 200, 900], poses: [[0, { expr: 'neutro', head: -14 }]] }] });

/* ---------- tempos (do roteiro) ---------- */
const COZINHA = 14.95, ENTREGA = 20.7, BOLSO = 22.2, PRECO = 23.75, APERTO = 27.8, CARRO2 = 28.6, LIVE = 31.9, EMBARQUE = 32.9;
const NOITE5 = 33.9, DEDO = 36.1, ENVIOU = 38.85, AUDIO = 40.1, MAPA = 43.85, DIGITA = 45.4, LEMBRA = 47.3, MANDA = 48.85, CLIENTE = 50.15, POLEGAR = 53.4, VOTO = 56.4, DEPOIS = 61.4, QUARTO = 62.3, OLHA = 63.15;

const luaCozinha = (x, extra = {}) => ({ id: 'lua', x, s: 1.32, ...extra });
const ticoCozinha = (x, extra = {}) => ({ id: 'tico', x, s: 1.32, ...extra });
const amarraLaco = (x) => (t) => ({ armL: bracoFora(-1, [x - 40 + Math.sin(t * 8) * 10, 1150], CHARS.lua, 400, CHAO, 1.32), armR: bracoFora(1, [x + 30 - Math.sin(t * 8) * 10, 1145], CHARS.lua, 400, CHAO, 1.32) });
const cozinhaDia = (ini, fim, cam, atores, frenteExtra = () => '') => ({ ini, fim, cena: 'cozinhaLua', visual: TARDE, cam, atores, frente: (t) => bancadaLua(true) + caixasNaBancada() + cadernoAberto(170, 1205, 1) + timerSVG(860, 1185, .9) + frenteExtra(t) });
const cozinhaNoite = (ini, fim, cam, atores, frenteExtra = () => '') => ({ ini, fim, cena: 'cozinhaLuaNoite', visual: NOITE, cam, atores, frente: (t) => bancadaLua(false) + caixasNaBancada() + cadernoAberto(170, 1205, 1) + timerSVG(860, 1185, .9) + frenteExtra(t) });

const ep05Planos = [
  // Abertura: "Vocês escolheram que eu falasse a verdade..." — os olhos dela no retrovisor, depois o rosto travado dele
  retrovisor(0, 3.3, 'lua', [[0, { expr: 'pensando', look: [0, 1] }]], { tarde: true }),
  carroPlano(3.3, 6.65, [[3.3, MOT.x, 830, 1.6], [6.65, MOT.x, 815, 1.95, 3.3]], [passageiro('lua', [[0, { expr: 'pensando' }]]), motorista(0, 'forcado', { aperta: .6 })], { tarde: true, extra: LUA_CINTO }),
  carroPlano(6.65, 9.65, [[6.65, MOT.x, 820, 1.9]], [passageiro('lua', [[0, { expr: 'surpreso' }]]), motorista(0, 'envergonhado', { aperta: .4 })], { tarde: true, extra: LUA_CINTO }),
  carroPlano(9.65, 10.65, [[9.65, PAS.x, 800, 2.0]], [passageiro('lua', [[0, { expr: 'pensando', head: 4 }]]), motorista(0, 'envergonhado')], { tarde: true, extra: LUA_CINTO }),
  carroPlano(10.65, 12.5, [[10.65, MOT.x, 820, 1.9]], [passageiro('lua', [[0, { expr: 'pensando' }]]), motorista(0, 'envergonhado', { head: -4 })], { tarde: true, extra: LUA_CINTO }),
  fiscalNaRua(12.5, 13.0),
  carroPlano(13.0, 13.35, [[13.0, PAS.x, 800, 2.0]], [passageiro('lua', [[0, { expr: 'rindo', head: -4 }]]), motorista(0, 'envergonhado')], { tarde: true, extra: LUA_CINTO }),
  carroPlano(13.35, COZINHA, [[13.35, 540, 900, 1.12]], [passageiro('lua', [[0, { expr: 'feliz', head: 3 }]]), motorista(0, 'aliviado')], { tarde: true, extra: LUA_CINTO }),

  // 1. Seis caixas (sábado, 14h)
  cozinhaDia(COZINHA, I(7) - .05, [[COZINHA, 470, 1060, 1.45], [I(7), 470, 1040, 1.52, 1.2]], [luaCozinha(400, { dyn: amarraLaco(430), poses: [[0, { expr: 'pensando', head: 5, look: [1, 3] }]] })]),
  cozinhaDia(I(7) - .05, ENTREGA, [[I(7), 560, 960, 1.04], [ENTREGA, 560, 950, 1.1, 4]], [luaCozinha(400, { dyn: (t) => t < I(7) + 2.2 ? amarraLaco(430)(t) : {}, poses: [[0, { expr: 'envergonhado', look: [2, 2] }], [I(7) + 2.2, { expr: 'pensando', head: -4, look: [-4, 3] }]] }), ticoCozinha(720, { poses: [[0, { expr: 'feliz', look: [-4, 0] }]] })]),
  cozinhaDia(ENTREGA, BOLSO, [[ENTREGA, 720, 800, 1.85]], [luaCozinha(400, { poses: [[0, { expr: 'neutro' }]] }), ticoCozinha(720, { poses: [[0, { expr: 'forcado', armL: [-40, 40], armR: [40, -40], lean: -2, look: [-3, 0] }]] })]),
  { ini: BOLSO, fim: PRECO, cena: 'vazio', cheia: true, cam: [[BOLSO, 540, 960, 1], [PRECO, 540, 940, 1.05, 1.5]], fundo: (t) => telaBolso(t, BOLSO) },
  cozinhaDia(PRECO, I(11) - .05, [[PRECO, 400, 800, 1.9]], [luaCozinha(400, { poses: [[0, { expr: 'neutro', look: [4, 0] }]] }), ticoCozinha(720, { poses: [[0, { expr: 'feliz' }]] })]),
  cozinhaDia(I(11) - .05, I(12) - .05, [[I(11), 720, 800, 1.9]], [luaCozinha(400, { poses: [[0, { expr: 'neutro' }]] }), ticoCozinha(720, { dyn: (t) => ({ armR: [70 + Math.sin(t * 9) * 12, 140] }), poses: [[0, { expr: 'feliz', look: [-4, 0] }]] })]),
  cozinhaDia(I(12) - .05, APERTO, [[I(12), 400, 800, 1.9]], [luaCozinha(400, { poses: [[0, { expr: 'lado', look: [4.5, 0] }]] }), ticoCozinha(720, { poses: [[0, { expr: 'feliz' }]] })]),
  // Os dois fecham o preço conversando (sem close de mão: erro 28)
  cozinhaDia(APERTO, CARRO2, [[APERTO, 560, 900, 1.42], [CARRO2, 560, 890, 1.5, CARRO2 - APERTO]], [
    luaCozinha(400, { dyn: (t) => ({ head: 3 + Math.sin((t - APERTO) * 7) * 3 }), poses: [[0, { expr: 'rindo', look: [4, 0] }]] }),
    ticoCozinha(720, { dyn: (t) => ({ head: -3 + Math.sin((t - APERTO) * 6 + 1) * 3 }), poses: [[0, { expr: 'feliz', look: [-4, 0] }]] })]),

  // 2. Pertinho (18h30)
  carroPlano(CARRO2, I(13) - .05, [[CARRO2, 540, 900, 1.12]], [passageiro('leticia', [[0, { expr: 'feliz' }]]), motorista(0, 'neutro')], { tarde: true, extra: bagagemLeticia }),
  retrovisor(I(13) - .05, E(13) + .05, 'leticia', [[0, { expr: 'feliz' }]], { tarde: true, extra: () => `<circle cx="760" cy="440" r="70" fill="none" stroke="#fff6e6" stroke-width="14" opacity=".9"/>` }),
  { ini: E(13) + .05, fim: LIVE, cena: 'vazio', cheia: true, cam: [[E(13), 540, 960, 1], [LIVE, 540, 945, 1.05, LIVE - E(13)]], fundo: (t) => SerieVisual.gps({ pontos: [[.5, 1], [.5, .55], [.85, .3], [1, .05]], progresso: .1 + .25 * sai((t - E(13)) / 1), hora: '18h31', prazo: 'Aeroporto · 38 km' }) + ruaGps(t) },
  { ini: LIVE, fim: EMBARQUE, cena: 'vazio', cheia: true, cam: [[LIVE, 540, 960, 1], [EMBARQUE, 540, 940, 1.04, 1]], fundo: telaLive(LIVE) },
  carroPlano(EMBARQUE, NOITE5, [[EMBARQUE, 540, 880, 1.15]], [passageiro('leticia', [[0, { expr: 'rindo' }]]), motorista(0, 'preocupado', { poses: [[0, { expr: 'preocupado', detalhe: 'suor' }]] })], { tarde: true, extra: bagagemLeticia, plano: { fundo: (t) => ruaCarro(true)(t) + placaEmbarque(t, EMBARQUE) } }),

  // 3. A inscrição (19h25)
  { ini: NOITE5, fim: DEDO, cena: 'vazio', cheia: true, cam: [[NOITE5, 540, 960, 1], [DEDO, 560, 960, 1.04, DEDO - NOITE5]], fundo: telaInscricao(NOITE5, false) },
  { ini: DEDO, fim: I(16) - .05, cena: 'vazio', cheia: true, cam: [[DEDO, 700, 980, 1.25]], fundo: telaInscricao(NOITE5, false), frente: (t) => dedoEnviar(t, DEDO) },
  cozinhaNoite(I(16) - .05, ENVIOU, [[I(16), 420, 790, 2.0]], [luaCozinha(420, { poses: [[0, { expr: 'pensando', look: [1, 3], head: 3 }]] })], () => `<rect x="-300" y="-300" width="1680" height="2520" fill="#5a7aa8" opacity=".12"/>` + notebookCostas(480, 1215, 1.3)),
  { ini: ENVIOU, fim: ENVIOU + .6, cena: 'vazio', cheia: true, cam: [[ENVIOU, 540, 960, 1], [ENVIOU + .6, 540, 950, 1.04, .6]], fundo: telaInscricao(ENVIOU, true) },
  cozinhaNoite(ENVIOU + .6, AUDIO, [[ENVIOU + .6, 440, 860, 1.6]], [luaCozinha(420, { poses: [[0, { expr: 'aliviado', look: [2, 3] }]] })], () => notebookSVG(500, 1215, 1.4, false)),

  // 4. Dá tempo? (19h40)
  cozinhaNoite(AUDIO, MAPA, [[AUDIO, 450, 880, 1.45], [MAPA, 450, 860, 1.55, 3.6]], [luaCozinha(420, { poses: [[0, { expr: 'preocupado', armR: [22, 178], propR: 'phone', look: [0, 0] }]] })]),
  { ini: MAPA, fim: DIGITA, cena: 'vazio', cheia: true, cam: [[MAPA, 540, 960, 1], [DIGITA, 540, 945, 1.05, DIGITA - MAPA]], fundo: telaMapa },
  { ini: DIGITA, fim: LEMBRA, cena: 'vazio', cheia: true, cam: [[DIGITA, 540, 960, 1], [LEMBRA, 540, 940, 1.04, 1.9]], fundo: telaDigita(DIGITA + .2, 'digita') },
  { ...retrovisor(LEMBRA, MANDA, 'lua', [[0, { expr: 'feliz', look: [0, 1] }]], { tarde: true }), cor: () => .1 },
  { ini: MANDA, fim: CLIENTE, cena: 'vazio', cheia: true, cam: [[MANDA, 540, 960, 1], [CLIENTE, 540, 945, 1.05, CLIENTE - MANDA]], fundo: telaDigita(MANDA, 'manda') },
  { ini: CLIENTE, fim: I(20) - .05, cena: 'vazio', cheia: true, cam: [[CLIENTE, 540, 960, 1], [I(20) - .05, 540, 945, 1.05, I(20) - .05 - CLIENTE]], fundo: telaCliente(CLIENTE) },
  cozinhaNoite(I(20) - .05, POLEGAR, [[I(20), 430, 800, 2.0], [POLEGAR, 430, 790, 2.15, 1.8]], [luaCozinha(420, { poses: [[0, { expr: 'pensando', look: [0, 3], head: 3 }]] })], () => `<rect x="-300" y="-300" width="1680" height="2520" fill="#5a7aa8" opacity=".1"/>`),
  { ini: POLEGAR, fim: VOTO, cena: 'vazio', cheia: true, cam: [[POLEGAR, 540, 960, 1], [VOTO, 540, 990, 1.06, 3]], fundo: telaChamar(POLEGAR) },
  // Votação: o close da Lua em preto e branco, embaixo da tela do voto
  { ...cozinhaNoite(VOTO, DEPOIS, [[VOTO, 430, 640, 1.9]], [luaCozinha(420, { poses: [[0, { expr: 'pensando', look: [0, 3], head: 3 }]] })]), cor: () => 0 },

  // Retorno: "Descansar a massa"
  { ini: DEPOIS, fim: QUARTO, cena: 'vazio', cheia: true, cam: [[DEPOIS, 540, 960, 1], [QUARTO, 600, 1000, 1.07, QUARTO - DEPOIS]], fundo: telaCaderno },
  { ini: QUARTO, fim: OLHA, cena: 'quartoLua', visual: NOITE, cam: [[QUARTO, 520, 1020, 1.1], [OLHA, 540, 1000, 1.16, OLHA - QUARTO]], fundo: () => abajur(140, 1260) + camaComMassa(400, 1460), atores: [{ id: 'lua', x: 760, s: 1.32, poses: [[0, { expr: 'pensando', look: [-4, 3], head: -4 }]] }] },
  { ini: OLHA, fim: FIM_DO_EP, cena: 'quartoLua', visual: NOITE, cam: [[OLHA, 680, 860, 1.6], [FIM_DO_EP, 680, 850, 1.7, 2]], fundo: () => abajur(140, 1260) + camaComMassa(400, 1460), atores: [{ id: 'lua', x: 760, s: 1.32, poses: [[0, { expr: 'cansado', look: [-4, 3], head: -4 }], [OLHA + .9, { expr: 'aliviado', head: -6 }]] }] },
];

/* ---------- Telas sobre a imagem ---------- */
const ep05Telas = [
  { ini: .2, fim: 1.5, desenha: (p, s, u) => { u.g.globalAlpha = Math.min(1, s / .2, (1.3 - s) / .2); u.cartao(620, 80, 420, 90, '#1f9e33'); u.texto('VERDADE ✓', 830, 140, 44, '#ffffff'); u.g.globalAlpha = 1; } },
  { ini: ENTREGA, fim: VOTO, desenha: (p, s, u) => { const t = ENTREGA + s, txt = relogioEm(t);
    if (ep05Planos.some((pl) => pl.cheia && t >= pl.ini && t < pl.fim)) return; // nas telas cheias o relógio cobriria o cabeçalho
    u.g.globalAlpha = Math.min(1, s / .25); u.g.font = '900 34px Arial Black, Arial, sans-serif'; const w = u.g.measureText('⏰ ' + txt).width;
    u.cartao(24, 60, w + 60, 74, 'rgba(42,31,34,.88)'); u.texto('⏰ ' + txt, 54, 110, 34, '#ffd83a', 'left'); u.g.globalAlpha = 1; } },
  { ini: APERTO, fim: CARRO2, desenha: (p, s, u) => { u.g.globalAlpha = Math.min(1, s / .2); u.cartao(240, 1300, 600, 110, '#fff6e6'); u.texto('Entrega combinada: R$ 20', 540, 1370, 40, '#2a1f22'); u.g.globalAlpha = 1; } },
  { ini: VOTO, fim: DEPOIS, desenha: (p, s, u) => {
    const g = u.g; g.globalAlpha = u.sai(s / .35);
    g.fillStyle = '#1c1f29'; g.fillRect(0, 0, 1080, 860);
    u.texto('QUAL VAI SER, LUA?', 540, 140, 62, '#ffffff');
    u.texto('Comente CONFIA ou OUTRO MOTORISTA', 540, 210, 34, '#d9d9d9');
    const opcao = (y, cor, grande, peq, tinta, tam) => { u.cartao(170, y, 820, 210, cor); u.texto(grande, 580, y + 92, tam, tinta); u.texto(peq, 580, y + 168, 32, tinta); };
    opcao(290, '#35d04a', 'CONFIA', 'Espera o Tico. O cliente pode cancelar', '#08280d', 96);
    opcao(570, '#ff4f6e', 'OUTRO MOTORISTA', 'As caixas saem agora, sem ele', '#3a0612', 70);
    SerieVisual.seta(g, 52, 330, s); SerieVisual.seta(g, 52, 610, s);
    g.globalAlpha = 1;
  } },
];

const EPISODIO = {
  duracao: FIM_DO_EP,
  falas: FALAS,
  planos: ep05Planos,
  telas: ep05Telas,
  visual: TARDE,
  sombra: { parede: false },
  latidos: [],
  impactos: [],
  destaques: { 1: 'aeroporto', 2: 'fedendo', 3: 'quanto', 4: 'calçada', 5: 'avisa', 6: 'caixas', 7: 'confeitaria', 8: 'oito', 9: 'agenda', 10: 'quanto', 11: 'imagina', 12: 'quanto', 13: 'pertinho', 14: 'aeroporto', 15: 'contou', 16: 'teste', 17: 'oito', 18: 'chegando', 19: 'avisei', 20: 'contar', 21: 'não' },
};
