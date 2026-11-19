# 02 · Producto, MVP y roadmap

**Responsable:** producto · **Proyecto:** Lumen Travels · **Base:** `docs/brief.md` (4 pilares: Planea, Coincide, Viajen juntos, Confianza). **Verificación y seguridad:** la fuente de verdad es `05` (niveles 0–3, SOS).
**Nota:** las metas numéricas de este documento son **supuestos de trabajo** para fijar umbrales de decisión; no son datos de mercado. Se recalibran con lo que encuentre el investigador (`01`) y con la fase de descubrimiento.

---

## 0. Hipótesis central y principio del MVP

> **H1:** «Los viajeros quieren encontrar compañía compatible alrededor de un itinerario concreto».

El MVP no busca ser la mejor app de planeación ni la mejor app de gastos: busca **probar H1 de punta a punta**, desde que alguien publica un viaje con itinerario hasta que viaja acompañado y deja una reseña. Por eso:

- **Planea** entra solo en lo necesario para que el viaje tenga un itinerario concreto que mostrar.
- **Coincide** es el corazón: aquí se valida H1.
- **Viajen juntos** entra en versión mínima para que el grupo se coordine sin salir de la app.
- **Confianza** entra completa en lo básico: sin seguridad no hay encuentros, y es requisito del brief.

Hipótesis secundarias que el MVP también mide: **H2** la gente acepta verificar su identidad a cambio de más confianza; **H3** un viaje con itinerario recibe más solicitudes de calidad que un «busco compañeros» genérico.

---

## 1. Mapa de funcionalidades por pilar

Prioridad MoSCoW para el MVP: **M** = Must, **S** = Should, **C** = Could, **W** = Won't (por ahora). Fase: MVP / Beta / Lanzamiento (L) / Crecimiento (G).

| Pilar | Funcionalidad | MoSCoW | Fase |
| --- | --- | --- | --- |
| **Planea** | Crear viaje: destino(s), fechas, cupos, presupuesto aproximado | M | MVP |
| | Itinerario por días con lugares (búsqueda de lugares) | M | MVP |
| | Ver itinerario sobre mapa (pines por día) | M | MVP |
| | Estilo de viaje (mochilero, cultural, fiesta, naturaleza, gastronómico…) | M | MVP |
| | Horarios y tiempos de traslado entre lugares | S | Beta |
| | Presupuesto detallado por día/categoría | C | L |
| | Plantillas de rutas de la comunidad (copiar itinerario) | C | L |
| | Itinerario sin conexión (offline) | W | G |
| | Reservas integradas (hospedaje, tours, transporte) | W | G |
| | **Trayectos** (compartir carro entre ciudades): publicar trayecto con asientos, solicitar asiento, aporte a gastos de gasolina y peajes sin ánimo de lucro, verificación de conductor (licencia y vehículo). Sujeto a revisión legal (`05` §9) | C | Fase posterior (G) |
| **Coincide** | Publicar viaje abierto («busco compañeros») | M | MVP |
| | Explorar viajes por destino y fechas, con filtros (estilo, presupuesto, edad, idioma) | M | MVP |
| | Ficha de viaje: itinerario, organizador, cupos, compatibilidad | M | MVP |
| | Pedir unirse con mensaje de presentación | M | MVP |
| | Aceptar / rechazar solicitudes (organizador) | M | MVP |
| | Indicador simple de compatibilidad (fechas, estilo, presupuesto, idioma) | S | MVP |
| | Alertas: «avísame cuando haya viajes a X en estas fechas» | S | Beta |
| | Modo «estoy en la ciudad»: viajeros en la misma ciudad y fechas | C | L |
| | Recomendaciones personalizadas (algoritmo de match) | W | G |
| | Grupos solo mujeres / filtros de género del grupo | S | MVP (ver confianza `05`) |
| **Viajen juntos** | Chat de grupo del viaje (texto, fotos) | M | MVP |
| | División de gastos básica (registrar gasto, quién pagó, saldos) | S | MVP |
| | Itinerario colaborativo (miembros proponen lugares; organizador aprueba) | S | Beta |
| | Votaciones en el grupo | C | L |
| | Liquidar deudas con pagos integrados | W | G |
| | Chat 1 a 1 antes de aceptar | C | Beta |
| **Confianza** | Registro con correo/teléfono verificado | M | MVP |
| | Verificación de identidad (documento + selfie) con insignia | M | MVP |
| | Perfil: foto, bio, idiomas, estilo, viajes hechos | M | MVP |
| | Reseñas mutuas tras el viaje (doble ciego) | M | MVP |
| | Reportar y bloquear usuarios | M | MVP |
| | Moderación humana de reportes + reglas automáticas básicas | M | MVP |
| | Guía de primer encuentro en lugar público (dentro del flujo de aceptar) | M | MVP |
| | Botón SOS básico («Necesito ayuda ya» / «Me siento incómodo/a») y contacto de confianza | M | MVP (imprescindible según `05`) |
| | Check-in programado y ubicación en vivo con contacto de confianza | S | Beta |
| | Verificación de redes sociales / referencias | C | L |
| | Puntaje de reputación compuesto | W | G |

