/* TypeBadge — pill per design.md §9.3. Colors driven by --t (type rgb triplet). */
import type { CSSProperties } from 'react';
import TypeGlyph from './TypeGlyph';
import { useLanguage, nameOfType } from '@/lib/i18n-data';
import { TYPE_COLORS } from '@/lib/types';
import type { PokemonType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TypeBadgeProps {
  type: PokemonType | string;
  /** always emit the hover glow (detail hero) */
  glow?: boolean;
  className?: string;
}

export default function TypeBadge({ type, glow = false, className }: TypeBadgeProps) {
  const lang = useLanguage();
  const color = TYPE_COLORS[type as PokemonType] ?? TYPE_COLORS.normal;
  return (
    <span
      data-type={type}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-pill border px-3 py-1',
        'font-sans text-xs font-bold uppercase tracking-wide',
        'transition-all duration-200 ease-out-expo',
        'border-[rgba(var(--t),0.4)] bg-[rgba(var(--t),0.16)] text-[rgb(var(--t))]',
        'hover:border-[rgba(var(--t),0.9)] hover:bg-[rgba(var(--t),0.9)] hover:text-abyss',
        'hover:shadow-[0_0_16px_rgba(var(--t),0.5)]',
        glow && 'shadow-[0_0_16px_rgba(var(--t),0.5)] border-[rgba(var(--t),0.9)]',
        className,
      )}
      style={{ '--t': color.rgb } as CSSProperties}
    >
      <TypeGlyph type={type} size={14} />
      {nameOfType(String(type), lang)}
    </span>
  );
}
