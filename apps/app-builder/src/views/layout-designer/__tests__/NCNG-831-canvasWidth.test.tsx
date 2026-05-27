/**
 * NCNG-831: Resizing screen makes right-aligned elements disappear
 *
 * Regression tests verifying that:
 * AC2 — the React.memo comparator in LayoutCanvasWrapper includes canvasWidth so
 *        the component re-renders when the designer pane is resized.
 * AC3 — LayoutCanvasWrapper passes the correct (potentially clamped) canvasWidth
 *        down to LayoutCanvas as its `width` prop.
 *
 * Uses a mocked LayoutCanvas so we can spy on the `width` prop it receives without
 * WidthProvider overriding it at the JSDOM measurement level.
 */

import React, { Suspense } from 'react';
import { render, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// Capture the last `width` prop passed to LayoutCanvas for assertion.
let capturedLayoutCanvasWidth: number | undefined;

// Mock @m-next/layout-canvas at the module level so we can spy on the width prop
// passed to LayoutCanvas without WidthProvider overriding it.
jest.mock('@m-next/layout-canvas', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');
  return {
    __esModule: true,
    // Minimal LayoutCanvas stub that captures the width prop and renders a testable element
    LayoutCanvas: ({ width, components }: { width: number; components: { id: string }[] }) => {
      capturedLayoutCanvasWidth = width;
      return (
        <div
          data-testid="mock-layout-canvas"
          data-canvas-width={String(width)}
          className="react-grid-layout"
        >
          {(components || []).map((c) => (
            <div key={c.id} data-testid={`component-${c.id}`} />
          ))}
        </div>
      );
    },
    // Stubs for other named exports consumed by LayoutCanvasWrapper
    ComponentPalette: () => null,
    getGridColumns: jest.fn(() => 12),
    CANVAS_DIMENSIONS: {
      desktop: { minWidth: 976, maxWidth: 1200 },
      tablet: { width: 768 },
      mobile: { width: 375 },
    },
    TAB_PANEL_WIDTH: 440,
    getCanvasWidth: jest.fn((resolution: string) => {
      if (resolution === 'tablet') return 768;
      if (resolution === 'mobile') return 375;
      return 1200;
    }),
    mapWidgetToControlType: jest.fn(() => 'button'),
    getDisplayRestrictionsFromRegistry: jest.fn(() => undefined),
    getComponentDefaultsFromRegistry: jest.fn(() => ({})),
    useInsertModeState: jest.fn(() => ({
      isActive: false,
      indicatorWidth: 0,
    })),
    DesignerContextProvider: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
    ScreenDataContextProvider: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
    useDesignerContext: jest.fn(() => ({})),
    useDragAndDrop: jest.fn(() => ({})),
    assembleLayoutCanvas: jest.fn((items: unknown[]) => items),
    buildFlatLayoutItems: jest.fn((items: unknown[]) => items),
    getControlDefaults: jest.fn(() => ({})),
    getCanvasConfig: jest.fn(() => ({})),
    isWidgetTypeInRegistry: jest.fn(() => true),
    // Z-index constants consumed by transitive imports (e.g. SettingsHeader.styles.jsx)
    Z_CANVAS: { GRID_ITEM: 1, CONTAINER: 2, DRAG_BADGE: 10, SELECTION_OVERLAY: 20 },
    Z_COMPONENT: { BASE: 0, HIDDEN_BADGE: 50, FEEDBACK: 100 },
    Z_UI: { COMPONENT_PALETTE: 500, DROP_INDICATOR: 600 },
    Z_POPUP: { POPOVER: 1000, TOOLTIP: 1100, GRID_FILTER: 1200, SCREEN_SELECTOR: 1300, COLOR_PICKER: 2000 },
    Z_MODAL: { INVALID_SCREEN: 4000, DIALOG: 9001, ACTION_EDITOR: 9500 },
  };
});

jest.mock('../../../common/services/tagsApi', () => ({
  useGetTagSuggestionsQuery: () => ({
    data: { suggestions: [], others: [] },
    isLoading: false,
    isError: false,
    error: null,
  }),
  tagsApi: {
    reducerPath: 'tagsApi',
    reducer: (state = {}) => state,
    middleware: () => (next: (action: unknown) => unknown) => (action: unknown) => next(action),
  },
}));

jest.mock('../editors/html-editor/HtmlEditorBlockEditor', () => ({
  __esModule: true,
  default: ({ id }: { id: string }) => <div data-testid={`html-editor-${id}`}>HTML Editor Mock</div>,
}));

jest.mock('../component-wrappers/attachmentDesignerWrapper', () => ({
  __esModule: true,
  default: ({ id }: { id: string }) => <div data-testid={`attachment-${id}`}>Attachment Mock</div>,
}));

jest.mock('../component-wrappers/tagWidgetDesignerWrapper', () => ({
  __esModule: true,
  default: ({ id }: { id: string }) => <div data-testid={`tag-widget-${id}`}>Tag Widget Mock</div>,
}));

jest.mock('../component-wrappers/dropdownDesignerWrapper', () => ({
  __esModule: true,
  default: ({ id }: { id: string }) => <div data-testid={`dropdown-${id}`}>Dropdown Mock</div>,
}));

