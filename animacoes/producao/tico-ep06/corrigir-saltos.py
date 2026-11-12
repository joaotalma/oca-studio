from pathlib import Path
ROOT=Path('C:/Users/joaot/Projetos/se-vira-tico');EP=ROOT/'episodios/ep06'
p=ROOT/'personagens/motor.js';s=p.read_text(encoding='utf8')
old='const de = p[campo] == null ? v : p[campo];'
new="const de = p[campo] == null ? (EPISODIO.graphicEyes && ['head','lean','liftL','liftR','breath'].includes(campo) ? 0 : v) : p[campo];"
assert old in s;s=s.replace(old,new);p.write_text(s,encoding='utf8')
(EP/'motor.js').write_text((ROOT/'personagens/acabamento.js').read_text(encoding='utf8')+s,encoding='utf8')
p=EP/'ep.js';s=p.read_text(encoding='utf8')
old="head:t<43?-5:t<46?8:t<49?-7:t<54?-4:12"
new="head:-5+13*ease6((t-42.85)/.25)-15*ease6((t-45.85)/.25)+3*ease6((t-48.85)/.25)+16*ease6((t-53.85)/.25)"
assert old in s;s=s.replace(old,new)
old="+ell(586,1095,14,14,CHARS.tico.skin,OUT,3)+ell(...hand6(t),14,14,CHARS.tico.skin,OUT,3)+ret(645,985,150,100,t<4.5?'#b93743':'#fa795c',25,4)+txt(720,1047,'TURBO',30,'#fff')"
new="+ret(645,985,150,100,t<4.5?'#b93743':'#fa795c',25,4)+txt(720,1047,'TURBO',30,'#fff')+ell(586,1095,14,14,CHARS.tico.skin,OUT,3)+ell(...hand6(t),14,14,CHARS.tico.skin,OUT,3)"
assert old in s;s=s.replace(old,new)
p.write_text(s,encoding='utf8');(Path(__file__).parent/'ep.js').write_text(s,encoding='utf8')
print('Corrigidos: origem da inclinação, virada de cabeça e camada da mão no turbo.')
