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
};

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
};

export const fieldTypeIdLookup = (name) => {
  if (name === FieldTypeNames.Address || name === FieldTypeNames.Tags) {
    return FieldTypeIds.Text;
  }

  if (name === 'Dropdown') return FieldTypeIds.DropDown;

  return FieldTypeIds[name];
};

export const fieldTypeNameLookup = (id, fieldName) => {
  if (fieldName === 'TagList') return FieldTypeNames.Tags;

  switch (id) {
    case 0:
      return FieldTypeNames.Text;
    case 1:
      return FieldTypeNames.Decimal;
    case 2:
      return FieldTypeNames.Integer;
    case 3:
      return FieldTypeNames.DateTime;
    case 4:
      return FieldTypeNames.Money;
    case 5:
      return FieldTypeNames.YesNo;
    case 6:
      return FieldTypeNames.FileAttachment;
    case 7:
      return FieldTypeNames.Picture;
    case 8:
      return FieldTypeNames.DropDown;
    case 9:
      return FieldTypeNames.Linked;
    case 10:
      return FieldTypeNames.Address;
    case 11:
      return FieldTypeNames.Button;
    case 12:
      return FieldTypeNames.CardColumn;
    case 13:
      return FieldTypeNames.Tags;
    case 14:
      return FieldTypeNames.Phone;
    case 15:
      return FieldTypeNames.Email;
    case 16:
      return FieldTypeNames.ProfileImage;
    case 17:
      return FieldTypeNames.Id;
    case 18:
      return FieldTypeNames.User;
    case 19:
      return FieldTypeNames.Date;
    case 20:
      return FieldTypeNames.Time;
    case 21:
      return FieldTypeNames.Formula;
    case 22:
      return FieldTypeNames.MultiSelectDropDown;
    default:
      return FieldTypeNames.Text;
  }
};

export const DateFormatTypes = {
  ShortDate: 0,
  ShortDateAndTime: 1,
  LongDateAndTime: 2,
  Time: 3,
};
