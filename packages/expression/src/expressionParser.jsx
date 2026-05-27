import { formatter } from '@m-next/utilities';

export const formatField = (field, fieldValue, displayPreferences) => {
  const formatOptions = { useThousandsSeparator: true };
  if (field.type === 'DateTime') {
    formatOptions.dateFormat = field.displayOptions?.dateFormat ?? 1;
  }
  if (field.type === 'Decimal') {
    formatOptions.decimalPlace = field.displayOptions?.decimalRounding ?? 2;
  }
  if (field.type === 'Money') {
    formatOptions.decimalPlace = field.displayOptions?.decimalRounding ?? 2;
  }

  let formattedValue = formatter.formatValue(field.type, fieldValue, formatOptions, displayPreferences);

  if (field.type === 'YesNo') {
    let trueValue = 'True';
    let falseValue = 'False';
    if (field.displayOptions?.trueValue) {
      trueValue = field.displayOptions?.trueValue;
    }
    if (field.displayOptions?.falseValue) {
      falseValue = field.displayOptions?.falseValue;
    }
    formattedValue = fieldValue === 'true' || fieldValue === 'True' || fieldValue === true ? trueValue : falseValue;
  }

  return formattedValue;
};

export const formatExpression = (expression, fields, data, displayPreferences, displayAs) => {
  if (!expression || expression.length === 0) return '';

  let result = '';
  expression.forEach((item) => {
    if (item.valueType === 9) {
      result += item.value;
    } else if (item.valueType === 3) {
      const lookup = data[item.value];
      if (lookup) {
        const match = fields.filter((x) => x.name === item.value);
        if (match && match.length > 0) {
          const formattedField = formatField(match[0], lookup, displayPreferences);
          result += formattedField;
        }
      }
    }
  });

  if (displayAs === '%') {
    const number = Number(result);
    if (number !== Number.isNaN) {
      result = number * 100;
    }
  }
  if (displayAs === '$') {
    const number = Number(result);
    if (number !== Number.isNaN) {
      result = `$ ${result}`;
    } else {
      result = `$ 0.00`;
    }
  }
  return result;
};
