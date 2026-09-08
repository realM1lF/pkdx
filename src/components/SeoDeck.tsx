/* Shared SEO deck — Holo-Dex ops log, not a SaaS card kit.
 * Sequences use a spine. Specs use a split sheet. One visual per page
 * lives here as a named primitive (type row, six slots, flow). */
import type { ReactNode } from 'react';
import TypeGlyph from '@/components/TypeGlyph';
import { nameOfType, useLanguage } from '@/lib/i18n-data';
import { LocaleLink } from '@/lib/locale-link';
import { POKEMON_TYPES, TYPE_COLORS, type PokemonType } from '@/lib/types';
import { cn } from '@/lib/utils';
import './seo-deck.css';

export function SeoDeck({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mx-auto w-full max-w-4xl', className)}>{children}</div>;
}

export function SeoHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <header className="mb-4 flex items-end gap-4">
      <div className="min-w-0">
        <p className="pixel-label text-[9px] text-gold">{eyebrow}</p>
        <h2 className="mt-1.5 font-display text-xl font-extrabold tracking-wide text-tx-primary md:text-[1.375rem]">
          {title}
        </h2>
      </div>
      <span className="mb-1.5 hidden h-px flex-1 bg-hairline sm:block" aria-hidden />
    </header>
  );
}

export function SeoSection({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn('mt-14 first:mt-0', className)}>{children}</section>;
}

export function SeoLead({ children }: { children: ReactNode }) {
  return <div className="max-w-[62ch] space-y-3 text-tx-secondary">{children}</div>;
}

export function SeoSteps({ items }: { items: Array<{ title: string; body: string }> }) {
  return (
    <ol className="seo-spine mt-6 space-y-5">
      {items.map((item) => (
        <li key={item.title} className="relative min-w-0">
          <span className="seo-spine-dot" aria-hidden />
          <h3 className="font-display text-micro13 font-bold tracking-wide text-tx-primary">{item.title}</h3>
          <p className="mt-1.5 max-w-[62ch] leading-relaxed text-tx-secondary">{item.body}</p>
        </li>
      ))}
    </ol>
  );
}

export function SeoTiles({ items }: { items: Array<{ title: string; body: string }> }) {
  return (
    <div className="mt-6 divide-y divide-hairline border-y border-hairline">
      {items.map((item) => (
        <div key={item.title} className="grid gap-1 py-3.5 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-6">
          <h3 className="font-display text-micro13 font-bold tracking-wide text-tx-primary">{item.title}</h3>
          <p className="max-w-[58ch] leading-relaxed text-tx-secondary">{item.body}</p>
        </div>
      ))}
    </div>
  );
}

export function SeoCallout({ title, body }: { title: string; body: string }) {
  return (
    <aside className="mt-6 border-l-2 border-gold pl-4">
      <h3 className="font-display text-micro13 font-bold tracking-wide text-gold">{title}</h3>
      <p className="mt-1.5 max-w-[62ch] leading-relaxed text-tx-secondary">{body}</p>
    </aside>
  );
}

export function SeoLinks({
  items,
  columns = 1,
}: {
  items: Array<{ to: string; label: string; body: string }>;
  columns?: 1 | 2;
}) {
  return (
    <ul
      className={cn(
        'mt-6 divide-y divide-hairline border-y border-hairline',
        columns === 2 && 'sm:grid sm:grid-cols-2 sm:gap-x-10 sm:divide-y-0 sm:border-0',
      )}
    >
      {items.map((item) => (
        <li key={item.to + item.label} className={cn(columns === 2 && 'sm:border-t sm:border-hairline')}>
          <LocaleLink to={item.to} className="group block py-3 no-underline">
            <span className="font-display text-micro13 font-bold tracking-wide text-gold underline decoration-gold/0 underline-offset-4 transition-colors group-hover:decoration-gold group-focus-visible:decoration-gold">
              {item.label}
            </span>
            <p className="mt-1 max-w-[52ch] leading-relaxed text-tx-secondary">{item.body}</p>
          </LocaleLink>
        </li>
      ))}
    </ul>
  );
}

