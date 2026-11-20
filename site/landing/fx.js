/* Lumen Travels · efectos de la landing (mejora progresiva).
   La luz cálida del hero, el latido del símbolo con chispas, la carga de «El viaje pintado» y el farol que se enciende al registrarte.
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

    /* ---------- 3. El viaje pintado: la coreografía (GSAP + viaje.js) se carga solo cuando la sección se acerca ----------
       Con movimiento reducido no se carga nada: la lámina ya muestra la ruta completa y cada parada aparece con un fundido sencillo. */
    var viaje = document.querySelector('.viaje');
    if (viaje && 'IntersectionObserver' in window) {
      if (reduce) {
        viaje.classList.add('viaje-suave');
        var seen = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-visible'); seen.unobserve(en.target); } });
        }, { rootMargin: '0px 0px -12% 0px' });
        Array.prototype.forEach.call(viaje.querySelectorAll('.parada, .viaje-lema'), function (el) { seen.observe(el); });
      } else {
        var cargar = function (srcs) {
          if (!srcs.length) return;
          var sc = document.createElement('script');
          sc.src = srcs[0];
          sc.onload = function () { cargar(srcs.slice(1)); };
          document.head.appendChild(sc);
        };
        var cerca = new IntersectionObserver(function (entries) {
          if (!entries.some(function (en) { return en.isIntersecting; })) return;
          cerca.disconnect();
          cargar(['/vendor/gsap.min.js', '/vendor/ScrollTrigger.min.js', '/viaje.js']);
        }, { rootMargin: '150% 0px 150% 0px' });
        cerca.observe(viaje);
      }
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
