/* ScoutTooltip — node hover readout (maps.md §2.5): kind glyph + label,
 * `N POKÉMON · M ITEMS`, method dots with top rates, CLICK TO OPEN hint.
 * Anchored to the node, flips at canvas edges. */
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Fish, Footprints, Sparkles, Waves } from 'lucide-react';
import type { MapNode, RegionMap } from '@/lib/regions';
import { accentRgb, nodeName, versionLabel } from '@/lib/regions';
import { useLanguage } from '@/lib/i18n-data';
import type { MethodBucket, NodeMapData } from '@/lib/mapdata';

interface ScoutTooltipProps {
  node: MapNode;
  region: RegionMap;
  /** undefined → still scanning */
  nd: NodeMapData | undefined;
  itemCount: number;
  version: string;
  x: number;
  y: number;
  flipX: boolean;
  flipY: boolean;
}

const METHOD_META: Array<{ bucket: MethodBucket; short: string; icon: typeof Footprints }> = [
  { bucket: 'WALK', short: 'W', icon: Footprints },
  { bucket: 'SURF', short: 'S', icon: Waves },
  { bucket: 'FISH', short: 'F', icon: Fish },
  { bucket: 'OTHER', short: 'O', icon: Sparkles },
];

export default function ScoutTooltip({ node, region, nd, itemCount, version, x, y, flipX, flipY }: ScoutTooltipProps) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const rgb = accentRgb(region.accent);
  return (
    <motion.div
      className="pointer-events-none absolute z-30 w-[11.875rem] rounded-sm border bg-surface2 px-3 py-2 shadow-elevate"
      style={{
        left: x,
        top: y,
        borderColor: `rgba(${rgb},0.4)`,
        transform: `translate(${flipX ? 'calc(-100% + 18px)' : '-18px'}, ${flipY ? '18px' : 'calc(-100% - 18px)'})`,
      }}
      initial={{ opacity: 0, scale: 0.92, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 4 }}
      transition={{ type: 'spring', stiffness: 500, damping: 32 }}
      role="tooltip"
    >
      {/* line 1 — kind + label + order */}
      <div className="flex items-baseline justify-between gap-2">
        <span className="truncate text-micro13 font-bold text-tx-primary">{nodeName(node, lang)}</span>
        <span className="pixel-label shrink-0 text-[8px] text-tx-muted">{t('maps.order', { n: node.order })}</span>
      </div>
      <div className="pixel-label mt-0.5 text-[8px]" style={{ color: region.accent }}>
        {t(`maps.kind${node.kind.charAt(0).toUpperCase() + node.kind.slice(1)}`, { defaultValue: node.kind })}
        {node.postGame ? ` · ${t('maps.postGame')}` : ''}
      </div>

      {/* line 2 — scout readout */}
      <div className="mt-1.5 font-display text-micro12 font-bold tabular-nums">
        {nd === undefined ? (
          <span className="maps-shimmer pixel-label text-[8px] text-tx-secondary">{t('maps.scanningShort')}</span>
        ) : nd.status === 'loaded' ? (
          <span>
            <span style={{ color: region.accent }}>{nd.pokemonCount} {t('maps.pokemonUnit')}</span>
            <span className="text-tx-muted"> · </span>
            <span className={itemCount > 0 ? 'text-gold' : 'text-tx-muted/60'}>{itemCount} {t('maps.itemsUnit')}</span>
          </span>
        ) : (
          <span className="pixel-label text-[8px] text-tx-muted">{t('maps.noWild', { version: versionLabel(version) })}</span>
        )}
      </div>

      {/* line 3 — method dots with top rates */}
      {nd?.status === 'loaded' && (
        <div className="mt-1 flex items-center gap-2.5 text-micro10 font-medium text-tx-muted">
          {METHOD_META.filter((m) => nd.methodTop[m.bucket] !== undefined).map((m) => {
            const Icon = m.icon;
            return (
              <span key={m.bucket} className="inline-flex items-center gap-1 tabular-nums">
                <Icon size={10} style={{ color: region.accent }} />
                {m.short} {nd.methodTop[m.bucket]}%
              </span>
            );
          })}
        </div>
      )}

      {/* hint */}
      <div className="pixel-label mt-1.5 text-[8px] text-tx-primary/40">{t('maps.clickToOpen')}</div>
    </motion.div>
  );
}
