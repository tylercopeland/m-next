# Agent guide — Method prototype

You are working in a **prototype**, not the design system. The design system lives at
`/Users/tyler/method/m-next` and is a separate git repo.

## Read these first

1. **`/Users/tyler/method/m-next/AGENTS.md`** — the canonical guide. The 4 rules, the
   component Selection guide, forbidden patterns, composition patterns.
2. **`/Users/tyler/method/m-next/registry.json`** — catalog of all 77 components. Each
   entry has the verified `import` line, `props`, and `deprecatedProps`.

It's ~6k lines — query it, don't read it whole:

```bash
jq '.components[] | select(.name=="Button")' /Users/tyler/method/m-next/registry.json
```

Those two files are authoritative. If anything here conflicts with them, they win.

## What to edit

| File | Role |
|------|------|
| `src/AppMNext.jsx` | The Foundation screen. **Almost all work goes here.** |
| `src/App.jsx` | View switcher + inspect toggle. Rarely needs changing. |
| `src/AppInvoiceMOne.jsx` | Legacy m-one comparison screen. **Don't modify** — its value is being an unchanged reference. |
| `src/_stubs/` | Fakes so legacy m-one components run outside the real app. Don't extend unless something actually fails to resolve. |

## Rules that matter here

- **Real components only.** Never substitute styled HTML for a component that exists. The
  exception is `@m-next/layout` primitives (`Box`, `Stack`, `Inline`, `Flex`, `Divider`),
  which *are* the right way to lay things out.
- **Named imports, always** — `import { Button } from '@m-next/button'`. Copy the `import`
  field from registry.json rather than guessing. Default exports mostly exist but are not
  the documented API.
- **Never use a prop listed in a component's `deprecatedProps`.** Many are silently
  ignored, so the bug shows up as "nothing happened", not an error.
- **Tokens, not literals** — `spacing`, `colors`, `fontSize`, `iconSize`, `radius` from
  `@m-next/tokens`.

## The Inspect wrapper

`AppMNext.jsx` imports components aliased as `Raw*` and wraps them:

```jsx
import { Button as RawButton } from '@m-next/button';
const Button = labeled(RawButton, 'Button', 'action');
```

That's what powers the Inspect overlay (labels every component on screen, counts
instances). If you add a component and want Inspect to see it, follow the same pattern.
A plain named import is fine otherwise — don't refactor existing ones away.

## If the design system is missing something

Say so rather than working around it locally. A missing component or an awkward API is a
finding about the design system, and this prototype exists partly to surface those. Don't
build a local stand-in and move on — that's how the previous kit layer accumulated, and it
was deleted.

## Don't

- Don't run `npm install` inside `/Users/tyler/method/m-next` — it churns that repo's
  dependency tree (adds ~86, removes ~9) and can break its Storybook. Install from the
  outer `/Users/tyler/method` workspace instead.
- Don't run `nx build` or `lint-fix` in m-next from an agent — it has rewritten dependency
  files to CRLF and produced 10,000-line phantom diffs. Verify by reading.
- Don't edit files under `m-next/packages/` to make a prototype work. Fix it here, or
  report the gap.
