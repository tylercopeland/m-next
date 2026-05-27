import { createInputControl, InputControlInput } from './inputControl';
import { ValidationRule } from '../validationRule';
import { ValidationRuleTypes } from '../validationRuleTypes';

describe('createInputControl', () => {
  it('should create input control with default values when no data provided', () => {
    const result = createInputControl();

    expect(result.type).toBe('input');
    expect(result.name).toBe('input');
    expect(result.rows).toBeUndefined();
    expect(result.placeholder).toBe('');
    expect(result.inputType).toBe('text');
    expect(result.validationRules).toEqual([]);
  });

  it('should create input control with provided values', () => {
    const input: InputControlInput = {
      type: 'textarea',
      name: 'description',
      rows: 5,
      placeholder: 'Enter description',
      inputType: 'email',
      validationRules: [
        { rule: ValidationRuleTypes.Required, canDelete: false },
        { rule: ValidationRuleTypes.MaxLength, value: 100, canDelete: true },
      ],
    };

    const result = createInputControl(input);

    expect(result.type).toBe('textarea');
    expect(result.name).toBe('description');
    expect(result.rows).toBe(5);
    expect(result.placeholder).toBe('Enter description');
    expect(result.inputType).toBe('email');
    expect(result.validationRules).toHaveLength(2);
    expect(result.validationRules?.[0]).toEqual({ rule: ValidationRuleTypes.Required, canDelete: false });
    expect(result.validationRules?.[1]).toEqual({ rule: ValidationRuleTypes.MaxLength, value: 100, canDelete: true });
  });

  it('should use default values when properties are undefined', () => {
    const input: InputControlInput = {
      type: undefined,
      name: undefined,
      inputType: undefined,
      validationRules: undefined,
    };

    const result = createInputControl(input);

    expect(result.type).toBe('input');
    expect(result.name).toBe('input');
    expect(result.inputType).toBe('text');
    expect(result.validationRules).toEqual([]);
  });

  it('should handle all validation rule types', () => {
    const validationRules: ValidationRule[] = [
      { rule: ValidationRuleTypes.Required, canDelete: false },
      { rule: ValidationRuleTypes.IsValidEmailAddress, canDelete: true },
      { rule: ValidationRuleTypes.MaxLength, value: 50, canDelete: true },
      { rule: ValidationRuleTypes.MinLength, value: 5, canDelete: true },
      { rule: ValidationRuleTypes.LessThan, value: 100, canDelete: true },
      { rule: ValidationRuleTypes.GreaterThan, value: 0, canDelete: true },
      { rule: ValidationRuleTypes.MaliciousValues, canDelete: false },
    ];

    const result = createInputControl({ validationRules });

    expect(result.validationRules).toEqual(validationRules);
  });
});
