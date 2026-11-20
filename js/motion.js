// Motion: the Pause/Play animations button, pausing rooms you can't see,
// the slow-device tip, and light mode for low-end phones.

// pause or play every animation; the choice is remembered on this device
var motionBtn = document.getElementById('motionBtn');
function setMotion(paused, quiet) {
  document.documentElement.classList.toggle('still', paused);
  // pressing Play also overrides a device that asks for reduced motion
  document.documentElement.classList.toggle('moving', !paused);
  motionBtn.querySelector('.pz-t').textContent = paused ? 'Play' : 'Pause';
  motionBtn.classList.toggle('is-paused', paused);
  if (paused) hideLag(false);
  motionBtn.querySelector('.spr').innerHTML = sprite(paused ? ART.playI : ART.pauseI, 4);
  talk(panels.hidden);
  if (!quiet) try { localStorage.setItem('dale-motion', paused ? 'paused' : 'on'); } catch (err) {}
}
motionBtn.addEventListener('click', function () {
  setMotion(!document.documentElement.classList.contains('still'));
});
var motionPref = null;
try { motionPref = localStorage.getItem('dale-motion'); } catch (err) {}
if (motionPref === 'paused') setMotion(true, true);
else if (motionPref === 'on') setMotion(false, true);
else if (reduceMQ.matches) setMotion(true, true); // the device asks for less motion, so start paused and let Play turn it on

// rooms out of view pause their animations
var sleeper = new IntersectionObserver(function (entries) {
  entries.forEach(function (en) { en.target.classList.toggle('asleep', !en.isIntersecting); });
  fitAll();
}, { rootMargin: '-2px 0px' });
document.querySelectorAll('main > section').forEach(function (sec) { sleeper.observe(sec); });
// slow-device tip: shown when the page stutters or the device is low on memory or cores
var lagTip = document.getElementById('lagTip'), lagShown = false;
function hideLag(forever) {
  if (!lagTip) return;
  lagTip.hidden = true;
  if (forever) try { localStorage.setItem('dale-lagtip', 'seen'); } catch (err) {}
}
function suggestPause() {
  if (lagShown || isStill()) return;
  try { if (localStorage.getItem('dale-lagtip')) return; } catch (err) {}
  lagShown = true;
  hideTip(false);
  lagTip.hidden = false;
  // it steps aside by itself after 20 seconds; the Pause button stays in the bar
  setTimeout(function () { hideLag(false); }, 20000);
}
document.getElementById('lagPause').addEventListener('click', function () {
  setMotion(true);
  hideLag(true);
  motionBtn.focus();
});
document.getElementById('lagX').addEventListener('click', function () { hideLag(true); motionBtn.focus(); });
// count frames for two seconds; fewer than 40 a second means the animations are too heavy here
function measureFps(then) {
  if (document.visibilityState !== 'visible' || isStill()) return;
  var frames = 0, t0 = performance.now();
  requestAnimationFrame(function tick(t) {
    frames++;
    if (t - t0 < 2000) { requestAnimationFrame(tick); return; }
    if (document.visibilityState === 'visible') then(frames * 1000 / (t - t0));
  });
}
// one slow moment (like the page still loading) is not enough: it has to be slow twice in a row
function checkLag() {
  measureFps(function (fps) {
    if (fps >= 40) return;
    measureFps(function (again) {
      if (again < 40) { document.documentElement.classList.add('lite'); suggestPause(); }
    });
  });
}
setTimeout(checkLag, 4000);
var lagChecks = 0;
addEventListener('scrollend', function () { if (!lagShown && lagChecks++ < 3) checkLag(); });

// phones (touch screens) with little memory or few cores get the light mode; computers keep the full effects
if (matchMedia('(pointer:coarse)').matches &&
    ((navigator.deviceMemory && navigator.deviceMemory <= 4) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4))) {
  document.documentElement.classList.add('lite');
  setTimeout(suggestPause, 3000);
}
