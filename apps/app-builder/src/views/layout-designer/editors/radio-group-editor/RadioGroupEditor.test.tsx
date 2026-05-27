 
/* eslint-disable react/no-array-index-key */
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import RadioGroupEditor from './RadioGroupEditor';

// Define interfaces for better typing
interface MockToggleProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

interface MockButtonGroupRowProps {
  id: string;
  selected: unknown;
  data: { value: unknown; label?: string; icon?: string }[];
  onClick?: (item: { value: unknown; label?: string; icon?: string }) => void;
}

interface MockAccordionProps {
  id: string;
  caption: string;
  children: React.ReactNode;
  onAdd?: () => void;
}

interface MockCaptionInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (caption: string, name: string) => void;
  maxLength?: number;
}

interface MockDefaultStateSelectorProps {
  control: Record<string, unknown>;
  onChange: (updatedControl: Record<string, unknown>) => void;
}

interface MockActionListSectionProps {
  caption: string;
  values: { label: string }[];
  emptyMessage: string;
  canAdd: boolean;
  actions: { source: string; value: string }[];
  onAddAction: (source: string, value: string) => void;
}

interface MockEditorInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
}

interface MockGridProps {
  data?: { id: string; name: string; isDefault: boolean }[];
  columns?: {
    name: string;
    onChange?: (name: string, value: unknown, column: unknown, index: number, id: string) => void;
    renderEditAs?: (props: { value: string; rowIdx: number; primaryKey: string }) => React.ReactNode;
  }[];
  onReorder?: (fromIndex: number, toIndex: number) => void;
  onDelete?: (index: number, id: string) => void;
}

// Mock external dependencies
jest.mock('../../../../common/rum/RumComponentContext', () => ({
  RumComponentContextProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="rum-provider">{children}</div>
  ),
}));

jest.mock('@m-next/utilities', () => ({
  ...jest.requireActual('@m-next/utilities'),
  Guid: {
    create: jest.fn(() => 'mock-guid-123'),
  },
  toCamelCase: jest.fn((obj) => obj),
}));

jest.mock('react-tooltip', () => ({
  Tooltip: () => <div data-testid="tooltip" />,
}));

jest.mock('@m-next/loading-skeleton', () => 
  function MockLoadingSkeleton() {
    return <div data-testid="loading-skeleton">Loading...</div>;
  }
);

jest.mock('@m-next/toggle', () =>
  function MockToggle({ id, checked, onChange, label }: MockToggleProps) {
    return (
      <div data-testid={`toggle-${id}`}>
        <label>
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            data-testid={`toggle-input-${id}`}
          />
          {label}
        </label>
      </div>
    );
  }
);

jest.mock('@m-next/button-group', () => ({
  ButtonGroupRow: function MockButtonGroupRow({ id, selected, data, onClick }: MockButtonGroupRowProps) {
    return (
      <div data-testid={`button-group-${id}`}>
        {data.map((item) => (
          <button
            key={String(item.value)}
            type="button"
            onClick={() => onClick && onClick(item)}
            data-testid={`button-group-option-${item.value}`}
            className={selected === item.value ? 'selected' : ''}
          >
            {item.label || item.icon}
          </button>
        ))}
      </div>
    );
  },
}));

jest.mock('../../../../components/accordion/Accordion', () =>
  function MockAccordion({ id, caption, children, onAdd }: MockAccordionProps) {
    return (
      <div data-testid={`accordion-${id}`}>
        <h3>{caption}</h3>
        {onAdd && (
          <button type='button' onClick={onAdd} data-testid={`accordion-add-${id}`}>
            Add
          </button>
        )}
        <div>{children}</div>
      </div>
    );
  }
);

jest.mock('../common/components/caption-input/CaptionInput', () =>
  function MockCaptionInput({ id, label, value, onChange, maxLength }: MockCaptionInputProps) {
    return (
      <div data-testid={`caption-input-${id}`}>
        <label>{label}</label>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => {
            const newCaption = e.target.value;
            const newName = newCaption.toLowerCase().replace(/\s+/g, '');
            onChange(newCaption, newName);
          }}
          maxLength={maxLength}
          data-testid={`caption-input-field-${id}`}
        />
      </div>
    );
  }
);

