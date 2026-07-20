/* TypeGlyph — renders one of the 18 custom type SVGs (design.md §9.4).
 * Uses a CSS mask so the glyph inherits currentColor and can glow via drop-shadow. */
import type { CSSProperties } from 'react';
import type { PokemonType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TypeGlyphProps {
  type: PokemonType | string;
  size?: number;
  className?: string;
  style?: CSSProperties;
}

export default function TypeGlyph({ type, size = 20, className, style }: TypeGlyphProps) {
  const url = `url(/type-icon-${type}.svg)`;
  return (
    <span
      aria-hidden
      className={cn('inline-block shrink-0', className)}
      style={{
        width: size,
        height: size,
        backgroundColor: 'currentColor',
        WebkitMaskImage: url,
        maskImage: url,
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        ...style,
      }}
    />
  );
}
