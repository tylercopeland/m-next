/**
 * Insert Detection
 *
 * Detects when a drag operation would trigger insert mode
 * and calculates the insert indicator position.
 *
 * @see [Layout] Vertical Push - Insert (MVP)
 */

import { LayoutItem } from './verticalPushCalculator';

export interface InsertPosition {
  /** Target row for insertion */
  row: number;
  /** Target column for insertion */
  col: number;
  /** Whether insert would cause push (collision exists) */
  wouldCausePush: boolean;
  /** Y position in pixels for the indicator line */
  indicatorY: number;
  /** X position in pixels for the indicator line */
  indicatorX: number;
  /** IDs of components that would be pushed */
  componentsToPush: string[];
}

/**
 * Detect insert position based on mouse coordinates with boundary snapping.
 *
 * Insert mode activates when:
 * 1. Mouse is over an existing component
 * 2. Placing a component there would collide and need to push others down
 *
 * Gap-aware behavior:
 * - If the pointer is in a real gap between two horizontally-overlapping components,
 *   and the dragged item is too tall for that gap (so placement at current row collides),
 *   insert mode can activate at the in-between row (not just boundary edges).
 *
 * Boundary Snapping:
 * - Instead of allowing insert at any row, snaps to component boundaries
 * - Valid insertion points are: top/bottom edges of horizontally overlapping components
 * - This makes the insert feel more natural and predictable
 *
 * @param mouseX - Mouse X position relative to canvas (pixels)
 * @param mouseY - Candidate top Y position of the dragged item (pixels)
 * @param draggedWidth - Width of component being dragged (columns)
 * @param draggedHeight - Height of component being dragged (rows)
 * @param layout - Current layout items
 * @param rowHeight - Height of each row (pixels)
 * @param colWidth - Width of each column (pixels)
 * @param cols - Total number of columns in grid
 * @param rawMouseY - Optional: Actual mouse Y position for tall component half-detection
 * @param rawMouseX - Optional: Actual mouse X position for pointer-over-target gating
 */
