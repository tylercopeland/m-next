import { renderHook } from '@testing-library/react-hooks';
import { useButtonTranslation } from './useButtonTranslation';
import { ButtonControl } from '../types';
import WIDGETS from '../types/widgetTypes';

describe('useButtonTranslation', () => {
  it('should return translated button properties', () => {
    const control: ButtonControl = {
      id: 'test-btn',
      type: WIDGETS.BUTTON,
      hideCaption: false,
      name: 'testButton',
      visible: true,
      isBound: false,
      disabled: false,
      classes: 'test-class',
      caption: 'Test Button',
      styles: {
        variant: 'primary',
        color: 'blue',
      },
      isWorking: false,
    };

    const onControlClick = jest.fn();

    const { result } = renderHook(() => useButtonTranslation(control, onControlClick));

    expect(result.current.widgetProps.id).toBe('test-btn');
    expect(result.current.widgetProps.value).toBe(' Test Button ');
    expect(result.current.widgetProps.isV4Design).toBe(true);
    expect(result.current.v4Styling).toBeTruthy();
  });

  it('should memoize results when inputs do not change', () => {
    const control: ButtonControl = {
      id: 'test-btn',
      classes: 'test-class',
      caption: 'Test Button',
      type: WIDGETS.BUTTON,
      hideCaption: false,
      name: 'testButton',
      visible: true,
      isBound: false,
      disabled: false,
      isWorking: false,
    };

    const onControlClick = jest.fn();

    const { result, rerender } = renderHook(() => useButtonTranslation(control, onControlClick));
    const firstResult = result.current;

    rerender();
    const secondResult = result.current;

    expect(firstResult).toBe(secondResult);
  });

  it('should update when control changes', () => {
    const initialControl: ButtonControl = {
      id: 'test-btn',
      classes: 'test-class',
      caption: 'Test Button',
      type: WIDGETS.BUTTON,
      hideCaption: false,
      name: 'testButton',
      visible: true,
      isBound: false,
      disabled: false,
      isWorking: false,
    };

    const updatedControl: ButtonControl = {
      id: 'test-btn',
      classes: 'test-class',
      caption: 'Updated Button',
      type: WIDGETS.BUTTON,
      hideCaption: false,
      name: 'testButton',
      visible: true,
      isBound: false,
      disabled: false,
      isWorking: false,
    };

    const onControlClick = jest.fn();

    const { result, rerender } = renderHook(({ control }) => useButtonTranslation(control, onControlClick), {
      initialProps: { control: initialControl },
    });

    const firstResult = result.current;
    expect(firstResult.widgetProps.value).toBe(' Test Button ');

    rerender({ control: updatedControl });

    const secondResult = result.current;
    expect(secondResult.widgetProps.value).toBe(' Updated Button ');
    expect(firstResult).not.toBe(secondResult);
  });
});
