import setFormat from './util';

describe('setFormat', () => {
  it('should return short date format by default for Date input type', () => {
    expect(setFormat('', 'Date')).toBe('MMM-dd-yyyy');
  });

  it('should return time format by default for Time input type', () => {
    expect(setFormat('', 'Time')).toBe('hh:mm a');
  });

  it('should return short date and time format by default for DateTime input type', () => {
    expect(setFormat('')).toBe('MMM-dd-yyyy hh:mm a');
  });

  it('should return custom short date format if provided', () => {
    const displayPreferences = { shortDateFormat: 'DD/MM/YYYY' };
    expect(setFormat('Short Date', 'Date', displayPreferences)).toBe('DD/MM/YYYY');
  });

  it('should return custom time format if provided', () => {
    const displayPreferences = { timeFormat: 'HH:mm' };
    expect(setFormat('Time', 'Time', displayPreferences)).toBe('HH:mm');
  });

  it('should return long date and time format', () => {
    expect(setFormat('Long Date and Time')).toBe('EEEE, MMMM dd, yyyy hh:mm a');
  });

  it('should return long date format', () => {
    expect(setFormat('Long Date')).toBe('EEEE, MMMM dd, yyyy');
  });

  it('should return hour format', () => {
    expect(setFormat('Hour')).toBe('ha');
  });

  it('should return day format', () => {
    expect(setFormat('Day')).toBe('dd');
  });

  it('should return day of week format', () => {
    expect(setFormat('Day of Week')).toBe('ddd');
  });

  it('should return month format', () => {
    expect(setFormat('Month')).toBe('MMM');
  });

  it('should return month and year format', () => {
    expect(setFormat('Month and Year')).toBe('MMM-yyyy');
  });

  it('should return year format', () => {
    expect(setFormat('Year')).toBe('yyyy');
  });

  it('should return default format for unknown format type', () => {
    expect(setFormat('Unknown')).toBe('MMM-dd-yyyy hh:mm a');
  });
});
