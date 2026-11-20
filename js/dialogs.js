// Pop-ups: the case-study scrolls (loaded from components/), the movable windows
// (certifications, contacts), the certificate viewer, and keeping the page behind them inert.

// while a window or scroll is open, everything behind it is inert
var backdrop = document.getElementById('backdrop');
function lockPage(except, showBackdrop) {
  [].forEach.call(document.body.children, function (el) {
    if (el.tagName === 'SCRIPT' || el.tagName === 'TEMPLATE' || el === backdrop) return;
    el.inert = el !== except;
  });
  backdrop.hidden = !showBackdrop;
  document.documentElement.style.overflow = 'hidden';
}
function unlockPage() {
  [].forEach.call(document.body.children, function (el) { el.inert = false; });
  backdrop.hidden = true;
  document.documentElement.style.overflow = '';
}

// scroll hall: click a scroll, it unrolls and shows its contents
var sv = document.getElementById('scrollView');
var svParch = document.getElementById('svParch');
var svClose = document.getElementById('svClose');
var svOpener = null, svBusy = false;
// each scroll's contents is a component in components/, fetched the first time it is needed and kept after that
var pieces = {};
function loadPiece(name) {
  if (!pieces[name]) {
    pieces[name] = fetch('components/' + name + '.html').then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.text();
    });
    pieces[name].catch(function () { pieces[name] = null; }); // try again next time
  }
  return pieces[name];
}
var NOT_LOADED = '<div class="sv-body"><h2 id="svTitle">This scroll could not be loaded</h2>' +
  '<p>Check your connection and try again. If you opened index.html straight from a folder, run the site from a local web server instead (see README.md).</p></div>';
function openScroll(btn) {
  if (svBusy) return;
  svBusy = true;
  var name = btn.dataset.scroll;
  loadPiece(name).then(function (html) { svBusy = false; showScroll(btn, name, html); },
                       function () { svBusy = false; showScroll(btn, name, NOT_LOADED); });
}
function showScroll(btn, name, html) {
  svOpener = btn;
  svParch.innerHTML = html;
  addHints(svParch);
  var brief = name === 'freelance-work';
  svParch.classList.toggle('brief', brief);
  svParch.parentNode.classList.toggle('wide', !brief);
  svParch.scrollTop = 0;
  sv.hidden = false;
  lockPage(sv, false);
  // always start reading from the top, even if the last scroll was left halfway
  svParch.scrollTop = 0;
  requestAnimationFrame(function () { svParch.scrollTop = 0; });
  sv.style.setProperty('--h', svParch.offsetHeight + 'px');
  sv.classList.remove('closing');
  if (!isStill()) {
    sv.classList.add('opening');
    setTimeout(function () { sv.classList.remove('opening'); }, 1000);
  }
  svParch.focus();
}
// fetch the scrolls in the background once the page is idle, so they open instantly
(window.requestIdleCallback || function (f) { setTimeout(f, 2500); })(function () {
  document.querySelectorAll('[data-scroll]').forEach(function (b) { loadPiece(b.dataset.scroll); });
});
function closeScroll() {
  if (sv.hidden || svBusy) return;
  function done() {
    sv.hidden = true;
    sv.classList.remove('closing');
    unlockPage();
    svBusy = false;
    if (svOpener) svOpener.focus();
  }
  if (isStill()) { done(); return; }
  svBusy = true;
  sv.classList.remove('opening');
  sv.style.setProperty('--h', svParch.offsetHeight + 'px');
  sv.classList.add('closing');
  setTimeout(done, 460);
}
document.querySelectorAll('[data-scroll]').forEach(function (b) {
  b.addEventListener('click', function () { openScroll(b); });
});
svClose.addEventListener('click', closeScroll);
sv.addEventListener('click', function (e) { if (e.target === sv) closeScroll(); });
sv.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') { e.stopPropagation(); closeScroll(); }
});
// light and dark screenshots in the case study gallery
svParch.addEventListener('click', function (e) {
  var b = e.target.closest('[data-mode-toggle]');
  if (!b) return;
  var g = b.closest('.gallery');
  var dark = g.dataset.mode !== 'dark';
  g.dataset.mode = dark ? 'dark' : 'light';
  b.setAttribute('aria-pressed', dark ? 'true' : 'false');
});
// table of contents links scroll inside the parchment
svParch.addEventListener('click', function (e) {
  var a = e.target.closest('.toc a');
  if (!a) return;
  e.preventDefault();
  var t = svParch.querySelector(a.getAttribute('href'));
  if (t) { svParch.scrollTo({ top: t.offsetTop - 12, behavior: isStill() ? 'auto' : 'smooth' }); t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); }
});

