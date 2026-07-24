import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router';
import { MotionConfig } from 'framer-motion';
import Layout from './components/Layout';
import PokeballLoader from './components/PokeballLoader';
import { LangGate, LangHomeRedirect, LangRedirect } from './components/LangGate';
import { ShinyProvider } from './lib/shiny';

/* Route-level code splitting (design.md §11) — Three.js + GSAP ship only with Home.
 * lazyWithReload: if a lazy chunk 404s (stale index.html after a deploy, the
 * "MIME type text/html" error), reload the page ONCE to fetch fresh HTML. */
const RELOAD_FLAG = 'pdx2.chunkReload';
function lazyWithReload<T extends { default: React.ComponentType<object> }>(
  factory: () => Promise<T>,
): ReturnType<typeof lazy> {
  return lazy(async () => {
    try {
      return await factory();
    } catch (err) {
      if (!sessionStorage.getItem(RELOAD_FLAG)) {
        sessionStorage.setItem(RELOAD_FLAG, '1');
        window.location.reload();
        /* keep suspense pending while the reload happens */
        return new Promise<T>(() => {});
      }
      throw err;
    }
  });
}
/* reload succeeded → clear the flag so a genuinely broken chunk still errors */
window.addEventListener('pageshow', () => sessionStorage.removeItem(RELOAD_FLAG));

const Home = lazyWithReload(() => import('./pages/Home'));
const Pokedex = lazyWithReload(() => import('./pages/Pokedex'));
const PokemonDetail = lazyWithReload(() => import('./pages/PokemonDetail'));
const Maps = lazyWithReload(() => import('./pages/Maps'));
const MapRegion = lazyWithReload(() => import('./pages/MapRegion'));
const RoutePage = lazyWithReload(() => import('./pages/maps/RoutePage'));
const Nuzlocke = lazyWithReload(() => import('./pages/Nuzlocke'));
const NuzlockeRun = lazyWithReload(() => import('./pages/NuzlockeRun'));
const TeamBuilder = lazyWithReload(() => import('./pages/TeamBuilder'));
const Items = lazyWithReload(() => import('./pages/Items'));
const ItemDetailPage = lazyWithReload(() => import('./pages/items/ItemDetailPage'));
const TypesOverviewPage = lazyWithReload(() => import('./pages/types/TypesOverviewPage'));
const TypeDetailPage = lazyWithReload(() => import('./pages/types/TypeDetailPage'));
const Versus = lazyWithReload(() => import('./pages/Versus'));
const Impressum = lazyWithReload(() => import('./pages/Impressum'));
const Privacy = lazyWithReload(() => import('./pages/Privacy'));
const About = lazyWithReload(() => import('./pages/About'));
const Feedback = lazyWithReload(() => import('./pages/Feedback'));
const Support = lazyWithReload(() => import('./pages/Support'));
const Account = lazyWithReload(() => import('./pages/Account'));

function PageFallback() {
  /* full-screen pokeball gate while lazy chunks load — same look as the
   * initial home loader; covers the previous footer flash (user feedback) */
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-void">
      <div className="grain-overlay absolute inset-0" />
      <PokeballLoader variant="inline" className="relative h-16 w-16" />
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
                {/* static content route outranks maps/:region (React Router ranking);
                    one SEO page per Kanto location with FRLG encounter data */}
                <Route path="maps/kanto/:slug" element={<RoutePage />} />
                <Route path="maps/:region" element={<MapRegion />} />
                <Route path="nuzlocke" element={<Nuzlocke />} />
                <Route path="nuzlocke/:runId" element={<NuzlockeRun />} />
                <Route path="team" element={<TeamBuilder />} />
                <Route path="items" element={<Items />} />
                <Route path="items/:slug" element={<ItemDetailPage />} />
                {/* type SEO pages use localized paths: /de/typen/* · /en/types/* */}
                <Route path="typen" element={<TypesOverviewPage />} />
                <Route path="typen/:type" element={<TypeDetailPage />} />
                <Route path="types" element={<TypesOverviewPage />} />
                <Route path="types/:type" element={<TypeDetailPage />} />
                <Route path="versus" element={<Versus />} />
                <Route path="about" element={<About />} />
                <Route path="feedback" element={<Feedback />} />
                <Route path="support" element={<Support />} />
                <Route path="account" element={<Account />} />
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
