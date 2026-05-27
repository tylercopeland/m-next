import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ButtonEditor from './ButtonEditor';

// Mock external dependencies
jest.mock('../../../../common/rum/RumComponentContext', () => ({
  RumComponentContextProvider: ({ children }) => <div data-testid="rum-provider">{children}</div>,
}));

jest.mock('../common/components/action-list-section/ActionListSection', () => 
  function MockActionListSection({
    caption,
    values = [],
    emptyMessage,
    canAdd,
    addLabel,
    actions = [],
    onAddAction,
    valueKey,
    control,
  }) {
    // Create a values array with "Click" when a control has onClick
    const actualValues = values.length > 0 ? values : (control?.onClick ? [{ eventType: 'Click' }] : []);
    const hasClickAction = actualValues.length > 0;
    
    return (
      <div data-testid="action-list-section">
        <h3>{caption}</h3>
        {actualValues.length === 0 && <p>{emptyMessage}</p>}
        {canAdd && actions.length > 0 && !hasClickAction && (
          <button 
            onClick={() => onAddAction('onClick', 'Click')} 
            data-testid="add-action-button"
            type="button"
          >
            {addLabel}
          </button>
        )}
        <ul>
          {actualValues.map((value, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={index} data-testid={`action-value-${index}`}>
              {value[valueKey] || 'Click'}
            </li>
          ))}
        </ul>
      </div>
    );
  }
);

jest.mock('../common/components/default-state-selector/DefaultStateSelector', () => 
  function MockDefaultStateSelector({ control, onChange }) {
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

jest.mock('../common/components/caption-input/CaptionInput', () => 
  function MockCaptionInput({ id, label, value, onChange, maxLength }) {
    return (
      <div data-testid={`caption-input-${id}`}>
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value, e.target.value.toLowerCase().replace(/\s+/g, ''))}
          maxLength={maxLength}
          data-testid={`caption-input-field-${id}`}
        />
      </div>
    );
  }
);

jest.mock('../../control-classes', () => ({
  migrateButtonControl: jest.fn((control) => {
    // Mock migration that adds styles if not present
    if (!control.styles || Object.keys(control.styles).length === 0) {
      return {
        ...control,
        styles: {
          variant: 'primary',
          color: 'blue',
        },
      };
    }
    return null; // No migration needed
  }),
}));

// Mock icon list
jest.mock('@m-next/svg-icon', () => ({
  iconList: () => [
    { value: 'add-circle-v4', label: 'Add circle' },
    { value: 'edit', label: 'Edit' },
    { value: 'delete', label: 'Delete' },
    { value: 'save', label: 'Save' },
    { value: 'cancel', label: 'Cancel' },
  ],
}));

// Mock ColorSelector
jest.mock('../../../../components/addable-list/component-selectors/ColorSelector', () => 
  function MockColorSelector({ id, value, onChange }) {
    const colors = ['blue', 'red', 'green', 'yellow', 'purple'];
    return (
      <div data-testid={`color-selector-${id}`}>
        <select 
          value={value || 'blue'} 
          onChange={(e) => onChange(e.target.value)}
          data-testid={`color-selector-dropdown-${id}`}
        >
          {colors.map(color => (
            <option key={color} value={color}>{color}</option>
          ))}
        </select>
      </div>
    );
  }
);

