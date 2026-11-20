/* Lumen Travels · efectos de la landing (mejora progresiva).
   La luz cálida del hero, el latido del símbolo con chispas, la ruta que se recorre y el farol que se enciende al registrarte.
   Nada de esto es necesario para leer la página ni para enviar el formulario (eso vive en app.js). */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('fx');
  var mq = function (q) { return window.matchMedia ? window.matchMedia(q).matches : false; };
  var reduce = mq('(prefers-reduced-motion: reduce)');
  var finePointer = mq('(hover: hover) and (pointer: fine)');

  /* ---------- chispas doradas ---------- */
  function sparks(x, y, dir, n) {
    if (reduce || !Element.prototype.animate) return;
    n = n || 14;
    for (var i = 0; i < n; i++) {
      var sp = document.createElement('span');
      sp.className = 'spark';
      document.body.appendChild(sp);
      var a = (-90 + dir * 35 + (Math.random() - 0.5) * 140) * Math.PI / 180;
      var d = 40 + Math.random() * 80, dx = Math.cos(a) * d, dy = Math.sin(a) * d;
      var sz = 3 + Math.random() * 5;
      sp.style.width = sp.style.height = sz.toFixed(1) + 'px';
      if (Math.random() < 0.35) sp.style.background = '#ffd27a';
      var anim = sp.animate([
        { transform: 'translate(' + x + 'px,' + y + 'px) scale(1)', opacity: 1 },
        { transform: 'translate(' + (x + dx) + 'px,' + (y + dy + 60) + 'px) scale(.2)', opacity: 0 }
      ], { duration: 550 + Math.random() * 450, easing: 'cubic-bezier(.16,1,.3,1)' });
      anim.onfinish = (function (el) { return function () { el.remove(); }; })(sp);
    }
  }
  function burstFrom(el, n) {
    if (!el) return;
    var r = el.getBoundingClientRect();
    var cx = r.left + r.width / 2, cy = r.top + r.height * 0.55;
    sparks(cx, cy, -1, n); sparks(cx, cy, 1, n);
  }

  function init() {
    var hero = document.querySelector('.hero');
    var lamp = document.getElementById('lamp');

    /* ---------- 1. la luz: sigue al mouse en el hero; si no, se queda en el farol ---------- */
    var lx = 0, ly = 0, tx = 0, ty = 0, inHero = false, raf = 0;
    function paint() {
      doc.style.setProperty('--lx', lx.toFixed(1) + 'px');
      doc.style.setProperty('--ly', ly.toFixed(1) + 'px');
    }
    function anchor() {
      if (!lamp) return;
      var r = lamp.getBoundingClientRect();
      tx = r.left + r.width / 2; ty = r.top + r.height * 0.55;
      if (!inHero) { lx = tx; ly = ty; paint(); }
    }
    function loop() {
      lx += (tx - lx) * 0.08; ly += (ty - ly) * 0.08; paint();
      raf = (Math.abs(tx - lx) > 0.5 || Math.abs(ty - ly) > 0.5) ? requestAnimationFrame(loop) : 0;
    }
    anchor();
    addEventListener('resize', anchor);
    addEventListener('scroll', function () { if (!inHero) anchor(); }, { passive: true });
    if (hero && finePointer && !reduce) {
      hero.addEventListener('pointermove', function (e) { inHero = true; tx = e.clientX; ty = e.clientY; if (!raf) raf = requestAnimationFrame(loop); });
      hero.addEventListener('pointerleave', function () { inHero = false; var r = lamp.getBoundingClientRect(); tx = r.left + r.width / 2; ty = r.top + r.height * 0.55; if (!raf) raf = requestAnimationFrame(loop); });
    }

    /* ---------- 2. tocar el símbolo: late y suelta unas chispas discretas ---------- */
    if (lamp) {
      var hitTimer = 0;
      lamp.addEventListener('click', function (e) {
        var r = lamp.getBoundingClientRect();
        var x = e.clientX || (r.left + r.width / 2);
        var y = e.clientY || (r.top + r.height / 2);
        sparks(x, y, x < r.left + r.width / 2 ? 1 : -1, 8);
        lamp.classList.remove('is-hit'); void lamp.offsetWidth; lamp.classList.add('is-hit');
        clearTimeout(hitTimer);
        hitTimer = setTimeout(function () { lamp.classList.remove('is-hit'); }, 520);
      });
    }

    /* ---------- 3. la ruta: el símbolo de Lumen viaja sobre la línea al ritmo del scroll ----------
       Avance por tramos: llega a cada ciudad justo cuando su parada pasa por el centro de la vista.
       Con movimiento reducido no hay desplazamiento continuo: salta de ciudad en ciudad. */
    var map = document.querySelector('.route-map');
    var stops = document.querySelectorAll('.stop');
    var path = document.getElementById('route-path');
    if (map && stops.length === 4 && path && path.getTotalLength) {
      var traveler = map.querySelector('.traveler');
      var pins = map.querySelectorAll('.pin');
      var card = map.querySelector('.map-card');
      var cStep = map.querySelector('.map-step'), cCity = map.querySelector('.map-city'), cKm = map.querySelector('.map-km'), cThumb = map.querySelector('.map-thumb');
      var CITY = [[128, 318], [236, 404], [112, 112], [306, 66]];
      var ICONS = ['ic-medellin', 'ic-bogota', 'ic-cartagena', 'ic-tayrona'];
      // distancia aproximada en línea recta (haversine entre coordenadas de las ciudades), acumulada desde Medellín
      var KM = [0, 240, 890, 1080];
      var L = path.getTotalLength();
      // fracción de la línea en la que queda cada ciudad (punto más cercano del trazado)
      var F = CITY.map(function (c) {
        var best = 0, bd = 1e9;
        for (var s = 0; s <= 400; s++) {
          var pt = path.getPointAtLength(L * s / 400), d = (pt.x - c[0]) * (pt.x - c[0]) + (pt.y - c[1]) * (pt.y - c[1]);
          if (d < bd) { bd = d; best = s / 400; }
        }
        return best;
      });
      F[0] = 0; F[3] = 1;
      var tr = window.__lumenLanding && window.__lumenLanding.t ? window.__lumenLanding.t : function () { return ''; };
      var lang = function () { return window.__lumenLanding ? window.__lumenLanding.lang() : 'en'; };
      var active = -1, shownP = -1;

      var fmt = function (n) { try { return n.toLocaleString(lang() === 'es' ? 'es-CO' : 'en-US'); } catch (e) { return String(n); } };
      var paintCard = function (i, km) {
        cStep.textContent = tr('route.step').replace('{n}', i + 1);
        var place = stops[i].querySelector('.stop-place');
        var name = place ? place.cloneNode(true) : null;
        if (name) { var n = name.querySelector('.stop-n'); if (n) n.remove(); }
        cCity.textContent = name ? name.textContent.trim() : '';
        cKm.textContent = km < 5 ? tr('route.start') : tr('route.km').replace('{km}', fmt(Math.round(km / 10) * 10));
      };
      var paintThumb = function (i) {
        var img = stops[i].querySelector('img.art');
        cThumb.textContent = '';
        cThumb.style.backgroundImage = '';
        if (img) {
          cThumb.style.backgroundImage = 'url("' + (img.currentSrc || img.src) + '")';
        } else {
          var ns = 'http://www.w3.org/2000/svg';
          var svg = document.createElementNS(ns, 'svg'); svg.setAttribute('class', 'icon');
          var use = document.createElementNS(ns, 'use'); use.setAttribute('href', '/assets/icons/sprite.svg#' + ICONS[i]);
          svg.appendChild(use); cThumb.appendChild(svg);
        }
      };
      var setActive = function (i) {
        if (i === active) return;
        active = i;
        map.setAttribute('data-stop', String(i + 1));
        for (var k = 0; k < pins.length; k++) {
          var n = +pins[k].getAttribute('data-pin') - 1;
          pins[k].classList.toggle('is-active', n === i);
          pins[k].classList.toggle('is-visited', n <= i);
        }
        paintThumb(i);
        card.classList.remove('is-new'); void card.offsetWidth; card.classList.add('is-new');
      };
      var place = function (p, km, i) {
        if (Math.abs(p - shownP) > 0.0005) {
          shownP = p;
          map.style.setProperty('--p', p.toFixed(4));
          var pt = path.getPointAtLength(L * p);
          traveler.setAttribute('transform', 'translate(' + pt.x.toFixed(1) + ' ' + pt.y.toFixed(1) + ')');
        }
        paintCard(i, km);
      };
      var anchorY = function () {
        var sticky = getComputedStyle(map).position === 'sticky' && innerWidth < 1000;
        if (sticky) { var r = map.getBoundingClientRect(); return r.bottom + (innerHeight - r.bottom) * 0.5; }
        return innerHeight * 0.5;
      };
      var update = function () {
        var y = anchorY();
        var c = Array.prototype.map.call(stops, function (s) { var r = s.getBoundingClientRect(); return r.top + r.height / 2; });
        var i = 0, t = 0;
        if (y <= c[0]) { i = 0; t = 0; }
        else if (y >= c[3]) { i = 3; t = 0; }
        else { for (var k = 0; k < 3; k++) if (y >= c[k] && y < c[k + 1]) { i = k; t = (y - c[k]) / (c[k + 1] - c[k]); } }
        var nearest = t >= 0.5 ? Math.min(3, i + 1) : i;
        setActive(nearest);
        if (reduce) { place(F[nearest], KM[nearest], nearest); return; }
        // pequeña pausa en cada ciudad: el avance arranca al 15 % del tramo y termina al 85 %
        var e = Math.max(0, Math.min(1, (t - 0.15) / 0.7));
        e = e < 0.5 ? 2 * e * e : 1 - Math.pow(-2 * e + 2, 2) / 2;
        var j = i === 3 ? 3 : i + 1;
        place(F[i] + (F[j] - F[i]) * e, KM[i] + (KM[j] - KM[i]) * e, nearest);
      };
      var ticking = false;
      var onScroll = function () { if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; update(); }); } };
      addEventListener('scroll', onScroll, { passive: true });
      addEventListener('resize', onScroll);
      document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('[data-lang]')) setTimeout(function () { shownP = -1; update(); }, 0); });
      // las escenas llegan con carga diferida: al cargar, refresca la miniatura
      Array.prototype.forEach.call(document.querySelectorAll('.stop img.art'), function (img) { img.addEventListener('load', function () { var a = active; active = -1; setActive(a); }); });
      update();
    }

    /* ---------- 4. confirmaciones: el farol se enciende con chispas ---------- */
    var success = document.getElementById('form-success');
    var join = document.querySelector('.join');
    var reserveMsg = document.getElementById('reserve-msg');
    if ('MutationObserver' in window) {
      if (success) new MutationObserver(function () {
        if (success.hidden) return;
        if (join) join.classList.add('is-lit');
        setTimeout(function () {
          burstFrom(document.querySelector('.mark--join'), 10);
        }, 120);
      }).observe(success, { attributes: true, attributeFilter: ['hidden'] });
      if (reserveMsg) new MutationObserver(function () {
        if (!reserveMsg.hidden) setTimeout(function () { burstFrom(reserveMsg.querySelector('.mark'), 5); }, 80);
      }).observe(reserveMsg, { attributes: true, attributeFilter: ['hidden'] });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
