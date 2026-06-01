import styled from '@emotion/styled';
import { colors } from '@m-next/tokens';

// Surface colors used by the app-bar shell. Falls back to safe defaults if
// the consumer hasn't wired up a theme — app-bar should never look broken
// out of the box.
const SURFACE_BG = colors.white || '#FFFFFF';
const SURFACE_BORDER = colors.grey.light || '#D1D5DB';
const TEXT_PRIMARY = colors.grey.darkest || '#1F2A33';

export const AppBarRoot = styled.header((props) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  minHeight: `${props.height}px`,
  height: `${props.height}px`,
  padding: '0 16px',
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
