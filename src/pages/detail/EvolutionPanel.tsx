/* Evolution panel — density-addendum §3 Row 3.
 * Horizontal compact chain (64px sprites), measured SVG connectors that draw
 * themselves on scroll (framer pathLength), condition chips at line midpoints,
 * branching support (Eevee-style), click navigates. */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Sprite from '@/components/Sprite';
import { getEvolutionChain, evolutionChainId, padNum, prefetchPokemon } from '@/lib/pokeapi';
import { nameOfPokemon, useLanguage, type Lang } from '@/lib/i18n-data';
import type { ChainLink, EvolutionChain, PokemonSpecies } from '@/lib/types';
import { cn } from '@/lib/utils';
import { evoCondition } from './data';
import type { EvoCondition } from './data';

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* ---------- tree parsing ---------- */

interface EvoStage {
  key: string;
  name: string;
  id: number;
  condition: EvoCondition | null;
  children: EvoStage[];
}

function parseChain(link: ChainLink, lang: Lang): EvoStage {
  const id = Number(link.species.url.replace(/\/$/, '').split('/').pop());
  return {
    key: link.species.name,
    name: link.species.name,
    id,
    condition: link.evolution_details.length ? evoCondition(link.evolution_details, lang) : null,
    children: link.evolves_to.map((c) => parseChain(c, lang)),
  };
}

/* ---------- stage card ---------- */

