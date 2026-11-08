(function () {
  var radice = document.documentElement;
  radice.classList.add('js');
  try {
    var fermo = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var home = document.documentElement.hasAttribute('data-home');
    if (home && !fermo && !sessionStorage.getItem('apertura-vista')) {
      radice.classList.add('apre');
      sessionStorage.setItem('apertura-vista', '1');
    }
  } catch (e) {}
})();
