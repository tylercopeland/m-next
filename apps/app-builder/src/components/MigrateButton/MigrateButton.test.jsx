import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import MigrateButton from './MigrateButton';
import { screenLayoutApi } from '../../common/services/screenLayoutApi';
import { appsApi } from '../../common/services/appsApi';

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock window.location.reload
delete window.location;
window.location = { reload: jest.fn() };

const createMockStore = (initialState = {}) =>
  configureStore({
    reducer: {
      app: (state = { appId: 'test-app-id', screenId: 'test-screen-id', versionId: 'test-version-id' }) => state,
      session: (state = { tokenRTC: 'test-token', accountName: 'test-account' }) => state,
      [screenLayoutApi.reducerPath]: screenLayoutApi.reducer,
      [appsApi.reducerPath]: appsApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(screenLayoutApi.middleware, appsApi.middleware),
    preloadedState: {
      app: { appId: 'test-app-id', screenId: 'test-screen-id', versionId: 'test-version-id' },
      session: { tokenRTC: 'test-token', accountName: 'test-account' },
      ...initialState,
    },
  });

describe('MigrateButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
  });

  test('renders with Upgrade text', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <MigrateButton />
        </BrowserRouter>
      </Provider>,
    );
    expect(screen.getByText('Upgrade')).toBeInTheDocument();
  });

  test('is disabled when disabled prop is true', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <MigrateButton disabled />
        </BrowserRouter>
      </Provider>,
    );
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  test('shows error toast when missing app ID', async () => {
    const store = createMockStore({
      app: { appId: null, screenId: 'test-screen-id', versionId: 'test-version-id' },
      session: { tokenRTC: 'test-token', accountName: 'test-account' },
    });
    render(
      <Provider store={store}>
        <BrowserRouter>
          <MigrateButton />
        </BrowserRouter>
      </Provider>,
    );

    // Click the Upgrade button to open the dialog
    const upgradeButton = screen.getByText('Upgrade');
    await userEvent.click(upgradeButton);

    // Wait for dialog to appear and click the confirm button
    await waitFor(() => {
      expect(screen.getByText(/Upgrading will create a/i)).toBeInTheDocument();
    });

    const confirmButton = screen.getByText('Upgrade screen');
    await userEvent.click(confirmButton);

    // Now the toast error should be shown
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Missing app, screen, or version ID');
    });
  });

  test('shows migration dialog when button is clicked', async () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <BrowserRouter>
          <MigrateButton />
        </BrowserRouter>
      </Provider>,
    );

    const button = screen.getByText('Upgrade');
    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Upgrading will create a/i)).toBeInTheDocument();
    });
  });
});
