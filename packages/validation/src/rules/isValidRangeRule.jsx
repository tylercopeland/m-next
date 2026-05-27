const getMessage = (message, customMessage) => {
  if (customMessage) return customMessage;
  return message;
};

const isValidRangeRule = (value, min, max, customMessage) => {
  if (value === undefined || value === null) {
    if (min && max) {
      return getMessage(`Must be between ${min} and ${max}.`, customMessage);
    }

    if (min) {
      return getMessage(`Must be at least ${min}.`, customMessage);
    }
  } else {
    const trimmedValue = Number(value.toString().trim());
    if (min && max && (trimmedValue < min || trimmedValue > max)) {
      return getMessage(`Must be between ${min} and ${max}.`, customMessage);
    }

    if (min && trimmedValue < min) {
      return getMessage(`Must be at least ${min}.`, customMessage);
    }

    if (max && trimmedValue > max) {
      return getMessage(`Must be at most ${max}.`, customMessage);
    }
  }

  return null;
};

export default isValidRangeRule;
