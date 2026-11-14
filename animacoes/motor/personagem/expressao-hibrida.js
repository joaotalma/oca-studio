'use strict';
// Efeitos opcionais. Tempo absoluto: buscar quadros não muda a atuação.
const ExpressaoHibrida = (() => {
  const clamp=x=>Math.max(0,Math.min(1,x));
  const settle=(t,at,amplitude=1)=>t<at?0:amplitude*Math.exp(-(t-at)*6)*Math.sin((t-at)*13);
  function cabelo(svg,t,{fase=0,impulso=0}={}) {
    const a=Math.sin(t*2.2+fase)*.45+impulso;
    return `<g transform="rotate(${a.toFixed(3)} 0 -48) skewX(${(a*.45).toFixed(3)})">${svg}</g>`;
  }
  // Modifica ângulos somente quando a direção autoriza mãos livres.
  function bracos(pose,t,{inicio,esquerdo=true,direito=true,amplitude=4,contato=false}={}) {
    if(contato)return pose;
    const u=t-inicio;
    const pulse=u<-.16?0:u<0?-Math.sin((u+.16)/.16*Math.PI)*amplitude*.22:settle(t,inicio,amplitude);
    const p={...pose};
    if(esquerdo&&p.armL)p.armL=[p.armL[0]+pulse,p.armL[1]+pulse*.65];
    if(direito&&p.armR)p.armR=[p.armR[0]-pulse,p.armR[1]-pulse*.65];
    return p;
  }
  // Branco de tinta: conserva alpha e silhueta; não é um flash que cobre o quadro.
  function branco(t,{inicio,duracao=.9,pico=.22}={}) {
    const u=(t-inicio)/duracao;
    return u<0||u>1?0:u<pico?clamp(u/pico):clamp((1-u)/(1-pico));
  }
  function defs(){return `<filter id="eh-branco" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"/></filter>`;}
  function revelar(svg,peso){return peso<=0?svg:`<g opacity="${(1-peso).toFixed(3)}">${svg}</g><g opacity="${peso.toFixed(3)}" filter="url(#eh-branco)">${svg}</g>`;}
  // Explosão gráfica inspirada no susto do relógio 8:45 do V10.
  // A direção define centro, duração e tamanho; nenhum texto é criado aqui.
  function impacto(t,{inicio,x=540,y=700,raio=150,duracao=.8}={}){
    const u=(t-inicio)/duracao;if(u<=0||u>=1)return '';
    const escala=u<.25?1-Math.pow(1-u/.25,3):1+.06*Math.sin((u-.25)*16)*Math.exp(-(u-.25)*5);
    const op=1-clamp((u-.65)/.35);
    const points=Array.from({length:24},(_,i)=>{const a=i*Math.PI/12,r=raio*(i%2?.58:1);return `${(Math.cos(a)*r).toFixed(2)},${(Math.sin(a)*r).toFixed(2)}`;}).join(' ');
    return `<g transform="translate(${x} ${y}) scale(${escala.toFixed(3)})" opacity="${op.toFixed(3)}"><polygon points="${points}" fill="#ffdc55" stroke="#fff" stroke-width="10"/><polygon points="${points}" fill="none" stroke="#231c2b" stroke-width="3"/></g>`;
  }
  return {settle,cabelo,bracos,branco,defs,revelar,impacto};
})();
