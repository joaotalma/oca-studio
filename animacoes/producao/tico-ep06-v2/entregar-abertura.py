from pathlib import Path
import json,shutil,zipfile,hashlib
R=Path('C:/Users/joaot/Projetos/se-vira-tico');E=R/'episodios/ep06/v2';A=R/'audio/ep06-v2';D=A/'abertura-narrada';V=R/'render';G=Path('G:/Meu Drive/Se Vira, Tico/ep06_instagram')
cfg=json.loads((D/'alinhamento.json').read_text(encoding='utf8'));q=json.loads((D/'qa-abertura.json').read_text(encoding='utf8'))
for ep in [E,R/'episodios/ep06']:
 p=ep/'qa.md';s=p.read_text(encoding='utf8');s+='\nConferência da abertura narrada: volume final −16,07 LUFS, pico verdadeiro −1,45 dBTP; imagem com SHA256 do fluxo H.264 idêntico à versão anterior. Narração termina em2,02s, antes da fala daLua em3,10s.\n';s=s.replace('em2,02s','em 2,02 s').replace('daLua em3,10s','da Lua em 3,10 s');p.write_text(s,encoding='utf8')
 p=ep/'DECISOES.md';s=p.read_text(encoding='utf8');s+='\n- Pedido posterior do autor: narração somente no gancho, “Ele vai se declarar… mas ela vai embora.” Voz original jovem já existente no Blink; nenhuma voz nova criada. Demais imagens e falas preservadas.\n';p.write_text(s,encoding='utf8')
p=R/'scripts/vozes-elevenlabs.json';voices=json.loads(p.read_text(encoding='utf8'));voices['narrador_abertura_ep06']=dict(voiceId=cfg['voiceId'],referencia='Narrador jovem original do Blink; autorizado para a abertura do EP6 em11/11/2026, sem alterar o elenco.');p.write_text(json.dumps(voices,ensure_ascii=False,indent=1)+'\n',encoding='utf8')
p=R/'docs/VOZES.md';s=p.read_text(encoding='utf8');s+='\n\n## Narração pontual na abertura do EP6 —11/11/2026\n\nPor pedido do autor, o gancho ganhou a voz jovem original já existente no Blink: “Ele vai se declarar… mas ela vai embora.” É uma cópia independente do perfil, não um clone do autor ou uma nova voz de personagem. Uso localizado nesta abertura; o elenco e o restante do episódio permanecem iguais.40novos caracteres;585acumulados sob o teto aprovado de1.000.\n';s=s.replace('—11/11','— 11/11').replace('iguais.40novos','iguais. 40 novos').replace(';585acumulados','; 585 acumulados').replace('de1.000','de 1.000');p.write_text(s,encoding='utf8')
with zipfile.ZipFile(V/'ep06_v3_fontes.zip','w',zipfile.ZIP_DEFLATED) as z:
 for name in ['roteiro.md','cenas.md','DECISOES.md','LEIA-ME.md','postagem.md','qa.md','qa-tecnico.txt','timeline.json','falas.md','falas.js','tempos.js','beats.js','ep.js','film.html','capa.html','story.html','chars.js','cenarios.js','motor.js','mixagem.py','poses_novas.md','legendas.srt']:
  if (E/name).exists():z.write(E/name,'episodio/'+name)
 for p in A.glob('*.mp3'):z.write(p,'audio/'+p.name)
 for p in (A/'limpas').glob('*.wav'):z.write(p,'audio/limpas/'+p.name)
 for p in (A/'alinhamento').glob('*.json'):z.write(p,'audio/alinhamento/'+p.name)
 for name in ['tempos.json','trilha.json','verificacao-asr.json']:
  if (A/name).exists():z.write(A/name,'audio/'+name)
 z.write(D/'master-com-abertura.wav','audio/master.wav')
 for name in ['narracao.mp3','pronta.wav','alinhamento.json','qa-abertura.json','verificacao-asr.json']:
  if (D/name).exists():z.write(D/name,'audio/abertura-narrada/'+name)
archive=G/'versao_anterior_sem_narracao';archive.mkdir(exist_ok=True)
updates={'ep06_final.mp4':V/'ep06_v3_final.mp4','ep06_fontes.zip':V/'ep06_v3_fontes.zip','ep06_roteiro.md':E/'roteiro.md','ep06_postagem.md':E/'postagem.md','ep06_qa.md':E/'qa.md','ep06_LEIA-ME.md':E/'LEIA-ME.md','ep06_legendas.srt':E/'legendas.srt'}
for name,source in updates.items():
 dest=G/name
 if dest.exists() and not (archive/name).exists():shutil.copyfile(dest,archive/name)
 shutil.copyfile(source,dest)
 assert hashlib.sha256(source.read_bytes()).digest()==hashlib.sha256(dest.read_bytes()).digest(),name
shutil.copyfile(V/'ep06_v3_final.mp4',V/'ep06_final.mp4');shutil.copyfile(V/'ep06_v3_fontes.zip',V/'ep06_fontes.zip')
print('Abertura narrada entregue no Drive; vídeo/roteiro/SRT/fontes atualizados. Versão sem narração preservada.')
