/* TeamBuilder — /team (team-builder.md, Option A full version)
 * 6-slot builder with GAME legality, synergy deck, Smogon meta, nuzlocke import.
 * State lives in src/lib/teambuilder.ts; this page wires data → components. */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, Reorder } from 'framer-motion';
import { displayName, getMove, getPokemon } from '@/lib/pokeapi';
import {
  consumeTeamHash,
  decodeTeamHash,
  defensiveSynergy,
  deleteTeam,
  emptySlot,
  emptyTeam,
  encodeTeamHash,
  fetchMetaDump,
  filledSlots,
  genTypesOf,
  loadDraft,
  loadTeams,
  offensiveCoverage,
  parseMetaEntry,
  saveDraft,
  saveTeam,
  slotLegality,
  slotsFromImport,
  smogonEvs,
  versionGroupById,
} from '@/lib/teambuilder';
import type {
  CoverageResult,
  ImportedRunTeam,
  SlotLegality,
  SmogonSet,
  SmogonSpeciesEntry,
  Team,
  TeamMove,
  TeamSlot,
} from '@/lib/teambuilder';
import type { Move, Pokemon, PokemonType } from '@/lib/types';
import AnalysisDeck from './teambuilder/AnalysisDeck';
import type { MetaState } from './teambuilder/AnalysisDeck';
import HeaderStrip from './teambuilder/HeaderStrip';
import ImportRunDialog from './teambuilder/ImportRunDialog';
import SavedTeamsHub from './teambuilder/SavedTeamsHub';
import SlotCard from './teambuilder/SlotCard';
import SlotEditor from './teambuilder/SlotEditor';
import './teambuilder/teambuilder.css';

