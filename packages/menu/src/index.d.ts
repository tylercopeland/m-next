/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';

export interface MenuListProps {
  /** Optional — auto-generated if omitted. */
  id?: string | number;
  /** Whether the menu is currently open. */
  open?: boolean;
  /** Called when the menu requests to close (outside click, ESC). */
  onClose?: (e?: any) => void;
  /** Element the popover anchors to (positioning origin). */
  anchorEl?: HTMLElement | { current: HTMLElement | null } | (() => HTMLElement | null) | null;
  /** MenuItem children (or any ReactNode). */
  children?: React.ReactNode;
  /** Container width. */
  width?: string | number;
  /** Max container height (enables scrolling when exceeded). */
  maxHeight?: string | number;
  /** Optional header label rendered above items. */
  header?: string;
  /** Horizontal popover alignment. */
  horizontalAlign?: 'left' | 'center' | 'right' | string;
  /** Whether the popover renders inline rather than via a portal. */
  inline?: boolean;
  /** Position relative to the closest positioned parent. */
  relativeToParent?: boolean;
  marginVertical?: number;
  marginHorizontal?: number;
  marginThreshold?: number;
  shiftLeft?: number;
  shiftDown?: number;
  popoverStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  className?: string;

  // ============ Deprecated — soft-shimmed ============
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.Ref<any>;

  // ============ Silently ignored ============
  /** @deprecated No longer has any effect. */
  isV4Design?: boolean;
  /** @deprecated No longer has any effect — use CSS media queries. */
  isMobile?: boolean;
  /** @deprecated No longer has any effect — don't render instead. */
  hidden?: boolean;
  /** @deprecated No longer has any effect. */
  displayAuto?: boolean;
  /** @deprecated Use `className`. */
  legacyClass?: string;
  /** @deprecated No longer has any effect. */
  compactStyle?: boolean;
}

export interface MenuItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'id'> {
  /** Optional — auto-generated if omitted. */
  id?: string | number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => void;
  selected?: boolean;
  active?: boolean;
  disabled?: boolean;

  // ============ Deprecated — soft-shimmed ============
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.Ref<any>;

  // ============ Silently ignored ============
  /** @deprecated No longer has any effect. */
  isV4Design?: boolean;
  /** @deprecated No longer has any effect — use CSS media queries. */
  isMobile?: boolean;
  /** @deprecated No longer has any effect — don't render instead. */
  hidden?: boolean;
  /** @deprecated No longer has any effect. */
  displayAuto?: boolean;
  /** @deprecated Use `className`. */
  legacyClass?: string;
  /** @deprecated No longer has any effect. */
  compactStyle?: boolean;
}

export interface IconMenuListProps {
  /** Optional — auto-generated if omitted. */
  id?: string | number;
  children?: React.ReactNode;
  /** Called when the menu closes (selection or outside click). */
  onClose?: () => void;
  /** Called whenever open state changes; receives the new open state. */
  onToggle?: (open: boolean) => void;
  /** Forwarded to the wrapper for arrow-key, ESC etc. */
  onKeyUp?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  /** Controlled open state. Leave undefined to use internal state. */
  open?: boolean;
  /** Disables the trigger icon. */
  disabled?: boolean;
  /** When true, clicking outside / selecting an item won't auto-close. */
  preventAutoClose?: boolean;
  relativeToParent?: boolean;

  // Trigger icon
  icon?: string;
  iconSize?: number;
  iconBorder?: boolean;
  iconRotation?: string;
  color?: string;

  // MenuList passthrough
  inline?: boolean;
  width?: string | number;
  maxHeight?: string | number;
  header?: string;
  horizontalAlign?: 'left' | 'center' | 'right' | string;
  marginHorizontal?: number;
  marginVertical?: number;
  marginThreshold?: number;
  shiftLeft?: number;
  popoverStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  className?: string;

  // ============ Deprecated — soft-shimmed ============
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.Ref<any>;

  // ============ Silently ignored ============
  /** @deprecated No longer has any effect. */
  isV4Design?: boolean;
  /** @deprecated No longer has any effect — use CSS media queries. */
  isMobile?: boolean;
  /** @deprecated No longer has any effect — don't render instead. */
  hidden?: boolean;
  /** @deprecated No longer has any effect. */
  displayAuto?: boolean;
  /** @deprecated Use `className`. */
  legacyClass?: string;
  /** @deprecated No longer has any effect. */
  compactStyle?: boolean;
}

export const MenuList: React.ForwardRefExoticComponent<
  MenuListProps & React.RefAttributes<HTMLDivElement>
>;
export const MenuItem: React.ForwardRefExoticComponent<
  MenuItemProps & React.RefAttributes<HTMLDivElement>
>;
export const IconMenuList: React.ForwardRefExoticComponent<
  IconMenuListProps & React.RefAttributes<HTMLDivElement>
>;
