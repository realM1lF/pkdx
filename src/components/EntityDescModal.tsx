/* EntityDescModal — Holo-Dex description dialog for moves / items / abilities
 * (Batch E, EP2). Dark/gold, z-[95], Esc + outside-click close (ShowdownDialog
 * pattern). Data comes from the lazy desc artifacts via useEntityDesc — the
 * JSON chunk loads on first open, so unknown slugs and slow networks degrade
 * to a gold "no description" fallback, never red.
 *
 * DE/EN: the primary text follows the UI language; when both language texts
 * exist an in-modal DE/EN toggle appears. Missing German text falls back to
 * EN with a small gold hint (documented fallback rule, see desc-data.ts). */
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Coins, Info, Package, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import TypeBadge from '@/components/TypeBadge';
import { useEntityDesc, entitySlug } from '@/lib/desc-data';
import type { AbilityDesc, DescKind, ItemDesc, MoveDesc } from '@/lib/desc-data';
import { useLanguage } from '@/lib/i18n-data';
import type { Lang } from '@/lib/i18n-data';
import { displayName } from '@/lib/pokeapi';
import type { PokemonType } from '@/lib/types';
import { cn } from '@/lib/utils';

export interface EntityModalTarget {
  kind: DescKind;
  /** slug OR EN display name (team-builder storage) — normalized internally */
  slug: string;
}

/** controller hook: `const modal = useEntityModal()` → <EntityDescModal {...modal.props} /> */
export function useEntityModal() {
  const [target, setTarget] = useState<EntityModalTarget | null>(null);
  return {
    open: (kind: DescKind, slug: string) => setTarget({ kind, slug }),
    close: () => setTarget(null),
    props: { target, onClose: () => setTarget(null) },
  };
}

