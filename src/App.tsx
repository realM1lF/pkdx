import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router';
import { MotionConfig } from 'framer-motion';
import Layout from './components/Layout';
import PokeballLoader from './components/PokeballLoader';
import { LangGate, LangHomeRedirect, LangRedirect } from './components/LangGate';
import { ShinyProvider } from './lib/shiny';

/* Route-level code splitting (design.md §11) — Three.js + GSAP ship only with Home. */
const Home = lazy(() => import('./pages/Home'));
const Pokedex = lazy(() => import('./pages/Pokedex'));
const PokemonDetail = lazy(() => import('./pages/PokemonDetail'));
const Maps = lazy(() => import('./pages/Maps'));
const MapRegion = lazy(() => import('./pages/MapRegion'));
const Nuzlocke = lazy(() => import('./pages/Nuzlocke'));
const NuzlockeRun = lazy(() => import('./pages/NuzlockeRun'));
const TeamBuilder = lazy(() => import('./pages/TeamBuilder'));
const Versus = lazy(() => import('./pages/Versus'));
const Impressum = lazy(() => import('./pages/Impressum'));
const Privacy = lazy(() => import('./pages/Privacy'));

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
              {/* every app route lives once under the /:lang prefix (WP7);
                  unprefixed legacy URLs redirect to the detected language */}
              <Route path="/:lang" element={<LangGate />}>
                <Route index element={<Home />} />
                <Route path="pokedex" element={<Pokedex />} />
                <Route path="pokemon/:id" element={<PokemonDetail />} />
                <Route path="maps" element={<Maps />} />
                <Route path="maps/:region" element={<MapRegion />} />
                <Route path="nuzlocke" element={<Nuzlocke />} />
                <Route path="nuzlocke/:runId" element={<NuzlockeRun />} />
                <Route path="team" element={<TeamBuilder />} />
                <Route path="versus" element={<Versus />} />
                <Route path="impressum" element={<Impressum />} />
                <Route path="datenschutz" element={<Privacy />} />
                <Route path="*" element={<LangHomeRedirect />} />
              </Route>
              <Route path="*" element={<LangRedirect />} />
            </Routes>
          </Suspense>
        </Layout>
      </ShinyProvider>
    </MotionConfig>
  );
}
