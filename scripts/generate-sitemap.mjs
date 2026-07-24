#!/usr/bin/env node
/* generate-sitemap — writes public/sitemap.xml (runs as npm prebuild).
 *
 * One <url> per localized static route (de + en), each carrying
 * hreflang alternates (de / en / x-default) and lastmod = build date. */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { SITE_URL, STATIC_ROUTES, localePath } from './seo-routes.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lastmod = new Date().toISOString().slice(0, 10);

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function urlEntry(lang, rest) {
  const loc = `${SITE_URL}${localePath(lang, rest)}`;
  const alternates = ['de', 'en', 'x-default']
    .map((hl) => {
      const hrefLang = hl === 'x-default' ? 'en' : hl;
      return `    <xhtml:link rel="alternate" hreflang="${hl}" href="${esc(`${SITE_URL}${localePath(hrefLang, rest)}`)}"/>`;
    })
    .join('\n');
  return `  <url>
    <loc>${esc(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
${alternates}
  </url>`;
}

const urls = [];
for (const rest of STATIC_ROUTES) {
  for (const lang of ['de', 'en']) {
    urls.push(urlEntry(lang, rest));
  }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;

const out = path.join(root, 'public', 'sitemap.xml');
writeFileSync(out, xml);
console.log(`[sitemap] wrote ${path.relative(root, out)} (${urls.length} urls, lastmod ${lastmod})`);
