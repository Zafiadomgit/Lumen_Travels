# 03 · UX/UI y sistema de diseño

**Responsable:** disenador · **Estado:** propuesta v1 · **Alcance:** app móvil iOS y Android (mobile first), modo oscuro principal y modo claro.

La app hereda de Lumen la calidez de la luz del farol sobre la noche, pero tiene identidad propia: menos «estudio editorial», más «compañero de ruta». Todo lo que sigue se apoya en los cuatro pilares del brief: **Planea, Coincide, Viajen juntos, Confianza**.

---

## 1. Principios de experiencia

1. **La confianza se ve antes de que se pida.** Verificación, reseñas e historial aparecen en cada tarjeta y en cada perfil, no escondidos en un menú. Nadie debería tener que preguntar «¿esta persona es real?».
2. **El mapa es el lienzo.** Planear, descubrir y viajar ocurren sobre el mapa; las listas son la vista alternativa, no al revés.
3. **Del sueño al plan en tres toques.** Cada flujo tiene un camino corto (plantilla, sugerencia, «unirme») y un camino profundo para quien quiere detallar.
4. **Juntos, pero cada quien a su ritmo.** Votar, proponer y dividir gastos sin fricción social: nada de presión por responder, decisiones visibles y reversibles.
5. **Calidez sin ruido.** Fondo nocturno, un solo acento dorado para lo importante, microcopy cercano. Si todo brilla, nada guía.

---

## 2. Arquitectura de información

### 2.1 Navegación principal (tab bar de 5)

| Pestaña | Icono | Pilar | Contenido |
| --- | --- | --- | --- |
| **Explorar** | brújula | Coincide | Feed de viajes abiertos y viajeros, alternable con mapa; filtros; plantillas de rutas |
| **Mis viajes** | mapa plegado | Planea | Itinerarios propios y de grupo (próximos, borradores, pasados) |
| **＋ Crear** (central, dorado) | más | Planea / Coincide | Hoja inferior: «Nuevo itinerario», «Busco compañeros», «Usar plantilla» |
| **Mensajes** | burbujas | Viajen juntos | Chats de grupo, solicitudes para unirse, chats 1:1 (solo tras aceptar) |
| **Perfil** | avatar | Confianza | Perfil propio, verificación, reseñas, contactos de confianza, ajustes |

Cuando hay un viaje en curso, aparece **sobre** la tab bar una barra persistente «En viaje · Cartagena · Día 2» con el botón de seguridad (ver 3.6). La seguridad nunca queda a más de un toque.

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
1. **Bienvenida** (3 tarjetas: Planea · Coincide · Viajen juntos, con la promesa de confianza al final) → «Empezar».
2. **Registro**: Apple / Google / correo. Idioma detectado del sistema (es/en/pt), editable.
3. **Tu estilo**: nombre, foto, idiomas que hablas, estilo de viaje (mochilero, cómodo, aventura, cultural, fiesta, naturaleza) y rango de presupuesto. Todo con chips; máximo 60 s.
4. **Verificación en dos niveles** (explicada con por qué y qué se guarda):
   - Nivel 1, obligatorio para chatear: teléfono por SMS/WhatsApp.
   - Nivel 2, obligatorio para unirse o publicar viajes abiertos: documento + selfie con prueba de vida. Estado «En revisión» no bloquea planear en privado.
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
2. **Filtros** (hoja): destino, fechas (flexibles ±3 días), presupuesto, estilo, tamaño de grupo, idioma, «solo verificados» (activo por defecto), grupos solo de mujeres / solo LGBTIQ+ cuando el organizador lo define.
3. **Detalle de viaje**: itinerario resumido, organizador con señales de confianza, miembros, chip de compatibilidad con su porqué («Mismas fechas · Presupuesto similar · Hablan español»).
4. **Pedir unirse**: mensaje corto obligatorio (plantillas sugeridas) → estado «Enviada». El organizador acepta/rechaza; al aceptar, entras al grupo y al chat. Rechazos con copy neutro, sin motivo expuesto.

