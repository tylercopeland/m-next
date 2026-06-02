import styled from '@emotion/styled';
import { colors } from '@m-next/tokens';

// Defaults match Method's production app shell (TopNav) — white surface
// with navy text and a hairline border below. Padding asymmetric (24px left,
// 16px right) per production. The page-title slot sits flush-left; action
// icons + user menu sit on the right.
const SURFACE_BG = colors.white || '#FFFFFF';
const SURFACE_BORDER = colors.grey.light || '#BACAD0';
const TEXT_PRIMARY = colors.blue.darkest || '#022266'; // 'method' navy

export const AppBarRoot = styled.header((props) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  minHeight: `${props.height}px`,
  height: `${props.height}px`,
  padding: '0 16px 0 24px',
  gap: 16,
  background: SURFACE_BG,
  borderBottom: props.borderless ? 'none' : `1px solid ${SURFACE_BORDER}`,
  boxSizing: 'border-box',
  fontFamily: "'Source Sans Pro', system-ui, -apple-system, sans-serif",
  color: TEXT_PRIMARY,
  position: props.sticky ? 'sticky' : 'static',
  top: props.sticky ? 0 : undefined,
  zIndex: props.sticky ? 10 : undefined,
}));

// Three slot containers. Start aligns left, End aligns right, Center is
// the elastic middle. Each is just a flex item with no opinion on its
// own children's layout — consumers compose with Inline / Stack / etc.
export const Start = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flexShrink: 0,
});

export const Center = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flex: 1,
  minWidth: 0, // allow children to shrink instead of pushing siblings
});

export const End = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flexShrink: 0,
  marginLeft: 'auto',
});
