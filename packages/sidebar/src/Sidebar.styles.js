import styled from '@emotion/styled';
import { colors } from '@m-next/tokens';

// Surface colors used by the sidebar shell. Falls back to safe defaults if
// the consumer hasn't wired up a theme — sidebar should never look broken
// out of the box.
const SURFACE_BG = colors.grey.lighter || '#F7F9FA';
const SURFACE_BORDER = colors.grey.light || '#D1D5DB';
const TEXT_PRIMARY = colors.grey.darkest || '#1F2A33';
const TEXT_SUBTLE = colors.grey.dark || '#5A6B7B';
const ACTIVE_BG = colors.blue.lighter || '#E5F0FA';
const ACTIVE_TEXT = colors.blue.base || '#0D71C8';
const HOVER_BG = colors.grey.lightest || '#EEF5F7';

export const SidebarRoot = styled.aside((props) => ({
  display: 'flex',
  flexDirection: 'column',
  width: props.isOpen ? `${props.width}px` : `${props.collapsedWidth}px`,
  minWidth: props.isOpen ? `${props.width}px` : `${props.collapsedWidth}px`,
  maxWidth: props.isOpen ? `${props.width}px` : `${props.collapsedWidth}px`,
  height: '100%',
  background: SURFACE_BG,
  borderRight: `1px solid ${SURFACE_BORDER}`,
  boxSizing: 'border-box',
  overflow: 'hidden',
  transition: 'width 180ms ease, min-width 180ms ease, max-width 180ms ease',
  fontFamily: "'Source Sans Pro', system-ui, -apple-system, sans-serif",
  color: TEXT_PRIMARY,
}));

export const SidebarHeader = styled.div({
  flex: '0 0 auto',
  padding: '12px 16px',
  borderBottom: `1px solid ${SURFACE_BORDER}`,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  minHeight: 56,
  boxSizing: 'border-box',
});

export const SidebarBody = styled.div({
  flex: '1 1 auto',
  overflowY: 'auto',
  overflowX: 'hidden',
  padding: '8px 0',
});

export const SidebarFooter = styled.div({
  flex: '0 0 auto',
  padding: '12px 16px',
  borderTop: `1px solid ${SURFACE_BORDER}`,
  boxSizing: 'border-box',
});

export const GroupRoot = styled.div({
  padding: '4px 8px',
});

export const GroupHeader = styled.div((props) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '6px 8px',
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
  gap: 2,
  marginTop: 2,
});

export const Item = styled.button((props) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  width: '100%',
  padding: '8px 10px',
  borderRadius: 6,
  border: 'none',
  background: props.active ? ACTIVE_BG : 'transparent',
  color: props.active ? ACTIVE_TEXT : TEXT_PRIMARY,
  fontSize: 14,
  fontWeight: props.active ? 600 : 500,
  fontFamily: 'inherit',
  textAlign: 'left',
  textDecoration: 'none',
  cursor: props.disabled ? 'not-allowed' : 'pointer',
  opacity: props.disabled ? 0.5 : 1,
  boxSizing: 'border-box',
  ':hover': props.disabled
    ? undefined
    : {
        background: props.active ? ACTIVE_BG : HOVER_BG,
      },
  ':focus-visible': {
    outline: `2px solid ${ACTIVE_TEXT}`,
    outlineOffset: -2,
  },
}));

export const ItemIcon = styled.span({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 18,
  height: 18,
  flexShrink: 0,
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
  background: ACTIVE_BG,
  color: ACTIVE_TEXT,
  marginLeft: 'auto',
});
