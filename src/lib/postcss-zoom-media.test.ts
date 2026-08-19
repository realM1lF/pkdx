import { describe, expect, it } from 'vitest';
import postcss from 'postcss';
import postcssZoomMedia, {
  scaleMediaParams,
  zoomLevels,
  ZOOM_MAX,
  ZOOM_MIN,
  ZOOM_STEP,
} from './postcss-zoom-media';

async function run(input: string) {
  const result = await postcss([postcssZoomMedia()]).process(input, { from: undefined });
  return result.css;
}

describe('postcss-zoom-media', () => {
  it('exports zoom levels 50–250 step 10', () => {
    const levels = zoomLevels();
    expect(levels[0]).toBe(ZOOM_MIN);
    expect(levels[levels.length - 1]).toBe(ZOOM_MAX);
    expect(levels).toHaveLength((ZOOM_MAX - ZOOM_MIN) / ZOOM_STEP + 1);
  });

  it('scaleMediaParams multiplies min-width', () => {
    expect(scaleMediaParams('(min-width: 768px)', 1.5)).toBe('(min-width: 1152px)');
  });

  it('scaleMediaParams multiplies max-width', () => {
    expect(scaleMediaParams('(max-width: 767px)', 1.5)).toBe('(max-width: 1150.5px)');
  });

  it('scaleMediaParams preserves non-width features in compound queries', () => {
    const scaled = scaleMediaParams(
      '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
      1.5,
    );
    expect(scaled).toBe('(min-width: 1152px) and (prefers-reduced-motion: no-preference)');
  });

  it('replaces width @media with zoom-scoped duplicates', async () => {
    const input = `@media (min-width: 768px) {
  .foo { color: red; }
}`;
    const css = await run(input);
    expect(css).not.toContain('@media (min-width: 768px) {\n  .foo');
    expect(css).toContain('html[data-zoom="100"] .foo');
    expect(css).toContain('@media (min-width: 768px)');
    expect(css).toContain('html[data-zoom="150"] .foo');
    expect(css).toContain('@media (min-width: 1152px)');
  });

  it('leaves feature-only @media untouched', async () => {
    const input = `@media (prefers-reduced-motion: reduce) {
  .bar { animation: none; }
}`;
    const css = await run(input);
    expect(css).toBe(input);
  });

  it('is idempotent on already-scoped output', async () => {
    const once = await run(`@media (min-width: 640px) { .x { display: block; } }`);
    const twice = await run(once);
    expect(twice).toBe(once);
  });
});