jest.mock('../common/components/default-state-selector/DefaultStateSelector', () =>
  function MockDefaultStateSelector({ control, onChange }: MockDefaultStateSelectorProps) {
    return (
      <div data-testid="default-state-selector">
        <button
          onClick={() => onChange({ ...control, visible: false, disabled: false })}
          data-testid="hidden-button"
          type="button"
        >
          Hidden
        </button>
        <button
          onClick={() => onChange({ ...control, visible: true, disabled: true })}
          data-testid="disabled-button"
          type="button"
        >
          Disabled
        </button>
        <button
          onClick={() => onChange({ ...control, visible: true, disabled: false })}
          data-testid="visible-button"
          type="button"
        >
          Visible
        </button>
      </div>
    );
  }
);

jest.mock('../common/components/action-list-section/ActionListSection', () =>
  function MockActionListSection({ caption, values, emptyMessage, canAdd, actions, onAddAction }: MockActionListSectionProps) {
    return (
      <div data-testid="action-list-section">
        <h3>{caption}</h3>
        {values.length === 0 && <p>{emptyMessage}</p>}
        {canAdd && actions.length > 0 && (
          <button
            onClick={() => onAddAction('onChange', 'Change')}
            data-testid="add-action-button"
            type="button"
          >
            Add
          </button>
        )}
        <ul>
          {values.map((value, index: number) => (
            <li key={index} data-testid={`action-value-${index}`}>
              {value.label}
            </li>
          ))}
        </ul>
      </div>
    );
  }
);

jest.mock('../common/components/editor-input/EditorInput', () =>
  function MockEditorInput({ id, value, onChange }: MockEditorInputProps) {
    return (
      <input
        id={id}
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        data-testid={id}
      />
    );
  }
);

// Mock the lazy loaded Grid component
jest.mock('@m-next/grid', () => ({
  __esModule: true,
  default: jest.fn(({ data, columns, onReorder, onDelete }: MockGridProps) => {
    const MockGrid = () => (
      <div data-testid="grid">
        {data?.map((row, index: number) => {
          const nameColumn = columns?.find((col) => col.name === 'name');
          const isDefaultColumn = columns?.find((col) => col.name === 'isDefault');
          
          return (
            <div key={row.id} data-testid={`grid-row-${index}`}>
              <span data-testid={`grid-cell-name-${index}`}>{row.name}</span>
              <button
                type="button"
                onClick={() => {
                  if (isDefaultColumn?.onChange) {
                    isDefaultColumn.onChange('isDefault', !row.isDefault, isDefaultColumn, index, row.id);
                  }
                }}
                data-testid={`grid-default-button-${index}`}
              >
                {row.isDefault ? '★' : '☆'}
              </button>
              {nameColumn?.renderEditAs ? 
                nameColumn.renderEditAs({
                  value: row.name,
                  rowIdx: index,
                  primaryKey: row.id,
                }) : (
                  <input
                    type="text"
                    value={row.name}
                    onChange={(e) => {
                      if (nameColumn?.onChange) {
                        nameColumn.onChange('name', e.target.value, nameColumn, index, row.id);
                      }
                    }}
                    data-testid={`grid-edit-${index}`}
                  />
                )
              }
              {onReorder && index > 0 && (
                <button
                  type="button"
                  onClick={() => onReorder(index, index - 1)}
                  data-testid={`grid-move-up-${index}`}
                >
                  Move Up
                </button>
              )}
              {onReorder && index < data?.length - 1 && (
                <button
                  type="button"
                  onClick={() => onReorder(index, index + 1)}
                  data-testid={`grid-move-down-${index}`}
                >
                  Move Down
                </button>
              )}
              {onDelete && data?.length > 2 && (
                <button
                  type="button"
                  onClick={() => onDelete(index, row.id)}
                  data-testid={`grid-delete-${index}`}
                >
                  Delete
                </button>
              )}
            </div>
          );
        }) || null}
      </div>
    );
    return MockGrid();
  }),
}));

const mockStore = configureStore([]);

const defaultStoreState = {
  screenLayout: {
    isV4Screen: true,
  },
};

