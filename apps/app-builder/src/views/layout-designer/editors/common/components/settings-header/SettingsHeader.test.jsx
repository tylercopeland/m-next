import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';
import configureStore from 'redux-mock-store';
import SettingsHeader from './SettingsHeader';
import { hasControlReferences } from '../control-references-utils';

jest.mock('@m-next/layout-canvas', () => ({
  Z_POPUP: { POPOVER: 1000, TOOLTIP: 1100, GRID_FILTER: 1200, SCREEN_SELECTOR: 1300, COLOR_PICKER: 2000 },
}));

// Mock external dependencies
jest.mock(
  '@m-next/bread-crumbs',
  () =>
    function MockBreadCrumbHeader({ crumbs }) {
      return (
        <div data-testid='breadcrumb-header'>
          {crumbs.map((crumb) => (
            <span key={crumb.id} data-testid={`crumb-${crumb.id}`}>
              {crumb.label}
            </span>
          ))}
        </div>
      );
    },
);

jest.mock(
  '@m-next/svg-icon',
  () =>
    function MockSvgIcon({ name, onClick, disabled, tooltip, tooltipId, 'data-testid': testId }) {
      return (
        <button
          data-testid={testId || `svg-icon-${name}`}
          onClick={onClick}
          disabled={disabled}
          title={tooltip}
          data-tooltip-id={tooltipId}
          type='button'
        >
          {name}
        </button>
      );
    },
);

jest.mock('@m-next/styles', () => ({
  colors: {
    grey: '#666',
    'grey-light': '#ccc',
    'grey-darker': '#333',
  },
}));

jest.mock('@m-next/menu', () => ({
  IconMenuList: function MockIconMenuList({ children }) {
    return <div data-testid='icon-menu-list'>{children}</div>;
  },
  MenuItem: function MockMenuItem({ children, onClick }) {
    return (
      <button type='button' onClick={onClick}>
        {children}
      </button>
    );
  },
}));

jest.mock('react-tooltip', () => ({
  Tooltip: function MockTooltip() {
    return null;
  },
}));

jest.mock('../control-references-utils', () => ({
  hasControlReferences: jest.fn(() => false),
  containerOrChildrenHaveEvents: jest.fn(() => false),
}));

jest.mock('../../utils/deleteControlHelper', () => ({
  getDeleteAction: jest.fn(() => ({ action: 'delete' })),
}));

jest.mock('../../utils/duplicateControlHelper', () => ({
  canDuplicateControl: jest.fn(() => ({ canDuplicate: true, tooltipMessage: 'Duplicate' })),
}));

jest.mock('../delete-dialog', () => ({
  __esModule: true,
  default: function MockDeleteDialog() {
    return null;
  },
  ContainerDeleteBlockedDialog: function MockContainerDeleteBlockedDialog() {
    return null;
  },
}));

const mockStore = configureStore([]);

