// The rooms: Dale's dialogue on the surface, the archives book (opening, page turns),
// the Back/Next pagers on phones, the quest board, and text that grows to fill its box.

// Dale's dialogue box: open from the start, click Dale to close or reopen it
var panels = document.getElementById('heroPanels');
var who = document.getElementById('who');
var bubble = who.querySelector('.bubble');
var talkTimer = null;
function talk(on) {
  clearInterval(talkTimer);
  bubble.hidden = !on;
  if (on && !isStill()) {
    var n = 0;
    talkTimer = setInterval(function () { n = n % 3 + 1; bubble.textContent = '...'.slice(0, n); }, 320);
  }
}
function setPanels(open) {
  panels.hidden = !open;
  who.setAttribute('aria-expanded', open ? 'true' : 'false');
  talk(!open);
}
who.addEventListener('click', function () { setPanels(panels.hidden); });

// the archives: the book on the lectern glows, then projects its pages
var book = document.getElementById('book');
var spreads = book.querySelectorAll('.spread');
var leaf = book.querySelector('.leaf');
var narrow = matchMedia('(max-width:719px), (max-height:560px)');
var bookOpened = false, turning = false;
var bookReady = [];
function openBook(then) {
  if (typeof then === 'function') bookReady.push(then);
  function ready() { book.classList.add('text'); fitAll(); bookReady.splice(0).forEach(function (f) { f(); }); }
  if (book.classList.contains('text')) { ready(); return; }
  if (bookOpened) return;
  bookOpened = true;
  if (isStill()) { book.dataset.state = 'open'; ready(); return; }
  book.dataset.state = 'glow';
  setTimeout(function () {
    book.dataset.state = 'open';
    setTimeout(ready, 1000);
  }, 1300);
}
// the glowing book on the lectern opens the pages and moves focus to them
document.getElementById('tomeBtn').addEventListener('click', function () {
  openBook(function () {
    var h = book.querySelector('.spread:not([hidden]) .page:not(.pg-off) h2');
    if (h) h.focus();
  });
});
new IntersectionObserver(function (entries, obs) {
  entries.forEach(function (e) {
    if (e.isIntersecting) { openBook(); obs.disconnect(); }
  });
}, { threshold: 0.5 }).observe(document.getElementById('about'));
document.getElementById('about').addEventListener('focusin', function () { openBook(); });
// on phones the pages stack inside the room, so show them right away and the room keeps one height
if (narrow.matches) { bookOpened = true; book.dataset.state = 'open'; book.classList.add('text'); }

// arrow buttons turn the page
function turnTo(n) {
  var now = +book.dataset.spread;
  if (turning || n === now) return;
  function swap() {
    spreads.forEach(function (s, i) { s.hidden = i !== n; });
    book.dataset.spread = n;
    fitAll();
    markRead(n * 2);
    markRead(n * 2 + 1);
    var h = spreads[n].querySelector('h2');
    if (h) h.focus({ preventScroll: true });
  }
  if (isStill() || narrow.matches) { swap(); return; }
  turning = true;
  leaf.className = 'leaf ' + (n > now ? 'fwd' : 'back');
  setTimeout(swap, 350);
  setTimeout(function () {
    leaf.className = 'leaf';
    turning = false;
    if (turnQueued) { var q = turnQueued; turnQueued = 0; flipBook(q); }
  }, 720);
}
book.querySelectorAll('[data-turn]').forEach(function (b) {
  b.addEventListener('click', function () { turnTo(+b.dataset.turn); });
});

