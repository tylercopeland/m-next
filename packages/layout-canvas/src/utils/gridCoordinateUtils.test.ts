import { clientToGridCoords } from './gridCoordinateUtils';

describe('clientToGridCoords', () => {
  const rect = {
    left: 0,
    top: 0,
    width: 120,
  } as DOMRect;

  it('applies padding and floor rounding by default', () => {
    const result = clientToGridCoords({
      clientX: 19,
      clientY: 31,
      rect,
      cols: 6,
      rowHeight: 10,
      padding: 8,
    });

    expect(result.x).toBe(0);
    expect(result.y).toBe(2);
    expect(result.pointerCol).toBe(0);
  });

  it('applies anchor offset and clamps by item width', () => {
    const result = clientToGridCoords({
      clientX: 110,
      clientY: 20,
      rect,
      cols: 6,
      rowHeight: 10,
      padding: 8,
      itemWidth: 2,
      anchorOffsetCols: 1,
    });

    expect(result.x).toBe(4);
    expect(result.y).toBe(1);
  });

  it('supports round rounding mode', () => {
    const result = clientToGridCoords({
      clientX: 34,
      clientY: 26,
      rect,
      cols: 6,
      rowHeight: 10,
      xRounding: 'round',
      yRounding: 'round',
    });

    expect(result.x).toBe(2);
    expect(result.y).toBe(3);
  });
});
