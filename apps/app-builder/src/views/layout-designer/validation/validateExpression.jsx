import { basicOperationId } from '@m-next/types';

const validateExpression = (collection) => {
  const validation = {
    isValid: true,
    expression: [],
  };

  if (!collection || collection.length === 0) {
    return validation;
  }

  collection.forEach((set) => {
    set.expression.forEach((element) => {
      const item = {
        isValid: true,
        first: {
          value: null,
        },
        operation: null,
        second: {
          value: null,
          type: null,
        },
      };

      if (!element.first || !element.first.value) {
        item.first.value = 'Field is required.';
        item.isValid = false;
        validation.isValid = false;
      }

      if (item.isValid) {
        if (
          element.operation !== basicOperationId.IsEmpty &&
          element.operation !== basicOperationId.IsNotEmpty &&
          element.operation !== basicOperationId.IsTrue &&
          element.operation !== basicOperationId.IsFalse
        ) {
          if (
            !element.second ||
            element.second.value === null ||
            element.second.value === undefined ||
            element.second.value === ''
          ) {
            item.second.type = 'Value is required.';
            item.isValid = false;
            validation.isValid = false;
          }
        }
      }
      validation.expression.push(item);
    });
  });

  return validation;
};

export default validateExpression;
