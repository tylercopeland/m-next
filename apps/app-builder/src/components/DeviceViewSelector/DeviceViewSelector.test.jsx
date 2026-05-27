import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { lightTheme } from '@m-next/styles';
import DeviceViewSelector from './DeviceViewSelector';

const mockStore = configureStore([]);

const renderWithThemeAndStore = (resolution = 'desktop') => {
  const theme = createTheme(lightTheme);
  const store = mockStore({
    screenLayout: {
      resolution,
    },
  });

  return {
    ...render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <DeviceViewSelector />
        </ThemeProvider>
      </Provider>,
    ),
    store,
  };
};

describe('DeviceViewSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all three device options', () => {
    renderWithThemeAndStore('desktop');

    expect(screen.getByLabelText('Switch to Desktop view')).toBeInTheDocument();
    expect(screen.getByLabelText('Switch to Tablet view')).toBeInTheDocument();
    expect(screen.getByLabelText('Switch to Mobile view')).toBeInTheDocument();
  });

  it('renders with default selectedDevice as desktop', () => {
    renderWithThemeAndStore('desktop');

    const desktopButton = screen.getByLabelText('Switch to Desktop view');
    expect(desktopButton).toBeInTheDocument();
  });

  it('dispatches setResolution action when a device is clicked', () => {
    const { store } = renderWithThemeAndStore('desktop');

    const tabletButton = screen.getByLabelText('Switch to Tablet view');
    fireEvent.click(tabletButton);

    const actions = store.getActions();
    expect(actions).toHaveLength(1);
    expect(actions[0]).toEqual({
      type: 'screenLayout/setResolution',
      payload: 'tablet',
    });
  });

  it('dispatches setResolution action when Enter key is pressed', () => {
    const { store } = renderWithThemeAndStore('desktop');

    const mobileButton = screen.getByLabelText('Switch to Mobile view');
    fireEvent.keyDown(mobileButton, { key: 'Enter' });

    const actions = store.getActions();
    expect(actions).toHaveLength(1);
    expect(actions[0]).toEqual({
      type: 'screenLayout/setResolution',
      payload: 'mobile',
    });
  });

  it('dispatches setResolution action when Space key is pressed', () => {
    const { store } = renderWithThemeAndStore('desktop');

    const tabletButton = screen.getByLabelText('Switch to Tablet view');
    fireEvent.keyDown(tabletButton, { key: ' ' });

    const actions = store.getActions();
    expect(actions).toHaveLength(1);
    expect(actions[0]).toEqual({
      type: 'screenLayout/setResolution',
      payload: 'tablet',
    });
  });

  it('does not dispatch action for other keys', () => {
    const { store } = renderWithThemeAndStore('desktop');

    const tabletButton = screen.getByLabelText('Switch to Tablet view');
    fireEvent.keyDown(tabletButton, { key: 'Escape' });

    const actions = store.getActions();
    expect(actions).toHaveLength(0);
  });

  it('renders device buttons with proper aria labels', () => {
    renderWithThemeAndStore('desktop');

    expect(screen.getByLabelText('Switch to Desktop view')).toBeInTheDocument();
    expect(screen.getByLabelText('Switch to Tablet view')).toBeInTheDocument();
    expect(screen.getByLabelText('Switch to Mobile view')).toBeInTheDocument();
  });

  it('has correct tooltip data attributes', () => {
    renderWithThemeAndStore('desktop');

    const desktopButton = screen.getByLabelText('Switch to Desktop view');
    const tabletButton = screen.getByLabelText('Switch to Tablet view');
    const mobileButton = screen.getByLabelText('Switch to Mobile view');

    // Check tooltip data attributes
    expect(desktopButton).toHaveAttribute('data-tooltip-id', 'device-selector-tooltip');
    expect(desktopButton).toHaveAttribute('data-tooltip-content', 'Desktop view (1200 px)');
    expect(desktopButton).toHaveAttribute('data-tooltip-place', 'bottom');

    expect(tabletButton).toHaveAttribute('data-tooltip-id', 'device-selector-tooltip');
    expect(tabletButton).toHaveAttribute('data-tooltip-content', 'Tablet view (768 px)');
    expect(tabletButton).toHaveAttribute('data-tooltip-place', 'bottom');

    expect(mobileButton).toHaveAttribute('data-tooltip-id', 'device-selector-tooltip');
    expect(mobileButton).toHaveAttribute('data-tooltip-content', 'Mobile view (375 px)');
    expect(mobileButton).toHaveAttribute('data-tooltip-place', 'bottom');
  });

  it('renders tooltip component', () => {
    const { container } = renderWithThemeAndStore('desktop');

    // Check that the Tooltip component is rendered in the component tree
    // react-tooltip creates DOM elements dynamically, so we check for the component in the React tree
    expect(container.querySelector('[data-tooltip-id="device-selector-tooltip"]')).toBeInTheDocument();
  });

  it('handles different resolution values correctly', () => {
    const theme = createTheme(lightTheme);
    const { rerender } = renderWithThemeAndStore('tablet');

    const tabletButton = screen.getByLabelText('Switch to Tablet view');
    expect(tabletButton).toBeInTheDocument();

    const store = mockStore({
      screenLayout: {
        resolution: 'mobile',
      },
    });

    rerender(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <DeviceViewSelector />
        </ThemeProvider>
      </Provider>,
    );

    const mobileButton = screen.getByLabelText('Switch to Mobile view');
    expect(mobileButton).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    renderWithThemeAndStore('desktop');

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);

    buttons.forEach((button) => {
      expect(button).toHaveAttribute('tabIndex', '0');
      expect(button).toHaveAttribute('aria-label');
    });
  });

  it('does not crash when clicking device button', () => {
    renderWithThemeAndStore('desktop');

    const tabletButton = screen.getByLabelText('Switch to Tablet view');

    // This should not throw an error
    expect(() => {
      fireEvent.click(tabletButton);
    }).not.toThrow();
  });
});