export const itemIconUrl = (slug: string) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${slug}.png`;

const ITEM_ICON = itemIconUrl;

/** item sprite with graceful fallback to a gold package glyph */
export function ItemIcon({ slug, name, size = 40 }: { slug: string; name: string; size?: number }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span
        className="grid place-items-center rounded-md border border-gold/30 bg-gold/10 text-gold"
        style={{ width: size, height: size }}
      >
        <Package size={size * 0.45} />
      </span>
    );
  }
  return (
    <img
      src={ITEM_ICON(slug)}
      alt={name}
      width={size}
      height={size}
      style={{ imageRendering: 'pixelated' }}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-md border border-hairline bg-surface2/70 px-1 py-1.5">
      <span className="font-sans text-micro13 font-bold text-tx-primary">{value}</span>
      <span className="pixel-label text-[0.4063rem] text-tx-muted">{label}</span>
    </div>
  );
}

function Chip({ children, gold = false }: { children: React.ReactNode; gold?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-pill border px-2 py-0.5 font-sans text-[11px] leading-none font-semibold uppercase tracking-wider',
        gold ? 'border-gold/40 bg-gold/10 text-gold' : 'border-hairline bg-surface2 text-tx-secondary',
      )}
    >
      {children}
    </span>
  );
}

/** pick the two language texts from a raw record (abilities prefer short_effect) */
function langTexts(raw: MoveDesc | ItemDesc | AbilityDesc | null): { en: string | null; de: string | null } {
  if (!raw) return { en: null, de: null };
  const a = raw as AbilityDesc;
  return {
    en: a.effectShort ?? raw.fen ?? null,
    de: a.effectShortDe ?? raw.fde ?? null,
  };
}

interface EntityDescModalProps {
  target: EntityModalTarget | null;
  onClose: () => void;
}

export default function EntityDescModal({ target, onClose }: EntityDescModalProps) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const slug = target ? entitySlug(target.slug) : null;
  const desc = useEntityDesc(target?.kind ?? 'move', target ? slug : null);

  /* text language inside the modal — defaults to the UI language */
  const [textLang, setTextLang] = useState<Lang | null>(null);
  const [prevTarget, setPrevTarget] = useState(target);
  if (prevTarget !== target) {
    setPrevTarget(target);
    setTextLang(null);
  }
  const viewLang = textLang ?? lang;

  useEffect(() => {
    if (!target) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation();
        onClose();
      }
    };
    /* capture: nested inside other z-[90] dialogs (e.g. SlotEditorModal) */
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [target, onClose]);

  const raw = target?.kind === 'move' ? desc.move : target?.kind === 'item' ? desc.item : desc.ability;
  const loading = !!target && !desc.loaded;
  const { en: enText, de: deText } = langTexts(raw);
  const text = viewLang === 'de' ? (deText ?? enText) : (enText ?? deText);
  const name =
    raw == null
      ? target
        ? displayName(entitySlug(target.slug))
        : ''
      : lang === 'de' && raw.de
        ? raw.de
        : raw.n;
  const nameEn = raw?.n ?? null;

  const move = target?.kind === 'move' ? (raw as MoveDesc | null) : null;
  const item = target?.kind === 'item' ? (raw as ItemDesc | null) : null;

  // Portal to <body>: several callers render this modal inside animated
  // (transformed) containers — e.g. the maps DetailDrawer motion.aside — where
  // `position: fixed` would resolve against the transformed ancestor and trap
  // the overlay inside the drawer. Portalling keeps it viewport-fixed.
  return createPortal(
    <AnimatePresence>
      {target && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[95] flex items-start justify-center bg-void/70 p-4 pt-[12vh] backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={name}
        >
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 180, damping: 22 }}
            className="w-full max-w-[27.5rem] overflow-hidden rounded-[1rem] border border-hairline bg-surface1 shadow-elevate"
            onClick={(e) => e.stopPropagation()}
          >
            {/* head: icon + name + close */}
            <div className="flex items-center gap-3 border-b border-hairline px-4 py-3">
              {target.kind === 'item' && slug && <ItemIcon slug={slug} name={name} size={40} />}
              <div className="min-w-0 flex-1">
                <div className="truncate font-display text-[0.9375rem] font-bold tracking-wide text-tx-primary">
                  {name}
                </div>
                {nameEn && nameEn !== name && (
                  <div className="pixel-label mt-1 text-[8px] text-tx-muted">{nameEn}</div>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={t('desc.close')}
                className="rounded-sm p-1 text-tx-muted transition-all hover:rotate-90 hover:text-gold"
              >
                <X size={14} />
              </button>
            </div>

            <div className="space-y-3 px-4 py-3">
              {/* chips row */}
              <div className="flex flex-wrap items-center gap-1.5">
                <Chip gold>{t(`desc.kind.${target.kind}`)}</Chip>
                {move?.t && <TypeBadge type={move.t as PokemonType} className="!text-micro9" />}
                {move?.dc && <Chip>{t(`detail.moves.cat${move.dc.charAt(0).toUpperCase() + move.dc.slice(1)}`)}</Chip>}
                {move?.target && <Chip>{t(`desc.targets.${move.target}`, { defaultValue: displayName(move.target) })}</Chip>}
                {item && (
                  <Chip>
                    {t(`desc.cats.${item.category}`, { defaultValue: displayName(item.category) })}
                  </Chip>
                )}
                {item && (
                  <Chip gold={!!item.cost}>
                    <Coins size={10} />
                    {item.cost ? item.cost.toLocaleString(viewLang === 'de' ? 'de-DE' : 'en-US') : t('desc.notForSale')}
                  </Chip>
                )}
              </div>

              {/* stats grid (moves) */}
              {move && (
                <div className="grid grid-cols-3 gap-1.5">
                  <StatCell label={t('desc.stats.power')} value={move.power != null ? String(move.power) : '—'} />
                  <StatCell label={t('desc.stats.acc')} value={move.acc != null ? `${move.acc}%` : '—'} />
                  <StatCell label={t('desc.stats.pp')} value={move.pp != null ? String(move.pp) : '—'} />
                  <StatCell label={t('desc.stats.priority')} value={move.priority ? `+${move.priority}` : '0'} />
                  <StatCell
                    label={t('desc.stats.crit')}
                    value={move.crit ? `+${move.crit}` : t('desc.stats.critNormal')}
                  />
                  <StatCell
                    label={t('desc.stats.effectChance')}
                    value={move.effectChance ? `${move.effectChance}%` : '—'}
                  />
                </div>
              )}

              {/* description */}
              <div className="rounded-md border border-hairline bg-abyss/60 px-3 py-2.5">
                {loading ? (
                  <div className="space-y-1.5" aria-busy="true">
                    <div className="h-3 w-11/12 animate-pulse rounded bg-surface3" />
                    <div className="h-3 w-2/3 animate-pulse rounded bg-surface3" />
                  </div>
                ) : text ? (
                  <>
                    <p className="font-sans text-micro13 leading-relaxed text-tx-secondary">{text}</p>
                    {viewLang === 'de' && !deText && enText && (
                      <p className="mt-1.5 flex items-center gap-1 font-sans text-micro10 italic text-gold/80">
                        <AlertTriangle size={10} />
                        {t('desc.enFallback')}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="flex items-center gap-1.5 font-sans text-micro12 italic text-gold">
                    <Info size={12} />
                    {t('desc.noDesc')}
                  </p>
                )}
              </div>

              {/* language toggle (only when both texts exist) */}
              {enText && deText && enText !== deText && (
                <div className="flex justify-end gap-1">
                  {(['de', 'en'] as const).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setTextLang(l)}
                      aria-pressed={viewLang === l}
                      className={cn(
                        'pixel-label rounded-sm border px-2 py-1 text-[8px] transition-colors',
                        viewLang === l
                          ? 'border-gold/60 bg-gold/10 text-gold'
                          : 'border-hairline text-tx-muted hover:border-hairline2 hover:text-tx-secondary',
                      )}
                    >
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
