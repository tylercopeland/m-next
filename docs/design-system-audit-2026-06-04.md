# m-next Design System Audit & Refactor Roadmap

**Date**: 2026-06-04
**Status**: Audit complete. No code changes made. Ready to start implementation in priority order.
**Author**: Tyler Copeland (with Claude)

## Purpose

Audit the m-next design system against the goal of evolving it into a structured, AI-friendly design system that supports:

1. Design tokens
2. React components
3. Storybook stories
4. Usage guidelines
5. Claude/project instructions
6. Reusable layout and product patterns

This document captures the current state, identifies gaps, and proposes a phased plan for getting there.

---

## 1. Current structure

**Workspace shape**: NX monorepo, 84 packages under `packages/`, applications under `apps/`, root-level docs.

**Component locations**: `packages/<name>/src/` — each cleaned package follows the convention `Name.jsx` (or `.tsx`), `Name.styles.{jsx,js,ts}`, `Name.test.jsx`, `index.js`, `index.d.ts`. 170 component source files across all packages. Packages are flat — no nested taxonomy at the filesystem level (taxonomy lives in `.storybook/main.js` story titles and `registry.json`).

**Token locations**: `packages/tokens/src/` is the canonical primitive scale (`colors`, `spacing`, `radius`, `shadow`, `z-index`, `transition`, `line-height`, `font-weight`, `css-variables`). `packages/styles/src/` is the legacy theme infrastructure inherited from m-one — contains `light-theme.js`, `dark-theme.js`, `fun-theme.js`, `method-theme.js`, plus `font-sizes.js`, `device.js` (breakpoints), `color-helper.js`, `class-converter.js`, `design-tokens.js`. **Two parallel systems coexist** — `@m-next/tokens` is the modern primitive scale, `@m-next/styles` is the legacy theme system that `@m-next/theme` reads.

**Storybook setup**: present and active at `.storybook/`. `main.js` lists 25 explicit packages in `M_NEXT_PACKAGES`; 103 `.stories.*` files total; 56 `.mdx` intent contracts (~67% per-package coverage); `preview.js` injects `styles.min.css` for legacy theme compatibility and adds an `overflow: auto` override to fight legacy CSS.

**Docs / instructions**: `CLAUDE.md` (90 lines, **stale — still references "M-One Component Library" and "50+ packages"**), `AGENTS.md` (404 lines, current and comprehensive with Selection guide + Forbidden patterns), `registry.json` (77 components catalogued), `README.md` (264 lines), `AI-Best-Practices.md` (27KB, generic — not m-next-specific). `agent_instructions/` contains only `TEST_RELEASE_INSTRUCTIONS.md`. `docs/` contains one PRD.

**Utility / helper files**: `packages/utilities/`, `packages/types/`, `packages/expression/`, `packages/runtime-interface/`, `packages/api-interface/` — these are infrastructure packages, not components.

---

## 2. Design token audit

