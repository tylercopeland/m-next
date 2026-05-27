import React, { useCallback, useEffect } from 'react';

export interface UseContainerPreemptiveEventHandlersParams {
  containerId: string;
  isDraggable: boolean;
  isMountedRef: React.RefObject<boolean>;
  setIsContainerDragEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  clearHoveredComponent: () => void;
}

const INTERACTIVE_ELEMENT_SELECTOR = [
  'input',
  'select',
  'textarea',
  'button',
  'a[href]',
  '.dd-wrapper',
  '.dtp-wrapper',
  '.btn-group-wrapper',
  '.sync-widget',
  '.adr-wrapper',
  '[role="button"]',
  '[role="link"]',
  '[role="menu"]',
  '[role="menuitem"]',
  '[role="option"]',
  '[role="combobox"]',
  '[role="listbox"]',
  '[role="textbox"]',
  '[contenteditable="true"]',
  '[data-no-container-drag]',
  '[data-no-drag]',
].join(', ');

/**
 * Container-scoped preemptive event handling for container grids.
 *
 * Mirrors the outer-canvas preemptive interaction pattern:
 * - Enables container dragging only when user starts drag on empty container background
 * - Clears child hover when pointer is over container background
 * - Resets drag-enabled state on pointer release
 */
export function useContainerPreemptiveEventHandlers({
  containerId,
  isDraggable,
  isMountedRef,
  setIsContainerDragEnabled,
  clearHoveredComponent,
}: UseContainerPreemptiveEventHandlersParams): void {
  const updateContainerDragEnablement = useCallback(
    (targetElement: Element | null) => {
      if (!targetElement) {
        setIsContainerDragEnabled(false);
        return;
      }

      const isOnChildComponent = targetElement.closest('.nested-drag-handle');
      const isOnContainer = targetElement.closest('.layout-container-wrapper');
      const isInteractiveTarget = targetElement.closest(INTERACTIVE_ELEMENT_SELECTOR);

      setIsContainerDragEnabled(Boolean(isOnContainer && !isOnChildComponent && !isInteractiveTarget && isDraggable));
    },
    [isDraggable, setIsContainerDragEnabled],
  );

  const handlePreemptiveMouseDown = useCallback(
    (e: Event) => {
      if (!isMountedRef.current) return;

      const targetElement = e.target instanceof Element ? e.target : null;
      updateContainerDragEnablement(targetElement);
    },
    [isMountedRef, updateContainerDragEnablement],
  );

  const handlePreemptiveTouchStart = useCallback(
    (e: Event) => {
      if (!isMountedRef.current) return;

      const targetElement = e.target instanceof Element ? e.target : null;
      updateContainerDragEnablement(targetElement);
    },
    [isMountedRef, updateContainerDragEnablement],
  );

  const handlePreemptiveMouseUp = useCallback(() => {
    if (!isMountedRef.current) return;
    setIsContainerDragEnabled(false);
  }, [isMountedRef, setIsContainerDragEnabled]);

  const handlePreemptiveMouseMove = useCallback(
    (e: Event) => {
      if (!isMountedRef.current) return;

      if (!(e.target instanceof Element)) return;
      const targetElement = e.target;
      const isOnChildComponent = targetElement.closest('.nested-drag-handle');
      const isOnContainer = targetElement.closest('.layout-container-wrapper');

      if (isOnContainer && !isOnChildComponent) {
        clearHoveredComponent();
      }
    },
    [isMountedRef, clearHoveredComponent],
  );

  useEffect(() => {
    const containerElement = document.querySelector(`[data-container-id="${containerId}"]`);
    if (!containerElement) return undefined;
    const captureOptions: AddEventListenerOptions = { capture: true };
    const passiveCaptureOptions: AddEventListenerOptions = { capture: true, passive: true };

    containerElement.addEventListener('mousedown', handlePreemptiveMouseDown, captureOptions);
    containerElement.addEventListener('touchstart', handlePreemptiveTouchStart, passiveCaptureOptions);
    containerElement.addEventListener('mousemove', handlePreemptiveMouseMove, captureOptions);
    document.addEventListener('mouseup', handlePreemptiveMouseUp, captureOptions);
    document.addEventListener('touchend', handlePreemptiveMouseUp, passiveCaptureOptions);

    return () => {
      containerElement.removeEventListener('mousedown', handlePreemptiveMouseDown, captureOptions);
      containerElement.removeEventListener('touchstart', handlePreemptiveTouchStart, passiveCaptureOptions);
      containerElement.removeEventListener('mousemove', handlePreemptiveMouseMove, captureOptions);
      document.removeEventListener('mouseup', handlePreemptiveMouseUp, captureOptions);
      document.removeEventListener('touchend', handlePreemptiveMouseUp, passiveCaptureOptions);
    };
  }, [
    containerId,
    handlePreemptiveMouseDown,
    handlePreemptiveTouchStart,
    handlePreemptiveMouseMove,
    handlePreemptiveMouseUp,
  ]);
}
