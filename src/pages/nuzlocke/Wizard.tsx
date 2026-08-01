/* Nuzlocke — New Run wizard (nuzlocke.md §1.5) + join-by-code flow (§1.4).
 * 3 steps: 01 GAME → 02 CREW → 03 RULES; success pane mints the invite code. */
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useLocalePath } from '@/lib/locale-link';
import { useLanguage } from '@/lib/i18n-data';
import i18n from '@/i18n';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy, Minus, Plus } from 'lucide-react';
import { REGIONS, coverageTier, regionName, versionLabel, viewBoxParts } from '@/lib/regions';
import type { RegionId } from '@/lib/regions';
import { isRegionId } from '@/lib/regions';
import { FREEFORM_REGIONS, anyRegionById } from '@/lib/regions-freeform';
import {
  DEFAULT_RULES,
  MAX_PLAYERS,
  PLAYER_COLORS,
  createRun,
  joinRun,
  pushToast,
} from '@/lib/nuzlocke-store';
import type { JoinLookup, NuzRules } from '@/lib/nuzlocke-store';
import { RULE_PRESETS, gymCapPreview } from '@/lib/nuzlocke-rules';
import type { RulePresetKey } from '@/lib/nuzlocke-rules';
import { isMultiCapable } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { BadgeStepper, LevelCapStepper, RulePresetButtons } from './RulesBar';
import { GoldHint, GoldSwitch, InfoTip, NuzModal, PixelLabel, SparkleBurst, useShake } from './ui';

/* ---------- mini region schematic (compact re-render of /maps cards) ---------- */

function RegionSchematic({ regionId, accent }: { regionId: RegionId; accent: string }) {
  const region = REGIONS.find((r) => r.region === regionId);
  if (!region) return null;
  const [, , w, h] = viewBoxParts(region);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full" aria-hidden>
      {region.edges.map((e, i) => {
        const a = region.nodes.find((n) => n.id === e.from);
        const b = region.nodes.find((n) => n.id === e.to);
        if (!a || !b) return null;
        return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={accent} strokeOpacity="0.14" strokeWidth="6" />;
      })}
      {region.nodes.map((n) => (
        <circle key={n.id} cx={n.x} cy={n.y} r={n.kind === 'city' ? 10 : 7} fill={accent} fillOpacity={n.kind === 'city' ? 0.8 : 0.45} />
      ))}
    </svg>
  );
}

/* ---------- wizard ---------- */

interface WizardProps {
  open: boolean;
  onClose: () => void;
  /** set → join-by-code mode (§1.4 valid code springs into step 2) */
  joinPreset?: JoinLookup | null;
  runCount: number;
  presetRegion?: RegionId | null;
  presetRouteKey?: string | null;
}

interface CrewPlayer {
  name: string;
  color: string;
}

