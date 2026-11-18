# Plan maestro · Lumen Travels

*Resumen ejecutivo para el dueño. Nombre: Lumen Travels. Todas las metas y rangos son supuestos de trabajo, salvo las cifras de mercado, que llevan fuente en `01`.*

## La idea en una frase

Una app móvil (iOS y Android) para planear tu ruta y encontrar con quién recorrerla, con gente verificada y todo el viaje en un mismo lugar.

## Nombre

**Lumen Travels** (decidido por el dueño; se descartó «Farol»): hereda la marca del estudio y es claro en español e inglés. **Pendiente obligatorio:** verificar dominio, tiendas, redes y registro de marca en la SIC. Los embajadores «Faroleros» (`06`) conservan su nombre: el farol es el símbolo de Lumen.

## Para quién y dónde empezar

- **Primer segmento:** viajero internacional que viaja solo (mochilero, nómada digital) en Colombia. Segundo segmento, en fase 2: jóvenes colombianos de 22–35 años en puentes festivos (`01`).
- **Dónde:** corredor piloto **Medellín – Bogotá – Caribe** (Cartagena, Santa Marta, Tayrona), en **español e inglés**. El Eje Cafetero queda como extensión. Razón: Bogotá, Medellín y Cartagena concentran la mayoría de los visitantes internacionales, y la compañía solo funciona con densidad.
- **Sobre Viatik:** es carpooling entre ciudades, no *social travel*. Lo tomamos como referencia por el espíritu de compartir viajes. Compartir carro entre ciudades queda como «Trayectos», decidido: fase posterior (`02`), sujeto a revisión legal (`05`).

## Los 4 pilares

1. **Planea:** itinerarios por días sobre el mapa.
2. **Coincide:** viajeros y viajes compatibles por destino, fechas, estilo y presupuesto.
3. **Viajen juntos:** grupo con chat y división de gastos (votaciones y colaboración, después).
4. **Confianza:** verificación, reseñas mutuas, encuentros públicos, botón SOS y moderación.

## Alcance del MVP (`02`)

Entra: crear viaje e itinerario con lugares y mapa; publicar «busco compañeros»; explorar con filtros; pedir unirse y aceptar; indicador de compatibilidad; chat de grupo; gastos básicos; grupos solo de mujeres; verificación; reseñas ciegas; reportar y bloquear; moderación; SOS básico.
No entra: plantillas de comunidad, recomendaciones por algoritmo, pagos y reservas, modo «estoy en la ciudad», modo sin conexión, votaciones, puntaje de reputación.
**North Star:** viajes compartidos completados por mes (con reseña).

## Decisiones clave

- **Stack (`04`):** React Native con Expo y TypeScript; Supabase (Postgres con PostGIS, Auth, Realtime) y Vercel, que Lumen ya domina; Mapbox para mapas y Google Places para lugares; verificación de identidad con Truora (Veriff o Persona para pasaportes). Sin cobros dentro de la app en el MVP.
- **Verificación (`05`):** nivel 0 visitante, nivel 1 correo y teléfono, **nivel 2 identidad (documento y selfie) al escribir, unirse o publicar**, nivel 3 señales de confianza. Explorar es libre; encontrarse exige verificación. Los menores de 18 no entran.
- **Monetización (`06`):** gratis al inicio. Después, suscripción «Plus» de comodidad, afiliación y, más adelante, experiencias en grupo y planes para hostales. **La seguridad nunca se cobra.** Precios de Plus: rango por probar, no definido.

## Roadmap por fases (`02`)

| Fase | Semanas | Qué pasa |
| --- | --- | --- |
| 1. Descubrimiento y validación | 4–6 | Entrevistas, prototipo, prueba «concierge» a mano |
| 2. MVP | 10–14 | Construcción (`04` la planea en unas 14 semanas, más revisión de tiendas) |
| 3. Beta cerrada | 8–12 | Por invitación en el corredor piloto, con embajadores |
| 4. Lanzamiento | 6–8 | Apertura pública en Colombia |
| 5. Crecimiento | Ciclos de 6 | Nuevas rutas y países, pagos, alianzas, Trayectos |

## Las 5 hipótesis a validar primero (`01`)

