import { buildWrapperProps, RuntimePropsContext } from './buildWrapperProps';
import type { ResponsiveComponent } from '../rgl-integration/types';
import type { CurrentStateValue } from '@m-next/types';
import { CurrentState } from '@m-next/types';

const WIDGET_TYPES = {
  BUTTON: 'BTN',
  LAYOUT_CONTAINER: 'L-CON',
  SECTION: 'SEC',
};

function makeComponent(overrides: Partial<ResponsiveComponent> = {}): ResponsiveComponent {
  return {
    id: 'comp-1',
    type: WIDGET_TYPES.BUTTON as ResponsiveComponent['type'],
    x: 0,
    y: 2,
    width: 4,
    height: 2,
    content: 'Test',
    containerId: null,
    static: false,
    currentState: CurrentState.REGULAR as CurrentStateValue,
    ...overrides,
  };
}

const noopClick = (_id: string) => {};

function makeRuntimeContext(overrides: Partial<RuntimePropsContext> = {}): RuntimePropsContext {
  return {
    runtimeActionHandler: null,
    runtimeScreenId: null,
    runtimeRecordId: null,
    runtimeScreenState: null,
    runtimeUpdateControlValue: null,
    runtimeUpdateControlProperty: null,
    runtimeProcessAnalytics: null,
    isStockScreen: null,
    ...overrides,
  };
}

