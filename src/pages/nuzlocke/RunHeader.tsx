/* Nuzlocke run — header (nuzlocke.md §2.1): back link, inline rename,
 * chips, player pills with presence, invite / go-online, overflow menu. */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Flag, Link2, MoreVertical, Pencil, Skull, SlidersHorizontal, Archive } from 'lucide-react';
import { regionById, versionChipLabel } from '@/lib/regions';
import {
  archiveRun,
  goOnline,
  isRunOwner,
  pushToast,
  renameRun,
  setRunStatus,
} from '@/lib/nuzlocke-store';
import type { RunEntry } from '@/lib/nuzlocke-store';
import { cn } from '@/lib/utils';
import { PixelLabel, Popover, RunStatusChip, SyncBadge } from './ui';
import { RulesEditor } from './RulesBar';

export default function RunHeader({ entry }: { entry: RunEntry }) {
  const navigate = useNavigate();
  const state = entry.state;
  const [renaming, setRenaming] = useState(false);
  const [draft, setDraft] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [goingOnline, setGoingOnline] = useState(false);
  if (!state) return null;
  const region = regionById(state.run.region);
  const owner = isRunOwner(state.run.id);
  const multi = state.mode === 'multi';

  const copyInvite = () => {
    if (!state.run.invite_code) return;
    void navigator.clipboard?.writeText(state.run.invite_code).catch(() => undefined);
    setCopied(true);
    pushToast('success', `INVITE COPIED — ${state.run.invite_code}`);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.header initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.35 }} className="flex flex-wrap items-center gap-3 py-4">
      <Link to="/nuzlocke" className="flex items-center gap-1 font-pixel text-[8px] tracking-[0.08em] text-tx-muted transition-colors hover:text-gold">
        <ArrowLeft size={12} /> ALL RUNS
      </Link>
      <span className="h-5 w-px bg-hairline2" />

      {renaming ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              renameRun(state.run.id, draft);
              setRenaming(false);
            }
            if (e.key === 'Escape') setRenaming(false);
          }}
          onBlur={() => {
            renameRun(state.run.id, draft);
            setRenaming(false);
          }}
          className="h-9 rounded-md border border-gold/60 bg-surface2 px-2 font-display text-[20px] font-extrabold text-tx-primary outline-none"
        />
      ) : (
        <h1
          className={cn('font-display text-[clamp(18px,2.4vw,24px)] font-extrabold uppercase text-tx-primary', owner && 'cursor-text')}
          title={owner ? 'Click to rename' : undefined}
          onClick={() => {
            if (!owner) return;
            setDraft(state.run.name);
            setRenaming(true);
          }}
        >
          {state.run.name}
        </h1>
      )}

      <span
        className="rounded-full border px-2 py-0.5 font-pixel text-[7px] tracking-[0.08em]"
        style={{ borderColor: `${region?.accent ?? '#F6C945'}66`, color: region?.accent ?? '#F6C945' }}
      >
        {versionChipLabel(state.run.game)}
      </span>
      <span className="rounded-full border border-hairline2 px-2 py-0.5 font-pixel text-[7px] tracking-[0.08em] text-tx-muted">
        {region?.name.toUpperCase() ?? state.run.region.toUpperCase()}
      </span>
      <RunStatusChip status={state.run.status} />
      <SyncBadge status={multi ? entry.status : 'local'} />

      {/* right cluster */}
      <div className="ml-auto flex flex-wrap items-center gap-2">
        {/* player pills */}
        {[...state.players]
          .sort((a, b) => a.slot - b.slot)
          .map((p, i) => {
            const alive = state.encounters.filter((e) => e.player_id === p.id && e.status === 'caught').length;
            const dead = state.encounters.filter((e) => e.player_id === p.id && e.status === 'dead').length;
            const online = multi && !!entry.online[p.id];
            return (
              <motion.span
                key={p.id}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 420, damping: 30, delay: i * 0.05 }}
                title={`${p.name} — ${alive} alive · ${dead} dead`}
                className="flex h-9 items-center gap-1.5 rounded-full border border-hairline bg-surface1 px-3"
              >
                <span className={cn('h-2.5 w-2.5 rounded-full', online && 'nz-presence-ring')} style={{ background: p.color }} />
                <span className="text-[12px] font-semibold text-tx-primary">{p.name}</span>
                <span className="text-[10px] tabular-nums text-tx-muted">{alive}</span>
              </motion.span>
            );
          })}

        {/* invite / go online */}
        {multi ? (
          <button
            type="button"
            onClick={copyInvite}
            className="flex h-9 items-center gap-1.5 rounded-md border border-gold/60 px-3 text-[12px] font-semibold text-gold transition-colors hover:bg-gold/10"
          >
            {copied ? <Check size={13} /> : <Link2 size={13} />}
            {copied ? state.run.invite_code : 'Invite'}
          </button>
        ) : (
          <Popover
            open={inviteOpen}
            onClose={() => setInviteOpen(false)}
            align="right"
            anchor={
              <button
                type="button"
                onClick={() => setInviteOpen((o) => !o)}
                className="flex h-9 items-center gap-1.5 rounded-md border border-gold/60 px-3 text-[12px] font-semibold text-gold transition-colors hover:bg-gold/10"
              >
                <Link2 size={13} /> Invite
              </button>
            }
            className="w-[240px] p-3"
          >
            <PixelLabel className="text-gold">SOLO RUN</PixelLabel>
            <p className="mt-1.5 text-[12px] leading-snug text-tx-secondary">Upgrade this run to multiplayer to invite friends — realtime sync, presence, the works.</p>
            <button
              type="button"
              disabled={goingOnline}
              onClick={() => {
                setGoingOnline(true);
                void goOnline(state.run.id).then((ok) => {
                  setGoingOnline(false);
                  if (ok) setInviteOpen(false);
                });
              }}
              className="nz-sheen mt-2.5 w-full rounded-md border border-gold/60 bg-[linear-gradient(135deg,rgba(246,201,69,0.25),rgba(246,201,69,0.10))] py-2 font-display text-[11px] font-bold uppercase tracking-[0.06em] text-tx-primary disabled:opacity-50"
            >
              {goingOnline ? 'Going online…' : 'Go online'}
            </button>
          </Popover>
        )}

        {/* overflow */}
        <Popover
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          align="right"
          anchor={
            <button
              type="button"
              aria-label="Run options"
              onClick={() => setMenuOpen((o) => !o)}
              className="grid h-9 w-9 place-items-center rounded-md border border-hairline text-tx-muted transition-colors hover:border-gold/50 hover:text-gold"
            >
              <MoreVertical size={15} />
            </button>
          }
          className="w-[210px] py-1"
        >
          {owner && (
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setRulesOpen(true);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold"
            >
              <SlidersHorizontal size={13} /> Edit rules
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (owner) {
                setDraft(state.run.name);
                setRenaming(true);
              }
              setMenuOpen(false);
            }}
            className={cn('flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] transition-colors hover:bg-surface3', owner ? 'text-tx-secondary hover:text-gold' : 'text-tx-muted/50')}
          >
            <Pencil size={13} /> Rename
          </button>
          {state.run.status !== 'complete' && (
            <button
              type="button"
              onClick={() => {
                setRunStatus(state.run.id, 'complete');
                pushToast('success', 'RUN COMPLETE — CHAMPIONS.');
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold"
            >
              <Flag size={13} /> Mark run complete
            </button>
          )}
          {state.run.status !== 'failed' && (
            <button
              type="button"
              onClick={() => {
                setRunStatus(state.run.id, 'failed');
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold"
            >
              <Skull size={13} /> Mark run failed
            </button>
          )}
          {state.run.status !== 'active' && (
            <button
              type="button"
              onClick={() => {
                setRunStatus(state.run.id, 'active');
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold"
            >
              <Flag size={13} /> Reactivate run
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              archiveRun(state.run.id);
              pushToast('info', 'RUN ARCHIVED ON THIS DEVICE');
              navigate('/nuzlocke');
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold"
          >
            <Archive size={13} /> Archive
          </button>
        </Popover>

        {/* edit rules popover (owner) */}
        <Popover open={rulesOpen} onClose={() => setRulesOpen(false)} align="right" anchor={<span className="absolute right-0 top-0" />}>
          <RulesEditor state={state} />
        </Popover>
      </div>
    </motion.header>
  );
}
