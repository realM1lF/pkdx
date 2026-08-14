import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { bucket } from './seo-bucket.mjs';

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
