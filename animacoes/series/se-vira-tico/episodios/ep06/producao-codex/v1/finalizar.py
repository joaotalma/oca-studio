from pathlib import Path
import json,re
ROOT=Path('C:/Users/joaot/Projetos/se-vira-tico');EP=ROOT/'episodios/ep06';A=ROOT/'audio/ep06'
falas=json.loads(re.search(r'const FALAS = (\[.*\]);',(EP/'falas.js').read_text(encoding='utf8'),re.S)[1]);tempos=json.loads((A/'tempos.json').read_text(encoding='utf8'));real={f['n']:f for f in tempos['falas']}
words=[]
for f in falas:
 al=json.loads((A/'alinhamento'/f"{f['n']:02}.json").read_text(encoding='utf8'))['palavras'];r=real[f['n']];start=al[0]['ini'];end=al[-1]['fim'];f['palavras']=[]
 for w in al:
  p=(w['ini']-start)/(end-start);q=(w['fim']-start)/(end-start)
  f['palavras'].append(dict(palavra=w['palavra'],ini=round(f['ini']+p*(f['fim']-f['ini']),4),fim=round(f['ini']+q*(f['fim']-f['ini']),4)))
  words.append(dict(quem=f['quem'],palavra=w['palavra'],ini=round(r['ini']+p*(r['fim']-r['ini']),3),fim=round(r['ini']+q*(r['fim']-r['ini']),3)))
(EP/'falas.js').write_text('const FALAS = '+json.dumps(falas,ensure_ascii=False)+';\n',encoding='utf8')
(EP/'timeline.json').write_text(json.dumps(dict(duracao=tempos['duracao'],falas=tempos['falas'],palavras=words),ensure_ascii=False,indent=2),encoding='utf8')
def realt(t):
 ns=tempos['nos']
 for a,b in zip(ns,ns[1:]):
  if a[0]<=t<=b[0]:return a[1]+(b[1]-a[1])*(t-a[0])/(b[0]-a[0])
 return ns[-1][1]
