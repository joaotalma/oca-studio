from pathlib import Path
import zipfile,json,shutil,hashlib
R=Path('C:/Users/joaot/Projetos/se-vira-tico');E=R/'episodios/ep06/v2';V=R/'render';D=R/'audio/ep06-v2/abertura-enfatica';G=Path('G:/Meu Drive/Se Vira, Tico/ep06_instagram');q=json.loads((D/'qa-3s.json').read_text(encoding='utf8'))
qa='''# QA — Episódio final para publicação

- Duração:64,10s. Imagem:1080×1920,30fps. H.264 eAAC estéreo.
- Narração completa até2,90s, preservando a interpretação com ELE e MAS ELA destacados. Ajuste de ritmo sem gerar voz nova ou consumir créditos.
- O fluxo de imagem é idêntico ao master visual aprovado. Demais cenas, falas e encerramento preservados.
- Volume integrado: −16,2LUFS, dentro da meta−16 ±1.
- QA aprovado: duração, resolução, fps, volume e7/7itens do gate. Sem erros de desenho, paradas ou saltos não explicados.
- Curso revelado aoTico, casal sentado, carro de costas no vermelho. Sem compra de ingresso, votação ou data de lançamento.
- Última cartela: TEMPORADA2 — EM BREVE.

Arquivo para publicar: ep06_final.mp4. Capa, story, roteiro e legenda acompanham o pacote. Só o autor publica; nada foi publicado ou agendado automaticamente.
'''
for a,b in {'Duração:64,10s':'Duração: 64,10 s','Imagem:1080×1920,30fps':'Imagem: 1080 × 1920, 30 fps','eAAC':'e AAC','até2,90s':'até 2,90 s','16,2LUFS':'16,2 LUFS','meta−16':'meta −16','e7/7itens':'e 7/7 itens','aoTico':'ao Tico','TEMPORADA2':'TEMPORADA 2'}.items():qa=qa.replace(a,b)
for ep in [E,R/'episodios/ep06']:
 (ep/'qa.md').write_text(qa,encoding='utf8')
 for name in ['roteiro.md','cenas.md']:
  p=ep/name;s=p.read_text(encoding='utf8');s=s.replace('Pronomes destacados, pausas curtas, sem acelerar a voz. A abertura dura 4,9 s; demais cenas e falas foram preservadas, deslocadas 1,9 s.','Pronomes destacados, com o ritmo ajustado para a frase completa antes de3s. A abertura dura3s e o restante permanece nos tempos originais.').replace('antes de3s','antes de 3 s').replace('dura3s','dura 3 s');p.write_text(s,encoding='utf8')
shutil.copyfile(E/'qa-tecnico.txt',R/'episodios/ep06/qa-tecnico.txt')
with zipfile.ZipFile(V/'ep06_v4_fontes.zip') as old,zipfile.ZipFile(V/'ep06_v5_fontes.zip','w',zipfile.ZIP_DEFLATED) as out:
 for item in old.infolist():
  path=item.filename
  if path.startswith('episodio/') and (E/Path(path).name).is_file():data=(E/Path(path).name).read_bytes()
  elif path=='audio/master.wav':data=(D/'master-3s.wav').read_bytes()
  else:data=old.read(path)
  out.writestr(item,data)
 out.write(D/'interpretacao-3s.wav','audio/abertura-enfatica/interpretacao-3s.wav');out.write(D/'qa-3s.json','audio/abertura-enfatica/qa-3s.json')
updates={'ep06_final.mp4':V/'ep06_v5_final.mp4','ep06_fontes.zip':V/'ep06_v5_fontes.zip','ep06_roteiro.md':E/'roteiro.md','ep06_postagem.md':E/'postagem.md','ep06_qa.md':E/'qa.md','ep06_LEIA-ME.md':E/'LEIA-ME.md','ep06_legendas.srt':E/'legendas.srt'}
for name,source in updates.items():
 target=G/name;shutil.copyfile(source,target);assert hashlib.sha256(source.read_bytes()).digest()==hashlib.sha256(target.read_bytes()).digest(),name
shutil.copyfile(V/'ep06_v5_final.mp4',V/'ep06_final.mp4');shutil.copyfile(V/'ep06_v5_fontes.zip',V/'ep06_fontes.zip')
print('EP pronto:64,1s; frase completa2,899s. Arquivos finais conferidos e enviados à pasta do Tico.')
