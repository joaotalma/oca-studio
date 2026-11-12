"""Som do episódio 4. Lido por scripts/mixar.py; os tempos estão no tempo do roteiro (os mesmos do ep.js)."""

COR, TUDO, QUARTO, PAGINA, APAGA, SOZINHO, TITULO, GARAGEM = 1.5, 4.6, 6.4, 7.6, 10.0, 10.8, 12.3, 13.3
APAGANDO, DIARIA, CHAVE, GPS, CORRIDA, PORTA = 21.3, 22.8, 26.9, 27.4, 36.3, 37.5
ESCOLA, OLHOS, VOTO, DEPOIS, SO_ELE, FIM = 45.6, 52.5, 57.7, 62.2, 63.6, 67.2


def config(mx, I, E):
    return {
        # (início, fim, música, ganho). O Tico sozinho na janela e a pergunta final ficam sem música.
        'CUES': [
            (0, COR + .3, 'lembranca', .8),
            (COR + .3, QUARTO, 'romance', .6),
            (QUARTO, APAGA + .4, 'lembranca', .7),
            (TITULO, CORRIDA, 'alegre', .55),
            (CORRIDA, ESCOLA, 'apuro', .45),
            (ESCOLA, OLHOS, 'romance', .7),
            (VOTO, DEPOIS, 'voto', .9),
            (DEPOIS, FIM, 'alegre', .8),
        ],
        # (tempo, efeito, ganho)
        'EFEITOS': [
            (COR + .1, lambda: mx.fx_ziper(.5), .16), (TUDO + .1, lambda: mx.fx_ziper(.45), .16),
            (QUARTO + .5, lambda: mx.fx_ziper(.2), .2), (PAGINA, mx.fx_sopro, .3),
            (APAGA + .25, mx.fx_clique, .4),
            (TITULO, mx.fx_passagem, .25),
            (APAGANDO + .1, mx.fx_clique, .25), (APAGANDO + .5, mx.fx_clique, .25), (APAGANDO + .9, mx.fx_clique, .25),
            (DIARIA, mx.fx_notificacao, .45),
            (CHAVE, mx.fx_metal, .35),
            (GPS, mx.fx_gps, .3),
            (CORRIDA, mx.fx_notificacao, .45),
            (PORTA + .2, mx.fx_porta, .35),
            (VOTO, mx.fx_passagem, .25),
            (DEPOIS, mx.fx_notificacao, .4), (SO_ELE, mx.fx_passagem, .3),
        ],
        # Ninguém mente para o Fiscal ouvir: ele não aparece.
        'LATIDOS': [],
        'VOZ_INTERFONE': set(),
        'APITO': set(),
        # Motor do carro enquanto ele dirige; para antes da pergunta.
        'MOTORES': [(I(5) - .2, CORRIDA, .07), (I(9) - .1, OLHOS, .07)],
    }