// phones: long panels show one part at a time, with Back and Next buttons under them
var compact = matchMedia('(max-width:819px), (max-height:560px)');
function makePager(box, items, names, label, mq, onShow) {
  var nav = document.createElement('div');
  nav.className = 'pager';
  nav.setAttribute('role', 'group');
  nav.setAttribute('aria-label', label);
  // each button names the page it goes to, like "< About me" and "Stack >"
  nav.innerHTML = '<button type="button" class="pg-btn back glowy"><i class="spr" aria-hidden="true"></i><span class="sr-only">Previous page: </span><span class="pg-name"></span></button>' +
    '<span class="pg-count" aria-hidden="true"></span>' +
    '<button type="button" class="pg-btn next glowy"><span class="sr-only">Next page: </span><span class="pg-name"></span><i class="spr" aria-hidden="true"></i></button>' +
    '<span class="sr-only" aria-live="polite"></span>';
  nav.querySelector('.back .spr').innerHTML = sprite(ART.arrowL, 2);
  nav.querySelector('.next .spr').innerHTML = sprite(ART.arrowR, 2);
  box.appendChild(nav);
  var btns = nav.querySelectorAll('button'), count = nav.querySelector('.pg-count'), news = nav.lastChild;
  var cur = 0;
  function show(n, announce) {
    cur = n;
    var on = mq.matches;
    box.classList.toggle('paged', on);
    items.forEach(function (el, i) {
      el.classList.toggle('pg-off', on && i !== n);
      // the page on show may scroll inside itself, so keyboards can reach it too
      if (on && i === n) {
        el.tabIndex = 0;
        if (el.tagName !== 'ARTICLE') { el.setAttribute('role', 'region'); el.setAttribute('aria-label', names[i] + ' page'); }
      } else {
        el.removeAttribute('tabindex');
        if (el.tagName !== 'ARTICLE') { el.removeAttribute('role'); el.removeAttribute('aria-label'); }
      }
    });
    if (onShow) onShow(n, on);
    if (typeof fitAll === 'function') fitAll();
    // at the first or last page that button has nowhere to go, so it steps aside
    btns[0].disabled = n === 0;
    btns[1].disabled = n === items.length - 1;
    btns[0].querySelector('.pg-name').textContent = n > 0 ? names[n - 1] : '';
    btns[1].querySelector('.pg-name').textContent = n < items.length - 1 ? names[n + 1] : '';
    count.textContent = (n + 1) + ' / ' + items.length;
    if (announce) news.textContent = names[n] + ', page ' + (n + 1) + ' of ' + items.length;
  }
  function go(n, k) {
    n = Math.min(Math.max(n, 0), items.length - 1);
    if (n === cur) return;
    show(n, k !== undefined);
    if (items[n].scrollTop) items[n].scrollTop = 0;
    var top = items[n].getBoundingClientRect().top;
    if (top < 70) scrollBy({ top: top - 90, behavior: 'auto' });
    if (k !== undefined && btns[k].disabled) btns[1 - k].focus();
  }
  [-1, 1].forEach(function (d, k) {
    btns[k].addEventListener('click', function () { go(cur + d, k); });
  });
  mq.addEventListener('change', function () { show(cur, false); });
  show(0, false);
  return { show: show, go: go, get cur() { return cur; } };
}
// the intro and portrait now share one card on phones, so this pager never switches on
var homePager = makePager(document.getElementById('heroPanels'), [].slice.call(document.querySelectorAll('#heroPanels .pane')),
  ['Intro', 'Portrait'], 'Introduction pages', matchMedia('not all'));
var bookPages = [].slice.call(book.querySelectorAll('.page'));
var bookPager = makePager(book.querySelector('.open'), bookPages,
  ['About me', 'What I do', 'Highlights', 'At a glance', 'Stack', 'Skills'], 'Book pages', narrow,
  function (n, on) {
    // the pages live in spreads of two, so show the spread that holds this page
    var sp = on ? [].indexOf.call(spreads, bookPages[n].closest('.spread')) : +book.dataset.spread;
    if (on && typeof markRead === 'function') markRead(n);
    spreads.forEach(function (s, i) { s.hidden = i !== sp; });
    book.dataset.spread = sp;
  });
var quests = [].slice.call(document.querySelectorAll('.quest'));
var questPager = makePager(document.querySelector('.board'), quests, ['OJT', 'Immersion'], 'Quests', compact);

