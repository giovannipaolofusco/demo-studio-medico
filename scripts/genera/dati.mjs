import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const RADICE = process.argv[2] || '.';
const leggi = (nome) => JSON.parse(readFileSync(join(RADICE, 'contenuti', nome), 'utf8'));

export const TESTI = leggi('testi.json');
export const ORARI = leggi('orari.json');
export const AVVISI = leggi('avvisi.json');

const errori = [];
const ORA = /^([01]\d|2[0-3]):[0-5]\d$/;
const SETTIMANA = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const vuoto = (v) => typeof v !== 'string' || v.trim() === '';
const NOMI = {
  Monday: { it: 'Lunedì', en: 'Monday' }, Tuesday: { it: 'Martedì', en: 'Tuesday' },
  Wednesday: { it: 'Mercoledì', en: 'Wednesday' }, Thursday: { it: 'Giovedì', en: 'Thursday' },
  Friday: { it: 'Venerdì', en: 'Friday' }, Saturday: { it: 'Sabato', en: 'Saturday' }, Sunday: { it: 'Domenica', en: 'Sunday' },
};

if (!Array.isArray(ORARI.giorni) || ORARI.giorni.length !== 7) {
  errori.push('orari.json: servono esattamente 7 giorni');
} else {
  ORARI.giorni.forEach((g, i) => {
    if (g.giorno !== SETTIMANA[i]) errori.push(`orari.json: il giorno ${i + 1} deve essere ${SETTIMANA[i]}, trovato ${g.giorno}`);
    if (!Array.isArray(g.turni)) { errori.push(`orari.json: ${SETTIMANA[i]} senza elenco turni`); return; }
    g.turni.forEach((t, j) => {
      if (!ORA.test(t.apre || '') || !ORA.test(t.chiude || '')) {
        errori.push(`orari.json: ${NOMI[SETTIMANA[i]].it}, fascia ${j + 1}: gli orari vanno scritti come 09:00`);
      } else if (t.apre >= t.chiude) {
        errori.push(`orari.json: ${NOMI[SETTIMANA[i]].it}, fascia ${j + 1}: l'apertura (${t.apre}) deve venire prima della chiusura (${t.chiude})`);
      }
    });
  });
}

if (!Array.isArray(AVVISI.voci)) {
  errori.push('avvisi.json: manca l\'elenco «voci»');
} else {
  AVVISI.voci.forEach((v, i) => {
    if (typeof v.visibile !== 'boolean') errori.push(`avvisi.json: avviso ${i + 1} senza l'interruttore «visibile»`);
    if (vuoto(v.titolo?.it) || vuoto(v.testo?.it)) errori.push(`avvisi.json: avviso ${i + 1} senza titolo o testo in italiano`);
  });
}

if (errori.length) {
  console.error('genera: dati non validi, nessuna pagina scritta.');
  for (const e of errori) console.error('  - ' + e);
  process.exit(1);
}

for (const g of ORARI.giorni) g.nome = NOMI[g.giorno];
