# Correções de duas falas

Autorização do João em 13/11/2026: manter 34 graus, corrigir a pronúncia e dizer “passear com cachorro”. Autorizados até 154 créditos; duas falas geradas na voz já aprovada.

MP3 e alinhamentos atuais estão no diretório pai. O histórico Git preserva os anteriores. `ajustes-audio.json` registra os intervalos e os fatores de ajuste de duração para manter a sincronia. As transcrições automáticas são evidência das palavras, não julgamento subjetivo da voz.

WAVs, mixagens, duplicatas e arquivos temporários desta pasta permanecem locais. O vídeo final com o áudio corrigido está versionado em `animacoes/entregas/demitido-antes-do-gta/dia01-hibrido-r2/video.mp4` e permite recuperar sua faixa sonora sem nova geração ou gasto.

Para reconstruir as falas ajustadas: decodificar os MP3 atuais em 48 kHz mono, aparar as pontas com apara() de motor/audio/sincronizar.py e usar atempo com os fatores registrados. Preservar o mapa de tempos aprovado, conforme CORRECOES-FALAS.md na variante visual do episódio. Não recalcular os tempos automaticamente pela duração dos MP3 brutos.
