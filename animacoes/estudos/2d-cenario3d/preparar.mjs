import fs from 'node:fs';
import path from 'node:path';
const dest='render/exemplo-2d-3d';
fs.mkdirSync(path.join(dest,'assets'),{recursive:true});
for(const name of ['film.html','cena.js','timeline.json']) fs.copyFileSync(`estudos/2d-cenario3d/${name}`,`${dest}/${name}`);
for(const [slug,scene,name] of [['et-de-varginha','c16a','varginha'],['apagao-2001','c20a','apagao']]){
  for(const [layer,suffix] of [['voce',''],['pisca','-pisca']])fs.copyFileSync(`series/misterios-do-brasil/roteiros/${slug}/assets/${scene}-${layer}.png`,`${dest}/assets/${name}${suffix}.png`);
}
fs.copyFileSync('templates/ilustrado/BarlowCondensed-ExtraBold.ttf',`${dest}/assets/Barlow.ttf`);
console.log(`Exemplo preparado em ${dest}`);
