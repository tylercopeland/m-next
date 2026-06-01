import * as React from 'react';

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  isOpen?: boolean;
  onToggle?: (next: boolean) => void;
  width?: number;
  collapsedWidth?: number;
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

export interface SidebarGroupProps {
  title?: React.ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  expanded?: boolean;
  onExpandedChange?: (next: boolean) => void;
  children?: React.ReactNode;
}

export interface SidebarItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLElement>, 'type'> {
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
  href?: string;
  as?: React.ElementType;
  children?: React.ReactNode;
}

declare const Sidebar: React.ForwardRefExoticComponent<
  SidebarProps & React.RefAttributes<HTMLElement>
> & {
  Header: React.FC<{ children?: React.ReactNode }>;
  Body: React.FC<{ children?: React.ReactNode }>;
  Footer: React.FC<{ children?: React.ReactNode }>;
  Group: React.FC<SidebarGroupProps>;
  Item: React.ForwardRefExoticComponent<
    SidebarItemProps & React.RefAttributes<HTMLElement>
  >;
};

export declare const Header: React.FC<{ children?: React.ReactNode }>;
export declare const Body: React.FC<{ children?: React.ReactNode }>;
export declare const Footer: React.FC<{ children?: React.ReactNode }>;
export declare const Group: React.FC<SidebarGroupProps>;
export declare const Item: React.ForwardRefExoticComponent<
  SidebarItemProps & React.RefAttributes<HTMLElement>
>;

export default Sidebar;
