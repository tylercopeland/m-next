import React from 'react';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import { getHandleColor, getBadgePosition } from './componentDisplayUtils';
import {
  Badge,
  BadgeText,
  BorderOverlay,
  CustomDashedBorderOverlay,
  DashedBorderOverlay,
  DragHandleIcon,
  UnconfiguredBadge,
} from './VisualFeedback.styles';

// These are only in LayoutCanvas.styles — imported lazily by the canvas consumer.
// We define minimal local versions for the invalid-drop and protected-badge
// indicators since they're small and canvas-only.
import styled from '@emotion/styled';
import { Z_COMPONENT } from '../constants/zIndex';

const InvalidDropOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(218, 33, 30, 0.15);
  z-index: ${Z_COMPONENT.INVALID_DROP};
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InvalidDropText = styled.div`
  color: white;
  background-color: rgba(218, 33, 30, 0.9);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  pointer-events: none;
`;

const ProtectedBadge = styled.div`
  position: absolute;
  top: -18px;
  left: 0;
  background: #10b981;
  color: white;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: bold;
  border-radius: 2px;
  z-index: ${Z_COMPONENT.PROTECTED_BADGE};
  pointer-events: none;
`;

export interface ComponentVisualFeedbackProps {
  /** Whether the component is currently selected in the designer */
  isSelected: boolean;
  /** Whether the component is being hovered over */
  isHovered: boolean;
  /** Whether the component is hidden at the current resolution/mode */
  isHidden: boolean;
  /** Whether the component has a validation error */
  hasValidationError: boolean;
  /** Whether the component is in the top row (y=0) */
  isNearTop: boolean;
  /** Whether the component type supports height resizing */
  supportsHeightResize: boolean;
  /** Whether any drag operation is in progress */
  isDragInProgress: boolean;
  /** Whether any resize operation is in progress */
  isResizeInProgress: boolean;
  /** The display name for the badge */
  componentName: string;

  // --- Optional props (only used by LayoutCanvas, default to false for LayoutContainer) ---

  /** Whether the designer is active (false = runtime mode, renders nothing) */
  isDesignerMode: boolean;
  /** Whether this component is inside a container (containers render their own feedback) */
  isInContainer?: boolean;
  /** Whether this component is an invalid drop target for a container being dragged */
  isInvalidDropTarget?: boolean;
  /** Whether this is a static/protected container (SECTION type) */
  isStaticContainer?: boolean;
  /** Offset for the UnconfiguredBadge position (2px for canvas, 4px for container) */
  unconfiguredBadgeOffset?: number;
  /** Whether the component is draggable (enables drag handle on badge) */
  isDraggable?: boolean;
  /** Component ID for data attribute (used for hover tracking) */
  componentId?: string;
  /** Callback when mouse enters the badge (for hover tracking) */
  onBadgeMouseEnter?: () => void;
  /** Callback when the badge is clicked (selects the component) */
  onBadgeClick?: (e: React.MouseEvent) => void;
  /** Whether this is a layout container (containers use different drag handle class) */
  isLayoutContainer?: boolean;
  /** Whether this is a nested component inside a container (uses different drag handle class) */
  isNestedComponent?: boolean;
  /** Whether this specific component is currently being dragged */
  isBeingDragged?: boolean;
  /** Whether this component is the default focus target for the screen */
  isDefaultFocus?: boolean;
}

/**
 * Visual feedback overlays shown on grid items in designer mode.
 * Renders selection borders, hover borders, validation indicators,
 * hidden-state badges, and component name badges.
 *
 * Used by both LayoutCanvas and LayoutContainer to eliminate duplicated JSX.
 * Consumers compute the boolean props from their own internal state.
 */
