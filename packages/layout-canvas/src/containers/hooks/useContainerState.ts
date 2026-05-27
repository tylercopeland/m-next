import React, { useState, useCallback } from 'react';
import type { ResponsiveComponent } from '../../rgl-integration/types';

/**
 * Hook for managing container visual state (hover, selection, collapse, drag-over).
 */
export const useContainerState = (
  containerId: string,
  childComponents: ResponsiveComponent[],
  selectedComponentId?: string,
) => {
  // Track mounted state to prevent updates after unmount
  const isMountedRef = React.useRef(true);

  React.useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const isSelected = selectedComponentId === containerId;
  const isEmpty = childComponents.length === 0;

  const visualState = {
    isHovered,
    isSelected,
    isCollapsed,
    isDragOver,
    isEmpty,
  };

  const toggleCollapse = useCallback(() => {
    if (isMountedRef.current) {
      setIsCollapsed((prev) => !prev);
    }
  }, []);

  const setHovered = useCallback((hovered: boolean) => {
    if (isMountedRef.current) {
      setIsHovered(hovered);
    }
  }, []);

  const setDragOver = useCallback((dragOver: boolean) => {
    if (isMountedRef.current) {
      setIsDragOver(dragOver);
    }
  }, []);

  return {
    visualState,
    toggleCollapse,
    setHovered,
    setDragOver,
  };
};
