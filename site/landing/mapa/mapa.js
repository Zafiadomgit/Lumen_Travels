/* Lumen Travels · mapa real de la ruta (módulo aislado)
   Diseñado por Lumen Studio.

   Qué hace
   - Carga perezosa: MapLibre (vendor/, mismo origen), el estilo y la ruta solo se piden cuando la sección
     está a ~900 px de la vista. Antes se ve la imagen estática; si no hay WebGL o las teselas fallan, se queda ella.
   - La cámara va atada al scroll: vista de Colombia → Medellín → Bogotá → Cartagena → Santa Marta → Tayrona.
     El progreso del scroll se suaviza (amortiguación exponencial), así que un scroll brusco nunca da saltos.
   - La línea dorada se dibuja con line-gradient + line-progress sobre el trazado real (OSRM). El tramo en avión
     va punteado y se recorta aparte. El símbolo de Lumen avanza interpolado sobre la geometría.
   - prefers-reduced-motion: sin vuelos; cambia de parada con un fundido corto.
   - Gestos del mapa apagados por defecto (no atrapan el scroll); el botón «Explorar mapa» los enciende.

   Marcado esperado (ver demo.html):
     <div class="lmapa" data-lumen-mapa data-base="/mapa/" data-arte="/assets/art/" data-iconos="/assets/icons/sprite.svg">…</div>
   y, en cada parada de texto, data-mapa-parada="0" (o "3 4" si un bloque cubre dos ciudades).
   Sin dependencias: no lee nada de app.js ni de fx.js. El idioma sale de <html lang>. */

const raiz = document.querySelector('[data-lumen-mapa]');
if (raiz) iniciar(raiz);

