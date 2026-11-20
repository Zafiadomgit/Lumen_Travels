# 03 · UX/UI y sistema de diseño

**Responsable:** disenador · **Proyecto:** Lumen Travels · **Estado:** v2, alineada con la marca aprobada en la landing (20 nov 2026) · **Alcance:** app móvil iOS y Android (mobile first). Modo claro principal; modo oscuro secundario y opcional.

La app hereda de Lumen la calidez de la luz del farol, ahora en su versión de día: papel crema, tinta y un dorado que solo aparece como luz. Tiene identidad propia: menos «estudio», más «compañero de ruta», y una firma visual que no es de Lumen sino de esta app, el **arte gouache de cada destino con el texto apoyado en su cielo crema**. Todo lo que sigue se apoya en los cuatro pilares del brief: **Planea, Coincide, Viajen juntos, Confianza**.

**Fuentes de la v2:** la landing publicada (`site/landing/`, https://lumentravels.vercel.app/): tokens de `styles.css`, el símbolo `#lumen-mark`, el sprite Lucide `assets/icons/sprite.svg` y el arte de `assets/art/`; el estilo de ilustración de `docs/arte/estilo.md`; el modo claro de lumenestudio.tech como referencia de marca. **Prototipo navegable** que aplica este documento: https://lumentravels.vercel.app/prototipo (código en `site/landing/prototipo/`, ver §8).

---

## 1. Principios de experiencia

1. **La confianza se ve antes de que se pida.** Verificación, reseñas e historial aparecen en cada tarjeta y en cada perfil, no escondidos en un menú. Nadie debería tener que preguntar «¿esta persona es real?».
2. **El mapa es el lienzo.** Planear, descubrir y viajar ocurren sobre el mapa; las listas son la vista alternativa, no al revés.
3. **Del sueño al plan en tres toques.** Cada flujo tiene un camino corto (plantilla, sugerencia, «unirme») y un camino profundo para quien quiere detallar.
4. **Juntos, pero cada quien a su ritmo.** Votar, proponer y dividir gastos sin fricción social: nada de presión por responder, decisiones visibles y reversibles.
5. **Calidez sin ruido.** Fondo crema, acciones en tinta y el dorado solo como luz (anillos, rutas, el «+» de Crear, lo que está pasando ahora). Microcopy cercano. Si todo brilla, nada guía.

---

## 2. Arquitectura de información

### 2.1 Navegación principal (tab bar de 5)

| Pestaña | Icono | Pilar | Contenido |
| --- | --- | --- | --- |
| **Explorar** | `compass` | Coincide | Feed de viajes abiertos y viajeros, alternable con mapa; filtros; plantillas de rutas |
| **Mis viajes** | `map` | Planea | Itinerarios propios y de grupo (próximos, borradores, pasados) |
| **＋ Crear** (central: píldora de tinta con «+» dorado) | `plus` | Planea / Coincide | Hoja inferior: «Nuevo itinerario», «Busco compañeros», «Usar plantilla» |
| **Mensajes** | `message-circle` | Viajen juntos | Chats de grupo, solicitudes para unirse, chats 1:1 (solo tras aceptar) |
| **Perfil** | `user` | Confianza | Perfil propio, verificación, reseñas, contactos de confianza, ajustes |

Cuando hay un viaje en curso, aparece **sobre** la tab bar una barra persistente de tinta: llama de Lumen, «En viaje» y «Cartagena, día 2», y a la derecha el botón de seguridad rojo (ver 3.6). Se mantiene también en el grupo del viaje y en «Hoy». La seguridad nunca queda a más de un toque.

### 2.2 Mapa de pantallas

```
Arranque ─ Bienvenida ─ Registro/Ingreso ─ Onboarding (estilo, idiomas, intereses) ─ Verificación (teléfono → ID + selfie)
│
├─ EXPLORAR ── Feed ⇄ Mapa ── Filtros (hoja)
│               ├─ Detalle de viaje ── Solicitud para unirse ── Estado de solicitud
│               ├─ Perfil de viajero ── Reseñas · Reportar/Bloquear
│               └─ Plantilla de ruta ── «Usar esta ruta» → Editor
├─ MIS VIAJES ── Lista ── Viaje (pestañas internas: Itinerario · Mapa · Grupo · Gastos)
│                         ├─ Editor de día ── Buscar lugar ── Detalle de lugar
│                         ├─ Votación (crear/votar) · Miembros y roles
│                         └─ Gastos ── Nuevo gasto ── Saldos ── Liquidar
├─ CREAR (hoja) ── Nuevo itinerario (destino, fechas, presupuesto) ── Editor sobre mapa ── Publicar (privado / abierto)
├─ MENSAJES ── Bandeja ── Chat de grupo · Solicitudes recibidas
├─ PERFIL ── Editar · Verificación · Reseñas · Contactos de confianza · Privacidad · Idioma · Ayuda
└─ MODO EN VIAJE ── Hoy (agenda + mapa) ── Compartir ubicación ── Check-in de encuentro ── Pantalla de seguridad (SOS)
```

---

## 3. Flujos clave

### 3.1 Onboarding y verificación
1. **Bienvenida** (3 pasos con arte gouache: «planea tu ruta, día por día», «encuentra gente que va para el mismo lado», «viaja con personas que son quienes dicen ser») → «Empezar a explorar». Selector ES/EN y «Saltar» siempre visibles.
2. **Registro**: Apple / Google / correo. Idioma detectado del sistema (es/en en el MVP; pt más adelante), editable.
3. **Tu estilo**: nombre, foto, idiomas que hablas, estilo de viaje (mochilero, cómodo, aventura, cultural, fiesta, naturaleza) y rango de presupuesto. Todo con chips; máximo 60 s.
4. **Verificación en dos niveles** (explicada con por qué y qué se guarda):
   - Nivel 1 (registro): correo y teléfono confirmados por código, 18+ y normas. Permite planear en privado y explorar; no permite escribir a desconocidos ni unirse.
   - Nivel 2, obligatorio para escribir a alguien, unirse o publicar viajes abiertos (se pide justo en ese momento): documento + selfie con prueba de vida. Estado «En revisión» no bloquea planear en privado. Niveles definidos en `05` (0 visitante, 1 básico, 2 identidad verificada, 3 señales de confianza).
   - Flujo del nivel 2 en 4 pantallas (W1 y W9): **por qué y qué se guarda** («Lumen guarda el resultado, nunca la imagen del documento», según `04`) → **documento** (tipo: cédula, pasaporte o cédula de extranjería; marco con esquinas) → **selfie** (óvalo y tres indicaciones de prueba de vida, con progreso) → **revisión** → «Identidad verificada, ya eres nivel 2» y vuelta exacta a lo que la persona intentaba hacer (unirse, publicar o su perfil).
5. **Contactos de confianza** (opcional, sugerido): 1–3 personas que reciben alertas de seguridad.
6. **Listo** → Explorar con sugerencias según destino/fechas si las dio.

### 3.2 Crear itinerario sobre el mapa
1. ＋ Crear → «Nuevo itinerario»: destino(s), fechas, presupuesto aproximado, privado/abierto.
2. **Editor**: mapa a pantalla completa + hoja inferior con días (Día 1, Día 2…). Buscar lugar o tocar el mapa → «Agregar al Día n».
3. Cada parada: hora, duración, costo estimado, nota. Arrastrar para reordenar; la ruta y los tiempos de traslado se recalculan.
4. Barra superior con total del día (tiempo y costo) y alertas suaves («Este día tiene 9 h de actividades»).
5. «Publicar»: privado (solo invitados) o **abierto** (aparece en Explorar con cupos, estilo y requisitos). Requiere nivel 2 para abierto.

### 3.3 Descubrir viajes y viajeros, y pedir unirse
1. **Explorar**: feed de tarjetas de viaje y de viajeros en el mismo destino y fechas; interruptor Lista ⇄ Mapa.
2. **Filtros** (hoja): destino, fechas (flexibles ±3 días), presupuesto, estilo, tamaño de grupo, idioma, «solo verificados» (activo por defecto), grupos solo de mujeres cuando el organizador lo define (únicos filtros de identidad permitidos, ver `05` §4.6).
3. **Detalle de viaje**: itinerario resumido, organizador con señales de confianza, miembros, chip de compatibilidad con su porqué («Mismas fechas · Presupuesto similar · Hablan español»).
4. **Pedir unirse**: mensaje corto obligatorio (plantillas sugeridas) → estado «Enviada». El organizador acepta/rechaza; al aceptar, entras al grupo y al chat. Rechazos con copy neutro, sin motivo expuesto.

### 3.4 Perfil de viajero con señales de confianza
Orden fijo: foto y nombre → insignias (ID verificada, teléfono, redes opcionales) → «Miembro desde» y viajes completados → reseñas mutuas (solo de viajes compartidos reales) → estilo, idiomas, intereses → viajes publicados. Acciones: «Invitar a mi viaje», «Mensaje» (si hay viaje en común o solicitud aceptada), menú ⋯ con **Reportar** y **Bloquear** siempre visibles.

### 3.5 Grupo del viaje

> Nota de alcance: las votaciones (aquí y en el wireframe W6) son diseño anticipado para la fase de Lanzamiento; en el MVP el grupo tiene itinerario, chat y gastos (ver `02`).
Pantalla de viaje con pestañas internas:
- **Itinerario** colaborativo: cualquiera propone paradas (aparecen como «Propuesta» punteada); el organizador o la mayoría las confirma. Historial de cambios.
- **Grupo / chat**: chat con mensajes fijados (punto de encuentro, alojamiento), encuestas rápidas desde el campo de texto.
- **Votos**: tarjeta de votación con opciones, fecha límite y resultado visible en vivo; empate → decide el organizador.
- **Gastos**: «Nuevo gasto» (monto, moneda, quién pagó, entre quiénes), saldos netos simplificados («Ana le debe $45.000 a Luis»), conversión de moneda y marca «Liquidado».

### 3.6 Modo «en viaje» y botón de seguridad
1. Se activa solo el primer día del viaje (o manualmente). Pestaña **Hoy**: agenda del día + mapa con la siguiente parada.
2. **Barra en viaje** persistente con el **botón de seguridad** (escudo).
3. **Check-in de encuentro**: antes de ver a alguien por primera vez, la app sugiere lugar público y hora; al llegar, «Llegué bien» o recordatorio a los 30 min.
4. **Compartir ubicación** en tiempo real con contactos de confianza (temporizador 1 h / 4 h / hasta terminar el día).
5. **Botón de seguridad** → pantalla de seguridad: mantener presionado 2 s «Necesito ayuda ya» (llama al número de emergencias local, 123 en Colombia, y avisa a los contactos de confianza con ubicación y datos del viaje; también alerta al equipo de seguridad de Lumen, ver `05` §4.4), «Me siento incómodo/a» (salida discreta: llamada simulada, consejos y reporte rápido), «Compartir mi ubicación», «Reportar». Confirmación háptica y cuenta regresiva de 5 s cancelable para evitar falsas alarmas.

---

## 4. Wireframes (360 × 780 pt de referencia)

> v2: la estructura de W1 a W8 no cambia. Cambia la piel (§5 y §6) y dos detalles marcados con «v2»: la barra «en viaje» de W8 y la portada con arte de W2. Se suman W9 (verificación) y W10 (bienvenida y alerta). Los emojis de los wireframes son marcadores de posición: en la app son iconos Lucide (§5.6).

**W1 · Verificación**
```
┌──────────────────────────────┐
│ ←                    Paso 3/4│
│                              │
│   Verifica tu identidad      │
│   Así sabemos que eres tú,   │
│   y los demás también.       │
│                              │
│  ┌────────────────────────┐  │
│  │ ✓ Teléfono   verificado│  │
│  ├────────────────────────┤  │
│  │ ○ Documento + selfie   │  │
│  │   2 min · cifrado      │  │
│  └────────────────────────┘  │
│  🔒 Tu documento no se       │
│     muestra a nadie.         │
│                              │
│ [ Verificar ahora        ]   │
│   Lo hago después            │
└──────────────────────────────┘
```

**W2 · Explorar (feed)**
```
┌──────────────────────────────┐
│ Explorar          [Lista|Mapa]│
│ ┌──────────────────────────┐ │
│ │🔍 ¿A dónde vas?          │ │
│ └──────────────────────────┘ │
│ (Fechas)(Presupuesto)(Estilo)⚙│
│ ┌──────────────────────────┐ │
│ │ [arte gouache · Cartagena]│ │
│ │ Cartagena + Islas · 5d   │ │
│ │ 12–17 dic · 2/4 cupos    │ │
│ │ (◉ 86% compatible)       │ │
│ │ ◯ Laura ✓ ★4.9 · 7 viajes│ │
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │ ◯ Tomás ✓ · también en   │ │
│ │ Medellín 10–14 dic       │ │
│ │ (Cultural)(Mochilero) [Ver]│
│ └──────────────────────────┘ │
├──────────────────────────────┤
│ 🧭    🗺    (＋)    💬    ◯  │
└──────────────────────────────┘
```

**W3 · Explorar (mapa)**
```
┌──────────────────────────────┐
│ ← Medellín · 10–14 dic   ⚙  │
│ ┌──────────────────────────┐ │
│ │      ◉3        ◉         │ │
│ │  ◉       ●tú             │ │
│ │        ◉5     ◉          │ │
│ │   ◉              ◉2      │ │
│ └──────────────────────────┘ │
│ ━━━━━━━━  (arrastrar)        │
│ 14 viajes · 23 viajeros      │
│ ┌────────┐┌────────┐┌───── │
│ │Guatapé ││Comuna13││Café  │
│ │1 día   ││½ día   ││2 día │
│ └────────┘└────────┘└───── │
├──────────────────────────────┤
│ 🧭    🗺    (＋)    💬    ◯  │
└──────────────────────────────┘
```

**W4 · Editor de itinerario**
```
┌──────────────────────────────┐
│ ← Santa Marta       Publicar │
│ ┌──────────────────────────┐ │
│ │   1●───2●                │ │
│ │          ╲               │ │
│ │           3●   + tocar   │ │
│ │                para añadir│
│ └──────────────────────────┘ │
│ (Día 1)[Día 2](Día 3)(+)     │
│ 6 h 30 · $180.000 · ⚠ largo  │
│ ≡ 08:00 1 Parque Tayrona 3h  │
│ ≡ 12:30 2 Almuerzo Taganga   │
│      🚌 25 min               │
│ ≡ 15:00 3 Finca de café Minca│
│ ┄ Propuesta de Ana: Mirador ┄│
│   [Aceptar] [Descartar]      │
│ [ + Agregar lugar         ]  │
└──────────────────────────────┘
```

**W5 · Perfil de viajero**
```
┌──────────────────────────────┐
│ ←                         ⋯  │
│          ( foto )            │
│      Laura Gómez, 29         │
│  [✓ ID verificada][☎ Tel.]   │
│  Miembro desde 2026 · 7 viajes│
│  ★ 4.9  (18 reseñas mutuas)  │
│ ──────────────────────────── │
│ Habla: Español · Inglés      │
│ (Naturaleza)(Cultural)(Cómodo)│
│ ──────────────────────────── │
│ «Organizada y muy buena      │
│ compañía en Tayrona.» — Juan │
│ Ver todas las reseñas →      │
│ ──────────────────────────── │
│ Viajes abiertos (2)          │
│ [ Invitar a mi viaje      ]  │
│   Reportar · Bloquear        │
└──────────────────────────────┘
```

**W6 · Grupo del viaje (chat + voto)**
```
┌──────────────────────────────┐
│ ← Cartagena + Islas  ◯◯◯◯ 4  │
│ Itinerario  Mapa [Grupo] Gastos│
│ 📌 Encuentro: Torre del Reloj│
│ ┌──────────────────────────┐ │
│ │ VOTO · cierra en 6 h     │ │
│ │ ¿Islas del Rosario o Barú?│ │
│ │ Rosario ███████░ 3       │ │
│ │ Barú    ██░░░░░░ 1       │ │
│ └──────────────────────────┘ │
│ Luis: yo llevo el bloqueador │
│              Tú: ¡perfecto! ▸│
│ ┌──────────────────────────┐ │
│ │ ＋ │ Escribe…        📊 ➤│ │
│ └──────────────────────────┘ │
└──────────────────────────────┘
```

**W7 · Gastos**
```
┌──────────────────────────────┐
│ ← Cartagena + Islas          │
│ Itinerario Mapa Grupo [Gastos]│
│ Total del grupo  $1.240.000  │
│ Tu parte          $310.000   │
│ ──────────────────────────── │
│ Saldos                       │
│ Tú → Luis        $45.000 [Pagar]│
│ Ana → Tú         $20.000     │
│ ──────────────────────────── │
│ Hoy                          │
│ Lancha Rosario  Luis $480.000│
│ Cena            Tú   $160.000│
│ [ + Nuevo gasto          ]   │
└──────────────────────────────┘
```

**W8 · Modo en viaje y seguridad**
```
┌──────────────────────────────┐      ┌──────────────────────────────┐
│ Hoy · Día 2 · Cartagena      │      │ ✕            Seguridad       │
│ ┌──────────────────────────┐ │      │                              │
│ │  mapa: próxima parada    │ │      │      ┌──────────────┐        │
│ └──────────────────────────┘ │      │      │   AYUDA YA   │        │
│ ▸ 10:00 Castillo San Felipe  │      │      │ mantén 2 seg │        │
│   en 18 min a pie            │      │      └──────────────┘        │
│ Encuentro con Tomás 16:00    │      │ Avisa a tus 2 contactos con  │
│ Café del Mar (lugar público) │      │ tu ubicación y llama al 123. │
│ [ Llegué bien ]              │      │ [📍 Compartir ubicación    ] │
├──────────────────────────────┤      │ [📞 Llamada para salir     ] │
│(llama) En viaje      [SOS] │ v2   │ [⚑ Reportar a alguien      ] │
├──────────────────────────────┤      │                              │
│ 🧭    🗺    (＋)    💬    ◯  │      │ Ubicación compartida: 1 h ▾  │
└──────────────────────────────┘      └──────────────────────────────┘
```

**W9 · Verificación nivel 2: documento y selfie (v2)**
```
┌──────────────────────────────┐      ┌──────────────────────────────┐
│ ‹                         ✕  │      │ ‹                         ✕  │
│ ━━━━━━━━  ────────  ──────── │      │ ━━━━━━━━  ━━━━━━━━  ──────── │
│ Foto de tu documento         │      │ Ahora, una selfie            │
│ Tipo de documento            │      │        ╭────────╮            │
│ (✓Cédula)(Pasaporte)(C. ext.)│      │       ╱  ╭────╮  ╲           │
│ ┌──────────────────────────┐ │      │      │   │ ◯  │   │ ← anillo │
│ │ ┌                      ┐ │ │      │       ╲  ╰────╯  ╱  de prog. │
│ │    [VR] ═══════          │ │      │        ╰────────╯            │
│ │         ═════            │ │      │  «Gira despacio a la         │
│ │ └                      ┘ │ │      │   izquierda»                 │
│ └──────────────────────────┘ │      │ ⓘ Simulación (solo prototipo)│
│ ⓘ Buena luz, 4 esquinas      │      │                              │
│ [ 📷 Tomar foto           ]  │      │ [ Empezar selfie          ]  │
└──────────────────────────────┘      └──────────────────────────────┘
```

**W10 · Bienvenida con arte y alerta de seguridad (v2)**
```
┌──────────────────────────────┐      ┌──────────────────────────────┐
│ (llama) lumen travels [ES|EN]│      │            Seguridad         │
│                       Saltar │      │ ⓘ Simulación: no llama al 123│
│ Paso 1 de 3   ━━ ── ──       │      │                              │
│ planea tu ruta,              │      │           ╭─────╮            │
│ día por día                  │      │          │  5  │ ← anillo    │
│ Arma tu itinerario por…      │      │           ╰─────╯   que baja │
│  ░░ cielo crema del arte ░░  │      │       Enviando alerta        │
│ ▓▓▓▓ montañas, cafetales ▓▓▓ │      │ La alerta sale en 5 s. Si fue│
│ ▓▓▓▓▓ (gouache) ▓▓▓▓▓▓▓▓▓▓▓▓ │      │ sin querer, cancélala.       │
│ [ Siguiente               ]  │      │                              │
│  Prototipo · datos de ejemplo│      │ [ ✕ Cancelar alerta (64 pt) ]│
└──────────────────────────────┘      └──────────────────────────────┘
```

---

## 5. Sistema de diseño v2 · tokens

Contrastes calculados con la fórmula WCAG 2.2 (luminancia relativa). AA exige 4.5:1 en texto normal, 3:1 en texto grande (≥ 18 pt, o ≥ 14 pt en negrita) y 3:1 en bordes e iconos que hacen falta para entender un control. Todos los valores de esta sección son los que usa el prototipo (`site/landing/prototipo/proto.css`).

### 5.1 Color · modo claro (principal)

El claro de Lumen es el modo de la app. Mismos valores que la landing, para que tienda, web y app se sientan una sola marca.

| Token | Hex | Uso | Contraste |
| --- | --- | --- | --- |
| `bg` «crema» | `#f6f4ef` | Fondo de la app | — |
| `surface` | `#ffffff` | Tarjetas, hojas, barras, campos | — |
| `surface-2` | `#efebe3` | Notas, avisos suaves, fondo de iconos de fila | — |
| `surface-3` | `#e5dfd3` | Pista de anillos y barras de progreso, pestaña activa | — |
| `ink` «tinta» | `#141218` | Texto principal, botones primarios, barra «en viaje» | 16.92 bg · 18.59 surface · 15.64 surface-2 · 14.01 surface-3 |
| `ink-2` | `#635b4f` | Metadatos, ayudas, horas | 6.08 bg · 6.69 surface · 5.63 surface-2 · 5.04 surface-3 |
| `line` | `#e6e0d4` | Borde fino de tarjetas y divisores (decorativo) | decorativo |
| `line-strong` | `#8a8276` | Borde de campos, chips y botón secundario | 3.45 bg · 3.79 surface ✓ UI |
| `placeholder` | `#6f675b` | Texto de ejemplo en campos | 5.57 surface |
| `accent` «dorado» | `#e8a33a` | **Solo formas:** anillo de compatibilidad, «+» de Crear (sobre tinta: 8.62), punto «ahora», ruta del mapa, subrayado de enlaces | 1.96 bg: nunca texto |
| `gold-text` | `#9a6a10` | Texto dorado (rótulos cortos como «Día 2 de 6», «Fijado») y anillo de foco | 4.73 surface ✓ · 4.30 bg: solo ≥ 18 pt o negrita ≥ 14 pt sobre crema |
| `trust` | `#0f7468` | Insignia «Identidad verificada», confirmaciones de seguridad | 5.14 bg · 5.65 surface · 4.75 surface-2 · 4.86 sobre `trust-bg` |
| `trust-bg` | `#e3f1ee` | Fondo de la insignia y del distintivo de verificado | — |
| `success` | `#1a6e43` | Liquidado, hecho (antes `#1f7a4d`: fallaba en surface-2, 4.47) | 5.69 bg · 6.26 surface · 5.26 surface-2 |
| `warning` | `#9a5300` | Alertas suaves de texto | 5.29 bg · 5.82 surface |
| `danger` | `#b3261e` | Errores, monto que debes | 5.95 bg · 6.54 surface · 5.50 surface-2 |
| `info` | `#2361b0` | Información, enlaces secundarios | 5.61 bg · 6.16 surface |
| `safety` | `#c62f35` | Botón de seguridad (relleno), insignia de no leídos | blanco encima 5.44 |
| `safety-pressed` | `#a9252b` | Seguridad presionado | blanco encima 7.03 |
| `sim-bg` / `sim-ink` | `#fff0c7` / `#5c3f00` | Avisos de «simulación» y «prototipo» (mismo estilo que los pendientes de la landing) | 8.56 |

Reglas:
- **Una sola acción en tinta por pantalla.** El dorado no es un color de botón: es luz.
- La **seguridad usa rojo propio** y la **verificación usa turquesa** (`trust`): nunca dorado, para que no se lean como acción comercial.
- Los fondos tintados de avisos (`#fdf1df` con `#6e3c00`, 8.15; `#fbeceb` con `#8a1d22`, 8.03; `#fbe7c4` con `#5c3f00`, 8.00) se usan solo con su par de texto.

### 5.2 Color · modo oscuro (secundario, opcional)

Pasa a ser una opción en Perfil › Ajustes › Apariencia (y sigue al sistema si la persona lo pide). Ya no es la «noche del farol pixel art»: es **el mismo claro invertido con calma**, tinta cálida de fondo y crema de texto, con el mismo dorado y los mismos significados.

| Token | Hex | Contraste |
| --- | --- | --- |
| `bg` | `#18161b` | — |
| `surface` | `#221f25` | — |
| `surface-2` | `#2c2830` | — |
| `surface-3` | `#37323b` | — |
| `ink` (crema) | `#f6f4ef` | 16.34 bg · 14.80 surface · 13.15 surface-2 |
| `ink-2` | `#bcb3a6` | 8.67 bg · 7.85 surface · 6.98 surface-2 |
| `line` / `line-strong` | `#36313a` / `#857d72` | decorativo / 4.01 surface ✓ UI |
| `accent` | `#e8a33a` (igual) | 8.32 bg: en oscuro sí puede ser texto, pero se mantiene la regla de «luz» |
| `gold-text` | `#f0b44f` | 9.70 bg · 8.79 surface |
| `trust` / `trust-bg` | `#5cc6b6` / `#1d3532` | 7.91 surface · 6.35 sobre trust-bg |
| `success` / `warning` / `danger` / `info` | `#6fcf97` / `#f2a65a` / `#ff8a80` / `#8ab8f5` | 8.56 / 8.04 / 7.13 / 7.95 sobre surface |
| `safety` | `#c62f35` (igual) + aro `#ff8a80` de 3 pt | blanco encima 5.44; el aro da 7.87 contra el fondo (el rojo solo daría 3.30) |
| `sim-bg` / `sim-ink` | `#3a2f17` / `#f6dfa8` | 10.03 |
| Botón primario | fondo `#f6f4ef`, texto `#18161b` | 16.34 |

Qué no cambia en oscuro: el **arte** y los **mapas** conservan su papel claro (son «ventanas» de día), el texto sobre el cielo del arte sigue en tinta `#141218`, y los avatares conservan sus tonos con iniciales en tinta.

### 5.3 Tipografía

Las mismas dos familias de la landing, alojadas en la app (OFL, subconjunto latino con á é í ó ú ñ ü ¿ ¡ y € ; para pt se añade ã õ ç al empaquetar).

- **Plus Jakarta Sans** (700, a veces 600) para títulos, cifras grandes y números de paso: geométrica y compacta, con tracking negativo. En minúscula **solo** en los momentos de marca (wordmark, bienvenida, pantalla de carga), igual que el hero de la landing; dentro de la app, títulos en tipo oración.
- **Manrope** (400 / 500 / 600 / 700) para texto, controles y datos; cifras tabulares (`tnum`) en horas, montos y cuentas regresivas.

| Estilo | Fuente | Tamaño / interlínea (pt) | Peso | Tracking | Uso |
| --- | --- | --- | --- | --- | --- |
| `display` | Plus Jakarta Sans | 34 / 35 | 700 | −0.045 em | Bienvenida (minúscula) |
| `title-1` | Plus Jakarta Sans | 26 / 30 (28 / 32 sobre portada) | 700 | −0.03 em | Título de pantalla |
| `title-2` | Plus Jakarta Sans | 20 / 25 | 700 | −0.02 em | Secciones, hojas |
| `title-3` | Plus Jakarta Sans | 17 / 22 | 700 | −0.01 em | Subsecciones, títulos de tarjeta (18 / 22) |
| `stat` | Plus Jakarta Sans | 20–21 / 25 | 700 | −0.02 em | Cifras de perfil y gastos |
| `body` | Manrope | 16 / 24 | 400 | 0 | Texto corrido |
| `body-strong` | Manrope | 16 / 24 | 700 | 0 | Nombres, filas |
| `lead` | Manrope | 16–17 / 24–25 | 400 | 0 | Bajada bajo el título (`ink-2`) |
| `callout` | Manrope | 15 / 22 | 500–600 | 0 | Chips, filas secundarias |
| `footnote` | Manrope | 13 / 18 | 600 | 0 | Metadatos, avisos |
| `caption` | Manrope | 12 / 16 | 700 | 0 | Etiquetas de la tab bar (mínimo absoluto) |
| `button` | Manrope | 16 / 18 | 700 | 0 | Botones (15 en el pequeño) |

Todo escala con Dynamic Type / fontScale hasta 200 %; con texto grande, la tab bar oculta las etiquetas y las pasa al lector de pantalla.

### 5.4 Espaciado, radios y elevación

- **Espaciado (base 4):** `4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48`. Margen lateral 16 (14 en pantallas de 320 pt), separación entre tarjetas 20, padding de tarjeta 16–18, entre secciones 24.
- **Radios con jerarquía** (no uno solo para todo): `sm 10` campos · `md 14` filas, opciones, días · `lg 20` tarjetas y arte · `xl 28` hojas inferiores · `full` botones, chips, avatares, segmentados.
- **Elevación** (de la landing): las tarjetas son **blancas con borde fino y sombra suave**: `0 0 0 1px #e6e0d4, 0 18px 40px -24px rgba(40,30,10,.18)`. Las filas y opciones llevan solo el borde fino. Barras: blanco al 92 % con desenfoque 14 y filete superior `#e6e0d4`. Hoja inferior: `0 -12px 40px rgba(40,30,10,.16)`. Foco: anillo 3 pt `gold-text` a 2 pt del control; en campos, borde tinta + halo `rgba(232,163,58,.4)` de 4 pt.
- En oscuro, la profundidad es solo superficie más clara + borde `line`; sin sombras.

### 5.5 Logo, ícono de la app y pantalla de carga

- **Símbolo:** la llama de Lumen (`#lumen-mark`): círculo de tinta `#141218`, llama con degradado vertical `#e2742a → #f2a93b → #ffd27a` y corazón `#fff4dc`. Es el mismo símbolo de la landing y del modo claro de Lumen Studio: la app lo comparte a propósito («hecha por Lumen»); lo propio de la app es el wordmark y el arte.
- **Wordmark:** «lumen travels» en minúscula, Plus Jakarta Sans 700 con «travels» en 400 al 60 % de opacidad, tracking −0.03 em, símbolo a la izquierda a la altura de 1.5× la x. Área de respeto: media altura del símbolo alrededor. Tamaño mínimo: símbolo 20 pt.
- **Ícono de la app, master 1024 × 1024 px:** fondo crema `#f6f4ef` lleno (sin transparencia), el símbolo centrado ocupando el 62 % (≈ 636 px de diámetro), sin texto. Debajo del círculo, una sombra cálida muy suave (`rgba(226,116,42,.25)`, desenfoque 48 px, desplazada 24 px) para que la llama «alumbre». Variantes:
  - **iOS:** el master tal cual; el sistema aplica la máscara. Se exportan además las variantes iOS 18: oscura (fondo `#18161b`, círculo `#f6f4ef` para que no se pierda) y tintada (símbolo en escala de grises sobre transparente).
  - **Android adaptativo:** capa de fondo crema `#f6f4ef` de 108 × 108 dp; capa frontal con el símbolo dentro de la zona segura de 66 dp (diámetro 60 dp). Ícono monocromo (Android 13+) con el contorno del círculo y la llama recortada en una sola tinta. Play Store: 512 × 512 px desde el master.
  - Notificaciones Android: solo la llama en blanco, 24 dp.
- **Pantalla de carga:** fondo crema, símbolo de 96 pt centrado (en iOS, storyboard de inicio con símbolo y color; en Android 12+, Splash API con `windowSplashScreenBackground #f6f4ef` y el ícono animado limitado a 1 s). Al terminar de cargar, la llama hace un único «encendido» (brillo de 0 a 100 % en 450 ms) y el símbolo se desliza al wordmark de la bienvenida. Con «Reducir movimiento»: fundido de 150 ms, sin brillo. Abajo, a 24 pt del borde seguro: «Diseñado por Lumen Studio» en `footnote` `ink-2`. En oscuro: fondo `#18161b`, círculo crema.
- El farol pixel art y Champi (la seta) ya no son parte de la marca de la app: Champi queda como guiño pequeño en estados vacíos y en «Acerca de» (§7.3).

### 5.6 Iconografía

**Set:** Lucide (ISC), el mismo de la landing: trazo 1.75 en rejilla de 24, extremos y uniones redondeados, `fill: none`, color `currentColor`. Estado activo de la tab bar: trazo 2.25 sobre una píldora `surface-3`, no relleno. Iconos de 18–24 pt dentro de un área táctil de 44 × 44 pt. Nunca un icono solo como único indicador de estado: siempre con texto o etiqueta accesible.

| Uso | Lucide | Estado |
| --- | --- | --- |
| Explorar · Mis viajes · Crear · Mensajes · Perfil | `compass` · `map` · `plus` · `message-circle` · `user` | `map`, `plus`, `message-circle` en el sprite de la landing; `compass`, `user` añadidos |
| Volver · avanzar · desplegar | `chevron-left` · `chevron-right` · `chevron-down` | `chevron-down` en sprite; los otros añadidos |
| Buscar · filtros · lista | `search` · `sliders-horizontal` · `list` | añadidos |
| Fechas · cupos/grupo · presupuesto/gastos | `calendar` · `users` · `wallet` | en sprite |
| Compatibilidad / estilo | `sparkles` (y el anillo propio de §6) | en sprite |
| Identidad verificada | `shield-check` | en sprite |
| Seguridad / SOS | `shield-alert` | en sprite |
| Documento · selfie · cámara | `id-card` · `scan-face` · `camera` | `id-card` en sprite; los otros añadidos |
| Lugar · navegar | `map-pin` · `navigation` | `map-pin` en sprite; `navigation` añadido |
| Reportar · bloquear | `flag` · `ban` | `flag` en sprite; `ban` por añadir |
| Teléfono · llamada salida discreta | `phone` | añadido |
| Privacidad · requisito | `lock` | añadido |
| Tiempo · traslado | `clock` · `bus` | `clock` añadido; `bus` por añadir |
| Reseñas · valoración | `messages-square` · `star` | `messages-square` en sprite; `star` añadido (relleno dorado, contorno `gold-text`) |
| Enviar · compartir · más | `send` · `share-2` · `ellipsis` | añadidos |
| Info · reiniciar · quitar · menos | `info` · `rotate-ccw` · `trash-2` · `minus` | añadidos |
| Apariencia | `sun` · `moon` | añadidos |
| Idioma | `globe` | en sprite |
| Ciudades del corredor | `cable-car` (Medellín) · `church` (Bogotá) · `castle` (Cartagena) · `haze` (Santa Marta) · `tree-palm` (Tayrona) | en sprite |
| Cerrar · hecho | `x` · `check` | en sprite |

Los añadidos viven en `site/landing/prototipo/icons.svg` (Lucide, misma licencia); en la app se empaquetan con `lucide-react-native` del mismo número de versión que el sprite (v1.76.0) o se exporta el mismo SVG.

### 5.7 Estilo de mapas

Mapa de **papel**, el mismo lenguaje del mapa ilustrado de la landing, en estilo vectorial propio (Mapbox / MapLibre):
- **Base:** tierra `#efe4cf`, agua `#cfe0d6`, costa `#7fa79c` (2 pt), ríos `#9cc1c4`, cordilleras como trazo punteado `#b9ae8f`, Sierra Nevada y relieve `#a6a47a`, parques `rgba(85,97,63,.2)`, rótulos de agua en cursiva `#2f5a53` (5.6:1 sobre agua). Pocos POI base.
- **Marcadores:** pin numerado por parada (círculo 22–28 pt de tinta con número blanco y aro crema `#fffaf0`); en Explorar, pin de ciudad de 40 pt crema con aro tinta y el número de viajes; seleccionado: relleno tinta y halo dorado `rgba(232,163,58,.55)`. Ruta del día: línea punteada `#9a6a10` de 3 pt (3.75:1 sobre la tierra); otras jornadas: puntos `#8a8276` al 60 %. «Tú»: punto dorado con aro blanco.
- En oscuro el mapa conserva el papel claro (atenuado al 92 % en la app nativa) para no perder legibilidad de rutas.
- Nunca se muestra la ubicación exacta de otros viajeros en Explorar: solo ciudad o zona. El mapa siempre tiene equivalente en lista.

### 5.8 Ilustración: el arte gouache

El arte de la app es el de la landing: **pósters de turismo modernos pintados en gouache, a la hora dorada**, generados con Krea 3 con el prompt base de `docs/arte/estilo.md` (gouache mate, pincelada visible, grano de papel, cielo crema en el tercio superior, figuras pequeñas y de espaldas, sin texto ni caras). Se presenta siempre como ilustración, nunca como foto. Firma del conjunto en «Acerca de»: «Ilustraciones generadas para Lumen Studio».

**Dónde va:** portadas de destino (tarjetas y detalle de viaje), bienvenida, estados vacíos y celebraciones discretas. **Dónde no:** verificación, SOS, reportes y errores de seguridad (ahí, claridad sobria: iconos y texto).

**Escenas disponibles hoy:** hero (sendero entre cafetales; sirve para Minca y la Sierra Nevada), Medellín (Metrocable), Bogotá (La Candelaria y Monserrate), Cartagena (calle de la ciudad amurallada) y Tayrona (cala con rocas y palmeras), en 640 y 1200 px (verticales 4:5) y 1200 y 2400 px (hero 16:9). **Pendiente y opcional:** Santa Marta–Minca propia (ver `docs/arte/entrega.md`). Si un destino nuevo aún no tiene escena, la portada usa el **hueco de arte**: papel crema en degradado radial (`#faf6ee → #efe3cc → #e3d2b2`), el icono Lucide de la ciudad a trazo 1 en `#8a7a5c` al 70 %, y la etiqueta «Ilustración en camino». Nunca se usa la escena de otra ciudad en su lugar.

**El arte en la tarjeta de viaje (regla de recorte):**
- Proporción **16:9** en la tarjeta (ancho completo, radio 20 arriba), **21:9** en tarjetas de fila (Mis viajes) y **4:5 recortado a 400 + zona segura pt** en el detalle.
- Recorte por `object-position`, no por edición: en la tarjeta se muestra la **mitad inferior** (la ciudad, no el cielo): 50 % 78–80 % para las verticales y 76 % 100 % para el hero (para que se vean los tres viajeros). En el detalle, 50 % 92–100 %.
- **Nada de texto sobre la zona pintada de la tarjeta.** Solo la píldora de ciudad arriba a la izquierda, sobre el cielo: blanca al 90 %, icono + nombre en tinta, 13 pt negrita (contraste > 15:1).
- Título, fechas y cupos van **debajo**, en el cuerpo blanco de la tarjeta.

**El arte en la portada del detalle (el texto sobre el cielo):**
- El título va **arriba, en tinta, apoyado en el cielo crema** que el arte trae por diseño. No hay degradado negro abajo ni texto blanco sobre pintura.
- Velo crema para garantizar la lectura aunque el recorte suba la pintura: `linear-gradient(180deg, rgba(246,244,239,.95) 0%, rgba(246,244,239,.82) 28%, rgba(246,244,239,0) 56%)`. Con el velo, el título en `#141218` queda por encima de 13:1 en todo su recorrido; el rótulo de ciudad `#4a4136` queda en 9.1:1.
- Abajo, un segundo degradado funde el arte con el fondo de la app (`bg` 0 → transparente al 16 %), que en oscuro es el fondo oscuro: el arte se «posa» en la pantalla en ambos modos.
- Botones sobre el arte (volver, compartir): círculo blanco al 86 % con desenfoque 8 y sombra suave, icono en tinta.

**Bienvenida:** el arte ocupa la mitad inferior a sangre; su cielo se funde hacia arriba con una máscara (transparente → opaco al 34 %) y el texto queda sobre el crema de la pantalla. El botón principal flota sobre la pintura con sombra.

**Estados vacíos:** escena recortada en 16:9 (la ciudad, sin cielo), radio 20, y debajo el texto y la acción.

**Fotos de personas:** la app no usa fotografía de personas en contenido editorial. Las fotos de perfil son siempre de la propia persona (verificadas contra la selfie); en el prototipo, y en cualquier material de muestra, se usan **avatares con iniciales** sobre los tonos del arte: miel `#f6d9a6`, salvia `#cfe0d6`, terracota `#efd2c2`, arena `#e3dccb`, cielo `#d8e0ee`, con iniciales en tinta (> 12:1).

### 5.9 Motion

| Token | Duración | Curva | Uso |
| --- | --- | --- | --- |
| `instant` | 100 ms | `cubic-bezier(.2, 0, 0, 1)` | Presionado (escala .98), toggles |
| `quick` | 200 ms | `cubic-bezier(.2, 0, 0, 1)` | Chips, colores de estado, avisos |
| `standard` | 280–300 ms | `cubic-bezier(.2, 0, 0, 1)` | Navegación entre pantallas, hojas inferiores |
| `emphasized` | 450 ms | `cubic-bezier(.05, .7, .1, 1)` | Confirmaciones importantes |
| `exit` | 180 ms | `cubic-bezier(.3, 0, 1, 1)` | Salidas |
| `map-fly` | 600–900 ms | `cubic-bezier(.4, 0, .2, 1)` | Cámara del mapa |

- **Navegación con dirección:** avanzar desliza 28 pt desde la derecha con fundido; volver, desde la izquierda; cambiar de pestaña, solo fundido. La tab bar y la barra «en viaje» no se mueven.
- **Firma: el «encendido».** Al confirmar algo importante (solicitud enviada, viaje publicado, identidad verificada) la llama de Lumen aparece con un halo dorado que crece de 0 a 100 % en 450 ms. Es el único movimiento que no responde a un toque.
- **Seguridad:** el anillo de «mantener 2 s» avanza con el dedo (es información, no adorno, y se mantiene con «Reducir movimiento»); la cuenta regresiva baja un anillo rojo segundo a segundo con háptica en cada número.
- **«Reducir movimiento»:** sin deslizamientos ni halos; solo cambios instantáneos o fundidos de 150 ms.

---

## 6. Componentes base (con estados)

Estética de la landing llevada a la app: **tarjetas blancas con borde fino y sombra suave, botones de tinta en píldora, chips en píldora con borde**. Estados comunes a todo lo interactivo: **reposo · presionado** (fondo un paso más oscuro y escala .98) **· foco** (anillo 3 pt `gold-text`) **· deshabilitado** (opacidad 45 %, nunca como único indicador) **· cargando** (en el propio control, conserva el ancho).

| Componente | Anatomía v2 | Estados y variantes |
| --- | --- | --- |
| **Botón** | Píldora de 52 pt (44 el pequeño, 64 el de cancelar alerta), `button`, icono opcional a la izquierda de 20 pt, trazo 2 | Primario: tinta `#141218` con texto blanco (18.59), presionado `#2c2733` · Secundario: transparente con borde 1.5 pt `line-strong` · Terciario: texto con subrayado dorado de 2 pt · Seguridad: `safety` con blanco · Cancelar alerta: blanco con borde tinta de 2 pt · En oscuro el primario se invierte (crema con texto oscuro) |
| **Tarjeta de viaje** | Blanca, radio 20, borde fino + sombra suave · arte 16:9 con píldora de ciudad · título `title-3` 18 pt · fechas y cupos con icono (`footnote` 14) · chip de compatibilidad · fila del organizador separada por filete: avatar, «Organiza Laura», insignia, ★ promedio (n.º reseñas) | Abierto · Queda 1 cupo · Lleno («Avisarme») · Solicitud enviada (etiqueta `trust`) · Eres miembro · Pasado. Compacta (en el mapa): sin chip de compatibilidad, título 16 pt. Toda la tarjeta es un solo objetivo táctil; el chip de compatibilidad es un objetivo aparte por encima |
| **Tarjeta de viajero** | Avatar 48 · nombre + insignia · «también en {ciudad} {fechas}» · 2–3 chips · «Ver» | Verificado / sin verificar («Sin verificar» en `ink-2`, sin escudo) · Bloqueado (no aparece) |
| **Chip de compatibilidad** | Píldora blanca con borde fino, anillo de 22 pt (pista `surface-3`, progreso `accent`) + «86 % compatible» 14 pt negrita | Alta ≥ 75 % (anillo dorado) · Media 50–74 % (anillo `ink-2`) · Baja < 50 % (sin porcentaje ni anillo: «Pocas coincidencias»). Al tocar: hoja con el porqué (fechas que coinciden, presupuesto, idiomas, estilo, identidad verificada) y la regla «el destino no suma: es el filtro» |
| **Insignia de verificado** | Píldora `trust-bg` con `shield-check` 18 pt y «Identidad verificada» en `trust` 14 pt negrita; versión en línea sin fondo (13 pt) | Identidad verificada · Solo teléfono (píldora `surface-2` con `phone`) · En revisión (contorno punteado) · Vencida. En el avatar propio: aro `trust` de 2 pt y botón de escudo |
| **Escalera de niveles** | Lista vertical 0–3 unida por línea; punto de 32 pt: hecho (tinta con check), actual (`trust` con halo `trust-bg` y etiqueta «Tu nivel»), por venir (contorno) | Texto: nombre del nivel y qué desbloquea, según `05` |
| **Barra «en viaje»** | Píldora de tinta, radio 18, sobre la tab bar: llama 24 pt · «En viaje» 14 negrita + «{ciudad}, día n» 13 en `#d9d2c6` (12.38) · botón de seguridad 48 × 48, radio 14, `safety` con aro blanco de 2 pt | En «Hoy» la parte izquierda deja de ser botón; el escudo siempre abre Seguridad |
| **Botón de seguridad (pantalla)** | Círculo de 212 pt `safety`, icono 40 pt, «Necesito ayuda ya» 21 pt, «Mantén presionado 2 segundos» 13 pt, anillo exterior de 6 pt (pista `rgba(198,47,53,.2)`, progreso tinta) | Reposo · Manteniendo (escala .97, `safety-pressed`, anillo que avanza, háptica) · Cuenta regresiva 5 s (anillo rojo que baja, número 72 pt, «Cancelar alerta» de 64 pt con foco automático) · Alerta enviada (lista de a quién se avisó) · Sin conexión (cae a SMS y llamada directa). Alternativa accesible: «¿No puedes mantener presionado? Pedir ayuda con confirmación» → diálogo → misma cuenta regresiva |
| **Aviso de simulación** | Caja `sim-bg` con borde `sim-line`, icono `info`, texto `sim-ink` 13–14 negrita | Solo en el prototipo y en materiales de prueba: en SOS y verificación va **arriba**, antes de cualquier botón |
| **Pin de mapa** | Ver §5.7 | Reposo · Seleccionado · Propuesta (borde punteado) · Visitado (check) |
| **Fila de gasto / saldo** | Fila blanca con borde fino: avatar, «Le debes a Andrés», monto en `stat` `tnum`, «Marcar pagado» secundario | Pendiente (lo que debes en `danger`) · Liquidado (`success`) · Todo al día · En otra moneda (convertido debajo) |
| **Burbuja de chat** | Ajena: blanca con borde fino, radio 18 con la esquina de origen en 6, nombre 12 pt `ink-2` · propia: tinta con texto blanco; hora 11 pt | Enviando · Enviado · Fijado (caja blanca arriba con `map-pin` dorado) |
| **Campo de texto** | Etiqueta arriba 15 pt negrita, 52 pt, radio 10, borde 1.5 pt `line-strong`, placeholder `#6f675b` | Reposo · Foco (borde tinta + halo dorado) · Error (borde `danger` + mensaje con «!» en círculo) · Válido |
| **Chip de filtro** | Píldora blanca 44 pt con borde `line-strong` e icono 18 pt `ink-2` | Inactivo · Activo (relleno tinta, texto blanco, check dorado) · Con contador («Estilo (2)») |
| **Segmentado** | Contenedor blanco con borde fino, botones de 44 pt; activo en tinta | Lista/Mapa, ES/EN, Claro/Oscuro, pestañas del grupo |
| **Pestañas de días** | Píldoras de 44 pt, la activa en tinta, «+» para agregar día | Patrón `tablist` con flechas |
| **Hoja inferior** | Blanca, radio 28 arriba, asa 40 × 5 `surface-3`, botón cerrar de 44 pt, fondo `rgba(20,18,24,.42)` | Media altura · Expandida (máx. 88 %) · Arrastrando. Lo de atrás queda inerte; Esc y el fondo la cierran |
| **Aviso flotante (toast)** | Píldora de tinta, 14 pt negrita, sobre la tab bar | Se anuncia por `role="status"`, 2,8 s |

---

## 7. Accesibilidad, internacionalización y estados

### 7.1 Accesibilidad (meta: WCAG 2.2 AA)
- Contrastes de la sección 5 recalculados sobre los fondos v2 (crema `#f6f4ef`, blanco y `#efebe3`); ninguna información depende solo del color (insignias con texto, estados con icono). El dorado `#e8a33a` nunca es texto en claro; el texto dorado `#9a6a10` solo va sobre blanco o en tamaño grande sobre crema.
- Texto sobre arte: siempre en tinta sobre el cielo crema con el velo de §5.8; nunca texto blanco sobre pintura.
- Áreas táctiles ≥ 44 × 44 pt; separación mínima de 8 pt entre objetivos.
- VoiceOver/TalkBack: etiquetas en todos los iconos; tarjetas leídas como una unidad («Viaje a Cartagena, 12 a 17 de diciembre, 2 de 4 cupos, 86 % compatible, organiza Laura, identidad verificada»); el mapa tiene siempre su equivalente en lista.
- Botón de seguridad alcanzable con lector de pantalla mediante acción personalizada y gesto alternativo (sin requerir mantener presionado: enlace «Pedir ayuda con confirmación» + cuenta regresiva cancelable). La cuenta regresiva se anuncia segundo a segundo (`aria-live="assertive"`) y el foco va directo a «Cancelar alerta».
- Al cambiar de pantalla, el foco pasa al título de la nueva; las hojas inferiores dejan inerte lo de atrás y devuelven el foco al control que las abrió.
- Zonas seguras: barras, cabeceras y botones fijos respetan `safe-area` arriba, abajo y a los lados (isla dinámica, barra de gestos, muesca en horizontal).
- Texto dinámico hasta 200 % sin cortar contenido; «Reducir movimiento» y «Reducir transparencia» respetados.
- Formularios con errores descritos en texto, no solo en rojo.

### 7.2 Internacionalización (es · en en el MVP; pt después)
- Español de Latinoamérica como idioma base; inglés desde el MVP (viajero internacional, según `01`); portugués de Brasil cuando se abra a ese mercado.
- Presupuestar +35 % de longitud en botones y títulos (el portugués y el inglés técnico se alargan); nada de textos en imágenes.
- Fechas, horas, monedas y números con formato local (`12 dic` / `Dec 12` / `12 de dez`; `$ 45.000` COP vs `R$ 45,00`); moneda del gasto independiente del idioma.
- Pluralización con ICU MessageFormat; género neutro donde sea posible («Te damos la bienvenida» en vez de «Bienvenido/a»).
- Perfil muestra los idiomas que habla cada persona: es criterio de compatibilidad.

### 7.3 Estados vacíos, errores y microcopy
Tono: cálido, breve, sin culpas, siempre con una salida. **Champi**, la seta de Lumen, es solo un guiño discreto (y el farol pixel art de la v1 sale de la app): aparece pequeño (máx. 64 pt), con su farolito, únicamente en estados vacíos y en la pantalla «Diseñado por Lumen Studio» (Perfil › Acerca de); nunca en la marca principal ni en flujos de seguridad (SOS, verificación, reportes, errores de seguridad).

| Situación | Microcopy (es) |
| --- | --- |
| Sin viajes aún | (Champi con farol) «Todavía no hay rutas por aquí. Enciende la primera.» → [Crear itinerario] |
| Explorar sin resultados | «No encontramos viajes con esos filtros. Prueba fechas flexibles o amplía el presupuesto.» → [Ajustar filtros] |
| Bandeja de mensajes vacía | (Champi) «Silencio de carretera. Cuando te unas a un viaje, aquí empieza la conversación.» |
| Gastos vacíos | «Nadie ha pagado nada… todavía. Anota el primer gasto y nosotros hacemos las cuentas.» |
| Sin conexión | «Estás sin señal. Puedes ver la última versión de tu itinerario que cargaste; enviaremos lo pendiente cuando vuelvas.» (en el MVP solo hay caché de lo último visto; el modo sin conexión completo llega después, ver `02`) |
| Error genérico | «Algo se nos apagó. Intenta de nuevo en un momento.» → [Reintentar] |
| Solicitud rechazada | «Este viaje no tiene espacio para ti esta vez. Hay otros parecidos esperándote.» → [Ver similares] |
| Verificación pendiente | «Estamos revisando tu identidad; suele tardar unos minutos. Mientras, puedes seguir planeando.» |
| Verificación fallida | «No pudimos confirmar tu documento. Revisa que la foto se vea completa y con buena luz.» → [Intentar de nuevo] |
| Alerta de seguridad enviada | «Listo. Avisamos a Camila y Andrés con tu ubicación. Si estás en peligro, llama al 123.» |

---

## 8. Prototipo navegable

**Dónde:** https://lumentravels.vercel.app/prototipo (código en `site/landing/prototipo/`: `index.html`, `proto.css`, `proto.js`, `data.js`, `icons.svg`; reutiliza el arte, las fuentes y el sprite de `site/landing/assets/` sin copiarlos). HTML, CSS y JS sin frameworks, compatible con la CSP de producción (solo `self`, nada en línea), `noindex`.

**Para qué:** tocarlo en el celular en las entrevistas con viajeros (probar **H1**, compañía compatible alrededor de un itinerario, y **H2**, aceptar verificar la identidad a cambio de confianza) y mostrarlo al dueño. En celular ocupa toda la pantalla como una app; en escritorio se ve dentro de un marco de celular con la nota «Prototipo · los datos son de ejemplo», selector ES/EN y «Reiniciar prototipo».

**Recorrido:** bienvenida (3 pasos con arte) → Explorar (lista y mapa, filtros de destino, fechas y estilo, chip de compatibilidad con su porqué) → detalle del viaje (portada con arte, organizador con señales de confianza, itinerario por días) → «Pedir unirme» → verificación nivel 2 simulada (por qué, documento, selfie, revisión) → mensaje de presentación → solicitud enviada · Crear (hoja) → nuevo itinerario → editor de días y paradas sobre el mapa → publicar como viaje abierto · Mis viajes → grupo del viaje (chat, itinerario compartido, gastos con saldos y «Nuevo gasto») · Hoy (modo en viaje, «Llegué bien») → Seguridad (mantener 2 s, cuenta regresiva de 5 s cancelable, alerta enviada) · Mensajes · Perfil (nivel de verificación, contactos de confianza, idioma, modo oscuro).

**Lo simulado, dicho en pantalla:** la verificación no usa cámara ni guarda imágenes; el SOS **nunca llama al 123 ni envía mensajes**, y lo dice en un aviso arriba de cada pantalla de seguridad. Personas, viajes, reseñas y montos son ficticios; los avatares son iniciales, sin fotos. El estado vive en memoria y en `sessionStorage` (se borra al cerrar la pestaña).

**Guion sugerido para la entrevista (H1 y H2):** pedir que encuentre un viaje que le serviría (observar si mira la compatibilidad y al organizador), que pida unirse (medir reacción y abandono al aparecer la verificación), y que abra la seguridad durante el viaje (comprensión del «mantener 2 s» y de la cancelación). No es una prueba de usabilidad completa: el resto de flujos están abreviados.

---

## 9. Cambios v1 → v2

| Tema | v1 (18 nov) | v2 (20 nov) | Por qué |
| --- | --- | --- | --- |
| Modo principal | Oscuro «noche» `#0E0C12` con farol dorado | **Claro de Lumen**: crema `#f6f4ef`, blanco, `#efebe3`, tinta `#141218` | Es la marca que el dueño aprobó en la landing y en lumenestudio.tech |
| Modo oscuro | Principal | **Secundario y opcional**, derivado del claro (tinta `#18161b`, crema de texto, mismo dorado) | Coherencia con el claro; el arte y los mapas conservan su papel |
| Dorado | `#E8B64C` en botones y selección | `#e8a33a` **solo formas** + `#9a6a10` como texto dorado; los botones son de tinta | Valores de la landing; el dorado como luz, no como botón |
| Semánticos | Claro: `success #1F7A4D` | `success #1a6e43` (AA también sobre `#efebe3`); se suman `trust-bg`, `sim-bg/ink`, `safety-pressed` y el aro del SOS en oscuro | Verificación AA sobre los fondos nuevos |
| Tipografía | Fraunces (títulos) + Manrope; Cinzel en logo | **Plus Jakarta Sans** (títulos) + **Manrope** (texto), escala en pt adaptada a móvil | Las fuentes de la landing; Fraunces y Cinzel salen |
| Logo | Farol / Cinzel en splash | **Llama `#lumen-mark` + wordmark en minúscula**; ícono 1024 px, variantes iOS y Android adaptativo, pantalla de carga definida | Marca aprobada |
| Iconos | Phosphor «regular», tab activa rellena | **Lucide** trazo 1.75, activa con trazo 2.25 sobre píldora; lista completa de la app (§5.6) | Mismo set que la landing; Lucide es de trazo nativo |
| Ilustración | Foto de destino con degradado oscuro abajo; ilustración de trazo suave en onboarding | **Escenas gouache** de las cinco paradas en portadas, bienvenida y vacíos; texto en tinta sobre el cielo crema con velo; hueco de arte para destinos sin escena | El arte que le encanta al dueño; legibilidad sin oscurecer la pintura |
| Fotos de personas | Fotos reales de destino con personas de espaldas | Sin fotografía de personas en contenido; avatares con iniciales en material de muestra | Evitar personas reales y no confundir arte con testimonio |
| Componentes | Superficies oscuras escalonadas, botón dorado de 52 pt radio 16 | Tarjetas blancas con borde fino y sombra suave, botones de tinta en píldora, chips en píldora; radios con jerarquía 10 / 14 / 20 / 28 | Estética de la landing |
| Mapas | Estilo «Noche» y «Día» | Mapa de **papel** (el de la landing), ruta punteada `#9a6a10`, pins de tinta | Coherencia con el mapa ilustrado |
| Barra «en viaje» | Barra con punto y escudo | Píldora de tinta con la llama y botón de seguridad rojo de 48 pt | Más visible y propia de la marca |
| Wireframes | W1–W8 | W1–W8 sin cambios de estructura (dos detalles marcados «v2») + **W9** verificación y **W10** bienvenida y alerta | Solo cambió la piel |
| Prototipo | No había | **Prototipo navegable** en `/prototipo` (§8) | Entrevistas H1 y H2 y revisión del dueño |

Se conserva sin cambios de fondo: principios, arquitectura de información, flujos, accesibilidad, internacionalización, microcopy y la regla de que la seguridad usa rojo propio y la verificación turquesa.

---

*Diseñado por Lumen Studio.* Alineado con `02-producto-mvp-roadmap.md` (alcance del MVP), `05-confianza-y-seguridad.md` (niveles 0–3 y protocolo SOS: fuente de verdad en seguridad), `docs/arte/estilo.md` (ilustración) y la landing publicada (marca).
