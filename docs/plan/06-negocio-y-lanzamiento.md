# 06 · Negocio y lanzamiento

> Responsable: `marketing` · Lumen Travels (nombre de trabajo) · Diseñado por Lumen Studio
> Regla de este documento: **todo número propio es un supuesto** (marcado *[S]*), con rango y forma de validarlo. Los precios de terceros llevan fuente y fecha de consulta (nov. 2026); pueden variar por país y tienda.

---

## 1. Lean Canvas

| Bloque | Contenido |
| --- | --- |
| **Problema** | 1) Planear una ruta por varias ciudades es disperso (notas, mapas, chats, hojas de gastos). 2) Encontrar con quién viajar o coincidir en destino depende de grupos de Facebook/WhatsApp sin filtro ni confianza. 3) Viajar en grupo genera roces por plan y plata. |
| **Segmentos** | Primario: mochileros y viajeros independientes de 20–35 años en rutas de Colombia (locales e internacionales). Secundario: grupos de amigos que planean juntos. *Early adopters*: huéspedes de hostales, viajeros solos, nómadas digitales. *(A validar con `01-mercado-y-usuarios.md`.)* |
| **Propuesta única de valor** | «Planea tu ruta, encuentra con quién recorrerla y viajen juntos con confianza, en una sola app.» |
| **Solución** | Los 4 pilares: **Planea** (itinerario por días sobre mapa), **Coincide** (viajeros por destino, fechas y estilo), **Viajen juntos** (grupo, chat, votos, gastos), **Confianza** (verificación, reseñas mutuas, botón de seguridad). |
| **Canales** | Hostales aliados (QR en recepción), comunidades de viajeros, TikTok/Instagram con rutas reales, embajadores, App Store/Google Play (ASO), boca a boca por invitación al grupo. |
| **Ingresos** | Suscripción «Plus» (freemium), comisión por experiencias de aliados locales, afiliación de alojamiento/transporte, planes B2B para hostales y operadores. |
| **Estructura de costos** | Equipo (Lumen Studio), infraestructura y mapas (ver `04-arquitectura-tecnica.md`), verificación de identidad por usuario, moderación y soporte de seguridad, comisión de tiendas de apps, marketing. |
| **Métricas clave** | Viajes creados con ≥2 personas, coincidencias que terminan en grupo, retención a 30 días, % de usuarios verificados, incidentes de seguridad por cada 1.000 encuentros, conversión a Plus. |
| **Ventaja difícil de copiar** | Densidad local (comunidad activa en rutas concretas) + red de hostales aliados + reputación acumulada de los viajeros, que no se exporta a otra app. |

---

## 2. Modelo de negocio y monetización

### Opciones comparadas

