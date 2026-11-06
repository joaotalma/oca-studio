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

Para refazer falas específicas: `--refazer 12,14`. Cada personagem tem descrição e semente fixas em `scripts/gerar-vozes.py`.
