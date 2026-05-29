/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';

export type PopoverPlacementOriginVertical = 'top' | 'center' | 'bottom' | number;
export type PopoverPlacementOriginHorizontal = 'left' | 'center' | 'right' | number;

export interface PopoverOrigin {
  vertical?: PopoverPlacementOriginVertical;
  horizontal?: PopoverPlacementOriginHorizontal;
}

export type PopoverAnchorReference = 'anchorEl' | 'anchorPosition' | 'none';

export type PopoverAnchorEl =
  | HTMLElement
  | null
  | undefined
  | (() => HTMLElement | null)
  | string;

export interface PopoverProps {
  /** Optional id. Auto-generated if not supplied. */
  id?: string;
  /** Controls whether the popover is rendered. */
  open?: boolean;
  /** Called when the popover requests close (click-outside, ESC). */
  onClose?: (event?: any) => void;

  /** Element (or id / getter) the popover positions itself against. */
  anchorEl?: PopoverAnchorEl;
  /** When `anchorReference="anchorPosition"`, the absolute coords to anchor to. */
  anchorPosition?: { top: number; left: number } | string;
  /** Which positioning strategy to use. Default: `anchorEl`. */
  anchorReference?: PopoverAnchorReference;
  /** Corner of the anchor to attach to. Default: `{ vertical: 'top', horizontal: 'left' }`. */
  anchorOrigin?: PopoverOrigin;
  /** Corner of the popover that meets `anchorOrigin`. Default: `{ vertical: 'top', horizontal: 'left' }`. */
  transformOrigin?: PopoverOrigin;
  /** When true + `inline`, position is computed relative to the offset parent. */
  relativeToParent?: boolean;

  /** Render inline (in place) instead of through a portal to `document.body`. */
  inline?: boolean;

  /** Content of the popover. */
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  width?: string | number;
  height?: number;

  /** Minimum px distance the popover keeps from the viewport edge. Default: 16. */
  marginThreshold?: number;
  marginHorizontal?: number;
  marginVertical?: number;

  /** Manual horizontal/vertical offset after positioning + edge-shifting. */
  shiftLeft?: number;
  shiftDown?: number;

  /** Skip the auto edge-shifting that keeps the popover on-screen. */
  skipShifting?: boolean;

  /** Whether ESC closes the popover. Default: true. */
  closeOnEsc?: boolean;
  /**
   * Whether a click outside the popover closes it. Default: true.
   * Mirror of the legacy `disableClickOutside` (which still works).
   */
  closeOnOverlayClick?: boolean;
  /** Opt-in focus trap while open. Default: false. */
  trapFocus?: boolean;
  /**
   * Modal semantics — adds `role="dialog"` and `aria-modal="true"` to the popover.
   * Pair with `trapFocus` for full modal behaviour. Default: false (it's just a panel).
   */
  modal?: boolean;

  // ============ Deprecated — soft-shimmed ============
  /** @deprecated Use `closeOnOverlayClick={false}` instead. */
  disableClickOutside?: boolean;
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.Ref<any>;
  /** @deprecated Pass the trigger element via `anchorEl` instead. */
  triggerRef?: React.RefObject<HTMLElement> | HTMLElement;

  // ============ Silently ignored ============
  /** @deprecated No longer has any effect. */
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

export const Popover: React.ForwardRefExoticComponent<
  PopoverProps & React.RefAttributes<HTMLElement>
>;
export default Popover;

/* Position helpers re-exported for advanced callsites. */
export function getOffsetTop(
  rect: { width: number; height: number },
  vertical: PopoverPlacementOriginVertical,
  marginVertical: number,
): number;
export function getOffsetLeft(
  rect: { width: number; height: number },
  horizontal: PopoverPlacementOriginHorizontal,
  marginHorizontal: number,
): number;
