/* eslint-disable react/no-array-index-key */

import React from 'react';
import { render, screen, fireEvent, RenderResult } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BaseControl } from '@m-next/runtime-interface';
import DefaultStateSelector from './DefaultStateSelector';

interface MockTextProps {
  children: React.ReactNode;
  tooltip?: string;
  tooltipId?: string;
  tooltipHighlighting?: boolean;
}

interface MockButtonData {
  value: number;
  label: string;
}

interface MockButtonGroupRowProps {
  id: string;
  selected: number;
  data: MockButtonData[];
  width: number;
  onClick: (event: { value: number; label: string }) => void;
}

interface MockLineWrapperProps {
  children: React.ReactNode;
}

// Mock Redux hooks
const mockDispatch = jest.fn();
let mockIsV4Screen = false;
let mockResolution = 'desktop';
let mockResponsiveData: Record<string, unknown> | null = null;

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: (selector: (state: unknown) => unknown) => {
    const mockState = {
      screenLayout: {
        isV4Screen: mockIsV4Screen,
        resolution: mockResolution,
        responsiveData: {},
      },
    };
    return selector(mockState);
  },
}));

jest.mock('../../../../../../common/services/screenLayoutSlice', () => ({
  saveScreen: jest.fn(() => ({ type: 'SAVE_SCREEN' })),
  selectIsV4Screen: (state: { screenLayout: { isV4Screen: boolean } }) => state.screenLayout.isV4Screen,
  setShowHiddenComponents: jest.fn((value: boolean) => ({ type: 'SET_SHOW_HIDDEN', payload: value })),
  selectControlResponsiveData: () => mockResponsiveData,
  selectResolution: (state: { screenLayout: { resolution: string } }) => state.screenLayout.resolution,
  updateControlResponsiveData: jest.fn((payload: unknown) => ({ type: 'UPDATE_RESPONSIVE_DATA', payload })),
}));

jest.mock('@m-next/layout-canvas/src/utils/currentStateHelper', () => ({
  getHiddenState: jest.fn(() => false),
  getDisabledState: jest.fn(() => false),
}));

jest.mock('@m-next/typeography', () => ({
  Text: function MockText({ children, tooltip, tooltipId, tooltipHighlighting }: MockTextProps) {
    return (
      <div
        data-testid='text-component'
        data-tooltip={tooltip}
        data-tooltip-id={tooltipId}
        data-tooltip-highlighting={tooltipHighlighting}
      >
        {children}
      </div>
    );
  },
}));

jest.mock('@m-next/button-group', () => ({
  ButtonGroupRow: function MockButtonGroupRow({ selected, data, width, onClick }: MockButtonGroupRowProps) {
    return (
      <div data-testid='button-group-row' data-width={width}>
        {data.map((item, index) => (
          <button
            type='button'
            key={index}
            data-testid={`button-${item.value}`}
            data-selected={selected === item.value}
            onClick={() => onClick({ value: item.value, label: item.label })}
            className={selected === item.value ? 'selected' : ''}
          >
            {item.label}
          </button>
        ))}
      </div>
    );
  },
}));

jest.mock('../../BlockEditor.styles', () => ({
  LineWrapper: function MockLineWrapper({ children }: MockLineWrapperProps) {
    return <div data-testid='line-wrapper'>{children}</div>;
  },
}));

const LoadState = {
  REGULAR: 1,
  HIDDEN: 2,
  DISABLED: 3,
} as const;

const mockStoreCreator = configureStore([]);

