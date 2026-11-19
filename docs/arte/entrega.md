# Entrega de arte · landing de Lumen Travels (modo claro)

**Responsable:** ilustrador · **Fecha:** 2026-11-19 · **Estilo:** ver `docs/arte/estilo.md`

## Estado en una línea
Iconos listos. Escenas **incompletas**: el hero y Medellín ya se generaron, pero la red de esta sesión no deja descargarlas, y las otras cuatro no arrancaron porque la cuenta de ElevenLabs llegó al límite diario de imágenes del plan gratuito. La og-image que hay ahora es **provisional** (sin arte).

## Archivos

| Archivo | Medidas | Peso | Proporción | Uso sugerido | Estado |
| --- | --- | --- | --- | --- | --- |
| `site/landing/assets/icons/sprite.svg` | 24 símbolos, viewBox 24×24 | 5,7 KB | 1:1 | Todos los iconos de la landing | Listo |
| `site/landing/assets/icons/LICENSE-icons.txt` | — | 3,4 KB | — | Licencia del set (ISC, y MIT para lo que viene de Feather) | Listo |
| `site/landing/assets/art/og-image.jpg` | 1200×630 | 23 KB | 1,91:1 | `og:image` y `twitter:image` | Provisional: llama + texto sobre crema, sin arte |
| `site/landing/assets/art/hero-2400.webp` | 2400×1350 | < 220 KB | 16:9 | Hero, `srcset` 2400w | Pendiente de descarga |
| `site/landing/assets/art/hero-1200.webp` | 1200×675 | < 90 KB | 16:9 | Hero, `srcset` 1200w; celular | Pendiente de descarga |
| `site/landing/assets/art/medellin-1200.webp` / `-640.webp` | 1200×1500 / 640×800 | < 220 / < 90 KB | 4:5 | Parada 1 de la ruta | Pendiente de descarga |
| `site/landing/assets/art/bogota-1200.webp` / `-640.webp` | 1200×1500 / 640×800 | < 220 / < 90 KB | 4:5 | Parada 2 | Pendiente de generar |
| `site/landing/assets/art/cartagena-1200.webp` / `-640.webp` | 1200×1500 / 640×800 | < 220 / < 90 KB | 4:5 | Parada 3 | Pendiente de generar |
| `site/landing/assets/art/santa-marta-1200.webp` / `-640.webp` | 1200×1500 / 640×800 | < 220 / < 90 KB | 4:5 | Parada 4 (Santa Marta–Minca) | Pendiente de generar |
| `site/landing/assets/art/tayrona-1200.webp` / `-640.webp` | 1200×1500 / 640×800 | < 220 / < 90 KB | 4:5 | Parada 4 o cierre | Pendiente de generar |
| `docs/arte/procesar-arte.py` | — | — | — | Recorta, exporta los WebP, compone la og-image con el hero y arma la hoja de contacto | Listo |

Para el `srcset` de las verticales: `medellin-640.webp 640w, medellin-1200.webp 1200w` con `sizes="(min-width: 960px) 360px, 100vw"`.

