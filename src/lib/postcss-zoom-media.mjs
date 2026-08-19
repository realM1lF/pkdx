/* postcss-zoom-media — duplicate width-based @media rules per page-zoom level.
 * Implements the CSS-Tricks breakpoint compensation pattern for html[data-zoom].
 * Keep ZOOM_* constants in sync with src/lib/page-zoom.ts and public/zoom-init.js. */

export const ZOOM_MIN = 50;
export const ZOOM_MAX = 250;
export const ZOOM_STEP = 10;

export function zoomLevels() {
  const levels = [];
  for (let z = ZOOM_MIN; z <= ZOOM_MAX; z += ZOOM_STEP) levels.push(z);
  return levels;
}

const WIDTH_RE = /\((min-width|max-width|width)\s*:\s*([\d.]+)(px)\)/gi;

export function scaleMediaParams(params, factor) {
  return params.replace(WIDTH_RE, (_match, feature, value) => {
    const num = parseFloat(value);
    const scaled = Math.round(num * factor * 1000) / 1000;
    return `(${feature}: ${scaled}px)`;
  });
}

function cloneForZoom(atRule, zoom) {
  const factor = zoom / 100;
  const scaledParams = scaleMediaParams(atRule.params.trim(), factor);
  const media = atRule.clone({ params: scaledParams });
  media.removeAll();

  atRule.nodes?.forEach((node) => {
    if (node.type !== 'rule') {
      media.append(node.clone());
      return;
    }
    const rule = node.clone();
    rule.selectors = rule.selectors.map((sel) => `html[data-zoom="${zoom}"] ${sel}`);
    media.append(rule);
  });

  return media;
}

const postcssZoomMedia = () => ({
  postcssPlugin: 'postcss-zoom-media',
  Once(root) {
    const targets = [];
    root.walkAtRules('media', (atRule) => {
      const params = atRule.params.trim();
      WIDTH_RE.lastIndex = 0;
      if (!WIDTH_RE.test(params)) return;
      let alreadyScoped = false;
      atRule.walkRules((rule) => {
        if (rule.selectors.some((s) => s.includes('[data-zoom="'))) alreadyScoped = true;
      });
      if (alreadyScoped) return;
      targets.push(atRule);
    });

    for (const atRule of targets) {
      const parent = atRule.parent;
      if (!parent) continue;
      let anchor = atRule;
      for (const zoom of zoomLevels()) {
        const clone = cloneForZoom(atRule, zoom);
        parent.insertAfter(anchor, clone);
        anchor = clone;
      }
      atRule.remove();
    }
  },
});

postcssZoomMedia.postcss = true;

export default postcssZoomMedia;
