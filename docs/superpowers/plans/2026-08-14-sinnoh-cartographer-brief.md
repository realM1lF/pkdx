# Sinnoh cartographer brief (Platinum)

Implement exactly this. No Hoenn/Johto edits. No commit. No empty item arrays.

## FIX existing nodes (`sinnoh.json`)

- `sinnoh-route-220` locationSlug → `sinnoh-sea-route-220`
- `sinnoh-route-223` locationSlug → `sinnoh-sea-route-223`
- `sinnoh-route-226` locationSlug → `sinnoh-sea-route-226`
- `sinnoh-route-230` locationSlug → `sinnoh-sea-route-230`
- Node **ids** stay `sinnoh-route-220` etc.
- Remove `postGame` from: `distortion-world`, `sinnoh-route-219`, `sinnoh-route-220`, `sinnoh-route-221`
- Keep `postGame: true` on fight/survival/resort-area, routes 224–230 (except 219–221), turnback-cave, stark-mountain, sendoff-spring (new)

## ADD nodes (order 63–75, kind as listed, interpolate x/y from neighbors, never 0,0)

| id | locationSlug | nameDe | label | kind | postGame | edges |
|---|---|---|---|---|---|---|
| lake-verity | lake-verity | See der Wahrheit | Lake Verity | special | no | sinnoh-route-201 land |
| oreburgh-gate | oreburgh-gate | Erzelingen-Tor | Oreburgh Gate | dungeon | no | sinnoh-route-203 land AND oreburgh-city land |
| old-chateau | old-chateau | Alte Villa | Old Chateau | dungeon | no | eterna-forest land |
| floaroma-meadow | floaroma-meadow | Auen von Flori | Floaroma Meadow | special | no | floaroma-town land AND fuego-ironworks land |
| fuego-ironworks | fuego-ironworks | Feurio-Hütte | Fuego Ironworks | dungeon | no | floaroma-meadow land AND sinnoh-route-205 water |
| trophy-garden | trophy-garden | Pokémon-Landgut | Trophy Garden | special | no | sinnoh-route-212 land |
| galactic-hq | galactic-hq | Team Galaktik Zentrale | Galactic HQ | dungeon | no | veilstone-city land |
| valor-lakefront | valor-lakefront | Kühnheitsufer | Valor Lakefront | special | no | 213, 214, 222, lake-valor all land |
| lake-valor | lake-valor | See der Kühnheit | Lake Valor | special | no | valor-lakefront land |
| acuity-lakefront | acuity-lakefront | Stärkeufer | Acuity Lakefront | special | no | sinnoh-route-217 land AND lake-acuity land |
| lake-acuity | lake-acuity | See der Stärke | Lake Acuity | special | no | acuity-lakefront land |
| sendoff-spring | sendoff-spring | Scheidequelle | Sendoff Spring | special | yes | 214 land AND turnback-cave land |
| snowpoint-temple | snowpoint-temple | Blizzach-Tempel | Snowpoint Temple | dungeon | yes | snowpoint-city land |

Keep existing 203–oreburgh-city and 214–turnback-cave. Do **not** delete pastoria–222.

## Geo

Add 13 keys to `sinnoh-geo.json`. version/image stay diamond. Interpolate from neighbor fractions. 1:1 node↔geo. Do not move solaceon-ruins (optional, skip).

## Tests (`regions.test.ts`)

- New describe `sinnoh remaining map data`: 13 ids, nameDe, locationSlug, kind, orders, edges, snowpoint-temple/sendoff-spring postGame true
- Update `sinnoh platinum postGame`: distortion-world, route 219/220/221 must **not** be postGame. Keep fight-area etc. true.
- Assert sea slugs on 220/223/226/230
- Geo 1:1 for sinnoh (like johto/hoenn)

## Items (`items-sinnoh.json`)

APPEND to existing 6 keys (do not delete current rows). Add new keys from Fact JSON in the agent prompt. Rules:

- Skip `sinnoh-route-220` (OK-empty)
- Skip `sendoff-spring` items (OK-empty, node still ADD)
- No empty arrays
- `carbos` not `carb-os`
- TM29 Psychic **only** on `sinnoh-route-210`, not 211
- SecretPotion only on `valor-lakefront`
- Notes `(Platinum)` on new/appended rows
- Full English names; TM moveSlug required
- Cap ~12 per node
- item-consistency.test.ts is kanto/hoenn only — do not expand unless it already includes sinnoh
