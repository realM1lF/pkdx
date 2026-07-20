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
const Maps = lazy(() => import('./pages/Maps'));
const MapRegion = lazy(() => import('./pages/MapRegion'));
const Nuzlocke = lazy(() => import('./pages/Nuzlocke'));
const NuzlockeRun = lazy(() => import('./pages/NuzlockeRun'));

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
              <Route path="/maps" element={<Maps />} />
              <Route path="/maps/:region" element={<MapRegion />} />
              <Route path="/nuzlocke" element={<Nuzlocke />} />
              <Route path="/nuzlocke/:runId" element={<NuzlockeRun />} />
            </Routes>
          </Suspense>
        </Layout>
      </ShinyProvider>
    </MotionConfig>
  );
}
