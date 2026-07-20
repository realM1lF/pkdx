/* Nuzlocke run — visible BOX storage (nuzlocke.md §2.6 extension).
 * Alive catches beyond the party of 6 land here (boxedOf). Per player a dense
 * row: color chip + name + count, then 40px sprite cells with nickname / level /
 * route micro-labels. Replaces the old hidden overflow drawer — the box is
 * always on the deck, between ACTIVE PARTIES and THE FALLEN. */
import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import Sprite from '@/components/Sprite';
import { boxedOf } from '@/lib/nuzlocke-store';
import type { NuzEncounterRow, RunState } from '@/lib/nuzlocke-store';
import { PixelLabel } from './ui';

function BoxCell({
  enc,
  color,
  nameOf,
  routeLabel,
  index,
}: {
  enc: NuzEncounterRow;
  color: string;
  nameOf: (id: number) => string;
  routeLabel: (key: string) => string;
  index: number;
}) {
  const navigate = useNavigate();
  const nick = enc.nickname ?? nameOf(enc.pokemon_id);
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.25, delay: Math.min(index, 10) * 0.03 }}
      onClick={() => navigate(`/pokemon/${enc.pokemon_id}`)}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${color}88`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '';
      }}
      title={`${nick} — LV ${enc.level} · caught on ${routeLabel(enc.route_key)} — open dex entry`}
      aria-label={`Open ${nick} in the dex`}
      className="group/box flex w-[64px] flex-col items-center gap-0 rounded-sm border border-hairline bg-surface2/60 px-1 pb-1 pt-0.5 transition-colors duration-150"
    >
      <span className="transition-transform duration-200 group-hover/box:-translate-y-[6%]">
        <Sprite id={enc.pokemon_id} name={nameOf(enc.pokemon_id)} className="h-[40px] w-[40px]" skeleton={false} />
      </span>
      <span className="max-w-full truncate text-[9px] font-semibold leading-tight text-tx-primary">{nick}</span>
      <span className="font-display text-[7px] font-bold tabular-nums text-tx-muted">LV {enc.level}</span>
      <span className="max-w-full truncate font-pixel text-[6px] uppercase leading-[1.6] text-tx-muted/80">
        {routeLabel(enc.route_key)}
      </span>
    </motion.button>
  );
}

export default function BoxSection({
  state,
  nameOf,
  routeLabel,
}: {
  state: RunState;
  nameOf: (id: number) => string;
  routeLabel: (key: string) => string;
}) {
  const players = useMemo(() => [...state.players].sort((a, b) => a.slot - b.slot), [state.players]);
  const total = players.reduce((n, p) => n + boxedOf(state, p.id).length, 0);

  return (
    <section className="rounded-lg border border-hairline bg-surface1 p-4" aria-label="Box storage">
      <div className="flex items-baseline gap-3">
        <h4 className="font-sans text-[15px] font-bold text-tx-primary">BOX</h4>
        <PixelLabel>SURVIVORS BEYOND THE PARTY OF 6</PixelLabel>
        <span className="ml-auto font-display text-[12px] font-bold tabular-nums text-tx-muted">{total} BOXED</span>
      </div>
      <div className="mt-3">
        {players.map((p) => {
          const boxed = boxedOf(state, p.id);
          return (
            <div
              key={p.id}
              className="flex flex-col gap-2 border-t border-hairline py-2 first:border-t-0 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:gap-3"
            >
              {/* identity cluster: color chip + name + boxed count */}
              <div className="flex h-10 w-full shrink-0 items-center gap-1.5 sm:w-[140px]">
                <span className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ background: p.color }} />
                <span className="truncate font-display text-[12px] font-bold text-tx-primary">{p.name}</span>
                <span className="ml-auto text-[10px] tabular-nums text-tx-muted">{boxed.length}</span>
              </div>
              {boxed.length === 0 ? (
                <div className="grid h-10 flex-1 place-items-center rounded-sm border border-dashed border-hairline2 opacity-50">
                  <PixelLabel>BOX EMPTY</PixelLabel>
                </div>
              ) : (
                <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
                  {boxed.map((enc, i) => (
                    <BoxCell key={enc.id} enc={enc} color={p.color} nameOf={nameOf} routeLabel={routeLabel} index={i} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
