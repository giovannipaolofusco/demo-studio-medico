import { cp, rm, mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const DIST = 'dist';
await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });

const pagine = [
  'index.html', 'lo-studio/index.html', 'servizi/index.html', 'orari-e-prenotazioni/index.html',
  'contatti/index.html', 'privacy/index.html', 'en/index.html', 'en/the-practice/index.html',
  'en/services/index.html', 'en/hours-and-booking/index.html', 'en/contact/index.html',
  'en/privacy/index.html', '404.html',
];
const servizio = ['_headers', '_redirects', 'robots.txt', 'sitemap.xml', 'site.webmanifest', 'favicon.ico'];
const cartelle = ['assets', '.well-known', 'admin'];

const mancanti = [];
for (const f of [...pagine, ...servizio, ...cartelle]) {
  if (!existsSync(f)) { mancanti.push(f); continue; }
  await cp(f, `${DIST}/${f}`, { recursive: true });
}
if (mancanti.length) {
  console.error(`copia: mancano ${mancanti.join(', ')}`);
  process.exit(1);
}

const intestazioni = await readFile(`${DIST}/_headers`, 'utf8');
await writeFile(`${DIST}/_headers`, intestazioni.replace('/*\n', '/*\n  X-Robots-Tag: noindex, nofollow\n'));
console.log('copia: fatto (X-Robots-Tag aggiunto a dist/_headers)');
