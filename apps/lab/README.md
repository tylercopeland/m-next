# @m-next/lab

A prototyping sandbox for building Method experiences out of real `@m-next` components.

This exists so that design-system work can be exercised the way it will actually be used —
composed into screens — rather than only viewed one component at a time in Storybook.

## Run it

```bash
cd /Users/tyler/method        # the outer workspace
npm install                   # only needed the first time
cd m-next/apps/lab
npx vite                      # → http://localhost:3100
```

Edit `src/App.jsx` and the page hot-reloads.

> If a change doesn't appear, hard-reload the browser. HMR through symlinked
> workspace packages is occasionally stale, and a stale page is easy to misread
> as a broken component.

## How this resolves packages

`@m-next/*` packages ship **raw source** (`main: src/index.js`), not built output, so there is
no build step between editing a component and seeing it here. Vite compiles the package sources
directly. Three things in `vite.config.js` make that work:

1. **`m-next-jsx-loader`** — four package files ship JSX inside `.js` (`Scrollbar.styles.js`,
   `Sidebar.styles.js`, `use-theme.js`, `useToast.js`). esbuild picks its loader from the file
   extension and rejects JSX in `.js`. A global `.js -> jsx` loader isn't an option because
   m-next also ships `.ts`, so the transform is scoped to m-next package sources.
2. **`resolve.dedupe`** — one React instance, or hooks throw. m-next is pinned to React 17.
3. **`server.fs.allow`** — the packages live outside this app's directory.

## The one rule

**Import every component by name.** See `AGENTS.md` Rule 4 at the m-next root.

```jsx
import { Button } from '@m-next/button';
import { Box, Stack, Inline } from '@m-next/layout';
```

`registry.json` at the m-next root carries the exact, verified import line for all 77
components. Copy it rather than guessing — the `.d.ts` files are not a reliable guide to what
a package exports at runtime.

## What's in the starter

`src/App.jsx` is the canonical Method screen frame: `ThemeProvider` wrapping a `Sidebar` +
`AppBar` shell, with a body of `InsightCard`s and a bordered `Container`. Keep the shell, replace
the body. For fuller reference screens see the `@m-next/compositions` package
(Dashboard, ContactDetail, CustomersList) in Storybook.

## Useful

| Task | Command |
|------|---------|
| Storybook (all components) | `cd /Users/tyler/method/m-next && npm run storybook` (:6007) |
| Component catalog | `m-next/registry.json` |
| Agent guide | `m-next/AGENTS.md` |
