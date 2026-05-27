const isRequiredRule = (value, customMessage) => {
  if (value === undefined || value === null || value.toString().trim().length === 0) {
    if (customMessage) return customMessage;

    return 'Field is required.';
  }

  return null;
};

export default isRequiredRule;
