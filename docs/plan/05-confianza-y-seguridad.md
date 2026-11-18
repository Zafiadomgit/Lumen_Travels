# 05 · Confianza y seguridad

> Responsable: `confianza` · Lumen Travels · Diseñado por Lumen Studio
> En una app donde desconocidos se encuentran para viajar, la seguridad es parte del producto. Cada medida dice **en qué momento del flujo aparece** y **cómo sabemos si funciona**. Las metas numéricas de este documento son **objetivos internos propuestos (supuestos)**, no datos de mercado; se calibran con los primeros meses de operación.

Principios: 1) la persona más vulnerable define el estándar (pensamos primero en mujeres que viajan solas); 2) menores de edad, prohibidos; 3) nada de dinero ni datos sensibles fuera de la app con desconocidos; 4) fricción proporcional al riesgo: explorar es libre, encontrarse exige verificación.

---

## 1. Mapa de riesgos

Probabilidad e impacto: estimación cualitativa inicial (A = alta, M = media, B = baja), a revisar con datos reales.

| Riesgo | Prob. | Impacto | Mitigación principal |
| --- | --- | --- | --- |
| **Acoso** (mensajes sexuales, insistencia, insultos) | A | M–A | Chat solo tras «match» o aceptación al grupo; filtro automático de lenguaje; bloquear en 1 toque; reporte con evidencia adjunta automática; sanción escalonada. |
| **Agresión en encuentros** (física o sexual) | B | Crítico | Encuentros solo con nivel 2 (identidad); primer encuentro en lugar público sugerido; compartir viaje con contacto de confianza; check-in; botón SOS; expulsión permanente y cooperación con autoridades. |
| **Estafa por pago adelantado** («paga tu parte del hostal a mi Nequi») | A | M | Regla de oro: pagos solo dentro de la app o en persona entre conocidos; detección de datos de pago en chat; aviso contextual; reservas compartidas con pago a proveedor, no a otro usuario. |
| **Perfiles falsos / catfishing** | A | M | Selfie con prueba de vida; insignia de verificado visible; detección de fotos robadas (búsqueda inversa) y de cuentas en serie (dispositivo, teléfono). |
| **Suplantación** (de una persona real o de Lumen) | M | A | Verificación de documento contra selfie; nombres reservados («Lumen», «soporte»); Lumen nunca escribe por chat pidiendo claves o pagos; canal de reclamo de identidad. |
| **Menores de edad** | M | Crítico | Edad mínima 18 declarada al registro y comprobada con documento en nivel 2; señales de minoría (lenguaje, fotos) envían a revisión prioritaria; sin nivel 2 no hay encuentros ni grupos. |
| **Discriminación** (raza, orientación, discapacidad, nacionalidad) | M | M | Norma explícita; filtros de preferencia limitados y justificados (ver §4.6); moderación de textos de perfil y publicaciones «busco compañeros». |
| **Robo** (pertenencias durante el viaje, en hospedajes compartidos) | M | M | Consejos en el flujo antes de compartir alojamiento; reseñas mutuas; reporte que impide nuevos encuentros mientras se investiga. |
| **Spam y comercial encubierto** (agencias, guías, MLM, cripto) | A | B–M | Límite de mensajes a desconocidos por día; detección de enlaces y patrones repetidos; perfiles de negocio separados y marcados (si el modelo lo contempla, ver doc 06). |
| **Datos personales expuestos** (ubicación en vivo, documento, teléfono) | M | A | Documento procesado por proveedor de verificación, no guardado en abierto; ubicación aproximada en el perfil (ciudad, no punto exacto); teléfono nunca visible; ubicación en vivo solo con contacto de confianza y por tiempo limitado. Detalle técnico en doc 04. |

---

## 2. Niveles de verificación

La insignia del nivel se ve en el perfil, en las tarjetas de viajero y en el chat.

