(function () {
  'use strict';

  var WA_NUMBER = '919907206838';
  var lang = 'en';
  try { lang = localStorage.getItem('rdf-lang') || 'en'; } catch (e) {}

  /* ---------- Bengali digits ---------- */
  function bnNum(n) {
    return String(n).replace(/\d/g, function (d) { return '০১২৩৪৫৬৭৮৯'[d]; });
  }
  function num(n) { return lang === 'bn' ? bnNum(n) : String(n); }

  /* ---------- Build menu price lists ---------- */
  function buildMenus() {
    document.querySelectorAll('.price-list').forEach(function (ul) {
      var rows = [];
      if (ul.dataset.custom) {
        rows = JSON.parse(ul.dataset.custom);
        ul.classList.add('single');
      } else {
        var unit = +ul.dataset.unit, step = +ul.dataset.step, count = +ul.dataset.count;
        for (var i = 1; i <= count; i++) rows.push({ price: step * i, pieces: unit * i });
      }
      ul.innerHTML = '';
      rows.forEach(function (r) {
        var li = document.createElement('li');
        li.className = 'price-item';
        li.dataset.price = r.price;
        li.dataset.pieces = r.pieces;
        li.dataset.cat = ul.dataset.cat;
        li.setAttribute('role', 'button');
        li.setAttribute('tabindex', '0');
        li.innerHTML = '<span class="amt">₹<span class="n">' + num(r.price) + '</span></span>' +
          '<span class="pcs"><span class="n">' + num(r.pieces) + '</span> ' +
          '<span class="pc-word">' + pieceWord(r.pieces) + '</span><small>' +
          (lang === 'bn' ? 'অর্ডার করুন' : 'Tap to order') + '</small></span>';
        ul.appendChild(li);
      });
    });
  }
  function pieceWord(n) {
    if (lang === 'bn') return 'পিস';
    return n === 1 ? 'piece' : 'pieces';
  }

  /* ---------- WhatsApp order from a price row ---------- */
  function orderRow(li) {
    var msg = 'Hello Raju Dada Fuchka, I want to order ' + li.dataset.cat + ': ₹' +
      li.dataset.price + ' (' + li.dataset.pieces + ' ' + (li.dataset.pieces === '1' ? 'piece' : 'pieces') + ').';
    window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  }
  document.addEventListener('click', function (e) {
    var li = e.target.closest && e.target.closest('.price-item');
    if (li) orderRow(li);
  });
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('price-item')) {
      e.preventDefault(); orderRow(e.target);
    }
  });

  /* ---------- Tabs ---------- */
  document.querySelectorAll('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('active'); });
      document.querySelectorAll('.menu-panel').forEach(function (p) { p.classList.remove('active'); });
      tab.classList.add('active');
      document.getElementById('panel-' + tab.dataset.target).classList.add('active');
    });
  });

  /* ---------- Language switch ---------- */
  function applyLang() {
    document.documentElement.lang = lang === 'bn' ? 'bn' : 'en';
    document.body.classList.toggle('bn', lang === 'bn');
    document.querySelectorAll('[data-en]').forEach(function (el) {
      var t = el.getAttribute('data-' + lang);
      if (t) el.textContent = t;
    });
    document.getElementById('langBtn').textContent = lang === 'bn' ? 'English' : 'বাংলা';
    buildMenus();
  }
  document.getElementById('langBtn').addEventListener('click', function () {
    lang = lang === 'en' ? 'bn' : 'en';
    try { localStorage.setItem('rdf-lang', lang); } catch (e) {}
    applyLang();
  });

  /* ---------- Mobile nav ---------- */
  var navLinks = document.getElementById('navLinks');
  document.getElementById('burger').addEventListener('click', function () { navLinks.classList.toggle('open'); });
  navLinks.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { navLinks.classList.remove('open'); });
  });

  /* ---------- Image fallback: pretty illustration if a photo file is missing ---------- */
  var PALETTES = {
    normal: ['#f77f00', '#d62828', '#fcbf49'],
    special: ['#d62828', '#7a0f0f', '#ffd166'],
    dahi: ['#2a9d4a', '#f77f00', '#fff3d6']
  };
  function fallbackSvg(kind) {
    var p = PALETTES[kind] || PALETTES.normal;
    var puris = '';
    var pos = [[200, 215], [300, 195], [400, 215], [250, 270], [350, 270], [300, 140]];
    pos.forEach(function (c) {
      puris += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="42" fill="#f2b84b" stroke="#c9801a" stroke-width="4"/>' +
        '<circle cx="' + (c[0] - 12) + '" cy="' + (c[1] - 14) + '" r="10" fill="#ffe08a" opacity=".8"/>' +
        (kind === 'dahi' ? '<ellipse cx="' + c[0] + '" cy="' + (c[1] - 8) + '" rx="26" ry="14" fill="#fffaf0"/>' : '<circle cx="' + c[0] + '" cy="' + (c[1] + 4) + '" r="14" fill="#7a3b0c"/>');
    });
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + p[0] + '"/><stop offset="1" stop-color="' + p[1] + '"/></linearGradient></defs>' +
      '<rect width="600" height="450" fill="url(#g)"/>' +
      '<ellipse cx="300" cy="330" rx="230" ry="70" fill="rgba(0,0,0,.25)"/>' +
      '<ellipse cx="300" cy="300" rx="230" ry="75" fill="#fff8ec" stroke="' + p[2] + '" stroke-width="8"/>' +
      '<ellipse cx="300" cy="300" rx="190" ry="55" fill="#ffe9c0"/>' + puris +
      '<text x="300" y="415" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="30" fill="#fff">🌶️ RAJU DADA FUCHKA</text></svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }
  document.addEventListener('error', function (e) {
    var img = e.target;
    if (img && img.tagName === 'IMG' && !img.dataset.fb) {
      img.dataset.fb = '1';
      img.src = fallbackSvg(img.dataset.kind || 'normal');
    }
  }, true);
  // Hero fallback (no data-kind) handled by CSS gradient background; hide broken image
  var hero = document.querySelector('.hero-img');
  if (hero) hero.addEventListener('error', function () { hero.style.display = 'none'; });

  /* ---------- Init ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
  applyLang();
})();