describe('buildWrapperProps', () => {
  describe('base props (always present)', () => {
    it('includes id from component', () => {
      const component = makeComponent({ id: 'abc-123' });
      const result = buildWrapperProps(component, false, 'designer', true, {}, noopClick, null);
      expect(result.id).toBe('abc-123');
    });

    it('includes onControlClick', () => {
      const component = makeComponent();
      const result = buildWrapperProps(component, false, 'designer', true, {}, noopClick, null);
      expect(result.onControlClick).toBe(noopClick);
    });

    it('includes isSelected', () => {
      const component = makeComponent();
      const result = buildWrapperProps(component, true, 'designer', true, {}, noopClick, null);
      expect(result.isSelected).toBe(true);
    });

    it('includes mode', () => {
      const component = makeComponent();
      const result = buildWrapperProps(component, false, 'designer', true, {}, noopClick, null);
      expect(result.mode).toBe('designer');
    });
  });

  describe('container props spread', () => {
    it('spreads containerProps into result', () => {
      const component = makeComponent();
      const containerProps = { childComponents: [], isEmpty: true, containerConfig: {} };
      const result = buildWrapperProps(component, false, 'designer', true, containerProps, noopClick, null);
      expect(result.childComponents).toEqual([]);
      expect(result.isEmpty).toBe(true);
      expect(result.containerConfig).toEqual({});
    });
  });

  describe('designer mode (isDraggable=true)', () => {
    it('does NOT include control prop', () => {
      const component = makeComponent();
      const result = buildWrapperProps(component, false, 'designer', true, {}, noopClick, null);
      expect(result).not.toHaveProperty('control');
    });

    it('does NOT include runtime handler props', () => {
      const component = makeComponent();
      const result = buildWrapperProps(component, false, 'designer', true, {}, noopClick, null);
      expect(result).not.toHaveProperty('actionHandler');
      expect(result).not.toHaveProperty('screenId');
      expect(result).not.toHaveProperty('recordId');
    });
  });

  describe('runtime mode (isDraggable=false)', () => {
    it('includes control prop with the full component', () => {
      const component = makeComponent({ id: 'comp-1' });
      const result = buildWrapperProps(component, false, 'designer', false, {}, noopClick, makeRuntimeContext());
      expect(result.control).toBe(component);
    });

    it('overrides mode to "runtime"', () => {
      const component = makeComponent();
      const result = buildWrapperProps(component, false, 'designer', false, {}, noopClick, makeRuntimeContext());
      expect(result.mode).toBe('runtime');
    });

    it('includes actionHandler when provided', () => {
      const handler = jest.fn();
      const component = makeComponent();
      const rtx = makeRuntimeContext({ runtimeActionHandler: handler });
      const result = buildWrapperProps(component, false, 'designer', false, {}, noopClick, rtx);
      expect(result.actionHandler).toBe(handler);
    });

    it('does NOT include actionHandler when null', () => {
      const component = makeComponent();
      const rtx = makeRuntimeContext({ runtimeActionHandler: null });
      const result = buildWrapperProps(component, false, 'designer', false, {}, noopClick, rtx);
      expect(result).not.toHaveProperty('actionHandler');
    });

    it('includes screenId and recordId', () => {
      const component = makeComponent();
      const rtx = makeRuntimeContext({ runtimeScreenId: 'screen-1', runtimeRecordId: 'rec-1' });
      const result = buildWrapperProps(component, false, 'designer', false, {}, noopClick, rtx);
      expect(result.screenId).toBe('screen-1');
      expect(result.recordId).toBe('rec-1');
    });

    it('converts null screenId/recordId to undefined', () => {
      const component = makeComponent();
      const rtx = makeRuntimeContext({ runtimeScreenId: null, runtimeRecordId: null });
      const result = buildWrapperProps(component, false, 'designer', false, {}, noopClick, rtx);
      expect(result.screenId).toBeUndefined();
      expect(result.recordId).toBeUndefined();
    });

    it('includes screenState', () => {
      const state = { key: 'value' };
      const component = makeComponent();
      const rtx = makeRuntimeContext({ runtimeScreenState: state });
      const result = buildWrapperProps(component, false, 'designer', false, {}, noopClick, rtx);
      expect(result.screenState).toBe(state);
    });

    it('includes runtimeUpdateControlValue when provided', () => {
      const fn = jest.fn();
      const component = makeComponent();
      const rtx = makeRuntimeContext({ runtimeUpdateControlValue: fn });
      const result = buildWrapperProps(component, false, 'designer', false, {}, noopClick, rtx);
      expect(result.runtimeUpdateControlValue).toBe(fn);
    });

    it('does NOT include runtimeUpdateControlValue when null', () => {
      const component = makeComponent();
      const rtx = makeRuntimeContext({ runtimeUpdateControlValue: null });
      const result = buildWrapperProps(component, false, 'designer', false, {}, noopClick, rtx);
      expect(result).not.toHaveProperty('runtimeUpdateControlValue');
    });

    it('includes runtimeUpdateControlProperty when provided', () => {
      const fn = jest.fn();
      const component = makeComponent();
      const rtx = makeRuntimeContext({ runtimeUpdateControlProperty: fn });
      const result = buildWrapperProps(component, false, 'designer', false, {}, noopClick, rtx);
      expect(result.runtimeUpdateControlProperty).toBe(fn);
    });

    it('does NOT include runtimeUpdateControlProperty when null', () => {
      const component = makeComponent();
      const rtx = makeRuntimeContext({ runtimeUpdateControlProperty: null });
      const result = buildWrapperProps(component, false, 'designer', false, {}, noopClick, rtx);
      expect(result).not.toHaveProperty('runtimeUpdateControlProperty');
    });

    it('includes processAnalytics when provided', () => {
      const fn = jest.fn();
      const component = makeComponent();
      const rtx = makeRuntimeContext({ runtimeProcessAnalytics: fn });
      const result = buildWrapperProps(component, false, 'designer', false, {}, noopClick, rtx);
      expect(result.processAnalytics).toBe(fn);
    });

    it('does NOT include processAnalytics when null', () => {
      const component = makeComponent();
      const rtx = makeRuntimeContext({ runtimeProcessAnalytics: null });
      const result = buildWrapperProps(component, false, 'designer', false, {}, noopClick, rtx);
      expect(result).not.toHaveProperty('processAnalytics');
    });

    it('includes isStockScreen when not null', () => {
      const component = makeComponent();
      const rtx = makeRuntimeContext({ isStockScreen: true });
      const result = buildWrapperProps(component, false, 'designer', false, {}, noopClick, rtx);
      expect(result.isStockScreen).toBe(true);
    });

    it('does NOT include isStockScreen when null', () => {
      const component = makeComponent();
      const rtx = makeRuntimeContext({ isStockScreen: null });
      const result = buildWrapperProps(component, false, 'designer', false, {}, noopClick, rtx);
      expect(result).not.toHaveProperty('isStockScreen');
    });
  });
});