export function detectInsertPosition(
  mouseX: number,
  mouseY: number,
  draggedWidth: number,
  draggedHeight: number,
  layout: LayoutItem[],
  rowHeight: number,
  colWidth: number,
  cols: number,
  rawMouseY?: number,
  rawMouseX?: number,
): InsertPosition {
  const pointerXEdgeTolerancePx = Math.max(4, Math.round(colWidth * 0.2));

  // Convert mouse position to grid coordinates
  const mouseRow = Math.max(0, Math.floor(mouseY / rowHeight));
  const mouseCol = Math.floor(mouseX / colWidth);
  const targetCol = Math.max(0, Math.min(mouseCol, cols - draggedWidth));
  console.log('mouseCol:', mouseCol, 'targetCol:', targetCol);
  const referenceRow = rawMouseY !== undefined ? Math.max(0, Math.floor(rawMouseY / rowHeight)) : mouseRow;

  // If layout is empty, no collision possible
  if (layout.length === 0) {
    return {
      row: mouseRow,
      col: targetCol,
      wouldCausePush: false,
      indicatorY: mouseRow * rowHeight,
      indicatorX: targetCol * colWidth,
      componentsToPush: [],
    };
  }
  const overlapsHorizontally = (item: LayoutItem): boolean =>
    item.x < targetCol + draggedWidth && item.x + item.w > targetCol;
  const collidesAtRow = (item: LayoutItem, row: number): boolean =>
    overlapsHorizontally(item) && item.y < row + draggedHeight && item.y + item.h > row;
  const horizontallyOverlappingItems = layout.filter(overlapsHorizontally);

  const isInsideAnyOverlappingItem = (row: number): boolean =>
    horizontallyOverlappingItems.some((item) => row > item.y && row < item.y + item.h);
  const pointerCol = rawMouseX !== undefined ? Math.floor(rawMouseX / colWidth) : null;
  const pointerOverItemColumns = (item: LayoutItem): boolean => {
    if (rawMouseX === undefined) {
      return true;
    }
    const itemLeftPx = item.x * colWidth;
    const itemRightPx = (item.x + item.w) * colWidth;
    const insideItemBounds = rawMouseX >= itemLeftPx && rawMouseX < itemRightPx;
    if (insideItemBounds) {
      return true;
    }
    // Tolerance is only for slight-outside offsets; exact boundary should remain neutral.
    const withinLeftEdgeTolerance = rawMouseX >= itemLeftPx - pointerXEdgeTolerancePx && rawMouseX < itemLeftPx;
    const withinRightEdgeTolerance = rawMouseX > itemRightPx && rawMouseX < itemRightPx + pointerXEdgeTolerancePx;
    return withinLeftEdgeTolerance || withinRightEdgeTolerance;
  };
  const pointerOverItems =
    pointerCol === null
      ? horizontallyOverlappingItems.filter((item) => referenceRow >= item.y && referenceRow < item.y + item.h)
      : horizontallyOverlappingItems.filter(
          (item) => pointerOverItemColumns(item) && referenceRow >= item.y && referenceRow < item.y + item.h,
        );
  const collidingAtMouseRow = horizontallyOverlappingItems.filter((item) => collidesAtRow(item, mouseRow));
  const collidingAtReferenceRow =
    referenceRow === mouseRow
      ? collidingAtMouseRow
      : horizontallyOverlappingItems.filter((item) => collidesAtRow(item, referenceRow));

  // Allow insertion while hovering between components when the dragged item would still collide.
  // This covers "gap smaller than dragged height" cases where boundary-only snapping feels wrong.
  const isPointerInGapBetweenOverlappingItems = (() => {
    const pointerWithinOverlappingColumns =
      pointerCol === null ? true : horizontallyOverlappingItems.some((item) => pointerOverItemColumns(item));
    if (!pointerWithinOverlappingColumns) {
      return false;
    }
    if (pointerOverItems.length > 0 || horizontallyOverlappingItems.length === 0) {
      return false;
    }

    // Treat the canvas top edge as a virtual boundary so "top gap" insert mode can work
    // when a tall dragged item does not fit between row 0 and the first component.
    let nearestAboveBottom = 0;
    let hasActualAboveBoundary = false;
    let nearestBelowTop = Number.POSITIVE_INFINITY;
    horizontallyOverlappingItems.forEach((item) => {
      const itemBottom = item.y + item.h;
      if (itemBottom <= referenceRow && itemBottom > nearestAboveBottom) {
        nearestAboveBottom = itemBottom;
        hasActualAboveBoundary = true;
      }
      if (item.y >= referenceRow && item.y < nearestBelowTop) {
        nearestBelowTop = item.y;
      }
    });

    const isInGap =
      nearestBelowTop < Number.POSITIVE_INFINITY &&
      referenceRow >= nearestAboveBottom &&
      referenceRow < nearestBelowTop;
    if (!isInGap) {
      return false;
    }

    if (hasActualAboveBoundary) {
      return true;
    }

    // Top-edge gap: only treat as insert gap when the total space from row 0 to the first
    // component is shorter than the dragged item. Otherwise keep normal placeholder behavior
    // while approaching the first component from above.
    const topGapHeight = nearestBelowTop;
    return topGapHeight < draggedHeight;
  })();

  // Insert mode only when pointer is actually over an overlapping component.
  // If we're just near an edge (not over and not in a true gap), keep normal placeholder behavior.
  if (pointerOverItems.length === 0 && !isPointerInGapBetweenOverlappingItems) {
    return {
      row: mouseRow,
      col: targetCol,
      wouldCausePush: false,
      indicatorY: mouseRow * rowHeight,
      indicatorX: targetCol * colWidth,
      componentsToPush: [],
    };
  }

  const usingGapCollisionFallback =
    isPointerInGapBetweenOverlappingItems && collidingAtMouseRow.length === 0 && collidingAtReferenceRow.length > 0;
  const collidingAtProbeRow = usingGapCollisionFallback ? collidingAtReferenceRow : collidingAtMouseRow;

  // No collision at hover row = no insert mode needed
  if (collidingAtProbeRow.length === 0) {
    return {
      row: mouseRow,
      col: targetCol,
      wouldCausePush: false,
      indicatorY: mouseRow * rowHeight,
      indicatorX: targetCol * colWidth,
      componentsToPush: [],
    };
  }
  // Boundary snapping: only derive candidates from components that currently collide.
  const insertionPoints = new Set<number>([0]); // Always allow row 0
  collidingAtProbeRow.forEach((item) => {
    insertionPoints.add(item.y); // Top edge
    insertionPoints.add(item.y + item.h); // Bottom edge
    // Edge-to-edge above this component (dragged bottom touches component top)
    const edgeToEdgeAbove = item.y - draggedHeight;
    if (edgeToEdgeAbove >= 0) {
      insertionPoints.add(edgeToEdgeAbove);
    }
  });
  // In true-gap scenarios, allow the in-between hover row directly.
  const gapHoverRow = usingGapCollisionFallback ? referenceRow : mouseRow;
  if (isPointerInGapBetweenOverlappingItems && !isInsideAnyOverlappingItem(gapHoverRow)) {
    insertionPoints.add(gapHoverRow);
  }
  // Also allow dropping below all overlapping columns.
  const maxY = Math.max(0, ...horizontallyOverlappingItems.map((item) => item.y + item.h));
  insertionPoints.add(maxY);
  // Snap to nearest insertion point based on hover row.
  const sortedPoints = Array.from(insertionPoints).sort((a, b) => a - b);
  const snapReferenceRow = usingGapCollisionFallback ? referenceRow : mouseRow;
  let snappedRow = sortedPoints.reduce((nearest, point) =>
    Math.abs(point - snapReferenceRow) < Math.abs(nearest - snapReferenceRow) ? point : nearest,
  );

  // If candidate top row is above a colliding target, prefer an exact edge-to-edge-above
  // placement when that row is valid and non-colliding. This keeps placeholder mode while
  // approaching from above (prevents premature insert indicator one row before touching).
  const preferredEdgeAboveRows = (usingGapCollisionFallback ? [] : collidingAtProbeRow)
    .filter((item) => mouseRow < item.y)
    .map((item) => item.y - draggedHeight)
    .filter((row) => row >= 0)
    .filter((row) => !horizontallyOverlappingItems.some((item) => collidesAtRow(item, row)));

  if (preferredEdgeAboveRows.length > 0) {
    snappedRow = preferredEdgeAboveRows.reduce((nearest, row) =>
      Math.abs(row - mouseRow) < Math.abs(nearest - mouseRow) ? row : nearest,
    );
  }
  // Tall component half-detection: use actual pointer row when available.
  if (rawMouseY !== undefined) {
    const tallComponentMouseIsIn = pointerOverItems.find(
      (item) => item.h >= draggedHeight * 3 && referenceRow >= item.y && referenceRow < item.y + item.h,
    );
    if (tallComponentMouseIsIn) {
      const componentMidpoint = tallComponentMouseIsIn.y + tallComponentMouseIsIn.h / 2;
      snappedRow =
        referenceRow >= componentMidpoint
          ? tallComponentMouseIsIn.y + tallComponentMouseIsIn.h
          : tallComponentMouseIsIn.y;
    }
  }
  // Guardrail: never allow a snap point that lands inside an existing component.
  const insideItems = horizontallyOverlappingItems.filter(
    (item) => snappedRow > item.y && snappedRow < item.y + item.h,
  );
  if (insideItems.length > 0) {
    const boundaryPoints = new Set<number>();
    insideItems.forEach((item) => {
      boundaryPoints.add(item.y);
      boundaryPoints.add(item.y + item.h);
    });
    const sortedBoundaries = Array.from(boundaryPoints).sort((a, b) => a - b);
    if (sortedBoundaries.length > 0) {
      snappedRow = sortedBoundaries.reduce((nearest, point) =>
        Math.abs(point - referenceRow) < Math.abs(nearest - referenceRow) ? point : nearest,
      );
    }
  }
  // Check if snapped position would cause collision
  let collidingComponents = horizontallyOverlappingItems.filter((item) => collidesAtRow(item, snappedRow));

  // If we snapped to a non-colliding boundary (e.g., bottom edge with free space),
  // prefer a colliding boundary only when the snapped placement is not a valid
  // edge-to-edge-above placement.
  // This prevents false insert activation while approaching a target from above.
  const pointerTopRow = pointerOverItems.length > 0 ? Math.min(...pointerOverItems.map((item) => item.y)) : null;
  const isNonCollidingPlacementAbovePointerItems =
    pointerTopRow !== null && snappedRow + draggedHeight <= pointerTopRow;
  const isAtBottomEdgeOfPointerItem = pointerOverItems.some(
    (item) => referenceRow >= item.y + item.h - 1 && snappedRow === item.y + item.h,
  );
  if (
    collidingComponents.length === 0 &&
    pointerOverItems.length > 0 &&
    !isNonCollidingPlacementAbovePointerItems &&
    !isAtBottomEdgeOfPointerItem
  ) {
    const collisionRows = sortedPoints.filter(
      (row) =>
        !isInsideAnyOverlappingItem(row) && horizontallyOverlappingItems.some((item) => collidesAtRow(item, row)),
    );
    if (collisionRows.length > 0) {
      snappedRow = collisionRows.reduce((nearest, point) =>
        Math.abs(point - referenceRow) < Math.abs(nearest - referenceRow) ? point : nearest,
      );
      collidingComponents = horizontallyOverlappingItems.filter((item) => collidesAtRow(item, snappedRow));
    }
  }

  const wouldCausePush = collidingComponents.length > 0;

  return {
    row: snappedRow,
    col: targetCol,
    wouldCausePush,
    indicatorY: snappedRow * rowHeight,
    indicatorX: targetCol * colWidth,
    componentsToPush: collidingComponents.map((c) => c.i),
  };
}

