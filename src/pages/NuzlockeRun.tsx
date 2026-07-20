/* Nuzlocke run view — THE TIMELINE DECK (nuzlocke.md §2).
 * Rules bar → route timeline + SoulLink overlay → team grid / feed →
 * graveyard → sticky Quick Entry. Solo & multi render identically. */
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import PokeballLoader from '@/components/PokeballLoader';
import { REGIONS, nodeIndex, regionById } from '@/lib/regions';
import { useRegionData } from '@/lib/mapdata';
import {
  isRunOwner,
  linkPartnerOf,
  registerSpeciesNamer,
  soulLinksOf,
  useRunEntry,
} from '@/lib/nuzlocke-store';
import type { LogResult, NuzEncounterRow, UpdateResult } from '@/lib/nuzlocke-store';
import { bootNameIndex, padNum } from '@/lib/pokeapi';
import type { DexIndexEntry } from '@/lib/types';
import { sprites } from '@/lib/sprites';
import RunHeader from './nuzlocke/RunHeader';
import RulesBar from './nuzlocke/RulesBar';
import Timeline from './nuzlocke/Timeline';
import TeamGrid from './nuzlocke/TeamGrid';
import BoxSection from './nuzlocke/BoxSection';
import Graveyard from './nuzlocke/Graveyard';
import Feed from './nuzlocke/Feed';
import QuickEntry from './nuzlocke/QuickEntry';
import type { Prefill } from './nuzlocke/QuickEntry';
import EncounterMenu from './nuzlocke/EncounterMenu';
import type { MenuTarget } from './nuzlocke/EncounterMenu';
import NuzToasts from './nuzlocke/Toasts';
import { PixelLabel } from './nuzlocke/ui';
import './nuzlocke/nuzlocke.css';

interface FlyState {
  id: number;
  pokemonId: number;
  from: DOMRect;
  to: DOMRect;
}

export default function NuzlockeRun() {
  const { runId } = useParams<{ runId: string }>();
  const entry = useRunEntry(runId);
  const state = entry?.state ?? null;
  const region = regionById(state?.run.region) ?? REGIONS[0];
  const mapData = useRegionData(region, state?.run.game ?? region.defaultVersion);

  const [nameIdx, setNameIdx] = useState<Map<number, DexIndexEntry>>(new Map());
  useEffect(() => {
    void bootNameIndex()
      .then((idx) => setNameIdx(new Map(idx.map((e) => [e.id, e]))))
      .catch(() => undefined);
  }, []);

  const nameOf = useMemo(() => (id: number) => nameIdx.get(id)?.label ?? padNum(id), [nameIdx]);

  /* feed text uses proper species names (store-level hook) */
  useEffect(() => {
    registerSpeciesNamer((id) => nameIdx.get(id)?.label ?? padNum(id));
  }, [nameIdx]);

  const routeLabelMap = useMemo(() => nodeIndex(region), [region]);
  const routeLabel = useMemo(() => (key: string) => routeLabelMap.get(key)?.label ?? key, [routeLabelMap]);

  const [prefill, setPrefill] = useState<Prefill | null>(null);
  const [menu, setMenu] = useState<MenuTarget | null>(null);
  const [flash, setFlash] = useState<{ route: string; playerId: string; key: number } | null>(null);
  const [fly, setFly] = useState<FlyState | null>(null);
  const [pendingFly, setPendingFly] = useState<{ enc: NuzEncounterRow; from: DOMRect } | null>(null);

  /* SoulLink death-cascade: alive partner of a dead link gets BOX? + shake (§2.3/§2.10) */
  const cascadeIds = useMemo(() => {
    const ids = new Set<string>();
    if (!state) return ids;
    for (const l of soulLinksOf(state)) {
      if (!l.broken) continue;
      if (l.a.status === 'caught') ids.add(l.a.id);
      if (l.b.status === 'caught') ids.add(l.b.id);
    }
    return ids;
  }, [state]);

  const links = useMemo(() => (state ? soulLinksOf(state) : []), [state]);

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
        <h1 className="mt-4 font-display text-[22px] font-bold text-tx-primary">Run not found</h1>
        <p className="mt-1 max-w-[360px] text-[13px] text-tx-secondary">
          This run isn't on this device — join it with its invite code from the hub.
        </p>
        <Link to="/nuzlocke" className="nz-sheen mt-5 rounded-md border border-gold/60 bg-[linear-gradient(135deg,rgba(246,201,69,0.25),rgba(246,201,69,0.10))] px-6 py-3 font-display text-[12px] font-bold uppercase tracking-[0.06em] text-tx-primary">
          ← All runs
        </Link>
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

  const onCascade = (res: UpdateResult, _enc: NuzEncounterRow) => {
    void res;
    void _enc;
    /* cascade chips derive live from state (cascadeIds) — store already toasted */
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 md:px-8">
      <RunHeader entry={entry} />
      <RulesBar state={state} owner={owner} />

      {/* a11y live region (§2.12) */}
      <div className="sr-only" aria-live="polite">
        {entry.feed[0]?.title ?? ''}
      </div>

      <div className="mt-4 space-y-8 pb-16">
        {/* timeline (dims on failed run, §2.10) */}
        <div className={failed ? 'opacity-70' : undefined}>
          <Timeline
            state={state}
            region={region}
            links={links}
            nameOf={nameOf}
            flash={flash}
            cascadeIds={cascadeIds}
            pendingSync={entry.pendingSync}
            onPrefill={(routeKey, playerId) => setPrefill({ routeKey, playerId, key: Date.now() })}
            onOpenEncounter={(enc, x, y) => setMenu({ enc, x, y })}
          />
        </div>

        {failed && (
          <div className="flex items-center justify-center gap-3 rounded-lg border border-hairline bg-surface1/60 px-4 py-3">
            <PixelLabel>RUN FAILED — PRESS F</PixelLabel>
            <Link to="/nuzlocke" className="rounded-md border border-gold/60 px-4 py-1.5 font-display text-[11px] font-bold uppercase text-gold transition-colors hover:bg-gold/10">
              Start a new run
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_260px]">
          <div className="min-w-0 space-y-4">
            <TeamGrid
              state={state}
              online={entry.online}
              nameOf={nameOf}
              linkPartner={(encId) => linkPartnerOf(state, encId)}
              onMenu={(enc, x, y) => setMenu({ enc, x, y })}
            />
            {/* visible BOX storage — between team grid and graveyard */}
            <BoxSection state={state} nameOf={nameOf} routeLabel={routeLabel} />
            <Graveyard state={state} nameOf={nameOf} routeLabel={routeLabel} />
          </div>
          <Feed feed={entry.feed} live={entry.status === 'live'} />
        </div>
      </div>

      <QuickEntry
        state={state}
        region={region}
        mapData={mapData}
        nameIdx={nameIdx}
        prefill={prefill}
        onLogged={onLogged}
      />

      <EncounterMenu target={menu} nameOf={nameOf} onClose={() => setMenu(null)} onCascade={onCascade} />
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
