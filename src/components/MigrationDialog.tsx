/* MigrationDialog — first-login offer: adopt local teams/runs into the
 * account (accept / later / don't ask again). */
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { CloudUpload, X } from 'lucide-react';
import { onMigrationOffer } from '@/lib/cloud-sync';
import type { MigrationOffer } from '@/lib/cloud-sync';
import { useAuth } from '@/lib/auth';

export default function MigrationDialog() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [offer, setOffer] = useState<MigrationOffer | null>(null);

  useEffect(() => onMigrationOffer(setOffer), []);

  /* signed-in accounts sync silently — the offer only ever applies to guests */
  const visible = offer && !user;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[85] grid place-items-center bg-void/70 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.94, y: 14 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md rounded-lg border border-gold/40 bg-surface1 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
            role="dialog"
            aria-label={t('account.migrate.title')}
          >
            <div className="flex items-start justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-md border border-gold/40 bg-gold-soft text-gold">
                <CloudUpload size={20} />
              </span>
              <button
                type="button"
                onClick={() => offer.decline(false)}
                aria-label={t('account.migrate.later')}
                className="grid h-7 w-7 place-items-center rounded-sm text-tx-muted transition-colors hover:text-gold"
              >
                <X size={14} />
              </button>
            </div>
            <h2 className="mt-4 font-display text-lg font-extrabold tracking-wide text-tx-primary">
              {t('account.migrate.title')}
            </h2>
            <p className="mt-2 font-sans text-[13.5px] leading-relaxed text-tx-secondary">
              {t('account.migrate.text', { teams: offer.teams.length, runs: offer.runs.length })}
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <button type="button" onClick={offer.accept} className="tb-btn tb-btn-primary justify-center">
                {t('account.migrate.accept')}
              </button>
              <div className="flex gap-2">
                <button type="button" onClick={() => offer.decline(false)} className="tb-btn flex-1 justify-center">
                  {t('account.migrate.later')}
                </button>
                <button type="button" onClick={() => offer.decline(true)} className="tb-btn flex-1 justify-center !text-tx-muted">
                  {t('account.migrate.never')}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
