/* Nuzlocke hub — MISSION CONTROL (nuzlocke.md §1).
 * Header + sync banner + runs grid + join-by-code + New-Run wizard. */
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { motion } from 'framer-motion';
import MotionRoot from '@/components/MotionRoot';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Info, Plus, X } from 'lucide-react';
import { bootNameIndex, padNum } from '@/lib/pokeapi';
import { nameOfPokemon, useLanguage } from '@/lib/i18n-data';
import { useAuth } from '@/lib/auth';
import { LocaleLink } from '@/lib/locale-link';
import { lookupByCode, useHubRuns } from '@/lib/nuzlocke-store';
import type { JoinLookup } from '@/lib/nuzlocke-store';
import { isMultiCapable } from '@/lib/supabase';
import { anyRegionById } from '@/lib/regions-freeform';
import { cn } from '@/lib/utils';
import Wizard from './nuzlocke/Wizard';
import RunCard from './nuzlocke/RunCard';
import NuzToasts from './nuzlocke/Toasts';
import { GoldHint, InfoTip, PixelLabel, useShake } from './nuzlocke/ui';
import WhatIsNuzlocke from './nuzlocke/WhatIsNuzlocke';
import NuzlockeSeoSections from './nuzlocke/NuzlockeSeoSections';
import './nuzlocke/nuzlocke.css';

