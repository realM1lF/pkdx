#!/usr/bin/env node
/* migrate-px-to-rem.mjs — one-shot Tailwind arbitrary px → rem / micro tokens.
 * Run: node scripts/migrate-px-to-rem.mjs */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('..', import.meta.url)), 'src');
const MICRO = {
  8: 'micro8',
  9: 'micro9',
  10: 'micro10',
  11: 'micro11',
  12: 'micro12',
  13: 'micro13',
};

function pxToRem(px) {
  const rem = px / 16;
  const rounded = Math.round(rem * 10000) / 10000;
  const s = rounded.toFixed(4).replace(/\.?0+$/, '');
  return `${s}rem`;
}

const LAYOUT_PROPS = [
  'w',
  'h',
  'min-w',
  'max-w',
  'min-h',
  'max-h',
  'gap',
  'gap-x',
  'gap-y',
  'p',
  'px',
  'py',
  'pt',
  'pb',
  'pl',
  'pr',
  'm',
  'mx',
  'my',
  'mt',
  'mb',
  'ml',
  'mr',
  'top',
  'left',
  'right',
  'bottom',
  'size',
];

function migrateLine(line) {
  let out = line;

  out = out.replace(/text-\[(\d+(?:\.\d+)?)px\]/g, (_m, px) => {
    const n = parseFloat(px);
    const intN = Math.round(n);
    if (Math.abs(n - intN) < 0.001 && MICRO[intN]) return `text-${MICRO[intN]}`;
    return `text-[${pxToRem(n)}]`;
  });

  for (const prop of LAYOUT_PROPS) {
    const escaped = prop.replace(/-/g, '\\-');
    const re = new RegExp(`(?<![\\w-])${escaped}-\\[(\\d+(?:\\.\\d+)?)px\\]`, 'g');
    out = out.replace(re, (_m, px) => {
      const n = parseFloat(px);
      if (n <= 1) return `${prop}-[${px}px]`;
      return `${prop}-[${pxToRem(n)}]`;
    });
  }

  out = out.replace(/rounded-\[(\d+(?:\.\d+)?)px\]/g, (_m, px) => {
    const n = parseFloat(px);
    if (n <= 1) return `rounded-[${px}px]`;
    return `rounded-[${pxToRem(n)}]`;
  });

  out = out.replace(/leading-\[(\d+(?:\.\d+)?)px\]/g, (_m, px) => {
    const n = parseFloat(px);
    if (n <= 1) return `leading-[${px}px]`;
    return `leading-[${pxToRem(n)}]`;
  });

  out = out.replace(/(\[clamp\([^)]*?)(\d+(?:\.\d+)?)px/g, (_m, pre, px) => {
    return pre + pxToRem(parseFloat(px));
  });

  return out;
}

const PIXEL_CTX = /font-pixel|tb-micro|pixel-label|PixelLabel/;
const PILL_CTX = /rounded-pill|MicroChip|SegmentedControl/;

function migrateContent(content) {
  return content
    .split('\n')
    .map((line) => (PIXEL_CTX.test(line) || PILL_CTX.test(line) ? line : migrateLine(line)))
    .join('\n');
}

/** @param {string} dir @param {string[]} out */
function walk(dir, out = []) {
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (['.tsx', '.css'].includes(extname(ent.name))) out.push(p);
  }
  return out;
}

const files = walk(ROOT);
let changed = 0;

for (const file of files) {
  const before = readFileSync(file, 'utf8');
  const after = migrateContent(before);
  if (after !== before) {
    writeFileSync(file, after);
    changed++;
  }
}

console.log(`migrate-px-to-rem: updated ${changed} files`);
