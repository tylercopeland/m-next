export function ConvertJsonKeysToCamelCase(response: any) {
    
  const newResponse: { [key: string]: any } = {};
    
  if (response instanceof Array) {
    return response.map(function(value) {
        if (typeof value === "object") {
          value = ConvertJsonKeysToCamelCase(value)
        }
        return value
    })
  } else {
    for (const origKey in response) {
      if (Object.prototype.hasOwnProperty.call(response, origKey)) {
        const newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString()
        let value = response[origKey]
        if (value instanceof Array || (value !== null && value.constructor === Object)) {
          value = ConvertJsonKeysToCamelCase(value)
        }
        newResponse[newKey] = value;
        // exceptions to keep origKey
        if (['FieldType'].includes(origKey)) newResponse[origKey] = value;

      }
    }
  }

  return newResponse
}