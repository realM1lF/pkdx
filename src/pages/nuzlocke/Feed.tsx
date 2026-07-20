/* Nuzlocke run — activity rail (nuzlocke.md §2.8). 36px rows, live dot,
 * event glyphs, player-color left flash, milestone rows. */
import { motion } from 'framer-motion';
import { Plus, SlidersHorizontal } from 'lucide-react';
import type { FeedEvent } from '@/lib/nuzlocke-store';
import { cn } from '@/lib/utils';
import { PixelLabel, timeAgo } from './ui';

function FeedGlyph({ ev }: { ev: FeedEvent }) {
  if (ev.kind === 'catch') return <img src="/pokeball.svg" alt="" className="h-2.5 w-2.5" />;
  if (ev.kind === 'death') return <span className="h-2 w-2 rounded-full border border-gold/70" />;
  if (ev.kind === 'link' || ev.kind === 'milestone') return <img src="/sparkle.svg" alt="" className="h-2.5 w-2.5" />;
  if (ev.kind === 'join') return <Plus size={10} className="text-tx-muted" />;
  if (ev.kind === 'rule' || ev.kind === 'status') return <SlidersHorizontal size={10} className="text-tx-muted" />;
  if (ev.kind === 'presence') return <span className="h-1.5 w-1.5 rounded-full bg-[#45C8FF]/60" />;
  return <span className="h-1.5 w-1.5 rounded-full border border-gold/70" />;
}

export default function Feed({ feed, live }: { feed: FeedEvent[]; live: boolean }) {
  return (
    <aside className="rounded-lg border border-hairline bg-surface1 p-3" aria-label="Activity feed">
      <div className="flex items-center gap-2">
        <h4 className="font-sans text-[14px] font-bold text-tx-primary">FEED</h4>
        {live && <span className="nz-dot-live h-1.5 w-1.5 rounded-full bg-[#45C8FF]" />}
      </div>
      <div className="nz-slim-scroll mt-2 max-h-[420px] space-y-px overflow-y-auto">
        {feed.length === 0 && <p className="py-6 text-center text-[11px] text-tx-muted">Nothing yet. Route 1 awaits.</p>}
        {feed.map((ev) => (
          <motion.div
            key={ev.id}
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: ev.kind === 'presence' ? 0.4 : 1 }}
            transition={{ duration: 0.25 }}
            className={cn(
              'flex min-h-[36px] items-center gap-2 rounded-sm border-l-2 px-2 py-1',
              ev.kind === 'milestone' ? 'border-gold bg-gold/5' : 'border-transparent',
            )}
            style={ev.kind !== 'milestone' ? { borderLeftColor: ev.color ? `${ev.color}55` : 'transparent' } : undefined}
          >
            <span className="shrink-0">
              <FeedGlyph ev={ev} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[11px] leading-tight text-tx-secondary">{ev.title}</span>
              {ev.meta && <span className="block font-pixel text-[6px] uppercase tracking-[0.06em] text-tx-muted">{ev.meta}</span>}
            </span>
            <span className="shrink-0 text-[9px] tabular-nums text-tx-muted">{timeAgo(ev.t).replace(' AGO', '')}</span>
          </motion.div>
        ))}
      </div>
      <PixelLabel className="mt-2 block text-right opacity-40">{feed.length} EVENTS</PixelLabel>
    </aside>
  );
}
