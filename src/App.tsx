import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router';
import { MotionConfig } from 'framer-motion';
import Layout from './components/Layout';
import PokeballLoader from './components/PokeballLoader';
import { ShinyProvider } from './lib/shiny';

/* Route-level code splitting (design.md §11) — Three.js + GSAP ship only with Home. */
const Home = lazy(() => import('./pages/Home'));
const Pokedex = lazy(() => import('./pages/Pokedex'));
const PokemonDetail = lazy(() => import('./pages/PokemonDetail'));

function PageFallback() {
  return (
    <div className="grid min-h-[60dvh] place-items-center">
      <PokeballLoader variant="inline" />
    </div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ShinyProvider>
        <Layout>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/pokedex" element={<Pokedex />} />
              <Route path="/pokemon/:id" element={<PokemonDetail />} />
            </Routes>
          </Suspense>
        </Layout>
      </ShinyProvider>
    </MotionConfig>
  );
}