describe('SettingsHeader', () => {
  const defaultCrumbs = [{ id: 'control-1', label: 'Button' }];

  const createMockState = ({ isV4Screen = true, publishStatus = 'Draft' }) => ({
    screenLayout: {
      controls: {
        'control-1': { id: 'control-1', type: 'BTN' },
      },
      screenProperties: {},
      layoutV4: {},
      isV4Screen,
    },
    app: {
      publishStatus,
    },
  });

  const renderWithProvider = (props, storeState) => {
    const store = mockStore(storeState);
    return render(
      <Provider store={store}>
        <SettingsHeader
          crumbs={defaultCrumbs}
          controlId='control-1'
          showDeleteIcon
          showDuplicateIcon
          onDelete={jest.fn()}
          onDuplicate={jest.fn()}
          screenData={{}}
          {...props}
        />
      </Provider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Top Level (single breadcrumb) - uses isV4Screen', () => {
    it('should enable delete and duplicate on V4 screens', () => {
      const state = createMockState({ isV4Screen: true, publishStatus: 'Draft' });
      renderWithProvider({ crumbs: [{ id: 'control-1', label: 'Grid' }] }, state);

      const deleteButton = screen.getByTestId('svg-icon-trash-V4');
      const duplicateButton = screen.getByTestId('svg-icon-duplicate-icon');

      expect(deleteButton).not.toBeDisabled();
      expect(duplicateButton).not.toBeDisabled();
    });

    it('should disable delete and duplicate on legacy screens at top level', () => {
      const state = createMockState({ isV4Screen: false, publishStatus: 'Draft' });
      renderWithProvider({ crumbs: [{ id: 'control-1', label: 'Grid' }] }, state);

      const deleteButton = screen.getByTestId('svg-icon-trash-V4');
      const duplicateButton = screen.getByTestId('svg-icon-duplicate-icon');

      expect(deleteButton).toBeDisabled();
      expect(duplicateButton).toBeDisabled();
    });

    it('should disable actions on V4 published screens at top level', () => {
      const state = createMockState({ isV4Screen: false, publishStatus: 'Published' });
      renderWithProvider({ crumbs: [{ id: 'control-1', label: 'Grid' }] }, state);

      const deleteButton = screen.getByTestId('svg-icon-trash-V4');
      const duplicateButton = screen.getByTestId('svg-icon-duplicate-icon');

      expect(deleteButton).toBeDisabled();
      expect(duplicateButton).toBeDisabled();
    });
  });

  describe('Drill-down Level (multiple breadcrumbs) - uses publishStatus', () => {
    const drillDownCrumbs = [
      { id: 'grid-1', label: 'Grid' },
      { id: 'column-1', label: 'Column' },
    ];

    it('should enable delete and duplicate on legacy draft screens at drill-down level', () => {
      const state = createMockState({ isV4Screen: false, publishStatus: 'Draft' });
      renderWithProvider({ crumbs: drillDownCrumbs }, state);

      const deleteButton = screen.getByTestId('svg-icon-trash-V4');
      const duplicateButton = screen.getByTestId('svg-icon-duplicate-icon');

      expect(deleteButton).not.toBeDisabled();
      expect(duplicateButton).not.toBeDisabled();
    });

    it('should disable delete and duplicate on legacy published screens at drill-down level', () => {
      const state = createMockState({ isV4Screen: false, publishStatus: 'Published' });
      renderWithProvider({ crumbs: drillDownCrumbs }, state);

      const deleteButton = screen.getByTestId('svg-icon-trash-V4');
      const duplicateButton = screen.getByTestId('svg-icon-duplicate-icon');

      expect(deleteButton).toBeDisabled();
      expect(duplicateButton).toBeDisabled();
    });

    it('should disable actions on archived screens at drill-down level', () => {
      const state = createMockState({ isV4Screen: false, publishStatus: 'Archived' });
      renderWithProvider({ crumbs: drillDownCrumbs }, state);

      const deleteButton = screen.getByTestId('svg-icon-trash-V4');
      const duplicateButton = screen.getByTestId('svg-icon-duplicate-icon');

      expect(deleteButton).toBeDisabled();
      expect(duplicateButton).toBeDisabled();
    });

    it('should enable actions on V4 draft screens at drill-down level', () => {
      const state = createMockState({ isV4Screen: true, publishStatus: 'Draft' });
      renderWithProvider({ crumbs: drillDownCrumbs }, state);

      const deleteButton = screen.getByTestId('svg-icon-trash-V4');
      const duplicateButton = screen.getByTestId('svg-icon-duplicate-icon');

      expect(deleteButton).not.toBeDisabled();
      expect(duplicateButton).not.toBeDisabled();
    });
  });

  describe('View drill-down (3 level breadcrumbs)', () => {
    const viewDrillDownCrumbs = [
      { id: 'grid-1', label: 'Grid' },
      { id: 'view-1', label: 'Custom View' },
    ];

    it('should enable view actions on legacy draft screens', () => {
      const state = createMockState({ isV4Screen: false, publishStatus: 'Draft' });
      renderWithProvider({ crumbs: viewDrillDownCrumbs }, state);

      const deleteButton = screen.getByTestId('svg-icon-trash-V4');
      const duplicateButton = screen.getByTestId('svg-icon-duplicate-icon');

      expect(deleteButton).not.toBeDisabled();
      expect(duplicateButton).not.toBeDisabled();
    });

    it('should disable view actions on legacy published screens', () => {
      const state = createMockState({ isV4Screen: false, publishStatus: 'Published' });
      renderWithProvider({ crumbs: viewDrillDownCrumbs }, state);

      const deleteButton = screen.getByTestId('svg-icon-trash-V4');
      const duplicateButton = screen.getByTestId('svg-icon-duplicate-icon');

      expect(deleteButton).toBeDisabled();
      expect(duplicateButton).toBeDisabled();
    });
  });

  describe('Click handlers', () => {
    it('should call onDuplicate when duplicate button is clicked on enabled state', () => {
      const onDuplicate = jest.fn();
      const state = createMockState({ isV4Screen: false, publishStatus: 'Draft' });
      const drillDownCrumbs = [
        { id: 'grid-1', label: 'Grid' },
        { id: 'view-1', label: 'View' },
      ];
      renderWithProvider({ crumbs: drillDownCrumbs, onDuplicate }, state);

      const duplicateButton = screen.getByTestId('svg-icon-duplicate-icon');
      fireEvent.click(duplicateButton);

      expect(onDuplicate).toHaveBeenCalled();
    });

    it('should not call onDuplicate when button is disabled', () => {
      const onDuplicate = jest.fn();
      const state = createMockState({ isV4Screen: false, publishStatus: 'Published' });
      const drillDownCrumbs = [
        { id: 'grid-1', label: 'Grid' },
        { id: 'view-1', label: 'View' },
      ];
      renderWithProvider({ crumbs: drillDownCrumbs, onDuplicate }, state);

      const duplicateButton = screen.getByTestId('svg-icon-duplicate-icon');
      fireEvent.click(duplicateButton);

      expect(onDuplicate).not.toHaveBeenCalled();
    });
  });

  describe('Tooltip behavior', () => {
    it('should show appropriate tooltip for enabled delete button', () => {
      const state = createMockState({ isV4Screen: false, publishStatus: 'Draft' });
      const drillDownCrumbs = [
        { id: 'grid-1', label: 'Grid' },
        { id: 'column-1', label: 'Column' },
      ];
      renderWithProvider({ crumbs: drillDownCrumbs }, state);

      const deleteButton = screen.getByTestId('svg-icon-trash-V4');
      expect(deleteButton).toHaveAttribute('title', 'Delete');
    });
  });

  describe('No regression for existing behavior', () => {
    it('should maintain V4 screen behavior at top level', () => {
      const state = createMockState({ isV4Screen: true, publishStatus: 'Published' });
      renderWithProvider({ crumbs: [{ id: 'control-1', label: 'Button' }] }, state);

      const deleteButton = screen.getByTestId('svg-icon-trash-V4');
      const duplicateButton = screen.getByTestId('svg-icon-duplicate-icon');

      // V4 screens at top level should use isV4Screen (true), so enabled
      expect(deleteButton).not.toBeDisabled();
      expect(duplicateButton).not.toBeDisabled();
    });
  });

  describe('V1 Grid Builder column/view delete bypass (contextType check)', () => {
    beforeEach(() => {
      // Simulate a grid that has references (Row Click, Load, etc.)
      // that would normally block deletion
      hasControlReferences.mockReturnValue(true);
    });

    afterEach(() => {
      hasControlReferences.mockReturnValue(false);
    });

    it('should enable delete when contextType is "column" even if selectedColumn is not set', () => {
      const state = createMockState({ isV4Screen: false, publishStatus: 'Draft' });
      const drillDownCrumbs = [
        { id: 'grid-1', label: 'Grid' },
        { id: 'column-1', label: 'My Column' },
      ];
      renderWithProvider(
        {
          crumbs: drillDownCrumbs,
          contextType: 'column',
          controlProperty: {}, // V1 path: no selectedColumn set
        },
        state,
      );

      const deleteButton = screen.getByTestId('svg-icon-trash-V4');
      // Should NOT be blocked by grid references — column deletion bypasses grid-level check
      expect(deleteButton).not.toBeDisabled();
    });

    it('should enable delete when contextType is "view" even if selectedView is not set', () => {
      const state = createMockState({ isV4Screen: false, publishStatus: 'Draft' });
      const drillDownCrumbs = [
        { id: 'grid-1', label: 'Grid' },
        { id: 'view-1', label: 'My View' },
      ];
      renderWithProvider(
        {
          crumbs: drillDownCrumbs,
          contextType: 'view',
          controlProperty: {}, // V1 path: no selectedView set
        },
        state,
      );

      const deleteButton = screen.getByTestId('svg-icon-trash-V4');
      // Should NOT be blocked by grid references — view deletion bypasses grid-level check
      expect(deleteButton).not.toBeDisabled();
    });

    it('should still block delete at grid level (contextType null) when grid has references', () => {
      const state = createMockState({ isV4Screen: true, publishStatus: 'Draft' });
      renderWithProvider(
        {
          crumbs: [{ id: 'grid-1', label: 'Grid' }],
          contextType: null, // top-level grid — should check references
          controlProperty: {},
        },
        state,
      );

      const deleteButton = screen.getByTestId('svg-icon-trash-V4');
      // Grid-level delete SHOULD be blocked when grid has references
      expect(deleteButton).toBeDisabled();
    });

    it('should still work for V2 path (selectedColumn set) alongside contextType check', () => {
      const state = createMockState({ isV4Screen: false, publishStatus: 'Draft' });
      const drillDownCrumbs = [
        { id: 'grid-1', label: 'Grid' },
        { id: 'column-1', label: 'My Column' },
      ];
      renderWithProvider(
        {
          crumbs: drillDownCrumbs,
          contextType: 'column',
          controlProperty: { selectedColumn: 'MyField' }, // V2 path: selectedColumn is set
        },
        state,
      );

      const deleteButton = screen.getByTestId('svg-icon-trash-V4');
      expect(deleteButton).not.toBeDisabled();
    });
  });
});
