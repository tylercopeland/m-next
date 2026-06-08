# m-next design system

**m-next** is the Method design system — a fork-in-place rehearsal of the legacy `m-one` library, where API cleanups, new components, and token work happen as reviewable commits that read like the eventual production PRs. NX monorepo, **84 packages** under `packages/` (≈75 component packages + 6 foundation packages), React 17 (pinned — Emotion + Syncfusion compat).

## Start here — canonical references

Before generating or changing UI code, read these in order:

1. **[`AGENTS.md`](./AGENTS.md)** — the canonical agent + human guide. The 3 rules, the component **Selection guide** (which component for which need), forbidden patterns, the standard Phase-3 envelope, composition patterns, and gotchas. **Read this first.**
2. **[`registry.json`](./registry.json)** — machine-readable catalog of all **77 components** across 9 categories (Foundation, Brand, Action, Display, Feedback, Form, Navigation, Overlay, Domain). Each entry has category, summary, variants, canonical Storybook story, and use / don't-use rules. Query it once at session start to orient.

Everything below is operational reference. If it conflicts with `AGENTS.md`, `AGENTS.md` wins.

## Quick start

```bash
npm install
npm run storybook    # Storybook → http://localhost:6007
npm test
```

## Key commands

| Task | Command |
|------|---------|
| Storybook | `npm run storybook` (:6007) |
| Build package | `npx nx build @m-next/[package]` |
| Test package | `npx nx test @m-next/[package]` |
| Test affected | `npm run affected-test` |
| Update snapshots | `npm run test-snapshot-update` |
| Lint fix | `npm run lint-fix` |
| Visual regression | `npm run chromatic` |
| Project graph | `npm run graph` |
| Clear NX cache | `npx nx reset` |

## Package layout

```
packages/[name]/src/
  index.js              # Export
  index.d.ts            # Public TS types
  [Name].jsx            # Component
  [Name].styles.jsx     # Emotion styles
  [Name].test.jsx       # Jest tests (many still reference legacy API — see below)
packages/[name]/stories/
  [name].stories.jsx    # Concrete usage examples
  [name].mdx            # Intent-contract docs
```

Foundation packages: `@m-next/{tokens, theme, layout, text}` plus the legacy `@m-next/styles` theme system the audit is migrating out of. Apps under `apps/` (`app-builder`, `action-editor`, `action-editor-copilot`, `email-public-pages`) are downstream consumers, not part of the design-system surface.

**Style rule:** use tokens, not hardcoded values — `padding: ${({ theme }) => theme.spacing.md}` (or `@m-next/tokens`), never `16px`.

## Working in this repo (Phase 3+)

- **Envelope when cleaning a package** — rename props with one-time `console.warn` soft-shims, fix the audit-flagged a11y gap, migrate hex → `@m-next/tokens.colors.*`, add `forwardRef` + `...rest` spread. Change the API surface only — don't restructure files, drop deps, or rename packages. See `AGENTS.md` → "Standard envelope" and a recently-cleaned package (e.g. `packages/datepicker/src/DatePicker.jsx`).
- **Storybook re-add** — after cleaning a package, add it to `M_NEXT_PACKAGES` in `.storybook/main.js`, then restart Storybook.
- **Tests are intentionally stale** — many cleaned packages have `*.test.jsx` + `__snapshots__/` referencing the legacy API. Test rewrites are a deferred sprint; don't fix them inline during a cleanup.
- **Commits** — one commit per cleanup; multi-package waves get a single "Phase 3 wave: X (Y packages)" commit. Branch `main`; push to `https://github.com/tylercopeland/m-next`.
- **Roadmap** — the live plan is `docs/design-system-audit-2026-06-04.md` (6 phases + Top 10 priority fixes).

## Gotchas

- **React 17 pinned** — cannot upgrade (Emotion/Syncfusion conflicts). React 18 is a future investigation, not a casual bump.
- **NX cache stale?** → `npx nx reset && npm install && npm run build`
- **Webpack OOM** → `NODE_OPTIONS=--max-old-space-size=4096`
- **Deprecated packages** — `@m-next/typeography` → `@m-next/text`, `@m-next/tabs-v2` → `@m-next/tabs`. They fire a one-time console warning; migrate, don't suppress.

## Deep docs

- `.claude/glossary.md` — widget codes
- `.claude/dependency-map.md` — package dependencies
- `.claude/project-structure.md` — workspace layout
- `.claude/skills/test-runner/SKILL.md` — test runner skill
