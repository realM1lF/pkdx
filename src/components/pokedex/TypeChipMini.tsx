/* TypeChipMini — compact local wrapper around TypeBadge visuals (density addendum §5:
 * tighter variants via local wrappers, shared files untouched). 10px text, 4×8 padding. */
import type { CSSProperties } from 'react';
import TypeGlyph from '@/components/TypeGlyph';
import { useLanguage, nameOfType } from '@/lib/i18n-data';
import { TYPE_COLORS } from '@/lib/types';
import type { PokemonType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TypeChipMiniProps {
  type: PokemonType | string;
  /** glyph-only (tight list rows) */
  iconOnly?: boolean;
  className?: string;
}

export default function TypeChipMini({ type, iconOnly = false, className }: TypeChipMiniProps) {
  const lang = useLanguage();
  const color = TYPE_COLORS[type as PokemonType] ?? TYPE_COLORS.normal;
  const label = nameOfType(String(type), lang);
  return (
    <span
      data-type={type}
      title={iconOnly ? label : undefined}
      className={cn(
        'inline-flex shrink-0 items-center gap-1 rounded-pill border px-1.5 py-px',
        'font-sans text-[10px] font-bold uppercase leading-[1.5] tracking-wide',
        className,
      )}
      style={
        {
          borderColor: `rgba(${color.rgb},0.4)`,
          background: `rgba(${color.rgb},0.16)`,
          color: color.base,
        } as CSSProperties
      }
    >
      <TypeGlyph type={type} size={10} />
      {!iconOnly && label}
    </span>
  );
}
