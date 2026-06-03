<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- You have access to the Nx MCP server and its tools, use them to help the user
- When answering questions about the repository, use the `nx_workspace` tool first to gain an understanding of the workspace architecture where applicable.
- When working in individual projects, use the `nx_project_details` mcp tool to analyze and understand the specific project structure and dependencies
- For questions around nx configuration, best practices or if you're unsure, use the `nx_docs` tool to get relevant, up-to-date docs. Always use this instead of assuming things about nx configuration
- If the user needs help with an Nx configuration or project graph error, use the `nx_workspace` tool to get any errors
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.

<!-- nx configuration end-->

---

# m-next design system — agent guide

Read this BEFORE generating any UI code so you build with the right primitives.

This file is also read by humans pairing with an agent — it's the shared contract.

## What this is

**m-next** is the Method design system. ~75 React component packages plus 6 foundation packages, all in `packages/`. Built as a fork-in-place rehearsal for production PRs back to `m-one` (the legacy library). Storybook at `:6007` after `npm run storybook`.

**Stack:** React 17 (pinned — Emotion + Syncfusion compat). Emotion CSS-in-JS for styled components, inline styles for foundation layout primitives.

**Goal when building UI:** compose real m-next components. Don't reach for raw HTML + inline styles when an m-next component exists.

---

## The rules (READ THESE FIRST)

### Rule 1: No styled HTML stand-ins

When an m-next component exists for a use case, **use it** — even if the API is awkward. Don't compose `<button style={{...}}>` to substitute for `@m-next/button`, don't roll a `<table>` instead of `@m-next/grid`, don't wrap text in `<h3 style={{...}}>` instead of `<Text as="H3">`.

The exceptions are foundation layout primitives (`Box`, `Stack`, `Inline`, `Flex`, `Divider` from `@m-next/layout`) — those ARE the styled-HTML you should use. Anything more semantic (button, table, heading, card, banner, dropdown) goes through the real component.

If the real component's API is genuinely worse for the use case, file an issue / commit a note rather than working around it locally. The friction is the signal.

### Rule 2: Match Method production defaults

For components whose defaults exist (e.g., `Sidebar`, `AppBar`, `Banner`), the defaults match Method's production app, not a generic "design system" abstraction. Method is the primary consumer; abstracting away its aesthetic creates a Storybook that doesn't recognize itself.

When building a screen, mirror the production shape. One canonical `MethodStyle` story per net-new component — not exhaustive theoretical variants.

### Rule 3: API surface only — don't restructure

This applies inside Phase 3 cleanups. When updating an inherited component, change the API surface (rename props, soft-shim legacy aliases, fix a11y, migrate colors) — don't restructure files, drop deps, or rename packages. Smaller diffs = more credible production PRs.

---

## Category taxonomy

Every component lives in one of these buckets. Use the same taxonomy when choosing where to put new ones.

- **Foundation** — `@m-next/{tokens, theme, layout, text}` and similar. Primitives, not components. Used by everything.
- **Components / Action** — `Button`, `ButtonGroup`, `Link`. Things you click.
- **Components / Display** — `Card`, `Badge`, `Pill`, `Container`, `Grid`, `Carousel`, `InsightCard`, `Accordion`, `Image`, `Map`, `AvatarPill`, `SectionHeader`, `Scrollbar`, etc. Things that show content.
- **Components / Feedback** — `Alert`, `Banner`, `Toast`, `Tooltip`, `Spinner`, `Skeleton`, `EmptyState`, `HeroBanner`, `AppActivationBanner`. Things that communicate state.
- **Components / Form** — `Input`, `Checkbox`, `Toggle`, `Dropdown`, `DatePicker`, `Attachments`, `Signature`, `ColorPicker`, `HtmlEditor`, `Select`, `MultiSelect`, etc. Things that capture user data.
- **Components / Navigation** — `Tabs`, `Breadcrumbs`, `Stepper`, `Sidebar`, `AppBar`, `Pagination`. Things that move between views.
- **Components / Overlay** — `Dialog`, `Drawer`, `Popover`, `Menu`, `AppActivationOverlay`. Things that float above content.

Storybook story titles follow this exact path: `m-next/Components/{Category}/{ComponentName}`.

