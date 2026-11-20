# Entrega de arte · landing de Lumen Travels (modo claro)

**Responsable:** ilustrador · **Fecha:** 2026-11-19 · **Estilo:** ver `docs/arte/estilo.md`

## Estado en una línea
Listos y revisados: iconos, hero, Medellín, Bogotá, Cartagena, Tayrona y og-image (con el hero de fondo). Las cinco escenas que usa el HTML están completas. Solo queda Santa Marta–Minca, que es opcional porque el HTML actual no la usa; no se generó.

## Archivos

| Archivo | Medidas | Peso | Proporción | Uso sugerido | Estado |
| --- | --- | --- | --- | --- | --- |
| `site/landing/assets/icons/sprite.svg` | 24 símbolos, viewBox 24×24 | 5,7 KB | 1:1 | Todos los iconos de la landing | Listo |
| `site/landing/assets/icons/LICENSE-icons.txt` | — | 3,4 KB | — | Licencia del set (ISC, y MIT para lo que viene de Feather) | Listo |
| `site/landing/assets/art/og-image.jpg` | 1200×630 | 127 KB | 1,91:1 | `og:image` y `twitter:image` | Listo: hero de fondo, llama y texto en Plus Jakarta Sans |
| `site/landing/assets/art/hero-2400.webp` | 2400×1350 | 195 KB | 16:9 | Hero, `srcset` 2400w | Listo |
| `site/landing/assets/art/hero-1200.webp` | 1200×675 | 72 KB | 16:9 | Hero, `srcset` 1200w; celular | Listo |
| `site/landing/assets/art/medellin-1200.webp` / `-640.webp` | 1200×1500 / 640×800 | 126 / 40 KB | 4:5 | Parada 1 de la ruta | Listo (recorte a 4:5 desde 1824×2288) |
| `site/landing/assets/art/bogota-1200.webp` / `-640.webp` | 1200×1500 / 640×800 | 213 / 50 KB | 4:5 | Parada 2 | Listo (recorte a 4:5; retocado: se quitaron cuatro avioncitos que el modelo pintó en la bruma) |
| `site/landing/assets/art/cartagena-1200.webp` / `-640.webp` | 1200×1500 / 640×800 | 193 / 72 KB | 4:5 | Parada 3 | Listo (recorte a 4:5; retocado: se quitaron dos avioncitos que el modelo pintó en el cielo junto a la torre) |
| `site/landing/assets/art/santa-marta-1200.webp` / `-640.webp` | 1200×1500 / 640×800 | < 220 / < 90 KB | 4:5 | Alternativa o complemento para la parada Santa Marta–Tayrona; el HTML actual no la usa | Opcional, sin generar |
| `site/landing/assets/art/tayrona-1200.webp` / `-640.webp` | 1200×1500 / 640×800 | 164 / 47 KB | 4:5 | Parada «Santa Marta–Tayrona»: es la que espera el HTML (`tayrona-*.webp`) | Listo (recorte a 4:5) |
| `site/landing/assets/art/mapa-2720.webp` / `-1600.webp` / `-960.webp` | 2720×1536 / 1600×904 / 960×542 | 448 / 212 / 96 KB | 16:9 | Mapa ilustrado de la ruta, debajo de la línea dorada animada en HTML; `srcset` 2720w, 1600w y 960w | Listo: revisado en grande, sin letras ni firmas, no hizo falta retoque. Coordenadas en `docs/arte/mapa-coordenadas.md` |
| `docs/arte/procesar-arte.py` | — | — | — | Recorta, exporta los WebP, compone la og-image con el hero y arma la hoja de contacto | Listo |

Para el `srcset` de las verticales: `medellin-640.webp 640w, medellin-1200.webp 1200w` con `sizes="(min-width: 960px) 360px, 100vw"`.

