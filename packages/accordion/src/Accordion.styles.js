import styled from '@emotion/styled';
import { colors, fontWeight } from '@m-next/tokens';

// Palette is grounded in @m-next/tokens. Fallbacks mirror the literal values
// so a missing token never crashes the chrome.
const SURFACE_BG = colors.white || '#FFFFFF';
const BORDER = colors.grey.light || '#BACAD0';
const DIVIDER = colors.grey.lighter || '#EEF5F7';
const HEADER_HOVER_BG = colors.grey.lightest || '#EEF5F7';
const TEXT_PRIMARY = colors.grey.darkest || '#0F1B31';
const TEXT_SUBTLE = colors.grey.base || '#545F67';
const FOCUS_RING = colors.blue.base || '#0D71C8';

export const AccordionRoot = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  fontFamily: "'Source Sans Pro', system-ui, -apple-system, sans-serif",
  color: TEXT_PRIMARY,
  boxSizing: 'border-box',
});

// Each item is a rounded-card with a hairline border. Sits on white.
export const ItemRoot = styled.div({
  display: 'flex',
  flexDirection: 'column',
  background: SURFACE_BG,
  border: `1px solid ${BORDER}`,
  borderRadius: 6,
  overflow: 'hidden',
  boxSizing: 'border-box',
});

// Header is a real <button> so a11y + keyboard work out of the box.
// Padding 12-16 matches the chrome spec; chevron rotates 180deg on expand.
export const ItemHeader = styled.button((props) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  width: '100%',
  padding: '12px 16px',
  background: 'transparent',
  border: 'none',
  textAlign: 'left',
  fontFamily: 'inherit',
  fontSize: 14,
  fontWeight: fontWeight.semibold,
  color: props.disabled ? TEXT_SUBTLE : TEXT_PRIMARY,
  cursor: props.disabled ? 'not-allowed' : 'pointer',
  opacity: props.disabled ? 0.6 : 1,
  boxSizing: 'border-box',
  ':hover': props.disabled
    ? undefined
    : {
        background: HEADER_HOVER_BG,
      },
  ':focus-visible': {
    outline: `2px solid ${FOCUS_RING}`,
    outlineOffset: -2,
  },
}));

export const ItemHeaderIcon = styled.span({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 20,
  height: 20,
  flexShrink: 0,
  color: TEXT_SUBTLE,
});

export const ItemHeaderLabel = styled.span({
  flex: 1,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

// Chevron drawn as a CSS triangle via border-rotation. Rotates 180deg when
// expanded. Simple unicode arrow keeps zero asset dependency.
export const Chevron = styled.span((props) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 16,
  height: 16,
  flexShrink: 0,
  fontSize: 12,
  lineHeight: 1,
  color: TEXT_SUBTLE,
  transform: props.expanded ? 'rotate(180deg)' : 'rotate(0deg)',
  transition: 'transform 120ms ease',
}));

// Body sits below the header; a 1px divider visually separates them but
// only renders when the panel is expanded (no orphan rules in the closed
// state, which would look like a stray border inside the rounded card).
export const ItemBody = styled.div({
  padding: '16px',
  borderTop: `1px solid ${DIVIDER}`,
  fontSize: 14,
  lineHeight: 1.5,
  color: TEXT_PRIMARY,
  boxSizing: 'border-box',
});
