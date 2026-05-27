import * as React from 'react';

export type AlertStatus = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: AlertStatus;
  title?: React.ReactNode;
  children?: React.ReactNode;
  action?: React.ReactNode;
  onDismiss?: () => void;
}

export const Alert: React.FC<AlertProps>;
export default Alert;