/**
 * Calculate indicator width based on dragged component.
 * Width = component width in columns × column width in pixels
 *
 * @param draggedWidthCols - Width of dragged component (columns)
 * @param colWidth - Width of each column (pixels)
 */
export function calculateIndicatorWidth(draggedWidthCols: number, colWidth: number): number {
  return draggedWidthCols * colWidth;
}

/**
 * Snap mouse position to grid coordinates.
 * Useful for getting the exact grid cell the mouse is over.
 *
 * @param mouseX - Mouse X position (pixels)
 * @param mouseY - Mouse Y position (pixels)
 * @param rowHeight - Row height (pixels)
 * @param colWidth - Column width (pixels)
 * @param cols - Total columns
 */
export function snapToGrid(
  mouseX: number,
  mouseY: number,
  rowHeight: number,
  colWidth: number,
  cols: number,
): { row: number; col: number } {
  return {
    row: Math.max(0, Math.floor(mouseY / rowHeight)),
    col: Math.max(0, Math.min(Math.floor(mouseX / colWidth), cols - 1)),
  };
}

export interface InsertIndicatorState {
  isActive: boolean;
  indicatorX: number;
  indicatorY: number;
  indicatorWidth: number;
  targetRow: number;
  targetCol: number;
}

export interface CalculateInsertIndicatorParams {
  insertPosition: InsertPosition;
  draggedWidth: number;
  rowHeight: number;
  fallbackColWidth: number;
  containerPadding?: number;
  rglElement: Element;
  components: Array<{ id: string; width: number }>;
}

