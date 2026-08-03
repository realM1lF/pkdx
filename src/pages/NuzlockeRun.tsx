/* Nuzlocke run view — THE TIMELINE DECK (nuzlocke.md §2).
 * Rules bar → Quick Entry → route timeline + SoulLink overlay → team grid / feed →
 * graveyard. Solo & multi render identically. */
import { useEffect, useMemo, useState } from 'react';
import { Navigate, useLocation, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { LocaleLink, useLocalePath } from '@/lib/locale-link';
import { AnimatePresence, motion } from 'framer-motion';
import { Swords } from 'lucide-react';
import PokeballLoader from '@/components/PokeballLoader';
import { REGIONS, nodeIndex, nodeName } from '@/lib/regions';
import { anyRegionById } from '@/lib/regions-freeform';
import { useRegionData } from '@/lib/mapdata';
import {
  isRunOwner,
  linkPartnerOf,
  registerRouteNamer,
  registerSpeciesNamer,
  soulLinkGroupsOf,
  useRunEntry,
} from '@/lib/nuzlocke-store';
import type { LogResult, NuzEncounterRow } from '@/lib/nuzlocke-store';
import { isSlotConsuming } from '@/lib/nuzlocke-rules';
import { nameOfPokemon, useLanguage } from '@/lib/i18n-data';
import { bootNameIndex, padNum } from '@/lib/pokeapi';
import type { DexIndexEntry } from '@/lib/types';
import { sprites } from '@/lib/sprites';
import RunHeader from './nuzlocke/RunHeader';
import RulesBar from './nuzlocke/RulesBar';
import Timeline from './nuzlocke/Timeline';
import TeamGrid from './nuzlocke/TeamGrid';
import BoxSection from './nuzlocke/BoxSection';
import Feed from './nuzlocke/Feed';
import QuickEntry from './nuzlocke/QuickEntry';
import type { Prefill } from './nuzlocke/QuickEntry';
import EncounterMenu from './nuzlocke/EncounterMenu';
import type { MenuTarget } from './nuzlocke/EncounterMenu';
import NuzToasts from './nuzlocke/Toasts';
import VersusTab from './nuzlocke/VersusTab';
import { PixelLabel } from './nuzlocke/ui';
import './nuzlocke/nuzlocke.css';

interface FlyState {
  id: number;
  pokemonId: number;
  from: DOMRect;
  to: DOMRect;
}

export default function NuzlockeRun() {
  const { t } = useTranslation();
  const localePath = useLocalePath();
  const location = useLocation();
  const { runId } = useParams<{ runId: string }>();
  const entry = useRunEntry(runId === 'new' ? undefined : runId);
  const state = entry?.state ?? null;
  const region = anyRegionById(state?.run.region) ?? REGIONS[0];
  const mapData = useRegionData(region, state?.run.game ?? region.defaultVersion);

  const [nameIdx, setNameIdx] = useState<Map<number, DexIndexEntry>>(new Map());
  useEffect(() => {
    void bootNameIndex()
      .then((idx) => setNameIdx(new Map(idx.map((e) => [e.id, e]))))
      .catch(() => undefined);
  }, []);

  const lang = useLanguage();
  const nameOf = useMemo(
    () => (id: number) => (nameIdx.has(id) ? nameOfPokemon(id, lang) : padNum(id)),
    [nameIdx, lang],
  );

  /* feed text uses proper species + route names (store-level hooks) */
  useEffect(() => {
    registerSpeciesNamer((id) => nameOf(id));
    registerRouteNamer((_run: import('@/lib/nuzlocke-store').NuzRunRow, key: string) => routeLabel(key));
    return () => registerRouteNamer(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameIdx, lang]);

  const routeLabelMap = useMemo(() => nodeIndex(region), [region]);
  const routeLabel = useMemo(
    () => (key: string) => {
      const node = routeLabelMap.get(key);
      return node ? nodeName(node, lang) : key;
    },
    [routeLabelMap, lang],
  );

  const [prefill, setPrefill] = useState<Prefill | null>(null);
  const [menu, setMenu] = useState<MenuTarget | null>(null);
  const [deckTab, setDeckTab] = useState<'deck' | 'versus'>('deck');
  const [flash, setFlash] = useState<{ route: string; playerId: string; key: number } | null>(null);
  const [fly, setFly] = useState<FlyState | null>(null);
  const [pendingFly, setPendingFly] = useState<{ enc: NuzEncounterRow; from: DOMRect } | null>(null);

  useEffect(() => {
    const st = location.state as { prefillRoute?: string } | null;
    if (!st?.prefillRoute || !state) return;
    const playerId = state.players[0]?.id;
    if (!playerId) return;
    setPrefill({ routeKey: st.prefillRoute, playerId, key: Date.now() });
    window.history.replaceState({}, document.title);
  }, [location.state, state]);

  /* SoulLink death-cascade: every living mate on a route with a death gets BOX? + shake */
  const cascadeIds = useMemo(() => {
    const ids = new Set<string>();
    if (!state?.run.rules.soulLink) return ids;
    const deadRoutes = new Set(
      state.encounters.filter((e) => e.status === 'dead').map((e) => e.route_key),
    );
    for (const e of state.encounters) {
      if (e.status === 'caught' && deadRoutes.has(e.route_key)) ids.add(e.id);
    }
    return ids;
  }, [state]);

  const linkGroups = useMemo(() => (state ? soulLinkGroupsOf(state) : []), [state]);

  /* FLIP: after the store re-renders, find the slot sprite and fly to it (§2.5) */
  useEffect(() => {
    if (!pendingFly) return;
    const raf = requestAnimationFrame(() => {
      const el = document.querySelector(`[data-slot-enc="${pendingFly.enc.id}"]`);
      const to = el?.getBoundingClientRect();
      if (to) {
        setFly({ id: Date.now(), pokemonId: pendingFly.enc.pokemon_id, from: pendingFly.from, to });
      }
      setPendingFly(null);
    });
    return () => cancelAnimationFrame(raf);
  }, [pendingFly]);

  if (runId === 'new') {
    const params = new URLSearchParams(location.search);
    params.set('wizard', '1');
    return <Navigate to={`${localePath('/nuzlocke')}?${params.toString()}`} replace />;
  }

  if (!entry || entry.phase === 'loading') {
    return (
      <div className="grid min-h-[60dvh] place-items-center">
        <PokeballLoader variant="inline" />
      </div>
    );
  }

  if (entry.phase === 'missing' || !state) {
    return (
      <div className="mx-auto grid max-w-[1440px] place-items-center px-4 py-32 text-center md:px-8">
        <img src="/empty-dex.svg" alt="" className="h-[120px] opacity-60" />
        <h1 className="mt-4 font-display text-[22px] font-bold text-tx-primary">{t('nuz.runNotFound')}</h1>
        <p className="mt-1 max-w-[360px] text-[13px] text-tx-secondary">
          {t('nuz.runNotFoundBody')}
        </p>
        <LocaleLink to="/nuzlocke" className="nz-sheen mt-5 rounded-md border border-gold/60 bg-[linear-gradient(135deg,rgba(246,201,69,0.25),rgba(246,201,69,0.10))] px-6 py-3 font-display text-[12px] font-bold tracking-[0.06em] text-tx-primary">
          ← {t('nuz.backToRuns')}
        </LocaleLink>
      </div>
    );
  }

  const owner = isRunOwner(state.run.id);
  const failed = state.run.status === 'failed';

  const onLogged = (res: LogResult & { fromRect: DOMRect | null }) => {
    if (!res.ok || !res.encounter) return;
    setFlash({ route: res.encounter.route_key, playerId: res.encounter.player_id, key: Date.now() });
    window.setTimeout(() => setFlash(null), 700);
    if (res.fromRect && res.encounter.status === 'caught') {
      setPendingFly({ enc: res.encounter, from: res.fromRect });
    }
  };

  const openMenu = (enc: NuzEncounterRow, x: number, y: number) => {
    /* restoring this row to caught is only safe while its route slot is free */
    const canRestore =
      enc.status === 'caught' ||
      !state.encounters.some(
        (e) => e.id !== enc.id && e.player_id === enc.player_id && e.route_key === enc.route_key && isSlotConsuming(e),
      );
    setMenu({ enc, x, y, canRestore });
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 md:px-8">
      <RunHeader entry={entry} nameOf={nameOf} routeLabel={routeLabel} />
      <RulesBar state={state} owner={owner} />

      {deckTab === 'deck' && (
        <QuickEntry
          state={state}
          region={region}
          mapData={mapData}
          nameIdx={nameIdx}
          prefill={prefill}
          onLogged={onLogged}
        />
      )}

      {/* deck tab strip — Run Deck / Versus */}
      <div className="mt-3 flex items-center gap-1 border-b border-hairline" role="tablist" aria-label={t('nuz.runViewAria')}>
        {(['deck', 'versus'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={deckTab === tab}
            onClick={() => setDeckTab(tab)}
            className={`relative flex items-center gap-1.5 px-3 py-2 transition-colors duration-150 ${
              deckTab === tab ? 'text-gold' : 'text-tx-muted hover:text-tx-secondary'
            }`}
          >
            {tab === 'versus' && <Swords size={11} />}
            <span className="pixel-label text-[9px]">{tab === 'deck' ? t('nuz.tabs.deck') : t('nuz.tabs.versus')}</span>
            {deckTab === tab && (
              <motion.span layoutId="nuz-deck-tab" className="absolute inset-x-2 -bottom-px h-0.5 bg-gold" transition={{ type: 'spring', stiffness: 420, damping: 30 }} />
            )}
          </button>
        ))}
      </div>

      {/* a11y live region (§2.12) */}
      <div className="sr-only" aria-live="polite">
        {entry.feed[0]?.title ?? ''}
      </div>

      {deckTab === 'versus' && (
        <div className="mt-4 pb-16">
          <VersusTab state={state} nameOf={nameOf} />
        </div>
      )}

      <div className={deckTab === 'versus' ? 'hidden' : 'mt-4 space-y-8 pb-8'}>
        {/* timeline (dims on failed run, §2.10) */}
        <div className={failed ? 'opacity-70' : undefined}>
          <Timeline
            state={state}
            region={region}
            groups={linkGroups}
            nameOf={nameOf}
            flash={flash}
            cascadeIds={cascadeIds}
            pendingSync={entry.pendingSync}
            onPrefill={(routeKey, playerId) => setPrefill({ routeKey, playerId, key: Date.now() })}
            onOpenEncounter={openMenu}
          />
        </div>

        {failed && (
          <div className="flex items-center justify-center gap-3 rounded-lg border border-hairline bg-surface1/60 px-4 py-3">
            <PixelLabel>{t('nuz.runFailed')}</PixelLabel>
            <LocaleLink to="/nuzlocke" className="rounded-md border border-gold/60 px-4 py-1.5 font-display text-[11px] font-bold text-gold transition-colors hover:bg-gold/10">
              {t('nuz.startNew')}
            </LocaleLink>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_260px]">
          <div className="min-w-0 space-y-4">
            <TeamGrid
              state={state}
              online={entry.online}
              nameOf={nameOf}
              linkPartner={(encId) => linkPartnerOf(state, encId)}
              onMenu={openMenu}
            />
            {/* unified BOX storage — all non-team encounters incl. fallen/missed */}
            <BoxSection state={state} nameOf={nameOf} routeLabel={routeLabel} />
          </div>
          <Feed feed={entry.feed} live={entry.status === 'live'} />
        </div>
      </div>

      <EncounterMenu target={menu} nameOf={nameOf} state={state} onClose={() => setMenu(null)} />
      <NuzToasts />

      {/* sprite FLIP flight into the timeline (§2.5) */}
      <AnimatePresence>
        {fly && (
          <motion.img
            key={fly.id}
            src={sprites.front(fly.pokemonId)}
            alt=""
            initial={{
              position: 'fixed',
              left: fly.from.left,
              top: fly.from.top,
              width: fly.from.width || 32,
              height: fly.from.height || 32,
              opacity: 1,
              zIndex: 90,
            }}
            animate={{
              left: fly.to.left,
              top: fly.to.top,
              width: fly.to.width || 36,
              height: fly.to.height || 36,
              opacity: 0.9,
            }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 22 }}
            onAnimationComplete={() => setFly(null)}
            className="pointer-events-none [image-rendering:pixelated]"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