---

## 2. Priorización y alcance del MVP

**Método:** MoSCoW como decisión de alcance, con una regla de desempate tipo RICE simplificado (Alcance × Impacto en H1 × Confianza ÷ Esfuerzo) para los «Should».

| «Should» evaluado | Alcance | Impacto en H1 | Confianza | Esfuerzo | Decisión |
| --- | --- | --- | --- | --- | --- |
| Indicador de compatibilidad (reglas simples) | Alto | Alto | Media | Bajo | **Entra al MVP** |
| División de gastos básica | Medio | Medio (retiene al grupo) | Alta | Medio | **Entra al MVP** (versión mínima) |
| Filtro / grupos solo mujeres | Medio | Alto en seguridad | Alta | Bajo | **Entra al MVP** |
| Alertas por destino y fechas | Alto | Alto (resuelve baja densidad) | Media | Medio | Beta |
| Itinerario colaborativo | Medio | Bajo para H1 | Alta | Alto | Beta |
| Check-in y ubicación en vivo | Medio | Medio | Media | Alto | Beta (en MVP: SOS básico, guía de encuentro y contacto de confianza, por `05`) |

**Entra al MVP:** todos los «M» de la tabla + compatibilidad simple, gastos básicos y filtro de grupos solo mujeres.

**No entra al MVP, y por qué:**

| Fuera del MVP | Motivo |
| --- | --- |
| Plantillas de la comunidad | Requiere volumen de itinerarios; no prueba H1. |
| Algoritmo de recomendación | Sin datos no hay qué entrenar; reglas simples bastan para validar. |
| Pagos integrados y reservas | Alto costo regulatorio y técnico; no es necesario para viajar juntos. |
| Modo «estoy en la ciudad» | Es otra hipótesis (encuentros espontáneos) con más riesgo de seguridad; se valida después. |
| Offline, votaciones, presupuesto detallado | Comodidades; mejoran retención pero no la hipótesis. |
| Puntaje de reputación compuesto | Con pocas reseñas sería engañoso; primero insignia + reseñas visibles. |

---

## 3. Recorrido principal y flujos clave

### Core loop

```
Planea un viaje → Publícalo abierto → Otros lo descubren y piden unirse
      ↑                                              ↓
Reseña y repite ← Viajan juntos (chat + gastos) ← Organizador acepta
```

Hay dos entradas al loop: el **organizador** (crea y publica) y el **viajero que se une** (descubre y pide). Ambos terminan con reseña, que alimenta la confianza del siguiente ciclo.

### Flujos paso a paso

**A. Registro y verificación**
1. Abre la app → pantalla de valor (3 pantallas máximo) → «Crear cuenta» con correo, Google/Apple o teléfono.
2. Verifica correo y teléfono (código): nivel 1 de `05`.
3. Perfil mínimo: nombre, foto, fecha de nacimiento (18+ obligatorio), país, idiomas, estilo de viaje.
4. Acepta normas de la comunidad (resumen de 5 puntos).
5. Invitación a verificar identidad (documento + selfie, nivel 2 de `05`). Puede posponerlo para explorar y planear en privado, pero **es obligatorio para escribir a otra persona, pedir unirse o publicar un viaje**.
6. Resultado: insignia «Verificado» o pedido de reintento con motivo claro.

