/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';

export interface BreadcrumbItem {
  id: string;
  label: string;
  onClick?: (e?: React.MouseEvent) => void;
  tooltip?: string;
}

export interface BreadcrumbMenuItem {
  id: string;
  label: string;
  onClick: (e?: React.MouseEvent) => void;
}

export interface BreadCrumbsHeaderProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'id'> {
  /** Container id. Auto-generated if not provided. */
  id?: string;
  /** Crumb trail — last item is rendered as the current page. */
  crumbs?: BreadcrumbItem[];
  /** Show the trailing kebab menu. */
  showMenu?: boolean;
  /** Items rendered inside the kebab menu. */
  menuItems?: BreadcrumbMenuItem[];
  /** id of the tooltip target. */
  tooltipId?: string;
  /** Override the leading icon. */
  iconName?: string;
  /** Accessible name for the nav landmark. Defaults to 'Breadcrumbs'. */
  'aria-label'?: string;

  style?: React.CSSProperties;
  className?: string;

  // ============ Deprecated — soft-shimmed ============
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.Ref<any>;
  /** @deprecated Use the standard `aria-label` attribute. */
  ariaLabel?: string;

  // ============ Silently ignored ============
  /** @deprecated No longer has any effect — V4 styling is always on. */
  isV4Design?: boolean;
  /** @deprecated No longer has any effect — use CSS media queries. */
  isMobile?: boolean;
  /** @deprecated Use `className`. */
  legacyClass?: string;
  /** @deprecated No longer has any effect. */
  displayAuto?: boolean;
  /** @deprecated No longer has any effect. */
  compactStyle?: boolean;
}

export const BreadCrumbsHeader: React.ForwardRefExoticComponent<
  BreadCrumbsHeaderProps & React.RefAttributes<HTMLElement>
>;

/**
 * Canonical named export. Alias of the existing `BreadCrumbsHeader` default export —
 * the package name (`@m-next/bread-crumbs`) is unchanged for backwards compatibility.
 */
export const Breadcrumbs: typeof BreadCrumbsHeader;

export default BreadCrumbsHeader;
