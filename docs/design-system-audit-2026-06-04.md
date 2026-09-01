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
3. ~~**Migrate `fontSize` + `breakpoints` to `@m-next/tokens`.**~~ **✅ Done 2026-08-31** (commit `d788ff7`). Added as clean semantic scales, **not** a verbatim port: `fontSize` xs:12 / sm:14 / md:16 / lg:20 / xl:24 / 2xl:32 / 3xl:40 / 4xl:48, `breakpoints` sm:481 / md:768 / lg:1024 / xl:1200 / 2xl:1440. Naming follows the existing spacing scale; values are numbers, not px strings. **Decision:** the legacy nested object in `@m-next/styles` was left in place. It carries three namespaces (`legacy` / `dtp` / `caption`) and half-pixel values (10.5px, 15.75px, 19.25px, 26.25px) — porting it verbatim would move that mess into the token package. The 6 consumers (`grid`, `input-area`, `menu`, `styles`, `text`, `typeography`) keep working; the legacy object is deprecated by disuse, not by a breaking migration. **New finding — breakpoint drift:** `styles/src/device.js` holds *three* inconsistent breakpoint sets in one file. `getBreakpoint()` bands off 600/960/1280/1960, the `size` map uses 481/768/1024/1200/1440, and `breakpointNames` is xs..xl where `size` is sm..2xl. The `size` map (the values actually used in media queries) is what moved to tokens; reconciling the other two changes behaviour and is left as its own task.
4. ~~**Add `iconSize` token + sweep `<SvgIcon size={N}>`.**~~ **✅ Done 2026-08-31** (commits `d788ff7` + `9ff091f`). Token: `2xs`:8 / `xs`:12 / `sm`:16 / `md`:20 / `lg`:24 / `xl`:32. Swept **75 literals across 41 files in 24 packages**. **This was not "tiny scope"** — the real surface was 133 numeric `size` props across 74 files in 33 packages, spanning 13 distinct values (6, 8, 10, 12, 14, 16, 18, 20, 24, 32, 36, 40, 48). **Decision:** exact matches only. Every literal replaced already sat precisely on a scale step, so no icon changed size; snapping off-scale values to the nearest step would have moved ~25 icons with no design review. Not swept: 33 literals in `ai-prompt`, `criteria-builder`, `layout-canvas`, deprecated `tabs-v2` (agreed out of scope), plus the 16 off-scale ones below. `@m-next/tokens` added as a dependency to 11 packages that now import it. **New finding — a possible missing scale step:** the 16 off-scale literals look intentional, not sloppy. `size={14}` clusters on form-field validation icons (`input:316`, `debouncedInput:385`, `phone-input:170`, `radio-button:186`, `validation:54`), `size={10}` on small affordances (`calendar`, `dropdown`, `search-input`, `stepper`, `toggle`), `size={18}` on grid cell edit/read icons (`EditMode:281,298`, `ReadMode:369,400`), plus `size={40}` (`grid/CardColumn:174`) and `size={48}` (`radio-button/IconRadioButton:24`). Whether the scale needs a step between 12 and 16 is a **design question**, not a cleanup.
5. **Add `gaps` block to `registry.json`.** Lists envelope-incomplete components, token-drift packages, packages without stories.
6. ~~**`fontWeight` numeric literal sweep.**~~ **✅ Done 2026-08-31** (commit `141441b`). Swept **29 instances across 20 packages** — 400→`normal`, 500→`medium`, 600→`semibold`, 700→`bold`. All mapped exactly onto existing tokens, so nothing renders differently. First actual use of the `fontWeight` token in component code; it shipped with the token package but had no consumers. **Count correction:** the audit's 41 included 5 in test files/snapshots (among them both `fontWeight: 900` values, which have no token and would have needed a new `black` weight for two assertions in grid's `classConverter` tests). Real source count was 36; 29 swept, 7 excluded in `criteria-builder` and deprecated `typeography` on the same grounds Top-10 #2 skipped `typeography`. No shadowing risk: all 20 files were checked for a local `fontWeight` binding first — none. No new dependencies needed.
7. **Land Phase 4 — `guidelines/` folder with 5 docs.** Codifies tacit knowledge in AGENTS.md.
8. **Promote `TaskList` (TodoCard pattern) to `@m-next/task-list`.** Real recurring Method pattern.
9. **Expand `compositions` to 10+.** Today: 3. Targets: `LoginScreen`, `SettingsPage`, `MultiStepWizard`, `ConfirmDestructive`, `EmptyDashboard`, `FilterAndSearch`.
10. **Consolidate / archive `AI-Best-Practices.md` and `agent_instructions/`.** Fold into AGENTS.md or move to `docs/archive/`.

---

## How to resume this work

**Last worked: 2026-08-31 / 09-01.** Audit Top-10 #1, #2, #3, #4 and #6 are done;
#5, #7, #8, #9, #10 remain. That roadmap is no longer the main thread — the work
has moved to driving the design system through a real prototype, which is
surfacing defects faster than the audit did.

---

### Where things stand

**`apps/prototype`** (`npx vite` → :3200) is the Method app prototype, now inside
this repo and version-controlled. Two views: **Foundation** (the m-next Home and
record screens) and **Invoice** (an unchanged m-one rebuild kept for comparison).
An **Inspect** toggle labels every component on screen with its name, category and
— for `Text` — its fontSize token, marking off-scale values with `!`.

