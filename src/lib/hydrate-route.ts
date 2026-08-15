/** Which lazy page module must resolve before hydrateRoot, so Suspense
 * does not replace prerendered markup with a null fallback (CLS + LCP). */

export type HydrateRouteId =
  | 'home'
  | 'pokedex'
  | 'pokemon'
  | 'maps'
  | 'map-region'
  | 'route-page'
  | 'nuzlocke'
  | 'nuzlocke-guide'
  | 'team'
  | 'items'
  | 'item-detail'
  | 'types'
  | 'type-detail'
  | 'versus'
  | 'matchup'
  | 'battle'
  | 'about'
  | 'feedback'
  | 'support'
  | 'impressum'
  | 'privacy'
  | 'orre';

const NUZ_GUIDES = new Set([
  'soul-link',
  'firered',
  'emerald',
  'platinum',
  'heartgold',
  'black-white',
]);

const MAP_REGIONS = new Set(['kanto', 'johto', 'hoenn', 'sinnoh', 'unova', 'orre']);

function restAfterLang(pathname: string): string {
  const stripped = pathname.replace(/^\/(de|en)(?=\/|$)/, '') || '/';
  if (stripped.length > 1 && stripped.endsWith('/')) return stripped.slice(0, -1);
  return stripped === '' ? '/' : stripped;
}

export function hydrateRouteId(pathname: string): HydrateRouteId | null {
  const rest = restAfterLang(pathname);
  if (rest === '/') return 'home';
  if (rest === '/pokedex') return 'pokedex';
  if (rest.startsWith('/pokemon/')) return 'pokemon';
  if (rest === '/items') return 'items';
  if (rest.startsWith('/items/')) return 'item-detail';
  if (/^\/maps\/(kanto|johto|hoenn|sinnoh)\/.+/.test(rest)) return 'route-page';
  if (rest.startsWith('/maps/')) {
    const region = rest.slice('/maps/'.length);
    return MAP_REGIONS.has(region) ? 'map-region' : null;
  }
  if (rest === '/maps') return 'maps';
  if (rest === '/nuzlocke') return 'nuzlocke';
  if (rest.startsWith('/nuzlocke/')) {
    const slug = rest.slice('/nuzlocke/'.length);
    return NUZ_GUIDES.has(slug) ? 'nuzlocke-guide' : null;
  }
  if (rest === '/team') return 'team';
  if (rest === '/versus') return 'versus';
  if (rest.startsWith('/versus/')) return 'matchup';
  if (rest === '/about') return 'about';
  if (rest === '/feedback') return 'feedback';
  if (rest === '/support') return 'support';
  if (rest === '/kampf-simulator' || rest === '/battle-simulator') return 'battle';
  if (rest === '/typen' || rest === '/types') return 'types';
  if (rest.startsWith('/typen/') || rest.startsWith('/types/')) return 'type-detail';
  if (rest === '/impressum') return 'impressum';
  if (rest === '/datenschutz') return 'privacy';
  if (rest === '/orre') return 'orre';
  return null;
}
