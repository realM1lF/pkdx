/* External interactive map links — community tools (pkmnmap, Ironmon, Team Synergy).
 * Shown as "INTERACTIVE ↗" in the map command bar; opens in a new tab.
 * URLs are checked periodically — MapGenie HGSS was removed (404/500 as of 2026). */
import type { RegionId } from './regions';

export interface InteractiveMapLink {
  url: string;
  /** Short site name for tooltips */
  site: string;
  /** Game edition covered by that map */
  game: string;
}

type RegionInteractiveConfig = {
  default: InteractiveMapLink;
  byVersion?: Partial<Record<string, InteractiveMapLink>>;
};

/** Curated per-region links — HTTP-verified where possible. */
const INTERACTIVE_MAPS: Record<RegionId, RegionInteractiveConfig> = {
  kanto: {
    default: {
      url: 'https://pkmnmap.com/Maps/FireRedLeafGreen/',
      site: 'pkmnmap',
      game: 'FireRed & LeafGreen',
    },
    byVersion: {
      red: {
        url: 'https://mapgenie.io/pokemon-red-blue-yellow/maps/redblue',
        site: 'MapGenie',
        game: 'Red & Blue',
      },
      blue: {
        url: 'https://mapgenie.io/pokemon-red-blue-yellow/maps/redblue',
        site: 'MapGenie',
        game: 'Red & Blue',
      },
      yellow: {
        url: 'https://mapgenie.io/pokemon-red-blue-yellow/maps/redblue',
        site: 'MapGenie',
        game: 'Yellow',
      },
      firered: {
        url: 'https://pkmnmap.com/Maps/FireRedLeafGreen/',
        site: 'pkmnmap',
        game: 'FireRed & LeafGreen',
      },
      leafgreen: {
        url: 'https://pkmnmap.com/Maps/FireRedLeafGreen/',
        site: 'pkmnmap',
        game: 'FireRed & LeafGreen',
      },
    },
  },
  johto: {
    default: {
      url: 'https://kelseyyoung.github.io/HGSSIronmonMap/',
      site: 'HGSS Ironmon Map',
      game: 'HeartGold & SoulSilver',
    },
    byVersion: {
      /* G/S/C: no interactive GSC map exists — the HGSS Ironmon map is the
       * only real interactive Johto map, so all versions share it */
      gold: {
        url: 'https://kelseyyoung.github.io/HGSSIronmonMap/',
        site: 'HGSS Ironmon Map',
        game: 'HeartGold & SoulSilver',
      },
      silver: {
        url: 'https://kelseyyoung.github.io/HGSSIronmonMap/',
        site: 'HGSS Ironmon Map',
        game: 'HeartGold & SoulSilver',
      },
      crystal: {
        url: 'https://kelseyyoung.github.io/HGSSIronmonMap/',
        site: 'HGSS Ironmon Map',
        game: 'HeartGold & SoulSilver',
      },
      heartgold: {
        url: 'https://kelseyyoung.github.io/HGSSIronmonMap/',
        site: 'HGSS Ironmon Map',
        game: 'HeartGold & SoulSilver',
      },
      soulsilver: {
        url: 'https://kelseyyoung.github.io/HGSSIronmonMap/',
        site: 'HGSS Ironmon Map',
        game: 'HeartGold & SoulSilver',
      },
    },
  },
  hoenn: {
    default: {
      url: 'https://pkmnmap.com/Maps/Emerald/',
      site: 'pkmnmap',
      game: 'Emerald',
    },
    byVersion: {
      /* R/S: no interactive RS map exists — pkmnmap's Emerald map is the
       * only real interactive Hoenn map, so both versions share it */
      ruby: {
        url: 'https://pkmnmap.com/Maps/Emerald/',
        site: 'pkmnmap',
        game: 'Emerald',
      },
      sapphire: {
        url: 'https://pkmnmap.com/Maps/Emerald/',
        site: 'pkmnmap',
        game: 'Emerald',
      },
      emerald: {
        url: 'https://pkmnmap.com/Maps/Emerald/',
        site: 'pkmnmap',
        game: 'Emerald',
      },
    },
  },
  sinnoh: {
    default: {
      url: 'https://pkmnmap4.web.app/',
      site: 'pkmnmap4',
      game: 'Platinum',
    },
    byVersion: {
      diamond: {
        url: 'https://pkmnmap.com/Platinum/',
        site: 'pkmnmap',
        game: 'Diamond & Pearl',
      },
      pearl: {
        url: 'https://pkmnmap.com/Platinum/',
        site: 'pkmnmap',
        game: 'Diamond & Pearl',
      },
      platinum: {
        url: 'https://pkmnmap4.web.app/',
        site: 'pkmnmap4',
        game: 'Platinum',
      },
    },
  },
  unova: {
    /* Team Synergy runs the only interactive Unova map (pan/zoom, spawn
     * filters). Note: spawn data follows PokeMMO, not retail BW — the chip
     * labels the site clearly. Verified 200 as of 2026-07-23. */
    default: {
      url: 'https://synergymmo.com/region-maps/',
      site: 'Team Synergy',
      game: 'Black & White',
    },
    byVersion: {
      black: {
        url: 'https://synergymmo.com/region-maps/',
        site: 'Team Synergy',
        game: 'Black & White',
      },
      white: {
        url: 'https://synergymmo.com/region-maps/',
        site: 'Team Synergy',
        game: 'Black & White',
      },
      'black-2': {
        url: 'https://synergymmo.com/region-maps/',
        site: 'Team Synergy',
        game: 'Black 2 & White 2',
      },
      'white-2': {
        url: 'https://synergymmo.com/region-maps/',
        site: 'Team Synergy',
        game: 'Black 2 & White 2',
      },
    },
  },
};

/** Resolve the best external interactive map for a region + optional game version. */
export function resolveInteractiveMapLink(regionId: RegionId, version?: string): InteractiveMapLink | null {
  const cfg = INTERACTIVE_MAPS[regionId];
  if (!cfg) return null;
  if (version && cfg.byVersion?.[version]) return cfg.byVersion[version] ?? null;
  return cfg.default;
}