**B. Crear itinerario**
1. «Nuevo viaje» → destino(s) y fechas.
2. Agrega días; en cada día busca y añade lugares (aparecen en el mapa).
3. Define estilo, presupuesto aproximado (rango) e idioma del grupo.
4. Guarda como borrador privado (puede viajar solo con él; sigue siendo útil).

**C. Publicar viaje abierto**
1. Desde el borrador: «Buscar compañeros».
2. Define cupos (2–8 en MVP; más de 6 requiere nivel 3, ver `05`), requisitos opcionales (rango de edad, solo mujeres, idioma) y un texto «a quién busco».
3. Vista previa de cómo lo verán otros → Publicar.
4. El viaje aparece en Explorar; el organizador recibe consejos para obtener solicitudes (foto, itinerario completo).

**D. Descubrir y pedir unirse**
1. Explorar: busca por destino y fechas; filtra por estilo, presupuesto, idioma.
2. Tarjetas con destino, fechas, cupos libres, organizador (foto, insignia, reseñas) e indicador de compatibilidad.
3. Abre la ficha: itinerario por días, mapa, perfil del organizador.
4. «Pedir unirme» → escribe mensaje de presentación (mínimo 30 caracteres) → enviar.
5. Estado visible: pendiente / aceptada / rechazada / vencida.

**E. Aceptar o rechazar**
1. El organizador recibe notificación → ve perfil, reseñas, compatibilidad y mensaje.
2. Acepta o rechaza (motivo opcional, no visible para el solicitante salvo plantilla amable).
3. Al aceptar: tarjeta de seguridad «primer encuentro en lugar público, comparte tu plan con alguien de confianza».
4. Solicitudes sin respuesta vencen a los 7 días o al llenarse los cupos.

**F. Grupo con chat y gastos**
1. Al primer aceptado se crea el grupo del viaje (chat + itinerario de solo lectura para miembros + gastos).
2. Chat con texto y fotos; reportar mensaje con pulsación larga.
3. Gastos: «Agregar gasto» (monto, moneda, quién pagó, entre quiénes) → saldos por persona.
4. Cualquier miembro puede salir del grupo; el organizador puede retirar a alguien (queda registrado para moderación).

**G. Reseña al terminar**
1. Al día siguiente de la fecha final: notificación «¿Cómo te fue con tu grupo?».
2. Confirma si el viaje ocurrió y con quién viajó realmente.
3. Reseña a cada compañero: calificación 1–5, etiquetas (puntual, buena onda, respetuoso…) y comentario opcional; canal privado para reportar algo grave.
4. Las reseñas se publican cuando ambos reseñan o a los 14 días (doble ciego).
5. Invitación a planear el siguiente viaje (vuelta al loop).

---

## 4. Historias de usuario del MVP

