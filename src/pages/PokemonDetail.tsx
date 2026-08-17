/* /pokemon/:id — dense dashboard detail page (density-addendum §3, pokemon-detail.md).
 * 12-col panel grid, gap 16px:
 *   Row 1: Hero (span 7) · Combat (span 5)          — fits one 1440×900 viewport
 *   Row 2: Moves (span 7) · Side stack (span 5)
 *   Row 3: Evolution + Where to Find (span 5 stack) · SPRITE MUSEUM (span 7)
 *   Prev/Next 40px strip · MISSINGNO 404 · loading skeletons
 * Direct loads crossfade in (400ms — shared-element morph fallback, §6.2-3). */
import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { LocaleLink } from '@/lib/locale-link';
import { motion } from 'framer-motion';
import MotionRoot from '@/components/MotionRoot';
import { ArrowLeft, Swords } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PokeballLoader from '@/components/PokeballLoader';
import { genAbilityRows, genStatsOf, genTypesOf, statsFromPokemon } from '@/lib/gen-dex';
import { getPokemon, getSpecies, pokemonTypes } from '@/lib/pokeapi';
import { nameOfPokemon, useLanguage } from '@/lib/i18n-data';
import type { Pokemon, PokemonSpecies, PokemonType } from '@/lib/types';
import { MAX_DEX_ID } from '@/lib/types';
import { VERSION_GROUPS, versionGroupById, versionGroupForGame } from '@/lib/version-groups';
import { formIdentity } from '@/lib/dex-forms-catalog';
import AddToTeam from './detail/AddToTeam';
import CombatPanel from './detail/CombatPanel';
import EditionDock from './detail/EditionDock';
import EvolutionPanel from './detail/EvolutionPanel';
import HeroPanel from './detail/HeroPanel';
import MissingNo from './detail/MissingNo';
import MovesPanel from './detail/MovesPanel';
import PrevNextStrip from './detail/PrevNextStrip';
import SideStack from './detail/SideStack';
import SpriteMuseum from './detail/SpriteMuseum';
import WhereToFind from './detail/WhereToFind';
import { parseMapsFromParam } from './detail/from-param';
import type { RegionId } from '@/lib/regions';
import { versusContextFromGame, DEFAULT_VERSUS_PAGE_GAME } from '@/lib/versus-context';
import { pokemonSeoMetaForParam } from '@/lib/seo';
import { hasPokemonSeoSections } from '@/lib/seo-pilots';
import PokemonSeoSections from './detail/PokemonSeoSections';
import HonestyHint from '@/components/HonestyHint';
import { editionFallback } from '@/lib/honesty';
import { Panel } from './detail/ui';
import { editionFromGameParam, presentEditionIds, resolveMoveVersionGroup, typeRgb } from './detail/data';
import './detail/detail.css';

/* VERSUS matchup lab is heavy (@pkmn/dex + @smogon/calc, ~2.4MB) and hidden
 * behind a non-default tab — load it on demand, never on the overview path. */
const VersusPanel = lazy(() => import('./detail/VersusPanel'));

