import { describe, expect, it } from 'vitest';
import { isOverlayToken, mintOverlayToken } from './nuzlocke-overlay';

describe('overlay token minting', () => {
  it('produces unique-looking tokens with required prefix', () => {
    const a = mintOverlayToken();
    const b = mintOverlayToken();
    expect(isOverlayToken(a)).toBe(true);
    expect(isOverlayToken(b)).toBe(true);
    expect(a).not.toBe(b);
  });
});
