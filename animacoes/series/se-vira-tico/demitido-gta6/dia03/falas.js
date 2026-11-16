// Falas do Dia 3 (v2, roteiro aprovado pelo João em 15/11/2026). TEMPOS REAIS: duração medida das gravações (15/11/2026) mais as pausas de imagem de cada cena.
// "n" é o número do arquivo de áudio; "tts" leva as marcas de tom; "texto" é a legenda. Voz gerada só com autorização de créditos.
// Vozes: Kauã = kaua2, Rose = rose, Jão = jao (Se Vira, Tico). Marcos não fala.
const FALAS = [
 {"n":1,"ini":0.2,"fim":5.64,"quem":"Kauã","texto":"Faltam quatro dias pro GTA 6. E eu só tenho treze reais e vinte.","tts":"[excited] Faltam quatro dias pro GTA 6! [deadpan] E eu só tenho treze reais e vinte."},
 {"n":2,"ini":6.44,"fim":11.4,"quem":"Kauã","texto":"Vocês escolheram: vender a cadeira. Cento e cinquenta reais.","tts":"[confident] Vocês escolheram: vender a cadeira. [pause] Cento e cinquenta reais."},
 {"n":3,"ini":12.6,"fim":15.4,"quem":"Kauã","texto":"Já apareceu comprador. Vai dar certo.","tts":"[hopeful] Já apareceu comprador. Vai dar certo."},
 {"n":4,"ini":18.4,"fim":22,"quem":"Kauã","texto":"Dinheiro na mão. É a melhor cadeira do bairro.","tts":"[cheerful] Dinheiro na mão. É a melhor cadeira do bairro."},
 {"n":5,"ini":24,"fim":27.2,"quem":"Kauã","texto":"O limite da cadeira é cento e vinte quilos.","tts":"[quiet] O limite da cadeira é cento e vinte quilos."},
 {"n":6,"ini":27.8,"fim":31.08,"quem":"Kauã","texto":"O Marcos tem... um pouquinho mais.","tts":"[whisper] O Marcos tem... [nervous] um pouquinho mais."},
 {"n":7,"ini":34.58,"fim":36.9,"quem":"Dona Rose (fora de quadro)","texto":"Kauã, que barulho foi esse?!","tts":"[curious] Kauã, que barulho foi esse?!"},
 {"n":8,"ini":37.1,"fim":41.34,"quem":"Kauã","texto":"Foi a cadeira, mãe! Tá... se aposentando!","tts":"[shouting] [nervous] Foi a cadeira, mãe! Tá... se aposentando!"},
 {"n":9,"ini":43.34,"fim":48.46,"quem":"Kauã","texto":"Sem cadeira. Sem os cento e cinquenta. E a barra do mesmo jeito.","tts":"[deadpan] Sem cadeira. Sem os cento e cinquenta. [sarcastic] E a barra do mesmo jeito."},
 {"n":10,"ini":49.46,"fim":52.34,"quem":"Kauã","texto":"Pelo menos eu ainda tenho meu jogo de futebol.","tts":"[relieved] Pelo menos eu ainda tenho meu jogo de futebol."},
 {"n":11,"ini":54.94,"fim":56.94,"quem":"Kauã","texto":"Não, não, não, não.","tts":"[panicked] Não, não, não, não."},
 {"n":12,"ini":57.74,"fim":61.5,"quem":"Kauã","texto":"Ele não obedecia. Agora nem sugere.","tts":"[broken] Ele não obedecia. [deadpan] Agora nem sugere."},
 {"n":13,"ini":64,"fim":65.36,"quem":"Kauã","texto":"Novinho.","tts":"[dry] Novinho."},
 {"n":14,"ini":67.16,"fim":70.04,"quem":"Kauã","texto":"Paguei quarenta de pizza pra assistir.","tts":"[resigned] Paguei quarenta de pizza pra assistir."},
 {"n":15,"ini":70.64,"fim":72.96,"quem":"Kauã","texto":"Segue aí, que eu ainda não perdi.","tts":"[friendly] [upbeat] Segue aí, que eu ainda não perdi."},
 {"n":16,"ini":73.96,"fim":77.56,"quem":"Kauã","texto":"Comprar outro: quatrocentos e trinta. A meta dobra.","tts":"[fast] Comprar outro: quatrocentos e trinta. [alarmed] A meta dobra."},
 {"n":17,"ini":80.06,"fim":83.82,"quem":"Kauã","texto":"Ou o tio Jão. Ele conserta tudo com ferramenta de moto.","tts":"[hopeful] Ou o tio Jão. [fast] Ele conserta tudo com ferramenta de moto."},
 {"n":18,"ini":84.42,"fim":88.5,"quem":"Jão (áudio)","texto":"Sobrinho! A Companheira tá com um barulhinho, escuta...","tts":"Sobrinho! A Companheira tá com um barulhinho, escuta..."},
 {"n":19,"ini":91.5,"fim":96.22,"quem":"Jão (áudio)","texto":"...traz aí que eu dou um jeito. Mas já aviso: eu uso o que tiver.","tts":"...traz aí que eu dou um jeito. Mas já aviso: eu uso o que tiver."},
 {"n":20,"ini":97.52,"fim":102.56,"quem":"Kauã","texto":"Quatro minutos de áudio. A resposta tava no três e cinquenta e um.","tts":"[dubious] Quatro minutos de áudio. [deadpan] A resposta tava no três e cinquenta e um."},
 {"n":21,"ini":102.96,"fim":106.48,"quem":"Kauã","texto":"Vocês escolhem, mandem aí que vou ver as suas respostas.","tts":"[friendly] Vocês escolhem, mandem aí que vou ver as suas respostas."}
];
const MARCOS = [{"marco":"cartão do voto de ontem (CADEIRA), no canto, junto da fala 2","ini":6,"fim":8.2},{"marco":"estrondo da cadeira","ini":31.58,"fim":33.28},{"marco":"cartão da regra nº 3","ini":65.56,"fim":66.96},{"marco":"barra se estica","ini":73.96,"fim":77.56},{"marco":"áudio do Jão em 3:51","ini":90,"fim":91.5},{"marco":"VOTAÇÃO (o CTA da fala 21 toca por cima)","ini":103,"fim":107}];
// Duração total: 107.0 s (final encurtado em 15/11/2026: CTA sobreposto à votação e sem quadro final).
