"""Som do episódio 5. Lido por scripts/mixar.py; os tempos estão no tempo do roteiro (os mesmos do ep.js)."""
import sys
from pathlib import Path

import numpy as np

COZINHA, ENTREGA, BOLSO, APERTO, CARRO2, LIVE, EMBARQUE = 14.95, 20.7, 22.2, 27.8, 28.6, 31.9, 32.9
NOITE5, ENVIOU, AUDIO, MAPA, DIGITA, LEMBRA, MANDA, CLIENTE, POLEGAR = 33.9, 38.85, 40.1, 43.85, 45.4, 47.3, 48.85, 50.15, 53.4
VOTO, DEPOIS, FIM = 56.4, 61.4, 65.1


def config(mx, I, E):
    limpas = Path(sys.argv[1]) / 'limpas'

    def lembranca():
        # "Da próxima vez, me avisa." de novo, abafado e com eco curto, como lembrança
        a = mx.le_wav(limpas / '05.wav')
        a = a / max(np.sqrt(np.mean(a ** 2)), 1e-5) * mx.ALVO_VOZ
        a = np.convolve(a, np.ones(9) / 9, mode='same')
        d = int(.13 * mx.SR); eco = np.zeros(len(a) + d); eco[:len(a)] += a; eco[d:] += a * .35
        return eco * .9

    def timer():
        return np.concatenate([mx.fx_notificacao(), np.zeros(int(.05 * mx.SR)), mx.fx_notificacao()])

    return {
        # (início, fim, música, ganho)
        'CUES': [
            (0, I(2), 'apuro', .4),
            (I(2), COZINHA, 'alegre', .5),
            (COZINHA, CARRO2, 'alegre', .55),
            (CARRO2, NOITE5, 'apuro', .5),
            (NOITE5, AUDIO, 'romance', .5),
            (AUDIO, LEMBRA, 'apuro', .5),
            (LEMBRA, MANDA, 'lembranca', .65),
            (MANDA, VOTO, 'apuro', .4),
            (VOTO, DEPOIS, 'voto', .9),
            (DEPOIS, FIM, 'romance', .6),
        ],
        # (tempo, efeito, ganho)
        'EFEITOS': [
            (.25, mx.fx_notificacao, .35),
            (12.5, mx.fx_passagem, .25),
            (BOLSO + .15, mx.fx_notificacao, .4),
            (APERTO + .1, mx.fx_clique, .35),
            (CARRO2 + .2, mx.fx_porta, .35),
            (E(13) + .1, mx.fx_gps, .3),
            (LIVE + .1, mx.fx_notificacao, .3), (LIVE + .35, mx.fx_notificacao, .25), (LIVE + .6, mx.fx_notificacao, .25),
            (EMBARQUE, mx.fx_passagem, .25),
            (ENVIOU - .05, mx.fx_clique, .4),
            (MAPA + .05, mx.fx_gps, .3),
            (DIGITA + .3, mx.fx_clique, .18), (DIGITA + .55, mx.fx_clique, .18), (DIGITA + .8, mx.fx_clique, .18), (DIGITA + 1.05, mx.fx_clique, .18),
            (LEMBRA + .1, lembranca, 1.0),
            (MANDA + .1, mx.fx_notificacao, .4),
            (CLIENTE + .3, mx.fx_notificacao, .45),
            (VOTO, mx.fx_passagem, .25),
            (DEPOIS + .05, timer, .45),
        ],
        'LATIDOS': [],
        'VOZ_INTERFONE': set(),
        'APITO': set(),
        # Motor do carro nos planos dentro dele
        'MOTORES': [(0, 12.5, .06), (13.0, COZINHA, .06), (CARRO2, LIVE, .07), (EMBARQUE, NOITE5, .07)],
    }
