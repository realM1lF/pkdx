/* Shared chip row for the type SEO pages: colored pill per type, linked to
 * the type's detail page. Colors come from the design-system TYPE_COLORS. */
import type { CSSProperties } from 'react';
import TypeGlyph from '@/components/TypeGlyph';
import { LocaleLink } from '@/lib/locale-link';
import { typeDetailPath, typeName } from '@/lib/seo-types';
import { TYPE_COLORS } from '@/lib/types';
import type { PokemonType } from '@/lib/types';
import type { Lang } from '@/lib/i18n-data';
import { cn } from '@/lib/utils';

export function TypeChip({
  type,
  lang,
  mult,
  className,
}: {
  type: string;
  lang: Lang;
  /** optional multiplier suffix like ×2 */
  mult?: string;
  className?: string;
}) {
  const color = TYPE_COLORS[type as PokemonType] ?? TYPE_COLORS.normal;
  return (
    <LocaleLink
      to={typeDetailPath(lang, type)}
      data-type={type}
      className={cn(
        'inline-flex items-center gap-1 rounded-pill border px-2 py-0.5',
        'font-sans text-[11px] font-bold uppercase tracking-wide transition-colors',
        'border-[rgba(var(--t),0.4)] bg-[rgba(var(--t),0.14)] text-[rgb(var(--t))]',
        'hover:border-[rgba(var(--t),0.9)] hover:bg-[rgba(var(--t),0.25)]',
        className,
      )}
      style={{ '--t': color.rgb } as CSSProperties}
    >
      <TypeGlyph type={type} size={11} />
      {typeName(type, lang)}
      {mult && <span className="font-display text-[10px] tabular-nums">{mult}</span>}
    </LocaleLink>
  );
}

export function TypeChipRow({
  types,
  lang,
  mult,
  empty,
}: {
  types: string[];
  lang: Lang;
  mult?: (t: string) => string | undefined;
  empty: string;
}) {
  if (types.length === 0) return <span className="text-[12px] font-medium text-tx-muted">{empty}</span>;
  return (
    <span className="flex flex-wrap gap-1.5">
      {types.map((t) => (
        <TypeChip key={t} type={t} lang={lang} mult={mult?.(t)} />
      ))}
    </span>
  );
}
