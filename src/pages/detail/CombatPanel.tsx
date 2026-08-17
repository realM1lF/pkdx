/* Combat panel — density-addendum §3 Row 1 (span 5).
 * StatBars (5 in Gen 1, 6 from Gen 2) + BARS/RADAR + BST ring. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { animate, motion, useInView, useMotionValue, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import HonestyHint from '@/components/HonestyHint';
import StatBar from '@/components/StatBar';
import type { GenStatBlock } from '@/lib/gen-dex';
import { bstOf, genHasMechanics, statKeysForGen, statLabelForGen, statsFromPokemon } from '@/lib/gen-dex';
import type { Pokemon, PokemonType, StatKey } from '@/lib/types';
import { cn } from '@/lib/utils';
import { typeRgb } from './data';
import { SegmentedControl } from './ui';

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* ---------- radar hexagon ---------- */

function RadarPoly({ values, type, labels }: { values: number[]; type: string; labels: string[] }) {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const size = 176;
  const cx = size / 2;
  const cy = size / 2;
  const R = size / 2 - 26;
  const rgb = typeRgb(type);
  const n = Math.max(3, values.length);

  const point = (i: number, r: number) => {
    const angle = ((2 * Math.PI) / n) * i - Math.PI / 2;
    return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r] as const;
  };

  const statPoints = values.map((v, i) => point(i, (Math.min(v, 180) / 180) * R));
  const polygon = statPoints.map(([x, y]) => `${x},${y}`).join(' ');

  return (
    <div ref={ref} className="flex justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={t('detail.combat.statRadar')}>
        {/* grid rings */}
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <polygon
            key={f}
            points={Array.from({ length: n }, (_, i) => point(i, R * f).join(',')).join(' ')}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
          />
        ))}
        {/* axes */}
        {Array.from({ length: n }, (_, i) => {
          const [x, y] = point(i, R);
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />;
        })}
        {/* stat polygon */}
        <motion.polygon
          points={polygon}
          fill={`rgba(${rgb},0.18)`}
          stroke={`rgb(${rgb})`}
          strokeWidth={2}
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : undefined}
          transition={{ type: 'spring', stiffness: 180, damping: 22 }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
        {statPoints.map(([x, y], i) => (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r={3}
            fill={`rgb(${rgb})`}
            initial={{ scale: 0 }}
            animate={inView ? { scale: [0, 1.6, 1] } : undefined}
            transition={{ delay: 0.5 + i * 0.06, duration: 0.4 }}
          />
        ))}
        {/* axis labels */}
        {labels.map((l, i) => {
          const [x, y] = point(i, R + 15);
          return (
            <text
              key={l}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-tx-muted"
              style={{ fontFamily: '"Press Start 2P", monospace', fontSize: 7, letterSpacing: '0.08em' }}
            >
              {l}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

/* ---------- BST ring ---------- */

/* tier labels resolve through detail.combat.* i18n keys */
function bstTierKey(bst: number): string {
  if (bst >= 600) return 'detail.combat.elite';
  if (bst >= 500) return 'detail.combat.strong';
  if (bst >= 420) return 'detail.combat.average';
  return 'detail.combat.belowAverage';
}

function BstRing({ bst, legendary }: { bst: number; legendary: boolean }) {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) => String(Math.round(v)));
  const C = 2 * Math.PI * 26; // r=26

  useEffect(() => {
    if (!inView) return;
    const c = animate(mv, bst, { duration: 1, ease: EASE });
    return () => c.stop();
  }, [inView, bst, mv]);

  const frac = Math.min(1, bst / 720);

  return (
    <div ref={ref} className="flex items-center gap-3">
      <div className="relative h-16 w-16">
        <svg width={64} height={64} viewBox="0 0 64 64" className="-rotate-90">
          <circle cx={32} cy={32} r={26} fill="none" stroke="var(--surface-3)" strokeWidth={5} />
          <motion.circle
            cx={32}
            cy={32}
            r={26}
            fill="none"
            stroke="url(#bst-gold)"
            strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray={C}
            initial={{ strokeDashoffset: C }}
            animate={inView ? { strokeDashoffset: C * (1 - frac) } : undefined}
            transition={{ duration: 1, ease: EASE }}
            style={legendary ? { filter: 'drop-shadow(0 0 6px rgba(246,201,69,0.6))' } : undefined}
          />
          <defs>
            <linearGradient id="bst-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F6C945" />
              <stop offset="100%" stopColor="#E8A520" />
            </linearGradient>
          </defs>
        </svg>
        <motion.span className="absolute inset-0 grid place-items-center font-display text-[15px] font-extrabold text-gold tabular-nums">
          {display}
        </motion.span>
      </div>
      <div className="min-w-0">
        <div className="pixel-label text-[8px] text-tx-muted">{t('detail.combat.bst')}</div>
        <div
          className={cn(
            'mt-1 inline-block rounded-pill border px-2 py-px font-sans text-[10px] font-bold tracking-wide',
            bst >= 500 ? 'border-gold/50 bg-gold-soft text-gold' : 'border-hairline text-tx-secondary',
          )}
        >
          {t(bstTierKey(bst))}
        </div>
      </div>
    </div>
  );
}

/* ---------- combat panel ---------- */

export default function CombatPanel({
  pokemon,
  legendary = false,
  stats,
  types: typesProp,
  gen = 9,
  vgId,
}: {
  pokemon: Pokemon;
  legendary?: boolean;
  stats?: GenStatBlock;
  types?: PokemonType[];
  gen?: number;
  vgId?: string;
}) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'bars' | 'radar'>('bars');
  const types = typesProp ?? pokemon.types.map((t) => t.type.name);
  const primary = types[0] ?? 'normal';
  const block = stats ?? statsFromPokemon(pokemon);
  const keys = statKeysForGen(gen);
  const bst = bstOf(block, gen);
  const values = useMemo(() => keys.map((k: StatKey) => block[k]), [block, keys]);
  const labels = useMemo(() => keys.map((k) => statLabelForGen(k, gen)), [keys, gen]);
  const showEvs = vgId ? genHasMechanics(vgId).evs : gen >= 3;
  const evChips = showEvs
    ? pokemon.stats
        .filter((s) => s.effort > 0)
        .map((s) => `+${s.effort} ${statLabelForGen(s.stat.name as StatKey, gen)}`)
    : [];

  return (
    <div className="flex h-full flex-col gap-3 p-4 md:p-5">
      <HonestyHint show={gen < 2}>
        {t('honesty.gen1Special')}
      </HonestyHint>
      <div className="flex items-center justify-between">
        <span className="pixel-label text-[8px] text-tx-muted">{t('detail.combat.fillNote')}</span>
        <SegmentedControl
          id="combat-mode"
          size="xs"
          ariaLabel={t('detail.combat.statViz')}
          value={mode}
          onChange={(v) => setMode(v as 'bars' | 'radar')}
          options={[
            { value: 'bars', label: t('detail.combat.bars') },
            { value: 'radar', label: t('detail.combat.radar') },
          ]}
        />
      </div>

      <div className="min-h-[176px] flex-1">
        {mode === 'bars' ? (
          <div className="flex h-full flex-col justify-center gap-2.5">
            {keys.map((k, i) => (
              <StatBar key={`${pokemon.id}-${k}-${block[k]}`} label={statLabelForGen(k, gen)} value={block[k]} type={primary} delay={i * 90} />
            ))}
          </div>
        ) : (
          <RadarPoly key={`${pokemon.id}-${bst}`} values={values} type={primary} labels={labels} />
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-3">
        <BstRing key={`${pokemon.id}-${bst}`} bst={bst} legendary={legendary} />
        <div className="flex flex-col items-end gap-1">
          <span className="pixel-label text-[8px] text-tx-muted">{t('detail.combat.evYield')}</span>
          <div className="flex gap-1">
            {evChips.length ? (
              evChips.map((c) => (
                <span
                  key={c}
                  className="rounded-pill border border-hairline bg-surface2 px-1.5 py-px font-sans text-[10px] font-semibold text-tx-secondary"
                >
                  {c}
                </span>
              ))
            ) : (
              <span className="font-sans text-[11px] text-tx-muted">—</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