**`apps/lab`** (:3100) is a minimal 4-file scaffold. It predates the discovery that
the prototype existed, and the two overlap. Worth deciding whether to keep both.

**Compositions** now ship Home, ContactDetail and CustomersList. Home was ported
from the prototype (2026-09-01).

---

### Next steps, in order

**1. Finish the contact detail page.** Items 1 and 2 are done (rail as a card with
real `SectionHeader`s; field rows on `FormSection`, which brought the Tags pill and
a native Show-more with it). Remaining:

  - **Avatar and Health Score circles** are hand-built `Box`es with literal 64/56px
    and border-radius. `AvatarPill` is a pill, not a standalone avatar — this is
    likely a genuine missing component rather than a call-site fix.
  - **Right pane**: the search row and the empty table should use real
    `SearchInput` and `EmptyState`.
  - The reference pairs Phone/Alt Phone and Lead Status/Lead Rating side by side;
    `FormSection` stacks every field full width. That is a FormSection question,
    not something to override from a call site.

**2. Fix the `ariaLabel` bug in the prototype.** `TodoRow` passes `ariaLabel` to
`Checkbox`, which has no such prop — it falls through `...rest` onto the raw
`<input>`, React warns, and the checkbox ends up unlabelled. The Home composition
already uses the correct `aria-label`; the prototype still has the broken version.

**3. Sweep Storybook after the `@m-next/text` heading fix.** Headings previously
accepted `fontSize`/`fontWeight` and discarded them, rendering at browser defaults.
They now honour their props, so **every heading in the workspace that passed
typography props has changed size and weight**. This is correct but it is a real
visual diff — worth a pass through heading-heavy components before showing anyone.

**4. Decide on the leftover token gaps** (all three block a true "no hardcoded
values" rule in the prototype):

  - **`lineHeight` has no px scale.** The token is unitless (tight/normal/relaxed),
    so ~39 `lineHeight="20px"` values in the prototype have nothing to migrate to.
    This is the largest remaining source of literals.
  - **No spacing step below 4px** — `mt="2px"` recurs.
  - **Layout constants** — `maxWidth: 1280`, flex bases, avatar sizes. Making these
    tokens means inventing a sizing scale.

**5. Then the audit leftovers**: #5 (`gaps` block in registry.json) and #10 (archive
`AI-Best-Practices.md` + `agent_instructions/`) are mechanical. #7 (`guidelines/`),
#8 (promote `TaskList`), #9 (grow compositions) need judgment.

---

### Design-system defects found by the prototype (2026-08-31)

Every one of these was invisible from reading the code and only appeared when the
component was actually rendered. This is the argument for the prototype existing.

| Fixed | What was wrong |
|---|---|
| `@m-next/hero-banner` | Reserved a fixed 200px image column even with no `imageSrc`, pushing text off the banner's left edge for every text-only hero |
| `@m-next/button-group` | Passed `showCaption` to `SvgIcon`, which has no such prop — it hit the DOM and React warned on every render with `isDropdown` |
| `@m-next/button-group` | The `size="small"` branch didn't zero the label's right padding for dropdowns (medium always did), leaving a 32px void beside an 8px chevron |
| `@m-next/text` | **Headings silently dropped `fontSize` and `fontWeight`.** `textStylesTitle` omitted both while the body `textStyles` carried them, so every H1–H6 rendered at browser defaults |
| `@m-next/container` | `padding` took only CSS strings while `Box` took tokens, so `padding="xl"` emitted invalid CSS and produced **no padding at all**, silently |

### Open gaps — not yet fixed

- **`SectionHeader` has no action slot.** Its registry `use` text promises
  "'Contact Details' with an Edit action on the right", but it only takes
  id/title/subTitle. Either add the slot or correct the text.
- **`Container.borderless={false}` is a double negative** meaning "has a shadow",
  and sits next to a separate `bordered` prop.
- **`Tabs` needs 4 lines of `contentStyle` override** to nest inside a Container.
  A `variant`/`borderless` prop would remove that from every nested usage.
- **No quick-action / icon-tile row primitive**, and **no to-do / task row
  component** — both are recognisable Method patterns (MethodUI has `TodoCard`)
  that compositions currently hand-build from raw `<button>`s.
- **`ButtonGroup` and `Button` use different variant vocabularies** —
  `primary|ghost|plain|calendarMenu` vs `primary|secondary|tertiary|ghost|link`.
- **`Checkbox` has no `ariaLabel` escape hatch**; labelling a `hideLabel` checkbox
  requires knowing `aria-label` passes through `...rest`.
- **`@m-next/image` silently rejects `data:` URIs** and substitutes its own
  placeholder, with no warning. Cost an iteration twice today.

### Standing notes

- The **strategy doc** for Ben/Paul/Alex predates the 100% component sprint and
  understates what has shipped.
- Two open questions from the token pass: does `iconSize` need a step between 12
  and 16 (`size={14}` and `size={18}` recur), and how should the three
  inconsistent breakpoint sets in `styles/src/device.js` be reconciled.

This document should be updated as work is completed — strike through or mark
items complete, add new findings, capture decisions about deferrals.
