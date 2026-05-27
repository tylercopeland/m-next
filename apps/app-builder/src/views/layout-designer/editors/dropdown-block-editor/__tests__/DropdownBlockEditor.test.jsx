import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import DropdownBlockEditor from '../DropdownBlockEditor';
import { createDropdownControl } from '../../../control-classes';

// Mock the required modules
jest.mock('@m-next/action-editor', () => ({
  openActionEditor: jest.fn()
}));

jest.mock('@m-next/criteria-builder', () => function DummyCriteriaBuilder() {
  return <div data-testid="criteria-builder">Criteria Builder</div>;
});

jest.mock('@m-next/grid', () => function DummyGrid() {
  return <div data-testid="grid">Grid</div>;
});

// Mock Dropdown component
jest.mock('@m-next/dropdown', () => {
  const MockDropdown = ({
    id,
    value,
    options,
    onChange,
    disabled,
    required,
    width,
  }) => (
      <select
        data-testid={`${id}-dropdown`}
        value={value?.value || ''}
        onChange={(e) => onChange({ value: e.target.value, label: e.target.value })}
        disabled={disabled}
        required={required}
        style={{ width }}
      >
        <option value="">Select...</option>
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  
  return MockDropdown;
});

// Mock ActionListSection
jest.mock('../../common/components/action-list-section/ActionListSection', () => {
  const MockActionListSection = ({
    caption,
    values,
    emptyMessage,
    canAdd,
    addLabel,
    onAddAction,
    valueKey,
  }) => (
      <div data-testid="action-list-section">
        <h3>{caption}</h3>
        {values.length === 0 && <p>{emptyMessage}</p>}
        {canAdd && (
          <button 
            onClick={() => onAddAction('onChange', 'Change')} 
            data-testid="add-action-button"
            type="button"
          >
            {addLabel}
          </button>
        )}
        <ul>
          {values.map((value, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={`action-item-${index}`}>{value[valueKey]}</li>
          ))}
        </ul>
      </div>
    );
  
  return MockActionListSection;
});

jest.mock('../../../../../components/accordion/AddableAccordion', () => {
  const MockAddableAccordion = ({
    id,
    caption,
    canAdd,
    onAdd,
    isEmpty,
    emptyMessage,
    addLabel,
    children,
  }) => (
      <div data-testid={`addable-accordion-${id}`}>
        <h3>{caption}</h3>
        {isEmpty && <p data-testid="empty-message">{emptyMessage}</p>}
        {canAdd && (
          <button 
            type="button"
            data-testid="add-accordion-item-button" 
            onClick={() => onAdd(true)}
          >
            {addLabel}
          </button>
        )}
        <div data-testid="accordion-content">
          {children}
        </div>
      </div>
    );
  return MockAddableAccordion;
});

jest.mock('../../common/components/editor-input/EditorInput', () => {
  const MockEditorInput = ({ id, value, onChange, label }) => (
      <div>
        <label htmlFor={id}>{label}</label>
        <input
          data-testid={`${id}-input`}
          id={id}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  return MockEditorInput;
});

// Mock API hooks
jest.mock('../../../../../common/services/tablesFieldsApi', () => ({
  useGetFieldsForTableQuery: () => ({
    data: [
      { name: 'field1', type: "DropDown", caption: 'Field 1' },
      { name: 'field2', type: "DropDown", caption: 'Field 2' },
    ],
    isFetching: false,
  }),
  useGetTablesQuery: () => ({
    data: [
      { name: 'table1', caption: 'Table 1' },
      { name: 'table2', caption: 'Table 2' },
    ],
    isFetching: false,
  }),
}));

const mockStore = configureStore([]);

describe('DropdownBlockEditor', () => {
  let store;
  let props;

  beforeEach(() => {
    store = mockStore({
      session: {
        accountName: 'testAccount',
        displayPreferences: {},
      },
      screenLayout: {
        baseModel: 'baseTable',
        controls: {
          control1: { id: 'control1', name: 'control1' },
        },
      },
    });

    props = {
      onChange: jest.fn(),
      onAddAction: jest.fn(),
      rawControl: {
        ...createDropdownControl(),
        id: 'test-control',
        name: 'test-control',
        caption: 'Test Control',
        model: {
          viewName: 'table1',
          columns: [
            {
              name: 'RecordID',
              caption: 'Record ID',
              fieldType: 'Integer',
              format: {
                visible: false,
                visibleMobile: false,
              },
              isKey: true,
            }
          ],
          viewFilter: {
            sorting: [],
            expression: [],
          }
        }
      },
    };
  });

  const renderComponent = () => render(
    <Provider store={store}>
      <DropdownBlockEditor {...props} />
    </Provider>
  );

  describe('Initial Render', () => {
    it('should render without crashing', async () => {
      renderComponent();
      expect(screen.getByText('Edit the base configuration and styles of the dropdown.')).toBeInTheDocument();
    });

    it('should show save data toggle', () => {
      renderComponent();
      expect(screen.getByText('Save data')).toBeInTheDocument();
    });

    it('should render table dropdown with initial value', () => {
      renderComponent();
      const tableDropdown = screen.getByTestId('table-dropdown');
      expect(tableDropdown).toBeInTheDocument();
      expect(tableDropdown).not.toBeDisabled();
    });
  });

  describe('Dropdown Action Item', () => {
    beforeEach(() => {
      // Add onCustomRowClick to rawControl to trigger the action item by default
      props.rawControl = {
        ...props.rawControl,
        onCustomRowClick: 'custom-row-click-id',
        customRowText: 'Initial Action Label',
      };
    });

    it('should render the Dropdown Action Item section', () => {
      renderComponent();
      expect(screen.getByText('Dropdown Action Item')).toBeInTheDocument();
    });

    it('should show action item components when onCustomRowClick is set', () => {
      renderComponent();
      expect(screen.getByText('Action item click')).toBeInTheDocument();
      expect(screen.getByLabelText('Action item label')).toBeInTheDocument();
    });

    it('should update customRowText via EditorInput', async () => {
      renderComponent();
      // Try to get the input by role and label
      let input;
      try {
        input = screen.getByRole('textbox', { name: 'Action item label' });
      } catch {
        // Fallback: get the only textbox in this context
        input = screen.getByRole('textbox');
      }
      fireEvent.change(input, { target: { value: 'New Action Label' } });
      fireEvent.blur(input); // DebouncedInput may require blur to trigger onChange
      await waitFor(() => {
        expect(props.onChange).toHaveBeenCalledWith(
          expect.objectContaining({
            customRowText: 'New Action Label',
          })
        );
      });
    });
  });

  describe('Save Data Changes', () => {
    it('should show confirmation dialog when enabling save data with different table', async () => {
      props.rawControl = {
        ...props.rawControl,
        model: { 
          ...props.rawControl.model,
          viewName: 'differentTable' 
        },
      };

      renderComponent();
      
      const saveDataToggle = screen.getByTestId('save-data-Toggle-input');
      fireEvent.click(saveDataToggle);

      await waitFor(() => {
        expect(screen.getByText('Save data - Reset properties')).toBeInTheDocument();
      });
    });

    it('should not show confirmation dialog when disabling save data', async () => {
      props.rawControl = {
        ...props.rawControl,
        isBound: true,
      };

      renderComponent();
      
      const saveDataToggle = screen.getByTestId('save-data-Toggle-input');
      fireEvent.click(saveDataToggle);

      expect(props.onChange).toHaveBeenCalled();
      expect(screen.queryByText('Save data - Reset properties')).not.toBeInTheDocument();
    });

    it('should update control when confirming save data change', async () => {
      props.rawControl = {
        ...props.rawControl,
        model: { 
            ...props.rawControl.model,
            viewName: 'differentTable' 
        },
      };

      renderComponent();
      
      const saveDataToggle = screen.getByTestId('save-data-Toggle-input');
      await waitFor(() => { 
        fireEvent.click(saveDataToggle);
      });

      const confirmButton = screen.getByTestId('dialog-footer-primary');
      await waitFor(() => { 
        fireEvent.click(confirmButton);
      });

      expect(props.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          isBound: true,
          model: expect.objectContaining({
            viewName: 'baseTable',
          }),
        })
      );
    });
  });

  describe('Field Selection', () => {
    it('should disable field dropdown when no available fields', () => {
      store = mockStore({
        ...store.getState(),
        screenLayout: {
          ...store.getState().screenLayout,
          controls: {
            control1: { id: 'control1', name: 'field1' },
            control2: { id: 'control2', name: 'field2' },
          },
        },
      });

      props.rawControl = {
        ...createDropdownControl(),
        isBound: true,
      };

      renderComponent();
      
      const fieldDropdown = screen.getByTestId('field-dropdown');
      expect(fieldDropdown).toBeDisabled();
      expect(screen.getByText(/all dropdown-type fields.*are already in use/i)).toBeInTheDocument();
    });

    it('should enable field dropdown when fields are available', () => {
      props.rawControl = {
        ...createDropdownControl(),
        isBound: true,
      };

      renderComponent();
      
      const fieldDropdown = screen.getByTestId('field-dropdown');
      expect(fieldDropdown).not.toBeDisabled();
    });
  });

  describe('Display Settings', () => {
    it('should handle label changes', async () => {
      renderComponent();
      
      const labelInput = screen.getByTestId('label-input');
      fireEvent.change(labelInput, { target: { value: 'New Label' } });

      await waitFor(() => {
        expect(props.onChange).toHaveBeenCalledWith(
          expect.objectContaining({
            caption: 'New Label',
          })
        );
      });
    });

    it('should handle show/hide label toggle', () => {
      props.rawControl = {
        ...createDropdownControl(),
        hideCaption: false,
      };

      renderComponent();
      
      const showLabelToggle = screen.getByTestId('show-label-Toggle-input');
      fireEvent.click(showLabelToggle);

      expect(props.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          hideCaption: true,
        })
      );
    });
  });

  describe('Events Section', () => {
    it('should render events section with empty message when no events', () => {
      renderComponent();
      
      expect(screen.getByText('Events')).toBeInTheDocument();
      expect(screen.getByText('No events applied')).toBeInTheDocument();
    });

    it('should show add event button when actions are available', () => {
      props.rawControl = {
        ...createDropdownControl(),
        // No events set initially
      };

      renderComponent();
      
      expect(screen.getByTestId('add-action-button')).toBeInTheDocument();
      expect(screen.getByText('Add Event')).toBeInTheDocument();
    });

    it('should handle adding a new event', () => {
      renderComponent();
      
      const addButton = screen.getByTestId('add-action-button');
      fireEvent.click(addButton);

      expect(props.onAddAction).toHaveBeenCalledWith(
        expect.objectContaining({
          onChange: expect.any(String), // Guid will be generated
        }),
        'Change'
      );
    });

    it('should display existing events', () => {
      const mockGuid = '12345678-1234-1234-1234-123456789012';
      props.rawControl = {
        ...createDropdownControl(),
        onChange: mockGuid,
      };

      renderComponent();
      
      expect(screen.getByText('Change')).toBeInTheDocument();
    });
  });
});