---

## Standard envelope (every Phase 3 cleaned component)

Every cleaned component carries this surface contract. When you read or write component code, expect:

```jsx
const Foo = forwardRef(function Foo(props, ref) {
  const {
    id: idProp,
    // ... real props
    forwardRef: legacyForwardRef,     // soft-shimmed legacy prop, warns once
    isV4Design: _isV4Design,          // documented ghost (silently ignored)
    isMobile: _isMobile,              // ghost — unless load-bearing
    legacyClass: _legacyClass,        // ghost
    displayAuto: _displayAuto,        // ghost
    compactStyle: _compactStyle,      // ghost
    hidden: _hidden,                  // ghost
    ...rest
  } = props;

  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    internalIdRef.current = `m-next-foo-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  if (legacyForwardRef) {
    warnOnce('foo-forwardRef-prop', '@m-next/foo: `forwardRef` prop is deprecated...');
  }

  // ... render
});

Foo.displayName = 'Foo';
```

**Implications for you:**
- `id` is always optional. Don't generate stub ids.
- All m-next components forwardRef. You can attach refs (drag handles, focus management, scroll measurement).
- Some "legacy-looking" props (`isV4Design`, `isMobile`, `legacyClass`, `compactStyle`) are silently accepted — passing them won't break, but also won't do anything. Don't rely on them unless the component's JSDoc explicitly says they're load-bearing.

---

## Deprecated packages (don't use these)

| Don't use | Use instead | Why |
|---|---|---|
| `@m-next/typeography` | `@m-next/text` | Same concept, V-prefixed alias from before Phase 3. Renders a console warning. |
| `@m-next/tabs-v2` | `@m-next/tabs` | The "V2" features were absorbed into the cleaned `tabs` during Phase 3. Renders a console warning. |

If you import from a deprecated package, you'll see a one-time `console.warn` on first render. Don't suppress it — migrate to the canonical replacement.

---

## Composition patterns

### App shell (a typical Method screen)

```jsx
<Stack gap="none" style={{ height: '100vh' }}>
  {/* optional trial / notification banner above the chrome */}
  <Banner status="informative" onClose={...}>...</Banner>

  <Box style={{ flex: 1, display: 'flex' }}>
    <Sidebar>
      <Sidebar.Header>...</Sidebar.Header>
      <Sidebar.Item icon={...} active>Customers</Sidebar.Item>
      <Sidebar.Divider />
      <Sidebar.Body>
        {/* more items */}
      </Sidebar.Body>
    </Sidebar>

    <Box style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <AppBar>
        <AppBar.Start>{/* page title */}</AppBar.Start>
        <AppBar.End>{/* user menu, actions */}</AppBar.End>
      </AppBar>

      {/* scrollable content */}
      <Box style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        {/* page content */}
      </Box>
    </Box>
  </Box>
</Stack>
```

### Data list view

```jsx
<Tabs
  tabList={[{ id: 'contacts', caption: 'Contacts' }, { id: 'companies', caption: 'Companies' }]}
  selectedTab={activeTab}
  onChange={setActiveTab}
  onRenderTabContent={() => (
    <Grid
      id="customers-grid"
      data={data}
      columns={columns}
      editable={false}
      selectable
      viewFilters={[...]}
      selectedView="..."
      showReload
      showViewFilter
      showInlineExport
      showShowHideColumns
      onRowClick={...}
    />
  )}
/>
```

Note: `@m-next/grid` has built-in search, view-filter, reload, columns-toggle, inline-export, pagination. **Don't** duplicate them with a custom header row above the Grid. Use the built-in chrome or extend Grid.

### Record detail with sections

```jsx
<Stack gap="lg">
  <SectionHeader title="Contact Details" subTitle="Visible to anyone with access." />
  <Stack gap="md">
    <FormField label="Name"><Input value={...} /></FormField>
    <FormField label="Email"><Input value={...} /></FormField>
  </Stack>
</Stack>
```

### Card with title and content

```jsx
<Container bordered padding="24px">
  <Stack gap="md">
    <Text as="H2" fontSize="18px" fontWeight={600}>Section heading</Text>
    {/* content */}
  </Stack>
