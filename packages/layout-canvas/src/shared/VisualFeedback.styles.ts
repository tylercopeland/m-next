import styled from '@emotion/styled';
import { colors } from '@m-next/styles';
import { Z_COMPONENT } from '../constants/zIndex';

/**
 * Shared visual feedback styled components used by both LayoutCanvas and LayoutContainer.
 * These provide the selection, hover, validation, and hidden-state indicators
 * overlaid on grid items in designer mode.
 */

// Solid border shown when a component is selected, hovered, or during drag/resize
export const BorderOverlay = styled.div<{
  borderColor: string;
  zIndex: number;
}>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 1px solid ${({ borderColor }) => borderColor};
  border-radius: 0px;
  pointer-events: none;
  z-index: ${({ zIndex }) => zIndex};
`;

// Dashed border shown for hidden components or validation errors when not selected/hovered
export const DashedBorderOverlay = styled.div<{
  borderColor: string;
}>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 1px dashed ${({ borderColor }) => borderColor};
  border-radius: 0px;
  pointer-events: none;
  z-index: ${Z_COMPONENT.DASHED_BORDER};
`;

// Custom dashed border with 8px/4px pattern for hidden components
export const CustomDashedBorderOverlay = styled.div<{
  borderColor: string;
  zIndex: number;
}>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: none;
  pointer-events: none;
  z-index: ${({ zIndex }) => zIndex};

  svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
`;

// Component name badge with move icon, shown on hover or selection
export const Badge = styled.div<{
  backgroundColor: string;
  position: 'top' | 'bottom' | 'inside';
  isNearTop?: boolean;
  isDraggable?: boolean;
}>`
  display: flex;
  padding: 2px 4px;
  align-items: center;
  gap: 4px;
  border-radius: 4px;
  background-color: ${({ backgroundColor }) => backgroundColor};
  pointer-events: ${({ isDraggable }) => (isDraggable ? 'auto' : 'none')};
  cursor: default;
  max-width: 100%;
  position: absolute;

  ${({ position, isNearTop }) => {
    if (position === 'inside') {
      return `
        left: 4px;
        top: 4px;
        z-index: ${Z_COMPONENT.BADGE_INSIDE};
      `;
    }
    if (position === 'bottom' || isNearTop) {
      return `
        left: 0;
        bottom: -22px;
        z-index: ${Z_COMPONENT.BADGE_BOTTOM};
      `;
    }
    return `
      left: 0;
      top: -22px;
      z-index: ${Z_COMPONENT.BADGE_TOP};
    `;
  }}
`;

// Drag handle icon wrapper with grab cursor
export const DragHandleIcon = styled.span<{
  isDraggable?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: ${({ isDraggable }) => (isDraggable ? 'grab' : 'default')};
  pointer-events: ${({ isDraggable }) => (isDraggable ? 'auto' : 'none')};

  &:active {
    cursor: ${({ isDraggable }) => (isDraggable ? 'grabbing' : 'default')};
  }
`;

// Text label inside the Badge
export const BadgeText = styled.span<{
  textColor: string;
}>`
  display: block;
  overflow: hidden;
  color: ${({ textColor }) => textColor};
  font-feature-settings:
    'liga' off,
    'clig' off;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: Source Sans Pro;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  min-width: 0;
  flex: 1 1 auto;
  cursor: pointer;
`;

// Badge for hidden components (not selected/hovered) - shows component name with eye icon
export const HiddenBadge = styled.div<{
  position: 'top' | 'bottom' | 'inside';
  isNearTop?: boolean;
}>`
  display: flex;
  padding: 2px 4px;
  align-items: center;
  gap: 4px;
  border-radius: 4px;
  background: ${colors['grey-light']};
  pointer-events: none;
  max-width: 100%;
  position: absolute;

  ${({ position, isNearTop }) => {
    if (position === 'inside') {
      return `
        left: 4px;
        top: 4px;
        z-index: ${Z_COMPONENT.HIDDEN_BADGE};
      `;
    }
    if (position === 'bottom' || isNearTop) {
      return `
        left: 0;
        bottom: -22px;
        z-index: ${Z_COMPONENT.HIDDEN_BADGE};
      `;
    }
    return `
      left: 0;
      top: -22px;
      z-index: ${Z_COMPONENT.HIDDEN_BADGE};
    `;
  }}
`;

// Small badge with warning icon for components with validation errors (not selected/hovered).
// The offset prop controls positioning: LayoutCanvas uses 2px, LayoutContainer uses 4px.
export const UnconfiguredBadge = styled.div<{
  offset?: number;
}>`
  display: flex;
  height: 20px;
  padding: 2px 4px;
  align-items: center;
  gap: 8px;
  position: absolute;
  left: ${({ offset = 2 }) => offset}px;
  top: ${({ offset = 2 }) => offset}px;
  border-radius: 4px;
  background: ${colors.red};
  pointer-events: none;
  z-index: ${Z_COMPONENT.UNCONFIGURED_BADGE};
`;
