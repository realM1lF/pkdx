/* announce-init.js — hide dismissed notice before first paint.
 * Must stay external (no inline script) for CSP (netlify.toml script-src 'self').
 * Key + value stay in sync with src/lib/announce-bar.ts. */
(function () {
  try {
    if (localStorage.getItem('pdx2.announce.email-login') === 'off') {
      document.documentElement.dataset.announce = 'off';
    }
  } catch (e) {
    /* private mode — bar stays visible this session */
  }
})();
