from pathlib import Path
import json,zipfile,shutil,re
R=Path('C:/Users/joaot/Projetos/se-vira-tico');E=R/'episodios/ep06/v2';A=R/'audio/ep06-v2';V=R/'render';tl=json.loads((E/'timeline.json').read_text(encoding='utf8'));B=tl['beats']
def stamp(t):
 t=round(t*1000);return f'{t//3600000:02}:{t//60000%60:02}:{t//1000%60:02},{t%1000:03}'
cues=[]
for f in tl['falas']:
 if f['n']==15:continue
 if f['n']==14:cues.append((B['juntos'],B['silencio']+.8,'Lua: Eu vou pra outro estado.\nTico: Eu te amo.'));continue
 ws=f['palavras']
 for i in range(0,len(ws),3):
  w=ws[i:i+3];cues.append((w[0]['ini'],w[-1]['fim'],' '.join(x['palavra'] for x in w)))
cues.sort();(E/'legendas.srt').write_text('\n\n'.join(f'{i}\n{stamp(a)} --> {stamp(b)}\n{text}' for i,(a,b,text) in enumerate(cues,1))+'\n',encoding='utf8')
(E/'qa.md').write_text('''# QA — EP6 refeito — A notícia

## Master final
- Duração64,10s;1923quadros;1080×1920,30fps;H.264 comAAC estéreo48kHz.
- Volume integrado medido: −16,2LUFS (alvo−16 ±1).
- QA do projeto: aprovado em duração, resolução, fps, volume e7/7itens do gate.
- Sem erros de desenho; sem quadros repetidos não explicados, sem meia-segunda abaixo do limiar de movimento e sem saltos de imagem não declarados.
- Declarações simultâneas com duas legendas separadas. Posição estéreo acompanha os personagens: Tico à esquerda, Lua à direita.
- Silêncio dramático:1,15s. Mixagem com amostras zeradas no intervalo; trecho central doAAC medido com máximo−91dB.
- Vinte falas sincronizadas pelos timestamps daAPI; as dez novas foram conferidas porASR local. A pontuação e a expansão de “pra/para” doASR não substituíram o roteiro.

## Revisão independente
O revisor identificou que o gancho sobre o carro poderia confundir Letícia com Lua e que o doce ficava na borda do close. As correções foram aplicadas e reavaliadas em quadros extraídos doMP4 final: P1/P2 resolvidos, veredito visual “Ship”, sem impedimentos concretos nas correções examinadas. O revisor não ouviu o áudio; as medições de som não equivalem a uma avaliação subjetiva da interpretação.

## Conferência autoral
- Gancho identifica Tico e Lua. A fala remota no carro está marcada como áudio daLua.
- Traseira do carro no farol vermelho, sem humanos visíveis.
- Chegada19h55; entrega concluída19h50. Desconfiança e mágoa compreensíveis.
- Celular deitado na bancada durante a conversa, sem pegada que troca de posição.
- Sem compra de ingresso. Convite leva diretamente ao cinema.
- Quadris apoiados, pernas completas, joelhos dobrados e pés visíveis nas cadeiras.
- Olhar dirigido ao interlocutor na declaração e à fatia somente no disfarce.
- Lua conta o curso de confeitaria emPorto Alegre aoTico. A mudança já é conhecida por ambos ao fim daT1.
- Último quadro: TEMPORADA2 — EM BREVE. Sem votação, data de lançamento ou cena posterior.

Ficção, personagens e som originais. Cinema só com luzes e reações; sem cenas de filmes ou músicas comerciais. Vozes fixas doElevenLabs, nenhuma nova voz criada.249novos caracteres;545acumulados sob limite aprovado de1.000. Não há promessa de viralização.

O autor assiste e publica. Nada foi publicado ou agendado.
''',encoding='utf8')
(E/'LEIA-ME.md').write_text('''# Se Vira, Tico — Final da temporada1 — versão refeita

ep06_final.mp4 é a versão atual,64,1s. Capa, story, roteiro com tempos, SRT e textos de postagem acompanham o pacote. A versão anterior foi preservada separadamente.

Este final mantém a entrega, apresenta Lua já no gancho, mostra o carro de costas no vermelho, coloca o casal sentado e revela o curso aoTico. Não tem compra de ingresso nem votação. Termina em “TEMPORADA2 — EM BREVE”, sem data.

O vídeo já contém legendas; oSRT é uma cópia editável. As duas falas simultâneas formam uma única entrada de duas linhas noSRT.

Fontes: HTML/JS/SVG do episódio, vozes por fala e master estéreo. O filme é desenhado por window.renderFrame(tempoReal), após window.READY=true, a1080×1920 e30fps, por um servidor local. Muxar com audio/master.wav. Não é necessária chave para reproduzir os assets fornecidos. Nenhum arquivo de ambiente está incluído.

A fonte do rig continua em personagens/chars.js no próprio projetoTico. A direção é dados de episódio; a produção foi orquestrada em Plotline/producao/tico-ep06-v2 sem unificar as engines. O figurino sem crachá e a altura de legenda por fala são opcionais e preservam os desenhos anteriores.

Vozes do elenco já existente noElevenLabs:10falas reaproveitadas,10novas;249novos caracteres. Música e efeitos sintetizados no próprio projeto. Leia qa.md para as medições e limites de avaliação.

Somente João publica. Usar o story após colocar o episódio no perfil. Temporada2: em breve, sem data de lançamento anunciada.
''',encoding='utf8')
for name in ['qa.md','LEIA-ME.md']:
 p=E/name;s=p.read_text(encoding='utf8')
 for a,b in {'Duração64':'Duração: 64','64,10s':'64,10 s','1923quadros':'1.923 quadros','1080×1920':'1080 × 1920','30fps':'30 fps','comAAC':'com AAC','estéreo48kHz':'estéreo 48 kHz','16,2LUFS':'16,2 LUFS','alvo−16':'alvo −16','e7/7itens':'e 7/7 itens','dramático:1,15s':'dramático: 1,15 s','doAAC':'do AAC','máximo−91dB':'máximo de −91 dB','daAPI':'da API','porASR':'por ASR','doASR':'do ASR','doMP4':'do MP4','daLua':'da Lua','Chegada19h55':'Chegada às 19h55','concluída19h50':'concluída às 19h50','emPorto':'em Porto','aoTico':'ao Tico','daT1':'da T1','TEMPORADA2':'TEMPORADA 2','doElevenLabs':'do ElevenLabs','249novos':'249 novos','545acumulados':'545 acumulados','de1.000':'de 1.000','temporada1':'temporada 1',',64,1s':', 64,1 s','oSRT':'o SRT','noSRT':'no SRT','a1080':'a 1080','e30':'e 30','projetoTico':'projeto Tico','noElevenLabs':'no ElevenLabs',':10falas':': 10 falas',',10novas':', 10 novas','Temporada2':'Temporada 2'}.items():s=s.replace(a,b)
 p.write_text(s,encoding='utf8')
whitelist=['roteiro.md','cenas.md','DECISOES.md','LEIA-ME.md','postagem.md','qa.md','qa-tecnico.txt','timeline.json','falas.md','falas.js','tempos.js','beats.js','ep.js','film.html','capa.html','story.html','chars.js','cenarios.js','motor.js','mixagem.py','poses_novas.md','legendas.srt']
with zipfile.ZipFile(V/'ep06_v2_fontes.zip','w',zipfile.ZIP_DEFLATED) as z:
 for name in whitelist:
  p=E/name
  if p.exists():z.write(p,'episodio/'+name)
 for p in sorted(A.glob('*.mp3')):z.write(p,'audio/'+p.name)
 for p in sorted((A/'limpas').glob('*.wav')):z.write(p,'audio/limpas/'+p.name)
 for p in sorted((A/'alinhamento').glob('*.json')):z.write(p,'audio/alinhamento/'+p.name)
 for name in ['master.wav','tempos.json','trilha.json','verificacao-asr.json']:
  p=A/name
  if p.exists():z.write(p,'audio/'+name)
print('Pacote v2 fechado, com roteiro, QA, fontes e áudio, sem chaves.')
