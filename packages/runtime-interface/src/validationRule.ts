import { ValidationRuleType } from './validationRuleTypes';

export interface ValidationRule {
  rule: ValidationRuleType;
  value?: number | string | boolean;
  canDelete: boolean;
  maxValue?: number;
}