function iniciar(raiz) {
  const BASE = new URL(raiz.dataset.base || './', document.baseURI);
  const ARTE = new URL(raiz.dataset.arte || '../assets/art/', document.baseURI);
  const ICONOS = raiz.dataset.iconos ? new URL(raiz.dataset.iconos, document.baseURI).href : '';
  const POSTER = raiz.dataset.modo === 'poster';
  const mqReducir = matchMedia('(prefers-reduced-motion: reduce)');
  const mqMovil = matchMedia('(max-width: 999px)');

  const TXT = {
    es: {
      paso: 'Parada {n} de {t}', inicio: 'Aquí empieza la ruta',
      km: 'Unos {km} km por carretera desde Medellín',
      kmMixto: 'Unos {km} km desde Medellín: {c} por carretera y {a} en avión',
      nota: 'Cálculo aproximado con OpenStreetMap', vuelo: 'Tramo en avión',
      explorar: 'Explorar mapa', volver: 'Volver a la ruta',
      etiqueta: 'Mapa de la ruta: Medellín, Bogotá, Cartagena, Santa Marta y el Parque Tayrona.',
      lienzo: 'Mapa interactivo de la ruta. Arrastra para moverte; usa las flechas y + o − con el teclado.',
      nombre: ['coalesce', ['get', 'name:es'], ['get', 'name']]
    },
    en: {
      paso: 'Stop {n} of {t}', inicio: 'Where the route starts',
      km: 'About {km} km by road from Medellín',
      kmMixto: 'About {km} km from Medellín: {c} by road and {a} by plane',
      nota: 'Rough estimate based on OpenStreetMap', vuelo: 'Flight leg',
      explorar: 'Explore the map', volver: 'Back to the route',
      etiqueta: 'Map of the route: Medellín, Bogotá, Cartagena, Santa Marta and Tayrona Park.',
      lienzo: 'Interactive route map. Drag to move; use the arrow keys and + or − on the keyboard.',
      nombre: ['coalesce', ['get', 'name:en'], ['get', 'name']]
    }
  };
  const idioma = () => (document.documentElement.lang || 'es').slice(0, 2) === 'en' ? 'en' : 'es';
  const t = (k) => TXT[idioma()][k];
  const fmt = (n) => { try { return n.toLocaleString(idioma() === 'en' ? 'en-US' : 'es-CO'); } catch (e) { return String(n); } };
  const redondear = (km) => Math.round(km / 5) * 5;
  const local = (v) => (v && typeof v === 'object') ? (v[idioma()] || v.es) : v;

  /* ---------- piezas del DOM ---------- */
  const lienzo = raiz.querySelector('.lmapa-lienzo');
  const capaMapa = document.createElement('div');
  capaMapa.className = 'lmapa-mapa';
  lienzo.appendChild(capaMapa);

  const tarjeta = document.createElement('div');
  tarjeta.className = 'lmapa-tarjeta';
  tarjeta.setAttribute('aria-hidden', 'true');
  tarjeta.innerHTML = '<span class="lmapa-miniatura"></span><span class="lmapa-tarjeta-texto">' +
    '<span class="lmapa-paso"></span><span class="lmapa-ciudad-activa"></span><span class="lmapa-sub"></span>' +
    '<span class="lmapa-km"></span><span class="lmapa-nota"></span></span>';
  lienzo.appendChild(tarjeta);
  const $ = (s) => tarjeta.querySelector(s);
  const cPaso = $('.lmapa-paso'), cCiudad = $('.lmapa-ciudad-activa'), cSub = $('.lmapa-sub'), cKm = $('.lmapa-km'), cNota = $('.lmapa-nota'), cMini = $('.lmapa-miniatura');

  const boton = raiz.querySelector('.lmapa-explorar');

  /* ---------- paradas de texto → posiciones de la cámara ---------- */
  // cada bloque con data-mapa-parada aporta uno o dos puntos de anclaje (fracción de su alto)
  const anclas = [];
  document.querySelectorAll('[data-mapa-parada]').forEach((el) => {
    const ids = el.getAttribute('data-mapa-parada').trim().split(/\s+/).map(Number);
    const fr = ids.length === 1 ? [0.5] : ids.map((_, i) => 0.3 + 0.55 * i / (ids.length - 1));
    ids.forEach((id, i) => { anclas[id] = { el, fr: fr[i] }; });
  });

  let datos = null;            // ruta-datos.json
  let mapa = null, ml = null;  // instancia y módulo de MapLibre
  let geo = null;              // geometría unida con longitudes acumuladas (Mercator)
  let listo = false, explorando = false, estatico = false;
  let objetivo = -1, mostrado = -1, ultimoT = 0, bucle = 0, activa = -1, desfaseZoom = 0;
  let viajero = null, rotulos = [], rotuloVuelo = null;

  /* ---------- scroll → progreso continuo s ∈ [-1, 4] ---------- */
  const lineaAncla = () => {
    if (mqMovil.matches) {
      const r = lienzo.getBoundingClientRect();
      return Math.min(innerHeight * 0.92, r.bottom + (innerHeight - r.bottom) * 0.45);
    }
    return innerHeight * 0.5;
  };
  const progresoScroll = () => {
    if (!anclas.length) return 0;
    const y = lineaAncla();
    const v = anclas.map((a) => { const r = a.el.getBoundingClientRect(); return y - (r.top + r.height * a.fr); });
    v.unshift(v[0] - innerHeight * 0.6);   // la vista general de Colombia, un poco antes de Medellín
    const n = v.length;
    if (v[0] <= 0) return -1;
    if (v[n - 1] >= 0) return n - 2;
    for (let k = 0; k < n - 1; k++) {
      if (v[k] >= 0 && v[k + 1] < 0) {
        const tt = v[k] / (v[k] - v[k + 1]);
        // una pausa corta en cada ciudad: el viaje ocurre entre el 12 % y el 88 % del tramo
        const e = Math.min(1, Math.max(0, (tt - 0.12) / 0.76));
        return k - 1 + e;
      }
    }
    return -1;
  };

  /* ---------- tarjeta ---------- */
  const textoKm = (i) => {
    const a = datos.acumulado[i];
    if (i === 0) return t('inicio');
    if (!a.avion) return t('km').replace('{km}', fmt(redondear(a.carretera)));
    return t('kmMixto').replace('{km}', fmt(redondear(a.carretera + a.avion)))
      .replace('{c}', fmt(redondear(a.carretera))).replace('{a}', fmt(redondear(a.avion)));
  };
  const pintarTarjeta = (i) => {
    const p = datos.paradas[i];
    cPaso.textContent = t('paso').replace('{n}', i + 1).replace('{t}', datos.paradas.length);
    cCiudad.textContent = local(p.nombre);
    cSub.textContent = p.sub ? local(p.sub) : '';
    cSub.hidden = !p.sub;
    cKm.textContent = textoKm(i);
    cNota.textContent = i === 0 ? '' : t('nota');
    cNota.hidden = i === 0;
    // miniatura: la escena de la parada en la página; si no existe, la de arte/; si no, el icono de la ciudad
    cMini.textContent = '';
    cMini.style.backgroundImage = '';
    const img = anclas[i] && anclas[i].el.querySelector('img');
    const src = img ? (img.currentSrc || img.src) : (p.arte ? new URL(p.arte, ARTE).href : '');
    if (src) cMini.style.backgroundImage = 'url("' + src + '")';
    else if (ICONOS) {
      const ns = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(ns, 'svg'); svg.setAttribute('class', 'lmapa-icono'); svg.setAttribute('aria-hidden', 'true');
      const use = document.createElementNS(ns, 'use'); use.setAttribute('href', ICONOS + '#' + p.icono);
      svg.appendChild(use); cMini.appendChild(svg);
    }
  };
  const activar = (i) => {
    if (i === activa || !datos) return;
    const antes = activa;
    activa = i;
    pintarTarjeta(i);
    raiz.dataset.parada = String(i + 1);
    rotulos.forEach((r, k) => {
      r.el.classList.toggle('is-activa', k === i);
      r.el.classList.toggle('is-visitada', k < i);
    });
    if (antes !== -1) { tarjeta.classList.remove('is-nueva'); void tarjeta.offsetWidth; tarjeta.classList.add('is-nueva'); }
  };

  /* ---------- geometría ---------- */
  const merc = (ll) => { const s = Math.sin(ll[1] * Math.PI / 180); return [(ll[0] + 180) / 360, 0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)]; };
  const desMerc = (m) => [m[0] * 360 - 180, Math.atan(Math.sinh(Math.PI * (1 - 2 * m[1]))) * 180 / Math.PI];
  const unirGeometria = (fc) => {
    const coords = [], tramoIni = [], modo = [];
    fc.features.forEach((f, k) => {
      const c = f.geometry.coordinates;
      tramoIni[k] = Math.max(0, coords.length - 1);
      c.forEach((p, j) => { if (k > 0 && j === 0) return; coords.push(p); });
      modo[k] = f.properties.modo;
    });
    tramoIni.push(coords.length - 1);
    const m = coords.map(merc), D = [0];
    for (let i = 1; i < m.length; i++) D.push(D[i - 1] + Math.hypot(m[i][0] - m[i - 1][0], m[i][1] - m[i - 1][1]));
    const L = D[D.length - 1];
    const F = tramoIni.map((i) => D[i] / L);   // fracción de la línea en la que queda cada ciudad
    return { coords, m, D, L, F, modo, fc };
  };
  const puntoEn = (f) => {
    const d = Math.max(0, Math.min(1, f)) * geo.L, D = geo.D;
    let lo = 0, hi = D.length - 1;
    while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (D[mid] <= d) lo = mid; else hi = mid; }
    const seg = D[hi] - D[lo] || 1, u = (d - D[lo]) / seg, a = geo.m[lo], b = geo.m[hi];
    return desMerc([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]);
  };
  const ORO = '#e8a33a', ORO_OSCURO = 'rgba(154,106,16,.55)', TRANSP = 'rgba(232,163,58,0)';
  // line-gradient por pasos: dorado hasta el progreso p, sin el tramo en avión (que va punteado aparte)
  const degradado = (p, color) => {
    const a0 = geo.F[1], a1 = geo.F[2], e = 1e-6;
    const st = ['step', ['line-progress'], color];
    const sin = color.replace(/[\d.]+\)$/, '0)');
    const lim = Math.max(e, p);
    if (lim <= a0) st.push(lim, sin);
    else if (lim <= a1) st.push(a0, sin);
    else { st.push(a0, sin, a1 + e, color); if (lim < 1 - e && lim > a1 + 2 * e) st.push(lim, sin); }
    return st;
  };
  const colorRgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')'; };

  /* ---------- cámara ---------- */
  const suave = (x) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  const lerp = (a, b, u) => a + (b - a) * u;
  const lerpAng = (a, b, u) => { let d = ((b - a + 540) % 360) - 180; return a + d * u; };
  let vistaGeneral = null;
  const calcularVistaGeneral = () => {
    const c = mapa.cameraForBounds(datos.vistaGeneral.bounds, { padding: mqMovil.matches ? 24 : 48 });
    vistaGeneral = { center: [c.center.lng, c.center.lat], zoom: c.zoom, pitch: 0, bearing: 0 };
    const r = lienzo.getBoundingClientRect();
    desfaseZoom = Math.max(-1.3, Math.min(0.5, Math.log2(Math.min(r.width, r.height * 1.15) / 640)));
  };
  const camParada = (i) => {
    const p = datos.paradas[i];
    return { center: p.lngLat, zoom: p.camara.zoom + desfaseZoom, pitch: p.camara.pitch, bearing: p.camara.bearing };
  };
  // devuelve la cámara y el progreso de la línea para un s continuo
  const estado = (s) => {
    const n = datos.paradas.length;
    if (s <= -1) return { cam: vistaGeneral, f: 0, i: 0 };
    if (s < 0) {
      // de la vista general a Medellín, con el zoom en escala (el destino queda fijo en pantalla)
      const u = suave(s + 1), a = vistaGeneral, b = camParada(0);
      const z = lerp(a.zoom, b.zoom, u), S0 = Math.pow(2, a.zoom), S1 = Math.pow(2, b.zoom);
      const w = (Math.pow(2, z) - S0) / (S1 - S0);
      const ma = merc(a.center), mb = merc(b.center);
      return { cam: { center: desMerc([lerp(ma[0], mb[0], w), lerp(ma[1], mb[1], w)]), zoom: z, pitch: lerp(0, b.pitch, u), bearing: lerpAng(0, b.bearing, u) }, f: 0, i: 0 };
    }
    if (s >= n - 1) return { cam: camParada(n - 1), f: 1, i: n - 1 };
    const k = Math.floor(s), u = suave(s - k), a = camParada(k), b = camParada(k + 1);
    const zm = datos.tramos[k].zoomMedio + desfaseZoom;
    const zc = 2 * zm - (a.zoom + b.zoom) / 2;   // curva cuadrática que pasa por zm a mitad de tramo
    const z = (1 - u) * (1 - u) * a.zoom + 2 * u * (1 - u) * zc + u * u * b.zoom;
    const f = lerp(geo.F[k], geo.F[k + 1], u);
    const ma = merc(a.center), mb = merc(b.center), mv = merc(puntoEn(f));
    const cx = lerp(ma[0], mb[0], u), cy = lerp(ma[1], mb[1], u);
    const centro = desMerc([lerp(cx, mv[0], 0.3), lerp(cy, mv[1], 0.3)]);   // la cámara sigue un poco al viajero
    const pitch = lerp(a.pitch, b.pitch, u) - 14 * Math.sin(Math.PI * u);    // despega y vuelve a inclinarse
    return { cam: { center: centro, zoom: z, pitch, bearing: lerpAng(a.bearing, b.bearing, u) }, f, i: Math.round(s) };
  };

  let fUltimo = -1;
  const dibujarLinea = (f) => {
    if (Math.abs(f - fUltimo) < 1e-5) return;
    fUltimo = f;
    mapa.setPaintProperty('ruta-oro', 'line-gradient', degradado(f, colorRgba(ORO, 1)));
    mapa.setPaintProperty('ruta-borde', 'line-gradient', degradado(f, ORO_OSCURO));
    mapa.setPaintProperty('ruta-brillo', 'line-gradient', degradado(f, 'rgba(255,214,140,.55)'));
    // el vuelo punteado: recorte de su geometría (97 puntos, barato)
    const a0 = geo.F[1], a1 = geo.F[2];
    const u = Math.max(0, Math.min(1, (f - a0) / (a1 - a0)));
    const arco = geo.fc.features[1].geometry.coordinates;
    const nPts = Math.max(0, Math.round(u * (arco.length - 1)));
    const corte = u > 0 ? arco.slice(0, nPts + 1).concat(u < 1 ? [puntoEn(f)] : []) : [];
    mapa.getSource('vuelo-hecho').setData({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: corte.length > 1 ? corte : [arco[0], arco[0]] } });
    viajero.setLngLat(puntoEn(f));
    if (rotuloVuelo) rotuloVuelo.getElement().classList.toggle('is-visible', f > a0 - 0.02 && f < a1 + 0.02);
  };

  const aplicar = (s) => {
    const e = estado(s);
    if (!explorando) mapa.jumpTo(e.cam);
    dibujarLinea(e.f);
    activar(Math.max(0, Math.min(datos.paradas.length - 1, e.i)));
    raiz.classList.toggle('is-general', s < -0.5);
  };

  /* ---------- bucle de animación (solo corre mientras hay diferencia) ---------- */
  const TAU = 0.28;   // segundos: cuánto tarda la cámara en alcanzar al scroll
  const paso = (ahora) => {
    bucle = 0;
    const dt = Math.min(0.1, (ahora - (ultimoT || ahora)) / 1000);
    ultimoT = ahora;
    const dif = objetivo - mostrado;
    mostrado = Math.abs(dif) < 0.0005 ? objetivo : mostrado + dif * (1 - Math.exp(-dt / TAU));
    aplicar(mostrado);
    if (mostrado !== objetivo) bucle = requestAnimationFrame(paso);
    else ultimoT = 0;
  };
  let fundido = 0;
  const alScroll = () => {
    if (!datos) return;
    objetivo = progresoScroll();
    if (!listo) { activar(Math.max(0, Math.min(datos.paradas.length - 1, Math.round(objetivo)))); return; }
    if (mqReducir.matches) {
      // sin vuelos: la vista salta de parada en parada con un fundido corto
      const destino = objetivo < -0.5 ? -1 : Math.max(0, Math.round(objetivo));
      if (destino === mostrado) return;
      mostrado = destino;
      clearTimeout(fundido);
      raiz.classList.add('is-fundido');
      fundido = setTimeout(() => { aplicar(destino); requestAnimationFrame(() => raiz.classList.remove('is-fundido')); }, 160);
      return;
    }
    if (!bucle) bucle = requestAnimationFrame(paso);
  };

  /* ---------- rótulos y viajero (HTML: letra de la marca, legibles a ≥ 12 px) ---------- */
  const SVG_MARCA = '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><defs><linearGradient id="lmapa-llama" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#e2742a"/><stop offset=".55" stop-color="#f2a93b"/><stop offset="1" stop-color="#ffd27a"/></linearGradient></defs><circle cx="32" cy="32" r="28" fill="#141218"/><path d="M32 14c8 9 12 15 12 21.5a12 12 0 0 1-24 0C20 29 24 23 32 14z" fill="url(#lmapa-llama)"/><path d="M32 30c3 3.5 4.5 6 4.5 8.5a4.5 4.5 0 0 1-9 0c0-2.5 1.5-5 4.5-8.5z" fill="#fff4dc"/></svg>';
  const crearRotulos = () => {
    rotulos = datos.paradas.map((p) => {
      const el = document.createElement('div');
      el.className = 'lmapa-rotulo lmapa-rotulo--' + p.lado;
      el.innerHTML = '<span class="lmapa-punto"></span><span class="lmapa-nombre"></span>';
      el.querySelector('.lmapa-nombre').textContent = p.rotulo;
      const mk = new ml.Marker({ element: el, anchor: 'center', pitchAlignment: 'viewport', rotationAlignment: 'viewport' }).setLngLat(p.lngLat).addTo(mapa);
      return { el, mk };
    });
    const v = document.createElement('div');
    v.className = 'lmapa-viajero';
    v.innerHTML = SVG_MARCA;
    viajero = new ml.Marker({ element: v, anchor: 'center' }).setLngLat(datos.paradas[0].lngLat).addTo(mapa);
    const arco = geo.fc.features[1].geometry.coordinates;
    const ev = document.createElement('div');
    ev.className = 'lmapa-vuelo';
    ev.textContent = t('vuelo');
    rotuloVuelo = new ml.Marker({ element: ev, anchor: 'right', offset: [-14, 0] }).setLngLat(arco[Math.floor(arco.length / 2)]).addTo(mapa);
  };

  const traducir = () => {
    lienzo.setAttribute('aria-label', t('etiqueta'));
    if (boton) boton.textContent = explorando ? t('volver') : t('explorar');
    if (datos && activa >= 0) pintarTarjeta(activa);
    if (rotuloVuelo) rotuloVuelo.getElement().textContent = t('vuelo');
    if (mapa && listo) {
      mapa.getStyle().layers.forEach((l) => { if (l.type === 'symbol') mapa.setLayoutProperty(l.id, 'text-field', t('nombre')); });
      const c = mapa.getCanvas(); if (explorando) c.setAttribute('aria-label', t('lienzo'));
    }
  };

  /* ---------- explorar: enciende y apaga los gestos ---------- */
  const MANEJADORES = ['scrollZoom', 'boxZoom', 'dragRotate', 'dragPan', 'keyboard', 'doubleClickZoom', 'touchZoomRotate', 'touchPitch'];
  const gestos = (on) => MANEJADORES.forEach((h) => { if (mapa[h]) mapa[h][on ? 'enable' : 'disable'](); });
  const alternarExplorar = () => {
    if (!listo) return;
    explorando = !explorando;
    gestos(explorando);
    raiz.classList.toggle('is-explorando', explorando);
    const c = mapa.getCanvas();
    if (explorando) {
      lienzo.removeAttribute('role'); lienzo.removeAttribute('aria-label');
      c.tabIndex = 0; c.setAttribute('aria-label', t('lienzo')); c.setAttribute('role', 'application');
    } else {
      c.tabIndex = -1; c.removeAttribute('role');
      lienzo.setAttribute('role', 'img'); lienzo.setAttribute('aria-label', t('etiqueta'));
      const e = estado(mostrado);
      if (mqReducir.matches) mapa.jumpTo(e.cam); else mapa.easeTo({ ...e.cam, duration: 900 });
    }
    traducir();
  };

  /* ---------- alternativa estática ---------- */
  const aEstatico = (motivo) => {
    if (estatico) return;
    estatico = true;
    raiz.classList.add('is-estatico');
    raiz.classList.remove('is-listo');
    if (boton) boton.hidden = true;
    if (motivo) console.info('[lumen-mapa] se muestra la imagen estática:', motivo);
    if (mapa) { try { mapa.remove(); } catch (e) { /* nada */ } mapa = null; }
    listo = false;
  };
  const hayWebGL = () => {
    try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; }
  };

  /* ---------- arranque perezoso ---------- */
  const cargarDatos = () => fetch(new URL('ruta-datos.json', BASE)).then((r) => r.json());
  const arrancar = async () => {
    try {
      datos = await cargarDatos();
    } catch (e) { return; }   // sin datos no hay tarjeta; la imagen estática ya está puesta
    raiz.classList.add('is-activo');
    alScroll();
    if (!hayWebGL()) return aEstatico('sin WebGL');
    try {
      const css = document.createElement('link');
      css.rel = 'stylesheet'; css.href = new URL('vendor/maplibre-gl.css', BASE).href;
      document.head.appendChild(css);
      const [modulo, estilo, ruta] = await Promise.all([
        import(new URL('vendor/maplibre-gl.mjs', BASE).href),
        fetch(new URL('estilo.json', BASE)).then((r) => { if (!r.ok) throw new Error('estilo ' + r.status); return r.json(); }),
        fetch(new URL('ruta.geojson', BASE)).then((r) => r.json())
      ]);
      ml = modulo;
      geo = unirGeometria(ruta);
      montar(estilo, ruta);
    } catch (e) { aEstatico(e && e.message); }
  };

  const montar = (estilo, ruta) => {
    // las imágenes del relieve son relativas al módulo
    ['relieve-colombia', 'relieve-ruta'].forEach((id) => { if (estilo.sources[id]) estilo.sources[id].url = new URL(estilo.sources[id].url, BASE).href; });
    estilo.layers.forEach((l) => { if (l.type === 'symbol') l.layout['text-field'] = t('nombre'); });
    let fallos = 0;
    const tope = setTimeout(() => { if (!listo) aEstatico('el mapa tardó demasiado'); }, 15000);
    try {
      mapa = new ml.Map({
        container: capaMapa, style: estilo, attributionControl: false,
        interactive: true, center: [-74.3, 7.2], zoom: 4.6, maxPitch: 70,
        fadeDuration: 0, renderWorldCopies: false, pixelRatio: Math.min(devicePixelRatio || 1, 2),
        canvasContextAttributes: { antialias: true }
      });
    } catch (e) { clearTimeout(tope); return aEstatico('no se pudo crear el mapa'); }
    gestos(false);
    mapa.getCanvas().tabIndex = -1;
    // teselas que no llegan (red, CSP, servicio caído): sin ninguna tesela base, mejor la imagen fija
    let teselaOk = false;
    mapa.on('data', (ev) => { if (ev.sourceId === 'openmaptiles' && ev.tile) teselaOk = true; });
    mapa.on('error', (ev) => {
      if (teselaOk) return;
      fallos++;
      if (fallos >= 3) aEstatico('fallan las teselas');
    });
    mapa.once('load', () => setTimeout(() => { if (!teselaOk && !POSTER) aEstatico('no llegó ninguna tesela'); }, 9000));
    mapa.on('webglcontextlost', () => aEstatico('se perdió el contexto WebGL'));
    mapa.on('load', () => {
      clearTimeout(tope);
      if (estatico) return;
      const antes = 'water_name_point_label';
      const carretera = { type: 'FeatureCollection', features: ruta.features.filter((f) => f.properties.modo === 'carretera') };
      mapa.addSource('trazo', { type: 'geojson', lineMetrics: true, data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: geo.coords } } });
      mapa.addSource('carretera', { type: 'geojson', data: carretera });
      mapa.addSource('vuelo', { type: 'geojson', data: ruta.features[1] });
      mapa.addSource('vuelo-hecho', { type: 'geojson', data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [geo.coords[0], geo.coords[0]] } } });
      const redondo = { 'line-cap': 'round', 'line-join': 'round' };
      // lo que falta: punteado en tinta
      mapa.addLayer({ id: 'ruta-pendiente', type: 'line', source: 'carretera', layout: redondo,
        paint: { 'line-color': '#5b5347', 'line-opacity': 0.75, 'line-width': ['interpolate', ['linear'], ['zoom'], 4, 1.6, 9, 2.6], 'line-dasharray': [0.1, 2.2] } }, antes);
      mapa.addLayer({ id: 'vuelo-pendiente', type: 'line', source: 'vuelo', layout: redondo,
        paint: { 'line-color': '#5b5347', 'line-opacity': 0.6, 'line-width': 1.6, 'line-dasharray': [2, 3] } }, antes);
      // lo recorrido: brillo, borde y oro
      mapa.addLayer({ id: 'ruta-brillo', type: 'line', source: 'trazo', layout: redondo,
        paint: { 'line-width': ['interpolate', ['linear'], ['zoom'], 4, 8, 10, 22], 'line-blur': ['interpolate', ['linear'], ['zoom'], 4, 4, 10, 10], 'line-gradient': degradado(0, 'rgba(255,214,140,.55)') } }, antes);
      mapa.addLayer({ id: 'ruta-borde', type: 'line', source: 'trazo', layout: redondo,
        paint: { 'line-width': ['interpolate', ['linear'], ['zoom'], 4, 5, 10, 10], 'line-gradient': degradado(0, ORO_OSCURO) } }, antes);
      mapa.addLayer({ id: 'ruta-oro', type: 'line', source: 'trazo', layout: redondo,
        paint: { 'line-width': ['interpolate', ['linear'], ['zoom'], 4, 3, 10, 6], 'line-gradient': degradado(0, colorRgba(ORO, 1)) } }, antes);
      mapa.addLayer({ id: 'vuelo-oro', type: 'line', source: 'vuelo-hecho', layout: redondo,
        paint: { 'line-color': ORO, 'line-width': ['interpolate', ['linear'], ['zoom'], 4, 3, 8, 4], 'line-dasharray': [1.6, 1.8] } }, antes);
      crearRotulos();
      calcularVistaGeneral();
      listo = true;
      if (POSTER) return modoPoster();
      raiz.classList.add('is-listo');
      if (boton) { boton.hidden = false; boton.addEventListener('click', alternarExplorar); }
      traducir();
      objetivo = progresoScroll();
      if (mqReducir.matches) { mostrado = objetivo < -0.5 ? -1 : Math.max(0, Math.round(objetivo)); aplicar(mostrado); }
      else { mostrado = Math.min(-1, objetivo); aplicar(mostrado); alScroll(); }   // vuela desde Colombia hasta donde esté el lector
    });
    mapa.on('resize', () => { if (!listo) return; calcularVistaGeneral(); fUltimo = -1; aplicar(mostrado); });
  };

  /* ---------- imagen estática (la genera Playwright con data-modo="poster") ---------- */
  const modoPoster = () => {
    raiz.classList.add('is-listo', 'is-poster');
    activa = -1;
    rotulos.forEach((r) => r.el.classList.add('is-visitada'));
    const b = new ml.LngLatBounds(); geo.coords.forEach((c) => b.extend(c));
    mapa.fitBounds(b, { padding: { top: 70, bottom: 70, left: 90, right: 90 }, duration: 0 });
    dibujarLinea(1);
    viajero.setLngLat(datos.paradas[4].lngLat);
    mapa.once('idle', () => { document.documentElement.dataset.posterListo = '1'; });
  };

  /* ---------- eventos ---------- */
  addEventListener('scroll', alScroll, { passive: true });
  addEventListener('resize', alScroll);
  mqReducir.addEventListener('change', () => { mostrado = objetivo; alScroll(); });
  new MutationObserver(traducir).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  lienzo.setAttribute('role', 'img');
  lienzo.setAttribute('aria-label', t('etiqueta'));

  if (POSTER || !('IntersectionObserver' in window)) { arrancar(); return; }
  const io = new IntersectionObserver((entradas) => {
    if (entradas.some((e) => e.isIntersecting)) { io.disconnect(); arrancar(); }
  }, { rootMargin: '900px 0px' });
  io.observe(raiz);
}