| Opción | Cómo gana dinero | A favor | En contra | Cuándo |
| --- | --- | --- | --- | --- |
| **A. Freemium + «Plus»** | Suscripción con extras de planeación y comodidad | Ingreso recurrente; no depende de terceros; alineado con apps comparables (Polarsteps, Wanderlog) | Baja conversión típica en consumo; cobra antes de que exista comunidad | Desde la beta abierta, con funciones mínimas |
| **B. Comisión por experiencias** | % sobre tours y actividades de aliados locales reservadas en la app | Encaja con «Viajen juntos» (reservar en grupo); útil para el viajero | Requiere pagos, soporte y curaduría de aliados; márgenes de mercado conocidos: GetYourGuide cobra 20–30 % al proveedor ([GetYourGuide Supply](https://getyourguide.supply/join/how-much-does-getyourguide-charge)) | Etapa 2, con 1–2 ciudades densas |
| **C. Afiliación alojamiento/transporte** | Comisión por referir reservas (hostales, buses, vuelos) | Cero operación; se integra en el itinerario | Ingreso bajo por reserva: el afiliado recibe una parte de la comisión de la OTA, que se traduce en un porcentaje de un dígito del valor ([track360](https://track360.io/blog/booking-com-affiliate-partner-program-operator-teardown-2026)); puede ensuciar la experiencia | Desde el MVP, discreto, sin publicidad invasiva |
| **D. B2B hostales y operadores** | Plan mensual: perfil destacado, eventos del hostal visibles a huéspedes, panel de grupos | Ingreso predecible; los hostales son además canal de adquisición | Venta uno a uno; poco escalable al inicio; cuidar que no parezca publicidad pagada sobre seguridad | Etapa 2–3, tras probar valor gratis con aliados fundadores |

### Recomendación por etapa

| Etapa | Combinación | Objetivo del dinero |
| --- | --- | --- |
| **0 · Beta cerrada** | Todo gratis. Afiliación solo como prueba técnica. | Aprender, no facturar. |
| **1 · Lanzamiento (0–6 meses)** | **A (Plus)** + **C (afiliación)**. Hostales aliados gratis («aliados fundadores»). | Validar disposición a pagar y la conversión real. |
| **2 · Densidad (6–18 meses)** | A + C + **B (experiencias en grupo)** en las ciudades con más actividad. | Ingreso por transacción ligado al pilar «Viajen juntos». |
| **3 · Escala** | A + B + C + **D (B2B)** con hostales y operadores, cuando ya llevemos viajeros. | Ingreso recurrente B2B y expansión a nuevas rutas. |

### Lo que es gratis siempre

**La seguridad nunca se cobra.** Gratis para todos, en cualquier etapa:
- Verificación de identidad básica, reseñas mutuas y reportes.
- Botón de seguridad, compartir ubicación/itinerario con contactos de confianza, recomendaciones de encuentro en lugares públicos.
- Moderación y bloqueo.
- Lo esencial de los pilares: crear itinerarios, buscar y unirse a viajes, chat de grupo y división de gastos básica.

**Plus** suma comodidad, no ventajas para «saltarse» filtros de confianza. Ideas *[S, a validar con `producto`]*: mapas y rutas sin conexión, exportar itinerario a PDF, más viajes y grupos activos, filtros avanzados de coincidencia (estilo, ritmo, idioma), gastos multimoneda y reportes, plantillas de rutas premium, sin anuncios de afiliados. **Nunca en Plus:** ver quién eres sin tu permiso, contactar a alguien que no lo aceptó o aparecer primero por pagar en búsquedas de compañeros.

---

## 3. Precio orientativo de Plus

### Referencias públicas (consultadas nov. 2026)

| App | Precio público | Fuente |
| --- | --- | --- |
| Polarsteps Plus | €8,99/mes o €29,99/año (varía por país) | [Polarsteps](https://news.polarsteps.com/news/polarsteps-launches-polarsteps-plus-a-new-subscription-for-its-most-dedicated-travelers) |
| Wanderlog Pro | ~USD 39,99/año (otras tiendas: 30,99–49,99) | [App Store](https://apps.apple.com/app/id1476732439), [Endless Travel Plans](https://www.endlesstravelplans.com/guides/planning-tools/wanderlog-review) |
| TripIt Pro | USD 49/año | [TripIt](https://www.tripit.com/uhp/pricing) |
| Splitwise Pro | ~USD 4,99/mes o 39,99/año en EE. UU.; menos en otros mercados | [Getfinny](https://getfinny.app/blog/splitwise-pricing-2026), [App Store](https://apps.apple.com/za/app/splitwise/id458023433) |
| Couchsurfing | Membresía obligatoria; cifras públicas antiguas y contradictorias (≈USD 14–15/año según blogs) | [Couchsurfing Support](https://support.couchsurfing.org/hc/en-us/articles/50048058561307-What-Membership-Plans-Are-Available), [Indie Voyager](https://www.indievoyager.com/2020/05/couchsurfing-is-not-longer-free-and-heres-why.html) |

Lección de Couchsurfing: cobrar por entrar a la comunidad generó rechazo. Por eso nuestro núcleo social y de seguridad queda gratis.

### Supuesto de precio *[S]*

| Plan | Rango a probar | Lógica |
| --- | --- | --- |
| Plus mensual | USD 2,99–4,99 | Por debajo de las apps anglosajonas, por poder adquisitivo de LatAm. |
| Plus anual | USD 19,99–34,99 | Descuento fuerte frente al mensual, como Polarsteps. |
| **Pase de viaje** (30 días, pago único) | USD 3,99–6,99 | El viajero de paso no quiere suscripción; probar si convierte mejor. |
| Precio local Colombia | Usar precios regionales de las tiendas en COP | Ajustar tras la prueba; no convertir 1:1 del dólar. |

**Cómo validarlo:** encuesta tipo Van Westendorp en la lista de espera (n ≥ 200 respuestas), luego prueba A/B de precios en tienda durante el lanzamiento. Recordar que Apple y Google se quedan con una comisión (15 % en sus programas para desarrolladores pequeños, a confirmar en sus condiciones vigentes).

---

## 4. Unit economics (plantilla)

Ninguna cifra de esta tabla es un hecho: son supuestos para arrancar el modelo y reemplazarlos con datos reales en cuanto existan.

| Métrica | Fórmula | Supuesto inicial *[S]* | Cómo medirla |
| --- | --- | --- | --- |
| **CAC** (costo de adquisición) | Gasto de marketing ÷ usuarios nuevos activados | Orgánico/hostales: USD 0,3–1,5; pauta: USD 1,5–5 por instalación activada | Atribución por canal (enlaces UTM, códigos de hostal y embajador, SKAdNetwork/Play Install Referrer). |
| **Activación** | % que crea o se une a un viaje en 7 días | 25–45 % | Evento «viaje con ≥1 día planeado» o «unido a grupo». |
| **Conversión a pago** | Pagadores ÷ usuarios activos mensuales | 1,5–5 % | Eventos de compra de la tienda y del backend. |
| **ARPU pagador** (mensual) | Ingreso Plus neto de comisión de tienda ÷ pagadores | USD 1,7–3,5 | Reportes de App Store Connect / Play Console. |
| **ARPU total** | (Plus + afiliación + comisiones + B2B) ÷ usuarios activos | USD 0,05–0,30 | Panel de ingresos por fuente. |
| **Retención** | % activos al día 30 / 90 · % pagadores que renuevan | D30: 15–30 % · renovación mensual: 60–80 % | Cohortes semanales en la analítica de producto. |
| **LTV** | ARPU total × margen bruto × vida media (1 ÷ churn mensual) | Calcular por cohorte; no antes de 3 cohortes | Hoja de cohortes. |
| **Relación LTV:CAC** | LTV ÷ CAC | Meta de referencia: ≥ 3 antes de escalar pauta | Revisión mensual. |
| **Payback** | CAC ÷ (ARPU × margen) | Meta: < 12 meses | Revisión mensual. |

Ojo con lo propio del viaje: el uso es **estacional y por episodios** (alguien viaja 1–3 veces al año). Medir también «viajeros que vuelven en su siguiente viaje» y el efecto de red: cuántos usuarios nuevos trae cada viaje grupal (coeficiente viral = invitaciones aceptadas ÷ usuario).

---

## 5. Go-to-market

### Estrategia de densidad
Una app para coincidir no sirve vacía. Empezamos donde haya muchos viajeros en las mismas fechas:
- **Ruta piloto propuesta *[a validar con el investigador]*:** Bogotá → Medellín → Eje Cafetero (Salento/Filandia) → Cartagena (y Santa Marta/Tayrona como extensión natural). Es una ruta mochilera muy recorrida y concentra hostales.
- Criterio para abrir la siguiente ciudad: que la actual tenga actividad sostenida (meta a fijar, p. ej. un mínimo de viajes abiertos por semana con respuestas en menos de 24 h).

### Alianzas
- **Hostales fundadores (15–30 en la ruta piloto):** QR en recepción y habitaciones, eventos del hostal publicados en la app («plan de esta noche»), gratis durante el primer año a cambio de difusión y retroalimentación. Insignia «Hostal aliado».
- **Comunidades de viajeros:** grupos de mochileros y nómadas en Facebook/WhatsApp/Reddit, colectivos de caminantes y de viajeras solas. Aportar valor (rutas, guías de seguridad), no hacer spam.
- **Operadores locales pequeños:** primeros aliados de experiencias para la etapa 2.

### Embajadores
- 10–20 «Faroleros» (nombre propuesto, guiño a la marca Lumen): viajeros reales y personal de hostales que publican rutas, reciben a nuevos usuarios y reportan problemas.
- Recompensa: Plus gratis, merch, acceso anticipado y, más adelante, comisión por aliados que traigan. Código de conducta y verificación obligatoria.

### Contenido
- **TikTok/Instagram Reels:** rutas reales en formato «3 días en Salento con 120 USD», «cómo conocí a mi grupo para Tayrona», «checklist de seguridad para encontrarte con alguien que conociste en la app». Grabado con viajeros, no actores.
- Cada itinerario público se puede compartir como tarjeta visual: el contenido se crea solo.
- Bilingüe (español primero, inglés para el viajero internacional).
- La seguridad es contenido, no letra pequeña: refuerza la confianza y diferencia la app.

### Secuencia
1. **Lista de espera** (landing en lumenestudio.tech o dominio propio): correo + ruta y fechas de su próximo viaje. Referidos suben puestos en la fila.
2. **Beta cerrada** (6–8 semanas): 200–500 personas *[S]* de la lista, hostales fundadores y embajadores, solo en la ruta piloto. Entrevistas semanales.
3. **Beta abierta** en Colombia: tiendas abiertas, sin pauta, ajustando onboarding y precio.
4. **Lanzamiento:** coincidir con temporada alta (diciembre–enero o Semana Santa), evento en hostales aliados de la ruta, campaña de creadores y nota de prensa en medios de viaje y tecnología de Colombia.

---

## 6. Primeros 90 días post-lanzamiento

Las metas son **valores a fijar** con los datos de la beta; aquí van la métrica y un rango de partida *[S]*.

| Bloque | Foco | Métricas y metas a fijar |
| --- | --- | --- |
| **Días 1–30 · Activar** | Onboarding, primer viaje, primeras coincidencias en la ruta piloto | Descargas: [X] (rango de partida 2.000–8.000) · Activación ≥ [30 %] · Viajes con ≥2 personas: [X]/semana · Tiempo de primera respuesta a «busco compañeros» < 24 h · Incidentes graves: 0, con protocolo probado |
| **Días 31–60 · Retener y medir** | Cohortes, reseñas en tienda, hostales activos | Retención D30 ≥ [15–25 %] · Calificación en tiendas ≥ [4,5] · Hostales aliados activos: [20–30] · % de usuarios verificados ≥ [50 %] · Primera lectura de conversión a Plus |
| **Días 61–90 · Monetizar y decidir** | Test de precios, afiliación, siguiente ciudad | Conversión a pago [1,5–4 %] · CAC por canal medido · Coeficiente viral ≥ [0,3] · Decisión documentada: ¿abrir siguiente ciudad/ruta? ¿escalar pauta? (solo si LTV:CAC proyectado ≥ 3) |

Ritual: tablero semanal de métricas, revisión quincenal con `producto` y `confianza`, y 5 entrevistas a usuarios por semana.

---

## 7. Mensajes clave y eslogan

**Eslogan propuesto**
- ES: **«Tu ruta, tu gente.»**
- EN: **«Your route, your people.»**
- Alternativas: «Planea, coincide, viajen juntos.» / «Plan it. Match it. Travel together.» · «Nadie viaja solo si no quiere.» / «Solo by choice, never alone.»

**Mensajes por pilar**

| Pilar | Español | English |
| --- | --- | --- |
| Planea | Arma tu viaje día a día sobre el mapa, con tiempos y presupuesto claros. | Plan your trip day by day on the map, with clear times and budget. |
| Coincide | Encuentra viajeros que van a donde tú vas, cuando tú vas. | Meet travelers heading where you're going, when you're going. |
| Viajen juntos | Un solo lugar para el plan, el chat, las votaciones y las cuentas. | One place for the plan, the chat, the votes and the bills. |
| Confianza | Perfiles verificados, reseñas reales y un botón de seguridad siempre gratis. | Verified profiles, real reviews and a safety button that's always free. |

**Mensaje de lanzamiento corto**
- ES: «Ya llegó Lumen Travels. Planea tu ruta por Colombia, encuentra con quién recorrerla y viajen juntos con confianza. Tu ruta, tu gente. Descárgala gratis.»
- EN: «Lumen Travels is here. Plan your route through Colombia, find people to share it with and travel together safely. Your route, your people. Free to download.»

Siempre con la firma «Diseñado por Lumen Studio».

---

## 8. Presupuesto de marketing por etapa *[S]*

Rangos para planear, no compromisos. Se ajustan con el CAC real; la pauta solo crece si LTV:CAC lo justifica.

| Etapa | Duración | Rango (USD) | En qué se va | Supuestos |
| --- | --- | --- | --- | --- |
| **0 · Prelanzamiento** (lista de espera + beta cerrada) | 2–3 meses | 1.500–5.000 | Landing, kit para hostales (QR, afiches), contenido inicial, merch embajadores, incentivos de entrevistas | Diseño y contenido hechos por Lumen Studio; sin pauta. |
| **1 · Lanzamiento** | Mes 1–3 | 5.000–15.000 | Evento en hostales de la ruta, creadores de viaje (micro, 10k–100k seguidores), prensa, pauta de prueba en Meta/TikTok/Apple Search Ads | ≤ 40 % en pauta pagada; el resto en alianzas y contenido. |
| **2 · Densidad** | Mes 4–12 | 2.000–6.000/mes | Embajadores, contenido continuo, pauta solo en canales con CAC probado, apertura de la segunda ruta | Condicionado a retención D30 y LTV:CAC ≥ 3. |
| **3 · Escala** | Año 2 | A definir con datos | Nuevas ciudades/países, equipo B2B para hostales y operadores | Depende de ingresos y posible ronda de inversión. |

**Reserva fija (todas las etapas):** 10–15 % del presupuesto para comunicación de seguridad y atención de incidentes. La confianza no se recorta.

---

### Fuentes
- Polarsteps Plus: https://news.polarsteps.com/news/polarsteps-launches-polarsteps-plus-a-new-subscription-for-its-most-dedicated-travelers
- Wanderlog Pro: https://apps.apple.com/app/id1476732439 · https://www.endlesstravelplans.com/guides/planning-tools/wanderlog-review
- TripIt Pro: https://www.tripit.com/uhp/pricing
- Splitwise Pro: https://getfinny.app/blog/splitwise-pricing-2026 · https://apps.apple.com/za/app/splitwise/id458023433
- Couchsurfing: https://support.couchsurfing.org/hc/en-us/articles/50048058561307-What-Membership-Plans-Are-Available · https://www.indievoyager.com/2020/05/couchsurfing-is-not-longer-free-and-heres-why.html
- GetYourGuide (comisión a proveedores): https://getyourguide.supply/join/how-much-does-getyourguide-charge
- Afiliación Booking.com: https://track360.io/blog/booking-com-affiliate-partner-program-operator-teardown-2026