### 3.4 Perfil de viajero con señales de confianza
Orden fijo: foto y nombre → insignias (ID verificada, teléfono, redes opcionales) → «Miembro desde» y viajes completados → reseñas mutuas (solo de viajes compartidos reales) → estilo, idiomas, intereses → viajes publicados. Acciones: «Invitar a mi viaje», «Mensaje» (si hay viaje en común o solicitud aceptada), menú ⋯ con **Reportar** y **Bloquear** siempre visibles.

### 3.5 Grupo del viaje
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
5. **Botón de seguridad** → pantalla de seguridad: mantener presionado 2 s «Pedir ayuda» (alerta a contactos con ubicación + número de emergencia local: 123 en Colombia), «Compartir mi ubicación», «Salir de una situación» (llamada simulada), «Reportar». Confirmación háptica y cuenta regresiva de 5 s cancelable para evitar falsas alarmas.

---

## 4. Wireframes (360 × 780 pt de referencia)

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
│ │ [ foto Cartagena       ] │ │
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
│ ← Eje cafetero      Publicar │
│ ┌──────────────────────────┐ │
│ │   1●───2●                │ │
│ │          ╲               │ │
│ │           3●   + tocar   │ │
│ │                para añadir│
│ └──────────────────────────┘ │
│ (Día 1)[Día 2](Día 3)(+)     │
│ 6 h 30 · $180.000 · ⚠ largo  │
│ ≡ 08:00 1 Valle de Cocora 3h │
│ ≡ 12:30 2 Almuerzo Salento   │
│      🚌 25 min               │
│ ≡ 15:00 3 Finca cafetera     │
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
│ └──────────────────────────┘ │      │      │  PEDIR AYUDA │        │
│ ▸ 10:00 Castillo San Felipe  │      │      │ mantén 2 seg │        │
│   en 18 min a pie            │      │      └──────────────┘        │
│ Encuentro con Tomás 16:00    │      │ Avisa a tus 2 contactos con  │
│ Café del Mar (lugar público) │      │ tu ubicación y llama al 123. │
│ [ Llegué bien ]              │      │ [📍 Compartir ubicación    ] │
├──────────────────────────────┤      │ [📞 Llamada para salir     ] │
│ ● En viaje · Día 2   [🛡]   │      │ [⚑ Reportar a alguien      ] │
├──────────────────────────────┤      │                              │
│ 🧭    🗺    (＋)    💬    ◯  │      │ Ubicación compartida: 1 h ▾  │
└──────────────────────────────┘      └──────────────────────────────┘
```

---

## 5. Sistema de diseño · tokens

Contrastes calculados con la fórmula WCAG 2.2 (luminancia relativa). AA exige 4.5:1 en texto normal, 3:1 en texto grande (≥ 18 pt o ≥ 14 pt negrita) y en bordes/iconos de componentes.

### 5.1 Color · modo oscuro (principal)

| Token | Hex | Uso | Contraste |
| --- | --- | --- | --- |
| `bg/base` «noche» | `#0E0C12` | Fondo de la app | — |
| `bg/surface` | `#18151E` | Tarjetas, hojas, tab bar | — |
| `bg/raised` | `#231F2B` | Modales, campos, chips | — |
| `border/subtle` | `#2E2938` | Divisores decorativos | (decorativo) |
| `border/strong` | `#6B6375` | Bordes de campos y controles | 3.15 sobre surface ✓ UI |
| `text/primary` «papel» | `#F3EFE6` | Texto principal | 16.94 base · 15.71 surface · 14.05 raised |
| `text/secondary` | `#B8B1A6` | Metadatos | 9.15 base · 8.48 surface · 7.58 raised |
| `text/tertiary` | `#8E877C` | Ayudas, marcas de tiempo | 5.47 base · 5.07 surface |
| `accent/farol` | `#E8B64C` | CTA, selección, foco, pin activo | 10.40 base · 9.64 surface · 8.62 raised |
| `accent/farol-pressed` | `#F2C770` | Estado presionado/hover | — |
| `on-accent` | `#1A1305` | Texto sobre dorado | 9.85 sobre farol · 11.57 sobre pressed |
| `success` | `#5BC98E` | Confirmado, liquidado | 8.75 surface |
| `warning` | `#F2A65A` | Alertas suaves | 8.91 surface |
| `danger` | `#FF7A70` | Errores, texto destructivo | 7.10 surface |
| `info` | `#7DB4F5` | Información, enlaces secundarios | 8.34 surface |
| `trust` | `#6FD3C4` | Insignia verificado | 10.12 surface |
| `safety/bg` | `#C62F35` | Botón de seguridad (relleno) | blanco encima 5.44 ✓ |
| `safety/pressed` | `#A9252B` | Seguridad presionado | blanco encima 7.03 |