| Category | Status | Where it lives | Gap |
|---|---|---|---|
| **Colors** | Good | `@m-next/tokens/colors` + `@m-next/styles/colors` (legacy) | Two parallel sources; ~80 hardcoded hex literals in component source files outside tokens |
| **Spacing** | Good | `@m-next/tokens/spacing` (8 values: `none/xs/sm/md/lg/xl/2xl/3xl`) | 224 hardcoded `padding`/`margin`/`gap` literals in component source — many are production-fidelity values that don't fit the scale |
| **Typography (font weight)** | Good | `@m-next/tokens/font-weight` (`normal/medium/semibold/bold`) | 41 numeric literals (`600`, `500`, `700`) in source — clean migration candidates |
| **Typography (line height)** | Partial | `@m-next/tokens/line-height` (`tight/normal/relaxed`) | Components use raw `lineHeight: '16px'`/`'20px'`/`'24px'` instead — the token scale doesn't cover the actual values used |
| **Typography (font size)** | Hardcoded / inconsistent | `@m-next/styles/font-sizes.js` (legacy nested object: `legacy`, `dtp`, `button`, etc.); **NOT in `@m-next/tokens`** | 24 raw `fontSize: '14px'` etc. literals in components; no clean scale exposed |
| **Radius** | Good | `@m-next/tokens/radius` (`none/sm/md/lg/xl/full`) | 60 raw `borderRadius` literals — about half are legitimate (`'50%'`, `999` for pills), half should migrate |
| **Shadows / elevation** | Good (defined) | `@m-next/tokens/shadow` (`none/sm/md/lg/xl`) | Defined but adoption is low — `Container`'s `borderless={false}` elevation, e.g., is hand-coded box-shadow in `Container.styles`, not `shadow.md` |
| **Borders** | Missing | — | No `border-width` scale, no `border-color` semantic tokens. Hairline borders are `1px solid <color>` everywhere |
| **Breakpoints** | Partial | `@m-next/styles/device.js` (`481/768/1024/1200/1440`); **NOT in `@m-next/tokens`** | Not exposed as part of the canonical token surface; some components use `getBreakpoint(width)` JS helper instead of CSS media queries |
| **Z-index** | Good | `@m-next/tokens/z-index` (`base/dropdown/sticky/modal/popover/toast`) | Adoption uneven — `Tooltip`, `Dialog`, `Drawer` reach for raw values |
| **Motion (duration)** | Good | `@m-next/tokens/transition` (`fast/normal/slow`) | Defined |
| **Motion (easing)** | Missing | — | No easing-curve tokens. Components use `ease`, `ease-in-out`, `120ms ease`, etc. inline |
| **Icon sizes** | Missing | — | Icons use raw `size={16}`, `size={20}`, `size={14}` numbers. No `iconSize.sm/md/lg` scale |
| **Chart colors** | Missing | — | `@m-next/chart` configures Highcharts series colors with hex literals (12 in chart.jsx alone) — no `chartColor[0..N]` scale |

**Summary**: foundational primitives (color, spacing, radius, shadow, z-index, transition, font-weight) are solid. Typography (font size) has a legacy nested structure that hasn't been migrated. Borders, motion easing, icon sizes, and chart palette are real gaps. Adoption of existing tokens is uneven — 491 raw hex + 350 other literals across component source.

---

## 3. Component audit

77 components catalogued in `registry.json` across 9 categories:

| Category | Count | Examples | Health |
|---|---|---|---|
| Foundation | 9 | `Box`, `Stack`, `Inline`, `Flex`, `Divider`, `Text`, `SvgIcon`, `ThemeProvider`, `Tokens` | Solid. All Phase-3 cleaned. Token usage consistent. |
| Brand | 1 | `MethodLogo` | Solid. URL-referenced asset; envelope-compliant. |
| Action | 3 | `Button`, `ButtonGroup`, `Link` | Solid. `tertiary` variant added 2026-06-03. |
| Display | 15 | `Card`, `Badge`, `Pill`, `Container`, `Grid`, `Chart`, `InsightCard`, `Accordion`, `Image`, `Map`, `AvatarPill`, `SectionHeader`, `Scrollbar`, `Carousel`, `TagWidget` | Mixed. `InsightCard` only got envelope spread on 2026-06-04. `Chart`, `Grid` envelope partial. |
| Feedback | 9 | `Alert`, `Banner`, `Toast`, `Tooltip`, `Spinner`, `Skeleton`, `EmptyState`, `HeroBanner`, `AppActivationBanner` | Solid. Hex drift in `EmptyState`. |
| Form | 21 | `Input`, `Checkbox`, `Toggle`, `Select`, `MultiSelect`, `Dropdown`, `DatePicker`, `PhoneInput`, `Address`, `FormField`, `FormSection`, `Caption`, `ValidationMessage`, `Attachments`, `Signature`, `ColorPicker`, `HtmlEditor`, `SegmentedControl`, `SearchInput`, `RadioButton`+`IconRadioGroup` | Largest category, most envelope gaps. `Input`, `Dropdown`, `DatePicker`, `Toggle`, `RadioButton` are forwardRef but missing `...rest`. |
| Navigation | 9 | `Tabs`, `Sidebar`, `AppBar`, `Breadcrumbs`, `Pagination`, `Stepper`, `Menu`, `SectionHeader`, `ChipsFilter` | `Tabs` forwardRef but no `...rest`. `Sidebar` got fidelity fixes 2026-06-02. |
| Overlay | 4 | `Dialog`, `Drawer`, `Popover`, `Menu`, `AppActivationOverlay` | Mostly solid. |
| Domain | 6 | `Calendar`, `ColorPicker`, `Signature`, `HtmlEditor`, `Map`, `SyncWidget` | Wave-4 inherited; envelope partial. Carry the hex/spacing drift. |

