import styled from '@emotion/styled';
import { colors } from '@m-next/tokens';

// Surface and title colors. The original MethodUI carousel pulled
// `colors['grey-dark']` from @m-one/styles for the title; in m-next tokens
// the closest equivalent is colors.grey.dark (#2A394A).
const TITLE_COLOR = colors.grey.dark || '#2A394A';

// Arrow button colors. Blue base for the resting fill, blue dark for hover.
const ARROW_BG = colors.blue.base || '#0D71C8';
const ARROW_BG_HOVER = colors.blue.dark || '#064499';
const ARROW_GLYPH = colors.white || '#FFFFFF';
const FOCUS_RING_INNER = colors.white || '#FFFFFF';
const FOCUS_RING_OUTER = colors.blue.base || '#0D71C8';

export const CarouselShell = styled.div({
  minHeight: 'fit-content',
  position: 'relative',
});

export const CarouselTitle = styled.p({
  color: TITLE_COLOR,
  textAlign: 'center',
  fontFeatureSettings: "'liga' off, 'clig' off",
  fontFamily: "'Source Sans Pro', system-ui, -apple-system, sans-serif",
  fontSize: 14,
  fontStyle: 'normal',
  fontWeight: 600,
  lineHeight: '16px',
  marginBottom: 8,
  marginTop: 0,
});

// Wrapper applied to each child slide. The original used inline styles for
// margins; we keep `sideMarginPX` configurable via a styled prop so the
// resulting CSS is theme-friendly and can be overridden with className.
export const CarouselChildWrapper = styled.div((props) => ({
  margin: `auto ${props.sideMarginPX}px`,
  paddingBottom: 16,
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

// Shared arrow button. Position-relative side (left/right) is set on the
// element via inline style by the LeftArrow / RightArrow internal components,
// so the same styled.button can serve both.
export const ArrowButton = styled.button({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  border: 'none',
  cursor: 'pointer',
  zIndex: 2,
  width: 40,
  height: 40,
  borderRadius: 20,
  background: ARROW_BG,
  padding: 10,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
  color: ARROW_GLYPH,
  transition: 'background 120ms ease',
  ':hover:not([disabled])': {
    background: ARROW_BG_HOVER,
  },
  // Match the original MethodUI focus treatment — a white inner ring and a
  // blue outer ring, only when the user is keyboard-navigating. The
  // `body.user-is-tabbing` hook is set elsewhere by Method's tab tracker;
  // we also support browsers' native :focus-visible for keyboard focus.
  'body.user-is-tabbing &:focus:not([disabled]), &:focus-visible:not([disabled])':
    {
      boxShadow: `0 0 0 4px ${FOCUS_RING_INNER}, 0 0 0 6px ${FOCUS_RING_OUTER}`,
      outline: 'none',
    },
});
