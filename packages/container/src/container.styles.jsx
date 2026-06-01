import styled from '@emotion/styled';
import { lightTheme } from '@m-next/styles';

// NOTE: Token migration here is a no-op visually — the shadow `rgba(0,0,0,0.1)`
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
      padding: padding || '16px',
      backgroundColor: background ? background.primary : lightTheme.background.primary,
      color: content ? content.color : null,
      borderRadius: isRound ? '4px' : null,
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
