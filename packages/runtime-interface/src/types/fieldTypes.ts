// Field Type IDs as const assertion for better type inference
export const FieldTypeIds = {
  Text: 0,
  Decimal: 1,
  Integer: 2,
  DateTime: 3,
  Money: 4,
  YesNo: 5,
  FileAttachment: 6,
  Picture: 7,
  DropDown: 8,
  Linked: 9,
  Button: 10,
  CardColumn: 11,
  Address: 12,
  Tags: 13,
  Phone: 14,
  Email: 15,
  ProfileImage: 16,
  Id: 17,
  User: 18,
  Date: 19,
  Time: 20,
  Formula: 21,
  MultiSelectDropDown: 22,
} as const;

// Field Type Names as const assertion
export const FieldTypeNames = {
  Text: 'Text',
  Decimal: 'Decimal',
  Integer: 'Integer',
  DateTime: 'DateTime',
  Money: 'Money',
  YesNo: 'YesNo',
  FileAttachment: 'FileAttachment',
  Picture: 'Picture',
  DropDown: 'DropDown',
  Linked: 'Linked',
  Button: 'Button',
  CardColumn: 'CardColumn',
  Address: 'Address',
  Tags: 'Tags',
  Phone: 'Phone',
  Email: 'Email',
  ProfileImage: 'ProfileImage',
  Id: 'Id',
  User: 'User',
  Date: 'Date',
  Time: 'Time',
  Formula: 'Formula',
  MultiSelectDropDown: 'MultiSelectDropDown',
} as const;

// Date Format Types
export const DateFormatTypes = {
  ShortDate: 0,
  ShortDateAndTime: 1,
  LongDateAndTime: 2,
  Time: 3,
} as const;

// Type definitions
export type FieldTypeId = (typeof FieldTypeIds)[keyof typeof FieldTypeIds];
export type FieldTypeName = (typeof FieldTypeNames)[keyof typeof FieldTypeNames];
export type DateFormatType = (typeof DateFormatTypes)[keyof typeof DateFormatTypes];

// Lookup function with type safety
export const fieldTypeIdLookup = (name: string): FieldTypeId => {
  if (name === FieldTypeNames.Address || name === FieldTypeNames.Tags) {
    return FieldTypeIds.Text;
  }

  if (name === 'Dropdown') return FieldTypeIds.DropDown;

  // Safe lookup using Object.entries to avoid type assertion
  const entry = Object.entries(FieldTypeIds).find(([key]) => key === name);
  return entry ? (entry[1] as FieldTypeId) : FieldTypeIds.Text;
};

// Lookup function with type safety using constants instead of magic numbers
export const fieldTypeNameLookup = (id: FieldTypeId, fieldName?: string): FieldTypeName => {
  if (fieldName === 'TagList') return FieldTypeNames.Tags;

  switch (id) {
    case FieldTypeIds.Text:
      return FieldTypeNames.Text;
    case FieldTypeIds.Decimal:
      return FieldTypeNames.Decimal;
    case FieldTypeIds.Integer:
      return FieldTypeNames.Integer;
    case FieldTypeIds.DateTime:
      return FieldTypeNames.DateTime;
    case FieldTypeIds.Money:
      return FieldTypeNames.Money;
    case FieldTypeIds.YesNo:
      return FieldTypeNames.YesNo;
    case FieldTypeIds.FileAttachment:
      return FieldTypeNames.FileAttachment;
    case FieldTypeIds.Picture:
      return FieldTypeNames.Picture;
    case FieldTypeIds.DropDown:
      return FieldTypeNames.DropDown;
    case FieldTypeIds.Linked:
      return FieldTypeNames.Linked;
    case FieldTypeIds.Button:
      return FieldTypeNames.Button;
    case FieldTypeIds.CardColumn:
      return FieldTypeNames.CardColumn;
    case FieldTypeIds.Address:
      return FieldTypeNames.Address;
    case FieldTypeIds.Tags:
      return FieldTypeNames.Tags;
    case FieldTypeIds.Phone:
      return FieldTypeNames.Phone;
    case FieldTypeIds.Email:
      return FieldTypeNames.Email;
    case FieldTypeIds.ProfileImage:
      return FieldTypeNames.ProfileImage;
    case FieldTypeIds.Id:
      return FieldTypeNames.Id;
    case FieldTypeIds.User:
      return FieldTypeNames.User;
    case FieldTypeIds.Date:
      return FieldTypeNames.Date;
    case FieldTypeIds.Time:
      return FieldTypeNames.Time;
    case FieldTypeIds.Formula:
      return FieldTypeNames.Formula;
    case FieldTypeIds.MultiSelectDropDown:
      return FieldTypeNames.MultiSelectDropDown;
    default:
      return FieldTypeNames.Text;
  }
};
