/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useContainerState } from '../hooks/useContainerState';
import type { ResponsiveComponent } from '../../rgl-integration/types';

const makeChild = (id: string): ResponsiveComponent =>
  ({
    id,
    type: 'BTN',
    x: 0,
    y: 0,
    width: 2,
    height: 2,
    content: '',
    isHidden: false,
    containerId: 'c1',
    static: false,
  }) as unknown as ResponsiveComponent;

// Helper component to test the hook
const HookTester = ({
  containerId,
  childComponents,
  selectedComponentId,
}: {
  containerId: string;
  childComponents: ResponsiveComponent[];
  selectedComponentId?: string;
}) => {
  const { visualState, toggleCollapse, setHovered, setDragOver } = useContainerState(
    containerId,
    childComponents,
    selectedComponentId,
  );
  return (
    <div>
      <div data-testid='state'>{JSON.stringify(visualState)}</div>
      <button data-testid='toggle-collapse' onClick={toggleCollapse}>
        Toggle
      </button>
      <button data-testid='set-hovered-true' onClick={() => setHovered(true)}>
        Hover
      </button>
      <button data-testid='set-hovered-false' onClick={() => setHovered(false)}>
        Unhover
      </button>
      <button data-testid='set-drag-over-true' onClick={() => setDragOver(true)}>
        DragOver
      </button>
      <button data-testid='set-drag-over-false' onClick={() => setDragOver(false)}>
        DragLeave
      </button>
    </div>
  );
};

describe('useContainerState', () => {
  it('should return correct initial state for empty container', () => {
    render(<HookTester containerId='c1' childComponents={[]} />);

    const state = JSON.parse(screen.getByTestId('state').textContent || '{}');
    expect(state).toEqual({
      isHovered: false,
      isSelected: false,
      isCollapsed: false,
      isDragOver: false,
      isEmpty: true,
    });
  });

  it('should return isEmpty=false when children exist', () => {
    render(<HookTester containerId='c1' childComponents={[makeChild('child-1')]} />);

    const state = JSON.parse(screen.getByTestId('state').textContent || '{}');
    expect(state.isEmpty).toBe(false);
  });

  it('should detect selected state when containerId matches selectedComponentId', () => {
    render(<HookTester containerId='c1' childComponents={[]} selectedComponentId='c1' />);

    const state = JSON.parse(screen.getByTestId('state').textContent || '{}');
    expect(state.isSelected).toBe(true);
  });

  it('should not be selected when selectedComponentId does not match', () => {
    render(<HookTester containerId='c1' childComponents={[]} selectedComponentId='other' />);

    const state = JSON.parse(screen.getByTestId('state').textContent || '{}');
    expect(state.isSelected).toBe(false);
  });

  it('should toggle collapse state', () => {
    render(<HookTester containerId='c1' childComponents={[]} />);

    const btn = screen.getByTestId('toggle-collapse');

    act(() => {
      btn.click();
    });

    let state = JSON.parse(screen.getByTestId('state').textContent || '{}');
    expect(state.isCollapsed).toBe(true);

    act(() => {
      btn.click();
    });

    state = JSON.parse(screen.getByTestId('state').textContent || '{}');
    expect(state.isCollapsed).toBe(false);
  });

  it('should set hover state', () => {
    render(<HookTester containerId='c1' childComponents={[]} />);

    act(() => {
      screen.getByTestId('set-hovered-true').click();
    });

    let state = JSON.parse(screen.getByTestId('state').textContent || '{}');
    expect(state.isHovered).toBe(true);

    act(() => {
      screen.getByTestId('set-hovered-false').click();
    });

    state = JSON.parse(screen.getByTestId('state').textContent || '{}');
    expect(state.isHovered).toBe(false);
  });

  it('should set drag over state', () => {
    render(<HookTester containerId='c1' childComponents={[]} />);

    act(() => {
      screen.getByTestId('set-drag-over-true').click();
    });

    let state = JSON.parse(screen.getByTestId('state').textContent || '{}');
    expect(state.isDragOver).toBe(true);

    act(() => {
      screen.getByTestId('set-drag-over-false').click();
    });

    state = JSON.parse(screen.getByTestId('state').textContent || '{}');
    expect(state.isDragOver).toBe(false);
  });
});