function StageCard({
  stage,
  currentId,
  registerRef,
}: {
  stage: EvoStage;
  currentId: number;
  registerRef: (key: string, el: HTMLButtonElement | null) => void;
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const lang = useLanguage();
  const label = nameOfPokemon(stage.id, lang);
  const current = stage.id === currentId;
  return (
    <div className="relative flex flex-col items-center">
      {current && (
        <motion.span
          className="pixel-label absolute -top-4 left-1/2 z-10 whitespace-nowrap rounded-pill border border-gold/40 bg-void/90 px-1.5 py-px text-[8px] text-gold"
          style={{ x: '-50%' }}
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {t('detail.evo.youAreHere')}
        </motion.span>
      )}
      <button
        ref={(el) => registerRef(stage.key, el)}
        type="button"
        onClick={() => !current && navigate(`/pokemon/${stage.id}`)}
        onMouseEnter={() => prefetchPokemon(stage.id)}
        onFocus={() => prefetchPokemon(stage.id)}
        aria-label={current ? t('detail.evo.currentEntry', { name: label }) : t('detail.evo.openEntry', { name: label })}
        className={cn(
          'group relative flex w-[96px] flex-col items-center gap-0.5 rounded-lg border px-1.5 py-1.5 transition-all duration-200',
          current
            ? 'border-gold/80 bg-gold-soft shadow-[0_0_0_1px_rgba(246,201,69,0.4),0_0_18px_rgba(246,201,69,0.2)]'
            : 'border-hairline bg-surface2 hover:-translate-y-0.5 hover:border-hairline2',
        )}
      >
        <span className="relative grid h-16 w-16 place-items-center">
          <span
            aria-hidden
            className="type-aura animate-breathe"
            style={{
              background: `radial-gradient(circle, rgba(${current ? '246,201,69' : '120,150,255'},0.25), transparent 70%)`,
              opacity: current ? 1 : 0.6,
            }}
          />
          <span className="relative h-16 w-16 transition-transform duration-300 group-hover:scale-110">
            <Sprite id={stage.id} name={label} era={stage.id <= 649 ? 'gen5' : 'default'} />
          </span>
        </span>
        <span className="max-w-full truncate font-display text-[11px] font-bold uppercase text-tx-primary">
          {label}
        </span>
        <span className="pixel-label text-[8px] text-tx-muted">{padNum(stage.id)}</span>
      </button>
    </div>
  );
}

/* ---------- recursive node ---------- */

function EvoNode({
  stage,
  currentId,
  registerRef,
}: {
  stage: EvoStage;
  currentId: number;
  registerRef: (key: string, el: HTMLButtonElement | null) => void;
}) {
  return (
    <div className="flex items-center">
      <StageCard stage={stage} currentId={currentId} registerRef={registerRef} />
      {stage.children.length > 0 && (
        <div className="flex flex-col justify-center gap-5 pl-24">
          {stage.children.map((c) => (
            <EvoNode key={c.key} stage={c} currentId={currentId} registerRef={registerRef} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- edges ---------- */

interface Edge {
  key: string;
  d: string;
  midX: number;
  midY: number;
  condition: EvoCondition;
  rgb: string;
}

function collectEdges(stage: EvoStage, out: Array<[EvoStage, EvoStage]> = []): Array<[EvoStage, EvoStage]> {
  for (const c of stage.children) {
    out.push([stage, c]);
    collectEdges(c, out);
  }
  return out;
}

/* ---------- panel body ---------- */

export default function EvolutionPanel({ species, currentId }: { species: PokemonSpecies | null; currentId: number }) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const [chain, setChain] = useState<EvolutionChain | null>(null);
  const [failed, setFailed] = useState(false);

  /* reset on species change (derived-state-during-render) */
  const speciesId = species ? evolutionChainId(species) : 0;
  const [prevSpeciesId, setPrevSpeciesId] = useState(speciesId);
  if (prevSpeciesId !== speciesId) {
    setPrevSpeciesId(speciesId);
    setChain(null);
    setFailed(false);
  }

  useEffect(() => {
    if (!species) return;
    let on = true;
    getEvolutionChain(evolutionChainId(species))
      .then((c) => on && setChain(c))
      .catch(() => on && setFailed(true));
    return () => {
      on = false;
    };
  }, [species]);

  const root = useMemo(() => (chain ? parseChain(chain.chain, lang) : null), [chain, lang]);
  const edgePairs = useMemo(() => (root ? collectEdges(root) : []), [root]);

  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef(new Map<string, HTMLButtonElement>());
  const [edges, setEdges] = useState<Edge[]>([]);
  const [box, setBox] = useState({ w: 0, h: 0 });
  /* amount-based trigger (the old '-20% 0px' margin never fired when the panel
   * sat in the lower viewport band → connectors stayed at pathLength 0 and only
   * the marker arrowheads rendered). Timeout fallback guarantees the draw even
   * if the observer never trips (tab switches, short viewports). */
  const inViewRaw = useInView(containerRef, { once: true, amount: 0.2 });
  const [inViewForced, setInViewForced] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setInViewForced(true), 1500);
    return () => window.clearTimeout(t);
  }, []);
  const inView = inViewRaw || inViewForced;

  const registerRef = (key: string, el: HTMLButtonElement | null) => {
    if (el) nodeRefs.current.set(key, el);
    else nodeRefs.current.delete(key);
  };

  /* measure card positions → bezier edges (re-run on layout changes) */
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || !root) return;
    const measure = () => {
      const cRect = container.getBoundingClientRect();
      const next: Edge[] = [];
      for (const [parent, child] of edgePairs) {
        const pEl = nodeRefs.current.get(parent.key);
        const cEl = nodeRefs.current.get(child.key);
        if (!pEl || !cEl || !child.condition) continue;
        const p = pEl.getBoundingClientRect();
        const c = cEl.getBoundingClientRect();
        const x1 = p.right - cRect.left;
        const y1 = p.top + p.height / 2 - cRect.top;
        const x2 = c.left - cRect.left;
        const y2 = c.top + c.height / 2 - cRect.top;
        const dx = Math.max(18, (x2 - x1) / 2);
        next.push({
          key: `${parent.key}->${child.key}`,
          d: `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`,
          midX: (x1 + x2) / 2,
          /* chip rides at the CHILD's row height inside the gutter — at the
           * bezier's true midpoint it collided with neighbouring cards in
           * fan-out trees (Eevee). */
          midY: y2,
          condition: child.condition,
          rgb: '246,201,69',
        });
      }
      setEdges(next);
      setBox({ w: container.scrollWidth, h: container.scrollHeight });
    };
    measure();
    const t1 = window.setTimeout(measure, 350); // sprites settle
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => {
      window.clearTimeout(t1);
      ro.disconnect();
    };
  }, [root, edgePairs]);

  if (failed) {
    return <p className="p-4 font-sans text-xs text-tx-muted">{t('detail.evo.offline')}</p>;
  }
  if (!species || !root) {
    return (
      <div className="flex h-[120px] items-center gap-4 p-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="dx-skel h-[92px] w-[96px] !rounded-lg" />
        ))}
      </div>
    );
  }

  const noEvolution = root.children.length === 0;

  return (
    <div className="dx-scroll overflow-x-auto p-3">
      <div ref={containerRef} className="relative inline-flex min-w-full items-center py-5 pr-2">
        {/* SVG connectors */}
        <svg
          className="pointer-events-none absolute inset-0"
          width={box.w}
          height={box.h}
          viewBox={`0 0 ${box.w} ${box.h}`}
          aria-hidden
        >
          <defs>
            <marker id="dx-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="rgba(246,201,69,0.8)" />
            </marker>
          </defs>
          {edges.map((e, i) => (
            <motion.path
              key={e.key}
              d={e.d}
              fill="none"
              stroke={`rgba(${e.rgb},0.7)`}
              strokeWidth={1.5}
              strokeDasharray="3 3"
              markerEnd="url(#dx-arrow)"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : undefined}
              transition={{ duration: 0.8, delay: i * 0.15, ease: EASE }}
            />
          ))}
        </svg>

        {/* condition chips at line midpoints */}
        {edges.map((e, i) => (
          <motion.span
            key={`chip-${e.key}`}
            className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 whitespace-nowrap rounded-pill border border-hairline bg-void/95 px-1.5 py-px font-sans text-[9px] font-semibold text-tx-secondary shadow-elevate"
            style={{ left: e.midX, top: e.midY }}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : undefined}
            transition={{ type: 'spring', stiffness: 420, damping: 30, delay: 0.5 + i * 0.15 }}
          >
            {e.condition.itemIcon && <img src={e.condition.itemIcon} alt="" className="h-3.5 w-3.5" loading="lazy" />}
            {e.condition.label}
          </motion.span>
        ))}

        <EvoNode stage={root} currentId={currentId} registerRef={registerRef} />

        {noEvolution && (
          <div className="ml-16 flex h-[92px] items-center rounded-lg border border-dashed border-hairline2 px-4">
            <p className="max-w-[200px] font-sans text-[11px] leading-snug text-tx-muted">
              {t('detail.evo.noEvolution')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
