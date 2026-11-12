'use strict';
/* Atuação e composição do estudo (13 s, mudo). As mesmas poses e os mesmos tempos valem para os dois painéis:
   em cima, o rig atual; embaixo, o estudo orgânico. Tudo é função pura do tempo, para o render ser determinístico.
   Atuação por blocos: perceber → preparar (antecipação) → agir → reagir → acomodar. Os olhos chegam ao alvo antes
   da cabeça; cabeça, braços e corpo têm tempos próprios. */
const Estudo = (() => {
  const DURACAO = 13, CORTE_B = 4.5, CORTE_C = 9;
  const ease = (x) => x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x);
  const back = (x) => { if (x <= 0) return 0; if (x >= 1) return 1; const c = 1.6; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  const mix = (a, b, p) => Array.isArray(a) ? a.map((v, i) => v + (b[i] - v) * p) : a + (b - a) * p;
  function trilha(t, keys) {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) { const [t1, v1, e] = keys[i], [t0, v0] = keys[i - 1];
      if (t < t1) return mix(v0, v1, (e === 'back' ? back : ease)((t - t0) / (t1 - t0))); }
    return keys[keys.length - 1][1];
  }
  const fase = (t, lista) => { let r = lista[0][1]; for (const [ti, v] of lista) if (t >= ti) r = v; return r; };
  function piscar(t, vezes) { let b = 0; for (const v of vezes) { const d = t - v; if (d >= 0 && d < .05) b = Math.max(b, d / .05); else if (d >= .05 && d < .08) b = 1; else if (d >= .08 && d < .18) b = Math.max(b, 1 - (d - .08) / .1); } return b; }
  const respira = (t, f) => (1 - Math.cos(t * 2 * Math.PI / 3.2 + f)) / 2 * 1.5;
  const segmento = (t) => t < CORTE_B ? 'A' : t < CORTE_C ? 'B' : 'C';

  function tico(t) {
    const seg = segmento(t), base = { breath: respira(t, 0), blink: piscar(t, [1.3, 3.95, 6.3, 8.45, 11.4]) };
    if (seg === 'A') return { x: 400, pose: { ...base,
      look: trilha(t, [[0, [0, 0]], [.8, [0, 0]], [.96, [4.5, 0]], [1.6, [4.5, 0]], [1.76, [-4.5, .5]], [2.2, [-4.5, .5]], [2.36, [4.5, 0]]]),
      head: trilha(t, [[0, 0], [.9, 0], [1.12, 3], [1.7, 3], [1.9, -3], [2.3, -3], [2.5, 2]]),
      armR: trilha(t, [[0, [9, 5]], [2.4, [9, 5]], [2.62, [3, -8]], [2.92, [74, 128], 'back'], [3.3, [68, 120]], [3.65, [68, 120]], [4.05, [9, 5]]]),
      lean: trilha(t, [[0, 0], [2.4, 0], [2.62, -1.5], [2.92, 2.5, 'back'], [3.65, 2], [4.05, 0]]),
      legR: trilha(t, [[0, [4, 2]], [2.5, [4, 2]], [2.9, [7, 4]], [4, [4, 2]]]),
      expr: fase(t, [[0, 'neutro'], [2.55, 'forcado'], [3.75, 'aliviado']]) } };
    if (seg === 'B') return { x: 445, pose: { ...base,
      look: trilha(t, [[4.5, [0, 0]], [4.62, [4.5, 0]], [4.95, [4.5, 0]], [5.07, [-4.5, .4]], [5.3, [-4.5, .4]], [5.42, [4.5, 0]]]),
      head: trilha(t, [[4.5, 0], [4.7, 2], [5.1, -2], [5.45, -3], [5.62, 4, 'back'], [6.6, 1], [7.9, 2]]),
      lean: trilha(t, [[4.5, 0], [5.45, 1], [5.62, -2.5, 'back'], [6.6, 0]]),
      expr: fase(t, [[4.5, 'neutro'], [5.55, 'surpreso'], [6.65, 'forcado'], [7.8, 'aliviado']]) } };
    return { x: 405, pose: { ...base, look: [3.5, 0],
      armL: trilha(t, [[9, [-9, -5]], [9.12, [-4, -2]], [9.4, [-30, -84], 'back'], [9.8, [-25, -77]], [10.6, [-25, -77]], [11, [-9, -5]]]),
      armR: trilha(t, [[9, [9, 5]], [9.12, [4, 2]], [9.4, [30, 84], 'back'], [9.8, [25, 77]], [10.6, [25, 77]], [11, [9, 5]]]),
      head: trilha(t, [[9, 0], [9.12, 1], [9.4, -4, 'back'], [10.6, -3], [11, 1]]),
      lean: trilha(t, [[9, 0], [9.4, -1.5], [10.6, -1], [11, 0]]),
      expr: fase(t, [[9, 'neutro'], [9.25, 'rindo'], [10.9, 'feliz']]) } };
  }
  function lua(t) {
    const seg = segmento(t), base = { breath: respira(t, 1.3), blink: piscar(t, [2.15, 5.25, 7.5, 10.35, 12.2]), legL: [-5, -3], legR: [3, 1] };
    if (seg === 'A') return { x: 690, pose: { ...base, look: [-4.5, 0],
      armR: trilha(t, [[0, [9, 5]], [1.25, [9, 5]], [1.4, [14, 10]], [1.7, [38, -42], 'back'], [3.45, [38, -42]], [3.85, [9, 5]]]),
      head: trilha(t, [[0, 0], [1.2, 0], [1.5, -5], [3.4, -5], [3.7, 4], [4.5, 3]]),
      lean: trilha(t, [[0, 0], [1.4, 0], [1.7, -1.5], [3.4, -1.5], [3.7, 1]]),
      expr: fase(t, [[0, 'neutro'], [1.2, 'lado'], [3.4, 'feliz']]) } };
    if (seg === 'B') return { x: 650, pose: { ...base, look: [-4.5, 0],
      head: trilha(t, [[4.5, 0], [5.6, -5], [6.65, 3], [7.8, 5], [8.3, 6]]),
      lean: trilha(t, [[4.5, 0], [7.8, 0], [8.05, -2, 'back'], [9, -1]]),
      expr: fase(t, [[4.5, 'neutro'], [5.55, 'lado'], [6.65, 'feliz'], [7.8, 'rindo']]) } };
    return { x: 690, pose: { ...base, armL: [-8, -168], propL: 'phone',
      look: trilha(t, [[9, [0, 3.5]], [9.95, [0, 3.5]], [10.05, [-4.5, 0]]]),
      head: trilha(t, [[9, 5], [9.95, 5], [10.2, -3], [11, -4], [11.6, 2]]),
      expr: fase(t, [[9, 'neutro'], [10.1, 'rindo'], [11.6, 'feliz']]) } };
  }

  const cacheCena = {};
  function camadas(seg, org) {
    const k = seg + org;
    if (!cacheCena[k]) cacheCena[k] = seg === 'C' ? (org ? CenarioRico.portaConjunto(false) : CENARIOS.porta()) : (org ? CenarioRico.portaConjunto(true) : CENARIOS.portaDiaAberta());
    return cacheCena[k];
  }
  function camera(seg, t, alto) {
    const cheio = alto > 1500, cab = CHAO - CHARS.tico.H + 175;
    const p = seg === 'A' ? t / CORTE_B : seg === 'B' ? (t - CORTE_B) / (CORTE_C - CORTE_B) : (t - CORTE_C) / (DURACAO - CORTE_C);
    const drift = [Math.sin(t * .6) * 3, Math.sin(t * .45) * 3];
    if (seg === 'B') return { cx: 548 + drift[0], cy: cab + (cheio ? 20 : 0) + drift[1], z: (cheio ? 2.55 : 2.45) * (1 + .03 * p) };
    return { cx: 545 + drift[0], cy: (cheio ? CHAO - 520 : CHAO - 385) + drift[1], z: (cheio ? 1.3 : .98) * (1 + .025 * p) };
  }
  const ROTULO = { A: 'Corpo inteiro · dia', B: 'Plano próximo', C: 'Noite · luz do poste' };
  function etiqueta(x, y, texto, fundo, tam = 30, direita = false) {
    const w = texto.length * tam * .6 + 36; if (direita) x = 1080 - x - w;
    return `<rect x="${x}" y="${y}" width="${r2(w)}" height="${tam + 22}" rx="6" fill="${fundo}"/><text x="${x + 18}" y="${y + tam + 4}" font-family="Arial" font-weight="700" font-size="${tam}" fill="#fff8ec">${texto}</text>`;
  }
  function painel(t, org, y0, alto, tag) {
    const seg = segmento(t), noite = seg === 'C', { cx, cy, z } = camera(seg, t, alto), pc = y0 + alto / 2;
    const tf = (f) => `translate(540 ${r2(pc)}) scale(${r2(z)}) translate(${r2(-540 - (cx - 540) * f)} ${r2(-960 - (cy - 960) * f)})`;
    const luz = { ambiente: noite ? 'noite' : 'claro', lado: 'direita' }, id = `p${y0}`;
    const atores = [['tico', tico(t)], ['lua', lua(t)]];
    let s = `<clipPath id="${id}"><rect x="0" y="${y0}" width="1080" height="${alto}"/></clipPath><g clip-path="url(#${id})"><rect x="0" y="${y0}" width="1080" height="${alto}" fill="#1b1b1f"/>`;
    Organico.ativar(org);
    const cs = camadas(seg, org);
    for (const c of cs) if (c.f <= 1) s += `<g transform="${tf(c.f)}">${c.svg}</g>`;
    s += `<g transform="${tf(1)}">`;
    if (org) { Organico.ativar(true); Organico.luz(1); for (const [nome, a] of atores) s += `<g transform="translate(${a.x} ${CHAO})">${Organico.sombra(CHARS[nome], a.pose, { noite, id: `${id}${nome}sb` })}</g>`; }
    for (const [nome, a] of atores) { Organico.ativar(org); s += `<g transform="translate(${a.x} ${CHAO})">${SerieVisual.personagem(drawChar(CHARS[nome], a.pose), luz, `${id}-${nome}`)}</g>`; }
    s += '</g>';
    for (const c of cs) if (c.f > 1) s += `<g transform="${tf(c.f)}">${c.svg}</g>`;
    Organico.ativar(false);
    if (tag) s += etiqueta(24, y0 + 24, tag[0], tag[1]);
    s += etiqueta(24, y0 + 24, ROTULO[seg], 'rgba(27,27,31,.72)', 26, true);
    return s + '</g>';
  }
  function quadro(t, modo) {
    let s = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920"><rect width="1080" height="1920" fill="#f4ead9"/>`;
    if (modo === 'depois') s += painel(t, true, 0, 1920, null);
    else s += painel(t, false, 0, 955, ['ANTES · RIG ATUAL', '#5b4a44']) + painel(t, true, 965, 955, ['DEPOIS · ESTUDO ORGÂNICO', '#1f6f73']);
    return s + '</svg>';
  }
  return { DURACAO, quadro, tico, lua, segmento };
})();
