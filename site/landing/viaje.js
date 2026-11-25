/* Lumen Travels · «El viaje pintado»
   La cámara recorre una lámina pintada en gouache al ritmo del scroll: entra inclinada entre la bruma, baja hasta Medellín,
   viaja de ciudad en ciudad mientras una pincelada dorada se dibuja y el símbolo de Lumen la recorre, se posa en cada parada
   (nombre, postal y pilar), sella las ciudades visitadas y al final se aleja para mostrar la ruta entera iluminada.
   Motor: GSAP + ScrollTrigger (vendor/, licencia estándar sin costo de GreenSock). Solo anima transform y opacity
   (y el trazo del SVG). fx.js carga este archivo cerca de la sección y nunca con movimiento reducido.
   Diseñado por Lumen Studio. */
(function () {
  'use strict';
  var gsap = window.gsap, ST = window.ScrollTrigger;
  var sec = document.querySelector('.viaje');
  if (!gsap || !ST || !sec || !document.querySelector('#ruta-d')) return;
  gsap.registerPlugin(ST);
  ST.config({ ignoreMobileResize: true });

  /* ---------- configuración de la cámara ----------
     Las coordenadas de la ruta y de las ciudades viven en el SVG de index.html (px de la imagen del mapa).
     Aquí solo se afina el encuadre: foco y zoom de cada parada (1 = la lámina entera cabe en pantalla). */
  var CFG = {
    // foco de cada parada (centro de la viñeta pintada, px del mapa) y zoom en escritorio
    paradas: [
      { x: 770, y: 885, zoom: 2.3 },     // Medellín (viñeta en 755,885)
      { x: 2110, y: 1255, zoom: 2.05, izq: 1 },  // Bogotá: está al borde derecho del mapa, su texto va a la izquierda (caserío 2130,1300 y Monserrate 2120,1160)
      { x: 360, y: 455, zoom: 2.35 },    // Cartagena (340,450)
      { x: 1670, y: 640, zoom: 2.2 }     // Santa Marta (bahía 1560,688) y Tayrona (cala 1760,615)
    ],
    // por formato: resolución de la capa (zoomMax), multiplicador del zoom de las paradas, apertura en mitad de cada tramo,
    // encuadre de la entrada y del final, ancla (dónde queda el foco, en fracción del escenario) y tamaño del símbolo
    // alto/ancho: parte del escenario que la lámina cubre siempre (en vertical, hasta el texto; en horizontal, hasta el panel de la derecha)
    horizontal: { zoomMax: 2.4, escala: 1, vuelo: 1.4, intro: [.5, .5], introFoco: [.5, .5], zIntro: 1,
                  parada: [.31, .54], paradaIzq: [.69, .54], fin: [.29, .53], zFin: .52, llama: 1, alto: 1, ancho: .6 },
    vertical:   { zoomMax: 2.6, escala: 1.7, vuelo: 2.9, intro: [.5, .32], introFoco: [.66, .42], zIntro: 2.1,
                  parada: [.5, .31], paradaIzq: [.5, .31], fin: [.5, .35], zFin: 1.04, llama: 1.5, alto: .62, ancho: 1 },
    beat: 38                   // alto de cada «tiempo» de la coreografía, en svh (lo usa también styles.css)
  };
  var Q_HORIZ = '(min-width: 760px) and (min-aspect-ratio: 1/1)';

  var escena = sec.querySelector('.viaje-escena');
  var pista = sec.querySelector('.viaje-pista');
  var marco = sec.querySelector('.lamina-marco');
  var lam = sec.querySelector('.lamina');
  var img = sec.querySelector('.lamina-img');
  var svg = sec.querySelector('.lamina-ruta');
  var pathEl = svg.querySelector('#ruta-d');
  var luz = svg.querySelector('.ruta-luz');
  var llama = lam.querySelector('.llama');
  var sellos = Array.prototype.slice.call(svg.querySelectorAll('.sello'));
  var paradas = Array.prototype.slice.call(sec.querySelectorAll('.parada'));
  var final = sec.querySelector('.viaje-final');
  var head = sec.querySelector('.viaje-head');
  var vb = svg.viewBox.baseVal;
  var MW = vb.width, MH = vb.height;

  var tr = function (k) { return window.__lumenLanding && window.__lumenLanding.t ? window.__lumenLanding.t(k) : ''; };
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var mix = function (a, b, t) { return a + (b - a) * t; };
  var smooth = function (a, b, t) { t = clamp((t - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

  /* ---------- la ruta: muestras del trazado y fracción de cada ciudad ---------- */
  var L = pathEl.getTotalLength();
  var N = 800, SX = new Float32Array(N + 1), SY = new Float32Array(N + 1);
  for (var s = 0; s <= N; s++) { var pt = pathEl.getPointAtLength(L * s / N); SX[s] = pt.x; SY[s] = pt.y; }
  var at = function (p) {
    var f = clamp(p, 0, 1) * N, i = Math.floor(f), k = f - i, j = Math.min(N, i + 1);
    return [mix(SX[i], SX[j], k), mix(SY[i], SY[j], k)];
  };
  var P = sellos.map(function (g) {
    var x = +g.getAttribute('data-x'), y = +g.getAttribute('data-y'), best = 0, bd = 1e12;
    for (var q = 0; q <= N; q++) { var d = (SX[q] - x) * (SX[q] - x) + (SY[q] - y) * (SY[q] - y); if (d < bd) { bd = d; best = q / N; } }
    return best;
  });
  P[0] = 0; P[P.length - 1] = 1;
  var FX = SX[N], FY = SY[N];   // final de la ruta: donde descansa la llama sin JS

  /* ---------- rendimiento: la pincelada por tramos y sin máscara ----------
     La máscara (#ruta-revela) obligaba a pintar fuera de pantalla todo el grupo en cada cuadro. En modo animado se parte la ruta
     en sus tres tramos y cada trazo se revela con su propio stroke-dasharray: el patrón de cerdas se repite hasta donde llegó
     el pincel y después hay un hueco. Así cada cuadro repinta solo el tramo en curso. Sin JS se ve el SVG original. */
  var NS = 'http://www.w3.org/2000/svg';
  var TRAZOS = [   // clase, patrón de cerdas (null = trazo liso) y desplazamiento
    ['trazo trazo-borde', [150, 6, 52, 4, 210, 8], 0, 0],
    ['trazo trazo-cuerpo', null, 0, 0],
    ['trazo trazo-sombra', [40, 22, 110, 12, 60, 30], 3, 3],
    ['trazo trazo-brillo', [80, 16, 30, 9, 130, 22], -3, -2.5]
  ];
  var tramos = (function () {
    var tk = pathEl.getAttribute('d').match(/[MC]|-?[\d.]+/g), k = 0, ends = [], segs = [];
    var num = function () { return +tk[k++]; };
    k = 1; ends.push([num(), num()]);
    while (k < tk.length) { if (tk[k] === 'C') k++; var sg = [num(), num(), num(), num(), num(), num()]; segs.push(sg); ends.push([sg[4], sg[5]]); }
    var corte = sellos.slice(1, 3).map(function (g) {   // Bogotá y Cartagena: el extremo de segmento más cercano
      var x = +g.getAttribute('data-x'), y = +g.getAttribute('data-y'), best = 0, bd = 1e12;
      ends.forEach(function (e, i) { var d = (e[0] - x) * (e[0] - x) + (e[1] - y) * (e[1] - y); if (d < bd) { bd = d; best = i; } });
      return best;
    });
    var lim = [0, corte[0], corte[1], segs.length];
    var g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'ruta-tramos');
    var out = [];
    for (var t = 0; t < 3; t++) {
      var d = 'M' + ends[lim[t]].join(' ');
      for (var i = lim[t]; i < lim[t + 1]; i++) d += 'C' + segs[i].join(' ');
      var gt = document.createElementNS(NS, 'g');
      var seco = document.createElementNS(NS, 'path'); seco.setAttribute('d', d); seco.setAttribute('class', 'ruta-seca'); gt.appendChild(seco);
      var len = seco.getTotalLength();
      var fresh = TRAZOS.map(function (tz) {
        var pth = document.createElementNS(NS, 'path'); pth.setAttribute('d', d); pth.setAttribute('class', tz[0]);
        if (tz[2] || tz[3]) pth.setAttribute('transform', 'translate(' + tz[2] + ' ' + tz[3] + ')');
        gt.appendChild(pth); return pth;
      });
      g.appendChild(gt);
      out.push({ seco: seco, fresh: fresh, len: len, pf: -1, pd: -1 });
    }
    svg.querySelector('.ruta-tinta').insertBefore(g, svg.querySelector('.ruta-luz'));
    return out;
  })();
  // dasharray que muestra solo los primeros «rev» px del trazo, respetando su patrón de cerdas
  function dashes(pat, len, rev) {
    if (rev <= .5) return '0 ' + (len + 100).toFixed(0);
    if (!pat) return rev.toFixed(1) + ' ' + (len + 100).toFixed(0);
    var arr = [], acc = 0, j = 0;
    while (true) {
      var dsh = pat[j % pat.length], gap = pat[(j + 1) % pat.length]; j += 2;
      if (acc + dsh >= rev) { arr.push((rev - acc).toFixed(1), (len + 100).toFixed(0)); break; }
      arr.push(dsh, gap); acc += dsh + gap;
      if (acc >= rev) { arr.push(0, (len + 100).toFixed(0)); break; }
    }
    return arr.join(' ');
  }
  // fracción de cada tramo según el avance global (fresco) y el de la tinta seca
  function pintarTramos(p, dry) {
    for (var t = 0; t < 3; t++) {
      var tr = tramos[t], f = clamp((p - P[t]) / (P[t + 1] - P[t]), 0, 1), dd = clamp((dry - P[t]) / (P[t + 1] - P[t]), 0, 1);
      if (Math.abs(f - tr.pf) > 1e-4) { for (var k = 0; k < 4; k++) tr.fresh[k].style.strokeDasharray = dashes(TRAZOS[k][1], tr.len, f * tr.len); tr.pf = f; }
      if (Math.abs(dd - tr.pd) > 1e-4) { tr.seco.style.strokeDasharray = dashes(null, tr.len, dd * tr.len); tr.pd = dd; }
    }
  }

  /* ---------- sellos y brillo final en capas propias: aparecen con transform y opacity, sin repintar la ruta ---------- */
  var capasSello = sellos.map(function (g, i) {
    var m = /translate\(([-\d.]+)[ ,]+([-\d.]+)\)/.exec(g.getAttribute('transform'));
    var x = +m[1], y = +m[2], tinta = g.querySelector('.sello-tinta');
    var rot = /rotate\(([-\d.]+)\)/.exec(tinta.getAttribute('transform') || '');
    // el sello horneado en imagen (assets/art/sello-N.webp, con las fuentes reales): el texto SVG se volvía a maquetar
    // en cada cambio de escala de la cámara; una imagen se compone sin repintar
    var c = document.createElement('div'), im = document.createElement('img');
    c.className = 'sello-capa'; c.setAttribute('aria-hidden', 'true');
    im.src = '/travels/assets/art/sello-' + (i + 1) + '.webp'; im.alt = ''; im.decoding = 'async';
    c.style.left = ((x - 80) / MW * 100).toFixed(3) + '%'; c.style.top = ((y - 80) / MH * 100).toFixed(3) + '%';
    c.style.width = (160 / MW * 100).toFixed(3) + '%';
    c.appendChild(im); lam.appendChild(c);
    c.giro = rot ? +rot[1] : 0;
    return c;
  });
  // el texto SVG de los sellos originales se volvía a maquetar con cada movimiento de la cámara: en modo animado se retiran
  var grupoSellos = svg.querySelector('.sellos');
  if (grupoSellos) grupoSellos.parentNode.removeChild(grupoSellos);
  var luzCapa = document.createElementNS(NS, 'svg');
  luzCapa.setAttribute('class', 'lamina-ruta lamina-luz'); luzCapa.setAttribute('viewBox', '0 0 ' + MW + ' ' + MH); luzCapa.setAttribute('aria-hidden', 'true');
  luz.parentNode.removeChild(luz); luzCapa.appendChild(luz);
  lam.insertBefore(luzCapa, llama);

  /* ---------- textos que se animan letra a letra: copia visual, el original queda para el lector de pantalla ---------- */
  function partir(src, cls) {
    var old = src.parentNode.querySelector('.' + cls);
    if (old) old.remove();
    var out = document.createElement('span');
    out.className = cls; out.setAttribute('aria-hidden', 'true');
    var words = src.textContent.trim().split(/\s+/);
    words.forEach(function (w, wi) {
      var pal = document.createElement('span'); pal.className = 'pal';
      Array.prototype.forEach.call(w, function (c) { var ch = document.createElement('span'); ch.className = 'ch'; ch.textContent = c; pal.appendChild(ch); });
      out.appendChild(pal);
      // el eslogan se parte en su coma: «Tu ruta, / tu gente.»
      if (wi < words.length - 1) out.appendChild(cls === 'lema-anim' && /,$/.test(w) ? document.createElement('br') : document.createTextNode(' '));
    });
    src.classList.add('vh-viaje');
    src.parentNode.appendChild(out);
    return out;
  }
  function textos() {
    paradas.forEach(function (li, i) {
      li.querySelector('.parada-paso').textContent = tr('route.step').replace('{n}', i + 1);
      partir(li.querySelector('.ciudad-txt'), 'ciudad-anim');
    });
    partir(final.querySelector('.lema-txt'), 'lema-anim');
  }

  /* ---------- la cámara ---------- */
  var W = 0, H = 0, BS = 1, LW = 1, LH = 1, modo = null;
  var st = { intro: 0, leg: 0, outro: 0, dry: 0, p: 0 };
  function medir() {
    W = escena.clientWidth; H = escena.clientHeight;
    modo = window.matchMedia(Q_HORIZ).matches ? CFG.horizontal : CFG.vertical;
    BS = Math.min(W * .9 / MW, H * .86 / MH);           // px de pantalla por px del mapa con la lámina entera
    // la capa nunca pasa de la resolución nativa de la pintura (rasterizar más grande no agrega detalle y cuesta mucho)
    var lw = Math.min(MW * BS * modo.zoomMax, MW), lh = lw * MH / MW;
    LW = lw; LH = lh;
    lam.style.width = lw.toFixed(1) + 'px';
    lam.style.height = lh.toFixed(1) + 'px';
    img.sizes = Math.round(lw) + 'px';
  }
  // cover (0–1): cuánto evita la cámara mostrar el borde de la lámina cuando está acercada
  // lado (0–1): 0 = el texto a la derecha y el mapa a la izquierda; 1 = al revés
  function cam(fx, fy, z, ax, ay, cover, abre, lado) {
    var ps = BS * z, k = ps * MW / LW, tx = ax * W - fx * ps, ty = ay * H - fy * ps;
    var lw = MW * ps, lh = MH * ps;
    if (cover > 0) {
      var wc = W * mix(modo.ancho, 1, abre || 0), ld = lado || 0;
      if (lw > wc) tx = mix(tx, clamp(tx, mix(wc - lw, W - lw, ld), mix(0, W - wc, ld)), cover);
      var hc = H * modo.alto;
      if (lh > hc) ty = mix(ty, clamp(ty, hc - lh, 0), cover);
    }
    lam.style.transform = 'translate3d(' + tx.toFixed(2) + 'px,' + ty.toFixed(2) + 'px,0) scale(' + k.toFixed(5) + ')';
    return z;
  }
  function zp(i) { return CFG.paradas[i].zoom * modo.escala; }
  function lado(i) { return modo === CFG.horizontal && CFG.paradas[i].izq ? 1 : 0; }
  function ancla(i) { return lado(i) ? modo.paradaIzq : modo.parada; }
  function render() {
    var C = CFG.paradas, m = modo, z, p;
    if (st.outro > 0) {
      var o = st.outro, c3 = C[3];
      p = 1;
      z = cam(mix(c3.x, MW / 2, o), mix(c3.y, MH / 2, o), mix(zp(3), m.zFin, o), mix(ancla(3)[0], m.fin[0], o), mix(ancla(3)[1], m.fin[1], o), 1 - smooth(0, .5, o), 0, lado(3));
    } else if (st.intro < 1) {
      var e = st.intro, c0 = C[0];
      p = 0;
      z = cam(mix(m.introFoco[0] * MW, c0.x, e), mix(m.introFoco[1] * MH, c0.y, e), mix(m.zIntro, zp(0), e), mix(m.intro[0], ancla(0)[0], e), mix(m.intro[1], ancla(0)[1], e), smooth(.5, 1, e), 0, lado(0));
    } else {
      var i = Math.min(2, Math.floor(st.leg)), t = clamp(st.leg - i, 0, 1), a = C[i], b = C[i + 1];
      p = mix(P[i], P[i + 1], t);
      var q = at(p);
      var fx = mix(mix(a.x, q[0], smooth(0, .32, t)), b.x, smooth(.68, 1, t));
      var fy = mix(mix(a.y, q[1], smooth(0, .32, t)), b.y, smooth(.68, 1, t));
      var zb = mix(zp(i), zp(i + 1), t);
      var sl = smooth(.15, .85, t), ld = mix(lado(i), lado(i + 1), sl);
      z = cam(fx, fy, zb - (zb - m.vuelo) * Math.sin(Math.PI * t), mix(ancla(i)[0], ancla(i + 1)[0], sl), mix(ancla(i)[1], ancla(i + 1)[1], sl), 1, Math.sin(Math.PI * t), ld);
    }
    // la pincelada fresca llega hasta el símbolo; la tinta seca la sigue en cada parada
    pintarTramos(p, st.dry);
    // la llama es una capa propia anclada al final de la ruta: se mueve con transform, sin repintar nada
    var pos = at(p), sc = clamp(Math.pow(zp(0) / z, .7), .8, 1.9) * m.llama;
    llama.style.transform = 'translate3d(' + ((pos[0] - FX) / MW * LW).toFixed(2) + 'px,' + ((pos[1] - FY) / MH * LH).toFixed(2) + 'px,0) scale(' + sc.toFixed(3) + ')';
  }

  /* ---------- posición de reposo de un elemento dentro del escenario (sin transformaciones) ---------- */
  function centro(el) {
    var x = el.offsetWidth / 2, y = el.offsetHeight / 2, n = el;
    while (n && n !== escena) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
    return [x, y];
  }

  /* ---------- la coreografía ---------- */
  var ctx = null;
  function construir() {
    if (ctx) ctx.revert();
    textos();
    medir();
    tramos.forEach(function (t) { t.pf = t.pd = -1; });
    st.intro = st.leg = st.outro = st.dry = 0;

    ctx = gsap.context(function () {
      var E = 100 / CFG.beat;                     // la entrada dura lo que tarda la escena en llegar arriba (100svh)
      var tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: pista, start: 'top bottom', end: 'bottom bottom', scrub: .8, invalidateOnRefresh: true,
          onRefresh: function () { medir(); render(); },
          onToggle: function (self) { sec.classList.toggle('is-activa', self.isActive); document.documentElement.classList.toggle('viaje-activa', self.isActive); }
        },
        onUpdate: render
      });
      var cityPt = function (i) { return [ancla(i)[0] * W, ancla(i)[1] * H]; };
      var velo = function (i) { return lado(i) ? '.viaje-velo--izq' : '.viaje-velo--der'; };

      /* 1 · entrada: la lámina llega inclinada sobre la mesa, entre la bruma */
      gsap.set(marco, { transformOrigin: '50% 62%' });
      tl.fromTo(marco, { rotationX: 52, rotationZ: -8, scale: .82, yPercent: 16 }, { rotationX: 30, rotationZ: -5, scale: .88, yPercent: 12, duration: E, ease: 'power1.out' }, 0);
      tl.fromTo('.bruma--a', { xPercent: -4, yPercent: 18 }, { xPercent: 0, yPercent: 0, duration: E }, 0);
      tl.fromTo('.bruma--b', { xPercent: 6, yPercent: -10 }, { xPercent: 0, yPercent: 0, duration: E }, 0);
      gsap.set(['.viaje-velo', llama], { opacity: 0 });

      /* 2 · la cámara se endereza y baja hasta Medellín; la bruma se abre hacia los lados */
      var T = E;
      tl.to(marco, { rotationX: 0, rotationZ: 0, scale: 1, yPercent: 0, duration: 1.5, ease: 'power2.inOut' }, T);
      tl.to(st, { intro: 1, duration: 1.5, ease: 'power3.inOut' }, T);
      tl.to('.bruma--a', { xPercent: -115, yPercent: 40, scale: 1.5, duration: 1.3, ease: 'power2.in' }, T);
      tl.to('.bruma--b', { xPercent: 115, yPercent: -50, scale: 1.4, duration: 1.3, ease: 'power2.in' }, T + .05);
      tl.to(velo(0), { opacity: 1, duration: .5 }, T + 1.1);
      tl.to(llama, { opacity: 1, duration: .3 }, T + 1.2);
      tl.to(head, { y: -50, opacity: 0, duration: .55, ease: 'power2.in' }, T + .1);
      T += 1.3;

      /* 3 · cada parada: el sello, el nombre, la postal que se despliega desde la ciudad y el pilar */
      var HOLD = 2.1, LEG = [1.6, 2.1, 1.5];
      paradas.forEach(function (li, i) {
        var chs = li.querySelectorAll('.ciudad-anim .ch');
        var postal = li.querySelector('.postal');
        var paso = li.querySelector('.parada-paso');
        var pilar = li.querySelector('.parada-pilar');
        var desc = li.querySelector('.parada-desc');
        var tinta = capasSello[i];
        var giro = i % 2 ? 3.5 : -3;
        var dx = function () { return cityPt(i)[0] - centro(postal)[0]; };
        var dy = function () { return cityPt(i)[1] - centro(postal)[1]; };

        gsap.set([paso, pilar, desc], { opacity: 0 });
        gsap.set(chs, { yPercent: 118 });
        gsap.set(postal, { opacity: 0, transformPerspective: 900 });
        gsap.set(tinta, { opacity: 0, scale: 1.9, rotation: tinta.giro });

        tl.to(tinta, { opacity: .9, scale: 1, duration: .35, ease: 'back.out(2.4)' }, T + .1);
        tl.fromTo(paso, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .35, ease: 'power2.out' }, T);
        tl.to(chs, { yPercent: 0, duration: .45, stagger: .028, ease: 'power3.out' }, T + .04);
        tl.fromTo(postal,
          { x: dx, y: dy, scale: .08, rotation: giro * 5, rotationX: 62, opacity: 0 },
          { x: 0, y: 0, scale: 1, rotation: giro, rotationX: 0, opacity: 1, duration: .75, ease: 'expo.out', immediateRender: false }, T + .12);
        tl.fromTo(pilar, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .4, ease: 'power2.out' }, T + .34);
        tl.fromTo(desc, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .4, ease: 'power2.out' }, T + .42);
        // la tinta del tramo anterior se seca mientras lees
        if (i > 0) tl.to(st, { dry: P[i], duration: 1.4, ease: 'sine.inOut' }, T + .2);

        // salida: la postal vuelve a su ciudad y el nombre se va por arriba
        var out = T + HOLD - .45;
        tl.to(chs, { yPercent: -118, duration: .35, stagger: .015, ease: 'power2.in' }, out);
        tl.to([paso, pilar, desc], { opacity: 0, y: -14, duration: .3, ease: 'power2.in' }, out);
        tl.to(postal, { x: dx, y: dy, scale: .06, rotation: -giro * 4, opacity: 0, duration: .45, ease: 'power3.in' }, out);
        T += HOLD;

        if (i < 3) {
          tl.to(st, { leg: i + 1, duration: LEG[i], ease: 'power1.inOut' }, T);
          // en horizontal el velo se retira mientras se viaja: el mapa entero a la vista
          if (modo === CFG.horizontal) {
            tl.to(velo(i), { opacity: .15, duration: .5, ease: 'sine.inOut' }, T);
            if (velo(i) !== velo(i + 1)) tl.to(velo(i), { opacity: 0, duration: .4, ease: 'sine.inOut' }, T + LEG[i] - .55);
            tl.to(velo(i + 1), { opacity: 1, duration: .5, ease: 'sine.inOut' }, T + LEG[i] - .55);
          } else if (i === 0) tl.set('.viaje-velo--izq', { opacity: 0 }, T);
          if (i === 1) { // el tramo largo cruza una nube
            tl.fromTo('.bruma--paso', { xPercent: 85, yPercent: 10, scale: 1.1 }, { xPercent: -120, yPercent: -12, scale: 1.8, duration: LEG[i] * .9 }, T + .1);
            tl.fromTo('.bruma--paso', { opacity: 0 }, { opacity: .85, duration: LEG[i] * .35, ease: 'sine.out' }, T + .1);
            tl.to('.bruma--paso', { opacity: 0, duration: LEG[i] * .35, ease: 'sine.in' }, T + .1 + LEG[i] * .55);
          }
          T += LEG[i];
        }
      });

      /* 4 · final: la cámara se aleja, la ruta entera se ilumina y llega el eslogan */
      T -= .2;
      tl.to(st, { outro: 1, duration: 1.7, ease: 'power3.inOut' }, T);
      tl.to(velo(3), { opacity: 0, duration: 1, ease: 'sine.inOut' }, T + .5);
      tl.to(st, { dry: 1, duration: 1, ease: 'sine.inOut' }, T + .2);
      tl.fromTo(luzCapa, { opacity: 0 }, { opacity: 1, duration: .8, ease: 'sine.inOut' }, T + .9);
      var postalFin = final.querySelector('.postal--final');
      var lema = final.querySelectorAll('.lema-anim .ch');
      gsap.set(lema, { yPercent: 118 });
      tl.fromTo(postalFin, { opacity: 0, y: 90, rotation: 7, scale: .9, transformPerspective: 900, rotationX: 30 },
        { opacity: 1, y: 0, rotation: -2.5, scale: 1, rotationX: 0, duration: .9, ease: 'expo.out' }, T + 1.1);
      tl.to(lema, { yPercent: 0, duration: .55, stagger: .022, ease: 'power3.out' }, T + 1.35);
      T += 1.9;

      /* 5 · transición: sube el papel de la sección siguiente; el eslogan se queda encima y se va con el scroll */
      tl.fromTo('.viaje-telon', { yPercent: 101 }, { yPercent: 0, duration: 1.1, ease: 'power2.inOut' }, T);
      tl.to(postalFin, { opacity: 0, y: -50, duration: .6, ease: 'power2.in' }, T);
      // el eslogan baja hacia la sección siguiente: menos papel liso al despegarse la escena
      tl.to(final.querySelector('.viaje-lema'), { y: function () { return H * .22; }, duration: 1.1, ease: 'power2.inOut' }, T);
      tl.to(marco, { scale: .94, yPercent: -4, duration: 1.1, ease: 'power2.in' }, T);
      T += 1.15;

      sec.style.setProperty('--beats', (T - E).toFixed(2));
      render();
    }, sec);
    ST.refresh();
  }

  /* ---------- arranque: cambia el diseño de la sección sin mover lo que estás leyendo ---------- */
  var siguiente = document.getElementById('safety') || sec.nextElementSibling;
  var antes = siguiente ? siguiente.getBoundingClientRect().top : 0;
  var arriba = sec.getBoundingClientRect().top < 0;
  sec.style.setProperty('--beat', String(CFG.beat));
  escena.insertBefore(head, escena.firstChild);   // el encabezado entra con la lámina
  sec.classList.add('viaje-on');
  if (arriba && siguiente) window.scrollTo({ top: window.scrollY + siguiente.getBoundingClientRect().top - antes, behavior: 'instant' });
  construir();

  // al cambiar de idioma cambian los nombres y el eslogan: se rehace la coreografía en el mismo punto
  new MutationObserver(function () { setTimeout(construir, 0); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  // al cambiar entre horizontal y vertical se recalcula el encuadre
  var mq = window.matchMedia(Q_HORIZ);
  if (mq.addEventListener) mq.addEventListener('change', function () { construir(); });
  if (img && !img.complete) img.addEventListener('load', function () { ST.refresh(); }, { once: true });
})();
