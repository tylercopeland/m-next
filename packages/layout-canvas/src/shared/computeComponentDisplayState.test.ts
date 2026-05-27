import { computeComponentDisplayState, ComponentDisplayContext } from './computeComponentDisplayState';
import type { ResponsiveComponent } from '../rgl-integration/types';
import type { CurrentStateValue } from '@m-next/types';
import { CurrentState } from '@m-next/types';

// Use string literals for widget types to avoid coupling to a specific import source
const WIDGET_TYPES = {
  BUTTON: 'BTN',
  LAYOUT_CONTAINER: 'L-CON',
  SECTION: 'SEC',
  PICTURE: 'PIC',
  CHART: 'CHT',
  TEXTBOX: 'TXT',
};

/** Helper to create a minimal ResponsiveComponent for testing */
function makeComponent(overrides: Partial<ResponsiveComponent> = {}): ResponsiveComponent {
  return {
    id: 'comp-1',
    type: WIDGET_TYPES.BUTTON as ResponsiveComponent['type'],
    x: 0,
    y: 2,
    width: 4,
    height: 2,
    content: 'Test Button',
    containerId: null,
    static: false,
    currentState: CurrentState.REGULAR as CurrentStateValue,
    ...overrides,
  };
}

/** Helper to create a default designer-mode context */
function makeContext(overrides: Partial<ComponentDisplayContext> = {}): ComponentDisplayContext {
  return {
    isDraggable: true,
    selectedComponentId: null,
    hoveredComponentId: null,
    resolution: 'desktop',
    mode: 'designer',
    ...overrides,
  };
}

