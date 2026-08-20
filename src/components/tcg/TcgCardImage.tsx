/* TcgCardImage — tcg card art with URL fallback chain (TCGdex EN + pokemontcg.io). */
import { useEffect, useMemo, useState } from 'react';
import type { Lang } from '@/lib/i18n-data';
import type { TcgCardSummary } from '@/lib/tcg-types';
import { tcgImageCandidates } from '@/lib/tcg-types';
import { cn } from '@/lib/utils';

export default function TcgCardImage({
  card,
  lang,
  className,
  preferLow = false,
}: {
  card: TcgCardSummary;
  lang: Lang;
  className?: string;
  preferLow?: boolean;
}) {
  const candidates = useMemo(() => tcgImageCandidates(card, lang, preferLow), [card, lang, preferLow]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setIdx(0);
  }, [card.id, candidates]);

  const exhausted = idx >= candidates.length;
  const src = exhausted ? undefined : candidates[idx];

  if (!src) {
    return (
      <div className={cn('tcg-card-art grid place-items-center bg-surface3 text-tx-muted', className)}>
        <span className="pixel-label text-[8px]">?</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt=""
      className={cn('tcg-card-art', className)}
      loading="lazy"
      decoding="async"
      fetchPriority="low"
      onError={() => {
        setIdx((i) => i + 1);
      }}
    />
  );
}
