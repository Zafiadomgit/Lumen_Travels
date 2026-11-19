/* Lumen Travels · efectos de la landing (mejora progresiva).
   La luz del farol, el balanceo con chispas, la ruta que se recorre y el farol que se enciende al registrarte.
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
      var d = 50 + Math.random() * 110, dx = Math.cos(a) * d, dy = Math.sin(a) * d;
      var sz = 3 + Math.random() * 5;
      sp.style.width = sp.style.height = sz.toFixed(1) + 'px';
      if (Math.random() < 0.35) sp.style.background = '#fff3c4';
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
      addEventListener('pointermove', function (e) {
        doc.style.setProperty('--mx', e.clientX + 'px');
        doc.style.setProperty('--my', e.clientY + 'px');
      }, { passive: true });
    }

    /* ---------- 2. tocar el farol: péndulo amortiguado y chispas ---------- */
    if (lamp) {
      var ang = 0, vel = 0, swinging = false, last = 0;
      var K = 55, DAMP = 2.1, MAX = 30;
      var step = function (t) {
        var dt = Math.min(0.032, (t - last) / 1000 || 0.016); last = t;
        vel += (-K * ang - DAMP * vel) * dt;
        ang += vel * dt;
        if (ang > MAX) { ang = MAX; vel *= -0.4; } else if (ang < -MAX) { ang = -MAX; vel *= -0.4; }
        lamp.style.transform = 'rotate(' + ang.toFixed(2) + 'deg)';
        if (Math.abs(ang) < 0.25 && Math.abs(vel) < 2) {
          swinging = false; ang = 0; vel = 0;
          lamp.style.transform = ''; lamp.classList.remove('is-hit');
          return;
        }
        requestAnimationFrame(step);
      };
      lamp.addEventListener('click', function (e) {
        var r = lamp.getBoundingClientRect();
        var x = e.clientX || (r.left + r.width / 2 + (Math.random() < 0.5 ? -1 : 1) * r.width * 0.4);
        var y = e.clientY || (r.top + r.height * 0.55);
        var dir = x < r.left + r.width / 2 ? 1 : -1;
        sparks(x, y, dir);
        if (reduce) return;
        var force = 0.6 + Math.min(1, Math.abs(x - (r.left + r.width / 2)) / (r.width / 2)) * 0.6;
        vel += dir * 240 * force;
        lamp.classList.add('is-hit');
        if (!swinging) { swinging = true; last = performance.now(); requestAnimationFrame(step); }
      });
    }

    /* ---------- 3. la ruta: el farolito avanza a la parada que estás leyendo ---------- */
    var map = document.querySelector('.route-map');
    var stops = document.querySelectorAll('.stop');
    if (map && stops.length && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) map.setAttribute('data-stop', en.target.getAttribute('data-stop'));
        });
      }, { rootMargin: '-45% 0px -45% 0px' });
      for (var i = 0; i < stops.length; i++) io.observe(stops[i]);
    }

    /* ---------- 4. barra: alternativa al scroll-driven ---------- */
    if (!(window.CSS && CSS.supports && CSS.supports('animation-timeline', 'scroll()'))) {
      var bar = document.querySelector('.topbar');
      var onScroll = function () { bar.classList.toggle('is-scrolled', window.scrollY > 40); };
      onScroll();
      addEventListener('scroll', onScroll, { passive: true });
    }

    /* ---------- 5. confirmaciones: el farol se enciende con chispas ---------- */
    var success = document.getElementById('form-success');
    var join = document.querySelector('.join');
    var reserveMsg = document.getElementById('reserve-msg');
    if ('MutationObserver' in window) {
      if (success) new MutationObserver(function () {
        if (success.hidden) return;
        if (join) join.classList.add('is-lit');
        setTimeout(function () {
          burstFrom(document.querySelector('.farol--success'), 12);
          burstFrom(document.querySelector('.farol--join'), 10);
        }, 120);
      }).observe(success, { attributes: true, attributeFilter: ['hidden'] });
      if (reserveMsg) new MutationObserver(function () {
        if (!reserveMsg.hidden) setTimeout(function () { burstFrom(reserveMsg.querySelector('.farol'), 6); }, 80);
      }).observe(reserveMsg, { attributes: true, attributeFilter: ['hidden'] });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
