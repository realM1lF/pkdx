import { describe, expect, it } from 'vitest';
import { schemasForRoute, faqPageSchema, websiteSchema } from './structured-data';
import { nuzlockeGuideContent } from './nuzlocke-guide-content';
import { nuzlockeSeoContent } from './nuzlocke-seo-content';
import { SITE_URL } from './seo';

describe('faqPageSchema', () => {
  it('creates an FAQPage with one Question for each answer', () => {
    const schema = faqPageSchema([
      { q: 'What is a Nuzlocke?', a: 'A self-imposed Pokémon challenge.' },
      { q: 'Can I play with friends?', a: 'Yes, with a shared run.' },
    ]);

    expect(schema['@type']).toBe('FAQPage');
    expect(schema.mainEntity).toHaveLength(2);
    expect(schema.mainEntity).toEqual([
      {
        '@type': 'Question',
        name: 'What is a Nuzlocke?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A self-imposed Pokémon challenge.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I play with friends?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, with a shared run.',
        },
      },
    ]);
  });
});

describe('websiteSchema SearchAction', () => {
  it('points the search target at the locale Pokédex', () => {
    const de = websiteSchema('de').potentialAction as { target: { urlTemplate: string } };
    const en = websiteSchema('en').potentialAction as { target: { urlTemplate: string } };
    expect(de.target.urlTemplate).toBe(`${SITE_URL}/de/pokedex?q={search_term_string}`);
    expect(en.target.urlTemplate).toBe(`${SITE_URL}/en/pokedex?q={search_term_string}`);
  });

  it('emits the locale SearchAction on every route block', () => {
    const de = schemasForRoute('/pokedex', 'de').find((block) => block.id === 'website');
    const en = schemasForRoute('/', 'en').find((block) => block.id === 'website');
    const deAction = de?.data.potentialAction as { target: { urlTemplate: string } };
    const enAction = en?.data.potentialAction as { target: { urlTemplate: string } };
    expect(deAction.target.urlTemplate).toBe(`${SITE_URL}/de/pokedex?q={search_term_string}`);
    expect(enAction.target.urlTemplate).toBe(`${SITE_URL}/en/pokedex?q={search_term_string}`);
  });
});

describe('Nuzlocke guide FAQ schema', () => {
  it('uses the visible guide FAQ copy for a satellite route', () => {
    const blocks = schemasForRoute('/nuzlocke/firered', 'en');
    const faq = blocks.find((block) => block.id === 'faq-page');

    expect(faq?.data).toEqual(faqPageSchema(nuzlockeGuideContent('en', 'firered').faq));
  });
});

describe('hub FAQPage schema stays 1:1 with visible copy', () => {
  it('emits the Nuzlocke hub FAQ from nuzlockeSeoContent', () => {
    const blocks = schemasForRoute('/nuzlocke', 'en');
    const faq = blocks.find((block) => block.id === 'faq-page');
    expect(faq?.data).toEqual(faqPageSchema(nuzlockeSeoContent('en').faq.items));
  });

  it('does not emit FAQPage on the Team hub', () => {
    const blocks = schemasForRoute('/team', 'en');
    expect(blocks.some((block) => block.id === 'faq-page')).toBe(false);
  });
});
