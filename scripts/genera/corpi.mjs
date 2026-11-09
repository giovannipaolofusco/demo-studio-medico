import { TESTI, ORARI, AVVISI } from './dati.mjs';
import { S, tel, esc, ico, icoDisegno, percorso, NUMERO, orariBrevi, briciole } from './guscio.mjs';

const C = (lang) => TESTI.comune[lang];
const P = (chiave, lang) => TESTI.pagine[chiave][lang];

const cta = (lang) => `<a class="pulsante" href="tel:${S.telefono_href}">${ico('telefono')}${esc(C(lang).cta)}</a>`;

function testaPagina(lang, p) {
  return `  <header class="testa-pagina" id="hero">
    ${briciole(lang, p.h1)}
    <h1>${esc(p.h1)}</h1>
    ${p.lead ? `<p>${esc(p.lead)}</p>` : ''}
  </header>`;
}

function avvisi(lang) {
  const visibili = AVVISI.voci.filter((v) => v.visibile);
  if (!visibili.length) return `<p class="vuoto">${esc(C(lang).nessun_avviso)}</p>`;
  const voci = visibili.map((v) => {
    const tradotto = lang === 'it' || (v.titolo.en?.trim() && v.testo.en?.trim());
    const usa = tradotto ? lang : 'it';
    const attr = usa !== lang ? ' lang="it"' : '';
    const nota = tradotto ? '' : `<p class="lingua-orig">${esc(C(lang).non_tradotto)}</p>`;
    return `      <li>
        ${ico('megafono')}
        <div${attr}><h3>${esc(v.titolo[usa])}</h3><p>${esc(v.testo[usa])}</p>${nota}</div>
      </li>`;
  });
  return `<ul class="bacheca__voci">
${voci.join('\n')}
    </ul>`;
}

function giorniCaselle(lang) {
  return ORARI.giorni.map((g) => {
    const chiuso = !g.turni.length;
    const righe = chiuso
      ? `<span>${esc(C(lang).chiuso)}</span>`
      : g.turni.map((t) => `<span>${t.apre.replace(/^0/, '')}–${t.chiude.replace(/^0/, '')}</span>`).join('');
    return `      <li data-giorno="${NUMERO[g.giorno]}"${chiuso ? ' class="giorni__chiuso"' : ''}><strong>${esc(g.nome[lang])}</strong>${righe}</li>`;
  }).join('\n');
}

function tabellaOrari(lang) {
  const righe = ORARI.giorni.map((g) => {
    const valore = g.turni.length
      ? g.turni.map((t) => `<span class="turno">${t.apre.replace(/^0/, '')}–${t.chiude.replace(/^0/, '')}</span>`).join(` ${esc(C(lang).e)} `)
      : esc(C(lang).chiuso);
    return `        <tr data-giorno="${NUMERO[g.giorno]}"><th scope="row">${esc(g.nome[lang])}</th><td>${valore}</td></tr>`;
  });
  return `<div class="tabella-scorre"><table class="tabella-orari">
      <tbody>
${righe.join('\n')}
      </tbody>
    </table></div>`;
}

export function home(lang) {
  const p = P('home', lang);
  const schede = TESTI.specialita.map((s, i) => `      <li class="scheda" style="--n:${i}">
        ${icoDisegno(s.icona)}
        <h3>${esc(s.nome[lang])}</h3>
        <p>${esc(s.breve[lang])}</p>
      </li>`).join('\n');
  return `  <header class="intro" id="hero">
    <h1><span class="intro__riga">${esc(S.nome)}</span></h1>
    <svg class="ecg" viewBox="0 0 640 64" aria-hidden="true" focusable="false">
      <path class="ecg__traccia" pathLength="1" d="M0 40H220L238 33L254 40H286L294 47L306 6L318 58L326 40H356L378 29L402 40H624"/>
      <circle class="ecg__punto" cx="630" cy="40" r="4"/>
    </svg>
    <p>${esc(p.sottotitolo)}</p>
    ${cta(lang)}
  </header>

  <section class="fascia-orari" id="orari" aria-labelledby="t-orari">
    <h2 id="t-orari">${esc(p.orari)}</h2>
    <ul class="giorni">
${giorniCaselle(lang)}
    </ul>
  </section>

  <section class="bacheca" id="avvisi" aria-labelledby="t-avvisi">
    <h2 id="t-avvisi">${esc(p.avvisi)}</h2>
    ${avvisi(lang)}
  </section>

  <section class="elenco-specialita" id="specialita" aria-labelledby="t-specialita">
    <h2 id="t-specialita">${esc(p.specialita)}</h2>
    <ul class="schede">
${schede}
    </ul>
  </section>

  <section class="dichiarazione" id="studio" aria-labelledby="t-studio">
    <h2 class="dichiarazione__frase" id="t-studio">${esc(p.frase)}</h2>
    <p>${esc(p.studio)}</p>
    <p><a href="${percorso(lang, 'studio')}">${esc(p.studio_link)}</a></p>
  </section>`;
}

