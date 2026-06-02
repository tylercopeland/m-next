import * as React from 'react';

export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  id?: string;
  /** 1-based index of the currently displayed page. */
  currentPage: number;
  /** Total number of pages available. */
  totalPages: number;
  /** Called with the new 1-based page index. */
  onPageChange: (page: number) => void;
  /** Number of page-number buttons shown on each side of the current page. Default: 1. */
  siblingCount?: number;
  /** When true, render «« first / last »» buttons in addition to ‹ prev / next ›. Default: true. */
  showFirstLast?: boolean;
  /** Accessible label for the <nav> landmark. Default: 'Pagination'. */
  ariaLabel?: string;

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

declare const Pagination: React.ForwardRefExoticComponent<
  PaginationProps & React.RefAttributes<HTMLElement>
>;

/**
 * Compute the sequence of page-number cells (and ellipsis markers)
 * to render between Prev and Next. Exposed for tests and consumers
 * who want to render their own page navigator on top of the same
 * windowing logic.
 *
 * Returns an array of numbers and the string `'ellipsis'`.
 */
export declare function getPageRange(
  currentPage: number,
  totalPages: number,
  siblingCount?: number,
): Array<number | 'ellipsis'>;

export { Pagination };
export default Pagination;
