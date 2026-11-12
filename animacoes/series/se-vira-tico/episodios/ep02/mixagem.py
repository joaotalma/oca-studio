"""Som do episódio 2. Lido por scripts/mixar.py; os tempos estão no tempo do roteiro, presos às falas."""


def config(mx, I, E):
    voa = E(3) - .32
    pouso = E(19) + .12
    tosse = E(35) + .1
    mapa_pe = E(36) + .12
    montagem = mapa_pe + 1.2
    lua_longe = montagem + 3
    riso = E(37) + .1
    compra = E(39) + .1
    return {
        # (início, fim, música, ganho). O silêncio do riso que engasga e a pausa antes de "Você." ficam sem música.
        'CUES': [
            (0, voa, 'alegre', .9),
            (I(4), I(14), 'lembranca', .8),
            (I(14), I(16) - 1, 'apuro', .7),
            (I(16) - 1, pouso, 'alegre', .6),
            (pouso, E(31), 'apuro', .8),
            (I(35), tosse, 'alegre', .75),
            (mapa_pe, lua_longe, 'apuro', .7),
            (lua_longe, riso, 'romance', .85),
            (I(38) - .1, I(39) - 1.4, 'voto', .9),
            (I(39) - 1.4, compra + 1.2, 'alegre', .8),
        ],
        # (tempo, efeito, ganho)
        'EFEITOS': [
            (voa, mx.fx_baque, .6), (E(3) + .1, mx.fx_passagem, .3),
            (I(4) + .2, mx.fx_notificacao, .35),
            (I(14), mx.fx_notificacao, .45),
            (I(16) - .95, mx.fx_galo, .3),
            (pouso + .36, mx.fx_baque, .6),
            (I(20), mx.fx_gps, .3), (I(23), mx.fx_gps, .3), (I(30), mx.fx_gps, .3),
            (I(25) + .2, mx.fx_notificacao, .3), (I(29) + .1, mx.fx_notificacao, .3), (I(29) + .4, mx.fx_notificacao, .22),
            (I(35) + .35, mx.fx_moeda, .35), (I(35) + 1.4, mx.fx_porta, .3),
            (tosse, mx.fx_tosse_motor, .5),
            (mapa_pe, mx.fx_gps, .3),
            (I(37), mx.fx_notificacao, .45),
            (riso + .9, mx.fx_fungada, .4), (riso + 1.7, mx.fx_grave, .5),
            (I(38) - .1, mx.fx_passagem, .25),
            (compra + .55, mx.fx_moeda, .4),
        ],
        # Só quando alguém diz o que sabe ser falso. Conferir com o ep.js. No caminho da história: dois em H5 e vários em H12.
        'LATIDOS': [E(5) - .1, E(10) - .05, E(12) - .05],
        'VOZ_INTERFONE': set(),
        'APITO': set(),
        # Motor só enquanto a moto anda, com pausa no silêncio antes de "Você."
        'MOTORES': [(0, voa, .16), (I(19), E(31), .12), (I(32), E(34), .1)],
    }
