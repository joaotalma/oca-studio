 // ===== Folha de elenco do Dia 2 (para aprovação): Kauã, Léo, Rafa e Pedrão em HQ V10 =====
 function scene(t){
  let s=defs(t)+`<rect width="1080" height="1920" fill="url(#vice-sunset)"/><rect width="1080" height="1920" fill="url(#dots)" opacity=".10"/><rect width="1080" height="1920" fill="url(#paper)" opacity=".35"/>`;
  const cel=[[D,'cansado',300,880,'KAUÃ','Estagiário demitido, 21 anos'],[LEO,'neutro',780,880,'LÉO','Dono da casa do lançamento'],[RAFA,'neutro',300,1700,'RAFA','O quieto do grupo'],[PEDRAO,'preocupado',780,1700,'PEDRÃO','O "✅ garantido"']];
  for(const [d,expr,x,y,nome,desc] of cel){
   s+=`<ellipse cx="${x}" cy="${y+8}" rx="170" ry="26" fill="#192c45" opacity=".3"/>`+ator(d,{expr,head:Math.sin(t)*0},x,y,.95);
   s+=`<g transform="translate(${x} ${y-760}) rotate(-2)"><rect x="-200" y="-34" width="400" height="68" rx="9" fill="#30233f" stroke="#ffe7c2" stroke-width="5"/><text y="14" text-anchor="middle" font-family="Impact,Arial Black" font-size="46" letter-spacing="5" fill="${CREAM}">${nome}</text></g>`;
  }
  return s;
 }
 async function renderFrame(t){clock=t;await document.fonts.ready;const s=`<svg xmlns="http://www.w3.org/2000/svg" width="${C.width}" height="${C.height}" viewBox="0 0 1080 1920">${scene(t)}</svg>`;const im=new Image();im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s);await im.decode();ctx.clearRect(0,0,C.width,C.height);ctx.drawImage(im,0,0,C.width,C.height);}
 return {renderFrame,scene};
})();
window.HQ=HQ;window.renderFrame=HQ.renderFrame;window.FILM_DURATION=1;window.READY=true;
window.renderFrame(0);
