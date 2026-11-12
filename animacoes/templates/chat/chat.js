'use strict';
// Template de chat: mensagens que entram e se revelam palavra por palavra no ritmo da narração.
// Tudo é função do tempo t, sem estado entre quadros. Espaço de desenho: 1080 x 1920.
//
// video.js  VIDEO = { template: 'chat', contato: { nome, status }, tema?, reacao?: { imagem }, folga? }
// falas.js  FALAS = [{ n, quem, lado: 'esq'|'dir'|'centro', texto, pausa, ini, fim, destaque?: [palavras], inteiro?, fx? }]
(() => {
  const W = window.innerWidth, H = window.innerHeight, K = W / 1080;
  const canvas = document.getElementById('c'); canvas.width = W; canvas.height = H;
  const g = canvas.getContext('2d');
  const { paraRoteiro, TP } = tempoDoVideo();

  const TEMA = {
    fundo: '#12151c', barra: '#1b202b', linha: '#2a3140', nome: '#f4f6fb', status: '#8f9bb3',
    esq: '#262c39', esqTexto: '#f4f6fb', dir: '#3656e0', dirTexto: '#ffffff',
    centro: '#ffd83a', centroTexto: '#17140a', destaque: '#ffd83a', destaqueDir: '#ffe76b',
    ...(VIDEO.tema || {}),
  };
  // Área segura: referência a confirmar por plataforma (docs/METODO.md). Nada essencial fora dela.
  const SEG = { topo: 250, base: 1490, esq: 60, dir: 950 };
  const BARRA_ALT = 104, REACAO = { x: 690, w: 260, h: 300 };
  const FONTE = '"Segoe UI", Arial, sans-serif';
  const MSG = { tam: 54, entre: 70, pad: [34, 24], larg: 660, respiro: 22 };
  const CENTRO = { tam: 58, entre: 74, pad: [36, 24], larg: 800 };
  const ENTRADA = 0.26, SCROLL = 0.34, DIGITA = 0.5, FADE_PALAVRA = 0.12;

  const suave = (p) => { p = Math.max(0, Math.min(1, p)); return p * p * (3 - 2 * p); };
  const sai = (p) => { p = Math.max(0, Math.min(1, p)); return 1 - (1 - p) ** 3; };
  const limpa = (w) => w.toLowerCase().replace(/[^a-zà-ú0-9]/g, '');

  const temReacao = Boolean(VIDEO.reacao && VIDEO.reacao.imagem);
  const TOPO_MSG = SEG.topo + BARRA_ALT + 24 + (temReacao ? REACAO.h + 20 : 0);
  const BASE_MSG = SEG.base - 24;
  let imgReacao = null, msgs = [];

  function medir() {
    let y = 0;
    msgs = FALAS.map((f, i) => {
      const c = f.lado === 'centro' ? CENTRO : MSG;
      const peso = f.lado === 'centro' ? 800 : 500;
      g.font = `${peso} ${c.tam}px ${FONTE}`;
      const esp = g.measureText(' ').width, linhas = [[]];
      let x = 0, larguraMax = 0;
      for (const w of f.texto.trim().split(/\s+/)) {
        const lw = g.measureText(w).width;
        if (x > 0 && x + lw > c.larg - c.pad[0] * 2) { linhas.push([]); x = 0; }
        linhas[linhas.length - 1].push({ w, x, lw });
        x += lw + esp;
        larguraMax = Math.max(larguraMax, x - esp);
      }
      // Revelação proporcional às letras de cada palavra, dentro da duração da fala
      const pals = linhas.flat(), letras = pals.reduce((a, p) => a + p.w.length, 0), dur = f.fim - f.ini;
      let acum = 0;
      for (const p of pals) { p.t = f.ini + (acum / letras) * dur; acum += p.w.length; }
      const dest = new Set((f.destaque || []).map(limpa));
      const larg = larguraMax + c.pad[0] * 2, alt = linhas.length * c.entre + c.pad[1] * 2;
      const anterior = FALAS[i - 1];
      const digita = f.lado === 'esq' && i > 0 && f.ini - (anterior ? anterior.fim : 0) >= DIGITA * .6;
      const m = { f, c, peso, linhas, dest, larg, alt, y, digita, chega: f.inteiro ? 0 : digita ? f.ini - DIGITA : f.ini };
      y += alt + MSG.respiro;
      m.alvo = Math.max(0, y - MSG.respiro - (BASE_MSG - TOPO_MSG));
      return m;
    });
  }

  function rolagem(t) {
    let s = 0;
    for (const m of msgs) if (t >= m.chega) s += (m.alvo - s) * suave((t - m.chega) / SCROLL);
    return s;
  }

  function balao(m, x, y, a, b, cor, canto) {
    g.beginPath();
    const r = 36, rr = canto === 'esq' ? [10, r, r, r] : canto === 'dir' ? [r, 10, r, r] : [r, r, r, r];
    g.roundRect(x, y, a, b, rr);
    g.fillStyle = cor; g.fill();
  }

  function pontos(m, y, t) {
    const a = suave((t - m.chega) / 0.18) * (1 - suave((t - m.f.ini + 0.1) / 0.1));
    if (a <= 0) return;
    g.save(); g.globalAlpha = a;
    balao(m, SEG.esq, y, 170, 92, TEMA.esq, 'esq');
    for (let i = 0; i < 3; i++) {
      const o = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin((t * 7) - i * 0.9));
      g.globalAlpha = a * o;
      g.beginPath(); g.arc(SEG.esq + 52 + i * 33, y + 46, 11, 0, Math.PI * 2); g.fillStyle = TEMA.status; g.fill();
    }
    g.restore();
  }

  function mensagem(m, y, t) {
    const { f, c } = m;
    if (t < m.chega) return;
    if (m.digita && t < f.ini) { pontos(m, y, t); return; }
    const entrada = f.inteiro ? 1 : sai((t - f.ini) / ENTRADA);
    const x = f.lado === 'dir' ? SEG.dir - m.larg : f.lado === 'esq' ? SEG.esq : 540 - m.larg / 2;
    const cor = TEMA[f.lado], corTexto = TEMA[f.lado + 'Texto'];
    const corDest = f.lado === 'dir' ? TEMA.destaqueDir : f.lado === 'centro' ? '#b3261e' : TEMA.destaque;
    g.save();
    g.globalAlpha = entrada;
    // Cresce a partir do canto de onde a mensagem vem
    const ox = f.lado === 'dir' ? x + m.larg : f.lado === 'esq' ? x : x + m.larg / 2, oy = y + m.alt;
    const e = 0.92 + 0.08 * entrada;
    g.translate(ox, oy); g.scale(e, e); g.translate(-ox, -oy);
    balao(m, x, y, m.larg, m.alt, cor, f.lado);
    g.font = `${m.peso} ${c.tam}px ${FONTE}`; g.textBaseline = 'middle'; g.textAlign = 'left';
    m.linhas.forEach((linha, l) => {
      const yl = y + c.pad[1] + c.entre * (l + 0.5);
      for (const p of linha) {
        const a = f.inteiro ? 1 : suave((t - p.t) / FADE_PALAVRA);
        if (a <= 0) continue;
        g.globalAlpha = entrada * a;
        g.fillStyle = m.dest.has(limpa(p.w)) ? corDest : corTexto;
        g.fillText(p.w, x + c.pad[0] + p.x, yl);
      }
    });
    g.restore();
  }

  function cabecalho(t) {
    g.fillStyle = TEMA.barra; g.fillRect(0, 0, 1080, SEG.topo + BARRA_ALT);
    g.fillStyle = TEMA.linha; g.fillRect(0, SEG.topo + BARRA_ALT, 1080, 2);
    const cy = SEG.topo + BARRA_ALT / 2, nome = VIDEO.contato.nome;
    g.beginPath(); g.arc(SEG.esq + 42, cy, 42, 0, Math.PI * 2); g.fillStyle = TEMA.dir; g.fill();
    g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = `700 42px ${FONTE}`;
    g.fillText(nome.charAt(0).toUpperCase(), SEG.esq + 42, cy + 2);
    g.textAlign = 'left'; g.fillStyle = TEMA.nome; g.font = `700 42px ${FONTE}`;
    g.fillText(nome, SEG.esq + 104, cy - 20);
    const digitando = msgs.some((m) => m.digita && t >= m.chega && t < m.f.ini);
    g.fillStyle = digitando ? TEMA.destaque : TEMA.status; g.font = `400 32px ${FONTE}`;
    g.fillText(digitando ? 'digitando…' : (VIDEO.contato.status || 'online'), SEG.esq + 104, cy + 24);
  }

  function rodape() {
    g.fillStyle = TEMA.barra; g.fillRect(0, SEG.base, 1080, 1920 - SEG.base);
    g.fillStyle = TEMA.linha; g.fillRect(0, SEG.base, 1080, 2);
    g.beginPath(); g.roundRect(SEG.esq, SEG.base + 24, SEG.dir - SEG.esq, 84, 42); g.fillStyle = TEMA.esq; g.fill();
    g.fillStyle = TEMA.status; g.font = `400 36px ${FONTE}`; g.textAlign = 'left'; g.textBaseline = 'middle';
    g.fillText('Mensagem', SEG.esq + 38, SEG.base + 66);
  }

  function reacao() {
    if (!imgReacao) return;
    const y = SEG.topo + BARRA_ALT + 20;
    g.save();
    g.beginPath(); g.roundRect(REACAO.x, y, REACAO.w, REACAO.h, 28); g.clip();
    const e = Math.max(REACAO.w / imgReacao.width, REACAO.h / imgReacao.height);
    g.drawImage(imgReacao, REACAO.x + (REACAO.w - imgReacao.width * e) / 2, y + (REACAO.h - imgReacao.height * e) / 2, imgReacao.width * e, imgReacao.height * e);
    g.restore();
  }

  const ultimo = FALAS[FALAS.length - 1];
  window.FILM_DURATION = TP ? TP.duracao : ultimo.fim + (VIDEO.folga ?? 0.8);
  // A tela quase não muda por decisão de formato: entre palavras não há o que cobrar de "tela parada".
  // O limite que vale aqui é o tempo sem texto novo, medido em motor/qa-video.mjs.
  window.HOLDS = [[0, window.FILM_DURATION]];
  window.CUTS = [];

  window.renderFrame = async (real) => {
    const t = paraRoteiro(real);
    g.setTransform(K, 0, 0, K, 0, 0); g.globalAlpha = 1;
    g.fillStyle = TEMA.fundo; g.fillRect(0, 0, 1080, 1920);
    const s = rolagem(t);
    g.save();
    // Com a reação ligada, a faixa dela fica reservada: as mensagens somem antes de chegar lá
    const topoClip = temReacao ? TOPO_MSG - 12 : SEG.topo + BARRA_ALT;
    g.beginPath(); g.rect(0, topoClip, 1080, SEG.base - topoClip); g.clip();
    for (const m of msgs) {
      const y = TOPO_MSG + m.y - s;
      if (y + m.alt > SEG.topo && y < SEG.base) mensagem(m, y, t);
    }
    g.restore();
    reacao();
    cabecalho(t);
    rodape();
  };

  const carrega = () => new Promise((ok, erro) => {
    if (!temReacao) { ok(); return; }
    const im = new Image();
    im.onload = () => { imgReacao = im; ok(); };
    im.onerror = () => erro(new Error(`imagem de reação não carregou: ${VIDEO.reacao.imagem}`));
    im.src = VIDEO.reacao.imagem;
  });
  Promise.all([document.fonts.ready, carrega()]).then(() => { medir(); window.READY = true; });
})();