export default function Nuzlocke() {
  const { t } = useTranslation();
  const lang = useLanguage();
  const { user, ready: authReady } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { runs, archived, loading, entries } = useHubRuns();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [showArchive, setShowArchive] = useState(true);
  const presetRegion = useMemo(() => {
    const raw = searchParams.get('region');
    return raw && anyRegionById(raw) ? raw : null;
  }, [searchParams]);
  const presetRouteKey = searchParams.get('at');
  const [joinPreset, setJoinPreset] = useState<JoinLookup | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [bannerOff, setBannerOff] = useState(() => sessionStorage.getItem('pdx2.nuz.banner') === 'off');
  const [nameIdx, setNameIdx] = useState<Map<number, string>>(new Map());

  useEffect(() => {
    if (searchParams.get('wizard') === '1') {
      setWizardOpen(true);
      const next = new URLSearchParams(searchParams);
      next.delete('wizard');
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    void bootNameIndex()
      .then((idx) => setNameIdx(new Map(idx.map((e) => [e.id, e.label]))))
      .catch(() => undefined);
  }, []);

  const nameOf = useMemo(() => {
    // localized display name (de artifact) — EN label from the boot index as fallback
    return (id: number) => (nameIdx.has(id) ? nameOfPokemon(id, lang) : padNum(id));
  }, [nameIdx, lang]);

  const multi = isMultiCapable();
  /* Runs live on the account — starting and continuing both need a sign-in. */
  const needsLogin = authReady && !user;
  const visible = showAll ? runs : runs.slice(0, 6);
  const entryOf = (id: string) => entries.find((e) => e.id === id);

  const closeBanner = () => {
    setBannerOff(true);
    sessionStorage.setItem('pdx2.nuz.banner', 'off');
  };

  return (
    <MotionRoot>
    <div className="mx-auto max-w-[1440px] px-4 pb-24 pt-12 md:px-8">
      {/* ---------- header (§1.1) ---------- */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-[640px]">
          <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
            <PixelLabel className="text-gold">{t('nuz.eyebrow')}</PixelLabel>
          </motion.div>
          <motion.h1
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.06 }}
            className="mt-2 font-display text-[clamp(28px,4vw,44px)] font-extrabold leading-[1.1] text-tx-primary"
          >
            {t('nuz.title')}
          </motion.h1>
          <motion.p
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.12 }}
            className="mt-2 flex flex-wrap items-center gap-1.5 text-[14px] leading-relaxed text-tx-secondary"
          >
            {t('nuz.blurb')}
            <InfoTip text={t('nuz.nuzTip')} iconSize={13} />
            <span className="font-pixel text-[7px] tracking-[0.08em] text-tx-muted">{t('nuz.whatIs')}</span>
          </motion.p>
        </div>
        <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, delay: 0.18 }} className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setJoinPreset(null);
              setWizardOpen(true);
            }}
            className="nz-sheen flex items-center gap-2 rounded-md border border-gold/60 bg-[linear-gradient(135deg,rgba(246,201,69,0.25),rgba(246,201,69,0.10))] px-6 py-3 font-display text-[13px] font-bold tracking-[0.06em] text-tx-primary transition-all hover:-translate-y-0.5 hover:border-gold"
          >
            <Plus size={15} /> {t('nuz.newRun')}
          </button>
          <a
            href="#join-code"
            className="rounded-md border border-hairline2 px-5 py-3 text-[13px] font-semibold text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold"
          >
            {t('nuz.joinWithCode')}
          </a>
          <LocaleLink
            to="/orre"
            className="rounded-md border border-hairline2 px-5 py-3 text-[13px] font-semibold text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold"
          >
            {t('nuz.orreTracker')}
          </LocaleLink>
        </motion.div>
      </header>

      {/* ---------- sync mode banner (§1.2) ---------- */}
      {!bannerOff && (
        <motion.div
          initial={{ y: -12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.25, delay: 0.2 }}
          className="mt-5 flex h-8 items-center gap-2 rounded-full border border-hairline bg-surface1 px-4"
        >
          {multi ? (
            <>
              <span className="nz-dot-live h-2 w-2 rounded-full bg-[#45C8FF]" />
              <span className="text-[11px] tracking-wide text-tx-secondary">{t('nuz.online')}</span>
            </>
          ) : (
            <>
              <span className="h-2 w-2 rounded-full bg-gold" />
              <span className="text-[11px] tracking-wide text-tx-secondary">{t('nuz.solo')}</span>
              <InfoTip text={t('nuz.soloTip')} />
            </>
          )}
          <button type="button" onClick={closeBanner} aria-label={t('nuz.dismiss')} className="ml-auto text-tx-muted transition-colors hover:text-gold">
            <X size={12} />
          </button>
        </motion.div>
      )}

      {/* ---------- account gate (§1.2) — no run starts or continues as guest ---------- */}
      {needsLogin && (
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-md border border-gold/40 bg-gold/5 px-4 py-3">
          <div className="min-w-0 max-w-[640px]">
            <PixelLabel className="text-gold">{t('nuz.wizard.loginWallTitle')}</PixelLabel>
            <p className="mt-1 text-[13px] font-semibold text-tx-primary">{t('nuz.hubLoginRequired')}</p>
            <p className="mt-0.5 text-[12px] leading-snug text-tx-secondary">{t('nuz.hubLoginRequiredBody')}</p>
          </div>
          <LocaleLink
            to="/account"
            className="ml-auto rounded-md border border-gold/60 px-4 py-2 font-pixel text-[8px] tracking-[0.08em] text-gold transition-colors hover:bg-gold/10"
          >
            {t('nuz.wizard.loginCta')}
          </LocaleLink>
        </div>
      )}

      {/* ---------- join by code (§1.4) ---------- */}
      <JoinRow
        onJoin={(lookup) => {
          setJoinPreset(lookup);
          setWizardOpen(true);
        }}
      />

      {/* ---------- runs grid (§1.3) ---------- */}
      <section className="mt-8">
        <div className="mb-3 flex flex-wrap items-baseline gap-3">
          <h2 className="font-display text-[18px] font-bold text-tx-primary">{t('nuz.activeOps')}</h2>
          <PixelLabel>{runs.length === 1 ? t('nuz.run', { count: runs.length }) : t('nuz.runs', { count: runs.length })}</PixelLabel>
          <a
            href="#archiv"
            className="ml-auto text-[12px] font-semibold text-tx-muted transition-colors hover:text-gold"
          >
            {t('nuz.archiveJump', { count: archived.length })}
          </a>
        </div>

        {!loading && runs.length === 0 ? (
          /* empty state (§1.6) */
          <div className="grid place-items-center py-16 text-center">
            <div className="relative">
              <img src="/empty-dex.svg" alt="" className="h-[140px] opacity-60" />
              <span className="nz-dot-gold-pulse absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-gold/30" />
            </div>
            <h3 className="mt-4 font-display text-[20px] font-bold text-tx-primary">{t('nuz.emptyTitle')}</h3>
            <p className="mt-1 text-[13px] text-tx-secondary">{t('nuz.emptyBody')}</p>
            <button
              type="button"
              onClick={() => {
                setJoinPreset(null);
                setWizardOpen(true);
              }}
              className="nz-sheen mt-5 rounded-md border border-gold/60 bg-[linear-gradient(135deg,rgba(246,201,69,0.25),rgba(246,201,69,0.10))] px-6 py-3 font-display text-[13px] font-bold tracking-[0.06em] text-tx-primary transition-transform hover:-translate-y-0.5"
            >
              {t('nuz.emptyCta')}
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-12 gap-4">
              {/* new run card */}
              <motion.button
                type="button"
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                onClick={() => {
                  setJoinPreset(null);
                  setWizardOpen(true);
                }}
                className="group col-span-12 grid min-h-[150px] place-items-center rounded-lg border border-dashed border-hairline2 transition-colors hover:border-gold lg:col-span-6"
              >
                <span className="flex flex-col items-center gap-2 py-6">
                  <span className="relative">
                    <img src="/pokeball.svg" alt="" className="h-9 w-9 opacity-40 transition-opacity group-hover:opacity-90" />
                    <Plus size={16} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gold transition-transform duration-300 group-hover:rotate-90" />
                  </span>
                  <span className="font-pixel text-[9px] tracking-[0.1em] text-tx-muted transition-colors group-hover:text-gold">{t('nuz.newRunPlus')}</span>
                </span>
              </motion.button>

              {visible.map((s, i) => (
                <RunCard key={s.run.id} state={s} entry={entryOf(s.run.id)} index={i + 1} nameOf={nameOf} locked={needsLogin} />
              ))}
            </div>
            {runs.length > 6 && !showAll && (
              <button type="button" onClick={() => setShowAll(true)} className="mt-4 text-[12px] font-semibold text-tx-muted transition-colors hover:text-gold">
                {t('nuz.showAll', { count: runs.length })}
              </button>
            )}
          </>
        )}
      </section>

      {/* ---------- archive vault ---------- */}
      <section
        id="archiv"
        aria-label={t('nuz.archiveAria')}
        className="mt-10 scroll-mt-28 rounded-lg border border-hairline bg-surface1/60 px-4 py-5 md:px-5"
      >
        <div className="mb-2 flex flex-wrap items-baseline gap-3">
          <div>
            <PixelLabel className="text-gold">{t('nuz.archiveEyebrow')}</PixelLabel>
            <h2 className="mt-1 font-display text-[18px] font-bold text-tx-primary">{t('nuz.archiveTitle')}</h2>
          </div>
          <PixelLabel>{t('nuz.archiveCount', { count: archived.length })}</PixelLabel>
          {archived.length > 0 && (
            <button
              type="button"
              onClick={() => setShowArchive((o) => !o)}
              className="ml-auto text-[12px] font-semibold text-tx-muted transition-colors hover:text-gold"
            >
              {showArchive ? t('nuz.archiveHide') : t('nuz.archiveShow')}
            </button>
          )}
        </div>
        <p className="max-w-[520px] text-[12px] leading-relaxed text-tx-secondary">{t('nuz.archiveHelp')}</p>
        {archived.length === 0 ? (
          <p className="mt-3 text-[11px] text-tx-muted">{t('nuz.archiveEmpty')}</p>
        ) : showArchive ? (
          <div className="mt-4 grid grid-cols-12 gap-4">
            {archived.map((s, i) => (
              <RunCard key={s.run.id} state={s} entry={entryOf(s.run.id)} index={i} nameOf={nameOf} archived locked={needsLogin} />
            ))}
          </div>
        ) : null}
      </section>

      <WhatIsNuzlocke />
      <NuzlockeSeoSections />

      <Wizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        joinPreset={joinPreset}
        runCount={runs.length}
        presetRegion={presetRegion}
        presetRouteKey={presetRouteKey}
      />
      <NuzToasts />
    </div>
    </MotionRoot>
  );
}

