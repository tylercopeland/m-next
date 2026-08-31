# Method prototype

A working Method app you can edit, built entirely out of real `@m-next` design-system
components. Change a file, save, see it in the browser.

## Run it

```bash
cd /Users/tyler/method          # the outer workspace
npm install                     # first time only
cd m-next/apps/prototype
npx vite                        # → http://localhost:3200
```

## What you're looking at

The **VIEW** control in the top-left switches between two screens:

| View | What it is |
|------|-----------|
| **Foundation** *(m-next)* | The Method Home screen — sidebar, insights, to-dos, quick actions. Built from ~45 m-next components. **This is the one to prototype in.** |
| **Invoice** *(m-one)* | The same kind of screen rebuilt in the legacy m-one library, for comparison. Read-only reference — you shouldn't need to touch it. |

On the Foundation view there's also an **Inspect** toggle. Turn it on and every component
on screen is labelled with its name and category, with a live count of how many m-next
components are rendered. Useful for seeing what a screen is actually made of.

## Where to edit

```
src/App.jsx             view switcher + inspect toggle — rarely needs changing
src/AppMNext.jsx        THE FOUNDATION SCREEN — edit this one
src/AppInvoiceMOne.jsx  the m-one comparison screen — leave alone
src/_stubs/             fakes that let legacy m-one components run outside the real app
```

`AppMNext.jsx` is one long file on purpose — everything is in one place, so you can read
top to bottom and change things without hunting across a component tree.

## The rules

**1. Use real components. Don't hand-roll HTML.**
If a component exists for the job, use it — even if its API is awkward. The friction is
useful signal about the design system. The exception is layout: `Box`, `Stack`, `Inline`,
`Flex`, `Divider` from `@m-next/layout` are the styled-divs you *should* reach for.

**2. Import by name.**

```jsx
import { Button } from '@m-next/button';
import { Box, Stack, Inline } from '@m-next/layout';
```

Never the default export, even where it works. This is Rule 4 in the design system's
`AGENTS.md`.

> In this file you'll see `import { Button as RawButton }` — that's so the screen can wrap
> each component in the Inspect labeller. Follow the same pattern if you add a component
> you want Inspect to see; otherwise a plain named import is fine.

**3. Use tokens, not hardcoded values.**

```jsx
import { spacing, colors, fontSize, iconSize } from '@m-next/tokens';
```

## Finding a component

The design system lives at `/Users/tyler/method/m-next`. Three ways in:

```bash
# Browse everything visually
cd /Users/tyler/method/m-next && npm run storybook     # → localhost:6007

# What components exist, and how do I call one?
jq '.components[] | select(.name=="InsightCard")' m-next/registry.json

# Everything in a category
jq -r '.components[] | select(.category=="Form") | .name' m-next/registry.json
```

Each registry entry gives you the exact `import` line, the component's `props`, and a
`deprecatedProps` list. **Never use anything in `deprecatedProps`** — those props still
exist for backwards compatibility and mostly do nothing.

`m-next/AGENTS.md` is the fuller guide, including a selection table for picking between
similar components. It's written for AI agents but reads fine for people — point Claude at
it if you're prototyping with AI.

## Gotchas

- **A change didn't appear?** Hard-reload. Hot-reload through the linked design-system
  packages is occasionally stale, and a stale page looks exactly like a broken component.
- **React 17**, pinned. Not a casual upgrade — Emotion and Syncfusion both constrain it.

## Version control

This lives inside the **m-next** repo (`github.com/tylercopeland/m-next`), so your work is
committed and shareable. It used to sit in the outer Method checkout under `prototypes/`,
which was git-excluded — that's why it moved.

Commit from the m-next root:

```bash
cd /Users/tyler/method/m-next
git add apps/prototype && git commit -m "prototype: ..."
```
