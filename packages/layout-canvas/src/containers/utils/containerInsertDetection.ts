import type { ResponsiveComponent } from '../../rgl-integration/types';
import type { InsertModeState } from '../../hooks/useCanvasDragState';
import { detectInsertPosition, calculateInsertIndicator } from '../../utils/insertDetection';

/**
 * Grid metrics for container insert detection calculations.
 */
export interface ContainerGridMetrics {
  colWidth: number;
  containerCols: number;
  containerPadding: number;
}

/**
 * Compute container grid metrics from container configuration and effective width.
 */
export const computeContainerGridMetrics = (params: {
  containerCols: number;
  containerPadding: number;
  effectiveWidth: number;
}): ContainerGridMetrics => {
  const containerCols = Math.max(1, params.containerCols);
  const containerPadding = params.containerPadding;
  const effectiveWidth = Math.max(1, params.effectiveWidth - containerPadding * 2);
  const colWidth = effectiveWidth / containerCols;

  return { colWidth, containerCols, containerPadding };
};

/**
 * Layout item shape used for insert detection (matches insertDetection expectations).
 */
export interface InsertLayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Build layout items from ResponsiveComponent array for insert detection.
 * Optionally excludes a component by ID (e.g., the one being dragged).
 */
export const buildLayoutItemsFromComponents = (
  components: ResponsiveComponent[],
  excludeId?: string,
): InsertLayoutItem[] => {
  const filtered = excludeId ? components.filter((comp) => comp.id !== excludeId) : components;
  return filtered.map((comp) => ({
    i: comp.id,
    x: Number(comp.x) || 0,
    y: Number(comp.y) || 0,
    w: Number(comp.width) || 1,
    h: Number(comp.height) || 1,
  }));
};

/**
 * Parameters for computing insert detection within a container.
 */
export interface ComputeInsertDetectionParams {
  mouseX: number;
  mouseY: number;
  draggedWidth: number;
  draggedHeight: number;
  layoutItems: InsertLayoutItem[];
  rowHeight: number;
  colWidth: number;
  containerCols: number;
  containerPadding: number;
  rglElement: HTMLElement | null;
  components: { id: string; width: number }[];
}

/**
 * Compute insert detection for a container.
 * Returns an InsertModeState if a push insertion would occur, or null otherwise.
 */
export const computeInsertDetection = (params: ComputeInsertDetectionParams): InsertModeState | null => {
  const {
    mouseX,
    mouseY,
    draggedWidth,
    draggedHeight,
    layoutItems,
    rowHeight,
    colWidth,
    containerCols,
    containerPadding,
    rglElement,
    components,
  } = params;

  const insertPosition = detectInsertPosition(
    mouseX,
    mouseY,
    draggedWidth,
    draggedHeight,
    layoutItems,
    rowHeight,
    colWidth,
    containerCols,
    mouseY,
    mouseX,
  );

  if (insertPosition.wouldCausePush && rglElement) {
    const indicator = calculateInsertIndicator({
      insertPosition,
      draggedWidth,
      rowHeight,
      fallbackColWidth: colWidth,
      containerPadding,
      rglElement,
      components,
    });
    return indicator;
  }

  return null;
};
