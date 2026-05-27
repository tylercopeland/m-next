import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { formatter } from '@m-next/utilities';
import '@testing-library/jest-dom';

import MappedFieldSelector from './MappedFieldSelector';

const mockStore = configureStore([]);

// Mock dependencies
jest.mock('@m-next/typeography', () => ({
  Text: function MockText({ children, tooltip, tooltipId, tooltipHighlighting }) {
    return (
      <span data-testid='text' title={tooltip} data-tooltip-id={tooltipId}>
        {children}
        {tooltipHighlighting && <span data-testid='tooltip-highlight'>*</span>}
      </span>
    );
  },
}));

jest.mock(
  '@m-next/loading-skeleton',
  () =>
    function MockLoadingSkeleton({ count, height }) {
      return (
        <div data-testid='loading-skeleton' data-count={count} data-height={height}>
          Loading...
        </div>
      );
    },
);

jest.mock('@m-next/layout-canvas', () => ({
  Z_POPUP: { POPOVER: 1000, TOOLTIP: 1100, GRID_FILTER: 1200, SCREEN_SELECTOR: 1300, COLOR_PICKER: 2000 },
}));

jest.mock('@m-next/button-group', () => ({
  ButtonGroupRow: function MockButtonGroupRow({ id, selected, data, onClick, width, tooltipId, tooltipPlace }) {
    return (
      <div
        data-testid={`button-group-${id}`}
        data-width={width}
        data-tooltip-id={tooltipId}
        data-tooltip-place={tooltipPlace}
      >
        {data.map((item) => (
          <button
            key={item.value}
            type='button'
            onClick={() => onClick(item)}
            data-testid={`button-group-option-${item.value}`}
            className={selected === item.value ? 'selected' : ''}
            disabled={item.disabled}
            title={item.tooltip}
          >
            {item.label}
          </button>
        ))}
      </div>
    );
  },
}));

