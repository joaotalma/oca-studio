from pathlib import Path
import json,shutil,zipfile,hashlib
R=Path('C:/Users/joaot/Projetos/se-vira-tico');E=R/'episodios/ep06/v2';A=R/'audio/ep06-v2';D=A/'abertura-enfatica';V=R/'render';G=Path('G:/Meu Drive/Se Vira, Tico/ep06_instagram')
cfg=json.loads((D/'alinhamento.json').read_text(encoding='utf8'));qa=json.loads((D/'qa-entonacao.json').read_text(encoding='utf8'))
for ep in [E,R/'episodios/ep06']:
 for name in ['postagem.md','LEIA-ME.md']:
  p=ep/name;s=p.read_text(encoding='utf8').split('Atualização: narração de abertura')[0];s=s.replace('64,1 s','66 s').replace('64,10 s','66 s');s+='\n\nAbertura regravada com ênfase em **ELE** e **MAS ELA**, pausas curtas e sem acelerar a voz. A abertura dura4,9s; o episódio,66s. Demais imagens e falas foram preservadas.647caracteres de entrada acumulados sob limite aprovado de1.000.\n';s=s.replace('dura4,9s','dura 4,9 s').replace('episódio,66s','episódio, 66 s').replace('preservadas.647caracteres','preservadas. 647 caracteres').replace('de1.000','de 1.000');p.write_text(s,encoding='utf8')
 p=ep/'DECISOES.md';s=p.read_text(encoding='utf8');s+='\n- Ajuste de entonação solicitado pelo autor: ELE e MAS ELA destacados, com pausas. Nova interpretação pelo modelo expressivo, mesma voz original jovem. Abertura ampliada para4,9s; corpo do episódio preservado.\n';p.write_text(s.replace('para4,9s','para 4,9 s'),encoding='utf8')
 (ep/'qa.md').write_text('''# QA — EP6 — abertura com entonação

- Master final:66,00s,1080×1920,30fps,H.264/AAC estéreo.
- Volume integrado: −16,1LUFS. QA do projeto aprovado em duração, resolução, fps, volume e7/7itens do gate.
- Nova interpretação com a mesma voz jovem original, usando modelo expressivo. Os pronomes ELE e MAS ELA ganharam destaque e pausas curtas. Voz não acelerada.
- Pausas adicionais de120ms após ELE e ELA; reforço suave de2,2dB nos trechos destacados.
- Abertura4,9s. Restante deslocado1,9s, mantendo duração relativa, diálogos, reações e encerramento “Em breve”.
- Os1.833quadros do corpo foram decodificados e comparados por hash: idênticos aos da versão anterior. PCM do restante do áudio copiado literalmente.
- Transcrição local reconheceu: “Ele vai se declarar, mas ela vai embora.” Os comandos de interpretação não foram falados.
- Cinema sentado, revelação do curso, falas simultâneas e pausa dramática preservados da versão visual já revisada.
- Sem votação, data de lançamento ou cena depois da cartela final.

647caracteres de entrada acumulados sob o teto aprovado de1.000. Nenhuma voz nova criada. A interpretação artística continua sujeita à escuta do autor. Nada publicado ou agendado.
'''.replace('final:66,00s','final: 66,00 s').replace('1080×1920','1080 × 1920').replace('30fps','30 fps').replace('fps,H.264','fps, H.264').replace('16,1LUFS','16,1 LUFS').replace('e7/7itens','e 7/7 itens').replace('de120ms','de 120 ms').replace('de2,2dB','de 2,2 dB').replace('Abertura4,9s','Abertura 4,9 s').replace('deslocado1,9s','deslocado 1,9 s').replace('Os1.833quadros','Os 1.833 quadros').replace('647caracteres','647 caracteres').replace('de1.000','de 1.000'),encoding='utf8')
shutil.copyfile(E/'qa-tecnico.txt',R/'episodios/ep06/qa-tecnico.txt')
shutil.copyfile(D/'narracao.mp3',A/'00_narrador_abertura_ep06.mp3')
p=R/'docs/VOZES.md';s=p.read_text(encoding='utf8');s+='\n\nAtualização da abertura do EP6: mesma voz original jovem, agora com interpretação expressiva, destaque em ELE/MAS ELA e pausas. Modelo eleven_v3. A voz foi mantida em ritmo natural; a abertura ganhou tempo.\n';p.write_text(s,encoding='utf8')
with zipfile.ZipFile(V/'ep06_v4_fontes.zip','w',zipfile.ZIP_DEFLATED) as z:
 for name in ['roteiro.md','cenas.md','DECISOES.md','LEIA-ME.md','postagem.md','qa.md','qa-tecnico.txt','timeline.json','falas.md','falas.js','tempos.js','beats.js','ep.js','film.html','capa.html','story.html','chars.js','cenarios.js','motor.js','mixagem.py','poses_novas.md','legendas.srt']:
  if (E/name).exists():z.write(E/name,'episodio/'+name)
 for p in A.glob('*.mp3'):z.write(p,'audio/'+p.name)
 for p in (A/'limpas').glob('*.wav'):z.write(p,'audio/limpas/'+p.name)
 for p in (A/'alinhamento').glob('*.json'):z.write(p,'audio/alinhamento/'+p.name)
 z.write(D/'master-enfatico.wav','audio/master.wav')
 for name in ['narracao.mp3','interpretacao.wav','alinhamento.json','qa-entonacao.json','verificacao-asr.json']:
  if (D/name).exists():z.write(D/name,'audio/abertura-enfatica/'+name)
archive=G/'versao_anterior_narracao_neutra';archive.mkdir(exist_ok=True)
updates={'ep06_final.mp4':V/'ep06_v4_final.mp4','ep06_fontes.zip':V/'ep06_v4_fontes.zip','ep06_roteiro.md':E/'roteiro.md','ep06_postagem.md':E/'postagem.md','ep06_qa.md':E/'qa.md','ep06_LEIA-ME.md':E/'LEIA-ME.md','ep06_legendas.srt':E/'legendas.srt'}
for name,source in updates.items():
 dest=G/name
 if dest.exists() and not (archive/name).exists():shutil.copyfile(dest,archive/name)
 shutil.copyfile(source,dest);assert hashlib.sha256(source.read_bytes()).digest()==hashlib.sha256(dest.read_bytes()).digest(),name
shutil.copyfile(V/'ep06_v4_final.mp4',V/'ep06_final.mp4');shutil.copyfile(V/'ep06_v4_fontes.zip',V/'ep06_fontes.zip')
print('Entonação nova entregue no Drive. Pacote e tempos atualizados; versão anterior preservada.')
