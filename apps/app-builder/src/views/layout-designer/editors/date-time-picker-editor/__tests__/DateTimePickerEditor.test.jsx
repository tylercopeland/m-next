import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import DateTimePickerEditor from '../DateTimePickerEditor';
import { createDatetimePickerControl } from '../../../control-classes';

// Mock external dependencies
jest.mock('../../../../../common/rum/RumComponentContext', () => ({
  RumComponentContextProvider: ({ children }) => <div data-testid="rum-provider">{children}</div>,
}));

jest.mock('../../common/components/caption-input/CaptionInput', () =>
  function MockCaptionInput({ id, label, value, onChange }) {
    return (
      <div data-testid={`caption-input-${id}`}>
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value, e.target.value)}
          data-testid={`caption-input-field-${id}`}
        />
      </div>
    );
  }
);

jest.mock('@m-next/dropdown', () =>
  function MockDropdown({ id, options, value, onChange }) {
    return (
      <div data-testid={`dropdown-${id}`}>
        <select
          value={value?.value || ''}
          onChange={(e) => {
            const selected = options.find(opt => opt.value === e.target.value);
            if (selected) onChange(selected);
          }}
          data-testid={`dropdown-select-${id}`}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

jest.mock('@m-next/validation', () => ({
  ValidationMessage: function MockValidationMessage({ id, message }) {
    return <div data-testid={`validation-message-${id}`}>{message}</div>;
  },
}));

// Mock ActionListSection
jest.mock('../../common/components/action-list-section/ActionListSection', () => function MockActionListSection({
  caption,
  values,
  emptyMessage,
  canAdd,
  addLabel,
  onAddAction,
  valueKey,
}) {
  return (
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
        {values.map((value) => (
          <li key={value[valueKey]}>{value[valueKey]}</li>
        ))}
      </ul>
    </div>
  );
});

// Mock modules
jest.mock('../../../../../common/services/tablesFieldsApi', () => ({
  useGetFieldsForTableQuery: () => ({
    data: [
      { name: 'field1', type: 'DateTime', caption: 'Field 1' },
      { name: 'field2', type: 'DateTime', caption: 'Field 2' },
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

describe('DateTimePickerEditor', () => {
  let store;
  let props;

  beforeEach(() => {
    store = mockStore({
      session: {
        accountName: 'testAccount',
      },
      screenLayout: {
        baseModel: 'table1',
        controls: {
          control1: { id: 'control1', name: 'control1' },
        },
      },
    });

    props = {
      onChange: jest.fn(),
      onAddAction: jest.fn(),
      rawControl: {
        ...createDatetimePickerControl(),
        id: 'test-control',
        name: 'test-control',
        caption: 'Test Control',
        isBound: false,
        formatType: 'MM/DD/YYYY',
      },
    };
  });

  const renderComponent = () => render(
    <Provider store={store}>
      <DateTimePickerEditor {...props} />
    </Provider>
  );

  describe('Initial Render', () => {
    it('should render without crashing', () => {
      renderComponent();
      expect(screen.getByText('Edit the base configuration and styles of the date time picker.')).toBeInTheDocument();
    });

    it('should show data source toggle', () => {
      renderComponent();
      expect(screen.getByText('Data source')).toBeInTheDocument();
    });
  });

  describe('Data Source Changes', () => {
    it('should toggle between manual and mapped data source', () => {
      renderComponent();
      const dataSourceToggle = screen.getByText('Mapped');
      expect(dataSourceToggle).toBeInTheDocument();
      fireEvent.click(dataSourceToggle);
    });
  });

  describe('Field Selection', () => {
    it('should disable field dropdown when no available fields', () => {
      store = mockStore({
        ...store.getState(),
        screenLayout: {
          ...store.getState().screenLayout,
          controls: {
            control1: { id: 'control1', name: 'field1', isBound: true },
            control2: { id: 'control2', name: 'field2', isBound: true },
          },
        },
      });

      renderComponent();

      const mappedButton = document.getElementById('data-source-1');
      expect(mappedButton).toHaveAttribute('disabled', '');
    });

    it('should enable field dropdown when fields are available', () => {
      props.rawControl = {
        ...createDatetimePickerControl(),
        isBound: true,
      };

      renderComponent();

      const fieldDropdown = screen.getByTestId('dropdown-field-list');
      expect(fieldDropdown).not.toBeDisabled();
    });
  });

  describe('Display Settings', () => {
    it('should handle label changes', async () => {
      renderComponent();

      const labelInput = screen.getByTestId('caption-input-field-label-input');
      fireEvent.change(labelInput, { target: { value: 'New Label' } });

      await waitFor(() => {
        expect(props.onChange).toHaveBeenCalledWith(
          expect.objectContaining({ caption: 'New Label' })
        );
      });
    });

    it('should handle show/hide label toggle', () => {
      props.rawControl = {
        ...createDatetimePickerControl(),
        hideCaption: false,
      };

      renderComponent();

      const showLabelToggle = screen.getByTestId('show-label-Toggle-input');
      fireEvent.click(showLabelToggle);

      expect(props.onChange).toHaveBeenCalledWith(
        expect.objectContaining({ hideCaption: true })
      );
    });
  });

  describe('Events Section', () => {
    it('should render events section with empty message when no events', () => {
      renderComponent();

      expect(screen.getByText('Events')).toBeInTheDocument();
      expect(screen.getByText('No events applied')).toBeInTheDocument();
    });

    it('should handle adding a new event', () => {
      renderComponent();

      const addButton = screen.getByTestId('add-action-button');
      fireEvent.click(addButton);

      expect(props.onAddAction).toHaveBeenCalledWith(
        expect.objectContaining({ onChange: expect.any(String) }),
        'Change'
      );
    });
  });
});
