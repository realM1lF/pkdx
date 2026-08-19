/* OBS browser source — polls snapshot RPC + listens for broadcast ticks. */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  fetchOverlaySnapshot,
  isOverlayToken,
  normalizeOverlayConfig,
  subscribeOverlayBroadcast,
  type OverlaySnapshot,
} from '@/lib/nuzlocke-overlay';
import {
  CompactLayout,
  MinimalLayout,
  SoulLinkDualLayout,
  StreamerLayout,
} from './OverlayLayouts';
import './overlay.css';

const POLL_MS = 1500;

export default function NuzlockeOverlay() {
  const { overlayToken = '' } = useParams<{ overlayToken: string }>();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const [snapshot, setSnapshot] = useState<OverlaySnapshot | null>(null);
  const [invalid, setInvalid] = useState(false);
  const updatedRef = useRef<string | null>(null);
  const preview = searchParams.get('preview') === '1';

  const token = decodeURIComponent(overlayToken).trim().toUpperCase();

  const load = useCallback(async () => {
    if (!isOverlayToken(token)) {
      setInvalid(true);
      setSnapshot(null);
      return;
    }
    const next = await fetchOverlaySnapshot(token);
    if (!next) {
      setInvalid(true);
      setSnapshot(null);
      return;
    }
    setInvalid(false);
    if (next.updated_at !== updatedRef.current) {
      updatedRef.current = next.updated_at;
      setSnapshot(next);
    }
  }, [token]);

  useEffect(() => {
    void load();
    const poll = window.setInterval(() => void load(), POLL_MS);
    const unsub = subscribeOverlayBroadcast(token, () => {
      void load();
    });
    return () => {
      window.clearInterval(poll);
      unsub();
    };
  }, [load, token]);

  const layout = useMemo(() => {
    if (!snapshot) return null;
    const cfg = normalizeOverlayConfig(snapshot.config);
    switch (cfg.layout) {
      case 'compact':
        return <CompactLayout snapshot={snapshot} />;
      case 'minimal':
        return <MinimalLayout snapshot={snapshot} />;
      case 'soul-link-dual':
        return <SoulLinkDualLayout snapshot={snapshot} />;
      default:
        return <StreamerLayout snapshot={snapshot} />;
    }
  }, [snapshot]);

  if (invalid && preview) {
    return (
      <p className="overlay-preview-hint p-4">{t('nuz.overlay.invalid')}</p>
    );
  }

  if (!snapshot) {
    return null;
  }

  return (
    <div
      className="inline-block p-1"
      style={{
        width: searchParams.get('w') ? `${searchParams.get('w')}px` : undefined,
      }}
    >
      {layout}
    </div>
  );
}
