export const getIcon = (type) => {
  switch (type) {
    case 'Id':
      return 'star-solid';
    case 'DateTime':
    case 'Date':
    case 'Time':
      return 'calendar';
    case 'Money':
      return 'usd';
    case 'YesNo':
      return 'checkbox';
    case 'Picture':
      return 'picture';
    case 'FileAttachment':
      return 'file';
    case 'DropDown':
      return 'dropdown';
    case 'Decimal':
      return 'decimals';
    case 'Integer':
      return 'integers';
    case 'Linked':
      return 'text';
    case 'Tags':
      return 'tag';
    case 'Phone':
      return 'phone';
    case 'Email':
      return 'email';
    case 'Address':
      return 'location-pin';
    case 'ProfileImage':
      return 'user-male';
    case 'User':
      return 'user';
    case 'Formula':
      return 'code';
    case 'Button':
      return 'button';
    case 'CardColumn':
      return 'screen-V4';
    default:
      return 'text';
  }
};

export const fieldTypeIcons = {
  DateTime: 'calendar',
  Date: 'calendar',
  Time: 'calendar',
  Money: 'usd',
  YesNo: 'checkbox',
  Picture: 'picture',
  FileAttachment: 'file',
  DropDown: 'dropdown',
  Decimal: 'decimals',
  Integer: 'integers',
  Linked: 'text',
  Tags: 'tag',
  Phone: 'phone',
  Email: 'email',
  Address: 'location-pin',
  Text: 'text',
  ProfileImage: 'user-male',
  Id: 'star-solid',
  User: 'user',
  Formula: 'code',
  Button: 'button',
  CardColumn: 'screen-V4',
};

export const fieldTypeIdIcons = {
  0: 'text',
  1: 'decimals',
  2: 'integers',
  3: 'calendar',
  4: 'usd',
  5: 'checkbox',
  6: 'file',
  7: 'picture',
  8: 'dropdown',
  9: 'text',
  10: 'button',
  11: 'screen-V4',
  12: 'location-pin',
  13: 'tag',
  14: 'phone',
  15: 'email',
  16: 'user-male',
  17: 'star-solid',
  18: 'user',
  19: 'calendar',
  20: 'calendar',
  21: 'code',
};

export default getIcon;
