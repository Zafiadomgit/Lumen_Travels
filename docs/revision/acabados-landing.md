# Auditoría de acabados · landing de Lumen Travels

**Revisado:** versión local de `site/landing/` (index, styles, app, fx, privacidad) servida con `python3 -m http.server` y Chromium/Playwright, con Supabase simulado (no se escribió en la base real).
**Cobertura:** 8 anchos (1920, 1440, 1280, 1024, 768, 390, 375, 360) × ES/EN × variantes A/B a `deviceScaleFactor: 2`, más estados del formulario, plan reservado, foco por teclado, `prefers-reduced-motion`, LCP/CLS, contraste, objetivos táctiles y la página de privacidad.
**Referencia de comparación:** `/home/user/zafiadomgit/lumen_web_site/` (modo claro de lumenestudio.tech).
**No cuentan (ya conocidos):** escenas de Cartagena y Tayrona, datos legales marcados en la política.
**No pude revisar la versión publicada:** el proxy bloquea `lumentravels.vercel.app`; todo es sobre el código local. Tampoco pude confirmar cómo se ve la 404 en vivo, solo que el repositorio no trae una propia.

Carpeta de capturas: `/tmp/claude-0/-home-user-Lumen-Travels/d917c94e-07ce-54bf-a068-720fce91430c/scratchpad/revision/` (abajo, `REV/`). Nombres: `{idioma}-{variante}-{ancho}-{fold|hero|route|safety|pricing|join|faq-sec|footer|full}.png`, `sec-…` (viewport por sección), `route-…-stopN.png`, `st-…` (estados). Ojo: las capturas por elemento (`es-A-1440-route.png`, etc.) salen con la barra fija superpuesta; para secciones con sticky usa las `sec-…` y `route-…`.

**Resumen: 34 hallazgos · 6 P1 · 17 P2 · 11 P3**

---

## P1 · se nota y afea

### P1-1 · Favicon y apple-touch-icon son el farol pixel art viejo, no el símbolo de Lumen
- **Qué pasa:** la pestaña y el icono al guardar en iOS/Android muestran el farol dorado pixel art con fondo transparente. La página entera usa el símbolo nuevo (círculo tinta con llama). El apple-touch-icon (180 px, RGBA transparente) en iOS se pinta sobre negro. No hay SVG/ICO ni tamaños 192/512 ni manifest. Todos los anchos e idiomas; también `privacidad.html`.
- **Captura:** `REV/icons.png` (apple-touch a la izquierda, favicon ampliado a la derecha).
- **Código:** `index.html` L28-29 y el `<head>` de `privacidad.html`; `assets/brand/favicon.png` (64×64), `assets/brand/apple-touch-icon.png`.
- **Corrección:** exportar el símbolo (`#lumen-mark`) como `favicon.svg` + `favicon-32.png` + `favicon.ico`; apple-touch-icon 180 px **opaco** (círculo tinta con llama sobre `#f6f4ef` a sangre completa, sin transparencia); `icon-192.png`, `icon-512.png` y un `site.webmanifest` con `theme_color: #f6f4ef`. Enlazar el SVG con `sizes="any"`.

### P1-2 · La tarjeta del mapa da kilómetros que no son «en línea recta desde Medellín»
- **Qué pasa:** en las paradas 3 y 4 el texto dice «Unos 890 km / 1.080 km en línea recta desde Medellín» (EN: «About 890 / 1,080 km in a straight line from Medellín»). Calculado con haversine: Medellín–Cartagena ≈ 461 km y Medellín–Tayrona ≈ 587 km en línea recta. Los 890 y 1.080 son la suma de tramos (240 + 650 + 190), no la distancia desde Medellín. Es una cifra mal rotulada, justo en lo que la regla del proyecto prohíbe. Paradas 3 y 4, todos los anchos, ES y EN.
- **Captura:** `REV/route-es-1440-stop3.png`, `REV/route-es-1440-stop4.png`, `REV/route-en-360-stop4.png` («About 1,080 km in a straight line»).
- **Código:** `fx.js` L99 `var KM = [0, 240, 890, 1080]`; textos `route.km` en `app.js` L112 (EN) y L217 (ES).
- **Corrección:** dos opciones coherentes. (a) Mantener el texto y poner `KM = [0, 239, 461, 587]` (cada una desde Medellín, y el avance interpolado sigue funcionando). (b) Mantener los acumulados y cambiar el texto a «Unos {km} km sumando los tramos entre ciudades» / «About {km} km adding up the legs». Recomiendo (b): coincide con lo que dibuja la ruta (Medellín → Bogotá → Cartagena). Redondear a decenas ya se hace; marcarlo «aprox.» como supuesto.

