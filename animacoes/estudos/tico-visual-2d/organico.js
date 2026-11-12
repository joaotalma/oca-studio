'use strict';
/* O estudo foi aprovado em 10/11/2026 e as formas orgânicas passaram para personagens/chars.js (RigOrganico).
   Este arquivo ficou como ponte: o estudo continua comparando o estilo 'classico' (em cima) com o 'organico'
   (embaixo) pela chave setEstiloRig, sem duplicar o código do rig. */
const Organico = (() => {
  let ligado = false;
  function ativar(v) { ligado = !!v; setEstiloRig(ligado ? 'organico' : 'classico'); }
  return { ativar, sombra: (d, pose, o = {}) => sombraSVG(d, pose, { naParede: true, ...o }), luz: setLuzLado, get ligado() { return ligado; } };
})();
if (typeof module === 'object' && module.exports) module.exports = { Organico };
