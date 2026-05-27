/* eslint-disable react/no-array-index-key */
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { FieldTypeNames, WIDGETS } from '@m-next/runtime-interface';
import InputEditor from './InputEditor';

// Define ValidationRuleTypes constants first
const ValidationRuleTypes = {
  Required: 'required',
  MaliciousValues: 'maliciousValues',
  IsValidEmailAddress: 'isValidEmailAddress',
  MinLength: 'minLength',
  MaxLength: 'maxLength',
  LessThan: 'lessThan',
  GreaterThan: 'greaterThan',
};

// Mock Redux store
const mockStore = configureStore({
  reducer: {
    screenLayout: (
      state = {
        fields: [
          { name: 'textField', type: FieldTypeNames.Text, isRequired: true, size: 100 },
          { name: 'numberField', type: FieldTypeNames.Integer, isRequired: false },
          { name: 'decimalField', type: FieldTypeNames.Decimal, isRequired: false },
          { name: 'emailField', type: FieldTypeNames.Email, isRequired: true },
        ],
        controls: {
          'btn-1': { id: 'btn-1', type: 'Button', name: 'button1' },
          'txt-1': { id: 'txt-1', type: 'Text', name: 'text1' },
        },
        baseModel: 'Customer',
      },
    ) => state,
  },
});

// Mock external dependencies
jest.mock('../../../../common/rum/RumComponentContext', () => ({
  RumComponentContextProvider: ({ children }) => <div data-testid='rum-provider'>{children}</div>,
}));

jest.mock(
  '../../../../components/accordion/Accordion',
  () =>
    function MockAccordion({ id, caption, children, open }) {
      return (
        <div data-testid={`accordion-${id}`} className={open ? 'open' : 'closed'}>
          <h2>{caption}</h2>
          <div>{children}</div>
        </div>
      );
    },
);

jest.mock(
  '../common/components/action-list-section/ActionListSection',
  () =>
    function MockActionListSection({
      caption,
      values = [],
      emptyMessage,
      canAdd,
      addLabel,
      actions = [],
      onAddAction,
    }) {
      return (
        <div data-testid='action-list-section'>
          <h3>{caption}</h3>
          {values.length === 0 && <p>{emptyMessage}</p>}
          {canAdd && actions.length > 0 && (
            <div>
              {actions.map((action) => (
                <button
                  key={action.value}
                  onClick={() => onAddAction(action.source, action.value)}
                  data-testid={`add-action-${action.value.toLowerCase()}`}
                  type='button'
                >
                  {addLabel} {action.label}
                </button>
              ))}
            </div>
          )}
          <ul>
            {values.map((value, index) => (
              <li key={index} data-testid={`action-value-${index}`}>
                {value.label}
              </li>
            ))}
          </ul>
        </div>
      );
    },
);

jest.mock(
  '../common/components/default-state-selector/DefaultStateSelector',
  () =>
    function MockDefaultStateSelector({ control, onChange }) {
      return (
        <div data-testid='default-state-selector'>
          <button
            onClick={() => onChange({ ...control, visible: false, disabled: false })}
            data-testid='hidden-button'
            type='button'
          >
            Hidden
          </button>
          <button
            onClick={() => onChange({ ...control, visible: true, disabled: true })}
            data-testid='disabled-button'
            type='button'
          >
            Disabled
          </button>
          <button
            onClick={() => onChange({ ...control, visible: true, disabled: false })}
            data-testid='visible-button'
            type='button'
          >
            Visible
          </button>
        </div>
      );
    },
);

jest.mock(
  '../common/components/caption-input/CaptionInput',
  () =>
    function MockCaptionInput({ id, label, value, onChange, maxLength }) {
      return (
        <div data-testid={`caption-input-${id}`}>
          <label htmlFor={id}>{label}</label>
          <input
            id={id}
            type='text'
            value={value || ''}
            onChange={(e) => onChange(e.target.value, e.target.value.toLowerCase().replace(/\s+/g, ''))}
            maxLength={maxLength}
            data-testid={`caption-input-field-${id}`}
          />
        </div>
      );
    },
);

