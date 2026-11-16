 // Fonte da capa do Dia 3: Kauã de susto com o controle remendado e o analógico voando (mesma composição do Dia 1, 488/1810/2.15).
 function scene(t){
  const pose={armL:[-50,70],armR:[50,-70],expr:'surpreso',look:[5,1],head:-3,mouth:'o',blink:0,breath:0};
  return defs(t)+ator(DK,pose,488,1810,2.15)+controle(490,1080,1.0,-8,{luz:0,stick:1})+stickSolto(700,800,1.1,25);
 }
 async function renderFrame(t){const im=new Image();im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920">${scene(t)}</svg>`);await im.decode();ctx.clearRect(0,0,C.width,C.height);ctx.drawImage(im,0,0,C.width,C.height);}
 return {renderFrame,scene};
})();
window.HQ=HQ;window.renderFrame=HQ.renderFrame;window.FILM_DURATION=1;window.READY=true;
