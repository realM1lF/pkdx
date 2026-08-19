import { useTranslation } from 'react-i18next';
import Sprite from '@/components/Sprite';
import { nameOfPokemon, useLanguage } from '@/lib/i18n-data';
import { nextGymInfo } from '@/lib/nuzlocke-rules';
import type { OverlaySnapshot } from '@/lib/nuzlocke-overlay';
import {
  kpisFromSnapshot,
  normalizeOverlayConfig,
  partyFromSnapshot,
  recentEventsFromSnapshot,
  routeLabelFromSnapshot,
  snapshotToRunState,
  youAreHereFromSnapshot,
} from '@/lib/nuzlocke-overlay';
import { regionName, versionChipLabel } from '@/lib/regions';
import { anyRegionById } from '@/lib/regions-freeform';
import type { NuzEncounterRow } from '@/lib/supabase';
import { cn } from '@/lib/utils';

export function OverlayRunBanner({ snapshot }: { snapshot: OverlaySnapshot }) {
  const lang = useLanguage();
  const region = anyRegionById(snapshot.run.region);
  return (
    <div className="flex flex-wrap items-center gap-2 px-3 py-2">
      <span className="truncate font-display text-sm font-bold text-tx-primary">{snapshot.run.name}</span>
      <span className="rounded-full border border-gold/40 px-2 py-0.5 font-pixel text-[8px] tracking-[0.06em] text-gold">
        {versionChipLabel(snapshot.run.game)}
      </span>
      <span className="rounded-full border border-hairline2 px-2 py-0.5 font-pixel text-[8px] tracking-[0.06em] text-tx-muted">
        {region ? regionName(region, lang) : snapshot.run.region}
      </span>
    </div>
  );
}

function PartySlot({ enc, nameOf }: { enc: NuzEncounterRow; nameOf: (id: number) => string }) {
  const label = enc.nickname ?? nameOf(enc.pokemon_id);
  const dead = enc.status === 'dead' || enc.status === 'lost';
  return (
    <div className={cn('overlay-slot flex flex-col items-center gap-0.5 px-1', dead && 'overlay-slot-dead')}>
      <div className="relative">
        <Sprite id={enc.pokemon_id} name={nameOf(enc.pokemon_id)} className="h-10 w-10" skeleton={false} eager />
        {enc.is_shiny && (
          <img src="/sparkle.svg" alt="" className="pointer-events-none absolute -left-0.5 -top-0.5 h-3 w-3" />
        )}
      </div>
      <span className="max-w-[4.5rem] truncate text-[10px] font-semibold text-tx-primary">{label}</span>
      <span className="font-pixel text-[8px] text-tx-muted">Lv.{enc.level}</span>
    </div>
  );
}

export function PartyWidget({
  snapshot,
  playerId,
  playerName,
  playerColor,
}: {
  snapshot: OverlaySnapshot;
  playerId: string;
  playerName?: string;
  playerColor?: string;
}) {
  const lang = useLanguage();
  const nameOf = (id: number) => nameOfPokemon(id, lang);
  const party = partyFromSnapshot(snapshot, playerId);
  return (
    <div className="px-2 py-2">
      {playerName && (
        <div className="mb-1.5 flex items-center gap-1.5 px-1">
          <span className="h-2 w-2 rounded-full" style={{ background: playerColor ?? '#F6C945' }} />
          <span className="font-pixel text-[8px] tracking-[0.06em] text-tx-muted">{playerName}</span>
        </div>
      )}
      <div className="flex flex-wrap items-end justify-start gap-1">
        {party.map((enc) => (
          <PartySlot key={enc.id} enc={enc} nameOf={nameOf} />
        ))}
        {party.length === 0 && <span className="px-2 py-3 text-[10px] text-tx-muted">—</span>}
      </div>
    </div>
  );
}

