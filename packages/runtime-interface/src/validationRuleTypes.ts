// Validation Rule Types as const assertion
export const ValidationRuleTypes = {
  Required: 0,
  IsValidEmailAddress: 1,
  MaxLength: 2,
  MinLength: 3,
  LessThan: 4,
  GreaterThan: 5,
  MaliciousValues: 6,
} as const;

// Type definition for validation rule type values
export type ValidationRuleType = (typeof ValidationRuleTypes)[keyof typeof ValidationRuleTypes];

export default ValidationRuleTypes;
