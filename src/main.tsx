import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import './i18n'
import App from './App.tsx'
import { captureBootPrerender } from './lib/cwv-paint'
import { hydrateRouteId } from './lib/hydrate-route'

const container = document.getElementById('root')!
const app = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

async function preloadHydrateRoute(pathname: string): Promise<void> {
  switch (hydrateRouteId(pathname)) {
    case 'home':
      await import('./pages/Home')
      return
    case 'pokedex':
      await import('./pages/Pokedex')
      return
    case 'pokemon':
      await import('./pages/PokemonDetail')
      return
    case 'maps':
      await import('./pages/Maps')
      return
    case 'map-region':
      await import('./pages/MapRegion')
      return
    case 'route-page':
      await import('./pages/maps/RoutePage')
      return
    case 'nuzlocke':
      await import('./pages/Nuzlocke')
      return
    case 'nuzlocke-guide':
      await import('./pages/nuzlocke/NuzlockeGuidePage')
      return
    case 'team':
      await import('./pages/TeamBuilder')
      return
    case 'items':
      await import('./pages/Items')
      return
    case 'item-detail':
      await import('./pages/items/ItemDetailPage')
      return
    case 'types':
      await import('./pages/types/TypesOverviewPage')
      return
    case 'type-detail':
      await import('./pages/types/TypeDetailPage')
      return
    case 'versus':
      await import('./pages/Versus')
      return
    case 'matchup':
      await import('./pages/MatchupPage')
      return
    case 'battle':
      await import('./pages/BattleLanding')
      return
    case 'about':
      await import('./pages/About')
      return
    case 'feedback':
      await import('./pages/Feedback')
      return
    case 'support':
      await import('./pages/Support')
      return
    case 'impressum':
      await import('./pages/Impressum')
      return
    case 'privacy':
      await import('./pages/Privacy')
      return
    case 'orre':
      await import('./pages/OrreTracker')
      return
    default:
      return
  }
}

/* Prerendering (scripts/prerender.mjs) ships fully rendered markup inside
 * #root for the static content routes. Hydrate it when present so there is
 * no flash / double render; plain createRoot for the bare SPA shell.
 * Preload the lazy page module first — otherwise Suspense swaps the
 * snapshot for a null fallback and LCP/CLS measure the hole.
 * Defensive: React 19 patches attribute/text mismatches and recovers from
 * structural mismatches by client-rendering the affected subtree — reported
 * via onRecoverableError (kept quiet in prod; framer-motion style states and
 * localStorage-dependent UI can legitimately differ from the snapshot). */
async function mount(): Promise<void> {
  captureBootPrerender(container.hasChildNodes())
  if (container.hasChildNodes()) {
    await preloadHydrateRoute(window.location.pathname)
    hydrateRoot(container, app, {
      onRecoverableError: (error) => {
        if (import.meta.env.DEV) console.warn('[hydration]', error)
      },
    })
    return
  }
  createRoot(container).render(app)
}

void mount()
