from pathlib import Path
import json,zipfile,hashlib
ROOT=Path('C:/Users/joaot/Projetos/se-vira-tico');EP=ROOT/'episodios/ep06';A=ROOT/'audio/ep06';R=ROOT/'render'
tl=json.loads((EP/'timeline.json').read_text(encoding='utf8'))
def stamp(t):
 n=round(t*1000);return f'{n//3600000:02}:{n//60000%60:02}:{n//1000%60:02},{n%1000:03}'
ws=tl['palavras'];srt=[];i=1
for who in tl['falas']:
 words=[w for w in ws if w['quem']==who['quem'] and w['ini']>=who['ini']-.01 and w['fim']<=who['fim']+.01]
 for j in range(0,len(words),3):
  w=words[j:j+3];srt.extend([str(i),f"{stamp(w[0]['ini'])} --> {stamp(w[-1]['fim'])}",' '.join(v['palavra'] for v in w),'']);i+=1
(EP/'legendas.srt').write_text('\n'.join(srt),encoding='utf8')
(EP/'LEIA-ME.md').write_text('''# Se Vira, Tico — EP6 — Final da temporada 1

Use ep06_final.mp4 para publicar, ep06_capa.png para capa e ep06_story.png no story após a publicação. A votação termina o vídeo: BEIJA / NÃO BEIJA. Não acrescente vinheta, gag ou cartão depois.

O roteiro tem as falas e os tempos reais. A ficha de postagem inclui títulos, legendas e comentário fixado para Instagram, TikTok e YouTube Shorts. As legendas já estão no vídeo; o SRT é uma cópia editável.

Vozes: elenco fixo do ElevenLabs, 13 falas e 296 caracteres de texto; teto aprovado pelo autor de 1.000 créditos. Trilha e efeitos sintetizados no projeto. Sem trecho de filme de terceiros.

As fontes permitem editar o episódio no projeto Se Vira, Tico. Rig, cenários e motor foram copiados da fonte compartilhada do próprio Tico. Novas pupilas pretas, olhar e piscada progressiva são opt-in; renders publicados não foram substituídos. Direção e revisão de roteiro usam os critérios desenvolvidos no Plotline/Blink, sem acoplar os dois projetos.

Reprodução: carregar film.html por um servidor local e chamar window.renderFrame(tempoReal). Render: 1080x1920,30fps. O áudio final está no pacote de fontes; não contém chave nem arquivo de ambiente. Ler qa.md para os resultados medidos e os limites da revisão.

Somente João publica e agenda. Nada foi publicado automaticamente.
''',encoding='utf8')
files=['roteiro.md','cenas.md','postagem.md','LEIA-ME.md','legendas.srt','timeline.json','falas.md','falas.js','tempos.js','ep.js','film.html','capa.html','story.html','chars.js','cenarios.js','motor.js','mixagem.py','qa.md']
with zipfile.ZipFile(R/'ep06_fontes.zip','w',zipfile.ZIP_DEFLATED) as z:
 for name in files:
  p=EP/name
  if p.exists():z.write(p,'episodio/'+name)
 for p in sorted(A.glob('*.mp3')):z.write(p,'audio/'+p.name)
 for name in ['master.wav','tempos.json','trilha.json','verificacao-asr.json']:
  p=A/name
  if p.exists():z.write(p,'audio/'+p.name)
 for p in sorted((A/'alinhamento').glob('*.json')):z.write(p,'audio/alinhamento/'+p.name)
print('SRT e fontes preparados. Nenhum arquivo de ambiente ou chave incluído.')
