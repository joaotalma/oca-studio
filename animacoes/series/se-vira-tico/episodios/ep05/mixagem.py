"""Som do episódio 5. Lido por ../../motor/audio/mixar.py; os tempos estão no tempo do roteiro (os mesmos do ep.js)."""

COR, TITULO, SABADO, TROCA, CARRO_T, MALA, GPS, GANHOS = 1.5, 12.8, 13.8, 28.1, 29.6, 34.1, 36.2, 37.6
NOTE, CLIQUE, AUDIO, MAPA, TRANSITO, RESPOSTA, DECIDE, VOTO, TIMER, COBRE, FIM = 40.1, 42.6, 44.6, 49.2, 50.6, 52.1, 53.6, 55.1, 60.1, 63.4, 65.1


def config(mx, I, E):
    return {
        # (início, fim, música, ganho). A decisão da Lua e o fim, com a massa coberta, ficam sem música.
        'CUES': [
            (0, COR + .3, 'lembranca', .8),
            (COR + .3, E(4), 'romance', .45),
            (E(4), TITULO, 'alegre', .6),
            (TITULO, CARRO_T, 'alegre', .55),
            (CARRO_T, NOTE, 'apuro', .45),
            (NOTE, AUDIO, 'lembranca', .7),
            (AUDIO, DECIDE, 'apuro', .6),
            (VOTO, TIMER, 'voto', .9),
            (TIMER, COBRE, 'romance', .6),
        ],
        # (tempo, efeito, ganho)
        'EFEITOS': [
            (TITULO, mx.fx_passagem, .25),
            (I(7) + .8, mx.fx_metal, .3),
            (I(8) + .3, mx.fx_clique, .25),
            (TROCA, mx.fx_notificacao, .4),
            (MALA, mx.fx_porta, .35),
            (GPS, mx.fx_gps, .3),
            (GANHOS + .9, mx.fx_notificacao, .4),
            (CLIQUE, mx.fx_clique, .45),
            (I(15) - .1, mx.fx_notificacao, .45),
            (MAPA, mx.fx_gps, .3),
            (TRANSITO, mx.fx_passagem, .3),
            (RESPOSTA + .9, mx.fx_clique, .35),
            (VOTO, mx.fx_passagem, .25),
            (TIMER, mx.fx_notificacao, .5), (TIMER + .25, mx.fx_notificacao, .5), (TIMER + .5, mx.fx_notificacao, .5),
        ],
        # O Tico conta a verdade: o Fiscal não late.
        'LATIDOS': [],
        'VOZ_INTERFONE': set(),
        'APITO': set(),
        # Motor do carro alugado, só nas cenas dentro dele.
        'MOTORES': [(COR, TITULO, .06), (CARRO_T, GPS, .07), (TRANSITO, RESPOSTA, .07)],
    }
