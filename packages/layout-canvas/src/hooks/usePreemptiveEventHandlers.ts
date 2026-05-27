import { useCallback, useEffect } from 'react';

export interface UsePreemptiveEventHandlersParams {
  /** Whether the canvas is in designer mode (draggable). No listeners attached when false. */
  isDraggable: boolean;

  /** Called when mousedown/touchstart on a grid item — receives the component ID from data-grid-item-id */
  onDragStart: (componentId: string) => void;

  /** Called when mouseup/touchend occurs — should clear drag-related CSS classes */
  onDragEnd: () => void;

  /** Called when a global dragend event fires — resets all drag states for palette drags */
  clearAllDragStates: () => void;

  /** Ref tracking whether the component is still mounted (prevents stale setState calls) */
  isMountedRef: React.RefObject<boolean>;
}

/**
 * Attaches capture-phase event listeners to the main canvas grid layout element
 * to pre-detect drag starts before React Grid Layout processes them.
 *
 * This is necessary for container collision protection: when a user starts dragging
 * a component, we need to immediately mark containers as static (non-draggable) to
 * prevent them from being pushed around by the dragged component. RGL's onDragStart
 * fires too late — by then, the collision has already occurred.
 *
 * Also attaches a global `dragend` listener to reliably clean up palette drag states,
 * since browser dragend events are more reliable than RGL's drop events for palette drags.
 */
export function usePreemptiveEventHandlers({
  isDraggable,
  onDragStart,
  onDragEnd,
  clearAllDragStates,
  isMountedRef,
}: UsePreemptiveEventHandlersParams): void {
  const handlePreemptiveMouseDown = useCallback(
    (e: Event) => {
      const mouseEvent = e as MouseEvent | TouchEvent;
      const targetElement = mouseEvent.target as HTMLElement;
      const gridItem = targetElement.closest('.react-grid-item');

      if (gridItem) {
        // Use CSS class instead of state to avoid re-renders
        document.body.classList.add('canvas-drag-in-progress');
        // Add drag class immediately on mouse down
        gridItem.classList.add('is-being-dragged');

        // Also track the component ID for section static behavior
        const componentId = gridItem.getAttribute('data-grid-item-id');
        if (componentId) {
          onDragStart(componentId);
        }
      }
    },
    [onDragStart],
  );

  const handlePreemptiveMouseUp = useCallback(() => {
    // Remove CSS class
    document.body.classList.remove('canvas-drag-in-progress');
    onDragEnd();
    // Remove drag class from all grid items
    document.querySelectorAll('.react-grid-item.is-being-dragged').forEach((item) => {
      item.classList.remove('is-being-dragged');
    });
  }, [onDragEnd]);

  // Attach pre-emptive event listeners to prevent container collision
  useEffect(() => {
    if (!isDraggable) return undefined;

    const gridElement = document.querySelector('.react-grid-layout');
    const captureOptions: AddEventListenerOptions = { capture: true };
    const passiveCaptureOptions: AddEventListenerOptions = { capture: true, passive: true };

    if (gridElement) {
      // Add event listeners with capture=true to intercept before RGL's handlers
      gridElement.addEventListener('mousedown', handlePreemptiveMouseDown, captureOptions);
      gridElement.addEventListener('touchstart', handlePreemptiveMouseDown, passiveCaptureOptions);
      document.addEventListener('mouseup', handlePreemptiveMouseUp, captureOptions);
      document.addEventListener('touchend', handlePreemptiveMouseUp, passiveCaptureOptions);

      return () => {
        gridElement.removeEventListener('mousedown', handlePreemptiveMouseDown, captureOptions);
        gridElement.removeEventListener('touchstart', handlePreemptiveMouseDown, passiveCaptureOptions);
        document.removeEventListener('mouseup', handlePreemptiveMouseUp, captureOptions);
        document.removeEventListener('touchend', handlePreemptiveMouseUp, passiveCaptureOptions);
      };
    }

    return undefined;
  }, [isDraggable, handlePreemptiveMouseDown, handlePreemptiveMouseUp]);

  // Global dragend listener — more reliable than RGL for palette drags
  useEffect(() => {
    if (!isDraggable) return undefined;

    const handleGlobalDragEnd = () => {
      if (!isMountedRef.current) return;
      clearAllDragStates();
    };

    document.addEventListener('dragend', handleGlobalDragEnd);

    return () => {
      document.removeEventListener('dragend', handleGlobalDragEnd);
    };
  }, [isDraggable, clearAllDragStates, isMountedRef]);
}
