/* Lumen Travels · landing de validación (H2 confianza vs. comodidad, H4 disposición a pagar).
   Sin dependencias. Se carga síncrono en <head>: decide variante e idioma antes de pintar,
   y el resto se engancha en DOMContentLoaded. Textos: docs/validacion/landing-copy.md. */
(function () {
  'use strict';

  var CONFIG = {
    supabaseUrl: 'https://efhfnlfneonjiiahrvyd.supabase.co',
    // Clave publicable: segura en el navegador. RLS solo permite INSERT en waitlist y landing_events.
    supabaseKey: 'sb_publishable_jOGXX6Rf-0F5BfNcY_Aa9g_l1XzmNZK',
    contactEmail: '' // PENDIENTE: correo de contacto por definir (landing-copy §3.5). Vacío = no se muestra.
  };

  var PLANS = ['plus_monthly', 'trip_pass'];
  var STORE = { variant: 'lt_variant', session: 'lt_session', lang: 'lt_lang', joined: 'lt_joined', plan: 'lt_plan' };

  /* ---------- Textos (copiados tal cual de landing-copy.md) ---------- */
  var T = {
    en: {
      'meta.title': 'Lumen Travels: plan your route and find travel companions in Colombia',
      'meta.desc': 'Plan your trip day by day and find verified travelers heading your way across Colombia. Join the waitlist. Your route, your people.',
      'a11y.skip': 'Skip to content',
      'nav.lang': 'Language',
      'nav.join': 'Join the waitlist',
      'hero.A.title': 'Travel Colombia with people who are who they say they are.',
      'hero.A.sub': 'Verified travelers, public first meetups and a safety button, so finding company on the road feels calm. Your route, your people.',
      'hero.B.title': 'Plan your route and find your group in one place.',
      'hero.B.sub': 'Build your trip day by day, see who is heading your way and keep the chat and the bills together. Your route, your people.',
      'hero.cta': 'Join the waitlist',
      'mock.label': 'Example of the app: a route across Colombia from Medellín to Bogotá, Cartagena, Santa Marta and Tayrona, with a group of verified travelers heading to Tayrona on the same dates.',
      'mock.example': 'Example',
      'mock.day': 'Day 5 · Tayrona',
      'mock.group': '3 travelers on your dates',
      'mock.verified': 'Verified',
      'mock.plan': 'Plan',
      'mock.match': 'Match up',
      'mock.trust': 'Trust',
      'how.h': 'How it will work',
      'how.1t': 'Plan.', 'how.1d': 'Build your route on the map, day by day, with times and budget.',
      'how.2t': 'Find.', 'how.2d': 'See travelers going where you’re going, when you’re going.',
      'how.3t': 'Travel together.', 'how.3d': 'Verified people, one group chat, shared bills.',
      'pillars.h': 'Four things, one app',
      'pillars.1t': 'Plan.', 'pillars.1d': 'Plan your trip day by day on the map, with clear times and budget.',
      'pillars.2t': 'Match up.', 'pillars.2d': 'Meet travelers heading where you’re going, when you’re going.',
      'pillars.3t': 'Travel together.', 'pillars.3d': 'One place for the plan, the chat, the votes and the bills.',
      'pillars.4t': 'Trust.', 'pillars.4d': 'Verified profiles, real reviews and a safety button that’s always free.',
      'safety.h': 'Safety comes first',
      'safety.text': 'Exploring is free. Meeting people takes one extra step: you verify your identity before you message, join or post a trip. This is what we’re building:',
      'safety.1': 'Identity check with an ID and a selfie, done by a specialist provider.',
      'safety.2': 'Reviews from both sides, written after the trip.',
      'safety.3': 'A suggestion to hold the first meetup in a public place.',
      'safety.4': 'A safety button, free for everyone, always.',
      'safety.5': 'Reports, blocking and a team that reviews them.',
      'safety.close': 'No app can remove every risk. We design to lower it and we’ll tell you plainly how it works.',
      'price.h': 'What would you pay for? Help us get it right.',
      'price.intro': 'Lumen Travels will have a free base. These are the paid options we’re testing. Nothing is charged today.',
      'price.1name': 'Plus, monthly',
      'price.1price': 'USD 3.99 per month',
      'price.1amt': 'USD 3.99', 'price.1per': 'per month',
      'price.1desc': 'Offline maps and routes, itinerary export to PDF, more active trips and groups, advanced match filters (style, pace, language).',
      'price.2name': 'Trip Pass, 30 days',
      'price.2price': 'USD 4.99, one-time payment',
      'price.2amt': 'USD 4.99', 'price.2per': 'one-time payment',
      'price.2desc': 'The Plus extras for one trip, no subscription.',
      'price.line': 'Safety is never paid: verification and the safety button are free for everyone.',
      'price.btn': 'Reserve my spot',
      'price.btnDone': 'Spot reserved',
      'price.okT': 'Your spot is saved.',
      'price.okD': 'We don’t charge anything yet. We’ll let you know when we open, and the launch price stays saved for you. No payment needed now.',
      'price.okMore': 'Want us to write to you? Leave your email below.',
      'form.h': 'Join the waitlist',
      'form.intro': 'Leave your details and we’ll write to you when Lumen Travels opens. No spam.',
      'form.hDone': 'You’re in',
      'form.introDone': 'We’ll write to you when Lumen Travels opens. Nothing else to do for now.',
      'form.email': 'Email',
      'form.emailPh': 'you@email.com',
      'form.country': 'Country you’re from',
      'form.choose': 'Choose…',
      'form.dates': 'Approximate dates of your trip to Colombia',
      'form.datesHint': 'Month and year or a range',
      'form.unsure': 'Not sure yet',
      'form.cities': 'Cities of the route you’d like to visit',
      'form.other': 'Other',
      'form.concierge': 'I want to join the Santa Marta–Tayrona test group',
      'form.consentPre': 'I agree that Lumen Studio uses my details to contact me about Lumen Travels and to improve it. I can ask to see, correct or delete them at any time, and withdraw consent whenever I want. I’m 18 or older. See the',
      'form.consentLink': 'Privacy policy',
      'form.consentPost': '.',
      'form.consentLaw': 'Colombia Law 1581 of 2012 and GDPR.',
      'form.required': '(required)',
      'form.optional': '(optional)',
      'form.planRemove': 'Remove',
      'form.submit': 'Join the waitlist',
      'form.success': 'You’re on the list. We’ll write to you when Lumen Travels opens. If you ticked the test group, we’ll contact you about Santa Marta–Tayrona. Your route, your people.',
      'err.email': 'That email doesn’t look right. Check it and try again.',
      'err.consent': 'To join, we need you to accept the data use.',
      'err.required': 'Please fill in this field.',
      'err.emailReq': 'Enter your email.',
      'err.countryReq': 'Choose your country.',
      'err.datesReq': 'Enter your dates or tick “Not sure yet”.',
      'err.server': 'We couldn’t save your details. Check your connection and try again. Your answers are still here.',
      'faq.h': 'Questions',
      'faq.1q': 'Is Lumen Travels available yet?', 'faq.1a': 'Not yet. We’re validating the idea and building it. Join the list and we’ll write to you when it opens.',
      'faq.2q': 'Where will it work first?', 'faq.2a': 'Colombia, along the Medellín – Bogotá – Caribbean route (Cartagena, Santa Marta, Tayrona). The app will be in English and Spanish.',
      'faq.3q': 'Is it free?', 'faq.3a': 'The plan is a free base. A paid “Plus” for extra comfort and a 30-day Trip Pass are being tested; see the prices above. Nothing is charged today.',
      'faq.4q': 'Does “Reserve my spot” charge me?', 'faq.4a': 'No. It only saves your interest. We don’t take payments on this page.',
      'faq.5q': 'Will safety features ever be paid?', 'faq.5a': 'No. Verification and the safety button stay free.',
      'faq.6q': 'How do you verify people?', 'faq.6a': 'With an ID and a selfie, through a specialist provider. You’ll do it before you message, join or post a trip.',
      'faq.7q': 'What do you do with my data?', 'faq.7a': 'We use your email and answers only to contact you about Lumen Travels and to improve it. You can ask us to delete them at any time.',
      'faq.8q': 'Can I join if I’m under 18?', 'faq.8a': 'No. Lumen Travels is for people aged 18 and over.',
      'footer.slogan': 'Your route, your people.',
      'footer.nav': 'Legal',
      'footer.privacy': 'Privacy policy',
      'footer.requests': 'Data requests',
      'footer.contact': 'Contact',
      'footer.small': 'This page is a test. Lumen Travels is not available yet and we don’t charge anything.',
      'footer.sign': 'Designed by Lumen Studio',
      'footer.art': 'Illustrations made for Lumen Studio. Icons: Lucide (ISC\u00a0license).',
      'lamp.label': 'Tap the Lumen light',
      'route.s4': 'Santa Marta and Tayrona',
      'route.step': 'Stop {n} of 4',
      'route.km': 'About {km} km in a straight line from Medellín',
      'route.start': 'Where the route starts',
      'hero.alt': 'Illustration: three small travelers, seen from behind, walk together along a mountain path through coffee fields, above green valleys and a river glowing at sunset.',
      'route.map': 'The route: Medellín, Bogotá, Cartagena, Santa Marta and Tayrona.',
      'route.sea': 'Caribbean Sea',
      'route.alt1': 'Illustration of Medellín: Metrocable cable cars glide over hillside brick houses, with the Aburrá Valley below.',
      'route.alt2': 'Illustration of Bogotá: a cobblestone street in La Candelaria lined with white and ochre houses with wooden balconies; two travelers stroll together beneath Monserrate hill and its sanctuary.',
      'route.alt3': 'Illustration of Cartagena: a narrow street in the walled city between ochre and red facades with wooden balconies and bougainvillea; two travelers walk together toward the cathedral’s tower and dome.',
      'route.alt4': 'Illustration of Tayrona National Park: a pale sandy cove with large rounded boulders, palm trees and a thatched hut on the point; two travelers sit on the beach watching the sea at sunset.',
      'price.lineA': 'Safety is never paid.',
      'price.lineB': 'Verification and the safety button are free for everyone.'
    },
    es: {
      'meta.title': 'Lumen Travels: planea tu ruta y encuentra compañeros de viaje en Colombia',
      'meta.desc': 'Planea tu viaje día a día y encuentra viajeros verificados que van por tu camino en Colombia. Únete a la lista de espera. Tu ruta, tu gente.',
      'a11y.skip': 'Saltar al contenido',
      'nav.lang': 'Idioma',
      'nav.join': 'Unirme a la lista de espera',
      'hero.A.title': 'Recorre Colombia con gente que es quien dice ser.',
      'hero.A.sub': 'Viajeros verificados, primeros encuentros en lugares públicos y un botón de seguridad, para que buscar compañía en el camino se sienta tranquilo. Tu ruta, tu gente.',
      'hero.B.title': 'Planea tu ruta y encuentra tu grupo en un solo lugar.',
      'hero.B.sub': 'Arma tu viaje día a día, mira quién va por tu camino y deja el chat y las cuentas en el mismo sitio. Tu ruta, tu gente.',
      'hero.cta': 'Unirme a la lista de espera',
      'mock.label': 'Ejemplo de la app: una ruta por Colombia de Medellín a Bogotá, Cartagena, Santa Marta y Tayrona, con un grupo de viajeros verificados que va a Tayrona en las mismas fechas.',
      'mock.example': 'Ejemplo',
      'mock.day': 'Día 5 · Tayrona',
      'mock.group': '3 viajeros en tus fechas',
      'mock.verified': 'Verificados',
      'mock.plan': 'Planea',
      'mock.match': 'Coincide',
      'mock.trust': 'Confianza',
      'how.h': 'Así va a funcionar',
      'how.1t': 'Planea.', 'how.1d': 'Arma tu ruta sobre el mapa, día a día, con tiempos y presupuesto.',
      'how.2t': 'Encuentra.', 'how.2d': 'Mira quiénes van a donde tú vas, cuando tú vas.',
      'how.3t': 'Viajen juntos.', 'how.3d': 'Gente verificada, un chat de grupo y las cuentas claras.',
      'pillars.h': 'Cuatro cosas, una sola app',
      'pillars.1t': 'Planea.', 'pillars.1d': 'Arma tu viaje día a día sobre el mapa, con tiempos y presupuesto claros.',
      'pillars.2t': 'Coincide.', 'pillars.2d': 'Encuentra viajeros que van a donde tú vas, cuando tú vas.',
      'pillars.3t': 'Viajen juntos.', 'pillars.3d': 'Un solo lugar para el plan, el chat, las votaciones y las cuentas.',
      'pillars.4t': 'Confianza.', 'pillars.4d': 'Perfiles verificados, reseñas reales y un botón de seguridad siempre gratis.',
      'safety.h': 'La seguridad va primero',
      'safety.text': 'Explorar es gratis. Para encontrarte con gente hay un paso más: verificas tu identidad antes de escribir, unirte o publicar un viaje. Esto es lo que estamos construyendo:',
      'safety.1': 'Verificación de identidad con documento y selfie, a cargo de un proveedor especializado.',
      'safety.2': 'Reseñas de ambas partes, escritas después del viaje.',
      'safety.3': 'La sugerencia de hacer el primer encuentro en un lugar público.',
      'safety.4': 'Un botón de seguridad, gratis para todos, siempre.',
      'safety.5': 'Reportes, bloqueo y un equipo que los revisa.',
      'safety.close': 'Ninguna app elimina todos los riesgos. Diseñamos para reducirlos y te contamos con claridad cómo funciona.',
      'price.h': '¿Qué pagarías? Ayúdanos a acertar.',
      'price.intro': 'Lumen Travels tendrá una base gratuita. Estas son las opciones de pago que estamos probando. Hoy no se cobra nada.',
      'price.1name': 'Plus mensual',
      'price.1price': 'USD 3,99 al mes',
      'price.1amt': 'USD 3,99', 'price.1per': 'al mes',
      'price.1desc': 'Mapas y rutas sin conexión, exportar el itinerario a PDF, más viajes y grupos activos, filtros avanzados de coincidencia (estilo, ritmo, idioma).',
      'price.2name': 'Pase de viaje, 30 días',
      'price.2price': 'USD 4,99, pago único',
      'price.2amt': 'USD 4,99', 'price.2per': 'pago único',
      'price.2desc': 'Los extras de Plus para un viaje, sin suscripción.',
      'price.line': 'La seguridad nunca se cobra: la verificación y el botón de seguridad son gratis para todos.',
      'price.btn': 'Reservar mi lugar',
      'price.btnDone': 'Lugar reservado',
      'price.okT': 'Tu lugar quedó guardado.',
      'price.okD': 'Todavía no cobramos nada. Te avisaremos cuando abramos y el precio de lanzamiento queda guardado para ti. No tienes que pagar ahora.',
      'price.okMore': '¿Quieres que te escribamos? Deja tu correo abajo.',
      'form.h': 'Lista de espera',
      'form.intro': 'Déjanos tus datos y te escribimos cuando Lumen Travels abra. Sin spam.',
      'form.hDone': 'Listo, ya estás dentro',
      'form.introDone': 'Te escribiremos cuando Lumen Travels abra. Por ahora no tienes que hacer nada más.',
      'form.email': 'Correo electrónico',
      'form.emailPh': 'tu@correo.com',
      'form.country': 'País de origen',
      'form.choose': 'Elige…',
      'form.dates': 'Fechas aproximadas de tu viaje a Colombia',
      'form.datesHint': 'Mes y año o un rango',
      'form.unsure': 'Aún no lo sé',
      'form.cities': 'Ciudades del corredor que quieres visitar',
      'form.other': 'Otra',
      'form.concierge': 'Quiero entrar al grupo de prueba Santa Marta–Tayrona',
      'form.consentPre': 'Acepto que Lumen Studio use mis datos para escribirme sobre Lumen Travels y mejorarlo. Puedo pedir ver, corregir o borrar mis datos cuando quiera y retirar mi consentimiento en cualquier momento. Soy mayor de 18 años. Consulta la',
      'form.consentLink': 'Política de privacidad',
      'form.consentPost': '.',
      'form.consentLaw': 'Ley 1581 de 2012 (Colombia) y GDPR.',
      'form.required': '(obligatorio)',
      'form.optional': '(opcional)',
      'form.planRemove': 'Quitar',
      'form.submit': 'Unirme a la lista de espera',
      'form.success': 'Ya estás en la lista. Te escribimos cuando Lumen Travels abra. Si marcaste el grupo de prueba, te contactaremos por lo de Santa Marta–Tayrona. Tu ruta, tu gente.',
      'err.email': 'Ese correo no parece correcto. Revísalo e inténtalo de nuevo.',
      'err.consent': 'Para unirte necesitamos que aceptes el uso de tus datos.',
      'err.required': 'Completa este campo.',
      'err.emailReq': 'Escribe tu correo.',
      'err.countryReq': 'Elige tu país.',
      'err.datesReq': 'Escribe las fechas o marca «Aún no lo sé».',
      'err.server': 'No pudimos guardar tus datos. Revisa tu conexión e inténtalo de nuevo; tus respuestas siguen aquí.',
      'faq.h': 'Preguntas frecuentes',
      'faq.1q': '¿Ya puedo usar Lumen Travels?', 'faq.1a': 'Todavía no. Estamos validando la idea y construyéndola. Apúntate y te escribimos cuando abra.',
      'faq.2q': '¿Dónde va a funcionar primero?', 'faq.2a': 'En Colombia, por la ruta Medellín – Bogotá – Caribe (Cartagena, Santa Marta, Tayrona). La app será en español e inglés.',
      'faq.3q': '¿Es gratis?', 'faq.3a': 'La idea es una base gratuita. Estamos probando un «Plus» de comodidad y un Pase de viaje de 30 días; mira los precios más arriba. Hoy no se cobra nada.',
      'faq.4q': '¿«Reservar mi lugar» me cobra?', 'faq.4a': 'No. Solo guarda tu interés. En esta página no recibimos pagos.',
      'faq.5q': '¿La seguridad se va a cobrar alguna vez?', 'faq.5a': 'No. La verificación y el botón de seguridad seguirán siendo gratis.',
      'faq.6q': '¿Cómo verifican a las personas?', 'faq.6a': 'Con documento y selfie, a través de un proveedor especializado. Lo harás antes de escribir, unirte o publicar un viaje.',
      'faq.7q': '¿Qué hacen con mis datos?', 'faq.7a': 'Usamos tu correo y tus respuestas solo para escribirte sobre Lumen Travels y mejorarlo. Puedes pedir que los borremos cuando quieras.',
      'faq.8q': '¿Puedo entrar si soy menor de 18?', 'faq.8a': 'No. Lumen Travels es para personas de 18 años o más.',
      'footer.slogan': 'Tu ruta, tu gente.',
      'footer.nav': 'Legal',
      'footer.privacy': 'Política de privacidad',
      'footer.requests': 'Solicitudes sobre tus datos',
      'footer.contact': 'Contacto',
      'footer.small': 'Esta página es una prueba. Lumen Travels aún no está disponible y no cobramos nada.',
      'footer.sign': 'Diseñado por Lumen Studio',
      'footer.art': 'Ilustraciones generadas para Lumen Studio. Iconos: Lucide (licencia\u00a0ISC).',
      'lamp.label': 'Toca la luz de Lumen',
      'route.s4': 'Santa Marta y Tayrona',
      'route.step': 'Parada {n} de 4',
      'route.km': 'Unos {km} km en línea recta desde Medellín',
      'route.start': 'Aquí empieza la ruta',
      'hero.alt': 'Ilustración: tres viajeros pequeños, de espaldas, caminan juntos por un sendero de montaña entre cafetales; abajo, valles verdes y un río dorado al atardecer.',
      'route.map': 'La ruta: Medellín, Bogotá, Cartagena, Santa Marta y Tayrona.',
      'route.sea': 'Mar Caribe',
      'route.alt1': 'Ilustración de Medellín: cabinas del Metrocable sobre las casas de ladrillo de la ladera, con el valle de Aburrá al fondo.',
      'route.alt2': 'Ilustración de Bogotá: calle empedrada de La Candelaria con casas blancas y ocres de balcones de madera; dos viajeros pasean juntos y al fondo se alza el cerro de Monserrate con su santuario.',
      'route.alt3': 'Ilustración de Cartagena: calle estrecha de la ciudad amurallada entre fachadas ocres y rojizas con balcones de madera y buganvilias; dos viajeros caminan juntos hacia la torre y la cúpula de la catedral.',
      'route.alt4': 'Ilustración del Parque Tayrona: cala de arena clara con grandes rocas redondas, palmeras y una cabaña de palma sobre la punta; dos viajeros sentados en la playa miran el mar al atardecer.',
      'price.lineA': 'La seguridad nunca se cobra.',
      'price.lineB': 'La verificación y el botón de seguridad son gratis para todos.'
    }
  };
  var PLAN_LABEL = { plus_monthly: ['price.1name', 'price.1price'], trip_pass: ['price.2name', 'price.2price'] };

  // ISO 3166-1 alfa-2. Se guarda solo el código (dato mínimo); el nombre lo da Intl.DisplayNames en cada idioma.
  var COUNTRIES = ('AD AE AF AG AI AL AM AO AR AS AT AU AW AZ BA BB BD BE BF BG BH BI BJ BM BN BO BR BS BT BW BY BZ ' +
    'CA CD CF CG CH CI CK CL CM CN CO CR CU CV CW CY CZ DE DJ DK DM DO DZ EC EE EG ER ES ET FI FJ FM FO FR GA GB GD GE ' +
    'GF GH GI GL GM GN GP GQ GR GT GU GW GY HK HN HR HT HU ID IE IL IN IQ IR IS IT JM JO JP KE KG KH KI KM KN KP KR KW ' +
    'KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MG MH MK ML MM MN MO MQ MR MT MU MV MW MX MY MZ NA NC NE NG NI ' +
    'NL NO NP NR NZ OM PA PE PF PG PH PK PL PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SI SK SL SM SN SO SR SS ' +
    'ST SV SX SY SZ TC TD TG TH TJ TL TM TN TO TR TT TV TW TZ UA UG US UY UZ VA VC VE VG VI VN VU WS XK YE ZA ZM ZW').split(' ');

  /* ---------- Utilidades seguras ---------- */
  function lsGet(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* sin storage: se asigna por visita */ } }
  function ssGet(k) { try { return window.sessionStorage.getItem(k); } catch (e) { return null; } }
  function ssSet(k, v) { try { window.sessionStorage.setItem(k, v); } catch (e) { /* noop */ } }
  function uuid() {
    try { if (window.crypto && crypto.randomUUID) return crypto.randomUUID(); } catch (e) { /* noop */ }
    try {
      var b = new Uint8Array(16); crypto.getRandomValues(b);
      return Array.prototype.map.call(b, function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
    } catch (e2) { return 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2, 12); }
  }
  function clip(v, n) { return v ? String(v).trim().slice(0, n) : null; }

  var params;
  try { params = new URLSearchParams(window.location.search); } catch (e) { params = { get: function () { return null; } }; }

  /* ---------- Variante A/B ---------- */
  var forcedV = (params.get('v') || '').toUpperCase();
  var isForced = forcedV === 'A' || forcedV === 'B';
  var variant;
  if (isForced) {
    variant = forcedV; // Para revisar: no se guarda ni se registran eventos (no contamina la prueba).
  } else {
    variant = lsGet(STORE.variant);
    if (variant !== 'A' && variant !== 'B') {
      var r = new Uint8Array(1);
      try { crypto.getRandomValues(r); } catch (e) { r[0] = Math.random() * 256; }
      variant = (r[0] & 1) ? 'B' : 'A';
      lsSet(STORE.variant, variant);
    }
  }
  // ?qa=1 marca la sesión con prefijo "qa-" para poder filtrarla o borrarla de las métricas.
  var isQA = params.get('qa') === '1';
  var sessionId = lsGet(STORE.session);
  if (!sessionId || sessionId.length < 8 || sessionId.length > 64) {
    sessionId = uuid();
    lsSet(STORE.session, sessionId);
  }
  if (isQA && sessionId.indexOf('qa-') !== 0) sessionId = ('qa-' + sessionId).slice(0, 64);

  /* ---------- Idioma ---------- */
  function resolveLang() {
    var q = (params.get('lang') || '').toLowerCase();
    if (q === 'es' || q === 'en') return q;
    var saved = lsGet(STORE.lang);
    if (saved === 'es' || saved === 'en') return saved;
    var nav = (navigator.languages && navigator.languages[0]) || navigator.language || 'en';
    return /^es\b/i.test(nav) ? 'es' : 'en';
  }
  var lang = resolveLang();

  var root = document.documentElement;
  root.setAttribute('data-variant', variant);
  root.setAttribute('lang', lang);
  if (lang !== 'en') root.classList.add('i18n-pending');

  function t(key) { return (T[lang] && T[lang][key]) || T.en[key] || ''; }

  /* ---------- Envío a Supabase (solo INSERT, return=minimal) ---------- */
  function insert(table, row) {
    return fetch(CONFIG.supabaseUrl + '/rest/v1/' + table, {
      method: 'POST',
      headers: {
        'apikey': CONFIG.supabaseKey,
        'Authorization': 'Bearer ' + CONFIG.supabaseKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(row),
      keepalive: true,
      credentials: 'omit',
      referrerPolicy: 'no-referrer'
    });
  }
  function track(event, plan) {
    if (isForced) return Promise.resolve(null);
    var row = { session_id: sessionId, event: event, variant: variant, plan: plan || null, lang: lang };
    return insert('landing_events', row).catch(function () { return null; });
  }

  /* ---------- Página ---------- */
  function applyI18n() {
    root.setAttribute('lang', lang);
    document.title = t('meta.title');
    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var k = nodes[i].getAttribute('data-i18n');
      if (k === 'meta.title') continue;
      nodes[i].textContent = t(k);
    }
    var attrs = document.querySelectorAll('[data-i18n-attr]');
    for (var j = 0; j < attrs.length; j++) {
      var spec = attrs[j].getAttribute('data-i18n-attr').split(':');
      attrs[j].setAttribute(spec[0], t(spec[1]));
    }
    var og = document.querySelector('meta[property="og:locale"]');
    if (og) og.setAttribute('content', lang === 'es' ? 'es_CO' : 'en_US');
    var btns = document.querySelectorAll('[data-lang]');
    for (var b = 0; b < btns.length; b++) btns[b].setAttribute('aria-pressed', String(btns[b].getAttribute('data-lang') === lang));
    fillCountries();
    syncLegalLinks();
    renderPlanChip();
    renderJoinHead();
    tuckPunctuation();
    refreshErrors();
    var c = document.getElementById('contact-link');
    if (c && CONFIG.contactEmail) {
      c.hidden = false; c.href = 'mailto:' + CONFIG.contactEmail;
      c.textContent = t('footer.contact') + ': ' + CONFIG.contactEmail;
    }
    root.classList.remove('i18n-pending');
  }

  function fillCountries() {
    var sel = document.getElementById('f-country');
    if (!sel) return;
    var current = sel.value;
    var dn = null;
    try { dn = new Intl.DisplayNames([lang], { type: 'region' }); } catch (e) { dn = null; }
    var list = COUNTRIES.map(function (code) {
      var name = code;
      try { name = (dn && dn.of(code)) || code; } catch (e) { name = code; }
      return { code: code, name: name };
    });
    var collator;
    try { collator = new Intl.Collator(lang); } catch (e) { collator = { compare: function (a, b) { return a < b ? -1 : a > b ? 1 : 0; } }; }
    list.sort(function (a, b) { return collator.compare(a.name, b.name); });
    while (sel.options.length > 1) sel.remove(1);
    sel.options[0].textContent = t('form.choose');
    var frag = document.createDocumentFragment();
    list.forEach(function (c) { var o = document.createElement('option'); o.value = c.code; o.textContent = c.name; frag.appendChild(o); });
    sel.appendChild(frag);
    sel.value = current;
  }

  function setLang(next) {
    if (next !== 'en' && next !== 'es') return;
    lang = next;
    lsSet(STORE.lang, lang);
    applyI18n();
  }

  function scrollToForm(focus) {
    var target = document.getElementById('waitlist');
    if (!target) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    if (focus) {
      var email = document.getElementById('f-email');
      var success = document.getElementById('form-success');
      var el = (success && !success.hidden) ? success : email;
      if (el) setTimeout(function () { el.focus({ preventScroll: true }); }, reduce ? 0 : 450);
    }
  }

  /* ---------- Titulares grandes: la coma y el punto se acercan a la letra anterior ----------
     Plus Jakarta deja mucho aire a la izquierda de «,» y «.»; a 90 px con tracking negativo se ve un hueco. */
  function tuckPunctuation() {
    var nodes = document.querySelectorAll('.hero h1 .hv, .footer-slogan');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i], txt = el.textContent, frag = document.createDocumentFragment();
      var parts = txt.split(/([,.])/);
      for (var k = 0; k < parts.length; k++) {
        if (!parts[k]) continue;
        if (parts[k] === ',' || parts[k] === '.') { var sp = document.createElement('span'); sp.className = 'punct'; sp.textContent = parts[k]; frag.appendChild(sp); }
        else frag.appendChild(document.createTextNode(parts[k]));
      }
      el.textContent = ''; el.appendChild(frag);
    }
  }

  /* ---------- Cabecera de la lista: tras unirte deja de invitar a unirse ---------- */
  var joinedNow = false;
  function renderJoinHead() {
    var h = document.getElementById('form-title');
    var intro = document.querySelector('.join-intro');
    if (h) h.textContent = t(joinedNow ? 'form.hDone' : 'form.h');
    if (intro) intro.textContent = t(joinedNow ? 'form.introDone' : 'form.intro');
  }

  /* ---------- Los enlaces a la política llevan el idioma: no cambia al pasar de página ---------- */
  function syncLegalLinks() {
    var links = document.querySelectorAll('a[href^="/privacidad"]');
    for (var i = 0; i < links.length; i++) {
      var hash = links[i].getAttribute('href').split('#')[1] || '';
      links[i].setAttribute('href', '/privacidad?lang=' + lang + (hash ? '#' + hash : ''));
    }
  }

  /* ---------- Plan reservado (sin cobro) ---------- */
  var reservedPlan = (function () { var p = ssGet(STORE.plan); return PLANS.indexOf(p) >= 0 ? p : null; })();

  function renderPlanChip() {
    var chip = document.getElementById('plan-chip');
    var txt = document.getElementById('plan-chip-text');
    if (!chip || !txt) return;
    var cards = document.querySelectorAll('.reserve');
    for (var i = 0; i < cards.length; i++) {
      var on = cards[i].getAttribute('data-plan') === reservedPlan;
      cards[i].closest('.plan').classList.toggle('picked', on);
      cards[i].setAttribute('aria-pressed', String(on));
      cards[i].textContent = t(on ? 'price.btnDone' : 'price.btn');
    }
    if (!reservedPlan) { chip.hidden = true; return; }
    txt.textContent = t(PLAN_LABEL[reservedPlan][0]) + ': ' + t(PLAN_LABEL[reservedPlan][1]);
    chip.hidden = false;
  }

  function onReserve(e) {
    var plan = e.currentTarget.getAttribute('data-plan');
    if (PLANS.indexOf(plan) < 0) return;
    track('reserve_click', plan);
    reservedPlan = plan;
    ssSet(STORE.plan, plan);
    renderPlanChip();
    var msg = document.getElementById('reserve-msg');
    var more = msg.querySelector('.reserve-more');
    more.hidden = lsGet(STORE.joined) === '1';
    msg.hidden = false;
    msg.focus({ preventScroll: false });
  }

  /* ---------- Formulario ---------- */
  var shownErrors = {}; // id del campo -> clave del error, para retraducir al cambiar de idioma
  // cada campo vacío dice qué falta, en vez de un «completa este campo» igual para todos
  var REQ_KEY = { 'f-email': 'err.emailReq', 'f-country': 'err.countryReq', 'f-dates': 'err.datesReq' };

  function showError(input, key) {
    var errId = input.id === 'f-consent' ? 'e-consent' : 'e-' + input.id.replace('f-', '');
    var p = document.getElementById(errId);
    input.setAttribute('aria-invalid', key ? 'true' : 'false');
    if (!p) return;
    if (key) { p.textContent = t(key); p.hidden = false; shownErrors[input.id] = key; }
    else { p.textContent = ''; p.hidden = true; delete shownErrors[input.id]; }
  }
  function refreshErrors() {
    Object.keys(shownErrors).forEach(function (id) { var el = document.getElementById(id); if (el) showError(el, shownErrors[id]); });
    var srv = document.getElementById('e-server');
    if (srv && !srv.hidden) srv.textContent = t('err.server');
  }

  function validateField(input) {
    if (input.disabled) { showError(input, null); return true; }
    if (input.type === 'text' || input.type === 'email') input.value = input.value.replace(/^\s+/, '');
    var v = input.validity;
    var key = null;
    if (input.id === 'f-consent') key = input.checked ? null : 'err.consent';
    else if (v.valueMissing || (input.type !== 'checkbox' && !input.value.trim())) key = REQ_KEY[input.id] || 'err.required';
    else if (input.type === 'email' && (v.typeMismatch || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim()))) key = 'err.email';
    showError(input, key);
    return !key;
  }

  function setBusy(btn, busy) {
    btn.disabled = busy;
    btn.setAttribute('aria-busy', busy ? 'true' : 'false');
  }

  function onSubmit(e) {
    e.preventDefault();
    var form = e.currentTarget;
    var btn = document.getElementById('f-submit');
    if (btn.disabled) return;
    var srv = document.getElementById('e-server');
    srv.hidden = true;

    var fields = ['f-email', 'f-country', 'f-dates', 'f-consent'].map(function (id) { return document.getElementById(id); });
    var firstBad = null;
    fields.forEach(function (f) { if (!validateField(f) && !firstBad) firstBad = f; });
    if (firstBad) { firstBad.focus(); return; }

    var unsure = document.getElementById('f-unsure').checked;
    var cities = Array.prototype.map.call(form.querySelectorAll('input[name="cities"]:checked'), function (c) { return c.value; });
    var row = {
      email: document.getElementById('f-email').value.trim().slice(0, 254),
      country: document.getElementById('f-country').value || null,
      travel_dates: unsure ? 'not_sure' : clip(document.getElementById('f-dates').value, 80),
      cities: cities.length ? cities : null,
      concierge_opt_in: document.getElementById('f-concierge').checked,
      reserved_plan: reservedPlan,
      variant: variant,
      lang: lang,
      consent: true,
      utm_source: clip(params.get('utm_source'), 80),
      utm_campaign: clip(params.get('utm_campaign'), 80)
    };

    setBusy(btn, true);
    insert('waitlist', row).then(function (res) {
      if (res.status === 201 || res.ok) return 'ok';
      if (res.status === 409) return 'dup'; // 23505: el correo ya está; se trata como éxito
      return res.json().then(function (j) { return j && j.code === '23505' ? 'dup' : 'error'; }, function () { return 'error'; });
    }).then(function (result) {
      if (result === 'error') throw new Error('server');
      lsSet(STORE.joined, '1');
      if (result === 'ok') track('waitlist_signup', reservedPlan);
      form.hidden = true;
      joinedNow = true;
      renderJoinHead();
      var ok = document.getElementById('form-success');
      ok.hidden = false;
      ok.focus();
      var more = document.querySelector('.reserve-more');
      if (more) more.hidden = true;
    }).catch(function () {
      srv.textContent = t('err.server');
      srv.hidden = false;
      setBusy(btn, false);
      srv.focus(); // el botón estuvo deshabilitado: sin esto el foco cae en <body>
    });
  }

  function init() {
    applyI18n();
    track_view();

    var langBtns = document.querySelectorAll('[data-lang]');
    for (var i = 0; i < langBtns.length; i++) {
      langBtns[i].addEventListener('click', function (e) { setLang(e.currentTarget.getAttribute('data-lang')); });
    }

    var hero = document.getElementById('hero-cta');
    var scrollers = document.querySelectorAll('[data-scroll-form]');
    for (var s = 0; s < scrollers.length; s++) {
      scrollers[s].addEventListener('click', function (e) {
        e.preventDefault();
        if (e.currentTarget === hero) track('hero_cta_click');
        scrollToForm(true);
      });
    }

    var faqLinks = document.querySelectorAll('[data-open-faq], a[href="#faq-data"]');
    for (var f = 0; f < faqLinks.length; f++) {
      faqLinks[f].addEventListener('click', function () { var d = document.getElementById('faq-data'); if (d) d.open = true; });
    }

    var reserves = document.querySelectorAll('.reserve');
    for (var r = 0; r < reserves.length; r++) reserves[r].addEventListener('click', onReserve);

    var chipX = document.getElementById('plan-chip-x');
    if (chipX) chipX.addEventListener('click', function () {
      reservedPlan = null;
      try { sessionStorage.removeItem(STORE.plan); } catch (e) { /* noop */ }
      renderPlanChip();
      document.getElementById('f-email').focus();
    });

    var unsure = document.getElementById('f-unsure');
    var dates = document.getElementById('f-dates');
    unsure.addEventListener('change', function () {
      dates.disabled = unsure.checked;
      dates.required = !unsure.checked;
      if (unsure.checked) showError(dates, null);
    });

    var form = document.getElementById('waitlist-form');
    form.addEventListener('submit', onSubmit);
    ['f-email', 'f-country', 'f-dates', 'f-consent'].forEach(function (id) {
      var el = document.getElementById(id);
      // Valida al salir del campo solo si ya tenía error o contenido; corrige en vivo cuando ya hay error.
      // Si el foco va al botón de enviar, no se valida aquí: el error movería el botón entre mousedown y mouseup
      // y se perdería el clic. El envío valida todo igualmente.
      el.addEventListener('blur', function (e) {
        if (e.relatedTarget && e.relatedTarget.id === 'f-submit') return;
        if (el.type !== 'checkbox' && (el.value || shownErrors[id])) validateField(el);
      });
      el.addEventListener(el.type === 'checkbox' || el.tagName === 'SELECT' ? 'change' : 'input', function () { if (shownErrors[id]) validateField(el); });
    });

    if (lsGet(STORE.joined) === '1') {
      var more = document.querySelector('.reserve-more');
      if (more) more.hidden = true;
    }
  }

  function track_view() {
    if (isForced) return;
    var key = 'lt_viewed_' + variant;
    if (ssGet(key) === '1') return; // una vez por sesión (pestaña)
    ssSet(key, '1');
    track('variant_view');
  }

  // Expuesto solo para pruebas automáticas (sin datos personales).
  window.__lumenLanding = { variant: function () { return variant; }, lang: function () { return lang; }, session: function () { return sessionId; }, t: function (k) { return t(k); } };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
