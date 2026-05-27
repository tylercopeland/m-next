import * as React from 'react';

export type LinkVariant = 'primary' | 'subtle' | 'button';

export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  variant?: LinkVariant;
  external?: boolean;
  children?: React.ReactNode;
}

export const Link: React.FC<LinkProps>;
export default Link;
