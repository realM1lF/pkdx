# Design System Reference — "Holo-Dex"

TOC: Tokens · Typography · Density (binding) · Motion · Sprite rules ·
Component conventions · Known rendering gotchas

Canonical sources in-repo: `design/design.md` (global system) and
`design/density-addendum.md` (BINDING for all surfaces). This file is the
practical summary for coding agents.

## 1. Tokens

- Background "void": `#05060A`; layered surfaces `surface1/surface2`;
  hairline borders (`border-hairline`, `hairline2`).
- 18 type-energy colors in `src/lib/types.ts` (`TYPE_COLORS`, incl. `rgb`
  triplets for glows). Type-colored glows are THE signature — use them on
  hover/selection.
- Gold (`gold`, `gold-soft`) = primary accent, focus, active states,
  hints. **Errors are never red**: shake animation + gold hint text.
- No blue-purple gradients, no saturated backgrounds, no Google-y look.
  Low-saturation, ample dark space, clear hierarchy.

## 2. Typography

- Display/headlines: Orbitron (`font-display`), sentence case (not CSS `uppercase`), tight leading.
- Pixel micro-labels: Press Start 2P via `.pixel-label` (8–10px). Caps only for
  intentional ALL-CAPS i18n (eyebrows, phase banners, tiny abbrev chips) — not
  via CSS `text-transform`, so place names and readable chrome stay sentence case.
- Body/UI: Space Grotesk (`font-sans`).
- Numbers in tables/stats: tabular feel; keep alignment right for numeric
  columns.

## 3. Density scale (BINDING — density-addendum.md)

- Dex cards ~180–210px tall; ≥6 columns at 1440px.
- Table rows 36–44px; list-view rows 44px.
- Micro-labels 8–10px; panel padding 16px; grid gap 16px (12-col layout).
- "More information in less space" is a user mandate. When in doubt,
  choose the denser option — but keep German string length in mind
  (`truncate`, `min-w-0` on flex children).

## 4. Motion

- framer-motion for in-view reveals (spring stiffness ~420 / damping ~30
  for micro-interactions; `EASE = [0.16, 1, 0.3, 1]` for tweens).
- GSAP ScrollTrigger for scroll-scrubbed effects; Lenis for smooth scroll.
- Respect `prefers-reduced-motion` (Lenis and cursor spotlight already
  gate on it — mirror that pattern).
- Hover everywhere: scale (1.02–1.1), type-colored glow, sprite wiggle.
- Inner scroll containers: `data-lenis-prevent` (see SKILL §3.6) plus the
  slim scrollbar classes (`.dx-scroll`, `.nz-slim-scroll`, `.tb-scroll`).

## 5. Sprite rules (design.md §10.2)

- Always `<Sprite>` component; era-aware (`gen5` animated for id ≤ 649,
  default otherwise), `pixelated` for pre-Gen-VI, fallback chain on error,
  silhouette skeleton while loading, descriptive alt text.
- Official-artwork for heroes; pixel GIFs for museums/tables.
- Cries play from the sprites repo audio; toggleable, never autoplay
  loudly.

## 6. Component conventions

- Panels: `Panel` wrapper with pixel-label eyebrow + display title;
  `bodyClassName` for layout control.
- Tables: `.dx-moves-table` classes own alignment — don't fight them with
  utility overrides (header alignment bug history: keep `text-right`
  variants in CSS, specificity matters).
- Chips/pills: `rounded-pill`, hairline border, `bg-surface2` or
  `bg-void/95` when floating over graphics.
- Icons: lucide-react, 12–20px, strokeWidth 1.75–2.

## 7. Known rendering gotchas (historical bugs — don't regress)

- **Maps CommandBar** is `sticky top-0` inside its deck (navbar offset is
  owned by `Layout`, not the page).
- **Fixed-height map deck** (`lg:h-[calc(100dvh-64px)]`) relies on Layout's
  scroll restoration; without it the deck appears "shifted up".
- **Evolution connectors** draw via `useInView(amount: 0.2)` + a 1.5s
  forced fallback; the old `-20% 0px` margin silently never fired (only
  arrowheads rendered). Condition chips sit in the gutter at the CHILD's
  row height (`midY: y2`) — midpoint placement collided with fan-out cards.
- **Category icons** (physical/special/status) are CSS masks with explicit
  colors — `<img>` of an SVG with `currentColor` renders black.
- **Firefox pointer capture:** only call `setPointerCapture` for non-mouse
  pointers on map canvas, or clicks get retargeted and node clicks die.
- **You-are-here / floating labels** need pill backgrounds + whitespace-
  nowrap, and row gaps ≥ 20px in branching evolution trees.