El dorado se reserva para **una** acción principal por pantalla; la seguridad usa rojo propio, nunca dorado, para que no se confunda con «acción comercial». La verificación usa turquesa `trust`: lectura inmediata de «confianza» sin competir con el farol.

### 5.2 Color · modo claro

| Token | Hex | Contraste |
| --- | --- | --- |
| `bg/base` «papel» | `#FAF7F0` | — |
| `bg/surface` | `#FFFFFF` | — |
| `text/primary` | `#1C1820` | 16.34 base · 17.49 surface |
| `text/secondary` | `#5A5361` | 6.90 base · 7.38 surface |
| `border/strong` | `#8F8798` | 3.45 surface ✓ UI |
| `accent/farol` (rellenos) | `#E8B64C` con texto `#1A1305` | 9.85 |
| `accent/text` (texto/iconos dorados) | `#8C5B00` | 5.43 base · 5.81 surface |
| `success` / `warning` / `danger` | `#1F7A4D` / `#9A5300` / `#B3261E` | 5.32 / 5.82 / 6.54 sobre blanco |
| `info` / `trust` | `#2361B0` / `#0F7468` | 6.16 / 5.65 sobre blanco |
| `safety/bg` | `#C62F35` | blanco encima 5.44 |

En claro, el dorado `#E8B64C` nunca se usa como color de texto (sería ilegible sobre papel); para eso existe `accent/text`. Todos los semánticos claros mantienen ≥ 5:1 también sobre `#FAF7F0`.

### 5.3 Tipografía

- **Display: Fraunces** (variable, eje de óptica «soft»), solo títulos ≥ 22 pt. Serif cálida con carácter, cercana al espíritu clásico de Lumen.
- **Texto e interfaz: Manrope** (400/500/600/700), igual que la marca madre: legible, amplia, buenas cifras para precios y horas (usar `tnum`).
- **Por qué no Cinzel en móvil:** solo tiene mayúsculas, pierde legibilidad por debajo de ~20 pt, ocupa mucho ancho (problema con títulos en portugués y alemán de turistas) y no tiene cursiva ni pesos útiles para jerarquía. Se conserva **solo** en el logotipo/splash y en la firma «Diseñado por Lumen Studio», como guiño de marca.
- Ambas son Google Fonts (OFL), con soporte completo de á é í ó ú ñ ã õ ç.

| Estilo | Fuente | Tamaño / interlínea | Peso |
| --- | --- | --- | --- |
| `display` | Fraunces | 34 / 40 | 600 |
| `title-1` | Fraunces | 28 / 34 | 600 |
| `title-2` | Fraunces | 22 / 28 | 600 |
| `headline` | Manrope | 18 / 24 | 700 |
| `body` | Manrope | 16 / 24 | 400 |
| `body-strong` | Manrope | 16 / 24 | 600 |
| `callout` | Manrope | 14 / 20 | 500 |
| `caption` | Manrope | 12 / 16 | 600 (mínimo absoluto) |
| `button` | Manrope | 16 / 20 | 700 |

