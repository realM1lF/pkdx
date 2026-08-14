/* TeamBuilder — /team (team-builder.md, Option A full version)
 * 6-slot builder with GAME legality, synergy deck, Smogon meta, nuzlocke import.
 * State lives in src/lib/teambuilder.ts; this page wires data → components. */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { AnimatePresence, Reorder } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getMove, getPokemon } from '@/lib/pokeapi';
import {
  consumeTeamHash,
  decodeTeamHash,
  defaultMoveset,
  defensiveSynergy,
  deleteTeam,
  emptySlot,
  emptyTeam,
  evTotal,
  encodeTeamHash,
  fetchMetaDump,
  filledSlots,
  genHasMechanics,
  genTypesOf,
  importRunTeams,
  isLinkedTeam,
  loadDraft,
  loadTeams,
  moveTypeForCoverage,
  offensiveCoverage,
  onTeamsChange,
  parseMetaEntry,
  saveDraft,
  saveTeam,
  slotLegality,
  slotsFromImport,
  smogonEvs,
  versionGroupById,
  zeroEvs,
} from '@/lib/teambuilder';
import { getRunState, myPlayerId, updateEncounter } from '@/lib/nuzlocke-store';
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
import { teamToShowdown } from '@/lib/teambuilder-showdown';
import type { ShowdownImport } from '@/lib/teambuilder-showdown';
import AnalysisDeck from './teambuilder/AnalysisDeck';
import type { MatrixMember } from './teambuilder/AnalysisDeck';
import HeaderStrip from './teambuilder/HeaderStrip';
import ImportRunDialog from './teambuilder/ImportRunDialog';
import SavedTeamsHub from './teambuilder/SavedTeamsHub';
import ShowdownDialog from './teambuilder/ShowdownDialog';
import SlotCard from './teambuilder/SlotCard';
import SlotEditor from './teambuilder/SlotEditor';
import type { MetaState } from './teambuilder/SlotEditor';
import NuzToasts from './nuzlocke/Toasts';
import './teambuilder/teambuilder.css';

