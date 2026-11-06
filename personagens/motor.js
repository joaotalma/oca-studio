'use strict';
// Se Vira, Tico: motor de episódio. Carregar depois de chars.js, cenarios.js e dos dados do episódio.
// O episódio define EPISODIO = { duracao, falas, planos, destaques, telas }. Tudo é função do tempo t.
const motor = (() => {
  const W = window.innerWidth, H = window.innerHeight, K = W / 1080;
  const canvas = document.getElementById('c'); canvas.width = W; canvas.height = H;
  const g = canvas.getContext('2d');
  const suave = (p) => { p = Math.max(0, Math.min(1, p)); return p * p * (3 - 2 * p); };
  const sai = (p) => { p = Math.max(0, Math.min(1, p)); return 1 - (1 - p) * (1 - p); };
  const hash = (n) => { const s = Math.sin(n * 127.1) * 43758.5453; return s - Math.floor(s); };
  const TRANS = .22;
  const QUEM = { 'Tico': 'tico', 'Jão': 'jao', 'Lua': 'lua', 'Borracheiro': 'borracheiro' };
  const NOME_COR = { tico: '#a8b94c', jao: '#e3c04a', lua: '#f0a48c', borracheiro: '#7fd6ee' };
  const FASE = { tico: .3, lua: 1.4, jao: 2.2, borracheiro: 2.9, marlene: .9, fiscal: 1.7 };

  function poseEm(chaves, t) {
    const p = {}; let trocaExpr = -9;
    for (const [tk, parcial] of chaves) {
      for (const [campo, v] of Object.entries(parcial)) {
        if (Array.isArray(v)) {
          const de = p[campo];
          if (t >= tk) p[campo] = v;
          else if (t >= tk - TRANS && de) { const q = suave((t - tk + TRANS) / TRANS); p[campo] = v.map((x, i) => x + (de[i] - x) * (1 - q)); }
        } else if (typeof v === 'number' && campo !== 'blink') {
          const de = p[campo] == null ? v : p[campo];
          if (t >= tk) p[campo] = v;
          else if (t >= tk - TRANS) p[campo] = de + (v - de) * suave((t - tk + TRANS) / TRANS);
        } else if (t >= tk) {
          if (campo === 'expr' && p.expr !== v) trocaExpr = tk;
          p[campo] = v;
        }
      }
    }
    if (Math.abs(t - trocaExpr) < .07) p.blink = 1;
    return p;
  }
  function falaAtiva(id, t) { return EPISODIO.falas.find((f) => QUEM[f.quem] === id && t >= f.ini && t < f.fim); }
  function boca(id, t) {
    if (!falaAtiva(id, t)) return null;
    const v = hash(Math.floor(t * 11) + FASE[id] * 9);
    return v < .2 ? 'closed' : v < .5 ? 'small' : v < .85 ? 'open' : 'wide';
  }
  function atorSVG(a, t) {
    const pz = poseEm(a.poses, t), f = FASE[a.id] || 0;
    const s = a.s || 1.32, sx = a.flip ? -s : s;
    let x = a.x, y = a.y == null ? CHAO : a.y;
    if (a.movX) { const [t0, t1, x0, x1] = a.movX; x = x0 + (x1 - x0) * suave((t - t0) / (t1 - t0)); }
    const blink = pz.blink || (((t + f * 1.31) % 3.7) < .13 ? 1 : 0);
    const breath = 1.5 + Math.sin(t * 1.9 + f) * 1.5;
    if (a.id === 'fiscal') {
      const lat = (EPISODIO.latidos || []).some((b) => t >= b && t < b + .32);
      const po = { ...pz, blink, breath: pz.breath != null ? pz.breath : breath, tail: (pz.tail == null ? 18 : pz.tail) + Math.sin(t * 7 + f) * 7, head: (pz.head || 0) + Math.sin(t * 1.3) * 1.5 };
      if (lat) { po.mouth = 1; po.head -= 9; po.expr = po.expr || 'bravo'; }
      return `<g transform="translate(${x} ${y}) scale(${sx * .9} ${s * .9})">${drawDog(po)}</g>`;
    }
    const po = { armL: [-9, -5], armR: [9, 5], ...pz, blink, breath };
    const bal = Math.sin(t * 1.5 + f) * 1.3, fala = falaAtiva(a.id, t);
    po.armL = [po.armL[0] + bal, po.armL[1] + bal * 1.6]; po.armR = [po.armR[0] + bal * .8, po.armR[1] - bal * 1.4];
    po.head = (po.head || 0) + Math.sin(t * .9 + f) * 1.2 + (fala ? Math.sin(t * 5.3 + f) * 2.4 : 0);
    po.lean = (po.lean || 0) + Math.sin(t * .7 + f) * .5;
    const m = boca(a.id, t); if (m) po.mouth = m;
    return `<g transform="translate(${x} ${y}) scale(${sx} ${s})">${drawChar(CHARS[a.id], po)}</g>`;
  }
  function camEm(cam, t) {
    let a = cam[0];
    for (let i = 0; i < cam.length; i++) {
      const c = cam[i];
      if (t >= c[0]) { a = c; const n = cam[i + 1]; if (n && t < n[0] && t > n[0] - (n[4] || .9)) { const q = suave((t - n[0] + (n[4] || .9)) / (n[4] || .9)); return [a[1] + (n[1] - a[1]) * q, a[2] + (n[2] - a[2]) * q, a[3] + (n[3] - a[3]) * q]; } }
    }
    return [a[1], a[2], a[3]];
  }
  function quadroSVG(pl, t) {
    let [cx, cy, z] = camEm(pl.cam, t);
    // respiração de câmera: nunca para por completo
    cx += Math.sin(t * .6) * 3; cy += Math.sin(t * .45) * 3; z *= 1 + Math.sin(t * .35) * .006;
    const tf = (f) => `translate(${540} ${960}) scale(${z}) translate(${-540 - (cx - 540) * f} ${-960 - (cy - 960) * f})`;
    let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 1080 1920">`;
    const nome = typeof pl.cena === 'function' ? pl.cena(t) : pl.cena;
    for (const c of CENARIOS[nome]()) s += `<g transform="${tf(c.f)}">${c.svg}</g>`;
    s += `<g transform="${tf(1)}">`;
    if (pl.fundo) s += pl.fundo(t);
    for (const a of pl.atores || []) s += atorSVG(a, t);
    if (pl.frente) s += pl.frente(t);
    return s + '</g></svg>';
  }
  const FADE = .13;
  function blocosDe(f) {
    const blocos = []; let atual = [];
    for (const w of f.texto.split(' ')) { atual.push(w); if (atual.length === 3 || /[.!?,:]$/.test(w)) { blocos.push(atual); atual = []; } }
    if (atual.length) blocos.push(atual);
    const letras = blocos.map((b) => b.join(' ').length), tot = letras.reduce((a, b) => a + b, 0), d = f.fim - f.ini;
    let acum = 0; return blocos.map((b, i) => { const ini = f.ini + acum / tot * d; acum += letras[i]; return { b, ini, fim: f.ini + acum / tot * d }; });
  }
  function desenhaBloco(pal, f, alfa) {
    const y = 1360, destaque = (EPISODIO.destaques || {})[f.n];
    g.save(); g.globalAlpha = alfa; g.textAlign = 'left'; g.textBaseline = 'middle'; g.lineJoin = 'round';
    g.font = '900 60px Arial Black, Arial, sans-serif';
    let total = g.measureText(pal.join(' ')).width;
    const tam = total > 960 ? 60 * 960 / total : 60;
    g.font = `900 ${tam}px Arial Black, Arial, sans-serif`;
    total = g.measureText(pal.join(' ')).width;
    let x = 540 - total / 2;
    for (const w of pal) {
      g.lineWidth = 12; g.strokeStyle = '#1b100b'; g.strokeText(w, x, y);
      g.fillStyle = destaque && w.toLowerCase().replace(/[^a-zà-ú0-9]/g, '') === destaque ? '#ffd83a' : '#ffffff'; g.fillText(w, x, y);
      x += g.measureText(w + ' ').width;
    }
    if (EPISODIO.nomes !== false) { const id = QUEM[f.quem]; g.font = '900 30px Arial Black, Arial, sans-serif'; g.textAlign = 'center'; g.lineWidth = 8; g.strokeText(f.quem, 540, y - 66); g.fillStyle = NOME_COR[id] || '#fff'; g.fillText(f.quem, 540, y - 66); }
    g.restore();
  }
  function legenda(t) {
    for (const f of EPISODIO.falas) {
      if (f.semLegenda || t < f.ini || t > f.fim + FADE) continue;
      for (const { b, ini, fim } of blocosDe(f)) {
        if (t < ini || t > fim + FADE) continue;
        const alfa = Math.min(1, (t - ini) / FADE, t > fim ? 1 - (t - fim) / FADE : 1);
        if (alfa > 0) desenhaBloco(b, f, alfa);
      }
    }
  }
  function cartao(x, y, w, h, cor) { g.beginPath(); g.roundRect(x, y, w, h, 22); g.fillStyle = cor; g.fill(); g.lineWidth = 5; g.strokeStyle = '#1b100b'; g.stroke(); }
  const texto = (s, x, y, tam, cor = '#fff', alinha = 'center') => { g.font = `900 ${tam}px Arial Black, Arial, sans-serif`; g.textAlign = alinha; g.textBaseline = 'middle'; g.fillStyle = cor; g.fillText(s, x, y); };
  function telas(t) { for (const e of EPISODIO.telas || []) if (t >= e.ini && t < e.fim) e.desenha((t - e.ini) / (e.fim - e.ini), t - e.ini, { g, cartao, texto, sai, suave }); }

  window.FILM_DURATION = EPISODIO.duracao;
  window.CUTS = EPISODIO.planos.filter((p) => !p.continua).map((p) => p.ini).filter((t) => t > 0).concat(EPISODIO.impactos || []);
  window.renderFrame = async (t) => {
    const pl = EPISODIO.planos.find((p) => t >= p.ini && t < p.fim) || EPISODIO.planos[EPISODIO.planos.length - 1];
    const img = new Image();
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(quadroSVG(pl, t));
    await img.decode();
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.filter = 'none';
    g.fillStyle = '#111'; g.fillRect(0, 0, W, H);
    g.drawImage(img, 0, 0);
    g.setTransform(K, 0, 0, K, 0, 0);
    telas(t); legenda(t);
  };
  return { quadroSVG };
})();
document.fonts.ready.then(() => { window.READY = true; });
