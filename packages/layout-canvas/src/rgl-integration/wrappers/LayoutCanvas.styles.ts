import styled from '@emotion/styled';
import { colors } from '@m-next/styles';
import { Z_CANVAS, Z_COMPONENT, Z_UI } from '../../constants/zIndex';

/**
 * Styled components for LayoutCanvas
 * Extracted from inline styles to follow m-one component pattern
 */

// Main canvas wrapper
export const CanvasWrapper = styled.div<{
  isCanvasSelected: boolean;
  mode?: 'designer' | 'runtime';
}>`
  position: relative;
  background-color: #ffffff;
  border: ${({ isCanvasSelected }) => (isCanvasSelected ? `1px solid ${colors.blue}` : `1px solid ${colors.white}`)};
  box-shadow: ${({ mode }) => (mode === 'runtime' ? 'none' : '0 2px 4px 0 rgba(0, 0, 0, 0.10)')};
  overflow-y: ${({ mode }) => (mode === 'runtime' ? 'visible' : 'auto')};
  height: 100%;

  /* Hide RGL placeholder when insert mode is active (showing insert line instead) */
  &.insert-mode-active .react-grid-placeholder {
    opacity: 0 !important;
    visibility: hidden !important;
  }

  /* 🔧 STRONGER FIX: Disable entire canvas wrapper when action editor is open */
  body:has(.mi-ae-framework-open) & {
    pointer-events: none !important;

    /* Lower z-index of all children to ensure nothing appears above action editor */
    * {
      z-index: auto !important;
    }
  }
`;

// Empty canvas guidance
export const EmptyCanvasWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  width: 320px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
  pointer-events: none;
  z-index: ${Z_UI.EMPTY_CANVAS};
`;

export const EmptyCanvasText = styled.div`
  align-self: stretch;
  color: #9aacb4;
  text-align: center;
  font-feature-settings:
    'liga' off,
    'clig' off;
  font-family: Source Sans Pro;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 32px;
`;

// Component wrapper - the main wrapper for each grid item
export const ComponentWrapper = styled.div<{
  isInContainer: boolean;
  handleColor: string;
}>`
  width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer;
  overflow: visible;
  --handle-color: ${({ handleColor }) => handleColor};
  opacity: ${({ isInContainer }) => (isInContainer ? 0.95 : 1)};
  z-index: ${({ isInContainer }) => (isInContainer ? Z_CANVAS.CONTAINER : Z_CANVAS.ITEM_NORMAL)};
`;

export const CollapsedLabelWrapper = styled.div`
  width: 100%;
  min-height: 4px;
  height: 4px; /* Fixed height for gridline label */
  background-color: ${colors['grey-mid']};
  cursor: pointer;
  transition: background-color 0.15s ease;

  /* Ensure it's draggable by RGL */
  position: relative;

  &.drag-handle {
    cursor: grab;

    &:active {
      cursor: grabbing;
    }
  }

  &.hovered {
    background-color: ${colors['blue']};
  }

  &.selected {
    background-color: ${colors['blue']};
  }
`;

export const CollapsedLabelContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  pointer-events: none; /* Let clicks pass through to wrapper */
`;

export const CollapsedLabelIcon = styled.span`
  font-size: 16px;
  line-height: 1;
  opacity: 0.6;
`;

export const CollapsedLabelText = styled.span`
  font-size: 12px;
  color: #666;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// Visual feedback components - re-exported from shared module
export {
  BorderOverlay,
  DashedBorderOverlay,
  Badge,
  BadgeText,
  HiddenBadge,
  UnconfiguredBadge,
} from '../../shared/VisualFeedback.styles';

// Protected container badge
export const ProtectedBadge = styled.div`
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

// Invalid drop overlay - shown on dragged container when over invalid target
export const InvalidDropOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 0, 0, 0.1);
  border: 2px dashed ${colors.red};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: ${Z_COMPONENT.INVALID_DROP_OVERLAY};
`;

export const InvalidDropText = styled.div`
  background: ${colors.red};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