/**
 * Calculate insert indicator position and width by measuring actual rendered grid items.
 * This ensures the indicator aligns perfectly with the visual grid.
 *
 * @param params - Parameters for calculating the indicator state
 * @returns The indicator state with position and dimensions
 */
export function calculateInsertIndicator(params: CalculateInsertIndicatorParams): InsertIndicatorState {
  const {
    insertPosition,
    draggedWidth,
    rowHeight,
    fallbackColWidth,
    containerPadding = 8,
    rglElement,
    components,
  } = params;

  // Measure actual column width from a rendered grid item
  let actualColWidth = fallbackColWidth;
  const gridItems = rglElement.querySelectorAll('.react-grid-item');
  for (const item of gridItems) {
    const el = item as HTMLElement;
    const testId = el.getAttribute('data-testid');
    if (testId) {
      const componentId = testId.replace('component-', '');
      const comp = components.find((c) => c.id === componentId);
      if (comp && comp.width > 0) {
        actualColWidth = el.getBoundingClientRect().width / comp.width;
        break;
      }
    }
  }

  return {
    isActive: true,
    indicatorX: containerPadding + insertPosition.col * actualColWidth,
    indicatorY: containerPadding + insertPosition.row * rowHeight,
    indicatorWidth: draggedWidth * actualColWidth,
    targetRow: insertPosition.row,
    targetCol: insertPosition.col,
  };
}
