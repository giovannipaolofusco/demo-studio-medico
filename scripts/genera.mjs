import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { execSync } from 'node:child_process';
import { TESTI } from './genera/dati.mjs';
import { S, DOM, esc, pagina, file, assoluto, jsonLdClinica, jsonLdBriciole, percorso, testata, piede } from './genera/guscio.mjs';
import * as corpi from './genera/corpi.mjs';

const DEST = process.argv[2] || '.';
const scrivi = (rel, testo) => {
  const p = join(DEST, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, testo);
};

const PAGINE = ['home', 'studio', 'servizi', 'orari', 'contatti', 'privacy'];
const CORPO = { home: corpi.home, studio: corpi.studio, servizi: corpi.servizi, orari: corpi.orari, contatti: corpi.contatti, privacy: corpi.privacy };
const CON_CLINICA = ['home', 'orari', 'contatti'];

let n = 0;
for (const lang of ['it', 'en']) {
  for (const chiave of PAGINE) {
    const p = TESTI.pagine[chiave][lang];
    let ld = CON_CLINICA.includes(chiave) ? jsonLdClinica(lang) : '';
    if (chiave !== 'home') ld += (ld ? '\n' : '') + jsonLdBriciole(lang, chiave, p.h1);
    scrivi(file(lang, chiave), pagina({
      lang, chiave, title: p.title, description: p.description, ld,
      corpo: CORPO[chiave](lang), home: chiave === 'home',
    }));
    n++;
  }
}

const E = TESTI.pagine.errore;
scrivi('404.html', `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(E.it.title)}</title>
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#5f2852">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" type="image/svg+xml" href="/assets/favicon/icon.svg">
<link rel="manifest" href="/site.webmanifest">
<script src="/assets/js/apertura.js"></script>
<link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>
${testata('it', null)}
<main id="contenuto" class="errore" tabindex="-1">
  <h1>${esc(E.it.h1)}</h1>
  <p>${esc(E.it.p)}</p>
  <p><a class="pulsante" href="/">${esc(E.it.home)}</a></p>
  <p><a href="tel:${S.telefono_href}">${esc(S.telefono)}</a> · <a href="mailto:${S.email}">${esc(S.email)}</a></p>
  <div class="errore__altra" lang="en">
    <h2>${esc(E.en.h1)}</h2>
    <p>${esc(E.en.p)}</p>
    <p><a href="${percorso('en', 'home')}">${esc(E.en.home)}</a></p>
  </div>
</main>
${piede('it')}
<script src="/assets/js/sito.js" defer></script>
</body>
</html>
`);

let lastmod;
try {
  lastmod = execSync('git log -1 --format=%cs -- contenuti scripts assets/css', { cwd: DEST, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
} catch { lastmod = ''; }
if (!lastmod) lastmod = new Date().toISOString().slice(0, 10);

const voci = [];
for (const lang of S.indicizzabile ? ['it', 'en'] : []) {
  for (const chiave of PAGINE) {
    voci.push(`  <url>
    <loc>${assoluto(lang, chiave)}</loc>
    <lastmod>${lastmod}</lastmod>
    <xhtml:link rel="alternate" hreflang="it" href="${assoluto('it', chiave)}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${assoluto('en', chiave)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${assoluto('it', chiave)}"/>
  </url>`);
  }
}
scrivi('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${voci.join('\n')}
</urlset>
`);

console.log(`genera: ${n} pagine, 404.html e sitemap.xml (${voci.length} URL${S.indicizzabile ? `, lastmod ${lastmod}` : ': sito non indicizzabile'}) da contenuti/ verso ${DOM}`);