/** 'Swords Dance' → 'swords-dance' (PokéAPI move slug) */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function TeamBuilder() {
  const { t: t8n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const fromRunHandled = useRef(false);
  const viewRunHandled = useRef(false);
  /* shared-team hash is consumed once at mount — always opens as view-only */
  const [sharedPayload] = useState<string | null>(() => consumeTeamHash());
  const [viewMode, setViewMode] = useState(!!sharedPayload);
  const [team, setTeam] = useState<Team | null>(() => (sharedPayload ? null : loadDraft()));
  const [teams, setTeams] = useState<Team[]>(() => loadTeams());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [showdownTab, setShowdownTab] = useState<'closed' | 'export' | 'import'>('closed');
  const [shareState, setShareState] = useState<'idle' | 'copied'>('idle');
  const [savedFlash, setSavedFlash] = useState(false);
  const [appliedSetName, setAppliedSetName] = useState<string | null>(null);
  /* slot awaiting the Smogon EV auto-apply (armed by handlePick) */
  const autoEvSlotRef = useRef<string | null>(null);
  /* slot awaiting the default moveset (wild → assumed, armed by handlePick) */
  const autoMovesSlotRef = useRef<string | null>(null);

  useEffect(() => onTeamsChange(() => setTeams(loadTeams())), []);

  /* async data caches */
  const [pokemonCache, setPokemonCache] = useState<Record<number, Pokemon>>({});
  const [moveDetails, setMoveDetails] = useState<Record<string, Move>>({});
  const [meta, setMeta] = useState<{
    species: string;
    vgId: string;
    state: MetaState;
    entry: SmogonSpeciesEntry | null;
    format: string | null;
  }>({
    species: '',
    vgId: '',
    state: 'idle',
    entry: null,
    format: null,
  });

  /* ---------- decode a shared team from the URL hash (view-only) ---------- */
  useEffect(() => {
    if (!sharedPayload) return undefined;
    let alive = true;
    void decodeTeamHash(sharedPayload).then((shared) => {
      if (alive && shared) {
        setViewMode(true);
        setTeam(shared);
        setFocusedId(shared.slots.find((s) => s.pokemon)?.id ?? null);
      }
    });
    return () => {
      alive = false;
    };
  }, [sharedPayload]);

  /* ---------- draft autosave (debounced) — never for view-only ---------- */
  const draftTimer = useRef<number | null>(null);
  useEffect(() => {
    if (!team || viewMode) return undefined;
    if (draftTimer.current) window.clearTimeout(draftTimer.current);
    draftTimer.current = window.setTimeout(() => saveDraft(team), 350);
    return () => {
      if (draftTimer.current) window.clearTimeout(draftTimer.current);
    };
  }, [team, viewMode]);

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
      patchTeam((t) => {
        const prev = t.slots.find((s) => s.id === slotId);
        if (
          typeof patch.level === 'number' &&
          isLinkedTeam(t) &&
          t.linkedRunId &&
          prev?.encounterId
        ) {
          updateEncounter(t.linkedRunId, prev.encounterId, { level: patch.level });
        }
        return {
          ...t,
          slots: t.slots.map((s) => (s.id === slotId ? { ...s, ...patch } : s)),
        };
      });
    },
    [patchTeam],
  );

  const handlePick = useCallback(
    (slotId: string, pokemonSlug: string, pokemonId: number) => {
      if (team && isLinkedTeam(team)) return;
      patchSlot(slotId, {
        pokemon: pokemonSlug,
        pokemonId,
        nickname: null,
        moves: [null, null, null, null],
        item: null,
        ability: null,
        nature: null,
        evs: zeroEvs(),
      });
      /* EP0.3: arm the Smogon EV auto-apply for this slot (applied once the
       * meta entry for the freshly picked species resolves; stays 0 without a set) */
      autoEvSlotRef.current = slotId;
      /* arm the default moveset (applied once the PokéAPI payload resolves;
       * wild level-up set at the slot level, padded by the STAB heuristic) */
      autoMovesSlotRef.current = slotId;
      setExpandedId(slotId);
      setFocusedId(slotId);
      setAppliedSetName(null);
    },
    [patchSlot, team],
  );

  const handleRemove = useCallback((slotId: string) => {
    if (team && isLinkedTeam(team)) return;
    patchTeam((t) => ({
      ...t,
      slots: t.slots.map((s) => (s.id === slotId ? { ...emptySlot(), id: s.id } : s)),
    }));
    setExpandedId((cur) => (cur === slotId ? null : cur));
  }, [patchTeam, team]);

  /* copy a slot into the first free slot (keeps drag keys stable) */
  const handleDuplicate = useCallback(
    (slotId: string) => {
      if (team && isLinkedTeam(team)) return;
      patchTeam((t) => {
        const src = t.slots.find((s) => s.id === slotId);
        const dstIdx = t.slots.findIndex((s) => !s.pokemon);
        if (!src || dstIdx < 0) return t;
        const copy: TeamSlot = { ...src, id: t.slots[dstIdx].id, moves: [...src.moves], evs: { ...src.evs } };
        const slots = [...t.slots];
        slots[dstIdx] = copy;
        return { ...t, slots };
      });
    },
    [patchTeam, team],
  );

  /* Showdown paste import — replaces slots, keeps team name + game */
  const handleShowdownImport = useCallback(
    (result: ShowdownImport) => {
      if (team && isLinkedTeam(team)) return;
      patchTeam((t) => ({ ...t, slots: result.slots }));
      setExpandedId(null);
      setFocusedId(null);
      setAppliedSetName(null);
    },
    [patchTeam, team],
  );

  const handleGameChange = useCallback(
    (vgId: string) => {
      patchTeam((t) => ({ ...t, versionGroup: vgId }));
    },
    [patchTeam],
  );

  const handleClear = useCallback(() => {
    if (team && isLinkedTeam(team)) return;
    patchTeam((t) => ({ ...t, slots: t.slots.map((s) => ({ ...emptySlot(), id: s.id })) }));
    setExpandedId(null);
    setAppliedSetName(null);
  }, [patchTeam, team]);

  const handleImport = useCallback(
    (imported: ImportedRunTeam) => {
      patchTeam((t) => {
        if (isLinkedTeam(t)) return t;
        return {
          ...t,
          name: imported.runName ? `${imported.runName}` : t.name,
          versionGroup: imported.versionGroup ?? t.versionGroup,
          slots: slotsFromImport(imported),
        };
      });
      setExpandedId(null);
      setFocusedId(null);
      setAppliedSetName(null);
    },
    [patchTeam],
  );

  /* Open own linked team for edit */
  useEffect(() => {
    const runId = searchParams.get('fromRun');
    if (!runId || fromRunHandled.current) return undefined;
    fromRunHandled.current = true;
    const next = new URLSearchParams(searchParams);
    next.delete('fromRun');
    setSearchParams(next, { replace: true });
    let alive = true;
    void (async () => {
      try {
        const { ensureLinkedTeams, findLinkedTeam, ownedPlayerId, syncLinkedTeamRoster } = await import(
          '@/lib/nuzlocke-linked-teams'
        );
        const state = getRunState(runId);
        const pid = state ? ownedPlayerId(state) : myPlayerId(runId);
        if (state && pid) {
          ensureLinkedTeams(state);
          await syncLinkedTeamRoster(state, pid);
          const linked = findLinkedTeam(runId, pid);
          if (alive && linked) {
            setViewMode(false);
            setTeam(linked);
            saveDraft(linked);
            setFocusedId(linked.slots.find((s) => s.pokemon)?.id ?? null);
            return;
          }
        }
      } catch {
        /* fall through to snapshot import */
      }
      if (!alive) return;
      const imported = await importRunTeams(runId);
      if (!alive) return;
      const ready = imported.filter((t) => t.members.length > 0);
      if (ready.length === 1) handleImport(ready[0]);
      else if (ready.length > 0) setImportOpen(true);
    })();
    return () => {
      alive = false;
    };
  }, [searchParams, setSearchParams, handleImport]);

  /* View another player's party (read-only, not saved to vault) */
  useEffect(() => {
    const runId = searchParams.get('viewRun');
    const playerId = searchParams.get('player');
    if (!runId || !playerId || viewRunHandled.current) return undefined;
    viewRunHandled.current = true;
    const next = new URLSearchParams(searchParams);
    next.delete('viewRun');
    next.delete('player');
    setSearchParams(next, { replace: true });
    let alive = true;
    void (async () => {
      const { buildViewTeamFromParty, ownedPlayerId } = await import('@/lib/nuzlocke-linked-teams');
      const state = getRunState(runId);
      if (!state || !alive) return;
      /* if it's actually my player, open the editable linked team instead */
      if (ownedPlayerId(state) === playerId) {
        fromRunHandled.current = false;
        setSearchParams(new URLSearchParams({ fromRun: runId }), { replace: true });
        return;
      }
      const view = await buildViewTeamFromParty(state, playerId);
      if (!alive || !view) return;
      setViewMode(true);
      setTeam(view);
      setFocusedId(view.slots.find((s) => s.pokemon)?.id ?? null);
    })();
    return () => {
      alive = false;
    };
  }, [searchParams, setSearchParams]);

  const handleShare = useCallback(async () => {
    if (!team) return;
    try {
      const payload = await encodeTeamHash(team);
      /* share URL opens view-only for recipients — do not leave #team in our bar */
      const url = `${window.location.origin}${window.location.pathname}#team=${payload}`;
      await navigator.clipboard.writeText(url);
      setShareState('copied');
      window.setTimeout(() => setShareState('idle'), 2200);
    } catch {
      setShareState('copied');
      window.setTimeout(() => setShareState('idle'), 2200);
    }
  }, [team]);

  const handleSave = useCallback(() => {
    if (!team || viewMode) return;
    const next = saveTeam(team);
    setTeams(next);
    saveDraft(team);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 2200);
  }, [team, viewMode]);

  const handleSaveCopy = useCallback(async () => {
    if (!team) return;
    const { detachAsCopy } = await import('@/lib/nuzlocke-linked-teams');
    const copy = detachAsCopy(team);
    setViewMode(false);
    setTeam(copy);
    const next = saveTeam(copy);
    setTeams(next);
    saveDraft(copy);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 2200);
  }, [team]);

  const linked = !!team && isLinkedTeam(team);
  const linkedRunState = linked && team.linkedRunId ? getRunState(team.linkedRunId) : null;
  const linkedForeign =
    linked &&
    !!team.linkedRunId &&
    !!team.linkedPlayerId &&
    !!linkedRunState &&
    myPlayerId(team.linkedRunId) !== team.linkedPlayerId;
  const linkedReadOnly = viewMode || linkedForeign;

  const handleApplySet = useCallback(
    (set: SmogonSet, slotId?: string) => {
      if (linkedReadOnly) return;
      const targetId = slotId ?? focusedId ?? team?.slots.find((s) => s.pokemon)?.id;
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
    [focusedId, team, patchSlot, linkedReadOnly],
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

  /* filled slots as matrix columns (gen-correct types, ability slugs) */
  const members: MatrixMember[] = useMemo(() => {
    if (!team) return [];
    return filledSlots(team).map((s) => {
      const p = s.pokemonId != null ? pokemonCache[s.pokemonId] : undefined;
      const fallback = (p?.types.map((t) => t.type.name) ?? []) as PokemonType[];
      return {
        slotId: s.id,
        pokemonId: s.pokemonId!,
        slug: s.pokemon!,
        types: genTypesOf(team.versionGroup, s.pokemon!, fallback),
        ability: s.ability ? slugify(s.ability) : null,
      };
    });
  }, [team, pokemonCache]);

  const defenseRows = useMemo(() => defensiveSynergy(members, vg.id), [members, vg.id]);

  const coverage: CoverageResult = useMemo(() => {
    if (!team) return offensiveCoverage([], vg.id);
    const moves: TeamMove[] = [];
    for (const s of filledSlots(team)) {
      const memberTypes = members.find((m) => m.slotId === s.id)?.types ?? [];
      for (const m of s.moves) {
        if (!m) continue;
        const d = moveDetails[m];
        if (!d || d.damage_class.name === 'status') continue;
        const type = moveTypeForCoverage(team.versionGroup, m, d.type.name);
        if (!type) continue;
        moves.push({ name: m, type, stab: memberTypes.includes(type) });
      }
    }
    return offensiveCoverage(moves, team.versionGroup);
  }, [team, members, moveDetails, vg.id]);

  /* Showdown export text (regenerated on every team change) */
  const showdownText = useMemo(() => (team ? teamToShowdown(team) : ''), [team]);

  const hasMembers = members.length > 0;
  const canDuplicate = !!team && !linked && filledSlots(team).length < 6;

  const coverageLoading = useMemo(() => {
    if (!team) return false;
    for (const s of filledSlots(team)) {
      for (const m of s.moves) if (m && !moveDetails[m]) return true;
    }
    return false;
  }, [team, moveDetails]);

  /* ---------- meta snapshot (expanded slot, else focused) ---------- */
  const focusSlot = useMemo(() => {
    if (!team) return null;
    return team.slots.find((s) => s.id === focusedId && s.pokemon) ?? filledSlots(team)[0] ?? null;
  }, [team, focusedId]);

  const metaSlot = useMemo(() => {
    if (!team) return null;
    const expanded = expandedId ? team.slots.find((s) => s.id === expandedId && s.pokemon) : null;
    return expanded ?? focusSlot;
  }, [team, expandedId, focusSlot]);

  /* meta lookup key: the Smogon dump is keyed by EN species names — pass the
   * slug (parseMetaEntry de-slugifies), never the localized display name */
  const focusSpecies = metaSlot?.pokemon ?? null;
  const versionGroup = team?.versionGroup;

  useEffect(() => {
    if (!focusSpecies || !versionGroup) return undefined;
    let alive = true;
    fetchMetaDump(versionGroup)
      .then(({ dump, format }) => {
        if (!alive) return;
        setMeta({
          species: focusSpecies,
          vgId: versionGroup,
          state: 'ready',
          entry: parseMetaEntry(dump, focusSpecies),
          format,
        });
      })
      .catch(() => {
        if (!alive) return;
        setMeta({ species: focusSpecies, vgId: versionGroup, state: 'unavailable', entry: null, format: null });
      });
    return () => {
      alive = false;
    };
  }, [focusSpecies, versionGroup]);

  /* derived meta display state (no sync setState in the effect above) */
  const metaInSync = !!focusSpecies && !!versionGroup && meta.species === focusSpecies && meta.vgId === versionGroup;
  const metaState: MetaState = !focusSpecies ? 'idle' : metaInSync ? meta.state : 'loading';
  const metaEntry = metaInSync ? meta.entry : null;
  const metaFormat = metaInSync ? meta.format : null;

  /* EP0.3 — auto-apply the primary meta set's EV spread right after a pick.
   * Only when: the meta lookup resolved for THIS slot's species, the gen has
   * EVs, a spread exists, and the user hasn't touched the sliders meanwhile
   * (still all zero). Fully editable afterwards; stays 0 when no set exists. */
  useEffect(() => {
    const slotId = autoEvSlotRef.current;
    if (!slotId || !team) return;
    if (metaState !== 'ready' && metaState !== 'unavailable') return;
    autoEvSlotRef.current = null;
    const slot = team.slots.find((s) => s.id === slotId);
    if (!slot || slot.id !== focusSlot?.id || !slot.pokemon || slot.pokemon !== focusSpecies) return;
    if (!genHasMechanics(team.versionGroup).evs) return;
    if (evTotal(slot) !== 0) return;
    const set = metaEntry?.sets[0];
    const spread = set?.evs[0];
    if (!set || !spread || !Object.keys(spread).length) return;
    patchSlot(slot.id, { evs: smogonEvs(spread) });
    setAppliedSetName(set.name);
    window.setTimeout(() => setAppliedSetName(null), 2600);
  }, [team, metaState, metaEntry, focusSlot, focusSpecies, patchSlot]);

  /* default moveset right after a pick — resolves wild → assumed (STAB +
   * coverage heuristic) via defaultMoveset once the PokéAPI payload for the
   * slot is hydrated. Skipped when the user already set moves meanwhile;
   * fully editable afterwards (only replaces the empty default). */
  useEffect(() => {
    const slotId = autoMovesSlotRef.current;
    if (!slotId || !team) return;
    const slot = team.slots.find((s) => s.id === slotId);
    if (!slot?.pokemon || slot.pokemonId == null) return;
    if (slot.moves.some((m) => m)) {
      autoMovesSlotRef.current = null;
      return;
    }
    const p = pokemonCache[slot.pokemonId];
    if (!p) return; // payload still in flight — the hydrate effect re-triggers us
    autoMovesSlotRef.current = null;
    const vgId = team.versionGroup;
    const level = slot.level;
    let alive = true;
    void defaultMoveset(p, level, vgId).then((moves) => {
      if (!alive || !moves.length) return;
      patchTeam((t) => {
        const cur = t.slots.find((s) => s.id === slotId);
        /* user touched the moves meanwhile — keep their input */
        if (!cur || cur.moves.some((m) => m)) return t;
        const next: TeamSlot['moves'] = [null, null, null, null];
        moves.forEach((m, i) => {
          if (i < 4) next[i] = m;
        });
        return { ...t, slots: t.slots.map((s) => (s.id === slotId ? { ...s, moves: next } : s)) };
      });
    });
    return () => {
      alive = false;
    };
  }, [team, pokemonCache, patchTeam]);

  const expandedSlot = team?.slots.find((s) => s.id === expandedId) ?? null;

  /** First filled slot ≠ current slot — default versus opponent for VS link. */
  const versusOpponentBySlot = useMemo(() => {
    const map = new Map<string, number | null>();
    if (!team) return map;
    const filled = filledSlots(team);
    for (const slot of team.slots) {
      const other = filled.find((s) => s.id !== slot.id);
      map.set(slot.id, other?.pokemonId ?? null);
    }
    return map;
  }, [team]);

  useEffect(() => {
    if (!team) setTeams(loadTeams());
  }, [team]);

  /* Hub open: drop leftover foreign Nuzlocke teams (own-only vault) */
  useEffect(() => {
    if (team) return undefined;
    let alive = true;
    void import('@/lib/nuzlocke-linked-teams').then((m) => {
      m.repairAllLinkedTeams();
      if (alive) setTeams(loadTeams());
    });
    return () => {
      alive = false;
    };
  }, [team]);

  /* ---------- hub (no team being edited) ---------- */
  if (!team) {
    return (
      <div className="mx-auto max-w-content px-4 pb-20 pt-8 md:px-8">
        <SavedTeamsHub
          teams={teams}
          onNew={() => {
            const t = emptyTeam();
            setViewMode(false);
            setTeam(t);
            saveDraft(t);
          }}
          onLoad={(t) => {
            setViewMode(false);
            setTeam(t);
            saveDraft(t);
            setFocusedId(t.slots.find((s) => s.pokemon)?.id ?? null);
          }}
          onDelete={(id) => setTeams(deleteTeam(id))}
        />
        <NuzToasts />
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
        readOnly={linkedReadOnly}
        viewOnly={viewMode}
        onName={(name) => {
          if (linked || linkedReadOnly) return;
          patchTeam((t) => ({ ...t, name }));
        }}
        onGameChange={(vgId) => {
          if (linked || linkedReadOnly) return;
          handleGameChange(vgId);
        }}
        onImport={() => setImportOpen(true)}
        onShowdown={() => setShowdownTab(filledSlots(team).length ? 'export' : 'import')}
        onShare={() => void handleShare()}
        onSave={handleSave}
        onSaveCopy={() => void handleSaveCopy()}
        onClear={handleClear}
        onOpenHub={() => {
          if (!viewMode && team && filledSlots(team).length > 0) {
            setTeams(saveTeam(team));
          } else {
            setTeams(loadTeams());
          }
          if (!viewMode) saveDraft(null);
          setViewMode(false);
          setTeam(null);
        }}
        savedCount={teams.length}
      />

      {/* 6-slot card row — framer drag & drop reorder (locked for linked teams) */}
      <Reorder.Group
        axis="x"
        values={team.slots}
        onReorder={(slots) => {
          if (linked) return;
          patchTeam((t) => ({ ...t, slots }));
        }}
        className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-6"
        as="div"
      >
        {team.slots.map((slot, i) => (
          <Reorder.Item key={slot.id} value={slot} as="div" className="min-w-0" drag={!linked}>
            <SlotCard
              slot={slot}
              index={i}
              pokemon={slot.pokemonId != null ? pokemonCache[slot.pokemonId] : undefined}
              legality={legalities.get(slot.id) ?? { legal: true, reasons: [] }}
              versionGroup={team.versionGroup}
              versusOpponentId={versusOpponentBySlot.get(slot.id) ?? null}
              moveDetails={moveDetails}
              canDuplicate={canDuplicate}
              rosterLocked={linked}
              readOnly={linkedReadOnly}
              expanded={expandedId === slot.id}
              focused={focusSlot?.id === slot.id}
              onPick={handlePick}
              onRemove={handleRemove}
              onDuplicate={handleDuplicate}
              onToggleExpand={(id) => {
                setExpandedId((cur) => (cur === id ? null : id));
                setFocusedId(id);
              }}
              onFocus={(id) => setFocusedId(id)}
            />
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {/* per-slot expander (read-only for foreign multi linked teams) */}
      <AnimatePresence>
        {expandedSlot && (
          <SlotEditor
            key={expandedSlot.id}
            slot={expandedSlot}
            pokemon={expandedSlot.pokemonId != null ? pokemonCache[expandedSlot.pokemonId] : undefined}
            versionGroup={team.versionGroup}
            legality={legalities.get(expandedSlot.id) ?? { legal: true, reasons: [] }}
            readOnly={linkedReadOnly}
            onPatch={patchSlot}
            metaState={metaState}
            metaEntry={metaEntry}
            metaFormat={metaFormat}
            appliedSetName={appliedSetName}
            onApplySet={(set) => handleApplySet(set, expandedSlot.id)}
          />
        )}
      </AnimatePresence>

      {/* analysis deck — or a guidance empty state until the first pick */}
      {hasMembers ? (
        <AnalysisDeck
          versionGroup={team.versionGroup}
          members={members}
          defenseRows={defenseRows}
          coverage={coverage}
          coverageLoading={coverageLoading}
        />
      ) : (
        <div className="tb-panel mt-4 flex flex-col items-center gap-3 border-dashed px-6 py-10 text-center">
          <span className="tb-micro-gold">{t8n('tb.empty.title')}</span>
          <p className="max-w-[420px] text-[12px] leading-relaxed text-tx-secondary">{t8n('tb.empty.body')}</p>
          <div className="flex flex-wrap justify-center gap-2">
            <button type="button" onClick={() => setImportOpen(true)} className="tb-btn">
              {t8n('tb.importFromRun')}
            </button>
            <button type="button" onClick={() => setShowdownTab('import')} className="tb-btn tb-btn-primary">
              {t8n('tb.empty.ctaShowdown')}
            </button>
          </div>
        </div>
      )}

      <ImportRunDialog open={importOpen} onClose={() => setImportOpen(false)} onImport={handleImport} />
      <ShowdownDialog
        open={showdownTab !== 'closed'}
        initialTab={showdownTab === 'closed' ? 'export' : showdownTab}
        exportText={showdownText}
        onClose={() => setShowdownTab('closed')}
        onImport={handleShowdownImport}
      />
      <NuzToasts />
    </div>
  );
}
