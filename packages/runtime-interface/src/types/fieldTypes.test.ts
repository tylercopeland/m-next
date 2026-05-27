import {
  FieldTypeIds,
  FieldTypeNames,
  DateFormatTypes,
  fieldTypeIdLookup,
  fieldTypeNameLookup,
  FieldTypeId,
} from './fieldTypes';

describe('FieldTypes Constants', () => {
  test('FieldTypeIds should have the correct values', () => {
    expect(FieldTypeIds.Text).toBe(0);
    expect(FieldTypeIds.Decimal).toBe(1);
    expect(FieldTypeIds.Integer).toBe(2);
    expect(FieldTypeIds.DateTime).toBe(3);
    expect(FieldTypeIds.Money).toBe(4);
    expect(FieldTypeIds.YesNo).toBe(5);
    expect(FieldTypeIds.FileAttachment).toBe(6);
    expect(FieldTypeIds.Picture).toBe(7);
    expect(FieldTypeIds.DropDown).toBe(8);
    expect(FieldTypeIds.Linked).toBe(9);
    expect(FieldTypeIds.Button).toBe(10);
    expect(FieldTypeIds.CardColumn).toBe(11);
    expect(FieldTypeIds.Address).toBe(12);
    expect(FieldTypeIds.Tags).toBe(13);
    expect(FieldTypeIds.Phone).toBe(14);
    expect(FieldTypeIds.Email).toBe(15);
    expect(FieldTypeIds.ProfileImage).toBe(16);
    expect(FieldTypeIds.Id).toBe(17);
    expect(FieldTypeIds.User).toBe(18);
    expect(FieldTypeIds.Date).toBe(19);
    expect(FieldTypeIds.Time).toBe(20);
    expect(FieldTypeIds.Formula).toBe(21);
    expect(FieldTypeIds.MultiSelectDropDown).toBe(22);
  });

  test('FieldTypeNames should have the correct values', () => {
    expect(FieldTypeNames.Text).toBe('Text');
    expect(FieldTypeNames.Decimal).toBe('Decimal');
    expect(FieldTypeNames.Integer).toBe('Integer');
    expect(FieldTypeNames.DateTime).toBe('DateTime');
    expect(FieldTypeNames.Money).toBe('Money');
    expect(FieldTypeNames.YesNo).toBe('YesNo');
    expect(FieldTypeNames.FileAttachment).toBe('FileAttachment');
    expect(FieldTypeNames.Picture).toBe('Picture');
    expect(FieldTypeNames.DropDown).toBe('DropDown');
    expect(FieldTypeNames.Linked).toBe('Linked');
    expect(FieldTypeNames.Button).toBe('Button');
    expect(FieldTypeNames.CardColumn).toBe('CardColumn');
    expect(FieldTypeNames.Address).toBe('Address');
    expect(FieldTypeNames.Tags).toBe('Tags');
    expect(FieldTypeNames.Phone).toBe('Phone');
    expect(FieldTypeNames.Email).toBe('Email');
    expect(FieldTypeNames.ProfileImage).toBe('ProfileImage');
    expect(FieldTypeNames.Id).toBe('Id');
    expect(FieldTypeNames.User).toBe('User');
    expect(FieldTypeNames.Date).toBe('Date');
    expect(FieldTypeNames.Time).toBe('Time');
    expect(FieldTypeNames.Formula).toBe('Formula');
    expect(FieldTypeNames.MultiSelectDropDown).toBe('MultiSelectDropDown');
  });

  test('DateFormatTypes should have the correct values', () => {
    expect(DateFormatTypes.ShortDate).toBe(0);
    expect(DateFormatTypes.ShortDateAndTime).toBe(1);
    expect(DateFormatTypes.LongDateAndTime).toBe(2);
    expect(DateFormatTypes.Time).toBe(3);
  });
});

describe('fieldTypeIdLookup', () => {
  test('should return correct field type ID for valid field names', () => {
    expect(fieldTypeIdLookup('Text')).toBe(FieldTypeIds.Text);
    expect(fieldTypeIdLookup('Decimal')).toBe(FieldTypeIds.Decimal);
    expect(fieldTypeIdLookup('Integer')).toBe(FieldTypeIds.Integer);
    expect(fieldTypeIdLookup('FileAttachment')).toBe(FieldTypeIds.FileAttachment);
    expect(fieldTypeIdLookup('MultiSelectDropDown')).toBe(FieldTypeIds.MultiSelectDropDown);
  });

  test('should handle special case for Address and Tags fields', () => {
    expect(fieldTypeIdLookup('Address')).toBe(FieldTypeIds.Text);
    expect(fieldTypeIdLookup('Tags')).toBe(FieldTypeIds.Text);
  });

  test('should handle special case for Dropdown field', () => {
    expect(fieldTypeIdLookup('Dropdown')).toBe(FieldTypeIds.DropDown);
  });

  test('should return Text field type ID for invalid field names', () => {
    expect(fieldTypeIdLookup('NonExistentFieldType')).toBe(FieldTypeIds.Text);
    expect(fieldTypeIdLookup('')).toBe(FieldTypeIds.Text);
  });
});

