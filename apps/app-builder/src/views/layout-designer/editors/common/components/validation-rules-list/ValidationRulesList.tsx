import React, { useMemo } from 'react';
import AddableList, { ValueItem } from '../../../../../../components/addable-list/AddableList';
import AddableAccordion from '../../../../../../components/accordion/AddableAccordion';

const DEFAULT_MAX_LENGTH = 100000;

// Type definitions
export type ValidationRuleType = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface StandardRule {
  label: string;
  value: ValidationRuleType;
  type: 'boolean' | 'number';
  rule: ValidationRuleType;
  canDelete: boolean;
  hidden?: boolean;
}

export interface ValidationRuleValue {
  rule: number;
  value: string | number | boolean | null;
  maxValue?: number;
  canDelete?: boolean;
}

export interface ValidationRulesListProps {
  onChange: (values: ValidationRuleValue[]) => void;
  values?: ValidationRuleValue[] | null;
  standardOptions?: ValidationRuleType[];
}

const standardRules: Record<ValidationRuleType, StandardRule> = {
  0: { label: 'Required', value: 0, type: 'boolean', rule: 0, canDelete: true },
  1: { label: 'Valid email', value: 1, type: 'boolean', rule: 1, canDelete: true },
  2: { label: 'Max length', value: 2, type: 'number', rule: 2, canDelete: true },
  3: { label: 'Min length', value: 3, type: 'number', rule: 3, canDelete: true },
  4: { label: 'Less than', value: 4, type: 'number', rule: 4, canDelete: true },
  5: { label: 'Greater than', value: 5, type: 'number', rule: 5, canDelete: true },
  6: { label: 'Prevent malicious value', value: 6, type: 'boolean', canDelete: false, rule: 6, hidden: true },
};

const ValidationRulesList: React.FC<ValidationRulesListProps> = ({ onChange, values, standardOptions = [] }) => {
  // Options including hidden ones - needed for AddableList to render existing values
  // We include hidden rules (like rule 6) so that AddableAccordion can filter them out when they're in values
  // If a hidden rule appears in the dropdown, it's a validation that it wasn't set correctly by default
  const options = useMemo(() => {
    const mappedOptions = standardOptions.map((option) => standardRules[option]).flat();
    if (!mappedOptions.includes(standardRules[6])) {
      mappedOptions.push(standardRules[6]);
    }
    return mappedOptions;
  }, [standardOptions]);

  const mappedValues: ValueItem[] = useMemo(
    () =>
      values?.map((value) => {
        // For boolean rules (0=Required, 1=ValidEmail, 6=MaliciousValues), preserve boolean type
        // Don't convert null/undefined to empty string for boolean rules
        const isBooleanRule = [0, 1, 6].includes(value.rule);
        let mappedValue: string | number | boolean | null= value.value;
        
        if (mappedValue === null || mappedValue === undefined) {
          // For boolean rules, default to true; for others, use empty string
          mappedValue = isBooleanRule ? true : '';
        }
        
        return {
          id: value.rule,
          value: mappedValue,
          canDelete: value.canDelete,
          maxValue: value.maxValue,
        };
      }) || [],
    [values],
  );

  const isEmpty = useMemo(() => mappedValues.filter((item) => item.id !== 6).length === 0, [mappedValues]);

  const handleChange = (newValues: ValueItem[]): void => {
    onChange(
      newValues.map((value) => {
        let newValue: string | number | boolean | null = value.value;

        // Min length validation: ensure it doesn't exceed max length
        if (value.id === 3) {
          const maxValidationRule = newValues.find((item) => item.id === 2);
          if (
            maxValidationRule &&
            typeof value.value === 'number' &&
            typeof maxValidationRule.value === 'number' &&
            value.value > maxValidationRule.value
          ) {
            newValue = maxValidationRule.value;
          }
        }

        // Max length validation: apply default cap for when maxValue is undefined
        if (value.id === 2) {
          if (value.maxValue === undefined && typeof newValue === 'number' && newValue > DEFAULT_MAX_LENGTH) {
            newValue = DEFAULT_MAX_LENGTH;
          }
        }

        // Convert value to appropriate type based on rule type
        let convertedValue: string | number | boolean | null = newValue;
        
        // Convert numeric rules (2=MaxLength, 3=MinLength, 4=LessThan, 5=GreaterThan) to Number
        if ([2, 3, 4, 5].includes(value.id)) {
          convertedValue = Number(newValue);
        } 
        // Convert boolean rules (0=Required, 1=ValidEmail, 6=MaliciousValues) to Boolean
        // This ensures empty strings are converted to false
        else if ([0, 1, 6].includes(value.id)) {
          convertedValue = Boolean(newValue);
        }
        
        return {
          rule: value.id,
          value: convertedValue,
          canDelete: value.canDelete,
        };
      }),
    );
  };

  const handleAddItem = (option: StandardRule): void => {
    const newValues: ValidationRuleValue[] = [...(values || [])];
    
    // Set default value based on rule type
    // Boolean rules (0=Required, 1=ValidEmail, 6=MaliciousValues) should default to true
    // Number rules should default to null (will need user input)
    const isBooleanRule = [0, 1, 6].includes(option.value);
    const defaultValue: string | number | boolean | null = isBooleanRule ? true : null;
    
    newValues.push({
      ...option,
      rule: option.value,
      value: defaultValue,
      canDelete: option.canDelete ?? true,
    });
    onChange(newValues);
  };

  return (
    <AddableAccordion
      addLabel='Add'
      canAdd={options.length > mappedValues.length}
      caption='Validation rules'
      emptyMessage='No validation rules applied'
      id='validation-rules-list-accordion'
      onAdd={handleAddItem}
      options={options}
      isEmpty={isEmpty}
      values={mappedValues}
      optionCaption='label'
      optionIcon='icon'
      optionKey='value'
      valueKey='id'
      tooltip='Add rule'
      tooltipId='editor-tooltip'
    >
      <AddableList
        id='validation-rules-list'
        data-testid='validation-rules-list'
        onChange={handleChange}
        values={mappedValues}
        mode='removable'
        options={options}
      />
    </AddableAccordion>
  );
};

export default ValidationRulesList;
