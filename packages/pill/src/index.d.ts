import { ComponentType, ReactNode } from 'react';

interface PillProps {
  size?: 'narrow' | 'regular';
  variant?: 'subtle' | 'solid' | 'ghost';
  colorScheme?: string;
  maxWidth?: string | number;
  label?: string;
  children?: ReactNode;
  [key: string]: unknown;
}

declare const Pill: ComponentType<PillProps>;
export default Pill;
