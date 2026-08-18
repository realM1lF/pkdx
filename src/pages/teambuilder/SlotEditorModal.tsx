/* SlotEditorModal — per-slot editor in a viewport-fixed dialog (AddToTeam /
 * ShowdownDialog pattern). Portaled to document.body so Reorder transforms
 * and overflow:hidden never clip the overlay or MiniAutocomplete menus. */
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Sprite from '@/components/Sprite';
import { nameOfPokemon, useLanguage } from '@/lib/i18n-data';
import SlotEditor, { type SlotEditorProps } from './SlotEditor';

export interface SlotEditorModalProps extends SlotEditorProps {
  open: boolean;
  onClose: () => void;
}

export default function SlotEditorModal({ open, onClose, slot, pokemon, ...editor }: SlotEditorModalProps) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const label = slot.nickname || (slot.pokemon ? nameOfPokemon(slot.pokemon, lang) : '—');

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[90] flex items-end justify-center bg-void/70 backdrop-blur-sm sm:items-start sm:p-4 sm:pt-[6vh]"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={t('tb.editor.modalTitle', { name: label })}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 180, damping: 22 }}
            className="tb-panel tb-editor-modal flex max-h-[92dvh] w-full max-w-[920px] flex-col overflow-hidden !rounded-t-[16px] shadow-elevate sm:!rounded-[16px] sm:max-h-[85dvh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center gap-3 border-b border-hairline px-4 py-3">
              {slot.pokemonId != null && slot.pokemon && (
                <Sprite
                  id={slot.pokemonId}
                  name={label}
                  era={slot.pokemonId <= 649 ? 'gen5' : 'default'}
                  shiny={slot.shiny}
                  className="h-10 w-10 shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <span className="pixel-label text-[8px] text-gold">{t('tb.editor.modalEyebrow')}</span>
                <h2 className="truncate font-display text-[15px] font-bold tracking-wide text-tx-primary">{label}</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={t('tb.editor.close')}
                className="shrink-0 rounded-sm p-1 text-tx-muted transition-all hover:rotate-90 hover:text-gold"
              >
                <X size={16} />
              </button>
            </div>

            <div className="tb-scroll min-h-0 flex-1 overflow-y-auto p-3 sm:p-4" data-lenis-prevent>
              <SlotEditor slot={slot} pokemon={pokemon} {...editor} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
