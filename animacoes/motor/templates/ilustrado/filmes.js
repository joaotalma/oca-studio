'use strict';
// Template filmes: o mesmo motor do ilustrado, com acabamento de cinema para o canal "Vale a pena?".
// Referência de técnica: o vídeo enviado pelo João em 2026-11-07. Dele vêm só técnicas de luz, câmera e legenda.
// Tudo é função do tempo t, sem estado entre quadros. Espaço de desenho: 1080 x 1920.
//
// video.js  VIDEO = { template: 'filmes', paleta?, rosto?, olhos?: 'cinema', planoMax?, folga?, dissolve? }
// falas.js  FALAS = [{ n, quem, texto, pausa, ini, fim, imagem, camada, selo?, movimento?, destaque?, inteiro?,
//                      filtro?: 'flashback'|'noite', sombra?: true, hud?: {rotulo, valor, sufixo?} | [...], carimbo?: 'VALE A PENA'|'DEPENDE'|'NÃO VALE' }]
(() => {
  const W = window.innerWidth, H = window.innerHeight, K = W / 1080;
  const canvas = document.getElementById('c'); canvas.width = W; canvas.height = H;
  const g = canvas.getContext('2d');
  const { paraRoteiro, paraReal, TP } = tempoDoVideo();

  const PAL = PALETAS[VIDEO.paleta] || PALETAS.crepusculo;
  const COR = {
    fundo: PAL.escuro, texto: '#ffffff', destaque: PAL.destaque, hud: PAL.fria,
    seloFoi: '#04090c', seloFoiTexto: '#ffffff', seloSe: PAL.destaque, seloSeTexto: '#04090c',
    carimbo: { 'VALE A PENA': '#3fd17a', 'DEPENDE': '#ffc23d', 'NÃO VALE': '#ff4d4d' },
  };
  const FONTE = '"Barlow Condensed", "Arial Narrow", Arial, sans-serif';
  // Área segura: referência a confirmar por plataforma (docs/METODO.md). Nada essencial fora dela.
  const SEG = { topo: 250, base: 1450, esq: 60, dir: 1020 };
  // Legenda curta, de 1 a 3 palavras por vez, como na referência: lê-se num relance e acompanha a voz.
  const LEG = { tam: 104, maxPal: 3, maxLetras: 16, pop: 0.12 };
  const GANCHO = { tam: 112, entre: 116, larg: 940, impacto: 0.6, zoom: 0.08, deriva: 0.04, entrada: 0.3 };
  // Câmera lenta e contínua: um movimento só por imagem, sem alternar aberto e fechado (o "vai e vem"
  // incomodou o João em 2026-11-07). Quem dá vida à cena é o boneco animado e os objetos flutuando.
  const FADE_SELO = 0.25, ZOOM = 0.05, DESLOCA = 0.025, FECHADO = 1.18, ENTRADA = 0;
  const CAM = typeof CAMADAS === 'undefined' ? {} : CAMADAS;
  // Profundidade: o fundo anda menos que a câmera, a frente anda mais.
  const PARALAXE = { fundo: .55, voce: 1, frente: 1.35 };
  const DISSOLVE = VIDEO.dissolve ?? 0.18;
  const SELO = { foi: 'ACONTECEU', seria: 'E SE...', voce: 'E SE...' };
  const FILTRO = {
    flashback: { modo: 'color', cor: '#a8835a', forca: .85, escuro: .15 },
    noite: { modo: 'multiply', cor: '#3a4a90', forca: .55, escuro: .1 },
  };

  const sai = (p) => { p = Math.max(0, Math.min(1, p)); return 1 - (1 - p) ** 3; };
  const volta = (p) => { p = Math.max(0, Math.min(1, p)); const c = 1.7; return 1 + (c + 1) * (p - 1) ** 3 + c * (p - 1) ** 2; };
  const limpa = (w) => w.toLowerCase().replace(/[^a-zà-ú0-9]/g, '');
  const imagens = new Map();
  let legendas = [];
  const planos = [];

  // Falas seguidas com a mesma imagem formam um plano, com um único movimento e um único filtro.
  function montarPlanos() {
    // `imagens: [...]` divide a fala em cortes iguais, um por imagem: mais cortes, ritmo de vídeo viral.
    const MOVS = ['zoom-in', 'esq', 'zoom-out', 'dir', 'cima', 'baixo'];
    for (const f of FALAS) {
      const lista = f.imagens || [f.imagem], dur = f.fim - f.ini;
      lista.forEach((imagem, k) => {
        const ult = planos[planos.length - 1], ini = f.ini + k * dur / lista.length;
        if (ult && ult.imagem === imagem) return;
        if (ult) ult.fim = ini;
        const movimento = f.inteiro && k === 0 ? 'impacto' : k === 0 ? f.movimento || 'zoom-in' : MOVS[(f.n + k) % MOVS.length];
        planos.push({ imagem, ini: planos.length ? ini : 0, fim: 0, filtro: f.filtro, movimento });
      });
    }
    planos[planos.length - 1].fim = FALAS[FALAS.length - 1].fim + (VIDEO.folga ?? 0.8);
    const max = VIDEO.planoMax ?? Infinity, base = planos.splice(0);
    for (const p of base) {
      const dur = p.fim - p.ini, n = p.movimento === 'impacto' ? 1 : Math.max(1, Math.ceil(dur / max));
      for (let k = 0; k < n; k++) planos.push({ ...p, ini: p.ini + k * dur / n, fim: p.ini + (k + 1) * dur / n, fechado: k % 2 === 1, entrada: k > 0 || p !== base[0], troca: k === 0 && p !== base[0] });
    }
    // A troca de imagem guarda o plano anterior para a fusão curta.
    planos.forEach((p, i) => { if (p.troca) p.antes = planos[i - 1]; });
  }

  // Quebra cada fala em blocos de até 3 palavras; o tempo de cada bloco segue a quantidade de letras.
  function medirLegendas() {
    legendas = FALAS.map((f, i) => {
      const prox = FALAS[i + 1], ate = prox ? prox.ini : Infinity, dest = new Set((f.destaque || []).map(limpa));
      if (f.inteiro) {
        g.font = `800 ${GANCHO.tam}px ${FONTE}`;
        const esp = g.measureText(' ').width, linhas = [[]]; let x = 0;
        for (const w of f.texto.trim().toUpperCase().split(/\s+/)) {
          const lw = g.measureText(w).width;
          if (x > 0 && x + lw > GANCHO.larg) { linhas.push([]); x = 0; }
          linhas[linhas.length - 1].push({ w, x, lw }); x += lw + esp;
        }
        return { f, inteiro: true, linhas, dest, ate };
      }
      const pals = f.texto.trim().toUpperCase().split(/\s+/), blocos = [];
      let bloco = [];
      for (const w of pals) {
        const letras = bloco.join(' ').length + w.length;
        if (bloco.length && (bloco.length >= LEG.maxPal || letras > LEG.maxLetras)) { blocos.push(bloco); bloco = []; }
        bloco.push(w);
        if (/[.,!?:;]$/.test(w) && bloco.length > 1) { blocos.push(bloco); bloco = []; }
      }
      if (bloco.length) blocos.push(bloco);
      const total = pals.join('').length, dur = f.fim - f.ini;
      let acum = 0;
      const lista = blocos.map((b) => { const t = f.ini + (acum / total) * dur; acum += b.join('').length; return { pals: b, t }; });
      lista.forEach((b, k) => { b.ate = k + 1 < lista.length ? lista[k + 1].t : ate; });
      return { f, blocos: lista, dest, ate };
    });
  }

  function desenharImagem(p, t) {
    const im = imagens.get(p.imagem);
    const u = Math.max(0, Math.min(1, (t - p.ini) / (p.fim - p.ini)));
    const m = p.movimento;
    let esc = 1 + ZOOM / 2, dx = 0, dy = 0;
    if (m === 'impacto') esc = 1 + GANCHO.zoom * sai(t / GANCHO.impacto) + GANCHO.deriva * u;
    if (m === 'zoom-in') esc = 1 + ZOOM * u;
    if (m === 'zoom-out') esc = 1 + ZOOM * (1 - u);
    if (m === 'esq') dx = -DESLOCA * (u - .5) * 1080;
    if (m === 'dir') dx = DESLOCA * (u - .5) * 1080;
    if (m === 'cima') dy = -DESLOCA * (u - .5) * 1920;
    if (m === 'baixo') dy = DESLOCA * (u - .5) * 1920;
    if (p.fechado) esc *= FECHADO;
    if (p.entrada) esc *= 1 + ENTRADA * Math.max(0, 1 - (t - p.ini) / .5) ** 2;
    const cam = CAM[p.imagem];
    if (!cam) {
      const base = Math.max(1080 / im.width, 1920 / im.height) * esc, iw = im.width * base, ih = im.height * base;
      g.drawImage(im, 540 - iw / 2 + dx, 960 - ih / 2 + dy, iw, ih);
    } else desenharCamadas(p, cam, t, esc, dx, dy);
    // Filtro feito com modos de mistura: o gate do render proíbe ctx.filter, que não é determinístico.
    const fx = FILTRO[p.filtro];
    if (fx) {
      g.save();
      const a = g.globalAlpha;
      g.globalCompositeOperation = fx.modo; g.globalAlpha = a * fx.forca; g.fillStyle = fx.cor; g.fillRect(0, 0, 1080, 1920);
      g.globalCompositeOperation = 'source-over'; g.globalAlpha = a * fx.escuro; g.fillStyle = '#000'; g.fillRect(0, 0, 1080, 1920);
      g.restore();
    }
  }

  // Cena em camadas: fundo, boneco e frente, cada um com o seu movimento. Tudo depende só de t.
  function noPlano(k, esc, dx, dy, fn) {
    const e = 1 + (esc - 1) * k;
    g.save(); g.translate(540 + dx * k, 960 + dy * k); g.scale(e, e); g.translate(-540, -960); fn(); g.restore();
  }
  function desenharCamadas(p, cam, t, esc, dx, dy) {
    const semente = planos.indexOf(p) * 1.7, d = t - p.ini, TAU = Math.PI * 2;
    noPlano(PARALAXE.fundo, esc, dx, dy, () => g.drawImage(imagens.get(cam.fundo), 0, 0, 1080, 1920));
    // As camadas que se mexem vêm com sobra desenhada abaixo do quadro (alto > 1920): o corte do corpo
    // nunca aparece. Com os pés em cena (chao), o boneco fica preso ao chão: sem subir, só respira e balança
    // a partir dos pés, e anda junto com o fundo para não escorregar.
    // caixa: as camadas que se mexem têm sobra em volta (nos lados, no alto e embaixo), para o corte nunca aparecer.
    const [bx, by, bw, bh] = cam.caixa || [0, 0, 1080, cam.alto || 1920], chao = !!cam.chao;
    const camada = (nome) => g.drawImage(imagens.get(cam[nome]), bx, by, bw, bh);
    if (cam.voce) noPlano(chao ? PARALAXE.fundo : PARALAXE.voce, esc, dx, dy, () => {
      const [px, py] = cam.pivo;
      // Chegada: o boneco sobe um pouco e assenta quando a cena entra (de pé, ele cresce de leve no lugar).
      const chega = sai(d / .45);
      // Respiração, balanço e um leve sobe e desce, em ritmos diferentes para não parecer máquina.
      const resp = .012 * Math.sin(TAU * t / 3.4 + semente);
      // O balanço é medido em pixels no rosto, não em graus: no close o pivô fica longe, e o mesmo ângulo
      // jogaria a cabeça para fora do lugar.
      const raio = Math.max(600, py - 900), amp = (chao ? 8 : 16) / raio;
      const balanco = amp * (.65 * Math.sin(TAU * t / 5.2 + semente) + .35 * Math.sin(TAU * t / 2.3 + semente * 2));
      const sobe = chao ? 0 : 6 * Math.sin(TAU * t / 3.4 + semente + 1) + (1 - chega) * 46;
      const cresce = chao ? .97 + .03 * chega : 1;
      g.translate(px, py + sobe); g.rotate(balanco); g.scale((1 - resp * .4) * cresce, (1 + resp) * cresce); g.translate(-px, -py);
      camada('voce');
      // Piscada: começa depois de 0,8 s e se repete a cada 2,6 a 4 s; a pálpebra fecha e abre em 0,16 s.
      const periodo = 2.6 + (planos.indexOf(p) % 3) * .7, q = d - .8;
      if (cam.pisca && q > 0) {
        const fase = q % periodo, fecha = Math.abs(fase - .08) < .07 ? 1 : 0; // seca: meio-termo mostra os dois olhos ao mesmo tempo
        if (fecha > 0) { g.globalAlpha *= fecha; camada('pisca'); }
      }
    });
    if (cam.frente) noPlano(PARALAXE.frente, esc, dx, dy, () => {
      // Objetos da frente flutuam devagar, como se estivessem no ar.
      const bob = 10 * Math.sin(TAU * t / 2.8 + semente), giro = .012 * Math.sin(TAU * t / 3.9 + semente);
      g.translate(540, 960 + bob); g.rotate(giro); g.translate(-540, -960);
      camada('frente');
    });
  }

  // Troca de imagem com uma fusão curta e um clarão leve, como um corte de lente.
  function desenharPlano(p, t) {
    const d = t - p.ini;
    if (p.antes && d < DISSOLVE) {
      desenharImagem(p.antes, t);
      g.save(); g.globalAlpha = sai(d / DISSOLVE); desenharImagem(p, t); g.restore();
      g.save(); g.globalCompositeOperation = 'screen'; g.globalAlpha = .18 * (1 - d / DISSOLVE);
      g.fillStyle = PAL.destaque; g.fillRect(0, 0, 1080, 1920); g.restore();
    } else desenharImagem(p, t);
  }

  // Sombra que atravessa a tela no começo da fala, como alguém passando na frente da câmera.
  function desenharSombra(t) {
    // Passa devagar o bastante para não virar um pulo de quadro no render.
    const D = 1.6, f = FALAS.find((x) => x.sombra && t >= x.ini && t < x.ini + D); if (!f) return;
    const u = (t - f.ini) / D, x = -500 + (u * u * (3 - 2 * u)) * 2100;
    const s = g.createLinearGradient(x - 420, 0, x + 420, 0);
    s.addColorStop(0, 'rgba(0,0,0,0)'); s.addColorStop(.5, 'rgba(0,0,0,.55)'); s.addColorStop(1, 'rgba(0,0,0,0)');
    g.save(); g.fillStyle = s; g.fillRect(0, 0, 1080, 1920); g.restore();
  }

  // Vazamento de luz quente vindo de cima, que respira devagar: dá o ar de fim de tarde da referência.
  function desenharLuz(t) {
    g.save(); g.globalCompositeOperation = 'screen';
    const x = 860 + Math.sin(t * .25) * 120, y = 120 + Math.cos(t * .19) * 60;
    const c = g.createRadialGradient(x, y, 0, x, y, 900);
    c.addColorStop(0, PAL.destaque); c.addColorStop(.35, 'rgba(255,140,60,.25)'); c.addColorStop(1, 'rgba(0,0,0,0)');
    g.globalAlpha = .22 + .04 * Math.sin(t * 1.3); g.fillStyle = c; g.fillRect(0, 0, 1080, 1920);
    g.restore();
  }

  // Poeira no ar: muitos pontos pequenos e nítidos, mais alguns grandes fora de foco. A posição depende só do tempo.
  function desenharParticulas(t) {
    g.save(); g.globalCompositeOperation = 'screen';
    for (let i = 0; i < 7; i++) {
      const r = 40 + (i * 17) % 50, x = (((i * 211 + t * (14 + i * 5)) % 1240) + 1240) % 1240 - 80;
      const y = 200 + (i * 293) % 1500 + Math.sin(t * .5 + i) * 50;
      const c = g.createRadialGradient(x, y, 0, x, y, r);
      c.addColorStop(0, PAL.destaque); c.addColorStop(1, 'rgba(0,0,0,0)');
      g.globalAlpha = .22 + (i % 3) * .06; g.fillStyle = c;
      g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
    }
    for (let i = 0; i < 46; i++) {
      const x = (((i * 97 + t * (6 + (i % 5) * 4)) % 1100) + 1100) % 1100 - 10;
      const y = (((i * 389 - t * (10 + (i % 7) * 3)) % 1960) + 1960) % 1960 - 20;
      const r = 1.6 + (i % 4) * 1.1, brilho = .35 + .45 * (.5 + .5 * Math.sin(t * 2.1 + i * 1.7));
      g.globalAlpha = brilho; g.fillStyle = '#fff4dc';
      g.shadowColor = PAL.destaque; g.shadowBlur = 10;
      g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
    }
    g.restore();
  }

  let grao;
  function criarGrao() {
    grao = document.createElement('canvas'); grao.width = grao.height = 256;
    const c = grao.getContext('2d'), d = c.createImageData(256, 256);
    let s = 12345;
    for (let i = 0; i < d.data.length; i += 4) {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      const v = (s >> 16) & 255;
      d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255;
    }
    c.putImageData(d, 0, 0);
  }
  function desenharAcabamento(t) {
    const q = Math.floor(t * 12), ox = (q * 73) % 256, oy = (q * 131) % 256;
    g.save(); g.globalAlpha = .07; g.globalCompositeOperation = 'overlay';
    for (let y = -oy; y < 1920; y += 256) for (let x = -ox; x < 1080; x += 256) g.drawImage(grao, x, y);
    g.restore();
    const v = g.createRadialGradient(540, 900, 560, 540, 960, 1220);
    v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.55)');
    g.fillStyle = v; g.fillRect(0, 0, 1080, 1920);
  }

  // Números de painel: brilho frio, contagem rápida até o valor. Serve para as notas do filme.
  const fmt = (v, casas) => v.toFixed(casas).replace('.', ',');
  function desenharHud(t) {
    const f = [...FALAS].reverse().find((x) => x.hud && t >= x.ini);
    if (!f) return;
    const ate = (FALAS.find((x) => x.ini > f.ini && !x.hud) || { ini: Infinity }).ini;
    if (t >= ate) return;
    const itens = Array.isArray(f.hud) ? f.hud : [f.hud];
    // Um número que já estava na tela na mesma posição continua parado: só os novos contam do zero.
    const desde = (h, i) => {
      let k = FALAS.indexOf(f), ini = f.ini;
      while (k > 0) {
        const ant = FALAS[k - 1].hud, lista = ant ? (Array.isArray(ant) ? ant : [ant]) : [];
        if (!lista[i] || lista[i].rotulo !== h.rotulo || lista[i].valor !== h.valor) break;
        k--; ini = FALAS[k].ini;
      }
      return ini;
    };
    g.save(); g.textBaseline = 'alphabetic';
    itens.forEach((h, i) => {
      const d = t - desde(h, i) - i * .25; if (d < 0) return;
      const casas = Number.isInteger(h.valor) ? 0 : 1, v = h.valor * sai(d / .9), y = SEG.topo + 230 + i * 230;
      g.globalAlpha = sai(d / .2);
      g.shadowColor = COR.hud; g.shadowBlur = 24; g.fillStyle = COR.hud;
      g.font = `800 40px ${FONTE}`; g.fillText(h.rotulo.toUpperCase(), SEG.esq + 20, y - 150);
      g.font = `800 170px ${FONTE}`; g.fillStyle = '#ffffff'; g.fillText(fmt(v, casas) + (h.sufixo || ''), SEG.esq + 14, y);
    });
    g.restore();
  }

  // Carimbo do veredito: entra grande, bate e assenta com um tremor curto.
  function desenharCarimbo(t) {
    const f = [...FALAS].reverse().find((x) => x.carimbo && t >= x.ini); if (!f) return;
    const prox = FALAS[FALAS.indexOf(f) + 1], fim = prox ? prox.ini : Infinity, sai_ = Math.max(0, Math.min(1, (fim - t) / .2));
    if (sai_ <= 0) return;
    const d = t - f.ini, txt = f.carimbo.toUpperCase(), cor = COR.carimbo[txt] || COR.destaque;
    const e = 1.7 - .7 * volta(d / .28), treme = d < .45 ? Math.sin(d * 90) * 6 * (1 - d / .45) : 0;
    // Fica acima da cabeça, para não tapar os olhos do personagem.
    g.save(); g.globalAlpha = sai_; g.translate(540 + treme, 520); g.rotate(-.1); g.scale(e, e);
    g.globalAlpha *= Math.min(1, d / .08);
    g.font = `800 150px ${FONTE}`; const w = g.measureText(txt).width + 90, h = 200;
    g.shadowColor = cor; g.shadowBlur = 40;
    g.fillStyle = 'rgba(4,9,12,.72)'; g.beginPath(); g.roundRect(-w / 2, -h / 2, w, h, 22); g.fill();
    g.lineWidth = 14; g.strokeStyle = cor; g.stroke();
    g.shadowBlur = 0; g.fillStyle = cor; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, 0, 8);
    g.restore();
  }

  function desenharSelo(t) {
    const k = Math.max(0, FALAS.findLastIndex((f) => t >= f.ini)), atual = FALAS[k];
    const selo = (f) => ({ camada: f.camada || 'foi', txt: f.selo || SELO[f.camada || 'foi'] || SELO.seria });
    const agora = selo(atual), antes = k > 0 ? selo(FALAS[k - 1]) : null;
    const igual = antes && antes.txt === agora.txt && antes.camada === agora.camada;
    const a = k === 0 || igual ? 1 : sai((t - atual.ini) / FADE_SELO);
    // Troca cruzada: o selo anterior some enquanto o novo entra.
    if (antes && !igual && a < 1) desenharUmSelo(antes, 1 - a);
    desenharUmSelo(agora, a);
  }
  function desenharUmSelo({ camada, txt }, a) {
    g.font = `800 50px ${FONTE}`;
    const w = g.measureText(txt).width + 44, x = SEG.esq, y = SEG.topo, h = 72;
    g.save(); g.globalAlpha = Math.max(.001, a);
    g.fillStyle = camada === 'foi' ? COR.seloFoi : COR.seloSe;
    g.beginPath(); g.roundRect(x, y, w, h, 10); g.fill();
    g.fillStyle = camada === 'foi' ? COR.seloFoiTexto : COR.seloSeTexto;
    g.textBaseline = 'middle'; g.fillText(txt, x + 22, y + h / 2 + 3);
    g.restore();
  }

  function escreverPalavra(w, x, y, dest, tam) {
    g.lineWidth = tam * .12; g.strokeStyle = 'rgba(4,9,12,.9)'; g.strokeText(w, x, y);
    g.fillStyle = dest ? COR.destaque : COR.texto; g.fillText(w, x, y);
  }
  function desenharLegenda(t) {
    const l = legendas.find((x) => t >= x.f.ini && t < x.ate); if (!l) return;
    g.save(); g.textBaseline = 'alphabetic'; g.lineJoin = 'round';
    g.shadowColor = 'rgba(0,0,0,.65)'; g.shadowBlur = 22; g.shadowOffsetY = 6;
    if (l.inteiro) {
      // O gancho fica inteiro no alto desde o primeiro quadro e assenta junto com o impacto.
      const total = l.linhas.length * GANCHO.entre, topo = SEG.topo + 110, cx = 540, cy = topo + total / 2, e = 1.1 - .1 * sai(t / GANCHO.entrada);
      g.translate(cx, cy); g.scale(e, e); g.translate(-cx, -cy);
      g.font = `800 ${GANCHO.tam}px ${FONTE}`;
      l.linhas.forEach((linha, i) => {
        const ult = linha[linha.length - 1], x0 = 540 - (ult.x + ult.lw) / 2, y = topo + (i + 1) * GANCHO.entre - 16;
        for (const p of linha) escreverPalavra(p.w, x0 + p.x, y, l.dest.has(limpa(p.w)), GANCHO.tam);
      });
    } else {
      const k = l.blocos.findIndex((x) => t >= x.t && t < x.ate); if (k < 0) { g.restore(); return; }
      const b = l.blocos[k], d = t - b.t, TROCA = .3;
      g.font = `800 ${LEG.tam}px ${FONTE}`;
      const esp = g.measureText(' ').width, cy = SEG.base - 40;
      const bloco = (bl, alfa, e) => {
        const larg = bl.pals.reduce((a, w) => a + g.measureText(w).width, 0) + esp * (bl.pals.length - 1);
        g.save(); g.globalAlpha = alfa; g.translate(540, cy); g.scale(e, e); g.translate(-540, -cy);
        let x = 540 - larg / 2;
        for (const w of bl.pals) { escreverPalavra(w, x, cy, l.dest.has(limpa(w)), LEG.tam); x += g.measureText(w).width + esp; }
        g.restore();
      };
      // Troca cruzada: o bloco anterior some enquanto o novo entra, sem pulo de quadro.
      if (k > 0 && d < TROCA) bloco(l.blocos[k - 1], 1 - d / TROCA, 1);
      bloco(b, sai(d / TROCA), 1.08 - .08 * sai(d / LEG.pop));
    }
    g.restore();
  }

  const ultimo = FALAS[FALAS.length - 1];
  window.FILM_DURATION = TP ? TP.duracao : ultimo.fim + (VIDEO.folga ?? 0.8);

  window.renderFrame = async (real) => {
    const t = paraRoteiro(real);
    g.setTransform(K, 0, 0, K, 0, 0); g.globalAlpha = 1; g.filter = 'none';
    g.fillStyle = COR.fundo; g.fillRect(0, 0, 1080, 1920);
    const p = planos.find((x) => t < x.fim) || planos[planos.length - 1];
    desenharPlano(p, t);
    desenharSombra(t);
    desenharLuz(t);
    desenharParticulas(t);
    desenharAcabamento(t);
    desenharHud(t);
    desenharCarimbo(t);
    desenharSelo(t);
    desenharLegenda(t);
  };

  const carregar = (src) => new Promise((ok, erro) => {
    const im = new Image();
    im.onload = () => { imagens.set(src, im); ok(); };
    im.onerror = () => erro(new Error(`imagem não carregou: ${src}`));
    im.src = src;
  });
  montarPlanos();
  // Cada corte é declarado do início ao fim da fusão (o gate aceita um quadro de folga em volta de cada marca).
  const passo = 1 / 30;
  window.CUTS = planos.slice(1).flatMap((x) => Array.from({ length: Math.ceil((DISSOLVE + 2 * passo) / passo) + 1 }, (_, k) => +paraReal(x.ini + k * passo).toFixed(3)));
  criarGrao();
  Promise.all([document.fonts.load('800 92px "Barlow Condensed"').catch(() => []), document.fonts.ready, ...[...new Set(planos.flatMap((x) => {
    const c = CAM[x.imagem];
    return [x.imagem, ...(c ? [c.fundo, c.voce, c.pisca, c.frente].filter(Boolean) : [])];
  }))].map(carregar)])
    .then(() => { medirLegendas(); window.READY = true; });
})();