jest.mock('../editors/date-time-picker-editor/DateTimePickerEditor', () => ({
  __esModule: true,
  default: ({ id }: { id: string }) => <div data-testid={`datetime-picker-${id}`}>DateTime Picker Mock</div>,
}));

jest.mock('@m-next/utilities', () => ({
  Guid: {
    newGuid: () => `test-guid-${Date.now()}-${Math.random()}`,
    create: () => `test-guid-${Date.now()}-${Math.random()}`,
  },
}));

jest.mock('../../../components/EmptyCanvasState', () => ({
  __esModule: true,
  default: () => <div data-testid="empty-canvas-state">Empty</div>,
}));

jest.mock('@m-next/action-editor', () => ({
  openActionEditor: jest.fn(),
}));

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

(globalThis as typeof globalThis & { fetch: jest.Mock }).fetch = jest.fn();

// Import AFTER mocks are set up
import LayoutCanvasWrapper from '../LayoutCanvasWrapper';

const initialSessionState = {
  accountName: 'test-account',
  accountFriendlyName: 'Test Account',
  accountId: 'test-account-id',
  isDeveloper: false,
  userName: 'test-user',
  userId: 'test-user-id',
  methodIdentity: 'test-identity',
  userEmail: 'test@example.com',
  tokenV2: 'test-token-v2',
  tokenRTC: 'test-token-rtc',
  preferences: { display: {} },
  isAdmin: false,
  isCustomizer: true,
  featureFlags: {},
  exportedFunctions: null,
  nocodeAssistantSessionId: null,
};

const initialAppState = {
  status: 'ready',
  appName: 'Test App',
  screenName: 'Test Screen',
  versionNumber: '1.0.0',
  accountingType: null,
  publishStatus: null,
  isReadOnly: false,
  appId: 'test-app-id',
  screenId: 'test-screen-id',
  versionId: 'test-version-id',
  dataModels: [],
  defaultScreen: null,
  description: 'Test description',
  creatorName: 'Test Creator',
  iconFileName: null,
  newScreen: null,
  projections: [],
  screens: [],
  updatedDate: null,
  userPreferenceScreen: null,
  viewScreen: null,
  listScreen: null,
};

const createTestStore = (initialControls = {}) =>
  configureStore({
    reducer: {
      session: (state = initialSessionState) => state,
      app: (state = initialAppState) => state,
      screenLayout: (state = { controls: initialControls }) => state,
    },
  });

const renderWithProviders = (ui: React.ReactElement, store = createTestStore()) =>
  render(
    <Provider store={store}>
      <Suspense fallback={<div>Loading...</div>}>{ui}</Suspense>
    </Provider>,
  );

describe('NCNG-831: LayoutCanvasWrapper passes canvasWidth to LayoutCanvas', () => {
  const mockControls = {
    'button-1': {
      id: 'button-1',
      type: 'BTN',
      Type: 'BTN',
      x: 8,
      y: 0,
      width: 4,
      height: 2,
      caption: 'Save',
    },
  };

  beforeEach(() => {
    capturedLayoutCanvasWidth = undefined;
    jest.clearAllMocks();
  });

  it('AC3: LayoutCanvas receives canvasWidth=800 when rendered with narrow canvas', async () => {
    // Regression guard: when the designer pane is at 800px, LayoutCanvasWrapper must
    // forward that value to LayoutCanvas so RGL positions elements within the visible area.
    const store = createTestStore(mockControls);

    renderWithProviders(
      <LayoutCanvasWrapper
        controls={mockControls}
        resolution="desktop"
        canvasWidth={800}
        gridColumns={12}
        hasControls
      />,
      store,
    );

    await waitFor(
      () => {
        expect(capturedLayoutCanvasWidth).toBe(800);
      },
      { timeout: 3000 },
    );
  });

  it('AC2: re-renders and passes updated canvasWidth when prop changes (memo comparator includes canvasWidth)', async () => {
    // Without canvasWidth in the React.memo comparator, LayoutCanvasWrapper would not
    // re-render on resize and LayoutCanvas would keep using the old (wider) width,
    // positioning right-aligned elements beyond the clipped visible area.
    const store = createTestStore(mockControls);

    const { rerender } = renderWithProviders(
      <LayoutCanvasWrapper
        controls={mockControls}
        resolution="desktop"
        canvasWidth={1200}
        gridColumns={12}
        hasControls
      />,
      store,
    );

    // Wait for initial render with width=1200
    await waitFor(
      () => {
        expect(capturedLayoutCanvasWidth).toBe(1200);
      },
      { timeout: 3000 },
    );

    // Simulate designer pane resize to 800px
    await act(async () => {
      rerender(
        <Provider store={store}>
          <Suspense fallback={<div>Loading...</div>}>
            <LayoutCanvasWrapper
              controls={mockControls}
              resolution="desktop"
              canvasWidth={800}
              gridColumns={12}
              hasControls
            />
          </Suspense>
        </Provider>,
      );
    });

    // LayoutCanvas must have been called with the new width — proving the memo
    // comparator allowed the re-render when canvasWidth changed.
    await waitFor(
      () => {
        expect(capturedLayoutCanvasWidth).toBe(800);
      },
      { timeout: 3000 },
    );
  });
});
