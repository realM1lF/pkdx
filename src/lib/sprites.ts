/* MyPokePanion — sprite URL builder (design.md §10.2)
 * Base: PokeAPI/sprites repo on raw.githubusercontent. */

const BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
const CRIES = 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon';

/* Bundled listing sprites (perf/bundle-sprites): the 1025 default front
 * sprites (+ shiny) ship in public/sprites/pokemon/ so the pokédex listing
 * is served from our own host with immutable cache headers — GitHub raw
 * forces revalidation every 5 min (Cache-Control: max-age=300). Remote
 * URLs stay as onError fallbacks in the Sprite chain. */
const LOCAL = '/sprites/pokemon';

export const sprites = {
  /** modern menu-style sprites — bundled locally (ids 1–1025) */
  front: (id: number) => (id >= 1 && id <= 1025 ? `${LOCAL}/${id}.png` : `${BASE}/${id}.png`),
  back: (id: number) => `${BASE}/back/${id}.png`,
  shinyFront: (id: number) => (id >= 1 && id <= 1025 ? `${LOCAL}/shiny/${id}.png` : `${BASE}/shiny/${id}.png`),
  shinyBack: (id: number) => `${BASE}/back/shiny/${id}.png`,

  /** detail hero artwork (~475px) */
  artwork: (id: number) => `${BASE}/other/official-artwork/${id}.png`,
  artworkShiny: (id: number) => `${BASE}/other/official-artwork/shiny/${id}.png`,

  /** HOME renders — Gen VIII–IX museum fallback */
  home: (id: number) => `${BASE}/other/home/${id}.png`,
  homeShiny: (id: number) => `${BASE}/other/home/shiny/${id}.png`,

  /** Showdown GIFs — "3D-era" museum tiles */
  showdown: (id: number) => `${BASE}/other/showdown/${id}.gif`,
  showdownBack: (id: number) => `${BASE}/other/showdown/back/${id}.gif`,
  showdownShiny: (id: number) => `${BASE}/other/showdown/shiny/${id}.gif`,

  /* ---- era sprites (design.md §10.2 table) ---- */
  gen1RedBlue: (id: number) => `${BASE}/versions/generation-i/red-blue/${id}.png`,
  gen1Yellow: (id: number) => `${BASE}/versions/generation-i/yellow/${id}.png`,
  gen2Crystal: (id: number) => `${BASE}/versions/generation-ii/crystal/${id}.png`,
  gen2Gold: (id: number) => `${BASE}/versions/generation-ii/gold/${id}.png`,
  gen2Silver: (id: number) => `${BASE}/versions/generation-ii/silver/${id}.png`,
  gen2CrystalShiny: (id: number) => `${BASE}/versions/generation-ii/crystal/shiny/${id}.png`,
  gen3Emerald: (id: number) => `${BASE}/versions/generation-iii/emerald/${id}.png`,
  gen3FRLG: (id: number) => `${BASE}/versions/generation-iii/firered-leafgreen/${id}.png`,
  gen3RubySapphire: (id: number) => `${BASE}/versions/generation-iii/ruby-sapphire/${id}.png`,
  gen4Platinum: (id: number) => `${BASE}/versions/generation-iv/platinum/${id}.png`,
  gen4HGSS: (id: number) => `${BASE}/versions/generation-iv/heartgold-soulsilver/${id}.png`,
  gen4DP: (id: number) => `${BASE}/versions/generation-iv/diamond-pearl/${id}.png`,
  gen4PlatinumShiny: (id: number) => `${BASE}/versions/generation-iv/platinum/shiny/${id}.png`,
  /** signature animated GIFs (ids ≤ 649) */
  gen5Animated: (id: number) => `${BASE}/versions/generation-v/black-white/animated/${id}.gif`,
  gen5AnimatedShiny: (id: number) => `${BASE}/versions/generation-v/black-white/animated/shiny/${id}.gif`,
  gen5AnimatedBack: (id: number) => `${BASE}/versions/generation-v/black-white/animated/back/${id}.gif`,
  gen5Static: (id: number) => `${BASE}/versions/generation-v/black-white/${id}.png`,
  gen6XY: (id: number) => `${BASE}/versions/generation-vi/x-y/${id}.png`,
  gen7USUM: (id: number) => `${BASE}/versions/generation-vii/ultra-sun-ultra-moon/${id}.png`,
  /** Gen VIII menu-style icons (SW/SH-era; not every species) */
  gen8Icon: (id: number) => `${BASE}/versions/generation-viii/icons/${id}.png`,
  /** Gen IX scarlet/violet renders (SV dex; not every species) */
  gen9SV: (id: number) => `${BASE}/versions/generation-ix/scarlet-violet/${id}.png`,

  /** cries (PokeAPI/cries repo) */
  cry: (id: number) => `${CRIES}/latest/${id}.ogg`,
  cryLegacy: (id: number) => `${CRIES}/legacy/${id}.ogg`,
} as const;

