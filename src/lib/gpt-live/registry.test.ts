import { describe, expect, it } from 'vitest';
import { executeRegisteredTool, GPT_LIVE_TOOLS, gptLiveToolSchemas } from './registry';
import { CHECK_SLOT_LEGALITY } from './check-slot-legality';
import { CHECK_TEAM_COVERAGE } from './check-team-coverage';
import { NUZLOCKE_CAN_CATCH } from './nuzlocke-can-catch';
import { NUZLOCKE_RUN_STATUS } from './nuzlocke-run-status';
import { ITEM_LOCATIONS } from './item-locations';
import { JUDGE_MATCHUP } from './judge-matchup';
import { ROUTE_ENCOUNTERS } from './route-encounters';
import { GET_SPECIES_STATS } from './species-stats';
import { SITE_PAGES } from './site-pages';
import { WHERE_TO_FIND } from './where-to-find';
import { createSessionContext, getSessionContext, resetSessionContext } from './session-context';
import { BACKEND_INSTRUCTIONS, LIVE_INSTRUCTIONS, liveSessionBody } from './session-config';

describe('GPT-Live tool registry', () => {
  it('exposes only registered schemas with strict mode', () => {
    const schemas = gptLiveToolSchemas();
    expect(schemas.map((tool) => tool.name)).toEqual(GPT_LIVE_TOOLS.map((tool) => tool.name));
    expect(schemas.length).toBeGreaterThan(0);
    for (const schema of schemas) {
      expect(schema.strict).toBe(true);
      expect(schema.parameters.additionalProperties).toBe(false);
    }
  });

  it('uses the OpenAI live prompt labels and parallel tool calls', () => {
    expect(LIVE_INSTRUCTIONS).toContain('Penny');
    expect(LIVE_INSTRUCTIONS).toContain('MyPokePanion');
    expect(LIVE_INSTRUCTIONS.length).toBeGreaterThanOrEqual(1000);
    expect(LIVE_INSTRUCTIONS.length).toBeLessThanOrEqual(2450);
    expect(LIVE_INSTRUCTIONS).toContain('Delegation policy:');
    expect(LIVE_INSTRUCTIONS).toContain('Backend tools:');
    expect(LIVE_INSTRUCTIONS).toContain('Delegate to the backend when:');
    expect(LIVE_INSTRUCTIONS).toContain('Do not delegate to the backend when:');
    expect(LIVE_INSTRUCTIONS).toContain('Do not guess the result while waiting.');
    expect(LIVE_INSTRUCTIONS).not.toContain('who wins a matchup');
    expect(BACKEND_INSTRUCTIONS).toContain('Backend tools:');
    expect(BACKEND_INSTRUCTIONS).toContain('Species stats:');
    expect(BACKEND_INSTRUCTIONS).toContain(GET_SPECIES_STATS);
    expect(BACKEND_INSTRUCTIONS).toContain(JUDGE_MATCHUP);
    expect(BACKEND_INSTRUCTIONS).toContain(WHERE_TO_FIND);
    expect(BACKEND_INSTRUCTIONS).toContain(ROUTE_ENCOUNTERS);
    expect(BACKEND_INSTRUCTIONS).toContain(ITEM_LOCATIONS);
    expect(BACKEND_INSTRUCTIONS).toContain(CHECK_SLOT_LEGALITY);
    expect(BACKEND_INSTRUCTIONS).toContain(CHECK_TEAM_COVERAGE);
    expect(BACKEND_INSTRUCTIONS).toContain(NUZLOCKE_RUN_STATUS);
    expect(BACKEND_INSTRUCTIONS).toContain(NUZLOCKE_CAN_CATCH);
    expect(BACKEND_INSTRUCTIONS).toContain(SITE_PAGES);
    const body = liveSessionBody();
    expect(body.delegation.responses.parallel_tool_calls).toBe(true);
    expect(body.delegation.responses.tools).toEqual(gptLiveToolSchemas());
  });

  it('rejects unknown tools', async () => {
    await expect(executeRegisteredTool('not_a_tool', {}, {})).resolves.toMatchObject({
      ok: false,
      error: 'unknown_tool',
    });
  });

  it('reuses the session game when the tool gets null', async () => {
    const id = createSessionContext();
    const ctx = getSessionContext(id);
    const first = await executeRegisteredTool(
      GET_SPECIES_STATS,
      { species_query: 'Glurak', game: 'rote Edition' },
      ctx,
    );
    expect(first).toMatchObject({ ok: true, species: { slug: 'charizard' } });
    const second = await executeRegisteredTool(
      GET_SPECIES_STATS,
      { species_query: 'Bisasam', game: null },
      ctx,
    );
    expect(second).toMatchObject({
      ok: true,
      species: { slug: 'bulbasaur' },
      game: { versionGroup: 'red-blue', gen: 1 },
    });
    resetSessionContext(id);
  });
});
