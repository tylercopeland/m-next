import { renderHook, act } from '@testing-library/react-hooks';
import { useDropdownSearch } from './useDropdownSearch';

describe('useDropdownSearch', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const createConfig = (overrides = {}) => ({
    loadData: jest.fn(),
    getTotalRows: jest.fn(() => 0),
    enabled: true,
    ...overrides,
  });

  describe('when enabled', () => {
    it('returns defined handlers', () => {
      const config = createConfig();
      const { result } = renderHook(() => useDropdownSearch(config));

      expect(result.current.handleInputChange).toBeDefined();
      expect(result.current.handleMenuScrollToBottom).toBeDefined();
      expect(result.current.serverSideFilterOption).toBeDefined();
      expect(result.current.resetAndReload).toBeDefined();
    });

    it('serverSideFilterOption always returns true', () => {
      const config = createConfig();
      const { result } = renderHook(() => useDropdownSearch(config));
      expect(result.current.serverSideFilterOption!()).toBe(true);
    });
  });

  describe('when disabled', () => {
    it('returns undefined handlers except resetAndReload', () => {
      const config = createConfig({ enabled: false });
      const { result } = renderHook(() => useDropdownSearch(config));

      expect(result.current.handleInputChange).toBeUndefined();
      expect(result.current.handleMenuScrollToBottom).toBeUndefined();
      expect(result.current.serverSideFilterOption).toBeUndefined();
      expect(result.current.resetAndReload).toBeDefined();
    });
  });

  describe('handleInputChange', () => {
    it('debounces and calls loadData after 300ms', () => {
      const config = createConfig();
      const { result } = renderHook(() => useDropdownSearch(config));

      act(() => {
        result.current.handleInputChange!('test', { action: 'input-change' });
      });

      expect(config.loadData).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(config.loadData).toHaveBeenCalledWith('test', 1, false);
    });

    it('cancels previous debounce on rapid typing', () => {
      const config = createConfig();
      const { result } = renderHook(() => useDropdownSearch(config));

      act(() => {
        result.current.handleInputChange!('t', { action: 'input-change' });
      });
      act(() => {
        jest.advanceTimersByTime(100);
      });
      act(() => {
        result.current.handleInputChange!('te', { action: 'input-change' });
      });
      act(() => {
        jest.advanceTimersByTime(100);
      });
      act(() => {
        result.current.handleInputChange!('tes', { action: 'input-change' });
      });
      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(config.loadData).toHaveBeenCalledTimes(1);
      expect(config.loadData).toHaveBeenCalledWith('tes', 1, false);
    });

    it('ignores non-input-change action types', () => {
      const config = createConfig();
      const { result } = renderHook(() => useDropdownSearch(config));

      act(() => {
        result.current.handleInputChange!('test', { action: 'set-value' });
      });
      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(config.loadData).not.toHaveBeenCalled();
    });

    it('trims whitespace and sends null for empty string', () => {
      const config = createConfig();
      const { result } = renderHook(() => useDropdownSearch(config));

      act(() => {
        result.current.handleInputChange!('  ', { action: 'input-change' });
      });
      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(config.loadData).toHaveBeenCalledWith(null, 1, false);
    });

    it('resets page back to 1 after scrolling', () => {
      const config = createConfig({ getTotalRows: jest.fn(() => 200) });
      const { result } = renderHook(() => useDropdownSearch(config));

      // Scroll to page 3
      act(() => {
        result.current.handleMenuScrollToBottom!();
      });
      act(() => {
        result.current.handleMenuScrollToBottom!();
      });

      expect(config.loadData).toHaveBeenLastCalledWith(null, 3, true);

      // Now search — should reset to page 1
      act(() => {
        result.current.handleInputChange!('search', { action: 'input-change' });
      });
      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(config.loadData).toHaveBeenLastCalledWith('search', 1, false);
    });
  });

  describe('handleMenuScrollToBottom', () => {
    it('loads next page when more results available', () => {
      const config = createConfig({ getTotalRows: jest.fn(() => 100) });
      const { result } = renderHook(() => useDropdownSearch(config));

      act(() => {
        result.current.handleMenuScrollToBottom!();
      });

      expect(config.loadData).toHaveBeenCalledWith(null, 2, true);
    });

    it('does not load next page when at end', () => {
      const config = createConfig({ getTotalRows: jest.fn(() => 30) });
      const { result } = renderHook(() => useDropdownSearch(config));

      act(() => {
        result.current.handleMenuScrollToBottom!();
      });

      expect(config.loadData).not.toHaveBeenCalled();
    });

    it('increments page correctly on multiple scrolls', () => {
      const config = createConfig({ getTotalRows: jest.fn(() => 200) });
      const { result } = renderHook(() => useDropdownSearch(config));

      act(() => {
        result.current.handleMenuScrollToBottom!();
      });
      expect(config.loadData).toHaveBeenCalledWith(null, 2, true);

      act(() => {
        result.current.handleMenuScrollToBottom!();
      });
      expect(config.loadData).toHaveBeenCalledWith(null, 3, true);
    });
  });

  describe('resetAndReload', () => {
    it('clears timer, resets state, and calls loadData', () => {
      const config = createConfig();
      const { result } = renderHook(() => useDropdownSearch(config));

      act(() => {
        result.current.resetAndReload();
      });

      expect(config.loadData).toHaveBeenCalledWith(null, 1, false);
    });

    it('cancels pending debounce timer', () => {
      const config = createConfig();
      const { result } = renderHook(() => useDropdownSearch(config));

      act(() => {
        result.current.handleInputChange!('test', { action: 'input-change' });
      });

      // Reset before debounce fires
      act(() => {
        result.current.resetAndReload();
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      // Should only have the resetAndReload call, not the debounced search
      expect(config.loadData).toHaveBeenCalledTimes(1);
      expect(config.loadData).toHaveBeenCalledWith(null, 1, false);
    });
  });

  describe('custom debounceMs and pageSize', () => {
    it('respects custom debounceMs', () => {
      const config = createConfig({ debounceMs: 500 });
      const { result } = renderHook(() => useDropdownSearch(config));

      act(() => {
        result.current.handleInputChange!('test', { action: 'input-change' });
      });
      act(() => {
        jest.advanceTimersByTime(300);
      });
      expect(config.loadData).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(200);
      });
      expect(config.loadData).toHaveBeenCalledWith('test', 1, false);
    });

    it('respects custom pageSize', () => {
      const config = createConfig({ pageSize: 25, getTotalRows: jest.fn(() => 30) });
      const { result } = renderHook(() => useDropdownSearch(config));

      act(() => {
        result.current.handleMenuScrollToBottom!();
      });

      expect(config.loadData).toHaveBeenCalledWith(null, 2, true);
    });
  });

  describe('cleanup', () => {
    it('cleans up timer on unmount', () => {
      const config = createConfig();
      const { result, unmount } = renderHook(() => useDropdownSearch(config));

      act(() => {
        result.current.handleInputChange!('test', { action: 'input-change' });
      });

      unmount();

      // Timer should be cleaned up — no errors, no leaks
      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(config.loadData).not.toHaveBeenCalled();
    });
  });
});
