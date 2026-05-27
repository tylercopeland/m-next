import React from 'react';
import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom';

// Track Dropdown props for assertions
let capturedDropdownProps: Record<string, any> = {};

// Mock Dropdown component
jest.mock('@m-next/dropdown', () => ({
  __esModule: true,
  default: (props: Record<string, any>) => {
    capturedDropdownProps = props;
    return (
      <div data-testid={`dropdown-${props.id}`}>
        {props.onMenuOpen && (
          <button data-testid='menu-open-btn' onClick={props.onMenuOpen}>
            Open
          </button>
        )}
      </div>
    );
  },
}));

// Mock utilities
jest.mock('@m-next/utilities', () => ({
  toCamelCase: (val: any) => val,
}));

import GridDropdownCell from '../GridDropdownCell';

const createMockColumn = (overrides = {}) => ({
  name: 'Status',
  editable: true,
  ...overrides,
});

const createMockCol = (overrides = {}) => ({
  field: 'Status',
  header: 'Status',
  fieldType: 7, // DropDown
  format: {},
  control: {
    id: 'ctrl-1',
    model: { columns: [{ name: 'RecordID' }, { name: 'Name' }] },
  },
  ...overrides,
});

const mockDropdownData = {
  data: [
    { RecordID: '1', Name: 'Option A' },
    { RecordID: '2', Name: 'Option B' },
  ],
  totalRows: 150,
};

const mockDropdownDataSmall = {
  data: [{ RecordID: '1', Name: 'Option A' }],
  totalRows: 1,
};

describe('GridDropdownCell', () => {
  let loadDropdownDataFn: jest.Mock;
  let getDropdownDataFn: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    capturedDropdownProps = {};
    loadDropdownDataFn = jest.fn();
    getDropdownDataFn = jest.fn(() => mockDropdownData);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const renderCell = (overrides: Record<string, any> = {}) => {
    return render(
      <GridDropdownCell
        id='cell-0'
        column={createMockColumn()}
        col={createMockCol()}
        loadDropdownDataFn={loadDropdownDataFn}
        getDropdownDataFn={getDropdownDataFn}
        {...overrides}
      />,
    );
  };

  describe('search integration', () => {
    it('passes onInputChange to Dropdown', () => {
      renderCell();
      expect(capturedDropdownProps.onInputChange).toBeDefined();
      expect(typeof capturedDropdownProps.onInputChange).toBe('function');
    });

    it('passes onMenuScrollToBottom to Dropdown', () => {
      renderCell();
      expect(capturedDropdownProps.onMenuScrollToBottom).toBeDefined();
      expect(typeof capturedDropdownProps.onMenuScrollToBottom).toBe('function');
    });

    it('passes filterOption to Dropdown (server-side filtering)', () => {
      renderCell();
      expect(capturedDropdownProps.filterOption).toBeDefined();
      // Server-side filter should always return true
      expect(capturedDropdownProps.filterOption()).toBe(true);
    });

    it('calls loadDropdownDataFn with search text on input change', () => {
      renderCell();

      act(() => {
        capturedDropdownProps.onInputChange('Zach', { action: 'input-change' });
      });

      // Debounce: advance timers
      act(() => {
        jest.advanceTimersByTime(300);
      });

      // Should have called with searchText, page 1, append false
      expect(loadDropdownDataFn).toHaveBeenCalledWith(expect.objectContaining({ id: 'ctrl-1' }), 'Zach', 1, false);
    });

    it('does not trigger search for non-input-change actions', () => {
      renderCell();

      act(() => {
        capturedDropdownProps.onInputChange('', { action: 'menu-close' });
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      // loadDropdownDataFn should not have been called for search
      // (it may have been called for initial load, so check the specific call pattern)
      const searchCalls = loadDropdownDataFn.mock.calls.filter(
        (call: any[]) => call.length === 4 && call[1] !== undefined,
      );
      expect(searchCalls).toHaveLength(0);
    });
  });

  describe('pagination', () => {
    it('loads next page on scroll to bottom when more rows available', () => {
      getDropdownDataFn.mockReturnValue(mockDropdownData); // totalRows: 150
      renderCell();
      loadDropdownDataFn.mockClear();

      act(() => {
        capturedDropdownProps.onMenuScrollToBottom();
      });

      // Should request page 2 with append=true
      expect(loadDropdownDataFn).toHaveBeenCalledWith(expect.objectContaining({ id: 'ctrl-1' }), null, 2, true);
    });

    it('does not load next page when all rows are loaded', () => {
      getDropdownDataFn.mockReturnValue(mockDropdownDataSmall); // totalRows: 1
      renderCell();
      loadDropdownDataFn.mockClear();

      act(() => {
        capturedDropdownProps.onMenuScrollToBottom();
      });

      expect(loadDropdownDataFn).not.toHaveBeenCalled();
    });
  });

  describe('menu open', () => {
    it('resets search and reloads on menu open', () => {
      renderCell();
      loadDropdownDataFn.mockClear();

      act(() => {
        capturedDropdownProps.onMenuOpen();
      });

      // resetAndReload calls loadData(null, 1, false)
      expect(loadDropdownDataFn).toHaveBeenCalledWith(expect.objectContaining({ id: 'ctrl-1' }), null, 1, false);
    });
  });

  describe('options building', () => {
    it('builds options from dropdown data', () => {
      renderCell();
      expect(capturedDropdownProps.options).toEqual([
        { value: '1', label: 'Option A' },
        { value: '2', label: 'Option B' },
      ]);
    });

    it('returns empty options when no data', () => {
      getDropdownDataFn.mockReturnValue(null);
      renderCell();
      expect(capturedDropdownProps.options).toEqual([]);
    });
  });

  describe('value selection', () => {
    it('matches selected value from object format', () => {
      renderCell({ value: { text: 'Option A', value: '1' } });
      expect(capturedDropdownProps.value).toEqual({ value: '1', label: 'Option A' });
    });

    it('matches selected value from primitive format', () => {
      renderCell({ value: '2' });
      expect(capturedDropdownProps.value).toEqual({ value: '2', label: 'Option B' });
    });

    it('returns null for null value', () => {
      renderCell({ value: null });
      expect(capturedDropdownProps.value).toBeNull();
    });

    it('handles value === 0 as a valid selection', () => {
      getDropdownDataFn.mockReturnValue({
        data: [
          { RecordID: 0, Name: 'Zero' },
          { RecordID: '1', Name: 'One' },
        ],
        totalRows: 2,
      });
      renderCell({ value: 0 });
      expect(capturedDropdownProps.value).toEqual({ value: 0, label: 'Zero' });
    });
  });

  describe('when loadDropdownDataFn is undefined', () => {
    it('does not enable server-side filtering', () => {
      renderCell({ loadDropdownDataFn: undefined });
      // filterOption should be undefined (client-side filtering preserved)
      expect(capturedDropdownProps.filterOption).toBeUndefined();
    });
  });
});
