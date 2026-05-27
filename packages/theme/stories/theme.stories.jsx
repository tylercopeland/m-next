import React from 'react';
import ThemeProvider, { useTheme, useThemeSwitcher } from '../src';

export default {
  title: 'm-next/Foundation/Theme',
  parameters: { layout: 'padded' },
};

const fontFamily = "'Source Sans Pro', Helvetica, Arial, sans-serif";

const Card = () => {
  const theme = useTheme();
  return (
    <div
      style={{
        background: theme.background.primary,
        color: theme.content.primary,
        padding: theme.spacing.xl,
        borderRadius: theme.radius.lg,
        boxShadow: theme.shadow.md,
        border: `1px solid ${theme.content.border}`,
        fontFamily: theme.fontFamily || fontFamily,
        maxWidth: 480,
      }}
    >
      <h3 style={{ margin: 0, marginBottom: theme.spacing.sm, fontWeight: theme.fontWeight.semibold }}>
        Composed theme card
      </h3>
      <p style={{ margin: 0, marginBottom: theme.spacing.md, color: theme.content.subtle, lineHeight: theme.lineHeight.normal }}>
        Background, content color, border, and font come from the named theme.
        Spacing, radius, shadow, and font weight come from <code>@m-next/tokens</code>.
        Both live on a single composed theme accessed via <code>useTheme()</code>.
      </p>
      <div style={{ display: 'flex', gap: theme.spacing.sm }}>
        <button
          type="button"
          style={{
            padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
            background: theme.informative.secondary,
            color: theme.background.primary,
            border: 'none',
            borderRadius: theme.radius.md,
            fontWeight: theme.fontWeight.medium,
            cursor: 'pointer',
            transition: `opacity ${theme.transition.fast}`,
          }}
        >
          Primary
        </button>
        <button
          type="button"
          style={{
            padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
            background: 'transparent',
            color: theme.content.primary,
            border: `1px solid ${theme.content.border}`,
            borderRadius: theme.radius.md,
            fontWeight: theme.fontWeight.medium,
            cursor: 'pointer',
          }}
        >
          Secondary
        </button>
      </div>
    </div>
  );
};

const Switcher = () => {
  const { current, setTheme, available } = useThemeSwitcher();
  return (
    <div style={{ fontFamily, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ fontSize: 13, color: '#6b7280' }}>Theme:</span>
      {available.map((name) => (
        <button
          type="button"
          key={name}
          onClick={() => setTheme(name)}
          style={{
            padding: '4px 12px',
            background: current === name ? '#111827' : '#fff',
            color: current === name ? '#fff' : '#111827',
            border: '1px solid #d1d5db',
            borderRadius: 4,
            cursor: 'pointer',
            fontFamily,
            fontSize: 13,
          }}
        >
          {name}
        </button>
      ))}
    </div>
  );
};

export const LightTheme = () => (
  <ThemeProvider name="light">
    <Card />
  </ThemeProvider>
);

export const DarkTheme = () => (
  <ThemeProvider name="dark">
    <Card />
  </ThemeProvider>
);

export const FunTheme = () => (
  <ThemeProvider name="fun">
    <Card />
  </ThemeProvider>
);

export const InteractiveSwitcher = () => (
  <ThemeProvider defaultName="light">
    <Switcher />
    <Card />
  </ThemeProvider>
);
