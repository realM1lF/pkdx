/* AccountTooltip — one-time nudge near the account button after 10s on the
 * site (dismissal persisted, never shows again, never for logged-in users). */
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useAuth } from '@/lib/auth';

const KEY = 'pdx2.acctTipSeen';
const DELAY_MS = 10_000;

export default function AccountTooltip() {
  const { t } = useTranslation();
  const { ready, user } = useAuth();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!ready || user) return undefined;
    let seen = false;
    try {
      seen = localStorage.getItem(KEY) === '1';
    } catch { /* ignore */ }
    if (seen) return undefined;
    const timer = window.setTimeout(() => setShow(true), DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [ready, user]);

  const dismiss = () => {
    setShow(false);
    try {
      localStorage.setItem(KEY, '1');
    } catch { /* ignore */ }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -6, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.97 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="absolute right-0 top-[calc(100%+10px)] z-[70] w-64 rounded-md border border-gold/40 bg-surface2 p-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
          role="status"
        >
          {/* caret */}
          <span className="absolute -top-1 right-6 h-2 w-2 rotate-45 border-l border-t border-gold/40 bg-surface2" />
          <button
            type="button"
            onClick={dismiss}
            aria-label={t('account.tip.dismiss')}
            className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-sm text-tx-muted transition-colors hover:text-gold"
          >
            <X size={11} />
          </button>
          <p className="font-sans text-[12.5px] font-semibold leading-snug text-tx-primary">
            {t('account.tip.title')}
          </p>
          <p className="mt-1.5 font-sans text-[11.5px] leading-relaxed text-tx-muted">
            {t('account.tip.body')}
          </p>
          <button
            type="button"
            onClick={dismiss}
            className="pixel-label mt-2.5 rounded-sm border border-gold/50 px-2.5 py-1 text-[8px] text-gold transition-colors hover:bg-gold-soft"
          >
            {t('account.tip.ok')}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
