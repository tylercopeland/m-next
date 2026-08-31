import styled from '@emotion/styled';
import { colors, fontWeight } from '@m-next/tokens';

// Visual treatment mirrors MethodUI's production pagination: a rounded
// horizontal pill of buttons with hairline borders, white surface, and
// a blue-base accent for the active page. The original MethodUI variant
// was prev/next only; this v1 adds numbered page buttons (the standard
// data-table shape) using the same pill geometry.
const BORDER = colors.grey.light || '#BACAD0';
const BORDER_HOVER = colors.grey.base || '#545F67';
const TEXT_PRIMARY = colors.grey.base || '#545F67';
const TEXT_DISABLED = colors.grey.light || '#BACAD0';
const ACCENT = colors.blue.base || '#0D71C8';
const ACCENT_TEXT = colors.white || '#FFFFFF';

export const Container = styled.nav({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  boxSizing: 'border-box',
  fontFamily: "'Source Sans Pro', system-ui, -apple-system, sans-serif",
});

// Buttons render edge-to-edge as a connected pill. The first and last
// buttons take rounded ends; everything in between shares hairline
// dividers.
export const Button = styled.button((props) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 32,
  minWidth: 32,
  padding: '0 10px',
  boxSizing: 'border-box',
  background: props.active ? ACCENT : 'transparent',
  color: (() => {
    if (props.active) return ACCENT_TEXT;
    if (props.disabled) return TEXT_DISABLED;
    return TEXT_PRIMARY;
  })(),
  fontSize: 14,
  fontWeight: props.active ? 600 : 500,
  fontFamily: 'inherit',
  borderStyle: 'solid',
  borderColor: BORDER,
  borderWidth: '1px 0',
  borderLeftWidth: 0.5,
  borderRightWidth: 0.5,
  cursor: props.disabled ? 'default' : 'pointer',
  ':first-of-type': {
    borderLeftWidth: 1,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  ':last-of-type': {
    borderRightWidth: 1,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  ':hover': props.disabled || props.active
    ? undefined
    : {
        borderColor: BORDER_HOVER,
      },
  ':focus': {
    outline: 'none',
  },
  ':focus-visible': {
    outline: `2px solid ${ACCENT}`,
    outlineOffset: -2,
    zIndex: 1,
  },
  '> svg': {
    fill: 'currentColor',
    width: 10,
    height: 10,
  },
}));

// Ellipsis is rendered as a non-interactive cell so the pill geometry
// stays continuous. Matches the page-button frame, just non-clickable.
export const Ellipsis = styled.span({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 32,
  minWidth: 32,
  padding: '0 10px',
  boxSizing: 'border-box',
  borderStyle: 'solid',
  borderColor: BORDER,
  borderWidth: '1px 0.5px',
  color: TEXT_PRIMARY,
  fontSize: 14,
  fontWeight: fontWeight.medium,
  fontFamily: 'inherit',
  userSelect: 'none',
});
