export type GridRoundingMode = 'floor' | 'round';

export interface ClientToGridCoordsParams {
  clientX: number;
  clientY: number;
  rect: DOMRect;
  cols: number;
  rowHeight: number;
  padding?: number;
  itemWidth?: number;
  anchorOffsetCols?: number;
  xRounding?: GridRoundingMode;
  yRounding?: GridRoundingMode;
}

export interface ClientToGridCoordsResult {
  x: number;
  y: number;
  relX: number;
  relY: number;
  pointerCol: number;
  colWidth: number;
}

function roundByMode(value: number, mode: GridRoundingMode): number {
  return mode === 'round' ? Math.round(value) : Math.floor(value);
}

export function clientToGridCoords({
  clientX,
  clientY,
  rect,
  cols,
  rowHeight,
  padding = 0,
  itemWidth = 1,
  anchorOffsetCols = 0,
  xRounding = 'floor',
  yRounding = 'floor',
}: ClientToGridCoordsParams): ClientToGridCoordsResult {
  const safeCols = Math.max(1, Number(cols) || 1);
  const safeRowHeight = Math.max(1, Number(rowHeight) || 1);
  const safePadding = Math.max(0, Number(padding) || 0);
  const safeItemWidth = Math.max(1, Number(itemWidth) || 1);
  const safeAnchorOffset = Math.max(0, Number(anchorOffsetCols) || 0);

  const effectiveWidth = Math.max(1, rect.width - safePadding * 2);
  const colWidth = effectiveWidth / safeCols;

  const relX = Number(clientX) - rect.left - safePadding;
  const relY = Number(clientY) - rect.top - safePadding;

  const pointerCol = roundByMode(relX / Math.max(1, colWidth), xRounding);
  const rawX = pointerCol - safeAnchorOffset;
  const maxX = Math.max(0, safeCols - safeItemWidth);
  const x = Math.max(0, Math.min(maxX, rawX));

  const rawY = roundByMode(relY / safeRowHeight, yRounding);
  const y = Math.max(0, rawY);

  return {
    x,
    y,
    relX,
    relY,
    pointerCol,
    colWidth,
  };
}
