/* Prev/Next strip — density-addendum §3: 40px bar, arrows + neighbor names/sprites,
 * swipe on mobile (framer drag x, threshold 60px, rubber-band back). */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Sprite from '@/components/Sprite';
import { bootNameIndex, padNum, prefetchPokemon } from '@/lib/pokeapi';
import { MAX_DEX_ID } from '@/lib/types';
import { cn } from '@/lib/utils';

function NeighborButton({ id, dir }: { id: number; dir: 'prev' | 'next' }) {
  const navigate = useNavigate();
  const [name, setName] = useState<string>(`#${id}`);

  useEffect(() => {
    let on = true;
    bootNameIndex()
      .then((idx) => {
        const entry = idx.find((e) => e.id === id);
        if (on && entry) setName(entry.label);
      })
      .catch(() => undefined);
    return () => {
      on = false;
    };
  }, [id]);

  const Arrow = dir === 'prev' ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={() => navigate(`/pokemon/${id}`)}
      onMouseEnter={() => prefetchPokemon(id)}
      onFocus={() => prefetchPokemon(id)}
      className={cn(
        'group flex h-full min-w-0 flex-1 items-center gap-2 px-3 transition-colors duration-150 hover:bg-surface3',
        dir === 'next' && 'flex-row-reverse text-right',
      )}
      aria-label={`${dir === 'prev' ? 'Previous' : 'Next'} Pokémon: ${name}`}
    >
      <Arrow size={15} strokeWidth={2} className="shrink-0 text-tx-muted transition-all duration-150 group-hover:text-gold" />
      <span className="relative h-7 w-7 shrink-0">
        <Sprite id={id} name={name} era="default" skeleton={false} />
      </span>
      <span className="min-w-0 truncate font-sans text-[12px] font-semibold text-tx-secondary transition-colors group-hover:text-tx-primary">
        {name}
      </span>
      <span className="pixel-label hidden shrink-0 text-[8px] text-tx-muted sm:inline">{padNum(id)}</span>
    </button>
  );
}

export default function PrevNextStrip({ id }: { id: number }) {
  const navigate = useNavigate();
  const prev = id > 1 ? id - 1 : MAX_DEX_ID;
  const next = id < MAX_DEX_ID ? id + 1 : 1;

  return (
    <motion.nav
      aria-label="Neighboring Pokédex entries"
      className="flex h-10 items-stretch overflow-hidden rounded-xl border border-hairline bg-surface1"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.18}
      onDragEnd={(_e, info) => {
        if (info.offset.x <= -60) navigate(`/pokemon/${next}`);
        else if (info.offset.x >= 60) navigate(`/pokemon/${prev}`);
      }}
    >
      <NeighborButton id={prev} dir="prev" />
      <span className="flex shrink-0 items-center border-x border-hairline px-3">
        <span className="pixel-label text-[8px] text-gold">{padNum(id)}</span>
      </span>
      <NeighborButton id={next} dir="next" />
    </motion.nav>
  );
}
