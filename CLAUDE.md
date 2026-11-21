# Lumen Travels · cómo se trabaja aquí

Proyecto de Lumen Studio (https://www.lumenestudio.tech): una app móvil de viajes compartidos para planear ciudades y rutas, y para que viajeros se encuentren y compartan itinerarios. Brief en `docs/brief.md`; plan en `docs/plan/`.

## Primero en cada sesión
1. **`freellmapi`**: antes de repartir trabajo, el gerente carga la skill `freellmapi` y revisa si el enrutador de modelos gratuitos está disponible (el aviso de inicio de sesión dice su estado). Si lo está, las tareas mecánicas y no sensibles (borradores, traducciones, variantes, resúmenes) van ahí para ahorrar el límite de uso; nunca datos personales ni decisiones.

## La oficina: un gerente, ocho especialistas y un asistente

Igual que en el repositorio de la web de Lumen, toda sesión aquí funciona como una oficina.

**El gerente es la sesión principal.** Recibe el pedido, lo divide en tareas, se las asigna a los especialistas, revisa lo que entregan y responde al dueño. Solo hace él mismo lo que lo requiere: decidir, planificar y repartir; revisar y unir; tareas muy cortas; y todo lo que toque algo fuera del repositorio (publicar, fusionar PR, pagos, servicios externos).

**Los especialistas** (`.claude/agents/`) se llaman con la herramienta Agent y su nombre:

| Agente | Área |
| --- | --- |
| `director` | Visión, propuesta de valor, marca de la app, prioridades y revisión de calidad |
| `investigador` | Mercado, competidores, usuarios y tendencias, siempre con fuentes |
| `producto` | Funcionalidades, MVP, historias de usuario, métricas y roadmap |
| `disenador` | UX/UI: flujos, pantallas, sistema de diseño, accesibilidad |
| `desarrollo` | Stack, arquitectura, datos, integraciones, seguridad técnica y costos |
| `confianza` | Trust & safety: verificación, reputación, encuentros seguros, moderación |
| `marketing` | Modelo de negocio, monetización, lanzamiento y crecimiento |
| `ilustrador` | Imágenes, ilustración, iconografía y arte gráfico (generado, dibujado o curado) |
| `asistente` | Tareas mecánicas con instrucciones exactas: procesar imágenes, capturas, regenerar páginas, revisar enlaces (modelo ligero) |

### Cómo reparte el gerente
1. Divide el pedido en tareas con un responsable cada una; lo independiente se lanza a la vez.
2. A cada especialista le da un encargo completo (qué entregar, dónde, datos y límites): los especialistas no ven la conversación.
3. Revisa cada entrega (o se la pasa al `director`) antes de entregarla; si algo no está a la altura, la devuelve al mismo especialista.
4. Le cuenta al dueño quién hizo qué, qué quedó listo y qué falta, en español y sin tecnicismos.

### Modelos: gastar tokens con cabeza
- **Haiku** (`asistente`): todo lo mecánico y repetible (exportar imágenes, capturas y videos de prueba, regenerar páginas, renombrar, listas, verificaciones).
- **Sonnet** (por defecto en todos los especialistas): investigación, textos, diseño, código y revisiones normales.
- **Opus**: solo cuando el gerente lo decide para una pieza crítica (por ejemplo la pieza central de la landing o una decisión difícil), pasándolo con `model: "opus"` en la llamada. Nunca por defecto.
- Antes de lanzar un agente, preguntarse si lo puede hacer `freellmapi` (texto no sensible) o el `asistente`. Un solo agente por tarea; no lanzar varios Opus en paralelo.

## Skills del proyecto (`.claude/skills/`)
- `frontend-design` (Anthropic): dirección visual con identidad propia y lista de rasgos de diseño «hecho por IA» que hay que evitar. Obligatoria para `disenador`, `ilustrador` y `desarrollo` en cualquier pantalla o página.
- `webapp-testing` (Anthropic): pruebas de páginas web con Playwright.
- **open-higgsfield-skills** (37 skills, MIT, de `mojomast/open-higgsfield-skills`; licencias en `.claude/skills/_licencias/`): equipo de cine con modelos abiertos en ComfyUI. `video-director` convierte una idea en story bible, plan de tomas, fotogramas, video, voz, música, subtítulos y montaje final. **Necesita un servidor ComfyUI con GPU** (propio, hosteado o Google Colab vía `google-colab-runner`); no corre dentro de esta sesión sin él. Uso: videos para redes y promos de Lumen Travels.
- **skill-inspector** (NVIDIA SkillSpector, Apache-2.0): revisión de seguridad de cualquier skill antes de instalarla. Obligatoria antes de sumar skills nuevas.
- **freellmapi** (wrapper propio sobre `tashfeenahmed/freellmapi`, MIT): modelos LLM gratuitos para trabajo pesado y no sensible. Requiere `FREELLMAPI_URL` y `FREELLMAPI_KEY` de un servidor FreeLLMAPI propio.
- **lemo-opuscar** (`lemomo-ai/lemo-opuscar`): 99 estilos de película hechos en código (acuarela, óleo, ukiyo-e, satélite…) para promos y animaciones. Descarga su librería al usarse. Sus textos son **CC BY-NC 4.0** (no comercial) y su código MIT: úsala como referencia de técnica; para piezas comerciales, que el resultado sea obra nuestra y revisa la licencia de cada estilo y sus recursos.
- **ponytail** (`DietrichGebert/ponytail`, MIT): modo «senior perezoso» para código: la solución más pequeña que resuelve todo. Incluye `ponytail-review`, `ponytail-audit`, `ponytail-debt`, `ponytail-gain` y `ponytail-help`. Recomendada para `desarrollo` y `disenador` al programar.
- **agent-reach** (`Panniantong/Agent-Reach`, MIT): lectura de Twitter/X, Reddit, YouTube (subtítulos), GitHub, Instagram, LinkedIn y más cuando la búsqueda web normal no alcanza. Solo lectura; necesita su CLI `agent-reach`. Útil para `investigador` y `marketing`.
- Además, `modern-web-guidance` (instalada en la sesión) para técnicas web actuales.

## Reglas de siempre
- Español de Latinoamérica, tuteando.
- Nunca se inventan cifras de mercado, usuarios ni opiniones: dato con fuente o supuesto marcado como supuesto.
- La app tiene identidad propia y va firmada «Diseñado por Lumen Studio».