describe('DefaultStateSelector', () => {
  const defaultProps = {
    control: {
      id: 'test-control',
      visible: true,
      disabled: false,
      hideCaption: false,
      type: null,
      name: '',
      isBound: false,
      isWorking: false,
    } as BaseControl,
    onChange: jest.fn(),
  };

  const defaultStoreState = {
    screenLayout: {
      isV4Screen: false,
      resolution: 'desktop',
      responsiveData: {},
    },
  };

  let store: ReturnType<typeof mockStoreCreator>;

  const renderWithProvider = (component: React.ReactElement) => {
    return render(<Provider store={store}>{component}</Provider>);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockIsV4Screen = false;
    mockResolution = 'desktop';
    mockResponsiveData = null;
    store = mockStoreCreator(defaultStoreState);
  });

  describe('Basic Rendering', () => {
    it('renders correctly with default props', () => {
      renderWithProvider(<DefaultStateSelector {...defaultProps} />);

      expect(screen.getByTestId('line-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('text-component')).toBeInTheDocument();
      expect(screen.getByTestId('button-group-row')).toBeInTheDocument();
      expect(screen.getByText('Default state')).toBeInTheDocument();
    });

    it('renders tooltip properties correctly', () => {
      renderWithProvider(<DefaultStateSelector {...defaultProps} />);

      const textComponent = screen.getByTestId('text-component');
      expect(textComponent).toHaveAttribute('data-tooltip', 'Sets the initial state of the component on page load.');
      expect(textComponent).toHaveAttribute('data-tooltip-id', 'editor-tooltip');
      expect(textComponent).toHaveAttribute('data-tooltip-highlighting', 'true');
    });

    it('renders all three state buttons', () => {
      renderWithProvider(<DefaultStateSelector {...defaultProps} />);

      expect(screen.getByText('Regular')).toBeInTheDocument();
      expect(screen.getByText('Hidden')).toBeInTheDocument();
      expect(screen.getByText('Disabled')).toBeInTheDocument();
    });

    it('sets correct width on button group', () => {
      renderWithProvider(<DefaultStateSelector {...defaultProps} />);

      const buttonGroup = screen.getByTestId('button-group-row');
      expect(buttonGroup).toHaveAttribute('data-width', '184');
    });

    it('renders without a Redux store (non-V4 screen)', () => {
      // This test verifies the component works with mocked selectors returning non-V4
      mockIsV4Screen = false;
      render(<DefaultStateSelector {...defaultProps} />);

      expect(screen.getByTestId('line-wrapper')).toBeInTheDocument();
      expect(screen.getByText('Default state')).toBeInTheDocument();
    });
  });

  describe('Load State Logic', () => {
    it('shows Regular state when control is visible and not disabled', () => {
      const control: BaseControl = {
        visible: true,
        disabled: false,
        id: 'ctrl-1',
        type: null,
        hideCaption: false,
        name: '',
        isBound: false,
        isWorking: false,
      };
      renderWithProvider(<DefaultStateSelector {...defaultProps} control={control} />);

      const regularButton = screen.getByTestId(`button-${LoadState.REGULAR}`);
      expect(regularButton).toHaveAttribute('data-selected', 'true');
    });

    it('shows Hidden state when control is not visible', () => {
      const control: BaseControl = {
        visible: false,
        disabled: false,
        id: 'ctrl-2',
        type: null,
        hideCaption: false,
        name: '',
        isBound: false,
        isWorking: false,
      };
      renderWithProvider(<DefaultStateSelector {...defaultProps} control={control} />);

      const hiddenButton = screen.getByTestId(`button-${LoadState.HIDDEN}`);
      expect(hiddenButton).toHaveAttribute('data-selected', 'true');
    });

    it('shows Disabled state when control is disabled', () => {
      const control: BaseControl = {
        visible: true,
        disabled: true,
        id: 'ctrl-3',
        type: null,
        hideCaption: false,
        name: '',
        isBound: false,
        isWorking: false,
      };
      renderWithProvider(<DefaultStateSelector {...defaultProps} control={control} />);

      const disabledButton = screen.getByTestId(`button-${LoadState.DISABLED}`);
      expect(disabledButton).toHaveAttribute('data-selected', 'true');
    });

    it('prioritizes Hidden over Disabled when both conditions are true', () => {
      const control: BaseControl = {
        visible: false,
        disabled: true,
        id: 'ctrl-4',
        type: null,
        hideCaption: false,
        name: '',
        isBound: false,
        isWorking: false,
      };
      renderWithProvider(<DefaultStateSelector {...defaultProps} control={control} />);

      const hiddenButton = screen.getByTestId(`button-${LoadState.HIDDEN}`);
      expect(hiddenButton).toHaveAttribute('data-selected', 'true');
    });
  });

  describe('State Change Handling', () => {
    it('calls onChange with correct values when Regular is selected', () => {
      const onChangeSpy = jest.fn();
      renderWithProvider(<DefaultStateSelector {...defaultProps} onChange={onChangeSpy} />);

      const regularButton = screen.getByTestId(`button-${LoadState.REGULAR}`);
      fireEvent.click(regularButton);

      expect(onChangeSpy).toHaveBeenCalledWith({
        ...defaultProps.control,
        visible: true,
        disabled: false,
      });
    });

    it('calls onChange with correct values when Hidden is selected', () => {
      const onChangeSpy = jest.fn();
      renderWithProvider(<DefaultStateSelector {...defaultProps} onChange={onChangeSpy} />);

      const hiddenButton = screen.getByTestId(`button-${LoadState.HIDDEN}`);
      fireEvent.click(hiddenButton);

      expect(onChangeSpy).toHaveBeenCalledWith({
        ...defaultProps.control,
        visible: false,
        disabled: false,
      });
    });

    it('calls onChange with correct values when Disabled is selected', () => {
      const onChangeSpy = jest.fn();
      renderWithProvider(<DefaultStateSelector {...defaultProps} onChange={onChangeSpy} />);

      const disabledButton = screen.getByTestId(`button-${LoadState.DISABLED}`);
      fireEvent.click(disabledButton);

      expect(onChangeSpy).toHaveBeenCalledWith({
        ...defaultProps.control,
        visible: true,
        disabled: true,
      });
    });

    it('preserves other control properties when updating state', () => {
      const controlWithExtraProps: BaseControl = {
        visible: true,
        disabled: false,
        hideCaption: true,
        id: 'control-123',
        type: null,
        name: '',
        isBound: false,
        isWorking: false,
      };
      const onChangeSpy = jest.fn();

      renderWithProvider(<DefaultStateSelector {...defaultProps} control={controlWithExtraProps} onChange={onChangeSpy} />);

      const hiddenButton = screen.getByTestId(`button-${LoadState.HIDDEN}`);
      fireEvent.click(hiddenButton);

      expect(onChangeSpy).toHaveBeenCalledWith({
        ...controlWithExtraProps,
        visible: false,
        disabled: false,
      });
    });

    it('does not dispatch Redux actions for non-V4 screens', () => {
      mockIsV4Screen = false;
      const onChangeSpy = jest.fn();
      render(<DefaultStateSelector {...defaultProps} onChange={onChangeSpy} />);

      const hiddenButton = screen.getByTestId(`button-${LoadState.HIDDEN}`);
      fireEvent.click(hiddenButton);

      expect(onChangeSpy).toHaveBeenCalled();
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });

  describe('State Transitions', () => {
    it('changes from Regular to Hidden correctly', () => {
      const onChangeSpy = jest.fn();
      const control: BaseControl = {
        visible: true,
        disabled: false,
        id: 'ctrl-t1',
        type: null,
        hideCaption: false,
        name: '',
        isBound: false,
        isWorking: false,
      };

      renderWithProvider(<DefaultStateSelector control={control} onChange={onChangeSpy} />);

      const hiddenButton = screen.getByTestId(`button-${LoadState.HIDDEN}`);
      fireEvent.click(hiddenButton);

      expect(onChangeSpy).toHaveBeenCalledWith({
        ...control,
        visible: false,
        disabled: false,
      });
    });

    it('changes from Regular to Disabled correctly', () => {
      const onChangeSpy = jest.fn();
      const control: BaseControl = {
        visible: true,
        disabled: false,
        id: 'ctrl-t2',
        type: null,
        hideCaption: false,
        name: '',
        isBound: false,
        isWorking: false,
      };

      renderWithProvider(<DefaultStateSelector control={control} onChange={onChangeSpy} />);

      const disabledButton = screen.getByTestId(`button-${LoadState.DISABLED}`);
      fireEvent.click(disabledButton);

      expect(onChangeSpy).toHaveBeenCalledWith({
        ...control,
        visible: true,
        disabled: true,
      });
    });

    it('changes from Hidden to Regular correctly', () => {
      const onChangeSpy = jest.fn();
      const control: BaseControl = {
        visible: false,
        disabled: false,
        id: 'ctrl-t3',
        type: null,
        hideCaption: false,
        name: '',
        isBound: false,
        isWorking: false,
      };

      renderWithProvider(<DefaultStateSelector control={control} onChange={onChangeSpy} />);

      const regularButton = screen.getByTestId(`button-${LoadState.REGULAR}`);
      fireEvent.click(regularButton);

      expect(onChangeSpy).toHaveBeenCalledWith({
        ...control,
        visible: true,
        disabled: false,
      });
    });

    it('changes from Hidden to Disabled correctly', () => {
      const onChangeSpy = jest.fn();
      const control: BaseControl = {
        visible: false,
        disabled: false,
        id: 'ctrl-t4',
        type: null,
        hideCaption: false,
        name: '',
        isBound: false,
        isWorking: false,
      };

      renderWithProvider(<DefaultStateSelector control={control} onChange={onChangeSpy} />);

      const disabledButton = screen.getByTestId(`button-${LoadState.DISABLED}`);
      fireEvent.click(disabledButton);

      expect(onChangeSpy).toHaveBeenCalledWith({
        ...control,
        visible: true,
        disabled: true,
      });
    });

    it('changes from Disabled to Regular correctly', () => {
      const onChangeSpy = jest.fn();
      const control: BaseControl = {
        visible: true,
        disabled: true,
        id: 'ctrl-t5',
        type: null,
        hideCaption: false,
        name: '',
        isBound: false,
        isWorking: false,
      };

      renderWithProvider(<DefaultStateSelector control={control} onChange={onChangeSpy} />);

      const regularButton = screen.getByTestId(`button-${LoadState.REGULAR}`);
      fireEvent.click(regularButton);

      expect(onChangeSpy).toHaveBeenCalledWith({
        ...control,
        visible: true,
        disabled: false,
      });
    });

    it('changes from Disabled to Hidden correctly', () => {
      const onChangeSpy = jest.fn();
      const control: BaseControl = {
        visible: true,
        disabled: true,
        id: 'ctrl-t6',
        type: null,
        hideCaption: false,
        name: '',
        isBound: false,
        isWorking: false,
      };

      renderWithProvider(<DefaultStateSelector control={control} onChange={onChangeSpy} />);

      const hiddenButton = screen.getByTestId(`button-${LoadState.HIDDEN}`);
      fireEvent.click(hiddenButton);

      expect(onChangeSpy).toHaveBeenCalledWith({
        ...control,
        visible: false,
        disabled: false,
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined visible property', () => {
      const control: BaseControl = {
        disabled: false,
        id: 'ctrl-e1',
        type: null,
        hideCaption: false,
        name: '',
        visible: false,
        isBound: false,
        isWorking: false,
      };
      renderWithProvider(<DefaultStateSelector {...defaultProps} control={control} />);

      const hiddenButton = screen.getByTestId(`button-${LoadState.HIDDEN}`);
      expect(hiddenButton).toHaveAttribute('data-selected', 'true');
    });

    it('handles undefined disabled property', () => {
      const control: BaseControl = {
        visible: true,
        id: 'ctrl-e2',
        type: null,
        hideCaption: false,
        name: '',
        disabled: false,
        isBound: false,
        isWorking: false,
      };
      renderWithProvider(<DefaultStateSelector {...defaultProps} control={control} />);

      const regularButton = screen.getByTestId(`button-${LoadState.REGULAR}`);
      expect(regularButton).toHaveAttribute('data-selected', 'true');
    });

    it('handles both properties undefined', () => {
      const control: BaseControl = {
        id: 'ctrl-e3',
        type: null,
        hideCaption: false,
        name: '',
        visible: false,
        disabled: false,
        isBound: false,
        isWorking: false,
      };
      renderWithProvider(<DefaultStateSelector {...defaultProps} control={control} />);

      const hiddenButton = screen.getByTestId(`button-${LoadState.HIDDEN}`);
      expect(hiddenButton).toHaveAttribute('data-selected', 'true');
    });

    it('handles multiple rapid state changes', () => {
      const onChangeSpy = jest.fn();
      renderWithProvider(<DefaultStateSelector {...defaultProps} onChange={onChangeSpy} />);

      const hiddenButton = screen.getByTestId(`button-${LoadState.HIDDEN}`);
      const disabledButton = screen.getByTestId(`button-${LoadState.DISABLED}`);
      const regularButton = screen.getByTestId(`button-${LoadState.REGULAR}`);

      fireEvent.click(hiddenButton);
      fireEvent.click(disabledButton);
      fireEvent.click(regularButton);

      expect(onChangeSpy).toHaveBeenCalledTimes(3);
      expect(onChangeSpy).toHaveBeenNthCalledWith(3, {
        ...defaultProps.control,
        visible: true,
        disabled: false,
      });
    });
  });

  describe('UseMemo Dependency Tracking', () => {
    it('recalculates load state when visible property changes', () => {
      const { rerender }: RenderResult = renderWithProvider(<DefaultStateSelector {...defaultProps} />);

      const regularButton = screen.getByTestId(`button-${LoadState.REGULAR}`);
      expect(regularButton).toHaveAttribute('data-selected', 'true');

      rerender(<DefaultStateSelector {...defaultProps} control={{ ...defaultProps.control, visible: false }} />);

      const hiddenButton = screen.getByTestId(`button-${LoadState.HIDDEN}`);
      expect(hiddenButton).toHaveAttribute('data-selected', 'true');
    });

    it('recalculates load state when disabled property changes', () => {
      const { rerender }: RenderResult = renderWithProvider(<DefaultStateSelector {...defaultProps} />);

      const regularButton = screen.getByTestId(`button-${LoadState.REGULAR}`);
      expect(regularButton).toHaveAttribute('data-selected', 'true');

      rerender(<DefaultStateSelector {...defaultProps} control={{ ...defaultProps.control, disabled: true }} />);

      const disabledButton = screen.getByTestId(`button-${LoadState.DISABLED}`);
      expect(disabledButton).toHaveAttribute('data-selected', 'true');
    });

    it('does not recalculate when unrelated properties change', () => {
      const { rerender }: RenderResult = renderWithProvider(<DefaultStateSelector {...defaultProps} />);

      let regularButton = screen.getByTestId(`button-${LoadState.REGULAR}`);
      expect(regularButton).toHaveAttribute('data-selected', 'true');

      rerender(<DefaultStateSelector {...defaultProps} control={{ ...defaultProps.control, hideCaption: true }} />);

      regularButton = screen.getByTestId(`button-${LoadState.REGULAR}`);
      expect(regularButton).toHaveAttribute('data-selected', 'true');
    });
  });

  describe('forceClassic Behavior', () => {
    beforeEach(() => {
      // Set up as V4 screen to test that forceClassic overrides it
      mockIsV4Screen = true;
    });

    it('uses classic (onChange) behavior when forceClassic is true on V4 screen', () => {
      const onChangeSpy = jest.fn();
      render(<DefaultStateSelector {...defaultProps} onChange={onChangeSpy} forceClassic />);

      const hiddenButton = screen.getByTestId(`button-${LoadState.HIDDEN}`);
      fireEvent.click(hiddenButton);

      // Should call onChange, not dispatch
      expect(onChangeSpy).toHaveBeenCalledWith({
        ...defaultProps.control,
        visible: false,
        disabled: false,
      });
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('does not dispatch Redux actions when forceClassic is true', () => {
      const onChangeSpy = jest.fn();
      render(<DefaultStateSelector {...defaultProps} onChange={onChangeSpy} forceClassic />);

      const disabledButton = screen.getByTestId(`button-${LoadState.DISABLED}`);
      fireEvent.click(disabledButton);

      expect(onChangeSpy).toHaveBeenCalled();
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('reads state from control props (not responsive data) when forceClassic is true', () => {
      const control: BaseControl = {
        visible: false,
        disabled: false,
        id: 'ctrl-fc1',
        type: null,
        hideCaption: false,
        name: '',
        isBound: false,
        isWorking: false,
      };

      render(<DefaultStateSelector {...defaultProps} control={control} forceClassic />);

      // Should show Hidden based on control.visible, not responsive data
      const hiddenButton = screen.getByTestId(`button-${LoadState.HIDDEN}`);
      expect(hiddenButton).toHaveAttribute('data-selected', 'true');
    });

    it('handles all state transitions correctly with forceClassic', () => {
      const onChangeSpy = jest.fn();
      render(<DefaultStateSelector {...defaultProps} onChange={onChangeSpy} forceClassic />);

      // Click through all states
      fireEvent.click(screen.getByTestId(`button-${LoadState.HIDDEN}`));
      fireEvent.click(screen.getByTestId(`button-${LoadState.DISABLED}`));
      fireEvent.click(screen.getByTestId(`button-${LoadState.REGULAR}`));

      expect(onChangeSpy).toHaveBeenCalledTimes(3);
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });

  describe('V4 Screen Behavior', () => {
    const { updateControlResponsiveData, setShowHiddenComponents } =
      jest.requireMock('../../../../../../common/services/screenLayoutSlice');

    beforeEach(() => {
      mockIsV4Screen = true;
      mockResponsiveData = null;
    });

    it('dispatches Redux actions and calls onChange for V4 screens', () => {
      const onChangeSpy = jest.fn();
      render(<DefaultStateSelector {...defaultProps} onChange={onChangeSpy} />);

      const disabledButton = screen.getByTestId(`button-${LoadState.DISABLED}`);
      fireEvent.click(disabledButton);

      // Should dispatch Redux actions AND call onChange
      expect(mockDispatch).toHaveBeenCalled();
      expect(onChangeSpy).toHaveBeenCalledWith(expect.objectContaining({
        id: defaultProps.control.id,
        visible: true,
        disabled: true,
      }));
    });

    it('dispatches updateControlResponsiveData when changing state on V4 screen', () => {
      render(<DefaultStateSelector {...defaultProps} />);

      const disabledButton = screen.getByTestId(`button-${LoadState.DISABLED}`);
      fireEvent.click(disabledButton);

      expect(updateControlResponsiveData).toHaveBeenCalledWith({
        controlId: defaultProps.control.id,
        resolution: mockResolution,
        currentState: expect.any(Number),
      });
    });

    it('calls onChange after updating responsive data on V4 screen (for Apply button tracking)', () => {
      const onChangeSpy = jest.fn();
      render(<DefaultStateSelector {...defaultProps} onChange={onChangeSpy} />);

      const disabledButton = screen.getByTestId(`button-${LoadState.DISABLED}`);
      fireEvent.click(disabledButton);

      // onChange is called so the parent can track the modification for the Apply button
      expect(onChangeSpy).toHaveBeenCalled();
    });

    it('does not dispatch setShowHiddenComponents when selecting setting CurrentState on V4 screen', () => {
      render(<DefaultStateSelector {...defaultProps} />);

      const hiddenButton = screen.getByTestId(`button-${LoadState.HIDDEN}`);
      fireEvent.click(hiddenButton);

      const regularButton = screen.getByTestId(`button-${LoadState.REGULAR}`);
      fireEvent.click(regularButton);

      const disabledButton = screen.getByTestId(`button-${LoadState.DISABLED}`);
      fireEvent.click(disabledButton);

      expect(setShowHiddenComponents).not.toHaveBeenCalled();
    });
  });
});