| Nivel | Qué se pide | Momento del flujo | Qué desbloquea |
| --- | --- | --- | --- |
| **0 · Visitante** | Nada | Antes de registrarse | Ver rutas y plantillas públicas. Sin perfiles de personas. |
| **1 · Básico** | Correo + teléfono confirmados por código; fecha de nacimiento (18+); aceptar normas | Registro | Planear itinerarios propios, guardar rutas, ver viajeros con foto difuminada y nombre de pila, dar «me interesa». **No** chatea con desconocidos ni se une a grupos. |
| **2 · Identidad verificada** | Documento oficial (cédula, pasaporte, cédula de extranjería) + selfie con prueba de vida, comparada con el documento por un proveedor especializado | Se pide justo cuando la persona intenta escribir a alguien, unirse a un viaje o publicar «busco compañeros» (no antes, para no frenar la descarga) | Chat 1 a 1 y de grupo, unirse y crear viajes abiertos, proponer encuentros, dividir gastos, dejar y recibir reseñas. Insignia «Identidad verificada». |
| **3 · Señales de confianza** | Opcionales y acumulables: conectar una red social (solo se muestra «cuenta conectada desde hace X años», no el enlace), reseñas positivas, viajes completados, antigüedad sin reportes | Sugerido en el perfil tras el primer viaje | Insignias (§3), mejor posición en resultados de «Coincide», poder crear viajes de más de N personas (supuesto: 6) y rutas destacadas en la comunidad. |

Reglas:
- La verificación de nivel 2 se repite (selfie rápida) ante señales de riesgo: cambio de dispositivo, cambio de foto principal o reporte de suplantación.
- Si la fecha del documento indica menos de 18 años: cuenta cerrada y datos del documento eliminados según política.
- El nivel 2 no se compra ni se salta. Si se cobra por algo (doc 06), nunca por la seguridad básica.
- Métrica: % de usuarios activos en nivel 2; tasa de aprobación y de abandono del paso de verificación; tiempo medio de verificación (meta: menos de 5 minutos automático).

---

## 3. Sistema de reputación

**Reseñas mutuas y ciegas.** Al terminar un viaje (fecha final del itinerario) cada integrante puede reseñar a los demás durante **14 días**. Ninguna reseña se publica hasta que ambas partes escriben o vence el plazo. Así nadie responde «en caliente» a lo que el otro dijo.

Qué se califica (1 a 5 + texto opcional): puntualidad y compromiso con el plan; respeto y trato; claridad con el dinero; «¿volverías a viajar con esta persona?» (sí/no, privado, alimenta el algoritmo).

**Insignias** (ganadas, no compradas): Identidad verificada · Viajero confiable (3+ viajes, promedio alto, sin reportes confirmados) · Buen anfitrión de grupo (organizó viajes con buenas reseñas) · Cuentas claras (gastos liquidados a tiempo en la app) · Veterano (antigüedad).

**Contra reseñas de represalia y abuso:**
- Ceguera mutua (arriba) y plazo fijo: no se puede editar tras publicar.
- Solo reseña quien compartió un viaje confirmado en la app.
- Una reseña negativa que acompaña a un reporte de seguridad se separa: el reporte va a moderación; la reseña de la persona reportada contra quien reportó queda en pausa hasta resolverse.
- La persona reseñada puede responder una vez, en público, con tono respetuoso.
- Se puede apelar una reseña que viole normas (insultos, datos personales, discriminación); no por estar en desacuerdo.
- Detección de colusión: grupos que se reseñan entre sí sin viajes reales o desde dispositivos relacionados.
- Métrica: % de viajes con reseña de ambas partes; apelaciones aceptadas; reseñas retiradas por represalia.

---

## 4. Protocolo de encuentro seguro dentro del flujo

### 4.1 Antes del primer encuentro
- Al proponer un encuentro en el chat, la app sugiere **lugares públicos** cercanos y concurridos (cafés, plazas, recepciones de hostal) y muestra una tarjeta breve: «Primer encuentro: lugar público, de día si puedes, llega por tus medios».
- Videollamada opcional dentro de la app antes de verse (sin compartir el número).
- No se puede proponer como primer punto de encuentro una dirección privada sin que aparezca un aviso.

### 4.2 Compartir el viaje con un contacto de confianza
- En el grupo del viaje: botón «Compartir con alguien de confianza». El contacto (no necesita la app) recibe por enlace: itinerario, nombres y fotos verificadas de los compañeros, y la ubicación en vivo durante el encuentro si la persona la activa.
- El enlace caduca al terminar el viaje y se puede revocar.

### 4.3 Check-in
- La persona programa un check-in («avísame a las 9 p. m.»). Si no responde tras dos recordatorios, la app notifica a su contacto de confianza con la última ubicación conocida.
- Check-in automático sugerido en el primer encuentro con alguien nuevo.