export function studio(lang) {
  const p = P('studio', lang);
  const blocchi = p.blocchi.map((b) => `    <section class="blocco">
      <h2>${esc(b.h2)}</h2>
${b.p.map((x) => `      <p>${esc(x)}</p>`).join('\n')}
    </section>`).join('\n');
  return `${testaPagina(lang, p)}
  <div class="corpo corpo--servizi">
${blocchi}
    <div class="blocco">${cta(lang)}</div>
    <aside class="riquadro" aria-labelledby="t-finto">
      <h2 id="t-finto">${esc(p.riquadro_h2)}</h2>
      <p>${esc(p.riquadro)}</p>
    </aside>
  </div>`;
}

export function servizi(lang) {
  const p = P('servizi', lang);
  const blocchi = TESTI.specialita.map((s, i) => `    <section class="blocco specialita-riga scheda" style="--n:${i}" id="${s.chiave}" aria-labelledby="t-${s.chiave}">
      <div class="specialita-riga__testa">
        ${icoDisegno(s.icona)}
        <h2 id="t-${s.chiave}">${esc(s.nome[lang])}</h2>
      </div>
      <div>
        <p>${esc(s.per_chi[lang])}</p>
        <h3>${esc(p.comprende)}</h3>
        <ul class="puntato">
${s.voci[lang].map((v) => `          <li>${esc(v)}</li>`).join('\n')}
        </ul>
      </div>
    </section>`).join('\n');
  return `${testaPagina(lang, p)}
  <div class="corpo corpo--servizi">
${blocchi}
    <div class="blocco">${cta(lang)}
      <p class="emergenza">${C(lang).emergenza}</p>
    </div>
  </div>`;
}

export function orari(lang) {
  const p = P('orari', lang);
  return `${testaPagina(lang, p)}
  <div class="corpo">
    <section class="blocco" aria-labelledby="t-tab">
      <h2 id="t-tab">${esc(p.orari_h2)}</h2>
      ${tabellaOrari(lang)}
    </section>
    <section class="blocco" aria-labelledby="t-come">
      <h2 id="t-come">${esc(p.come_h2)}</h2>
      <ul class="puntato">
${p.come.map((v) => `        <li>${esc(v)}</li>`).join('\n')}
      </ul>
      ${cta(lang)}
    </section>
    <section class="blocco" aria-labelledby="t-disdire">
      <h2 id="t-disdire">${esc(p.disdire_h2)}</h2>
      <p>${esc(p.disdire)}</p>
    </section>
    <section class="blocco bacheca--interna" aria-labelledby="t-avvisi">
      <h2 id="t-avvisi">${esc(p.avvisi_h2)}</h2>
      ${avvisi(lang)}
    </section>
  </div>`;
}

export function contatti(lang) {
  const p = P('contatti', lang);
  return `${testaPagina(lang, p)}
  <div class="corpo">
    <dl class="recapiti">
      <div class="recapito">${ico('telefono')}<dt>${esc(p.telefono)}</dt><dd><a href="tel:${S.telefono_href}">${esc(tel(lang))}</a><br>${esc(p.telefono_nota)}</dd></div>
      <div class="recapito">${ico('posta')}<dt>${esc(p.email)}</dt><dd><a href="mailto:${S.email}">${esc(S.email)}</a><br>${esc(p.email_nota)}</dd></div>
      <div class="recapito">${ico('luogo')}<dt>${esc(p.indirizzo)}</dt><dd>${esc(S.via)}, ${S.cap} ${esc(S.citta)} (${S.provincia})</dd></div>
      <div class="recapito">${ico('orologio')}<dt>${esc(p.orari)}</dt><dd>${orariBrevi(lang).join('<br>')}</dd></div>
    </dl>
    <div class="blocco">${cta(lang)}
      <p class="emergenza">${C(lang).emergenza}</p>
    </div>
  </div>`;
}