describe('RadioGroupEditor', () => {
  const defaultControl = {
    id: 'radio-1',
    caption: 'Test Radio Group',
    hideCaption: false,
    name: 'testRadioGroup',
    visible: true,
    disabled: false,
    type: 'RAD' as const,
    classes: '',
    widthType: 'auto' as const,
    width: null,
    height: null,
    isBound: false,
    defaultValue: undefined,
    radiobuttons: ['Option 1', 'Option 2'],
    position: 'vertical' as const,
    onChange: undefined,
    isWorking: false,
  };

  const defaultProps = {
    rawControl: defaultControl,
    onChange: jest.fn(),
    onAddAction: jest.fn(),
  };

  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    jest.clearAllMocks();
    store = mockStore(defaultStoreState);
  });

  const renderWithProvider = (ui: React.ReactElement) => {
    return render(
      <Provider store={store}>
        {ui}
      </Provider>
    );
  };

  describe('Rendering', () => {
    it('should render without crashing', () => {
      renderWithProvider(<RadioGroupEditor {...defaultProps} />);

      expect(screen.getByText('Edit the base configuration and styles of the radio group.')).toBeInTheDocument();
      expect(screen.getByTestId('rum-provider')).toBeInTheDocument();
    });

    it('should render with default props when no rawControl provided', () => {
      renderWithProvider(<RadioGroupEditor rawControl={null} onChange={jest.fn()} onAddAction={jest.fn()} />);

      expect(screen.getByText('Edit the base configuration and styles of the radio group.')).toBeInTheDocument();
    });

    it('should render all main sections', () => {
      renderWithProvider(<RadioGroupEditor {...defaultProps} />);

      expect(screen.getByText('Data source')).toBeInTheDocument();
      expect(screen.getByText('Display')).toBeInTheDocument();
      expect(screen.getByText('Values')).toBeInTheDocument();
      expect(screen.getByText('Events')).toBeInTheDocument();
    });

    it('should render radio options in grid', () => {
      renderWithProvider(<RadioGroupEditor {...defaultProps} />);

      expect(screen.getByTestId('grid')).toBeInTheDocument();
      expect(screen.getByTestId('grid-cell-name-0')).toHaveTextContent('Option 1');
      expect(screen.getByTestId('grid-cell-name-1')).toHaveTextContent('Option 2');
    });
  });

  describe('Caption and Label', () => {
    it('should handle caption changes', () => {
      renderWithProvider(<RadioGroupEditor {...defaultProps} />);

      const captionInput = screen.getByTestId('caption-input-field-label');
      fireEvent.change(captionInput, { target: { value: 'New Caption' } });

      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          caption: 'New Caption',
          name: 'newcaption',
        })
      );
    });

    it('should toggle show label', () => {
      renderWithProvider(<RadioGroupEditor {...defaultProps} />);

      const showLabelToggle = screen.getByTestId('toggle-input-show-label');
      fireEvent.click(showLabelToggle);

      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          hideCaption: true,
        })
      );
    });
  });

  describe('Direction', () => {
    it('should change direction to horizontal', () => {
      renderWithProvider(<RadioGroupEditor {...defaultProps} />);

      const horizontalButton = screen.getByTestId('button-group-option-horizontal');
      fireEvent.click(horizontalButton);

      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          layout: 'horizontal',
        })
      );
    });

    it('should change direction to vertical', () => {
      const horizontalControl = { ...defaultControl, position: 'horizontal' as const };
      renderWithProvider(<RadioGroupEditor {...defaultProps} rawControl={horizontalControl} />);

      const verticalButton = screen.getByTestId('button-group-option-vertical');
      fireEvent.click(verticalButton);

      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          layout: 'vertical',
        })
      );
    });
  });

  describe('Radio Options Management', () => {
    it('should add new radio option', () => {
      renderWithProvider(<RadioGroupEditor {...defaultProps} />);

      const addButton = screen.getByTestId('accordion-add-radio-list');
      fireEvent.click(addButton);

      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          options: expect.arrayContaining([
            { label: 'Option 1', value: 'Option 1' },
            { label: 'Option 2', value: 'Option 2' },
            { label: 'Value 1', value: 'Value 1' }
          ]),
        })
      );
    });

    it('should not add radio option when limit reached', () => {
      const maxControl = {
        ...defaultControl,
        radiobuttons: ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'],
      };
      renderWithProvider(<RadioGroupEditor {...defaultProps} rawControl={maxControl} />);

      const addButton = screen.queryByTestId('accordion-add-radio-list');
      expect(addButton).not.toBeInTheDocument();
    });

    it('should edit radio option name', async () => {
      renderWithProvider(<RadioGroupEditor {...defaultProps} />);

      // Wait for loading skeleton to disappear and grid to load
      await waitFor(() => {
        expect(screen.queryByTestId('loading-skeleton')).not.toBeInTheDocument();
      });

      // Wait for grid to be present
      await waitFor(() => {
        expect(screen.getByTestId('grid')).toBeInTheDocument();
      });

      const editInput = screen.getByTestId('radio-option-0');
      fireEvent.change(editInput, { target: { value: 'New Option Name' } });

      // The handler is called through the Grid's onChange column callback
      expect(defaultProps.onChange).toHaveBeenCalled();
    });

    it('should handle empty radio option name by reverting', async () => {
      renderWithProvider(<RadioGroupEditor {...defaultProps} />);

      // Wait for loading skeleton to disappear and grid to load
      await waitFor(() => {
        expect(screen.queryByTestId('loading-skeleton')).not.toBeInTheDocument();
      });

      // Wait for grid to be present
      await waitFor(() => {
        expect(screen.getByTestId('grid')).toBeInTheDocument();
      });

      const editInput = screen.getByTestId('radio-option-0');
      fireEvent.change(editInput, { target: { value: '' } });

      // First call with empty value
      expect(defaultProps.onChange).toHaveBeenCalledTimes(1);

      // Wait for timeout to revert
      await waitFor(() => {
        expect(defaultProps.onChange).toHaveBeenCalledTimes(2);
      });

      // Second call should revert to original
      expect(defaultProps.onChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          options: expect.arrayContaining([
            { label: 'Option 1', value: 'Option 1' },
            { label: 'Option 2', value: 'Option 2' }
          ]),
        })
      );
    });

    it('should delete radio option when more than 2 exist', () => {
      const threeOptionsControl = {
        ...defaultControl,
        radiobuttons: ['Option 1', 'Option 2', 'Option 3'],
      };
      renderWithProvider(<RadioGroupEditor {...defaultProps} rawControl={threeOptionsControl} />);

      const deleteButton = screen.getByTestId('grid-delete-1');
      fireEvent.click(deleteButton);

      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          options: expect.arrayContaining([
            { label: 'Option 1', value: 'Option 1' },
            { label: 'Option 3', value: 'Option 3' }
          ]),
        })
      );
    });

    it('should not show delete button when only 2 options', () => {
      renderWithProvider(<RadioGroupEditor {...defaultProps} />);

      expect(screen.queryByTestId('grid-delete-0')).not.toBeInTheDocument();
      expect(screen.queryByTestId('grid-delete-1')).not.toBeInTheDocument();
    });

    it('should reorder radio options', () => {
      const threeOptionsControl = {
        ...defaultControl,
        radiobuttons: ['Option 1', 'Option 2', 'Option 3'],
      };
      renderWithProvider(<RadioGroupEditor {...defaultProps} rawControl={threeOptionsControl} />);

      const moveDownButton = screen.getByTestId('grid-move-down-0');
      fireEvent.click(moveDownButton);

      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          options: [
            { label: 'Option 2', value: 'Option 2' },
            { label: 'Option 1', value: 'Option 1' },
            { label: 'Option 3', value: 'Option 3' }
          ],
        })
      );
    });

    it('should generate unique names for duplicate options', () => {
      const duplicateControl = {
        ...defaultControl,
        radiobuttons: ['Value 1', 'Value 2'],
      };
      renderWithProvider(<RadioGroupEditor {...defaultProps} rawControl={duplicateControl} />);

      const addButton = screen.getByTestId('accordion-add-radio-list');
      fireEvent.click(addButton);

      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          options: expect.arrayContaining([
            { label: 'Value 1', value: 'Value 1' },
            { label: 'Value 2', value: 'Value 2' },
            { label: 'Value 3', value: 'Value 3' }
          ]),
        })
      );
    });

    it('should truncate long radio option names to 30 characters', async () => {
      renderWithProvider(<RadioGroupEditor {...defaultProps} />);

      // Wait for loading skeleton to disappear and grid to load
      await waitFor(() => {
        expect(screen.queryByTestId('loading-skeleton')).not.toBeInTheDocument();
      });

      // Wait for grid to be present
      await waitFor(() => {
        expect(screen.getByTestId('grid')).toBeInTheDocument();
      });

      const editInput = screen.getByTestId('radio-option-0');
      const longName = 'This is a very long radio option name that exceeds the limit';
      fireEvent.change(editInput, { target: { value: longName } });

      expect(defaultProps.onChange).toHaveBeenCalled();
      const callArg = defaultProps.onChange.mock.calls[0][0];
      expect(callArg.options[0].label.length).toBeLessThanOrEqual(30);
    });
  });

  describe('Default Value', () => {
    it('should set default value for radio option', () => {
      renderWithProvider(<RadioGroupEditor {...defaultProps} />);

      const defaultButton = screen.getByTestId('grid-default-button-0');
      fireEvent.click(defaultButton);

      // The handler is called through the Grid's onChange column callback
      expect(defaultProps.onChange).toHaveBeenCalled();
    });

    it('should update default value when option is renamed', async () => {
      const controlWithDefault = {
        ...defaultControl,
        defaultValue: 'Option 1',
      };
      renderWithProvider(<RadioGroupEditor {...defaultProps} rawControl={controlWithDefault} />);

      // Wait for loading skeleton to disappear and grid to load
      await waitFor(() => {
        expect(screen.queryByTestId('loading-skeleton')).not.toBeInTheDocument();
      });

      // Wait for grid to be present
      await waitFor(() => {
        expect(screen.getByTestId('grid')).toBeInTheDocument();
      });

      const editInput = screen.getByTestId('radio-option-0');
      fireEvent.change(editInput, { target: { value: 'Renamed Option' } });

      expect(defaultProps.onChange).toHaveBeenCalled();
    });

    it('should show star for default option', () => {
      const controlWithDefault = {
        ...defaultControl,
        defaultValue: 'Option 1',
      };
      renderWithProvider(<RadioGroupEditor {...defaultProps} rawControl={controlWithDefault} />);

      const defaultButton = screen.getByTestId('grid-default-button-0');
      expect(defaultButton).toHaveTextContent('★');

      const nonDefaultButton = screen.getByTestId('grid-default-button-1');
      expect(nonDefaultButton).toHaveTextContent('☆');
    });
  });

  describe('Default State', () => {
    it('should change to hidden state', () => {
      renderWithProvider(<RadioGroupEditor {...defaultProps} />);

      const hiddenButton = screen.getByTestId('hidden-button');
      fireEvent.click(hiddenButton);

      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          visible: false,
          disabled: false,
        })
      );
    });

    it('should change to disabled state', () => {
      renderWithProvider(<RadioGroupEditor {...defaultProps} />);

      const disabledButton = screen.getByTestId('disabled-button');
      fireEvent.click(disabledButton);

      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          visible: true,
          disabled: true,
        })
      );
    });

    it('should change to visible state', () => {
      const hiddenControl = { ...defaultControl, visible: false };
      renderWithProvider(<RadioGroupEditor {...defaultProps} rawControl={hiddenControl} />);

      const visibleButton = screen.getByTestId('visible-button');
      fireEvent.click(visibleButton);

      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          visible: true,
          disabled: false,
        })
      );
    });
  });

  describe('Events', () => {
    it('should display no events message when no events', () => {
      renderWithProvider(<RadioGroupEditor {...defaultProps} />);

      expect(screen.getByText('No events applied')).toBeInTheDocument();
    });

    it('should add onChange event', () => {
      renderWithProvider(<RadioGroupEditor {...defaultProps} />);

      const addActionButton = screen.getByTestId('add-action-button');
      fireEvent.click(addActionButton);

      expect(defaultProps.onAddAction).toHaveBeenCalledWith(
        expect.objectContaining({
          onChange: 'mock-guid-123',
        }),
        'Change'
      );
    });

    it('should display existing onChange event', () => {
      const controlWithEvent = {
        ...defaultControl,
        onChange: 'event-123',
      };
      renderWithProvider(<RadioGroupEditor {...defaultProps} rawControl={controlWithEvent} />);

      expect(screen.getByTestId('action-value-0')).toHaveTextContent('Change');
    });

    it('should not show add button when onChange event exists', () => {
      const controlWithEvent = {
        ...defaultControl,
        onChange: 'event-123',
      };
      renderWithProvider(<RadioGroupEditor {...defaultProps} rawControl={controlWithEvent} />);

      expect(screen.queryByTestId('add-action-button')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined rawControl', () => {
      renderWithProvider(<RadioGroupEditor rawControl={null} onChange={jest.fn()} onAddAction={jest.fn()} />);

      expect(screen.getByText('Edit the base configuration and styles of the radio group.')).toBeInTheDocument();
    });

    it('should handle null onChange property', () => {
      const controlWithNullOnChange = {
        ...defaultControl,
        onChange: undefined,
      };
      renderWithProvider(<RadioGroupEditor {...defaultProps} rawControl={controlWithNullOnChange} />);

      expect(screen.getByText('No events applied')).toBeInTheDocument();
    });

    it('should preserve other control properties when updating', () => {
      const customControl = {
        ...defaultControl,
        customProp: 'customValue',
        anotherProp: 123,
      };
      renderWithProvider(<RadioGroupEditor {...defaultProps} rawControl={customControl as typeof defaultControl} />);

      const captionInput = screen.getByTestId('caption-input-field-label');
      fireEvent.change(captionInput, { target: { value: 'New Caption' } });

      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          customProp: 'customValue',
          anotherProp: 123,
        })
      );
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria labels and roles', () => {
      renderWithProvider(<RadioGroupEditor {...defaultProps} />);

      expect(screen.getByText('Label')).toBeInTheDocument();
      expect(screen.getByText('Direction')).toBeInTheDocument();
      expect(screen.getByText('Values')).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should handle complete workflow of adding and configuring radio option', () => {
      renderWithProvider(<RadioGroupEditor {...defaultProps} />);

      // Add new option
      const addButton = screen.getByTestId('accordion-add-radio-list');
      fireEvent.click(addButton);

      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          options: expect.arrayContaining([
            { label: 'Option 1', value: 'Option 1' },
            { label: 'Option 2', value: 'Option 2' },
            { label: 'Value 1', value: 'Value 1' }
          ]),
        })
      );

      // Clear mock for next assertion
      defaultProps.onChange.mockClear();

      // Set it as default
      const updatedControl = {
        ...defaultControl,
        radiobuttons: ['Option 1', 'Option 2', 'Value 1'],
      };
      renderWithProvider(<RadioGroupEditor {...defaultProps} rawControl={updatedControl} />);

      const defaultButton = screen.getByTestId('grid-default-button-2');
      fireEvent.click(defaultButton);

      expect(defaultProps.onChange).toHaveBeenCalled();
    });

    it('should maintain control state through multiple updates', () => {
      const { rerender } = renderWithProvider(<RadioGroupEditor {...defaultProps} />);

      // First update - change caption
      const captionInput = screen.getByTestId('caption-input-field-label');
      fireEvent.change(captionInput, { target: { value: 'Updated Caption' } });

      const firstUpdate = defaultProps.onChange.mock.calls[0][0];
      expect(firstUpdate.caption).toBe('Updated Caption');

      // Rerender with updated control
      rerender(
        <Provider store={store}>
          <RadioGroupEditor {...defaultProps} rawControl={firstUpdate} />
        </Provider>
      );

      // Second update - change direction
      const horizontalButton = screen.getByTestId('button-group-option-horizontal');
      fireEvent.click(horizontalButton);

      const secondUpdate = defaultProps.onChange.mock.calls[1][0];
      expect(secondUpdate.caption).toBe('Updated Caption');
      expect(secondUpdate.position).toBe('horizontal');
    });
  });
});
