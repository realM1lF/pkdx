/* Edition picker: rest = top-right chrome; scroll = fixed gold dock under the navbar. */
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import GameSelect from '@/components/GameSelect';
import type { GameSelectOption } from '@/components/GameSelect';
import { cn } from '@/lib/utils';

export default function EditionDock({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (id: string) => void;
  options: GameSelectOption[];
}) {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    let io: IntersectionObserver | null = null;
    const bind = () => {
      io?.disconnect();
      const header = document.querySelector('header');
      const top = Math.round(header?.getBoundingClientRect().height ?? 64);
      io = new IntersectionObserver(([entry]) => setStuck(!entry.isIntersecting), {
        threshold: 0,
        rootMargin: `-${top}px 0px 0px 0px`,
      });
      io.observe(el);
    };
    bind();
    window.addEventListener('resize', bind);
    return () => {
      window.removeEventListener('resize', bind);
      io?.disconnect();
    };
  }, []);

  const picker = (mode: 'rest' | 'stuck') => (
    <motion.div
      layoutId={reduce ? undefined : 'detail-edition-dock'}
      transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }}
      className={cn('dx-edition-dock', mode === 'stuck' && 'dx-edition-dock-stuck')}
    >
      <span className="pixel-label shrink-0 text-[8px] text-gold">{t('detail.editionLabel')}</span>
      <GameSelect
        key={mode}
        value={value}
        onChange={onChange}
        options={options}
        ariaLabel={t('detail.editionAria')}
        align={mode === 'stuck' ? 'center' : 'right'}
        buttonClassName={mode === 'stuck' ? 'dx-edition-trigger-stuck' : 'dx-edition-trigger'}
      />
    </motion.div>
  );

  return (
    <>
      <div ref={sentinelRef} className="relative z-30 flex justify-end">
        {stuck ? <div className="h-8 w-44" aria-hidden /> : picker('rest')}
      </div>
      {stuck && (
        <div className="pointer-events-none fixed inset-x-0 top-16 z-40 flex justify-center px-4 pt-2 md:top-[6.25rem]">
          <div className="pointer-events-auto">{picker('stuck')}</div>
        </div>
      )}
    </>
  );
}