/** 'Swords Dance' → 'swords-dance' (PokéAPI move slug) */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function TeamBuilder() {
  /* shared-team hash is consumed once at mount (lazy initializer) */
  const [sharedPayload] = useState<string | null>(() => consumeTeamHash());
  const [team, setTeam] = useState<Team | null>(() => (sharedPayload ? null : loadDraft()));
  const [teams, setTeams] = useState<Team[]>(() => loadTeams());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [shareState, setShareState] = useState<'idle' | 'copied'>('idle');
  const [savedFlash, setSavedFlash] = useState(false);
  const [appliedSetName, setAppliedSetName] = useState<string | null>(null);

  /* async data caches */
  const [pokemonCache, setPokemonCache] = useState<Record<number, Pokemon>>({});
  const [moveDetails, setMoveDetails] = useState<Record<string, Move>>({});
  const [meta, setMeta] = useState<{ species: string; state: MetaState; entry: SmogonSpeciesEntry | null }>({
    species: '',
    state: 'idle',
    entry: null,
  });

  /* ---------- decode a shared team from the URL hash ---------- */
  useEffect(() => {
    if (!sharedPayload) return undefined;
    let alive = true;
    void decodeTeamHash(sharedPayload).then((shared) => {
      if (alive && shared) {
        setTeam(shared);
        setFocusedId(shared.slots.find((s) => s.pokemon)?.id ?? null);
      }
    });
    return () => {
      alive = false;
    };
  }, [sharedPayload]);

  /* ---------- draft autosave (debounced) ---------- */
  const draftTimer = useRef<number | null>(null);
  useEffect(() => {
    if (!team) return undefined;
    if (draftTimer.current) window.clearTimeout(draftTimer.current);
    draftTimer.current = window.setTimeout(() => saveDraft(team), 350);
    return () => {
      if (draftTimer.current) window.clearTimeout(draftTimer.current);
    };
  }, [team]);

  /* ---------- hydrate PokéAPI payloads for filled slots ---------- */
  useEffect(() => {
    if (!team) return;
    let alive = true;
    const missing = filledSlots(team)
      .map((s) => s.pokemonId!)
      .filter((id) => !pokemonCache[id]);
    if (!missing.length) return;
    Promise.all(
      missing.map(async (id) => {
        try {
          return [id, await getPokemon(id)] as const;
        } catch {
          return null;
        }
      }),
    ).then((rows) => {
      if (!alive) return;
      setPokemonCache((prev) => {
        const next = { ...prev };
        for (const r of rows) if (r) next[r[0]] = r[1];
        return next;
      });
    });
    return () => {
      alive = false;
    };
  }, [team, pokemonCache]);

  /* ---------- hydrate move details (coverage analysis) ---------- */
  useEffect(() => {
    if (!team) return;
    const slugs = new Set<string>();
    for (const s of filledSlots(team)) for (const m of s.moves) if (m && !moveDetails[m]) slugs.add(m);
    if (!slugs.size) return;
    let alive = true;
    Promise.all(
      [...slugs].map(async (slug) => {
        try {
          return [slug, await getMove(slug)] as const;
        } catch {
          return null;
        }
      }),
    ).then((rows) => {
      if (!alive) return;
      setMoveDetails((prev) => {
        const next = { ...prev };
        for (const r of rows) if (r) next[r[0]] = r[1];
        return next;
      });
    });
    return () => {
      alive = false;
    };
  }, [team, moveDetails]);

  /* ---------- team mutators ---------- */
  const patchTeam = useCallback((fn: (t: Team) => Team) => {
    setTeam((t) => (t ? { ...fn(t), updatedAt: Date.now() } : t));
  }, []);

  const patchSlot = useCallback(
    (slotId: string, patch: Partial<TeamSlot>) => {
      patchTeam((t) => ({
        ...t,
        slots: t.slots.map((s) => (s.id === slotId ? { ...s, ...patch } : s)),
      }));
    },
    [patchTeam],
  );

  const handlePick = useCallback(
    (slotId: string, pokemonSlug: string, pokemonId: number) => {
      patchSlot(slotId, {
        pokemon: pokemonSlug,
        pokemonId,
        nickname: null,
        moves: [null, null, null, null],
        item: null,
        ability: null,
        nature: null,
      });
      setExpandedId(slotId);
      setFocusedId(slotId);
      setAppliedSetName(null);
    },
    [patchSlot],
  );

  const handleRemove = useCallback((slotId: string) => {
    patchTeam((t) => ({
      ...t,
      slots: t.slots.map((s) => (s.id === slotId ? { ...emptySlot(), id: s.id } : s)),
    }));
    setExpandedId((cur) => (cur === slotId ? null : cur));
  }, [patchTeam]);

  const handleGameChange = useCallback(
    (vgId: string) => {
      patchTeam((t) => ({ ...t, versionGroup: vgId }));
    },
    [patchTeam],
  );

  const handleClear = useCallback(() => {
    patchTeam((t) => ({ ...t, slots: t.slots.map((s) => ({ ...emptySlot(), id: s.id })) }));
    setExpandedId(null);
    setAppliedSetName(null);
  }, [patchTeam]);

  const handleImport = useCallback(
    (imported: ImportedRunTeam) => {
      patchTeam((t) => ({
        ...t,
        name: imported.runName ? `${imported.runName}` : t.name,
        versionGroup: imported.versionGroup ?? t.versionGroup,
        slots: slotsFromImport(imported),
      }));
      setExpandedId(null);
      setFocusedId(null);
      setAppliedSetName(null);
    },
    [patchTeam],
  );

  const handleShare = useCallback(async () => {
    if (!team) return;
    try {
      const payload = await encodeTeamHash(team);
      const url = `${window.location.origin}${window.location.pathname}#team=${payload}`;
      window.history.replaceState(null, '', `#team=${payload}`);
      await navigator.clipboard.writeText(url);
      setShareState('copied');
      window.setTimeout(() => setShareState('idle'), 2200);
    } catch {
      /* clipboard blocked — the hash is already in the URL bar */
      setShareState('copied');
      window.setTimeout(() => setShareState('idle'), 2200);
    }
  }, [team]);

  const handleSave = useCallback(() => {
    if (!team) return;
    setTeams(saveTeam(team));
    saveDraft(team);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 2200);
  }, [team]);

  const handleApplySet = useCallback(
    (set: SmogonSet) => {
      const targetId = focusedId ?? team?.slots.find((s) => s.pokemon)?.id;
      if (!targetId) return;
      const moves: TeamSlot['moves'] = [null, null, null, null];
      set.moves.slice(0, 4).forEach((slot, i) => {
        if (slot[0]) moves[i] = slugify(slot[0]);
      });
      patchSlot(targetId, {
        moves,
        item: set.items[0] ?? null,
        ability: set.abilities[0] ?? null,
        nature: set.natures[0] ?? null,
        evs: smogonEvs(set.evs[0]),
        ...(set.level ? { level: Math.max(1, Math.min(100, set.level)) } : {}),
      });
      setAppliedSetName(set.name);
      window.setTimeout(() => setAppliedSetName(null), 2600);
    },
    [focusedId, team, patchSlot],
  );

  /* ---------- derived: legality, defense, coverage ---------- */
  const vg = versionGroupById(team?.versionGroup ?? 'scarlet-violet');

  const legalities = useMemo(() => {
    const map = new Map<string, SlotLegality>();
    if (!team) return map;
    for (const s of team.slots) {
      map.set(s.id, slotLegality(s, team.versionGroup, s.pokemonId != null ? pokemonCache[s.pokemonId] : undefined));
    }
    return map;
  }, [team, pokemonCache]);

  const defenseRows = useMemo(() => {
    if (!team) return defensiveSynergy([], vg.id);
    const members = filledSlots(team).map((s) => {
      const p = s.pokemonId != null ? pokemonCache[s.pokemonId] : undefined;
      const fallback = (p?.types.map((t) => t.type.name) ?? []) as PokemonType[];
      return {
        types: genTypesOf(team.versionGroup, s.pokemon!, fallback),
        ability: s.ability ? slugify(s.ability) : null,
      };
    });
    return defensiveSynergy(members, team.versionGroup);
  }, [team, pokemonCache, vg.id]);

  const coverage: CoverageResult = useMemo(() => {
    if (!team) return offensiveCoverage([], vg.id);
    const moves: TeamMove[] = [];
    for (const s of filledSlots(team)) {
      const p = s.pokemonId != null ? pokemonCache[s.pokemonId] : undefined;
      const fallback = (p?.types.map((t) => t.type.name) ?? []) as PokemonType[];
      const memberTypes = genTypesOf(team.versionGroup, s.pokemon!, fallback);
      for (const m of s.moves) {
        if (!m) continue;
        const d = moveDetails[m];
        if (!d || d.damage_class.name === 'status') continue;
        const type = d.type.name as PokemonType;
        moves.push({ name: m, type, stab: memberTypes.includes(type) });
      }
    }
    return offensiveCoverage(moves, team.versionGroup);
  }, [team, pokemonCache, moveDetails, vg.id]);

  const coverageLoading = useMemo(() => {
    if (!team) return false;
    for (const s of filledSlots(team)) {
      for (const m of s.moves) if (m && !moveDetails[m]) return true;
    }
    return false;
  }, [team, moveDetails]);

  /* ---------- meta snapshot (focused slot) ---------- */
  const focusSlot = useMemo(() => {
    if (!team) return null;
    return team.slots.find((s) => s.id === focusedId && s.pokemon) ?? filledSlots(team)[0] ?? null;
  }, [team, focusedId]);

  const focusSpecies = focusSlot?.pokemon ? displayName(focusSlot.pokemon) : null;

  useEffect(() => {
    if (!focusSpecies) return undefined;
    let alive = true;
    fetchMetaDump()
      .then((dump) => {
        if (!alive) return;
        setMeta({ species: focusSpecies, state: 'ready', entry: parseMetaEntry(dump, focusSpecies) });
      })
      .catch(() => {
        if (!alive) return;
        setMeta({ species: focusSpecies, state: 'unavailable', entry: null });
      });
    return () => {
      alive = false;
    };
  }, [focusSpecies]);

  /* derived meta display state (no sync setState in the effect above) */
  const metaState: MetaState = !focusSpecies ? 'idle' : meta.species === focusSpecies ? meta.state : 'loading';
  const metaEntry = focusSpecies && meta.species === focusSpecies ? meta.entry : null;

  const expandedSlot = team?.slots.find((s) => s.id === expandedId) ?? null;

  /* ---------- hub (no team being edited) ---------- */
  if (!team) {
    return (
      <div className="mx-auto max-w-content px-4 pb-20 pt-8 md:px-8">
        <SavedTeamsHub
          teams={teams}
          onNew={() => {
            const t = emptyTeam();
            setTeam(t);
            saveDraft(t);
          }}
          onLoad={(t) => {
            setTeam(t);
            saveDraft(t);
            setFocusedId(t.slots.find((s) => s.pokemon)?.id ?? null);
          }}
          onDelete={(id) => setTeams(deleteTeam(id))}
        />
      </div>
    );
  }

  /* ---------- builder ---------- */
  return (
    <div className="mx-auto max-w-content px-4 pb-20 pt-4 md:px-8">
      <HeaderStrip
        team={team}
        saved={savedFlash}
        shareState={shareState}
        onName={(name) => patchTeam((t) => ({ ...t, name }))}
        onGameChange={handleGameChange}
        onImport={() => setImportOpen(true)}
        onShare={() => void handleShare()}
        onSave={handleSave}
        onClear={handleClear}
        onOpenHub={() => {
          setTeams(loadTeams());
          saveDraft(team);
          setTeam(null);
        }}
        savedCount={teams.length}
      />

      {/* 6-slot card row — framer drag & drop reorder */}
      <Reorder.Group
        axis="x"
        values={team.slots}
        onReorder={(slots) => patchTeam((t) => ({ ...t, slots }))}
        className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-6"
        as="div"
      >
        {team.slots.map((slot, i) => (
          <Reorder.Item key={slot.id} value={slot} as="div" className="min-w-0">
            <SlotCard
              slot={slot}
              index={i}
              pokemon={slot.pokemonId != null ? pokemonCache[slot.pokemonId] : undefined}
              legality={legalities.get(slot.id) ?? { legal: true, reasons: [] }}
              versionGroup={team.versionGroup}
              expanded={expandedId === slot.id}
              focused={focusSlot?.id === slot.id}
              onPick={handlePick}
              onRemove={handleRemove}
              onToggleExpand={(id) => {
                setExpandedId((cur) => (cur === id ? null : id));
                setFocusedId(id);
              }}
              onFocus={(id) => setFocusedId(id)}
            />
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {/* per-slot expander */}
      <AnimatePresence>
        {expandedSlot && (
          <SlotEditor
            key={expandedSlot.id}
            slot={expandedSlot}
            pokemon={expandedSlot.pokemonId != null ? pokemonCache[expandedSlot.pokemonId] : undefined}
            versionGroup={team.versionGroup}
            legality={legalities.get(expandedSlot.id) ?? { legal: true, reasons: [] }}
            onPatch={patchSlot}
          />
        )}
      </AnimatePresence>

      {/* 3-panel analysis deck */}
      <AnalysisDeck
        defenseRows={defenseRows}
        coverage={coverage}
        coverageLoading={coverageLoading}
        metaState={metaState}
        metaEntry={metaEntry}
        metaFocusLabel={focusSlot?.pokemon ? displayName(focusSlot.pokemon) : null}
        onApplySet={handleApplySet}
        appliedSetName={appliedSetName}
      />

      <ImportRunDialog open={importOpen} onClose={() => setImportOpen(false)} onImport={handleImport} />
    </div>
  );
}
