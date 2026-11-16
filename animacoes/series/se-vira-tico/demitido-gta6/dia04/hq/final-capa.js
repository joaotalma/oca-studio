 // Fonte da capa do Dia 4 (cópia adaptada de ../../dia03/hq/final-capa.js, 16/11/2026): Kauã rindo e erguendo uma paçoca mordida na mão esquerda (composição do Dia 1, deslocada para x=600 para a mão caber no quadro).
 function scene(t){
  const pose={armL:[-50,-135],armR:[9,5],expr:'rindo',look:[0,2],head:-4,mouth:null,blink:0,breath:0};
  return defs(t)+ator(DK,pose,600,1810,2.15)+PACOCA(165,925,1.5,-78,1);
 }
 async function renderFrame(t){const im=new Image();im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920">${scene(t)}</svg>`);await im.decode();ctx.clearRect(0,0,C.width,C.height);ctx.drawImage(im,0,0,C.width,C.height);}
 return {renderFrame,scene};
})();
window.HQ=HQ;window.renderFrame=HQ.renderFrame;window.FILM_DURATION=1;window.READY=true;
