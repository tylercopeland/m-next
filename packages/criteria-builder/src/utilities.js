import { basicOperationId, EmptyPredicate } from '@m-next/types';
import { Guid } from '@m-next/utilities';

export const updateExpression = (updatedExpression) => {
  const updated = [{ operation: 0 }];
  updatedExpression.forEach((set, setIndex) => {
    if (setIndex > 0) {
      updated.push({ operation: updatedExpression[0].connector, dateField: null, source: null });
      updated.push({ operation: 0, dateField: null, source: null });
    }
    let notEmpty = false;

    set.expression.forEach((element) => {
      if (element.first.value) {
        if (notEmpty) {
          updated.push({ operation: set.connector, dateField: null, source: null });
        }
        notEmpty = true;
        updated.push({
          operation: null,
          dateField: null,
          key: element.key,
          source: {
            Value: element.first.value,
            ValueType: element.first.type,
            Property: element.first.property,
            ChildProperty: element.first.childProperty,
          },
        });
        updated.push({ operation: element.operation, dateField: element.dateField, source: null });
        if (
          element.operation !== basicOperationId.IsEmpty &&
          element.operation !== basicOperationId.IsNotEmpty &&
          element.operation !== basicOperationId.IsTrue &&
          element.operation !== basicOperationId.IsFalse
        ) {
          updated.push({
            operation: null,
            dateField: null,
            source: {
              Value: element.second.value,
              ValueType: element.second.type,
              Property: element.second.property,
              ChildProperty: element.second.childProperty,
            },
          });
        }
      }
    });

    if (setIndex > 0) {
      updated.push({ operation: 1, dateField: null, source: null });
    }
  });
  updated.push({ operation: 1, dateField: null, source: null });

  if (updated.length === 2) {
    return {
      updatedExpression: [],
      isEditing: false,
      count: 0,
    };
  }
  return {
    updatedExpression: updated,
    isEditing: updated.isEditing,
    count: updated.length,
  };
};

export const createEmptyChip = () => ({
  key: Guid.create(),
  first: { ...EmptyPredicate },
  operation: null,
  second: { ...EmptyPredicate },
  ghost: true,
});
