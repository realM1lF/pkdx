#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FANART = path.resolve(__dirname, '../..');
const CARD = path.join(FANART, 'baby-bisasam-pokemon-card.png');
const ART = path.join(FANART, 'baby-bisasam-fullart-card.png');
const OUT = path.join(FANART, 'baby-bisasam-final.png');

const lum = (r, g, b) => (r + g + b) / 3;
const sat = (r, g, b) => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max === 0 ? 0 : (max - min) / max;
};

function main() {
  const card = PNG.sync.read(fs.readFileSync(CARD));
  const art = PNG.sync.read(fs.readFileSync(ART));
  const { width: w, height: h } = card;
  const out = new PNG({ width: w, height: h });

  const y0 = 768;
  const y1 = 1205;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (w * y + x) << 2;
      const cr = card.data[i];
      const cg = card.data[i + 1];
      const cb = card.data[i + 2];
      const ca = card.data[i + 3];
      const ar = art.data[i];
      const ag = art.data[i + 1];
      const ab = art.data[i + 2];

      const cBright = lum(cr, cg, cb);
      const aBright = lum(ar, ag, ab);
      const s = sat(cr, cg, cb);
      const delta = cBright - aBright;

      const inPanelZone = y >= y0 && y <= y1 && x >= 44 && x <= 980;
      const isUiInk = cBright < 118 || s > 0.38;
      const isFrostPanel =
        inPanelZone &&
        !isUiInk &&
        delta > 14 &&
        cBright > 158 &&
        s < 0.2 &&
        Math.abs(cr - cg) < 28 &&
        Math.abs(cg - cb) < 28;

      if (isFrostPanel) {
        out.data[i] = ar;
        out.data[i + 1] = ag;
        out.data[i + 2] = ab;
        out.data[i + 3] = 255;
      } else {
        out.data[i] = cr;
        out.data[i + 1] = cg;
        out.data[i + 2] = cb;
        out.data[i + 3] = ca;
      }
    }
  }

  // Second pass: remove remaining frost halos near text
  for (let y = y0; y <= y1; y++) {
    for (let x = 44; x <= 980; x++) {
      const i = (w * y + x) << 2;
      const cr = out.data[i];
      const cg = out.data[i + 1];
      const cb = out.data[i + 2];
      const ar = art.data[i];
      const ag = art.data[i + 1];
      const ab = art.data[i + 2];
      const cBright = lum(cr, cg, cb);
      const aBright = lum(ar, ag, ab);
      const s = sat(cr, cg, cb);
      const isUiInk = cBright < 118 || s > 0.38;
      if (
        !isUiInk &&
        cBright - aBright > 8 &&
        cBright > 140 &&
        s < 0.24
      ) {
        out.data[i] = ar;
        out.data[i + 1] = ag;
        out.data[i + 2] = ab;
        out.data[i + 3] = 255;
      }
    }
  }

  fs.writeFileSync(OUT, PNG.sync.write(out));
  fs.copyFileSync(OUT, path.join(FANART, 'output/baby-bisasam-final.png'));
  console.log('Final card →', OUT);
}

main();
