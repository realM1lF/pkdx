/* TcgGallery — EP4.3: pokemontcg.io card wall on the detail page. Fetches
 * only when scrolled into view (IntersectionObserver), card images lazy,
 * cached 24h (src/lib/tcg.ts). SILENT fallback: on error/empty the section
 * renders nothing at all. Click opens the large scan in a new tab. */
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink } from 'lucide-react';
import { fetchTcgCards } from '@/lib/tcg';
import type { TcgCard } from '@/lib/tcg';

type Phase = 'idle' | 'loading' | 'ready' | 'hidden';

export default function TcgGallery({ enName }: { enName: string }) {
  const { t } = useTranslation();
  const rootRef = useRef<HTMLElement | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [cards, setCards] = useState<TcgCard[]>([]);

  /* fetch only once the section approaches the viewport */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          obs.disconnect();
          setPhase('loading');
          void fetchTcgCards(enName).then((result) => {
            if (!result.length) setPhase('hidden');
            else {
              setCards(result);
              setPhase('ready');
            }
          });
        }
      },
      { rootMargin: '240px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [enName]);

  if (phase === 'hidden') return null;

  return (
    <section ref={rootRef} aria-label={t('detail.tcg.title')} className="mt-6">
      <div className="mb-2 flex items-center gap-2">
        <span className="pixel-label text-[8px] text-gold">{t('detail.tcg.title')}</span>
        <span className="h-px flex-1 bg-hairline" />
        <a
          href={`https://pokemontcg.io/cards?q=name:${encodeURIComponent(enName)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 font-pixel text-[6px] text-tx-muted transition-colors hover:text-gold"
        >
          {t('detail.tcg.more')}
          <ExternalLink size={9} />
        </a>
      </div>
      {phase === 'ready' ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
          {cards.map((c) => (
            <a
              key={c.id}
              href={c.imageLarge}
              target="_blank"
              rel="noopener noreferrer"
              title={`${c.name} · ${c.setName}`}
              className="group overflow-hidden rounded-[6px] border border-hairline bg-surface1 transition-all hover:-translate-y-0.5 hover:border-gold/60 hover:shadow-[0_4px_18px_rgba(246,201,69,0.18)]"
            >
              <img
                src={c.imageSmall}
                alt={`${c.name} · ${c.setName}`}
                loading="lazy"
                className="aspect-[63/88] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </a>
          ))}
        </div>
      ) : (
        /* skeleton while loading (idle renders the same placeholder height) */
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6" aria-hidden>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[63/88] animate-pulse rounded-[6px] border border-hairline bg-surface1" />
          ))}
        </div>
      )}
    </section>
  );
}
