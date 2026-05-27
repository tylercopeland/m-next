/**
 * Integration tests for DropdownWrapperRedux
 *
 * Tests runtime mode (search, pagination, value selection) and designer mode
 * (RTK Query data, lazy trigger search, drag-vs-click, portal rendering).
 */

import React from 'react';
import { render, fireEvent, act, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Track Dropdown props for assertions
let capturedDropdownProps: Record<string, any> = {};

// Mock Dropdown component (NOT lazy-loaded - bypass Suspense)
jest.mock('@m-next/dropdown', () => ({
  __esModule: true,
  default: (props: Record<string, any>) => {
    capturedDropdownProps = props;
    return (
      <div
        data-testid={`dropdown-${props.id}`}
        data-is-portal={String(Boolean(props.isPortal))}
        data-menu-placement={props.menuPlacement}
        data-menu-is-open={String(props.menuIsOpen ?? 'uncontrolled')}
      >
        <select
          data-testid='dropdown-select'
          value={props.value?.value || ''}
          onChange={(e) => {
            const option = props.options?.find((o: any) => String(o.value) === e.target.value);
            if (props.onChange) props.onChange(option, { action: 'select-option' });
          }}
        >
          {props.options?.map((opt: any) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {props.onMenuOpen && (
          <button data-testid='menu-open-btn' onClick={props.onMenuOpen}>
            Open
          </button>
        )}
        {props.onMenuClose && (
          <button data-testid='menu-close-btn' onClick={props.onMenuClose}>
            Close
          </button>
        )}
      </div>
    );
  },
}));

// Mock LoadingSkeleton
jest.mock('@m-next/loading-skeleton', () => ({
  __esModule: true,
  default: () => <div data-testid='loading-skeleton' />,
}));

// Mock utilities
jest.mock('@m-next/utilities', () => ({
  toCamelCase: (val: any) => val,
}));

// Stable data references to avoid infinite re-render loops
const mockRuntimeData = {
  data: [
    { RecordID: '1', FullName: 'Alice' },
    { RecordID: '2', FullName: 'Bob' },
    { RecordID: '3', FullName: 'Charlie' },
  ],
  totalRows: 150,
};

const mockRuntimeDataSmall = {
  data: [
    { RecordID: '1', FullName: 'Alice' },
    { RecordID: '2', FullName: 'Bob' },
  ],
  totalRows: 2,
};

// Context state — prefixed with `mock` to allow jest.mock access
let mockRuntimeActive = false;
const mockRuntimeCtx: Record<string, any> = {
  screenId: 'screen-1',
  activeRecordId: 'record-1',
  loadDropdownData: jest.fn(),
  getDropdownData: jest.fn(() => mockRuntimeData),
};

let mockDesignerActive = false;
const mockDesignerCtx: Record<string, any> = {};

jest.mock('../../contexts/RuntimeContext', () => ({
  useRuntimeContext: () => (mockRuntimeActive ? mockRuntimeCtx : null),
}));

jest.mock('../../contexts/DesignerContext', () => ({
  useDesignerContext: () => (mockDesignerActive ? mockDesignerCtx : null),
}));

import DropdownWrapperRedux from '../DropdownWrapperRedux';

describe('DropdownWrapperRedux', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    capturedDropdownProps = {};

    // Reset context flags
    mockRuntimeActive = false;
    mockDesignerActive = false;

    // Reset runtime context mocks
    mockRuntimeCtx.loadDropdownData = jest.fn();
    mockRuntimeCtx.getDropdownData = jest.fn(() => mockRuntimeData);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const runtimeControl = {
    id: 'drp_contact',
    type: 'dropdown',
    visible: true,
    disabled: false,
    hideCaption: false,
    caption: 'Contact',
    classes: '',
    placeholder: 'Select a contact',
    widthType: 'full',
    defaultValue: '',
    model: {
      viewName: 'contacts',
      columns: ['RecordID', 'FullName'],
    },
    customRowText: '',
    isDisabled: false,
    isMultiSelect: false,
    isClearable: false,
    isWorking: false,
    isBound: false,
    name: 'drp_contact',
    options: [],
    searchable: false,
    clearable: false,
    multiple: false,
    value: undefined,
  };

  const designerControl = {
    id: 'drp_contact',
    type: 'dropdown',
    visible: true,
    disabled: false,
    hideCaption: true,
    caption: 'Contact',
    classes: '',
    placeholder: 'Select a contact',
    widthType: 'full',
    defaultValue: '',
    model: {
      viewName: 'contacts',
      columns: ['RecordID', 'FullName'],
    },
  };

  describe('Runtime Mode', () => {
    beforeEach(() => {
      mockRuntimeActive = true;
    });

    it('renders options from runtime context data', () => {
      render(<DropdownWrapperRedux id='drp_contact' control={runtimeControl} mode='runtime' />);

      expect(capturedDropdownProps.options).toHaveLength(3);
      expect(capturedDropdownProps.options[0]).toEqual({
        label: 'Alice',
        value: '1',
        lines: undefined,
      });
    });

    it('provides search handlers (onInputChange, onMenuScrollToBottom, filterOption)', () => {
      render(<DropdownWrapperRedux id='drp_contact' control={runtimeControl} mode='runtime' />);

      expect(capturedDropdownProps.onInputChange).toBeDefined();
      expect(capturedDropdownProps.onMenuScrollToBottom).toBeDefined();
      expect(capturedDropdownProps.filterOption).toBeDefined();
    });

    it('search triggers loadDropdownData after debounce', () => {
      render(<DropdownWrapperRedux id='drp_contact' control={runtimeControl} mode='runtime' />);

      act(() => {
        capturedDropdownProps.onInputChange('b.gra', { action: 'input-change' });
      });

      // Should not have been called with search text yet (debounce pending)
      const searchCalls = mockRuntimeCtx.loadDropdownData.mock.calls.filter((call: any[]) => call[1] === 'b.gra');
      expect(searchCalls).toHaveLength(0);

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(mockRuntimeCtx.loadDropdownData).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'drp_contact' }),
        'b.gra',
        1,
        false,
      );
    });

    it('scroll pagination calls loadDropdownData with append=true', () => {
      render(<DropdownWrapperRedux id='drp_contact' control={runtimeControl} mode='runtime' />);

      act(() => {
        capturedDropdownProps.onMenuScrollToBottom();
      });

      expect(mockRuntimeCtx.loadDropdownData).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'drp_contact' }),
        null,
        2,
        true,
      );
    });

    it('filterOption disables client-side filtering (always returns true)', () => {
      render(<DropdownWrapperRedux id='drp_contact' control={runtimeControl} mode='runtime' />);

      expect(capturedDropdownProps.filterOption()).toBe(true);
    });

    it('menu open resets search state', () => {
      render(<DropdownWrapperRedux id='drp_contact' control={runtimeControl} mode='runtime' />);

      // Simulate search first
      act(() => {
        capturedDropdownProps.onInputChange('test', { action: 'input-change' });
        jest.advanceTimersByTime(300);
      });

      mockRuntimeCtx.loadDropdownData.mockClear();

      // Open menu — should reset
      act(() => {
        fireEvent.click(screen.getByTestId('menu-open-btn'));
      });

      expect(mockRuntimeCtx.loadDropdownData).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'drp_contact' }),
        null,
        1,
        false,
      );
    });

    it('uses uncontrolled menuIsOpen in runtime mode', () => {
      render(<DropdownWrapperRedux id='drp_contact' mode='runtime' control={runtimeControl} />);

      const dropdown = screen.getByTestId('dropdown-drp_contact');
      expect(dropdown.getAttribute('data-menu-is-open')).toBe('uncontrolled');
    });
  });

  describe('Designer Mode', () => {
    beforeEach(() => {
      mockDesignerActive = true;
      mockDesignerCtx.screenId = 'screen-1';
      mockDesignerCtx.activeRecordId = null;
      mockDesignerCtx.selectControlById = jest.fn(() => designerControl);
      mockDesignerCtx.onLoadDropdownData = jest.fn(() => ({
        data: undefined,
        isLoading: false,
        error: null,
      }));
    });

    it('renders without search handlers when no lazy trigger available', () => {
      delete mockDesignerCtx.onLoadDropdownDataLazy;

      render(<DropdownWrapperRedux id='drp_contact' />);

      expect(capturedDropdownProps.onInputChange).toBeUndefined();
      expect(capturedDropdownProps.onMenuScrollToBottom).toBeUndefined();
      expect(capturedDropdownProps.filterOption).toBeUndefined();
    });

    it('renders with search handlers when lazy trigger is available', () => {
      mockDesignerCtx.onLoadDropdownDataLazy = jest.fn(() => Promise.resolve({ data: { data: [], totalRows: 0 } }));

      render(<DropdownWrapperRedux id='drp_contact' />);

      expect(capturedDropdownProps.onInputChange).toBeDefined();
      expect(capturedDropdownProps.onMenuScrollToBottom).toBeDefined();
      expect(capturedDropdownProps.filterOption).toBeDefined();
    });

    it('re-selects the control when menu closes in designer mode', () => {
      const onControlClick = jest.fn();

      render(<DropdownWrapperRedux id='drp_contact' mode='designer' onControlClick={onControlClick} />);

      fireEvent.click(screen.getByTestId('menu-close-btn'));

      expect(onControlClick).toHaveBeenCalledWith('drp_contact');
    });

    it('does not call onControlClick from menu close in runtime mode', () => {
      mockRuntimeActive = true;
      mockDesignerActive = false;
      const onControlClick = jest.fn();

      render(
        <DropdownWrapperRedux
          id='drp_contact'
          mode='runtime'
          control={runtimeControl}
          onControlClick={onControlClick}
        />,
      );

      fireEvent.click(screen.getByTestId('menu-close-btn'));

      expect(onControlClick).not.toHaveBeenCalled();
    });

    it('enables portal rendering for dropdowns inside containers', () => {
      const inContainerControl = {
        ...designerControl,
        containerId: 'container-1',
      };

      mockDesignerCtx.selectControlById = jest.fn(() => inContainerControl);

      render(<DropdownWrapperRedux id='drp_contact' mode='designer' />);

      const dropdown = screen.getByTestId('dropdown-drp_contact');
      expect(dropdown.getAttribute('data-is-portal')).toBe('true');
      expect(dropdown.getAttribute('data-menu-placement')).toBe('auto');
    });

    it('keeps non-container dropdowns on normal rendering path', () => {
      render(<DropdownWrapperRedux id='drp_contact' mode='designer' />);

      const dropdown = screen.getByTestId('dropdown-drp_contact');
      expect(dropdown.getAttribute('data-is-portal')).toBe('false');
    });

    it('detects container context from DOM on fresh mount when containerId is missing', async () => {
      render(
        <div className='layout-container-drop-zone'>
          <DropdownWrapperRedux id='drp_contact' mode='designer' />
        </div>,
      );

      await waitFor(() => {
        const dropdown = screen.getByTestId('dropdown-drp_contact');
        expect(dropdown.getAttribute('data-is-portal')).toBe('true');
      });
    });

    describe('drag-vs-click detection', () => {
      it('opens menu after timeout when user clicks without dragging', () => {
        render(<DropdownWrapperRedux id='drp_contact' mode='designer' />);

        const dropdown = screen.getByTestId('dropdown-drp_contact');
        expect(dropdown.getAttribute('data-menu-is-open')).toBe('false');

        // Simulate a clean click on the open button (no drag)
        fireEvent.click(screen.getByTestId('menu-open-btn'));

        // Menu should not be open yet (deferred by 100ms)
        expect(dropdown.getAttribute('data-menu-is-open')).toBe('false');

        // Advance past the defer timer
        act(() => {
          jest.advanceTimersByTime(150);
        });

        expect(dropdown.getAttribute('data-menu-is-open')).toBe('true');
      });

      it('does not open menu when user mousedowns and drags', () => {
        render(<DropdownWrapperRedux id='drp_contact' mode='designer' />);

        const wrapper = screen.getByTestId('dropdown-drp_contact').closest('.dd-wrapper') as HTMLElement;
        const dropdown = screen.getByTestId('dropdown-drp_contact');

        // Mousedown on the wrapper (starts drag tracking)
        fireEvent.mouseDown(wrapper, { clientX: 100, clientY: 100 });

        // Trigger menu open attempt (react-select would do this on mousedown)
        fireEvent.click(screen.getByTestId('menu-open-btn'));

        // Simulate drag movement beyond threshold (>5px)
        fireEvent.mouseMove(document, { clientX: 110, clientY: 110 });

        // Advance past the defer timer
        act(() => {
          jest.advanceTimersByTime(150);
        });

        // Menu should NOT be open because drag was detected
        expect(dropdown.getAttribute('data-menu-is-open')).toBe('false');

        // Clean up
        fireEvent.mouseUp(document);
      });
    });
  });

  describe('Value Selection', () => {
    it('onChange fires with selected option', () => {
      mockRuntimeActive = true;
      mockRuntimeCtx.getDropdownData = jest.fn(() => mockRuntimeDataSmall);

      const mockUpdateValue = jest.fn();

      render(
        <DropdownWrapperRedux
          id='drp_contact'
          control={runtimeControl}
          mode='runtime'
          runtimeUpdateControlValue={mockUpdateValue}
        />,
      );

      // Simulate selecting "Bob"
      act(() => {
        capturedDropdownProps.onChange({ label: 'Bob', value: '2' }, { action: 'select-option' });
      });

      expect(mockUpdateValue).toHaveBeenCalledWith('drp_contact', {
        Id: 2,
        Text: 'Bob',
      });
    });
  });
});
