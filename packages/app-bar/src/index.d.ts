import * as React from 'react';

export interface AppBarProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  height?: number;
  borderless?: boolean;
  sticky?: boolean;
  ariaLabel?: string;
  children?: React.ReactNode;

  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.Ref<HTMLElement> | null;
  /** @deprecated No longer has any effect. */
  isV4Design?: boolean;
  /** @deprecated No longer has any effect — use CSS media queries. */
  isMobile?: boolean;
  /** @deprecated Use `className`. */
  legacyClass?: string | null;
  /** @deprecated No longer has any effect. */
  displayAuto?: boolean;
  /** @deprecated No longer has any effect. */
  compactStyle?: boolean;
}

declare const AppBar: React.ForwardRefExoticComponent<
  AppBarProps & React.RefAttributes<HTMLElement>
> & {
  Start: React.FC<{ children?: React.ReactNode }>;
  Center: React.FC<{ children?: React.ReactNode }>;
  End: React.FC<{ children?: React.ReactNode }>;
};

export declare const Start: React.FC<{ children?: React.ReactNode }>;
export declare const Center: React.FC<{ children?: React.ReactNode }>;
export declare const End: React.FC<{ children?: React.ReactNode }>;

export default AppBar;
