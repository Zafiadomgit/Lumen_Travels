/* Lumen Travels · prototipo navegable
   HTML/CSS/JS sin dependencias. CSP: solo 'self' (sin estilos ni scripts en línea).
   El estado vive en memoria y, si se puede, en sessionStorage. Todo lo sensible es simulado:
   no hay cámara, no se llama al 123 y no se envía ningún mensaje.
   Diseñado por Lumen Studio. */
(function () {
  "use strict";

  var LT = window.LT;
  if (!LT) return;
  var KEY = "lt-proto-v1";
  var doc = document;
  var root = doc.documentElement;
  var $screen = doc.getElementById("screen");
  var $tabbar = doc.getElementById("tabbar");
  var $tripbar = doc.getElementById("tripbar");
  var $sheet = doc.getElementById("sheet");
  var $toast = doc.getElementById("toast");
  var $app = doc.getElementById("app");
  var reduceMotion = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };

  /* ---------------- estado ---------------- */
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function fresh() {
    var navLang = (navigator.language || "es").slice(0, 2) === "en" ? "en" : "es";
    return {
      lang: navLang, theme: "light", ob: 0, level: 1, view: "list",
      filters: { dest: "all", when: "any", styles: [] }, mapCity: null,
      requests: {}, created: [], draft: null, vf: { doc: "cc", shot: false, selfie: 0 },
      chat: clone(LT.GROUP.chat), expenses: clone(LT.GROUP.expenses), payments: [], arrived: false,
      groupTab: "chat", unread: 2, stack: [{ n: "onboarding", p: {} }]
    };
  }
  var state = load() || fresh();
  function load() {
    try {
      var raw = window.sessionStorage.getItem(KEY);
      if (!raw) return null;
      var s = JSON.parse(raw);
      return s && s.stack && s.stack.length ? s : null;
    } catch (e) { return null; }
  }
  function save() {
    try { window.sessionStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* sin almacenamiento: queda en memoria */ }
  }

  /* ---------------- utilidades ---------------- */
  function t(k, vars) {
    var s = LT.S[state.lang][k];
    if (s == null) s = LT.S.es[k];
    if (s == null) s = k;
    if (vars) s = s.replace(/\{(\w+)\}/g, function (m, v) { return vars[v] != null ? vars[v] : m; });
    return s;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  }
  function L(o) { return o == null ? "" : (typeof o === "string" ? o : (o[state.lang] != null ? o[state.lang] : o.es)); }
  function tx(k, vars) { return esc(t(k, vars)); }
  function icon(id, cls) {
    var file = id.indexOf("ic-") === 0 ? "../assets/icons/sprite.svg" : "icons.svg";
    return '<svg class="icon' + (cls ? " " + cls : "") + '" aria-hidden="true" focusable="false"><use href="' + file + "#" + id + '"/></svg>';
  }
  function mark(cls) { return '<svg class="mark' + (cls ? " " + cls : "") + '" aria-hidden="true" focusable="false"><use href="#lumen-mark"/></svg>'; }
  function locale() { return state.lang === "en" ? "en-US" : "es-CO"; }
  function dateOf(iso) { var p = iso.split("-"); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2], 12)); }
  function range(a, b) {
    var f = new Intl.DateTimeFormat(locale(), { day: "numeric", month: "short", timeZone: "UTC" });
    try { return f.formatRange(dateOf(a), dateOf(b)).replace(/\./g, ""); } catch (e) { return f.format(dateOf(a)) + " – " + f.format(dateOf(b)); }
  }
  function dayLabel(iso, offset) {
    var d = dateOf(iso); d.setUTCDate(d.getUTCDate() + offset);
    return new Intl.DateTimeFormat(locale(), { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }).format(d).replace(/\./g, "");
  }
  function money(n) {
    return new Intl.NumberFormat(locale(), { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(Math.round(n));
  }
  function person(k) { return LT.PEOPLE[k]; }
  function pname(k) { return k === "me" ? t("gr.you") : person(k).short; }
  function avatar(k, size) {
    var p = person(k);
    return '<span class="av av--' + p.hue + (size ? " av--" + size : "") + '" aria-hidden="true">' + esc(p.ini) + "</span>";
  }
  function rating(p) { return state.lang === "en" ? p.ratingEn : p.rating; }
  function city(k) { return LT.CITIES[k]; }
  function trip(id) { for (var i = 0; i < LT.TRIPS.length; i++) if (LT.TRIPS[i].id === id) return LT.TRIPS[i]; return null; }
  function cur() { return state.stack[state.stack.length - 1]; }
  function uid() { return "x" + Math.random().toString(36).slice(2, 8); }
  function vibrate(ms) { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) { /* no disponible */ } }

  /* ---------------- piezas compartidas ---------------- */
  function vbadge(small) {
    return '<span class="vbadge' + (small ? " vbadge--s" : "") + '">' + icon("ic-shield") + "<span>" + tx("card.verified") + "</span></span>";
  }
  function compat(tr, big) {
    var n = tr.match;
    var tier = n >= 75 ? "hi" : (n >= 50 ? "mid" : "lo");
    var label = tier === "lo" ? tx("cp.low") : tx("cp.label", { n: n });
    return '<button type="button" class="compat compat--' + tier + (big ? " compat--l" : "") + '" data-act="why" data-id="' + tr.id + '" aria-label="' + tx("cp.why", { n: n }) + '">' +
      '<svg class="ring" viewBox="0 0 20 20" aria-hidden="true"><circle class="ring-bg" cx="10" cy="10" r="8"/>' +
      (tier === "lo" ? "" : '<circle class="ring-fg" cx="10" cy="10" r="8" pathLength="100" stroke-dasharray="' + n + ' 100"/>') +
      "</svg><span>" + label + "</span></button>";
  }
  function cover(tr, mode) {
    var c = city(tr.city);
    if (tr.art && LT.ART[tr.art]) {
      var a = LT.ART[tr.art];
      var sizes = mode === "hero" ? "100vw" : "(min-width: 700px) 390px, 100vw";
      return '<img class="cover-img cover-img--' + tr.art + '" src="' + a.src + '" srcset="' + a.srcset + '" sizes="' + sizes + '" width="' + a.w + '" height="' + a.h + '"' +
        (mode === "hero" ? ' alt="' + esc(L(a.alt)) + '" fetchpriority="high"' : ' alt="" loading="lazy"') + ' decoding="async">';
    }
    return '<div class="cover-slot" ' + (mode === "hero" ? 'role="img" aria-label="' + esc(L(c)) + ". " + tx("card.artPending") + '"' : 'aria-hidden="true"') + ">" +
      icon(c.icon, "cover-slot-icon") + '<span class="cover-slot-note">' + tx("card.artPending") + "</span></div>";
  }
  function header(opts) {
    var left = opts.back ? '<button type="button" class="iconbtn" data-act="' + (opts.backAct || "back") + '" aria-label="' + tx(opts.backLabel || "a11y.back") + '">' + icon(opts.backIcon || "i-back") + "</button>" : '<span class="iconbtn-gap"></span>';
    return '<header class="hdr' + (opts.overlay ? " hdr--overlay" : "") + '">' + left +
      (opts.title ? '<h1 class="hdr-title">' + esc(opts.title) + "</h1>" : '<span class="hdr-title"></span>') +
      (opts.right || '<span class="iconbtn-gap"></span>') + "</header>";
  }
  function simNote(k) {
    return '<p class="sim">' + icon("i-info") + "<span>" + tx(k) + "</span></p>";
  }
  function stepper(n) {
    var s = '<ol class="steps" aria-label="' + tx("vf.step", { n: n }) + '">';
    for (var i = 1; i <= 3; i++) s += '<li class="' + (i < n ? "is-done" : (i === n ? "is-now" : "")) + '"' + (i === n ? ' aria-current="step"' : "") + "><span class=\"vh\">" + i + "</span></li>";
    return s + "</ol>";
  }

  /* ---------------- filtros ---------------- */
  function filtered() {
    var f = state.filters;
    return LT.TRIPS.filter(function (tr) {
      if (f.dest !== "all" && tr.city !== f.dest) return false;
      var m = dateOf(tr.start).getUTCMonth();
      if (f.when === "nov" && m !== 10) return false;
      if (f.when === "dec" && m !== 11) return false;
      if (f.styles.length && !f.styles.some(function (s) { return tr.styles.indexOf(s) >= 0; })) return false;
      return true;
    }).sort(function (a, b) { return b.match - a.match; });
  }
  var STYLES = ["cultural", "nature", "beach", "food", "chill", "backpack", "party"];
  var CITY_KEYS = ["medellin", "bogota", "cartagena", "santamarta", "tayrona"];

  /* ---------------- gastos ---------------- */
  function balances() {
    var g = LT.GROUP, net = {};
    g.members.forEach(function (m) { net[m] = 0; });
    state.expenses.forEach(function (e) {
      var share = e.amount / e.among.length;
      net[e.payer] += e.amount;
      e.among.forEach(function (m) { net[m] -= share; });
    });
    state.payments.forEach(function (p) { net[p.from] += p.amount; net[p.to] -= p.amount; });
    var deb = [], cre = [];
    Object.keys(net).forEach(function (k) {
      var v = Math.round(net[k]);
      if (v < -50) deb.push({ k: k, v: -v }); else if (v > 50) cre.push({ k: k, v: v });
    });
    deb.sort(function (a, b) { return b.v - a.v; }); cre.sort(function (a, b) { return b.v - a.v; });
    var out = [], i = 0, j = 0;
    while (i < deb.length && j < cre.length) {
      var x = Math.min(deb[i].v, cre[j].v);
      out.push({ from: deb[i].k, to: cre[j].k, amount: x });
      deb[i].v -= x; cre[j].v -= x;
      if (deb[i].v < 50) i++;
      if (cre[j].v < 50) j++;
    }
    return out;
  }
  function myShare() {
    return state.expenses.reduce(function (s, e) { return s + (e.among.indexOf("me") >= 0 ? e.amount / e.among.length : 0); }, 0);
  }

  /* ---------------- editor ---------------- */
  function newDraft() {
    return {
      name: { es: "Santa Marta y Tayrona", en: "Santa Marta and Tayrona" }, dests: ["santamarta", "tayrona"],
      from: "2026-12-18", to: "2026-12-21", budget: "mid",
      days: [["centro", "taganga"], ["zaino", "cabo"], ["minca"]], day: 0,
      vis: "open", spots: 2, styles: ["nature"], published: false
    };
  }
  function dayStops(d, idx) {
    var h = 8 * 60, out = [];
    d.days[idx].forEach(function (k, i) {
      var p = LT.PLACES[k];
      if (i > 0) h += 30;
      out.push({ k: k, p: p, time: ("0" + Math.floor(h / 60)).slice(-2) + ":" + ("0" + (h % 60)).slice(-2) });
      h += p.h * 60;
    });
    return out;
  }
  function dayHours(d, idx) { return d.days[idx].reduce(function (s, k) { return s + LT.PLACES[k].h; }, 0); }

  /* ================= PANTALLAS ================= */
  var SCREENS = {};

  /* ---------- 1 · Bienvenida ---------- */
  var OB_ART = ["sierra", "medellin", "bogota"];
  SCREENS.onboarding = {
    chrome: "none",
    render: function () {
      var i = state.ob, a = LT.ART[OB_ART[i]], last = i === 2;
      return '<div class="ob ob--' + (i + 1) + '">' +
        '<div class="ob-top">' +
          '<p class="wordmark">' + mark() + "<span>lumen <span class=\"wm-b\">travels</span></span></p>" +
          '<div class="ob-top-actions">' + langSeg() +
          (last ? "" : '<button type="button" class="linkbtn" data-act="obDone">' + tx("ob.skip") + "</button>") + "</div></div>" +
        '<div class="ob-copy">' +
          '<p class="ob-step">' + tx("ob.step", { n: i + 1 }) + "</p>" +
          '<div class="ob-bars" aria-hidden="true"><span class="' + (i >= 0 ? "on" : "") + '"></span><span class="' + (i >= 1 ? "on" : "") + '"></span><span class="' + (i >= 2 ? "on" : "") + '"></span></div>' +
          '<h1 class="ob-title" data-focus>' + tx("ob." + (i + 1) + ".t") + "</h1>" +
          '<p class="ob-text">' + tx("ob." + (i + 1) + ".p") + "</p>" +
        "</div>" +
        '<figure class="ob-art ob-art--' + OB_ART[i] + '"><img src="' + a.src + '" srcset="' + a.srcset + '" sizes="(min-width: 700px) 390px, 100vw" width="' + a.w + '" height="' + a.h + '" alt="' + esc(L(a.alt)) + '" decoding="async"' + (i === 0 ? ' fetchpriority="high"' : "") + "></figure>" +
        '<div class="ob-foot">' +
          '<button type="button" class="btn btn--block" data-act="' + (last ? "obDone" : "obNext") + '">' + tx(last ? "ob.start" : "ob.next") + "</button>" +
          '<p class="proto-tag">' + tx("proto.tag") + "</p>" +
        "</div></div>";
    }
  };
  function langSeg(extra) {
    return '<div class="seg seg--s' + (extra || "") + '" role="group" aria-label="' + tx("lang.label") + '">' +
      '<button type="button" class="seg-btn" data-act="lang" data-v="es" lang="es" aria-pressed="' + (state.lang === "es") + '">ES</button>' +
      '<button type="button" class="seg-btn" data-act="lang" data-v="en" lang="en" aria-pressed="' + (state.lang === "en") + '">EN</button></div>';
  }

  /* ---------- 2 · Explorar ---------- */
  SCREENS.explore = {
    chrome: "tabs", tab: "explore",
    render: function () {
      var f = state.filters, list = filtered();
      var destVal = f.dest === "all" ? tx("ex.search") : esc(L(city(f.dest)));
      var html = '<header class="hdr-root"><h1 class="t1" data-focus>' + tx("ex.title") + "</h1>" +
        '<div class="seg" role="group" aria-label="' + tx("ex.view") + '">' +
          '<button type="button" class="seg-btn" data-act="view" data-v="list" aria-pressed="' + (state.view === "list") + '">' + icon("i-list") + "<span>" + tx("ex.list") + "</span></button>" +
          '<button type="button" class="seg-btn" data-act="view" data-v="map" aria-pressed="' + (state.view === "map") + '">' + icon("ic-plan") + "<span>" + tx("ex.map") + "</span></button>" +
        "</div></header>" +
        '<div class="pad">' +
        '<button type="button" class="search' + (f.dest !== "all" ? " is-set" : "") + '" data-act="filter" data-k="dest">' + icon("i-search") + "<span>" + destVal + "</span></button>" +
        '<div class="chips" role="group" aria-label="' + tx("ex.filters") + '">' +
          chip("dest", f.dest !== "all", f.dest === "all" ? t("ex.f.dest") : L(city(f.dest)), "i-sliders") +
          chip("dates", f.when !== "any", f.when === "any" ? t("ex.f.dates") : t("f." + f.when), "ic-calendar") +
          chip("style", f.styles.length > 0, f.styles.length ? t("ex.f.styleN", { n: f.styles.length }) : t("ex.f.style"), "ic-sparkle") +
        "</div>" +
        '<p class="vnote">' + icon("ic-shield") + "<span>" + tx("ex.verifiedOnly") + "</span></p>" +
        '<p class="count" aria-live="polite">' + (list.length === 1 ? tx("ex.count.one") : tx("ex.count.other", { n: list.length })) + "</p>";
      if (!list.length) {
        html += '<div class="empty"><p class="empty-t">' + tx("ex.empty.t") + '</p><p class="empty-p">' + tx("ex.empty.p") + '</p><button type="button" class="btn btn--ghost" data-act="clearFilters">' + tx("ex.empty.cta") + "</button></div></div>";
        return html;
      }
      html += "</div>";
      if (state.view === "map") return html + mapView(list);
      html += '<div class="tlist pad">';
      list.forEach(function (tr) { html += tripCard(tr); });
      return html + "</div>";
    },
    mount: function (el) { placePins(el); }
  };
  function chip(k, on, label, ic) {
    return '<button type="button" class="chip' + (on ? " is-on" : "") + '" data-act="filter" data-k="' + k + '" aria-haspopup="dialog">' + icon(on ? "ic-check" : ic) + "<span>" + esc(label) + "</span></button>";
  }
  function tripCard(tr, compact) {
    var h = person(tr.host), c = city(tr.city), free = tr.max - tr.members.length;
    var id = tr.id + (compact ? "-c" : "");
    var sent = state.requests[tr.id];
    return '<article class="tcard' + (compact ? " tcard--c" : "") + '">' +
      '<div class="tcard-cover">' + cover(tr) + '<span class="city-pill">' + icon(c.icon) + "<span>" + esc(L(c)) + "</span></span></div>" +
      '<div class="tcard-body">' +
        '<h3 class="tcard-title"><button type="button" class="tcard-link" data-act="trip" data-id="' + tr.id + '" aria-describedby="' + id + '-m ' + id + '-h">' + esc(L(tr.title)) + "</button></h3>" +
        '<p class="tcard-meta" id="' + id + '-m"><span>' + icon("ic-calendar") + esc(range(tr.start, tr.end)) + "</span><span>" + icon("ic-group") +
          (free === 1 ? tx("card.spotsOne") : tx("card.spots", { n: free, m: tr.max - 1 })) + "</span></p>" +
        (compact ? "" : '<div class="tcard-row">' + compat(tr) + (sent ? '<span class="tag tag--ok">' + icon("ic-check") + tx("card.requested") + "</span>" : "") + "</div>") +
        '<p class="host" id="' + id + '-h">' + avatar(tr.host) + '<span class="host-text"><span class="host-name">' + tx("card.organizer", { name: h.short }) + "</span>" +
          '<span class="host-sig">' + vbadge(true) + '<span class="stars">' + icon("i-star") + tx("card.reviews", { r: rating(h), n: h.reviews }) + "</span></span></span></p>" +
      "</div></article>";
  }
  function mapView(list) {
    var counts = {};
    list.forEach(function (tr) { counts[tr.city] = (counts[tr.city] || 0) + 1; });
    var sel = state.mapCity && counts[state.mapCity] ? state.mapCity : null;
    var shown = sel ? list.filter(function (tr) { return tr.city === sel; }) : list;
    var html = '<div class="pad"><div class="cmap" data-map>' + corridorSvg() +
      '<p class="cmap-hint">' + icon("ic-pin") + "<span>" + tx("ex.mapHint") + "</span></p>";
    CITY_KEYS.forEach(function (k) {
      if (!counts[k]) return;
      var c = city(k);
      html += '<button type="button" class="mpin' + (sel === k ? " is-sel" : "") + '" data-act="mapCity" data-v="' + k + '" data-x="' + c.x + '" data-y="' + c.y + '" aria-pressed="' + (sel === k) + '">' +
        '<span class="mpin-n">' + counts[k] + '</span><span class="mpin-l">' + esc(L(c)) + "</span></button>";
    });
    html += "</div>" +
      '<div class="cmap-bar"><p class="count">' + (sel ? tx("ex.mapCity", { n: shown.length, city: L(city(sel)) }) : tx("ex.mapAll")) + "</p>" +
      (sel ? '<button type="button" class="linkbtn" data-act="mapCity" data-v="">' + tx("ex.mapAll") + "</button>" : "") + "</div></div>" +
      '<div class="hscroll" role="list">';
    shown.forEach(function (tr) { html += '<div role="listitem" class="hscroll-item">' + tripCard(tr, true) + "</div>"; });
    return html + "</div>";
  }
  /* mapa esquemático del corredor (coordenadas compartidas con la landing, viewBox 400×520 recortado) */
  var MAP_VB = { x: 45, y: 30, w: 328, h: 410 };
  function corridorSvg() {
    return '<svg class="cmap-svg" viewBox="' + MAP_VB.x + " " + MAP_VB.y + " " + MAP_VB.w + " " + MAP_VB.h + '" aria-hidden="true" focusable="false">' +
      '<rect x="0" y="0" width="400" height="520" class="m-land"/>' +
      '<path class="m-sea" d="M0 0H400V48C360 46 330 58 300 62C268 66 248 58 220 70C190 84 160 78 132 92C110 103 92 120 70 128C46 137 22 132 0 140Z"/>' +
      '<path class="m-coast" d="M400 48C360 46 330 58 300 62C268 66 248 58 220 70C190 84 160 78 132 92C110 103 92 120 70 128C46 137 22 132 0 140"/>' +
      '<path class="m-river" d="M206 512C214 470 200 440 212 400C222 362 206 330 214 292C220 252 204 220 206 186C208 150 196 120 188 88"/>' +
      '<path class="m-ridge" d="M80 470C78 400 70 330 86 260C92 230 90 210 96 196"/><path class="m-ridge" d="M156 480C150 420 170 360 160 300C154 260 150 240 146 214"/><path class="m-ridge" d="M290 500C284 440 286 400 276 360C266 320 262 270 270 230C278 196 290 172 312 140"/>' +
      '<path class="m-sierra" d="M318 104l12-20 12 20zM338 108l14-24 14 24zM356 104l11-18 11 18z"/>' +
      '<path class="m-route" d="M128 318C160 340 196 360 236 404C214 340 168 300 150 240C134 186 116 140 112 112C150 96 196 92 252 74C272 70 288 66 306 66"/>' +
      '<text class="m-label m-label--sea" x="200" y="40" text-anchor="middle">' + (state.lang === "en" ? "Caribbean Sea" : "Mar Caribe") + "</text></svg>";
  }
  function placePins(el) {
    var pins = el.querySelectorAll("[data-x]");
    for (var i = 0; i < pins.length; i++) {
      var p = pins[i];
      p.style.setProperty("--x", ((+p.dataset.x - MAP_VB.x) / MAP_VB.w * 100).toFixed(2) + "%");
      p.style.setProperty("--y", ((+p.dataset.y - MAP_VB.y) / MAP_VB.h * 100).toFixed(2) + "%");
    }
  }

  /* ---------- 3 · Detalle del viaje ---------- */
  SCREENS.trip = {
    chrome: "none",
    render: function (p) {
      var tr = trip(p.id), h = person(tr.host), c = city(tr.city), free = tr.max - tr.members.length, sent = state.requests[tr.id];
      var html = '<div class="cover-hero' + (tr.art ? " has-art cover-hero--" + tr.art : " no-art") + '">' + cover(tr, "hero") +
        '<div class="cover-veil" aria-hidden="true"></div>' +
        header({ back: true, overlay: true, right: '<button type="button" class="iconbtn" data-act="oos" aria-label="' + tx("a11y.more") + '">' + icon("i-share") + "</button>" }) +
        '<div class="cover-text"><p class="cover-city">' + icon(c.icon) + "<span>" + esc(L(c)) + "</span></p>" +
        '<h1 class="t1" data-focus>' + esc(L(tr.title)) + "</h1></div></div>" +
        '<div class="pad stack">' +
        '<dl class="facts">' +
          '<div><dt>' + icon("ic-calendar") + tx("tr.dates") + "</dt><dd>" + esc(range(tr.start, tr.end)) + "</dd></div>" +
          '<div><dt>' + icon("ic-group") + tx("tr.spots") + "</dt><dd>" + (free === 1 ? tx("card.spotsOne") : tx("card.spots", { n: free, m: tr.max - 1 })) + "</dd></div>" +
          '<div class="facts-wide"><dt>' + icon("ic-wallet") + tx("tr.budget") + "</dt><dd>" + tx("tr.budgetVal", { v: money(tr.budget) }) + '<span class="dd-note">' + tx("tr.budgetNote") + "</span></dd></div>" +
        "</dl>" +
        '<ul class="taglist" aria-label="' + tx("f.styleT") + '">' + tr.styles.map(function (s) { return '<li class="tag">' + tx("style." + s) + "</li>"; }).join("") + "</ul>" +
        '<section class="card why" aria-labelledby="why-h"><div class="why-head">' + compat(tr, true) + '<h2 class="t3" id="why-h">' + tx("cp.sheetT") + "</h2></div>" + whyList(tr) + "</section>" +
        '<section class="sec" aria-labelledby="org-h"><h2 class="t2" id="org-h">' + tx("tr.organizer") + "</h2>" +
          '<div class="card org"><div class="org-top">' + avatar(tr.host, "l") + '<div class="org-id"><p class="org-name">' + esc(h.name) + "</p>" +
            '<p class="org-since">' + tx("tr.since", { y: h.since }) + "</p></div></div>" +
            '<div class="org-badges">' + vbadge() + (h.phone ? '<span class="vbadge vbadge--plain">' + icon("i-phone") + "<span>" + tx("tr.phone") + "</span></span>" : "") + "</div>" +
            '<dl class="stats"><div><dt>' + tx("tr.rating") + "</dt><dd>" + icon("i-star") + esc(rating(h)) + "</dd></div><div><dt>" + tx("tr.reviews") + "</dt><dd>" + h.reviews + "</dd></div><div><dt>" + tx("tr.trips") + "</dt><dd>" + h.trips + "</dd></div></dl>" +
            '<blockquote class="quote"><p>' + esc(L(h.quote)) + "</p><footer>" + esc(h.quoteBy) + "</footer></blockquote>" +
            '<button type="button" class="linkbtn" data-act="oos">' + tx("tr.viewProfile") + "</button>" +
          "</div></section>" +
        '<section class="sec" aria-labelledby="iti-h"><h2 class="t2" id="iti-h">' + tx("tr.itinerary") + "</h2><div class=\"days\">";
      tr.days.forEach(function (d, i) {
        html += "<details class=\"day\"" + (i === 0 ? " open" : "") + "><summary><span class=\"day-n\">" + tx("tr.day", { n: i + 1 }) + '</span><span class="day-d">' + esc(dayLabel(tr.start, i)) + "</span>" + icon("ic-chevron", "day-chev") + "</summary><ol class=\"stops\">" +
          L(d).map(function (s) { return '<li><span class="stop-time">' + esc(s.slice(0, 5)) + "</span><span>" + esc(s.slice(6)) + "</span></li>"; }).join("") + "</ol></details>";
      });
      html += "</div></section>" +
        '<section class="sec" aria-labelledby="mem-h"><h2 class="t2" id="mem-h">' + tx("tr.members") + '</h2><p class="members">' +
          '<span class="avstack">' + tr.members.map(function (m) { return avatar(m); }).join("") + "</span><span>" + tx("tr.membersN", { n: tr.members.length, m: tr.max }) + "</span></p></section>" +
        '<aside class="note-card">' + icon("ic-shield") + '<div><p class="note-card-t">' + tx("tr.safe.t") + "</p><p>" + tx("tr.safe.p", { place: L(tr.meet) }) + "</p></div></aside>" +
        "</div>" +
        '<div class="cta-bar">' + (sent
          ? '<p class="cta-done">' + icon("ic-check") + '<span><strong>' + tx("tr.joined", { name: h.short }) + "</strong>" + tx("tr.joinedP") + "</span></p>"
          : '<button type="button" class="btn btn--block" data-act="join" data-id="' + tr.id + '">' + tx("tr.join") + "</button>" +
            (state.level < 2 ? '<p class="cta-note">' + icon("i-lock") + "<span>" + tx("tr.joinNeeds") + "</span></p>" : "")) + "</div>";
      return html;
    }
  };
  function whyList(tr) {
    return '<ul class="whylist">' + tr.why.map(function (w) {
      var txt = w[0] === "style" ? t("why.style", { s: t("style." + w[1]).toLowerCase() }) : t("why." + w[0], { n: w[1] });
      return "<li>" + icon("ic-check") + "<span>" + esc(txt) + "</span></li>";
    }).join("") + "<li>" + icon("ic-check") + "<span>" + tx("why.verified") + "</span></li></ul>";
  }

  /* ---------- 3b · Verificación de identidad (nivel 2, simulada) ---------- */
  SCREENS.verify = {
    chrome: "none",
    render: function (p) {
      var step = p.step || "intro", ctx = p.ctx || {};
      var who = ctx.kind === "join" ? person(trip(ctx.id).host).short : (state.lang === "en" ? "your group" : "tu grupo");
      var top = header({ back: step !== "intro" && step !== "wait" && step !== "done", right: '<button type="button" class="iconbtn" data-act="vfClose" aria-label="' + tx("vf.close") + '">' + icon("ic-close") + "</button>" });
      var body = "";
      if (step === "intro") {
        body = '<div class="vf-hero">' + icon("ic-id", "vf-hero-icon") + "</div>" +
          '<h1 class="t1" data-focus>' + tx("vf.intro.t") + "</h1>" +
          '<p class="lead">' + tx("vf.intro.p", { name: who }) + "</p>" +
          '<ul class="needs">' +
            "<li>" + icon("ic-id") + "<div><p class=\"needs-t\">" + tx("vf.intro.doc") + "</p><p>" + tx("vf.intro.docP") + "</p></div></li>" +
            "<li>" + icon("i-scan-face") + "<div><p class=\"needs-t\">" + tx("vf.intro.selfie") + "</p><p>" + tx("vf.intro.selfieP") + "</p></div></li>" +
            "<li>" + icon("i-clock") + "<div><p class=\"needs-t\">" + tx("vf.intro.time") + "</p><p>" + tx("vf.intro.timeP") + "</p></div></li>" +
          "</ul>" +
          '<p class="privacy">' + icon("i-lock") + "<span>" + tx("vf.intro.store") + "</span></p>" +
          '<ol class="ladder-mini"><li class="is-done">' + tx("vf.level.now") + '</li><li class="is-next">' + tx("vf.level.next") + "</li></ol>" +
          simNote("vf.sim");
        return '<div class="flow">' + top + '<div class="pad flow-body">' + body + '</div><div class="flow-foot"><button type="button" class="btn btn--block" data-act="vfGo" data-step="doc">' + tx("vf.intro.cta") + '</button><button type="button" class="btn btn--text btn--block" data-act="vfClose">' + tx("vf.intro.later") + "</button></div></div>";
      }
      if (step === "doc") {
        var shot = state.vf.shot;
        body = stepper(1) + '<h1 class="t1" data-focus>' + tx("vf.doc.t") + "</h1>" + '<p class="lead">' + tx("vf.doc.p") + "</p>" +
          '<fieldset class="field"><legend>' + tx("vf.doc.type") + '</legend><div class="chips chips--wrap">' +
            ["cc", "pp", "ce"].map(function (d) { return '<button type="button" class="chip' + (state.vf.doc === d ? " is-on" : "") + '" data-act="vfDoc" data-v="' + d + '" aria-pressed="' + (state.vf.doc === d) + '">' + (state.vf.doc === d ? icon("ic-check") : "") + "<span>" + tx("vf.doc." + d) + "</span></button>"; }).join("") +
          "</div></fieldset>" +
          '<div class="cam' + (shot ? " is-shot" : "") + '" role="img" aria-label="' + tx("vf.doc.frame") + '"><span class="cam-c cam-c--tl"></span><span class="cam-c cam-c--tr"></span><span class="cam-c cam-c--bl"></span><span class="cam-c cam-c--br"></span>' +
            '<div class="idcard idcard--' + state.vf.doc + '" aria-hidden="true"><span class="idcard-photo">VR</span><span class="idcard-lines"><i></i><i></i><i></i><i></i></span><span class="idcard-tag">' + tx("vf.doc.sample") + "</span></div>" +
            (shot ? '<span class="cam-ok">' + icon("ic-check") + "</span>" : "") + "</div>" +
          (shot ? '<p class="okline" role="status">' + icon("ic-check") + "<span><strong>" + tx("vf.doc.ok") + "</strong> " + tx("vf.doc.okP") + "</span></p>" : '<p class="tip">' + icon("i-info") + "<span>" + tx("vf.doc.tip") + "</span></p>") +
          simNote("vf.sim");
        return '<div class="flow">' + top + '<div class="pad flow-body">' + body + '</div><div class="flow-foot">' +
          (shot ? '<button type="button" class="btn btn--block" data-act="vfGo" data-step="selfie">' + tx("vf.continue") + '</button><button type="button" class="btn btn--text btn--block" data-act="vfShot" data-v="0">' + tx("vf.retake") + "</button>"
                : '<button type="button" class="btn btn--block" data-act="vfShot" data-v="1">' + icon("i-camera") + "<span>" + tx("vf.doc.shoot") + "</span></button>") + "</div></div>";
      }
      if (step === "selfie") {
        var s = state.vf.selfie; /* 0 sin empezar, 1..3 indicaciones, 4 lista */
        var prompt = s === 0 ? t("vf.sf.p") : (s >= 4 ? t("vf.sf.ok") : t("vf.sf." + s));
        body = stepper(2) + '<h1 class="t1" data-focus>' + tx("vf.sf.t") + "</h1>" +
          '<div class="selfie selfie--s' + s + '" role="img" aria-label="' + tx("vf.sf.frame") + '"><svg class="selfie-ring" viewBox="0 0 220 280" aria-hidden="true"><ellipse class="selfie-bg" cx="110" cy="140" rx="96" ry="126"/><ellipse class="selfie-fg" cx="110" cy="140" rx="96" ry="126" pathLength="100"/></svg>' +
            '<span class="selfie-face" aria-hidden="true">' + icon(s >= 4 ? "ic-check" : "i-user") + "</span></div>" +
          '<p class="selfie-prompt" aria-live="polite">' + esc(prompt) + "</p>" + simNote("vf.sim");
        return '<div class="flow">' + top + '<div class="pad flow-body">' + body + '</div><div class="flow-foot">' +
          (s >= 4 ? '<button type="button" class="btn btn--block" data-act="vfGo" data-step="wait">' + tx("vf.continue") + "</button>"
                  : '<button type="button" class="btn btn--block" data-act="vfSelfie"' + (s > 0 ? " disabled" : "") + ">" + icon("i-scan-face") + "<span>" + tx("vf.sf.start") + "</span></button>") + "</div></div>";
      }
      if (step === "wait") {
        body = stepper(3) + '<div class="wait"><span class="spin" aria-hidden="true"></span><h1 class="t1" data-focus>' + tx("vf.wait.t") + '</h1><p class="lead">' + tx("vf.wait.p") + "</p></div>";
        return '<div class="flow">' + top + '<div class="pad flow-body flow-body--center" role="status">' + body + "</div></div>";
      }
      /* done */
      var cta = ctx.kind === "join" ? "vf.done.cta" : (ctx.kind === "publish" ? "vf.done.ctaPublish" : "vf.done.ctaProfile");
      body = '<div class="done"><span class="done-badge">' + icon("ic-shield") + '</span><h1 class="t1" data-focus>' + tx("vf.done.t") + '</h1><p class="lead">' + tx("vf.done.p") + "</p>" +
        '<p class="level-pill">' + icon("ic-shield") + "<span>" + tx("pf.levelN", { n: 2 }) + ", " + tx("pf.l2").toLowerCase() + "</span></p></div>";
      return '<div class="flow">' + header({ right: '<span class="iconbtn-gap"></span>' }) + '<div class="pad flow-body flow-body--center">' + body + '</div><div class="flow-foot"><button type="button" class="btn btn--block" data-act="vfDone">' + tx(cta) + "</button></div></div>";
    },
    mount: function (el, p) {
      if (p.step === "wait") {
        timers.push(setTimeout(function () {
          state.level = 2;
          go("verify", { step: "done", ctx: p.ctx }, { replace: true });
        }, 1700));
      }
    }
  };

  /* ---------- 3c · Solicitud para unirse ---------- */
  SCREENS.join = {
    chrome: "none",
    render: function (p) {
      var tr = trip(p.id), h = person(tr.host);
      return '<div class="flow">' + header({ back: true }) + '<form class="pad flow-body" data-form="join" data-id="' + tr.id + '" novalidate id="join-form">' +
        '<p class="mini-trip">' + avatar(tr.host) + "<span><strong>" + esc(L(tr.title)) + "</strong>" + esc(range(tr.start, tr.end)) + "</span></p>" +
        '<h1 class="t1" data-focus>' + tx("jr.t", { name: h.short }) + "</h1>" + '<p class="lead">' + tx("jr.p") + "</p>" +
        '<div class="field"><label for="jr-msg">' + tx("jr.label") + '</label><textarea id="jr-msg" name="msg" rows="4" maxlength="400" placeholder="' + tx("jr.ph") + '" aria-describedby="jr-err"></textarea>' +
        '<p class="err" id="jr-err" hidden>' + tx("jr.req") + "</p></div>" +
        '<fieldset class="field"><legend>' + tx("jr.tpl") + '</legend><div class="tpls">' +
          [1, 2, 3].map(function (n) { return '<button type="button" class="tpl" data-act="tpl" data-v="' + n + '">' + tx("jr.tpl" + n) + "</button>"; }).join("") +
        "</div></fieldset>" +
        '<p class="privacy">' + icon("ic-shield") + "<span>" + tx("jr.safe") + "</span></p>" +
        '</form><div class="flow-foot"><button type="submit" form="join-form" class="btn btn--block">' + icon("i-send") + "<span>" + tx("jr.send") + "</span></button></div></div>";
    }
  };
  SCREENS.sent = {
    chrome: "none",
    render: function (p) {
      var tr = trip(p.id), h = person(tr.host);
      return '<div class="flow">' + header({ back: true, backAct: "toExplore", backIcon: "ic-close", backLabel: "a11y.close" }) + '<div class="pad flow-body flow-body--center"><div class="done">' +
        '<span class="done-mark">' + mark("mark--l") + "</span>" +
        '<h1 class="t1" data-focus>' + tx("jr.sent.t") + '</h1><p class="lead">' + tx("jr.sent.p", { name: h.short }) + "</p></div>" +
        '<section class="card next" aria-labelledby="next-h"><h2 class="t3" id="next-h">' + tx("jr.sent.next") + '</h2><ol class="seq">' +
          "<li>" + tx("jr.sent.1", { name: h.short }) + "</li><li>" + tx("jr.sent.2") + "</li><li>" + tx("jr.sent.3") + "</li></ol></section>" +
        '</div><div class="flow-foot"><button type="button" class="btn btn--block" data-act="toExplore">' + tx("jr.sent.explore") + '</button><button type="button" class="btn btn--ghost btn--block" data-act="tab" data-v="trips">' + tx("jr.sent.trips") + "</button></div></div>";
    }
  };

  /* ---------- 4 · Crear itinerario ---------- */
  SCREENS.create = {
    chrome: "none",
    render: function () {
      var d = state.draft || newDraft();
      return '<div class="flow">' + header({ back: true, backIcon: "ic-close", backLabel: "a11y.close", title: t("cr.t") }) +
        '<form class="pad flow-body" id="create-form" data-form="create" novalidate>' +
        '<h1 class="vh" data-focus>' + tx("cr.t") + "</h1>" +
        '<div class="field"><label for="cr-name">' + tx("cr.name") + '</label><input id="cr-name" name="name" type="text" autocomplete="off" value="' + esc(L(d.name)) + '"></div>' +
        '<fieldset class="field"><legend>' + tx("cr.dest") + '</legend><p class="hint" id="cr-dh">' + tx("cr.destHint") + '</p><div class="citygrid">' +
          CITY_KEYS.map(function (k) {
            var on = d.dests.indexOf(k) >= 0, c = city(k);
            return '<label class="cityopt"><input type="checkbox" name="dest" value="' + k + '"' + (on ? " checked" : "") + ' aria-describedby="cr-dh">' + icon(c.icon) + "<span>" + esc(L(c)) + "</span></label>";
          }).join("") + '</div><p class="err" id="cr-err" hidden>' + tx("cr.destReq") + "</p></fieldset>" +
        '<div class="field-row"><div class="field"><label for="cr-from">' + tx("cr.from") + '</label><input id="cr-from" name="from" type="date" value="' + d.from + '"></div>' +
          '<div class="field"><label for="cr-to">' + tx("cr.to") + '</label><input id="cr-to" name="to" type="date" value="' + d.to + '"></div></div>' +
        '<fieldset class="field"><legend>' + tx("cr.budget") + '</legend><div class="radios">' +
          ["low", "mid", "high"].map(function (b) { return '<label class="radio"><input type="radio" name="budget" value="' + b + '"' + (d.budget === b ? " checked" : "") + "><span>" + tx("cr.b." + b) + "</span></label>"; }).join("") +
        "</div></fieldset></form>" +
        '<div class="flow-foot"><button type="submit" form="create-form" class="btn btn--block">' + tx("cr.go") + "</button></div></div>";
    }
  };
  SCREENS.editor = {
    chrome: "none",
    render: function () {
      var d = state.draft, di = d.day, stops = dayStops(d, di), hrs = dayHours(d, di);
      var html = '<div class="flow">' + header({ back: true, title: L(d.name), right: '<button type="button" class="btn btn--s" data-act="publishSheet">' + tx("ed.publish") + "</button>" }) +
        '<div class="flow-body flow-body--flush"><h1 class="vh" data-focus>' + esc(L(d.name)) + "</h1>" +
        '<div class="emap" role="img" aria-label="' + tx("ed.map", { n: di + 1 }) + ". " + esc(stops.map(function (s, i) { return (i + 1) + " " + L(s.p.n); }).join(", ")) + '">' + localMap(d) + "</div>" +
        '<div class="pad"><div class="daytabs" role="tablist" aria-label="' + tx("ed.days") + '">' +
          d.days.map(function (x, i) { return '<button type="button" role="tab" class="daytab" id="dt-' + i + '" aria-selected="' + (i === di) + '" aria-controls="day-panel" tabindex="' + (i === di ? 0 : -1) + '" data-act="day" data-v="' + i + '">' + tx("tr.day", { n: i + 1 }) + "</button>"; }).join("") +
          '<button type="button" class="daytab daytab--add" data-act="addDay" aria-label="' + tx("ed.addDay") + '">' + icon("ic-plus") + "</button></div>" +
        '<div id="day-panel" role="tabpanel" aria-labelledby="dt-' + di + '">' +
        '<p class="daysum"><span>' + esc(dayLabel(d.from, di)) + "</span><span>" + (stops.length === 1 ? tx("ed.sumOne") : tx("ed.sum", { n: stops.length })) + "</span>" + (hrs ? "<span>" + tx("ed.sumTime", { h: hrs }) + "</span>" : "") + "</p>" +
        (hrs > 8 ? '<p class="warn">' + icon("i-info") + "<span>" + tx("ed.long") + "</span></p>" : "");
      if (!stops.length) html += '<p class="empty-p empty-inline">' + tx("ed.empty") + "</p>";
      html += '<ol class="estops">';
      stops.forEach(function (s, i) {
        html += (i > 0 ? '<li class="eleg" aria-hidden="true">' + icon("i-clock") + tx("ed.walk", { m: 30 }) + "</li>" : "") +
          '<li class="estop"><span class="estop-n">' + (i + 1) + '</span><span class="estop-t"><span class="estop-time">' + s.time + "</span><span class=\"estop-name\">" + esc(L(s.p.n)) + "</span></span>" +
          '<button type="button" class="iconbtn iconbtn--s" data-act="rmStop" data-v="' + i + '" aria-label="' + tx("ed.remove", { name: L(s.p.n) }) + '">' + icon("i-trash") + "</button></li>";
      });
      html += '</ol><button type="button" class="btn btn--ghost btn--block" data-act="addStop">' + icon("ic-plus") + "<span>" + tx("ed.add") + "</span></button></div></div></div></div>";
      return html;
    }
  };
  function localMap(d) {
    var di = d.day, s = '<svg class="emap-svg" viewBox="0 0 360 220" aria-hidden="true" focusable="false">' +
      '<rect width="360" height="220" class="m-land"/>' +
      '<path class="m-sea" d="M0 0H360V70C330 66 300 76 270 80C240 84 214 62 190 52C160 40 130 60 100 78C80 90 60 110 40 122C26 130 12 150 0 160Z"/>' +
      '<path class="m-coast" d="M360 70C330 66 300 76 270 80C240 84 214 62 190 52C160 40 130 60 100 78C80 90 60 110 40 122C26 130 12 150 0 160"/>' +
      '<path class="m-sierra" d="M150 170l22-34 22 34zM186 176l26-42 26 42zM224 172l20-30 20 30zM118 180l16-24 16 24z"/>' +
      '<path class="m-park" d="M196 56C220 70 250 84 290 86L290 110C250 108 214 96 190 78Z"/>' +
      '<text class="m-label m-label--sea" x="250" y="30" text-anchor="middle">' + (state.lang === "en" ? "Caribbean Sea" : "Mar Caribe") + "</text>";
    d.days.forEach(function (day, i) {
      if (i === di) return;
      day.forEach(function (k) { var p = LT.PLACES[k]; s += '<circle class="epin-ghost" cx="' + p.x + '" cy="' + p.y + '" r="4"/>'; });
    });
    var pts = d.days[di].map(function (k) { return LT.PLACES[k]; });
    if (pts.length > 1) s += '<polyline class="eroute" points="' + pts.map(function (p) { return p.x + "," + p.y; }).join(" ") + '"/>';
    pts.forEach(function (p, i) {
      s += '<g class="epin"><circle cx="' + p.x + '" cy="' + p.y + '" r="11"/><text x="' + p.x + '" y="' + (p.y + 4) + '" text-anchor="middle">' + (i + 1) + "</text></g>";
    });
    return s + "</svg>";
  }
  SCREENS.published = {
    chrome: "none",
    render: function () {
      var d = state.draft || newDraft(), open = d.vis === "open";
      return '<div class="flow">' + header({ back: true, backAct: "tab", backIcon: "ic-close", backLabel: "a11y.close" }) + '<div class="pad flow-body flow-body--center"><div class="done">' +
        '<span class="done-mark">' + mark("mark--l") + "</span>" +
        '<h1 class="t1" data-focus>' + tx("pb.done.t") + '</h1><p class="lead">' + tx(open ? "pb.done.pOpen" : "pb.done.pPriv") + "</p></div>" +
        '<div class="card mine"><p class="mine-t">' + esc(L(d.name)) + '</p><p class="mine-m"><span>' + icon("ic-calendar") + esc(range(d.from, d.to)) + "</span><span class=\"tag" + (open ? " tag--ok" : "") + '">' + tx(open ? "mt.open" : "mt.private") + "</span></p></div>" +
        '</div><div class="flow-foot"><button type="button" class="btn btn--block" data-act="tab" data-v="trips">' + tx("pb.done.cta") + "</button></div></div>";
    }
  };

  /* ---------- Mis viajes ---------- */
  SCREENS.trips = {
    chrome: "tabs", tab: "trips",
    render: function () {
      var g = LT.GROUP;
      var html = '<header class="hdr-root"><h1 class="t1" data-focus>' + tx("mt.title") + "</h1></header><div class=\"pad stack\">" +
        '<section class="sec" aria-labelledby="now-h"><h2 class="t3" id="now-h">' + tx("mt.now") + "</h2>" +
        '<article class="gcard"><div class="gcard-art">' + '<img src="' + LT.ART.cartagena.src + '" alt="" width="1200" height="1500" loading="lazy" decoding="async">' + "</div>" +
          '<div class="gcard-body"><p class="gcard-day">' + tx("mt.dayOf", { n: g.day, m: g.totalDays }) + "</p>" +
          '<h3 class="t3"><button type="button" class="tcard-link" data-act="openGroup" data-v="chat">' + esc(L(g.title)) + "</button></h3>" +
          '<p class="tcard-meta"><span>' + icon("ic-calendar") + esc(range(g.start, g.end)) + '</span><span class="avstack avstack--s">' + g.members.map(function (m) { return avatar(m); }).join("") + "</span></p></div></article>" +
          '<button type="button" class="rowbtn" data-act="go" data-v="today">' + icon("i-navigation", "rowbtn-ic") + '<span class="rowbtn-t"><strong>' + tx("gr.inTrip") + "</strong><span>" + tx("gr.inTripP") + "</span></span>" + icon("i-next") + "</button>" +
        "</section>";
      var reqs = Object.keys(state.requests);
      if (reqs.length) {
        html += '<section class="sec" aria-labelledby="req-h"><h2 class="t3" id="req-h">' + tx("mt.requests") + "</h2>";
        reqs.forEach(function (id) {
          var tr = trip(id);
          html += '<button type="button" class="rowbtn" data-act="trip" data-id="' + id + '">' + avatar(tr.host) + '<span class="rowbtn-t"><strong>' + esc(L(tr.title)) + "</strong><span>" + tx("mt.pending") + "</span></span>" + icon("i-next") + "</button>";
        });
        html += "</section>";
      }
      html += '<section class="sec" aria-labelledby="mine-h"><h2 class="t3" id="mine-h">' + tx("mt.mine") + "</h2>";
      if (state.draft) {
        var d = state.draft;
        html += '<button type="button" class="rowbtn" data-act="go" data-v="editor">' + icon(city(d.dests[0] || "santamarta").icon, "rowbtn-ic") + '<span class="rowbtn-t"><strong>' + esc(L(d.name)) + "</strong><span>" + esc(range(d.from, d.to)) + "</span></span>" +
          '<span class="tag' + (d.published && d.vis === "open" ? " tag--ok" : "") + '">' + tx(d.published ? (d.vis === "open" ? "mt.open" : "mt.private") : "mt.draft") + "</span></button>";
      } else {
        html += '<div class="empty empty--art"><img src="' + LT.ART.medellin.src + '" alt="" width="640" height="800" loading="lazy" decoding="async"><p class="empty-p">' + tx("mt.emptyMine") + '</p><button type="button" class="btn btn--ghost" data-act="createSheet">' + icon("ic-plus") + "<span>" + tx("mt.emptyCta") + "</span></button></div>";
      }
      return html + "</section></div>";
    }
  };

  /* ---------- 5 · Grupo del viaje ---------- */
  SCREENS.group = {
    chrome: "trip",
    render: function () {
      var g = LT.GROUP, tab = state.groupTab;
      var html = '<div class="grp">' + header({ back: true, title: L(g.title), right: '<span class="avstack avstack--s hdr-av" aria-hidden="true">' + g.members.slice(1).map(function (m) { return avatar(m); }).join("") + "</span>" }) +
        '<h1 class="vh" data-focus>' + esc(L(g.title)) + "</h1>" +
        '<div class="gtabs pad" role="tablist" aria-label="' + tx("gr.tabs") + '">' +
          ["chat", "itin", "costs"].map(function (k) { return '<button type="button" role="tab" class="gtab" id="gt-' + k + '" aria-selected="' + (tab === k) + '" aria-controls="gpanel" tabindex="' + (tab === k ? 0 : -1) + '" data-act="gtab" data-v="' + k + '">' + tx("gr." + k) + "</button>"; }).join("") +
        '</div><div class="gpanel gpanel--' + tab + '" id="gpanel" role="tabpanel" aria-labelledby="gt-' + tab + '">';
      if (tab === "chat") html += chatPanel();
      else if (tab === "itin") html += itinPanel();
      else html += costsPanel();
      return html + "</div></div>";
    },
    mount: function (el) {
      if (el.querySelector(".chatlog")) el.scrollTop = el.scrollHeight;
    }
  };
  function chatPanel() {
    var g = LT.GROUP;
    var html = '<p class="pinned">' + icon("ic-pin") + '<span><span class="pinned-k">' + tx("gr.pinned") + "</span> " + tx("gr.meet", { place: L(g.pinned.place), time: g.pinned.time }) + "</span></p>" +
      '<ol class="chatlog" aria-label="' + tx("gr.chat") + '"><li class="daysep">' + tx("gr.today") + "</li>";
    state.chat.forEach(function (m) {
      var mine = m.who === "me";
      html += '<li class="msg' + (mine ? " msg--me" : "") + '">' + (mine ? "" : avatar(m.who, "s")) + '<div class="bubble"><p class="bubble-who">' + esc(pname(m.who)) + '</p><p class="bubble-txt">' + esc(L(m.m)) + '</p><p class="bubble-t">' + esc(m.t) + "</p></div></li>";
    });
    return html + '</ol><form class="composer" data-form="chat" novalidate><label class="vh" for="msg-in">' + tx("gr.msgLabel") + '</label><textarea id="msg-in" name="m" rows="1" maxlength="500" placeholder="' + tx("gr.msgPh") + '"></textarea>' +
      '<button type="submit" class="sendbtn" aria-label="' + tx("gr.send") + '">' + icon("i-send") + "</button></form>";
  }
  function itinPanel() {
    var g = LT.GROUP, html = '<div class="pad"><ol class="tline">';
    g.days.forEach(function (d, i) {
      var isToday = i + 1 === g.day;
      html += '<li class="tline-day' + (isToday ? " is-today" : (i + 1 < g.day ? " is-past" : "")) + '"' + (isToday ? ' aria-current="date"' : "") + '><p class="tline-h"><strong>' + tx("tr.day", { n: i + 1 }) + "</strong><span>" + esc(dayLabel(g.start, i)) + "</span>" + (isToday ? '<span class="tag tag--accent">' + tx("gr.today") + "</span>" : "") + "</p>" +
        "<ul>" + L(d).map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ul></li>";
    });
    return html + "</ol></div>";
  }
  function costsPanel() {
    var total = state.expenses.reduce(function (s, e) { return s + e.amount; }, 0), bal = balances();
    var html = '<div class="pad stack"><dl class="totals"><div><dt>' + tx("gs.total") + '</dt><dd class="tnum">' + money(total) + "</dd></div><div><dt>" + tx("gs.yours") + '</dt><dd class="tnum">' + money(myShare()) + "</dd></div></dl>" +
      '<section class="sec" aria-labelledby="bal-h"><h2 class="t3" id="bal-h">' + tx("gs.balances") + '</h2><ul class="bals">';
    if (!bal.length) html += '<li class="bal">' + icon("ic-check") + "<span>" + tx("gs.settled") + "</span></li>";
    bal.forEach(function (b) {
      var label = b.from === "me" ? t("gs.youOwe", { name: pname(b.to) }) : (b.to === "me" ? t("gs.owesYou", { name: pname(b.from) }) : t("gs.owes", { a: pname(b.from), b: pname(b.to) }));
      html += '<li class="bal' + (b.from === "me" ? " bal--me" : "") + '">' + avatar(b.from === "me" ? b.to : b.from, "s") + '<span class="bal-t">' + esc(label) + '</span><span class="bal-a tnum">' + money(b.amount) + "</span>" +
        (b.from === "me" ? '<button type="button" class="btn btn--s btn--ghost" data-act="settle" data-to="' + b.to + '" data-amt="' + b.amount + '">' + tx("gs.settle") + "</button>" : "") + "</li>";
    });
    html += '</ul></section><section class="sec" aria-labelledby="exp-h"><h2 class="t3" id="exp-h">' + tx("gs.list") + '</h2><ul class="exps">';
    state.expenses.slice().reverse().forEach(function (e) {
      html += '<li class="exp"><span class="exp-ic">' + icon("ic-wallet") + '</span><span class="exp-t"><strong>' + esc(L(e.c)) + "</strong><span>" + tx("gs.paidBy", { name: pname(e.payer) }) + ", " + tx("gs.split", { n: e.among.length }) + '</span></span><span class="exp-a tnum">' + money(e.amount) + "</span></li>";
    });
    return html + '</ul></section><button type="button" class="btn btn--block" data-act="newExpense">' + icon("ic-plus") + "<span>" + tx("gs.new") + "</span></button></div>";
  }

  /* ---------- 6 · Modo en viaje ---------- */
  SCREENS.today = {
    chrome: "trip",
    render: function () {
      var g = LT.GROUP, nxt = g.today.filter(function (x) { return x.next; })[0];
      var html = header({ back: state.stack.length > 1 }) + '<div class="pad stack today">' +
        '<div class="today-head"><h1 class="t1" data-focus>' + tx("it.title") + '</h1><p class="lead">' + tx("it.sub", { city: L(city(g.city)), n: g.day, m: g.totalDays }) + "</p></div>" +
        '<section class="card nextstop" aria-labelledby="ns-h"><div class="nextstop-map" aria-hidden="true">' + miniMap() + '</div><div class="nextstop-body"><p class="eyebrowless">' + tx("it.next") + '</p><h2 class="t2" id="ns-h">' + esc(L(nxt.p)) + "</h2><p class=\"muted\">" + icon("i-navigation") + esc(nxt.time) + ", " + tx("it.walk", { m: nxt.walk }) + "</p></div></section>" +
        '<section class="sec" aria-labelledby="ag-h"><h2 class="t3" id="ag-h">' + tx("it.agenda") + '</h2><ol class="agenda">' +
          g.today.map(function (x) { return '<li class="' + (x.done ? "is-done" : "") + (x.next ? " is-next" : "") + '"' + (x.next ? ' aria-current="step"' : "") + '><span class="ag-time tnum">' + x.time + "</span><span>" + esc(L(x.p)) + "</span>" + (x.done ? icon("ic-check") : "") + "</li>"; }).join("") +
        "</ol></section>" +
        '<section class="card meet" aria-labelledby="mt-h"><p class="meet-ic">' + icon("ic-group") + '</p><div><h2 class="t3" id="mt-h">' + tx("it.meet.t") + "</h2><p>" + tx("it.meet.p", { time: g.meet.time, place: L(g.meet.place) }) + "</p>" +
          (state.arrived ? '<p class="okline" role="status">' + icon("ic-check") + "<span>" + tx("it.arrivedDone") + "</span></p>" : '<button type="button" class="btn btn--block" data-act="arrived">' + icon("ic-check") + "<span>" + tx("it.arrived") + "</span></button>") + "</div></section>" +
        '<p class="share">' + icon("ic-shield") + '<span><strong>' + tx("it.share") + "</strong>" + tx("it.shareP") + "</span></p></div>";
      return html;
    }
  };
  function miniMap() {
    return '<svg viewBox="0 0 160 120" class="mini-svg"><rect width="160" height="120" class="m-land"/><path class="m-sea" d="M0 0H70C60 30 50 60 34 120H0Z"/><path class="m-coast" d="M70 0C60 30 50 60 34 120"/>' +
      '<path class="m-walk" d="M64 40C84 52 96 62 118 84"/><circle class="m-me" cx="64" cy="40" r="6"/><g class="epin"><circle cx="118" cy="84" r="10"/><text x="118" y="88" text-anchor="middle">2</text></g></svg>';
  }

  /* ---------- 6b · Seguridad (SOS simulado) ---------- */
  var sos = { phase: "idle", n: 5, timer: 0 };
  SCREENS.sos = {
    chrome: "none",
    render: function () {
      var top = header({ back: sos.phase !== "count", backIcon: "ic-close", backLabel: "a11y.close", title: t("sos.title") });
      if (sos.phase === "count") {
        return '<div class="sosv sosv--count">' + top + '<div class="pad flow-body flow-body--center">' + simNote("sos.sim") +
          '<div class="count-ring" aria-hidden="true"><svg viewBox="0 0 120 120"><circle class="cr-bg" cx="60" cy="60" r="54"/><circle class="cr-fg" cx="60" cy="60" r="54" pathLength="100"/></svg><span class="count-n" id="count-n">' + sos.n + "</span></div>" +
          '<h1 class="t1" data-focus>' + tx("sos.count.t") + '</h1><p class="lead" id="count-p">' + tx("sos.count.p", { n: sos.n }) + "</p>" +
          '<p class="vh" aria-live="assertive" id="count-live">' + tx("sos.count.live", { n: sos.n }) + "</p></div>" +
          '<div class="flow-foot"><button type="button" class="btn btn--cancel btn--block" data-act="sosCancel" id="sos-cancel">' + icon("ic-close") + "<span>" + tx("sos.cancel") + "</span></button></div></div>";
      }
      return '<div class="sosv">' + top + '<div class="pad flow-body">' + simNote("sos.sim") +
        '<h1 class="vh" data-focus>' + tx("sos.title") + "</h1>" +
        '<div class="hold-wrap"><button type="button" class="hold" id="sos-hold" aria-label="' + tx("sos.holdA11y") + '">' +
          '<svg class="hold-ring" viewBox="0 0 200 200" aria-hidden="true"><circle class="hr-bg" cx="100" cy="100" r="94"/><circle class="hr-fg" cx="100" cy="100" r="94" pathLength="100"/></svg>' +
          '<span class="hold-in">' + icon("ic-sos") + '<span class="hold-t">' + tx("sos.hold") + '</span><span class="hold-h">' + tx("sos.holdHint") + "</span></span></button></div>" +
        '<p class="sos-what">' + tx("sos.what") + "</p>" +
        '<button type="button" class="linkbtn linkbtn--center" data-act="sosAlt">' + tx("sos.alt") + "</button>" +
        '<ul class="soslist">' +
          '<li><button type="button" class="rowbtn" data-act="oos">' + icon("i-phone", "rowbtn-ic") + '<span class="rowbtn-t"><strong>' + tx("sos.unsafe") + "</strong><span>" + tx("sos.unsafeP") + "</span></span>" + icon("i-next") + "</button></li>" +
          '<li><button type="button" class="rowbtn" data-act="oos">' + icon("ic-pin", "rowbtn-ic") + '<span class="rowbtn-t"><strong>' + tx("sos.location") + "</strong><span>" + tx("sos.locationP") + "</span></span>" + icon("i-next") + "</button></li>" +
          '<li><button type="button" class="rowbtn" data-act="oos">' + icon("ic-flag", "rowbtn-ic") + '<span class="rowbtn-t"><strong>' + tx("sos.report") + "</strong><span>" + tx("sos.reportP") + "</span></span>" + icon("i-next") + "</button></li>" +
        "</ul></div></div>";
    },
    mount: function (el) {
      if (sos.phase === "count") {
        var btn = el.querySelector("#sos-cancel");
        if (btn) btn.focus({ preventScroll: true });
        setRing(el, 1);
        return;
      }
      var hold = el.querySelector("#sos-hold");
      if (!hold) return;
      var start = 0, raf = 0, holding = false;
      function tick() {
        var p = Math.min(1, (performance.now() - start) / 2000);
        hold.style.setProperty("--p", p.toFixed(3));
        if (p >= 1) { holding = false; hold.classList.remove("is-holding"); vibrate([40, 60, 40]); startCountdown(); return; }
        raf = requestAnimationFrame(tick);
      }
      function begin() { if (holding) return; holding = true; start = performance.now(); hold.classList.add("is-holding"); vibrate(15); raf = requestAnimationFrame(tick); }
      function end() { if (!holding) return; holding = false; cancelAnimationFrame(raf); hold.classList.remove("is-holding"); hold.style.setProperty("--p", "0"); }
      hold.addEventListener("pointerdown", function (e) { e.preventDefault(); try { hold.setPointerCapture(e.pointerId); } catch (x) { /* sin captura */ } begin(); });
      ["pointerup", "pointercancel", "lostpointercapture"].forEach(function (ev) { hold.addEventListener(ev, end); });
      hold.addEventListener("keydown", function (e) { if ((e.key === " " || e.key === "Enter") && !e.repeat) { e.preventDefault(); begin(); } });
      hold.addEventListener("keyup", function (e) { if (e.key === " " || e.key === "Enter") { e.preventDefault(); end(); } });
      hold.addEventListener("contextmenu", function (e) { e.preventDefault(); });
      cleanups.push(function () { cancelAnimationFrame(raf); });
    }
  };
  function setRing(el, frac) {
    var r = (el || $screen).querySelector(".count-ring");
    if (r) r.style.setProperty("--f", frac.toFixed(3));
  }
  function startCountdown() {
    sos.phase = "count"; sos.n = 5;
    renderNow();
    clearInterval(sos.timer);
    sos.timer = setInterval(function () {
      sos.n -= 1;
      if (sos.n <= 0) {
        clearInterval(sos.timer); sos.phase = "idle";
        go("sosSent", {}, { replace: true });
        return;
      }
      var n = $screen.querySelector("#count-n"), p = $screen.querySelector("#count-p"), live = $screen.querySelector("#count-live");
      if (n) n.textContent = sos.n;
      if (p) p.textContent = t("sos.count.p", { n: sos.n });
      if (live) live.textContent = t("sos.count.live", { n: sos.n });
      setRing(null, sos.n / 5);
      vibrate(20);
    }, 1000);
  }
  SCREENS.sosSent = {
    chrome: "none",
    render: function () {
      var row = function (k) { return "<li>" + icon("ic-check") + "<span>" + tx(k) + '</span><span class="tag">' + tx("sos.sent.simTag") + "</span></li>"; };
      return '<div class="sosv sosv--sent">' + header({ right: '<span class="iconbtn-gap"></span>' }) + '<div class="pad flow-body">' + simNote("sos.sim") +
        '<div class="done"><span class="done-badge done-badge--safety">' + icon("ic-sos") + '</span><h1 class="t1" data-focus>' + tx("sos.sent.t") + '</h1><p class="lead">' + tx("sos.sent.p") + "</p></div>" +
        '<ul class="sentlist">' + row("sos.sent.1") + row("sos.sent.2") + row("sos.sent.3") + "</ul>" +
        '<p class="realcall">' + icon("i-phone") + "<span>" + tx("sos.sent.real") + "</span></p></div>" +
        '<div class="flow-foot"><button type="button" class="btn btn--block" data-act="sosEnd">' + tx("sos.sent.ok") + "</button></div></div>";
    }
  };

  /* ---------- Mensajes ---------- */
  SCREENS.messages = {
    chrome: "tabs", tab: "messages",
    render: function () {
      var g = LT.GROUP, last = state.chat[state.chat.length - 1];
      var html = '<header class="hdr-root"><h1 class="t1" data-focus>' + tx("ms.title") + '</h1></header><ul class="inbox">' +
        '<li><button type="button" class="ibx" data-act="openGroup" data-v="chat"><span class="ibx-av">' + avatar("andres") + "</span>" +
          '<span class="ibx-t"><strong>' + esc(L(g.title)) + "</strong><span>" + esc(pname(last.who)) + ": " + esc(L(last.m)) + "</span></span>" +
          '<span class="ibx-r"><span class="tnum">' + esc(last.t) + "</span>" + (state.unread ? '<span class="badge" aria-label="' + tx("ms.unread", { n: state.unread }) + '">' + state.unread + "</span>" : "") + "</span></button></li>";
      Object.keys(state.requests).forEach(function (id) {
        var tr = trip(id);
        html += '<li><button type="button" class="ibx" data-act="trip" data-id="' + id + '"><span class="ibx-av">' + avatar(tr.host) + '</span><span class="ibx-t"><strong>' + tx("ms.request", { name: person(tr.host).short }) + "</strong><span>" + tx("ms.requestP") + "</span></span>" + icon("i-next") + "</button></li>";
      });
      html += '<li><div class="ibx ibx--static"><span class="ibx-av">' + mark("mark--av") + '</span><span class="ibx-t"><strong>' + tx("ms.lumen") + "</strong><span>" + tx("ms.lumenP") + "</span></span></div></li></ul>";
      return html;
    }
  };

  /* ---------- 7 · Perfil ---------- */
  SCREENS.profile = {
    chrome: "tabs", tab: "profile",
    render: function () {
      var me = person("me"), lv = state.level;
      var html = '<header class="hdr-root"><h1 class="vh" data-focus>' + tx("pf.title") + "</h1></header>" +
        '<div class="pad stack"><div class="me"><span class="me-av lv-' + lv + '">' + avatar("me", "xl") + (lv >= 2 ? '<span class="me-check">' + icon("ic-shield") + "</span>" : "") + "</span>" +
        '<p class="t1 me-name">' + esc(me.name) + '</p><p class="muted">' + tx("pf.from", { city: "Bogotá" }) + '</p><p class="muted">' + tx("pf.langs") + "</p>" +
        (lv >= 2 ? vbadge() : '<span class="vbadge vbadge--plain">' + icon("i-phone") + "<span>" + tx("pf.levelN", { n: 1 }) + ", " + tx("pf.l1").toLowerCase() + "</span></span>") + "</div>" +
        '<dl class="stats stats--card card"><div><dt>' + tx("pf.trips") + "</dt><dd>3</dd></div><div><dt>" + tx("pf.reviews") + "</dt><dd>5</dd></div><div><dt>" + tx("pf.rating") + "</dt><dd>" + icon("i-star") + (state.lang === "en" ? "4.8" : "4,8") + "</dd></div></dl>" +
        '<section class="sec" aria-labelledby="lv-h"><h2 class="t2" id="lv-h">' + tx("pf.level") + '</h2><ol class="ladder">';
      for (var i = 0; i <= 3; i++) {
        html += '<li class="' + (i < lv ? "is-done" : (i === lv ? "is-now" : "")) + '"' + (i === lv ? ' aria-current="step"' : "") + '><span class="ladder-dot">' + (i <= lv ? icon("ic-check") : i) + '</span><div><p class="ladder-t">' + tx("pf.levelN", { n: i }) + ": " + tx("pf.l" + i) +
          (i === lv ? ' <span class="tag tag--accent">' + tx("pf.current") + "</span>" : "") + "</p><p>" + tx("pf.l" + i + "p") + "</p></div></li>";
      }
      html += "</ol>" + (lv < 2 ? '<button type="button" class="btn btn--block" data-act="verifyProfile">' + icon("ic-shield") + "<span>" + tx("pf.verify") + "</span></button>" : "") + "</section>" +
        '<section class="sec" aria-labelledby="ct-h"><h2 class="t2" id="ct-h">' + tx("pf.contacts") + '</h2><p class="muted">' + tx("pf.contactsP") + '</p><ul class="contacts">' +
          '<li><span class="av av--d" aria-hidden="true">A</span><span>' + tx("pf.mom") + "</span></li><li><span class=\"av av--c\" aria-hidden=\"true\">D</span><span>" + tx("pf.friend") + "</span></li></ul></section>" +
        '<section class="sec" aria-labelledby="st-h"><h2 class="t2" id="st-h">' + tx("pf.style") + '</h2><ul class="taglist"><li class="tag">' + tx("style.cultural") + '</li><li class="tag">' + tx("style.nature") + '</li><li class="tag">' + tx("style.food") + "</li></ul></section>" +
        '<section class="sec" aria-labelledby="set-h"><h2 class="t2" id="set-h">' + tx("pf.settings") + "</h2>" +
          '<div class="setrow"><span>' + tx("lang.label") + "</span>" + langSeg() + "</div>" +
          '<div class="setrow"><span>' + tx("pf.theme") + '</span><div class="seg seg--s" role="group" aria-label="' + tx("pf.theme") + '">' +
            '<button type="button" class="seg-btn" data-act="theme" data-v="light" aria-pressed="' + (state.theme === "light") + '">' + icon("i-sun") + "<span>" + tx("pf.light") + "</span></button>" +
            '<button type="button" class="seg-btn" data-act="theme" data-v="dark" aria-pressed="' + (state.theme === "dark") + '">' + icon("i-moon") + "<span>" + tx("pf.dark") + "</span></button></div></div>" +
          '<button type="button" class="btn btn--ghost btn--block" data-act="reset">' + icon("i-reset") + "<span>" + tx("proto.reset") + "</span></button></section>" +
        '<p class="signed">' + mark("mark--s") + "<span>" + tx("pf.signed") + '</span></p><p class="proto-tag">' + tx("proto.tag") + "</p></div>";
      return html;
    }
  };

  /* ================= SHEETS ================= */
  function filterSheet(k) {
    var f = state.filters, body = "";
    if (k === "dest") {
      body = '<h2 class="t2" id="sheet-title">' + tx("f.destT") + '</h2><div class="opts" role="radiogroup" aria-labelledby="sheet-title">' +
        ["all"].concat(CITY_KEYS).map(function (c) {
          var on = f.dest === c, label = c === "all" ? t("f.all") : L(city(c));
          return '<button type="button" role="radio" class="opt" aria-checked="' + on + '" data-act="setF" data-k="dest" data-v="' + c + '">' + (c === "all" ? icon("i-compass") : icon(city(c).icon)) + "<span>" + esc(label) + "</span>" + (on ? icon("ic-check", "opt-check") : "") + "</button>";
        }).join("") + "</div>";
    } else if (k === "dates") {
      body = '<h2 class="t2" id="sheet-title">' + tx("f.datesT") + '</h2><div class="opts" role="radiogroup" aria-labelledby="sheet-title">' +
        ["any", "nov", "dec"].map(function (w) {
          var on = f.when === w;
          return '<button type="button" role="radio" class="opt" aria-checked="' + on + '" data-act="setF" data-k="when" data-v="' + w + '">' + icon("ic-calendar") + "<span>" + tx(w === "any" ? "f.anyDate" : "f." + w) + "</span>" + (on ? icon("ic-check", "opt-check") : "") + "</button>";
        }).join("") + "</div>";
    } else {
      body = '<h2 class="t2" id="sheet-title">' + tx("f.styleT") + '</h2><p class="hint">' + tx("f.styleHint") + '</p><div class="chips chips--wrap">' +
        STYLES.map(function (s) { var on = f.styles.indexOf(s) >= 0; return '<button type="button" class="chip' + (on ? " is-on" : "") + '" aria-pressed="' + on + '" data-act="toggleStyle" data-v="' + s + '">' + (on ? icon("ic-check") : "") + "<span>" + tx("style." + s) + "</span></button>"; }).join("") + "</div>";
    }
    var n = filtered().length;
    return body + '<div class="sheet-foot"><button type="button" class="btn btn--block" data-act="closeSheet">' + tx("f.apply") + " (" + n + ")</button>" +
      '<button type="button" class="btn btn--text btn--block" data-act="clearFilters">' + tx("f.clear") + "</button></div>";
  }
  function whySheet(id) {
    var tr = trip(id);
    return '<div class="why-head">' + compat(tr, true).replace('data-act="why"', 'data-act="noop" tabindex="-1"') + '<h2 class="t2" id="sheet-title">' + tx("cp.sheetT") + "</h2></div>" + whyList(tr) +
      '<p class="muted">' + tx("cp.sheetP") + '</p><div class="sheet-foot"><button type="button" class="btn btn--block" data-act="closeSheet">' + tx("cp.ok") + "</button></div>";
  }
  function createSheet() {
    return '<h2 class="t2" id="sheet-title">' + tx("cr.sheetT") + '</h2><div class="opts">' +
      '<button type="button" class="opt opt--big" data-act="startCreate" data-v="new">' + icon("ic-plan") + '<span class="opt-t"><strong>' + tx("cr.new") + "</strong><span>" + tx("cr.newP") + "</span></span></button>" +
      '<button type="button" class="opt opt--big" data-act="startCreate" data-v="find">' + icon("ic-group") + '<span class="opt-t"><strong>' + tx("cr.find") + "</strong><span>" + tx("cr.findP") + "</span></span></button>" +
      '<button type="button" class="opt opt--big" aria-disabled="true" data-act="oos">' + icon("ic-sparkle") + '<span class="opt-t"><strong>' + tx("cr.tpl") + "</strong><span>" + tx("cr.tplP") + '</span></span><span class="tag">' + tx("cr.soon") + "</span></button></div>";
  }
  function addStopSheet() {
    var d = state.draft, used = [].concat.apply([], d.days);
    var keys = Object.keys(LT.PLACES).filter(function (k) { return used.indexOf(k) < 0; });
    return '<h2 class="t2" id="sheet-title">' + tx("ed.addT", { n: d.day + 1 }) + '</h2><p class="hint">' + tx("ed.addP") + '</p><div class="opts">' +
      keys.map(function (k) { var p = LT.PLACES[k]; return '<button type="button" class="opt" data-act="pickStop" data-v="' + k + '">' + icon("ic-pin") + '<span class="opt-t"><strong>' + esc(L(p.n)) + "</strong><span>" + p.h + " h</span></span>" + icon("ic-plus", "opt-check") + "</button>"; }).join("") + "</div>";
  }
  function publishSheet() {
    var d = state.draft;
    return '<h2 class="t2" id="sheet-title">' + tx("pb.t") + '</h2><fieldset class="field"><legend>' + tx("pb.vis") + '</legend><div class="opts" role="radiogroup">' +
      ["private", "open"].map(function (v) {
        var key = v === "open" ? "open" : "private", on = d.vis === key;
        return '<button type="button" role="radio" class="opt opt--big" aria-checked="' + on + '" data-act="vis" data-v="' + key + '">' + icon(v === "open" ? "ic-globe" : "i-lock") + '<span class="opt-t"><strong>' + tx("pb." + v) + "</strong><span>" + tx("pb." + v + "P") + "</span></span>" + (on ? icon("ic-check", "opt-check") : "") + "</button>";
      }).join("") + "</div></fieldset>" +
      (d.vis === "open" ? '<div class="field"><p class="label" id="spots-l">' + tx("pb.spots") + '</p><div class="stepper" role="group" aria-labelledby="spots-l"><button type="button" class="iconbtn iconbtn--line" data-act="spots" data-v="-1" aria-label="' + tx("pb.less") + '"' + (d.spots <= 1 ? " disabled" : "") + ">" + icon("i-minus") + '</button><output class="stepper-n" aria-live="polite">' + d.spots + '</output><button type="button" class="iconbtn iconbtn--line" data-act="spots" data-v="1" aria-label="' + tx("pb.more") + '"' + (d.spots >= 5 ? " disabled" : "") + ">" + icon("ic-plus") + '</button></div><p class="hint">' + tx("pb.spotsHint") + "</p></div>" +
        '<fieldset class="field"><legend>' + tx("pb.style") + '</legend><div class="chips chips--wrap">' + STYLES.slice(0, 6).map(function (s) { var on = d.styles.indexOf(s) >= 0; return '<button type="button" class="chip' + (on ? " is-on" : "") + '" aria-pressed="' + on + '" data-act="pubStyle" data-v="' + s + '">' + (on ? icon("ic-check") : "") + "<span>" + tx("style." + s) + "</span></button>"; }).join("") + "</div></fieldset>" +
        (state.level < 2 ? '<p class="cta-note">' + icon("i-lock") + "<span>" + tx("pb.needs") + "</span></p>" : "") : "") +
      '<div class="sheet-foot"><button type="button" class="btn btn--block" data-act="publish">' + tx("pb.go") + "</button></div>";
  }
  function expenseSheet() {
    var g = LT.GROUP;
    return '<form data-form="expense" novalidate><h2 class="t2" id="sheet-title">' + tx("gs.new") + "</h2>" +
      '<div class="field"><label for="ex-c">' + tx("gs.concept") + '</label><input id="ex-c" name="c" type="text" autocomplete="off" placeholder="' + tx("gs.conceptPh") + '" required></div>' +
      '<div class="field"><label for="ex-a">' + tx("gs.amount") + '</label><input id="ex-a" name="a" type="text" inputmode="numeric" autocomplete="off" placeholder="45.000" required></div>' +
      '<fieldset class="field"><legend>' + tx("gs.payer") + '</legend><div class="chips chips--wrap">' +
        g.members.map(function (m, i) { return '<label class="chip chip--in"><input type="radio" name="payer" value="' + m + '"' + (i === 0 ? " checked" : "") + "><span>" + esc(pname(m)) + "</span></label>"; }).join("") + "</div></fieldset>" +
      '<fieldset class="field"><legend>' + tx("gs.among") + '</legend><div class="chips chips--wrap">' +
        g.members.map(function (m) { return '<label class="chip chip--in"><input type="checkbox" name="among" value="' + m + '" checked><span>' + esc(pname(m)) + "</span></label>"; }).join("") + "</div></fieldset>" +
      '<p class="err" id="ex-err" hidden>' + tx("gs.req") + '</p><div class="sheet-foot"><button type="submit" class="btn btn--block">' + tx("gs.save") + "</button></div></form>";
  }
  function altSheet() {
    return '<div role="alertdialog" aria-labelledby="sheet-title" aria-describedby="alt-p"><h2 class="t2" id="sheet-title">' + tx("sos.altT") + '</h2><p class="lead" id="alt-p">' + tx("sos.altP") + "</p>" + simNote("sos.sim") +
      '<div class="sheet-foot"><button type="button" class="btn btn--safety btn--block" data-act="sosAltGo">' + tx("sos.altGo") + '</button><button type="button" class="btn btn--ghost btn--block" data-act="closeSheet" data-autofocus>' + tx("sos.altNo") + "</button></div></div>";
  }

  var lastFocus = null, sheetKind = null, sheetArg = null;
  function openSheet(kind, arg, opener) {
    sheetKind = kind; sheetArg = arg;
    lastFocus = opener || doc.activeElement;
    paintSheet();
    $sheet.hidden = false;
    setInert(true);
    requestAnimationFrame(function () {
      $sheet.classList.add("is-open");
      var f = $sheet.querySelector("[data-autofocus]") || $sheet.querySelector("#sheet-title");
      if (f) { if (!f.hasAttribute("tabindex") && f.tagName === "H2") f.setAttribute("tabindex", "-1"); f.focus({ preventScroll: true }); }
    });
  }
  function paintSheet() {
    var html = sheetKind === "filter" ? filterSheet(sheetArg) : sheetKind === "why" ? whySheet(sheetArg) : sheetKind === "create" ? createSheet() :
      sheetKind === "addStop" ? addStopSheet() : sheetKind === "publish" ? publishSheet() : sheetKind === "expense" ? expenseSheet() : altSheet();
    var scrollY = 0, old = $sheet.querySelector(".sheet-body");
    if (old) scrollY = old.scrollTop;
    $sheet.innerHTML = '<div class="sheet-backdrop" data-act="closeSheet"></div><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title">' +
      '<div class="sheet-grip" aria-hidden="true"></div><button type="button" class="iconbtn sheet-x" data-act="closeSheet" aria-label="' + tx("a11y.close") + '">' + icon("ic-close") + '</button><div class="sheet-body">' + html + "</div></div>";
    var nb = $sheet.querySelector(".sheet-body");
    if (nb) nb.scrollTop = scrollY;
  }
  function repaintSheetKeepFocus() {
    var a = doc.activeElement, key = a && a.dataset ? a.dataset.act + "|" + (a.dataset.v || a.dataset.k || "") : null;
    paintSheet();
    if (key) {
      var parts = key.split("|"), els = $sheet.querySelectorAll('[data-act="' + parts[0] + '"]');
      for (var i = 0; i < els.length; i++) if ((els[i].dataset.v || els[i].dataset.k || "") === parts[1]) { els[i].focus({ preventScroll: true }); break; }
    }
  }
  function closeSheet(noFocus) {
    if ($sheet.hidden) return;
    $sheet.classList.remove("is-open");
    setInert(false);
    var done = function () { $sheet.hidden = true; $sheet.innerHTML = ""; };
    if (reduceMotion.matches) done(); else setTimeout(done, 220);
    sheetKind = null;
    if (!noFocus && lastFocus && doc.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }
  function setInert(on) {
    [$screen, $tabbar, $tripbar].forEach(function (el) { if (on) el.setAttribute("inert", ""); else el.removeAttribute("inert"); });
  }

  /* ================= RENDER Y NAVEGACIÓN ================= */
  var timers = [], cleanups = [];
  function clearTimers() {
    timers.forEach(clearTimeout); timers = [];
    cleanups.forEach(function (f) { try { f(); } catch (e) { /* nada */ } }); cleanups = [];
  }
  function renderTabbar(def) {
    if (def.chrome !== "tabs") { $tabbar.hidden = true; $tabbar.innerHTML = ""; return; }
    $tabbar.hidden = false;
    var items = [["explore", "i-compass"], ["trips", "ic-plan"], ["create", "ic-plus"], ["messages", "ic-chat"], ["profile", "i-user"]];
    $tabbar.innerHTML = '<ul class="tabs">' + items.map(function (it) {
      var on = def.tab === it[0];
      if (it[0] === "create") return '<li><button type="button" class="tab tab--create" data-act="createSheet" aria-haspopup="dialog"><span class="tab-plus">' + icon("ic-plus") + '</span><span class="tab-l">' + tx("tab.create") + "</span></button></li>";
      return '<li><button type="button" class="tab' + (on ? " is-on" : "") + '" data-act="tab" data-v="' + it[0] + '"' + (on ? ' aria-current="page"' : "") + ">" + icon(it[1]) +
        (it[0] === "messages" && state.unread ? '<span class="tab-badge" aria-hidden="true">' + state.unread + "</span>" : "") +
        '<span class="tab-l">' + tx("tab." + it[0]) + (it[0] === "messages" && state.unread ? '<span class="vh">, ' + tx("ms.unread", { n: state.unread }) + "</span>" : "") + "</span></button></li>";
    }).join("") + "</ul>";
  }
  function renderTripbar(def) {
    if (def.chrome !== "tabs" && def.chrome !== "trip") { $tripbar.innerHTML = ""; $tripbar.hidden = true; return; }
    var g = LT.GROUP, onToday = cur().n === "today";
    $tripbar.hidden = false;
    $tripbar.innerHTML = '<div class="tripbar">' +
      (onToday ? '<p class="tripbar-go tripbar-go--static">' : '<button type="button" class="tripbar-go" data-act="go" data-v="today">') +
        mark("mark--s") + '<span class="tripbar-t"><strong>' + tx("bar.inTrip") + "</strong><span>" + tx("bar.where", { city: L(city(g.city)), n: g.day }) + "</span></span>" +
      (onToday ? "</p>" : "</button>") +
      '<button type="button" class="sosbtn" data-act="go" data-v="sos" aria-label="' + tx("bar.sos") + '">' + icon("ic-sos") + "</button></div>";
  }
  function applyStatic() {
    root.lang = state.lang;
    root.dataset.theme = state.theme;
    doc.title = t("meta.title");
    var meta = doc.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", state.theme === "dark" ? "#18161b" : "#f6f4ef");
    var els = doc.querySelectorAll(".note [data-i18n]");
    for (var i = 0; i < els.length; i++) els[i].textContent = t(els[i].dataset.i18n);
    var segs = doc.querySelectorAll('.note [data-act="lang"]');
    for (var j = 0; j < segs.length; j++) segs[j].setAttribute("aria-pressed", String(segs[j].dataset.v === state.lang));
    var grp = doc.querySelector(".note .seg");
    if (grp) grp.setAttribute("aria-label", t("lang.label"));
    $tabbar.setAttribute("aria-label", t("tab.nav"));
  }
  function render(keep) {
    clearTimers();
    var top = cur(), def = SCREENS[top.n] || SCREENS.explore, st = $screen.scrollTop;
    $screen.innerHTML = def.render(top.p || {});
    $screen.scrollTop = keep ? st : 0;
    $screen.className = "screen screen--" + top.n;
    $app.dataset.chrome = def.chrome;
    renderTabbar(def);
    renderTripbar(def);
    applyStatic();
    if (def.mount) def.mount($screen, top.p || {});
  }
  function renderNow() { render(true); save(); }
  function afterNav(focus) {
    if (focus === false) return;
    var h = $screen.querySelector("[data-focus]") || $screen.querySelector("h1");
    if (h) { if (!h.hasAttribute("tabindex")) h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
  }
  function transition(dir, focus) {
    save();
    var useVT = typeof doc.startViewTransition === "function" && !reduceMotion.matches && dir !== "none";
    if (!useVT) { render(false); afterNav(focus); return; }
    root.dataset.dir = dir;
    var vt;
    var typed = typeof window.ViewTransition === "function" && "types" in window.ViewTransition.prototype;
    var upd = function () { render(false); };
    try { vt = typed ? doc.startViewTransition({ update: upd, types: [dir] }) : doc.startViewTransition(upd); }
    catch (e) { render(false); afterNav(focus); return; }
    vt.updateCallbackDone.then(function () { afterNav(focus); }, function () { /* nada */ });
    vt.finished.finally(function () { delete root.dataset.dir; });
  }
  function go(n, p, opt) {
    opt = opt || {};
    var entry = { n: n, p: p || {} };
    if (opt.reset) state.stack = [entry];
    else if (opt.replace) state.stack[state.stack.length - 1] = entry;
    else { state.stack.push(entry); try { history.pushState({ lt: state.stack.length }, ""); } catch (e) { /* nada */ } }
    closeSheet(true);
    transition(opt.dir || (opt.reset ? "fade" : (opt.replace ? "fade" : "forward")), opt.focus);
  }
  function back() {
    if (state.stack.length <= 1) return;
    state.stack.pop();
    closeSheet(true);
    transition("backward");
  }
  function popWhile(names) {
    while (state.stack.length > 1 && names.indexOf(cur().n) >= 0) state.stack.pop();
  }
  window.addEventListener("popstate", function () {
    if (!$sheet.hidden) { closeSheet(); return; }
    if (cur().n === "sos" && sos.phase === "count") return;
    back();
  });

  function toast(msg) {
    $toast.textContent = msg;
    $toast.classList.add("is-on");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { $toast.classList.remove("is-on"); }, 2800);
  }

  /* ================= ACCIONES ================= */
  var A = {
    noop: function () {},
    back: function () { if (history.state && history.state.lt) history.back(); else back(); },
    go: function (el) { go(el.dataset.v, {}); },
    oos: function () { toast(t("proto.outOfScope")); },
    lang: function (el) {
      state.lang = el.dataset.v;
      if (!$sheet.hidden) closeSheet(true);
      renderNow();
      var b = doc.querySelector('#screen [data-act="lang"][data-v="' + state.lang + '"]') || doc.querySelector('.note [data-act="lang"][data-v="' + state.lang + '"]');
      if (b) b.focus({ preventScroll: true });
    },
    theme: function (el) {
      state.theme = el.dataset.v; renderNow();
      var b = doc.querySelector('#screen [data-act="theme"][data-v="' + state.theme + '"]'); if (b) b.focus({ preventScroll: true });
    },
    reset: function () {
      clearInterval(sos.timer); sos.phase = "idle";
      var keep = { lang: state.lang, theme: state.theme };
      state = fresh(); state.lang = keep.lang; state.theme = keep.theme;
      try { window.sessionStorage.removeItem(KEY); } catch (e) { /* nada */ }
      closeSheet(true);
      transition("fade");
      toast(t("proto.resetDone"));
    },
    obNext: function () { state.ob = Math.min(2, state.ob + 1); state.stack = [{ n: "onboarding", p: {} }]; transition("forward"); },
    obDone: function () { state.ob = 0; go("explore", {}, { reset: true }); },
    tab: function (el) {
      var v = el.dataset.v || "explore";
      if (v === "messages") state.unread = 0;
      go(v, {}, { reset: true });
    },
    toExplore: function () { go("explore", {}, { reset: true, dir: "backward" }); },
    view: function (el) { state.view = el.dataset.v; renderNow(); var b = $screen.querySelector('[data-act="view"][data-v="' + state.view + '"]'); if (b) b.focus({ preventScroll: true }); },
    filter: function (el) { openSheet("filter", el.dataset.k, el); },
    setF: function (el) { state.filters[el.dataset.k] = el.dataset.v; state.mapCity = null; renderNow(); repaintSheetKeepFocus(); },
    toggleStyle: function (el) {
      var s = el.dataset.v, a = state.filters.styles, i = a.indexOf(s);
      if (i >= 0) a.splice(i, 1); else a.push(s);
      renderNow(); repaintSheetKeepFocus();
    },
    clearFilters: function () { state.filters = { dest: "all", when: "any", styles: [] }; state.mapCity = null; closeSheet(true); renderNow(); var h = $screen.querySelector("h1"); if (h) { h.setAttribute("tabindex", "-1"); h.focus(); } },
    mapCity: function (el) { state.mapCity = el.dataset.v || null; renderNow(); var b = $screen.querySelector('[data-act="mapCity"][data-v="' + (state.mapCity || "") + '"]'); if (b) b.focus({ preventScroll: true }); },
    why: function (el) { openSheet("why", el.dataset.id, el); },
    trip: function (el) { go("trip", { id: el.dataset.id }); },
    closeSheet: function () { closeSheet(); },
    join: function (el) {
      var id = el.dataset.id;
      if (state.level < 2) { state.vf = { doc: "cc", shot: false, selfie: 0 }; go("verify", { step: "intro", ctx: { kind: "join", id: id } }); }
      else go("join", { id: id });
    },
    verifyProfile: function () { state.vf = { doc: "cc", shot: false, selfie: 0 }; go("verify", { step: "intro", ctx: { kind: "profile" } }); },
    vfGo: function (el) { go("verify", { step: el.dataset.step, ctx: cur().p.ctx }); },
    vfDoc: function (el) { state.vf.doc = el.dataset.v; renderNow(); var b = $screen.querySelector('[data-act="vfDoc"][data-v="' + state.vf.doc + '"]'); if (b) b.focus({ preventScroll: true }); },
    vfShot: function (el) {
      state.vf.shot = el.dataset.v === "1"; renderNow();
      var b = $screen.querySelector(".flow-foot .btn"); if (b) b.focus({ preventScroll: true });
    },
    vfSelfie: function () {
      var steps = [1, 2, 3, 4];
      steps.forEach(function (s, i) {
        timers.push(setTimeout(function () {
          state.vf.selfie = s;
          var keepTimers = timers; timers = []; render(true); timers = keepTimers; save();
          if (s === 4) { var b = $screen.querySelector(".flow-foot .btn"); if (b) b.focus({ preventScroll: true }); }
        }, i * 1100 + 150));
      });
    },
    vfClose: function () { popWhile(["verify"]); transition("backward"); },
    vfDone: function () {
      var ctx = cur().p.ctx || {};
      popWhile(["verify"]);
      if (ctx.kind === "join") { state.stack.push({ n: "join", p: { id: ctx.id } }); transition("forward"); }
      else if (ctx.kind === "publish") { transition("backward"); setTimeout(function () { openSheet("publish"); }, reduceMotion.matches ? 0 : 380); }
      else transition("backward");
    },
    tpl: function (el) {
      var ta = $screen.querySelector("#jr-msg");
      if (!ta) return;
      ta.value = t("jr.tpl" + el.dataset.v);
      ta.focus();
      var err = $screen.querySelector("#jr-err"); if (err) { err.hidden = true; ta.removeAttribute("aria-invalid"); }
    },
    createSheet: function (el) { openSheet("create", null, el); },
    startCreate: function () { if (!state.draft) state.draft = newDraft(); go("create", {}); },
    day: function (el) { state.draft.day = +el.dataset.v; renderNow(); var b = $screen.querySelector("#dt-" + state.draft.day); if (b) b.focus({ preventScroll: true }); },
    addDay: function () { state.draft.days.push([]); state.draft.day = state.draft.days.length - 1; renderNow(); var b = $screen.querySelector("#dt-" + state.draft.day); if (b) b.focus({ preventScroll: true }); },
    rmStop: function (el) { state.draft.days[state.draft.day].splice(+el.dataset.v, 1); renderNow(); var b = $screen.querySelector('[data-act="addStop"]'); if (b) b.focus({ preventScroll: true }); },
    addStop: function (el) { openSheet("addStop", null, el); },
    pickStop: function (el) {
      var k = el.dataset.v; state.draft.days[state.draft.day].push(k);
      closeSheet(true); renderNow();
      toast(t("ed.added", { name: L(LT.PLACES[k].n), n: state.draft.day + 1 }));
      var b = $screen.querySelector('[data-act="addStop"]'); if (b) b.focus({ preventScroll: true });
    },
    publishSheet: function (el) { openSheet("publish", null, el); },
    vis: function (el) { state.draft.vis = el.dataset.v; save(); repaintSheetKeepFocus(); },
    spots: function (el) { var d = state.draft; d.spots = Math.max(1, Math.min(5, d.spots + (+el.dataset.v))); save(); repaintSheetKeepFocus(); },
    pubStyle: function (el) { var a = state.draft.styles, s = el.dataset.v, i = a.indexOf(s); if (i >= 0) a.splice(i, 1); else a.push(s); save(); repaintSheetKeepFocus(); },
    publish: function () {
      var d = state.draft;
      if (d.vis === "open" && state.level < 2) { state.vf = { doc: "cc", shot: false, selfie: 0 }; go("verify", { step: "intro", ctx: { kind: "publish" } }); return; }
      d.published = true;
      go("published", {}, { replace: false });
    },
    openGroup: function (el) { state.groupTab = el.dataset.v || "chat"; if (state.groupTab === "chat") state.unread = 0; go("group", {}); },
    gtab: function (el) { state.groupTab = el.dataset.v; renderNow(); var b = $screen.querySelector("#gt-" + state.groupTab); if (b) b.focus({ preventScroll: true }); },
    settle: function (el) {
      state.payments.push({ from: "me", to: el.dataset.to, amount: +el.dataset.amt });
      renderNow(); toast(t("gs.paidOk"));
      var h = $screen.querySelector("#bal-h"); if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
    },
    newExpense: function (el) { openSheet("expense", null, el); },
    arrived: function () { state.arrived = true; renderNow(); var s = $screen.querySelector(".meet .okline"); if (s) { s.setAttribute("tabindex", "-1"); s.focus({ preventScroll: true }); } },
    sosAlt: function (el) { openSheet("alt", null, el); },
    sosAltGo: function () { closeSheet(true); startCountdown(); },
    sosCancel: function () {
      clearInterval(sos.timer); sos.phase = "idle"; renderNow();
      toast(t("sos.cancelled"));
      var b = $screen.querySelector("#sos-hold"); if (b) b.focus({ preventScroll: true });
    },
    sosEnd: function () {
      popWhile(["sosSent", "sos"]);
      if (cur().n !== "today") state.stack.push({ n: "today", p: {} });
      transition("backward");
    }
  };

  /* ================= FORMULARIOS ================= */
  var F = {
    join: function (form) {
      var ta = form.querySelector("#jr-msg"), err = form.querySelector("#jr-err");
      if (ta.value.trim().length < 8) { err.hidden = false; ta.setAttribute("aria-invalid", "true"); ta.focus(); return; }
      state.requests[form.dataset.id] = { msg: ta.value.trim() };
      go("sent", { id: form.dataset.id }, { replace: true });
    },
    create: function (form) {
      var dests = [].slice.call(form.querySelectorAll('input[name="dest"]:checked')).map(function (i) { return i.value; });
      var err = form.querySelector("#cr-err");
      if (!dests.length) { err.hidden = false; form.querySelector('input[name="dest"]').focus(); return; }
      var d = state.draft || newDraft();
      var nm = form.querySelector("#cr-name").value.trim();
      if (nm && nm !== L(d.name)) d.name = nm;
      d.dests = dests;
      d.from = form.querySelector("#cr-from").value || d.from;
      d.to = form.querySelector("#cr-to").value || d.to;
      if (d.to < d.from) d.to = d.from;
      var b = form.querySelector('input[name="budget"]:checked'); if (b) d.budget = b.value;
      state.draft = d;
      go("editor", {}, { replace: true });
    },
    chat: function (form) {
      var ta = form.querySelector("textarea"), v = ta.value.trim();
      if (!v) { ta.focus(); return; }
      var now = new Date(), hh = ("0" + now.getHours()).slice(-2) + ":" + ("0" + now.getMinutes()).slice(-2);
      state.chat.push({ who: "me", t: hh, m: { es: v, en: v } });
      renderNow();
      var nta = $screen.querySelector("#msg-in"); if (nta) nta.focus({ preventScroll: true });
      timers.push(setTimeout(function () {
        state.chat.push({ who: "camila", t: hh, m: { es: LT.S.es["gr.reply"], en: LT.S.en["gr.reply"] } });
        if (cur().n === "group" && state.groupTab === "chat") {
          var draft = $screen.querySelector("#msg-in"), val = draft ? draft.value : "", had = doc.activeElement === draft;
          renderNow();
          var n2 = $screen.querySelector("#msg-in"); if (n2) { n2.value = val; if (had) n2.focus({ preventScroll: true }); }
        } else save();
      }, 1400));
    },
    expense: function (form) {
      var c = form.querySelector("#ex-c").value.trim(), a = parseInt(form.querySelector("#ex-a").value.replace(/[^\d]/g, ""), 10) || 0;
      var payer = (form.querySelector('input[name="payer"]:checked') || {}).value || "me";
      var among = [].slice.call(form.querySelectorAll('input[name="among"]:checked')).map(function (i) { return i.value; });
      var err = form.querySelector("#ex-err");
      if (!c || a <= 0 || !among.length) { err.hidden = false; (c ? form.querySelector("#ex-a") : form.querySelector("#ex-c")).focus(); return; }
      state.expenses.push({ id: uid(), c: { es: c, en: c }, payer: payer, amount: a, among: among });
      closeSheet(true); renderNow(); toast(t("gs.saved"));
      var h = $screen.querySelector("#bal-h"); if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
    }
  };

  /* ================= EVENTOS ================= */
  doc.addEventListener("click", function (e) {
    var el = e.target.closest("[data-act]");
    if (!el || el.disabled || el.getAttribute("aria-disabled") === "true" && el.dataset.act !== "oos") return;
    var fn = A[el.dataset.act];
    if (fn) { e.preventDefault(); fn(el, e); }
  });
  doc.addEventListener("submit", function (e) {
    var form = e.target, fn = F[form.dataset.form];
    if (fn) { e.preventDefault(); fn(form); }
  });
  doc.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !$sheet.hidden) { e.preventDefault(); closeSheet(); return; }
    /* pestañas con flechas (patrón tablist) */
    var tab = e.target.closest && e.target.closest('[role="tab"]');
    if (tab && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
      var list = [].slice.call(tab.parentNode.querySelectorAll('[role="tab"]')), i = list.indexOf(tab);
      var nx = list[(i + (e.key === "ArrowRight" ? 1 : -1) + list.length) % list.length];
      if (nx) { e.preventDefault(); nx.click(); }
    }
    /* Enter envía en el chat; Mayús+Enter hace salto de línea */
    if (e.key === "Enter" && !e.shiftKey && e.target.id === "msg-in") { e.preventDefault(); e.target.form.requestSubmit ? e.target.form.requestSubmit() : F.chat(e.target.form); }
  });
  doc.addEventListener("input", function (e) {
    if (e.target.id === "jr-msg" && e.target.value.trim().length >= 8) {
      var err = doc.getElementById("jr-err"); if (err) err.hidden = true; e.target.removeAttribute("aria-invalid");
    }
    if (e.target.name === "dest") { var ce = doc.getElementById("cr-err"); if (ce) ce.hidden = true; }
  });

  /* arranque: la cuenta regresiva nunca se retoma tras recargar */
  if (cur().n === "sosSent" || cur().n === "sos") sos.phase = "idle";
  render(false);
  try { history.replaceState({ lt: 0 }, ""); } catch (e) { /* nada */ }
})();