// windows: open, drag, resize, close
var zTop = 20, opened = 0;
var frames = document.querySelectorAll('.frame');
function front(f) { f.style.zIndex = ++zTop; }
function openWin(id, opener) {
  var f = document.getElementById(id);
  closeMap(false);
  frames.forEach(function (o) { if (o !== f && !o.hidden) o.hidden = true; });
  if (f.hidden) {
    f.hidden = false;
    if (!f.style.left) {
      var off = (opened++ % 4) * 28;
      f.style.left = Math.max(8, (innerWidth - f.offsetWidth) / 2 + off - 40) + 'px';
      f.style.top = Math.max(8, (innerHeight - f.offsetHeight) / 2 + off - 40) + 'px';
    }
  }
  f._opener = opener;
  front(f);
  lockPage(f, true);
  f.focus();
}
function closeWin(f) {
  f.hidden = true;
  unlockPage();
  var o = f._opener;
  if (o && o.closest('.map-menu')) o = document.getElementById('mapBtn');
  if (o) o.focus();
}
backdrop.addEventListener('click', function () {
  frames.forEach(function (f) { if (!f.hidden) closeWin(f); });
});
function clamp(f) {
  var r = f.getBoundingClientRect();
  f.style.left = Math.min(Math.max(r.left, 90 - r.width), innerWidth - 90) + 'px';
  f.style.top = Math.min(Math.max(r.top, 0), innerHeight - 50) + 'px';
}
document.querySelectorAll('[data-open]').forEach(function (b) {
  b.addEventListener('click', function () { openWin(b.dataset.open, b); });
});
frames.forEach(function (f) {
  var bar = f.querySelector('.bar');
  var grip = f.querySelector('.grip');
  f.addEventListener('pointerdown', function () { front(f); });
  f.querySelector('.x').addEventListener('click', function () { closeWin(f); });

  // drag by the title bar
  bar.addEventListener('pointerdown', function (e) {
    if (e.target.closest('.x') || narrow.matches) return;
    var r = f.getBoundingClientRect(), sx = e.clientX, sy = e.clientY;
    bar.setPointerCapture(e.pointerId);
    function move(ev) {
      f.style.left = (r.left + ev.clientX - sx) + 'px';
      f.style.top = (r.top + ev.clientY - sy) + 'px';
    }
    function up() {
      bar.removeEventListener('pointermove', move);
      bar.removeEventListener('pointerup', up);
      clamp(f);
    }
    bar.addEventListener('pointermove', move);
    bar.addEventListener('pointerup', up);
  });

  // resize from the corner
  grip.addEventListener('pointerdown', function (e) {
    if (narrow.matches) return;
    var r = f.getBoundingClientRect(), sx = e.clientX, sy = e.clientY;
    grip.setPointerCapture(e.pointerId);
    e.stopPropagation();
    function move(ev) {
      f.style.width = Math.max(260, r.width + ev.clientX - sx) + 'px';
      f.style.height = Math.max(170, r.height + ev.clientY - sy) + 'px';
    }
    function up() {
      grip.removeEventListener('pointermove', move);
      grip.removeEventListener('pointerup', up);
    }
    grip.addEventListener('pointermove', move);
    grip.addEventListener('pointerup', up);
  });

  // keyboard: arrows move the window, shift plus arrows resize it
  bar.addEventListener('keydown', function (e) {
    var d = {ArrowLeft: [-16, 0], ArrowRight: [16, 0], ArrowUp: [0, -16], ArrowDown: [0, 16]}[e.key];
    if (!d || narrow.matches) return;
    e.preventDefault();
    var r = f.getBoundingClientRect();
    if (e.shiftKey) {
      f.style.width = Math.max(260, r.width + d[0]) + 'px';
      f.style.height = Math.max(170, r.height + d[1]) + 'px';
    } else {
      f.style.left = (r.left + d[0]) + 'px';
      f.style.top = (r.top + d[1]) + 'px';
      clamp(f);
    }
  });
});

// Esc closes the window on top
document.addEventListener('keydown', function (e) {
  if (e.key !== 'Escape') return;
  document.body.classList.add('tips-off');
  var top = null;
  frames.forEach(function (f) {
    if (!f.hidden && (!top || +f.style.zIndex > +top.style.zIndex)) top = f;
  });
  if (top) { closeWin(top); return; }
  if (!mapMenu.hidden) closeMap(true);
});
document.addEventListener('mousemove', function () { document.body.classList.remove('tips-off'); });

// certificates: on a computer, preview the PDF in a pop-up; on a phone, open it directly
var certView = document.getElementById('certView'), cvFrame = document.getElementById('cvFrame');
var cvOpen = document.getElementById('cvOpen'), cvTitle = document.getElementById('cvTitle');
var certLinks = document.querySelectorAll('#w-certs .view'), cvFrom = null;
var bigScreen = matchMedia('(min-width:820px) and (hover:hover)');
function certMode() {
  var pre = bigScreen.matches;
  document.getElementById('certIntro').textContent = pre ?
    'Click a certificate to preview it here. You can also open it in a new tab.' : 'Each certificate opens as a PDF in a new tab.';
  certLinks.forEach(function (a) {
    var name = a.closest('.cert').querySelector('h3').textContent;
    a.setAttribute('aria-label', 'View certificate: ' + name + (pre ? ' (opens a preview)' : ' (PDF, opens in a new tab)'));
    if (pre) a.setAttribute('aria-haspopup', 'dialog'); else a.removeAttribute('aria-haspopup');
  });
}
bigScreen.addEventListener('change', certMode);
certMode();
certLinks.forEach(function (a) {
  a.addEventListener('click', function (e) {
    if (!bigScreen.matches) return;
    e.preventDefault();
    cvFrom = a;
    cvTitle.textContent = a.closest('.cert').querySelector('h3').textContent;
    cvOpen.href = a.getAttribute('href');
    cvFrame.src = a.getAttribute('href') + '#view=FitH';
    certView.hidden = false;
    lockPage(certView, false);
    document.getElementById('cvClose').focus();
  });
});
function closeCert() {
  if (certView.hidden) return;
  certView.hidden = true;
  cvFrame.removeAttribute('src');
  // back to the certifications window, which stays open
  lockPage(document.getElementById('w-certs'), true);
  if (cvFrom) cvFrom.focus();
}
document.getElementById('cvClose').addEventListener('click', closeCert);
certView.addEventListener('click', function (e) { if (e.target === certView) closeCert(); });
certView.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') { e.stopPropagation(); closeCert(); }
});

// keep open windows on screen when the browser is resized
addEventListener('resize', function () {
  frames.forEach(function (f) { if (!f.hidden) clamp(f); });
});
