// Scrolling: the mouse wheel and touchpad (book pages vs. floors), touch swipes inside boxes,
// and the "more" hints on boxes that scroll.

// "more" hints: boxes that can scroll show a fade and a small tag at the edge that has more to read
function addHints(box) {
  if (box.querySelector(':scope > .more-hint')) { updHints(box); return; }
  var up = document.createElement('span'), down = document.createElement('span');
  up.className = 'less-hint'; down.className = 'more-hint';
  up.setAttribute('aria-hidden', 'true'); down.setAttribute('aria-hidden', 'true');
  up.innerHTML = '<b>&#9650;</b>';
  down.innerHTML = '<b>&#9660; more</b>';
  box.insertBefore(up, box.firstChild);
  box.appendChild(down);
  if (!box._hinted) {
    box._hinted = true;
    box.addEventListener('scroll', function () { updHints(box); }, { passive: true });
    if (window.ResizeObserver) new ResizeObserver(function () { updHints(box); }).observe(box);
  }
  updHints(box);
}
function updHints(box) {
  var more = box.scrollHeight - box.clientHeight;
  box.classList.toggle('can-down', more > 6 && box.scrollTop < more - 6);
  box.classList.toggle('can-up', more > 6 && box.scrollTop > 6);
  // a box that scrolls must be reachable with the keyboard, so it can be scrolled with the arrow keys
  if (box === svParch || box.classList.contains('win')) return;
  if (more > 6 && !box.hasAttribute('tabindex')) {
    box.tabIndex = 0; box._tabbed = true;
    if (box.tagName !== 'ARTICLE' && !box.hasAttribute('role')) {
      var h = box.querySelector('h1,h2,h3');
      box.setAttribute('role', 'region'); box.setAttribute('aria-label', (h ? h.textContent : 'Scrollable text') + ' page');
      box._roled = true;
    }
  } else if (more <= 6 && box._tabbed && !box.classList.contains('pg-off')) {
    box.removeAttribute('tabindex'); box._tabbed = false;
    if (box._roled) { box.removeAttribute('role'); box.removeAttribute('aria-label'); box._roled = false; }
  }
}
var hintBoxes = document.querySelectorAll('.page, .quest, .intro-pane, .win');
hintBoxes.forEach(addHints);
function updAllHints() { hintBoxes.forEach(updHints); }
addEventListener('resize', function () { setTimeout(updAllHints, 200); });

// touch: a swipe that starts scrolling inside a box stays in that box when it reaches the end
var touchBox = null, touchY = 0;
function scrollBoxOf(el) {
  for (; el && el !== document.body; el = el.parentElement) {
    var oy = getComputedStyle(el).overflowY;
    if ((oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight + 1) return el;
  }
  return null;
}
document.addEventListener('touchstart', function (e) {
  touchBox = scrollBoxOf(e.target);
  touchY = e.touches[0].clientY;
}, { passive: true });
document.addEventListener('touchmove', function (e) {
  if (!touchBox || touchBox._held) return;
  var dy = touchY - e.touches[0].clientY;
  if (Math.abs(dy) < 4) return;
  if (canScrollInside(touchBox, dy)) { touchBox.style.overscrollBehaviorY = 'contain'; touchBox._held = true; }
  else touchBox = null;
}, { passive: true });
document.addEventListener('touchend', function () {
  if (touchBox) { touchBox.style.overscrollBehaviorY = ''; touchBox._held = false; }
  touchBox = null;
});

// mouse wheel and touchpad on bigger screens, depending on where the pointer is:
//  - over the open book: scroll the page if it has more text, otherwise turn to the next or previous pages
//  - over any other box that scrolls: scroll that box; when it runs out, the rest of that flick is ignored
//  - anywhere else: one flick moves exactly one floor
var snapMQ = matchMedia('(min-width:820px) and (min-height:561px)');
var wheelLast = 0, wheelSize = 0, turnQueued = 0;
function canScrollInside(el, dy) {
  for (; el && el !== document.body && el !== document.documentElement; el = el.parentElement) {
    var oy = getComputedStyle(el).overflowY;
    if ((oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight + 1) {
      if (dy > 0 && el.scrollTop + el.clientHeight < el.scrollHeight - 1) return true;
      if (dy < 0 && el.scrollTop > 0) return true;
    }
  }
  return false;
}
// browsers report the wheel in pixels, lines or pages; turn them all into pixels
function wheelPixels(e, d) {
  return d * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1);
}
// a new flick starts after a short pause, or when a new push starts while the last one is still gliding
function newFlick(size) {
  var now = Date.now();
  var fresh = now - wheelLast > 180 || (size > wheelSize * 1.8 && size > 10);
  wheelLast = now;
  wheelSize = size;
  return fresh;
}
function overOpenBook(el) {
  return !narrow.matches && book.classList.contains('text') && !!(el.closest && el.closest('#book .open'));
}
function flipBook(d) {
  var n = +book.dataset.spread + d;
  if (n < 0 || n >= spreads.length) { bookEdge(d); return; }
  if (turning) { turnQueued = d; return; }
  turnTo(n);
}
// at the first or last page, say how to change floors instead of doing nothing
var edgeNote = document.getElementById('bookEdge'), edgeTimer = null;
function bookEdge(d) {
  edgeNote.textContent = d > 0 ? 'Last page. Scroll outside the book to go down a floor.' : 'First page. Scroll outside the book to go up a floor.';
  edgeNote.hidden = false;
  clearTimeout(edgeTimer);
  edgeTimer = setTimeout(function () { edgeNote.hidden = true; }, 2600);
}
window.addEventListener('wheel', function (e) {
  if (!snapMQ.matches || e.ctrlKey) return;
  var dy = wheelPixels(e, e.deltaY), dx = wheelPixels(e, e.deltaX);
  if (!dy || Math.abs(dy) < Math.abs(dx)) return;
  if (document.documentElement.style.overflow === 'hidden') return; // a window or scroll is open
  if (canScrollInside(e.target, dy)) {
    // the box scrolls by itself; remember the flick so its leftover doesn't change floors
    wheelLast = Date.now();
    wheelSize = Math.abs(dy);
    return;
  }
  e.preventDefault();
  if (!newFlick(Math.abs(dy))) return;
  var d = dy > 0 ? 1 : -1;
  if (overOpenBook(e.target)) { flipBook(d); return; }
  stepRoom(d);
}, { passive: false });