jest.mock(
  '../common/components/editor-input/EditorInput',
  () =>
    function MockEditorInput({ id, label, value, onChange, type = 'text', maxLength, showChildIcon }) {
      return (
        <div data-testid={`editor-input-${id}`}>
          <label htmlFor={id}>{label}</label>
          <input
            id={id}
            type={type}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            maxLength={maxLength}
            data-testid={`editor-input-field-${id}`}
          />
          {showChildIcon && <span data-testid='child-icon'>📝</span>}
        </div>
      );
    },
);

jest.mock(
  './NumericRangeInput',
  () =>
    function MockNumericRangeInput({ id, label, value, onChange }) {
      return (
        <div data-testid={`numeric-range-input-${id}`}>
          <label htmlFor={id}>{label}</label>
          <input
            id={id}
            type='number'
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            data-testid={`${id}-Input`}
          />
        </div>
      );
    },
);

jest.mock(
  '../common/components/mapped-field-selector/MappedFieldSelector',
  () =>
    function MockMappedFieldSelector({ control, onChange }) {
      return (
        <div data-testid='mapped-field-selector'>
          <button
            onClick={() => onChange({ ...control, isBound: true, name: 'textField' })}
            data-testid='bind-field-button'
            type='button'
          >
            Bind to textField
          </button>
          <button
            onClick={() => onChange({ ...control, isBound: false, name: 'input' })}
            data-testid='unbind-field-button'
            type='button'
          >
            Unbind field
          </button>
        </div>
      );
    },
);

jest.mock(
  '../common/components/validation-rules-list/ValidationRulesList',
  () =>
    function MockValidationRulesList({ values, onChange }) {
      return (
        <div data-testid='validation-rules-list'>
          <h3>Validation Rules</h3>
          <button
            onClick={() => onChange([...values, { rule: ValidationRuleTypes.Required, canDelete: true }])}
            data-testid='add-validation-rule'
            type='button'
          >
            Add Required Rule
          </button>
          <ul>
            {values.map((rule, index) => (
              <li key={index} data-testid={`validation-rule-${index}`}>
                {rule.rule} {rule.canDelete ? '(deletable)' : '(required)'}
              </li>
            ))}
          </ul>
        </div>
      );
    },
);

jest.mock(
  '../../../../components/complex-value/ComplexValue',
  () =>
    function MockComplexValue({ id, complexValue, onChange, fieldType }) {
      return (
        <div data-testid={`complex-value-${id}`}>
          <input
            type='text'
            value={complexValue?.value || ''}
            onChange={(e) => onChange({ value: e.target.value, type: 'literal' })}
            data-testid={`complex-value-input-${id}`}
            placeholder={`Enter ${fieldType} value`}
          />
        </div>
      );
    },
);

