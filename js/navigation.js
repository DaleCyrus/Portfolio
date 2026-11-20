// Getting around: the dungeon map and its page shortcuts, links between rooms,
// the Previous/Next floor buttons, and which room you are in.

// dungeon map: a button that shows and hides the list of rooms
var mapBtn = document.getElementById('mapBtn');
var mapMenu = document.getElementById('mapMenu');
function setSubs(t, open) {
  t.setAttribute('aria-expanded', open ? 'true' : 'false');
  document.getElementById(t.getAttribute('aria-controls')).hidden = !open;
}
function openMap() {
  mapMenu.hidden = false;
  mapBtn.setAttribute('aria-expanded', 'true');
  // only the room you are in shows its pages, so the map stays short
  mapMenu.querySelectorAll('.sub-tg').forEach(function (t, i) { setSubs(t, i === whichRoom()); });
  hideTip(true);
}
function closeMap(returnFocus) {
  if (mapMenu.hidden) return;
  mapMenu.hidden = true;
  mapBtn.setAttribute('aria-expanded', 'false');
  if (returnFocus) mapBtn.focus();
}
mapBtn.addEventListener('click', function () { if (mapMenu.hidden) openMap(); else closeMap(false); });
document.addEventListener('click', function (e) {
  if (!mapMenu.hidden && !e.target.closest('.map-nav')) closeMap(false);
});
document.querySelector('.map-nav').addEventListener('focusout', function (e) {
  if (!mapMenu.hidden && e.relatedTarget && !e.relatedTarget.closest('.map-nav')) closeMap(false);
});

// links to a room scroll there and move keyboard focus into that room
function goToRoom(id) {
  var room = document.getElementById(id);
  if (!room) return;
  var i = roomIds.indexOf(id);
  if (i > -1 && typeof travel === 'function') travel(i);
  else room.scrollIntoView({ behavior: isStill() ? 'auto' : 'smooth' });
  room.setAttribute('tabindex', '-1');
  room.focus({ preventScroll: true });
}
document.addEventListener('click', function (e) {
  var a = e.target.closest('a[href^="#"]');
  if (!a || a.closest('.toc') || a.classList.contains('skip')) return;
  var id = a.getAttribute('href').slice(1);
  if (!document.getElementById(id)) return;
  e.preventDefault();
  closeMap(false);
  goToRoom(id);
});

mapMenu.querySelectorAll('.sub-tg').forEach(function (t) {
  t.addEventListener('click', function () { setSubs(t, t.getAttribute('aria-expanded') !== 'true'); });
});
mapMenu.addEventListener('click', function (e) {
  var c = e.target.closest('[data-go]');
  if (!c) return;
  closeMap(false);
  openPage(c.dataset.go, c.dataset.pg);
});
function focusIn(el) {
  if (!el) return;
  el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}
function openPage(id, pg) {
  if (id === 'projects') {
    // jump straight to the hall, then unroll the scroll or open the window
    tripTo = null;
    document.getElementById('projects').scrollIntoView({ behavior: 'auto' });
    var how = pg.split(':');
    if (how[0] === 'scroll') openScroll(document.querySelector('[data-scroll="' + how[1] + '"]'));
    else openWin(how[1], document.querySelector(how[1] === 'w-certs' ? '.showcase' : '.messenger'));
    return;
  }
  pg = +pg;
  goToRoom(id);
  if (id === 'home') {
    if (panels.hidden) setPanels(true);
    homePager.go(pg);
    focusIn(document.querySelectorAll('#heroPanels .pane')[pg].querySelector('h1,img'));
  } else if (id === 'about') {
    openBook(function () {
      if (narrow.matches) bookPager.go(pg); else turnTo(Math.floor(pg / 2));
      setTimeout(function () { focusIn(bookPages[pg].querySelector('h2')); }, narrow.matches || isStill() ? 0 : 420);
    });
  } else if (id === 'experience') {
    questPager.go(pg);
    focusIn(quests[pg].querySelector('h3'));
  }
}

// mark the room you are in on the map
var roomLinks = mapMenu.querySelectorAll('.rooms a');
var roomIds = ['home', 'about', 'experience', 'projects'];
var roomNames = ['The surface', 'The archives', 'Training grounds', 'The scroll hall'];
var curRoom = -1;
var prevBtn = document.getElementById('prevRoom');
var nextBtn = document.getElementById('nextRoom');
function whichRoom() {
  var n = 0;
  roomIds.forEach(function (id, i) {
    if (document.getElementById(id).getBoundingClientRect().top <= innerHeight * 0.4) n = i;
  });
  return n;
}
function updateRoom() {
  var n = whichRoom();
  if (n === curRoom) return;
  curRoom = n;
  roomLinks.forEach(function (a, i) {
    if (i === n) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
  });
  prevBtn.disabled = n === 0;
  nextBtn.disabled = n === roomIds.length - 1;
  prevBtn.setAttribute('aria-label', n > 0 ? 'Previous floor: ' + roomNames[n - 1] : 'Previous floor');
  nextBtn.setAttribute('aria-label', n < roomIds.length - 1 ? 'Next floor: ' + roomNames[n + 1] : 'Next floor');
  prevBtn.title = n > 0 ? 'Up to ' + roomNames[n - 1] : '';
  nextBtn.title = n < roomIds.length - 1 ? 'Down to ' + roomNames[n + 1] : '';
}
var roomTick = false;
addEventListener('scroll', function () {
  if (roomTick) return;
  roomTick = true;
  requestAnimationFrame(function () { roomTick = false; updateRoom(); });
}, { passive: true });
addEventListener('resize', updateRoom);
updateRoom();

// the arrows move one room up or down; focus stays on the arrow so it can be pressed again
// one trip at a time: a new jump replaces the old one instead of fighting it
var tripTo = null, tripTimer = null;
function travel(n) {
  tripTo = n;
  var room = document.getElementById(roomIds[n]);
  room.scrollIntoView({ behavior: isStill() ? 'auto' : 'smooth' });
  clearTimeout(tripTimer);
  // when the scroll ends, line the room up exactly in case something changed size on the way
  tripTimer = setTimeout(arrive, 1600);
}
function arrive() {
  if (tripTo === null) return;
  var room = document.getElementById(roomIds[tripTo]);
  tripTo = null;
  clearTimeout(tripTimer);
  if (Math.abs(room.getBoundingClientRect().top) > 2) room.scrollIntoView({ behavior: 'auto' });
}
if ('onscrollend' in window) window.addEventListener('scrollend', function () { setTimeout(arrive, 50); });
function stepRoom(d) {
  var from = tripTo !== null ? tripTo : whichRoom();
  var n = Math.min(Math.max(from + d, 0), roomIds.length - 1);
  travel(n);
  document.getElementById('roomNews').textContent = 'Now in ' + roomNames[n];
}

var mapTip = document.getElementById('mapTip'), tipTimer = null;
function hideTip(forever) {
  mapTip.hidden = true;
  clearTimeout(tipTimer);
  if (forever) try { localStorage.setItem('dale-maptip', 'seen'); } catch (err) {}
}
try { if (!localStorage.getItem('dale-maptip')) { mapTip.hidden = false; tipTimer = setTimeout(function () { hideTip(false); }, 12000); } } catch (err) {}

prevBtn.addEventListener('click', function () { stepRoom(-1); });
nextBtn.addEventListener('click', function () { stepRoom(1); });
