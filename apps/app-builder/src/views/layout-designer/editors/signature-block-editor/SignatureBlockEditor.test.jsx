// Mock the problematic dependencies before importing components
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import SignatureBlockEditor from './SignatureBlockEditor';

jest.mock('@m-next/layout-canvas/src/utils/componentSizing', () => ({
  getCustomComponentSize: jest.fn(() => ({ width: 2, height: 2 }))
}));

jest.mock('@m-next/layout-canvas/src/utils/componentNaming', () => ({
  generateUniqueComponentName: jest.fn((type) => `test-${type}-${Date.now()}`)
}));

// Mock the entire layout-canvas package
jest.mock('@m-next/layout-canvas', () => ({
  calculateNameFromLabelChange: jest.fn((inputValue) => {
    const sanitizedName = inputValue.replace(/[^a-zA-Z0-9 ]/g, '_').replace(/ /g, '_');
    return sanitizedName || '';
  }),
  Z_POPUP: { POPOVER: 1000, TOOLTIP: 1100, GRID_FILTER: 1200, SCREEN_SELECTOR: 1300, COLOR_PICKER: 2000 },
}));

// Mock action editor to prevent HTML import issues
jest.mock('@m-next/action-editor', () => ({
  openActionEditor: jest.fn()
}));

const defaultStore = {
  session: {
    accountName: 'testAccount',
    displayPreferences: {},
  },
  screenLayout: {
    baseModel: 'Contacts',
    controls: {
      control1: { id: 'control1', name: 'Signature' },
    },
  },
}

jest.mock('../common/components/action-list-section/SingleAction', () => function MockSingleAction({
  value,
  emptyMessage = 'No events applied',
  addLabel = 'Add',
  onAddAction,
}) {
  return (
    value ? (
      <div>
        <button 
          onClick={() => onAddAction('onChange', 'Change')} 
          data-testid="add-action-button"
          type="button"
        >
          {addLabel}
        </button>
        <ul>
          <li key={value.id}>{value.id}</li>
        </ul>
      </div>
    ) : (
      <p>{emptyMessage}</p>
    )
  );
});

jest.mock('../../../../common/services/tablesFieldsApi', () => ({
  useGetFieldsForTableQuery: () => ({
    data: [
      { name: 'IsActive', type: 'YesNo', caption: 'Is active' },
      { name: 'IsTaxable', type: 'YesNo', caption: 'Is taxable' },
    ],
  }),
  useGetTablesQuery: () => ({
    data: [
      { name: 'Contacts', caption: 'Contacts' },
      { name: 'Bill', caption: 'Bill' },
    ],
  }),
}));

const baseControl = {
  id: '1',
  caption: 'Sign here',
  name: 'signature',
  hideCaption: false,
  hideCancel: false,
  acceptCaption: 'Accept',
  cancelCaption: 'Cancel',
  onAccept: 'accept-id',
  onCancel: '',
  validationRules: [],
};

const mockStore = configureStore([]);

describe('Signature Editor', () => {
  let store;
  let props;

  beforeEach(() => {
    store = mockStore(defaultStore);
    props = {
      control: baseControl,
      onChange: jest.fn(),
      onAddAction: jest.fn(),
    }
  });

  const renderComponent = () => render(
    <Provider store={store}>
      <SignatureBlockEditor {...props}/>
    </Provider>
  );

  it('should render without crashing', () => {
    renderComponent();
    expect(screen.getByText('Edit the base configuration and styles of the Signature widget.')).toBeInTheDocument();
  });

  it('should render label', () => {
    props.control.caption = 'Existing label';
    renderComponent();
    const input = screen.getByTestId('caption-Input');
    expect(input).toHaveValue('Existing label');
  });

  it('should handle label changes', async() => {
    renderComponent();
    const input = screen.getByTestId('caption-Input');
    fireEvent.change(input, { target: { value: 'New Label' } });
    await waitFor(() => {
      expect(props.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          caption: 'New Label',
          name: 'New_Label'
        })
      );
    });
  });

  it('should handle show label changes', async () => {
    renderComponent();
    fireEvent.click(screen.getByTestId('show-label-Toggle-input'));
    await waitFor(() => {
      expect(props.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          hideCaption: true
        })
      );
    });
  });

  it('should handle accept label changes', async () => {
    renderComponent();
    fireEvent.change(screen.getByTestId('accept-input-Input'), { target: { value: 'New Label' } });
    await waitFor(() => {
      expect(props.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          acceptCaption: 'New Label'
        })
      );
    });
  });

  it('should handle show cancel button changes', async () => {
    renderComponent();
    expect(screen.queryByTestId('cancel-input-Input')).toBeInTheDocument();
    expect(screen.getByText('No Cancel event applied')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('show-cancel-Toggle-input'));
    await waitFor(() => {
      expect(props.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          hideCancel: true,
        })
      );
    });
  });

  it('should handle cancel label changes', async () => {
    renderComponent();
    fireEvent.change(screen.getByTestId('cancel-input-Input'), { target: { value: 'New Label' } });
    await waitFor(() => {
      expect(props.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          cancelCaption: 'New Label'
        })
      );
    });
  });
});
