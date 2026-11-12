import fs from 'node:fs';
import {gerar} from './gerar-roteiro.mjs';
const dir='roteiros/apagao-2001/v2';fs.mkdirSync(dir,{recursive:true});
const textos=[
['gancho','seria','Geladeira ou banho quente: escolha um.'],
['prova','foi','Em 2001, o Brasil viveu um programa de racionamento de energia.'],
['prova','foi','A meta era economizar vinte por cento.'],
['prova','foi','Quem não cumprisse a meta podia ter a luz cortada.'],
['situacao','seria','Agora imagine essa regra sem data para acabar.'],
['tentativa','seria','Você começaria desligando a televisão e as luzes dos quartos vazios.'],
['consequencia','seria','A conta cairia. Mas a geladeira continuaria ligada o dia inteiro.'],
['tentativa','seria','Você reduziria o banho. Ao sair, ainda se perguntaria: foi suficiente?'],
['pista','seria','Na cozinha, a comida da semana estaria atrás daquela porta.'],
['custo','seria','Desligar a geladeira não seria economia: seria arriscar o que você já comprou.'],
['tentativa','seria','Então você tentaria dividir uma geladeira com o vizinho.'],
['solucao','seria','Uma geladeira para duas casas. A ideia pareceria resolver tudo.'],
['virada','seria','Mas ela estaria na tomada de alguém. A conta também teria um dono.'],
['consequencia','seria','Economizar deixaria de ser uma decisão individual. Você precisaria negociar com a rua.'],
['retomada','seria','Aquele barulho constante, que você mal percebia, viraria um sinal de tranquilidade.'],
['retomada','seria','O motor da geladeira ainda estaria funcionando.'],
['entrega','seria','A pergunta não seria qual aparelho você usa mais. Seria qual você pode perder.'],
['fecho','voce','Banho quente ou a comida da semana: qual você protegeria primeiro?']];
const ambientes=['cozinha','cidade','medidor','cidade','cozinha','sala','cozinha','banho','comida','comida','vizinhos','vizinhos','medidor','cidade','cozinha','detalhe','cozinha','escolha'];
const acoes=['Duas escolhas: porta da geladeira iluminada e chuveiro quente','Uma casa perde luz enquanto as outras permanecem acesas','Medidor destaca a meta histórica','Rua demonstra a consequência do corte','Voltar à cozinha da abertura','Televisão apaga; lâmpadas dos cômodos vazios deixam de iluminar','A geladeira permanece acesa no ambiente escuro','Água do chuveiro diminui; personagem pensa','Abrir o enquadramento para prateleiras de comida','Alimento e tomada no mesmo enquadramento','Duas casas ligadas a uma geladeira central','Uma porta, dois caminhos de casa','Acompanhar o fio até o medidor de uma casa','Revelar a rua da qual as casas fazem parte','Voltar à geladeira com luz quente discreta','Próximo do aparelho que permanece ligado','Personagem encara as duas opções','Composição estável: comida de um lado, banho do outro'];
const e={slug:'apagao-2001-v2',titulo:'Geladeira ou banho quente?',paleta:'eletrico',pergunta:'O que você protegeria quando economizar exigisse escolher?',mecanismo:'tentativa → limite → solução compartilhada → novo custo',pista:'A geladeira permanece ligada enquanto outras coisas são desligadas.',virada:'Compartilhar um aparelho não elimina a responsabilidade por sua conta.',resposta:'A escolha passa de conforto para o que você não pode perder.',fontes:{F01:{url:'https://www12.senado.leg.br/noticias/materias/2001/10/17/iris-rezende-pede-suspensao-dos-cortes-de-energia',descricao:'Meta de 20% e possibilidade de corte no racionamento de 2001',situacao:'conferido',evidencia:'Página oficial localizada novamente por busca em 2026-11-08; Senado, 17/10/2001.'}},autorizacao:'João autorizou nesta conversa, em 2026-11-08, ajustar o gerador, produzir um vídeo e criar uma voz original jovem no ElevenLabs. Esta é autorização de execução; avaliação artística do vídeo final permanece com João.',falas:textos.map(([funcao,camada,texto],i)=>({texto,camada,funcao,acao:acoes[i],revela:texto,causa:i>3?'A escolha anterior leva à próxima necessidade; ver ação e informação nova':undefined,...(camada==='foi'?{fonte:'F01'}:{}),imagem:`assets/v${String(i+1).padStart(2,'0')}.png`,enquadramento:['medidor','comida','detalhe'].includes(ambientes[i])?'detalhe':'medio',movimento:['pista','virada','retomada'].includes(funcao)?'zoom-in':'parado',ambiente:ambientes[i],motivoCorte:acoes[i]}))};
fs.writeFileSync(dir+'/estrutura.json',JSON.stringify(e,null,2)+'\n');
fs.copyFileSync('roteiros/apagao-2001/fontes.md',dir+'/fontes.md');
console.log(gerar(dir+'/estrutura.json'));
