import { describe, expect, it } from 'vitest';
import de from '@/i18n/locales/de/translation.json';
import en from '@/i18n/locales/en/translation.json';
import { boxStatusBadgeKey } from './box-status';

describe('boxStatusBadgeKey', () => {
  it('gives duped its own badge key, not missed', () => {
    expect(boxStatusBadgeKey('duped')).toBe('nuz.box.badge.duped');
    expect(boxStatusBadgeKey('missed')).toBe('nuz.box.badge.missed');
  });
});

describe('nuz.box.badge.duped locale', () => {
  it('exists in EN and DE', () => {
    expect(en.nuz.box.badge.duped).toBe('Duped');
    expect(typeof de.nuz.box.badge.duped).toBe('string');
    expect(de.nuz.box.badge.duped.length).toBeGreaterThan(0);
    expect(de.nuz.box.badge.duped).not.toBe(en.nuz.box.badge.missed);
  });
});
