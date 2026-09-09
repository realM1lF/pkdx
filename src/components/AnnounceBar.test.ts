import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AnnounceBar from './AnnounceBar';
import { ANNOUNCE_ITEM_KEYS } from '@/lib/announce-bar';
import de from '@/i18n/locales/de/translation.json';
import en from '@/i18n/locales/en/translation.json';

function renderBar(lng: 'de' | 'en') {
  const instance = i18n.createInstance();
  instance.use(initReactI18next);
  void instance.init({
    lng,
    fallbackLng: 'en',
    resources: {
      de: { translation: de },
      en: { translation: en },
    },
    interpolation: { escapeValue: false },
  });
  return renderToStaticMarkup(
    createElement(I18nextProvider, { i18n: instance }, createElement(AnnounceBar)),
  );
}

describe('AnnounceBar', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => {},
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders every German ticker item twice (loop track)', () => {
    const html = renderBar('de');
    expect(html).toContain('data-announce-bar');
    expect(html).toContain('h-[1.2rem]');
    expect(html).toContain('text-[12px]');
    expect(html).toContain('announce-track');
    expect(html).toContain(de.announce.dismiss);
    for (const key of ANNOUNCE_ITEM_KEYS) {
      const text = de.announce.items[key];
      const hits = html.split(text).length - 1;
      expect(hits, key).toBe(2);
    }
  });

  it('renders every English ticker item twice', () => {
    const html = renderBar('en');
    for (const key of ANNOUNCE_ITEM_KEYS) {
      const text = en.announce.items[key];
      const hits = html.split(text).length - 1;
      expect(hits, key).toBe(2);
    }
  });

  it('uses the muted gold palette and hides the duplicate from AT', () => {
    const html = renderBar('de');
    expect(html).toContain('bg-[rgb(43,35,12)]');
    expect(html).toContain('text-[rgb(151,124,44)]');
    expect(html).toContain('announce-track-dup');
    expect(html).toContain('aria-hidden="true"');
    expect(html).not.toContain('data-announce-tooltip');
  });

  it('keeps tooltip copy in locale parity', () => {
    expect(de.announce.tooltip).toBe('Neuigkeiten und Gedanken');
    expect(en.announce.tooltip).toBe('News and Thoughts');
  });
});
