/* HeaderStrip — team name · GAME selector · IMPORT FROM RUN · SHARE · SAVE · hub · CLEAR
 * (team-builder.md "Header-Strip", density-addendum §2 command-bar) */
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Download, Gamepad2, Pencil, Save, Share2, Trash2, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { genRegionKey } from '@/lib/i18n-data';
import { VERSION_GROUPS, versionGroupById } from '@/lib/teambuilder';
import type { Team } from '@/lib/teambuilder';
import { GENERATIONS } from '@/lib/types';
import { cn } from '@/lib/utils';

interface GameSelectorProps {
  value: string;
  onChange: (vgId: string) => void;
}

function GameSelector({ value, onChange }: GameSelectorProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = versionGroupById(value);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="tb-btn !gap-2"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('tb.selectGame')}
      >
        <Gamepad2 size={14} className="text-gold" />
        <span className="tb-micro-gold !text-[8px]">{t('tb.game')}</span>
        <span className="font-display text-[11px] font-bold tracking-wide text-tx-primary">{current.short}</span>
        <span className="hidden text-[11px] text-tx-muted lg:inline">{current.label}</span>
        <ChevronDown size={12} className={cn('transition-transform duration-200', open && 'rotate-180')} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="tb-dropdown tb-scroll !min-w-[280px] max-h-[380px] overflow-y-auto py-1" data-lenis-prevent
            role="listbox"
            aria-label={t('tb.versionGroups')}
          >
            {GENERATIONS.map((g) => {
              const groups = VERSION_GROUPS.filter((v) => v.gen === g.gen);
              if (!groups.length) return null;
              return (
                <div key={g.gen}>
                  <div className="tb-micro px-3 pb-1 pt-2.5 !text-[8px]">
                    GEN {g.roman} · {t(`regions.${genRegionKey(g.region)}`).toUpperCase()}
                  </div>
                  {groups.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      role="option"
                      aria-selected={v.id === value}
                      data-active={v.id === value}
                      className="tb-option justify-between"
                      onClick={() => {
                        onChange(v.id);
                        setOpen(false);
                      }}
                    >
                      <span className="flex items-center gap-2">
                        <span className={cn('tb-chip !px-1.5 !py-0.5 !text-[8px]', v.id === value && 'border-gold/60 text-gold')}>
                          {v.short}
                        </span>
                        <span>{v.label}</span>
                      </span>
                      {v.id === value && <Check size={12} className="text-gold" />}
                    </button>
                  ))}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface HeaderStripProps {
  team: Team;
  saved: boolean;
  shareState: 'idle' | 'copied';
  onName: (name: string) => void;
  onGameChange: (vgId: string) => void;
  onImport: () => void;
  onShare: () => void;
  onSave: () => void;
  onClear: () => void;
  onOpenHub: () => void;
  savedCount: number;
}

export default function HeaderStrip({
  team,
  saved,
  shareState,
  onName,
  onGameChange,
  onImport,
  onShare,
  onSave,
  onClear,
  onOpenHub,
  savedCount,
}: HeaderStripProps) {
  const { t } = useTranslation();
  return (
    <div className="tb-panel mb-3 flex flex-wrap items-center gap-2 !rounded-[12px] px-3 py-2.5">
      <div className="flex min-w-[180px] flex-1 items-center gap-2">
        <Pencil size={13} className="shrink-0 text-tx-muted" aria-hidden />
        <input
          value={team.name}
          onChange={(e) => onName(e.target.value)}
          placeholder={t('tb.teamName')}
          maxLength={40}
          aria-label={t('tb.teamName')}
          className="w-full bg-transparent font-display text-[15px] font-bold uppercase tracking-wide text-tx-primary outline-none transition-colors placeholder:text-tx-muted focus:text-gold"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <GameSelector value={team.versionGroup} onChange={onGameChange} />
        <button type="button" onClick={onImport} className="tb-btn">
          <Download size={13} />
          {t('tb.importFromRun')}
        </button>
        <button type="button" onClick={onShare} className="tb-btn" aria-live="polite">
          {shareState === 'copied' ? <Check size={13} className="text-gold" /> : <Share2 size={13} />}
          {shareState === 'copied' ? t('tb.linkCopied') : t('tb.share')}
        </button>
        <button type="button" onClick={onSave} className="tb-btn tb-btn-primary">
          <Save size={13} />
          {saved ? t('tb.saved') : t('tb.save')}
        </button>
        <button type="button" onClick={onOpenHub} className="tb-btn" aria-label={t('tb.myTeams')}>
          <Users size={13} />
          <span className="hidden sm:inline">{t('tb.myTeams')}</span>
          {savedCount > 0 && <span className="tb-chip !px-1.5 !py-0 !text-[9px] text-gold">{savedCount}</span>}
        </button>
        <button type="button" onClick={onClear} className="tb-btn tb-btn-icon" aria-label={t('tb.clearTeam')}>
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
