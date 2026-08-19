import type { ReactNode } from 'react';
import type { OverlaySnapshot } from '@/lib/nuzlocke-overlay';
import { normalizeOverlayConfig, visiblePlayersFromSnapshot } from '@/lib/nuzlocke-overlay';
import {
  BadgeWidget,
  DeathCounterWidget,
  EventTickerWidget,
  KpiWidget,
  OverlayRunBanner,
  PartyWidget,
  RouteWidget,
} from './widgets/OverlayWidgets';
import '@/pages/nuzlocke/nuzlocke.css';

function WidgetGate({ show, children }: { show: boolean; children: ReactNode }) {
  if (!show) return null;
  return <>{children}</>;
}

export function StreamerLayout({ snapshot }: { snapshot: OverlaySnapshot }) {
  const cfg = normalizeOverlayConfig(snapshot.config);
  const players = visiblePlayersFromSnapshot(snapshot);
  return (
    <div className="overlay-panel inline-block min-w-[20rem] max-w-[48rem]">
      <OverlayRunBanner snapshot={snapshot} />
      <WidgetGate show={cfg.widgets.deaths}>
        <DeathCounterWidget snapshot={snapshot} />
      </WidgetGate>
      <WidgetGate show={cfg.widgets.party}>
        {players.map((p) => (
          <PartyWidget key={p.id} snapshot={snapshot} playerId={p.id} playerName={p.name} playerColor={p.color} />
        ))}
      </WidgetGate>
      <WidgetGate show={cfg.widgets.route || cfg.widgets.badges}>
        <div className="grid grid-cols-2 gap-0 border-t border-hairline/60">
          <WidgetGate show={cfg.widgets.route}>
            <RouteWidget snapshot={snapshot} />
          </WidgetGate>
          <WidgetGate show={cfg.widgets.badges}>
            <BadgeWidget snapshot={snapshot} />
          </WidgetGate>
        </div>
      </WidgetGate>
      <WidgetGate show={cfg.widgets.recentEvent}>
        <EventTickerWidget snapshot={snapshot} />
      </WidgetGate>
      <WidgetGate show={!cfg.widgets.deaths}>
        <KpiWidget snapshot={snapshot} />
      </WidgetGate>
    </div>
  );
}

export function CompactLayout({ snapshot }: { snapshot: OverlaySnapshot }) {
  const cfg = normalizeOverlayConfig(snapshot.config);
  const players = visiblePlayersFromSnapshot(snapshot);
  const p = players[0];
  if (!p) return <StreamerLayout snapshot={snapshot} />;
  return (
    <div className="overlay-panel inline-block min-w-[18rem]">
      <div className="flex items-start gap-2 px-2 py-2">
        <PartyWidget snapshot={snapshot} playerId={p.id} />
        <div className="min-w-0 flex-1">
          <WidgetGate show={cfg.widgets.deaths}>
            <DeathCounterWidget snapshot={snapshot} />
          </WidgetGate>
          <WidgetGate show={cfg.widgets.route}>
            <RouteWidget snapshot={snapshot} />
          </WidgetGate>
        </div>
      </div>
      <WidgetGate show={cfg.widgets.recentEvent}>
        <EventTickerWidget snapshot={snapshot} />
      </WidgetGate>
    </div>
  );
}

export function MinimalLayout({ snapshot }: { snapshot: OverlaySnapshot }) {
  const cfg = normalizeOverlayConfig(snapshot.config);
  return (
    <div className="overlay-panel inline-flex flex-wrap items-center gap-3 px-3 py-2">
      <WidgetGate show={cfg.widgets.deaths}>
        <DeathCounterWidget snapshot={snapshot} />
      </WidgetGate>
      <WidgetGate show={cfg.widgets.route}>
        <RouteWidget snapshot={snapshot} />
      </WidgetGate>
    </div>
  );
}

export function SoulLinkDualLayout({ snapshot }: { snapshot: OverlaySnapshot }) {
  const cfg = normalizeOverlayConfig(snapshot.config);
  const players = visiblePlayersFromSnapshot(snapshot).slice(0, 2);
  return (
    <div className="overlay-panel inline-block min-w-[24rem]">
      <OverlayRunBanner snapshot={snapshot} />
      <div className="grid grid-cols-2 gap-0 divide-x divide-hairline/60 border-t border-hairline/60">
        {players.map((p) => (
          <PartyWidget key={p.id} snapshot={snapshot} playerId={p.id} playerName={p.name} playerColor={p.color} />
        ))}
      </div>
      <WidgetGate show={cfg.widgets.deaths || cfg.widgets.route}>
        <div className="flex border-t border-hairline/60">
          <WidgetGate show={cfg.widgets.deaths}>
            <DeathCounterWidget snapshot={snapshot} />
          </WidgetGate>
          <WidgetGate show={cfg.widgets.route}>
            <RouteWidget snapshot={snapshot} />
          </WidgetGate>
        </div>
      </WidgetGate>
      <WidgetGate show={cfg.widgets.recentEvent}>
        <EventTickerWidget snapshot={snapshot} />
      </WidgetGate>
    </div>
  );
}
