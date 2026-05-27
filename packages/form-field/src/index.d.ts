import * as React from 'react';

export interface FormFieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'id'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
  required?: boolean;
  htmlFor?: string;
  hideLabel?: boolean;
  id?: string;
  children?: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps>;
export default FormField;
