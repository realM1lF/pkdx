/* <Sprite> — the mandatory sprite wrapper (design.md §10.2 rules)
 * (a) pixelated rendering pre-Gen-VI · (b) onError fallback chain
 * (c) lazy silhouette skeleton · (d) descriptive alt text. */
import { useMemo, useState } from 'react';
import { ERA_LABELS, PIXELATED_ERAS, spriteFallbackChain } from '@/lib/sprites';
import type { SpriteEra } from '@/lib/sprites';
import { cn } from '@/lib/utils';

interface SpriteProps {
  id: number;
  name: string;
  era?: SpriteEra;
  shiny?: boolean;
  back?: boolean;
  className?: string;
  /** skip lazy-loading (above-the-fold heroes) */
  eager?: boolean;
  /** show the pulsing silhouette skeleton while loading (default true) */
  skeleton?: boolean;
  onLoad?: () => void;
}

export default function Sprite({
  id,
  name,
  era = 'default',
  shiny = false,
  back = false,
  className,
  eager = false,
  skeleton = true,
  onLoad,
}: SpriteProps) {
  const chain = useMemo(() => spriteFallbackChain(era, id, shiny, back), [era, id, shiny, back]);
  const [step, setStep] = useState(0);
  const [loaded, setLoaded] = useState(false);

  /* reset on chain change — derived-state-during-render pattern */
  const [prevChain, setPrevChain] = useState(chain);
  if (prevChain !== chain) {
    setPrevChain(chain);
    setStep(0);
    setLoaded(false);
  }

  const pixelated = PIXELATED_ERAS.has(era);

  return (
    <span className={cn('relative inline-block', className)}>
      {skeleton && !loaded && (
        <img
          src="/pokeball.svg"
          alt=""
          aria-hidden
          className="absolute inset-0 m-auto h-2/3 w-2/3 animate-pulse opacity-30"
        />
      )}
      <img
        src={chain[Math.min(step, chain.length - 1)]}
        alt={`${name} — ${ERA_LABELS[era]} sprite${shiny ? ' (shiny)' : ''}`}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
        onLoad={() => {
          setLoaded(true);
          onLoad?.();
        }}
        onError={() => setStep((s) => (s < chain.length - 1 ? s + 1 : s))}
        className={cn(
          'relative h-full w-full object-contain transition-opacity duration-300',
          pixelated && 'pixelated',
          loaded ? 'opacity-100' : 'opacity-0',
        )}
      />
    </span>
  );
}
