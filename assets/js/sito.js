(function () {
  var inglese = document.documentElement.lang === 'en';

  var salto = /[?&]jump=(\d+)/.exec(location.search);
  Promise.resolve(document.fonts && document.fonts.ready).then(function () {
    setTimeout(function () {
      if (!salto) { window.__ready = true; return; }
      var y = Number(salto[1]);
      var barra = document.querySelector('.testata');
      if (barra && y > 0) {
        barra.style.transition = 'none';
        barra.classList.add('testata--compatta');
      }
      window.scrollTo(0, y);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          window.scrollTo(0, y);
          if (barra) { barra.style.transition = ''; }
          window.__ready = true;
        });
      });
    }, document.documentElement.classList.contains('apre') ? 1000 : 0);
  });

  var bottone = document.querySelector('.testata__menu');
  var voci = document.getElementById('voci');
  if (bottone && voci) {
    bottone.addEventListener('click', function () {
      var aperto = bottone.getAttribute('aria-expanded') === 'true';
      bottone.setAttribute('aria-expanded', String(!aperto));
      bottone.setAttribute('aria-label', aperto ? (inglese ? 'Open the menu' : 'Apri il menu') : (inglese ? 'Close the menu' : 'Chiudi il menu'));
      if (aperto) { voci.setAttribute('data-chiuso', ''); } else { voci.removeAttribute('data-chiuso'); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && bottone.getAttribute('aria-expanded') === 'true') {
        bottone.click();
        bottone.focus();
      }
    });
  }

  var sigla = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Rome', weekday: 'short' }).format(new Date());
  var numero = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[sigla];
  document.querySelectorAll('[data-giorno="' + numero + '"]').forEach(function (giorno) {
    giorno.classList.add('e-oggi');
    var etichetta = document.createElement('span');
    etichetta.className = 'giorni__etichetta';
    etichetta.textContent = inglese ? 'Today' : 'Oggi';
    var cella = giorno.querySelector('th') || giorno;
    cella.appendChild(document.createTextNode(' '));
    cella.appendChild(etichetta);
  });

  if (!('IntersectionObserver' in window)) { return; }
  var testata = document.querySelector('.testata');
  var sentinella = document.querySelector('.sentinella');
  if (testata && sentinella) {
    new IntersectionObserver(function (righe) {
      testata.classList.toggle('testata--compatta', !righe[0].isIntersecting);
    }).observe(sentinella);
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }
  var schede = document.querySelectorAll('.scheda');
  var entrata = new IntersectionObserver(function (righe) {
    righe.forEach(function (r) { if (r.isIntersecting) { r.target.classList.remove('scheda--fuori'); } });
  }, { rootMargin: '0px 0px -12% 0px' });
  var uscita = new IntersectionObserver(function (righe) {
    righe.forEach(function (r) { if (!r.isIntersecting) { r.target.classList.add('scheda--fuori'); } });
  }, { rootMargin: '0px 0px 20% 0px' });
  schede.forEach(function (s) { entrata.observe(s); uscita.observe(s); });
})();