// tablets and computers: the text grows to fill the book pages and the quest board, so bigger screens have no empty space
var fitMQ = matchMedia('(min-width:600px)');
function overflows(el) { return el.scrollHeight > el.clientHeight + 1; }
function fitText(els, fits, maxPx) {
  els.forEach(function (e) { e.style.fontSize = ''; });
  if (!fitMQ.matches || !els.length || !els[0].offsetParent) return;
  var base = parseFloat(getComputedStyle(els[0]).fontSize);
  function set(px) { els.forEach(function (e) { e.style.fontSize = px + 'px'; }); }
  if (!fits() || maxPx <= base) { set(base); return; }
  // halve the gap between "fits" and "too big" a few times to find the largest size that still fits
  var lo = base, hi = maxPx;
  for (var i = 0; i < 8; i++) {
    var mid = (lo + hi) / 2;
    set(mid);
    if (fits()) lo = mid; else hi = mid;
  }
  set(Math.floor(lo * 10) / 10);
}
function fitBook() {
  if (narrow.matches) { bookPages.forEach(function (pg) { pg.style.fontSize = ''; }); return; }
  var sp = spreads[+book.dataset.spread];
  if (!sp || sp.hidden || !book.classList.contains('text')) return;
  // each page grows on its own until it is full, so a shorter page never keeps a gap at the bottom
  sp.querySelectorAll('.page').forEach(function (pg) {
    fitText([pg], function () { return !overflows(pg); }, 42);
  });
}
// the intro card on bigger screens: its words grow until the card is full
function fitIntro() {
  var pane = document.querySelector('.intro-pane');
  if (!bigCard.matches || panels.hidden) { pane.style.fontSize = ''; return; }
  // grow until the card is full, but never so wide that a long word spills out the side
  fitText([pane], function () { return !overflows(pane) && pane.scrollWidth <= pane.clientWidth + 1; }, 34);
}
var bigCard = matchMedia('(min-width:820px) and (min-height:561px)');
var fullBoard = bigCard;
function fitQuests() {
  var board = document.querySelector('.board');
  if (fullBoard.matches) {
    // big screens: the board fills the room and each quest card grows its own text until it is full
    quests.forEach(function (q) { fitText([q], function () { return !overflows(q); }, 34); });
    return;
  }
  fitText(quests, function () {
    if (!board.classList.contains('paged')) return !overflows(board);
    return !quests.some(function (q) { return !q.classList.contains('pg-off') && overflows(q); });
  }, 32);
}
var fitBusy = false;
function fitAll() {
  if (fitBusy || typeof quests === 'undefined') return;
  fitBusy = true;
  requestAnimationFrame(function () { fitBusy = false; fitBook(); fitQuests(); fitIntro(); if (typeof updAllHints === 'function') updAllHints(); });
}
var fitTimer = null;
addEventListener('resize', function () { clearTimeout(fitTimer); fitTimer = setTimeout(fitAll, 150); });
if (document.fonts) {
  document.fonts.ready.then(fitAll);
  // the pixel fonts are wider than the fallback, so measure again whenever one finishes loading
  document.fonts.addEventListener('loadingdone', fitAll);
}
fitAll();

// until every page has been seen once (remembered on this device), the book's next buttons nudge and a hint sits under it
var pagesRead = [], bookDone = false;
try { bookDone = localStorage.getItem('dale-book') === 'read'; } catch (err) {}
function markRead(i) {
  if (bookDone || !pagesRead) return;
  pagesRead[i] = true;
  var all = true;
  for (var k = 0; k < bookPages.length; k++) if (!pagesRead[k]) all = false;
  if (!all) return;
  bookDone = true;
  book.classList.remove('touring');
  try { localStorage.setItem('dale-book', 'read'); } catch (err) {}
}
if (!bookDone) book.classList.add('touring');
markRead(0);
if (!narrow.matches) markRead(1);
