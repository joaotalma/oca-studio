"""Som do Dia 1 de "Demitido Antes do GTA". Lido por animacoes/motor/audio/mixar.py (modo episódio);
os tempos estão no tempo do roteiro (os mesmos do ep.js)."""

FLASH, DATAS, CTRL, ASSOPRA, FITA, GELA, FICA = 10.0, 27.0, 33.0, 39.2, 40.4, 41.4, 43.4
GRUPO, REGRA, MAE, CONTA, FICA2, MARCA, BICOS, VOTO, FIM, FIM_DO_EP = 50.0, 66.0, 74.0, 90.0, 98.0, 104.0, 115.0, 128.3, 133.3, 134.1


def config(mx, I, E):
    return {
        # (início, fim, música, ganho)
        'CUES': [
            (0, FLASH, 'apuro', .4),
            (FLASH, DATAS, 'lembranca', .5),
            (DATAS, GRUPO, 'alegre', .45),
            (GRUPO, MAE, 'apuro', .45),
            (MAE, CONTA, 'sozinha', .45),
            (CONTA, MARCA, 'lembranca', .45),
            (MARCA, VOTO, 'apuro', .45),
            (VOTO, FIM_DO_EP, 'voto', .9),
        ],
        # (tempo, efeito, ganho)
        'EFEITOS': [
            (3.2, mx.fx_moeda, .4),
            (5.05, mx.fx_notificacao, .35),
            (FLASH, mx.fx_passagem, .25),
            (I(7) - .3, mx.fx_notificacao, .45),
            (DATAS - 1.6, mx.fx_passagem, .2),
            (ASSOPRA + .1, mx.fx_sopro, .4),
            (FITA + .05, mx.fx_ziper, .35),
            (GELA + .05, mx.fx_porta, .35),
            (E(11) + .1, mx.fx_baque, .3),
            (GRUPO + .1, mx.fx_notificacao, .4), (GRUPO + 1.6, mx.fx_notificacao, .3), (GRUPO + 3.0, mx.fx_notificacao, .25),
            (GRUPO + 4.2, mx.fx_notificacao, .25), (GRUPO + 6.0, mx.fx_notificacao, .3), (GRUPO + 9.5, mx.fx_notificacao, .3),
            (REGRA, mx.fx_passagem, .25),
            (MAE + .2, mx.fx_porta, .35),
            (CONTA + .5, mx.fx_clique, .25), (CONTA + 1.9, mx.fx_clique, .25), (CONTA + 3.3, mx.fx_clique, .25), (CONTA + 4.6, mx.fx_grave, .35),
            (MARCA + .05, mx.fx_notificacao, .45),
            (MARCA + 5.2, mx.fx_clique, .35), (MARCA + 6.2, mx.fx_notificacao, .35),
            (BICOS + .3, mx.fx_notificacao, .35), (BICOS + 7.8, mx.fx_notificacao, .3),
            (VOTO, mx.fx_passagem, .25),
        ],
        # o latido que o assusta antes de "Eu tenho medo de cachorro"
        'LATIDOS': [E(25) + .3],
        'VOZ_INTERFONE': set(),
        'APITO': set(),
        'MOTORES': [],
    }
