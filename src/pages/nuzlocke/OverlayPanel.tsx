/* Stream overlay setup — OBS browser source URL (cloud runs only). */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, ExternalLink, Radio, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/lib/i18n-data';
import {
  disableOverlay,
  enableOverlay,
  isCloudRun,
  isRunOwner,
  pushToast,
  rotateOverlayToken,
  updateOverlayConfig,
  type RunEntry,
} from '@/lib/nuzlocke-store';
import type { OverlayLayout } from '@/lib/nuzlocke-overlay';
import { normalizeOverlayConfig, overlayUrl, OVERLAY_CONFIG_DEFAULT } from '@/lib/nuzlocke-overlay';
import { PixelLabel, Popover } from './ui';

const LAYOUTS: OverlayLayout[] = ['streamer', 'compact', 'minimal', 'soul-link-dual'];

export default function OverlayPanel({ entry }: { entry: RunEntry }) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const state = entry.state;
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  if (!state || !isRunOwner(state.run.id)) return null;

  const cloud = isCloudRun(state);
  const enabled = !!state.run.overlay_enabled;
  const token = state.run.overlay_token ?? '';
  const cfg = normalizeOverlayConfig(state.run.overlay_config ?? OVERLAY_CONFIG_DEFAULT);

  const copyLink = () => {
    if (!token) return;
    void navigator.clipboard?.writeText(overlayUrl(token, lang)).catch(() => undefined);
    pushToast('success', t('nuz.overlay.linkCopied'));
  };

  const preview = () => {
    if (!token) return;
    window.open(`${overlayUrl(token, lang)}?preview=1`, '_blank', 'noopener,noreferrer');
  };

  return (
    <Popover
      open={open}
      onClose={() => setOpen(false)}
      align="right"
      anchor={
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 items-center gap-1.5 rounded-md border border-hairline2 px-3 text-micro12 font-semibold text-tx-secondary transition-colors hover:border-gold/50 hover:text-gold"
        >
          <Radio size={13} /> {t('nuz.overlay.title')}
        </button>
      }
      className="w-[17rem] p-3"
    >
      <PixelLabel className="text-gold">{t('nuz.overlay.panel')}</PixelLabel>
      {!cloud ? (
        <p className="mt-2 text-micro12 leading-snug text-tx-secondary">{t('nuz.overlay.cloudRequired')}</p>
      ) : (
        <>
          <p className="mt-1.5 text-micro11 leading-snug text-tx-muted">{t('nuz.overlay.hint')}</p>
          <label className="mt-3 flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={enabled}
              disabled={busy}
              onChange={() => {
                setBusy(true);
                void (enabled ? disableOverlay(state.run.id) : enableOverlay(state.run.id, { locale: lang }))
                  .then(() => setBusy(false))
                  .catch(() => setBusy(false));
              }}
              className="accent-gold"
            />
            <span className="text-micro12 text-tx-primary">{t('nuz.overlay.enable')}</span>
          </label>
          {enabled && token && (
            <>
              <label className="mt-3 block">
                <span className="font-pixel text-[8px] text-tx-muted">{t('nuz.overlay.layout')}</span>
                <select
                  value={cfg.layout}
                  disabled={busy}
                  onChange={(e) => {
                    const layout = e.target.value as OverlayLayout;
                    setBusy(true);
                    void updateOverlayConfig(state.run.id, { layout })
                      .then(() => setBusy(false))
                      .catch(() => setBusy(false));
                  }}
                  className="mt-1 w-full rounded-md border border-hairline2 bg-surface2 px-2 py-1.5 text-micro12 text-tx-primary"
                >
                  {LAYOUTS.map((l) => (
                    <option key={l} value={l}>
                      {t(`nuz.overlay.layouts.${l}`)}
                    </option>
                  ))}
                </select>
              </label>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={copyLink}
                  className="flex flex-1 items-center justify-center gap-1 rounded-md border border-gold/50 px-2 py-2 text-micro11 font-semibold text-gold hover:bg-gold/10"
                >
                  <Copy size={12} /> {t('nuz.overlay.copyLink')}
                </button>
                <button
                  type="button"
                  onClick={preview}
                  className="flex items-center justify-center gap-1 rounded-md border border-hairline2 px-2 py-2 text-micro11 text-tx-secondary hover:text-gold"
                  title={t('nuz.overlay.preview')}
                >
                  <ExternalLink size={12} />
                </button>
              </div>
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  if (!window.confirm(t('nuz.overlay.rotateConfirm'))) return;
                  setBusy(true);
                  void rotateOverlayToken(state.run.id)
                    .then(() => setBusy(false))
                    .catch(() => setBusy(false));
                }}
                className="mt-2 flex w-full items-center justify-center gap-1 font-pixel text-[8px] text-tx-muted hover:text-gold"
              >
                <RefreshCw size={10} /> {t('nuz.overlay.rotate')}
              </button>
              <p className="mt-3 text-[10px] leading-snug text-tx-muted">{t('nuz.overlay.obsHelp')}</p>
            </>
          )}
        </>
      )}
    </Popover>
  );
}