export default function Wizard({ open, onClose, joinPreset, runCount, presetRegion, presetRouteKey }: WizardProps) {
  const navigate = useNavigate();
  const localePath = useLocalePath();
  const { t } = useTranslation();
  const lang = useLanguage();
  const joinMode = !!joinPreset;

  const [step, setStep] = useState(0); // join mode starts at 1
  /* EP5.3 — atlas RegionId or freeform (map-less Gen 6–9) region id */
  const [regionId, setRegionId] = useState<string>('kanto');
  const region = useMemo(() => anyRegionById(regionId) ?? REGIONS[0], [regionId]);
  const [game, setGame] = useState(region.defaultVersion);
  const [name, setName] = useState('');
  const [crew, setCrew] = useState<CrewPlayer[]>([{ name: '', color: PLAYER_COLORS[0] }]);
  const [soulLink, setSoulLink] = useState(false);
  const [online, setOnline] = useState(true);
  const [rules, setRules] = useState<NuzRules>({ ...DEFAULT_RULES });
  const [joinName, setJoinName] = useState('');
  const [joinColor, setJoinColor] = useState<string>(PLAYER_COLORS[1]);
  const [busy, setBusy] = useState(false);
  const [invite, setInvite] = useState<string | null>(null);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [shakeKey, shake] = useShake();
  const [hint, setHint] = useState('');
  const [copied, setCopied] = useState(false);
  /* the auto-suggested name; overwritten on region switch until the user types */
  const [autoName, setAutoName] = useState('');

  const reset = () => {
    setStep(joinPreset ? 1 : 0);
    const startRegion = presetRegion && isRegionId(presetRegion) ? presetRegion : 'kanto';
    setRegionId(startRegion);
    const startMap = REGIONS.find((r) => r.region === startRegion) ?? REGIONS[0];
    setGame(startMap.defaultVersion);
    const suggestion = t('nuz.wizard.runNameSuggestion', { region: regionName(startMap, lang), n: runCount + 1 });
    setAutoName(suggestion);
    setName(suggestion);
    setCrew([{ name: '', color: PLAYER_COLORS[0] }]);
    setSoulLink(false);
    setOnline(true);
    setRules({ ...DEFAULT_RULES });
    setJoinName('');
    setInvite(null);
    setCreatedId(null);
    setHint('');
    setCopied(false);
  };

  /* reset when opened */
  const [wasOpen, setWasOpen] = useState(false);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) reset();
  }

  const fail = (msg: string) => {
    setHint(msg);
    shake();
    window.setTimeout(() => setHint(''), 2600);
  };

  const startRun = async () => {
    if (!name.trim()) {
      fail(t('nuz.wizard.failName'));
      return;
    }
    setBusy(true);
    try {
      const res = await createRun({
        name: name.trim(),
        region: regionId,
        game,
        players: crew.map((p, i) => ({ name: p.name.trim() || (i === 0 ? t('nuz.wizard.you') : `PLAYER ${i + 1}`), color: p.color })),
        rules: { ...rules, soulLink },
        online: online && isMultiCapable(),
      });
      if (res.inviteCode) {
        setInvite(res.inviteCode);
        setCreatedId(res.state.run.id);
      } else {
        onClose();
        navigate(localePath(`/nuzlocke/${res.state.run.id}`), {
          state: presetRouteKey ? { prefillRoute: presetRouteKey } : undefined,
        });
      }
    } finally {
      setBusy(false);
    }
  };

  const doJoin = async () => {
    if (!joinPreset) return;
    if (!joinName.trim()) {
      fail(t('nuz.wizard.failJoinName'));
      return;
    }
    setBusy(true);
    try {
      const state = await joinRun(joinPreset, joinName, joinColor);
      if (!state) {
        fail(t('nuz.wizard.failJoin'));
        return;
      }
      onClose();
      navigate(localePath(`/nuzlocke/${state.run.id}`));
    } finally {
      setBusy(false);
    }
  };

  const gymPreview = useMemo(() => gymCapPreview(regionId, rules.badgesCleared), [regionId, rules.badgesCleared]);

  const applyPreset = (key: RulePresetKey) => {
    const preset = RULE_PRESETS[key];
    setRules((r) => ({ ...r, ...preset }));
    if (typeof preset.soulLink === 'boolean') setSoulLink(preset.soulLink);
  };

  const copyInvite = () => {
    if (!invite) return;
    void navigator.clipboard?.writeText(invite).catch(() => undefined);
    setCopied(true);
    pushToast('success', i18n.t('nuz.toast.inviteCopied', { code: invite }));
    window.setTimeout(() => setCopied(false), 1600);
  };

  const steps = [t('nuz.wizard.stepGame'), t('nuz.wizard.stepCrew'), t('nuz.wizard.stepRules')];

  return (
    <NuzModal open={open} onClose={onClose}>
      <div className="p-5">
        {/* progress dots */}
        {!invite && (
          <div className="mb-4 flex items-center gap-3">
            {(joinMode ? [steps[1]] : steps).map((s) => {
              const idx = steps.indexOf(s);
              const active = joinMode ? true : idx === step;
              const done = !joinMode && idx < step;
              return (
                <span key={s} className="flex items-center gap-1.5">
                  <span className={cn('h-1.5 w-1.5 rounded-full', active ? 'bg-gold' : done ? 'bg-gold/50' : 'bg-surface3')} />
                  <span className={cn('font-pixel text-[7px] tracking-[0.08em]', active ? 'text-gold' : 'text-tx-muted')}>{s}</span>
                </span>
              );
            })}
          </div>
        )}

        <AnimatePresence mode="wait">
          {invite ? (
            /* ---------- success: invite code celebration ---------- */
            <motion.div key="done" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="py-6 text-center">
              <div className="relative mx-auto mb-4 w-fit">
                <img src="/pokeball.svg" alt="" className="h-14 w-14" />
                <SparkleBurst burstKey={1} />
              </div>
              <PixelLabel className="text-gold">{t('nuz.wizard.online')}</PixelLabel>
              <div className="mx-auto mt-3 flex w-fit items-center gap-2 rounded-md border border-gold/60 bg-gold/10 px-4 py-2">
                <span className="font-display text-lg font-bold tracking-[0.12em] text-gold">{invite}</span>
                <button type="button" onClick={copyInvite} className="grid h-7 w-7 place-items-center rounded-sm border border-gold/40 text-gold transition-colors hover:bg-gold/20" aria-label={t('nuz.wizard.copyInvite')}>
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                </button>
              </div>
              <p className="mt-2 text-[12px] text-tx-muted">{t('nuz.wizard.anyoneCanJoin')}</p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (createdId) navigate(localePath(`/nuzlocke/${createdId}`));
                }}
                className="nz-sheen mx-auto mt-5 block rounded-md border border-gold/60 bg-[linear-gradient(135deg,rgba(246,201,69,0.25),rgba(246,201,69,0.10))] px-7 py-3 font-display text-[13px] font-bold uppercase tracking-[0.06em] text-tx-primary transition-transform hover:-translate-y-0.5"
              >
                {t('nuz.wizard.enterRun')}
              </button>
            </motion.div>
          ) : joinMode && joinPreset ? (
            /* ---------- join flow ---------- */
            <motion.div key="join" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
              <div className="mb-4 rounded-md border border-gold/30 bg-gold/5 px-3 py-2 text-[12px] text-tx-secondary">
                {t('nuz.wizard.joiningRun')} <span className="font-semibold text-tx-primary">“{joinPreset.run.name}”</span> — {joinPreset.players.length === 1 ? t('nuz.wizard.playersInside', { count: 1 }) : t('nuz.wizard.playersInsidePlural', { count: joinPreset.players.length })}
              </div>
              <PixelLabel>{t('nuz.wizard.yourTrainer')}</PixelLabel>
              <div className="relative mt-2">
                <div key={shakeKey} className={shakeKey ? 'nz-shake' : undefined}>
                  <input
                    value={joinName}
                    onChange={(e) => setJoinName(e.target.value)}
                    placeholder={t('nuz.wizard.trainerName')}
                    maxLength={18}
                    className="h-10 w-full rounded-md border border-hairline2 bg-surface1 px-3 text-[14px] text-tx-primary outline-none placeholder:text-tx-muted focus:border-gold"
                  />
                </div>
                <GoldHint text={hint} show={!!hint} />
              </div>
              <PixelLabel className="mt-4 block">{t('nuz.wizard.pickColor')}</PixelLabel>
              <div className="mt-2 flex gap-2">
                {PLAYER_COLORS.map((c) => {
                  const taken = joinPreset.players.some((p) => p.color === c);
                  return (
                    <button
                      key={c}
                      type="button"
                      disabled={taken}
                      onClick={() => setJoinColor(c)}
                      className={cn('h-8 w-8 rounded-full border-2 transition-transform', taken && 'cursor-not-allowed opacity-25', joinColor === c ? 'scale-110 border-white' : 'border-transparent')}
                      style={{ background: c }}
                      title={taken ? t('nuz.wizard.colorTaken') : c}
                      aria-label={`color ${c}`}
                    />
                  );
                })}
              </div>
              <button
                type="button"
                disabled={busy}
                onClick={() => void doJoin()}
                className="nz-sheen mt-6 w-full rounded-md border border-gold/60 bg-[linear-gradient(135deg,rgba(246,201,69,0.25),rgba(246,201,69,0.10))] py-3 font-display text-[13px] font-bold uppercase tracking-[0.06em] text-tx-primary transition-transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {busy ? t('nuz.wizard.joining') : t('nuz.wizard.joinRun')}
              </button>
            </motion.div>
          ) : step === 0 ? (
            /* ---------- step 1: game & region ---------- */
            <motion.div key="s0" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
              <PixelLabel className="text-gold">{t('nuz.wizard.chooseRegion')}</PixelLabel>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
                {REGIONS.map((r) => {
                  const active = r.region === regionId;
                  return (
                    <button
                      key={r.region}
                      type="button"
                      onClick={() => {
                        setRegionId(r.region);
                        setGame(r.defaultVersion);
                        if (!name || name === autoName) {
                          const next = t('nuz.wizard.runNameSuggestion', { region: regionName(r, lang), n: runCount + 1 });
                          setAutoName(next);
                          setName(next);
                        }
                      }}
                      className={cn(
                        'h-[96px] rounded-md border p-1.5 text-left transition-all duration-200',
                        active ? 'border-gold bg-surface2 shadow-[0_0_16px_rgba(246,201,69,0.25)]' : 'border-hairline bg-surface1 hover:border-hairline2',
                      )}
                    >
                      <div className="h-[52px] overflow-hidden rounded-sm bg-void/60 p-1">
                        <RegionSchematic regionId={r.region} accent={r.accent} />
                      </div>
                      <div className="mt-1 flex items-center justify-between px-0.5">
                        <span className="text-[11px] font-semibold text-tx-primary">{regionName(r, lang)}</span>
                        <span className="font-pixel text-[6px] text-tx-muted">{coverageTier(r)}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              {/* EP5.3 — map-less Gen 6–9 regions: text-mode runs, no map */}
              <PixelLabel className="mt-3 block !text-[7px] text-tx-muted">{t('nuz.wizard.freeformGroup')}</PixelLabel>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
                {FREEFORM_REGIONS.map((r) => {
                  const active = r.region === regionId;
                  return (
                    <button
                      key={r.region}
                      type="button"
                      onClick={() => {
                        setRegionId(r.region);
                        setGame(r.defaultVersion);
                        if (!name || name === autoName) {
                          const next = t('nuz.wizard.runNameSuggestion', { region: regionName(r, lang), n: runCount + 1 });
                          setAutoName(next);
                          setName(next);
                        }
                      }}
                      className={cn(
                        'rounded-md border p-1.5 text-left transition-all duration-200',
                        active ? 'border-gold bg-surface2 shadow-[0_0_16px_rgba(246,201,69,0.25)]' : 'border-hairline bg-surface1 hover:border-hairline2',
                      )}
                    >
                      <div className="flex h-[52px] items-center justify-center rounded-sm bg-void/60 p-1">
                        <span className="font-pixel text-[7px] tracking-[0.12em]" style={{ color: r.accent }}>
                          {t('nuz.wizard.textMode')}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between px-0.5">
                        <span className="text-[11px] font-semibold text-tx-primary">{regionName(r, lang)}</span>
                        <span className="font-pixel text-[6px] text-tx-muted">{r.gen}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              <PixelLabel className="mt-4 block text-gold">{t('nuz.wizard.gameVersion')}</PixelLabel>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {region.versions.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setGame(v)}
                    className={cn(
                      'rounded-full border px-2.5 py-1 font-pixel text-[7px] tracking-[0.08em] transition-all',
                      game === v ? 'border-gold bg-gold/15 text-gold' : 'border-hairline2 text-tx-muted hover:border-gold/50 hover:text-tx-secondary',
                    )}
                  >
                    {versionLabel(v)}
                  </button>
                ))}
              </div>
              <PixelLabel className="mt-4 block text-gold">{t('nuz.wizard.runName')}</PixelLabel>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('nuz.wizard.runNameSuggestion', { region: regionName(region, lang), n: runCount + 1 })}
                maxLength={40}
                className="mt-2 h-10 w-full rounded-md border border-hairline2 bg-surface1 px-3 font-display text-[14px] font-bold text-tx-primary outline-none placeholder:text-tx-muted focus:border-gold"
              />
              <WizardFooter back={null} next={() => setStep(1)} nextLabel={t('nuz.wizard.crewNext')} />
            </motion.div>
          ) : step === 1 ? (
            /* ---------- step 2: crew ---------- */
            <motion.div key="s1" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
              <PixelLabel className="text-gold">{t('nuz.wizard.crew', { max: MAX_PLAYERS })}</PixelLabel>
              <div className="mt-2 space-y-2">
                {crew.map((p, i) => (
                  <div key={i} className="flex h-11 items-center gap-2 rounded-md border border-hairline bg-surface1 px-2">
                    <button
                      type="button"
                      onClick={() =>
                        setCrew((c) => c.map((x, xi) => (xi === i ? { ...x, color: PLAYER_COLORS[(PLAYER_COLORS.indexOf(x.color as (typeof PLAYER_COLORS)[number]) + 1) % PLAYER_COLORS.length] } : x)))
                      }
                      className="h-6 w-6 shrink-0 rounded-full border border-white/20 transition-transform hover:scale-110"
                      style={{ background: p.color }}
                      title={t('nuz.wizard.cycleColor')}
                      aria-label={t('nuz.wizard.cycleColor')}
                    />
                    <input
                      value={p.name}
                      onChange={(e) => setCrew((c) => c.map((x, xi) => (xi === i ? { ...x, name: e.target.value } : x)))}
                      placeholder={i === 0 ? t('nuz.wizard.you') : `PLAYER ${i + 1}`}
                      maxLength={18}
                      className="h-full flex-1 bg-transparent text-[13px] font-semibold text-tx-primary outline-none placeholder:text-tx-muted"
                    />
                    <span className="font-pixel text-[7px] text-tx-muted">P{i + 1}</span>
                    {i > 0 && (
                      <button type="button" onClick={() => setCrew((c) => c.filter((_, xi) => xi !== i))} className="text-tx-muted transition-colors hover:text-gold" aria-label={t('nuz.wizard.removePlayer')}>
                        <Minus size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {crew.length < MAX_PLAYERS && (
                <button
                  type="button"
                  onClick={() => setCrew((c) => [...c, { name: '', color: PLAYER_COLORS[c.length] }])}
                  className="mt-2 flex h-9 w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-hairline2 text-[12px] text-tx-muted transition-colors hover:border-gold/60 hover:text-gold"
                >
                  <Plus size={13} /> {t('nuz.wizard.addPlayer')}
                </button>
              )}

              {/* SoulLink — the signature switch */}
              <div className={cn('mt-4 rounded-md border p-3 transition-colors', soulLink ? 'border-gold/50 bg-gold/5' : 'border-hairline bg-surface1', crew.length < 2 && 'opacity-40')}>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="font-display text-[13px] font-bold tracking-wide text-tx-primary">SOUL LINK</span>
                    <InfoTip text={t('nuz.rules.soulLinkTip')} />
                  </span>
                  <GoldSwitch checked={soulLink} onChange={setSoulLink} disabled={crew.length < 2} label={t(soulLink ? 'nuz.on' : 'nuz.off').toUpperCase()} />
                </div>
                {crew.length < 2 && <p className="mt-1 text-[10px] text-tx-muted">{t('nuz.wizard.needsTwo')}</p>}
                {soulLink && crew.length >= 2 && (
                  <svg viewBox="0 0 200 36" className="mt-2 h-9 w-full" aria-hidden>
                    <defs>
                      <linearGradient id="wz-sl" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0" stopColor={crew[0].color} />
                        <stop offset="1" stopColor={crew[1].color} />
                      </linearGradient>
                    </defs>
                    <circle cx="16" cy="18" r="6" fill={crew[0].color} />
                    <circle cx="184" cy="18" r="6" fill={crew[1].color} />
                    <path d="M 22 18 C 80 -8, 120 44, 178 18" fill="none" stroke="url(#wz-sl)" strokeWidth="2.5" strokeLinecap="round" pathLength={1} className="nz-curve" />
                  </svg>
                )}
              </div>

              {isMultiCapable() && (
                <div className="mt-4">
                  <PixelLabel className="text-gold">{t('nuz.wizard.mode')}</PixelLabel>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {[
                      { v: true, label: t('nuz.wizard.modeOnline') },
                      { v: false, label: t('nuz.wizard.modeLocal') },
                    ].map((o) => (
                      <button
                        key={o.label}
                        type="button"
                        onClick={() => setOnline(o.v)}
                        className={cn(
                          'rounded-md border px-2 py-2 font-pixel text-[7px] leading-relaxed tracking-[0.06em] transition-all',
                          online === o.v ? 'border-gold bg-gold/10 text-gold' : 'border-hairline2 text-tx-muted hover:border-gold/40',
                        )}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                  {online && (
                    <p className="mt-2 text-[11px] leading-snug text-tx-muted">{t('nuz.wizard.accountHint')}</p>
                  )}
                </div>
              )}
              <WizardFooter back={() => setStep(0)} next={() => setStep(2)} nextLabel={t('nuz.wizard.rulesNext')} />
            </motion.div>
          ) : (
            /* ---------- step 3: rules ---------- */
            <motion.div key="s2" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
              <PixelLabel className="text-gold">{t('nuz.rules.houseRules')}</PixelLabel>
              <div className="mt-2">
                <RulePresetButtons onApply={applyPreset} soulLinkDisabled={crew.length < 2} />
              </div>
              <div className="relative mt-2">
                <div key={shakeKey} className={shakeKey ? 'nz-shake' : undefined}>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-md border border-hairline bg-surface1 px-3 py-2.5">
                      <GoldSwitch checked={rules.dupes} onChange={(v) => setRules((r) => ({ ...r, dupes: v }))} label={t('nuz.rules.dupesClause')} tip={t('nuz.rules.dupesTip')} />
                    </div>
                    <div className="rounded-md border border-hairline bg-surface1 px-3 py-2.5">
                      <GoldSwitch checked={rules.shiny} onChange={(v) => setRules((r) => ({ ...r, shiny: v }))} label={t('nuz.rules.shinyClause')} tip={t('nuz.rules.shinyTip')} />
                    </div>
                    <div className="rounded-md border border-hairline bg-surface1 px-3 py-2.5">
                      <GoldSwitch checked={rules.nicknames} onChange={(v) => setRules((r) => ({ ...r, nicknames: v }))} label={t('nuz.wizard.nicknames')} tip={t('nuz.wizard.nickTip')} />
                    </div>
                    <div className="rounded-md border border-hairline bg-surface1 px-3 py-2.5">
                      <GoldSwitch checked={rules.randomizer} onChange={(v) => setRules((r) => ({ ...r, randomizer: v }))} label={t('nuz.rules.randomizer')} tip={t('nuz.rules.randomizerTip')} />
                    </div>
                    {soulLink && (
                      <div className="rounded-md border border-hairline bg-surface1 px-3 py-2.5">
                        <GoldSwitch checked={rules.soulLinkCascade} onChange={(v) => setRules((r) => ({ ...r, soulLinkCascade: v }))} label={t('nuz.rules.soulLinkCascade')} tip={t('nuz.rules.soulLinkCascadeTip')} />
                      </div>
                    )}
                  </div>
                  {/* level cap: manual number or auto (next gym ace, badge-driven) */}
                  <div className="mt-2 rounded-md border border-hairline bg-surface1 px-3 py-2.5">
                    <GoldSwitch
                      checked={rules.autoLevelCap}
                      onChange={(v) => setRules((r) => ({ ...r, autoLevelCap: v }))}
                      label={t('nuz.wizard.autoLevelCap')}
                      tip={t('nuz.wizard.autoLevelCapTip')}
                    />
                    {rules.autoLevelCap ? (
                      <>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <PixelLabel>{t('nuz.rules.badges')}</PixelLabel>
                          <BadgeStepper value={rules.badgesCleared} onChange={(v) => setRules((r) => ({ ...r, badgesCleared: v }))} />
                        </div>
                        {gymPreview && (
                          <p className="mt-1.5 text-[10px] text-tx-muted">
                            {t('nuz.wizard.autoCapStart', { cap: gymPreview.cap, badges: rules.badgesCleared })}
                          </p>
                        )}
                        <p className="mt-1 text-[10px] leading-snug text-tx-muted">{t('nuz.wizard.autoCapExplain')}</p>
                      </>
                    ) : (
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span className="text-[10px] text-tx-muted">{t('nuz.wizard.manualCapHint')}</span>
                        <LevelCapStepper value={rules.levelCap} onChange={(v) => setRules((r) => ({ ...r, levelCap: v }))} disabled={rules.autoLevelCap} />
                      </div>
                    )}
                  </div>
                </div>
                <GoldHint text={hint} show={!!hint} />
              </div>
              <div className="mt-6 flex items-center justify-between">
                <button type="button" onClick={() => setStep(1)} className="rounded-md border border-hairline2 px-4 py-2.5 text-[12px] font-semibold text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold">
                  {t('nuz.wizard.back')}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void startRun()}
                  className="nz-sheen rounded-md border border-gold/60 bg-[linear-gradient(135deg,rgba(246,201,69,0.25),rgba(246,201,69,0.10))] px-6 py-2.5 font-display text-[13px] font-bold uppercase tracking-[0.06em] text-tx-primary transition-transform hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {busy ? t('nuz.wizard.starting') : t('nuz.wizard.startRun')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </NuzModal>
  );
}

function WizardFooter({ back, next, nextLabel }: { back: (() => void) | null; next: () => void; nextLabel: string }) {
  const { t } = useTranslation();
  const backLabel = t('nuz.wizard.back');
  return (
    <div className="mt-6 flex items-center justify-between">
      {back ? (
        <button type="button" onClick={back} className="rounded-md border border-hairline2 px-4 py-2.5 text-[12px] font-semibold text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold">
          {backLabel}
        </button>
      ) : (
        <span />
      )}
      <button
        type="button"
        onClick={next}
        className="rounded-md border border-gold/60 bg-[linear-gradient(135deg,rgba(246,201,69,0.25),rgba(246,201,69,0.10))] px-6 py-2.5 font-display text-[13px] font-bold uppercase tracking-[0.06em] text-tx-primary transition-transform hover:-translate-y-0.5"
      >
        {nextLabel}
      </button>
    </div>
  );
}
