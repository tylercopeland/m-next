import basicOperationId from './expressionTypes';
import { FieldTypeNames } from './fieldTypes';

export const basicOperationNames = {
  0: '(',
  1: ')',
  2: 'And',
  3: 'Or',
  4: 'Is',
  5: 'Is not',
  6: 'Greater than',
  7: 'Is or greater than',
  8: 'Less than',
  9: 'Is or less than',
  10: 'Is empty',
  11: 'Is not empty',
  12: 'Contains',
  13: 'Does not contain',
  14: 'Starts with',
  15: 'Ends with',
  16: 'Contains',
  17: 'In list',
  18: 'Not in list',
  19: 'Does not start with',
  20: 'Is true',
  21: 'Is false',
  26: 'Does not end with',
  27: 'Is between',
};

const operationList = [
  {
    value: basicOperationId.Is,
    label: basicOperationNames[basicOperationId.Is],
  },

  {
    value: basicOperationId.IsNot,
    label: basicOperationNames[basicOperationId.IsNot],
  },
  {
    value: basicOperationId.Greater,
    label: basicOperationNames[basicOperationId.Greater],
  },
  {
    value: basicOperationId.GreaterEqual,
    label: basicOperationNames[basicOperationId.GreaterEqual],
  },
  {
    value: basicOperationId.Less,
    label: basicOperationNames[basicOperationId.Less],
  },
  {
    value: basicOperationId.LessEqual,
    label: basicOperationNames[basicOperationId.LessEqual],
  },
  {
    value: basicOperationId.IsEmpty,
    label: basicOperationNames[basicOperationId.IsEmpty],
  },
  {
    value: basicOperationId.IsNotEmpty,
    label: basicOperationNames[basicOperationId.IsNotEmpty],
  },
  {
    value: basicOperationId.Contains,
    label: basicOperationNames[basicOperationId.Contains],
  },
  {
    value: basicOperationId.DoesNotContain,
    label: basicOperationNames[basicOperationId.DoesNotContain],
  },
  {
    value: basicOperationId.StartsWith,
    label: basicOperationNames[basicOperationId.StartsWith],
  },
  {
    value: basicOperationId.DoesNotStartWith,
    label: basicOperationNames[basicOperationId.DoesNotStartWith],
  },
  {
    value: basicOperationId.EndsWith,
    label: basicOperationNames[basicOperationId.EndsWith],
  },
  {
    value: basicOperationId.DoesNotEndWith,
    label: basicOperationNames[basicOperationId.DoesNotEndWith],
  },
  {
    value: basicOperationId.InList,
    label: basicOperationNames[basicOperationId.InList],
  },
  {
    value: basicOperationId.NotInList,
    label: basicOperationNames[basicOperationId.NotInList],
  },

  {
    value: basicOperationId.IsTrue,
    label: basicOperationNames[basicOperationId.IsTrue],
  },
  {
    value: basicOperationId.IsFalse,
    label: basicOperationNames[basicOperationId.IsFalse],
  },
  {
    value: basicOperationId.Between,
    label: basicOperationNames[basicOperationId.Between],
  },
];
const operationListLookup = {
  Is: 0,
  IsNot: 1,
  Greater: 2,
  GreaterEqual: 3,
  Less: 4,
  LessEqual: 5,
  IsEmpty: 6,
  IsNotEmpty: 7,
  Contains: 8,
  DoesNotContain: 9,
  StartsWith: 10,
  DoesNotStartWith: 11,
  EndsWith: 12,
  DoesNotEndWith: 13,
  InList: 14,
  NotInList: 15,
  IsTrue: 16,
  IsFalse: 17,
  Between: 18,
};

const dateOperationList = [
  {
    value: basicOperationId.Is,
    label: basicOperationNames[basicOperationId.Is],
  },
  {
    value: basicOperationId.IsNot,
    label: basicOperationNames[basicOperationId.IsNot],
  },
  {
    value: basicOperationId.Between,
    label: basicOperationNames[basicOperationId.Between],
  },
  {
    value: basicOperationId.Greater,
    label: 'Is after',
  },
  {
    value: basicOperationId.GreaterEqual,
    label: 'Is on or after',
  },
  {
    value: basicOperationId.Less,
    label: 'Is before',
  },
  {
    value: basicOperationId.LessEqual,
    label: 'Is on or before',
  },
  {
    value: basicOperationId.IsEmpty,
    label: basicOperationNames[basicOperationId.IsEmpty],
  },
  {
    value: basicOperationId.IsNotEmpty,
    label: basicOperationNames[basicOperationId.IsNotEmpty],
  },
];

const dateTimeOperationList = [
  {
    value: basicOperationId.Is,
    label: basicOperationNames[basicOperationId.Is],
  },

  {
    value: basicOperationId.IsNot,
    label: basicOperationNames[basicOperationId.IsNot],
  },
  {
    value: basicOperationId.Greater,
    label: 'Is after',
  },
  {
    value: basicOperationId.GreaterEqual,
    label: 'Is on or after',
  },
  {
    value: basicOperationId.Less,
    label: 'Is before',
  },
  {
    value: basicOperationId.LessEqual,
    label: 'Is on or before',
  },
  {
    value: basicOperationId.IsEmpty,
    label: basicOperationNames[basicOperationId.IsEmpty],
  },
  {
    value: basicOperationId.IsNotEmpty,
    label: basicOperationNames[basicOperationId.IsNotEmpty],
  },
];