jest.mock(
  '@m-next/dropdown',
  () =>
    function MockDropdown({ id, value, options, onChange, dropdownStyle, isV4Design, width, disabled }) {
      return (
        <div
          data-testid={`dropdown-${id}`}
          data-style={dropdownStyle}
          data-v4-design={isV4Design}
          data-width={width}
          data-disabled={disabled}
        >
          <select
            value={value?.value || ''}
            onChange={(e) => {
              const selected = options.find((opt) => opt.value === e.target.value);
              if (selected && onChange) onChange(selected);
            }}
            disabled={disabled}
            data-testid={`dropdown-select-${id}`}
          >
            {value && <option value={value.value}>{value.label}</option>}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    },
);

jest.mock('@m-next/utilities', () => ({
  formatter: {
    formatFieldList: jest.fn(() => [
      {
        options: [
          { value: 'textField1', label: 'Text Field 1' },
          { value: 'textField2', label: 'Text Field 2' },
          { value: 'numberField1', label: 'Number Field 1' },
          { value: 'emailField1', label: 'Email Field 1' },
        ],
      },
    ]),
  },
}));

// Mock styled components
jest.mock('../../BlockEditor.styles', () => ({
  ContentWrapper: function MockContentWrapper({ children }) {
    return <div data-testid='content-wrapper'>{children}</div>;
  },
  LineWrapper: function MockLineWrapper({ children }) {
    return <div data-testid='line-wrapper'>{children}</div>;
  },
}));

describe('MappedFieldSelector', () => {
  let store;
  let defaultProps;

  const defaultStore = {
    screenLayout: {
      baseModel: 'Customer',
      controls: {
        'control-1': { id: 'control-1', name: 'existingControl1', isBound: true },
        'control-2': { id: 'control-2', name: 'existingControl2', isBound: false },
      },
      fields: [
        { name: 'textField1', caption: 'Text Field 1', type: 'text' },
        { name: 'textField2', caption: 'Text Field 2', type: 'text' },
        { name: 'numberField1', caption: 'Number Field 1', type: 'number' },
        { name: 'emailField1', caption: 'Email Field 1', type: 'email' },
        { name: 'existingControl1', caption: 'Used Field', type: 'text' },
      ],
    },
  };

  const defaultControl = {
    id: 'test-control',
    name: 'testControl',
    isBound: false,
  };

  beforeEach(() => {
    store = mockStore(defaultStore);
    defaultProps = {
      control: defaultControl,
      onChange: jest.fn(),
      fieldTypes: ['text', 'number', 'email'],
      isLoading: false,
    };
    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) =>
    render(
      <Provider store={store}>
        <MappedFieldSelector {...defaultProps} {...props} />
      </Provider>,
    );

  describe('Loading State', () => {
    it('should show loading skeleton when loading is set to true', () => {
      const storeWithoutFields = mockStore({
        screenLayout: {
          ...defaultStore.screenLayout,
          fields: null,
        },
      });

      const props = { ...defaultProps, isLoading: true };
      render(
        <Provider store={storeWithoutFields}>
          <MappedFieldSelector {...props} />
        </Provider>,
      );

      expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should not show content when loading', () => {
      const storeWithoutFields = mockStore({
        screenLayout: {
          ...defaultStore.screenLayout,
          fields: null,
        },
      });

      const props = { ...defaultProps, isLoading: true };

      render(
        <Provider store={storeWithoutFields}>
          <MappedFieldSelector {...props} />
        </Provider>,
      );

      expect(screen.queryByTestId('content-wrapper')).not.toBeInTheDocument();
    });
  });

  describe('Data Source Selection', () => {
    it('should render data source section with Manual and Mapped options', () => {
      renderComponent();

      expect(screen.getByText('Data source')).toBeInTheDocument();
      expect(screen.getByTestId('button-group-data-source')).toBeInTheDocument();
      expect(screen.getByTestId('button-group-option-false')).toBeInTheDocument();
      expect(screen.getByTestId('button-group-option-true')).toBeInTheDocument();
    });

    it('should show tooltip for data source', () => {
      renderComponent();

      const dataSourceText = screen.getByTestId('text');
      expect(dataSourceText).toHaveAttribute('title', 'Manual is for display only; mapped writes data to the table.');
      expect(dataSourceText).toHaveAttribute('data-tooltip-id', 'mapped-tooltip');
    });

    it('should handle switching to mapped data source', async () => {
      renderComponent();

      const mappedButton = screen.getByTestId('button-group-option-true');
      fireEvent.click(mappedButton);

      await waitFor(() => {
        expect(defaultProps.onChange).toHaveBeenCalledWith(
          expect.objectContaining({ id: 'test-control', isBound: true, name: 'emailField1' }),
        );
      });
    });

    it('should handle switching to manual data source', async () => {
      const boundControl = { ...defaultControl, isBound: true, name: 'textField1' };
      renderComponent({ control: boundControl });

      const manualButton = screen.getByTestId('button-group-option-false');
      fireEvent.click(manualButton);

      await waitFor(() => {
        expect(defaultProps.onChange).toHaveBeenCalledWith(
          expect.objectContaining({
            isBound: false,
            name: expect.any(String), // Should sanitize the name
          }),
        );
      });
    });

    it('should disable mapped option when no compatible fields are available', () => {
      // Create a store where all fields are already used
      const storeAllFieldsUsed = mockStore({
        screenLayout: {
          ...defaultStore.screenLayout,
          controls: {
            'control-1': { id: 'control-1', name: 'textField1', isBound: true },
            'control-2': { id: 'control-2', name: 'textField2', isBound: true },
            'control-3': { id: 'control-3', name: 'numberField1', isBound: true },
            'control-4': { id: 'control-4', name: 'emailField1', isBound: true },
          },
        },
      });

      render(
        <Provider store={storeAllFieldsUsed}>
          <MappedFieldSelector {...defaultProps} />
        </Provider>,
      );

      const mappedButton = screen.getByTestId('button-group-option-true');
      expect(mappedButton).toBeDisabled();
      expect(mappedButton).toHaveAttribute('title', 'No compatible fields left on the base table.');
    });
  });

  describe('Bound Control UI', () => {
    it('should show table and field sections when control is bound', () => {
      const boundControl = { ...defaultControl, isBound: true, name: 'textField1' };
      renderComponent({ control: boundControl });

      expect(screen.getByText('Table')).toBeInTheDocument();
      expect(screen.getByText('Field')).toBeInTheDocument();
      expect(screen.getByTestId('dropdown-table-list')).toBeInTheDocument();
      expect(screen.getByTestId('dropdown-field-list')).toBeInTheDocument();
    });

    it('should not show table and field sections when control is not bound', () => {
      renderComponent();

      expect(screen.queryByText('Table')).not.toBeInTheDocument();
      expect(screen.queryByText('Field')).not.toBeInTheDocument();
      expect(screen.queryByTestId('dropdown-table-list')).not.toBeInTheDocument();
      expect(screen.queryByTestId('dropdown-field-list')).not.toBeInTheDocument();
    });

    it('should show current base model in table dropdown', () => {
      const boundControl = { ...defaultControl, isBound: true, name: 'textField1' };
      renderComponent({ control: boundControl });

      const tableDropdown = screen.getByTestId('dropdown-table-list');
      expect(tableDropdown).toHaveAttribute('data-disabled', 'true');

      const tableSelect = screen.getByTestId('dropdown-select-table-list');
      expect(tableSelect.value).toBe('Customer');
    });

    it('should show selected field in field dropdown', () => {
      const boundControl = { ...defaultControl, isBound: true, name: 'textField1' };
      renderComponent({ control: boundControl });

      const fieldSelect = screen.getByTestId('dropdown-select-field-list');
      expect(fieldSelect.value).toBe('textField1');
    });

    it('should handle field selection change', async () => {
      const boundControl = { ...defaultControl, isBound: true, name: 'textField1' };
      renderComponent({ control: boundControl });

      const fieldSelect = screen.getByTestId('dropdown-select-field-list');
      fireEvent.change(fieldSelect, { target: { value: 'textField2' } });

      await waitFor(() => {
        expect(defaultProps.onChange).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'textField2',
          }),
        );
      });
    });
  });

  describe('Field Filtering Logic', () => {
    it('should filter out fields already used by other bound controls', () => {
      // Mock formatFieldList to return all available fields
      formatter.formatFieldList.mockReturnValue([
        {
          options: [
            { value: 'textField1', label: 'Text Field 1' },
            { value: 'textField2', label: 'Text Field 2' },
            { value: 'existingControl1', label: 'Existing Control 1' }, // This should be filtered out
          ],
        },
      ]);

      renderComponent();

      // The field used by existingControl1 should not be available
      const mappedButton = screen.getByTestId('button-group-option-true');
      fireEvent.click(mappedButton);

      // Check that the change handler receives an available field, not the used one
      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          isBound: true,
          name: expect.not.stringMatching('existingControl1'),
        }),
      );
    });

    it('should allow current control to keep its own field', () => {
      const boundControl = { ...defaultControl, isBound: true, name: 'textField1' };
      renderComponent({ control: boundControl });

      const fieldSelect = screen.getByTestId('dropdown-select-field-list');
      expect(fieldSelect.value).toBe('textField1');
    });
  });

  describe('Name Sanitization', () => {
    it('should sanitize control name when switching to manual', () => {
      const boundControl = {
        ...defaultControl,
        isBound: true,
        name: 'Text Field With Spaces',
      };
      renderComponent({ control: boundControl });

      const manualButton = screen.getByTestId('button-group-option-false');
      fireEvent.click(manualButton);

      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          isBound: false,
          name: expect.stringMatching(/^TextFieldWithSpaces\d*$/),
        }),
      );
    });

    it('should handle name conflicts when sanitizing', () => {
      const storeWithConflicts = mockStore({
        screenLayout: {
          ...defaultStore.screenLayout,
          controls: {
            ...defaultStore.screenLayout.controls,
            'existing-1': { id: 'existing-1', name: 'TestName', isBound: false },
            'existing-2': { id: 'existing-2', name: 'TestName1', isBound: false },
          },
          fields: [...defaultStore.screenLayout.fields, { name: 'TestName2', caption: 'Test Name 2', type: 'text' }],
        },
      });

      const boundControl = {
        ...defaultControl,
        isBound: true,
        name: 'Test Name',
      };

      render(
        <Provider store={storeWithConflicts}>
          <MappedFieldSelector {...defaultProps} control={boundControl} />
        </Provider>,
      );

      const manualButton = screen.getByTestId('button-group-option-false');
      fireEvent.click(manualButton);

      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          isBound: false,
          name: 'TestName3', // Should increment beyond existing conflicts
        }),
      );
    });
  });

  describe('Edge Cases', () => {
    it('should use first available field when selectedField is not found', () => {
      const boundControlWithMissingField = {
        ...defaultControl,
        isBound: true,
        name: 'nonExistentField',
      };
      renderComponent({ control: boundControlWithMissingField });

      const mappedButton = screen.getByTestId('button-group-option-true');
      fireEvent.click(mappedButton);

      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          isBound: true,
          name: 'textField1', // First available field from mock
        }),
      );
    });
  });

  describe('Component Integration', () => {
    it('should pass correct props to ButtonGroupRow', () => {
      renderComponent();

      const buttonGroup = screen.getByTestId('button-group-data-source');
      expect(buttonGroup).toHaveAttribute('data-width', '184');
      expect(buttonGroup).toHaveAttribute('data-tooltip-id', 'mapped-tooltip');
      expect(buttonGroup).toHaveAttribute('data-tooltip-place', 'top');
    });

    it('should pass correct props to field dropdown', () => {
      const boundControl = { ...defaultControl, isBound: true, name: 'textField1' };
      renderComponent({ control: boundControl });

      const fieldDropdown = screen.getByTestId('dropdown-field-list');
      expect(fieldDropdown).toHaveAttribute('data-style', 'multi-icon');
      expect(fieldDropdown).toHaveAttribute('data-v4-design', 'true');
      expect(fieldDropdown).toHaveAttribute('data-width', '184');
    });

    it('should pass correct props to table dropdown', () => {
      const boundControl = { ...defaultControl, isBound: true, name: 'textField1' };
      renderComponent({ control: boundControl });

      const tableDropdown = screen.getByTestId('dropdown-table-list');
      expect(tableDropdown).toHaveAttribute('data-disabled', 'true');
      expect(tableDropdown).toHaveAttribute('data-style', 'multi-icon');
      expect(tableDropdown).toHaveAttribute('data-v4-design', 'true');
      expect(tableDropdown).toHaveAttribute('data-width', '184');
    });
  });

  describe('Redux Integration', () => {
    it('should read from correct Redux selectors', () => {
      renderComponent();

      // Verify that the component reads the correct data from the store
      expect(screen.getByTestId('content-wrapper')).toBeInTheDocument();

      // When switching to mapped, it should use the first available field
      const mappedButton = screen.getByTestId('button-group-option-true');
      fireEvent.click(mappedButton);

      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          isBound: true,
          name: 'textField1',
        }),
      );
    });

    it('should handle store updates correctly', () => {
      const { rerender } = renderComponent();

      // Update store with new data
      const newStore = mockStore({
        screenLayout: {
          ...defaultStore.screenLayout,
          baseModel: 'NewTable',
        },
      });

      rerender(
        <Provider store={newStore}>
          <MappedFieldSelector {...defaultProps} />
        </Provider>,
      );

      // Component should still render without crashing
      expect(screen.getByTestId('content-wrapper')).toBeInTheDocument();
    });
  });
});
