const isValidEmailRule = (value, customMessage) => {
  if (value === undefined || value === null || value.toString().trim().length === 0) {
    if (customMessage) return customMessage;

    return 'Invalid email address.';
  }

  // eslint-disable-next-line no-useless-escape
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
    return null;
  }

  if (customMessage) return customMessage;

  return 'Invalid email address.';
};

export default isValidEmailRule;
