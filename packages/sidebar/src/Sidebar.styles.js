import styled from '@emotion/styled';
import { colors } from '@m-next/tokens';

// Defaults match Method's production app shell (LeftNav). The surface color
// is the canonical "method" navy (#022266 — colors.blue.darkest in tokens,
// 'method' in legacy base colors). Active and hover rows fill full-width
// in colors.blue.dark with a 4px colors.blue.base accent on the left edge.
const SURFACE_BG = colors.blue.darkest || '#022266'; // 'method' navy
const SURFACE_BORDER = colors.blue.dark || '#064499'; // subtle border in the same family
const TEXT_PRIMARY = colors.white || '#FFFFFF';
const TEXT_SUBTLE = colors.grey.light || '#BACAD0';
const ACCENT_BLUE = colors.blue.base || '#0D71C8'; // 4px left-edge accent on active
const ACTIVE_BG = colors.blue.dark || '#064499'; // full-width row background when active
const ACTIVE_TEXT = colors.white || '#FFFFFF';
const HOVER_BG = colors.blue.dark || '#064499'; // same fill as active on hover

export const SidebarRoot = styled.aside((props) => ({
  display: 'flex',
  flexDirection: 'column',
  width: props.isOpen ? `${props.width}px` : `${props.collapsedWidth}px`,
  minWidth: props.isOpen ? `${props.width}px` : `${props.collapsedWidth}px`,
  maxWidth: props.isOpen ? `${props.width}px` : `${props.collapsedWidth}px`,
  height: '100%',
  background: SURFACE_BG,
  borderRight: 'none', // production has no right border — sidebar sits flush against the page chrome
  boxSizing: 'border-box',
  overflow: 'hidden',
  transition: 'width 180ms ease, min-width 180ms ease, max-width 180ms ease',
  fontFamily: "'Source Sans Pro', system-ui, -apple-system, sans-serif",
  color: TEXT_PRIMARY,
}));

// Header padding mirrors MethodUI's NavHeaderWrapper — 24px horizontal when
// the sidebar is open, 16px when collapsed. Vertical padding is 16px so the
// 20px-tall wordmark/logo lands the header at ~52px, matching production.
export const SidebarHeader = styled.div((props) => ({
  flex: '0 0 auto',
  padding: props.isOpen ? '16px 24px' : '16px',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  minHeight: 56,
  boxSizing: 'border-box',
}));

export const SidebarBody = styled.div({
  flex: '1 1 auto',
  overflowY: 'auto',
  overflowX: 'hidden',
  padding: 0, // items extend edge-to-edge
});

export const SidebarFooter = styled.div({
  flex: '0 0 auto',
  padding: '12px 16px',
  borderTop: `1px solid ${SURFACE_BORDER}`,
  boxSizing: 'border-box',
});

// Sidebar.Divider — explicit horizontal rule, matching Method's
// <LeftNavDivider />. Slightly darker than the surface so it's visible
// without being loud.
export const Divider = styled.div((props) => ({
  flex: '0 0 auto',
  height: 1,
  background: props.color || '#3E5265', // same as production LeftNavDivider
  margin: '8px 0', // 8px top/bottom matches MethodUI Accordion.styles.js
  border: 'none',
}));

export const GroupRoot = styled.div({
  padding: 0,
});

export const GroupHeader = styled.div((props) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 16px',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: 0.5,
  textTransform: 'uppercase',
  color: TEXT_SUBTLE,
  background: 'transparent',
  border: 'none',
  width: '100%',
  textAlign: 'left',
  cursor: props.collapsible ? 'pointer' : 'default',
  fontFamily: 'inherit',
  ':hover': props.collapsible ? { color: TEXT_PRIMARY } : undefined,
}));

export const GroupChevron = styled.span((props) => ({
  display: 'inline-block',
  width: 10,
  height: 10,
  fontSize: 10,
  lineHeight: 1,
  transform: props.expanded ? 'rotate(90deg)' : 'rotate(0deg)',
  transition: 'transform 120ms ease',
  marginLeft: 6,
}));

export const GroupBody = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

// Items render edge-to-edge. Active state = full-width blue-dark fill +
// 4px blue-base left border accent (matches LeftNav production HighlightingCSS).
// Inactive items carry a 4px transparent left border so layout stays stable
// between states — the accent only shows on active rows.
export const Item = styled.button((props) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  width: '100%',
  padding: '14px 24px', // 14px vertical → 48px row height (matches MethodUI HighlightingCSS); 24px horizontal padding per design spec
  borderRadius: 0,
  borderTop: 'none',
  borderBottom: 'none',
  borderRight: 'none',
  borderLeft: `4px solid ${props.active ? ACCENT_BLUE : 'transparent'}`,
  background: props.active ? ACTIVE_BG : 'transparent',
  color: props.active ? ACTIVE_TEXT : TEXT_PRIMARY,
  fontSize: 14,
  fontWeight: props.active ? 600 : 400, // inactive items match MethodUI's browser-default weight; only active rows get bolded
  fontFamily: 'inherit',
  textAlign: 'left',
  textDecoration: 'none',
  cursor: props.disabled ? 'not-allowed' : 'pointer',
  opacity: props.disabled ? 0.5 : 1,
  boxSizing: 'border-box',
  ':hover': props.disabled
    ? undefined
    : {
        background: HOVER_BG,
      },
  ':focus-visible': {
    outline: `2px solid ${ACCENT_BLUE}`,
    outlineOffset: -2,
  },
}));

export const ItemIcon = styled.span({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 20,
  height: 20,
  flexShrink: 0,
  // Icons are caller-supplied (SVGs, glyphs, or @m-next/svg-icon nodes).
  // They should be white-on-navy in this context.
});

export const ItemLabel = styled.span({
  flex: 1,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

export const ItemBadge = styled.span({
  fontSize: 11,
  fontWeight: 600,
  padding: '1px 6px',
  borderRadius: 10,
  background: ACCENT_BLUE,
  color: ACTIVE_TEXT,
  marginLeft: 'auto',
});
