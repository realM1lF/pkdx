import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import './i18n'
import App from './App.tsx'

const container = document.getElementById('root')!
const app = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

/* Prerendering (scripts/prerender.mjs) ships fully rendered markup inside
 * #root for the static content routes. Hydrate it when present so there is
 * no flash / double render; plain createRoot for the bare SPA shell.
 * Defensive: React 19 patches attribute/text mismatches and recovers from
 * structural mismatches by client-rendering the affected subtree — reported
 * via onRecoverableError (kept quiet in prod; framer-motion style states and
 * localStorage-dependent UI can legitimately differ from the snapshot). */
if (container.hasChildNodes()) {
  hydrateRoot(container, app, {
    onRecoverableError: (error) => {
      if (import.meta.env.DEV) console.warn('[hydration]', error)
    },
  })
} else {
  createRoot(container).render(app)
}
