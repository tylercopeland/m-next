# Copilot Coding Agent – Repository Onboarding Guide

Purpose: Give you (the coding agent) enough high‑signal context to implement changes that build, test, lint, and integrate cleanly on the first attempt. TRUST these instructions; only search the codebase if something you need is not covered or an execution error indicates drift.

---

## 1. What This Repository Is
A monorepo containing:
- Modern React 17 component library (`packages/*` under the @m-one scope)
- Frontend applications (`apps/*`) including an app builder and related tools
- A large legacy + hybrid UI (`MethodUI/`) mixing React, legacy AngularJS/jQuery, and migration glue
- Some backend C#/.NET code (e.g., `Runtime.Core.*`) following layered patterns (Controller → Service → Repository/Provider)

Primary goal: Deliver reusable UI packages + platform applications with consistent styling (Emotion), theming (`@m-next/styles`), and testable build artifacts orchestrated by Nx.

Existing high-level principles & safety rules are in `.github/copilot-instructions.md` (core principles file). If a separate “Core Principles” file exists alongside this one, follow it first; otherwise this document is authoritative.

Languages & Frameworks:
- Frontend: React 17, TypeScript (select packages), JavaScript (legacy + some packages)
- Styling: Emotion
- Tooling: Nx 19, Webpack 5, Babel 7, Jest 29, Storybook 8, Chromatic
- Legacy: AngularJS 1.x, jQuery widgets (do not expand—only minimally touch if required)
- Backend: .NET (C#) with async patterns & Dapper style data access (only modify if necessary; follow layering)

Environment:
- Recommended Node.js: 18 LTS (Node 20 also typically works). If a mismatch causes install/build errors, switch to Node 18.
- Package manager: npm (workspaces). Use `npm install` (or `npm ci` in CI) at root only.

Repo size: Medium–large (multiple packages & apps). Rely on Nx for task scoping instead of manual traversal.

---

## 2. Repository Layout (Key Paths)
Root:
- `package.json` (scripts, workspaces, root dev deps)
- `nx.json` (cacheable operations, parallel settings, affected graph)
- `README.md` (component & app overview)
- `.github/` (this file + original principles file)
- `templates/` (scaffolding references: package & TypeScript variants)
- `packages/` (each reusable UI or utility package: `button`, `chart`, `layout-canvas`, `svg-icon`, `styles`, `utilities`, etc.)
- `apps/` (application surfaces: e.g., `app-builder/`)
- `MethodUI/` (legacy + hybrid React zone, with `public/react/...`, `jest.config*.js`, legacy scripts, Angular glue)
- Backend samples: e.g., `Runtime.Core.Actions/...` (C# models)

Important Configuration Files:
- Lint: Mixed usage of legacy `.eslintrc.js` plus modern `eslint.config.js` per package
- Testing: Root-level Jest config per domain (`MethodUI/jest.config.js`, `MethodUI/jest.config-runtime.js`, package-local `jest.config.js`)
- Storybook: `.storybook/` (not shown in excerpts but assumed present per README)
- Webpack: Each package has its own `webpack.config.js` (consistent pattern)
- Nx task orchestration: `nx.json`
- Git hooks: `.githooks/` activated via `preinstall` script

---

## 3. Core Scripts (Root `package.json`)
ALWAYS run `npm install` at root before any build/test after dependency or lockfile changes.

Key scripts:
- `npm run build` → `nx run-many -t build --parallel 14`
- `npm run test` → Jest across projects (`--maxWorkers=75%`)
- `npm run test-snapshot-update` → Refresh snapshots (use intentionally)
- `npm run test-storybook` → Storybook interaction tests (non-blocking fail tolerant)
- `npm run storybook` / `npm run build-storybook`
- `npm run lint` / `npm run lint-fix`
- `npm run prettify`
- `npm run chromatic` → Runs Storybook tests first then Chromatic (visual regression)
- `npm run affected-build|affected-test|affected-lint` → Scoped to changed projects
- Per-package/app (via Nx): `npx nx build <project>`, `npx nx test <project>`, `npx nx lint <project>`

Parallelism (14) is tuned; do not raise unless CPU availability verified. Nx caching is enabled—avoid manual dist cleaning unless needed (`npx nx reset` to drop cache).

---

## 4. Standard Workflow (Clean Machine / Fresh Clone)
1. `git clone <repo>` & `cd <repo>`
2. `npm install` (preinstall sets git hooks)
3. (Optional) Validate Node version: `node -v` (use 18 if issues)
4. Lint first for fast feedback: `npm run lint`
5. Run tests: `npm run test`
6. Build all: `npm run build`
7. (If UI changes) run `npm run storybook` locally and optionally `npm run chromatic`
8. Update snapshots (only if intended):
   - `npm run test-snapshot-update`
   - Re-run `npm run test` to ensure green
9. Stage & commit

---

## 5. Validation / Pre-PR Checklist
Always ensure before submitting changes:
- `npm run lint` passes with no new errors (warnings acceptable only if pattern already tolerated)
- `npm run test` passes; no console errors (jest-fail-on-console will fail tests)
- Coverage thresholds (package-specific overrides may require higher branch coverage)
- `npm run build` succeeds (verifies type & bundling correctness)
- If modifying shared UI: add/update Storybook stories + run `npm run chromatic` (when visual diffs relevant)
- Do NOT silently change public contracts (props, exported symbols) without backward-compatible strategy
- For backend C#: ensure async boundaries, no direct DB calls in controllers, keep DTO stability

---

## 6. Architectural Conventions (Delta Highlights)
Frontend:
- Functional React components, hooks only
- Emotion styling (`@emotion/react`, `@emotion/styled`)
- Theming flows through `@m-next/styles`
- Tests colocated: `Component.test.(js|jsx|ts|tsx)`
- Stable query selectors: prefer `data-testid` or deterministic IDs
- Avoid premature memoization; only optimize after measurement

Legacy Areas (AngularJS/jQuery):
- Touch minimally; do not introduce new AngularJS expansions
- When wrapping/bridging, keep changes additive & defensive

Backend (C#):
- Respect layering; no persistence in controllers
- Model updates additive (version or optional fields)
- Defensive null / input validation early
- Single logging responsibility per failure boundary

---

## 7. Adding or Modifying Code
New UI Component (Preferred Path):
1. Check for existing analogous component—extend if feasible.
2. Use template patterns in `templates/package` or `templates/package-typescript`.
3. Add stories in `stories/` folder and tests alongside source.
4. Export from package `src/index.(js|ts)`; maintain naming consistency.
5. Run: `npx nx build <package>` then `npx nx test <package>` then `npx nx lint <package>`.

Modifying Shared Utilities:
- Search for downstream usages (`npx nx graph` helps reveal dependents).
- Keep backward compatibility—add new function overloads or optional params.

Updating Legacy Code:
- Encapsulate new logic in modern React/utility layer where possible; leave legacy scaffolding stable.

Backend Model Changes:
- Add optional fields; do not rename existing serialized properties
- If enum changes, ensure JSON (StringEnumConverter) consumers tolerate new values

---

## 8. Key Config & Their Impact
- `package.json` root: Defines all orchestrated scripts (trust them vs re-implementing)
- `nx.json`: Cacheable targets (`build`, `test`, `lint`, etc.); altering can invalidate distributed cache
- Per-package `webpack.config.js`: Keep external peer declarations (e.g., react, emotion) unchanged to prevent bundle bloat
- Jest configs: Some raise coverage thresholds (e.g., `criteria-builder`, templates). If tests fail for coverage, expand test cases—do not lower thresholds silently
- ESLint variants: Some packages use modern flat `eslint.config.js`; others retain `.eslintrc.js`. Use the existing style for that package.

---

## 9. Common Failure Modes & Remedies
| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Install fails on optional native binary | Optional platform package | Re-run; usually safe to ignore warnings |
| Jest fails with console error | Code/path logs to console | Remove stray console.* or mock it |
| Snapshot mismatch | UI changed legitimately | Run `npm run test-snapshot-update` (intentional only) |
| Module not found (during build) | Missing peer dependency in package | Add correct peer (match versions used elsewhere) |
| Lint error: import extensions | Config expects extensionless imports | Remove explicit `.js/.ts(x)` in import path |
| React version mismatch warning | Added dependency pulling React 18 | Ensure peer dependency still resolves to React 17 |
| Storybook build fails on SVG | Misconfigured loader | Follow pattern from existing `webpack.config.js` (uses `@svgr/webpack`) |
| Coverage drop | New branches untested | Add branch-focused tests (both success & failure paths) |

---

## 10. Quick Command Reference
Scenario → Commands:

Fresh environment:
- `git clone <repo>`
- `cd <repo>`
- `npm install`

Rebuild after changing dependencies:
- `npm install` (or `npm ci` in CI environments)

Running all tests:
- `npm run test`

Refreshing snapshots:
- `npm run test-snapshot-update`

Running Storybook:
- `npm run storybook`

Building for production:
- `npm run build`

Linting code:
- `npm run lint`

Checking affected projects:
- `npm run affected:<command>` (e.g., `npm run affected:test`)

Single package iteration (example `svg-icon`):
- `npx nx build svg-icon`
- `npx nx test svg-icon`
- `npx nx lint svg-icon`

Visual regression (after UI changes):
- `npm run build-storybook`
- `npm run chromatic` (only after tests & lint pass)

Selective affected (after branch rebase):
- `npx nx affected -t lint,test,build`
- Example: `npx nx affected -t test --plain`

Reset Nx cache if anomalies:
- `npx nx reset`

---

## 11. Safety & Performance Notes
- Do not introduce new global state libraries (reuse existing context/hooks).
- Keep bundle externals intact (React, Emotion, icons).
- Avoid adding libraries if an internal utility exists.
	- Large data loops: prefer existing utilities or incremental rendering; measure first.
- Logging: avoid duplicate stack traces; log once per boundary.

---

## 12. When to Search
ONLY search the codebase if:
- A command here errors with an unknown project name
- You need a symbol path not listed and can’t infer from patterns
- A build/test failure cites a file not described above

Otherwise, TRUST these instructions to minimize redundant scanning.

---

## 13. Absolute “Always” Rules (Memorize)
- ALWAYS (fresh branch or after pulling lockfile changes): `npm install`, then `npm run lint`, then `npm run test`.
- ALWAYS add/update tests & stories for UI changes.
- NEVER reduce coverage thresholds or relax lint rules silently.
- NEVER modify public contracts or exported names without backward-compatible strategy.
- NEVER expand legacy AngularJS scope—wrap or adapt instead.

---

By following this guide plus the original principles file, you should achieve first-pass successful PRs with minimal exploratory overhead. Only deviate after measuring and documenting rationale.

Dependency additions:
- Prefer adding to the specific package `package.json`.
- Only add to root if shared dev tooling or all packages need it.
- After adding, run: `npm install && npx nx graph` to verify no unintended fan-out.
- Inspect for accidental React 18 pulls: `npm ls react`.

List all Nx projects:
`npx nx show projects`

Backend (.NET) touch policy:
- If not explicitly tasked, do not modify C# layers.
- If modifying models, prefer additive nullable fields.

| React 18 resolution appears in lock diff | New dep with peer ^18 pulled | Pin or replace dep, ensure `react` remains 17.0.2 |