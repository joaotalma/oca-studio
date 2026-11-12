from pathlib import Path
S=Path(__file__).parent;E=Path('C:/Users/joaot/Projetos/se-vira-tico/episodios/ep06/v2')
p=S/'ep.js';s=p.read_text(encoding='utf8')
old="<g>${txt(260,1570,'TICO',55,'#fff3d5')}${txt(795,1570,'LUA',55,'#7f3d37')}</g>"
new="<g>${ret(100,1500,320,110,'#fff1d5',30,4)}${txt(260,1572,'TICO',55,'#293c40')}${ret(635,1500,320,110,'#fff1d5',30,4)}${txt(795,1572,'LUA',55,'#7f3d37')}</g>"
assert old in s;s=s.replace(old,new);p.write_text(s,encoding='utf8');(E/'ep.js').write_text(s,encoding='utf8')
print('Nomes dos protagonistas com fundos legíveis.')
