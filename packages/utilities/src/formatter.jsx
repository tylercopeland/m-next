import { FieldTypeNames, getIcon } from '@m-next/types';
import { format, isDate, parseISO } from 'date-fns';

const dateFormats = {
  shortDateFormat: 'MMM-dd-yyyy', // support MMM-DD-YYYY || DD/MM/YYYY || MM/DD/YYYY || YYYY-MM-DD
  longDateFormat: 'EEEE, MMMM dd, yyyy', // support ddd, MMM DD, YYYY  ||  dddd, MMMM DD, YYYY || MMMM DD, YYYY
  timeFormat: 'hh:mm a', // support hh:mm A || HH:mm || hh:mm:ss A || HH:mm:ss
  hourFormat: 'ha', // support hh:mm A || HH:mm || hh:mm:ss A || HH:mm:ss
  dayOfWeekFormat: 'EEE', // support hh:mm A || HH:mm || hh:mm:ss A || HH:mm:ss
  monthFormat: 'MMM', // support hh:mm A || HH:mm || hh:mm:ss A || HH:mm:ss
  monthAndYearFormat: 'MMM-yyyy', // support MMM-YYYY || MM-YYYY || MMM YYYY || MMMM YYYY
  dayFormat: 'dd',
  yearFormat: 'yyyy',
};

