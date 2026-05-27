import * as React from 'react';

export type EmptyStateVariant = 'subtle' | 'bordered' | 'banner';

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  icon?: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: EmptyStateVariant;
}

export const EmptyState: React.FC<EmptyStateProps>;
export default EmptyState;