## Cómo terminar las escenas
1. En el canvas de ElevenLabs (flujo «Lumen Travels · escenas landing», https://elevenlabs.io/app/flows/PQQ4BPEnICmCS8KqzL16) ya están los seis nodos de Krea 3 con el prompt y los ajustes definitivos (4:5 o 16:9, 2K, calidad):
   - `hero` y `medellin`: generados. Descarga el PNG original de cada uno.
   - `bogota`, `cartagena`, `santa-marta-minca` y `tayrona`: sin generar. Ejecuta cada nodo **una vez** con 1 variación cuando se renueve el cupo diario o si se sube de plan (unos 600 créditos por imagen).
2. Guarda los PNG en una carpeta con estos nombres: `hero.png`, `medellin.png`, `bogota.png`, `cartagena.png`, `santa-marta.png`, `tayrona.png`.
3. Ejecuta:
   `python3 -I docs/arte/procesar-arte.py <carpeta> <hoja.png> PlusJakartaSans-700.ttf PlusJakartaSans-500.ttf`
   Exporta los WebP con el peso objetivo, rehace la og-image con el hero y arma la hoja de contacto.
4. Antes de publicar, **mira cada imagen**: que no tenga texto, caras ni manos deformes, y que se vea del mismo estilo que las demás. Si alguna falla de verdad, se hace como máximo una toma nueva con el prompt corregido.

Otra opción: si el gerente permite el dominio `elevenlabsusercontent.com` en la red de la sesión, el ilustrador descarga, revisa y procesa todo en una pasada.

## Texto alternativo

Ajusta el texto alternativo cuando veas la imagen final: describe lo que el prompt pidió.

| Escena | ES | EN |
| --- | --- | --- |
| hero | Ilustración: tres viajeros pequeños, de espaldas, caminan juntos por un sendero de montaña entre cafetales; abajo, valles verdes y un río dorado al atardecer. | Illustration: three small travelers, seen from behind, walk together along a mountain path through coffee fields, above green valleys and a river glowing at sunset. |
| medellín | Ilustración de Medellín: cabinas del Metrocable sobre las casas de ladrillo de la ladera, con el valle de Aburrá al fondo. | Illustration of Medellín: Metrocable cable cars glide over hillside brick houses, with the Aburrá Valley below. |
| bogotá | Ilustración de Bogotá: calle empedrada de La Candelaria con balcones de madera; al fondo, el cerro de Monserrate con su santuario blanco. | Illustration of Bogotá: a cobblestone street in La Candelaria with wooden balconies, and Monserrate hill with its white sanctuary behind. |
| cartagena | Ilustración de Cartagena: calle de la ciudad amurallada con fachadas ocres, balcones con buganvilias y la cúpula de una iglesia al fondo. | Illustration of Cartagena: a street in the walled city with ochre facades, balconies with bougainvillea and a church dome at the end. |
| santa-marta (Minca) | Ilustración de Minca: terraza de una finca cafetera con dos hamacas, frente a montañas con niebla que bajan hasta el mar de Santa Marta. | Illustration of Minca: a coffee farm terrace with two hammocks, facing misty mountains that roll down to the sea at Santa Marta. |
| tayrona | Ilustración del Parque Tayrona: playa de Cabo San Juan con grandes rocas redondas, palmeras y una cabaña sobre la punta. | Illustration of Tayrona National Park: Cabo San Juan beach with large rounded boulders, palm trees and a hut on the point. |

## Crédito y origen
- Escenas: «Ilustraciones generadas para Lumen Studio» (Krea 3 en ElevenLabs, dirigidas con el prompt base de `estilo.md`). Se presentan como ilustración, no como foto documental. Sin personas reconocibles.
- og-image: compuesta con Pillow; tipografía Plus Jakarta Sans (Google Fonts, licencia OFL) y el símbolo de la llama de Lumen.
- Iconos: Lucide v1.76.0 (https://lucide.dev), licencia ISC. Ver `LICENSE-icons.txt`.

## Iconos

**Set:** Lucide, en lugar de Phosphor. El pedido del diseñador (`pedido-iconos.md`) pide iconos de trazo en 24×24, con extremos redondeados, que se pinten con `stroke` desde el CSS. Phosphor dibuja con relleno y en 256×256; Lucide es de trazo nativo en 24×24 y encaja sin trucos.

Los símbolos no fijan color ni trazo. La landing debe aplicar:
```css
.icon { width: 24px; height: 24px; fill: none; stroke: currentColor; stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round; }
```

| id | Icono de Lucide | Notas |
| --- | --- | --- |
| `ic-plan` | map | Mapa doblado |
| `ic-match` | merge | Dos caminos que se unen en uno |
| `ic-group` | users | Dos personas, sin caras |
| `ic-shield` | shield-check | Escudo con visto |
| `ic-id` | id-card | Documento con foto |
| `ic-review` | messages-square | Dos burbujas: reseñas de ambas partes |
| `ic-pin` | map-pin | Punto de encuentro |
| `ic-sos` | shield-alert | Escudo con alerta, distinto de `ic-shield` |
| `ic-flag` | flag | Reportar |
| `ic-check` | check | |
| `ic-close` | x | |
| `ic-arrow-down` | arrow-down | |
| `ic-chevron` | chevron-down | |
| `ic-plus` | plus | Pedido del diseñador |
| `ic-calendar` | calendar | |
| `ic-globe` | globe | Idioma |
| `ic-sparkle` | sparkles | |
| `ic-wallet` | wallet | Gastos |
| `ic-chat` | message-circle | |
| `ic-medellin` | cable-car | Cabina del Metrocable |
| `ic-bogota` | church | Iglesia; Lucide no tiene cerro con iglesia |
| `ic-cartagena` | castle | Muralla; Lucide no tiene la Torre del Reloj |
| `ic-santamarta` | haze | Sol sobre el horizonte del mar |
| `ic-tayrona` | tree-palm | Palmera |

Los 18 iconos del encargo y los 6 extra del diseñador (`ic-plus` y los cinco de ciudades) están cubiertos.
