---
name: freellmapi
description: Usa FreeLLMAPI (github.com/tashfeenahmed/freellmapi), un enrutador que junta los planes gratuitos de decenas de proveedores de LLM detrás de un solo endpoint compatible con OpenAI (/v1/chat/completions, embeddings, imágenes y audio), para descargar en modelos gratuitos el trabajo pesado y no sensible de los agentes de Lumen Studio y ahorrar el límite de uso de Claude. Se carga primero en cada sesión. Úsala para borradores, traducciones, variantes de copy, resúmenes, clasificación o lotes de texto; no para decisiones, código del repositorio ni datos personales.
---

# FreeLLMAPI · modelos gratuitos para la agencia

Regla de la casa: **es la primera skill que se revisa en cada sesión**. Antes de repartir trabajo, el gerente comprueba si FreeLLMAPI está disponible y, si lo está, decide qué tareas pueden ir a modelos gratuitos.

## 1. ¿Está disponible?
FreeLLMAPI es un servidor que hay que tener corriendo (Docker, app de escritorio o hosteado) con las claves gratuitas de cada proveedor ya cargadas en su panel. En esta sesión se usa con dos variables de entorno:

- `FREELLMAPI_URL`: base del servidor, por ejemplo `https://mi-servidor:3001` (sin `/v1`).
- `FREELLMAPI_KEY`: la clave unificada del enrutador (`freellmapi-…`). Nunca se escribe en el repositorio ni en el chat.

Comprobación (no gasta tokens de nadie):
```bash
[ -n "$FREELLMAPI_URL" ] && curl -sS -m 10 -H "Authorization: Bearer $FREELLMAPI_KEY" "$FREELLMAPI_URL/v1/models" | head -c 400 || echo "FreeLLMAPI no configurado"
```
Si no está configurado o no responde, dilo en una línea al dueño y sigue con las herramientas normales. **No inventes un servidor ni pegues claves.**

## 2. Cómo llamarlo
API compatible con OpenAI. El enrutador elige el modelo libre disponible si pides `"model": "auto"`:
```bash
curl -sS "$FREELLMAPI_URL/v1/chat/completions" \
  -H "Authorization: Bearer $FREELLMAPI_KEY" -H "Content-Type: application/json" \
  -d '{"model":"auto","messages":[{"role":"user","content":"Traduce al inglés, tono cercano: ..."}]}'
```
Para varios pedidos, haz un script pequeño en el scratchpad que lea un JSON de entradas y escriba las salidas; no metas lotes enormes en un solo prompt.

## 3. Qué sí y qué no
Sí (tareas mecánicas y revisables):
- borradores y variantes de textos de marketing, traducciones ES↔EN↔PT, resúmenes de documentos públicos;
- clasificar o etiquetar listas, extraer datos de texto público, generar opciones para que un agente elija.

No:
- **datos personales** (correos de la lista de espera, respuestas de entrevistas con nombre, cualquier dato de la tabla `waitlist`): los proveedores gratuitos pueden guardar o usar lo que reciben;
- claves, código privado, decisiones de producto o de seguridad, textos legales finales;
- nada que se publique sin que un agente de Lumen lo revise: la salida de un modelo gratuito es un borrador.

## 4. Calidad
Los modelos gratuitos varían mucho. Revisa siempre la salida contra la guía de tono (`docs/plan/00`), las reglas de `CLAUDE.md` (sin cifras inventadas) y corrige antes de usarla. Anota en tu entrega qué partes salieron de FreeLLMAPI.

Licencia de FreeLLMAPI: MIT (`.claude/skills/_licencias/freellmapi/`).
