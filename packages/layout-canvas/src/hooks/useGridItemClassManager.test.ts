import { renderHook } from '@testing-library/react-hooks';
import { useGridItemClassManager } from './useGridItemClassManager';

// Helper to create a mock grid item structure in the DOM
function createGridItem(componentId: string, scope?: string): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = scope === '.nested-layout' ? 'nested-layout' : 'react-grid-layout';
  if (scope === '.nested-layout') {
    wrapper.classList.add('react-grid-layout');
  }

  const gridItem = document.createElement('div');
  gridItem.className = 'react-grid-item';

  const componentWrapper = document.createElement('div');
  componentWrapper.setAttribute('data-testid', `component-${componentId}`);

  gridItem.appendChild(componentWrapper);
  wrapper.appendChild(gridItem);
  document.body.appendChild(wrapper);

  return gridItem;
}

function cleanup() {
  document.body.innerHTML = '';
}

describe('useGridItemClassManager', () => {
  afterEach(cleanup);

  describe('selected-item class', () => {
    it('adds selected-item class to grid item when selectedComponentId matches', () => {
      const gridItem = createGridItem('comp-1');

      renderHook(() =>
        useGridItemClassManager({
          selectedComponentId: 'comp-1',
          components: [{ id: 'comp-1', y: 2 }],
        }),
      );

      expect(gridItem.classList.contains('selected-item')).toBe(true);
    });

    it('removes selected-item class when selectedComponentId changes', () => {
      const gridItem1 = createGridItem('comp-1');
      const gridItem2 = createGridItem('comp-2');

      const { rerender } = renderHook(
        ({ selectedId }) =>
          useGridItemClassManager({
            selectedComponentId: selectedId,
            components: [
              { id: 'comp-1', y: 0 },
              { id: 'comp-2', y: 1 },
            ],
          }),
        { initialProps: { selectedId: 'comp-1' as string | null } },
      );

      expect(gridItem1.classList.contains('selected-item')).toBe(true);
      expect(gridItem2.classList.contains('selected-item')).toBe(false);

      rerender({ selectedId: 'comp-2' });

      expect(gridItem1.classList.contains('selected-item')).toBe(false);
      expect(gridItem2.classList.contains('selected-item')).toBe(true);
    });

    it('removes all selected-item classes when selectedComponentId is null', () => {
      const gridItem = createGridItem('comp-1');

      const { rerender } = renderHook(
        ({ selectedId }) =>
          useGridItemClassManager({
            selectedComponentId: selectedId,
            components: [{ id: 'comp-1', y: 0 }],
          }),
        { initialProps: { selectedId: 'comp-1' as string | null } },
      );

      expect(gridItem.classList.contains('selected-item')).toBe(true);

      rerender({ selectedId: null });

      expect(gridItem.classList.contains('selected-item')).toBe(false);
    });
  });

  describe('top-row class', () => {
    it('adds top-row class to components at y=0', () => {
      const gridItemTop = createGridItem('comp-top');
      const gridItemBottom = createGridItem('comp-bottom');

      renderHook(() =>
        useGridItemClassManager({
          selectedComponentId: null,
          components: [
            { id: 'comp-top', y: 0 },
            { id: 'comp-bottom', y: 3 },
          ],
        }),
      );

      expect(gridItemTop.classList.contains('top-row')).toBe(true);
      expect(gridItemBottom.classList.contains('top-row')).toBe(false);
    });

    it('removes top-row class when component moves away from y=0', () => {
      const gridItem = createGridItem('comp-1');

      const { rerender } = renderHook(
        ({ components }) =>
          useGridItemClassManager({
            selectedComponentId: null,
            components,
          }),
        { initialProps: { components: [{ id: 'comp-1', y: 0 }] } },
      );

      expect(gridItem.classList.contains('top-row')).toBe(true);

      rerender({ components: [{ id: 'comp-1', y: 2 }] });

      expect(gridItem.classList.contains('top-row')).toBe(false);
    });
  });

  describe('hovered class', () => {
    it('adds hovered class when hoveredComponentId matches', () => {
      const gridItem = createGridItem('comp-1');

      renderHook(() =>
        useGridItemClassManager({
          selectedComponentId: null,
          components: [{ id: 'comp-1', y: 0 }],
          hoveredComponentId: 'comp-1',
        }),
      );

      expect(gridItem.classList.contains('hovered')).toBe(true);
    });

    it('does not add hovered class when isOverChildComponent is false', () => {
      const gridItem = createGridItem('comp-1');

      renderHook(() =>
        useGridItemClassManager({
          selectedComponentId: null,
          components: [{ id: 'comp-1', y: 0 }],
          hoveredComponentId: 'comp-1',
          isOverChildComponent: false,
        }),
      );

      expect(gridItem.classList.contains('hovered')).toBe(false);
    });

    it('removes hovered class when hoveredComponentId changes', () => {
      const gridItem1 = createGridItem('comp-1');
      const gridItem2 = createGridItem('comp-2');

      const { rerender } = renderHook(
        ({ hoveredId }) =>
          useGridItemClassManager({
            selectedComponentId: null,
            components: [
              { id: 'comp-1', y: 0 },
              { id: 'comp-2', y: 1 },
            ],
            hoveredComponentId: hoveredId,
          }),
        { initialProps: { hoveredId: 'comp-1' as string | null } },
      );

      expect(gridItem1.classList.contains('hovered')).toBe(true);

      rerender({ hoveredId: 'comp-2' });

      expect(gridItem1.classList.contains('hovered')).toBe(false);
      expect(gridItem2.classList.contains('hovered')).toBe(true);
    });
  });

  describe('scope selector', () => {
    it('respects scope selector — only modifies items within .nested-layout when scope is set', () => {
      // Create a grid item in a nested layout
      const nestedGridItem = createGridItem('comp-nested', '.nested-layout');
      // Create a grid item in the main canvas (no scope)
      const mainGridItem = createGridItem('comp-main');

      renderHook(() =>
        useGridItemClassManager({
          scope: '.nested-layout',
          selectedComponentId: 'comp-nested',
          components: [
            { id: 'comp-nested', y: 0 },
            { id: 'comp-main', y: 0 },
          ],
        }),
      );

      // Nested item should have classes applied
      expect(nestedGridItem.classList.contains('selected-item')).toBe(true);
      // Main item should NOT have classes (it's outside scope)
      expect(mainGridItem.classList.contains('selected-item')).toBe(false);
    });

    it('applies to all grid items when scope is not set', () => {
      const gridItem = createGridItem('comp-1');

      renderHook(() =>
        useGridItemClassManager({
          selectedComponentId: 'comp-1',
          components: [{ id: 'comp-1', y: 0 }],
        }),
      );

      expect(gridItem.classList.contains('selected-item')).toBe(true);
      expect(gridItem.classList.contains('top-row')).toBe(true);
    });
  });

  describe('onSelectionChange callback', () => {
    it('calls onSelectionChange when selectedComponentId is set', () => {
      createGridItem('comp-1');
      const onSelectionChange = jest.fn();

      renderHook(() =>
        useGridItemClassManager({
          selectedComponentId: 'comp-1',
          components: [{ id: 'comp-1', y: 0 }],
          onSelectionChange,
        }),
      );

      expect(onSelectionChange).toHaveBeenCalled();
    });

    it('does not call onSelectionChange when selectedComponentId is null', () => {
      const onSelectionChange = jest.fn();

      renderHook(() =>
        useGridItemClassManager({
          selectedComponentId: null,
          components: [],
          onSelectionChange,
        }),
      );

      expect(onSelectionChange).not.toHaveBeenCalled();
    });
  });
});