export function SeoTypeSpectrum({ label, hint }: { label: string; hint: string }) {
  const lang = useLanguage();

  const scrollToGrid = () => {
    const node = document.getElementById('pokedex-grid');
    if (!node) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    node.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <div className="seo-type-spectrum mt-6">
      <p className="pixel-label text-[8px] text-tx-muted">{label}</p>
      <div className="seo-spectrum-row mt-2 flex flex-wrap items-center gap-1.5" role="list">
        {POKEMON_TYPES.map((type) => {
          const color = TYPE_COLORS[type];
          const name = nameOfType(type, lang);
          return (
            <LocaleLink
              key={type}
              to={`/pokedex?type=${type}#pokedex-grid`}
              role="listitem"
              title={name}
              aria-label={name}
              onClick={scrollToGrid}
              className="seo-typechip grid h-7 w-7 place-items-center rounded-sm no-underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
              style={{ color: color.base, ['--t' as string]: color.rgb }}
            >
              <TypeGlyph type={type} size={16} />
            </LocaleLink>
          );
        })}
      </div>
      <div className="seo-spectrum mt-3" aria-hidden>
        {POKEMON_TYPES.map((type) => (
          <span key={type} style={{ background: TYPE_COLORS[type].base }} />
        ))}
      </div>
      <p className="mt-2 text-micro11 text-tx-muted">{hint}</p>
    </div>
  );
}

export function SeoSlotStrip({ label }: { label: string }) {
  return (
    <div className="seo-slot-strip mt-6 max-w-[17rem]">
      <p className="pixel-label text-[8px] text-tx-muted">{label}</p>
      <div className="mt-2 grid grid-cols-6 gap-1.5" aria-hidden>
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className={cn('seo-slot', i === 0 && 'seo-slot--live')}>
            <span className="pixel-label text-[8px] text-tx-muted">{i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SeoRangeBar({ label, lo, hi }: { label: string; lo: string; hi: string }) {
  return (
    <div className="mt-6 max-w-md">
      <p className="pixel-label text-[8px] text-tx-muted">{label}</p>
      <div className="mt-2 flex items-center gap-2">
        <span className="pixel-label shrink-0 text-[8px] text-tx-muted">{lo}</span>
        <div className="seo-range-track" aria-hidden>
          <span className="seo-range-fill" />
        </div>
        <span className="pixel-label shrink-0 text-[8px] text-tx-muted">{hi}</span>
      </div>
    </div>
  );
}

export function SeoLogLine({
  label,
  items,
}: {
  label: string;
  items: Array<{ turn: string; move: string; dmg: string }>;
}) {
  return (
    <div className="seo-log">
      <p className="pixel-label text-[8px] text-tx-muted">{label}</p>
      <ol className="mt-1">
        {items.map((item) => (
          <li key={item.turn + item.move} className="seo-log-line">
            <span className="pixel-label w-14 shrink-0 text-[8px] text-gold">{item.turn}</span>
            <span className="min-w-0 flex-1 font-display text-micro13 font-bold tracking-wide text-tx-primary">
              {item.move}
            </span>
            <span className="pixel-label shrink-0 text-[8px] text-tx-muted">{item.dmg}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

const FLOW_TYPES: PokemonType[] = ['grass', 'water', 'electric', 'fire'];

export function SeoFlow({
  items,
}: {
  items: Array<{ title: string; body: string; to: string }>;
}) {
  return (
    <ol className="seo-flow mt-6">
      {items.map((item, i) => {
        const type = FLOW_TYPES[i] ?? 'normal';
        const color = TYPE_COLORS[type].base;
        return (
          <li key={item.to + item.title} className="seo-flow-item" style={{ ['--flow' as string]: color }}>
            <span className="seo-flow-dot" aria-hidden />
            <div className="min-w-0">
              <LocaleLink
                to={item.to}
                className="font-display text-micro13 font-bold tracking-wide text-tx-primary no-underline underline-offset-4 hover:text-gold hover:underline focus-visible:text-gold focus-visible:underline"
              >
                {item.title}
              </LocaleLink>
              <p className="mt-1.5 max-w-[36ch] leading-relaxed text-tx-secondary">{item.body}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
