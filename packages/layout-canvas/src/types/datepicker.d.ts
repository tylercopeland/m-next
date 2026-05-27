declare module '@m-next/datepicker' {
  import * as React from 'react';

  export interface DatePickerProps {
    id?: string;
    caption?: string | null;
    value?: Date | string | null;
    onChange?: (date: Date | null) => void;
    width?: string | number;
    legacyClass?: string;
    isV4Design?: boolean;
    disabled?: boolean;
    placeholder?: string;
    useDateFormatPlaceholder?: boolean;
    format?: string;
    formatType?: string;
    compactStyle?: boolean;
    displayPreferences?: Record<string, string>;
    componentVersion?: string;
    [key: string]: unknown;
  }

  const DatePicker: React.FC<DatePickerProps>;
  export default DatePicker;
}
