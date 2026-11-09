import { TESTI, ORARI } from './dati.mjs';

export const S = TESTI.sito;
export const tel = (lang) => (lang === 'en' ? S.telefono_ld : S.telefono);
export const DOM = S.dominio;
const OG = `${DOM}/assets/img/og-studio-medico-esempio.jpg`;

export const esc = (v) => String(v ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export const SLUG = {
  home: { it: '', en: '' },
  studio: { it: 'lo-studio', en: 'the-practice' },
  servizi: { it: 'servizi', en: 'services' },
  orari: { it: 'orari-e-prenotazioni', en: 'hours-and-booking' },
  contatti: { it: 'contatti', en: 'contact' },
  privacy: { it: 'privacy', en: 'privacy' },
};
const MENU = ['home', 'studio', 'servizi', 'orari', 'contatti'];

export function percorso(lang, chiave) {
  const s = SLUG[chiave][lang];
  return (lang === 'en' ? '/en/' : '/') + (s ? `${s}/` : '');
}
export const assoluto = (lang, chiave) => DOM + percorso(lang, chiave);
export const file = (lang, chiave) => percorso(lang, chiave).slice(1) + 'index.html';

export const ICONE = {
  telefono: '<path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/>',
  megafono: '<path d="M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/><path d="M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14"/><path d="M8 6v8"/>',
  linee: '<path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/>',
  chiudi: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  posta: '<path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/>',
  luogo: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  orologio: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  stetoscopio: '<path d="M11 2v2"/><path d="M5 2v2"/><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"/><path d="M8 15a6 6 0 0 0 12 0v-3"/><circle cx="20" cy="10" r="2"/>',
  bambino: '<path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M15 12h.01"/><path d="M19.38 6.813A9 9 0 0 1 20.8 10.2a2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"/><path d="M9 12h.01"/>',
  cuore: '<path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/><path d="M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>',
};
export const ico = (nome, cls = 'ico') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONE[nome]}</svg>`;
export const icoDisegno = (nome) => `<svg class="scheda__ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONE[nome].replace(/<(path|circle|rect)/g, '<$1 pathLength="1"')}</svg>`;

export const ora = (h) => h.replace(/^0/, '');
export const turni = (g, lang) => g.turni.map((t) => `${ora(t.apre)}–${ora(t.chiude)}`).join(` ${TESTI.comune[lang].e} `);
export const NUMERO = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };

export function orariBrevi(lang) {
  const C = TESTI.comune[lang];
  const gruppi = [];
  for (const g of ORARI.giorni) {
    const chiave = JSON.stringify(g.turni);
    const ultimo = gruppi[gruppi.length - 1];
    if (ultimo && ultimo.chiave === chiave) ultimo.fine = g; else gruppi.push({ chiave, inizio: g, fine: g });
  }
  return gruppi.map((x) => {
    const da = x.inizio.nome[lang].slice(0, 3);
    const nomi = x.inizio === x.fine ? da : `${da}–${x.fine.nome[lang].slice(0, 3)}`;
    return `${esc(nomi)} ${x.inizio.turni.length ? esc(turni(x.inizio, lang)) : C.chiuso.toLowerCase()}`;
  });
}

export function jsonLdClinica(lang) {
  const orari = [];
  for (const g of ORARI.giorni) for (const t of g.turni) {
    orari.push({ '@type': 'OpeningHoursSpecification', dayOfWeek: g.giorno, opens: t.apre, closes: t.chiude });
  }
  const dati = {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: S.nome,
    url: assoluto(lang, 'home'),
    telephone: S.telefono_ld,
    email: S.email,
    image: OG,
    address: { '@type': 'PostalAddress', streetAddress: S.via, postalCode: S.cap, addressLocality: S.citta, addressRegion: S.provincia, addressCountry: 'IT' },
    medicalSpecialty: ['PrimaryCare', 'Pediatric', 'Cardiovascular'],
    openingHoursSpecification: orari,
  };
  return `<script type="application/ld+json">${JSON.stringify(dati).replace(/</g, '\\u003c')}</script>`;
}

export function jsonLdBriciole(lang, chiave, nome) {
  const dati = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: TESTI.comune[lang].home, item: assoluto(lang, 'home') },
      { '@type': 'ListItem', position: 2, name: nome, item: assoluto(lang, chiave) },
    ],
  };
  return `<script type="application/ld+json">${JSON.stringify(dati).replace(/</g, '\\u003c')}</script>`;
}

