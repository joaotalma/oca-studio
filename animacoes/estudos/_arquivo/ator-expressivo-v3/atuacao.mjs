// Poses autorais, em graus; coordenadas no espaço da ficha original.
// Nenhum estado depende da ordem de renderização ou do relógio do navegador.
export const DURATION = 12;
export const mouthNames = ['repouso','sorriso','A','E','O','U','MBP','FV'];
export function mouthPose(name){
  const table={repouso:[0,0,0],sorriso:[.25,1,0],A:[.95,0,0],E:[.18,.4,0],O:[.8,0,.7],U:[.42,0,1],MBP:[0,0,0],FV:[.2,.35,0]};
  if(!table[name])throw new Error(`Boca desconhecida: ${name}`);
  const [jaw,smile,round]=table[name];return {jaw,smile,round,viseme:name};
}
const neutral = {hip:0,dy:0,lean:0,head:0,headY:0,squash:1,gaze:0,gazeY:0,lid:1,browL:0,browR:0,tiltL:0,tiltR:0,armL:104,foreL:87,armR:76,foreR:93,handL:0,handR:0,jaw:0,smile:0,round:0};
const p = (t,v) => ({t,...neutral,...v});
export const poses = [
  p(0,{}), p(.65,{gaze:10,gazeY:-3,browR:-8,tiltR:-.16}),
  p(1.05,{gaze:11,gazeY:-3,hip:-5,lean:-3,head:8,browL:4,browR:-14,lid:.88,armR:55,foreR:-72,handR:1}),
  p(2.25,{gaze:12,hip:-5,lean:-3,head:8,browL:4,browR:-14,lid:.88,armR:55,foreR:-72,handR:1}),
  // Antecipação compacta -> expansão -> ultrapassagem -> acomodação.
  p(2.65,{hip:-10,dy:8,lean:-5,head:-5,headY:5,squash:.94,gaze:10,lid:.52,armL:115,foreL:60,armR:60,foreR:-65}),
  p(2.9,{hip:14,dy:-2,lean:4,head:-9,headY:-5,squash:1.07,gaze:2,gazeY:-5,lid:1.15,browL:-19,browR:-23,armL:150,foreL:225,armR:30,foreR:-45,handL:1,handR:3,jaw:1,round:.7}),
  p(3.16,{hip:8,dy:0,lean:2,head:5,squash:.98,gaze:2,lid:1.08,browL:-14,browR:-17,armL:145,foreL:210,armR:35,foreR:-30,handL:1,handR:1,jaw:.75,round:.7}),
  p(3.55,{hip:8,lean:2,head:1,gaze:1,lid:1.06,browL:-12,browR:-14,armL:140,foreL:215,armR:40,foreR:-35,handL:1,handR:1,jaw:.58,round:.7}),
  p(4.45,{hip:-8,lean:-4,head:10,gaze:10,lid:.7,browL:5,browR:-9,tiltL:.16,tiltR:-.13,armL:110,foreL:80,armR:68,foreR:-88,handR:2,jaw:0}),
  p(5.35,{hip:-8,lean:-4,head:10,gaze:10,lid:.7,browL:5,browR:-9,tiltL:.16,tiltR:-.13,armL:110,foreL:80,armR:68,foreR:-88,handR:2}),
  p(5.8,{hip:0,dy:4,head:-5,squash:.96,gaze:0,lid:.7,armL:118,foreL:95,armR:62,foreR:-60,jaw:.12,smile:1}),
  p(6.12,{hip:6,dy:-1,lean:2,head:-8,squash:1.035,gaze:0,lid:.74,browL:-4,browR:-3,armL:142,foreL:190,armR:38,foreR:-10,handL:1,handR:3,jaw:.42,smile:1}),
  p(6.7,{hip:4,lean:1,head:2,gaze:0,lid:.74,browL:-3,browR:-4,armL:138,foreL:188,armR:42,foreR:-8,handL:1,handR:3,jaw:.28,smile:1}),
  p(7.7,{hip:4,head:-3,gaze:0,lid:.88,browL:-5,browR:-8,armL:138,foreL:188,armR:42,foreR:-8,handL:1,handR:1,jaw:.26,smile:1}),
  p(8.65,{hip:10,lean:3,head:-7,gaze:10,lid:.94,browL:-4,browR:-8,armL:112,foreL:82,armR:35,foreR:-12,handR:3,jaw:.12,smile:.7}),
  p(9.65,{hip:10,lean:3,head:-7,gaze:10,lid:.94,browL:-4,browR:-8,armL:112,foreL:82,armR:35,foreR:-12,handR:3,jaw:.12,smile:.7}),
  p(10.55,{hip:0,head:0,gaze:0,lid:1,browL:-4,browR:-3,armR:66,foreR:70,jaw:.1,smile:.6}),
  p(12,{smile:.6,browL:-4,browR:-3}),
];
const smooth = x => x*x*(3-2*x);
export function blink(t) {
  for (const start of [1.6,4.02,7.05,10.8]) {
    const d=t-start;
    if(d>=0 && d<.1)return 1-d/.1;
    if(d>=.1 && d<.15)return 0;
    if(d>=.15 && d<.31)return smooth((d-.15)/.16);
  }
  return 1;
}
export function sample(t,{twos=true}={}) {
  const time=Math.max(0,Math.min(DURATION,t));
  const aTime=twos?Math.floor((time+1e-8)*15)/15:time;
  let i=0; while(i<poses.length-2 && aTime>poses[i+1].t)i++;
  const a=poses[i],b=poses[i+1],u=smooth(Math.min(1,Math.max(0,(aTime-a.t)/(b.t-a.t))));
  const out={}; for(const key of Object.keys(neutral))out[key]=(key==='handL'||key==='handR')?(u<.5?a[key]:b[key]):a[key]+(b[key]-a[key])*u;
  out.lid*=blink(aTime); out.time=aTime;
  return out;
}
export function stage(t) {
  if(t<2.5)return '01  O olhar encontra a ideia';
  if(t<4)return '02  Preparar. Reagir. Acomodar.';
  if(t<5.7)return '03  Desconfiar com o rosto inteiro';
  if(t<8)return '04  Sorrir com olhos, dentes e corpo';
  if(t<10)return '05  Convidar com um gesto';
  return '06  Voltar ao repouso';
}
export function knee(hip,foot,l1=125,l2=125,bend=1) {
  const dx=foot[0]-hip[0],dy=foot[1]-hip[1],dist=Math.hypot(dx,dy);
  const d=Math.max(.001,Math.min(l1+l2-.01,dist));
  const along=(l1*l1-l2*l2+d*d)/(2*d),cross=Math.sqrt(Math.max(0,l1*l1-along*along));
  const nx=dx/(dist||1),ny=dy/(dist||1);
  return [hip[0]+nx*along-ny*cross*bend,hip[1]+ny*along+nx*cross*bend];
}
