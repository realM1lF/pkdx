/* Plausible queue stub — must run before the async tracker arrives so that
 * early window.plausible('pageview') calls (Layout.tsx, SPA route changes)
 * are buffered instead of dropped.
 *
 * Lives in its own file rather than inline in index.html so the Content-
 * Security-Policy can drop 'unsafe-inline' from script-src (netlify.toml).
 * Keep it external when editing. */
window.plausible =
  window.plausible ||
  function () {
    (window.plausible.q = window.plausible.q || []).push(arguments);
  };
window.plausible.init =
  window.plausible.init ||
  function (i) {
    window.plausible.o = i || {};
  };
window.plausible.init();