// Mock Dropdown component
jest.mock('@m-next/dropdown', () => 
  function MockDropdown({ id, options, value, onChange, ariaLabel }) {
    return (
      <div data-testid={`dropdown-${id}`}>
        <select 
          value={value?.value || ''}
          onChange={(e) => {
            const selected = options.find(opt => opt.value === e.target.value);
            if (selected) onChange(selected);
          }}
          aria-label={ariaLabel}
          data-testid={`dropdown-select-${id}`}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

// Mock ButtonGroupRow
jest.mock('@m-next/button-group', () => ({
  ButtonGroupRow: function MockButtonGroupRow({ id, selected, data, onClick }) {
    return (
      <div data-testid={`button-group-${id}`}>
        {data.map(item => (
          <button
            key={item.value}
            type="button"
            onClick={() => onClick(item)}
            data-testid={`button-group-option-${item.value}`}
            className={selected === item.value ? 'selected' : ''}
          >
            {item.label}
          </button>
        ))}
      </div>
    );
  },
}));

// Mock Accordion
jest.mock('../../../../components/accordion/Accordion', () => 
  function MockAccordion({ id, caption, children, open }) {
    return (
      <div data-testid={`accordion-${id}`} className={open ? 'open' : 'closed'}>
        <h2>{caption}</h2>
        <div>{children}</div>
      </div>
    );
  }
);

describe('ButtonEditor', () => {
  const defaultControl = {
    id: 'btn-1',
    caption: 'Test Button',
    hideCaption: false,
    name: 'testButton',
    visible: true,
    disabled: false,
    icon: null,
    iconAlign: 'left',
    onClick: '',
    styles: {
      variant: 'primary',
      color: 'blue',
    },
  };

  const defaultProps = {
    rawControl: defaultControl,
    onChange: jest.fn(),
    onAddAction: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });
/*
  describe('Snapshots', () => {
    it('should match snapshot with default props', () => {
      const { container } = render(<ButtonEditor {...defaultProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with icon and text style', () => {
      const controlWithIcon = {
        ...defaultControl,
        icon: 'mi-icon-save',
        hideCaption: false,
      };
      const { container } = render(<ButtonEditor {...defaultProps} rawControl={controlWithIcon} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with icon only style', () => {
      const controlIconOnly = {
        ...defaultControl,
        icon: 'mi-icon-save',
        hideCaption: true,
      };
      const { container } = render(<ButtonEditor {...defaultProps} rawControl={controlIconOnly} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
*/
  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<ButtonEditor {...defaultProps} />);
      
      expect(screen.getByText('Editing the base configuration and styles of the button.')).toBeInTheDocument();
      expect(screen.getByTestId('accordion-display')).toBeInTheDocument();
    });

    it('should render display accordion with all form fields', () => {
      render(<ButtonEditor {...defaultProps} />);
      
      expect(screen.getByText('Display')).toBeInTheDocument();
      expect(screen.getByText('Variant')).toBeInTheDocument();
      expect(screen.getByText('Color')).toBeInTheDocument();
      expect(screen.getByText('Button style')).toBeInTheDocument();
    });

    it('should render events section', () => {
      render(<ButtonEditor {...defaultProps} />);
      
      expect(screen.getByTestId('action-list-section')).toBeInTheDocument();
      expect(screen.getByText('Events')).toBeInTheDocument();
    });
  });

  describe('Button Style Handling', () => {
    it('should show text style by default when no icon', () => {
      const controlWithoutIcon = { ...defaultControl, icon: null };
      render(<ButtonEditor {...defaultProps} rawControl={controlWithoutIcon} />);
      
      // Text button should be selected
      expect(screen.getByTestId('button-group-option-0')).toHaveClass('selected');
      
      // Should show caption input for text style
      expect(screen.getByTestId('caption-input-label')).toBeInTheDocument();
      
      // Should not show icon dropdown
      expect(screen.queryByTestId('dropdown-icon')).not.toBeInTheDocument();
    });

    it('should show both style when control has icon and caption', () => {
      const controlWithIconAndCaption = { 
        ...defaultControl, 
        icon: 'mi-icon-save',
        hideCaption: false,
      };
      render(<ButtonEditor {...defaultProps} rawControl={controlWithIconAndCaption} />);
      
      // Both button should be selected (value 2)
      expect(screen.getByTestId('button-group-option-2')).toHaveClass('selected');
      
      // Should show caption input
      expect(screen.getByTestId('caption-input-label')).toBeInTheDocument();
      
      // Should show icon dropdown
      expect(screen.getByTestId('dropdown-icon')).toBeInTheDocument();
      
      // Should show icon position selector
      expect(screen.getByText('Icon position')).toBeInTheDocument();
    });

    it('should show icon style when control has icon but hidden caption', () => {
      const controlIconOnly = { 
        ...defaultControl, 
        icon: 'mi-icon-save',
        hideCaption: true,
      };
      render(<ButtonEditor {...defaultProps} rawControl={controlIconOnly} />);
      
      // Icon button should be selected (value 1)
      expect(screen.getByTestId('button-group-option-1')).toHaveClass('selected');
      
      // Should not show caption input
      expect(screen.queryByTestId('caption-input-label')).not.toBeInTheDocument();
      
      // Should show icon dropdown
      expect(screen.getByTestId('dropdown-icon')).toBeInTheDocument();
      
      // Should not show icon position selector for icon-only
      expect(screen.queryByText('Icon position')).not.toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should handle variant change', () => {
      render(<ButtonEditor {...defaultProps} />);
      
      const secondaryButton = screen.getByTestId('button-group-option-secondary');
      fireEvent.click(secondaryButton);
      
      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          styles: expect.objectContaining({
            variant: 'secondary',
          }),
        })
      );
    });

    it('should handle color change', () => {
      render(<ButtonEditor {...defaultProps} />);
      
      const colorDropdown = screen.getByTestId('color-selector-dropdown-color');
      fireEvent.change(colorDropdown, { target: { value: 'red' } });
      
      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          styles: expect.objectContaining({
            color: 'red',
          }),
        })
      );
    });

    it('should handle button style change to text', () => {
      const controlWithIcon = { 
        ...defaultControl, 
        icon: 'mi-icon-save',
        hideCaption: false,
      };
      render(<ButtonEditor {...defaultProps} rawControl={controlWithIcon} />);
      
      const textButton = screen.getByTestId('button-group-option-0');
      fireEvent.click(textButton);
      
      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: null,
          hideCaption: false,
        })
      );
    });

    it('should handle button style change to icon only', () => {
      render(<ButtonEditor {...defaultProps} />);
      
      const iconButton = screen.getByTestId('button-group-option-1');
      fireEvent.click(iconButton);
      
      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'add-circle-v4', // default icon
          hideCaption: true,
        })
      );
    });

    it('should handle button style change to both', () => {
      render(<ButtonEditor {...defaultProps} />);
      
      const bothButton = screen.getByTestId('button-group-option-2');
      fireEvent.click(bothButton);
      
      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'add-circle-v4', // default icon
          hideCaption: false,
        })
      );
    });

    it('should handle icon change', () => {
      const controlWithIcon = { 
        ...defaultControl, 
        icon: 'mi-icon-save',
        hideCaption: false,
      };
      render(<ButtonEditor {...defaultProps} rawControl={controlWithIcon} />);
      
      const iconDropdown = screen.getByTestId('dropdown-select-icon');
      fireEvent.change(iconDropdown, { target: { value: 'edit' } });
      
      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'edit',
        })
      );
    });

    it('should handle icon position change', () => {
      const controlWithBothIconAndText = { 
        ...defaultControl, 
        icon: 'mi-icon-save',
        hideCaption: false,
      };
      render(<ButtonEditor {...defaultProps} rawControl={controlWithBothIconAndText} />);
      
      const rightPositionButton = screen.getByTestId('button-group-option-right');
      fireEvent.click(rightPositionButton);
      
      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          iconAlign: 'right',
        })
      );
    });

    it('should handle caption change', () => {
      render(<ButtonEditor {...defaultProps} />);
      
      const captionInput = screen.getByTestId('caption-input-field-label');
      fireEvent.change(captionInput, { target: { value: 'New Caption' } });
      
      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          caption: 'New Caption',
          name: 'newcaption',
        })
      );
    });

    it('should handle default state changes', () => {
      render(<ButtonEditor {...defaultProps} />);
      
      const hiddenButton = screen.getByTestId('hidden-button');
      fireEvent.click(hiddenButton);
      
      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          visible: false,
          disabled: false,
        })
      );
    });
  });

  describe('Events Section', () => {
    it('should show empty message when no click action', () => {
      render(<ButtonEditor {...defaultProps} />);
      
      expect(screen.getByText('No button events applied')).toBeInTheDocument();
    });

    it('should show add button when no click action exists', () => {
      render(<ButtonEditor {...defaultProps} />);
      
      expect(screen.getByTestId('add-action-button')).toBeInTheDocument();
      expect(screen.getByText('Add click')).toBeInTheDocument();
    });

    it('should handle adding new click action', () => {
      render(<ButtonEditor {...defaultProps} />);
      
      const addButton = screen.getByTestId('add-action-button');
      fireEvent.click(addButton);
      
      expect(defaultProps.onAddAction).toHaveBeenCalledWith(
        expect.objectContaining({
          onClick: expect.any(String),
        }),
        'Click'
      );
    });

    it('should display existing click action', () => {
      const controlWithAction = {
        ...defaultControl,
        onClick: '12345-67890-abcdef',
      };
      render(<ButtonEditor {...defaultProps} rawControl={controlWithAction} />);
      
      expect(screen.getByTestId('action-value-0')).toHaveTextContent('Click');
      expect(screen.queryByTestId('add-action-button')).not.toBeInTheDocument();
    });
  });

  describe('Control Migration', () => {
    it('should apply migration to legacy control', () => {
      const legacyControl = {
        id: 'legacy-btn',
        caption: 'Legacy Button',
        classes: 'button-primary mi-color-white',
        // No styles object
      };
      
      render(<ButtonEditor {...defaultProps} rawControl={legacyControl} />);
      
      // Should have migrated the control with default styles
      expect(screen.getByTestId('button-group-option-primary')).toHaveClass('selected');
    });

    it('should not migrate control that already has styles', () => {
      const modernControl = {
        ...defaultControl,
        styles: {
          variant: 'secondary',
          color: 'red',
        },
      };
      
      render(<ButtonEditor {...defaultProps} rawControl={modernControl} />);
      
      // Should use existing styles
      expect(screen.getByTestId('button-group-option-secondary')).toHaveClass('selected');
    });
  });

  describe('Icon Handling', () => {
    it('should handle missing icon gracefully', () => {
      const controlWithInvalidIcon = {
        ...defaultControl,
        icon: 'mi-icon-nonexistent',
        hideCaption: false,
      };
      
      render(<ButtonEditor {...defaultProps} rawControl={controlWithInvalidIcon} />);
      
      // Should fallback to default icon
      const iconDropdown = screen.getByTestId('dropdown-select-icon');
      expect(iconDropdown.value).toBe('add-circle-v4');
    });

    it('should preserve previous icon when switching back to icon style', () => {
      render(<ButtonEditor {...defaultProps} />);
      
      // First, set an icon by switching to both style
      const bothButton = screen.getByTestId('button-group-option-2');
      fireEvent.click(bothButton);
      
      // Change the icon
      const iconDropdown = screen.getByTestId('dropdown-select-icon');
      fireEvent.change(iconDropdown, { target: { value: 'save' } });
      
      // Switch to text style (removes icon)
      const textButton = screen.getByTestId('button-group-option-0');
      fireEvent.click(textButton);
      
      // Switch back to icon style - should use the previous icon
      const iconButtonAgain = screen.getByTestId('button-group-option-1');
      fireEvent.click(iconButtonAgain);
      
      expect(defaultProps.onChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          icon: 'save', // Should remember the previous icon
          hideCaption: true,
        })
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined rawControl', () => {
      render(<ButtonEditor {...defaultProps} rawControl={undefined} />);
      
      expect(screen.getByText('Editing the base configuration and styles of the button.')).toBeInTheDocument();
      // Should use default control values
      expect(screen.getByTestId('caption-input-field-label')).toHaveValue('Button');
    });

    it('should handle empty onClick string', () => {
      const controlWithEmptyOnClick = {
        ...defaultControl,
        onClick: '',
      };
      
      render(<ButtonEditor {...defaultProps} rawControl={controlWithEmptyOnClick} />);
      
      expect(screen.getByTestId('add-action-button')).toBeInTheDocument();
    });

    it('should handle icon position edge cases', () => {
      const controlWithInvalidPosition = {
        ...defaultControl,
        icon: 'mi-icon-save',
        iconAlign: undefined,
        hideCaption: false,
      };
      
      render(<ButtonEditor {...defaultProps} rawControl={controlWithInvalidPosition} />);
      
      // Should default to left position
      expect(screen.getByTestId('button-group-option-left')).toHaveClass('selected');
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria labels', () => {
      const controlWithIcon = { 
        ...defaultControl, 
        icon: 'mi-icon-save',
        hideCaption: false,
      };
      
      render(<ButtonEditor {...defaultProps} rawControl={controlWithIcon} />);
      
      const iconDropdown = screen.getByTestId('dropdown-select-icon');
      expect(iconDropdown).toHaveAttribute('aria-label', 'Icon');
    });

    it('should have proper form labels', () => {
      render(<ButtonEditor {...defaultProps} />);
      
      expect(screen.getByText('Variant')).toBeInTheDocument();
      expect(screen.getByText('Color')).toBeInTheDocument();
      expect(screen.getByText('Button style')).toBeInTheDocument();
    });
  });
});