export function KpiWidget({ snapshot }: { snapshot: OverlaySnapshot }) {
  const { t } = useTranslation();
  const kpis = kpisFromSnapshot(snapshot);
  return (
    <div className="flex flex-wrap items-center gap-3 px-3 py-2 font-pixel text-[8px] tracking-[0.06em] text-tx-muted">
      <span>{t('nuz.overlay.kpiCaught', { n: kpis.caught })}</span>
      <span className="text-gold">{t('nuz.overlay.kpiDead', { n: kpis.dead })}</span>
      {kpis.links > 0 && <span>{t('nuz.overlay.kpiLinks', { n: kpis.links })}</span>}
    </div>
  );
}

export function RouteWidget({ snapshot }: { snapshot: OverlaySnapshot }) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const cfg = normalizeOverlayConfig(snapshot.config);
  const displayLang = cfg.locale === 'de' ? 'de' : lang;
  const key = youAreHereFromSnapshot(snapshot);
  const kpis = kpisFromSnapshot(snapshot);
  const label = key ? routeLabelFromSnapshot(snapshot, key, displayLang) : t('nuz.overlay.routeUnknown');
  const pct = kpis.routesTotal > 0 ? Math.round((kpis.routesDone / kpis.routesTotal) * 100) : 0;
  return (
    <div className="px-3 py-2">
      <p className="font-pixel text-[8px] tracking-[0.06em] text-gold">{t('nuz.overlay.routeLabel')}</p>
      <p className="truncate text-xs font-semibold text-tx-primary">{label}</p>
      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-surface3">
        <div className="h-full bg-gold/80 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 font-pixel text-[8px] text-tx-muted">
        {t('nuz.overlay.routeProgress', { done: kpis.routesDone, total: kpis.routesTotal })}
      </p>
    </div>
  );
}

export function BadgeWidget({ snapshot }: { snapshot: OverlaySnapshot }) {
  const { t } = useTranslation();
  const cleared = snapshot.run.rules.badgesCleared ?? 0;
  const gym = snapshot.run.rules.autoLevelCap ? nextGymInfo(snapshotToRunState(snapshot)) : null;
  return (
    <div className="px-3 py-2">
      <p className="font-pixel text-[8px] tracking-[0.06em] text-gold">{t('nuz.overlay.badges')}</p>
      <p className="text-sm font-bold tabular-nums text-tx-primary">
        {t('nuz.overlay.badgesCount', { n: cleared })}
      </p>
      {gym?.gymNodeId && (
        <p className="mt-0.5 truncate text-[10px] text-tx-muted">{gym.gymNodeId}</p>
      )}
    </div>
  );
}

export function EventTickerWidget({ snapshot }: { snapshot: OverlaySnapshot }) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const cfg = normalizeOverlayConfig(snapshot.config);
  const displayLang = cfg.locale === 'de' ? 'de' : lang;
  const event = recentEventsFromSnapshot(snapshot, 1)[0];
  if (!event) return null;
  const nameOf = (id: number) => nameOfPokemon(id, displayLang);
  const species = event.nickname ?? nameOf(event.pokemonId);
  const route = routeLabelFromSnapshot(snapshot, event.routeKey, displayLang);
  const verbKey =
    event.kind === 'catch'
      ? 'nuz.overlay.eventCatch'
      : event.kind === 'death'
        ? 'nuz.overlay.eventDeath'
        : 'nuz.overlay.eventOther';
  return (
    <p className="truncate px-3 py-2 text-[11px] text-tx-secondary">
      <span style={{ color: event.playerColor }}>{event.playerName}</span>{' '}
      {t(verbKey, { name: species, route, level: event.level })}
    </p>
  );
}

export function DeathCounterWidget({ snapshot }: { snapshot: OverlaySnapshot }) {
  const { t } = useTranslation();
  const dead = kpisFromSnapshot(snapshot).dead;
  return (
    <div className="flex items-center gap-2 px-3 py-2">
      <span className="font-pixel text-[8px] tracking-[0.06em] text-tx-muted">{t('nuz.overlay.deaths')}</span>
      <span className="font-display text-2xl font-bold tabular-nums text-gold">{dead}</span>
    </div>
  );
}
