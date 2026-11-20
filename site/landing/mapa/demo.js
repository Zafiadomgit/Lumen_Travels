/* Solo para demo.html: cambia el idioma (EN/ES) como lo hace la landing, poniendo <html lang>.
   mapa.js escucha ese atributo; en index.html lo pone app.js. */
(function () {
  var q = new URLSearchParams(location.search).get('lang');
  if (q === 'en' || q === 'es') set(q);
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-lang]');
    if (b) set(b.getAttribute('data-lang'));
  });
  function set(l) {
    document.documentElement.lang = l;
    document.querySelectorAll('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === l)); });
  }
})();
