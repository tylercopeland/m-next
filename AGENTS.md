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

**Machine-readable catalog:** [`registry.json`](./registry.json) at the workspace root lists every component (77 of them) with category, summary, variants, canonical Storybook story, and the "use / don't use" decision. Tools and agents should query it once at session start to orient before generating code.

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

## Selection guide — pick the right component

When choosing between two components, this is the reference. Tables are ordered by category. If a row's "Use" cell points at a variant (e.g., `Button variant="tertiary"`), the variant matters — don't substitute another variant just because the package name matches.

### Action — buttons, links, triggers

| Need | Use | Don't use |
|---|---|---|
| Primary action (Save, Submit) | `<Button variant="primary">` | `<button style={...}>` |
| Secondary action (Cancel, alt path) | `<Button variant="secondary">` | unstyled `<button>` |
| Low-emphasis text+icon (Back, Import, link-like action) | `<Button variant="tertiary">` | hand-rolled blue-text button |
| Subtle action that blends with content | `<Button variant="ghost">` | gray-text styled div |
| Inline underlined text action | `<Button variant="link">` | `<a>` styled as button |
| Navigation link (anchor semantics) | `<Link href=...>` | bare `<a href>` |
| Group of related actions | `<ButtonGroup>` | flex container with `<Button>`s |

### Display — content and data presentation

| Need | Use | Don't use |
|---|---|---|
| Metric / KPI with optional delta | `<InsightCard>` (delta prop) | `<Card>` with manual layout |
| Tabular data | `<Grid>` (see Readonly story for canonical args) | `<table>` or div-shaped grid |
| Small static status tag | `<Badge>` (sm, categorical) | `<span>` styled label |
| Larger interactive/dismissible tag | `<Pill>` (md, has delete slot) | styled chip div |
| Person avatar + name combo | `<AvatarPill>` | `<Pill>` + manual `<img>` |
| Generic content panel | `<Container bordered>` or `<Card>` | `<div>` with border |
| Section heading with actions | `<SectionHeader>` | flex `<div>` with `<h2>` |
| Themed typography (H1–H6, P, captions) | `<Text as="H2">` etc. | `<h1>` / `<p>` with style |
| Accordion sections | `<Accordion>` | manual collapse logic |
| Image carousel | `<Carousel>` | manual scroll-snap |

### Feedback — communicating state to the user

| Need | Use | Don't use |
|---|---|---|
| Transient success/error popup | `useToast()` from `@m-next/toast` | manual snackbar div |
| Inline contextual warning/info | `<Alert status="warning|info|success|error">` | `<Banner>` |
| Page-top notification with action | `<Banner status=...>` | `<Alert>` |
| Empty list / no-results state | `<EmptyState variant="subtle|bordered|banner">` | hand-rolled "no items" div |
| Loading placeholder (skeleton shape) | `<Skeleton>` | gray box / spinner inline |
| Inline loading spinner (in button, modal) | `<Spinner>` | CSS animation div |
| Hover-triggered hint | `<Tooltip>` | `title=""` attribute or custom popover |
| "Try this feature" splash for empty screens | `<AppActivationBanner>` | custom Container with bullets/CTAs |

### Form — capturing user input

| Need | Use | Don't use |
|---|---|---|
| Single-line text | `<Input>` from `@m-next/input` | `<input type="text">` |
| Multi-line text | `<Textarea>` from `@m-next/input-area` | `<textarea>` |
| Single checkbox | `<Checkbox>` | `<input type="checkbox">` |
| Group of checkboxes | `<CheckboxGroup>` | array of `<Checkbox>` in flex |
| Binary on/off switch | `<Toggle>` | `<Checkbox>` styled as switch |
| Single-select dropdown | `<Select>` | `<select>` |
| Multi-select dropdown | `<MultiSelect>` | multiple `<Checkbox>` rows |
| Async-loaded options | `<Dropdown>` or `<DropdownAsync>` | `<Select>` with manual fetch |
| Search box | `<SearchInput>` | `<Input>` + manual magnifier icon |
| 2–4 mutually-exclusive options inline | `<SegmentedControl>` from `@m-next/pill-tab` | `<RadioButton>` group |
| Radio with icon visuals | `<IconRadioGroup>` from `@m-next/radio-button` | manual `<input type="radio">` |
| Date picker | `<DatePicker>` / `<DateRangePicker>` | `<input type="date">` |
| Time picker | `<TimePicker>` / `<TimeRangePicker>` | `<input type="time">` |
| Phone number | `<PhoneInput>` | `<Input>` |
| Address (display) | `<Address>` | manual address fields |
| Address (autocomplete entry) | `<AddressLookup>` | `<Input>` + manual geocode |
| Field wrapper (label + input + error) | `<FormField>` | manual `<label>` + div |
| Grouped fields with title/description | `<FormSection>` from `@m-next/field-block` | `<fieldset>` |
| Inline error message | `<ValidationMessage>` | red `<span>` |
| Helper text under a field | `<Caption>` | small gray `<span>` |
| File upload + list | `<Attachments>` | `<input type="file">` |
| Signature capture | `<Signature>` package | canvas wrapper |
| Color picker | `<ColorPicker>` | `<input type="color">` |
| Rich-text WYSIWYG | `<HtmlEditor>` package | `contenteditable` div |

