// Falas do Dia 4 (roteiro v3 aprovado pelo João em 16/11/2026). TEMPOS REAIS: duração das palavras alinhadas (16/11/2026) mais as pausas de imagem do roteiro (intervalos mantidos, mínimo 0,5 s). Arquivo de áudio pode ter cauda curta além do "fim".
// "n" é o número do arquivo de áudio; "tts" leva as marcas de tom; "texto" é a legenda. Só voz kaua2.
const FALAS = [
 {"n":1,"ini":0.2,"fim":9.4,"quem":"Kauã","texto":"Faltam três dias pro GTA 6. Eu ainda não tenho o jogo. Custa quatrocentos e cinquenta e eu tenho treze reais.","tts":"[excited] Faltam três dias pro GTA 6! [deadpan] Eu ainda não tenho o jogo. [pause] Custa quatrocentos e cinquenta [sarcastic] e eu tenho treze reais."},
 {"n":2,"ini":9.9,"fim":17.26,"quem":"Kauã","texto":"Gastei os treze em paçoca. Vou vender pra comprar o jogo. Defeito do plano: eu como uma a cada venda.","tts":"[confident] Gastei os treze em paçoca. Vou vender pra comprar o jogo. [deadpan] Defeito do plano: [pause] eu como uma a cada venda."},
 {"n":3,"ini":17.86,"fim":21.22,"quem":"Kauã","texto":"Onze paçocas. Saldo: zero.","tts":"[cheerful] Onze paçocas. [deadpan] Saldo: zero."},
 {"n":4,"ini":22.02,"fim":24.58,"quem":"Kauã","texto":"Vendi uma. Comi uma.","tts":"[proud] Vendi uma. [deadpan] Comi uma."},
 {"n":5,"ini":25.38,"fim":28.66,"quem":"Kauã","texto":"Uma criança pediu pra provar. Provei por ela.","tts":"[curious] Uma criança pediu pra provar. [deadpan] Provei por ela."},
 {"n":6,"ini":29.66,"fim":34.06,"quem":"Kauã","texto":"Cliente quis pagar no Pix. Meu QR code era desenho.","tts":"[nervous] Cliente quis pagar no Pix. [dry] Meu QR code era desenho."},
 {"n":7,"ini":35.56,"fim":38.84,"quem":"Kauã","texto":"Vendi cinco. Comi cinco.","tts":"[tired] Vendi cinco. [deadpan] Comi cinco."},
 {"n":8,"ini":41.84,"fim":48.0,"quem":"Kauã","texto":"O tio Jão devolveu o controle. Agora ele tem acelerador de moto. E cheira a gasolina.","tts":"[resigned] O tio Jão devolveu o controle. [dry] Agora ele tem acelerador de moto. [deadpan] E cheira a gasolina."},
 {"n":9,"ini":55.3,"fim":65.4,"quem":"Kauã","texto":"Hora de contar o dia. Quinze reais. Menos os treze e vinte da paçoca. Lucro: um real e oitenta. Arredondando, dois.","tts":"[tired] Hora de contar o dia. Quinze reais. Menos os treze e vinte da paçoca. [resigned] Lucro: um real e oitenta. [deadpan] Arredondando, dois."},
 {"n":10,"ini":65.9,"fim":76.3,"quem":"Kauã","texto":"Falta muito pro GTA 6. Eu preciso da ajuda de vocês. Cada curtida vale um real. Cada seguidor, cinco. Cada compartilhamento, quinze.","tts":"[defeated] Falta muito pro GTA 6. Eu preciso da ajuda de vocês. [dry] Cada curtida vale um real. Cada seguidor, cinco. Cada compartilhamento, quinze."},
 {"n":11,"ini":77.82,"fim":83.26,"quem":"Kauã","texto":"O placar começa agora. Zero reais. Amanhã eu mostro quanto deu.","tts":"[upbeat] O placar começa agora. [deadpan] Zero reais. [friendly] Amanhã eu mostro quanto deu."},
 {"n":12,"ini":84.26,"fim":90.74,"quem":"Kauã","texto":"Já que vocês vão me ajudar, vocês decidem o que eu faço amanhã. O comentário mais criativo vira o plano.","tts":"[friendly] Já que vocês vão me ajudar, vocês decidem o que eu faço amanhã. [confident] O comentário mais criativo vira o plano."}
];
const MARCOS = [];