Todo escala con el tamaño de texto del sistema (Dynamic Type / fontScale) hasta 200 %.

### 5.4 Espaciado, radios, elevación

- **Espaciado (base 4):** `0 · 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64`. Margen lateral de pantalla 16; separación entre tarjetas 12; padding interno de tarjeta 16.
- **Radios:** `xs 6` (chips pequeños) · `sm 10` (campos) · `md 16` (tarjetas, botones) · `lg 24` (hojas inferiores, arriba) · `full 999` (avatares, chips, pins).
- **Elevación:** en oscuro la profundidad se expresa con superficies más claras (`base → surface → raised`) más un brillo dorado muy tenue en lo activo; en claro, con sombras.

| Nivel | Oscuro | Claro |
| --- | --- | --- |
| 0 | `#0E0C12` | sin sombra |
| 1 tarjeta | `#18151E` + borde `#2E2938` 1 px | `0 1 3 rgba(28,24,32,.08), 0 1 2 rgba(28,24,32,.06)` |
| 2 hoja/barra | `#231F2B` + `0 -4 16 rgba(0,0,0,.40)` | `0 -4 16 rgba(28,24,32,.10)` |
| 3 modal | `#231F2B` + `0 12 32 rgba(0,0,0,.55)` | `0 12 32 rgba(28,24,32,.16)` |
| Resplandor farol (foco/activo) | `0 0 0 3 rgba(232,182,76,.35)` | anillo 2 px `#8C5B00` |

### 5.5 Iconografía
Línea redondeada de 1.75 px en rejilla de 24 (base sugerida: Phosphor, estilo «regular», licencia MIT), con relleno solo para estado activo de la tab bar. Área táctil mínima 44 × 44 pt aunque el icono mida 24. Iconos propios a dibujar: farol (marca/«en viaje»), escudo de seguridad, insignia verificado, chip de compatibilidad.

### 5.6 Estilo de mapas
Estilo vectorial propio (Mapbox/MapLibre) en dos variantes:
- **Noche:** agua `#141826`, tierra `#121016`, parques `#16201A`, vías `#2A2531`, vías principales `#3A3342`, etiquetas `#B8B1A6` con halo `#0E0C12`. Pocos POI base para que destaquen los de la app.
- **Día:** agua `#D6E4EE`, tierra `#F3EFE6`, parques `#DDE8D5`, vías `#FFFFFF`, etiquetas `#5A5361`.
- **Marcadores:** pin numerado por parada (círculo 28 pt, color del día de una paleta de 6 tonos cálidos-fríos distinguibles entre sí y con daltonismo: `#E8B64C`, `#7DB4F5`, `#5BC98E`, `#F28C8C`, `#B79CF2`, `#6FD3C4`), ruta en línea de 4 pt del color del día, propuestas en línea punteada, clúster como círculo con número. «Tú» es un punto con pulso dorado suave. Nunca se muestra la ubicación exacta de otros viajeros en Explorar: solo zona/ciudad.

### 5.7 Ilustración y fotografía
- **Fotos:** de destino reales, cálidas, hora dorada o nocturna; personas de espaldas o en grupo, diversas, sin poses publicitarias. Degradado inferior `rgba(14,12,18,0→.85)` para texto legible sobre foto. Fotos de perfil siempre del propio usuario (verificadas contra la selfie).
- **Ilustración:** trazo suave, formas orgánicas, paleta limitada a noche + farol + papel + un acento. Se usa en onboarding, estados vacíos y celebraciones; nunca en contenido de confianza o seguridad (ahí, claridad sobria).

### 5.8 Motion

