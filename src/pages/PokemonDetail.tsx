/* /pokemon/:id — dense dashboard detail page (density-addendum §3, pokemon-detail.md).
 * 12-col panel grid, gap 16px:
 *   Row 1: Hero (span 7) · Combat (span 5)          — fits one 1440×900 viewport
 *   Row 2: Moves (span 7) · Side stack (span 5)
 *   Row 3: Evolution + Where to Find (span 4 stack) · SPRITE MUSEUM (span 8)
 *   Prev/Next 40px strip · MISSINGNO 404 · loading skeletons
 * Direct loads crossfade in (400ms — shared-element morph fallback, §6.2-3). */
import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { LocaleLink } from '@/lib/locale-link';
import { motion } from 'framer-motion';
import { ArrowLeft, Swords } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PokeballLoader from '@/components/PokeballLoader';
import { getPokemon, getSpecies, pokemonTypes } from '@/lib/pokeapi';
import { nameOfPokemon, useLanguage } from '@/lib/i18n-data';
import type { Pokemon, PokemonSpecies } from '@/lib/types';
import { MAX_DEX_ID } from '@/lib/types';
import CombatPanel from './detail/CombatPanel';
import EvolutionPanel from './detail/EvolutionPanel';
import HeroPanel from './detail/HeroPanel';
import MissingNo from './detail/MissingNo';
import MovesPanel from './detail/MovesPanel';
import PrevNextStrip from './detail/PrevNextStrip';
import SideStack from './detail/SideStack';
import SpriteMuseum from './detail/SpriteMuseum';
import VersusPanel from './detail/VersusPanel';
import WhereToFind from './detail/WhereToFind';
import { Panel } from './detail/ui';
import { typeRgb } from './detail/data';
import './detail/detail.css';

type Status = 'loading' | 'ready' | 'notfound' | 'error';

