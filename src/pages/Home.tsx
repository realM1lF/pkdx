/* Home — `/` (home.md). First-visit preloader → hero → search gateway → toolkit →
 * spotlight → type spectrum → generations rail → features → stats band. */
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PokeballLoader from '@/components/PokeballLoader';
import Hero from './home/Hero';
import SearchGateway from './home/SearchGateway';
import ToolkitSection from './home/ToolkitSection';
import Spotlight from './home/Spotlight';
import TypeSpectrum from './home/TypeSpectrum';
import GenerationsRail from './home/GenerationsRail';
import Features from './home/Features';
import StatsBand from './home/StatsBand';

const SESSION_KEY = 'pdx:preloader-done';

export default function Home() {
  const [loading, setLoading] = useState(() => {
    try {
      return !sessionStorage.getItem(SESSION_KEY);
    } catch {
      return false;
    }
  });

  const finish = () => {
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* ignore */
    }
    setLoading(false);
  };

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="preloader"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="fixed inset-0 z-[100]"
          >
            <PokeballLoader variant="page" onDone={finish} />
          </motion.div>
        )}
      </AnimatePresence>

      <Hero started={!loading} />
      <SearchGateway />
      <ToolkitSection />
      <Spotlight />
      <TypeSpectrum />
      <GenerationsRail />
      <Features />
      <StatsBand />
    </>
  );
}
