/* Nuzlocke — New Run wizard (nuzlocke.md §1.5) + join-by-code flow (§1.4).
 * 3 steps: 01 GAME → 02 CREW → 03 RULES; success pane mints the invite code. */
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy, Minus, Plus } from 'lucide-react';
import { REGIONS, coverageTier, versionLabel, viewBoxParts } from '@/lib/regions';
import type { RegionId } from '@/lib/regions';
import {
  DEFAULT_RULES,
  MAX_PLAYERS,
  PLAYER_COLORS,
  createRun,
  joinRun,
  pushToast,
} from '@/lib/nuzlocke-store';
import type { JoinLookup, NuzRules } from '@/lib/nuzlocke-store';
import { isMultiCapable } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { GoldHint, GoldSwitch, InfoTip, NuzModal, PixelLabel, SparkleBurst, useShake } from './ui';

const SOULLINK_TIP =
  "SoulLink ties two players' games together: the Pokémon each of you catches on the same route become a linked pair. If one partner dies, its link must be boxed or released too. Linked pairs glow on your timeline.";
const DUPES_TIP = 'If your first encounter is a species you already have, you may skip it and try the next.';
const SHINY_TIP = 'Shinies may always be caught, clause-free.';
const NICK_TIP = 'A Nuzlocke classic. Every catch gets a name — it hurts more that way.';
const CAP_TIP = "Your party may not exceed the next gym leader's ace level.";

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
}

interface CrewPlayer {
  name: string;
  color: string;
}

