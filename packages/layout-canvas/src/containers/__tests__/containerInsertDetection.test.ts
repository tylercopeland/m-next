jest.mock('../../utils/insertDetection', () => ({
  detectInsertPosition: jest.fn(),
  calculateInsertIndicator: jest.fn(),
}));

import {
  computeContainerGridMetrics,
  computeInsertDetection,
  buildLayoutItemsFromComponents,
} from '../utils/containerInsertDetection';
import { detectInsertPosition, calculateInsertIndicator } from '../../utils/insertDetection';
import type { ResponsiveComponent } from '../../rgl-integration/types';

const makeChild = (id: string, x = 0, y = 0, width = 2, height = 2): ResponsiveComponent =>
  ({
    id,
    type: 'BTN',
    x,
    y,
    width,
    height,
    content: '',
    isHidden: false,
    containerId: 'c1',
    static: false,
  }) as unknown as ResponsiveComponent;

describe('containerInsertDetection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('computeContainerGridMetrics', () => {
    it('should compute column width from container cols and effective width', () => {
      const metrics = computeContainerGridMetrics({
        containerCols: 8,
        containerPadding: 0,
        effectiveWidth: 800,
      });

      expect(metrics.colWidth).toBe(100); // 800 / 8
      expect(metrics.containerCols).toBe(8);
      expect(metrics.containerPadding).toBe(0);
    });

    it('should account for container padding in effective width', () => {
      const metrics = computeContainerGridMetrics({
        containerCols: 8,
        containerPadding: 8,
        effectiveWidth: 816, // actual element width
      });

      // effectiveWidth after padding: 816 - 8*2 = 800
      expect(metrics.colWidth).toBe(100);
    });

    it('should handle zero width gracefully', () => {
      const metrics = computeContainerGridMetrics({
        containerCols: 8,
        containerPadding: 0,
        effectiveWidth: 0,
      });

      expect(metrics.colWidth).toBeGreaterThan(0); // should clamp to minimum
    });

    it('should handle zero cols gracefully', () => {
      const metrics = computeContainerGridMetrics({
        containerCols: 0,
        containerPadding: 0,
        effectiveWidth: 800,
      });

      expect(metrics.containerCols).toBeGreaterThan(0); // should clamp to minimum
    });
  });

  describe('buildLayoutItemsFromComponents', () => {
    it('should map components to layout items', () => {
      const children = [makeChild('a', 0, 0, 2, 2), makeChild('b', 3, 1, 1, 1)];
      const items = buildLayoutItemsFromComponents(children);

      expect(items).toEqual([
        { i: 'a', x: 0, y: 0, w: 2, h: 2 },
        { i: 'b', x: 3, y: 1, w: 1, h: 1 },
      ]);
    });

    it('should exclude specified IDs', () => {
      const children = [makeChild('a'), makeChild('b', 2, 0)];
      const items = buildLayoutItemsFromComponents(children, 'a');

      expect(items).toEqual([{ i: 'b', x: 2, y: 0, w: 2, h: 2 }]);
    });

    it('should handle missing/NaN values gracefully', () => {
      const child = {
        id: 'x',
        type: 'BTN',
        x: undefined,
        y: undefined,
        width: undefined,
        height: undefined,
      } as unknown as ResponsiveComponent;

      const items = buildLayoutItemsFromComponents([child]);

      expect(items[0]).toEqual({ i: 'x', x: 0, y: 0, w: 1, h: 1 });
    });
  });

  describe('computeInsertDetection', () => {
    it('should call detectInsertPosition and return insert state when push needed', () => {
      (detectInsertPosition as jest.Mock).mockReturnValue({
        wouldCausePush: true,
        row: 2,
        col: 0,
        indicatorY: 60,
        indicatorX: 0,
        componentsToPush: ['b'],
      });
      (calculateInsertIndicator as jest.Mock).mockReturnValue({
        isActive: true,
        indicatorX: 10,
        indicatorY: 60,
        indicatorWidth: 200,
        targetRow: 2,
        targetCol: 0,
      });

      const result = computeInsertDetection({
        mouseX: 50,
        mouseY: 80,
        draggedWidth: 2,
        draggedHeight: 2,
        layoutItems: [{ i: 'b', x: 0, y: 0, w: 2, h: 2 }],
        rowHeight: 30,
        colWidth: 100,
        containerCols: 8,
        containerPadding: 0,
        rglElement: document.createElement('div'),
        components: [{ id: 'b', width: 2 }],
      });

      expect(detectInsertPosition).toHaveBeenCalled();
      expect(calculateInsertIndicator).toHaveBeenCalled();
      expect(result).not.toBeNull();
      expect(result!.isActive).toBe(true);
      expect(result!.targetRow).toBe(2);
    });

    it('should return null when no push needed', () => {
      (detectInsertPosition as jest.Mock).mockReturnValue({
        wouldCausePush: false,
        row: 0,
        col: 0,
      });

      const result = computeInsertDetection({
        mouseX: 50,
        mouseY: 10,
        draggedWidth: 2,
        draggedHeight: 2,
        layoutItems: [],
        rowHeight: 30,
        colWidth: 100,
        containerCols: 8,
        containerPadding: 0,
        rglElement: null,
        components: [],
      });

      expect(result).toBeNull();
      expect(calculateInsertIndicator).not.toHaveBeenCalled();
    });

    it('should return null when rglElement is null and push is needed', () => {
      (detectInsertPosition as jest.Mock).mockReturnValue({
        wouldCausePush: true,
        row: 2,
        col: 0,
      });

      const result = computeInsertDetection({
        mouseX: 50,
        mouseY: 80,
        draggedWidth: 2,
        draggedHeight: 2,
        layoutItems: [{ i: 'b', x: 0, y: 0, w: 2, h: 2 }],
        rowHeight: 30,
        colWidth: 100,
        containerCols: 8,
        containerPadding: 0,
        rglElement: null,
        components: [{ id: 'b', width: 2 }],
      });

      expect(result).toBeNull();
    });
  });
});
