import { describe, expect, it } from 'vitest';
import { parseMapsFromParam } from './from-param';

describe('parseMapsFromParam', () => {
  it('parses region:nodeId when both exist', () => {
    expect(parseMapsFromParam('kanto:kanto-route-1')).toEqual({
      region: 'kanto',
      nodeId: 'kanto-route-1',
    });
  });

  it('rejects unknown region, missing node, or malformed values', () => {
    expect(parseMapsFromParam(null)).toBeNull();
    expect(parseMapsFromParam('')).toBeNull();
    expect(parseMapsFromParam('kanto')).toBeNull();
    expect(parseMapsFromParam('kalos:foo')).toBeNull();
    expect(parseMapsFromParam('kanto:not-a-real-node')).toBeNull();
    expect(parseMapsFromParam('kanto:kanto-route-1:extra')).toBeNull();
  });
});
