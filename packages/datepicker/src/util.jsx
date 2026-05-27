const dateFormats = {
  shortDateFormat: 'MMM-dd-yyyy', // support MMM-DD-YYYY || DD/MM/YYYY || MM/DD/YYYY || YYYY-MM-DD
  longDateFormat: 'EEEE, MMMM dd, yyyy', // support ddd, MMM DD, YYYY  ||  dddd, MMMM DD, YYYY || MMMM DD, YYYY
  timeFormat: 'hh:mm a', // support hh:mm A || HH:mm || hh:mm:ss A || HH:mm:ss
  hourFormat: 'ha', // support hh:mm A || HH:mm || hh:mm:ss A || HH:mm:ss
  dayOfWeekFormat: 'ddd', // support hh:mm A || HH:mm || hh:mm:ss A || HH:mm:ss
  monthFormat: 'MMM', // support hh:mm A || HH:mm || hh:mm:ss A || HH:mm:ss
  monthAndYearFormat: 'MMM-yyyy', // support MMM-YYYY || MM-YYYY || MMM YYYY || MMMM YYYY
  dayFormat: 'dd',
  yearFormat: 'yyyy',
};

export const dateFormatTypes = {
  SHORT_DATE: 'Short Date',
  SHORT_DATE_AND_TIME: 'Short Date and Time',
  LONG_DATE_AND_TIME: 'Long Date and Time',
  TIME: 'Time',
  LONG_DATE: 'Long Date',
  HOUR: 'Hour',
  DAY: 'Day',
  DAY_OF_WEEK: 'Day of Week',
  MONTH: 'Month',
};

export const dateFormatList = [
  { value: dateFormatTypes.SHORT_DATE, label: 'Short Date' },
  { value: dateFormatTypes.SHORT_DATE_AND_TIME, label: 'Short Date and Time' },
  { value: dateFormatTypes.LONG_DATE, label: 'Long Date' },
  { value: dateFormatTypes.LONG_DATE_AND_TIME, label: 'Long Date and Time' },
  { value: dateFormatTypes.TIME, label: 'Time' },
  { value: dateFormatTypes.HOUR, label: 'Hour' },
  { value: dateFormatTypes.DAY, label: 'Day' },
  { value: dateFormatTypes.DAY_OF_WEEK, label: 'Day of Week' },
  { value: dateFormatTypes.MONTH, label: 'Month' },
];

export const setFormat = (formatType = '', inputType = 'DateTime', displayPreferences = {}) => {
  let newFormatType = formatType;

  // if there is no format, set a default
  if (formatType === '') {
    if (inputType === 'Date') {
      newFormatType = 'Short Date';
    } else if (inputType === 'Time') {
      newFormatType = 'Time';
    } else {
      newFormatType = 'Short Date and Time';
    }
  }

  switch (newFormatType) {
    case 0:
    case 'Short Date':
      return displayPreferences?.shortDateFormat ?? dateFormats.shortDateFormat;
    case 1:
    case 'Short Date and Time':
      return `${displayPreferences?.shortDateFormat ?? dateFormats.shortDateFormat} ${
        displayPreferences?.timeFormat ?? dateFormats.timeFormat
      }`;

    case 2:
    case 'Long Date and Time':
      return `${displayPreferences?.longDateFormat ?? dateFormats.longDateFormat} ${
        displayPreferences?.timeFormat ?? dateFormats.timeFormat
      }`;

    case 3:
    case 'Time':
      return displayPreferences?.timeFormat ?? dateFormats.timeFormat;
    case 4:
    case 'Long Date':
      return displayPreferences?.longDateFormat ?? dateFormats.longDateFormat;
    case 'Hour':
      return displayPreferences?.hourFormat ?? dateFormats.hourFormat;
    case 'Day':
      return dateFormats.dayFormat;
    case 'Day of Week':
      return displayPreferences?.dayFormat ?? dateFormats.dayOfWeekFormat;
    case 'Month':
      return displayPreferences?.monthFormat ?? dateFormats.monthFormat;
    case 'Month and Year':
      return displayPreferences?.yearFormat ?? dateFormats.monthAndYearFormat;
    case 'Year':
      return dateFormats.yearFormat;
    default:
      return `${displayPreferences?.shortDateFormat ?? dateFormats.shortDateFormat} ${
        displayPreferences?.timeFormat ?? dateFormats.timeFormat
      }`;
  }
};

export const setPlaceholderFormat = (formatType = '', inputType = 'DateTime', displayPreferences = {}) => {
  const dateFormat = setFormat(formatType, inputType, displayPreferences);
  // Convert date-fns format tokens to more user-friendly display format for placeholder
  return dateFormat.replace(/E/g, 'D');
};

export default setFormat;
