import { describe, expect, it } from 'vitest';
import { schemasForRoute, faqPageSchema } from './structured-data';
import { nuzlockeGuideContent } from './nuzlocke-guide-content';

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

describe('Nuzlocke guide FAQ schema', () => {
  it('uses the visible guide FAQ copy for a satellite route', () => {
    const blocks = schemasForRoute('/nuzlocke/firered', 'en');
    const faq = blocks.find((block) => block.id === 'faq-page');

    expect(faq?.data).toEqual(faqPageSchema(nuzlockeGuideContent('en', 'firered').faq));
  });
});