fmt=lambda t:f'{int(t)//60:02}:{t%60:05.2f}'
shots=[(0,1.8,'Lua confirma OUTRO MOTORISTA às 19h41. A decisão abre o vídeo, sem recapitulação.'),(1.8,8.5,'GPS 34 min, prazo 20h. Tico pressiona TURBO; aceleração impossível de desenho. Letícia reage.'),(8.5,10.5,'Farol vermelho e radar: a consequência cômica vem antes da cena emocional.'),(10.5,13.4,'19h55. Tico entra orgulhoso, cinco minutos adiantado.'),(13.4,16.7,'Lua mostra entrega concluída às 19h50. Sem transformar sua decisão em maldade.'),(16.7,23.2,'O sorriso dele cai; ele entende a falta de confiança. Ela vê que ele percebeu e fica triste.'),(23.2,28.5,'“É. Claro.” Ele recolhe o gesto, baixa a cabeça. Ela ensaia falar e para. Silêncio sem gag.'),(28.5,38,'Três dias depois. Lua convida por vontade própria. Tico começa a prometer, confere a agenda e só então aceita.'),(38,49,'Cinema de luzes autorais, sem filme de terceiros. Doce da Lua e humor constrangido afetuoso.'),(49,54,'Só o público lê: Curso de Confeitaria, APROVADA, Porto Alegre, início em 30 dias, confirmação até amanhã. Tico não vê.'),(54,56,'Ela guarda a informação e se aproxima. Olhares e inclinações, quase beijo.'),(56,61,'BEIJA / NÃO BEIJA. Última imagem e último trecho. Nenhuma fala, gag ou cartela depois.')]
shots=[(a+4.8,b+4.8,text.replace('Três dias depois. ','')) if a>=28.5 else (a,b,text) for a,b,text in shots]
shots.insert(7,(28.5,33.3,'Três dias depois. Lua escolhe dois ingressos para a sessão das oito e confirma a compra. Sua iniciativa aparece em ação antes do convite.'))
md=['# EP6 — Cinco minutos adiantado','',f'Final da temporada 1 · {tempos["duracao"]:.3f} s · sem narrador','', '## Contrato','O prazo parece ser o problema; a confiança é o problema real. Tico chega antes das oito, encontra o trabalho resolvido sem ele e aprende a conferir antes de prometer. Lua volta a escolhê-lo para sair, enquanto guarda uma notícia. A votação decide o gesto do beijo; não define namoro.','', '## Roteiro visual com tempos finais','', '| Início–fim | Ação |','|---|---|']
md += [f'| {fmt(realt(a))}–{fmt(realt(b))} | {text} |' for a,b,text in shots]
md+=['','## Falas palavra por palavra','', '| Início–fim | Personagem | Fala |','|---|---|---|']
md += [f'| {fmt(real[f["n"]]["ini"])}–{fmt(real[f["n"]]["fim"])} | {f["quem"]} | {f["texto"]} |' for f in falas]
md+=['','## Decisões e continuidade','- Voto do EP5 confirmado pelo autor: OUTRO MOTORISTA. Entrega concluída 19h50, chegada de Tico 19h55.','- Não há nada depois da votação; antiga cartela da T2 removida por instrução do autor.','- Humor da multa termina antes da conversa emocional.','- Cinema e curso já estavam no pré-roteiro do autor; a viagem continua desconhecida de Tico.','- Vozes fixas do elenco no ElevenLabs. Texto gerado: 296 caracteres; limite aprovado: 1.000 créditos.','- História ficcional original: fontes de continuidade em pre_roteiro.md, docs/BIBLIA.md e orientações do autor nesta conversa de 11/11/2026.','- Método de revisão: docs/METODO-BLINK-ROTEIROS.md do Plotline; não há promessa de desempenho.']
(EP/'roteiro.md').write_text('\n'.join(md)+'\n',encoding='utf8')
(EP/'cenas.md').write_text('# EP6 — Cenas com tempos finais\n\n| Início–fim | Ação |\n|---|---|\n'+'\n'.join(f'| {fmt(realt(a))}–{fmt(realt(b))} | {text} |' for a,b,text in shots)+'\n',encoding='utf8')
(EP/'postagem.md').write_text('''# EP6 — Final da temporada 1

## Título
Ele chegou cedo. Mas ela já tinha chamado outro. 💔 | Se Vira, Tico — Final T1

## Legenda Instagram / TikTok
Vocês escolheram OUTRO MOTORISTA. Ela chamou. Ele correu. E os dois sentiram. 💔

Cinco minutos adiantado… mas tarde demais?

No final da temporada, é você quem decide: **BEIJA** ou **NÃO BEIJA**? Comente sua escolha. 👇

Vozes sintéticas geradas com ElevenLabs. Animação e personagens originais.
#SeViraTico #Animacao #ComediaRomantica #Historia #FinalDeTemporada

## Descrição YouTube Shorts
Lua chamou outro motorista. Tico chegou às 19h55 e descobriu que a entrega já tinha acabado às 19h50. A votação de hoje é BEIJA ou NÃO BEIJA: escreva sua escolha nos comentários.

Vozes sintéticas: ElevenLabs. Personagens, animação e trilha originais.
#Shorts #SeViraTico #Animacao

## Comentário para fixar
BEIJA 💚 ou NÃO BEIJA 🧡? Escreva uma das opções. O resultado abre a próxima temporada.

## Story
Usar ep06_story.png. Acrescentar o link do episódio no espaço livre inferior. A votação vale nos comentários do vídeo, sem enquete paralela no story.

## Publicação manual
- Vídeo: ep06_final.mp4. Capa: ep06_capa.png. Story: ep06_story.png.
- Capa desenhada para manter título e rostos no recorte central 3:4.
- Conferir no celular o som e a área dos botões da plataforma antes de publicar.
- Ativar a identificação de conteúdo sintético disponível na plataforma; não marcar como filmagem real.
- Não usar trecho de filme nem música comercial por cima: o pacote contém som original.
- A data da T2 não está anunciada. Não prometer lançamento em 30 dias: esse prazo pertence à história.
- O autor publica; nada foi postado nem agendado automaticamente.
''',encoding='utf8')
for story in [False,True]:
 content='''const bg=CENARIOS.cozinhaLua().map(c=>c.svg).join('');const a=drawChar(CHARS.tico,{expr:'triste',head:6,graphicEyes:true,look:[4,2],armL:[-14,10],armR:[15,8]});const b=drawChar(CHARS.lua,{expr:'triste',head:-6,graphicEyes:true,look:[-4,1],armL:[-30,40]});const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">${bg}<g transform="translate(285 2140) scale(2.25)">${a}</g><g transform="translate(805 2120) scale(2.25)">${b}</g></svg>`;const im=new Image();im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);await im.decode();g.drawImage(im,0,0);'''
 title="FINAL DA TEMPORADA" if story else "SE VIRA, TICO · EP6"
 lines=["ELA CHAMOU", "OUTRO."] if story else ["CHEGUEI CEDO.","TARDE DEMAIS?"]
 content+=f'''g.fillStyle='#fff3dc';g.beginPath();g.roundRect(75,275,930,360,35);g.fill();g.textAlign='center';g.fillStyle='#566c5d';g.font='900 40px Arial';g.fillText('{title}',540,350);g.fillStyle='#293b3e';g.font='900 76px Arial Black,Arial';g.fillText('{lines[0]}',540,465);g.fillText('{lines[1]}',540,565);'''
 if story:content+="g.fillStyle='#fff3dc';g.beginPath();g.roundRect(85,1400,910,220,35);g.fill();g.fillStyle='#293b3e';g.font='900 48px Arial';g.fillText('ASSISTA AO FINAL',540,1485);g.font='900 36px Arial';g.fillText('Vote nos comentários do episódio',540,1555);"
 html='''<!doctype html><html lang="pt-BR"><meta charset="utf-8"><link rel="icon" href="data:,"><style>html,body{margin:0}canvas{display:block}</style><script src="chars.js"></script><script src="cenarios.js"></script><canvas id="c" width="1080" height="1920"></canvas><script>(async()=>{const g=document.getElementById('c').getContext('2d');await document.fonts.ready;'''+content+'''window.READY=true;})();</script></html>'''
 (EP/('story.html' if story else 'capa.html')).write_text(html,encoding='utf8')
print('Roteiro final e legendas por palavra:',tempos['duracao'],'s. Voto:',realt(60.8),'até',realt(65.8))