| # | Historia | Criterios de aceptación |
| --- | --- | --- |
| HU1 | Como viajera nueva, quiero crear una cuenta rápido para empezar a explorar. | Registro con correo, Google o Apple en ≤ 3 pantallas; código de verificación válido 10 min; menores de 18 no pueden completar el registro. |
| HU2 | Como usuario, quiero verificar mi identidad para que otros confíen en mí. | Flujo documento + selfie; resultado en la app con estado (en revisión, aprobado, rechazado + motivo); al aprobarse, la insignia aparece en perfil y tarjetas. |
| HU3 | Como usuario, quiero un perfil con mis idiomas y estilo de viaje para que me encuentren compatibles. | Campos obligatorios: nombre, foto, edad, idiomas, ≥1 estilo; el perfil público muestra insignia, reseñas y viajes completados; nunca muestra documento, teléfono ni correo. |
| HU4 | Como organizador, quiero crear un viaje con destino, fechas y días para tener un plan concreto. | Se pueden crear de 1 a 30 días; fecha fin ≥ fecha inicio; el borrador se guarda automáticamente. |
| HU5 | Como organizador, quiero añadir lugares a cada día y verlos en un mapa. | Búsqueda de lugares devuelve resultados del destino; cada lugar añadido aparece como pin numerado por día; se puede reordenar y borrar. |
| HU6 | Como organizador verificado, quiero publicar mi viaje para buscar compañeros. | Solo usuarios verificados pueden publicar; cupos entre 2 y 8; el viaje aparece en Explorar en < 1 min; se puede despublicar en cualquier momento. |
| HU7 | Como viajero, quiero buscar viajes por destino y fechas para encontrar uno que me sirva. | Búsqueda por ciudad/país y rango de fechas (con solapamiento parcial); filtros de estilo, presupuesto e idioma; no se muestran viajes pasados, llenos ni de usuarios que bloqueé o me bloquearon. |
| HU8 | Como viajero, quiero ver qué tan compatible soy con un viaje antes de pedir unirme. | La ficha muestra coincidencia en fechas, estilo, presupuesto e idioma con explicación en lenguaje claro (no un número opaco). |
| HU9 | Como viajero verificado, quiero pedir unirme con un mensaje para presentarme. | Mensaje mínimo de 30 caracteres; máximo 10 solicitudes activas por persona; el solicitante ve el estado; no puede pedir dos veces el mismo viaje. |
| HU10 | Como organizador, quiero revisar y aceptar o rechazar solicitudes para armar mi grupo. | Notificación push por nueva solicitud; vista con perfil, reseñas, compatibilidad y mensaje; al llenarse los cupos, las pendientes se cierran automáticamente con aviso. |
| HU11 | Como viajera, quiero crear un viaje solo para mujeres para sentirme más segura. | Opción visible al publicar; solo perfiles verificados con género femenino pueden ver y pedir unirse; la etiqueta aparece en la tarjeta. |
| HU12 | Como miembro de un grupo, quiero chatear con mis compañeros para coordinar. | Chat creado al primer aceptado; texto e imágenes; mensajes en tiempo real; solo miembros activos lo leen; quien sale del grupo pierde acceso. |
| HU13 | Como miembro, quiero registrar gastos compartidos y ver cuánto debe cada quien. | Registrar monto, moneda, pagador y participantes; saldos netos por persona; editar/borrar solo quien lo creó; historial visible para todo el grupo. |
| HU14 | Como usuario, quiero reportar o bloquear a alguien para protegerme. | Reportar desde perfil, solicitud o mensaje con categoría; bloquear oculta mutuamente perfiles, viajes y chats 1 a 1; el reporte llega a la cola de moderación con contexto. |
| HU15 | Como moderador de Lumen, quiero revisar reportes priorizados para actuar rápido. | Cola ordenada por gravedad; acciones: advertir, suspender, expulsar; cada acción queda registrada; reportes de categoría grave se marcan para atención prioritaria (SLA lo define `05`). |
| HU16 | Como viajero que acaba de aceptarse en un grupo, quiero consejos para el primer encuentro. | Al aceptar se muestra la tarjeta de encuentro seguro; se puede registrar un contacto de emergencia; la tarjeta queda accesible en el grupo. |
| HU17 | Como viajero que terminó un viaje, quiero reseñar a mis compañeros para ayudar a otros. | Invitación al día siguiente del fin; solo se puede reseñar a quienes confirmaron haber viajado; reseñas doble ciego (se publican cuando ambos reseñan o a los 14 días); no se pueden editar después de publicadas. |

---

## 5. Métricas

### North Star

**Viajes compartidos completados por mes:** viajes con ≥ 2 miembros que confirman haber viajado juntos y dejan al menos una reseña. Mide exactamente H1: compañía encontrada alrededor de un itinerario, y que el viaje sí ocurrió.

### Métricas de soporte

