import '@testing-library/jest-dom';

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import TagWidgetBlockEditor from './TagWidgetBlockEditor';
// Mock the problematic dependencies before importing components
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
      control1: { id: 'control1', name: 'TagList' },
    },
  },
};

const createMockStore = () => configureStore({
  reducer: {
    session: (state = defaultStore.session) => state,
    screenLayout: (state = defaultStore.screenLayout) => state,
  }
});

describe('Tag Widget Editor', () => {
  let store;
  let props;

  beforeEach(() => {
    store = createMockStore();

    props = {
      onChange: jest.fn(),
      onAddAction: jest.fn(),
      control: {
        caption: 'Tag list',
        disabled: false,
        id: 'control1',
        name: 'Taglist',
        visible: true,
        hideCaption: false,
      },
    };
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <TagWidgetBlockEditor {...props} />
      </Provider>,
    );

  it('should render without crashing', () => {
    renderComponent();
    expect(screen.getByText('Edit the base configuration and styles of the tags list.')).toBeInTheDocument();
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
});
