# Unova cartographer brief (Black/White)

Do NOT touch Hoenn/Johto/Sinnoh files. No commit. No GYM_ACE. Humilau stays postGame.

## ADD nodes (order 57–66, interpolate x/y, never 0,0)

| id | locationSlug | nameDe | label | kind | postGame | edges |
|---|---|---|---|---|---|---|
| ns-castle | ns-castle | Schloss von N | N's Castle | dungeon | no | unova-victory-road land |
| cold-storage | cold-storage | Tiefkühlcontainer | Cold Storage | dungeon | no | driftveil-city land |
| mistralton-cave | mistralton-cave | Panaero-Höhle | Mistralton Cave | dungeon | no | unova-route-6 land |
| challengers-cave | challengers-cave | Höhle der Schulung | Challenger's Cave | dungeon | **yes** | unova-route-13 land |
| driftveil-drawbridge | driftveil-drawbridge | Marea-Zugbrücke | Driftveil Drawbridge | special | no | route-5 land AND driftveil-city land |
| tubeline-bridge | tubeline-bridge | Zylinderbrücke | Tubeline Bridge | special | no | route-8 land AND route-9 land |
| undella-bay | undella-bay | Bucht von Ondula | Undella Bay | special | no | undella-town water AND abyssal-ruins water |
| abyssal-ruins | abyssal-ruins | Unterwasserruine | Abyssal Ruins | dungeon | no | undella-bay water |
| black-city | black-city | Schwarze Stadt | Black City | city | no | marvelous-bridge land |
| white-forest | white-forest | Weißer Wald | White Forest | special | no | marvelous-bridge land |

## DELETE edges (required)

- unova-route-5 → driftveil-city
- unova-route-8 → opelucid-city
- unova-route-9 → unova-route-11

KEEP: route-8 → moor-of-icirrus, marvelous-bridge → route-15, opelucid → route-9, opelucid → route-11.

Do not change aspertia/humilau/routes 19–23 postGame flags.

## Geo

10 new keys in unova-geo.json. version/image stay black-2. 1:1.

## Tests

New describe `unova remaining map data`. Do not rewrite `unova BW vs B2W2`. Pin challengers-cave postGame true, ns-castle postGame falsy, deleted edges gone, new edges present.

## Items

See cartographer prompt. Skip empty arrays. Skip keys: aspertia cluster, routes 19–23, black-city, white-forest (no overworld balls). Striaton: KEEP Cut, REMOVE dusk-ball and oran-berry, then APPEND gym TM etc.
