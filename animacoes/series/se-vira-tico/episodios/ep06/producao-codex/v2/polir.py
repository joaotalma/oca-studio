from pathlib import Path
R=Path('C:/Users/joaot/Projetos/se-vira-tico');E=R/'episodios/ep06/v2'
mapping={'temporada1':'temporada 1','temporada2':'temporada 2','Temporada1':'Temporada 1','Temporada2':'Temporada 2','TEMPORADA2':'TEMPORADA 2','às19h':'às 19h','até as20h':'até as 20h','GPS34min':'GPS: 34 min','chega19h55':'chega às 19h55','concluída19h50':'concluída às 19h50','em30dias':'em 30 dias','de11/11':'de 11/11','de1.000':'de 1.000','20de novembro':'20 de novembro','10falas':'10 falas','10novas':'10 novas','249novos':'249 novos','545acumulados':'545 acumulados','entre1250':'entre 1250','1370px':'1370 px','1080×1920':'1080 × 1920','30fps':'30 fps','recorte central3:4':'recorte central 3:4','episódio refeito,64,1s':'episódio refeito, 64,1 s','início30dias':'início em 30 dias'}
for name in ['roteiro.md','cenas.md','DECISOES.md','postagem.md','story.html']:
 p=E/name;s=p.read_text(encoding='utf8')
 for a,b in mapping.items():s=s.replace(a,b)
 p.write_text(s,encoding='utf8')
print('Textos e story revisados: espaçamento e “Temporada 2: EM BREVE”.')
