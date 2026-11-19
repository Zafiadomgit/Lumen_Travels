# Estilo visual de Lumen Travels

**Responsable:** ilustrador · **Estado:** v1 · Se aplica a todas las escenas, a la og-image y a cualquier imagen nueva de la landing y de la app en modo claro.

## La idea en una frase
**Pósters de turismo modernos pintados en gouache, a la hora dorada.** Cada escena es una lámina de revista de viajes de alta gama: un lugar real de Colombia contado con pocas formas, mucha calma, luz baja de la tarde y papel crema que se nota. No es foto, no es flat vector de banco de imágenes: es ilustración pintada, con mano y con criterio.

## Técnica
- Gouache mate y opaco, con pincelada visible y algo de pincel seco en los bordes. Formas simplificadas pero con detalle donde importa (balcones, cabinas del Metrocable, rocas de Tayrona).
- Planos superpuestos con perspectiva atmosférica: lo lejano se aclara y se vuelve crema; lo cercano gana tinta y contraste.
- Herramienta: **Krea 3** (conector ElevenLabs), a 2K. Lo elegimos porque es el modelo pensado para looks dirigidos por arte: respeta mejor una técnica pictórica concreta y una paleta corta que los modelos generalistas, que tienden a la foto o al render 3D. Los modelos con fuerte render de texto (GPT Image, Flux 3) no aportan aquí, porque las escenas no llevan texto.

## Paleta
Construida para vivir sobre el fondo crema `#f6f4ef` de Lumen sin pelear con él.

| Papel | Color | Dónde |
| --- | --- | --- |
| Cielo y papel | crema `#f6f4ef` → `#efe3cc` | Cielos, brumas, luz rebotada. El cielo casi se funde con la página. |
| Arena y ocre | `#d9b98a` · `#c9974f` | Muros, caminos, playas, tierra. |
| Terracota | `#b8613a` | Tejados, ladrillo de Medellín, fachadas cálidas. |
| Verdes apagados | salvia `#8f9b74` · oliva `#55613f` | Montaña, café, selva. Nunca verde saturado. |
| Mar | teal polvoriento `#4f8a86` | Caribe, sombras frías mínimas. |
| Sombras | tinta cálida `#141218` a `#3a3330` | Sombras profundas; nunca negro puro ni gris frío. |
| Brillo | dorado `#e8a33a` | Solo destellos: borde de las nubes, ventanas, reflejos. |

## Luz
- Sol bajo de la tarde entrando por la izquierda, sombras largas y suaves.
- Un solo foco de luz cálida por escena; el resto, medios tonos tranquilos.

## Encuadre
- Mucho aire arriba: el tercio superior es cielo crema tranquilo, para que el texto de la maqueta pueda respirar o sobreponerse sin cajas.
- Horizonte bajo o medio, una sola idea por lámina, un punto de interés claro.
- Hero en 16:9; ciudades en 4:5 vertical.
- Figuras humanas pequeñas, lejanas y de espaldas, en parejas o grupos de tres: es el «viajar acompañado». Nunca caras, nunca retratos, nada que parezca un usuario o un testimonio.

## Textura
- Grano fino de papel y pigmento en toda la imagen. Sin degradados digitales lisos ni brillos de render.

## Qué evitar
- Foto realista, render 3D, HDR, colores saturados de postal.
- Flat vector con formas geométricas y sombras largas de plantilla.
- Escenas nocturnas (eso era la versión anterior) y neones.
- Texto, letreros, carteles, logos o marcas de agua dentro de la imagen.
- Caras reconocibles, manos en primer plano, multitudes.
- Clichés: sombreros vueltiaos, banderas, café humeante en primer plano.

## Prompt base (idéntico en todas las escenas)
Solo cambia la línea «Scene:».

> Editorial travel illustration in the style of a modern tourism poster, painted in matte opaque gouache with visible brushwork, subtle dry-brush edges and fine cream paper grain. Simplified, elegant shapes with selective detail and layered atmospheric perspective: distant planes fade into warm cream haze. Late-afternoon golden-hour light from a low sun on the left, long soft warm shadows. Restrained palette: warm cream sky (#f6f4ef), sand and ochre, terracotta, muted sage and deep olive greens, dusty teal sea, warm charcoal-ink shadows (#141218), small honey-gold highlights (#e8a33a). Calm, airy composition with generous quiet cream sky in the upper third, high-end travel magazine quality. Any people are tiny, distant and seen from behind. Clean image with no lettering, no signage and no border. Scene: …

## Uso en la página
- Sobre crema, las escenas van sin marco ni sombra: el cielo crema se funde con la página. Si hace falta separar, un radio de 20–28 px basta.
- Las escenas se presentan como **ilustración**, no como foto documental.
- Firma del conjunto: «Ilustraciones generadas para Lumen Studio · Diseñado por Lumen Studio».
