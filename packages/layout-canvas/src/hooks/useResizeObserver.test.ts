import { renderHook, act } from '@testing-library/react-hooks';
import { useResizeObserver } from './useResizeObserver';

// Mock ResizeObserver
let resizeObserverCallback: ResizeObserverCallback | null = null;
let observedElements: Element[] = [];

const mockDisconnect = jest.fn();
const mockObserve = jest.fn((element: Element) => {
  observedElements.push(element);
});

class MockResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    resizeObserverCallback = callback;
  }
  observe = mockObserve;
  unobserve = jest.fn();
  disconnect = mockDisconnect;
}

// Store original and replace
const OriginalResizeObserver = global.ResizeObserver;

beforeAll(() => {
  global.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
});

afterAll(() => {
  global.ResizeObserver = OriginalResizeObserver;
});

beforeEach(() => {
  jest.useFakeTimers();
  resizeObserverCallback = null;
  observedElements = [];
  mockDisconnect.mockClear();
  mockObserve.mockClear();
});

afterEach(() => {
  jest.useRealTimers();
});

function triggerResize(width: number, height: number) {
  if (!resizeObserverCallback) return;
  const entry = {
    contentRect: { width, height, x: 0, y: 0, top: 0, left: 0, bottom: height, right: width },
    target: document.createElement('div'),
    borderBoxSize: [],
    contentBoxSize: [],
    devicePixelContentBoxSize: [],
  } as unknown as ResizeObserverEntry;
  resizeObserverCallback([entry], {} as ResizeObserver);
}

describe('useResizeObserver', () => {
  it('initializes with zero dimensions', () => {
    const { result } = renderHook(() => useResizeObserver());
    expect(result.current.size).toEqual({ width: 0, height: 0 });
  });

  it('returns a ref callback', () => {
    const { result } = renderHook(() => useResizeObserver());
    expect(typeof result.current.ref).toBe('function');
  });

  it('observes element when ref is attached', () => {
    const { result } = renderHook(() => useResizeObserver());
    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    expect(mockObserve).toHaveBeenCalledWith(element);
  });

  it('updates size when element resizes', () => {
    const { result } = renderHook(() => useResizeObserver({ debounceMs: 0 }));
    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    act(() => {
      triggerResize(200, 100);
      jest.runAllTimers();
    });

    expect(result.current.size).toEqual({ width: 200, height: 100 });
  });

  it('debounces rapid size changes', () => {
    const { result } = renderHook(() => useResizeObserver({ debounceMs: 150 }));
    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    // Fire multiple resizes rapidly
    act(() => {
      triggerResize(100, 50);
      triggerResize(200, 100);
      triggerResize(300, 150);
    });

    // Before debounce expires, should still be initial
    expect(result.current.size).toEqual({ width: 0, height: 0 });

    // After debounce, should have final value
    act(() => {
      jest.advanceTimersByTime(150);
    });

    expect(result.current.size).toEqual({ width: 300, height: 150 });
  });

  it('ignores changes below threshold', () => {
    const { result } = renderHook(() => useResizeObserver({ debounceMs: 0, threshold: 5 }));
    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    // Set initial size
    act(() => {
      triggerResize(100, 100);
      jest.runAllTimers();
    });

    expect(result.current.size).toEqual({ width: 100, height: 100 });

    // Change below threshold should be ignored
    act(() => {
      triggerResize(102, 103);
      jest.runAllTimers();
    });

    expect(result.current.size).toEqual({ width: 100, height: 100 });

    // Change above threshold should be reported
    act(() => {
      triggerResize(110, 110);
      jest.runAllTimers();
    });

    expect(result.current.size).toEqual({ width: 110, height: 110 });
  });

  it('does not observe when disabled', () => {
    const { result } = renderHook(() => useResizeObserver({ enabled: false }));
    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    expect(mockObserve).not.toHaveBeenCalled();
  });

  it('disconnects observer when ref is set to null', () => {
    const { result } = renderHook(() => useResizeObserver());
    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    act(() => {
      result.current.ref(null);
    });

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('disconnects observer on unmount', () => {
    const { result, unmount } = renderHook(() => useResizeObserver());
    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });
});
