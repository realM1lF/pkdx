#!/usr/bin/env node
/* restore-pixel-px-fonts.mjs — Press Start 2P labels back to Tailwind text-[Npx] (utilities layer).
 * text-pixel-* in @layer components was unreliable; text-[8px] matches pre-migration main. */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('..', import.meta.url)), 'src');
const PIXEL_CTX = /font-pixel|tb-micro|pixel-label|PixelLabel/;

const MICRO_TO_PX = {
  micro6: '6px',
  micro7: '7px',
  micro8: '8px',
  micro9: '9px',
  micro10: '10px',
  micro11: '11px',
  micro12: '12px',
  micro13: '13px',
};

const REPLACEMENTS = [
  [/!text-damp-11/g, '!text-[11px]'],
  [/!text-damp-10/g, '!text-[14px]'],
  [/!text-damp-9/g, '!text-[9px]'],
  [/!text-damp-8/g, '!text-[8px]'],
  [/!text-damp-7/g, '!text-[8px]'],
  [/!text-damp-6/g, '!text-[6px]'],
  [/!text-pixel-11/g, '!text-[11px]'],
  [/!text-pixel-10/g, '!text-[14px]'],
  [/!text-pixel-9/g, '!text-[9px]'],
  [/!text-pixel-8/g, '!text-[8px]'],
  [/!text-pixel-7/g, '!text-[8px]'],
  [/!text-pixel-6/g, '!text-[6px]'],
  [/text-damp-11/g, 'text-[11px]'],
  [/text-damp-10/g, 'text-[14px]'],
  [/text-damp-9/g, 'text-[9px]'],
  [/text-damp-8/g, 'text-[8px]'],
  [/text-damp-7/g, 'text-[8px]'],
  [/text-damp-6/g, 'text-[6px]'],
  [/text-pixel-11/g, 'text-[11px]'],
  [/text-pixel-10/g, 'text-[14px]'],
  [/text-pixel-9/g, 'text-[9px]'],
  [/text-pixel-8/g, 'text-[8px]'],
  [/text-pixel-7/g, 'text-[8px]'],
  [/text-pixel-6/g, 'text-[6px]'],
];

function walk(dir, out = []) {
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (['.tsx', '.css'].includes(extname(ent.name))) out.push(p);
  }
  return out;
}

function restoreMicroOnPixelLine(line) {
  if (!PIXEL_CTX.test(line)) return line;
  let out = line;
  for (const [from, to] of REPLACEMENTS) {
    out = out.replace(from, to);
  }
  for (const [micro, px] of Object.entries(MICRO_TO_PX)) {
    out = out.replace(new RegExp(`!text-${micro}`, 'g'), `!text-[${px}]`);
    out = out.replace(new RegExp(`text-${micro}`, 'g'), `text-[${px}]`);
  }
  return out;
}

let changed = 0;
for (const file of walk(ROOT)) {
  const lines = readFileSync(file, 'utf8').split('\n');
  let fileChanged = false;
  const next = lines.map((line) => {
    const out = restoreMicroOnPixelLine(line);
    if (out !== line) fileChanged = true;
    return out;
  });
  if (fileChanged) {
    writeFileSync(file, next.join('\n'));
    changed++;
  }
}

console.log(`restore-pixel-px-fonts: updated ${changed} files`);
