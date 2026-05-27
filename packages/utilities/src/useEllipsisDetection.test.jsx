/* eslint-disable import/no-extraneous-dependencies */
import { renderHook } from '@testing-library/react-hooks';
import { act } from '@testing-library/react';
import useEllipsisDetection from './useEllipsisDetection';

describe('useEllipsisDetection', () => {
  let mockRef;
  const originalResizeObserver = window.ResizeObserver;
  const originalMutationObserver = window.MutationObserver;
  let resizeCallback;
  let mutationCallback;

  beforeEach(() => {
    // Mock ResizeObserver
    window.ResizeObserver = jest.fn((callback) => {
      resizeCallback = callback;
      return {
        observe: jest.fn(),
        disconnect: jest.fn(),
      };
    });

    // Mock MutationObserver
    window.MutationObserver = jest.fn((callback) => {
      mutationCallback = callback;
      return {
        observe: jest.fn(),
        disconnect: jest.fn(),
      };
    });

    // Mock element
    mockRef = {
      current: {
        scrollWidth: 100,
        clientWidth: 50,
        textContent: 'Initial text',
      },
    };

    // Mock window resize event
    window.addEventListener = jest.fn();
    window.removeEventListener = jest.fn();
  });

  afterEach(() => {
    window.ResizeObserver = originalResizeObserver;
    window.MutationObserver = originalMutationObserver;
    jest.clearAllMocks();
  });

  test('should detect ellipsis when text overflows', () => {
    const { result } = renderHook(() => useEllipsisDetection(mockRef));
    expect(result.current).toBe(true);
  });

  test('should not detect ellipsis when text fits', () => {
    mockRef.current.scrollWidth = 40;
    const { result } = renderHook(() => useEllipsisDetection(mockRef));
    expect(result.current).toBe(false);
  });

  test('should handle null ref', () => {
    mockRef.current = null;
    const { result } = renderHook(() => useEllipsisDetection(mockRef));
    expect(result.current).toBe(false);
  });

  test('should update on content mutation', () => {
    const { result } = renderHook(() => useEllipsisDetection(mockRef));
    expect(result.current).toBe(true);

    // Simulate content change
    mockRef.current.scrollWidth = 40;
    act(() => {
      mutationCallback([{ type: 'characterData' }]);
    });

    expect(result.current).toBe(false);
  });

  test('should update on resize', () => {
    const { result } = renderHook(() => useEllipsisDetection(mockRef));
    expect(result.current).toBe(true);

    // Simulate resize
    mockRef.current.scrollWidth = 40;
    act(() => {
      resizeCallback([{ target: mockRef.current }]);
    });

    expect(result.current).toBe(false);
  });

  test('should update on window resize', () => {
    const { result } = renderHook(() => useEllipsisDetection(mockRef));
    expect(result.current).toBe(true);

    // Get the resize handler
    const resizeHandler = window.addEventListener.mock.calls.find((call) => call[0] === 'resize')[1];

    // Simulate window resize
    mockRef.current.scrollWidth = 40;
    act(() => {
      resizeHandler();
    });

    expect(result.current).toBe(false);
  });

  test('should cleanup observers on unmount', () => {
    const resizeDisconnect = jest.fn();
    const mutationDisconnect = jest.fn();

    window.ResizeObserver = jest.fn(() => ({
      observe: jest.fn(),
      disconnect: resizeDisconnect,
    }));

    window.MutationObserver = jest.fn(() => ({
      observe: jest.fn(),
      disconnect: mutationDisconnect,
    }));

    const { unmount } = renderHook(() => useEllipsisDetection(mockRef));

    unmount();

    expect(resizeDisconnect).toHaveBeenCalled();
    expect(mutationDisconnect).toHaveBeenCalled();
    expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  test('should handle ref changes', () => {
    const { result, rerender } = renderHook(({ ref }) => useEllipsisDetection(ref), {
      initialProps: { ref: mockRef },
    });
    expect(result.current).toBe(true);

    // Change ref
    const newRef = {
      current: {
        scrollWidth: 40,
        clientWidth: 50,
      },
    };

    act(() => {
      rerender({ ref: newRef });
    });

    expect(result.current).toBe(false);
  });
});
