/* Nuzlocke — gold toast stack (§2.2, §2.5, §2.9). Slide-up 200ms, auto-dismiss. */
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { onToast } from '@/lib/nuzlocke-store';
import type { NuzToast } from '@/lib/nuzlocke-store';

export default function NuzToasts() {
  const [toasts, setToasts] = useState<NuzToast[]>([]);

  useEffect(() => {
    return onToast((t) => {
      setToasts((list) => [...list.slice(-3), t]);
      window.setTimeout(() => setToasts((list) => list.filter((x) => x.id !== t.id)), t.kind === 'link' ? 3000 : 2500);
    });
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[70] flex flex-col items-center gap-2 px-4" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto flex items-center gap-2 rounded-md border border-gold/50 bg-surface2 px-4 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.45)]"
          >
            {t.kind === 'link' && <img src="/sparkle.svg" alt="" className="h-3.5 w-3.5" />}
            {t.kind === 'sync' && <span className="nz-orbit h-3 w-3" />}
            {t.kind === 'success' && <Sparkles size={13} className="text-gold" />}
            <span className="font-pixel text-[8px] uppercase tracking-[0.08em] text-gold">{t.text}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
