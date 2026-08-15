import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { bucket, pickTopWild } from './seo-bucket.mjs';

describe('SEO encounter bucket()', () => {
  it('good-rod + swarm-yes is OTHER, not FISH', () => {
    assert.equal(bucket('good-rod', ['swarm-yes']), 'OTHER');
  });

  it('good-rod without swarm is FISH', () => {
    assert.equal(bucket('good-rod', []), 'FISH');
  });

  it('walk + swarm-yes is OTHER', () => {
    assert.equal(bucket('walk', ['swarm-yes']), 'OTHER');
  });

  it('walk without swarm is WALK', () => {
    assert.equal(bucket('walk', []), 'WALK');
  });

  it('static and gift stay STATIC', () => {
    assert.equal(bucket('gift', []), 'STATIC');
    assert.equal(bucket('static', []), 'STATIC');
    assert.equal(bucket('only-one', []), 'STATIC');
    assert.equal(bucket('feebas-tile-fishing', []), 'STATIC');
    assert.equal(bucket('feebas-tile-fishing', ['swarm-yes']), 'STATIC');
  });
});

describe('pickTopWild — swarm is not häufigster Fang', () => {
  it('skips swarm OTHER 90 in favor of the next wild row', () => {
    const top = pickTopWild([
      { id: 211, method: 'OTHER', chance: 90, isStatic: false, chip: 'swarm' },
      { id: 163, method: 'OTHER', chance: 80, isStatic: false, chip: 'radio' },
      { id: 72, method: 'FISH', chance: 70, isStatic: false },
    ]);
    assert.equal(top?.id, 163);
    assert.equal(top?.chance, 80);
  });

  it('still skips STATIC even when chance is 100', () => {
    const top = pickTopWild([
      { id: 129, method: 'STATIC', chance: 100, isStatic: true },
      { id: 16, method: 'WALK', chance: 40, isStatic: false },
    ]);
    assert.equal(top?.id, 16);
  });
});
