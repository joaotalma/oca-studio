"""Som do episódio 4. Lido por ../../motor/audio/mixar.py; os tempos estão no tempo do roteiro (os mesmos do ep.js)."""

COR, TUDO, QUARTO, PAGINA, APAGA, SOZINHO, TITULO, GARAGEM = 1.5, 4.0, 6.0, 7.4, 10.0, 10.8, 12.3, 13.3
APAGANDO, DIARIA, CHAVE, GPS, VENTILA, CORRIDA, PORTA = 21.3, 22.8, 26.9, 27.4, 31.4, 31.9, 33.1
ESCOLA, OLHOS, VOTO, DEPOIS, FIM = 41.2, 48.1, 53.3, 57.8, 61.8


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
            (VENTILA, mx.fx_sopro, .4),
            (CORRIDA, mx.fx_notificacao, .45),
            (PORTA + .2, mx.fx_porta, .35),
            (VOTO, mx.fx_passagem, .25),
            (DEPOIS, mx.fx_notificacao, .4), (DEPOIS + .5, mx.fx_moeda, .35),
        ],
        # Ninguém mente para o Fiscal ouvir: ele não aparece.
        'LATIDOS': [],
        'VOZ_INTERFONE': set(),
        'APITO': set(),
        # Motor do carro enquanto ele dirige; para antes da pergunta.
        'MOTORES': [(I(5) - .2, CORRIDA, .07), (I(7) - .1, OLHOS, .07)],
    }
