/* Lumen Travels · página de la política de privacidad.
   Elige el idioma con el mismo criterio que la landing (?lang=, el guardado en lt_lang o el del navegador),
   cambia de idioma sin recargar y lleva las anclas (#derechos…) a la versión visible. */
(function () {
  'use strict';
  var root = document.documentElement;
  var TITLE = { es: 'Política de privacidad de Lumen Travels', en: 'Lumen Travels privacy policy' };
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sin storage */ } }

  var q = null;
  try { q = (new URLSearchParams(location.search).get('lang') || '').toLowerCase(); } catch (e) { q = null; }
  var saved = lsGet('lt_lang');
  // mismo criterio que app.js: español solo si el navegador lo pide; cualquier otro idioma, inglés
  var nav = (navigator.languages && navigator.languages[0]) || navigator.language || 'en';
  var lang = (q === 'es' || q === 'en') ? q : (saved === 'es' || saved === 'en') ? saved : (/^es\b/i.test(nav) ? 'es' : 'en');
  root.setAttribute('lang', lang);

  // las secciones en español tienen el id sin prefijo; las de inglés, con «en-»
  function targetFor(hash) {
    var id = (hash || '').replace(/^#/, '').replace(/^en-/, '');
    if (!id) return null;
    return document.getElementById(lang === 'en' ? 'en-' + id : id);
  }
  function goTo(hash, smooth) {
    var el = targetFor(hash);
    if (!el) return;
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: smooth && !reduce ? 'smooth' : 'auto', block: 'start' });
  }

  function apply() {
    root.setAttribute('lang', lang);
    document.title = TITLE[lang];
    var btns = document.querySelectorAll('[data-lang]');
    for (var i = 0; i < btns.length; i++) btns[i].setAttribute('aria-pressed', String(btns[i].getAttribute('data-lang') === lang));
    // volver a la landing conserva el idioma
    var home = document.querySelectorAll('a[href="/"], a[href^="/?lang="]');
    for (var h = 0; h < home.length; h++) home[h].setAttribute('href', '/?lang=' + lang);
  }

  function init() {
    apply();
    var btns = document.querySelectorAll('[data-lang]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function (e) {
        lang = e.currentTarget.getAttribute('data-lang');
        lsSet('lt_lang', lang);
        apply();
      });
    }
    // índice: abierto en escritorio, plegado en celular
    var wide = window.matchMedia && matchMedia('(min-width: 1000px)').matches;
    var boxes = document.querySelectorAll('.toc-box');
    for (var b = 0; b < boxes.length; b++) boxes[b].open = !!wide;

    // anclas internas (índice y pie) hacia la versión visible
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a || a.classList.contains('skip')) return;
      var el = targetFor(a.getAttribute('href'));
      if (!el) return;
      e.preventDefault();
      // en celular el índice se pliega antes de desplazarse, para que el destino no se mueva
      if (!wide) { var box = a.closest('.toc-box'); if (box) box.open = false; }
      history.replaceState(null, '', '#' + el.id.replace(/^en-/, ''));
      goTo(a.getAttribute('href'), true);
    });
    if (location.hash) {
      setTimeout(function () { goTo(location.hash, false); }, 0);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { goTo(location.hash, false); });
    }

    // marca en el índice la sección que estás leyendo
    if ('IntersectionObserver' in window) {
      var links = {};
      Array.prototype.forEach.call(document.querySelectorAll('.legal-toc a'), function (a) { links[a.getAttribute('href').slice(1)] = a; });
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var art = en.target.closest('.legal');
          Array.prototype.forEach.call(art.querySelectorAll('.legal-toc a'), function (a) { a.removeAttribute('aria-current'); });
          var l = links[en.target.id];
          if (l) l.setAttribute('aria-current', 'true');
        });
      }, { rootMargin: '-20% 0px -70% 0px' });
      Array.prototype.forEach.call(document.querySelectorAll('.legal-body h2[id]'), function (h) { io.observe(h); });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
