import { FieldTypeNames } from '@m-next/types';

export const filterFieldList = (fieldList, excludedTypes) => {
  if (!fieldList) return null;
  if (!excludedTypes || excludedTypes.length === 0) return fieldList;

  let updated = fieldList;
  excludedTypes.forEach((type) => {
    updated = updated.filter((field) => field.type !== type);
  });

  return updated;
};

export const filterAndSplitFieldList = (fieldList, excludedTypes) => {
  if (!fieldList) return null;
  if (!excludedTypes || excludedTypes.length === 0) return fieldList;

  let updated = fieldList;
  excludedTypes.forEach((type) => {
    updated = updated.filter((field) => field.type !== type);
  });

  const datetimeFields = [];

  const newList = updated.filter((f) => {
    if (f.type === FieldTypeNames.DateTime) {
      datetimeFields.push(f);

      return false;
    }

    return true;
  });

  datetimeFields.forEach((field) => {
    if (!field.formatType || !field.formatType.type || field.formatType.type.includes('Date')) {
      newList.push({
        ...field,
        type: FieldTypeNames.Date,
        name: `${field.name}`,
        caption: `${field.caption}`,
      });
    }

    // Commenting out time option until the RTC can be fixed to show correct time during daylight savings.
    // Currently it shows times in EST when it should be EDT.
    /* if (
      (field.formatType?.type && field.formatType.type.includes('Time')) ||
      field.format?.dateType?.includes('Time')
    ) {
      newList.push({
        ...field,
        type: FieldTypeNames.Time,
        name: `${field.name}`,
        caption: `${field.caption} (time)`,
      });
    }
    */
  });

  newList.sort((a, b) => a.name.localeCompare(b.name));

  return newList;
};

export default filterFieldList;
