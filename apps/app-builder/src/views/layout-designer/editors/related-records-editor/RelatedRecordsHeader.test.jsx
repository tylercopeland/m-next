import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';
import { ToastContainer } from 'react-toastify';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { createTheme, ThemeProvider } from '@mui/material';
import { lightTheme } from '@m-next/styles';
import RelatedRecordsHeader from './RelatedRecordsHeader';
import { useDeleteRibbonMutation, useDuplicateRibbonMutation } from '../../../../common/services/screenLayoutApi';

jest.mock('../../../../common/services/screenLayoutApi');
jest.mock('react-toastify', () => ({
  toast: { error: jest.fn() },
  ToastContainer: jest.fn(() => <div>ToastContainer</div>),
}));

jest.mock('@reduxjs/toolkit/query/react', () => {
  const originalModule = jest.requireActual('@reduxjs/toolkit/query/react');
  return {
    ...originalModule,
    fetchBaseQuery: () => jest.fn(),
  };
});

const mockStore = configureStore([]);

describe('RelatedRecordsHeader', () => {
  let store;
  let mockDuplicateRibbon;
  let mockDeleteRibbon;

  beforeEach(() => {
    store = mockStore({});
    mockDuplicateRibbon = jest.fn();
    mockDeleteRibbon = jest.fn();
    useDuplicateRibbonMutation.mockReturnValue([mockDuplicateRibbon]);
    useDeleteRibbonMutation.mockReturnValue([mockDeleteRibbon]);
  });

  const theme = createTheme(lightTheme);

  const setup = (
    props = {
      currentTab: null,
      tabList: [{ id: 'tab-1', visible: true, caption: 'Tab 1' }],
    },
  ) =>
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <RelatedRecordsHeader {...props} />
          </ThemeProvider>
          <ToastContainer />
        </MemoryRouter>
      </Provider>,
    );

  it('renders without crashing', () => {
    setup();
    screen.getByText('App ribbons');
    expect(screen.getByText('App ribbons')).toBeInTheDocument();
  });

  it('displays currentTab caption when provided', () => {
    setup({
      currentTab: { id: 'tab-1', caption: 'Tab 1' },
      tabList: [{ id: 'tab-1', visible: true, caption: 'Tab 1' }],
    });
    expect(screen.getByText('/ Tab 1')).toBeInTheDocument();
  });

  it('calls handleDuplicate when Duplicate menu item is clicked', async () => {
    setup({
      currentTab: { id: 'tab-1' },
      onSelect: jest.fn(),
      tabList: [{ id: 'tab-1', visible: true, caption: 'Tab 1' }],
    });
    fireEvent.click(screen.getByRole('img', { name: /navigation-show-more icon/i }));
    fireEvent.click(screen.getByText('Duplicate'));

    await waitFor(() => {
      expect(mockDuplicateRibbon).toHaveBeenCalledWith({ appId: undefined, screenId: undefined, ribbonId: 'tab-1' });
    });
  });

  it('toggles visibility when Show/Hide menu item is clicked', () => {
    const onTabsSettingsChange = jest.fn();
    const tabList = [{ id: 'tab-1', visible: true, caption: 'Tab 1' }];
    setup({ currentTab: tabList[0], tabList, onTabsSettingsChange });

    fireEvent.click(screen.getByRole('img', { name: /navigation-show-more icon/i }));
    fireEvent.click(screen.getByText('Hide'));
    expect(onTabsSettingsChange).toHaveBeenCalledWith([{ id: 'tab-1', visible: false, caption: 'Tab 1' }]);
  });

  it('calls handleDelete when Delete menu item is clicked', async () => {
    setup({
      currentTab: { id: 'tab-1', isStock: false },
      onSelect: jest.fn(),
      tabList: [{ id: 'tab-1', visible: true, caption: 'Tab 1' }],
    });
    fireEvent.click(screen.getByRole('img', { name: /navigation-show-more icon/i }));
    fireEvent.click(screen.getByText('Delete'));

    // Confirm delete
    fireEvent.click(screen.getByRole('button', { name: /ok/i }));

    await waitFor(() => {
      expect(mockDeleteRibbon).toHaveBeenCalledWith({ appId: undefined, screenId: undefined, ribbonId: 'tab-1' });
    });
  });

  it('shows delete warning dialog when Delete is clicked', () => {
    setup({ currentTab: { id: 'tab-1', isStock: false }, tabList: [{ id: 'tab-1', visible: true, caption: 'Tab 1' }] });
    fireEvent.click(screen.getByRole('img', { name: /navigation-show-more icon/i }));
    fireEvent.click(screen.getByText('Delete'));

    expect(screen.getByText('Delete app ribbon')).toBeInTheDocument();
  });

  it('hides delete warning dialog when Cancel is clicked', () => {
    setup({ currentTab: { id: 'tab-1', isStock: false }, tabList: [{ id: 'tab-1', visible: true, caption: 'Tab 1' }] });
    fireEvent.click(screen.getByRole('img', { name: /navigation-show-more icon/i }));
    fireEvent.click(screen.getByText('Delete'));
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(screen.queryByText('Delete app ribbon')).not.toBeInTheDocument();
  });
});