export default function Wizard({ open, onClose, joinPreset, runCount }: WizardProps) {
  const navigate = useNavigate();
  const joinMode = !!joinPreset;

  const [step, setStep] = useState(0); // join mode starts at 1
  const [regionId, setRegionId] = useState<RegionId>('kanto');
  const region = useMemo(() => REGIONS.find((r) => r.region === regionId) ?? REGIONS[0], [regionId]);
  const [game, setGame] = useState(region.defaultVersion);
  const [name, setName] = useState('');
  const [crew, setCrew] = useState<CrewPlayer[]>([{ name: 'You', color: PLAYER_COLORS[0] }]);
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
    const suggestion = `${REGIONS[0].name} Protocol #${runCount + 1}`;
    setAutoName(suggestion);
    setName(suggestion);
    setCrew([{ name: 'You', color: PLAYER_COLORS[0] }]);
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
      fail('Give your run a name — legend requires it.');
      return;
    }
    setBusy(true);
    try {
      const res = await createRun({
        name: name.trim(),
        region: regionId,
        game,
        players: crew.map((p, i) => ({ name: p.name.trim() || `PLAYER ${i + 1}`, color: p.color })),
        rules: { ...rules, soulLink },
        online: online && isMultiCapable(),
      });
      if (res.inviteCode) {
        setInvite(res.inviteCode);
        setCreatedId(res.state.run.id);
      } else {
        onClose();
        navigate(`/nuzlocke/${res.state.run.id}`);
      }
    } finally {
      setBusy(false);
    }
  };

  const doJoin = async () => {
    if (!joinPreset) return;
    if (!joinName.trim()) {
      fail('Tell the crew your trainer name.');
      return;
    }
    setBusy(true);
    try {
      const state = await joinRun(joinPreset, joinName, joinColor);
      if (!state) {
        fail('Could not join — the run may be full.');
        return;
      }
      onClose();
      navigate(`/nuzlocke/${state.run.id}`);
    } finally {
      setBusy(false);
    }
  };

  const copyInvite = () => {
    if (!invite) return;
    void navigator.clipboard?.writeText(invite).catch(() => undefined);
    setCopied(true);
    pushToast('success', `INVITE COPIED — ${invite}`);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const steps = ['01 GAME', '02 CREW', '03 RULES'];

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
              <PixelLabel className="text-gold">RUN ONLINE — INVITE YOUR CREW</PixelLabel>
              <div className="mx-auto mt-3 flex w-fit items-center gap-2 rounded-md border border-gold/60 bg-gold/10 px-4 py-2">
                <span className="font-display text-lg font-bold tracking-[0.12em] text-gold">{invite}</span>
                <button type="button" onClick={copyInvite} className="grid h-7 w-7 place-items-center rounded-sm border border-gold/40 text-gold transition-colors hover:bg-gold/20" aria-label="Copy invite code">
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                </button>
              </div>
              <p className="mt-2 text-[12px] text-tx-muted">Anyone with this code can join from the hub.</p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (createdId) navigate(`/nuzlocke/${createdId}`);
                }}
                className="nz-sheen mx-auto mt-5 block rounded-md border border-gold/60 bg-[linear-gradient(135deg,rgba(246,201,69,0.25),rgba(246,201,69,0.10))] px-7 py-3 font-display text-[13px] font-bold uppercase tracking-[0.06em] text-tx-primary transition-transform hover:-translate-y-0.5"
              >
                Enter run →
              </button>
            </motion.div>
          ) : joinMode && joinPreset ? (
            /* ---------- join flow ---------- */
            <motion.div key="join" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
              <div className="mb-4 rounded-md border border-gold/30 bg-gold/5 px-3 py-2 text-[12px] text-tx-secondary">
                You're joining <span className="font-semibold text-tx-primary">“{joinPreset.run.name}”</span> — {joinPreset.players.length} player{joinPreset.players.length === 1 ? '' : 's'} inside
              </div>
              <PixelLabel>YOUR TRAINER</PixelLabel>
              <div className="relative mt-2">
                <div key={shakeKey} className={shakeKey ? 'nz-shake' : undefined}>
                  <input
                    value={joinName}
                    onChange={(e) => setJoinName(e.target.value)}
                    placeholder="Trainer name"
                    maxLength={18}
                    className="h-10 w-full rounded-md border border-hairline2 bg-surface1 px-3 text-[14px] text-tx-primary outline-none placeholder:text-tx-muted focus:border-gold"
                  />
                </div>
                <GoldHint text={hint} show={!!hint} />
              </div>
              <PixelLabel className="mt-4 block">PICK YOUR COLOR</PixelLabel>
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
                      title={taken ? 'Taken by another player' : c}
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
                {busy ? 'Joining…' : 'Join run →'}
              </button>
            </motion.div>
          ) : step === 0 ? (
            /* ---------- step 1: game & region ---------- */
            <motion.div key="s0" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
              <PixelLabel className="text-gold">CHOOSE YOUR REGION</PixelLabel>
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
                          const next = `${r.name} Protocol #${runCount + 1}`;
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
                        <span className="text-[11px] font-semibold text-tx-primary">{r.name}</span>
                        <span className="font-pixel text-[6px] text-tx-muted">{coverageTier(r)}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              <PixelLabel className="mt-4 block text-gold">GAME VERSION</PixelLabel>
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
              <PixelLabel className="mt-4 block text-gold">RUN NAME</PixelLabel>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={`${region.name} Protocol #${runCount + 1}`}
                maxLength={40}
                className="mt-2 h-10 w-full rounded-md border border-hairline2 bg-surface1 px-3 font-display text-[14px] font-bold text-tx-primary outline-none placeholder:text-tx-muted focus:border-gold"
              />
              <WizardFooter back={null} next={() => setStep(1)} nextLabel="Crew →" />
            </motion.div>
          ) : step === 1 ? (
            /* ---------- step 2: crew ---------- */
            <motion.div key="s1" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
              <PixelLabel className="text-gold">THE CREW (1–{MAX_PLAYERS})</PixelLabel>
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
                      title="Cycle color"
                      aria-label="Cycle player color"
                    />
                    <input
                      value={p.name}
                      onChange={(e) => setCrew((c) => c.map((x, xi) => (xi === i ? { ...x, name: e.target.value } : x)))}
                      placeholder={`PLAYER ${i + 1}`}
                      maxLength={18}
                      className="h-full flex-1 bg-transparent text-[13px] font-semibold text-tx-primary outline-none placeholder:text-tx-muted"
                    />
                    <span className="font-pixel text-[7px] text-tx-muted">P{i + 1}</span>
                    {i > 0 && (
                      <button type="button" onClick={() => setCrew((c) => c.filter((_, xi) => xi !== i))} className="text-tx-muted transition-colors hover:text-gold" aria-label="Remove player">
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
                  <Plus size={13} /> Add player
                </button>
              )}

              {/* SoulLink — the signature switch */}
              <div className={cn('mt-4 rounded-md border p-3 transition-colors', soulLink ? 'border-gold/50 bg-gold/5' : 'border-hairline bg-surface1', crew.length < 2 && 'opacity-40')}>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="font-display text-[13px] font-bold tracking-wide text-tx-primary">SOUL LINK</span>
                    <InfoTip text={SOULLINK_TIP} />
                  </span>
                  <GoldSwitch checked={soulLink} onChange={setSoulLink} disabled={crew.length < 2} label={soulLink ? 'ON' : 'OFF'} />
                </div>
                {crew.length < 2 && <p className="mt-1 text-[10px] text-tx-muted">Needs 2+ players</p>}
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
                  <PixelLabel className="text-gold">MODE</PixelLabel>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {[
                      { v: true, label: 'ONLINE — INVITE BY CODE' },
                      { v: false, label: 'LOCAL — SHARED SCREEN' },
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
                </div>
              )}
              <WizardFooter back={() => setStep(0)} next={() => setStep(2)} nextLabel="Rules →" />
            </motion.div>
          ) : (
            /* ---------- step 3: rules ---------- */
            <motion.div key="s2" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
              <PixelLabel className="text-gold">HOUSE RULES</PixelLabel>
              <div className="relative mt-2">
                <div key={shakeKey} className={shakeKey ? 'nz-shake' : undefined}>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-md border border-hairline bg-surface1 px-3 py-2.5">
                      <GoldSwitch checked={rules.dupes} onChange={(v) => setRules((r) => ({ ...r, dupes: v }))} label="DUPES CLAUSE" tip={DUPES_TIP} />
                    </div>
                    <div className="rounded-md border border-hairline bg-surface1 px-3 py-2.5">
                      <GoldSwitch checked={rules.shiny} onChange={(v) => setRules((r) => ({ ...r, shiny: v }))} label="SHINY CLAUSE" tip={SHINY_TIP} />
                    </div>
                    <div className="rounded-md border border-hairline bg-surface1 px-3 py-2.5">
                      <GoldSwitch checked label="NICKNAMES" tip={NICK_TIP} disabled />
                    </div>
                    <div className="flex items-center justify-between rounded-md border border-hairline bg-surface1 px-3 py-2">
                      <span className="flex items-center gap-1.5">
                        <span className="font-pixel text-[8px] uppercase tracking-[0.08em] text-tx-muted">LEVEL CAP</span>
                        <InfoTip text={CAP_TIP} />
                      </span>
                      <span className="flex items-center gap-1.5">
                        <button
                          type="button"
                          aria-label="Lower cap"
                          onClick={() => setRules((r) => ({ ...r, levelCap: r.levelCap ? Math.max(1, r.levelCap - 1) : null }))}
                          className="grid h-6 w-6 place-items-center rounded-sm border border-hairline2 text-tx-muted hover:border-gold hover:text-gold"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="w-8 text-center font-display text-[14px] font-bold text-gold">{rules.levelCap ?? '—'}</span>
                        <button
                          type="button"
                          aria-label="Raise cap"
                          onClick={() => setRules((r) => ({ ...r, levelCap: Math.min(100, (r.levelCap ?? 25) + 1) }))}
                          className="grid h-6 w-6 place-items-center rounded-sm border border-hairline2 text-tx-muted hover:border-gold hover:text-gold"
                        >
                          <Plus size={11} />
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
                <GoldHint text={hint} show={!!hint} />
              </div>
              <div className="mt-6 flex items-center justify-between">
                <button type="button" onClick={() => setStep(1)} className="rounded-md border border-hairline2 px-4 py-2.5 text-[12px] font-semibold text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold">
                  Back
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void startRun()}
                  className="nz-sheen rounded-md border border-gold/60 bg-[linear-gradient(135deg,rgba(246,201,69,0.25),rgba(246,201,69,0.10))] px-6 py-2.5 font-display text-[13px] font-bold uppercase tracking-[0.06em] text-tx-primary transition-transform hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {busy ? 'Starting…' : 'Start run →'}
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
  return (
    <div className="mt-6 flex items-center justify-between">
      {back ? (
        <button type="button" onClick={back} className="rounded-md border border-hairline2 px-4 py-2.5 text-[12px] font-semibold text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold">
          Back
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
