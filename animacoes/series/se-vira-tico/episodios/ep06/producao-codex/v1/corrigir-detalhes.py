from pathlib import Path
ROOT=Path('C:/Users/joaot/Projetos/se-vira-tico');EP=ROOT/'episodios/ep06'
p=EP/'ep.js';s=p.read_text(encoding='utf8')
s=s.replace("const driver6=actor6", "const hand6=t=>{const q=ease6((t-3.9)/.5)*(1-ease6((t-4.55)/.35));return [798-88*q,1095-55*q];};\nconst driver6=actor6")
s=s.replace("t>4&&t<4.6?[710,1040]:[798,1095]",'hand6(t)')
s=s.replace("ell(798,1095,14,14,CHARS.tico.skin,OUT,3)","ell(...hand6(t),14,14,CHARS.tico.skin,OUT,3)")
old="const s=t-start6,q=ease6((s-1.65)/.45),fingerX=860-180*q,fingerY=1500-290*q;"
new="const s=t-start6,q=ease6((s-1.65)/.45),z=ease6((s-2.1)/.25),out=ease6((s-2.6)/.35),fingerX=860-180*q+240*out,fingerY=1500-290*q+450*out;"
assert old in s;s=s.replace(old,new)
old="return phone6(['CINEMA · SEXTA','SESSÃO DAS 20H','2 INGRESSOS',s<2.15?'Confirmar compra':'COMPRA CONFIRMADA'])+ret(270,1120,540,140,s<2.15?'#29856e':'#95daba',30,4)+txt(540,1205,s<2.15?'COMPRAR':'PRONTO!',60,s<2.15?'#fff':'#193d32')+(s<2.6?`<g transform=\"translate(${fingerX} ${fingerY}) rotate(-28)\">${ret(-33,-170,66,260,CHARS.lua.skin,33,3)}</g>`:'');"
new="return phone6(['CINEMA · SEXTA','SESSÃO DAS 20H','2 INGRESSOS',''])+`<g opacity=\"${1-z}\">${txt(540,885,'Confirmar compra',56)}${ret(270,1120,540,140,'#29856e',30,4)}${txt(540,1205,'COMPRAR',60,'#fff')}</g><g opacity=\"${z}\">${txt(540,885,'COMPRA CONFIRMADA',56)}${ret(270,1120,540,140,'#95daba',30,4)}${txt(540,1205,'PRONTO!',60,'#193d32')}</g><g opacity=\"${1-out}\" transform=\"translate(${fingerX} ${fingerY}) rotate(-28)\">${ret(-33,-170,66,260,CHARS.lua.skin,33,3)}</g>`;"
assert old in s;s=s.replace(old,new)
p.write_text(s,encoding='utf8')
# Guarda o episódio efetivamente usado como fonte também no pacote de produção.
(Path(__file__).parent/'ep.js').write_text(s,encoding='utf8')
print('Gesto contínuo no turbo, sem mão duplicada; confirmação de compra e retirada do dedo suavizadas.')