**Envelope-compliance gaps (22 packages — forwardRef present, but no `...rest` spread)**:

Closed (12): ~~`dropdown`~~ ✅, ~~`grid`~~ ✅, ~~`input`~~ ✅, ~~`tabs`~~ ✅, ~~`text`~~ ✅ (2026-06-07); ~~`address-lookup`~~ ✅, ~~`chips-filter`~~ ✅, ~~`color-picker`~~ ✅, ~~`field-block`~~ ✅, ~~`pill-tab`~~ ✅, ~~`svg-icon`~~ ✅, ~~`toggle`~~ ✅ (2026-06-08). Remaining (9, "careful" — multi-component/domain): `calendar`, `chart`, `chart-drilldown`, `criteria-builder`, `datepicker`, `html-editor`, `image`, `radio-button`, `signature`. Skipped: `typeography` (deprecated).

These are the components most likely to silently swallow `style`, `className`, `data-*`, and `aria-*` props passed by consumers — same gap that bit `InsightCard` on 2026-06-04.

**Counts**:
- 98 / 170 component source files use `forwardRef`
- 60 / 170 have a `...rest` spread (envelope complete)
- 75 / 170 use `warnOnce` (soft-shim active)
- 84 / 170 set `displayName`
- 67 / 170 use `aria-*` attributes
- 54 / 170 use `role=`
- 27 / 170 have explicit focus handling

**Product-specific patterns (in compositions)**: 3 — `CustomersList`, `ContactDetail`, `Dashboard` in `packages/compositions/stories/`. Shipped 2026-06-03.

**Duplication / merge / rename candidates**:
- `@m-next/typeography` — deprecated alias for `@m-next/text` (kept for warning visibility; remove eventually).
- `@m-next/tabs-v2` — deprecated alias for `@m-next/tabs` (same pattern).
- `@m-next/pill-tab` exports `SegmentedControl` — naming feels disconnected. Either rename to `@m-next/segmented-control` or canonicalize the export name.
- `@m-next/chips-filter` exports both `ChipsFilter` and `FilterChips` aliases — pick one.
- `Sidebar.Group` (collapsible navigation group) vs `Accordion` — currently distinct intents, well-documented in AGENTS.md.

**Recommendations**:
- **Stay**: 70+ components — the cleaned majority.
- **Merge / rename**: `pill-tab` → expose as `@m-next/segmented-control`. Drop the `FilterChips` alias.
- **Remove (eventually)**: `typeography`, `tabs-v2`, `gallery` (placeholder), `kit` (historical).
- **Promote**: `TaskList` / `TodoCard` (MethodUI screen-level pattern, recurring on home/onboarding/setup) is a candidate for promotion as `@m-next/task-list`.

---

## 4. Storybook readiness

**Current state**: 103 `.stories.*` files for 84 packages — ~1.2 stories per package on average. 56 `.mdx` intent contracts (~67% coverage). `tags: ['autodocs']` is set globally in `preview.js` so every Default story gets an auto-doc page.

**Per-package story file counts (top of distribution)**:
- `ai-prompt`: 7
- `chips-filter`: 5
- `radio-button`, `datepicker`: 4
- `compositions`: 3 + Overview MDX
- Most others: 1–2

