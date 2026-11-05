const {CHARS,EXPR_ORDER,drawChar,drawDog}=require('./chars.js'); const fs=require('fs');
const wrap=(vb,body,w,h)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${w}" height="${h}">${body}</svg>`;
const POSES={
 tico:[{armL:[-14,-8],armR:[14,8],legL:[-5,-1],legR:[7,3],expr:'neutro'},{armL:[-18,100],armR:[140,215],legL:[-4,-1],legR:[8,3],lean:3,expr:'forcado',propL:'phone'}],
 lua: [{armL:[-12,-6],armR:[12,6],expr:'neutro'},{armL:[-10,-4],armR:[8,150],propR:'cup',expr:'forcado',lean:-2}],
 jao: [{armL:[-38,32],armR:[38,-32],legL:[-8,-3],legR:[8,3],expr:'neutro'},{armL:[-38,32],armR:[105,175],legL:[-8,-3],legR:[8,3],expr:'bravo',lean:-3}],
 bia: [{armL:[-30,70],armR:[22,12],expr:'feliz'},{armL:[-135,-168],armR:[135,168],expr:'rindo'}],
};
const VB={bia:(hc)=>`-150 ${hc-205} 430 430`,lua:(hc)=>`-190 ${hc-195} 380 380`,def:(hc)=>`-170 ${hc-150} 340 340`};
const headEl=(k,expr,mouth,x,y,sz)=>{const d=CHARS[k];const hc=-(d.H-d.headRy);const vb=(VB[k]||VB.def)(hc);return `<svg x="${x}" y="${y}" width="${sz}" height="${sz}" viewBox="${vb}">${drawChar(d,{expr,mouth})}</svg>`;};
const out=(n,s)=>fs.writeFileSync('assets/'+n,s);
for(const k of Object.keys(POSES)){
  out(k+'-poses.svg', wrap('0 -720 920 760', `<g transform="translate(230 0)">${drawChar(CHARS[k],POSES[k][0])}</g><g transform="translate(690 0)">${drawChar(CHARS[k],POSES[k][1])}</g>`, 920, 760));
  let g=''; EXPR_ORDER.forEach((e,i)=>{const x=(i%6)*220,y=Math.floor(i/6)*250; g+=headEl(k,e,null,x,y,220)+`<text x="${x+110}" y="${y+243}" text-anchor="middle" font-family="Poppins,Segoe UI,Arial,sans-serif" font-size="15" fill="#7a5a44">${e}</text>`;});
  out(k+'-expr.svg', wrap('0 0 1320 500', g, 1320, 500));
}
const xs=[190,480,780,1080];
let line='',sil='';['tico','lua','jao','bia'].forEach((k,i)=>{line+=`<g transform="translate(${xs[i]} 720)">${drawChar(CHARS[k],{})}</g>`;
  sil+=`<g transform="translate(${xs[i]} 720)">${drawChar(CHARS[k],{}).replace(/#[0-9a-fA-F]{6}\b/g,'#1b100b').replace(/(fill|stroke)="#fff"/g,'$1="#1b100b"')}</g>`;});
line+=`<g transform="translate(1290 720) scale(.8)">${drawDog('stand')}</g>`;
sil+=`<g transform="translate(1290 720) scale(.8)">${drawDog('stand').replace(/#[0-9a-fA-F]{6}\b/g,'#1b100b')}</g>`;
out('elenco.svg', wrap('0 -20 1700 780', line, 1700, 780));
out('silhuetas.svg', wrap('0 -20 1700 780', sil, 1700, 780));
let v='';['closed','small','open','wide'].forEach((m,i)=>{v+=headEl('tico','neutro',m,i*230,0,220)+`<text x="${i*230+110}" y="243" text-anchor="middle" font-family="Poppins,Segoe UI,Arial,sans-serif" font-size="15" fill="#7a5a44">${m}</text>`;});
out('bocas.svg', wrap('0 0 920 255', v, 920, 255));
let f='';['stand','alerta','latindo'].forEach((s,i)=>{f+=`<g transform="translate(${i*390+150} 330) scale(.82)">${drawDog(s)}</g><text x="${i*390+220}" y="372" text-anchor="middle" font-family="Poppins,Segoe UI,Arial,sans-serif" font-size="15" fill="#7a5a44">${s}</text>`;});
out('fiscal.svg', wrap('0 0 1200 390', f, 1200, 390));