const REGION_IDS = new Set<RegionId>(['kanto', 'johto', 'hoenn', 'sinnoh', 'unova']);

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
    if (!pokemon) return;
    /* SEO pilot routes carry a registry title (src/lib/seo.ts) — keep it
     * instead of overwriting with the generic "<name> — MyPokePanion". */
    const seoTitle = pokemonSeoMetaForParam(param ?? '')?.title[lang];
    document.title = seoTitle ?? `${nameOfPokemon(pokemon.name, lang)} — MyPokePanion`;
  }, [pokemon, lang, param]);

  const apiTypes = useMemo(() => (pokemon ? pokemonTypes(pokemon) : []), [pokemon]);
  const legendary = Boolean(species?.is_legendary || species?.is_mythical);

  /* ---------- VERSUS tab + ?vs=<id> deep link (versus.md UI 1) ---------- */
  const [searchParams, setSearchParams] = useSearchParams();
  const vsParam = searchParams.get('vs');
  const gameParam = searchParams.get('game');
  const tabParam = searchParams.get('tab');
  const versusTrainerParam = searchParams.get('versusTrainer');
  const regionParam = searchParams.get('region');
  const fromMaps = parseMapsFromParam(searchParams.get('from'));
  const trainerRegion = regionParam && REGION_IDS.has(regionParam as RegionId) ? (regionParam as RegionId) : null;

  const editionOptions = useMemo(() => {
    if (!pokemon) return [];
    const present = presentEditionIds(
      pokemon.moves.flatMap((m) => m.version_group_details.map((d) => d.version_group.name)),
    );
    return VERSION_GROUPS.filter((g) => present.has(g.id));
  }, [pokemon]);
  const newestEdition = pokemon ? resolveMoveVersionGroup(pokemon.moves) : '';
  const edition = editionFromGameParam(
    gameParam,
    editionOptions.map((g) => g.id),
    newestEdition,
  );
  const editionInfo = versionGroupById(edition);
  const showEditionFallback = editionFallback(
    versionGroupForGame(gameParam),
    new Set(editionOptions.map((g) => g.id)),
  );
  const types = useMemo(
    () => (pokemon ? genTypesOf(edition, pokemon.name, apiTypes as PokemonType[]) : []),
    [pokemon, edition, apiTypes],
  );
  const primary = types[0] ?? 'normal';
  const secondary = types[1];
  const editionStats = useMemo(
    () => (pokemon ? genStatsOf(edition, pokemon.name, statsFromPokemon(pokemon)) : null),
    [pokemon, edition],
  );
  const editionAbilities = useMemo(
    () => (pokemon ? genAbilityRows(edition, pokemon.name) : []),
    [pokemon, edition],
  );
  const versusContext = useMemo(
    () => versusContextFromGame(gameParam ?? editionInfo.games[0] ?? DEFAULT_VERSUS_PAGE_GAME, trainerRegion),
    [gameParam, editionInfo.games, trainerRegion],
  );

  const writeGame = (game: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (game) next.set('game', game);
    else next.delete('game');
    const vgId = versionGroupForGame(game);
    const games = vgId ? versionGroupById(vgId).games : [];
    const curV = next.get('v');
    if (curV && games.length && !games.includes(curV)) next.delete('v');
    setSearchParams(next, { replace: true });
  };

  const setEdition = (vgId: string) => {
    writeGame(versionGroupById(vgId).games[0] ?? null);
  };
  const [tab, setTab] = useState<'overview' | 'versus'>(vsParam || tabParam === 'versus' ? 'versus' : 'overview');

  /* external ?vs= / ?tab= changes (shared link, back-forward, sprite navigation) */
  const [prevVs, setPrevVs] = useState(vsParam);
  if (vsParam !== prevVs) {
    setPrevVs(vsParam);
    if (vsParam) setTab('versus');
    else if (tabParam !== 'versus') setTab('overview');
  }
  const [prevTabParam, setPrevTabParam] = useState(tabParam);
  if (tabParam !== prevTabParam) {
    setPrevTabParam(tabParam);
    if (tabParam === 'versus') setTab('versus');
    else setTab('overview');
  }

  const switchTab = (t: 'overview' | 'versus') => {
    setTab(t);
    const next = new URLSearchParams(searchParams);
    if (t === 'overview') {
      next.delete('vs');
      next.delete('tab');
    } else {
      next.set('tab', 'versus');
    }
    setSearchParams(next, { replace: true });
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
        {/* SEO pilot content renders even while PokéAPI data is in flight —
            the static HTML always carries the Q&A + location tables */}
        {hasPokemonSeoSections(param) && (
          <div className="mt-4">
            <PokemonSeoSections queryId={param} />
          </div>
        )}
      </div>
    );
  }

  /* ---------- dashboard ---------- */
  const ident = formIdentity(pokemon.name, pokemon.id);
  return (
    <MotionRoot>
    <motion.div
      key={pokemon.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-content px-4 pb-16 pt-4 md:px-8"
    >
      {/* top utility row — edition picker is page-global (types/stats/moves/encounters) */}
      <div className="relative z-30 mb-3 flex items-center justify-between gap-3">
        <LocaleLink
          to={fromMaps ? `/maps/${fromMaps.region}?node=${fromMaps.nodeId}` : '/pokedex'}
          className="group inline-flex items-center gap-1.5 font-sans text-[13px] font-semibold text-tx-secondary transition-colors duration-150 hover:text-gold"
        >
          <ArrowLeft size={14} strokeWidth={2} className="transition-transform duration-150 group-hover:-translate-x-1" />
          {fromMaps ? t8n('detail.backToMap') : t8n('detail.backAll')}
        </LocaleLink>
        {editionOptions.length > 0 && (
          <div className="flex min-w-0 flex-col items-end gap-0.5">
            <EditionDock value={edition} onChange={setEdition} options={editionOptions} />
            <HonestyHint show={showEditionFallback} tone="gold">
              {t8n('honesty.editionFallback', { edition: editionInfo.short })}
            </HonestyHint>
          </div>
        )}
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
        <Suspense
          fallback={
            <div className="dx-panel flex h-[520px] flex-col items-center justify-center gap-4" role="status">
              <PokeballLoader variant="inline" />
              <span className="pixel-label text-[9px] text-tx-muted">{t8n('detail.loadingVersus')}</span>
              <div className="flex w-full max-w-md flex-col gap-3 px-6">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="dx-skel h-2.5 w-full rounded-pill" style={{ animationDelay: `${i * 120}ms` }} />
                ))}
              </div>
            </div>
          }
        >
          <VersusPanel
            initialYou={pokemon.id}
            initialVs={vsParam}
            onOpponentChange={writeOpponent}
            context={versusContext}
            onGameChange={writeGame}
            initialTrainerNode={versusTrainerParam}
            initialTrainerRegion={trainerRegion}
            hostPokemonId={pokemon.id}
            onHostOverview={() => switchTab('overview')}
          />
        </Suspense>
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
          <HeroPanel
            pokemon={pokemon}
            species={species}
            types={types}
            abilities={editionAbilities}
            flavorGames={editionInfo.games}
            edition={edition}
          />
          {/* top-right actions: add to a saved team · VS shortcut (opens the VERSUS tab) */}
          <div className="absolute right-3 top-3 z-20 flex items-center gap-1.5">
            <AddToTeam pokemon={pokemon} />
            <button
              type="button"
              onClick={() => switchTab('versus')}
              title={t8n('detail.vsTitle')}
              className="inline-flex h-7 items-center gap-1 rounded-pill border border-gold/60 bg-abyss/70 px-2.5 font-display text-[10px] font-bold tracking-[0.06em] text-gold backdrop-blur-sm transition-all duration-150 hover:shadow-glow-gold"
            >
              <Swords size={11} />
              VS
            </button>
          </div>
        </Panel>

        <Panel
          eyebrow={t8n('detail.panels.combatEyebrow')}
          title={t8n('detail.panels.combatTitle')}
          className="col-span-12 lg:col-span-5"
          bodyClassName="h-[calc(100%-45px)]"
        >
          <CombatPanel pokemon={pokemon} legendary={legendary} stats={editionStats ?? undefined} types={types} gen={editionInfo.gen} vgId={edition} />
        </Panel>

        {/* ROW 2 */}
        <Panel
          eyebrow={t8n('detail.panels.movesEyebrow')}
          title={t8n('detail.panels.movesTitle')}
          className="col-span-12 lg:col-span-7"
          bodyClassName="flex min-h-[420px] flex-col"
        >
          <MovesPanel pokemon={pokemon} version={edition} />
        </Panel>

        <div className="col-span-12 lg:col-span-5">
          <SideStack
            pokemon={pokemon}
            species={species}
            versionGroup={edition}
            types={types}
            abilities={editionAbilities}
          />
        </div>

        {/* ROW 3 — left stack: evolution + where to find (span 5) · museum (span 7) */}
        <div className="col-span-12 flex flex-col gap-4 lg:col-span-5">
          <Panel eyebrow={t8n('detail.panels.evoEyebrow')} title={t8n('detail.panels.evoTitle')} bodyClassName="min-h-[140px]">
            <HonestyHint show className="border-b border-hairline px-4 py-1.5">
              {t8n('honesty.evoCurrent')}
            </HonestyHint>
            <EvolutionPanel species={species} currentId={species?.id ?? pokemon.id} />
          </Panel>

          <Panel
            eyebrow={t8n('detail.panels.findEyebrow')}
            title={t8n('detail.panels.findTitle')}
            className="flex-1"
            bodyClassName="p-0"
          >
            <WhereToFind
              key={pokemon.id}
              id={pokemon.id}
              highlight={fromMaps}
              version={searchParams.get('v')}
              editionGames={editionInfo.games}
            />
          </Panel>
        </div>

        <Panel
          id="sprite-museum"
          eyebrow={t8n('detail.panels.museumEyebrow')}
          title={t8n('detail.panels.museumTitle')}
          className="col-span-12 lg:col-span-7"
          bodyClassName="p-0"
        >
          <SpriteMuseum id={pokemon.id} name={pokemon.name} />
        </Panel>
      </div>

      {/* prev / next strip */}
      {ident.speciesId >= 1 && ident.speciesId <= MAX_DEX_ID && (
        <div className="mt-4">
          <PrevNextStrip id={ident.speciesId} />
        </div>
      )}

      {/* SEO pilot content below the dashboard (pilot: #25 Pikachu) */}
      {hasPokemonSeoSections(param) && (
        <div className="mt-4">
          <PokemonSeoSections queryId={param} />
        </div>
      )}
      </>
      )}
    </motion.div>
    </MotionRoot>
  );
}
