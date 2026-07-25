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

const MIRROR = 'https://npm.mirrors.msh.team/';
const PUBLIC = 'https://registry.npmjs.org/';

try {
  const raw = readFileSync(lockPath, 'utf8');
  if (!raw.includes(MIRROR)) process.exit(0);
  writeFileSync(lockPath, raw.split(MIRROR).join(PUBLIC));
  const count = (raw.match(new RegExp(MIRROR.replace(/[/.:]/g, '\\$&'), 'g')) || []).length;
  console.log(`[fix-lockfile-registry] ${count} Mirror-URL(s) -> registry.npmjs.org normalisiert`);
} catch (err) {
  // Lockfile fehlt o.ae. — niemals den Install dadurch brechen.
  console.warn('[fix-lockfile-registry] uebersprungen:', err.message);
}