**Packages with zero stories** (correct — infrastructure, not UI): `api-interface`, `expression`, `layout-canvas`, `runtime-interface`, `styles`, `types`, `utilities`.

**Coverage gaps — story types missing across the catalog**:

| Story type | Coverage | Notes |
|---|---|---|
| Default / canonical | High | Most packages have a Default following "match Method production defaults" rule. |
| Variants | Medium | Button, Pill, Badge have variant stories. ~40% of variant-capable components don't expose a Variants story. |
| Sizes | Low | Button has Sizes; most other size-variant components don't. |
| States (default / hover / focus / active / disabled) | Low | Rarely demonstrated in stories. |
| Loading | Low | `Skeleton`, `Spinner`, `InsightCard` have loading. Most form components don't. |
| Error | Low | `Input`, `FormField`, `Alert` show error. Most others don't. |
| With icons | Medium | Button has `WithIcons`; many components could add this. |
| Responsive | Very low | Almost no stories demonstrate mobile/desktop responsive behavior. |
| Real product usage (composition) | Just-started | 3 compositions; many more product patterns exist. |

**Concrete story recommendations**:

For every variant- or size-capable component:
- `Default`, `Variants`, `Sizes`, `States`, `Disabled`, `Loading`, `WithIcons`, `Composition`

For form components specifically:
- `Empty`, `Filled`, `WithError`, `WithCaption`, `Readonly`, `Disabled`, `Required`

For overlays (Dialog, Drawer, Popover):
- `Open`, `Closed`, `WithFooter`, `LongContent` (scroll), `DestructiveConfirmation`

For data displays (Grid, Chart, InsightCard):
- `WithData`, `Empty`, `Loading`, `Error`, `FilteredView`

---

## 5. AI-readiness audit

**What exists and works**:
- `AGENTS.md` (404 lines) — comprehensive: rules, selection guide with 7 category decision tables, forbidden patterns, taxonomy, envelope spec, deprecated packages, composition patterns, gotchas. **High-quality canonical reference.**
- `registry.json` (77 components + 3 compositions + 9 categories) — machine-readable catalog at workspace root. Each entry has `name`, `package`, `category`, `summary`, optional `variants`, `use`/`dontUse` rules, `story` path. **The single best AI-orientation artifact.**
- 56 per-package `.mdx` intent contracts — many are well-written (see `packages/accordion/stories/accordion.mdx` for the canonical style).
- Predictable folder structure — `packages/<name>/src/Name.jsx + Name.styles.jsx + index.js`.
- Clear naming — PascalCase component exports, kebab-case package names.
- Storybook story title convention — `m-next/<Category>/<Name>` or `m-next/Components/<Category>/<Name>`.

