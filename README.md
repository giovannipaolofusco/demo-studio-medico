# Demo: sito per studio medico con pannello di modifica

**Italiano** · [English](#english)

Sito dimostrativo di un poliambulatorio inventato, lo *Studio Medico Esempio* di Fondi (LT): medicina generale, pediatria e cardiologia. Mostra come lavoro sui siti degli studi e dei professionisti: sito statico veloce, in italiano e inglese, con orari e avvisi che la segreteria aggiorna da sola da un pannello, senza database e senza canone mensile.

- **Sito:** https://demo-studio-medico.pages.dev
- **Dati:** tutti inventati. Indirizzo, telefono, email `example.invalid`, P.IVA a zeri. Nessun nome di medico, nessuna recensione, nessuna foto di persone.

## Cosa mostra

| Funzione | Come è fatta |
|---|---|
| Pagine | Home, Lo studio, Servizi e specialità, Orari e prenotazioni, Contatti, Privacy, in italiano e inglese |
| Orari e avvisi (chiusure, vaccinazioni) | File JSON in `contenuti/`, modificabili dal pannello |
| Pannello di modifica | [Decap CMS](https://decapcms.org) in `admin/`, accesso con GitHub tramite un Worker OAuth su Cloudflare |
| Generazione delle pagine | Script Node in `scripts/` che costruiscono l'HTML dai JSON |
| Ottimizzazione | HTML, CSS e JS minificati, immagini convertite con `sharp` |
| Hosting | Cloudflare Pages, deploy automatico a ogni salvataggio |
| Sicurezza | Content-Security-Policy e altri header in `_headers`, `security.txt` |

## Scelte per un sito sanitario

- **Nessun modulo che raccolga dati.** Le prenotazioni passano dal telefono, quindi il sito non tratta dati sanitari.
- **Nessun tracciamento.** Niente analytics né cookie di profilazione. Font e icone sono ospitati sul sito, senza chiamate a servizi esterni.
- **Fuori dai motori di ricerca.** Tutte le pagine hanno `noindex`, nel meta e nell'header `X-Robots-Tag`: la demo non deve comparire su Google al posto di uno studio vero. In ogni pagina c'è un banner che la dichiara sito dimostrativo.

## Come funziona per la segreteria

1. Entra nel pannello `/admin/` con il suo account.
2. Cambia un orario o aggiunge un avviso, in italiano e in inglese.
3. Salva: la modifica diventa un commit, Cloudflare Pages ricostruisce il sito da solo.

Ogni modifica resta nella storia di git, quindi si può sempre tornare indietro.

## Avvio in locale

```bash
npm install
npm run build
npx serve dist
```

Serve Node 22.

## Licenze di terze parti

Decap CMS (MIT, `admin/LICENSE`), icone Lucide (ISC, `assets/icons/LICENSE-lucide.txt`), font Public Sans e Source Serif 4 (SIL OFL, `assets/fonts/`).

## Autore

Giovanni Paolo Fusco, sviluppatore web a Fondi (LT). Sito: https://giovannipaolofusco.it

---

## English

Demo website for a fictional medical practice, *Studio Medico Esempio* in Fondi, Italy: general practice, paediatrics and cardiology. It shows how I build sites for practices and professionals: a fast static site in Italian and English, where the front desk updates opening hours and notices from an editing panel, with no database and no monthly fee.

- **Live site:** https://demo-studio-medico.pages.dev
- **Data:** all fictional. No doctors' names, no reviews, no photos of people.

**What it shows**

- Six pages in Italian and English. Opening hours and notices (closures, vaccinations) stored as JSON in `contenuti/`, edited through [Decap CMS](https://decapcms.org) in `admin/` with GitHub login via a Cloudflare OAuth Worker.
- Node scripts in `scripts/` generate the HTML; HTML, CSS and JS are minified and images optimized with `sharp`.
- Hosted on Cloudflare Pages with automatic deploys on every save. Security headers in `_headers`.

**Healthcare choices:** no forms, so no health data is collected (bookings go through the phone); no tracking, with fonts and icons self-hosted; every page is `noindex` (meta and `X-Robots-Tag`) and carries a banner stating it is a demo.

**Run locally:** `npm install && npm run build && npx serve dist` (Node 22).

**Author:** Giovanni Paolo Fusco, web developer in Fondi, Italy. https://giovannipaolofusco.it
