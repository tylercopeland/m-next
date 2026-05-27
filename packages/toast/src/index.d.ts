import * as React from 'react';

export type ToastStatus = 'info' | 'success' | 'warning' | 'error';

export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'top-center'
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center';

export interface ToastOptions {
  /** Optional bold heading rendered above the body. */
  title?: string;
  /** ms before auto-dismiss; `null` keeps the toast until manually dismissed. Falls back to provider's `defaultDuration`. */
  duration?: number | null;
  /** Optional element (typically a button or link) rendered under the body. */
  action?: React.ReactNode;
}

export interface ToastApi {
  info: (message: React.ReactNode, options?: ToastOptions) => string;
  success: (message: React.ReactNode, options?: ToastOptions) => string;
  warning: (message: React.ReactNode, options?: ToastOptions) => string;
  error: (message: React.ReactNode, options?: ToastOptions) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

export interface ToastProviderProps {
  /** Where the toast stack renders. Default `'top-right'`. */
  position?: ToastPosition;
  /** Default ms before auto-dismiss. Pass `null` for persistent-by-default. Default `5000`. */
  defaultDuration?: number | null;
  /** Maximum simultaneous toasts. When exceeded, the oldest is dismissed. Default `5`. */
  maxToasts?: number;
  children?: React.ReactNode;
}

export interface ToastProps {
  id: string;
  status?: ToastStatus;
  title?: React.ReactNode;
  message?: React.ReactNode;
  action?: React.ReactNode;
  duration?: number | null;
  position?: ToastPosition;
  onDismiss?: (id: string) => void;
}

export const ToastProvider: React.FC<ToastProviderProps>;
export const ToastContext: React.Context<ToastApi | null>;
export const Toast: React.FC<ToastProps>;
export function useToast(): ToastApi;

export default ToastProvider;
