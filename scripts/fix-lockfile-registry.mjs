#!/usr/bin/env node
/**
 * postinstall: erzwingt oeffentliche Registry-URLs im Lockfile.
 *
 * Hintergrund: Die Entwicklungs-Sandbox setzt NPM_CONFIG_REGISTRY auf einen
 * internen Mirror (npm.mirrors.msh.team). Der Env-Wert ueberstimmt das
 * projekt-eigene .npmrc, wodurch jede lokale `npm install` Mirror-URLs in
 * package-lock.json schreibt — und Netlify daran scheitert (ENOTFOUND).
 * Dieses Skript laeuft nach jeder Installation und normalisiert das Lockfile.
 * Aenderungen am Lockfile sind dadurch lokal sofort sichtbar (git diff).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const lockPath = join(root, 'package-lock.json');

const MIRRORS = ['https://npm.mirrors.msh.team/', 'https://registry.npmmirror.com/'];
const PUBLIC = 'https://registry.npmjs.org/';

try {
  let raw = readFileSync(lockPath, 'utf8');
  let total = 0;
  for (const mirror of MIRRORS) {
    if (!raw.includes(mirror)) continue;
    const escaped = mirror.replace(/[/.:]/g, '\\$&');
    total += (raw.match(new RegExp(escaped, 'g')) || []).length;
    raw = raw.split(mirror).join(PUBLIC);
  }
  if (total === 0) process.exit(0);
  writeFileSync(lockPath, raw);
  console.log(`[fix-lockfile-registry] ${total} Mirror-URL(s) -> registry.npmjs.org normalisiert`);
} catch (err) {
  // Lockfile fehlt o.ae. — niemals den Install dadurch brechen.
  console.warn('[fix-lockfile-registry] uebersprungen:', err.message);
}