export const getOperationList = (fieldType) => {
  switch (fieldType) {
    case FieldTypeNames.Money:
    case FieldTypeNames.Decimal:
    case FieldTypeNames.Integer:
      return [
        operationList[operationListLookup.Is],
        operationList[operationListLookup.IsNot],
        operationList[operationListLookup.Greater],
        operationList[operationListLookup.GreaterEqual],
        operationList[operationListLookup.Less],
        operationList[operationListLookup.LessEqual],
        operationList[operationListLookup.IsEmpty],
        operationList[operationListLookup.IsNotEmpty],
        operationList[operationListLookup.InList],
        operationList[operationListLookup.NotInList],
      ];
    case FieldTypeNames.Text:
    case FieldTypeNames.DropDown:
      return [
        operationList[operationListLookup.Is],
        operationList[operationListLookup.IsNot],
        operationList[operationListLookup.Contains],
        operationList[operationListLookup.DoesNotContain],
        operationList[operationListLookup.StartsWith],
        operationList[operationListLookup.DoesNotStartWith],
        operationList[operationListLookup.EndsWith],
        operationList[operationListLookup.DoesNotEndWith],
        operationList[operationListLookup.IsEmpty],
        operationList[operationListLookup.IsNotEmpty],
        operationList[operationListLookup.InList],
        operationList[operationListLookup.NotInList],
      ];
    case FieldTypeNames.YesNo:
      return operationList.filter((x) =>
        [basicOperationId.Is, basicOperationId.IsNot, basicOperationId.IsEmpty, basicOperationId.IsNotEmpty].includes(
          x.value,
        ),
      );
    case FieldTypeNames.Date:
    case FieldTypeNames.Time:
      return dateOperationList;
    case FieldTypeNames.DateTime:
      return dateTimeOperationList;
    default:
      return operationList;
  }
};

export const getOperationListChips = (fieldType, isMultiSelect) => {
  switch (fieldType) {
    case FieldTypeNames.Money:
    case FieldTypeNames.Decimal:
    case FieldTypeNames.Integer:
      return [
        operationList[operationListLookup.Is],
        operationList[operationListLookup.IsNot],
        operationList[operationListLookup.Between],
        operationList[operationListLookup.Greater],
        operationList[operationListLookup.GreaterEqual],
        operationList[operationListLookup.Less],
        operationList[operationListLookup.LessEqual],
        operationList[operationListLookup.IsEmpty],
        operationList[operationListLookup.IsNotEmpty],
      ];
    case FieldTypeNames.Text:
      return [
        operationList[operationListLookup.Is],
        operationList[operationListLookup.IsNot],
        operationList[operationListLookup.Contains],
        operationList[operationListLookup.DoesNotContain],
        operationList[operationListLookup.IsEmpty],
        operationList[operationListLookup.IsNotEmpty],
      ];
    case FieldTypeNames.DropDown:
      return [
        isMultiSelect ? { value: basicOperationId.Is, label: 'is any of' } : operationList[operationListLookup.Is],
        isMultiSelect
          ? { value: basicOperationId.IsNot, label: 'is none of' }
          : operationList[operationListLookup.IsNot],
        operationList[operationListLookup.IsEmpty],
        operationList[operationListLookup.IsNotEmpty],
      ];
    case FieldTypeNames.YesNo:
      return operationList.filter((x) =>
        [basicOperationId.Is, basicOperationId.IsNot, basicOperationId.IsEmpty, basicOperationId.IsNotEmpty].includes(
          x.value,
        ),
      );
    case FieldTypeNames.Tags:
      return [
        { value: basicOperationId.InList, label: 'Has any of' },
        { value: basicOperationId.AllInList, label: 'Has all of' },
        { value: basicOperationId.NotInList, label: 'Has none of' },
        operationList[operationListLookup.IsEmpty],
      ];
    case FieldTypeNames.Date:
    case FieldTypeNames.Time:
      return dateOperationList;
    default:
      return operationList;
  }
};

export const lookupOperation = (operation, type) => {
  const list = getOperationList(type);
  const matches = list.filter((x) => x.value === operation);
  if (matches && matches.length > 0) {
    return matches[0].label;
  }
  return basicOperationNames[operation];
};

export const lookupOperationChips = (operation, type) => {
  const list = getOperationListChips(type);
  const matches = list.filter((x) => x.value === operation);
  if (matches && matches.length > 0) {
    return matches[0].label;
  }
  return basicOperationNames[operation];
};

export const dateFields = {
  0: 'Date and time',
  1: 'Date',
  2: 'Day of month',
  3: 'Month',
  4: 'Year',
  5: 'Day of week',
};

export const dateFieldOptions = [
  {
    value: 0,
    label: dateFields[0],
  },
  {
    value: 1,
    label: dateFields[1],
  },
  {
    value: 2,
    label: dateFields[2],
  },
  {
    value: 3,
    label: dateFields[3],
  },
  {
    value: 4,
    label: dateFields[4],
  },
  {
    value: 5,
    label: dateFields[5],
  },
];
