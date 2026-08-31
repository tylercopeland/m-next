import styled from '@emotion/styled';
import { lightTheme } from '@m-next/styles';
import { radius, spacing } from '@m-next/tokens';

// `padding` accepts a spacing token ('md', 'xl', ...) OR a raw CSS value.
// Box resolves tokens the same way; Container previously did not, so
// padding="xl" emitted the invalid declaration `padding: xl` and silently
// produced NO padding at all. Tokens now resolve; anything else passes
// through unchanged, so existing '24px' / 16 / '1rem' callers are untouched.
const resolvePadding = (val) => {
  if (val == null || val === '') return null;
  if (spacing[val] != null) return `${spacing[val]}px`;
  return val;
};

// NOTE: `borderRadius` comes from `radius.lg` (8px). The shadow `rgba(0,0,0,0.1)`
// has no nested-token equivalent (it's a translucent black, not a palette color),
// and the surface color comes from the active Emotion theme via `theme.background`.
// Falls back to `lightTheme.background.primary` from @m-next/styles. The audit
// flags @m-next/styles itself for cleanup — Container will pick that up
// downstream without an API change here.

export const Container = styled.div((props) => {
  const { isVisible, width, theme, onClick, isRound, borderless, bordered, padding, height, hoverStyle, maxHeight } = props;
  const { content, background } = theme;
  let shadow = '0px 2px 4px rgba(0, 0, 0, 0.1)';
  if (borderless) {
    shadow = null;
  }
  // Audit-finding-3 fix: `bordered` adds a hairline border independent of the
  // shadow knob. Uses `theme.content.border` so it follows the active palette
  // (and falls back to lightTheme when no theme is provided).
  const borderColor =
    (content && content.border) || (lightTheme.content && lightTheme.content.border) || '#d1d5db';
  const border = bordered ? `1px solid ${borderColor}` : null;
  return [
    {
      display: isVisible ? 'flex' : 'none',
      boxSizing: 'border-box',
      padding: resolvePadding(padding) || `${spacing.lg}px`,
      backgroundColor: background ? background.primary : lightTheme.background.primary,
      color: content ? content.color : null,
      // 8px surface corner, from radius.lg. `isRound` defaults to true in
      // Container.jsx, so this is a 4px -> 8px change for already-rounded
      // containers; the 22 call sites passing isRound={false} stay square.
      borderRadius: isRound ? radius.lg : null,
      boxShadow: shadow,
      border,
      flexDirection: 'column',
      width,
      height,
      cursor: onClick ? 'pointer' : 'default',
      ':hover': hoverStyle,
      maxHeight,
    },
  ];
});

export default Container;
