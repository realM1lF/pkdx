import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('public/_redirects pokemon aliases', () => {
  const body = readFileSync(new URL('../../public/_redirects', import.meta.url), 'utf8');

  it('301s EN slugs and DE names to the numeric canonical before the SPA fallback', () => {
    expect(body).toContain('/en/pokemon/pikachu  /en/pokemon/25/  301');
    expect(body).toContain('/de/pokemon/glurak  /de/pokemon/6/  301');
    expect(body.indexOf('/en/pokemon/pikachu')).toBeLessThan(body.indexOf('/*    /index.html   200'));
  });
});
