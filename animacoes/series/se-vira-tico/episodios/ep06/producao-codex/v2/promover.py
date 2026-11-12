from pathlib import Path
import shutil,re,hashlib,json
R=Path('C:/Users/joaot/Projetos/se-vira-tico');base=R/'episodios/ep06';E=base/'v2';V=R/'render';G=Path('G:/Meu Drive/Se Vira, Tico/ep06_instagram')
names=['roteiro.md','cenas.md','DECISOES.md','LEIA-ME.md','postagem.md','qa.md','qa-tecnico.txt','timeline.json','falas.md','falas.js','tempos.js','beats.js','ep.js','film.html','capa.html','story.html','chars.js','cenarios.js','motor.js','mixagem.py','poses_novas.md','legendas.srt']
# Cópias explícitas, sem mover nem apagar diretórios ou tocar no pré-roteiro autoral.
v1=base/'v1';v1.mkdir(exist_ok=True)
for name in names:
 src=base/name
 if src.exists() and not (v1/name).exists():shutil.copyfile(src,v1/name)
for src,name in [(V/'ep06_final.mp4','ep06_versao_anterior.mp4'),(V/'ep06_fontes.zip','ep06_fontes_versao_anterior.zip')]:
 if src.exists() and not (V/name).exists():shutil.copyfile(src,V/name)
for name in names:
 if (E/name).exists():shutil.copyfile(E/name,base/name)
for old,new in [('ep06_v2_final.mp4','ep06_final.mp4'),('ep06_v2_capa.png','ep06_capa.png'),('ep06_v2_story.png','ep06_story.png'),('ep06_v2_fontes.zip','ep06_fontes.zip')]:shutil.copyfile(V/old,V/new)
p=R/'episodios/continuidade.md';s=p.read_text(encoding='utf8')
line='| 6 | Master refeito para revisão final do autor. Caminho OUTRO MOTORISTA confirmado. Final sem votação | Motorista de app, carro alugado | Tico chega19h55; entrega já concluída19h50. Ele percebe a desconfiança; Lua reconhece a mágoa. Dias depois, ela o convida e ele confere a agenda. No cinema, ambos sentados, ele diz “Eu te amo” ao mesmo tempo em que ela anuncia a mudança; disfarça com “Doces da Lua” | Sem novo painel financeiro ou compra de ingresso. Doce no cinema | O turbo atravessa o vermelho em plano traseiro; Letícia reage. O disfarce romântico nasce da notícia | Lua conta aoTico o curso emPorto Alegre, início em30dias. Os dois sabem da mudança. Relação ainda indefinida. Última cartela: TEMPORADA2 — EM BREVE, sem data |'
for a,b in {'chega19h55':'chega às19h55','concluída19h50':'concluída às19h50','às19h':'às 19h','aoTico':'ao Tico','emPorto':'em Porto','em30dias':'em 30 dias','TEMPORADA2':'TEMPORADA 2'}.items():line=line.replace(a,b)
assert len(re.findall(r'^\| 6 \|.*$',s,re.M))==1;s=re.sub(r'^\| 6 \|.*$',lambda m:line,s,flags=re.M);p.write_text(s,encoding='utf8')
p=R/'docs/estrategia/T2.md';s=p.read_text(encoding='utf8')
note='> Atualização autoral de11/11/2026: no EP6 refeito, Lua conta o curso e a mudança aoTico. Ele diz “Eu te amo”, depois disfarça com “Doces da Lua”. Não há beijo ou votação no final. A próxima temporada é anunciada somente como “Em breve”. A continuação parte de ambos conhecerem a mudança.\n\n'
note=note.replace('de11/11','de 11/11').replace('aoTico','ao Tico')
if 'Atualização autoral de 11/11/2026' not in s:s=s.replace('## Como escolher o gancho',note+'## Como escolher o gancho',1)
old='Ela descobre isso logo antes do cinema do ep. 6 e não conta ao Tico. O público sabe e ele não.'
new='Ela conta isso ao Tico no cinema do ep. 6 refeito. Ambos terminam a T1 sabendo da mudança, mas sem definir o que farão com a relação.'
assert old in s;s=s.replace(old,new).replace('Ganchos possíveis para testar, cada um lido em menos de três segundos:', 'Rascunhos anteriores de gancho: precisam de revisão para a nova continuidade do EP6. Não são acontecimentos aprovados:')
p.write_text(s,encoding='utf8')
# Guarda a entrega anterior no próprio Drive antes de substituir os nomes principais.
assert G.is_dir(),G
archive=G/'versao_anterior_61s';archive.mkdir(exist_ok=True)
files=['ep06_final.mp4','ep06_capa.png','ep06_story.png','ep06_fontes.zip','ep06_legendas.srt','ep06_LEIA-ME.md','ep06_postagem.md','ep06_qa.md','ep06_roteiro.md']
for name in files:
 if (G/name).exists() and not (archive/name).exists():shutil.copyfile(G/name,archive/name)
manifest=[]
for name in files:
 source=V/name if name in ['ep06_final.mp4','ep06_capa.png','ep06_story.png','ep06_fontes.zip'] else E/name.removeprefix('ep06_')
 assert source.is_file(),source
 target=G/name;shutil.copyfile(source,target)
 sha=lambda path:hashlib.sha256(path.read_bytes()).hexdigest()
 a,b=sha(source),sha(target);assert a==b,('Cópia divergente',name)
 manifest.append(dict(arquivo=name,bytes=target.stat().st_size,sha256=a,copia_identica=True))
(E/'entrega-drive.json').write_text(json.dumps(manifest,indent=2),encoding='utf8')
print('Versão refeita promovida e nove arquivos idênticos no Drive. Versão anterior preservada. Continuidade/T2 atualizadas.')
