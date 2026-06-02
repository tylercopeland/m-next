import styled from '@emotion/styled';
import { colors } from '@m-next/tokens';

// SimpleBar exposes hook classes for its track and thumb:
//   .simplebar-track       — the rail (vertical / horizontal)
//   .simplebar-scrollbar   — the drag handle
// We don't restyle the geometry (width, position, hit area) — SimpleBar's
// defaults are correct. We only override the visual treatment: a near-
// transparent track and a subtle grey thumb that darkens on hover, drawn
// from @m-next/tokens so the scrollbar matches the rest of m-next.

const THUMB_COLOR = colors.grey.light || '#BACAD0';
const THUMB_COLOR_HOVER = colors.grey.base || '#545F67';
const TRACK_COLOR = 'transparent';

// The thumb gets a slight inset so it doesn't touch the edge of the rail,
// matching the standard SimpleBar treatment but tuned to m-next density.
const THUMB_RADIUS = 4;
const THUMB_INSET = 2;

export const ScrollbarRoot = styled.div((props) => ({
  // SimpleBar requires an explicit height to know what to virtualize. We
  // forward either the consumer-supplied maxHeight or the offset-derived
  // calc. If neither is provided, we fall back to 100% — the original
  // Method <Scrollbar /> assumed that consumers always set a height on the
  // parent.
  maxHeight: props.maxHeight,
  height: props.height,
  width: '100%',
  boxSizing: 'border-box',

  // Theme the SimpleBar internals. These selectors target the elements
  // SimpleBar renders inside us at runtime — they aren't styled-components.
  '& .simplebar-track': {
    background: TRACK_COLOR,
  },
  '& .simplebar-scrollbar::before': {
    background: THUMB_COLOR,
    borderRadius: THUMB_RADIUS,
    opacity: 0.7,
  },
  '& .simplebar-scrollbar.simplebar-hover::before, & .simplebar-track:hover .simplebar-scrollbar::before':
    {
      background: THUMB_COLOR_HOVER,
      opacity: 1,
    },
  '& .simplebar-track.simplebar-vertical': {
    width: 10,
  },
  '& .simplebar-track.simplebar-horizontal': {
    height: 10,
  },
  '& .simplebar-track.simplebar-vertical .simplebar-scrollbar::before': {
    left: THUMB_INSET,
    right: THUMB_INSET,
  },
  '& .simplebar-track.simplebar-horizontal .simplebar-scrollbar::before': {
    top: THUMB_INSET,
    bottom: THUMB_INSET,
  },
}));
