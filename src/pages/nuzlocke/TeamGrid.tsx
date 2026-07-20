/* Nuzlocke run — ACTIVE PARTIES team grid (nuzlocke.md §2.6).
 * players × 6 slots; click → /pokemon/:id. Boxed survivors render in the
 * always-visible BOX section below (BoxSection) — no hidden drawer. */
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { MoreVertical } from 'lucide-react';
import Sprite from '@/components/Sprite';
import { partyOf } from '@/lib/nuzlocke-store';
import type { NuzEncounterRow, RunState } from '@/lib/nuzlocke-store';
import { getPokemon, pokemonTypes } from '@/lib/pokeapi';
import { TYPE_COLORS } from '@/lib/types';
import type { PokemonType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { PixelLabel } from './ui';

function useTypes(id: number): string[] {
  const [types, setTypes] = useState<string[]>([]);
  useEffect(() => {
    let live = true;
    void getPokemon(id)
      .then((p) => {
        if (live) setTypes(pokemonTypes(p));
      })
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, [id]);
  return types;
}

function TypeChip({ type }: { type: string }) {
  const c = TYPE_COLORS[type as PokemonType];
  return (
    <span className="rounded-full px-1 text-[8px] font-bold uppercase leading-[12px]" style={{ background: `rgba(${c?.rgb ?? '168,176,181'},0.18)`, color: c?.base ?? '#A9B0B5' }}>
      {type.slice(0, 3)}
    </span>
  );
}

function PartySlot({
  enc,
  color,
  linked,
  partnerName,
  nameOf,
  onMenu,
}: {
  enc: NuzEncounterRow;
  color: string;
  linked: boolean;
  partnerName: string | null;
  nameOf: (id: number) => string;
  onMenu: (enc: NuzEncounterRow, x: number, y: number) => void;
}) {
  const navigate = useNavigate();
  const types = useTypes(enc.pokemon_id);
  return (
    <motion.div
      key={enc.id}
      layout
      exit={{ opacity: 0, scale: 0.8, y: -8, filter: 'grayscale(1)' }}
      transition={{ duration: 0.4 }}
      className="group/cell relative flex h-[72px] cursor-pointer flex-col items-center justify-center gap-0.5 rounded-sm border border-hairline bg-surface2 transition-colors"
      style={{ ['--pc' as string]: color }}
      onClick={() => navigate(`/pokemon/${enc.pokemon_id}`)}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${color}88`)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = '')}
      title={`${enc.nickname ?? nameOf(enc.pokemon_id)} — open dex entry`}
      role="link"
      aria-label={`Open ${enc.nickname ?? nameOf(enc.pokemon_id)} in the dex`}
    >
      <span className="transition-transform duration-200 group-hover/cell:-translate-y-[6%]">
        <Sprite id={enc.pokemon_id} name={nameOf(enc.pokemon_id)} className="h-[36px] w-[36px]" skeleton={false} />
      </span>
      <span className="max-w-full truncate px-1 text-[10px] font-semibold leading-tight text-tx-primary">{enc.nickname ?? nameOf(enc.pokemon_id)}</span>
      <span className="flex items-center gap-1">
        <span className="font-display text-[8px] font-bold text-tx-muted">LV {enc.level}</span>
        {types.slice(0, 2).map((t) => (
          <TypeChip key={t} type={t} />
        ))}
      </span>
      {linked && (
        <img src="/sparkle.svg" alt="" className="absolute left-1 top-1 h-1.5 w-1.5" title={partnerName ? `SoulLinked with ${partnerName}` : 'SoulLinked'} />
      )}
      <button
        type="button"
        aria-label="Encounter options"
        onClick={(e) => {
          e.stopPropagation();
          onMenu(enc, e.clientX, e.clientY);
        }}
        className="absolute right-0.5 top-0.5 grid h-5 w-5 place-items-center rounded-sm text-tx-muted opacity-0 transition-opacity hover:text-gold group-hover/cell:opacity-100"
      >
        <MoreVertical size={11} />
      </button>
    </motion.div>
  );
}

export default function TeamGrid({
  state,
  online,
  nameOf,
  linkPartner,
  onMenu,
}: {
  state: RunState;
  online: Record<string, { name: string; color: string }>;
  nameOf: (id: number) => string;
  linkPartner: (encId: string) => NuzEncounterRow | null;
  onMenu: (enc: NuzEncounterRow, x: number, y: number) => void;
}) {
  const players = useMemo(() => [...state.players].sort((a, b) => a.slot - b.slot), [state.players]);

  return (
    <section className="rounded-lg border border-hairline bg-surface1 p-4" aria-label="Active parties">
      <div className="flex items-baseline gap-3">
        <h4 className="font-sans text-[15px] font-bold text-tx-primary">ACTIVE PARTIES</h4>
        <PixelLabel>LAST 6 ALIVE PER PLAYER · REST ARE BOXED</PixelLabel>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-4">
        {players.map((p, pi) => {
          const party = partyOf(state, p.id);
          return (
            <motion.div
              key={p.id}
              initial={{ y: 16, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: pi * 0.06 }}
              className="rounded-md border border-hairline bg-surface2/40 p-2.5"
            >
              <div className="flex h-8 items-center gap-1.5">
                <span className={cn('h-2.5 w-2.5 rounded-full', online[p.id] && 'nz-presence-ring')} style={{ background: p.color }} />
                <span className="font-display text-[13px] font-bold text-tx-primary">{p.name}</span>
                <span className="ml-auto text-[10px] tabular-nums text-tx-muted">{party.length}/6</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <AnimatePresence mode="popLayout">
                  {party.map((enc) => {
                    const partner = linkPartner(enc.id);
                    const partnerOwner = partner ? state.players.find((pl) => pl.id === partner.player_id) : null;
                    return (
                      <PartySlot
                        key={enc.id}
                        enc={enc}
                        color={p.color}
                        linked={!!partner}
                        partnerName={partner ? `${partnerOwner?.name ?? '?'}'s ${partner.nickname ?? nameOf(partner.pokemon_id)}` : null}
                        nameOf={nameOf}
                        onMenu={onMenu}
                      />
                    );
                  })}
                </AnimatePresence>
                {Array.from({ length: 6 - party.length }).map((_, i) => (
                  <div key={`e${i}`} className="grid h-[72px] place-items-center rounded-sm border border-dashed border-hairline2">
                    <span className="h-1.5 w-1.5 rounded-full bg-tx-muted/40" />
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