</Container>
```

---

## Common gotchas

### Use `<Text as="H1"|"H2"|...>` not styled `<p>`
`@m-next/text` supports H1–H6 with proper heading semantics. Using a styled `<p>` for a heading is the no-styled-HTML-stand-in rule.

### Use `@m-next/text` props, not style shortcuts
Text takes `fontSize="14px"`, `fontWeight={600}`, `fontColor={...}`, `lineHeight="20px"`, `mt="0px"`, `mb="0px"`. Not `style={{ ... }}` shortcuts.

### Use `@m-next/grid` for data tables
Don't build a table with `Container` + `Box` + `Text` cells. Grid is the primitive. It takes `columns` (with `FieldTypeIds` from `@m-next/types`) and `data` (array of records). See the `Readonly` story for the canonical args.

### Use `@m-next/tabs` for tab bars, not custom buttons
Tabs takes `tabList: [{ id, caption }]`, `selectedTab`, `onChange`, `onRenderTabContent`. If you only want the header strip with no panel content, pass `onRenderTabContent={() => null}` — though this is an awkward use of the API and the consumer should consider whether the tab content really belongs inside the Tabs panel.

### Use compound components for shells
`Sidebar` and `AppBar` are compound: `Sidebar.Header`, `Sidebar.Body`, `Sidebar.Item`, `Sidebar.Divider`, `Sidebar.Footer`. `AppBar.Start`, `AppBar.Center`, `AppBar.End`. Don't try to pass a `header={<...>}` data-driven prop — that's not the API.

### Activation banners are first-class
For "promote this feature" cards on empty states, use `@m-next/app-activation-banner` — it has `iconName`, `title`, `description`, `bulletPoints[]`, `primaryCTA`, `secondaryCTA`, `dismissible`, `onClose`. Don't build a custom Container with bullets and CTAs.

### Refs forward through every cleaned component
Every cleaned m-next component forwards refs — Box, Stack, Inline, Flex, Divider included (after commit d0e5a7f). You can attach DOM refs for drag handles, scroll measurement, focus management.

### `useTheme()` is OK inside theme-aware components only
Components in `Foundation` and `Components` that take colors as props can fall back to `@m-next/tokens.colors.*`. Don't reach for `useTheme()` in code that needs to work outside a `ThemeProvider` (loading splashes, error boundaries).

---

## Where to find more

- **`packages/{name}/README.md`** — quickstart for each package
- **`packages/{name}/stories/{name}.mdx`** — intent-contract docs (when to use, when NOT, anatomy, API, recipes)
- **`packages/{name}/stories/{name}.stories.{jsx,tsx}`** — concrete usage examples. Story names describe what they demo.
- **`packages/{name}/src/index.d.ts`** — TypeScript types for the public API
- **Storybook** (`:6007`) — interactive, with the MDX docs as Docs pages
- **`.storybook/main.js`** — `M_NEXT_PACKAGES` array lists every loadable package + provenance comments

---

## Working in this repo

- **Phase 3 envelope** — when cleaning an inherited package, apply the envelope above. Don't restructure files. Soft-shim legacy props. See any recently-cleaned package (e.g., `packages/datepicker/src/DatePicker.jsx`) for the canonical pattern.
- **Storybook re-add** — after Phase-3'ing a package, add its name to `M_NEXT_PACKAGES` in `.storybook/main.js` so its stories are discoverable. Restart storybook after editing main.js.
- **Tests + snapshots** — many cleaned packages have stale `*.test.jsx` and `__snapshots__/` referencing the legacy API. Test rewrites are deferred and intentional — don't try to fix them inline during Phase 3.
- **Commit style** — see recent commits. Each Phase 3 cleanup is its own commit; multi-package waves get a single "Phase 3 wave: X (Y packages)" commit.
- **Branch** — `main`. Push to `https://github.com/tylercopeland/m-next`.

---

## What to do when stuck

1. **Look at a recently-cleaned package** in the same category to see the canonical pattern.
2. **Read the Storybook story file** for concrete usage.
3. **Search for the component name in `packages/`** — most exports have a sibling test/story file that demonstrates usage.
4. **Check this doc's gotchas section** — most repeated mistakes are listed.
5. **Ask the human** — they have context the docs don't capture yet, and getting that context written down is itself useful work.
