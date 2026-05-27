# `@m-next/theme`

React context for theming. Composes a named theme (`light` / `dark` / `fun`) with the token scales from `@m-next/tokens` into a single object available via `useTheme()`.

## Why it exists

m-next's themes ship as plain objects (`background.primary`, `content.primary`, etc.) but historically had no React-level provider. Components either imported themes directly or inherited them via Emotion's own `ThemeProvider`. Token scales (`spacing`, `radius`, ...) lived nowhere on the theme at all.

This package puts both on the same theme object, in one provider.

## Quick start

```jsx
import { ThemeProvider, useTheme } from '@m-next/theme';

const App = () => (
  <ThemeProvider name="light">
    <Page />
  </ThemeProvider>
);

const Page = () => {
  const theme = useTheme();
  return (
    <div
      style={{
        background: theme.background.primary,   // from light theme
        color: theme.content.primary,           // from light theme
        padding: theme.spacing.lg,              // from @m-next/tokens
        borderRadius: theme.radius.md,          // from @m-next/tokens
        boxShadow: theme.shadow.md,             // from @m-next/tokens
      }}
    />
  );
};
```

## Switching themes at runtime

```jsx
import { useThemeSwitcher } from '@m-next/theme';

const ThemeToggle = () => {
  const { current, setTheme, available } = useThemeSwitcher();
  return (
    <select value={current} onChange={(e) => setTheme(e.target.value)}>
      {available.map((name) => (
        <option key={name} value={name}>{name}</option>
      ))}
    </select>
  );
};
```

When the `ThemeProvider` is uncontrolled (no `name` prop), `setTheme()` updates the active theme. When controlled, `setTheme()` is a no-op and warns.

## API

| Export | What it is |
|--------|------------|
| `<ThemeProvider name="light" \| "dark" \| "fun">` | Wraps children, provides the composed theme via Emotion context. Auto-injects token CSS variables at root unless `injectCssVariables={false}`. |
| `useTheme()` | Returns the composed theme. Throws if used outside `<ThemeProvider>`. |
| `useThemeSwitcher()` | Returns `{ current, setTheme, available }`. |
| `composeTheme(nameOrObject)` | Pure helper. Merges a named theme + tokens. |
| `themeNames` | `['light', 'dark', 'fun']` |

## Notes

- The `method` theme from `@m-next/styles` is intentionally not in `themeNames` — it's a MUI-shaped theme, structurally different from the others. If you need it, pass it directly via `<ThemeProvider theme={methodTheme}>`.
- CSS variables (`--space-md`, `--radius-lg`, ...) are injected once at the provider root. Other stylesheets can reference them with `var(--space-md)`.
- Built on top of Emotion's `ThemeProvider`, so `styled(Component)` and the `css` prop get the composed theme for free.
