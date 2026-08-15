const LANGS = ['de', 'en'] as const;

export function slugifyDeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function pokemonSlugRedirects(
  entries: Array<{ id: number; slug: string; nameDe?: string }>,
): Array<{ from: string; to: string; status: number }> {
  const rules: Array<{ from: string; to: string; status: number }> = [];
  const seen = new Set<string>();

  for (const entry of entries) {
    const aliases = new Set<string>();
    if (entry.slug) aliases.add(entry.slug);
    if (entry.nameDe) aliases.add(slugifyDeName(entry.nameDe));

    for (const alias of aliases) {
      if (!alias || alias === String(entry.id)) continue;
      for (const lang of LANGS) {
        const from = `/${lang}/pokemon/${alias}`;
        if (seen.has(from)) continue;
        seen.add(from);
        rules.push({ from, to: `/${lang}/pokemon/${entry.id}/`, status: 301 });
      }
    }
  }

  return rules;
}
