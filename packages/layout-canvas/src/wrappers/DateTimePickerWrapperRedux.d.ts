import { ComponentType } from 'react';
import type { ActionHandler } from '../actions/types';

interface DateTimePickerWrapperReduxProps {
  id: string;
  control?: Record<string, unknown>;
  mode?: 'designer' | 'runtime';
  onControlClick?: (id: string) => void;
  isSelected?: boolean;
  actionHandler?: ActionHandler;
  screenId?: string;
  recordId?: string;
  screenState?: Record<string, unknown>;
  runtimeUpdateControlValue?: (controlId: string, value: unknown) => void;
}

declare const DateTimePickerWrapperRedux: ComponentType<DateTimePickerWrapperReduxProps>;

export default DateTimePickerWrapperRedux;