1. **H1:** los viajeros solos sí quieren unirse a la ruta de otros (20 entrevistas en hostales y coworkings).
2. **H2:** verificación y reseñas son la razón principal para dejar Facebook y WhatsApp.
3. **H3:** se logra densidad en un corredor (grupo manual para Santa Marta–Tayrona, 4–6 semanas).
4. **H4:** el extranjero paga (landing con precios y lista de espera con depósito simbólico).
5. **H5:** hostales y coworkings quieren ser aliados de distribución (10 reuniones en Medellín).

## Riesgos principales

- **Seguridad:** un incidente grave puede acabar con la marca; hay alertas oficiales sobre encuentros por apps en Colombia. Mitigación: verificación obligatoria, SOS, moderación con tiempos objetivo y simulacro antes de lanzar.
- **Huevo y gallina:** sin densidad no hay coincidencias. Mitigación: corredor pequeño, aliados y beta cerrada.
- **Hábito gratuito:** Facebook, WhatsApp y Google Maps cubren parte de la necesidad. Ventaja: integración y confianza local.
- **Monetización y uso estacional:** se viaja 1–3 veces al año; por eso se prueba un pase por viaje además de la suscripción.
- **Costos de terceros:** Places y verificación dominan el gasto al crecer. Mitigación: caché y verificar solo al momento de valor.
- **Legal:** datos personales (Ley 1581), biométricos, filtros de género y alcance como plataforma. Requiere abogado antes de lanzar.

## Presupuesto y equipo (rangos de los documentos)

- **Equipo (`04`):** Lumen Studio, es decir, el gerente (Claude) y sus 7 agentes especialistas (producto, diseño, desarrollo, confianza, marketing, investigación, dirección). **Siguen requiriendo personas o cuentas reales:** el dueño (aprueba y decide); asesoría legal; moderadores humanos para la beta y el lanzamiento (`05`); cuenta de desarrollador de Apple (USD 99/año) y de Google Play (USD 25, pago único); pruebas con viajeros reales; un celular real para probar.
- **Infraestructura mensual (`04`, estimación, no cotización):** decenas a pocos cientos de USD en MVP o beta; cientos de USD con 10.000 usuarios; varios miles con 100.000. Falta cotizar la verificación de identidad.
- **Marketing (`06`, supuesto):** prelanzamiento USD 1.500–5.000; lanzamiento (3 meses) USD 5.000–15.000; densidad USD 2.000–6.000 al mes; con reserva de 10–15 % para comunicación de seguridad.
- **No hay costo de nómina de desarrollo:** lo hace Lumen Studio con agentes. Quedan por presupuestar la asesoría legal, los moderadores humanos, las cuentas de tiendas y las pruebas con viajeros; sin cifra en los documentos, hay que cotizarlos por separado.

## Próximos pasos

1. Lanzar la verificación de dominio, tiendas y marca de «Lumen Travels» (sin gasto de identidad visual hasta tenerla).
2. Ejecutar H1 y H3 en paralelo durante un mes, con costo casi cero (fase 1).
3. Dejar «Trayectos» en el roadmap como fase posterior y pedir al abogado la revisión del transporte compartido.
4. Pedir cotizaciones de verificación (Truora, Veriff) y contratar asesoría legal en datos y términos.
5. Construir el prototipo navegable del flujo completo con `03` y probarlo con 8–10 viajeros.
6. Fijar las fechas de la fase 2 solo tras los resultados de la fase 1, y reservar moderadores humanos, asesoría legal y las cuentas de tiendas.

## Índice

1. [00 · Visión y marca](00-vision-y-marca.md)
2. [01 · Mercado y usuarios](01-mercado-y-usuarios.md)
3. [02 · Producto, MVP y roadmap](02-producto-mvp-roadmap.md)
4. [03 · UX/UI y sistema de diseño](03-ux-ui-sistema-de-diseno.md)
5. [04 · Arquitectura técnica](04-arquitectura-tecnica.md)
6. [05 · Confianza y seguridad](05-confianza-y-seguridad.md)
7. [06 · Negocio y lanzamiento](06-negocio-y-lanzamiento.md)

*Diseñado por Lumen Studio.*
