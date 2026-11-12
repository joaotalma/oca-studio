from pathlib import Path
import json
R=Path('C:/Users/joaot/Projetos/se-vira-tico');E=R/'episodios/ep06/v2';tl=json.loads((E/'timeline.json').read_text(encoding='utf8'));B=tl['beats'];F={f['n']:f for f in tl['falas']}
tm=lambda t:f'{int(t)//60:02}:{t%60:05.2f}'
scenes=[(0,3,'Gancho: Tico e Lua apresentados em painéis simultâneos, com nomes. Ele vai se declarar; ela vai embora.'),(3,B['traseira'],'Áudio da Lua identificado sobre o carro: entrega até as 20h. São 19h41, GPS34min. Tico pressiona TURBO.'),(B['traseira'],B['chegada'],'Carro visto de trás acelera e cruza no vermelho, sem humanos visíveis. Letícia reage de dentro do veículo.'),(B['chegada'],F[8]['fim']+3.1,'Tico chega19h55 orgulhoso. Entrega já concluída19h50. Ele entende a desconfiança; Lua reconhece a mágoa. Celular deitado na bancada, sem troca de pegada.'),(B['dias'],B['cinema'],'Três dias depois, ela o convida. Ele começa a prometer, confere a agenda e aceita. Sem compra de ingresso.'),(B['cinema'],F[12]['ini'],'Cinema: os dois sentados em cadeiras, pernas dobradas, joelhos e pés completos. Doce compartilhado e olhares.'),(F[12]['ini'],B['juntos'],'Ela precisa contar algo; ele também. Hesitação e contato visual.'),(B['juntos'],B['silencio'],'Declaração e mudança se cruzam: Lua “Eu vou pra outro estado”, Tico “Eu te amo”. Legendas separadas; vozes em posições estéreo correspondentes aos personagens.'),(B['silencio'],F[16]['ini'],'1,15s de silêncio real, sem música nem efeitos. Tico entende o que ouviu.'),(F[16]['ini'],F[17]['ini'],'“Doces da Lua.” Ele só então desloca os olhos para a fatia. O doce cabe inteiro no enquadramento.'),(F[17]['ini'],B['encerramento'],'Lua conta que se inscreveu no curso de confeitaria em Porto Alegre, que começa em30dias. “E a gente?” / “Não sei. Mas eu quis estar aqui.” Reação afetuosa e incerta.'),(B['encerramento'],B['fim'],'Última cartela: SE VIRA, TICO / TEMPORADA2 / EM BREVE. Sem votação, data ou cena depois.')]
md=['# EP6 — A notícia — roteiro refeito','',f'Final da temporada1 · {tl["duracao"]:.3f}s · sem narrador','', '## Contrato','Ele quer se declarar; ela precisa contar que vai mudar de estado. A entrega prepara a reaproximação: ela percebe que o magoou e toma a iniciativa do encontro. A oportunidade profissional é uma escolha legítima da Lua. O episódio entrega a notícia ao Tico, em vez de escondê-la para a T2.','', '## Direção com tempos reais','', '| Início–fim | Cena e intenção |','|---|---|']
md += [f'| {tm(a)}–{tm(b)} | {text} |' for a,b,text in scenes]
md += ['','## Falas','', '| Início–fim | Quem | Texto |','|---|---|---|']
md += [f'| {tm(f["ini"])}–{tm(f["fim"])} | {f["quem"]} | {f["texto"]} |' for f in tl['falas']]
md += ['','## Decisões do autor aplicadas','- Entrega preservada como motivação do convite. Carro de costas no vermelho.','- Retiradas a compra dos ingressos, a frase “lambo os dedos” e a votação final.','- Cinema sentado com pernas completas. Contato visual na declaração; olhar ao doce apenas no disfarce.','- Curso revelado ao Tico neste episódio. T2 agora parte do fato de ambos saberem da mudança.','- Encerramento “Em breve”, sem20de novembro ou outra data de lançamento.','- Vozes existentes do elenco:10falas reaproveitadas,10novas;249novos caracteres,545acumulados sob teto aprovado de1.000.','- Pausas e fala do cinema ajustadas sem mudar o timbre; não foram criadas vozes novas.','- Ficção original: continuidade de episodios/ep06/pre_roteiro.md e decisões do autor nesta conversa de11/11/2026. O novo desfecho substitui a premissa anterior de segredo do curso.']
(E/'roteiro.md').write_text('\n'.join(md)+'\n',encoding='utf8')
(E/'cenas.md').write_text('# EP6 — Direção das cenas\n\n| Início–fim | Cena e intenção |\n|---|---|\n'+'\n'.join(f'| {tm(a)}–{tm(b)} | {t} |' for a,b,t in scenes)+'\n',encoding='utf8')
(E/'DECISOES.md').write_text('# Revisão autoral —11/11/2026\n\n'+ '\n'.join('- '+d for d in tl['decisoes'])+'\n\nA abertura foi corrigida após revisão independente: Lua aparece desde o gancho e seu áudio remoto é identificado para não ser confundida com Letícia. O close do doce foi aberto para preservar a fatia.\n',encoding='utf8')
(E/'postagem.md').write_text('''# EP6 — A notícia — pacote de publicação manual

## Título
Ele disse “eu te amo”. Ela disse “vou embora”. 💔 | Se Vira, Tico

## Instagram / TikTok
Vocês escolheram OUTRO MOTORISTA. Tico chegou às19h55… e a entrega já tinha acabado às19h50. 💔

Dias depois, ela chamou para sair. Ele criou coragem. Ela tinha uma notícia.

Você contaria sobre a mudança antes do encontro? 👇

Final da temporada1. Temporada2: EM BREVE.

Vozes sintéticas: ElevenLabs. Personagens, animação, trilha e efeitos originais.
#SeViraTico #Animacao #ComediaRomantica #HistoriaAnimada #FinalDeTemporada

## YouTube Shorts
Ele finalmente criou coragem para se declarar. Ela precisava contar que vai mudar de estado. O último encontro da temporada muda o que os dois sabem um sobre o outro.

Você contaria antes do encontro? Temporada2: em breve.
Vozes sintéticas: ElevenLabs. Animação e som originais.
#Shorts #SeViraTico #Animacao

## Comentário para fixar
Ela ouviu um “eu te amo” ou deixou o “Doces da Lua” passar? 👀 O que você acha que ela entendeu?

## Story
Usar ep06_story.png depois que o episódio estiver no perfil. Acrescentar o link do vídeo entre1250–1370px. Sem enquete: este final não tem votação.

## Arquivos e conferência manual
- ep06_final.mp4: episódio refeito,64,1s,1080×1920,30fps.
- ep06_capa.png: manter título e rostos no recorte central3:4.
- ep06_story.png: chamada para o episódio; sem data de lançamento daT2.
- ep06_roteiro.md: falas e tempos reais. ep06_legendas.srt: cópia editável; legendas já incorporadas ao vídeo.
- Identificar o conteúdo sintético na opção disponível da plataforma. Não apresentar como filmagem de pessoas reais.
- Usar a trilha original do pacote; não contém trecho de filme nem música comercial.
- Nada foi publicado ou agendado. João publica depois de assistir ao master.
''',encoding='utf8')
for story in [False,True]:
 body='''const t=B.juntos+.4;const bg=TICO_V2.cinemaBG(t);const a=drawChar(CHARS.tico,{graphicEyes:true,expr:'envergonhado',sentado:true,legL:[-55,5],legR:[55,-5],head:6,look:[5,0],armR:[28,135],propR:'fatia'});const b=drawChar({...CHARS.lua,semCracha:true},{graphicEyes:true,expr:'surpreso',sentado:true,legL:[-55,2],legR:[55,-2],head:-5,look:[-5,0],armL:[-10,20]});const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920"><g transform="translate(540 960) scale(1.08) translate(-540 -1100)">${bg}<g transform="translate(340 1700) scale(1.4)">${a}</g><g transform="translate(740 1700) scale(1.5)">${b}</g>${TICO_V2.armrests(t)}</g></svg>`;const im=new Image();im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);await im.decode();g.drawImage(im,0,0);g.fillStyle='#fff1dc';g.beginPath();g.roundRect(65,275,950,340,35);g.fill();g.textAlign='center';g.fillStyle='#526c60';g.font='900 38px Arial';g.fillText('FINAL DA TEMPORADA',540,345);'''
 if story:body+="g.fillStyle='#293c40';g.font='900 67px Arial Black,Arial';g.fillText('ELE CRIOU CORAGEM.',540,450);g.font='900 56px Arial Black,Arial';g.fillText('ELA TINHA UMA NOTÍCIA.',540,555);g.fillStyle='#fff1dc';g.beginPath();g.roundRect(75,1400,930,230,30);g.fill();g.fillStyle='#293c40';g.font='900 58px Arial';g.fillText('ASSISTA NO PERFIL',540,1490);g.font='900 38px Arial';g.fillText('Temporada2: EM BREVE',540,1575);"
 else:body+="g.fillStyle='#416043';g.font='900 91px Arial Black,Arial';g.fillText('EU TE AMO.',540,452);g.fillStyle='#9e454e';g.font='900 77px Arial Black,Arial';g.fillText('EU VOU EMBORA.',540,565);"
 html='''<!doctype html><html lang="pt-BR"><meta charset="utf-8"><link rel="icon" href="data:,"><style>html,body{margin:0}canvas{display:block}</style><script src="chars.js"></script><script src="cenarios.js"></script><script src="falas.js"></script><script src="beats.js"></script><script src="ep.js"></script><canvas id="c" width="1080" height="1920"></canvas><script>(async()=>{const g=document.getElementById('c').getContext('2d');await document.fonts.ready;'''+body+'''window.READY=true;})();</script></html>'''
 (E/('story.html' if story else 'capa.html')).write_text(html,encoding='utf8')
print('Roteiro, direção, decisões, capa/story e ficha de postagem atualizados para o novo final.')
