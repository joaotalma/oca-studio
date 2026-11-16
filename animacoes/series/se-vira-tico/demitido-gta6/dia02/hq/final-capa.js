 // Mascote com o rosto do Kauã, reaproveitado da arte deste episódio.
 function scene(t){return defs(t)+mascote(6,{abre:1,danca:0});}
 async function renderFrame(t){const im=new Image();im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920">${scene(t)}</svg>`);await im.decode();ctx.clearRect(0,0,C.width,C.height);ctx.drawImage(im,0,0,C.width,C.height);}
 return {renderFrame,scene};
})();
window.HQ=HQ;window.renderFrame=HQ.renderFrame;window.FILM_DURATION=1;window.READY=true;