### P1-3 · Las etiquetas del mapa quedan ilegibles en celular (6–8 px)
- **Qué pasa:** en ≤999 px el mapa sticky mide ~250 px de ancho (escala 0,62 del viewBox 400×520), así que `Mar Caribe`, `Sierra Nevada`, `Santa Marta`, `N` salen a ~6–7 px y los nombres de ciudad a ~8 px. Es la pieza memorable de la página y en 390/375/360 no se lee. En el ancho de 360 la ruta dorada además tapa «Medellín».
- **Captura:** `REV/route-es-390-stop2.png`, `REV/route-en-360-stop4.png`, `REV/route-es-390-stop1.png`.
- **Código:** `styles.css` L216 `.map-label` (11 px), L232 `.pin-name` (13 px), `.pin-name--s` (11 px), `.map-north text` (10 px); L445-451 `.route-map` sticky y `.map-sheet { height: min(38svh, 380px) }`.
- **Corrección:** subir los tamaños de texto del SVG en móvil para que rindan ≥11 px reales (p. ej. en `@media (max-width: 999px)`: `.map-label{font-size:17px}`, `.pin-name{font-size:19px}`, `.pin-name--s{font-size:16px}`, `.map-north text{font-size:15px}`, `.pin.is-active .pin-name{font-size:23px}`), o escalarlos con una variable `--map-scale`. Quitar «Sierra Nevada» y las olas en móvil si estorban. Valorar poner la tarjeta de la parada debajo del mapa y dejar el mapa más ancho (ver P2-14).

### P1-4 · Tarjetas de precio desalineadas: el precio del Pase de viaje parte en dos líneas
- **Qué pasa:** «USD 4,99, pago único» ocupa dos líneas y «USD 3,99 al mes» una, así que las descripciones y los botones «Reservar mi lugar» quedan a distinta altura (botón del Plus a y≈735, del Pase a y≈722 en la captura). En EN pasa en **todos** los anchos («USD 4.99, one-time payment»); en ES en 1920, 1440, 1280, 1024. El comentario del CSS dice que los planes no deben pesar distinto, y aquí se nota.
- **Captura:** `REV/sec-es-A-1440-pricing.png`, `REV/st-plan-focus.png`.
- **Código:** `index.html` L222 y L228 (`.price`); textos `price.1price`/`price.2price` en `app.js` L61, L166; `styles.css` L299-306 (`.plan`, `.price`).
- **Corrección:** separar cifra y condición: `<p class="price"><span>USD 3,99</span> <small>al mes</small></p>` y `<span>USD 4,99</span> <small>pago único</small>`, con la condición en 1rem/500 y `white-space: nowrap` en la cifra. Además, para blindar la alineación: `.plans { grid-template-rows: auto }` y cada `.plan` con `display:grid; grid-template-rows: subgrid; grid-row: span 4` (o `.plan { display:flex; flex-direction:column }` + `.plan .btn { margin-top:auto }`). Ojo: `PLAN_LABEL` arma el chip con las dos claves; habrá que ajustar `renderPlanChip` para concatenar.

### P1-5 · En la página en español, el placeholder del correo sale en inglés
- **Qué pasa:** el campo de correo muestra «you@email.com» con la página en ES. Está fijo en el HTML y no pasa por i18n. Todos los anchos.
- **Captura:** `REV/sec-es-A-1440-join.png`, `REV/sec-es-B-390-join-b.png` (arriba, campo vacío).
- **Código:** `index.html` L270 `placeholder="you@email.com"`; `applyI18n()` en `app.js` ya soporta `data-i18n-attr`.
- **Corrección:** `data-i18n-attr="placeholder:form.emailPh"` con ES «tu@correo.com» y EN «you@email.com». (De paso el email de ejemplo ayuda a mostrar el formato.)