**What's stale or partial**:
- `CLAUDE.md` is **stale** — still says "M-One Component Library", "50+ packages", references `apps/app-builder/`, doesn't mention `registry.json`, `AGENTS.md`, or any of the cleaned design system work. Should be a thin pointer to AGENTS.md and registry.json.
- `AI-Best-Practices.md` (27KB) is generic AI-coding guidance, not m-next specific. Confusing for an agent landing in the repo to know which doc is canonical.
- No per-package `AGENTS.md` (intentionally deferred — task #38).
- `agent_instructions/` is a folder with only one TEST_RELEASE doc — looks like a stub.
- `docs/` has one PRD — no consolidated "guidelines" or "patterns" docs (yet — this file lives there now).
- No `llms.txt` or similar emerging-standard pointer file at root.

**Concrete AI failure modes observed in real sessions**:
1. Picks wrong variant — was happening before AGENTS.md selection guide; now partially mitigated.
2. Misses style/prop forwarding gaps — couldn't override `InsightCard` height because component didn't spread `style`. The 22 envelope-gap components will produce the same failure.
3. Composes from `<div>` instead of m-next primitives — addressed by the Forbidden patterns table.

**The biggest AI-friendly wins remaining**:
1. Update `CLAUDE.md` to point to `AGENTS.md` and `registry.json`.
2. Land the per-package `AGENTS.md` for the 20+ most-used components.
3. Add a `gaps` section to `registry.json` listing the 22 envelope-incomplete components so AI doesn't trust their `style`/`className` forwarding.
4. Add an `llms.txt` at root as a one-line "for AI agents, start at AGENTS.md and registry.json" pointer.

---

## 6. Recommended target structure

**Don't restructure the filesystem.** The current structure is fine for the NX workspace model — what's missing is the index/documentation layer.

`packages/*` is the right place for individual components in an NX-managed npm workspace. Renaming or moving them would break thousands of `@m-next/*` imports throughout MethodUI, consumer apps, and downstream code. The "ideal structure" originally sketched is the *conceptual* shape — what's needed is a navigation layer that surfaces that conceptual structure without physically relocating packages.

**Map the proposed conceptual structure to the existing repo with a documentation layer**:

| Proposed | What it maps to today | What to add |
|---|---|---|
| `/design-system/tokens` | `packages/tokens/`, `packages/styles/` (legacy) | Already there. Consolidate font-size + breakpoints into `@m-next/tokens`. |
| `/design-system/guidelines` | `AGENTS.md` + scattered intent MDX | Add `/guidelines/` top-level folder with: `principles.md`, `accessibility.md`, `theming.md`, `composition.md`. |
| `/design-system/patterns` | `packages/compositions/` | Already in place. Add ~10 more patterns. |
| `/design-system/examples` | None | Add real production-pattern code samples. |
| `/components/ui` | `packages/<form-display-feedback>/` | Already there. Use `registry.json` category as the navigation index. |
| `/components/layout` | `packages/layout/`, `packages/container/` | Already there. |
| `/components/patterns` | `packages/compositions/` | Already there. |
| `/stories` | `packages/<name>/stories/*` | Already there. |
| `CLAUDE.md` | Stale; needs rewrite | Rewrite as thin pointer. |

**Proposed minimal-change physical structure**:
```
m-next/
├── AGENTS.md                ← canonical agent guide (current)
├── CLAUDE.md                ← REWRITE: 1-page pointer to AGENTS.md + registry.json
├── registry.json            ← machine-readable catalog (current)
├── llms.txt                 ← NEW: AI-tool entry pointer
├── guidelines/              ← NEW top-level folder
│   ├── principles.md
│   ├── accessibility.md
│   ├── theming.md
│   └── composition.md
├── packages/
│   ├── tokens/              ← existing primitive tokens
│   ├── theme/               ← existing theme provider
│   ├── styles/              ← legacy theme (mark deprecated; migrate font-size + breakpoints out)
│   ├── layout/              ← existing layout primitives
│   ├── compositions/        ← existing patterns
│   └── [70+ component packages]
└── .storybook/
```

This gives the conceptual structure intended — `tokens`, `guidelines`, `patterns`, `components` — without an Nx re-org that breaks the workspace.

---

## 7. Refactor roadmap

### Phase 1 — Stabilize tokens
- **Goal**: complete token coverage, eliminate raw literals in component source.
- **Files affected**: `packages/tokens/src/*`, `packages/styles/src/font-sizes.js` (migrate out), all component `.styles.{js,jsx}` files.
- **Tasks**:
  - Add `fontSize` token scale to `@m-next/tokens`.
  - Add `breakpoints` to `@m-next/tokens`.
  - Add `iconSize` token (sm: 14, md: 16, lg: 20, xl: 24).
  - Add `border` token (`width.hairline: 1`, `width.thick: 2`).
  - Add `motion.easing` token.
  - Add `chartPalette` token for `@m-next/chart` series colors.
  - Sweep ~30 components with hex drift.
  - Sweep 41 `fontWeight` numeric literals.
  - Sweep 60 `borderRadius` literals (skip legitimate `'50%'`/`999`).
- **Risks**: breaking visual changes when tokens replace literals. Mitigate via parallel before/after screenshots.
- **Done looks like**: zero raw hex / fontWeight / borderRadius in component `.styles` files (excluding `tokens/` itself and deprecated packages).

### Phase 2 — Normalize components (close envelope gaps)
- **Goal**: every cleaned component is fully envelope-compliant.
- **Files affected**: the 22 packages listed in Section 3.
- **Tasks**:
  - For each: add `className`, `style`, `...rest` spread to root rendered element.
  - Verify `ref` properly forwarded.
  - Add `data-mnext-component={name}` attribute for AI tools / inspect mode.
  - Add accessibility audit: target 130 / 170 components with `aria-*`.
  - Add `focus-visible` outlines to all interactive components (current: 27 / 170).
  - Document canonical export name in `registry.json` for ambiguous packages.
- **Risks**: enabling `...rest` may surface unknown DOM attribute warnings. Mitigate via emotion's `shouldForwardProp` filter on styled roots.
- **Done looks like**: 22 / 22 envelope gaps closed.

### Phase 3 — Expand Storybook coverage
- **Goal**: every component has the canonical story set, every category has a composition pattern.
- **Files affected**: `packages/<name>/stories/`, `packages/compositions/stories/`.
- **Tasks**:
  - Add `Variants`, `Sizes`, `States`, `Loading`, `Error`, `Disabled` stories where applicable.
  - Add 5–8 more compositions: `LoginScreen`, `SettingsPage`, `WizardFlow`, `EmptyDashboard`, `ConfirmDelete`, `MultiStepForm`, `FilterAndSearch`.
  - Add Storybook `Token` section with one story per category.
  - Set up visual regression (Chromatic or snapshot) on Default + Variants stories.
- **Risks**: 100s of stories — review burden and snapshot churn. Mitigate via parallel batches.
- **Done looks like**: 200+ stories total. Every component package has Default + Variants + States. 10+ compositions.

### Phase 4 — Add usage guidelines
- **Goal**: codify the principles that currently live tacitly in AGENTS.md.
- **Files affected**: new `guidelines/` folder.
- **Tasks**:
  - `guidelines/principles.md` — the 3 rules + design tokens are law.
  - `guidelines/accessibility.md` — keyboard, ARIA, focus, color contrast per category.
  - `guidelines/theming.md` — `useTheme()` vs `@m-next/tokens`, theme structure.
  - `guidelines/composition.md` — Sidebar compound API, Tabs onRenderTabContent, FormField patterns.
  - `guidelines/contributing.md` — Phase 3 envelope checklist for new packages.
- **Risks**: low.
- **Done looks like**: 5 markdown files. AGENTS.md cross-links to them.

### Phase 5 — Add Claude / project instructions
- **Goal**: AI tools get instant orientation.
- **Files affected**: `CLAUDE.md`, new `llms.txt`, `registry.json` (add `gaps` block).
- **Tasks**:
  - Rewrite `CLAUDE.md` as 1-page pointer to AGENTS.md + registry.json + guidelines/. Remove stale "M-One" references.
  - Add `llms.txt` at root.
  - Land per-package `AGENTS.md` for the top 25 components.
  - Add `knownGaps` block to `registry.json`:
    ```json
    "knownGaps": {
      "envelopeIncomplete": ["tabs", "input", "dropdown", ...],
      "tokenDriftHigh": ["sidebar", "chart", "tag-widget"],
      "noStories": ["api-interface", ...]
    }
    ```
  - Archive or fold `AI-Best-Practices.md` to reduce doc fragmentation.
- **Risks**: low.
- **Done looks like**: a fresh-cloned repo gives any agent instant orientation.

### Phase 6 — Clean up app usage
- **Goal**: production consumers (MethodUI primarily) shift from `@m-one/*` to `@m-next/*`.
- **Files affected**: MethodUI imports.
- **Tasks**:
  - Import-swap migration in MethodUI: `@m-one/<x>` → `@m-next/<x>`.
  - Identify pages composing patterns the design system now ships; refactor to use them.
  - Promote production-only screen patterns (TodoCard, QuickLinksContainer, SyncStatusButton) back into `@m-next/compositions` or proper packages.
  - Run visual regression on production screens.
- **Risks**: highest of all phases. Real production app. Mitigate with feature flags + parallel routes.
- **Done looks like**: MethodUI's `package.json` has zero `@m-one/*` deps.

---

## 8. Top 10 priority fixes

Ranked by impact on consistency + scalability + AI-friendliness.

1. ~~**Rewrite `CLAUDE.md`** as a 1-page pointer to `AGENTS.md` + `registry.json`.~~ **✅ Done 2026-06-07** — rewritten as a thin pointer leading with AGENTS.md + registry.json; corrected stale facts (title, 84 packages, real app list, real commands); dropped the m-one app-builder "Adding New Control" recipe.
2. **Close the 22 envelope gaps** (Phase 2). Highest-leverage technical debt. Causes silent prop-dropping. **✅ Done — 21/21 actionable (`typeography` skipped, deprecated).** Wave 1 (2026-06-07): `tabs`, `input`, `dropdown`, `text`, `grid`. Wave 2 (2026-06-08): `chips-filter`, `color-picker`, `field-block`, `pill-tab`, `svg-icon`, `toggle`, `address-lookup`. Wave 3 (2026-06-09): `radio-button` (4 controls), `calendar`, `chart`, `chart-drilldown`, `criteria-builder`, `datepicker` (5 components), `html-editor`, `image` (3 components), `signature`. Findings: (a) the "forwardRef present but no `...rest`" heuristic is imprecise — several packages already spread rest/otherProps; real gaps were a missing `className` or a `style`-clobbering bug. Sharper test: **do `className` AND `style` AND rest all reach the root?** (b) For third-party-wrapped components (Syncfusion Schedule, Highcharts, Froala, react-signature-canvas), the envelope goes on the component's OWN wrapper, never on the library element. (c) `chart-drilldown` forwards through `ChartExpandable → Chart → Container` (its root is a passthrough ErrorBoundary). Process note: keep subagents edit-only — running `nx build`/`lint-fix` reformatted ~149 dependency files to CRLF mid-wave; caught and reverted before commit.
3. **Migrate `fontSize` + `breakpoints` to `@m-next/tokens`.** Move from legacy nested structure in `@m-next/styles`.
4. **Add `iconSize` token + sweep `<SvgIcon size={N}>`.** Tiny scope, big payoff.
5. **Add `gaps` block to `registry.json`.** Lists envelope-incomplete components, token-drift packages, packages without stories.
6. **`fontWeight` numeric literal sweep.** 41 instances, 100% mechanical, zero design risk.
7. **Land Phase 4 — `guidelines/` folder with 5 docs.** Codifies tacit knowledge in AGENTS.md.
8. **Promote `TaskList` (TodoCard pattern) to `@m-next/task-list`.** Real recurring Method pattern.
9. **Expand `compositions` to 10+.** Today: 3. Targets: `LoginScreen`, `SettingsPage`, `MultiStepWizard`, `ConfirmDestructive`, `EmptyDashboard`, `FilterAndSearch`.
10. **Consolidate / archive `AI-Best-Practices.md` and `agent_instructions/`.** Fold into AGENTS.md or move to `docs/archive/`.

---

## How to resume this work

When picking this up, start with Top 10 #1 and #2 since they're the cheapest big-impact moves:

1. Rewrite `CLAUDE.md` first (30 min, removes the staleness landmine for any agent landing in the repo).
2. Begin Phase 2 envelope-gap sweep with the most-used 5 packages (`tabs`, `input`, `dropdown`, `text`, `grid`). Each is ~10 minutes and unlocks legitimate prop-forwarding for consumers.

After those, decide between depth (continue Phase 2 to all 22 packages) vs breadth (start Phase 1 token migration in parallel).

This document should be updated as work is completed — strike through or mark items complete, add new findings, capture decisions about deferrals.
