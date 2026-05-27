const getMessage = (message, customMessage) => {
  if (customMessage) return customMessage;
  return message;
};

const isValidLengthRule = (value, minLength, maxLength, customMessage) => {
  if (value === undefined || value === null) {
    if (minLength && maxLength) {
      return getMessage(`Must be between ${minLength} and ${maxLength} characters.`, customMessage);
    }

    if (minLength) {
      return getMessage(`Must be at least ${minLength} characters.`, customMessage);
    }
  } else {
    const trimmedValue = value.toString().trim().length;
    if (minLength && maxLength && (trimmedValue < minLength || trimmedValue > maxLength)) {
      return getMessage(`Must be between ${minLength} and ${maxLength} characters.`, customMessage);
    }

    if (minLength && trimmedValue < minLength) {
      return getMessage(`Must be at least ${minLength} characters.`, customMessage);
    }

    if (maxLength && trimmedValue > maxLength) {
      return getMessage(`Must be at most ${maxLength} characters.`, customMessage);
    }
  }

  return null;
};

export default isValidLengthRule;
