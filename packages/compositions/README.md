# @m-next/compositions

Canonical multi-component screens — shadcn-style "blocks" for the Method design system.

Each composition is a real Method screen composed of real m-next components. They serve three audiences:

- **Product designers + PMs** — drop one into a prototype scaffold as a starting point, then adapt.
- **AI agents** — read these as canonical examples when generating m-next code (paired with the Selection guide in `AGENTS.md`).
- **Engineers** — reference for "how does Method want this pattern composed?"

## Available compositions

| Composition | What it demonstrates |
|---|---|
| `CustomersList` | List view: AppBar + Sidebar shell, tabs over a real `<Grid>` with view filters, activation banner above the content. |
| `ContactDetail` | Split view: left rail of fields/labels using `<FormField>` + `<Text>`, right pane with `<Tabs>` over an empty action area. |
| `Dashboard` | Overview screen: row of `<InsightCard>`s with deltas, recent-activity card, side-by-side metric and chart-shaped placeholders. |

## Conventions

- **Real components only.** No styled HTML stand-ins. If a composition needs a component that doesn't exist yet, that's an audit signal — file it instead of working around it.
- **Inline mock data.** Each composition's data lives in its own story file. Copy + tweak when adapting.
- **Single `ThemeProvider`** wrapping the rendered output. Storybook does not provide one globally; compositions own this themselves.
- **No business logic.** Buttons no-op. Form fields show static values. The composition is a structure example, not a working app.

## How to adapt a composition

1. Find the composition in Storybook under `m-next / Compositions / *`.
2. Open the corresponding `.stories.jsx` file.
3. Copy the rendered JSX into your prototype.
4. Replace mock data with your own.
5. Wire handlers (onClick, onChange) to your state.

See `AGENTS.md` (workspace root) for the Selection guide on picking the right component when adapting.