describe('fieldTypeNameLookup', () => {
  test('should return correct field type name for valid field IDs', () => {
    expect(fieldTypeNameLookup(FieldTypeIds.Text)).toBe(FieldTypeNames.Text);
    expect(fieldTypeNameLookup(FieldTypeIds.Decimal)).toBe(FieldTypeNames.Decimal);
    expect(fieldTypeNameLookup(FieldTypeIds.FileAttachment)).toBe(FieldTypeNames.FileAttachment);
  });

  test('should handle special case for TagList field name', () => {
    expect(fieldTypeNameLookup(FieldTypeIds.Text, 'TagList')).toBe(FieldTypeNames.Tags);
  });

  test('should return Text field type name for invalid field IDs', () => {
    expect(fieldTypeNameLookup(999 as FieldTypeId)).toBe(FieldTypeNames.Text);
  });
});
describe('fieldTypeNameLookup - comprehensive coverage', () => {
  test('should return correct field type name for each field type ID', () => {
    expect(fieldTypeNameLookup(FieldTypeIds.Text)).toBe(FieldTypeNames.Text);
    expect(fieldTypeNameLookup(FieldTypeIds.Decimal)).toBe(FieldTypeNames.Decimal);
    expect(fieldTypeNameLookup(FieldTypeIds.Integer)).toBe(FieldTypeNames.Integer);
    expect(fieldTypeNameLookup(FieldTypeIds.DateTime)).toBe(FieldTypeNames.DateTime);
    expect(fieldTypeNameLookup(FieldTypeIds.Money)).toBe(FieldTypeNames.Money);
    expect(fieldTypeNameLookup(FieldTypeIds.YesNo)).toBe(FieldTypeNames.YesNo);
    expect(fieldTypeNameLookup(FieldTypeIds.FileAttachment)).toBe(FieldTypeNames.FileAttachment);
    expect(fieldTypeNameLookup(FieldTypeIds.Picture)).toBe(FieldTypeNames.Picture);
    expect(fieldTypeNameLookup(FieldTypeIds.DropDown)).toBe(FieldTypeNames.DropDown);
    expect(fieldTypeNameLookup(FieldTypeIds.Linked)).toBe(FieldTypeNames.Linked);
    expect(fieldTypeNameLookup(FieldTypeIds.Button)).toBe(FieldTypeNames.Button);
    expect(fieldTypeNameLookup(FieldTypeIds.CardColumn)).toBe(FieldTypeNames.CardColumn);
    expect(fieldTypeNameLookup(FieldTypeIds.Address)).toBe(FieldTypeNames.Address);
    expect(fieldTypeNameLookup(FieldTypeIds.Tags)).toBe(FieldTypeNames.Tags);
    expect(fieldTypeNameLookup(FieldTypeIds.Phone)).toBe(FieldTypeNames.Phone);
    expect(fieldTypeNameLookup(FieldTypeIds.Email)).toBe(FieldTypeNames.Email);
    expect(fieldTypeNameLookup(FieldTypeIds.ProfileImage)).toBe(FieldTypeNames.ProfileImage);
    expect(fieldTypeNameLookup(FieldTypeIds.Id)).toBe(FieldTypeNames.Id);
    expect(fieldTypeNameLookup(FieldTypeIds.User)).toBe(FieldTypeNames.User);
    expect(fieldTypeNameLookup(FieldTypeIds.Date)).toBe(FieldTypeNames.Date);
    expect(fieldTypeNameLookup(FieldTypeIds.Time)).toBe(FieldTypeNames.Time);
    expect(fieldTypeNameLookup(FieldTypeIds.Formula)).toBe(FieldTypeNames.Formula);
    expect(fieldTypeNameLookup(FieldTypeIds.MultiSelectDropDown)).toBe(FieldTypeNames.MultiSelectDropDown);
  });

  test('should handle TagList field name override for any field type ID', () => {
    expect(fieldTypeNameLookup(FieldTypeIds.Text, 'TagList')).toBe(FieldTypeNames.Tags);
    expect(fieldTypeNameLookup(FieldTypeIds.Decimal, 'TagList')).toBe(FieldTypeNames.Tags);
    expect(fieldTypeNameLookup(FieldTypeIds.Address, 'TagList')).toBe(FieldTypeNames.Tags);
  });

  test('should ignore fieldName parameter when it is not TagList', () => {
    expect(fieldTypeNameLookup(FieldTypeIds.Decimal, 'SomeOtherName')).toBe(FieldTypeNames.Decimal);
    expect(fieldTypeNameLookup(FieldTypeIds.Address, 'RandomName')).toBe(FieldTypeNames.Address);
    expect(fieldTypeNameLookup(FieldTypeIds.Text, '')).toBe(FieldTypeNames.Text);
  });

  test('should return Text field type name for invalid field IDs', () => {
    expect(fieldTypeNameLookup(999 as FieldTypeId)).toBe(FieldTypeNames.Text);
    expect(fieldTypeNameLookup(-1 as FieldTypeId)).toBe(FieldTypeNames.Text);
    expect(fieldTypeNameLookup(100 as FieldTypeId)).toBe(FieldTypeNames.Text);
  });
});
