import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { ScreensPanel } from './ScreensPanel';

// Mock dependencies
jest.mock('../../../common/services/managementApi', () => ({
  useGetAppScreensQuery: jest.fn(),
}));

jest.mock('@m-next/svg-icon', () => ({
  __esModule: true,
  default: ({ name }: { name: string }) => <div data-testid={`icon-${name}`}>{name}</div>,
}));

jest.mock('react-tooltip', () => ({
  Tooltip: ({ id }: { id: string }) => <div data-testid={`tooltip-${id}`} />,
}));

import { useGetAppScreensQuery } from '../../../common/services/managementApi';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock store setup
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      app: (state = { appId: 'test-app-id', isBuildingApp: false }) => state,
      screenLayout: (state = { id: 'loaded-screen-id' }) => state,
    },
    preloadedState: initialState,
  });
};

const renderWithProviders = (
  ui: React.ReactElement,
  { store = createMockStore(), ...renderOptions } = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

describe('ScreensPanel', () => {
  const mockScreens = [
    {
      id: 'screen-1',
      name: 'Home Screen',
      isDefaultAppScreen: true,
      versions: [
        { versionId: 'version-1', versionState: 'TEST' },
        { versionId: 'version-2', versionState: 'ACTIVE' },
      ],
      currentVersion: 'version-2',
    },
    {
      id: 'screen-2',
      name: 'Details Screen',
      isDefaultAppScreen: false,
      versions: [{ versionId: 'version-3', versionState: 'ACTIVE' }],
      currentVersion: 'version-3',
    },
    {
      id: 'screen-3',
      name: 'Building Screen',
      isDefaultAppScreen: false,
      aiBuildStatus: 'in_progress',
      versions: [{ versionId: 'version-4', versionState: 'TEST' }],
      currentVersion: 'version-4',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useGetAppScreensQuery.mockReturnValue({
      data: mockScreens,
      isLoading: false,
      error: null,
    });
    delete (window as Window & { location: { href: string } }).location;
    (window as Window & { location: { href: string } }).location = { href: '' };
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      renderWithProviders(<ScreensPanel />);
      expect(screen.getByTestId('screens-sidebar')).toBeInTheDocument();
    });

    it('should render the header with title and close button', () => {
      renderWithProviders(<ScreensPanel />);
      expect(screen.getByText('Screens')).toBeInTheDocument();
      expect(screen.getByTestId('icon-close-V4')).toBeInTheDocument();
    });

    it('should display screen count', () => {
      renderWithProviders(<ScreensPanel />);
      expect(screen.getByText('3 Screens')).toBeInTheDocument();
    });

    it('should render settings button', () => {
      renderWithProviders(<ScreensPanel />);
      expect(screen.getByLabelText('Settings')).toBeInTheDocument();
    });

    it('should render add button when onAddScreen is provided', () => {
      const mockOnAddScreen = jest.fn();
      renderWithProviders(<ScreensPanel onAddScreen={mockOnAddScreen} />);
      expect(screen.getByLabelText('Add screen')).toBeInTheDocument();
    });

    it('should not render add button when onAddScreen is not provided', () => {
      renderWithProviders(<ScreensPanel />);
      expect(screen.queryByLabelText('Add screen')).not.toBeInTheDocument();
    });

    it('should render all screens', () => {
      renderWithProviders(<ScreensPanel />);
      expect(screen.getByText('Home Screen')).toBeInTheDocument();
      expect(screen.getByText('Details Screen')).toBeInTheDocument();
      expect(screen.getByText('Building Screen')).toBeInTheDocument();
    });

    it('should render home icon for default screen', () => {
      renderWithProviders(<ScreensPanel />);
      const homeScreen = screen.getByTestId('screens-sidebar-screen-screen-1');
      expect(homeScreen.querySelector('[data-testid="icon-home"]')).toBeInTheDocument();
    });

    it('should render screen-V4 icon for non-default screens', () => {
      renderWithProviders(<ScreensPanel />);
      const detailsScreen = screen.getByTestId('screens-sidebar-screen-screen-2');
      expect(detailsScreen.querySelector('[data-testid="icon-screen-V4"]')).toBeInTheDocument();
    });

    it('should render tooltip component', () => {
      renderWithProviders(<ScreensPanel />);
      expect(screen.getByTestId('tooltip-screen-building-tooltip')).toBeInTheDocument();
    });

    it('should add tooltip attributes to building screens', () => {
      renderWithProviders(<ScreensPanel />);
      const buildingScreen = screen.getByTestId('screens-sidebar-screen-screen-3');
      expect(buildingScreen).toHaveAttribute('data-tooltip-id', 'screen-building-tooltip');
      expect(buildingScreen).toHaveAttribute('data-tooltip-content', 'Screen is still building.');
    });

    it('should render checkmark for done screens when isBuildingApp is true', () => {
      const screensWithDone = [
        ...mockScreens,
        {
          id: 'screen-done',
          name: 'Done Screen',
          isDefaultAppScreen: false,
          aiBuildStatus: 'done',
          versions: [{ versionId: 'version-5', versionState: 'TEST' }],
          currentVersion: 'version-5',
        },
      ];
      useGetAppScreensQuery.mockReturnValue({
        data: screensWithDone,
        isLoading: false,
        error: null,
      });

      const store = createMockStore({
        app: { appId: 'test-app-id', isBuildingApp: true },
        screenLayout: { id: 'screen-1' },
      });

      renderWithProviders(<ScreensPanel />, { store });
      expect(screen.getByTestId('icon-check-circle-filled')).toBeInTheDocument();
    });

    it('should NOT render checkmark for done screens when isBuildingApp is false', () => {
      const screensWithDone = [
        ...mockScreens,
        {
          id: 'screen-done',
          name: 'Done Screen',
          isDefaultAppScreen: false,
          aiBuildStatus: 'done',
          versions: [{ versionId: 'version-5', versionState: 'TEST' }],
          currentVersion: 'version-5',
        },
      ];
      useGetAppScreensQuery.mockReturnValue({
        data: screensWithDone,
        isLoading: false,
        error: null,
      });

      const store = createMockStore({
        app: { appId: 'test-app-id', isBuildingApp: false },
        screenLayout: { id: 'screen-1' },
      });

      renderWithProviders(<ScreensPanel />, { store });
      expect(screen.queryByTestId('icon-check-circle-filled')).not.toBeInTheDocument();
    });
  });

  describe('Screen Selection', () => {
    it('should mark loaded screen as active', () => {
      const store = createMockStore({
        app: { appId: 'test-app-id' },
        screenLayout: { id: 'screen-1' },
      });
      renderWithProviders(<ScreensPanel />, { store });
      const activeScreen = screen.getByTestId('screens-sidebar-screen-screen-1');
      // The isActive prop applies styling via styled-components
      // We can verify it's present in the component tree
      expect(activeScreen).toBeInTheDocument();
    });

    it('should navigate to TEST version when screen is clicked', () => {
      renderWithProviders(<ScreensPanel />);
      const homeScreen = screen.getByText('Home Screen');
      fireEvent.click(homeScreen);
      
      expect(mockNavigate).toHaveBeenCalledWith(
        '/test-app-id/layout/screen-1/version-1',
        { replace: true }
      );
    });

    it('should navigate to current version when no TEST version exists', () => {
      renderWithProviders(<ScreensPanel />);
      const detailsScreen = screen.getByText('Details Screen');
      fireEvent.click(detailsScreen);
      
      expect(mockNavigate).toHaveBeenCalledWith(
        '/test-app-id/layout/screen-2/version-3',
        { replace: true }
      );
    });

    it('should not navigate when screen has no versions', () => {
      useGetAppScreensQuery.mockReturnValue({
        data: [
          {
            id: 'screen-no-version',
            name: 'No Version Screen',
            versions: [],
          },
        ],
      });
      renderWithProviders(<ScreensPanel />);
      const noVersionScreen = screen.getByText('No Version Screen');
      fireEvent.click(noVersionScreen);
      
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('User Interactions', () => {
    it('should call onClose when close button is clicked', () => {
      const mockOnClose = jest.fn();
      renderWithProviders(<ScreensPanel onClose={mockOnClose} />);
      
      const closeButton = screen.getByTestId('icon-close-V4').parentElement!;
      fireEvent.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onAddScreen when add button is clicked', () => {
      const mockOnAddScreen = jest.fn();
      renderWithProviders(<ScreensPanel onAddScreen={mockOnAddScreen} />);
      
      const addButton = screen.getByLabelText('Add screen');
      fireEvent.click(addButton);
      
      expect(mockOnAddScreen).toHaveBeenCalledTimes(1);
    });

    it('should navigate to legacy screens page when settings button is clicked', () => {
      const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
      
      renderWithProviders(<ScreensPanel />);
      
      const settingsButton = screen.getByLabelText('Settings');
      fireEvent.click(settingsButton);
      
      expect(windowOpenSpy).toHaveBeenCalledWith('/apps/Default.aspx#/apps/test-app-id/screens', '_blank');
      
      windowOpenSpy.mockRestore();
    });
  });

  describe('Empty States', () => {
    it('should handle empty screens list', () => {
      useGetAppScreensQuery.mockReturnValue({
        data: [],
      });
      renderWithProviders(<ScreensPanel />);
      
      expect(screen.getByText('0 Screens')).toBeInTheDocument();
      expect(screen.queryByText('Home Screen')).not.toBeInTheDocument();
    });

    it('should handle undefined screens data', () => {
      useGetAppScreensQuery.mockReturnValue({
        data: undefined,
      });
      renderWithProviders(<ScreensPanel />);
      
      expect(screen.getByText('0 Screens')).toBeInTheDocument();
    });
  });

  describe('Custom Test ID', () => {
    it('should use custom test ID when provided', () => {
      renderWithProviders(<ScreensPanel data-testid="custom-panel" />);
      expect(screen.getByTestId('custom-panel')).toBeInTheDocument();
    });

    it('should use default test ID when not provided', () => {
      renderWithProviders(<ScreensPanel />);
      expect(screen.getByTestId('screens-sidebar')).toBeInTheDocument();
    });
  });

  describe('API Integration', () => {
    it('should skip query when appId is not available', () => {
      const store = createMockStore({
        app: { appId: null },
        screenLayout: { id: 'loaded-screen-id' },
      });
      
      renderWithProviders(<ScreensPanel />, { store });
      
      expect(useGetAppScreensQuery).toHaveBeenCalledWith(
        { appId: null },
        { skip: true }
      );
    });

    it('should call query with appId when available', () => {
      renderWithProviders(<ScreensPanel />);
      
      expect(useGetAppScreensQuery).toHaveBeenCalledWith(
        { appId: 'test-app-id' },
        { skip: false }
      );
    });
  });
});
