/* Joker-XD game extras: sound (WebAudio beeps) + speaker button + speed select.
   Injected by _richgame.js before the game's own script. window.__JK = { speed: 'dt'|'frame'|'timer'|'timeout'|null, max: ms } */
(function () {
  var CFG = window.__JK || {};
  var S = 1; // speed multiplier
  var soundOn = true;
  try { if (localStorage.getItem('jk_snd') === '0') soundOn = false; } catch (e) {}

  /* ---------- speed ---------- */
  var mode = CFG.speed;
  if (mode === 'dt' || mode === 'frame') {
    var realRAF = window.requestAnimationFrame.bind(window);
    var q = [], V = 0, lastR = 0, acc = 0;
    window.requestAnimationFrame = function (cb) { q.push(cb); return q.length; };
    window.cancelAnimationFrame = function () {};
    var pump = function (t) {
      var d = lastR ? Math.min(t - lastR, 50) : 16.7; lastR = t;
      var cur = q; q = [];
      if (mode === 'dt') {
        V += d * S;
        for (var i = 0; i < cur.length; i++) { try { cur[i](V); } catch (e) { console.error(e); } }
      } else {
        V += d; acc += S;
        var n = Math.floor(acc); acc -= n;
        if (n < 1) { q = cur.concat(q); }
        else {
          for (var k = 0; k < n; k++) {
            var run = cur; cur = null;
            for (var j = 0; j < run.length; j++) { try { run[j](V); } catch (e) { console.error(e); } }
            if (k < n - 1) { cur = q; q = []; }
          }
        }
      }
      realRAF(pump);
    };
    realRAF(pump);
    if (mode === 'dt') { try { performance.now = function () { return V; }; } catch (e) {} }
  } else if (mode === 'timer' || mode === 'timeout') {
    var max = CFG.max || 1e9;
    var sI = window.setInterval, sT = window.setTimeout;
    var scale = function (ms) { ms = +ms || 0; return ms < max ? ms / S : ms; };
    if (mode === 'timer') {
      window.setInterval = function (f, ms) { var a = [].slice.call(arguments, 2); return sI.apply(window, [f, scale(ms)].concat(a)); };
    } else {
      window.setTimeout = function (f, ms) { var a = [].slice.call(arguments, 2); return sT.apply(window, [f, scale(ms)].concat(a)); };
    }
  }

  /* ---------- sound ---------- */
  var AC = null, lastBeep = 0;
  var AudioCtor = window.AudioContext || window.webkitAudioContext;
  function ctx() {
    try {
      if (!AudioCtor) return null;
      if (!AC) AC = new AudioCtor();
      if (AC.state === 'suspended' && AC.resume) AC.resume();
      return AC;
    } catch (e) { return null; }
  }
  function tone(freq, dur, type, vol, toFreq, delay) {
    if (!soundOn) return;
    var c = ctx(); if (!c) return;
    try {
      var t0 = c.currentTime + (delay || 0);
      var o = c.createOscillator(), g = c.createGain();
      o.type = type || 'square';
      o.frequency.setValueAtTime(freq, t0);
      if (toFreq) o.frequency.exponentialRampToValueAtTime(toFreq, t0 + dur);
      g.gain.setValueAtTime(vol || 0.08, t0);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g); g.connect(c.destination);
      o.start(t0); o.stop(t0 + dur + 0.02);
    } catch (e) {}
  }
  var SND = {
    tick: function () { tone(660, 0.05, 'square', 0.05); },
    coin: function () { tone(880, 0.07, 'square', 0.07); tone(1320, 0.1, 'square', 0.07, 0, 0.07); },
    hit: function () { tone(220, 0.18, 'sawtooth', 0.09, 80); },
    lose: function () { tone(400, 0.18, 'sawtooth', 0.09, 300); tone(300, 0.18, 'sawtooth', 0.09, 200, 0.18); tone(200, 0.35, 'sawtooth', 0.09, 70, 0.36); },
    win: function () { tone(523, 0.12, 'square', 0.07); tone(659, 0.12, 'square', 0.07, 0, 0.12); tone(784, 0.12, 'square', 0.07, 0, 0.24); tone(1047, 0.3, 'square', 0.07, 0, 0.36); }
  };
  function play(n) {
    var now = Date.now();
    if (now - lastBeep < 35) return;
    lastBeep = now;
    try { SND[n](); } catch (e) {}
  }

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn();
  }

  ready(function () {
    var $ = function (id) { return document.getElementById(id); };

    /* score up -> coin, lives down -> hit */
    ['score', 'sc', 'rings', 'kills', 'pt', 'matches'].forEach(function (id) {
      var el = $(id); if (!el) return;
      var prev = parseInt(el.textContent, 10) || 0;
      new MutationObserver(function () {
        var n = parseInt(el.textContent, 10);
        if (isNaN(n)) return;
        if (n > prev) play('coin');
        prev = n;
      }).observe(el, { childList: true, characterData: true, subtree: true });
    });
    var lv = $('lives');
    if (lv) {
      var pl = parseInt(lv.textContent, 10) || 0;
      new MutationObserver(function () {
        var n = parseInt(lv.textContent, 10);
        if (!isNaN(n) && n < pl) play('hit');
        if (!isNaN(n)) pl = n;
      }).observe(lv, { childList: true, characterData: true, subtree: true });
    }

    /* messages -> win / lose */
    var WIN = /win|won|clear|solved|perfect|congrat|complete|🏆|🎉/i;
    var LOSE = /over|lose|lost|crash|dead|boom|fail|wrong|time'?s up|too early|mine/i;
    ['msg', 'panelTitle', 'message', 'hint'].forEach(function (id) {
      var el = $(id); if (!el) return;
      var last = el.textContent;
      new MutationObserver(function () {
        var t = el.textContent || '';
        if (!t || t === last) return;
        last = t;
        if (WIN.test(t)) play('win'); else if (LOSE.test(t)) play('lose');
      }).observe(el, { childList: true, characterData: true, subtree: true });
    });

    /* every tap -> small tick (also unlocks audio) */
    document.addEventListener('pointerdown', function (e) {
      if (e.target && e.target.closest && e.target.closest('[data-jk]')) return;
      ctx(); play('tick');
    }, true);

    /* ---------- speaker button ---------- */
    var spk = document.createElement('div');
    spk.setAttribute('data-jk', '1');
    spk.style.cssText = 'position:fixed;top:8px;right:8px;width:34px;height:34px;border-radius:50%;background:#000a;border:1.5px solid #fff5;color:#fff;display:flex;align-items:center;justify-content:center;font-size:17px;z-index:99999;cursor:pointer;touch-action:manipulation';
    var paint = function () { spk.textContent = soundOn ? '🔊' : '🔇'; };
    paint();
    spk.onclick = function () {
      soundOn = !soundOn; paint();
      try { localStorage.setItem('jk_snd', soundOn ? '1' : '0'); } catch (e) {}
      if (soundOn) { ctx(); SND.coin(); }
    };
    if (AudioCtor) document.body.appendChild(spk);

    /* ---------- speed select ---------- */
    if (!mode) return;
    var NAMES = { 0.65: '🐢 SLOW', 1: '⚡ NORMAL', 1.5: '🚀 FAST' };
    var ov = document.createElement('div');
    ov.setAttribute('data-jk', '1');
    ov.style.cssText = 'position:fixed;left:0;top:0;right:0;bottom:0;background:rgba(6,9,22,.94);z-index:99998;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;font-family:system-ui,Arial,sans-serif;color:#fff';
    ov.innerHTML = '<div style="font-size:11px;letter-spacing:3px;color:#a5b4fc;font-weight:900">JOKER XD ARCADE</div>' +
      '<div style="font-size:22px;font-weight:900;margin-bottom:6px">SELECT SPEED</div>';
    var chip = document.createElement('div');
    chip.setAttribute('data-jk', '1');
    chip.style.cssText = 'position:fixed;top:8px;left:8px;padding:6px 10px;border-radius:17px;background:#000a;border:1.5px solid #fff5;color:#fff;font-size:12px;font-weight:800;z-index:99999;cursor:pointer;font-family:system-ui,Arial,sans-serif;touch-action:manipulation';
    var setChip = function () { chip.textContent = NAMES[S] || '⚡ NORMAL'; };
    [[0.65, '🐢 SLOW'], [1, '⚡ NORMAL'], [1.5, '🚀 FAST']].forEach(function (p) {
      var b = document.createElement('button');
      b.setAttribute('data-jk', '1');
      b.textContent = p[1];
      b.style.cssText = 'width:200px;padding:13px;border:0;border-radius:13px;font-size:17px;font-weight:900;color:#1e1b4b;background:linear-gradient(#e0e7ff,#818cf8);box-shadow:0 3px #4338ca;touch-action:manipulation';
      b.onclick = function () { S = p[0]; setChip(); ov.style.display = 'none'; ctx(); SND.coin(); };
      ov.appendChild(b);
    });
    var note = document.createElement('div');
    note.style.cssText = 'font-size:11px;color:#94a3b8;margin-top:4px';
    note.textContent = 'Speed applies from the next START';
    ov.appendChild(note);
    chip.onclick = function () { ov.style.display = 'flex'; };
    setChip();
    document.body.appendChild(ov);
    document.body.appendChild(chip);
  });
})();
