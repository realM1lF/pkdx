import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { HonestyHint } from './HonestyHint';

const COPY = 'Types are current-gen. The gen chip only filters who appears.';

describe('HonestyHint', () => {
  it('renders nothing when show is false', () => {
    const html = renderToStaticMarkup(createElement(HonestyHint, { show: false, children: COPY }));
    expect(html).toBe('');
  });

  it('renders the translated string when show is true', () => {
    const html = renderToStaticMarkup(createElement(HonestyHint, { show: true, children: COPY }));
    expect(html).toContain(COPY);
  });
});