export default function PokemonDetail() {
  const { id: param = '' } = useParams();
  const { t: t8n } = useTranslation();
  const lang = useLanguage();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [status, setStatus] = useState<Status>('loading');

  /* reset synchronously on param change (derived-state-during-render) */
  const [prevParam, setPrevParam] = useState(param);
  if (prevParam !== param) {
    setPrevParam(param);
    setStatus('loading');
    setPokemon(null);
    setSpecies(null);
  }

  useEffect(() => {
    if (!param) return;
    let on = true;
    window.scrollTo({ top: 0 });

    getPokemon(param)
      .then((p) => {
        if (!on) return;
        setPokemon(p);
        setStatus('ready');
        getSpecies(p.species.name)
          .then((s) => on && setSpecies(s))
          .catch(() => undefined);
      })
      .catch(() => {
        if (!on) return;
        setStatus('notfound');
      });
    return () => {
      on = false;
    };
  }, [param]);

  useEffect(() => {
    if (pokemon) document.title = `${nameOfPokemon(pokemon.id, lang)} — Pokédex 2.0`;
  }, [pokemon, lang]);

  const types = useMemo(() => (pokemon ? pokemonTypes(pokemon) : []), [pokemon]);
  const primary = types[0] ?? 'normal';
  const secondary = types[1];
  const legendary = Boolean(species?.is_legendary || species?.is_mythical);

  /* ---------- VERSUS tab + ?vs=<id> deep link (versus.md UI 1) ---------- */
  const [searchParams, setSearchParams] = useSearchParams();
  const vsParam = searchParams.get('vs');
  const [tab, setTab] = useState<'overview' | 'versus'>(vsParam ? 'versus' : 'overview');

  /* external ?vs= changes (shared link paste / back-forward) open the tab */
  const [prevVs, setPrevVs] = useState(vsParam);
  if (vsParam !== prevVs) {
    setPrevVs(vsParam);
    if (vsParam) setTab('versus');
  }

  const switchTab = (t: 'overview' | 'versus') => {
    setTab(t);
    if (t === 'overview' && vsParam) {
      const next = new URLSearchParams(searchParams);
      next.delete('vs');
      setSearchParams(next, { replace: true });
    }
  };

  const writeOpponent = (id: number | null) => {
    const cur = searchParams.get('vs');
    if ((id ? String(id) : null) === cur) return;
    const next = new URLSearchParams(searchParams);
    if (id) next.set('vs', String(id));
    else next.delete('vs');
    setSearchParams(next, { replace: true });
  };

  /* ---------- 404 ---------- */
  if (status === 'notfound' || status === 'error') {
    return <MissingNo query={param} />;
  }

  /* ---------- loading skeleton ---------- */
  if (status === 'loading' || !pokemon) {
    return (
      <div className="mx-auto max-w-content px-4 pb-16 pt-6 md:px-8">
        <div className="dx-skel mb-4 h-6 w-44" />
        <div className="grid grid-cols-12 gap-4">
          <div className="dx-panel col-span-12 flex h-[380px] items-center justify-center lg:col-span-7">
            <div className="flex flex-col items-center gap-3">
              <PokeballLoader variant="inline" />
              <span className="pixel-label text-[9px] text-tx-muted">{t8n('detail.syncing', { id: param })}</span>
            </div>
          </div>
          <div className="dx-panel col-span-12 h-[380px] p-5 lg:col-span-5">
            <div className="flex h-full flex-col justify-center gap-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="dx-skel h-2.5 w-full rounded-pill" style={{ animationDelay: `${i * 120}ms` }} />
              ))}
            </div>
          </div>
          <div className="dx-panel col-span-12 h-[300px] lg:col-span-7" />
          <div className="dx-panel col-span-12 h-[300px] lg:col-span-5" />
        </div>
      </div>
    );
  }

  /* ---------- dashboard ---------- */
  return (
    <motion.div
      key={pokemon.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-content px-4 pb-16 pt-4 md:px-8"
    >
      {/* top utility row */}
      <div className="mb-3 flex items-center justify-between">
        <LocaleLink
          to="/pokedex"
          className="group inline-flex items-center gap-1.5 font-sans text-[13px] font-semibold text-tx-secondary transition-colors duration-150 hover:text-gold"
        >
          <ArrowLeft size={14} strokeWidth={2} className="transition-transform duration-150 group-hover:-translate-x-1" />
          {t8n('detail.backAll')}
        </LocaleLink>
        <span className="pixel-label hidden text-[8px] text-tx-muted sm:inline">{t8n('detail.living')}</span>
      </div>

      {/* tab strip — OVERVIEW dashboard / VERSUS matchup lab (versus.md) */}
      <div className="mb-3 flex items-center gap-1 border-b border-hairline" role="tablist" aria-label={t8n('detail.tabAria')}>
        {(['overview', 'versus'] as const).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => switchTab(t)}
            className={`relative flex items-center gap-1.5 px-3 py-2 transition-colors duration-150 ${
              tab === t ? 'text-gold' : 'text-tx-muted hover:text-tx-secondary'
            }`}
          >
            {t === 'versus' && <Swords size={11} />}
            <span className="pixel-label text-[9px]">{t === 'overview' ? t8n('detail.overview') : t8n('detail.versus')}</span>
            {tab === t && (
              <motion.span layoutId="detail-tab" className="absolute inset-x-2 -bottom-px h-0.5 bg-gold" transition={{ type: 'spring', stiffness: 420, damping: 30 }} />
            )}
          </button>
        ))}
      </div>

      {tab === 'versus' ? (
        <VersusPanel pokemon={pokemon} initialVs={vsParam} onOpponentChange={writeOpponent} />
      ) : (
      <>
      <div className="grid grid-cols-12 gap-4">
        {/* ROW 1 */}
        <Panel className="relative col-span-12 lg:col-span-7" bodyClassName="relative">
          {/* type mesh backdrop */}
          <div
            aria-hidden
            className="dx-hero-mesh"
            style={{
              background: `radial-gradient(420px 300px at 12% 0%, rgba(${typeRgb(primary)},0.16), transparent 70%), radial-gradient(360px 280px at 95% 100%, rgba(${secondary ? typeRgb(secondary) : '246,201,69'},0.10), transparent 70%)`,
            }}
          />
          <HeroPanel pokemon={pokemon} species={species} />
          {/* VS shortcut — opens the VERSUS tab (versus.md §Integration) */}
          <button
            type="button"
            onClick={() => switchTab('versus')}
            title={t8n('detail.vsTitle')}
            className="absolute right-3 top-3 z-20 inline-flex h-7 items-center gap-1 rounded-pill border border-gold/60 bg-abyss/70 px-2.5 font-display text-[10px] font-bold uppercase tracking-[0.06em] text-gold backdrop-blur-sm transition-all duration-150 hover:shadow-glow-gold"
          >
            <Swords size={11} />
            VS
          </button>
        </Panel>

        <Panel
          eyebrow={t8n('detail.panels.combatEyebrow')}
          title={t8n('detail.panels.combatTitle')}
          className="col-span-12 lg:col-span-5"
          bodyClassName="h-[calc(100%-45px)]"
        >
          <CombatPanel pokemon={pokemon} legendary={legendary} />
        </Panel>

        {/* ROW 2 */}
        <Panel
          eyebrow={t8n('detail.panels.movesEyebrow')}
          title={t8n('detail.panels.movesTitle')}
          className="col-span-12 lg:col-span-7"
          bodyClassName="flex min-h-[420px] flex-col"
        >
          <MovesPanel pokemon={pokemon} />
        </Panel>

        <div className="col-span-12 lg:col-span-5">
          <SideStack pokemon={pokemon} species={species} />
        </div>

        {/* ROW 3 — left stack: evolution + where to find (span 4) · museum (span 8) */}
        <div className="col-span-12 flex flex-col gap-4 lg:col-span-4">
          <Panel eyebrow={t8n('detail.panels.evoEyebrow')} title={t8n('detail.panels.evoTitle')} bodyClassName="min-h-[140px]">
            <EvolutionPanel species={species} currentId={species?.id ?? pokemon.id} />
          </Panel>

          <Panel
            eyebrow={t8n('detail.panels.findEyebrow')}
            title={t8n('detail.panels.findTitle')}
            className="flex-1"
            bodyClassName="p-0"
          >
            <WhereToFind key={pokemon.id} id={pokemon.id} />
          </Panel>
        </div>

        <Panel
          id="sprite-museum"
          eyebrow={t8n('detail.panels.museumEyebrow')}
          title={t8n('detail.panels.museumTitle')}
          className="col-span-12 lg:col-span-8"
          bodyClassName="p-0"
        >
          <SpriteMuseum id={pokemon.id} name={pokemon.name} />
        </Panel>
      </div>

      {/* prev / next strip */}
      {pokemon.id >= 1 && pokemon.id <= MAX_DEX_ID && (
        <div className="mt-4">
          <PrevNextStrip id={pokemon.id} />
        </div>
      )}
      </>
      )}
    </motion.div>
  );
}
