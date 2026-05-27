import { EmptyPredicate, basicOperationId, complexValueTypes } from '@m-next/types';
import { toCamelCase } from '@m-next/utilities';

const parseExpression = (expression) => {
  if (!expression) return [];

  let predicate = null;
  let first = true;
  const collection = [];
  let set = {
    connector: basicOperationId.And,
    expression: [],
  };

  collection.push(set);

  toCamelCase(expression).forEach((element, index) => {
    if (!element.source) {
      switch (element.operation) {
        case basicOperationId.OpenBracket:
          first = true;
          if (index > 0) {
            set = {
              connector: basicOperationId.And,
              expression: [],
            };
            collection.push(set);
          }
          if (predicate !== null) {
            //   set.expression.push(predicate);
            predicate = {
              first: { ...EmptyPredicate },
              operation: null,
              second: { ...EmptyPredicate },
            };
          }
          break;
        case basicOperationId.CloseBracket:
          if (predicate !== null && predicate.first.value) {
            set.expression.push(predicate);
            predicate = {
              first: { ...EmptyPredicate },
              operation: null,
              second: { ...EmptyPredicate },
            };
            first = true;
          }
          if (index < expression.length - 1) {
            // eslint-disable-next-line prefer-destructuring
            set = collection[0];
          }
          break;
        case basicOperationId.And:
          if (predicate !== null && predicate.first.value) {
            set.expression.push(predicate);
            set.connector = basicOperationId.And;
            predicate = {
              first: { ...EmptyPredicate },
              operation: null,
              second: { ...EmptyPredicate },
            };
            first = true;
          }
          break;
        case basicOperationId.Or:
          if (predicate !== null && predicate.first.value) {
            set.expression.push(predicate);
            set.connector = basicOperationId.Or;
            predicate = {
              first: { ...EmptyPredicate },
              operation: null,
              second: { ...EmptyPredicate },
            };
            first = true;
          }
          break;
        case basicOperationId.IsTrue:
          predicate.operation = basicOperationId.Is;
          predicate.second.value = 'true';
          predicate.second.type = complexValueTypes.YesNo;
          break;
        case basicOperationId.IsFalse:
          predicate.operation = basicOperationId.Is;
          predicate.second.value = 'false';
          predicate.second.type = complexValueTypes.YesNo;
          break;
        default:
          if (predicate !== null) {
            predicate.operation = element.operation;
            predicate.dateField = element.dateField;
            first = false;
          }
          break;
      }
    }

    if (element.source) {
      if (first) {
        predicate = {
          first: { ...EmptyPredicate },
          operation: null,
          second: { ...EmptyPredicate },
        };
        predicate.first.value = element.source.value;
        predicate.first.type = element.source.valueType;
        predicate.first.property = element.source.property;
        predicate.first.childProperty = element.source.childProperty;
        predicate.first.dateField = element.source.dateField;
      } else {
        predicate.second.value = element.source.value;
        predicate.second.type = element.source.valueType;
        predicate.second.property = element.source.property;
        predicate.second.childProperty = element.source.childProperty;
        predicate.second.dateField = element.source.dateField;
        if (predicate.second.type === complexValueTypes.YesNo) {
          predicate.second.value = element.source.value.toString();
        }

        if (predicate.second.value === null || predicate.second.value === undefined || predicate.second.value === '') {
          if (predicate.operation === basicOperationId.Is) {
            predicate.operation = basicOperationId.IsEmpty;
          }
          if (predicate.operation === basicOperationId.IsNot) {
            predicate.operation = basicOperationId.IsNotEmpty;
          }
        }

        if (element.additionalSources && element.additionalSources.length > 0) {
          predicate.third = { ...EmptyPredicate };
          predicate.third.value = element.additionalSources[0].value;
          predicate.third.type = element.additionalSources[0].valueType;
          predicate.third.property = element.additionalSources[0].property;
          predicate.third.childProperty = element.additionalSources[0].childProperty;
          predicate.third.dateField = element.additionalSources[0].dateField;
        }
      }
    }
  });
  return collection;
};

export default parseExpression;