const ComponentVisualFeedbackInner: React.FC<ComponentVisualFeedbackProps> = ({
  isSelected,
  isHovered,
  isHidden,
  hasValidationError,
  isNearTop,
  supportsHeightResize: _,
  isDragInProgress,
  isResizeInProgress,
  componentName,
  isDesignerMode,
  isInContainer = false,
  isInvalidDropTarget = false,
  isStaticContainer = false,
  unconfiguredBadgeOffset,
  isDraggable = false,
  componentId,
  onBadgeMouseEnter,
  onBadgeClick,
  isLayoutContainer = false,
  isNestedComponent = false,
  isBeingDragged = false,
  isDefaultFocus = false,
}) => {
  // No visual feedback in runtime mode or for components inside containers
  // (containers render their own child feedback)
  if (!isDesignerMode || isInContainer) {
    return null;
  }

  const handleColor = getHandleColor(hasValidationError, isSelected);
  const badgePosition = getBadgePosition(isNearTop);
  const iconColor = isHovered && !isSelected && !hasValidationError ? colors['blue-dark'] || '#003D7A' : 'white';
  const isHiddenIdle = isHidden && !isSelected && !isHovered;
  const badgeColor = isHiddenIdle ? colors['grey-light'] || '#E8E8E8' : handleColor;
  const badgeIconColor = isHiddenIdle ? colors['grey-mid'] || '#666' : iconColor;

  return (
    <>
      {/* Invalid drop target indicator for containers being hovered over */}
      {isInvalidDropTarget && <DashedBorderOverlay borderColor={colors.red || '#FF0000'} />}

      {/* Invalid drop overlay for the container being dragged over an invalid target */}
      {isInvalidDropTarget && (
        <InvalidDropOverlay>
          <InvalidDropText>
            <SvgIcon size={14} name='warning-V4' color='white' />
            Cannot nest containers
          </InvalidDropText>
        </InvalidDropOverlay>
      )}

      {/* Unconfigured warning badge for components with validation errors */}
      {hasValidationError && !isSelected && !isHovered && (
        <UnconfiguredBadge offset={unconfiguredBadgeOffset}>
          <SvgIcon size={12} name='warning-V4' color='white' />
        </UnconfiguredBadge>
      )}

      {/* Dashed border overlay for validation errors when NOT selected/hovered */}
      {hasValidationError && !isSelected && !isHovered && <DashedBorderOverlay borderColor={colors.red || '#FF0000'} />}

      {/* Custom dashed border for hidden components (not when selected - solid border takes over) */}
      {isHidden && !isSelected && (
        <CustomDashedBorderOverlay
          borderColor={colors.blue || '#0171C2'}
          zIndex={isHovered ? Z_COMPONENT.BORDER_HOVERED : Z_COMPONENT.BORDER}
        >
          <svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' preserveAspectRatio='none'>
            <rect
              x='0.5'
              y='0.5'
              width='98%'
              height='98%'
              fill='none'
              stroke={colors.blue || '#0171C2'}
              strokeWidth='1'
              strokeDasharray='8 4'
              rx='0'
              ry='0'
            />
          </svg>
        </CustomDashedBorderOverlay>
      )}

      {/* Solid border override for selected hidden components */}
      {isHidden && isSelected && <BorderOverlay borderColor={handleColor} zIndex={Z_COMPONENT.BORDER_HOVERED} />}

      {/* Border overlay - shows on hover, selection, or during any drag/resize operation (not for hidden) */}
      {!isHidden && (isSelected || isHovered || isDragInProgress || isResizeInProgress) && (
        <BorderOverlay borderColor={handleColor} zIndex={isHovered ? Z_COMPONENT.BORDER_HOVERED : Z_COMPONENT.BORDER} />
      )}

      {/* Move Icon Badge - always shown for hidden components, otherwise shows on hover/selection */}
      {(isSelected || isHovered || isBeingDragged || isHidden) && (
        <Badge
          className={
            isDraggable
              ? isNestedComponent
                ? 'nested-drag-handle nested-component-drag-area'
                : !isLayoutContainer
                  ? 'drag-handle'
                  : ''
              : ''
          }
          data-component-id={componentId}
          backgroundColor={badgeColor}
          position={badgePosition}
          isNearTop={isNearTop}
          isDraggable={isDraggable && !isLayoutContainer}
          onMouseEnter={onBadgeMouseEnter}
          onClick={onBadgeClick}
        >
          <DragHandleIcon
            className={isDraggable && !isLayoutContainer && !isNestedComponent ? 'drag-handle' : ''}
            isDraggable={isDraggable && !isLayoutContainer}
          >
            <SvgIcon
              size={8}
              name='move-icon'
              color={badgeIconColor}
              style={{ flexShrink: 0, pointerEvents: 'none' }}
            />
          </DragHandleIcon>
          <BadgeText textColor={badgeIconColor}>{componentName}</BadgeText>
          {/* Warning icon when component has validation error */}
          {hasValidationError && (
            <SvgIcon size={10.5} name='warning-V4' color='white' style={{ flexShrink: 0, pointerEvents: 'none' }} />
          )}
          {/* Eye icon when component is hidden */}
          {isHidden && (
            <SvgIcon
              size={12}
              name='eye-closed-V4'
              color={badgeIconColor}
              style={{ flexShrink: 0, pointerEvents: 'none' }}
            />
          )}
          {/* Target icon when component is the default focus target */}
          {isDefaultFocus && (
            <SvgIcon size={12} name='target-V4' color={iconColor} style={{ flexShrink: 0, pointerEvents: 'none' }} />
          )}
        </Badge>
      )}

      {/* Visual indication for static protected containers - only during drag */}
      {isStaticContainer && isDragInProgress && <ProtectedBadge>PROTECTED</ProtectedBadge>}
    </>
  );
};

export const ComponentVisualFeedback = React.memo(ComponentVisualFeedbackInner);
ComponentVisualFeedback.displayName = 'ComponentVisualFeedback';
