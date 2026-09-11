/* Local-only GPT-Live voice demo. Hidden in production builds.
 * Paywall can wrap canUseGptLive() later without changing this page. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Mic, MicOff, Radio } from 'lucide-react';
import MotionRoot from '@/components/MotionRoot';
import Sprite from '@/components/Sprite';
import { canUseGptLive } from '@/lib/gpt-live/enabled';
import { GptLiveSession, type ToolTrace, type TranscriptLine, type VoiceStatus } from '@/lib/gpt-live/webrtc';
import { cn } from '@/lib/utils';

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

interface Health {
  hasKey: boolean;
}

function speciesFromTool(trace: ToolTrace | null): { id: number; name: string } | null {
  if (!trace || !trace.result || typeof trace.result !== 'object') return null;
  const result = trace.result as { ok?: boolean; species?: { id?: number; nameEn?: string; nameDe?: string } };
  if (!result.ok || !result.species?.id) return null;
  return { id: result.species.id, name: result.species.nameEn || result.species.nameDe || 'Pokémon' };
}

export default function GptLiveDemo() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [detail, setDetail] = useState('');
  const [lines, setLines] = useState<TranscriptLine[]>([]);
  const [tool, setTool] = useState<ToolTrace | null>(null);
  const [health, setHealth] = useState<Health | null>(null);
  const [shake, setShake] = useState(0);
  const sessionRef = useRef<GptLiveSession | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetch('/api/gpt-live/health')
      .then((r) => (r.ok ? r.json() : null))
      .then((body: Health | null) => {
        if (!cancelled && body) setHealth(body);
      })
      .catch(() => {
        if (!cancelled) setHealth({ hasKey: false });
      });
    return () => {
      cancelled = true;
      sessionRef.current?.dispose();
      sessionRef.current = null;
    };
  }, []);

  const live = status === 'live' || status === 'connecting' || status === 'finishing';
  const startBlocked = live || health?.hasKey !== true;
  const sprite = useMemo(() => speciesFromTool(tool), [tool]);

  if (!canUseGptLive()) return null;

  const start = async () => {
    sessionRef.current?.dispose();
    const session = new GptLiveSession({
      onStatus: (next, message) => {
        setStatus(next);
        setDetail(message ?? '');
        if (next === 'error') setShake((n) => n + 1);
      },
      onTranscript: (line) => {
        setLines((prev) => {
          const idx = prev.findIndex((row) => row.id === line.id);
          if (idx === -1) return [...prev, line];
          const next = prev.slice();
          next[idx] = line;
          return next;
        });
      },
      onTool: (trace) => setTool(trace),
    });
    sessionRef.current = session;
    try {
      await session.start();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setStatus('error');
      setDetail(message);
      setShake((n) => n + 1);
      session.dispose();
      sessionRef.current = null;
    }
  };

  const stop = () => {
    sessionRef.current?.stop();
  };

  return (
    <MotionRoot>
      <div className="mx-auto max-w-content px-4 pb-20 pt-6 md:px-8">
        <header className="mb-6">
          <p className="pixel-label text-[9px] text-gold">{t('voiceDemo.eyebrow')}</p>
          <h1 className="font-display text-2xl font-extrabold tracking-wide text-tx-primary md:text-3xl">
            {t('voiceDemo.title')}
          </h1>
          <p className="mt-2 max-w-2xl font-sans text-[0.875rem] leading-relaxed text-tx-secondary">
            {t('voiceDemo.intro')}
          </p>
          <p className="mt-2 font-sans text-[0.7813rem] text-tx-muted">{t('voiceDemo.localOnly')}</p>
        </header>

        <motion.div
          key={shake}
          initial={{ opacity: 0, y: 16 }}
          animate={shake > 0 ? { opacity: 1, y: 0, x: [0, -6, 6, -4, 4, 0] } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="rounded-lg border border-hairline bg-surface1 p-5 md:p-6"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="pixel-label text-[8px] text-gold">{t('voiceDemo.statusLabel')}</span>
            <span className="font-sans text-sm text-tx-primary">{t(`voiceDemo.status.${status}`)}</span>
            {detail && status === 'error' ? (
              <span className="min-w-0 font-sans text-sm text-gold">{detail}</span>
            ) : null}
          </div>

          {health && !health.hasKey ? (
            <p className="mt-3 font-sans text-sm text-gold">{t('voiceDemo.noKey')}</p>
          ) : null}

          <p className="mt-3 font-sans text-[0.8125rem] text-tx-secondary">{t('voiceDemo.example')}</p>
          <p className="mt-1 font-sans text-[0.75rem] text-tx-muted">{t('voiceDemo.hintSpeed')}</p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void start()}
              disabled={startBlocked}
              className={cn(
                'inline-flex h-11 items-center gap-2 rounded-md border border-gold/60 bg-gold-soft px-4 font-display text-sm font-bold tracking-wide text-tx-primary transition-shadow',
                startBlocked ? 'opacity-50' : 'hover:shadow-glow-gold',
              )}
            >
              <Mic size={16} strokeWidth={1.75} />
              {t('voiceDemo.start')}
            </button>
            <button
              type="button"
              onClick={stop}
              disabled={!live}
              className="inline-flex h-11 items-center gap-2 rounded-md border border-hairline bg-surface2 px-4 font-display text-sm font-bold tracking-wide text-tx-secondary disabled:opacity-40"
            >
              <MicOff size={16} strokeWidth={1.75} />
              {t('voiceDemo.stop')}
            </button>
            {status === 'live' ? (
              <span className="inline-flex items-center gap-1.5 font-sans text-xs text-gold">
                <Radio size={14} className="animate-pulse" />
                {t('voiceDemo.listening')}
              </span>
            ) : null}
          </div>
        </motion.div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <section className="rounded-lg border border-hairline bg-surface1 p-4">
            <p className="pixel-label text-[8px] text-gold">{t('voiceDemo.transcript')}</p>
            <ul
              className="dx-scroll mt-3 max-h-72 space-y-2 overflow-y-auto pr-1"
              data-lenis-prevent
            >
              {lines.length === 0 ? (
                <li className="font-sans text-sm text-tx-muted">{t('voiceDemo.transcriptEmpty')}</li>
              ) : (
                lines.map((line) => (
                  <li key={line.id} className="min-w-0 rounded-md border border-hairline2 bg-surface2 px-3 py-2">
                    <p className="pixel-label text-[8px] text-tx-muted">
                      {line.role === 'user' ? t('voiceDemo.you') : t('voiceDemo.assistant')}
                    </p>
                    <p className="mt-1 font-sans text-sm leading-snug text-tx-primary">{line.text}</p>
                  </li>
                ))
              )}
            </ul>
          </section>

          <section className="rounded-lg border border-hairline bg-surface1 p-4">
            <p className="pixel-label text-[8px] text-gold">{t('voiceDemo.toolLabel')}</p>
            {sprite ? (
              <div className="mt-3 flex items-center gap-3">
                <Sprite id={sprite.id} name={sprite.name} era="gen5" className="h-16 w-16" />
                <p className="min-w-0 truncate font-display text-sm font-bold tracking-wide text-tx-primary">
                  {sprite.name}
                </p>
              </div>
            ) : null}
            <pre
              className="dx-scroll mt-3 max-h-72 overflow-auto rounded-md border border-hairline2 bg-void/80 p-3 font-mono text-[11px] leading-relaxed text-tx-secondary"
              data-lenis-prevent
            >
              {tool ? JSON.stringify(tool.result, null, 2) : t('voiceDemo.toolEmpty')}
            </pre>
          </section>
        </div>

        <p className="mt-6 font-sans text-[0.75rem] text-tx-muted">{t('voiceDemo.paywallNote')}</p>
      </div>
    </MotionRoot>
  );
}
