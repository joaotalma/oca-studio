from pathlib import Path
import shutil,json
S=Path(__file__).parent;R=Path('C:/Users/joaot/Projetos/se-vira-tico');E=R/'episodios/ep06/v2'
p=R/'personagens/chars.js';s=p.read_text(encoding='utf8');marker='function badgeSVG(d, sy) {'
if 'if (d.semCracha)' not in s:assert marker in s;s=s.replace(marker,marker+"\n  if (d.semCracha) return ''; // figurino de encontro, opcional; desenho legado preservado.");p.write_text(s,encoding='utf8')
p=R/'personagens/motor.js';s=p.read_text(encoding='utf8');s=s.replace('const y = 1360, destaque', 'const y = f.legendaY ?? EPISODIO.legendaY ?? 1360, destaque');p.write_text(s,encoding='utf8')
for name in ['chars.js','cenarios.js']:shutil.copyfile(R/'personagens'/name,E/name)
(E/'motor.js').write_text((R/'personagens/acabamento.js').read_text(encoding='utf8')+s,encoding='utf8')
shutil.copyfile(S/'ep.js',E/'ep.js')
tl=json.loads((E/'timeline.json').read_text(encoding='utf8'));b=tl['beats'];f={f['n']:f for f in tl['falas']}
mix={'CUES':[(0,b['turbo'],'apuro',.5),(b['turbo'],b['chegada'],'alegre',.45),(b['chegada'],f[5]['ini'],'alegre',.4),(b['dias'],b['cinema'],'romance',.6),(b['cinema'],f[12]['ini'],'romance',.6),(f[12]['ini'],b['juntos']-.3,'apuro',.25),(f[17]['ini'],f[19]['ini'],'romance',.45),(f[19]['ini'],f[20]['fim']+1.6,'romance',.45),(b['encerramento'],b['fim'],'romance',.65)],'FX':[(b['turbo'],'fx_passagem',.35),(b['agenda'],'fx_clique',.2)],'MOTORES':[(0,b['chegada'],.04)]}
(E/'mixagem.py').write_text('''def config(mx,I,E):
 data='''+repr(mix)+'''
 return {'CUES':data['CUES'],'EFEITOS':[(t,getattr(mx,name),g) for t,name,g in data['FX']],'MOTORES':data['MOTORES'],'LATIDOS':[],'VOZ_INTERFONE':set(),'APITO':set()}
''',encoding='utf8')
print('V2 instalada com cadeira/pernas, figurino sem crachá, legenda com altura por fala, carro de costas.')
