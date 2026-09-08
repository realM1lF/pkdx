import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('public/sitemap.xml', () => {
  const body = readFileSync(new URL('../../public/sitemap.xml', import.meta.url), 'utf8');

  it('omits lastmod (build date is not a real change date)', () => {
    expect(body).not.toContain('<lastmod>');
    expect(body).not.toContain('</lastmod>');
  });

  it('lists the locale-correct battle slugs only', () => {
    expect(body).toContain('https://mypokepanion.com/de/kampf-simulator/');
    expect(body).toContain('https://mypokepanion.com/en/battle-simulator/');
    expect(body).not.toContain('https://mypokepanion.com/en/kampf-simulator/');
    expect(body).not.toContain('https://mypokepanion.com/de/battle-simulator/');
  });
});