### P1-6 · Titular de precios en ES dice otra cosa: «¿Por qué pagarías?»
- **Qué pasa:** el original EN es «What would you pay for?» (¿por qué cosa pagarías?). «¿Por qué pagarías?» en español significa «¿por qué razón pagarías?», cambia el sentido de la prueba de precios y es el titular de la sección. ES, todos los anchos. También se parte en cuatro líneas en 1440 por el ancho de la columna.
- **Captura:** `REV/sec-es-A-1440-pricing.png`.
- **Código:** `app.js` L160 `'price.h'`.
- **Corrección:** «¿Por qué cosas pagarías? Ayúdanos a acertar.» o, más corto, «¿Qué pagarías? Ayúdanos a acertar.» Revisar también el `aria-label` del grupo de planes (usa la misma clave).

---

## P2 · pulido

### P2-1 · Apóstrofes y comillas rectas en el inglés (la política ya usa tipográficas)
- **Qué pasa:** 15 casos en la landing EN: don't, you're, that's, we're, we'll, you'd, I'm, `"Plus"`, `"Reserve my spot"`. En ES sí hay «» correctas, y `privacidad.html` EN usa ’. Inconsistencia visible en titulares de FAQ (`Can I join if I'm under 18?`) y en el pie.
- **Captura:** `REV/sec-en-B-1440-footer.png` (FAQ «I'm»), `REV/priv-en-390-top.png` (la política con ’ para comparar).
- **Código:** `app.js` bloque `T.en` (L11-120), p. ej. `'faq.8q'`, `'faq.4q'`, `'form.consentPre'`, `'err.server'`.
- **Corrección:** reemplazar ' por ’ y "…" por “…” en `T.en`; añadir una comprobación tonta (`grep -n "[A-Za-z]'[a-z]"`) antes de publicar.

### P2-2 · Viudas y huérfanas: una sola palabra en la última línea de muchos párrafos
- **Qué pasa:** `text-wrap: pretty` solo está en 5 selectores. Medido por JS en los 8 anchos: última línea de una palabra en `.plan-desc` («suscripción.», «subscription.»), `.safety-text` («construyendo:» en 1024/390/360), `.safety-close` («funciona.», «works.»), `.footer-small` («license).», «anything.»), `.pricing-head p` («nada.» en 360), `.free-safety`, resúmenes del FAQ («vez?» en 390/360, «me?» en 360), `.stop` (1024: «cuentas.», «budget.») y la nota del hero en ES 1440/1920 («tu gente.» sola).
- **Captura:** `REV/es-A-1440-fold.png` (lead del hero con «tu gente.» sola), `REV/sec-es-A-1440-safety.png`, `REV/sec-es-B-390-pricing.png`.
- **Código:** `styles.css` L303 `.plan-desc`, L289 `.safety-close`, L432 `.footer-small`, `.pricing-head p`, `.join-intro`, `.faq details p`, `.faq summary`, `.hero-lead` (L177).
- **Corrección:** regla global `p, li, summary, figcaption { text-wrap: pretty; }` y `h1, h2, h3, .price, .map-city { text-wrap: balance; }`. Para frases cortas clave (`.hero-lead`, `.safety-text`), `text-wrap: balance`. En el pie, `&nbsp;` entre «(ISC» y «license)». Para «Tu ruta, tu gente.» al final del lead, ponerlo en su propia línea a propósito o con `white-space: nowrap`.

### P2-3 · Barra superior y contenido no caen en la misma columna desde 1440 hacia arriba
- **Qué pasa:** `.topbar` usa `padding-inline: var(--m)` (80 px a 1920) pero hero, secciones y pie se centran en 1320 px (`@media (min-width: 1440px)`). A 1920: logo en x=80 y el símbolo/titular del hero en x=300. A 1600 pasa igual. Entre 1280 y 1440 coinciden. 
- **Captura:** `REV/es-A-1920-fold.png`.
- **Código:** `styles.css` L~118 `.topbar` y L486-491 (`@media (min-width: 1440px)`).
- **Corrección:** `.topbar { padding-inline: max(var(--m), calc((100vw - 1320px) / 2)); }` (la misma fórmula del bloque 1440). El hero-art sigue a sangre completa, que está bien.

### P2-4 · Primer pantallazo: en teléfonos chicos no se ve la pintura, y en 1280×720 EN el botón queda cortado
- **Qué pasa:** la escena del hero (el activo de marca) se ve 0–51 px en 360×740, 360×640 y 375×667; se ve ~190 px solo en 390×844. En 360×640 el botón principal queda fuera (bottom 642–669 px) y en 1280×720 EN también (731 px). Hay mucho cielo/blanco: lámpara (96 px) + insignia + titular de 4 líneas + 5 líneas de lead.
- **Captura:** `REV/fold360-es.png` (360×640), `REV/en-A-375-hero.png`, `REV/es-A-390-fold.png`.
- **Código:** `styles.css` L150-181 (`.lamp`, `.hero-badge`, `.hero h1`, `.hero-lead`), L460-464 (`@media (max-width: 719px)`).
- **Corrección:** en ≤719 px reducir `.mark--hero` a 56 px, quitar la insignia (ver P2-6), bajar `--t-hero` a ~2.4rem y recortar el lead a 3 líneas (`max-width: 36ch`). Objetivo: botón y ≥80 px de pintura sobre el pliegue en 375×667. En 1280×720 reducir `padding-top` del hero y `margin-top` de `.hero-lead`.

### P2-5 · El borde inferior de la pintura del hero termina en corte duro
- **Qué pasa:** el cielo sí se funde por arriba (máscara 0→26%), pero abajo la pintura (colinas verde oscuro) termina en una línea recta contra el crema de la sección siguiente. Se ve en todos los anchos; en 768 y 1440 es nítido. El estilo (`docs/arte/estilo.md`) pide fundir con la página, no cortar.
- **Captura:** `REV/crop-hero-bottom-1440.png` (la imagen ya acaba ahí), `REV/en-A-768-hero.png`, `REV/es-A-1440-hero.png`.
- **Código:** `styles.css` L183-187 `.hero-art img` (solo `mask-image` de arriba) y `.route` (L~195).
- **Corrección:** o bien un fundido corto abajo (`mask-image: linear-gradient(180deg, transparent 0, #000 26%, #000 94%, transparent 100%)` y que `.route` empiece con el crema), o un cierre deliberado: `border-bottom` de 1 px `--line` y `margin-bottom` pequeño. Elegir uno; recomiendo el fundido de 6 %.

### P2-6 · Rasgos de plantilla que sobrevivieron en el hero: rejilla, brillo, insignia y lámpara
- **Qué pasa:** (1) la **rejilla de 56 px** con máscara radial y el brillo que sigue al mouse (`.hero-grid`) es el fondo «tech» genérico y choca con la identidad de póster gouache de `estilo.md` (papel, grano, pincel). (2) La **insignia con punto** sobre el titular («Colombia, de Medellín a Tayrona») es el eyebrow/pill de hero estándar; la skill lo marca como rótulo innecesario. (3) El símbolo de 96 px + insignia + titular apilados hacen tres elementos antes del mensaje. Se ve en todos los anchos.
- **Captura:** `REV/es-A-1920-fold.png`, `REV/en-A-768-hero.png`.
- **Código:** `index.html` L65 (`.hero-grid`), L70 (`.hero-badge`); `styles.css` L140-149, L167-171; `fx.js` bloque «1. la luz».
- **Corrección:** quitar la rejilla y dejar solo el brillo cálido muy tenue o un grano de papel (SVG `feTurbulence` ya existe en el mapa: reutilizarlo con `multiply` al 4 %). Quitar la insignia (la frase ya está en el lead/alt) o convertirla en texto plano pequeño junto al CTA. Dejar el símbolo solo si es el «guiño» que se quiere; si no, que viva en la barra.

### P2-7 · Titular y eslogan forzados a minúscula (nombre propio) y puntuación separada en el eslogan del pie
- **Qué pasa:** `text-transform: lowercase` convierte «Colombia» en «colombia» («travel colombia with people…», «recorre colombia con gente…»), mientras la insignia justo encima escribe «Colombia, de Medellín a Tayrona». Y en el eslogan de 96 px del pie se ve un hueco antes de la coma y del punto («your route , your people .»). ES y EN, ≥1024 el hueco es muy visible.
- **Captura:** `REV/es-A-1920-fold.png`, `REV/sec-en-B-1440-footer.png`.
- **Código:** `styles.css` L175 `.hero h1`, L428 `.footer-slogan`, `.wordmark` (esa sí es marca); `letter-spacing: -.045em/-.05em`.
- **Corrección:** quitar `text-transform` del h1 y escribir el copy en frase normal con «Colombia» en mayúscula (la minúscula queda para el wordmark). Para el hueco de puntuación: probar `font-kerning: normal; font-feature-settings: "kern"` en `.footer-slogan`; si el subconjunto de fuente no trae el kern de `,` y `.`, envolver el signo en `<span style="margin-left:-.06em">`. No identifiqué con certeza la causa; verificar con el inspector antes de elegir.

### P2-8 · Casillas del formulario: tres pesos distintos y el texto legal en negrita
- **Qué pasa:** `.field label { font-weight: 700 }` alcanza a «Aún no lo sé» y al consentimiento (párrafo legal de 5–6 líneas en semi-negrita gris), pero «Quiero entrar al grupo de prueba…» (tarjeta) va en peso normal. En móvil el consentimiento es un bloque pesado y termina con «(obligatorio)» pegado a «(Ley 1581 de 2012 y GDPR.)».
- **Captura:** `REV/sec-es-B-390-join-b.png`, `REV/st-form-servererror-1440.png`.
- **Código:** `styles.css` L333 `.field label, .field legend`, L359-364 `.check`, `.consent .check`.
- **Corrección:** `.check { font-weight: 500 }` y `.consent .check { font-weight: 400 }`; mover «(obligatorio)» al principio («(obligatorio) Acepto que…») o quitarlo y usar `aria-required`. Poner la parte legal («Ley 1581…») en `.hint`.

### P2-9 · Tras unirte, el titular y la introducción siguen invitando a unirse
- **Qué pasa:** con la confirmación visible, la columna izquierda sigue diciendo «Únete a la lista de espera / Déjanos tus datos y te escribimos…» y la derecha «Ya estás en la lista». El símbolo sí se enciende (bien). Además, el farol y Champi quedan diminutos (28/44 px, pixel art) al lado de una página pintada/vectorial.
- **Captura:** `REV/st-form-success-1440.png`.
- **Código:** `index.html` L~254-262 (`.join-side`), `app.js` `onSubmit` (cambia `form.hidden` y `#form-success`); `styles.css` L396-406.
- **Corrección:** en el éxito, cambiar `#form-title` e `.join-intro` («Listo, ya estás dentro» / «Te escribiremos cuando abramos»), o ocultar ambos. Quitar los sprites pixel o subirlos a un tamaño que se lea y alinearlos por base.

### P2-10 · Tras un error del servidor el foco se pierde
- **Qué pasa:** al fallar el envío, `setBusy(btn, false)` reactiva el botón que estaba `disabled` y el foco queda en `BODY`. El mensaje sí es `role="alert"` (bien), pero quien navega con teclado vuelve al inicio. Los errores por campo (`.err`) no tienen `role` ni `aria-live`; funcionan porque el foco va al primer campo inválido y están en `aria-describedby`.
- **Captura:** `REV/st-form-servererror-1440.png`.
- **Código:** `app.js` L501-505 (`catch`) y `setBusy`.
- **Corrección:** `aria-disabled="true"` en vez de `disabled` durante el envío (así no pierde el foco), o tras el `catch` hacer `srv.focus()` con `tabindex="-1"`. Además, en `.err` añadir `role="alert"` solo al primero visible.

### P2-11 · Plan reservado: el botón no cambia de palabra y salta de ancho
- **Qué pasa:** tras pulsar, el botón pasa a tinta con un visto pero sigue diciendo «Reservar mi lugar» y se ensancha ~12 px al aparecer el visto. El mensaje de confirmación queda debajo de las tarjetas (fuera del pantallazo en alturas bajas) y el chip aparece más abajo, en el formulario. No hay `aria-pressed`.
- **Captura:** `REV/st-plan-reserved.png`.
- **Código:** `styles.css` L307-308 `.plan.picked .reserve`; `app.js` `renderPlanChip`/`onReserve` (L395-420).
- **Corrección:** en `picked`, cambiar el texto a «Lugar reservado» (clave nueva `price.btnDone`), `aria-pressed="true"`, y reservar el ancho del visto con `::before` siempre presente (`width:0` → `18px`) o `min-width`. El título de confirmación ya existe; mantenerlo.

### P2-12 · Botones: sin `:active`, hover casi invisible, interruptor de idioma de 38 px de alto
- **Qué pasa:** `.btn:hover` pasa de `#141218` a `#2c2733` (apenas cambia) y no hay ningún `:active` en toda la hoja (el sitio de Lumen sí lo tiene: `.btn:active { transform: translateY(1px) scale(.98) }`). Los botones `EN/ES` miden 44×38. En foco, los botones fantasma muestran dos aros (inset gris + outline marrón de 3 px + offset 3).
- **Captura:** `REV/st-plan-active.png` (sin diferencia visible), `REV/st-plan-focus.png`, `REV/st-topbar-focus.png`.
- **Código:** `styles.css` L111 `.btn:hover`, L129-136 `.lang-btn`, L73 `:focus-visible`.
- **Corrección:** `.btn:active { transform: translateY(1px) scale(.985) }` bajo `prefers-reduced-motion: no-preference`; `.btn:hover { background:#2f2a37 }` más `box-shadow: 0 8px 20px -12px rgba(20,18,24,.5)`; `.lang-btn { min-height: 44px }` (el contenedor pasa a 50 px; reducir su `padding` a 0). `.btn--ghost:focus-visible { box-shadow: none; outline-offset: 2px }`.

### P2-13 · Mensajes de error: tres iguales y el del servidor es una broma
- **Qué pasa:** los tres campos vacíos dicen lo mismo («Completa este campo, por favor.») sin decir cuál. El error del servidor dice «Algo se apagó de nuestro lado» / «Something went out on our side» (juego de luz; en EN el modismo «went out» confunde). La skill pide errores claros y sin gracia.
- **Captura:** `REV/st-form-errors-1440.png`, `REV/st-form-servererror-1440.png`.
- **Código:** `app.js` L85-91 / L190-196 (`err.required`, `err.server`), `validateField`.
- **Corrección:** claves por campo: «Escribe tu correo.», «Elige tu país.», «Escribe las fechas o marca “Aún no lo sé”.»; servidor: «No pudimos guardar tus datos. Revisa tu conexión e inténtalo de nuevo; tus respuestas siguen aquí.» / “We couldn’t save your details. Check your connection and try again. Your answers are still here.”

### P2-14 · Tarjeta de la parada en celular: columna estrecha, texto en 4–5 líneas, y el mapa sticky ocupa ~50 % del alto
- **Qué pasa:** en ≤999 px la barra sticky pone mapa (~250 px) y tarjeta lado a lado; la tarjeta queda en 100–110 px: «Unos 240 km / en línea recta / desde / Medellín» en 4 líneas, «Santa Marta and Tayrona» en 4 y «1,080 / km» se parte entre cifra y unidad. En 360×740 el conjunto sticky ocupa ~380 px (51 %), dejando ~350 px para leer. `top: 64px` mientras la barra mide 68 px (4 px debajo de la barra).
- **Captura:** `REV/route-es-390-stop2.png`, `REV/route-en-360-stop4.png`.
- **Código:** `styles.css` L445-453 (`@media (max-width: 999px)`), `fx.js` `paintCard` L119-123.
- **Corrección:** en móvil mostrar solo `Parada N de 4` + ciudad en una línea bajo el mapa o sobre él, y ocultar `.map-km` (o mostrarlo en una línea al pie). Mapa a ancho completo con altura ≤30svh. `&nbsp;` entre cifra y «km». `top: 68px` (o `var(--topbar-h)`).

### P2-15 · LCP y fuentes: sin preload del hero ni de Manrope; el cambio de fuente mueve el hero
- **Qué pasa:** con red lenta simulada (≈1,6 Mbps, 150 ms): LCP del hero 3,3 s en escritorio (`hero-2400.webp`, 200 KB) y 1,5 s en móvil. Solo se precarga Plus Jakarta; Manrope (texto de todo el sitio) llega tarde y su intercambio provocó un desplazamiento en `.hero-actions` (CLS 0,011 en 390; en escritorio 0,00002). La imagen tiene `fetchpriority="high"` pero no `preload`; el HTML la descubre tras CSS y JS síncrono.
- **Captura:** sin imagen (medición con `PerformanceObserver`, ver tabla abajo).
- **Código:** `index.html` L30 (preload de fuente), L86-90 (`.hero-art img`), L32-35 (`app.js` síncrono en `<head>`).
- **Corrección:** `<link rel="preload" as="image" href="/assets/art/hero-1200.webp" imagesrcset="…1200w, …2400w" imagesizes="100vw" fetchpriority="high">`; precargar también `manrope-latin-var.woff2`; fallback con `size-adjust` (`@font-face { font-family:"Manrope Fallback"; src: local("Arial"); size-adjust: 104%; ascent-override: 100%; }`). Opcional: AVIF del hero.
- **Mediciones:** escritorio 1440 LCP 3284 ms, CLS 0,00002; móvil 390 LCP 1480 ms, CLS 0,0113.

### P2-16 · Idioma por defecto distinto entre landing y política
- **Qué pasa:** con un navegador que no es ES ni EN (probado fr-FR), la landing abre en inglés y la política en español. Quien pulsa «Política de privacidad» desde la landing cambia de idioma. (Si ya eligió con el botón, `lt_lang` los alinea.)
- **Captura:** sin imagen (medido: landing `lang="en"`, política `lang="es"`).
- **Código:** `app.js` L287-288 (`/^es\b/` → es, si no en) vs `privacidad.js` L14-15 (`/^en\b/` → en, si no es).
- **Corrección:** misma función en ambos (usar la de la landing) y, al navegar entre páginas, pasar `?lang=`.

### P2-17 · Vista previa al compartir (og-image): imagen en español, texto en inglés
- **Qué pasa:** `og:title/description` en el HTML son siempre EN (el i18n es solo por JS, los rastreadores no lo ven) y `og:locale` es `en_US`, pero `og-image.jpg` lleva «Lumen Travels · Tu ruta, tu gente.» en español, con punto medio. Para una audiencia colombiana, el enlace se previsualiza mezclado. La imagen es bonita y respeta el estilo; es la única con texto.
- **Captura:** `/home/user/Lumen_Travels/site/landing/assets/art/og-image.jpg` (la vi tal cual).
- **Código:** `index.html` L16-27 (metas), `assets/art/og-image.jpg`.
- **Corrección:** o una imagen sin texto (solo pintura + símbolo), o dos imágenes (`og-image-es/en`) con URLs por idioma (`/?lang=es`) y `og:locale` coherente. Quitar el «·» del texto de la imagen y del `<title>`; usar «—»  o dos puntos. Añadir `<link rel="canonical">` y `hreflang` cuando haya URLs por idioma.

---

## P3 · detalle fino

1. **Lámpara del hero 3 px a la izquierda del texto.** `.lamp { margin: 0 0 28px -6px }` deja el borde del círculo en x≈17 px frente al texto en 20 px (390); el brillo ya sale del pseudo-elemento. `REV/es-A-390-fold.png`. Corrección: `margin-left: 0`. Igual para `.join-lamp`.
2. **Leyenda de «Ciudades del corredor» 2 px a la derecha** del resto de etiquetas (el `legend` ignora `padding: 0` del `fieldset`). `REV/sec-es-B-390-join-b.png`. Corrección: `legend { padding: 0; float: left; width: 100% }` + `legend + * { clear: both }`.
3. **Titular de precios con interlineado 1,08:** el acento de «Ayúdanos» roza la «g» de «pagarías» en 1440. `REV/sec-es-A-1440-pricing.png`. Corrección: `.pricing .h-xl { line-height: 1.12 }`.
4. **Filete de `.safety-close` más corto que el de la lista** (62ch vs ancho de la columna) en ≥1000. `REV/sec-es-A-1440-safety.png`. Corrección: quitar `max-width` del filete y limitar solo el texto.
5. **La ruta se duplica cerca de Bogotá:** el tramo Bogotá→Cartagena sale pegado al tramo Medellín→Bogotá y se lee como una V; la etiqueta «Medellín» queda sobre montañas. `REV/route-en-360-stop4.png`, `REV/route-es-1440-stop2.png`. Corrección: separar la curva `C214 340 168 300…` unos 20–30 unidades al este (cruzando el río) y poner `paint-order` más grueso en `.pin-name`. (Llegada exacta: ver «Lo que sí está a la altura».)
6. **Código muerto en `fx.js`:** el `pointermove` global fija `--mx/--my` y ningún CSS los usa; `.topbar.is-scrolled` se alterna sin regla; el bloque «4. barra» no tiene efecto. Quita el listener (trabajo de main thread en cada movimiento de mouse) y el bloque.
7. **No hay página 404 propia, `robots.txt`, `sitemap.xml`, `canonical` ni `hreflang`.** Vercel mostrará su 404 genérica. (La web de Lumen tampoco tiene 404 propia, pero sí robots, sitemap y hreflang.) Corrección: `404.html` con la barra y un botón «Volver al inicio», más `robots.txt`/`sitemap.xml`.
8. **Caché de assets:** solo `styles.css/app.js/fx.js` tienen `max-age=0, must-revalidate`; fuentes e imágenes caen en el valor por defecto de Vercel y se revalidan cada visita. Corrección en `vercel.json`: `/assets/(fonts|art|brand)/(.*)` con `Cache-Control: public, max-age=31536000, immutable` (renombrar al cambiar).
9. **Escalado del hero en pantallas 4K/2×:** a 1920 px con DPR 2 se usa `hero-2400.webp` (se estira 1,6×). El grano lo disimula; si se quiere nitidez, un 3200 px. Sin `srcset` en `og-image` (correcto).
10. **Vocabulario de la misma acción en tres formas:** «Unirme a la lista» (barra), «Unirme a la lista de espera» (hero/botón) y «Únete a la lista de espera» (titular) en ES; mezcla primera persona y tú. Corrección: elegir «Unirme a la lista de espera» en botones y «Lista de espera» en el titular.
11. **Foco de ciudades (`.city`) y casillas con aro de 3 px + offset 3** en marrón `#9a6a10`: es correcto en contraste pero pesado junto a chips pequeños. `REV/st-cities-states.png`. Corrección: 2 px y offset 2 en chips; mantener 3 px en botones.

---

## Verificaciones sin hallazgo (para que no se repitan)
- **Contraste AA medido:** texto normal ≥4,5:1 en todos los elementos con color propio; el lead y la nota del hero sobre la pintura y la rejilla, medidos por píxel en 5 anchos, quedan en 4,6–5,8:1 (peor caso 4,61). Placeholder y bordes de campo ≥3,4:1.
- **Mapa:** el símbolo de Lumen llega al punto de cada ciudad con error ≤1,1 px en 1920, 1440, 1024, 390 y 360 (paradas 1-4, medido contra el centro de cada pin).
- **`prefers-reduced-motion`:** correcto (`document.getAnimations()` = 0, `scroll-behavior: auto`; el símbolo salta de ciudad en ciudad).
- **Sin desbordes horizontales** en 360, 390, 768, 1440; barra superior en 360 sin solapes (logo 20-172, idioma 246-340).
- **Cambio de idioma sin parpadeo:** el `<html class="i18n-pending">` oculta el cuerpo hasta aplicar el idioma; `lang` y `<title>` se actualizan; `aria-pressed` correcto. 
- **Orden de foco** lógico (skip, logo, idioma, CTA, lámpara, hero, planes, formulario, FAQ, pie); el éxito del formulario recibe el foco.
- **`aria-live`:** `#reserve-msg` es `status`/`polite`; `#e-server` es `alert`.

## Lo que sí está a la altura
- La **ruta con el símbolo de Lumen** que recorre el mapa llega exacta a cada ciudad y respeta `prefers-reduced-motion`; es una pieza con identidad propia y bien resuelta (salvo la legibilidad móvil, P1-3).
- **Disciplina de plantilla:** sin rótulos en mayúsculas, sin kit de tarjetas, sin numeración decorativa ni gradientes de relleno; el color de acento se reserva para formas y la tipografía (Plus Jakarta + Manrope) es coherente y propia.
- **Base técnica sólida:** fuentes alojadas, CSP estricta, CLS ≈ 0, sin desbordes, formulario con estados de error/éxito, foco visible y objetivos táctiles correctos en casi todo (salvo `EN/ES`).