jest.mock(
  '@m-next/dropdown',
  () =>
    function MockDropdown({ id, options, value, onChange, ariaLabel }) {
      return (
        <div data-testid={`dropdown-${id}`}>
          <select
            value={value?.value || ''}
            onChange={(e) => {
              const selected = options.find((opt) => opt.value === e.target.value);
              if (selected) onChange(selected);
            }}
            aria-label={ariaLabel}
            data-testid={`dropdown-select-${id}`}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    },
);

jest.mock('@m-next/button-group', () => ({
  ButtonGroupRow: function MockButtonGroupRow({ id, selected, data, onClick }) {
    return (
      <div data-testid={`button-group-${id}`}>
        {data.map((item) => (
          <button
            key={item.value}
            type='button'
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

jest.mock(
  '@m-next/toggle',
  () =>
    function MockToggle({ id, checked, onChange, label }) {
      return (
        <div data-testid={`toggle-${id}`}>
          <label>
            <input
              type='checkbox'
              checked={checked}
              onChange={(e) => onChange(e.target.checked)}
              data-testid={`toggle-checkbox-${id}`}
            />
            {label}
          </label>
        </div>
      );
    },
);

jest.mock(
  '@m-next/svg-icon',
  () =>
    function MockSvgIcon({ name, size, color }) {
      return (
        <span data-testid={`svg-icon-${name}`} style={{ color, fontSize: size }}>
          📝
        </span>
      );
    },
);

jest.mock('@m-next/typeography', () => ({
  Text: function MockText({ children, tooltip, tooltipHighlighting }) {
    return (
      <span data-testid='text' title={tooltip}>
        {children}
        {tooltipHighlighting && <span data-testid='tooltip-highlight'>*</span>}
      </span>
    );
  },
}));

jest.mock('react-tooltip', () => ({
  Tooltip: function MockTooltip({ id, style }) {
    return (
      <div data-testid={`tooltip-${id}`} style={style}>
        Tooltip
      </div>
    );
  },
}));

jest.mock('@m-next/utilities', () => ({
  formatter: {
    formatFieldList: jest.fn(() => [
      {
        options: [
          { value: 'textField', label: 'Text Field' },
          { value: 'numberField', label: 'Number Field' },
          { value: 'decimalField', label: 'Decimal Field' },
          { value: 'emailField', label: 'Email Field' },
        ],
      },
    ]),
  },
  Guid: {
    create: jest.fn(() => 'mock-guid-12345'),
  },
  toCamelCase: jest.fn((obj) => obj),
}));

jest.mock('@m-next/runtime-interface', () => ({
  FieldTypeNames: {
    Text: 'text',
    Integer: 'integer',
    Decimal: 'decimal',
    Money: 'money',
    Email: 'email',
    Phone: 'phone',
  },
  ValidationRuleTypes: {
    Required: 'required',
    MaliciousValues: 'maliciousValues',
    IsValidEmailAddress: 'isValidEmailAddress',
    MinLength: 'minLength',
    MaxLength: 'maxLength',
    LessThan: 'lessThan',
    GreaterThan: 'greaterThan',
  },
  WIDGETS: {
    TEXTBOX: 'textbox',
    TEXTAREA: 'textarea',
  },
  createInputControl: jest.fn(() => ({
    id: 'input-1',
    caption: 'Input',
    name: 'input',
    inputType: 'text',
    placeholder: '',
    rows: 1,
    validationRules: [],
    visible: true,
    disabled: false,
    hideCaption: false,
    typeOverride: 'textbox',
    isBound: false,
    defaultValue: null,
    formatRounding: 2,
  })),
}));

describe('InputEditor', () => {
  const defaultControl = {
    id: 'input-1',
    caption: 'Test Input',
    name: 'testInput',
    inputType: 'text',
    placeholder: 'Enter text',
    rows: 1,
    validationRules: [],
    visible: true,
    disabled: false,
    hideCaption: false,
    typeOverride: WIDGETS.TEXTBOX,
    isBound: false,
    defaultValue: null,
    formatRounding: 2,
  };

  const defaultProps = {
    rawControl: defaultControl,
    onChange: jest.fn(),
    onAddAction: jest.fn(),
  };

  const renderWithProvider = (component) => render(<Provider store={mockStore}>{component}</Provider>);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      renderWithProvider(<InputEditor {...defaultProps} />);

      expect(screen.getByText('Editing the base configuration and styles of the input field.')).toBeInTheDocument();
      expect(screen.getByTestId('accordion-display')).toBeInTheDocument();
    });

    it('should render all main sections', () => {
      renderWithProvider(<InputEditor {...defaultProps} />);

      expect(screen.getByTestId('mapped-field-selector')).toBeInTheDocument();
      expect(screen.getByTestId('accordion-display')).toBeInTheDocument();
      expect(screen.getByTestId('validation-rules-list')).toBeInTheDocument();
      expect(screen.getByTestId('action-list-section')).toBeInTheDocument();
    });

    it('should render display accordion with all form fields', () => {
      renderWithProvider(<InputEditor {...defaultProps} />);

      expect(screen.getByText('Display')).toBeInTheDocument();
      expect(screen.getByTestId('caption-input-label')).toBeInTheDocument();
      expect(screen.getByTestId('toggle-show-label')).toBeInTheDocument();
      expect(screen.getByTestId('editor-input-placeholder')).toBeInTheDocument();
      expect(screen.getByTestId('dropdown-input-type')).toBeInTheDocument();
    });

    it('should show rounding dropdown for decimal fields', () => {
      const decimalControl = { ...defaultControl, name: 'decimalField', isBound: true };
      renderWithProvider(<InputEditor {...defaultProps} rawControl={decimalControl} />);

      expect(screen.getByTestId('dropdown-decimal-places')).toBeInTheDocument();
    });
  });

  describe('Input Type Changes', () => {
    it('should handle input type change', () => {
      renderWithProvider(<InputEditor {...defaultProps} />);

      const inputTypeDropdown = screen.getByTestId('dropdown-select-input-type');
      fireEvent.change(inputTypeDropdown, { target: { value: 'email' } });

      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          inputType: 'email',
        }),
      );
    });

    it('should display correct input type options', () => {
      renderWithProvider(<InputEditor {...defaultProps} />);

      const inputTypeDropdown = screen.getByTestId('dropdown-select-input-type');
      expect(inputTypeDropdown).toBeInTheDocument();

      // Check that input type options are available
      const options = screen.getByTestId('dropdown-input-type').querySelectorAll('option');
      expect(options.length).toBeGreaterThan(0);
    });
  });

  describe('Field Mapping', () => {
    it('should handle field binding', () => {
      renderWithProvider(<InputEditor {...defaultProps} />);

      const bindButton = screen.getByTestId('bind-field-button');
      fireEvent.click(bindButton);

      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          isBound: true,
          name: 'textField',
          validationRules: expect.arrayContaining([
            expect.objectContaining({
              rule: ValidationRuleTypes.Required,
              canDelete: false,
            }),
          ]),
        }),
      );
    });

    it('should handle field unbinding', () => {
      const boundControl = { ...defaultControl, isBound: true, name: 'textField' };
      renderWithProvider(<InputEditor {...defaultProps} rawControl={boundControl} />);

      const unbindButton = screen.getByTestId('unbind-field-button');
      fireEvent.click(unbindButton);

      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          isBound: false,
          name: 'input',
        }),
      );
    });
  });

  describe('Validation Rules', () => {
    it('should handle adding validation rules', () => {
      renderWithProvider(<InputEditor {...defaultProps} />);

      const addRuleButton = screen.getByTestId('add-validation-rule');
      fireEvent.click(addRuleButton);

      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          validationRules: expect.arrayContaining([
            expect.objectContaining({
              rule: ValidationRuleTypes.Required,
              canDelete: true,
            }),
          ]),
        }),
      );
    });

    it('should auto-add required rule for required fields', () => {
      const requiredFieldControl = { ...defaultControl, isBound: true, name: 'textField' };
      renderWithProvider(<InputEditor {...defaultProps} rawControl={requiredFieldControl} />);

      const bindButton = screen.getByTestId('bind-field-button');
      fireEvent.click(bindButton);

      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          validationRules: expect.arrayContaining([
            expect.objectContaining({
              rule: ValidationRuleTypes.Required,
              canDelete: false,
            }),
          ]),
        }),
      );
    });
  });

  describe('Event Handlers', () => {
    it('should handle caption change', () => {
      renderWithProvider(<InputEditor {...defaultProps} />);

      const captionInput = screen.getByTestId('caption-input-field-label');
      fireEvent.change(captionInput, { target: { value: 'New Caption' } });

      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          caption: 'New Caption',
          name: 'newcaption',
        }),
      );
    });

    it('should handle placeholder change', () => {
      renderWithProvider(<InputEditor {...defaultProps} />);

      const placeholderInput = screen.getByTestId('editor-input-field-placeholder');
      fireEvent.change(placeholderInput, { target: { value: 'New placeholder' } });

      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          placeholder: 'New placeholder',
        }),
      );
    });

    it('should handle show label toggle', () => {
      renderWithProvider(<InputEditor {...defaultProps} />);

      const showLabelToggle = screen.getByTestId('toggle-checkbox-show-label');
      fireEvent.click(showLabelToggle);

      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          hideCaption: true,
        }),
      );
    });

    it('should handle default value change', () => {
      renderWithProvider(<InputEditor {...defaultProps} />);

      const defaultValueInput = screen.getByTestId(`complex-value-input-default-value-${defaultControl.id}`);
      fireEvent.change(defaultValueInput, { target: { value: 'Default text' } });

      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          defaultValue: { value: 'Default text', type: 'literal' },
        }),
      );
    });
  });

  describe('Events Section', () => {
    it('should show empty message when no events', () => {
      renderWithProvider(<InputEditor {...defaultProps} />);

      expect(screen.getByText('No events applied')).toBeInTheDocument();
    });

    it('should show add buttons for available events', () => {
      renderWithProvider(<InputEditor {...defaultProps} />);

      expect(screen.getByTestId('add-action-focus')).toBeInTheDocument();
      expect(screen.getByTestId('add-action-change')).toBeInTheDocument();
      expect(screen.getByTestId('add-action-lose focus')).toBeInTheDocument();
    });

    it('should handle adding focus event', () => {
      renderWithProvider(<InputEditor {...defaultProps} />);

      const addFocusButton = screen.getByTestId('add-action-focus');
      fireEvent.click(addFocusButton);

      expect(defaultProps.onAddAction).toHaveBeenCalledWith(
        expect.objectContaining({
          onFocus: 'mock-guid-12345',
        }),
        'Focus',
      );
    });

    it('should handle adding change event', () => {
      renderWithProvider(<InputEditor {...defaultProps} />);

      const addChangeButton = screen.getByTestId('add-action-change');
      fireEvent.click(addChangeButton);

      expect(defaultProps.onAddAction).toHaveBeenCalledWith(
        expect.objectContaining({
          onChange: 'mock-guid-12345',
        }),
        'Change',
      );
    });

    it('should handle adding blur event', () => {
      renderWithProvider(<InputEditor {...defaultProps} />);

      const addBlurButton = screen.getByTestId('add-action-lose focus');
      fireEvent.click(addBlurButton);

      expect(defaultProps.onAddAction).toHaveBeenCalledWith(
        expect.objectContaining({
          onBlur: 'mock-guid-12345',
        }),
        'Lose Focus',
      );
    });

    it('should display existing events', () => {
      const controlWithEvents = {
        ...defaultControl,
        onFocus: 'focus-guid',
        onChange: 'change-guid',
        onBlur: 'blur-guid',
      };
      renderWithProvider(<InputEditor {...defaultProps} rawControl={controlWithEvents} />);

      expect(screen.getByTestId('action-value-0')).toHaveTextContent('Focus');
      expect(screen.getByTestId('action-value-1')).toHaveTextContent('Change');
      expect(screen.getByTestId('action-value-2')).toHaveTextContent('Lose focus');
    });
  });

  describe('Default State Handling', () => {
    it('should handle default state changes', () => {
      renderWithProvider(<InputEditor {...defaultProps} />);

      const hiddenButton = screen.getByTestId('hidden-button');
      fireEvent.click(hiddenButton);

      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          visible: false,
          disabled: false,
        }),
      );
    });

    it('should handle disabled state change', () => {
      renderWithProvider(<InputEditor {...defaultProps} />);

      const disabledButton = screen.getByTestId('disabled-button');
      fireEvent.click(disabledButton);

      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          visible: true,
          disabled: true,
        }),
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty validation rules array', () => {
      const controlWithEmptyRules = { ...defaultControl, validationRules: [] };
      renderWithProvider(<InputEditor {...defaultProps} rawControl={controlWithEmptyRules} />);

      expect(screen.getByTestId('validation-rules-list')).toBeInTheDocument();
    });



    it('should handle missing field in field list', () => {
      const controlWithMissingField = { ...defaultControl, name: 'nonexistentField', isBound: true };
      renderWithProvider(<InputEditor {...defaultProps} rawControl={controlWithMissingField} />);

      // Should not crash and should render normally
      expect(screen.getByText('Editing the base configuration and styles of the input field.')).toBeInTheDocument();
    });
  });

  describe('Multi-line Configuration', () => {
    it('should not refill placeholder on blur when cleared', () => {
      const controlWithPlaceholder = { ...defaultControl, placeholder: 'Original placeholder' };
      renderWithProvider(<InputEditor {...defaultProps} rawControl={controlWithPlaceholder} />);

      const placeholderInput = screen.getByTestId('editor-input-field-placeholder');

      // Verify initial value
      expect(placeholderInput).toHaveValue('Original placeholder');

      // Clear the placeholder
      fireEvent.change(placeholderInput, { target: { value: '' } });
      fireEvent.blur(placeholderInput);

      // Verify onChange was called with empty string
      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          placeholder: '',
        }),
      );

      // Verify it wasn't called with the original value after blur
      const calls = defaultProps.onChange.mock.calls;
      const lastCall = calls[calls.length - 1][0];
      expect(lastCall.placeholder).toBe('');
    });
  });
});
