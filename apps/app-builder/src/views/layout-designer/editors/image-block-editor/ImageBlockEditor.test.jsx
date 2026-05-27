import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ImageBlockEditor from './ImageBlockEditor';

const defaultStore = {
  session: {
    accountName: 'testAccount',
    displayPreferences: {},
  },
  screenLayout: {
    baseModel: 'Contacts',
    controls: {
      control1: { id: 'control1', name: 'Picture' },
    },
    fields: [
      { name: 'Image1', type: 'Picture', caption: 'Image 1' },
      { name: 'Image2', type: 'Picture', caption: 'Image 2' },
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
            <button onClick={() => onAddAction('onClick', 'Click')} data-testid='add-action-button' type='button'>
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
      { name: 'Image1', type: 'Picture', caption: 'Image 1' },
      { name: 'Image2', type: 'Picture', caption: 'Image 1' },
    ],
  }),
  useGetTablesQuery: () => ({
    data: [
      { name: 'Contacts', caption: 'Contacts' },
      { name: 'Bill', caption: 'Bill' },
    ],
  }),
}));

jest.mock('../../../../common/services/imagesApi', () => ({
  useUploadImageMutation: () => [
    () => ({
      unwrap: () => Promise.resolve([{ url: 'test-url', original_name: 'test.png' }]),
    }),
    { isLoading: false, isSuccess: true },
  ],
  useDeleteImageMutation: () => [
    () => ({
      unwrap: () => Promise.resolve([{ isSuccess: true }]),
    }),
    { isLoading: false, isSuccess: true },
  ],
}));

window.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

const mockStore = configureStore([]);

describe('Image Editor', () => {
  let store;
  let props;

  beforeEach(() => {
    store = mockStore(defaultStore);

    props = {
      onChange: jest.fn(),
      onAddAction: jest.fn(),
      control: {
        caption: 'Picture',
        disabled: false,
        id: 'control1',
        name: 'Picture',
        visible: true,
        hideCaption: true,
        unsetImage: 'person',
        value: 'https://test.com',
        defaultValue: 'https://test.com',
        defaultValueWrapper: 'https://test.com',
        originalName: 'test.png',
        isEditable: true,
        isBound: false,
        onClick: 'onClick',
      },
    };
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <ImageBlockEditor {...props} />
      </Provider>,
    );

  it('should render without crashing', () => {
    renderComponent();
    expect(screen.getByText('Edit the base configuration and styles of the image.')).toBeInTheDocument();
  });

  it('should handle data source changes', async () => {
    renderComponent();
    const mappedButton = screen.getByText(/Mapped/);
    expect(mappedButton).not.toHaveAttribute('disabled');
    fireEvent.click(mappedButton);

    await waitFor(() => {
      expect(props.onChange).toHaveBeenCalledWith(
        expect.objectContaining({isBound: true }),
      );
    });
  });

  it('should render table dropdown with screen base table', () => {
    props.control.isBound = true;
    renderComponent();
    const tableDropdown = screen.getByTestId(/table-list/);
    expect(tableDropdown).toHaveTextContent(defaultStore.screenLayout.baseModel);
  });

  it('should allow deleting image', async () => {
    renderComponent();
    fireEvent.click(screen.getByTestId(/svg-icon-svg-add-circle-v4/));
    fireEvent.click(screen.getByText('Delete Image'));
    fireEvent.click(screen.getByText('Delete'));
    await waitFor(() => {
      expect(props.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          value: '',
          originalName: '',
          defaultValue: '',
          defaultValueWrapper: '',
        }),
      );
    });
  });

  it('should handle label changes', async () => {
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
    props.control.hideCaption = false;
    renderComponent();
    const labelToggle = screen.getByTestId(/show-label-Toggle-input/);
    expect(labelToggle).toBeChecked();
  });

  it('should handle show label changes', async () => {
    renderComponent();
    const labelToggle = screen.getByTestId(/show-label-Toggle-input/);
    fireEvent.click(labelToggle);

    await waitFor(() => {
      expect(props.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          hideCaption: false,
        }),
      );
    });
  });

  it('should handle placeholder changes', async () => {
    props.control.isBound = true;
    renderComponent();
    const landscapeButton = screen.getByTestId(/svg-icon-wrapper-landscape-image/);
    fireEvent.click(landscapeButton);

    await waitFor(() => {
      expect(props.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          unsetImage: 'landscape',
        }),
      );
    });
  });

  it('should handle editing settings changes', async () => {
    props.control.isBound = true;
    renderComponent();
    const editSettingsButton = screen.getByTestId(/allow-editing-Toggle-input/);
    fireEvent.click(editSettingsButton);
    await waitFor(() => {
      expect(props.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          isEditable: false,
        }),
      );
    });
  });

  it('should show error message for unbound controls without image', async () => {
    props.control.value = '';
    renderComponent();
    expect(screen.getByText('Image required - add image to continue.')).toBeInTheDocument();
  });
});
