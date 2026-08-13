/* PokemonCard — the shared grid card (design.md §9.5 + density addendum §2).
 * Comfort = full §9.5 card; Compact = 180–210px, 80px sprite, 14px name, mini chips.
 * Hover/focus: lift + type glow + sprite hop + aura up (page CSS drives the transforms
 * so Framer owns only entrance/layout motion). Legendary = rotating conic gold ring,
 * mythical = psychic-glow border. Card-level shiny overrides the global mode. */
import { memo, useEffect, useRef, useState } from 'react';
import type { CSSProperties, Ref } from 'react';
import { LocaleLink } from '@/lib/locale-link';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Sprite from './Sprite';
import TypeBadge from './TypeBadge';
import SparkleBurst from './pokedex/SparkleBurst';
import TypeChipMini from './pokedex/TypeChipMini';
import { padNum, prefetchPokemon } from '@/lib/pokeapi';
import { useShiny } from '@/lib/shiny';
import { useLanguage, nameOfPokemon } from '@/lib/i18n-data';
import { GENERATIONS, STAT_LABELS, TYPE_COLORS, genOf } from '@/lib/types';
import type { PokemonType, StatKey } from '@/lib/types';
import { dexEntryPath } from '@/lib/dex-forms-catalog';
import { FORM_I18N_KEY, type DexSummary } from './pokedex/dex-data';
import { cn } from '@/lib/utils';

const TRIAD: StatKey[] = ['hp', 'attack', 'defense'];
const EASE_OUT = [0.16, 1, 0.3, 1] as [number, number, number, number];

interface PokemonCardProps {
  summary: DexSummary;
  density: 'comfort' | 'compact';
  /** position within its batch — drives the entrance stagger */
  index?: number;
  ref?: Ref<HTMLDivElement>;
}

