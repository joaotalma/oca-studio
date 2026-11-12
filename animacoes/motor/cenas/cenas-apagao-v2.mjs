import fs from 'node:fs';
import {gerar} from '../roteiro/gerar-roteiro.mjs';
const dir='series/misterios-do-brasil/roteiros/apagao-2001/v2',e=JSON.parse(fs.readFileSync(dir+'/estrutura.json','utf8'));
fs.mkdirSync(dir+'/cenas',{recursive:true});
const common={tipo:'sala',periodo:'noite',detalhes:true,cores:{parede:'#869a9a',lateral:'#617e86',chao:'#4e514d'},preenchimento:.38,luzes:[{tipo:'janela',posicao:[2.975,2.7,5.5],cor:'#a4c9f5',intensidade:.55},{tipo:'pontual',posicao:[-2.5,3.2,2],cor:'#ffd39b',intensidade:.8}],personagem:{posicao:[-1.15,0,2.3],altura:3.45},objetos:[{tipo:'caixa',posicao:[-3,0,5],tamanho:[2,1.7,1.2],cor:'#586d75'},{tipo:'caixa',posicao:[-2.8,1.75,5],tamanho:[1.5,.12,1.1],cor:'#c5ac88'}]};
const fridge={tipo:'geladeira',posicao:[1,0,3.6],ligada:true};
const shower={tipo:'chuveiro',posicao:[-1.35,0,3.6],ligada:true};
const camera=(de,para,alvo)=>({de,para,alvo});
for(const [i,f] of e.falas.entries()) {
 const a=f.ambiente;let c=structuredClone(common),ator=true,rosto='desconfiado';
 c.objetos.push(fridge);
 c.camera=camera([.05,2.5,-4.5],[.13,2.48,-4.25],[0,1.9,2.8]);
 if(['cozinha','escolha'].includes(a))c.objetos.push(shower);
 if(i===0||a==='escolha'){c.personagem={posicao:[-.25,0,3],altura:2.85};c.objetos=[fridge,{...shower,posicao:[-1.7,0,3]},...common.objetos];}
 if(a==='cidade'){c={tipo:'rua',periodo:'noite',preenchimento:.34,luzes:[{tipo:'poste',posicao:[2.7,4,4],cor:'#ffd39b',intensidade:.8}],camera:camera([-.4,2.7,-5],[.4,2.8,-5.5],[0,2,7])};}
 if(a==='medidor'){ator=false;c.objetos=[{tipo:'medidor',posicao:[0,.3,2]}];c.camera=camera([.05,2.4,-2.5],[.05,2.4,-2.25],[0,1.9,2]);}
 if(a==='sala'){c.objetos=[{tipo:'televisao',posicao:[1,.2,3],ligada:false},...common.objetos];}
 if(a==='banho'){c.objetos=[{...shower,posicao:[1,0,3.6]}];}
 if(a==='comida'){ator=false;c.objetos=[{...fridge,posicao:[0,0,2],aberta:true}];c.camera=camera([0,2.3,-2.8],[.06,2.3,-2.6],[0,1.8,2]);}
 if(a==='vizinhos'){c.objetos=[{...fridge,posicao:[0,0,3.6]},...common.objetos];c.personagem={posicao:[-1.4,0,3.2],altura:3};c.camera=camera([0,2.6,-5],[.25,2.6,-5.3],[0,1.9,3]);}
 if(a==='detalhe'){ator=false;c.objetos=[{...fridge,posicao:[0,0,2.3]}];c.camera=camera([.1,1.9,-2.6],[.1,1.9,-2.4],[0,1.7,2.3]);}
 if(f.funcao==='virada')c.luzes=[...common.luzes,{tipo:'pontual',posicao:[1,2.5,2],cor:'#f3b583',intensidade:.5}];
 if(i<4)rosto='surpreso';if(i===5)rosto='curioso';if(i>=14)rosto='triste';
 // O rig aprovado continua a fonte de identidade; só a expressão varia.
 const roster=JSON.parse(fs.readFileSync('series/misterios-do-brasil/personagens/rostos.json','utf8'));
 if(!roster[rosto])rosto=Object.keys(roster).find(x=>x==='curioso')||Object.keys(roster)[0];
 const body=ator?'<!--P--><g transform="translate(330 420) scale(1.1)"><use href="#frente"/></g><!--/P-->':'<!--F-->';
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920"><defs></defs><!--ambiente3d:${JSON.stringify(c)}--><!--rosto:${rosto}--><!--pivo:540,1600--><rect width="1080" height="1920" fill="#172c45"/>${body}</svg>`;
 fs.writeFileSync(`${dir}/cenas/v${String(i+1).padStart(2,'0')}.svg`,svg);
 f.cena3d=c;
}
fs.writeFileSync(dir+'/estrutura.json',JSON.stringify(e,null,2)+'\n');gerar(dir+'/estrutura.json');
console.log('18 planos específicos: câmera motivada, aparelhos 3D e personagem aprovado.');