const formatNumber = (value, options) => {
  let rounding = 10 ** options.decimalPlace;
  if (rounding === 0) {
    rounding = 1;
  }
  let parsed = Number(value);

  if (Number.isNaN(parsed)) {
    parsed = 0;
  }
  let formatted = (Math.round((parsed + Number.EPSILON) * rounding) / rounding)
    .toFixed(options.decimalPlace)
    .toString();

  if (
    (typeof options.useThousandsSeparator === 'string' &&
      options.useThousandsSeparator.toString().toLowerCase() === 'yes') ||
    (typeof options.useThousandsSeparator === 'boolean' && options.useThousandsSeparator)
  ) {
    const parts = formatted.split('.');

    formatted = parts[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    if (parts.length > 1) {
      formatted = `${formatted}.${parts[1]}`;
    }
  }

  if (options.useNegativeParenthesis && formatted.indexOf('-') >= 0) {
    formatted = `${formatted.replace('-', '(')})`;
  }
  return formatted;
};

export const formatDate = (dateFormat, rawdate, displayPreferences) => {
  if (!rawdate) return '';
  let date = rawdate;
  if (!isDate(date)) {
    date = parseISO(rawdate);
  }
  if (date.toString().toLowerCase().includes('invalid')) {
    return rawdate;
  }

  switch (dateFormat) {
    case 0:
    case 'Short Date':
      return format(date, displayPreferences?.shortDateFormat ?? dateFormats.shortDateFormat);
    case 1:
    case 'Short Date and Time':
      return format(
        date,
        `${displayPreferences?.shortDateFormat ?? dateFormats.shortDateFormat} ${
          displayPreferences?.timeFormat ?? dateFormats.timeFormat
        }`,
      );
    case 2:
    case 'Long Date and Time':
      return format(
        date,
        `${displayPreferences?.longDateFormat ?? dateFormats.longDateFormat} ${
          displayPreferences?.timeFormat ?? dateFormats.timeFormat
        }`,
      );
    case 3:
    case 'Time':
      return format(date, displayPreferences?.timeFormat ?? dateFormats.timeFormat);
    case 4:
    case 'Long Date':
      return format(date, displayPreferences?.longDateFormat ?? dateFormats.longDateFormat);
    case 5:
    case 'Hour':
      return format(date, displayPreferences?.hourFormat ?? dateFormats.hourFormat);
    case 6:
    case 'Day':
      return format(date, dateFormats.dayFormat);
    case 7:
    case 'Day of Week':
      return format(date, (displayPreferences?.dayOfWeekFormat ?? dateFormats.dayOfWeekFormat).replaceAll('d', 'E'));
    case 8:
    case 'Month':
      return format(date, displayPreferences?.monthFormat ?? dateFormats.monthFormat);
    case 9:
    case 'Month and Year':
      return format(date, displayPreferences?.monthAndYearFormat ?? dateFormats.monthAndYearFormat);
    case 10:
    case 'Year':
      return format(date, dateFormats.yearFormat);
    default:
      return date.toString();
  }
};

export const formatValue = (type, value, options, displayPreferences) => {
  if (value === null || type === null || value === undefined) return value;

  if (!Number.isNaN(value.toString().replace(',', '').replace('(', '-').replace(')', ''))) {
    const numberFormat = {
      decimalPlace: 2,
      useThousandsSeparator: true,
      useNegativeParenthesis: false,
    };
    if (options) {
      if (!Number.isNaN(Number(options.decimalPlace))) {
        numberFormat.decimalPlace = options.decimalPlace;
      }
      if (options.useThousandsSeparator !== null && options.useThousandsSeparator !== undefined) {
        numberFormat.useThousandsSeparator = options.useThousandsSeparator;
      } else if (displayPreferences) {
        numberFormat.useThousandsSeparator = displayPreferences.useThousandsSeparator;
      }
      if (options.useNegativeParenthesis) {
        numberFormat.useNegativeParenthesis = options.useNegativeParenthesis;
      } else if (displayPreferences && displayPreferences.negativeNumberFormat) {
        numberFormat.useNegativeParenthesis = !displayPreferences.negativeNumberFormat.includes('-');
      }
    }
    if (type === 'Integer') {
      numberFormat.decimalPlace = 0;
      if (value === '' || value === null || value === undefined) {
        return '';
      }
      return formatNumber(value, numberFormat);
    }
    if (type === 'Decimal') {
      if (value === '' || value === null || value === undefined) {
        return '';
      }
      return formatNumber(value, numberFormat);
    }
    if (type === 'Money') {
      return formatNumber(value, numberFormat);
    }
    if (type === 'Number') {
      if (value === '' || value === null || value === undefined) {
        return '';
      }
      return formatNumber(value, numberFormat);
    }
    if (type === FieldTypeNames.Phone) {
      const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

      if (phoneRegex.test(value)) {
        return value.replace(phoneRegex, '($1) $2-$3');
      }
      return value;
    }

    if (type === FieldTypeNames.Text) {
      return value;
    }
  }

  if (type === FieldTypeNames.DateTime || type === FieldTypeNames.Date) {
    return formatDate(options.dateFormat, value, displayPreferences);
  }

  if (Number.isNaN(value) && (type === 'Integer' || type === 'Decimal' || type === 'Money')) {
    return '';
  }
  return value.toString();
};

function _getCurrencySymbol(currencyCode, homeCurrencyCode) {
  const currencySymbolFull = (0)
    .toLocaleString('en', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    .replace(/\d/g, '')
    .trim();
  const currencySymbolOnly = currencySymbolFull.replace(/[\d\s\w]/g, '');
  const homeCurrencySymbolFull = (0)
    .toLocaleString('en', {
      style: 'currency',
      currency: homeCurrencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    .replace(/\d/g, '')
    .trim();
  const homeCurrencySymbolOnly = homeCurrencySymbolFull.replace(/[\d\s\w]/g, '');

  if (currencyCode === homeCurrencyCode) {
    if (homeCurrencySymbolOnly !== '') {
      return homeCurrencySymbolOnly;
    }
    return homeCurrencySymbolFull;
  }
  if (currencySymbolOnly !== '') {
    if (currencySymbolOnly === currencySymbolFull && currencySymbolOnly === homeCurrencySymbolOnly) {
      return currencyCode.slice(0, 2) + currencySymbolOnly;
    }
  }
  return currencySymbolFull;
}

function _isValidCurrencyCode(currencyCode) {
  return typeof currencyCode === 'string' && currencyCode.length === 3 && /^[A-Z]{3}$/.test(currencyCode);
}

export const formatMoneyValue = (
  value,
  currencyCode,
  homeCurrencyCode,
  opts = { rounding: 2, thousandsSeparator: ',', decimalSeparator: '.' },
) => {
  let decimalPlaces = 2;
  if (typeof opts?.rounding === 'string' && !Number.isNaN(Number(opts?.rounding))) {
    decimalPlaces = Number(opts.rounding);
  } else if (typeof opts?.rounding === 'number') {
    decimalPlaces = opts?.rounding !== 0 ? opts?.rounding : 0;
  }
  const customThousandsSeparator = opts?.thousandsSeparator || ',';
  const customDecimalSeparator = opts?.decimalSeparator || '.';

  const numericValue = Number(value) || 0;
  const isNegative = numericValue < 0;
  const absoluteValue = Math.abs(numericValue);

  // Use Intl.NumberFormat for base formatting, then customize separators
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
    useGrouping: true,
  });

  let numberString = formatter.format(absoluteValue);

  // Replace standard separators with custom ones if needed
  if (customThousandsSeparator !== ',') {
    numberString = numberString.replace(/,/g, customThousandsSeparator);
  }
  if (customDecimalSeparator !== '.') {
    numberString = numberString.replace(/\./g, customDecimalSeparator);
  }

  // Handle currency symbols
  let result;
  if (currencyCode && currencyCode !== '' && homeCurrencyCode && homeCurrencyCode !== '') {
    const isValidCurrency = _isValidCurrencyCode(currencyCode);
    if (!isValidCurrency) {
      result = numberString;
    }
    const currencySymbol = _getCurrencySymbol(currencyCode, homeCurrencyCode);
    if (currencySymbol.length < 2) {
      result = currencySymbol + numberString;
    } else {
      result = `${currencySymbol} ${numberString}`;
    }
  } else {
    result = numberString;
  }

  return isNegative ? `-(${result})` : result;
};

export const formatFieldValue = (type, displayOptions, value, displayPreferences) => {
  const formatOptions = {};
  if (type === FieldTypeNames.DateTime || type === FieldTypeNames.Date) {
    formatOptions.dateFormat = displayOptions?.dateFormat ?? 1;
  }
  if (type === FieldTypeNames.Decimal) {
    formatOptions.decimalPlace = displayOptions?.decimalRounding ?? 2;
  }
  if (type === FieldTypeNames.Money) {
    formatOptions.decimalPlace = displayOptions?.decimalRounding ?? 2;
  }

  let formattedValue = formatValue(type, value, formatOptions, displayPreferences);

  if (type === FieldTypeNames.YesNo) {
    let trueValue = 'True';
    let falseValue = 'False';
    if (displayOptions?.trueValue) {
      trueValue = displayOptions?.trueValue;
    }
    if (displayOptions?.falseValue) {
      falseValue = displayOptions?.falseValue;
    }
    formattedValue = value === 'true' || value === 'True' || value === true ? trueValue : falseValue;
  }

  return formattedValue;
};

export const formatFieldList = (
  fieldList,
  dataModelId,
  projection,
  data,
  displayPreferences,
  includedFieldTypes,
  dropdownFormatting,
  splitFields,
  includeImages = false,
) => {
  if (!fieldList) return null;
  const grouped = [{ label: dataModelId, options: [] }];
  fieldList.forEach((item) => {
    const source = item.sourceModel ?? dataModelId;
    let index = grouped.findIndex((x) => x.label === source);
    if (index < 0) {
      grouped.push({ label: source, options: [] });

      index = grouped.length - 1;
    }

    const existingMatch = projection?.fields.find((existing) => existing.name === item.name);

    let lines = null;
    if (data && data[item.name]) {
      lines = [data[item.name]];
      if (item.type === FieldTypeNames.DateTime) {
        lines = [formatDate(1, data[item.name], displayPreferences)];
      }

      if (item.type === FieldTypeNames.Address) {
        let combined = '';
        let comma = false;
        if (data[item.name].Line1) {
          combined += data[item.name].Line1;
          comma = true;
        }
        if (data[item.name].Line2) {
          combined += `${comma ? ', ' : ''}${data[item.name].Line2}`;
          comma = true;
        }
        if (data[item.name].Line3) {
          combined += `${comma ? ', ' : ''}${data[item.name].Line3}`;
          comma = true;
        }
        if (data[item.name].Line4) {
          combined += `${comma ? ', ' : ''}${data[item.name].Line4}`;
          comma = true;
        }
        if (data[item.name].Line5) {
          combined += `${comma ? ', ' : ''}${data[item.name].Line5}`;
          comma = true;
        }
        if (data[item.name].City) {
          combined += `${comma ? ', ' : ''}${data[item.name].City}`;
          comma = true;
        }
        if (data[item.name].PostalCode) {
          combined += `${comma ? ', ' : ''}${data[item.name].PostalCode}`;
          comma = true;
        }
        if (data[item.name].Country) {
          combined += `${comma ? ', ' : ''}${data[item.name].Country}`;
          comma = true;
        }

        lines = [combined];
      }
    }

    if (existingMatch) {
      return;
    }

    if (!includeImages && (item.type === FieldTypeNames.Picture || item.type === FieldTypeNames.FileAttachment)) {
      return;
    }

    if (!includedFieldTypes || includedFieldTypes.includes(item.type)) {
      let label = item.caption;
      if (dropdownFormatting) {
        if (item.caption ? item.caption.includes('_record id') : item.name.includes('_record id')) {
          label = item.caption.replace('_record id', ' - RecordID');
          const matchDD = fieldList.filter((x) => x.name === item.name.replace('_RecordID', ''));
          const sourceDD = matchDD.length > 0 && matchDD[0].sourceModel ? matchDD[0].sourceModel : dataModelId;

          index = grouped.findIndex((x) => x.label === sourceDD);
          if (index < 0) {
            grouped.push({ label: source, options: [] });

            index = grouped.length - 1;
          }
        }

        if (item.type === FieldTypeNames.DropDown) {
          label = `${item.caption} - Display`;
        }
      }
      grouped[index].options.push({
        value: splitFields ? `${item.name}-${item.type}` : item.name,
        trueValue: item.name,
        label,
        icon: getIcon(item.type),
        lines,
        fieldType: item.type,
        source,
      });
    }
  });

  grouped.forEach((item) => {
    if (item.label !== dataModelId) {
      // eslint-disable-next-line no-param-reassign
      item.label = `Linked via ${item.label}`;
    }
  });

  return grouped;
};
