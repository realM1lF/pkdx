/* LeftRail — the 232px KPI rail (maps.md §2.4): coverage ring, KPI grid,
 * TOP SPAWNS / RAREST leaderboards keyed to the loaded version data. */
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { MapNode, RegionMap } from '@/lib/regions';
import { accentRgb, nodeIndex, nodeName } from '@/lib/regions';
import { nameOfPokemon, useLanguage } from '@/lib/i18n-data';
import type { NodeMapData, SpawnLeader } from '@/lib/mapdata';
import { itemCountForRegion, speciesUnion, spawnLeaders } from '@/lib/mapdata';
import Sprite from '@/components/Sprite';

export interface RailStats {
  locations: number;
  species: number;
  items: number;
  rarest: string;
  common: SpawnLeader[];
  rare: SpawnLeader[];
}

export function computeRailStats(region: RegionMap, data: ReadonlyMap<string, NodeMapData>): RailStats {
  const { common, rare } = spawnLeaders(data);
  return {
    locations: region.nodes.length,
    species: speciesUnion(data),
    items: itemCountForRegion(region.region),
    rarest: rare.length > 0 ? `${rare[0].rate}%` : '—',
    common,
    rare,
  };
}

function LeaderRow({
  leader,
  node,
  accent,
  onPick,
}: {
  leader: SpawnLeader;
  node: MapNode | undefined;
  accent: string;
  onPick: () => void;
}) {
  const { t } = useTranslation();
  const lang = useLanguage();
  return (
    <button
      type="button"
      onClick={onPick}
      className="group flex w-full items-center gap-2 rounded-md px-1.5 py-1 text-left transition-colors hover:bg-surface3"
      title={node ? t('maps.flyTo', { label: nodeName(node, lang) }) : undefined}
    >
      <span className="h-6 w-6 shrink-0">
        <Sprite id={leader.pokemonId} name={leader.slug} era={leader.pokemonId <= 649 ? 'gen5' : 'default'} className="h-6 w-6" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-micro12 font-medium leading-tight text-tx-primary transition-colors group-hover:text-gold">
          {nameOfPokemon(leader.pokemonId, lang)}
        </span>
        <span className="block truncate text-micro9 text-tx-muted">{node ? nodeName(node, lang) : ''}</span>
      </span>
      <span className="shrink-0 font-display text-micro11 font-bold tabular-nums" style={{ color: accent }}>
        {leader.rate}%
      </span>
    </button>
  );
}

interface LeftRailProps {
  region: RegionMap;
  data: ReadonlyMap<string, NodeMapData>;
  scanned: number;
  total: number;
  onPickNode: (n: MapNode) => void;
}

export default function LeftRail({ region, data, scanned, total, onPickNode }: LeftRailProps) {
  const { t } = useTranslation();
  const rgb = accentRgb(region.accent);
  const byId = useMemo(() => nodeIndex(region), [region]);
  const stats = useMemo(() => computeRailStats(region, data), [region, data]);

  const R = 28;
  const C = 2 * Math.PI * R;
  const progress = total > 0 ? scanned / total : 0;

  return (
    <aside className="nz-slim-scroll flex w-[14.5rem] shrink-0 flex-col gap-4 overflow-y-auto border-r border-hairline bg-surface1/90 px-4 py-4 backdrop-blur-md" data-lenis-prevent>
      {/* coverage ring */}
      <div className="flex items-center gap-3">
        <svg width={64} height={64} viewBox="0 0 64 64" className="shrink-0">
          <circle cx={32} cy={32} r={R} fill="none" stroke="#1F2433" strokeWidth={5} />
          <circle
            cx={32}
            cy={32}
            r={R}
            fill="none"
            stroke={region.accent}
            strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - progress)}
            transform="rotate(-90 32 32)"
            style={{ transition: 'stroke-dashoffset 400ms cubic-bezier(0.16,1,0.3,1)', filter: `drop-shadow(0 0 6px rgba(${rgb},0.6))` }}
          />
          <text x={32} y={37} textAnchor="middle" fontFamily="Orbitron, sans-serif" fontWeight={800} fontSize={14} fill="#F4F6FC">
            {Math.round(progress * 100)}%
          </text>
        </svg>
        <div>
          <div className="pixel-label text-[8px] text-tx-muted">{t('maps.coverage')}</div>
          <div className="mt-0.5 text-micro11 font-medium tabular-nums text-tx-secondary">
            {t('maps.scanned', { scanned, total })}
          </div>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-2">
        {(
          [
            [t('maps.locations'), stats.locations],
            [t('maps.species'), stats.species],
            [t('maps.items'), stats.items],
            [t('maps.rarest'), stats.rarest],
          ] as Array<[string, string | number]>
        ).map(([label, value]) => (
          <div key={label} className="rounded-md border border-hairline bg-surface1 px-2.5 py-2">
            <div className="pixel-label text-[8px] text-tx-muted">{label}</div>
            <div className="mt-0.5 font-display text-[1rem] font-bold tabular-nums" style={{ color: region.accent }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* top spawns */}
      {stats.common.length > 0 && (
        <section aria-label={t('maps.topSpawns')}>
          <div className="pixel-label mb-1.5 text-[8px] text-tx-muted">{t('maps.topSpawns')}</div>
          <div className="flex flex-col">
            {stats.common.map((l) => (
              <LeaderRow
                key={`c-${l.pokemonId}`}
                leader={l}
                node={byId.get(l.nodeId)}
                accent={region.accent}
                onPick={() => {
                  const n = byId.get(l.nodeId);
                  if (n) onPickNode(n);
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* rarest */}
      {stats.rare.length > 0 && (
        <section aria-label={t('maps.rarest')}>
          <div className="pixel-label mb-1.5 text-[8px] text-tx-muted">{t('maps.rarest')}</div>
          <div className="flex flex-col">
            {stats.rare.map((l) => (
              <LeaderRow
                key={`r-${l.pokemonId}`}
                leader={l}
                node={byId.get(l.nodeId)}
                accent="#F6C945"
                onPick={() => {
                  const n = byId.get(l.nodeId);
                  if (n) onPickNode(n);
                }}
              />
            ))}
          </div>
        </section>
      )}

      <p className="mt-auto text-micro10 font-medium leading-relaxed text-tx-muted">
        {t('maps.ratesNote')}
      </p>
    </aside>
  );
}
