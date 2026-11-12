# Vozes

**Decisão atual (a partir do ep. 3):** as vozes são geradas no **ElevenLabs**, com uma voz fixa por personagem. O OmniVoice, de licença não comercial, ficou nos eps. 1 e 2.

## ElevenLabs

- **Chave:** em `.env.local` (`ELEVENLABS_API_KEY`), fora do git. Rode os scripts com `node --env-file=.env.local`.
- **Vozes fixas:** criadas uma vez pelo Voice Design (`eleven_ttv_v3`), cada uma guiada pelo clipe antigo do personagem em `audio/vozes/`, para ficar parecida com a dos eps. 1 e 2. Os `voice_id` ficam em `scripts/vozes-elevenlabs.json`. Não recrie: a mesma voz segue em todos os episódios.

| Personagem | Referência usada | Prévia escolhida | F0 da referência | F0 da prévia |
|---|---|---|---|---|
| Tico | tico | 0 | 156 Hz | 154 Hz |
| Lua | lua | 2 | 262 Hz | 262 Hz |
| Jão | jao | 2 | 123 Hz | 127 Hz |
| Letícia | leticia | 2 | 333 Hz | 333 Hz |
| CEO | borracheiro | 1 | 157 Hz | 158 Hz |
| Júnior | vendedor | 1 | 170 Hz | 163 Hz |

A prévia foi escolhida por medida (`python scripts/comparar-vozes.py`: altura e timbre médio contra a referência). Quem julga o som é o autor; se uma voz não agradar, gere novas prévias só dela e salve outra.

```bash
node --env-file=.env.local scripts/elevenlabs-criar-vozes.mjs previas tico      # só se for trocar uma voz
node --env-file=.env.local scripts/elevenlabs-criar-vozes.mjs salvar tico=1
node --env-file=.env.local scripts/gerar-vozes-elevenlabs.mjs episodios/ep03 audio/ep03 [--refazer 7,12]
```

- **Falas:** `gerar-vozes-elevenlabs.mjs` lê a tabela de `falas.md`, usa o modelo `eleven_v4` em português e grava também `alinhamento/NN.json`, com o tempo de cada palavra. `ESTABILIDADE=0.85` deixa a entonação mais contida quando uma fala sai fora do tom.
- **Conferir:** `python scripts/medir-vozes.py audio/ep03` mede a altura. Para conferir a pronúncia, transcreva com o speech-to-text do ElevenLabs.
- **Personagem novo:** acrescente em `PERSONAGENS` de `scripts/elevenlabs-criar-vozes.mjs`, com descrição em inglês, texto de amostra em português (100 a 1000 caracteres) e um clipe de referência.

## OmniVoice (eps. 1 e 2)

Os eps. 1 e 2 foram gerados localmente no VoiceStudio, com o motor OmniVoice, e são publicados **sem monetização**.

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
python ../../motor/audio/sincronizar.py episodios/ep01 audio/ep01
python ../../motor/audio/mixar.py audio/ep01 render/ep01_mix.wav
bash ../../motor/audio/masterizar.sh render/ep01_mix.wav render/ep01_master.wav
```

- `sincronizar.py` apara as falas e gera `tempos.js`, que leva o filme do tempo do roteiro para o tempo real e faz a boca seguir o volume.
- `mixar.py` monta falas, efeitos e trilha. Toda a trilha é sintetizada em código. Cada loop é medido na emenda e, se reprovar, a cena fica sem música. O resultado fica em `audio/ep01/trilha.json`.
- `masterizar.sh` leva o som a -16 LUFS.



## Narração pontual na abertura do EP6 — 11/11/2026

Por pedido do autor, o gancho ganhou a voz jovem original já existente no Blink: “Ele vai se declarar… mas ela vai embora.” É uma cópia independente do perfil, não um clone do autor ou uma nova voz de personagem. Uso localizado nesta abertura; o elenco e o restante do episódio permanecem iguais. 40 novos caracteres; 585 acumulados sob o teto aprovado de 1.000.


Atualização da abertura do EP6: mesma voz original jovem, agora com interpretação expressiva, destaque em ELE/MAS ELA e pausas. Modelo eleven_v3. A voz foi mantida em ritmo natural; a abertura ganhou tempo.
