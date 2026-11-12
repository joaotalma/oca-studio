'use strict';
// Mapa entre o tempo real do áudio e o tempo do roteiro. TEMPOS vem de tempos.js, gerado por motor/sincronizar.py.
// Sem narração gravada, os dois tempos são iguais e o vídeo usa só os tempos de falas.js.
function tempoDoVideo() {
  const TP = typeof TEMPOS !== 'undefined' ? TEMPOS : null;
  const interpola = (x, de, para) => {
    const n = TP.nos; if (x <= n[0][de]) return n[0][para];
    for (let i = 1; i < n.length; i++) if (x <= n[i][de]) return n[i - 1][para] + (n[i][para] - n[i - 1][para]) * (x - n[i - 1][de]) / (n[i][de] - n[i - 1][de]);
    return n[n.length - 1][para];
  };
  return { TP, paraRoteiro: (T) => (TP ? interpola(T, 1, 0) : T), paraReal: (t) => (TP ? interpola(t, 0, 1) : t) };
}
