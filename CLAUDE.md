# M-One Component Library

React component library for Method platform. 50+ packages in NX monorepo.

## Quick Start

```bash
npm install && npm run build    # Setup
npm run storybook               # Component dev
npm test                        # Run tests
```

## Architecture

```
apps/
  app-builder/        # WYSIWYG designer (CORE)
  action-editor/      # Legacy AngularJS + React
packages/
  button, grid, chart, dropdown, datepicker...  # 50+ components
  runtime-interface/  # Backend↔frontend translation (CRITICAL)
  types/              # Widget type definitions (CRITICAL)
  styles/             # Shared theme system
```

## Key Commands

| Task | Command |
|------|---------|
| Build package | `npx nx build @m-next/[package]` |
| Test package | `npx nx test @m-next/[package]` |
| Test affected | `npm run affected-test` |
| Update snapshots | `npm run test-snapshot-update` |
| Lint fix | `npm run lint-fix` |
| Clear cache | `npx nx reset` |

## Component Pattern

```
packages/[name]/src/
  index.js              # Export
  [Name].jsx            # Component
  [Name].styles.jsx     # Emotion styles
  [Name].test.jsx       # Jest tests
```

**Style rule:** Use theme tokens, not hardcoded values:
```javascript
padding: ${({ theme }) => theme.spacing.md};  // NOT 16px
```

## Adding New Control

1. Define type in `packages/types/src/lookups/widgetTypes.jsx`
2. Create control class in `apps/app-builder/.../control-classes/`
3. Create translation in `packages/runtime-interface/src/controls/`
4. Create wrapper in `apps/app-builder/.../component-wrappers/`
5. Register in `component-wrappers/index.js`
6. Create property editor in `apps/app-builder/.../editors/`

## Critical Areas (Do Not Break)

- `packages/runtime-interface/` - All widget rendering depends on this
- `packages/types/` - Widget type definitions
- `apps/app-builder/src/common/services/` - Redux state, RTK Query

## Gotchas

- **React 17 pinned** - Cannot upgrade (Emotion/Syncfusion conflicts)
- **NX cache stale?** → `npx nx reset && npm install && npm run build`
- **Jest console errors** → Mock console or fix the error
- **Webpack OOM** → `$env:NODE_OPTIONS="--max-old-space-size=4096"`
- **Git hooks broken?** → `git config core.hooksPath .githooks`
- **Visual regression** → `npm run chromatic`
- **DO NOT run nx/npx commands in WSL** — NX does not work in this WSL environment. Do not attempt to run builds, tests, or any nx commands. The user will run tests manually on the Windows side.

## Best Practices

- Edit existing files over creating new ones
- Use functional components with PropTypes
- Co-locate tests: `Component.test.jsx`
- Theme tokens only, no hardcoded colors/spacing
- Test coverage: 80% branches, 100% functions

## Deep Documentation

- Widget codes: `.claude/glossary.md`
- Package dependencies: `.claude/dependency-map.md`
- Project structure: `.claude/project-structure.md`
- Test runner skill: `.claude/skills/test-runner/SKILL.md`
