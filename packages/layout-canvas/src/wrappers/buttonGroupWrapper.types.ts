import type { ButtonGroupControl } from '@m-next/runtime-interface';
import type { ActionHandler } from '../actions/types';

export interface ButtonGroupWrapperProps {
  id: string;
  onControlClick: (id: string) => void;
  control?: ButtonGroupControl; // Allow control to be passed directly (for runtime mode)
  mode?: 'designer' | 'runtime';
  // Runtime action props
  actionHandler?: ActionHandler;
  screenId?: string;
  recordId?: string;
  screenState?: unknown;
  // Callback to update control properties in runtime (e.g., clearing hasFocus)
  runtimeUpdateControlProperty?: (controlId: string, property: string, value: unknown) => void;
}