### 4.4 Botón de seguridad / SOS
- Siempre visible en el chat, en el grupo del viaje y en la pantalla del encuentro.
- Dos opciones: **«Necesito ayuda ya»** → llama al número de emergencias del país donde está el teléfono y, al mismo tiempo, envía ubicación y datos del viaje al contacto de confianza; **«Me siento incómodo/a»** → salida discreta: llamada falsa, consejos y reporte rápido.
- El SOS también alerta al equipo de seguridad de Lumen (prioridad máxima, §5).
- Números de emergencia por país (a **verificar con fuente oficial antes del lanzamiento** y mantener en una tabla configurable):

| País | Número principal |
| --- | --- |
| Colombia | **123** (línea única de emergencias) |
| México | 911 |
| Argentina | 911 (en muchas jurisdicciones; verificar por provincia) |
| Ecuador | 911 (ECU 911) |
| Perú | 105 (Policía); verificar estado de línea unificada |
| Chile | 133 (Carabineros), 131 (ambulancia) |
| Brasil | 190 (Policía), 192 (ambulancia) |

  Además, 112 funciona en muchos móviles GSM como respaldo, pero no se debe presentar como principal.

### 4.5 Después del encuentro
- Pregunta privada al día siguiente: «¿Cómo te fue con X?» (bien / incómodo / quiero reportar). Es una señal temprana que no depende de que la persona abra un reporte formal.

### 4.6 Modo «solo mujeres» y preferencias de grupo
- Propuesta: que quien crea un viaje pueda marcarlo como **«Grupo de mujeres»** y que cualquier usuaria pueda filtrar para ver solo viajeras. La identidad de género la declara la persona; incluir a mujeres trans y personas no binarias que se sientan cómodas en ese espacio (decisión a validar con abogado y con usuarias).
- Consideración ética y legal: en Colombia la ley sanciona actos de discriminación (Ley 1482 de 2011, modificada por la Ley 1752 de 2015). Un espacio de seguridad para un grupo históricamente expuesto puede justificarse como medida afirmativa, pero **no** se permiten filtros por raza, etnia, religión, orientación sexual, discapacidad o nacionalidad. Los filtros permitidos se limitan a: género para grupos de mujeres, rango de edad amplio (ej. 18–30, 30+), idioma, estilo y presupuesto de viaje.
- El filtro no reemplaza la verificación ni la moderación; se mide uso, reportes dentro de esos grupos y percepción de seguridad.

**Métricas del protocolo:** % de primeros encuentros con lugar público sugerido aceptado; % de viajes con contacto de confianza; check-ins vencidos y su resolución; uso del SOS (y tasa de falsas alarmas); respuesta «incómodo» post-encuentro.

---

## 5. Moderación

**Reportar y bloquear.** Desde perfil, mensaje, publicación, reseña o grupo, en máximo dos toques. Bloquear es inmediato y silencioso: la otra persona deja de verte y de escribirte. Al reportar, el mensaje y el contexto se adjuntan automáticamente (aunque luego se borren). Quien reporta recibe confirmación y el resultado general (sin detalles privados del otro).

**Moderación automática + humana.**
- Automática (antes de publicar o enviar): filtro de lenguaje sexual y de odio, detección de datos de pago y teléfonos en los primeros mensajes, enlaces sospechosos, imágenes explícitas, spam (mensajes repetidos), señales de menor de edad, cuentas múltiples por dispositivo.
- La automatización **marca, oculta temporalmente o limita**; las sanciones fuertes (suspensión, expulsión) las decide una persona.
- Humana: equipo propio, al inicio pequeño y con turnos que cubran horarios de viaje; formación en violencia de género y atención a víctimas; guías escritas y revisión cruzada de casos graves.

**Cola de revisión y tiempos objetivo (supuestos):**

| Prioridad | Ejemplos | Primera respuesta | Resolución |
| --- | --- | --- | --- |
| P0 · Crítica | SOS, agresión, amenaza, menor de edad | Inmediata, 24/7 (meta: < 15 min) | Acción preventiva inmediata (suspensión cautelar) |
| P1 · Alta | Acoso, estafa en curso, suplantación | < 2 h | < 24 h |
| P2 · Media | Lenguaje ofensivo, discriminación, perfil falso sin daño | < 24 h | < 72 h |
| P3 · Baja | Spam, contenido fuera de tema, reseña disputada | < 72 h | < 7 días |

