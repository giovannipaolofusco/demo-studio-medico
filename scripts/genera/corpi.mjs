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
  const schede = TESTI.specialita.map((s, i) => `      <li class="scheda${i ? ` scheda--n${i}` : ''}">
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
  const blocchi = TESTI.specialita.map((s, i) => `    <section class="blocco specialita-riga scheda${i ? ` scheda--n${i}` : ''}" id="${s.chiave}" aria-labelledby="t-${s.chiave}">
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
      <p>I dati sono trattati da <strong>Cloudflare, Inc.</strong>, che ospita il sito, in qualità di responsabile del trattamento, sulla base del proprio accordo sul trattamento dei dati. Cloudflare può affidare parti del servizio ad altri responsabili del trattamento (sub-responsabili), elencati su <a href="https://www.cloudflare.com/gdpr/subprocessors/" rel="noopener noreferrer">cloudflare.com/gdpr/subprocessors</a>. I dati non vengono comunicati ad altri soggetti né diffusi.</p>

      <h2>5. Trasferimento fuori dall'Unione europea</h2>
      <p>Cloudflare ha sede negli Stati Uniti. Il trasferimento si basa sull'adesione di Cloudflare all'EU-U.S. Data Privacy Framework (decisione di esecuzione (UE) 2023/1795, decisione di adeguatezza ai sensi dell'art. 45 del Regolamento) e sulle clausole contrattuali tipo adottate dalla Commissione europea (decisione di esecuzione (UE) 2021/914), incluse nel suo accordo sul trattamento dei dati. Alcuni sub-responsabili di Cloudflare si trovano anch'essi fuori dall'Unione europea. Copia delle clausole contrattuali tipo è disponibile nell'accordo sul trattamento dei dati di Cloudflare, <a href="https://www.cloudflare.com/cloudflare-customer-dpa/" rel="noopener noreferrer">cloudflare.com/cloudflare-customer-dpa</a>, oppure su richiesta al titolare.</p>

      <h2>6. Per quanto tempo</h2>
      <p>I dati di navigazione restano nei registri tecnici del fornitore di hosting per il tempo necessario alla sicurezza del servizio, secondo le sue politiche, descritte su <a href="https://www.cloudflare.com/privacypolicy/" rel="noopener noreferrer">cloudflare.com/privacypolicy</a>. Il titolare non ne conserva copie.</p>

      <h2>7. Cookie e memoria del browser</h2>
      <p>Il sito non usa cookie. Usa la memoria di sessione del browser (<code>sessionStorage</code>, voce <code>apertura-vista</code>) solo per ricordare che l'animazione di apertura è già stata mostrata: è una memorizzazione tecnica che serve al funzionamento del sito come è stato progettato, non contiene dati personali e si cancella chiudendo la scheda. Per questo non richiede consenso (art. 122, comma 1, del d.lgs. 196/2003) e non serve alcun banner.</p>

      <h2>8. È obbligatorio fornire i dati?</h2>
      <p>I dati di navigazione sono necessari per visitare il sito. Non viene chiesto nessun altro dato.</p>

      <h2>9. I vostri diritti</h2>
      <p>Potete chiedere al titolare l'accesso ai vostri dati, la rettifica, la cancellazione e la limitazione del trattamento (artt. 15–18 del Regolamento), scrivendo a <a href="mailto:giovanni@giovannipaolofusco.it">giovanni@giovannipaolofusco.it</a>. Poiché il titolare non conserva i dati di navigazione, le richieste che riguardano i registri del fornitore saranno gestite tramite Cloudflare.</p>
      <p><strong>Diritto di opposizione.</strong> Potete opporvi in qualsiasi momento, per motivi connessi alla vostra situazione particolare, al trattamento basato sul legittimo interesse (art. 21 del Regolamento).</p>
      <p>Nessun trattamento di questo sito si basa sul consenso, quindi non c'è un consenso da revocare.</p>

      <h2>10. Processi decisionali automatizzati</h2>
      <p>Non è previsto alcun processo decisionale automatizzato, compresa la profilazione, di cui all'art. 22, paragrafi 1 e 4, del Regolamento.</p>

      <h2>11. Reclamo</h2>
      <p>Avete il diritto di proporre reclamo a un'autorità di controllo (art. 77 del Regolamento), in particolare nello Stato membro in cui risiedete abitualmente, lavorate o in cui si è verificata la presunta violazione. In Italia l'autorità è il Garante per la protezione dei dati personali: le modalità per presentare reclamo sono sul sito <a href="https://www.garanteprivacy.it" rel="noopener noreferrer">garanteprivacy.it</a>.</p>

      <h2>12. Minori</h2>
      <p>Nessun trattamento di questo sito si basa sul consenso, quindi non si applicano le regole sul consenso dei minori (art. 8 del Regolamento e art. 2-quinquies del d.lgs. 196/2003). I soli dati trattati sono quelli di navigazione, uguali per ogni visitatore. Un genitore o chi esercita la responsabilità genitoriale può esercitare i diritti della sezione 9 per conto del minore, scrivendo a <a href="mailto:giovanni@giovannipaolofusco.it">giovanni@giovannipaolofusco.it</a>.</p>

      <h2>13. Modifiche all'informativa e nuove finalità</h2>
      <p>Se l'informativa cambia, la versione aggiornata viene pubblicata su questa pagina con la nuova data di aggiornamento. Prima di usare i dati di navigazione per una finalità diversa da quelle descritte qui, il titolare indicherà la nuova finalità, con ogni altra informazione pertinente, in questa pagina e con un avviso sul sito.</p>

      <h2>14. Area di redazione</h2>
      <p>L'area <code>/admin/</code> serve solo al titolare per aggiornare orari e avvisi, con accesso tramite account GitHub. Non è destinata ai visitatori e non raccoglie dati dei visitatori.</p>

      <h2>15. Contatti</h2>
      <p>Per qualunque domanda su questa informativa o sui vostri dati: Giovanni Paolo Fusco, <a href="mailto:giovanni@giovannipaolofusco.it">giovanni@giovannipaolofusco.it</a>.</p>

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
      <p>The data is processed by <strong>Cloudflare, Inc.</strong>, which hosts the website, as a data processor under its data processing agreement. Cloudflare may entrust parts of the service to other processors (sub-processors), listed at <a href="https://www.cloudflare.com/gdpr/subprocessors/" rel="noopener noreferrer">cloudflare.com/gdpr/subprocessors</a>. The data is not disclosed to anyone else or made public.</p>

      <h2>5. Transfers outside the European Union</h2>
      <p>Cloudflare is based in the United States. The transfer relies on Cloudflare's participation in the EU-U.S. Data Privacy Framework (Commission Implementing Decision (EU) 2023/1795, an adequacy decision under Article 45 of the Regulation) and on the standard contractual clauses adopted by the European Commission (Commission Implementing Decision (EU) 2021/914), which are part of its data processing agreement. Some of Cloudflare's sub-processors are also located outside the European Union. A copy of the standard contractual clauses is available in Cloudflare's data processing agreement, <a href="https://www.cloudflare.com/cloudflare-customer-dpa/" rel="noopener noreferrer">cloudflare.com/cloudflare-customer-dpa</a>, or on request from the controller.</p>

      <h2>6. How long data is kept</h2>
      <p>Browsing data stays in the hosting provider's technical logs for as long as needed to keep the service secure, under the provider's own policies, described at <a href="https://www.cloudflare.com/privacypolicy/" rel="noopener noreferrer">cloudflare.com/privacypolicy</a>. The controller does not keep copies.</p>

      <h2>7. Cookies and browser storage</h2>
      <p>The website does not use cookies. It uses the browser's session storage (<code>sessionStorage</code>, key <code>apertura-vista</code>) only to remember that the opening animation has already been shown: this is technical storage needed for the website to work as designed, it contains no personal data and it is deleted when you close the tab. For this reason it does not require consent (Article 122(1) of Italian Legislative Decree 196/2003) and no banner is needed.</p>

      <h2>8. Do you have to provide your data?</h2>
      <p>Browsing data is needed to visit the website. No other data is requested.</p>

      <h2>9. Your rights</h2>
      <p>You can ask the controller for access to your data, rectification, erasure and restriction of processing (Articles 15–18 of the Regulation) by writing to <a href="mailto:giovanni@giovannipaolofusco.it">giovanni@giovannipaolofusco.it</a>. As the controller does not keep browsing data, requests concerning the provider's logs will be handled through Cloudflare.</p>
      <p><strong>Right to object.</strong> You may object at any time, on grounds relating to your particular situation, to processing based on legitimate interests (Article 21 of the Regulation).</p>
      <p>None of the processing on this website is based on consent, so there is no consent to withdraw.</p>

      <h2>10. Automated decision-making</h2>
      <p>There is no automated decision-making, including profiling, referred to in Article 22(1) and (4) of the Regulation.</p>

      <h2>11. Complaints</h2>
      <p>You have the right to lodge a complaint with a supervisory authority (Article 77 of the Regulation), in particular in the Member State of your habitual residence, place of work or place of the alleged infringement. In Italy, the supervisory authority is the <span lang="it">Garante per la protezione dei dati personali</span>; see <a href="https://www.garanteprivacy.it" rel="noopener noreferrer">garanteprivacy.it</a> for how to lodge a complaint.</p>

      <h2>12. Children</h2>
      <p>None of the processing on this website is based on consent, so the rules on children's consent (Article 8 of the Regulation and Article 2-quinquies of Italian Legislative Decree 196/2003) do not apply. The only data processed is browsing data, which is the same for every visitor. A parent or holder of parental responsibility can exercise the rights in section 9 on the child's behalf by writing to <a href="mailto:giovanni@giovannipaolofusco.it">giovanni@giovannipaolofusco.it</a>.</p>

      <h2>13. Changes to this notice and new purposes</h2>
      <p>If this notice changes, the updated version is published on this page with a new date. Before using browsing data for a purpose other than those described here, the controller will state the new purpose, together with any other relevant information, on this page and through a notice on the website.</p>

      <h2>14. Editing area</h2>
      <p>The <code>/admin/</code> area is used only by the controller to update opening hours and notices, with access through a GitHub account. It is not intended for visitors and collects no visitor data.</p>

      <h2>15. Contact</h2>
      <p>For any question about this notice or your data: Giovanni Paolo Fusco, <a href="mailto:giovanni@giovannipaolofusco.it">giovanni@giovannipaolofusco.it</a>.</p>

      <p class="aggiornamento">Last updated: 9 November 2026</p>
    </div>`,
};

const ID_PRIVACY = ['titolare', 'dati', 'finalita', 'destinatari', 'trasferimenti', 'conservazione', 'cookie', 'conferimento', 'diritti', 'decisioni-automatizzate', 'reclamo', 'minori', 'modifiche', 'redazione', 'contatti'];

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
