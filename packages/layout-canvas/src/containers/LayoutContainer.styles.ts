import styled from '@emotion/styled';

/**
 * Styled components for LayoutContainer
 * Consolidates inline styles and container.styles.css
 */

// Main container wrapper
export const ContainerWrapper = styled.div<{
  isDragEnabled: boolean;
  showBorder?: boolean;
  showShadow?: boolean;
}>`
  display: flex;
  padding: ${({ showBorder }) => (showBorder ? '0px 8px 8px 8px' : '0px')};
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
  border-radius: ${({ showBorder }) => (showBorder ? '16px' : '0px')};
  background: var(--White, #fff);
  border: ${({ showBorder }) => (showBorder ? '1px solid var(--Grey-Grey-Light, #BACAD0)' : 'none')};
  box-shadow: ${({ showShadow }) => (showShadow ? '0 2px 4px 0 rgba(0, 0, 0, 0.10)' : 'none')};
  position: relative;
  width: 100%;
  height: 100%;
  cursor: ${({ isDragEnabled }) => (isDragEnabled ? 'move' : 'default')};
`;

// Drop zone for nested components
export const DropZone = styled.div<{
  isDragOver: boolean;
  isHovered: boolean;
  isEmpty?: boolean;
  suppressInternalScroll?: boolean;
  mode?: 'designer' | 'runtime';
}>`
  width: 100%;
  flex: 1;
  min-height: 0;
  position: relative;
  /* Keep container internals clipped during cross-grid drag. Dragged popout is handled by floating drag item CSS. */
  overflow-y: ${({ isEmpty, suppressInternalScroll, mode }) =>
    mode === 'runtime' ? 'visible' : isEmpty ? 'hidden' : suppressInternalScroll ? 'hidden' : 'auto'};
  overflow-x: ${({ mode }) => (mode === 'runtime' ? 'visible' : 'hidden')};
  border: none;
  background-color: transparent;
  transition: none;
`;

// Nested grid layout wrapper
export const NestedGridWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

// Empty state text - responsive to container height
export const EmptyStateText = styled.div<{
  isCompact?: boolean;
}>`
  color: #9aacb4;
  text-align: center;
  font-feature-settings:
    'liga' off,
    'clig' off;
  font-family: 'Source Sans Pro';
  font-size: ${({ isCompact }) => (isCompact ? '14px' : '18px')};
  font-style: normal;
  font-weight: 600;
  line-height: ${({ isCompact }) => (isCompact ? '18px' : '24px')};
  width: ${({ isCompact }) => (isCompact ? 'auto' : '210px')};
  height: ${({ isCompact }) => (isCompact ? 'auto' : '48px')};
  max-width: 100%;
  padding: ${({ isCompact }) => (isCompact ? '4px 8px' : '0')};
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: ${({ isCompact }) => (isCompact ? 'nowrap' : 'normal')};
`;

// Nested component wrapper
export const NestedComponentWrapper = styled.div<{
  handleColor: string;
}>`
  width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer;
  overflow: visible;
  --handle-color: ${({ handleColor }) => handleColor};
`;

// Visual feedback components - re-exported from shared module
export {
  BorderOverlay,
  DashedBorderOverlay,
  Badge,
  BadgeText,
  HiddenBadge,
  UnconfiguredBadge,
} from '../shared/VisualFeedback.styles';

// Render content wrapper with pointer-events conditionally disabled
// In designer mode: disabled (prevents clicking during drag/selection)
// In runtime mode: enabled (allows normal interaction with components)
// 🔧 FIX: Added !important to override HtmlEditor and other complex components' internal styles
// 🔧 FIX: Added width/height 100% to ensure content fills the grid cell
export const RenderContentWrapper = styled.div<{
  enablePointerEvents?: boolean;
  allowDesignerDropdownInteractions?: boolean;
}>`
  width: 100%;
  height: 100%;
  pointer-events: ${({ enablePointerEvents }) => (enablePointerEvents ? 'auto' : 'none')} !important;

  /* Ensure all children inherit the pointer-events setting */
  & * {
    pointer-events: ${({ enablePointerEvents }) => (enablePointerEvents ? 'auto' : 'none')} !important;
  }

  /* In designer mode, keep interactive component menus enabled while other controls stay drag-first. */
  ${({ enablePointerEvents, allowDesignerDropdownInteractions }) =>
    !enablePointerEvents && allowDesignerDropdownInteractions
      ? `
    .dd-wrapper,
    .dd-wrapper *,
    .btn-group-wrapper,
    .btn-group-wrapper *,
    .sync-widget,
    .sync-widget *,
    .adr-wrapper,
    .adr-wrapper * {
      pointer-events: auto !important;
    }
  `
      : ''}
`;

// Container variants from container.styles.css
export const LayoutContainerBase = styled.div`
  position: relative;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #ffffff;
  min-height: 100px;
  transition: all 0.2s ease;

  &.container-selected {
    border-color: #4299e1;
    box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.2);
  }

  &.container-hovered {
    border-color: #a0aec0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &.container-drag-over {
    border-color: #48bb78;
    background-color: #f0fff4;
  }

  &.container-empty {
    border-style: dashed;
    border-color: #cbd5e0;
  }

  &.container-card {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &.container-panel {
    background: #f7fafc;
    border-color: #cbd5e0;
  }

  &.container-group {
    background: #f0fff4;
    border-color: #9ae6b4;
  }

  &.container-minimal {
    border: none;
    background: transparent;
  }

  &.container-collapsed .container-content {
    display: none;
  }

  &.container-collapsed .container-children {
    display: none;
  }

  @media (max-width: 768px) {
    .container-header {
      padding: 6px 8px;
    }

    .container-title {
      font-size: 12px;
    }

    .container-content {
      padding: 6px;
    }
  }
`;

export const ContainerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
  border-radius: 8px 8px 0 0;

  .container-minimal & {
    background: transparent;
    border-bottom: none;
    padding: 4px 0;
  }
`;

export const ContainerTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #2d3748;
`;

export const ContainerCollapseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: #718096;
  transition: color 0.2s ease;

  &:hover {
    color: #4299e1;
    background: #edf2f7;
  }
`;

export const ContainerContent = styled.div`
  padding: 8px;
  min-height: 60px;
`;

export const ContainerChildren = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ContainerChild = styled.div`
  position: relative;
`;

export const ContainerEmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  color: #a0aec0;
`;

export const EmptyStateContent = styled.div`
  text-align: center;
`;

export const EmptyStateIcon = styled.div`
  font-size: 24px;
  margin-bottom: 4px;
`;

export const EmptyStateTextAlt = styled.div`
  font-size: 12px;
`;

export const ContainerDropZone = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(72, 187, 120, 0.1);
  border: 2px dashed #48bb78;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const DropZoneIndicator = styled.div`
  background: #48bb78;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 14px;
`;

// Header for container (when Show header is enabled)
export const Header = styled.div<{ isDisabled?: boolean }>`
  display: flex;
  padding: 8px;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  width: 100%;
  position: relative;
  padding-bottom: 10px;
  margin-bottom: -10px;
  color: var(--Grey-Grey-Darker, #0f1b31);
  font-feature-settings:
    'liga' off,
    'clig' off;
  font-family: 'Source Sans Pro';
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;
  background: transparent;
  opacity: ${({ isDisabled }) => (isDisabled ? 0.5 : 1)};

  &::after {
    content: '';
    position: absolute;
    left: -8px;
    bottom: 0;
    width: calc(100% + 16px);
    height: 0;
    border-bottom: 1px solid #bacad0;
    box-sizing: content-box;
  }
`;