function PokemonCard({ summary: s, density, index = 0, ref }: PokemonCardProps) {
  const compact = density === 'compact';
  const { t } = useTranslation();
  const { shiny: globalShiny } = useShiny();
  const lang = useLanguage();
  const dexId = s.speciesId ?? s.id;
  const label = nameOfPokemon(s.slug ?? dexId, lang);
  const href = dexEntryPath({ id: s.id, name: s.slug, form: s.form });
  const genRoman = (GENERATIONS[s.gen - 1] ?? genOf(dexId)).roman;
  const [override, setOverride] = useState<boolean | null>(null);
  const [burst, setBurst] = useState(0);
  const shiny = override ?? globalShiny;

  /* Hover prefetch is debounced (150 ms): a pointer merely crossing the grid
   * while scrolling must not fire a 270–425 KB fetch per card (perf fix). */
  const hoverTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);
  const schedulePrefetch = () => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => prefetchPokemon(s.id), 150);
  };
  const cancelPrefetch = () => window.clearTimeout(hoverTimer.current);

  const t1 = (s.types[0] ?? 'normal') as PokemonType;
  const t2 = s.types[1] as PokemonType | undefined;
  const c1 = TYPE_COLORS[t1] ?? TYPE_COLORS.normal;
  const c2 = t2 ? TYPE_COLORS[t2] : undefined;

  const topTint = c2
    ? `linear-gradient(135deg, rgba(${c1.rgb},0.16), transparent 40%, transparent 60%, rgba(${c2.rgb},0.16))`
    : `linear-gradient(180deg, rgba(${c1.rgb},0.14) 0%, transparent 45%)`;

  return (
    <motion.div
      ref={ref}
      layout="position"
      initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
      transition={{
        duration: 0.5,
        ease: EASE_OUT,
        delay: Math.min(index % 24, 16) * 0.025,
        layout: { type: 'spring', stiffness: 180, damping: 22 },
      }}
      className="pdx-card-wrap group relative"
      data-type={t1}
    >
      <div
        className={cn(
          'pdx-card relative flex h-full flex-col items-center overflow-hidden rounded-lg border border-hairline bg-surface1',
          compact ? 'gap-1 p-3' : 'gap-2 p-4',
          s.legendary && 'legendary-ring',
          s.mythical && 'pdx-card--mythical',
        )}
        style={{ '--t': c1.rgb } as CSSProperties}
      >
        {/* type top-tint (dual-type: split gradient, §2.5) */}
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: topTint }} />

        {/* dex # + gen tag */}
        <div className="relative flex w-full items-start justify-between">
          <span
            className={cn(
              'pixel-label transition-colors duration-200',
              compact ? 'text-[9px]' : 'text-[10px]',
              shiny ? 'text-gold' : 'text-tx-muted',
            )}
          >
            {padNum(dexId)}
          </span>
          <span className={cn('flex min-w-0 items-center justify-end gap-1', compact ? 'text-[8px]' : 'text-[9px]')}>
            <span className="pixel-label text-tx-muted/70">GEN {genRoman}</span>
            {s.form && (
              <span className="pixel-label min-w-0 truncate text-gold">{t(FORM_I18N_KEY[s.form])}</span>
            )}
          </span>
        </div>

        {/* sprite on breathing type aura */}
        <div className={cn('relative grid shrink-0 place-items-center', compact ? 'my-0.5 h-20 w-20' : 'my-1 h-32 w-32')}>
          <div
            aria-hidden
            className="type-aura pdx-aura animate-breathe"
            style={{
              background: `radial-gradient(circle at 50% 55%, rgba(${c1.rgb},0.38) 0%, rgba(${c1.rgb},0.12) 42%, transparent 70%)`,
              ...(c2 ? { transform: 'translateX(-15%)' } : undefined),
            }}
          />
          {c2 && (
            <div
              aria-hidden
              className="type-aura pdx-aura animate-breathe"
              style={{
                background: `radial-gradient(circle at 50% 55%, rgba(${c2.rgb},0.30) 0%, rgba(${c2.rgb},0.10) 42%, transparent 70%)`,
                transform: 'translateX(15%)',
                animationDelay: '-1.6s',
              }}
            />
          )}
          <Sprite
            id={s.id}
            name={label}
            shiny={shiny}
            className={cn('pdx-sprite relative z-[1]', compact ? 'h-20 w-20' : 'h-28 w-28')}
          />
          {burst > 0 && <SparkleBurst key={burst} spread={compact ? 0.7 : 1} />}
        </div>

        {/* name */}
        <h3
          className={cn(
            'relative w-full min-w-0 truncate text-center font-display font-bold text-tx-primary',
            compact ? 'h-5 text-sm leading-5' : 'h-6 text-lg leading-6',
          )}
        >
          {label}
        </h3>

        {/* types */}
        <div className="relative flex h-5 items-center justify-center gap-1">
          {compact
            ? s.types.map((t) => <TypeChipMini key={t} type={t} />)
            : s.types.map((t) => <TypeBadge key={t} type={t} />)}
        </div>

        {/* mini stat triad: HP / ATK / DEF, 3px type-colored bars */}
        <div className={cn('relative grid w-full grid-cols-3 gap-1.5', compact ? 'mt-1' : 'mt-2')}>
          {TRIAD.map((k) => (
            <div key={k} className="flex flex-col gap-0.5">
              <span className="pixel-label text-[7px] text-tx-muted/80">{STAT_LABELS[k]}</span>
              <div className="h-[3px] overflow-hidden rounded-pill bg-surface3">
                <div
                  className="pdx-triad-bar h-full rounded-pill"
                  style={{
                    width: `${Math.min(100, ((s.stats[k] ?? 0) / 150) * 100)}%`,
                    background: `linear-gradient(90deg, ${c1.gradient[0]}, ${c1.gradient[1]})`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* stretched link — real anchor, prefetch on hover/focus */}
      <LocaleLink
        to={href}
        aria-label={`${label} — ${padNum(dexId)}`}
        onMouseEnter={schedulePrefetch}
        onMouseLeave={cancelPrefetch}
        onFocus={() => prefetchPokemon(s.id)}
        className="absolute inset-0 z-10 rounded-lg"
      />

      {/* per-card shiny corner button (32px hit area) */}
      <button
        type="button"
        aria-pressed={shiny}
        aria-label={`Toggle shiny ${label}`}
        onClick={() => {
          setOverride(!shiny);
          setBurst((b) => b + 1);
        }}
        className={cn(
          'absolute right-1 top-1 z-20 grid h-8 w-8 place-items-center rounded-md border transition-all duration-200',
          shiny
            ? 'border-gold/60 bg-gold-soft text-gold opacity-100 shadow-glow-gold'
            : 'border-transparent text-tx-muted opacity-60 hover:border-hairline2 hover:bg-surface2 hover:text-gold md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100',
        )}
      >
        <Sparkles size={14} strokeWidth={1.75} />
      </button>
    </motion.div>
  );
}

export default memo(PokemonCard);
