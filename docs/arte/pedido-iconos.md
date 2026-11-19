# Pedido de iconos · landing de Lumen Travels (modo claro)

Lo pide el diseñador para la maqueta de `site/landing/`. Todos van como `<symbol id="ic-…">` en `site/landing/assets/icons/sprite.svg`.

## Cómo se usan
- Se pintan con `currentColor` y con trazo, nunca con relleno fijo. Así cambian de color con el texto: tinta `#141218`, secundario `#635b4f`, dorado de texto `#9a6a10`, verificado `#0f7468` y blanco sobre el rojo de seguridad.
- `viewBox="0 0 24 24"`, trazo de 1,75 px a 24 px, con extremos y uniones redondeadas. La landing aplica `stroke="currentColor"`, `fill="none"`, `stroke-linecap/linejoin="round"` y `stroke-width` desde el CSS; el símbolo no debe fijarlos.
- Se ven a 20, 24 y 28 px y deben leerse bien a 20 px.
- Sin texto, sin degradados y sin emojis. Un mismo sistema: misma retícula, mismo grosor y esquinas de 2 px.

## Lista

| id | Dónde se usa | Qué debe sugerir |
| --- | --- | --- |
| `ic-plan` | Parada 1 de la ruta, «Planea» | Un mapa doblado o un itinerario con días |
| `ic-match` | Parada 2, «Coincide» | Dos caminos que se cruzan en un punto |
| `ic-group` | Parada 3, «Viajen juntos» | Un grupo pequeño, de 2 o 3 personas, sin caras |
| `ic-shield` | Parada 4, «Confianza», y la frase «la seguridad nunca se cobra» | Escudo con un visto |
| `ic-id` | Seguridad: verificación con documento y selfie | Documento de identidad con foto |
| `ic-review` | Seguridad: reseñas de ambas partes | Dos burbujas o una estrella dentro de una burbuja |
| `ic-pin` | Seguridad: primer encuentro en un lugar público | Marcador de lugar |
| `ic-sos` | Seguridad: botón de seguridad, en blanco sobre rojo | Escudo o señal de ayuda, distinto de `ic-shield` |
| `ic-flag` | Seguridad: reportes y bloqueo | Bandera de reporte |
| `ic-check` | Chip del plan reservado y botón de plan reservado | Visto |
| `ic-close` | Quitar el plan reservado | Equis |
| `ic-arrow-down` | Reservado para un enlace de bajar a la lista (opcional) | Flecha hacia abajo |
| `ic-chevron` | Flecha del selector de país | Galón hacia abajo |
| `ic-plus` | Chip «Otra» ciudad y preguntas frecuentes (abrir) | Más |
| `ic-medellin` | Chip de ciudad | Cabina del Metrocable |
| `ic-bogota` | Chip de ciudad | Cerro con la iglesia de Monserrate |
| `ic-cartagena` | Chip de ciudad | Torre del Reloj |
| `ic-santamarta` | Chip de ciudad | Sol sobre el mar |
| `ic-tayrona` | Chip de ciudad | Palmera |

## Escenas (las define el ilustrador; aquí solo el hueco que dejó la maqueta)
- Hero: 1 escena en 16:9 horizontal, a todo el ancho del contenido (hasta 1320 px en pantalla).
- Ruta: 4 escenas en 4:5 vertical, una por parada: Medellín, Bogotá, Cartagena y Santa Marta–Tayrona. Se ven a unos 360 px de ancho en escritorio y a todo el ancho en celular.
- Las escenas son de lugares, no de personas. Van sobre el fondo `#f6f4ef` con una línea de 1 px `#e6e0d4` y radio de 6 px.