/** Sprite eras for the museum / <Sprite> wrapper */
export type SpriteEra =
  | 'default' // modern menu sprite
  | 'artwork' // official artwork
  | 'home'
  | 'showdown'
  | 'gen1'
  | 'gen2'
  | 'gen3'
  | 'gen4'
  | 'gen5' // animated GIF
  | 'gen6'
  | 'gen7'
  | 'gen8'
  | 'gen9';

/** Eras rendered with image-rendering: pixelated (pre-Gen-VI, §10.2 rule a) */
export const PIXELATED_ERAS: ReadonlySet<SpriteEra> = new Set(['gen1', 'gen2', 'gen3', 'gen4', 'gen5', 'gen8', 'default']);

function primaryUrl(era: SpriteEra, id: number, shiny: boolean, back: boolean): string {
  switch (era) {
    case 'artwork':
      return shiny ? sprites.artworkShiny(id) : sprites.artwork(id);
    case 'home':
      return shiny ? sprites.homeShiny(id) : sprites.home(id);
    case 'showdown':
      return back ? sprites.showdownBack(id) : shiny ? sprites.showdownShiny(id) : sprites.showdown(id);
    case 'gen1':
      return sprites.gen1RedBlue(id);
    case 'gen2':
      return shiny ? sprites.gen2CrystalShiny(id) : sprites.gen2Crystal(id);
    case 'gen3':
      return sprites.gen3Emerald(id);
    case 'gen4':
      return shiny ? sprites.gen4PlatinumShiny(id) : sprites.gen4Platinum(id);
    case 'gen5':
      return back ? sprites.gen5AnimatedBack(id) : shiny ? sprites.gen5AnimatedShiny(id) : sprites.gen5Animated(id);
    case 'gen6':
      return sprites.gen6XY(id);
    case 'gen7':
      return sprites.gen7USUM(id);
    case 'gen8':
      return sprites.gen8Icon(id);
    case 'gen9':
      return sprites.gen9SV(id);
    case 'default':
    default:
      return back
        ? shiny
          ? sprites.shinyBack(id)
          : sprites.back(id)
        : shiny
          ? sprites.shinyFront(id)
          : sprites.front(id);
  }
}

/**
 * Ordered fallback chain (§10.2 rule b): requested → animated/static → home → default → artwork.
 * Feed to <Sprite> which advances on img onError.
 */
export function spriteFallbackChain(era: SpriteEra, id: number, shiny = false, back = false): string[] {
  const chain: string[] = [primaryUrl(era, id, shiny, back)];
  if (era === 'gen5') chain.push(sprites.gen5Static(id)); // animated → static
  if (era !== 'home') chain.push(shiny ? sprites.homeShiny(id) : sprites.home(id));
  chain.push(shiny ? sprites.shinyFront(id) : sprites.front(id));
  chain.push(sprites.artwork(id));
  // de-dupe while preserving order
  return chain.filter((u, i) => chain.indexOf(u) === i);
}

/** Human label for alt text: "{name} — {era} sprite" */
export const ERA_LABELS: Record<SpriteEra, string> = {
  default: 'modern',
  artwork: 'official artwork',
  home: 'HOME render',
  showdown: 'showdown-era',
  gen1: 'Gen I (1996)',
  gen2: 'Gen II (1999)',
  gen3: 'Gen III (2004)',
  gen4: 'Gen IV (2006)',
  gen5: 'Gen V (2010)',
  gen6: 'Gen VI (2013)',
  gen7: 'Gen VII (2016)',
  gen8: 'Gen VIII (2019)',
  gen9: 'Gen IX (2022)',
};

/**
 * Versus side-card sprite era: one era per selected calc gen so the portrait
 * changes with the game picker. Gen 8 → SW/SH icons, Gen 9 → SV renders;
 * species missing from that gen's set fall back via `spriteFallbackChain`.
 */
export function spriteEraForVersus(gen: number, _pokemonId: number): SpriteEra {
  if (gen <= 1) return 'gen1';
  if (gen === 2) return 'gen2';
  if (gen === 3) return 'gen3';
  if (gen === 4) return 'gen4';
  if (gen === 5) return 'gen5';
  if (gen === 6) return 'gen6';
  if (gen === 7) return 'gen7';
  if (gen === 8) return 'gen8';
  return 'gen9';
}
