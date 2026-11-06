# Vozes

**Decisão atual:** as vozes são geradas localmente no VoiceStudio, com o motor OmniVoice, e a série é publicada **sem monetização**.

## Licença

O catálogo do VoiceStudio 0.5.7 declara o modelo `k2-fsa/OmniVoice` como CC-BY-NC, com componentes de Higgs Audio 2 e Meta Llama 3. O próprio aplicativo avisa que esse rótulo não é uma liberação. Antes de publicar, leia os termos do modelo.

Enquanto estas vozes forem usadas:

- **Sem monetização:** nada de programa de recompensas, publicidade ou patrocínio nos vídeos.
- **Crédito:** dê crédito ao OmniVoice na descrição do vídeo.
- **Monetizar depois:** gere as falas de novo com outro motor ou serviço de licença adequada. Isso muda as vozes da série.

## Marca d'água

A marca d'água invisível do aplicativo está ligada. Rotule o conteúdo como gerado por IA conforme a regra da plataforma.

## Como gerar

Com o VoiceStudio aberto:

```bash
python scripts/gerar-vozes.py episodios/ep01 audio/ep01
```

Para refazer falas específicas: `--refazer 12,14`.

## Como a voz fica igual

Descrição em texto e semente fixa não seguram a voz: cada fala sorteava uma pessoa, inclusive de outro gênero. Agora cada fala é clonada de um clipe de referência do personagem, em `audio/vozes/<personagem>.wav`. O texto do clipe e os atributos ficam em `scripts/gerar-vozes.py`.

- **Referências:** ficam fora do git. Perder o arquivo significa perder a voz, então guarde uma cópia.
- **Personagem novo:** gere um clipe com atributos em inglês, como `female, young adult, moderate pitch`, meça a altura e acrescente em `VOZES`.
- **Conferir:** `python scripts/medir-vozes.py audio/ep01` mede a altura de cada fala. Grito e canto podem sair da faixa sem ser voz trocada.

## Do áudio ao vídeo

```bash
python scripts/sincronizar.py episodios/ep01 audio/ep01
python scripts/mixar.py audio/ep01 render/ep01_mix.wav
bash scripts/masterizar.sh render/ep01_mix.wav render/ep01_master.wav
```

- `sincronizar.py` apara as falas e gera `tempos.js`, que leva o filme do tempo do roteiro para o tempo real e faz a boca seguir o volume.
- `mixar.py` monta falas, efeitos e trilha. Toda a trilha é sintetizada em código. Cada loop é medido na emenda e, se reprovar, a cena fica sem música. O resultado fica em `audio/ep01/trilha.json`.
- `masterizar.sh` leva o som a -16 LUFS.

