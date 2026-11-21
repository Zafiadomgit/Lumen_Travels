#!/usr/bin/env bash
# Recordatorio de inicio de sesión de Lumen Studio: FreeLLMAPI va primero.
if [ -n "$FREELLMAPI_URL" ] && curl -sS -m 6 -o /dev/null -w '%{http_code}' -H "Authorization: Bearer $FREELLMAPI_KEY" "$FREELLMAPI_URL/v1/models" 2>/dev/null | grep -q '^200$'; then
  estado="disponible en $FREELLMAPI_URL"
else
  estado="no configurado o sin respuesta (faltan FREELLMAPI_URL/FREELLMAPI_KEY o el servidor)"
fi
echo "Lumen Studio · regla de la casa: carga primero la skill 'freellmapi' antes de repartir trabajo. Estado de FreeLLMAPI: $estado."
