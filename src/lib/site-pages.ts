/** Footer nav link defs — single source for Footer + GPT-Live site_pages. */
export type FooterLinkGroup = 'site' | 'legal' | 'explore';

export interface FooterLinkDef {
  readonly id: string;
  readonly path: string;
  readonly i18nKey: `footer.${string}`;
  readonly group: FooterLinkGroup;
}

function link(
  id: string,
  path: string,
  i18nKey: `footer.${string}`,
  group: FooterLinkGroup,
): FooterLinkDef {
  return { id, path, i18nKey, group };
}

export const FOOTER_SITE_LINKS = [
  link('about', '/about', 'footer.about', 'site'),
  link('feedback', '/feedback', 'footer.feedback', 'site'),
  link('support', '/support', 'footer.support', 'site'),
] as const;

export const FOOTER_LEGAL_LINKS = [
  link('impressum', '/impressum', 'footer.impressum', 'legal'),
  link('privacy', '/datenschutz', 'footer.privacy', 'legal'),
  link('licenses', '/lizenzen', 'footer.licenses', 'legal'),
] as const;

export const FOOTER_FEATURE_LINKS = [
  link('home', '/', 'footer.home', 'explore'),
  link('pokedex', '/pokedex', 'footer.pokedex', 'explore'),
  link('maps', '/maps', 'footer.maps', 'explore'),
  link('nuzlocke', '/nuzlocke', 'footer.nuzlocke', 'explore'),
  link('team', '/team', 'footer.team', 'explore'),
  link('versus', '/versus', 'footer.versus', 'explore'),
  link('items', '/items', 'footer.items', 'explore'),
  link('orre', '/orre', 'footer.orre', 'explore'),
] as const;

export const FOOTER_NAV_LINKS: readonly FooterLinkDef[] = [
  ...FOOTER_SITE_LINKS,
  ...FOOTER_LEGAL_LINKS,
  ...FOOTER_FEATURE_LINKS,
];

export const FOOTER_GROUP_I18N: Record<FooterLinkGroup, `footer.${string}`> = {
  site: 'footer.site',
  legal: 'footer.legal',
  explore: 'footer.explore',
};

export function localePath(lang: 'de' | 'en', path: string): string {
  if (path === '/') return `/${lang}`;
  return `/${lang}${path}`;
}
