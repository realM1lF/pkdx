/* ShowdownDialog — IMPORT/EXPORT of the Showdown text format (community
 * standard #1, community-research.md). Export tab: copyable text for
 * Showdown/PokéPaste. Import tab: paste → parse preview (sprites + warnings)
 * → apply replaces the current slots. All warnings gold, never red. */
import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, ArrowDownToLine, ArrowUpFromLine, Check, Copy, FileDown, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Sprite from '@/components/Sprite';
import { nameOfPokemon, useLanguage } from '@/lib/i18n-data';
import { parseShowdownTeam, showdownWarningText } from '@/lib/teambuilder-showdown';
import type { ShowdownImport } from '@/lib/teambuilder-showdown';
import { pushToast } from '@/lib/nuzlocke-store';
import { cn } from '@/lib/utils';

interface ShowdownDialogProps {
  open: boolean;
  /** initial tab — 'import' when the team is empty */
  initialTab: 'export' | 'import';
  exportText: string;
  onClose: () => void;
  onImport: (result: ShowdownImport) => void;
}

type Phase = { kind: 'edit' } | { kind: 'parsing' } | { kind: 'preview'; result: ShowdownImport };

export default function ShowdownDialog({ open, initialTab, exportText, onClose, onImport }: ShowdownDialogProps) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const [tab, setTab] = useState<'export' | 'import'>(initialTab);
  const [paste, setPaste] = useState('');
  const [phase, setPhase] = useState<Phase>({ kind: 'edit' });
  const [copied, setCopied] = useState(false);

  /* reset when the dialog opens — derived-state-during-render pattern */
  const [prevOpen, setPrevOpen] = useState(open);
  if (prevOpen !== open) {
    setPrevOpen(open);
    if (open) {
      setTab(initialTab);
      setPaste('');
      setPhase({ kind: 'edit' });
      setCopied(false);
    }
  }

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const exportEmpty = useMemo(() => exportText.trim().length === 0, [exportText]);

  const copyExport = async () => {
    try {
      await navigator.clipboard.writeText(exportText);
    } catch {
      /* clipboard blocked — text stays selectable */
    }
    setCopied(true);
    pushToast('sync', t('tb.sd.copiedToast'));
    window.setTimeout(() => setCopied(false), 2200);
  };

  const runParse = async () => {
    setPhase({ kind: 'parsing' });
    try {
      const result = await parseShowdownTeam(paste);
      setPhase({ kind: 'preview', result });
    } catch {
      setPhase({ kind: 'edit' });
      pushToast('sync', t('tb.sd.parseFailed'));
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[90] flex items-start justify-center bg-void/70 p-4 pt-[10vh] backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={t('tb.sd.dialogAria')}
        >
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 180, damping: 22 }}
            className="tb-panel w-full max-w-[560px] overflow-hidden !rounded-[16px] shadow-elevate"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tb-panel-head">
              <span className="tb-micro-gold flex items-center gap-1.5">
                <FileDown size={11} />
                {t('tb.sd.title')}
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label={t('tb.sd.close')}
                className="rounded-sm p-1 text-tx-muted transition-all hover:rotate-90 hover:text-gold"
              >
                <X size={14} />
              </button>
            </div>

            {/* tab switch */}
            <div className="flex gap-1 border-b border-hairline px-3 pt-2.5">
              {(['export', 'import'] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setTab(k)}
                  data-active={tab === k}
                  className={cn(
                    'flex items-center gap-1.5 rounded-t-[8px] border-b-2 px-3 pb-2 text-[10px] font-bold uppercase tracking-wide transition-colors',
                    tab === k ? 'border-gold text-gold' : 'border-transparent text-tx-muted hover:text-tx-secondary',
                  )}
                >
                  {k === 'export' ? <ArrowUpFromLine size={11} /> : <ArrowDownToLine size={11} />}
                  {t(`tb.sd.${k}Tab`)}
                </button>
              ))}
            </div>

            <div className="p-3">
              {tab === 'export' && (
                <>
                  <p className="tb-micro mb-2 !text-[8px]">{t('tb.sd.exportHint')}</p>
                  {exportEmpty ? (
                    <div className="rounded-[8px] border border-gold/50 bg-gold/10 p-3 text-center">
                      <span className="tb-micro-gold !text-[9px]">{t('tb.sd.exportEmpty')}</span>
                    </div>
                  ) : (
                    <>
                      <textarea
                        readOnly
                        value={exportText}
                        rows={12}
                        aria-label={t('tb.sd.exportAria')}
                        onFocus={(e) => e.target.select()}
                        className="tb-input tb-scroll max-h-[38vh] !font-mono !text-[11px] !leading-relaxed"
                        data-lenis-prevent
                      />
                      <button type="button" onClick={() => void copyExport()} className="tb-btn tb-btn-primary mt-2.5 w-full justify-center">
                        {copied ? <Check size={13} /> : <Copy size={13} />}
                        {copied ? t('tb.sd.copied') : t('tb.sd.copy')}
                      </button>
                    </>
                  )}
                </>
              )}

              {tab === 'import' && (
                <>
                  <p className="tb-micro mb-2 !text-[8px]">{t('tb.sd.importHint')}</p>
                  <textarea
                    value={paste}
                    onChange={(e) => {
                      setPaste(e.target.value);
                      setPhase({ kind: 'edit' });
                    }}
                    rows={10}
                    placeholder={t('tb.sd.placeholder')}
                    aria-label={t('tb.sd.importAria')}
                    className="tb-input tb-scroll max-h-[32vh] !font-mono !text-[11px] !leading-relaxed"
                    data-lenis-prevent
                  />

                  {phase.kind === 'preview' && (
                    <div className="mt-2.5 space-y-1.5">
                      <div className="flex items-center gap-2 rounded-[8px] border border-hairline bg-surface2 px-2 py-1.5">
                        <span className="tb-micro-gold !text-[8px]">{t('tb.sd.parsedOk', { count: phase.result.count })}</span>
                        <span className="ml-auto flex">
                          {phase.result.slots
                            .filter((s) => s.pokemonId != null)
                            .map((s) => (
                              <span key={s.id} className="-ml-1 h-7 w-7 first:ml-0" title={nameOfPokemon(s.pokemon!, lang)}>
                                <Sprite id={s.pokemonId!} name={nameOfPokemon(s.pokemon!, lang)} era="default" skeleton={false} shiny={s.shiny} />
                              </span>
                            ))}
                        </span>
                      </div>
                      {phase.result.warnings.map((w, i) => (
                        <div key={i} className="tb-micro-gold flex items-center gap-1.5 !text-[8px]">
                          <AlertTriangle size={9} className="shrink-0" />
                          {showdownWarningText(w, lang)}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-2.5 flex items-center gap-2">
                    {phase.kind === 'preview' && phase.result.count > 0 ? (
                      <button
                        type="button"
                        onClick={() => {
                          onImport(phase.result);
                          onClose();
                        }}
                        className="tb-btn tb-btn-primary flex-1 justify-center"
                      >
                        <ArrowDownToLine size={13} />
                        {t('tb.sd.apply', { count: phase.result.count })}
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={!paste.trim() || phase.kind === 'parsing'}
                        onClick={() => void runParse()}
                        className="tb-btn tb-btn-primary flex-1 justify-center disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {phase.kind === 'parsing' ? t('tb.sd.parsing') : t('tb.sd.parse')}
                      </button>
                    )}
                  </div>
                  <p className="tb-micro mt-2 !text-[7px]">{t('tb.sd.replaceNote')}</p>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
