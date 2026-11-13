from visuais import items,sheet
for ident,times in [
('07-saveclip',[0,.25,.5,.75,1,14.8,15.1,15.4,15.7,16,65,65.5,66,66.5,67]),
('11-foto',[29,29.4,29.8,30.2,30.6,76,76.4,76.8,77.2,77.6]),
('12-cidade',[44,44.4,44.8,45.2,45.6,58,58.4,58.8,59.2,59.6,130,130.4,130.8,131.2,131.6])]:
    sheet(next(x for x in items if x['id']==ident),times,'detalhes',cols=5,w=216)