## Cómo terminar las escenas
1. En el canvas de ElevenLabs (flujo «Lumen Travels · escenas landing», https://elevenlabs.io/app/flows/PQQ4BPEnICmCS8KqzL16) ya están los seis nodos de Krea 3 con el prompt y los ajustes definitivos (4:5 o 16:9, 2K, calidad):
   - `hero`, `medellin` y `bogota`: generados, descargados, revisados y procesados.
   - `cartagena` y `tayrona`: generados el 2026-11-20, descargados, revisados y procesados.
   - `santa-marta-minca`: opcional, sin generar. Si algún día se quiere, se ejecuta el nodo **una vez** con 1 variación (unos 600 créditos).
2. Guarda los PNG en una carpeta con estos nombres: `hero.png`, `medellin.png`, `bogota.png`, `cartagena.png`, `santa-marta.png`, `tayrona.png`.
3. Ejecuta:
   `python3 -I docs/arte/procesar-arte.py <carpeta> <hoja.png> PlusJakartaSans-700.ttf PlusJakartaSans-500.ttf`
   Exporta los WebP con el peso objetivo, rehace la og-image con el hero y arma la hoja de contacto.
4. Antes de publicar, **mira cada imagen**: que no tenga texto, caras ni manos deformes, y que se vea del mismo estilo que las demás. Si alguna falla de verdad, se hace como máximo una toma nueva con el prompt corregido.

El dominio `elevenlabsusercontent.com` ya está permitido en la red de la sesión: cuando se generen las cuatro que faltan, el ilustrador las descarga, revisa y procesa en una pasada.

## Texto alternativo

Todos los textos de las escenas generadas están revisados contra la imagen final. El de Santa Marta–Minca describe lo que pidió el prompt: ajústalo si se llega a generar.

| Escena | ES | EN |
| --- | --- | --- |
| hero | Ilustración: tres viajeros pequeños, de espaldas, caminan juntos por un sendero de montaña entre cafetales; abajo, valles verdes y un río dorado al atardecer. | Illustration: three small travelers, seen from behind, walk together along a mountain path through coffee fields, above green valleys and a river glowing at sunset. |
| medellín | Ilustración de Medellín: cabinas del Metrocable sobre las casas de ladrillo de la ladera, con el valle de Aburrá al fondo. | Illustration of Medellín: Metrocable cable cars glide over hillside brick houses, with the Aburrá Valley below. |
| bogotá | Ilustración de Bogotá: calle empedrada de La Candelaria con casas blancas y ocres de balcones de madera; dos viajeros pasean juntos y al fondo se alza el cerro de Monserrate con su santuario. | Illustration of Bogotá: a cobblestone street in La Candelaria lined with white and ochre houses with wooden balconies; two travelers stroll together beneath Monserrate hill and its sanctuary. |
| cartagena | Ilustración de Cartagena: calle estrecha de la ciudad amurallada entre fachadas ocres y rojizas con balcones de madera y buganvilias; dos viajeros caminan juntos hacia la torre y la cúpula de la catedral. | Illustration of Cartagena: a narrow street in the walled city between ochre and red facades with wooden balconies and bougainvillea; two travelers walk together toward the cathedral's tower and dome. |
| santa-marta (Minca) | Ilustración de Minca: terraza de una finca cafetera con dos hamacas, frente a montañas con niebla que bajan hasta el mar de Santa Marta. | Illustration of Minca: a coffee farm terrace with two hammocks, facing misty mountains that roll down to the sea at Santa Marta. |
| tayrona | Ilustración del Parque Tayrona: cala de arena clara con grandes rocas redondas, palmeras y una cabaña de palma sobre la punta; dos viajeros sentados en la playa miran el mar al atardecer. | Illustration of Tayrona National Park: a pale sandy cove with large rounded boulders, palm trees and a thatched hut on the point; two travelers sit on the beach watching the sea at sunset. |
| mapa de la ruta | Ilustración: mapa pintado del norte de Colombia a vista de pájaro, con el mar Caribe al fondo, las cordilleras andinas en relieve dorado y el río Magdalena serpenteando por el valle. Hay pequeñas viñetas de Cartagena amurallada en la costa, Medellín con su Metrocable entre montañas, Bogotá al pie de Monserrate, y una bahía con rocas redondas y palmeras bajo la Sierra Nevada nevada. | Illustration: a painted bird's-eye map of northern Colombia, with the Caribbean Sea in the distance, the Andes in golden relief and the Magdalena River winding through the valley. Small vignettes show walled Cartagena on the coast, Medellín with its Metrocable among the mountains, Bogotá beneath Monserrate, and a bay with round boulders and palms below the snowy Sierra Nevada. |

## Crédito y origen
- Escenas: «Ilustraciones generadas para Lumen Studio» (Krea 3 en ElevenLabs, dirigidas con el prompt base de `estilo.md`). Se presentan como ilustración, no como foto documental. Sin personas reconocibles.
- Mapa ilustrado de la ruta: «Ilustración generada para Lumen Studio» (Krea 3 en ElevenLabs, con el prompt del ilustrador basado en `estilo.md`; lo generó el dueño desde su cuenta). Es una ilustración, no un mapa cartográfico: la geografía es plausible, no exacta. La línea de la ruta y los nombres se superponen en HTML. En la versión 2720 se suavizó apenas el grano (desenfoque de 0,5 px) para que pesara menos de 500 KB.
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