**Sanciones escalonadas:**
1. Aviso educativo (falta leve, primera vez).
2. Limitación temporal (sin chat con desconocidos o sin publicar, 7 días).
3. Suspensión temporal (30 días) con re-verificación al volver.
4. Expulsión permanente, con bloqueo de documento, teléfono y dispositivo.

Agresión, amenaza, explotación sexual, menores o estafa confirmada van **directo a expulsión**. Toda sanción tiene apelación una vez, revisada por otra persona.

**Métricas:** tiempo real de respuesta por prioridad; % de reportes con acción; tasa de reincidencia; apelaciones revertidas (precisión de la moderación); precisión de los filtros automáticos.

---

## 6. Normas de la comunidad (borrador)

> **Viajamos juntos, nos cuidamos juntos.**
>
> 1. **Sé quien dices ser.** Una persona, una cuenta, tu foto real. Solo mayores de 18.
> 2. **Respeta siempre.** Nada de acoso, insinuaciones no pedidas, insultos ni presión. Un «no» es un no, y el silencio también.
> 3. **Aquí cabemos todos.** Cero discriminación por origen, color de piel, género, orientación, religión, discapacidad o cualquier otra razón.
> 4. **El primer encuentro, en público.** Ve por tus medios y cuéntale a alguien de confianza.
> 5. **Cuentas claras, dentro de la app.** No le pidas ni le envíes dinero a nadie que acabas de conocer por fuera de Lumen Travels.
> 6. **Esto no es una vitrina.** Nada de vender, promocionar ni reclutar sin permiso.
> 7. **Cuida los datos de los demás.** No compartas fotos, direcciones ni conversaciones de otros sin su permiso.
> 8. **Si algo no se siente bien, avísanos.** Reportar es anónimo para la otra persona y nos ayuda a cuidar a todos.
>
> Romper estas normas puede llevar a perder tu cuenta. Las faltas graves se reportan a las autoridades.

Se muestran al registrarse (aceptación activa, en tres tarjetas cortas), al pasar al nivel 2 y como recordatorio al crear el primer viaje.

---

## 7. Pagos y dinero entre usuarios

Reglas de producto:
- **La división de gastos registra deudas; no obliga a transferir a desconocidos.** Liquidar se hace en persona o, cuando exista, con pago integrado (doc 04 y 06), siempre entre integrantes de un viaje confirmado.
- **Nada de pagos adelantados a otro usuario por fuera de la app** antes de conocerse en persona. Si alguien organiza un hospedaje o tour, la recomendación es que cada persona pague directamente al proveedor o a través de la app.
- **Detección en chat:** si en los primeros intercambios aparecen números de cuenta, Nequi/Daviplata, enlaces de pago, cripto o tarjetas de regalo, se muestra un aviso a quien recibe: «Ojo: nunca envíes dinero a alguien que no conoces. Más información».
- Límite: en un viaje, un gasto registrado por encima de un umbral (supuesto: equivalente a USD 200) requiere que la persona afectada lo confirme.
- Insignia «Cuentas claras» y reseña de «claridad con el dinero» crean incentivo reputacional.
- Lumen nunca pide contraseñas, códigos ni pagos por chat; se comunica en un canal oficial marcado.
- Reporte específico «Me pidieron dinero / me estafaron»: P1, se congela la cuenta reportada mientras se revisa y se orienta a la víctima para denunciar (en Colombia, ante la Fiscalía o el CAI Virtual de la Policía).

Métricas: reportes de estafa por cada 1.000 viajes; % de avisos de pago mostrados que terminan en reporte o bloqueo; pérdidas reportadas.

---

## 8. Métricas de seguridad y respuesta a incidentes graves

**Tablero de seguridad (revisión semanal; mensual con dirección):**
- Reportes por cada 1.000 usuarios activos y por cada 1.000 encuentros, por categoría.
- Incidentes graves (P0) y tiempo de respuesta.
- % de usuarios activos verificados (nivel 2) y abandono en verificación.
- Tiempos de respuesta reales vs. objetivo por prioridad; reincidencia; apelaciones revertidas.
- Uso de herramientas: contacto de confianza, check-in, lugar público sugerido.
- **Percepción de seguridad:** encuesta corta trimestral («¿Te sientes segura/o usando Lumen Travels?»), desglosada por género. Meta: que no haya brecha entre mujeres y hombres.