/* ---------- join-by-code inline row (§1.4) ---------- */

function JoinRow({ onJoin }: { onJoin: (lookup: JoinLookup) => void }) {
  const { t } = useTranslation();
  const { user, ready: authReady } = useAuth();
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [shakeKey, shake] = useShake();
  const [hint, setHint] = useState('');

  const submit = async () => {
    if (!code.trim() || busy || !authReady) return;
    if (!user) {
      shake();
      setHint(t('nuz.joinLoginHint'));
      window.setTimeout(() => setHint(''), 3200);
      return;
    }
    setBusy(true);
    try {
      const lookup = await lookupByCode(code);
      if (lookup) {
        onJoin(lookup);
        setCode('');
      } else {
        shake();
        setHint(t('nuz.joinHint'));
        window.setTimeout(() => setHint(''), 2600);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div id="join-code" className="mt-4 flex min-h-[56px] flex-wrap items-center gap-3 rounded-md border border-hairline bg-surface1 px-4 py-2">
      <PixelLabel>{t('nuz.haveInvite')}</PixelLabel>
      {authReady && !user ? (
        <>
          <p className="max-w-md text-[12px] leading-snug text-tx-secondary">{t('nuz.joinLoginHint')}</p>
          <LocaleLink
            to="/account"
            className="rounded-md border border-gold/60 px-3 py-2 font-pixel text-[8px] tracking-[0.08em] text-gold transition-colors hover:bg-gold/10"
          >
            {t('nuz.wizard.loginCta')}
          </LocaleLink>
        </>
      ) : (
        <>
          <div className="relative">
            <div key={shakeKey} className={shakeKey ? 'nz-shake' : undefined}>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void submit();
                }}
                placeholder="SOUL-········"
                maxLength={16}
                aria-label={t('nuz.inviteAria')}
                className={cn(
                  'h-9 w-[190px] rounded-md border bg-surface2 px-3 font-display text-[14px] font-bold tracking-[0.10em] text-gold outline-none placeholder:text-tx-muted/50',
                  'border-hairline2 focus:border-gold',
                )}
              />
            </div>
            <GoldHint text={hint} show={!!hint} />
          </div>
          <button
            type="button"
            disabled={busy || !code.trim()}
            onClick={() => void submit()}
            className="nz-sheen flex items-center gap-1.5 rounded-md border border-gold/60 bg-[linear-gradient(135deg,rgba(246,201,69,0.25),rgba(246,201,69,0.10))] px-4 py-2 font-display text-[12px] font-bold tracking-[0.06em] text-tx-primary transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t('nuz.join')} <ArrowRight size={13} />
          </button>
        </>
      )}
      {!isMultiCapable() && (
        <span className="flex items-center gap-1 text-[11px] text-tx-muted">
          <Info size={11} /> {t('nuz.joinOffline')}
        </span>
      )}
      <span className="ml-auto hidden text-[10px] text-tx-muted/60 md:block">{t('nuz.codeFormat')}</span>
    </div>
  );
}