const PRIVACY = {
  it: `<div class="legale">
      <aside class="riquadro" aria-labelledby="t-reale">
        <h2 id="t-reale">Chi è davvero il titolare dei dati di questo sito</h2>
        <p>Studio Medico Esempio non esiste: questo è un sito dimostrativo. L'informativa descrive il trattamento reale dei dati di navigazione del sito, il cui titolare è chi lo ha realizzato e lo pubblica: Giovanni Paolo Fusco, <a href="mailto:giovanni@giovannipaolofusco.it">giovanni@giovannipaolofusco.it</a>.</p>
      </aside>

      <h2>1. Titolare del trattamento</h2>
      <p>Giovanni Paolo Fusco, contattabile all'indirizzo <a href="mailto:giovanni@giovannipaolofusco.it">giovanni@giovannipaolofusco.it</a>. Non è stato designato un responsabile della protezione dei dati (DPO).</p>

      <h2>2. Quali dati vengono trattati</h2>
      <p>Il sito non ha moduli, non chiede di registrarsi e non usa cookie. Gli unici dati personali trattati sono i <strong>dati di navigazione</strong>: indirizzo IP, data e ora della richiesta, pagina richiesta e tipo di browser. Li registra in automatico il fornitore di hosting, come accade per qualunque sito web.</p>

      <h2>3. Finalità e base giuridica</h2>
      <p>I dati di navigazione servono a mostrare le pagine richieste e a proteggere il sito da abusi e attacchi informatici. La base giuridica è il legittimo interesse del titolare al funzionamento e alla sicurezza del sito (art. 6, par. 1, lett. f) del Regolamento (UE) 2016/679, di seguito «Regolamento»).</p>

      <h2>4. Destinatari</h2>
      <p>I dati sono trattati da <strong>Cloudflare, Inc.</strong>, che ospita il sito, in qualità di responsabile del trattamento, sulla base del proprio accordo sul trattamento dei dati. Non vengono comunicati ad altri soggetti né diffusi.</p>

      <h2>5. Trasferimento fuori dall'Unione europea</h2>
      <p>Cloudflare ha sede negli Stati Uniti. Il trasferimento si basa sull'adesione di Cloudflare all'EU-U.S. Data Privacy Framework (decisione di adeguatezza (UE) 2023/1795, art. 45 del Regolamento) e sulle clausole contrattuali tipo adottate dalla Commissione europea (decisione di esecuzione (UE) 2021/914), incluse nel suo accordo sul trattamento dei dati.</p>

      <h2>6. Per quanto tempo</h2>
      <p>I dati di navigazione restano nei registri tecnici del fornitore di hosting per il tempo necessario alla sicurezza del servizio, secondo le sue politiche. Il titolare non ne conserva copie.</p>

      <h2>7. Cookie e memoria del browser</h2>
      <p>Il sito non usa cookie. Usa la memoria di sessione del browser (<code>sessionStorage</code>) solo per ricordare che l'animazione di apertura è già stata mostrata: è un'informazione tecnica, non identifica nessuno e si cancella chiudendo la scheda. Per questo non serve alcun banner di consenso.</p>

      <h2>8. È obbligatorio fornire i dati?</h2>
      <p>I dati di navigazione sono necessari per visitare il sito. Non viene chiesto nessun altro dato.</p>

      <h2>9. I vostri diritti</h2>
      <p>Potete chiedere al titolare l'accesso ai vostri dati, la rettifica, la cancellazione, e la limitazione del trattamento, e potete opporvi al trattamento (artt. 15–22 del Regolamento), scrivendo a <a href="mailto:giovanni@giovannipaolofusco.it">giovanni@giovannipaolofusco.it</a>. Nessun trattamento di questo sito si basa sul consenso, quindi non c'è un consenso da revocare. Avete inoltre il diritto di proporre reclamo a un'autorità di controllo (art. 77 del Regolamento), in particolare nello Stato membro in cui risiedete abitualmente, lavorate o in cui si è verificata la presunta violazione. In Italia l'autorità è il Garante per la protezione dei dati personali: le modalità per presentare reclamo sono sul sito <a href="https://www.garanteprivacy.it" rel="noopener noreferrer">garanteprivacy.it</a>.</p>

      <h2>10. Area di redazione</h2>
      <p>L'area <code>/admin/</code> serve solo al titolare per aggiornare orari e avvisi, con accesso tramite account GitHub. Non è destinata ai visitatori e non raccoglie dati dei visitatori.</p>

      <p class="aggiornamento">Ultimo aggiornamento: 09/11/2026</p>
    </div>`,
  en: `<div class="legale">
      <aside class="riquadro" aria-labelledby="t-reale">
        <h2 id="t-reale">Who is actually responsible for the data on this website</h2>
        <p>Studio Medico Esempio does not exist: this is a demo website. This notice describes the actual processing of browsing data on this website. The controller is the person who built and publishes the website: Giovanni Paolo Fusco, <a href="mailto:giovanni@giovannipaolofusco.it">giovanni@giovannipaolofusco.it</a>.</p>
      </aside>

      <h2>1. Controller</h2>
      <p>Giovanni Paolo Fusco, who can be contacted at <a href="mailto:giovanni@giovannipaolofusco.it">giovanni@giovannipaolofusco.it</a>. No data protection officer (DPO) has been appointed.</p>

      <h2>2. What data is processed</h2>
      <p>The website has no forms, does not ask you to register and does not use cookies. The only personal data processed is <strong>browsing data</strong>: IP address, date and time of the request, the page requested and the browser type. It is recorded automatically by the hosting provider, as is the case for any website.</p>

      <h2>3. Purposes and legal basis</h2>
      <p>Browsing data is used to serve the pages you request and to protect the website from abuse and cyberattacks. The legal basis is the controller's legitimate interest in the operation and security of the website (Article 6(1)(f) of Regulation (EU) 2016/679, the “Regulation”).</p>

      <h2>4. Recipients</h2>
      <p>The data is processed by <strong>Cloudflare, Inc.</strong>, which hosts the website, as a data processor under its data processing agreement. It is not disclosed to anyone else or made public.</p>

      <h2>5. Transfers outside the European Union</h2>
      <p>Cloudflare is based in the United States. The transfer relies on Cloudflare's participation in the EU-U.S. Data Privacy Framework (Commission Implementing Decision (EU) 2023/1795, Article 45 of the Regulation) and on the standard contractual clauses adopted by the European Commission (Commission Implementing Decision (EU) 2021/914), which are part of its data processing agreement.</p>

      <h2>6. How long data is kept</h2>
      <p>Browsing data stays in the hosting provider's technical logs for as long as needed to keep the service secure, under the provider's own policies. The controller does not keep copies.</p>

      <h2>7. Cookies and browser storage</h2>
      <p>The website does not use cookies. It uses the browser's session storage (<code>sessionStorage</code>) only to remember that the opening animation has already been shown: this is technical information, it does not identify anyone and it is deleted when you close the tab. For this reason no consent banner is needed.</p>

      <h2>8. Do you have to provide your data?</h2>
      <p>Browsing data is needed to visit the website. No other data is requested.</p>

      <h2>9. Your rights</h2>
      <p>You can ask the controller for access to your data, rectification, erasure and restriction of processing, and you can object to the processing (Articles 15–22 of the Regulation), by writing to <a href="mailto:giovanni@giovannipaolofusco.it">giovanni@giovannipaolofusco.it</a>. None of the processing on this website is based on consent, so there is no consent to withdraw. You also have the right to lodge a complaint with a supervisory authority (Article 77 of the Regulation), in particular in the Member State of your habitual residence, place of work or place of the alleged infringement. In Italy, the supervisory authority is the <span lang="it">Garante per la protezione dei dati personali</span>; see <a href="https://www.garanteprivacy.it" rel="noopener noreferrer">garanteprivacy.it</a> for how to lodge a complaint.</p>

      <h2>10. Editing area</h2>
      <p>The <code>/admin/</code> area is used only by the controller to update opening hours and notices, with access through a GitHub account. It is not intended for visitors and collects no visitor data.</p>

      <p class="aggiornamento">Last updated: 9 November 2026</p>
    </div>`,
};

const ID_PRIVACY = ['titolare', 'dati', 'finalita', 'destinatari', 'trasferimenti', 'conservazione', 'cookie', 'conferimento', 'diritti', 'redazione'];

export function privacy(lang) {
  const p = P('privacy', lang);
  const voci = [];
  let i = 0;
  const testo = PRIVACY[lang].replace(/<h2>(.*?)<\/h2>/g, (m, titolo) => {
    const id = ID_PRIVACY[i++];
    voci.push(`          <li><a href="#${id}">${titolo}</a></li>`);
    return `<h2 id="${id}">${titolo}</h2>`;
  });
  const indice = `<nav class="indice-pagina" aria-labelledby="titolo-indice">
        <h2 id="titolo-indice">${lang === 'it' ? 'Indice' : 'Contents'}</h2>
        <details>
          <summary>${lang === 'it' ? 'Indice' : 'Contents'}</summary>
          <ol>
${voci.join('\n')}
          </ol>
        </details>
      </nav>`;
  return `${testaPagina(lang, p)}
  <div class="corpo">
    ${testo.replace('<h2 id="titolare">', `${indice}\n\n      <h2 id="titolare">`)}
  </div>`;
}
