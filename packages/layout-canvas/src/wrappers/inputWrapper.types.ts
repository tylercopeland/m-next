import type { ActionHandler } from '../actions/types';

export interface InputWrapperProps {
  id: string;
  control?: Record<string, unknown>; // Allow control to be passed directly (for runtime mode)
  mode?: 'designer' | 'runtime';
  onControlClick?: (id: string) => void;
  isSelected?: boolean;
  actionHandler?: ActionHandler | null;
  screenId?: string;
  recordId?: string;
  screenState?: Record<string, unknown>;
  runtimeUpdateControlValue?: ((componentId: string, value: unknown) => void) | null;
  runtimeUpdateControlProperty?: ((componentId: string, property: string, value: unknown) => void) | null;
}
