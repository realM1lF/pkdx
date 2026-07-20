/* /pokemon/:id — dense dashboard detail page (density-addendum §3, pokemon-detail.md).
 * 12-col panel grid, gap 16px:
 *   Row 1: Hero (span 7) · Combat (span 5)          — fits one 1440×900 viewport
 *   Row 2: Moves (span 7) · Side stack (span 5)
 *   Row 3: Evolution (span 4) · SPRITE MUSEUM (span 8)
 *   Prev/Next 40px strip · MISSINGNO 404 · loading skeletons
 * Direct loads crossfade in (400ms — shared-element morph fallback, §6.2-3). */
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import PokeballLoader from '@/components/PokeballLoader';
import { getPokemon, getSpecies, pokemonTypes } from '@/lib/pokeapi';
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
import { Panel } from './detail/ui';
import { typeRgb } from './detail/data';
import './detail/detail.css';

type Status = 'loading' | 'ready' | 'notfound' | 'error';

export default function PokemonDetail() {
  const { id: param = '' } = useParams();
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
    if (pokemon) document.title = `${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} — Pokédex 2.0`;
  }, [pokemon]);

  const types = useMemo(() => (pokemon ? pokemonTypes(pokemon) : []), [pokemon]);
  const primary = types[0] ?? 'normal';
  const secondary = types[1];
  const legendary = Boolean(species?.is_legendary || species?.is_mythical);

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
              <span className="pixel-label text-[9px] text-tx-muted">SYNCING ENTRY {param}</span>
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
        <Link
          to="/pokedex"
          className="group inline-flex items-center gap-1.5 font-sans text-[13px] font-semibold text-tx-secondary transition-colors duration-150 hover:text-gold"
        >
          <ArrowLeft size={14} strokeWidth={2} className="transition-transform duration-150 group-hover:-translate-x-1" />
          ALL POKÉMON
        </Link>
        <span className="pixel-label hidden text-[8px] text-tx-muted sm:inline">LIVING ENTRY · PHASE 01</span>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* ROW 1 */}
        <Panel className="col-span-12 lg:col-span-7" bodyClassName="relative">
          {/* type mesh backdrop */}
          <div
            aria-hidden
            className="dx-hero-mesh"
            style={{
              background: `radial-gradient(420px 300px at 12% 0%, rgba(${typeRgb(primary)},0.16), transparent 70%), radial-gradient(360px 280px at 95% 100%, rgba(${secondary ? typeRgb(secondary) : '246,201,69'},0.10), transparent 70%)`,
            }}
          />
          <HeroPanel pokemon={pokemon} species={species} />
        </Panel>

        <Panel
          eyebrow="BASE STATS"
          title="Combat Profile"
          className="col-span-12 lg:col-span-5"
          bodyClassName="h-[calc(100%-45px)]"
        >
          <CombatPanel pokemon={pokemon} legendary={legendary} />
        </Panel>

        {/* ROW 2 */}
        <Panel
          eyebrow="ATTACKS"
          title="Move Pool"
          className="col-span-12 lg:col-span-7"
          bodyClassName="flex min-h-[420px] flex-col"
        >
          <MovesPanel pokemon={pokemon} />
        </Panel>

        <div className="col-span-12 lg:col-span-5">
          <SideStack pokemon={pokemon} species={species} />
        </div>

        {/* ROW 3 */}
        <Panel
          eyebrow="EVOLUTION"
          title="Family Tree"
          className="col-span-12 lg:col-span-4"
          bodyClassName="min-h-[140px]"
        >
          <EvolutionPanel species={species} currentId={species?.id ?? pokemon.id} />
        </Panel>

        <Panel
          id="sprite-museum"
          eyebrow="ARCHIVE"
          title="Sprite Museum"
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
    </motion.div>
  );
}
