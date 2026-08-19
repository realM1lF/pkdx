/* Always-visible manual-route controls — add location + reorder checklist. */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowDown, ArrowUp, ListOrdered, Plus } from 'lucide-react';
import { addCustomRoute, reorderCustomRoute } from '@/lib/nuzlocke-store';
import type { AddRouteError } from '@/lib/nuzlocke-routes';
import { normalizeCustomRoutes, customRouteToMapNode } from '@/lib/nuzlocke-routes';
import type { RunState } from '@/lib/nuzlocke-store';
import { nodeName } from '@/lib/regions';
import { useLanguage } from '@/lib/i18n-data';
import { cn } from '@/lib/utils';
import { GoldHint, PixelLabel, Popover, useShake } from './ui';
import ManualRoutesHints from './ManualRoutesHints';

export default function ManualRoutesToolbar({
  state,
  owner,
  onAdded,
}: {
  state: RunState;
  owner: boolean;
  onAdded: (routeId: string) => void;
}) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const routes = normalizeCustomRoutes(state.run.rules.customRoutes);
  const [addOpen, setAddOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [label, setLabel] = useState('');
  const [shakeKey, shake] = useShake();
  const [hint, setHint] = useState('');

  const errMsg = (code: AddRouteError) => {
    const map: Record<AddRouteError, string> = {
      empty: t('nuz.manualRoutes.errEmpty'),
      duplicate: t('nuz.manualRoutes.errDuplicate'),
      tooMany: t('nuz.manualRoutes.errTooMany'),
      tooLong: t('nuz.manualRoutes.errTooLong'),
    };
    return map[code];
  };

  const submitAdd = () => {
    const res = addCustomRoute(state.run.id, label);
    if (!res.ok) {
      setHint(errMsg(res.error));
      shake();
      window.setTimeout(() => setHint(''), 2600);
      return;
    }
    setLabel('');
    setAddOpen(false);
    onAdded(res.routeId);
  };

  const move = (routeId: string, direction: 'up' | 'down') => {
    reorderCustomRoute(state.run.id, routeId, direction);
  };

  const disabled = !owner;

  return (
    <div className="rounded-t-xl border-b border-hairline">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2">
      <PixelLabel className="text-gold">{t('nuz.manualRoutes.toolbarLabel')}</PixelLabel>
      <div className="flex flex-wrap items-center gap-2">
        <Popover
          open={addOpen}
          onClose={() => {
            setAddOpen(false);
            setLabel('');
            setHint('');
          }}
          align="right"
          className="w-[15rem]"
          anchor={
            <button
              type="button"
              disabled={disabled}
              title={disabled ? t('nuz.rules.ownerTip') : undefined}
              onClick={() => {
                setOrderOpen(false);
                setAddOpen((v) => !v);
              }}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-md border border-gold/50 bg-gold/10 px-2.5 py-1 font-pixel text-[8px] tracking-[0.06em] text-gold transition-colors hover:bg-gold/20 disabled:cursor-not-allowed disabled:opacity-40',
              )}
            >
              <Plus size={12} />
              {t('nuz.manualRoutes.addRoute')}
            </button>
          }
        >
          <div key={shakeKey} className={cn('space-y-2 p-3', shakeKey && 'nz-shake')}>
            <PixelLabel className="text-gold">{t('nuz.manualRoutes.newRoute')}</PixelLabel>
            <input
              autoFocus
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submitAdd();
                if (e.key === 'Escape') {
                  setAddOpen(false);
                  setLabel('');
                }
              }}
              placeholder={t('nuz.manualRoutes.placeholder')}
              maxLength={48}
              className="h-8 w-full rounded-sm border border-hairline2 bg-abyss/60 px-2 font-sans text-micro12 text-tx-primary outline-none placeholder:text-tx-muted focus:border-gold"
            />
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => {
                  setAddOpen(false);
                  setLabel('');
                }}
                className="flex-1 rounded-sm border border-hairline py-1 font-pixel text-[8px] text-tx-muted hover:text-tx-secondary"
              >
                {t('nuz.manualRoutes.cancel')}
              </button>
              <button
                type="button"
                onClick={submitAdd}
                className="flex-1 rounded-sm border border-gold/60 bg-gold/10 py-1 font-pixel text-[8px] text-gold hover:bg-gold/20"
              >
                {t('nuz.manualRoutes.save')}
              </button>
            </div>
            <GoldHint text={hint} show={!!hint} />
          </div>
        </Popover>

        <Popover
          open={orderOpen}
          onClose={() => setOrderOpen(false)}
          align="right"
          className="w-[17.5rem]"
          anchor={
            <button
              type="button"
              disabled={disabled || routes.length < 2}
              title={
                disabled
                  ? t('nuz.rules.ownerTip')
                  : routes.length < 2
                    ? t('nuz.manualRoutes.reorderNeedTwo')
                    : t('nuz.manualRoutes.reorderTip')
              }
              onClick={() => {
                setAddOpen(false);
                setOrderOpen((v) => !v);
              }}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-md border border-hairline2 px-2.5 py-1 font-pixel text-[8px] tracking-[0.06em] text-tx-secondary transition-colors hover:border-gold/50 hover:text-gold disabled:cursor-not-allowed disabled:opacity-40',
              )}
            >
              <ListOrdered size={12} />
              {t('nuz.manualRoutes.reorder')}
            </button>
          }
        >
          <div className="max-h-[16rem] overflow-y-auto p-2" data-lenis-prevent>
            <PixelLabel className="px-1 pb-2 text-gold">{t('nuz.manualRoutes.reorderTitle')}</PixelLabel>
            <ol className="space-y-0.5" role="list">
              {routes.map((route, i) => {
                const label = nodeName(customRouteToMapNode(route), lang);
                return (
                <li
                  key={route.id}
                  className="flex items-center gap-1 rounded-sm border border-hairline/80 bg-surface1/60 px-1.5 py-1"
                >
                  <span className="w-5 shrink-0 font-display text-micro10 font-bold tabular-nums text-tx-muted">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-pixel text-[8px] tracking-[0.04em] text-tx-secondary">
                    {label}
                  </span>
                  <span className="flex shrink-0 gap-0.5">
                    <button
                      type="button"
                      disabled={i === 0}
                      aria-label={t('nuz.manualRoutes.moveUp', { label })}
                      onClick={() => move(route.id, 'up')}
                      className="grid h-6 w-6 place-items-center rounded-sm border border-hairline2 text-tx-muted transition-colors hover:border-gold/50 hover:text-gold disabled:opacity-30"
                    >
                      <ArrowUp size={11} />
                    </button>
                    <button
                      type="button"
                      disabled={i === routes.length - 1}
                      aria-label={t('nuz.manualRoutes.moveDown', { label })}
                      onClick={() => move(route.id, 'down')}
                      className="grid h-6 w-6 place-items-center rounded-sm border border-hairline2 text-tx-muted transition-colors hover:border-gold/50 hover:text-gold disabled:opacity-30"
                    >
                      <ArrowDown size={11} />
                    </button>
                  </span>
                </li>
              );})}
            </ol>
          </div>
        </Popover>
      </div>
      </div>
      <ManualRoutesHints
        rules={state.run.rules}
        className="border-t border-hairline/60 px-4 py-2"
      />
    </div>
  );
}
