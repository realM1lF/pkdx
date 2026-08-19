/* zoom-init.js — apply persisted page zoom before React/CSS paint.
 * Must stay external (no inline script) for CSP (netlify.toml script-src 'self').
 * Logic mirrors src/lib/page-zoom.ts — keep both in sync. */
(function () {
  var KEY = 'pdx2.zoom';
  var MIN = 50;
  var MAX = 250;
  var STEP = 10;
  var BASE = 16;
  var DEFAULT = 100;
  var DEFAULT_DESKTOP = 130;
  var DESKTOP_MIN = 768;

  function clamp(v) {
    if (!isFinite(v)) return DEFAULT;
    var stepped = Math.round(v / STEP) * STEP;
    return Math.min(MAX, Math.max(MIN, stepped));
  }

  function defaultZoom() {
    try {
      if (window.matchMedia('(min-width: ' + DESKTOP_MIN + 'px)').matches) return DEFAULT_DESKTOP;
    } catch (e) {
      /* ignore */
    }
    return DEFAULT;
  }

  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw == null) return clamp(defaultZoom());
      return clamp(Number(raw));
    } catch (e) {
      return clamp(defaultZoom());
    }
  }

  var zoom = read();
  var root = document.documentElement;
  root.dataset.zoom = String(zoom);
  root.style.fontSize = zoom === 100 ? '' : (BASE * zoom) / 100 + 'px';
})();
