import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = resolve(import.meta.dirname, '../..');

function readSrc(rel: string): string {
  return readFileSync(resolve(ROOT, rel), 'utf8');
}

describe('Orre shadow list scroll chaining', () => {
  it('lets Lenis take the wheel once the list is at its edge', () => {
    const src = readSrc('src/pages/OrreTracker.tsx');
    const fromHint = src.slice(src.indexOf('HonestyHint show'));
    const list = fromHint.match(/<div[\s\S]*?className="[^"]+"[\s\S]*?>/)?.[0];
    expect(list).toBeTruthy();
    expect(list).toContain('pdx-nested-scroll');
    expect(list).toContain('overflow-y-auto');
    expect(list).not.toContain('data-lenis-prevent');
  });

  it('keeps nested-scroll overscroll auto after the Lenis contain rule', () => {
    const css = readSrc('src/index.css');
    const containAt = css.indexOf('html.lenis [data-lenis-prevent]');
    const chainAt = css.indexOf('html.lenis .pdx-nested-scroll');
    expect(containAt).toBeGreaterThan(-1);
    expect(chainAt).toBeGreaterThan(containAt);
    expect(css.slice(chainAt, chainAt + 160)).toMatch(/overscroll-behavior:\s*auto/);
  });
});