function testa(lang, chiave, title, description, ld) {
  const altra = lang === 'it' ? 'en' : 'it';
  const alt = `${TESTI.sito.nome}, ${lang === 'it' ? 'poliambulatorio a Fondi' : 'medical practice in Fondi'}`;
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="noindex, nofollow">
<link rel="canonical" href="${assoluto(lang, chiave)}">
<link rel="alternate" hreflang="${lang}" href="${assoluto(lang, chiave)}">
<link rel="alternate" hreflang="${altra}" href="${assoluto(altra, chiave)}">
<link rel="alternate" hreflang="x-default" href="${assoluto('it', chiave)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(S.nome)}">
<meta property="og:locale" content="${lang === 'it' ? 'it_IT' : 'en_GB'}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${assoluto(lang, chiave)}">
<meta property="og:image" content="${OG}">
<meta property="og:image:secure_url" content="${OG}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(alt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${OG}">
<meta name="twitter:image:alt" content="${esc(alt)}">
<meta name="theme-color" content="#5f2852">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" type="image/svg+xml" href="/assets/favicon/icon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon/favicon-16x16.png">
<link rel="apple-touch-icon" href="/assets/favicon/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/assets/fonts/source-serif-4-latin-600-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/public-sans-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<script src="/assets/js/apertura.js"></script>
<link rel="stylesheet" href="/assets/css/style.css">
${ld}`;
}

function testata(lang, chiave) {
  const C = TESTI.comune[lang];
  const voci = MENU.map((k) => {
    const nome = esc(TESTI.pagine[k][lang].menu);
    return k === chiave
      ? `    <li><a href="${percorso(lang, k)}" aria-current="page">${nome}</a></li>`
      : `    <li><a href="${percorso(lang, k)}">${nome}</a></li>`;
  });
  const altra = lang === 'it' ? 'en' : 'it';
  voci.push(`    <li><a href="${percorso(altra, chiave)}" hreflang="${altra}" lang="${altra}">${esc(C.altra_lingua_breve)}<span class="testata__lingua"> ${esc(C.altra_lingua)}</span></a></li>`);
  return `<a class="vai" href="#contenuto">${esc(C.salta)}</a>
<p class="nota-demo" role="note">${esc(C.demo)}</p>
<div class="sentinella" aria-hidden="true"></div>
<nav class="testata" aria-label="${esc(C.nav_principale)}">
  <a class="testata__marchio" href="${percorso(lang, 'home')}">${esc(S.nome)}</a>
  <div class="testata__azioni">
    <a class="testata__tel" href="tel:${S.telefono_href}" aria-label="${esc(C.chiama_aria)} ${esc(tel(lang))}">${ico('telefono')}<span>${esc(tel(lang))}</span></a>
    <button class="testata__menu" type="button" aria-expanded="false" aria-controls="voci" aria-label="${esc(C.menu_apri)}">
      ${ico('linee', 'ico ico--linee')}
      ${ico('chiudi', 'ico ico--x')}
    </button>
  </div>
  <ul class="testata__voci" id="voci" data-chiuso>
${voci.join('\n')}
  </ul>
</nav>`;
}

function piede(lang) {
  const C = TESTI.comune[lang];
  const fiscale = C.fiscale.replace('{piva}', S.piva).replace('{cf}', S.cf);
  return `<footer class="fondo-pagina" id="piede">
  <div>
    <h2>${esc(S.nome)}</h2>
    <p>${esc(C.forma)} ${esc(S.via)}, ${S.cap} ${esc(S.citta)} (${S.provincia}).</p>
    <p>${esc(fiscale)}</p>
    <p>${C.emergenza}</p>
  </div>
  <div>
    <h2>${esc(C.piede_recapiti)}</h2>
    <p><a href="tel:${S.telefono_href}">${esc(tel(lang))}</a></p>
    <p><a href="mailto:${S.email}">${esc(S.email)}</a></p>
    <h2 class="fondo-pagina__secondo">${esc(C.piede_orari)}</h2>
    <p class="fondo-pagina__orari">${orariBrevi(lang).join('<br>')}</p>
  </div>
  <div>
    <h2>${esc(C.piede_info)}</h2>
    <p><a href="${percorso(lang, 'privacy')}">${esc(C.privacy)}</a></p>
    <p>${esc(C.credito)} <a href="${S.credito_url}" rel="noopener">${esc(S.credito_firma)}</a></p>
  </div>
</footer>`;
}

export function briciole(lang, nome) {
  const C = TESTI.comune[lang];
  return `<nav class="briciole" aria-label="${esc(C.briciole)}">
      <ol>
        <li><a href="${percorso(lang, 'home')}">${esc(C.home)}</a></li>
        <li><span aria-current="page">${esc(nome)}</span></li>
      </ol>
    </nav>`;
}

export function pagina({ lang, chiave, title, description, ld = '', corpo, home = false }) {
  return `<!doctype html>
<html lang="${lang}"${home ? ' data-home' : ''}>
<head>
${testa(lang, chiave, title, description, ld)}
</head>
<body>
${testata(lang, chiave)}

<main id="contenuto">
${corpo}
</main>

${piede(lang)}

<script src="/assets/js/sito.js" defer></script>
</body>
</html>
`;
}