**Plan de respuesta a incidentes graves (agresión, abuso sexual, menor involucrado, persona desaparecida, amenaza creíble):**
1. **Primeros minutos:** contacto con la persona afectada (si es posible), indicarle el número de emergencias local; suspensión cautelar de la cuenta señalada y de sus viajes activos; avisar a otros integrantes del grupo si están en riesgo.
2. **Preservar evidencia:** congelar chats, ubicaciones, datos de verificación y registros; nada se borra aunque el usuario lo pida mientras haya investigación (con base legal, a validar).
3. **Escalamiento interno:** responsable de seguridad de guardia + dirección de Lumen Studio + asesoría legal, en menos de 1 hora.
4. **Autoridades:** colaborar con Policía/Fiscalía ante requerimiento formal; protocolo claro de qué datos se entregan y con qué orden. Ante riesgo inminente para la vida, cooperación proactiva (validar con abogado).
5. **Apoyo a la víctima:** acompañamiento, información de líneas de ayuda (en Colombia, Línea 155 de orientación a mujeres víctimas de violencia; verificar vigencia), sin revictimizar ni pedir que repita el relato varias veces.
6. **Comunicación:** un solo vocero; nada público sin aprobación legal; respeto a la privacidad de la víctima.
7. **Después:** análisis sin culpables en 7 días: qué falló, qué se cambia en el producto, y registro en un libro de incidentes.

Simulacro de este plan antes del lanzamiento y luego cada seis meses.

---

## 9. Aspectos legales a revisar con abogado

- **Términos y condiciones y política de privacidad:** papel de Lumen como plataforma que conecta personas (no organizadora de viajes ni agencia), límites de responsabilidad sobre lo que ocurre en encuentros, y hasta dónde son válidos esos límites frente al **Estatuto del Consumidor (Ley 1480 de 2011)**. Revisar si alguna función (reservas, cobros) acerca a Lumen a la figura de agencia de viajes o prestador turístico con obligaciones de registro.
- **Protección de datos (Ley 1581 de 2012 y Decreto 1377 de 2013, compilado en el Decreto 1074 de 2015):** autorización previa, expresa e informada; tratamiento de **datos sensibles** (biométricos de la selfie, ubicación) con autorización específica y facultativa; política de tratamiento publicada; registro de bases de datos ante la SIC si aplica; contratos de transmisión con el proveedor de verificación y la nube (transferencia internacional de datos); plazos de conservación y borrado del documento; derechos de consulta y reclamo.
- **Viajeros internacionales:** si hay usuarios de la Unión Europea, evaluar el RGPD; revisar normas locales de cada país antes de expandirse.
- **Edad mínima 18:** cláusula, mecanismo de verificación y protocolo ante detección de menores; marco de protección de niños, niñas y adolescentes (Código de Infancia y Adolescencia, Ley 1098 de 2006) y obligaciones de reporte de explotación sexual (Ley 679 de 2001 y normas relacionadas).
- **Antidiscriminación:** validez del modo «Grupo de mujeres» y de los filtros de preferencia frente a la Ley 1482 de 2011 / Ley 1752 de 2015.
- **Cooperación con autoridades:** qué datos se entregan, con qué orden judicial y en qué plazos; conservación de evidencia en incidentes.
- **Pagos:** si se integra pago entre usuarios, regulación financiera aplicable y responsabilidades del proveedor de pagos; tratamiento de disputas.
- **Moderación y sanciones:** debido proceso, derecho de apelación y cómo comunicar decisiones para reducir riesgo legal.
- **Responsabilidad por funciones de seguridad:** el SOS y el check-in no deben presentarse como servicio de emergencia garantizado; redacción de avisos y descargos.

---

*Dependencias con otros documentos:* producto (02) prioriza qué de esto entra al MVP — se recomienda que niveles 1–2, reportar/bloquear, SOS, lugar público sugerido, contacto de confianza y reseñas ciegas sean **imprescindibles para lanzar**; diseño (03) define pantallas de SOS y verificación; desarrollo (04) elige proveedor de verificación, cifrado y retención de datos; negocio (06) asegura que nada de seguridad básica quede detrás de un pago.
