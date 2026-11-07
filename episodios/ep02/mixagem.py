"""Som do episódio 2. Lido por scripts/mixar.py; os tempos estão no tempo do roteiro, presos às falas."""


def config(mx, I, E):
    voa = E(3) - .32
    pouso = E(17) + .12
    fiscal = E(32) + .05
    tosse = E(33) + .1
    mapa_pe = E(34) + .12
    montagem = mapa_pe + 1.2
    lua_longe = montagem + 3
    riso = E(35) + .1
    compra = E(37) + .1
    return {
        # (início, fim, música, ganho). O silêncio do riso que engasga e a pausa antes de "Você." ficam sem música.
        'CUES': [
            (0, voa, 'alegre', .9),
            (I(4), I(12), 'lembranca', .8),
            (I(12), I(14) - 1, 'apuro', .7),
            (I(14) - 1, pouso, 'alegre', .6),
            (pouso, E(29), 'apuro', .8),
            (I(33), tosse, 'alegre', .75),
            (mapa_pe, lua_longe, 'apuro', .7),
            (lua_longe, riso, 'romance', .85),
            (I(36) - .1, I(37) - 1.4, 'voto', .9),
            (I(37) - 1.4, compra + 1.2, 'alegre', .8),
        ],
        # (tempo, efeito, ganho)
        'EFEITOS': [
            (voa, mx.fx_baque, .6), (E(3) + .1, mx.fx_passagem, .3),
            (I(4) + .2, mx.fx_notificacao, .35),
            (I(12), mx.fx_notificacao, .45),
            (I(14) - .95, mx.fx_galo, .3),
            (pouso + .36, mx.fx_baque, .6),
            (I(18), mx.fx_gps, .3), (I(21), mx.fx_gps, .3), (I(28), mx.fx_gps, .3),
            (I(23) + .2, mx.fx_notificacao, .3), (I(27) + .1, mx.fx_notificacao, .3), (I(27) + .4, mx.fx_notificacao, .22),
            (I(33) + .35, mx.fx_moeda, .35), (I(33) + 1.4, mx.fx_porta, .3),
            (tosse, mx.fx_tosse_motor, .5),
            (mapa_pe, mx.fx_gps, .3),
            (I(35), mx.fx_notificacao, .45),
            (riso + .9, mx.fx_fungada, .4), (riso + 1.7, mx.fx_grave, .5),
            (I(36) - .1, mx.fx_passagem, .25),
            (compra + .55, mx.fx_moeda, .4),
        ],
        # Conferir com o ep.js. No caminho da história: dois em H5 e vários em H10.
        'LATIDOS': [E(5) - .1, E(10) - .05, E(13) + .05, fiscal + .2, E(36) - .2],
        'VOZ_INTERFONE': set(),
        'APITO': set(),
        # Motor só enquanto a moto anda, com pausa no silêncio antes de "Você."
        'MOTORES': [(0, voa, .16), (I(17), E(29), .12), (I(30), fiscal, .1)],
    }