| Área | Métrica | Meta inicial (supuesto) |
| --- | --- | --- |
| **Activación** | % de registros que completan perfil mínimo en 24 h | ≥ 60 % |
| | % que verifican identidad en 7 días | ≥ 40 % |
| | % de nuevos que publican un viaje o piden unirse en 14 días | ≥ 25 % |
| | Tiempo hasta primer viaje publicado (mediana) | < 15 min desde inicio del flujo |
| **Calidad de matches** | % de viajes publicados que reciben ≥ 1 solicitud en 7 días | ≥ 50 % |
| | Tasa de aceptación de solicitudes | 30–60 % (fuera de rango = mala compatibilidad o filtro débil) |
| | % de grupos formados que llegan a viajar (confirmado) | ≥ 50 % |
| | Calificación promedio de reseñas entre compañeros | ≥ 4,3 / 5 |
| **Retención** | Retención de usuarios activos a 30 días (abre y hace una acción clave) | Referencia por definir con datos de beta |
| | % de quienes completaron un viaje que crean o se unen a otro en 90 días | ≥ 30 % |
| | Mensajes de chat por grupo antes del viaje (proxy de coordinación) | Seguimiento, sin meta |
| **Seguridad** | Reportes por cada 100 viajes compartidos | Seguimiento y alerta si sube |
| | % de reportes graves atendidos dentro del SLA | ≥ 95 % |
| | Incidentes graves en encuentros (física o acoso) | Meta 0; revisión de cada caso |
| | % de usuarios activos verificados | ≥ 80 % de quienes publican o se unen (100 % por diseño) |

### Eventos de analítica a instrumentar

| Evento | Propiedades clave |
| --- | --- |
| `signup_started` / `signup_completed` | método, país, idioma |
| `profile_completed` | estilos, idiomas |
| `id_verification_started` / `_approved` / `_rejected` | motivo rechazo, tiempo |
| `trip_created` | destinos, n.º días, n.º lugares |
| `place_added` | día, categoría |
| `trip_published` / `trip_unpublished` | cupos, solo_mujeres, presupuesto |
| `search_performed` | destino, fechas, filtros, n.º resultados |
| `trip_viewed` | origen (búsqueda, alerta, enlace), compatibilidad |
| `join_requested` | largo mensaje, compatibilidad |
| `join_accepted` / `join_rejected` / `join_expired` | tiempo de respuesta |
| `group_created` / `member_left` / `member_removed` | tamaño del grupo |
| `message_sent` | tipo (texto/imagen) |
| `expense_added` | moneda, n.º participantes |
| `safety_card_viewed` / `emergency_contact_added` | — |
| `user_reported` / `user_blocked` | categoría, contexto |
| `trip_completed_confirmed` | n.º miembros confirmados |
| `review_submitted` | calificación, etiquetas |
| `trip_link_shared` | canal |

---

## 6. Roadmap por fases

Duraciones en semanas, sin fechas de calendario. Supuesto: Lumen Studio trabaja con el gerente y sus agentes especialistas (producto, diseño, desarrollo, confianza, marketing, investigación, dirección); las duraciones suponen que el dueño aprueba a tiempo y que hay personas reales para moderación, asesoría legal y pruebas con viajeros.

| Fase | Duración estimada | Entregables | Criterio para pasar de fase |
| --- | --- | --- | --- |
| **1. Descubrimiento y validación** | 4–6 sem | 15–20 entrevistas con viajeros objetivo; prototipo navegable del core loop; prueba «concierge» (grupos armados a mano vía formulario + WhatsApp) en 1–2 rutas; definición de destinos semilla. | ≥ 1 de cada 2 entrevistados describe el problema sin que se lo sugieran; en la prueba concierge se forman y viajan ≥ 3 grupos; las personas aceptan verificarse. |
| **2. MVP (construcción)** | 10–14 sem | App iOS/Android con todos los «M» + compatibilidad, gastos básicos y grupos solo mujeres; moderación y panel interno; analítica instrumentada; normas de comunidad. | Core loop completo sin bloqueos en pruebas internas; verificación y reporte funcionando; eventos validados en el tablero; revisión de seguridad aprobada por `confianza`. |
| **3. Beta cerrada** | 8–12 sem | Acceso por invitación en el corredor piloto Medellín–Bogotá–Caribe (`01`); comunidad de embajadores; alertas por destino; itinerario colaborativo; check-in y ubicación en vivo; iteraciones semanales. | ≥ 50 % de viajes publicados con solicitud en 7 días; ≥ 50 % de grupos formados viajan; reseñas promedio ≥ 4,3; cero incidentes graves sin respuesta; tendencia creciente de la North Star. |
| **4. Lanzamiento** | 6–8 sem | Apertura pública en Colombia (y rutas con viajeros internacionales); plantillas de la comunidad; modo «en la ciudad» si la beta lo justifica; campaña con `marketing`. | Crecimiento mes a mes de la North Star; costo de adquisición y retención a 90 días dentro de lo planeado por `06`; moderación sostiene el SLA con el nuevo volumen. |
| **5. Crecimiento** | Continuo (ciclos de 6 sem) | Nuevos países de la región; recomendaciones personalizadas; pagos/liquidación integrados; alianzas (hostales, tours); monetización según `06`; **Trayectos** (compartir carro entre ciudades, decidido: fase posterior), con publicar trayecto con asientos, solicitar asiento, aporte a gastos de gasolina y peajes sin ánimo de lucro y verificación de conductor (licencia y vehículo), tras la revisión legal de `05` §9. | Se revisa por ciclo: cada expansión de destino requiere densidad mínima (ver §7) antes de abrir el siguiente. |