describe('computeComponentDisplayState', () => {
  describe('isSelected', () => {
    it('returns true when isDraggable and component matches selectedComponentId', () => {
      const component = makeComponent({ id: 'comp-1' });
      const context = makeContext({ selectedComponentId: 'comp-1' });
      const result = computeComponentDisplayState(component, context);
      expect(result.isSelected).toBe(true);
    });

    it('returns false when component does not match selectedComponentId', () => {
      const component = makeComponent({ id: 'comp-1' });
      const context = makeContext({ selectedComponentId: 'comp-2' });
      const result = computeComponentDisplayState(component, context);
      expect(result.isSelected).toBe(false);
    });

    it('returns false in runtime mode (isDraggable=false) even if IDs match', () => {
      const component = makeComponent({ id: 'comp-1' });
      const context = makeContext({ isDraggable: false, selectedComponentId: 'comp-1' });
      const result = computeComponentDisplayState(component, context);
      expect(result.isSelected).toBe(false);
    });

    it('returns false when selectedComponentId is null', () => {
      const component = makeComponent({ id: 'comp-1' });
      const context = makeContext({ selectedComponentId: null });
      const result = computeComponentDisplayState(component, context);
      expect(result.isSelected).toBe(false);
    });
  });

  describe('isHovered', () => {
    it('returns true when isDraggable and component matches hoveredComponentId', () => {
      const component = makeComponent({ id: 'comp-1' });
      const context = makeContext({ hoveredComponentId: 'comp-1' });
      const result = computeComponentDisplayState(component, context);
      expect(result.isHovered).toBe(true);
    });

    it('returns false when component does not match hoveredComponentId', () => {
      const component = makeComponent({ id: 'comp-1' });
      const context = makeContext({ hoveredComponentId: 'comp-2' });
      const result = computeComponentDisplayState(component, context);
      expect(result.isHovered).toBe(false);
    });

    it('returns false in runtime mode (isDraggable=false) even if IDs match', () => {
      const component = makeComponent({ id: 'comp-1' });
      const context = makeContext({ isDraggable: false, hoveredComponentId: 'comp-1' });
      const result = computeComponentDisplayState(component, context);
      expect(result.isHovered).toBe(false);
    });
  });

  describe('isHidden', () => {
    it('returns false for a regular visible component in designer mode', () => {
      const component = makeComponent({
        responsive: {
          desktop: {
            ...makeComponent(),
            currentState: CurrentState.REGULAR as CurrentStateValue,
          },
        },
      });
      const context = makeContext({ mode: 'designer' });
      const result = computeComponentDisplayState(component, context);
      expect(result.isHidden).toBe(false);
    });

    it('returns true for a hidden component in designer mode', () => {
      const component = makeComponent({
        responsive: {
          desktop: {
            ...makeComponent(),
            currentState: CurrentState.HIDDEN as CurrentStateValue,
          },
        },
      });
      const context = makeContext({ mode: 'designer' });
      const result = computeComponentDisplayState(component, context);
      expect(result.isHidden).toBe(true);
    });

    it('returns true for a component with visible=false in runtime mode', () => {
      const component = makeComponent();
      // In runtime mode, visible=false means hidden
      (component as unknown as Record<string, unknown>).visible = false;
      const context = makeContext({ isDraggable: false, mode: 'runtime' });
      const result = computeComponentDisplayState(component, context);
      expect(result.isHidden).toBe(true);
    });

    it('returns false for a component with visible=true in runtime mode', () => {
      const component = makeComponent();
      (component as unknown as Record<string, unknown>).visible = true;
      const context = makeContext({ isDraggable: false, mode: 'runtime' });
      const result = computeComponentDisplayState(component, context);
      expect(result.isHidden).toBe(false);
    });
  });

  describe('isNearTop', () => {
    it('returns true when y === 0', () => {
      const component = makeComponent({ y: 0 });
      const result = computeComponentDisplayState(component, makeContext());
      expect(result.isNearTop).toBe(true);
    });

    it('returns false when y > 0', () => {
      const component = makeComponent({ y: 3 });
      const result = computeComponentDisplayState(component, makeContext());
      expect(result.isNearTop).toBe(false);
    });
  });

  describe('hasValidationError', () => {
    it('returns true for a component with explicit validationError', () => {
      const component = makeComponent({ validationError: 'Required field' });
      const result = computeComponentDisplayState(component, makeContext());
      expect(result.hasValidationError).toBe(true);
    });

    it('returns false for a component with no validationError', () => {
      const component = makeComponent({ validationError: null });
      const result = computeComponentDisplayState(component, makeContext());
      expect(result.hasValidationError).toBe(false);
    });

    it('returns true for unbound PICTURE with no value', () => {
      const component = makeComponent({
        type: WIDGET_TYPES.PICTURE as ResponsiveComponent['type'],
        isBound: false,
        value: null,
      });
      const result = computeComponentDisplayState(component, makeContext());
      expect(result.hasValidationError).toBe(true);
    });
  });

  describe('supportsHeightResize', () => {
    it('returns true for CHART widget', () => {
      const component = makeComponent({ type: WIDGET_TYPES.CHART as ResponsiveComponent['type'] });
      const result = computeComponentDisplayState(component, makeContext());
      expect(result.supportsHeightResize).toBe(true);
    });

    it('returns true for SECTION widget', () => {
      const component = makeComponent({ type: WIDGET_TYPES.SECTION as ResponsiveComponent['type'] });
      const result = computeComponentDisplayState(component, makeContext());
      expect(result.supportsHeightResize).toBe(true);
    });

    it('returns false for BUTTON widget', () => {
      const component = makeComponent({ type: WIDGET_TYPES.BUTTON as ResponsiveComponent['type'] });
      const result = computeComponentDisplayState(component, makeContext());
      expect(result.supportsHeightResize).toBe(false);
    });
  });

  describe('handleColor', () => {
    it('returns red when hasValidationError', () => {
      const component = makeComponent({ validationError: 'Error' });
      const result = computeComponentDisplayState(component, makeContext());
      expect(result.handleColor).toBe('#DA211E');
    });

    it('returns blue when selected and no error', () => {
      const component = makeComponent({ id: 'comp-1' });
      const context = makeContext({ selectedComponentId: 'comp-1' });
      const result = computeComponentDisplayState(component, context);
      expect(result.handleColor).toBe('#0D71C8');
    });

    it('returns light blue when not selected and no error', () => {
      const component = makeComponent();
      const result = computeComponentDisplayState(component, makeContext());
      expect(result.handleColor).toBe('#84C3F5');
    });
  });

  describe('container type detection', () => {
    it('detects LAYOUT_CONTAINER as isLayoutContainer', () => {
      const component = makeComponent({ type: WIDGET_TYPES.LAYOUT_CONTAINER as ResponsiveComponent['type'] });
      const result = computeComponentDisplayState(component, makeContext());
      expect(result.isLayoutContainer).toBe(true);
      expect(result.isStaticContainer).toBe(false);
    });

    it('detects SECTION as isStaticContainer', () => {
      const component = makeComponent({ type: WIDGET_TYPES.SECTION as ResponsiveComponent['type'] });
      const result = computeComponentDisplayState(component, makeContext());
      expect(result.isStaticContainer).toBe(true);
    });

    it('returns false for non-container types', () => {
      const component = makeComponent({ type: WIDGET_TYPES.BUTTON as ResponsiveComponent['type'] });
      const result = computeComponentDisplayState(component, makeContext());
      expect(result.isLayoutContainer).toBe(false);
      expect(result.isStaticContainer).toBe(false);
    });
  });

  describe('isInContainer', () => {
    it('returns true when containerId is set', () => {
      const component = makeComponent({ containerId: 'parent-1' });
      const result = computeComponentDisplayState(component, makeContext());
      expect(result.isInContainer).toBe(true);
    });

    it('returns false when containerId is null', () => {
      const component = makeComponent({ containerId: null });
      const result = computeComponentDisplayState(component, makeContext());
      expect(result.isInContainer).toBe(false);
    });
  });

  describe('CSS class names', () => {
    it('returns "selected" selectionClassName when component is selected', () => {
      const component = makeComponent({ id: 'comp-1' });
      const context = makeContext({ selectedComponentId: 'comp-1' });
      const result = computeComponentDisplayState(component, context);
      expect(result.selectionClassName).toBe('selected');
    });

    it('returns empty selectionClassName when component is not selected', () => {
      const component = makeComponent({ id: 'comp-1' });
      const context = makeContext({ selectedComponentId: 'comp-2' });
      const result = computeComponentDisplayState(component, context);
      expect(result.selectionClassName).toBe('');
    });

    it('returns "hovered" hoveredClassName when hovered and not selected', () => {
      const component = makeComponent({ id: 'comp-1' });
      const context = makeContext({ hoveredComponentId: 'comp-1', selectedComponentId: null });
      const result = computeComponentDisplayState(component, context);
      expect(result.hoveredClassName).toBe('hovered');
    });

    it('returns empty hoveredClassName when hovered AND selected', () => {
      const component = makeComponent({ id: 'comp-1' });
      const context = makeContext({ hoveredComponentId: 'comp-1', selectedComponentId: 'comp-1' });
      const result = computeComponentDisplayState(component, context);
      expect(result.hoveredClassName).toBe('');
    });

    it('returns "hidden-unselected" hiddenClassName when hidden and not selected and not hovered', () => {
      const component = makeComponent({
        responsive: {
          desktop: {
            ...makeComponent(),
            currentState: CurrentState.HIDDEN as CurrentStateValue,
          },
        },
      });
      const context = makeContext({ selectedComponentId: null, hoveredComponentId: null });
      const result = computeComponentDisplayState(component, context);
      expect(result.hiddenClassName).toBe('hidden-unselected');
    });

    it('returns empty hiddenClassName when hidden but selected', () => {
      const component = makeComponent({
        id: 'comp-1',
        responsive: {
          desktop: {
            ...makeComponent(),
            currentState: CurrentState.HIDDEN as CurrentStateValue,
          },
        },
      });
      const context = makeContext({ selectedComponentId: 'comp-1' });
      const result = computeComponentDisplayState(component, context);
      expect(result.hiddenClassName).toBe('');
    });

    it('returns "height-resizable" heightResizeClass for resizable widgets', () => {
      const component = makeComponent({ type: WIDGET_TYPES.CHART as ResponsiveComponent['type'] });
      const result = computeComponentDisplayState(component, makeContext());
      expect(result.heightResizeClass).toBe('height-resizable');
    });

    it('returns "height-fixed" heightResizeClass for non-resizable widgets', () => {
      const component = makeComponent({ type: WIDGET_TYPES.BUTTON as ResponsiveComponent['type'] });
      const result = computeComponentDisplayState(component, makeContext());
      expect(result.heightResizeClass).toBe('height-fixed');
    });

    it('returns "top-row" topRowClass when y === 0', () => {
      const component = makeComponent({ y: 0 });
      const result = computeComponentDisplayState(component, makeContext());
      expect(result.topRowClass).toBe('top-row');
    });

    it('returns empty topRowClass when y > 0', () => {
      const component = makeComponent({ y: 5 });
      const result = computeComponentDisplayState(component, makeContext());
      expect(result.topRowClass).toBe('');
    });
  });

  describe('drag class names', () => {
    it('returns "drag-handle" for non-container in designer mode', () => {
      const component = makeComponent({ type: WIDGET_TYPES.BUTTON as ResponsiveComponent['type'] });
      const context = makeContext({ isDraggable: true });
      const result = computeComponentDisplayState(component, context);
      expect(result.dragClassName).toBe('drag-handle');
    });

    it('returns empty drag class for LAYOUT_CONTAINER', () => {
      const component = makeComponent({ type: WIDGET_TYPES.LAYOUT_CONTAINER as ResponsiveComponent['type'] });
      const context = makeContext({ isDraggable: true });
      const result = computeComponentDisplayState(component, context);
      expect(result.dragClassName).toBe('');
    });

    it('returns empty drag class in runtime mode', () => {
      const component = makeComponent({ type: WIDGET_TYPES.BUTTON as ResponsiveComponent['type'] });
      const context = makeContext({ isDraggable: false });
      const result = computeComponentDisplayState(component, context);
      expect(result.dragClassName).toBe('');
    });

    it('returns empty drag class for components inside containers', () => {
      const component = makeComponent({
        type: WIDGET_TYPES.BUTTON as ResponsiveComponent['type'],
        containerId: 'container-1',
      });
      const context = makeContext({ isDraggable: true });
      const result = computeComponentDisplayState(component, context);
      expect(result.dragClassName).toBe('');
    });

    it('returns "static" staticClassName in runtime mode', () => {
      const component = makeComponent({ type: WIDGET_TYPES.BUTTON as ResponsiveComponent['type'] });
      const context = makeContext({ isDraggable: false });
      const result = computeComponentDisplayState(component, context);
      expect(result.staticClassName).toBe('static');
    });

    it('returns "static" staticClassName for SECTION in designer mode', () => {
      const component = makeComponent({ type: WIDGET_TYPES.SECTION as ResponsiveComponent['type'] });
      const context = makeContext({ isDraggable: true });
      const result = computeComponentDisplayState(component, context);
      expect(result.staticClassName).toBe('static');
    });

    it('returns empty staticClassName for non-section in designer mode', () => {
      const component = makeComponent({ type: WIDGET_TYPES.BUTTON as ResponsiveComponent['type'] });
      const context = makeContext({ isDraggable: true });
      const result = computeComponentDisplayState(component, context);
      expect(result.staticClassName).toBe('');
    });
  });
});