### Navigation — moving between views

| Need | Use | Don't use |
|---|---|---|
| Tab strip with content swap | `<Tabs>` (`tabList`, `selectedTab`, `onChange`, `onRenderTabContent`) | custom tab buttons + manual state |
| Tab strip with no panel content (header-only) | `<Tabs>` without `onRenderTabContent` | rendering an empty panel via `() => null` |
| Left-side app navigation | `<Sidebar>` + `Sidebar.Header/Body/Item/Divider/Group/Footer` | `<nav>` with manual list |
| Top app bar | `<AppBar>` + `AppBar.Start/Center/End` | `<header>` flex container |
| Breadcrumb trail | `<Breadcrumbs>` | manual `›` separators |
| Pagination controls | `<Pagination>` | custom prev/next buttons |
| Multi-step workflow indicator | `<Stepper>` | numbered circles in a row |
| Filter pill row | `<ChipsFilter>` (alias `<FilterChips>`) | `<Checkbox>` row |
| Dropdown action menu | `<Menu>` | custom popover with items |

### Overlay — floating above content

| Need | Use | Don't use |
|---|---|---|
| Modal confirmation / form | `<Dialog>` | fixed div with backdrop |
| Side-sliding panel | `<Drawer>` (`placement`, `size`) | absolute-positioned div |
| Hover/click contextual surface | `<Popover>` | manually positioned div |
| Action menu with items | `<Menu>` | `<Popover>` + manual list |
| "Try this feature" full-screen splash | `<AppActivationOverlay>` | manual modal |

### Foundation — primitives (use these freely)

These ARE the styled-HTML you should reach for. Don't over-componentize.

| Need | Use |
|---|---|
| Vertical stack with gap | `<Stack gap="md">` from `@m-next/layout` |
| Horizontal row with gap + align | `<Inline gap="sm" align="center">` |
| Generic flex/block container with spacing props | `<Box padding="md">` |
| Visual separator line | `<Divider>` from `@m-next/layout` |
| Brand wordmark | `<MethodLogo height={20} />` from `@m-next/brand` |
| Icon glyph | `<SvgIcon name="..." size={...} color="...">` |

---

## Forbidden patterns

The highest-frequency mistakes AI makes when generating m-next code. If you find yourself writing one of these, stop and pick from the Selection guide.

| Avoid | Use instead | Why |
|---|---|---|
| `<button style={{...}}>` | `<Button variant="...">` | Five canonical variants exist (primary, secondary, tertiary, ghost, link) — pick one |
| `<input style={{...}}>` | `<Input>` | `@m-next/input` carries the Phase 3 envelope (a11y, ref-forwarding, soft-shims) |
| `<textarea>` | `<Textarea>` from `@m-next/input-area` | Same envelope; consistent focus/error styling |
| `<table>` or `<div>` table mock | `<Grid>` | Grid has built-in pagination, sort, filter, view-filter, search, columns toggle |
| Custom tab buttons + state | `<Tabs>` | Handles a11y, keyboard navigation, focus management |
| `<Card>` for a metric with delta | `<InsightCard>` | Built-in delta visualization |
| `<Banner>` for an inline warning | `<Alert>` | Banner = page-top with action; Alert = inline contextual |
| Manual snackbar / toast div | `useToast()` | Toast provider handles stacking, dismissal, queue |
| `<h1>` / `<h2>` / `<p>` with inline style | `<Text as="H1|H2|P">` | Text uses theme tokens for typography |
| `<a href>` with custom underline | `<Link href>` | Link handles external icon, hover state |
| Hand-rolled empty state | `<EmptyState>` | Has variant + action slot |
| Building tabs panel content as a sibling instead of inside `onRenderTabContent` | Put real content in `onRenderTabContent={() => <Body />}` | Sibling content lives outside the tab panel's a11y/focus boundary |
| Building a custom drawer with `position: fixed` + transition | `<Drawer>` | Has placement, size, focus trap, backdrop |
| Using `@m-next/typeography` or `@m-next/tabs-v2` | `@m-next/text` / `@m-next/tabs` | Deprecated aliases — they fire console warnings |

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