// Fallback component wrapper
export const FallbackWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  color: #856404;
  font-size: 12px;
  text-align: center;
  border-radius: 4px;
  cursor: pointer;
`;

export const FallbackText = styled.div`
  font-size: 12px;
`;

export const FallbackSubtext = styled.div`
  font-size: 10px;
  margin-top: 4px;
`;

/**
 * Custom styles for react-grid-layout resize handles
 * These styles override the default RGL handle styling
 */
export const rglCustomStyles = `
  /* Only apply to main canvas, not nested container layouts */
  .react-grid-layout:not(.nested-layout) {
    min-height: 100%;
    position: relative;
  }

  /* Completely hide and replace default RGL resize handle arrows */
  .react-resizable-handle::after,
  .react-resizable-handle::before {
    content: none !important;
    display: none !important;
  }

  /* Hide default RGL resize handle background */
  .react-resizable-handle,
  .nested-layout .react-resizable-handle {
    opacity: 0;
    transition: opacity 0.2s ease;
    background: none !important;
    background-image: none !important;
    background-position: unset !important;
    background-repeat: unset !important;
  }

  /* Ensure handles are positioned relative to the react-grid-item */
  .react-grid-item {
    position: relative;
    overflow: visible !important;
  }

  /* Lower z-index for hidden unselected components so badges appear above them */
  .react-grid-item:has(.hidden-unselected),
  .nested-layout .react-grid-item:has(.hidden-unselected) {
    z-index: ${Z_CANVAS.ITEM_NORMAL} !important;
  }

  /* Higher z-index for grid items at top row to allow bottom badge to show above items below */
  .react-grid-item.top-row,
  .nested-layout .react-grid-item.top-row {
    z-index: ${Z_CANVAS.ITEM_TOP_ROW} !important;
  }

  /* High z-index when component is selected */
  .react-grid-item.selected-item,
  .nested-layout .react-grid-item.selected-item {
    z-index: ${Z_CANVAS.ITEM_SELECTED} !important;
  }

  /* Highest z-index when component is hovered - badge appears above everything including selected */
  .react-grid-item.hovered,
  .nested-layout .react-grid-item.hovered {
    z-index: ${Z_CANVAS.ITEM_HOVERED} !important;
  }

  /* Badge-initiated drag: keep dragged item above hovered/selected siblings */
  .react-grid-item.react-draggable-dragging:has([data-component-id]),
  .nested-layout .react-grid-item.react-draggable-dragging:has([data-component-id]),
  .react-grid-item.is-being-dragged:has([data-component-id]),
  .nested-layout .react-grid-item.is-being-dragged:has([data-component-id]) {
    z-index: ${Z_CANVAS.ITEM_DRAGGED} !important;
  }
  /* 🔧 Z-INDEX FIX: Lower z-index when action editor is open to prevent SelectionIndicator from appearing above modal */
  body:has(.mi-ae-framework-open) .react-grid-item.selected-item,
  body:has(.mi-ae-framework-open) .nested-layout .react-grid-item.selected-item {
    z-index: 1 !important;
  }

  /* 🔧 STRONGER FIX: Completely disable ALL canvas interactions when action editor is open */
  body:has(.mi-ae-framework-open) .react-grid-layout,
  body:has(.mi-ae-framework-open) .nested-layout {
    pointer-events: none !important;
  }

  /* 🔧 STRONGER FIX: Disable hover z-index boost when action editor is open */
  body:has(.mi-ae-framework-open) .react-grid-item:hover,
  body:has(.mi-ae-framework-open) .nested-layout .react-grid-item:hover {
    z-index: 1 !important;
  }

  /* 🔧 STRONGER FIX: Hide all resize handles when action editor is open */
  body:has(.mi-ae-framework-open) .react-resizable-handle,
  body:has(.mi-ae-framework-open) .nested-layout .react-resizable-handle {
    display: none !important;
  }

  /* Elevate component z-index when it has focus (e.g., calendar/dropdown open) */
  .react-grid-item:has(.dtp-wrapper:focus-within),
  .nested-layout .react-grid-item:has(.dtp-wrapper:focus-within),
  .react-grid-item:has(.btn-group-wrapper:focus-within),
  .nested-layout .react-grid-item:has(.btn-group-wrapper:focus-within),
  .react-grid-item:has(.dd-wrapper:focus-within),
  .nested-layout .react-grid-item:has(.dd-wrapper:focus-within) {
    z-index: ${Z_CANVAS.ITEM_FOCUS_WITHIN} !important;
  }

  /* Also elevate when react-select menu is open (aria-expanded indicates open state) */
  .react-grid-item:has([aria-expanded="true"]),
  .nested-layout .react-grid-item:has([aria-expanded="true"]) {
    z-index: ${Z_CANVAS.ITEM_FOCUS_WITHIN} !important;
  }

  /* Hover border is now handled by React state in LayoutCanvas.tsx (lines 952-966) */
  /* This provides better control over when hover state should appear/disappear */

  /* Mark selected items with a class for easier :not() selector usage */
  .react-grid-item:has(.selected) {
    /* This selector adds specificity but the actual class .selected-item
       should be applied via JavaScript for cleaner :not() usage */
  }

  /* ✅ REMOVED: Fallback selected border - now exclusively handled by BorderOverlay component
     to prevent double borders. The BorderOverlay React component provides better control
     over selection styling and avoids CSS ::after conflicts with component wrappers */

  /* Show handles when component is selected */
  .selected .react-resizable-handle {
    opacity: 1 !important;
  }

  /* Show handles when component is hovered (controlled by React state via .hovered class) */
  .hovered .react-resizable-handle {
    opacity: 1 !important;
  }

  /* For nested layouts, ALWAYS hide handles by default - override ALL other rules */
  .nested-layout .react-grid-item .react-resizable-handle {
    opacity: 0 !important;
  }

  /* Prevent ANY hover state from affecting nested layouts */
  .nested-layout .react-grid-item:hover .react-resizable-handle,
  .nested-layout:hover .react-grid-item .react-resizable-handle {
    opacity: 0 !important;
  }

  /* ONLY show handles when explicitly selected or hovered (via React state classes) */
  .nested-layout .react-grid-item.selected .react-resizable-handle,
  .nested-layout .react-grid-item.hovered .react-resizable-handle {
    opacity: 1 !important;
  }

  /* Hide north/south handles for components that don't support height resizing */
  .height-fixed .react-resizable-handle-n,
  .height-fixed .react-resizable-handle-s,
  .nested-layout .height-fixed .react-resizable-handle-n,
  .nested-layout .height-fixed .react-resizable-handle-s {
    display: none !important;
  }

  /* Hide north handle (top) completely for ALL components */
  .react-resizable-handle-n,
  .nested-layout .react-resizable-handle-n {
    display: none !important;
  }

  /* South handle (bottom) - centered on grid item */
  .react-resizable-handle-s,
  .nested-layout .react-resizable-handle-s {
    position: absolute !important;
    width: 32px !important;
    height: 8px !important;
    bottom: -3px !important;
    left: 50% !important;
    right: auto !important;
    top: auto !important;
    margin-left: -16px !important;
    cursor: s-resize !important;
    background-color: ${colors.white} !important;
    border: 1px solid var(--handle-color, transparent) !important;
    border-radius: 100px !important;
    z-index: ${Z_COMPONENT.RESIZE_HANDLE} !important;
    transform: none !important;
  }

  /* East handle (right) - centered on grid item */
  .react-resizable-handle-e,
  .nested-layout .react-resizable-handle-e {
    position: absolute !important;
    width: 8px !important;
    height: 32px !important;
    right: -3px !important;
    top: 50% !important;
    bottom: auto !important;
    left: auto !important;
    margin-top: -16px !important;
    cursor: e-resize !important;
    background-color: ${colors.white} !important;
    border: 1px solid var(--handle-color, transparent) !important;
    border-radius: 100px !important;
    z-index: ${Z_COMPONENT.RESIZE_HANDLE} !important;
    transform: none !important;
  }

  /* West handle (left) - centered on grid item */
  .react-resizable-handle-w,
  .nested-layout .react-resizable-handle-w {
    position: absolute !important;
    width: 8px !important;
    height: 32px !important;
    left: -3px !important;
    right: auto !important;
    top: 50% !important;
    bottom: auto !important;
    margin-top: -16px !important;
    cursor: w-resize !important;
    background-color: ${colors.white} !important;
    border: 1px solid var(--handle-color, transparent) !important;
    border-radius: 100px !important;
    z-index: ${Z_COMPONENT.RESIZE_HANDLE} !important;
    transform: none !important;
  }

  /* Show "not-allowed" cursor when dragging container over invalid drop target */
  .react-grid-item.is-being-dragged.drag-handle {
    cursor: grabbing !important;
  }

  /* Invalid drop target indicator - red border */
  .react-grid-item.invalid-drop-target {
    cursor: not-allowed !important;
  }

  .react-grid-item.invalid-drop-target::before {
    content: '' !important;
    position: absolute !important;
    top: -2px !important;
    left: -2px !important;
    right: -2px !important;
    bottom: -2px !important;
    border: 2px solid ${colors.red} !important;
    border-radius: 4px !important;
    pointer-events: none !important;
    z-index: ${Z_COMPONENT.INVALID_DROP_OVERLAY} !important;
  }

  /* RGL placeholder (drop shadow) - blue border with semi-transparent background */
  .react-grid-placeholder {
    background: rgba(13, 113, 200, 0.25) !important; /* 25% opacity blue */
    border: 1px solid ${colors.blue || '#0D71C8'} !important; /* Solid blue border */
    opacity: 1 !important;
    transition-duration: 100ms !important;
    z-index: ${Z_CANVAS.PLACEHOLDER} !important;
    pointer-events: none !important;
  }

  .react-grid-layout.hide-drop-placeholder > .react-grid-item.react-grid-placeholder,
  .nested-layout.hide-drop-placeholder > .react-grid-item.react-grid-placeholder {
    display: none !important;
  }

  .react-grid-item.react-draggable-dragging,
  .nested-layout .react-grid-item.react-draggable-dragging {
    z-index: ${Z_CANVAS.RGL_DRAGGING} !important;
    opacity: 1 !important;
  }

  .nested-layout.cross-grid-drag-source {
    height: 100% !important;
    max-height: 100% !important;
    overflow: hidden !important;
  }

  .nested-layout.cross-grid-drag-source > .react-grid-item.react-draggable-dragging {
    /* Promote dragged source item above container clipping for cross-grid ejection. */
    position: fixed !important;
    left: var(--cross-grid-drag-client-x, -9999px) !important;
    top: var(--cross-grid-drag-client-y, -9999px) !important;
    transform: translate(-50%, -50%) !important;
    z-index: ${Z_CANVAS.CROSS_GRID_DRAG} !important;
    opacity: 1 !important;
    pointer-events: none !important;
    will-change: left, top, transform !important;
  }

  /* Runtime mode: Hide all resize handles and drag feedback for static components */
  .react-grid-item.static .react-resizable-handle,
  .nested-layout .react-grid-item.static .react-resizable-handle {
    display: none !important;
    opacity: 0 !important;
  }

  /* Runtime mode: Change cursor to default for static components */
  .react-grid-item.static {
    cursor: default !important;
  }

  /* Runtime mode: Prevent any drag feedback on static components */
  .react-grid-item.static.is-being-dragged {
    cursor: default !important;
  }
`;

/**
 * Injects custom RGL styles into the document head
 */
export const injectRGLStyles = () => {
  const styleId = 'rgl-custom-styles';

  // Check if styles are already injected
  if (document.getElementById(styleId)) {
    return;
  }

  // Create and inject style element
  const styleElement = document.createElement('style');
  styleElement.id = styleId;
  styleElement.textContent = rglCustomStyles;
  document.head.appendChild(styleElement);
};
