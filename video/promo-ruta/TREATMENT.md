# promo-ruta · Lumen Travels · tratamiento

**Duración:** 30 s · **Formatos:** 16:9 (1920×1080) y 9:16 (1080×1920), 30 fps · **Idioma en pantalla:** español · **Voz:** ninguna.
La app todavía no existe: el video habla de «lista de espera» y «muy pronto».

## Estilo elegido
**Lemo-Opuscar · Watercolor Brush (水彩笔刷)**, adaptado. Su gramática es la de un papel que se pinta solo: pasadas de pincel con cerdas y «blanco volado», bordes de pincel seco, niebla de papel que borra, una sola hoja cálida debajo de todo. Encaja con nuestras láminas de gouache porque comparte la luz baja, el papel crema y la paleta corta; el papel es el `#f6f4ef` de Lumen. Lo adaptamos así: el arte ya existe (no se genera nada nuevo), la ruta es una pincelada dorada `#e8a33a` con cerdas, los cambios de escena son un borde de pincel seco que barre el papel, y la tipografía es la de la marca (Plus Jakarta Sans y Manrope), no la caligrafía del estilo.

## Tres estructuras candidatas
1. **Cuaderno de viaje por hojas:** cada ciudad es una hoja que se pasa. Limpia, pero no deja ver el recorrido completo.
2. **Cuenta atrás de mensajes:** cuatro frases grandes con una imagen detrás. Rápida, pero parece anuncio genérico.
3. **Un solo viaje sobre el mapa que luego se «entra» ciudad por ciudad.** Primero el panorama (la ruta dibujándose), luego cada parada de cerca, y al final se vuelve al papel con la marca.

**Elegida: la 3.** Cuenta lo que hace la app (planear una ruta, encontrar gente que va al mismo lugar) en el orden en que lo vive el viajero, y el mapa pintado que ya teníamos es el protagonista.

## Logline y arco
*Una llama dorada recorre Colombia y, parada a parada, te enseña que el viaje se planea mejor con gente que va a tu mismo lugar.*
Apertura (el sendero cafetero, con tres viajeros de espaldas) → giro (la ruta se dibuja sobre el mapa y aparecen los viajeros) → cierre (vuelve el papel, el símbolo de Lumen y la invitación).

## Referencia (solo gramática)
- Mapas de viaje animados de documental: la línea que se dibuja con la cámara siguiendo la punta, y la vuelta atrás a la vista completa. **No se toma** ningún mapa, ruta ni diseño concreto.
- Láminas de cuaderno de campo en acuarela: el papel como borrador y como fondo. **No se toma** ninguna obra.

## Escenas (cortes de pincel en los segundos 0, 4,5, 10,5, 14, 17,5, 21 y 24,5)
| t (s) | Escena | Plano y cámara | Texto |
| --- | --- | --- | --- |
| 0–4,5 | Hero: sendero cafetero | Gran plano, empuje lento; en 9:16 la cámara se desliza hasta los tres caminantes | «Planea tu ruta por Colombia.» |
| 4,5–10,5 | Mapa pintado | La ruta dorada se dibuja Medellín → Bogotá → Cartagena → Santa Marta → Tayrona; la cámara sigue la llama y al final se aleja | «Encuentra viajeros que van a donde tú vas.» |
| 10,5–14 | Medellín | Lámina a escala 1:1, subida de cámara muy lenta | «Medellín · Aquí empieza.» |
| 14–17,5 | Bogotá | idem | «Bogotá · Viajen juntos.» |
| 17,5–21 | Cartagena | idem | «Cartagena · Gente verificada.» |
| 21–24,5 | Tayrona | idem | «Tayrona · Y el mar al final.» |
| 24,5–30 | Cierre sobre papel | La llama de Lumen entra con un rebote y respira; el mapa queda como eco | «MUY PRONTO · Tu ruta, tu gente. · Únete a la lista de espera · lumentravels.vercel.app · Diseñado por Lumen Studio» |

**Movimiento propio del medio:** la pincelada de la ruta (cinta de ancho irregular + cerdas) y el borde de pincel seco que cambia de escena (de izquierda a derecha en 16:9, de abajo hacia arriba en 9:16). Cuatro movimientos de cámara distintos: empuje, deslizamiento, seguimiento con alejamiento final y subida lenta.

## Ritmo y lectura
Cada texto se queda en pantalla al menos `caracteres ÷ 15 + 1,5 s` (regla de la librería, comprobada con `readcheck`). Las paradas duran 3,5 s con 0,8 s de pincelada de entrada; la tarjeta final se sostiene unos 5 s. Es un video que se entiende **sin sonido**: toda la historia está en los textos.

## Zonas seguras en 9:16 (TikTok y Reels)
Texto entre y = 200 y y = 1400 px y entre x = 80 y x = 940: se evita el borde superior (≈ 200 px), la columna derecha de botones (≈ 120 px) y el pie con la descripción (≈ 450 px).

## Sonido
Música original sintetizada con el modelado de cuerdas de la librería (`pluck.py`: guitarra de nailon, kalimba, arpa, caja de música y contrabajo en pizzicato) y un colchón de senos suave, en sol mayor, 120 bpm; la rejilla se reinicia en cada corte para que cada escena nueva caiga en tiempo. Un susurro de pincel sobre papel acompaña cada barrido. No hay muestras de terceros ni voz. Master a −14 LUFS. Los MP4 sin música quedan aparte.
