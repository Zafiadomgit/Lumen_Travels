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
      { x: 760, y: 890, zoom: 2.3 },     // Medellín
      { x: 2110, y: 1270, zoom: 2.05 },  // Bogotá
      { x: 360, y: 470, zoom: 2.35 },    // Cartagena
      { x: 1745, y: 640, zoom: 2.35 }    // Santa Marta y Tayrona
    ],
    // por formato: resolución de la capa (zoomMax), multiplicador del zoom de las paradas, apertura en mitad de cada tramo,
    // encuadre de la entrada y del final, ancla (dónde queda el foco, en fracción del escenario) y tamaño del símbolo
    // alto: fracción del escenario que la lámina debe cubrir siempre (en vertical, hasta donde empieza el texto)
    horizontal: { zoomMax: 2.7, escala: 1, vuelo: 1.4, intro: [.5, .5], introFoco: [.5, .5], zIntro: 1,
                  parada: [.31, .54], fin: [.37, .53], zFin: .7, llama: 1, alto: 1 },
    vertical:   { zoomMax: 4.2, escala: 1.7, vuelo: 2.5, intro: [.5, .32], introFoco: [.66, .42], zIntro: 2.1,
                  parada: [.5, .31], fin: [.5, .35], zFin: 1.04, llama: 1.5, alto: .62 },
    beat: 46                   // alto de cada «tiempo» de la coreografía, en svh (lo usa también styles.css)
  };
  var Q_HORIZ = '(min-width: 760px) and (min-aspect-ratio: 1/1)';

  var escena = sec.querySelector('.viaje-escena');
  var pista = sec.querySelector('.viaje-pista');
  var marco = sec.querySelector('.lamina-marco');
  var lam = sec.querySelector('.lamina');
  var img = sec.querySelector('.lamina-img');
  var svg = sec.querySelector('.lamina-ruta');
  var pathEl = svg.querySelector('#ruta-d');
  var mascara = svg.querySelector('.ruta-mascara');
  var seca = svg.querySelector('.ruta-seca');
  var luz = svg.querySelector('.ruta-luz');
  var llama = svg.querySelector('.llama');
  var sellos = Array.prototype.slice.call(svg.querySelectorAll('.sello'));
  var paradas = Array.prototype.slice.call(sec.querySelectorAll('.parada'));
  var final = sec.querySelector('.viaje-final');
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
      if (wi < words.length - 1) out.appendChild(document.createTextNode(' '));
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
  var W = 0, H = 0, BS = 1, modo = null;
  var st = { intro: 0, leg: 0, outro: 0, dry: 0, p: 0 };
  function medir() {
    W = escena.clientWidth; H = escena.clientHeight;
    modo = window.matchMedia(Q_HORIZ).matches ? CFG.horizontal : CFG.vertical;
    BS = Math.min(W * .9 / MW, H * .86 / MH);           // px de pantalla por px del mapa con la lámina entera
    var lw = MW * BS * modo.zoomMax, lh = MH * BS * modo.zoomMax;
    lam.style.width = lw.toFixed(1) + 'px';
    lam.style.height = lh.toFixed(1) + 'px';
    img.sizes = Math.round(lw) + 'px';
  }
  // cover (0–1): cuánto evita la cámara mostrar el borde de la lámina cuando está acercada
  function cam(fx, fy, z, ax, ay, cover) {
    var k = z / modo.zoomMax, ps = BS * z, tx = ax * W - fx * ps, ty = ay * H - fy * ps;
    var lw = MW * ps, lh = MH * ps;
    if (cover > 0) {
      if (lw > W) tx = mix(tx, clamp(tx, W - lw, 0), cover);
      var hc = H * modo.alto;
      if (lh > hc) ty = mix(ty, clamp(ty, hc - lh, 0), cover);
    }
    lam.style.transform = 'translate3d(' + tx.toFixed(2) + 'px,' + ty.toFixed(2) + 'px,0) scale(' + k.toFixed(5) + ')';
    return z;
  }
  var lastP = -1, lastD = -1;
  function zp(i) { return CFG.paradas[i].zoom * modo.escala; }
  function render() {
    var C = CFG.paradas, m = modo, z, p;
    if (st.outro > 0) {
      var o = st.outro, c3 = C[3];
      p = 1;
      z = cam(mix(c3.x, MW / 2, o), mix(c3.y, MH / 2, o), mix(zp(3), m.zFin, o), mix(m.parada[0], m.fin[0], o), mix(m.parada[1], m.fin[1], o), 1 - smooth(0, .5, o));
    } else if (st.intro < 1) {
      var e = st.intro, c0 = C[0];
      p = 0;
      z = cam(mix(m.introFoco[0] * MW, c0.x, e), mix(m.introFoco[1] * MH, c0.y, e), mix(m.zIntro, zp(0), e), mix(m.intro[0], m.parada[0], e), mix(m.intro[1], m.parada[1], e), smooth(.5, 1, e));
    } else {
      var i = Math.min(2, Math.floor(st.leg)), t = clamp(st.leg - i, 0, 1), a = C[i], b = C[i + 1];
      p = mix(P[i], P[i + 1], t);
      var q = at(p);
      var fx = mix(mix(a.x, q[0], smooth(0, .32, t)), b.x, smooth(.68, 1, t));
      var fy = mix(mix(a.y, q[1], smooth(0, .32, t)), b.y, smooth(.68, 1, t));
      var zb = mix(zp(i), zp(i + 1), t);
      z = cam(fx, fy, zb - (zb - m.vuelo) * Math.sin(Math.PI * t), m.parada[0], m.parada[1], 1);
    }
    // la pincelada fresca llega hasta el símbolo; la tinta seca la sigue en cada parada
    if (Math.abs(p - lastP) > 1e-5) { mascara.style.strokeDashoffset = (L * (1 - p)).toFixed(1); lastP = p; }
    if (Math.abs(st.dry - lastD) > 1e-5) { seca.style.strokeDashoffset = (L * (1 - st.dry)).toFixed(1); lastD = st.dry; }
    var pos = at(p), sc = clamp(Math.pow(zp(0) / z, .7), .8, 1.9) * m.llama;
    llama.setAttribute('transform', 'translate(' + pos[0].toFixed(1) + ' ' + pos[1].toFixed(1) + ') scale(' + sc.toFixed(3) + ')');
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
    lastP = lastD = -1;
    st.intro = st.leg = st.outro = st.dry = 0;
    var dash = L.toFixed(1) + ' ' + (L + 40).toFixed(1);
    mascara.style.strokeDasharray = dash; seca.style.strokeDasharray = dash;

    ctx = gsap.context(function () {
      var E = 100 / CFG.beat;                     // la entrada dura lo que tarda la escena en llegar arriba (100svh)
      var tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: pista, start: 'top bottom', end: 'bottom bottom', scrub: 1.1, invalidateOnRefresh: true,
          onRefresh: function () { medir(); render(); },
          onToggle: function (self) { sec.classList.toggle('is-activa', self.isActive); }
        },
        onUpdate: render
      });
      var cityPt = function () { return [modo.parada[0] * W, modo.parada[1] * H]; };

      /* 1 · entrada: la lámina llega inclinada sobre la mesa, entre la bruma */
      gsap.set(marco, { transformOrigin: '50% 62%' });
      tl.fromTo(marco, { rotationX: 52, rotationZ: -8, scale: .82, yPercent: 16 }, { rotationX: 30, rotationZ: -5, scale: .92, yPercent: 2, duration: E, ease: 'power1.out' }, 0);
      tl.fromTo('.bruma--a', { xPercent: -4, yPercent: 18 }, { xPercent: 0, yPercent: 0, duration: E }, 0);
      tl.fromTo('.bruma--b', { xPercent: 6, yPercent: -10 }, { xPercent: 0, yPercent: 0, duration: E }, 0);
      gsap.set(['.viaje-velo', llama], { opacity: 0 });

      /* 2 · la cámara se endereza y baja hasta Medellín; la bruma se abre hacia los lados */
      var T = E;
      tl.to(marco, { rotationX: 0, rotationZ: 0, scale: 1, yPercent: 0, duration: 1.5, ease: 'power2.inOut' }, T);
      tl.to(st, { intro: 1, duration: 1.5, ease: 'power3.inOut' }, T);
      tl.to('.bruma--a', { xPercent: -115, yPercent: 40, scale: 1.5, duration: 1.3, ease: 'power2.in' }, T);
      tl.to('.bruma--b', { xPercent: 115, yPercent: -50, scale: 1.4, duration: 1.3, ease: 'power2.in' }, T + .05);
      tl.to('.viaje-velo', { opacity: 1, duration: .5 }, T + 1.1);
      tl.to(llama, { opacity: 1, duration: .3 }, T + 1.2);
      T += 1.3;

      /* 3 · cada parada: el sello, el nombre, la postal que se despliega desde la ciudad y el pilar */
      var HOLD = 2.1, LEG = [1.6, 2.1, 1.5];
      paradas.forEach(function (li, i) {
        var chs = li.querySelectorAll('.ciudad-anim .ch');
        var postal = li.querySelector('.postal');
        var paso = li.querySelector('.parada-paso');
        var pilar = li.querySelector('.parada-pilar');
        var desc = li.querySelector('.parada-desc');
        var tinta = sellos[i].querySelector('.sello-tinta');
        var giro = i % 2 ? 3.5 : -3;
        var dx = function () { return cityPt()[0] - centro(postal)[0]; };
        var dy = function () { return cityPt()[1] - centro(postal)[1]; };

        gsap.set([paso, pilar, desc], { opacity: 0 });
        gsap.set(chs, { yPercent: 118 });
        gsap.set(postal, { opacity: 0, transformPerspective: 900 });
        gsap.set(tinta, { opacity: 0, scale: 1.9, transformOrigin: '50% 50%' });

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
      tl.to(st, { dry: 1, duration: 1, ease: 'sine.inOut' }, T + .2);
      tl.fromTo(luz, { opacity: 0 }, { opacity: 1, duration: .8, ease: 'sine.inOut' }, T + .9);
      var postalFin = final.querySelector('.postal--final');
      var lema = final.querySelectorAll('.lema-anim .ch');
      gsap.set(lema, { yPercent: 118 });
      tl.fromTo(postalFin, { opacity: 0, y: 90, rotation: 7, scale: .9, transformPerspective: 900, rotationX: 30 },
        { opacity: 1, y: 0, rotation: -2.5, scale: 1, rotationX: 0, duration: .9, ease: 'expo.out' }, T + 1.1);
      tl.to(lema, { yPercent: 0, duration: .55, stagger: .022, ease: 'power3.out' }, T + 1.35);
      T += 2.6;

      /* 5 · transición: sube el papel de la sección siguiente; el eslogan se queda encima y se va con el scroll */
      tl.fromTo('.viaje-telon', { yPercent: 101 }, { yPercent: 0, duration: 1.1, ease: 'power2.inOut' }, T);
      tl.to(postalFin, { opacity: 0, y: -50, duration: .6, ease: 'power2.in' }, T);
      tl.to(marco, { scale: .94, yPercent: -4, duration: 1.1, ease: 'power2.in' }, T);
      T += 1.15;

      sec.style.setProperty('--beats', (T - E).toFixed(2));
      render();
    }, sec);
    ST.refresh();
  }

  /* ---------- arranque: cambia el diseño de la sección sin mover lo que estás leyendo ---------- */
  var ancla = document.getElementById('safety') || sec.nextElementSibling;
  var antes = ancla ? ancla.getBoundingClientRect().top : 0;
  var arriba = sec.getBoundingClientRect().top < 0;
  sec.style.setProperty('--beat', String(CFG.beat));
  sec.classList.add('viaje-on');
  if (arriba && ancla) window.scrollTo({ top: window.scrollY + ancla.getBoundingClientRect().top - antes, behavior: 'instant' });
  construir();

  // al cambiar de idioma cambian los nombres y el eslogan: se rehace la coreografía en el mismo punto
  new MutationObserver(function () { setTimeout(construir, 0); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  // al cambiar entre horizontal y vertical se recalcula el encuadre
  var mq = window.matchMedia(Q_HORIZ);
  if (mq.addEventListener) mq.addEventListener('change', function () { construir(); });
  if (img && !img.complete) img.addEventListener('load', function () { ST.refresh(); }, { once: true });
})();
