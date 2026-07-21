/* Nuzlocke run — THE FALLEN graveyard (nuzlocke.md §2.7).
 * Grayscale, strikethrough, smaller, memorial candle dots. Never red. */
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Sprite from '@/components/Sprite';
import { graveyardOf } from '@/lib/nuzlocke-store';
import type { RunState } from '@/lib/nuzlocke-store';
import { PixelLabel } from './ui';

export default function Graveyard({ state, nameOf, routeLabel }: { state: RunState; nameOf: (id: number) => string; routeLabel: (key: string) => string }) {
  const { t } = useTranslation();
  const fallen = graveyardOf(state);
  return (
    <section className="rounded-lg border border-hairline bg-surface1/70 p-4" aria-label={t('nuz.graveyard.aria')}>
      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(246,201,69,0.2)] to-transparent" />
      <div className="mt-3 flex items-baseline gap-3">
        <h4 className="font-sans text-[15px] font-bold text-tx-primary">{t('nuz.graveyard.title')}</h4>
        <span className="font-display text-[16px] font-bold tabular-nums text-tx-muted">{fallen.length}</span>
        <PixelLabel className="opacity-30">PRESS F</PixelLabel>
      </div>
      <div className="nz-slim-scroll mt-3 flex gap-3 overflow-x-auto pb-1">
        {fallen.length === 0 ? (
          <div className="grid h-[140px] w-[120px] shrink-0 place-items-center rounded-md border border-dashed border-hairline2">
            <span className="px-2 text-center text-[11px] text-tx-muted">{t('nuz.graveyard.empty')}</span>
          </div>
        ) : (
          fallen.map((enc, i) => {
            const owner = state.players.find((p) => p.id === enc.player_id);
            return (
              <motion.div
                key={enc.id}
                initial={{ x: -16, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                title={enc.note ?? `${enc.nickname ?? nameOf(enc.pokemon_id)} — ${owner?.name ?? ''}`}
                className="flex h-[140px] w-[120px] shrink-0 flex-col items-center justify-center gap-1 rounded-md border border-hairline bg-surface2/60"
              >
                <span className="nz-dead-chip inline-block">
                  <Sprite id={enc.pokemon_id} name={nameOf(enc.pokemon_id)} className="h-[48px] w-[48px]" skeleton={false} />
                </span>
                <span className="max-w-[104px] truncate text-[11px] font-semibold text-tx-muted line-through">{enc.nickname ?? nameOf(enc.pokemon_id)}</span>
                <span className="font-display text-[9px] font-bold text-tx-muted/70">LV {enc.level}</span>
                <span className="font-pixel text-[6px] uppercase tracking-[0.06em] text-tx-muted/60">{routeLabel(enc.route_key)}</span>
                <span className="nz-flicker mt-0.5 h-2 w-2 rounded-full border border-gold/70" aria-hidden />
              </motion.div>
            );
          })
        )}
      </div>
    </section>
  );
}
