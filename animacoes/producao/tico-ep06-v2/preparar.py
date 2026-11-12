from pathlib import Path
import json,shutil
S=Path(__file__).parent;R=Path('C:/Users/joaot/Projetos/se-vira-tico');E=R/'episodios/ep06/v2';A=R/'audio/ep06-v2'
E.mkdir(parents=True,exist_ok=True);(A/'alinhamento').mkdir(parents=True,exist_ok=True)
falas=json.loads((S/'falas.json').read_text(encoding='utf8'))
cost=sum(len(f['texto']) for f in falas if not f.get('reusar'))
assert 296+cost<=1000,('Teto anterior de 1.000 caracteres/créditos',296+cost)
md=['# EP6 v2 — A notícia','', '| Arquivo | Quem | Fala |','|---|---|---|']
for f in falas:
 base=f"{f['n']:02}_{f['voz']}";md.append(f"| `{base}.mp3` | {f['quem']} | {f['texto']} |")
 if f.get('reusar'):
  shutil.copyfile(R/'audio/ep06'/f"{f['reusar']}.mp3",A/f'{base}.mp3')
  oldn=f['reusar'].split('_')[0];d=json.loads((R/'audio/ep06/alinhamento'/f'{oldn}.json').read_text(encoding='utf8'));d['n']=f['n'];(A/'alinhamento'/f"{f['n']:02}.json").write_text(json.dumps(d,ensure_ascii=False),encoding='utf8')
(E/'falas.md').write_text('\n'.join(md)+'\n',encoding='utf8')
for name in ['chars.js','cenarios.js']:shutil.copyfile(R/'personagens'/name,E/name)
(E/'motor.js').write_text((R/'personagens/acabamento.js').read_text(encoding='utf8')+(R/'personagens/motor.js').read_text(encoding='utf8'),encoding='utf8')
(E/'film.html').write_text('''<!doctype html><html lang="pt-BR"><meta charset="utf-8"><link rel="icon" href="data:,"><title>Se Vira, Tico — A notícia</title><style>html,body{margin:0;background:#514961}canvas{display:block}</style><script src="chars.js"></script><script src="cenarios.js"></script><script src="falas.js"></script><script src="tempos.js"></script><script src="ep.js"></script><body><canvas id="c"></canvas><script src="motor.js"></script></body></html>''',encoding='utf8')
(E/'poses_novas.md').write_text('''# Necessidades da revisão
- Cinema: usar sentado:true, pernas completas e pés no piso; coxas encurtadas em perspectiva já suportadas pelo rig, joelhos afastados e canelas visíveis.
- Lua sem crachá no encontro: variante opcional de figurino do mesmo personagem.
- Carro visto por trás: novo objeto vetorial; nenhum humano de costas ou perfil é necessário.
- Pupilas dirigidas ao interlocutor durante a declaração e ao doce somente no disfarce.
''',encoding='utf8')
print(f'V2 preparada: {len(falas)} falas, {cost} novos caracteres, {296+cost}/1.000 acumulados; 10 falas reaproveitadas.')
