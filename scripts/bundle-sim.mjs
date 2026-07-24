/* Pre-bundle @pkmn/sim into ONE minified ESM file served as a static vendor
 * asset (public/vendor/pkmn-sim.mjs).
 *
 * Why a static asset instead of a vite chunk: the package ships 140 ESM
 * modules / ~24 MB of source. Even after esbuild collapses them into a single
 * 6.8 MB module, rollup's chunk rendering on small CI boxes (≤4 GB RAM) OOMs.
 * Serving the bundle from /vendor keeps it completely outside the rollup
 * module graph — the battle engine imports it at runtime via a dynamic
 * import() URL, so it still loads lazily (only when a battle starts) and
 * never touches the main bundle.
 *
 * Called automatically from vite.config.ts (ensureSimBundle) — no manual
 * step. Rebuilds when the file is missing or @pkmn/sim was updated. */
import { existsSync, mkdirSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const SIM_PKG_DIR = path.join(root, 'node_modules', '@pkmn', 'sim');
export const SIM_BUNDLE_DIR = path.join(root, 'public', 'vendor');
export const SIM_BUNDLE_FILE = path.join(SIM_BUNDLE_DIR, 'pkmn-sim.mjs');

function upToDate() {
  if (!existsSync(SIM_BUNDLE_FILE)) return false;
  try {
    const pkg = path.join(SIM_PKG_DIR, 'package.json');
    return statSync(SIM_BUNDLE_FILE).mtimeMs >= statSync(pkg).mtimeMs;
  } catch {
    return false;
  }
}

/** idempotent — rebuilds only when missing or the installed sim is newer */
export function ensureSimBundle() {
  // (plain .mjs — no TS annotations here, node executes this file directly)
  if (upToDate()) return SIM_BUNDLE_FILE;
  const { buildSync } = require('esbuild');
  mkdirSync(SIM_BUNDLE_DIR, { recursive: true });
  const entry = path.join(SIM_PKG_DIR, 'build', 'esm', 'sim', 'index.mjs');
  buildSync({
    entryPoints: [entry],
    outfile: SIM_BUNDLE_FILE,
    bundle: true,
    format: 'esm',
    platform: 'browser',
    target: 'es2020',
    minifyWhitespace: true,
    minifySyntax: true,
    // class/function .name semantics stay intact (the sim resolves effects via
    // data ids, but keepNames is cheap insurance)
    keepNames: true,
    logLevel: 'silent',
  });
  return SIM_BUNDLE_FILE;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const file = ensureSimBundle();
  console.log(`[bundle-sim] wrote ${path.relative(root, file)}`);
}