| Token | Duración | Curva | Uso |
| --- | --- | --- | --- |
| `instant` | 100 ms | `cubic-bezier(0.2, 0, 0, 1)` | Presionado, toggles |
| `quick` | 200 ms | `cubic-bezier(0.2, 0, 0, 1)` | Chips, aparición de tooltips |
| `standard` | 300 ms | `cubic-bezier(0.2, 0, 0, 1)` | Navegación, hojas |
| `emphasized` | 450 ms | `cubic-bezier(0.05, 0.7, 0.1, 1)` | Entradas importantes, apertura de detalle |
| `exit` | 200 ms | `cubic-bezier(0.3, 0, 1, 1)` | Salidas |
| `map-fly` | 600–900 ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Vuelos de cámara en el mapa |

Firma de marca: «encendido» del farol (brillo dorado que crece de 0 a 100 % en 450 ms) al confirmar algo importante (te aceptaron en un viaje, gasto liquidado). Con «Reducir movimiento» activo: solo fundidos de 150 ms, sin vuelos de mapa ni pulsos.

---

## 6. Componentes base (con estados)

Estados comunes a todo lo interactivo: **reposo, presionado** (fondo `pressed`, escala 0.98), **foco** (resplandor farol), **deshabilitado** (opacidad 40 % y sin acción; nunca como único indicador), **cargando** (skeleton o spinner en el propio control).

| Componente | Anatomía | Estados y variantes específicas |
| --- | --- | --- |
| **Botón** | 52 pt de alto, radio 16, `button` | Primario (farol + `on-accent`), secundario (borde `border/strong`), terciario (texto), destructivo (`danger`); cargando conserva el ancho |
| **Tarjeta de viaje** | Foto 16:9 · título `headline` · fechas y cupos · chip de compatibilidad · fila del organizador (avatar, ✓, ★, n.º viajes) | Abierto · Casi lleno (≤ 1 cupo, etiqueta `warning`) · Lleno (CTA «Avisarme») · Ya solicitado · Eres miembro · Pasado |
| **Tarjeta de viajero** | Avatar 48 · nombre + insignia · «también en {ciudad} {fechas}» · 2–3 chips de estilo · «Ver» | Verificado / no verificado (sin insignia, texto «Sin verificar» en `text/tertiary`) · Bloqueado (no aparece) |
| **Chip de compatibilidad** | Anillo de progreso + «86 % compatible» | Alta ≥ 75 % (anillo farol) · Media 50–74 % (anillo `text/secondary`) · Baja < 50 % (no se muestra porcentaje, solo «Pocas coincidencias»). Al tocar: hoja con el porqué |
| **Insignia de verificado** | Escudo con check en `trust`, 16 pt + texto | ID verificada · Solo teléfono (icono ☎ sin escudo) · En revisión (contorno punteado) · Vencida. Siempre con etiqueta de texto accesible |
| **Botón de seguridad** | Escudo 44 pt en barra «en viaje»; en pantalla SOS, botón 120 pt `safety/bg` | Reposo · Mantener (anillo de progreso 2 s + háptica) · Cuenta regresiva 5 s («Cancelar» grande) · Alerta enviada (confirmación + quién fue avisado) · Sin conexión (cae a SMS y llamada directa) |
| **Pin de mapa** | Círculo numerado con color del día | Reposo · Seleccionado (escala 1.2 + resplandor) · Propuesta (borde punteado) · Visitado (check) |
| **Tarjeta de voto** | Pregunta, opciones con barra, cierre | Abierta · Ya votaste (tu opción marcada, puedes cambiar) · Cerrada (ganadora destacada) |
| **Fila de gasto / saldo** | Concepto, quién pagó, monto `tnum` | Pendiente · Liquidado (`success`, tachado suave) · En otra moneda (monto convertido debajo) |
| **Campo de texto** | Etiqueta arriba, 52 pt, radio 10 | Reposo · Foco · Error (borde y mensaje `danger` + icono) · Éxito |
| **Chip de filtro** | 36 pt visual / 44 táctil, radio full | Inactivo · Activo (relleno `raised` + borde farol + check) · Con contador |
| **Hoja inferior** | Asa, radio 24 superior | Media altura · Expandida · Arrastrando |

