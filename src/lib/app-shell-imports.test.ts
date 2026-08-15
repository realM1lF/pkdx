import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = resolve(import.meta.dirname, '../..');

function staticImportSpecs(source: string): string[] {
  const specs: string[] = [];
  for (const line of source.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('import ')) continue;
    const m = trimmed.match(/['"]([^'"]+)['"]/);
    if (m) specs.push(m[1]);
  }
  return specs;
}

function readSrc(rel: string): string {
  return readFileSync(resolve(ROOT, rel), 'utf8');
}

const HEAVY = [
  'framer-motion',
  'lenis',
  '@/lib/cloud-sync',
  '@/lib/smooth',
  '@/lib/auth',
  '@/lib/supabase',
  '@/lib/teambuilder',
  '@/lib/nuzlocke-store',
  '@/components/ui/tooltip',
  '@/components/AccountButton',
  '@/components/PokeballLoader',
];

describe('app-shell first-load imports', () => {
  it.each([
    'src/main.tsx',
    'src/App.tsx',
    'src/components/Layout.tsx',
    'src/components/Navbar.tsx',
    'src/components/Footer.tsx',
    'src/components/LanguageToggle.tsx',
    'src/components/ZoomControl.tsx',
    'src/components/LangGate.tsx',
  ])('%s does not statically import heavy first-load modules', (file) => {
    const specs = staticImportSpecs(readSrc(file));
    expect(specs.filter((s) => HEAVY.includes(s))).toEqual([]);
  });

  it('does not force a viewport-tall main on short legal pages', () => {
    const main = readSrc('src/components/Layout.tsx').match(/<main className="[^"]+"/)?.[0] ?? '';
    expect(main).not.toMatch(/min-h-\[100dvh\]/);
    expect(main).toMatch(/pt-16/);
  });

  it('reserves the same height as the inline search so the gateway does not jump', () => {
    const src = readSrc('src/pages/home/SearchGateway.tsx');
    expect(src).not.toMatch(/className="h-14 w-full rounded-md border border-hairline bg-surface2"/);
    expect(src).toMatch(/className="h-16 w-full rounded-md border border-hairline bg-surface2"/);
  });

  it('keeps MotionConfig off the app shell and on motion route roots', () => {
    expect(staticImportSpecs(readSrc('src/App.tsx'))).not.toContain('framer-motion');
    expect(staticImportSpecs(readSrc('src/components/Layout.tsx'))).not.toContain('framer-motion');
    for (const file of [
      'src/pages/PokemonDetail.tsx',
      'src/pages/Maps.tsx',
      'src/pages/MapRegion.tsx',
      'src/pages/Nuzlocke.tsx',
      'src/pages/NuzlockeRun.tsx',
      'src/pages/TeamBuilder.tsx',
      'src/pages/Items.tsx',
      'src/pages/About.tsx',
      'src/pages/Feedback.tsx',
      'src/pages/Support.tsx',
      'src/pages/Account.tsx',
      'src/components/ShellChrome.tsx',
      'src/components/SearchCommand.tsx',
    ]) {
      expect(readSrc(file)).toMatch(/MotionRoot|MotionConfig/);
    }
  });

  it('does not statically import gsap from the home backdrop', () => {
    const specs = staticImportSpecs(readSrc('src/pages/home/HeroBackdrop.tsx'));
    expect(specs.some((s) => s === 'gsap' || s.startsWith('gsap/') || s === '@gsap/react')).toBe(false);
  });

  it('idles Three, auth and fuse so they miss the LCP window', () => {
    expect(readSrc('src/pages/home/Hero.tsx')).toContain('scheduleIdle');
    expect(readSrc('src/pages/home/SearchGateway.tsx')).toContain('scheduleIdle');
    expect(readSrc('src/components/Navbar.tsx')).toContain('scheduleIdle');
  });
});
