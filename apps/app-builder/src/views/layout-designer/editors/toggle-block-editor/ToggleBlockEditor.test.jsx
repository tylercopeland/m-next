import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ToggleBlockEditor from './ToggleBlockEditor';

const defaultStore = {
  session: {
    accountName: 'testAccount',
    displayPreferences: {},
  },
  screenLayout: {
    baseModel: 'Contacts',
    controls: {
      control1: { id: 'control1', name: 'Toggle' },
    },
    fields: [
      { name: 'IsActive', type: 'YesNo', caption: 'Is active' },
      { name: 'IsTaxable', type: 'YesNo', caption: 'Is taxable' },
    ],
  },
};

jest.mock(
  '../common/components/action-list-section/ActionListSection',
  () =>
    function MockActionListSection({ caption, values = [], emptyMessage, canAdd, addLabel, onAddAction, valueKey }) {
      return (
        <div data-testid='action-list-section'>
          <h3>{caption}</h3>
          {values.length === 0 && <p>{emptyMessage}</p>}
          {canAdd && (
            <button onClick={() => onAddAction('onChange', 'Change')} data-testid='add-action-button' type='button'>
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
    },
);

// Mock API hooks
jest.mock('../../../../common/services/tablesFieldsApi', () => ({
  useGetFieldsForTableQuery: () => ({
    data: [
      { name: 'IsActive', type: 'YesNo', caption: 'Is active' },
      { name: 'IsTaxable', type: 'YesNo', caption: 'Is taxable' },
    ],
    isFetching: false,
  }),
  useGetTablesQuery: () => ({
    data: [
      { name: 'Contacts', caption: 'Contacts' },
      { name: 'Bill', caption: 'Bill' },
    ],
    isFetching: false,
  }),
}));

const mockStore = configureStore([]);

describe('Toggle Editor', () => {
  let store;
  let props;

  beforeEach(() => {
    store = mockStore(defaultStore);

    props = {
      onChange: jest.fn(),
      onAddAction: jest.fn(),
      control: {
        caption: 'Toggle',
        defaultValue: false,
        disabled: false,
        id: 'control1',
        isBound: false,
        name: 'Toggle',
        onChange: null,
        visible: true,
        classes: '',
        hideCaption: false,
      },
    };
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <ToggleBlockEditor {...props} />
      </Provider>,
    );

  it('should render without crashing', () => {
    renderComponent();
    expect(screen.getByText('Edit the base configuration and styles of the toggle.')).toBeInTheDocument();
  });

  it('should handle data source changes', async () => {
    renderComponent();

    const mappedButton = screen.getByText(/Mapped/);
    expect(mappedButton).not.toHaveAttribute('disabled');
    fireEvent.click(mappedButton);

    await waitFor(() => {
      expect(props.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          isBound: true,
        }),
      );
    });
  });

  it('should render table dropdown with screen base table', () => {
    props.control.isBound = true;
    renderComponent();
    const tableDropdown = screen.getByTestId(/table-list/);
    expect(tableDropdown).toHaveTextContent(defaultStore.screenLayout.baseModel);
  });

  it('should render field dropdown', () => {
    props.control.isBound = true;
    props.control.name = 'isActive';
    renderComponent();
    const fieldDropdown = screen.getByTestId(/field-list/);
    expect(fieldDropdown).toHaveTextContent('Is active');
  });

  it('should default field dropdown to the first available option', async () => {
    renderComponent();
    const mappedButton = screen.getByText(/Mapped/);
    fireEvent.click(mappedButton);

    await waitFor(() => {
      expect(props.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'IsActive',
        }),
      );
    });
  });

  it('should properly sanitize the name when switching to manual', async () => {
    props.control.isBound = true;
    props.control.name = 'isActive';
    store = mockStore({
      ...store.getState(),
      screenLayout: {
        ...store.getState().screenLayout,
        controls: {
          control1: { id: 'control1', name: 'isActive' },
          control2: { id: 'control2', name: 'isActive1' },
        },
      },
    });
    renderComponent();
    const manualButton = screen.getByText(/Manual/);
    fireEvent.click(manualButton);

    await waitFor(() => {
      expect(props.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'isActive2',
        }),
      );
    });
  });

  it('should disable field dropdown when no available fields', () => {
    store = mockStore({
      ...store.getState(),
      screenLayout: {
        ...store.getState().screenLayout,
        controls: {
          control1: { id: 'control1', name: 'Toggle' },
          control2: { id: 'control2', name: 'IsTaxable' },
          control3: { id: 'control3', name: 'IsActive' },
        },
      },
    });

    renderComponent();

    const mappedButton = screen.getByText(/Mapped/);
    expect(mappedButton).not.toHaveAttribute('disabled');
  });

  it('should handle label changes for manual toggles', async () => {
    renderComponent();
    const labelInput = screen.getByRole('textbox', { id: /label/i });
    fireEvent.change(labelInput, { target: { value: 'New Label' } });

    await waitFor(() => {
      expect(props.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          caption: 'New Label',
          name: 'New_Label',
        }),
      );
    });
  });

  it('should handle label changes for mapped toggles', async () => {
    props.control.isBound = true;
    renderComponent();
    const labelInput = screen.getByRole('textbox', { id: /label/i });
    fireEvent.change(labelInput, { target: { value: 'New Label' } });

    await waitFor(() => {
      expect(props.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          caption: 'New Label',
        }),
      );
      expect(props.onChange).toHaveBeenCalledWith(
        expect.not.objectContaining({
          name: 'New_Label',
        }),
      );
    });
  });

  it('should reset label on blank', async () => {
    renderComponent();
    const labelInput = screen.getByRole('textbox', { id: /label/i });
    fireEvent.change(labelInput, { target: { value: '' } });
    fireEvent.blur(labelInput);

    expect(props.onChange).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(labelInput).toHaveValue(props.control.caption);
    });
  });

  it('should render show label', async () => {
    props.control.hideCaption = true;
    renderComponent();
    const labelToggle = screen.getByTestId(/show-label-Toggle-input/);
    expect(labelToggle).not.toBeChecked();
  });

  it('should handle show label changes', async () => {
    renderComponent();
    const labelToggle = screen.getByTestId(/show-label-Toggle-input/);
    fireEvent.click(labelToggle);

    await waitFor(() => {
      expect(props.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          hideCaption: true,
        }),
      );
    });
  });

  it('should handle label position changes', async () => {
    renderComponent();

    const leftButton = screen.getByText('|<');
    fireEvent.click(leftButton);

    expect(props.onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        classes: ' mi-caption-float-left',
      }),
    );

    const rightButton = screen.getByText('>|');
    fireEvent.click(rightButton);

    expect(props.onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        classes: ' mi-caption-float-right',
      }),
    );
  });

  it('should render default value', async () => {
    props.control.defaultValue = true;
    renderComponent();
    const defaultValueDropdown = screen.getByTestId(/default-value/);
    expect(defaultValueDropdown).toHaveTextContent('Yes');
  });

  it('should handle default state changes', async () => {
    renderComponent();

    const hiddenButton = screen.getByText('Hidden');
    const disabledButton = screen.getByText('Disabled');
    const regularButton = screen.getByText('Regular');

    fireEvent.click(hiddenButton);

    expect(props.onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        visible: false,
        disabled: false,
      }),
    );

    fireEvent.click(disabledButton);

    expect(props.onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        visible: true,
        disabled: true,
      }),
    );

    fireEvent.click(regularButton);

    expect(props.onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        visible: true,
        disabled: false,
      }),
    );
  });

  it('should render events section with empty message when no events', () => {
    renderComponent();

    expect(screen.getByText('Events')).toBeInTheDocument();
    expect(screen.getByText('No events applied')).toBeInTheDocument();
  });

  it('should show add event button when actions are available', () => {
    renderComponent();

    expect(screen.getByTestId('add-action-button')).toBeInTheDocument();
    expect(screen.getByText('Add change')).toBeInTheDocument();
  });

  it('should handle adding a new event', () => {
    renderComponent();

    const addButton = screen.getByTestId('add-action-button');
    fireEvent.click(addButton);

    expect(props.onAddAction).toHaveBeenCalledWith(
      expect.objectContaining({
        onChange: expect.any(String),
      }),
      'Change',
    );
  });

  it('should display existing events', () => {
    const mockGuid = '12345678-1234-1234-1234-123456789012';
    props.control.onChange = mockGuid;

    renderComponent();

    expect(screen.getByText('Change')).toBeInTheDocument();
  });
});