---

## 7. Accesibilidad, internacionalización y estados

### 7.1 Accesibilidad (meta: WCAG 2.2 AA)
- Contrastes de la sección 5 verificados; ninguna información depende solo del color (insignias con texto, estados con icono).
- Áreas táctiles ≥ 44 × 44 pt; separación mínima de 8 pt entre objetivos.
- VoiceOver/TalkBack: etiquetas en todos los iconos; tarjetas leídas como una unidad («Viaje a Cartagena, 12 a 17 de diciembre, 2 de 4 cupos, 86 % compatible, organiza Laura, identidad verificada»); el mapa tiene siempre su equivalente en lista.
- Botón de seguridad alcanzable con lector de pantalla mediante acción personalizada y gesto alternativo (sin requerir mantener presionado: doble toque + confirmación).
- Texto dinámico hasta 200 % sin cortar contenido; «Reducir movimiento» y «Reducir transparencia» respetados.
- Formularios con errores descritos en texto, no solo en rojo.

### 7.2 Internacionalización (es · en · pt)
- Español de Latinoamérica como idioma base; inglés y portugués de Brasil desde el MVP.
- Presupuestar +35 % de longitud en botones y títulos (el portugués y el inglés técnico se alargan); nada de textos en imágenes.
- Fechas, horas, monedas y números con formato local (`12 dic` / `Dec 12` / `12 de dez`; `$ 45.000` COP vs `R$ 45,00`); moneda del gasto independiente del idioma.
- Pluralización con ICU MessageFormat; género neutro donde sea posible («Te damos la bienvenida» en vez de «Bienvenido/a»).
- Perfil muestra los idiomas que habla cada persona: es criterio de compatibilidad.

### 7.3 Estados vacíos, errores y microcopy
Tono: cálido, breve, sin culpas, siempre con una salida. **Champi**, la seta de Lumen, aparece pequeño (máx. 64 pt) y solo en estados vacíos y celebraciones, con su farolito; nunca en errores de seguridad ni en pantallas de reporte.

| Situación | Microcopy (es) |
| --- | --- |
| Sin viajes aún | (Champi con farol) «Todavía no hay rutas por aquí. Enciende la primera.» → [Crear itinerario] |
| Explorar sin resultados | «No encontramos viajes con esos filtros. Prueba fechas flexibles o amplía el presupuesto.» → [Ajustar filtros] |
| Bandeja de mensajes vacía | (Champi) «Silencio de carretera. Cuando te unas a un viaje, aquí empieza la conversación.» |
| Gastos vacíos | «Nadie ha pagado nada… todavía. Anota el primer gasto y nosotros hacemos las cuentas.» |
| Sin conexión | «Estás sin señal. Tu itinerario sigue disponible; enviaremos lo pendiente cuando vuelvas.» |
| Error genérico | «Algo se nos apagó. Intenta de nuevo en un momento.» → [Reintentar] |
| Solicitud rechazada | «Este viaje no tiene espacio para ti esta vez. Hay otros parecidos esperándote.» → [Ver similares] |
| Verificación pendiente | «Estamos revisando tu identidad; suele tardar unos minutos. Mientras, puedes seguir planeando.» |
| Verificación fallida | «No pudimos confirmar tu documento. Revisa que la foto se vea completa y con buena luz.» → [Intentar de nuevo] |
| Alerta de seguridad enviada | «Listo. Avisamos a Camila y Andrés con tu ubicación. Si estás en peligro, llama al 123.» |

---

*Diseñado por Lumen Studio.* Pendiente de alinear con `02-producto-mvp-roadmap.md` (alcance del MVP) y `05-confianza-y-seguridad.md` (niveles de verificación y protocolo SOS) cuando estén disponibles.
