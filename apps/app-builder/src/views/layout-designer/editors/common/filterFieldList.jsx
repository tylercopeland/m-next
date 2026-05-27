const filterFieldList = (fieldList, excludedTypes) => {
  if (!fieldList) return null;
  if (!excludedTypes || excludedTypes.length === 0) return fieldList;

  let updated = fieldList;
  excludedTypes.forEach((type) => {
    updated = updated.filter((field) => field.type !== type);
  });

  return updated;
};

export default filterFieldList;
