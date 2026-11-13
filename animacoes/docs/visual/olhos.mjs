// Tamanho é recurso gráfico de interpretação, não simulação fisiológica.
export function pupil(p){
  const joy=Math.max(0,Math.min(1,p.smile));
  const shock=p.round>.45&&!p.viseme?Math.max(0,Math.min(1,p.jaw)):0;
  const radius=9+joy*2.6-shock*3.5;
  return {radius,height:radius*(1.10+joy*.06),shine:1.8+joy*.5-shock*.35};
}
export function eyeFocus(p){
  const doubt=Math.min(1,Math.max(0,p.tiltL/.16))*Math.min(1,Math.max(0,-p.tiltR/.13));
  return {x:p.gaze*.65*(1-1.7*doubt),y:p.gazeY*.65};
}
