"""Som do episódio 3. Lido por ../../motor/audio/mixar.py; os tempos estão no tempo do roteiro (já encurtado, ver J no ep.js)."""

# Tempos fixos do ep.js, no tempo do roteiro
COR_VOLTA = 7.45        # a lembrança acaba e a cor volta
CORRE = 8.15
EM_CASA = 8.8
ENVIA = 12.3
LUA_LE = 13.5
ONIBUS = 14.7
PORTA_VIDRO = 16.6
VE_MENSAGEM = 21.4
NOITE = 23.8
BORRIFA = 34.8
OLHA_JANELA = 39.7
LUA_OLHA = 41.2
J = lambda t: t if t <= 42.5 else 42.5 + (t - 42.5) * .82 if t <= 57.3 else 54.636 + (t - 57.3) * 1.3 / 1.8 if t <= 59.1 else 55.936 + (t - 59.1) * .9 if t <= 64.1 else t - 3.664
PAPEIS = [42.5, 44.1, 45.6, 47.2, 48.6, 50.4, 51.9, 54.1, 55.3]
FIM_PAPEIS = J(57.3)
VOTO, DEPOIS, FIM = J(59.1), J(64.1), J(66.1) + .5


def config(mx, I, E):
    return {
        # (início, fim, música, ganho). "Cheguei atrasada" e a Lua pensando ficam sem música.
        'CUES': [
            (0, COR_VOLTA, 'lembranca', .8),
            (COR_VOLTA + .3, I(3) - .1, 'apuro', .7),
            (I(3) - .1, E(5), 'alegre', .55),
            (NOITE, OLHA_JANELA, 'alegre', .5),
            (J(PAPEIS[0]), FIM_PAPEIS, 'romance', .85),
            (VOTO, DEPOIS, 'voto', .9),
            (DEPOIS, FIM, 'alegre', .8),
        ],
        # (tempo, efeito, ganho)
        'EFEITOS': [
            (I(37), mx.fx_notificacao, .45),
            (CORRE, mx.fx_passagem, .3),
            (EM_CASA, mx.fx_porta, .3),
            (ENVIA, mx.fx_clique, .35),
            (LUA_LE, mx.fx_notificacao, .4),
            (ONIBUS, mx.fx_passagem, .35),
            (PORTA_VIDRO, mx.fx_porta, .35),
            (VE_MENSAGEM, mx.fx_notificacao, .45),
            (I(7) + .5, mx.fx_metal, .4),
            (BORRIFA, mx.fx_sopro, .45), (BORRIFA + .45, mx.fx_fungada, .35),
            (OLHA_JANELA, mx.fx_clique, .3), (LUA_OLHA, mx.fx_notificacao, .35),
            # Canetão: um chiado curto no começo de cada papel
            *[(J(t) + .12, lambda: mx.fx_ziper(.45), .16) for t in PAPEIS],
            (VOTO, mx.fx_passagem, .25),
        ],
        # O Tico não mente no episódio: o Fiscal não late.
        'LATIDOS': [],
        'VOZ_INTERFONE': set(),
        'APITO': set(),
        'MOTORES': [],
    }