---

## 7. Riesgos de producto y mitigaciones

### El «huevo y la gallina»: densidad de usuarios

Un viaje publicado sin nadie que lo vea muere, y quien busca sin encontrar viajes se va. La densidad que importa no es «usuarios totales», sino **viajes abiertos por destino y ventana de fechas**. Cómo se resuelve en el producto:

1. **Concentrarse antes de expandirse.** Lanzar con pocos destinos semilla (el corredor piloto Medellín–Bogotá–Caribe que recomienda `01`; el Eje Cafetero queda como extensión) y no abrir uno nuevo hasta tener densidad mínima. Supuesto inicial: ≥ 10 viajes abiertos activos por destino y mes.
2. **Valor para un solo jugador.** Planea funciona sin otros usuarios: el itinerario con mapa sirve aunque nadie se una. Eso atrae usuarios que luego publican.
3. **Lado de la oferta sembrado.** Embajadores y viajeros frecuentes publican viajes reales en la beta; el equipo puede armar «viajes semilla» con organizadores verificados (nunca perfiles falsos).
4. **Búsqueda flexible.** Mostrar coincidencias con fechas solapadas parcialmente y destinos cercanos en vez de «0 resultados».
5. **Alertas en lugar de callejones sin salida.** Si no hay viajes: «Te avisamos cuando alguien publique» o «Publica el tuyo, hay N personas buscando este destino».
6. **Crecimiento desde el viaje.** Enlace compartible del viaje (WhatsApp, Instagram) que abre la ficha y lleva al registro; el organizador trae a su propia red.
7. **Medir por destino.** El tablero muestra la densidad y la tasa de solicitud por destino, no solo global.

### Otros riesgos

| Riesgo | Impacto | Mitigación |
| --- | --- | --- |
| Incidente de seguridad en un encuentro | Muy alto (personas y reputación) | Verificación obligatoria para interactuar, reseñas, reporte en 1 toque, guía de encuentro público, moderación con SLA; plan de respuesta a incidentes en `05`. |
| Fricción de la verificación espanta usuarios | Alto | Explorar sin verificar; verificar solo al publicar/pedir; explicar el beneficio; medir abandono por paso. |
| Usos indebidos (citas, ventas, spam, cobros) | Alto | Normas claras, límites de solicitudes, detección de contactos/enlaces en primeros mensajes, reportes y sanciones. |
| Grupos que se forman pero no viajan | Medio | Recordatorios previos, chat activo, confirmación de asistencia; medir y estudiar causas. |
| La gente coordina por WhatsApp y abandona la app | Medio | Asumirlo en el MVP; que la app sea donde viven itinerario, gastos y reseñas (lo que WhatsApp no hace). |
| Reseñas infladas o de represalia | Medio | Doble ciego, solo entre quienes confirmaron viajar, canal privado para lo grave. |
| Alcance que crece (querer todo en el MVP) | Alto | Este documento como contrato de alcance; todo nuevo pedido pasa por MoSCoW/RICE. |
| Hipótesis falsa (no quieren compañía por itinerario) | Alto | Fase 1 concierge barata antes de construir; si falla, pivotar a Planea + «en la ciudad» con los mismos componentes. |

---

*Diseñado por Lumen Studio.*
