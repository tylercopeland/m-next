/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';

export type PillSize = 'sm' | 'md';
export type PillVariant = 'subtle' | 'solid' | 'ghost';
export type PillColorScheme =
  | 'blue'
  | 'green'
  | 'fuchsia'
  | 'grey'
  | 'yellow'
  | 'red'
  | 'purple'
  | 'orange'
  | 'teal'
  | 'transparent';

export interface PillIconDescriptor {
  /** Icon name. Pass `'dot'` to render a colored circle instead of an SVG icon. */
  name: string;
  /** Accessible caption / tooltip label. */
  label?: string;
  /** Pixel size override. Defaults to a size derived from `size`. */
  size?: number;
  /** Show a hover tooltip (lead icon only). */
  showTooltip?: boolean;
  /** Inline color override for the icon. */
  color?: string;
}

export interface PillProfileIconDescriptor {
  /** Image source (path or .mci asset). */
  name: string;
  /** Accessible caption. */
  label?: string;
  /** Pixel size override. */
  size?: number | string;
}

export interface PillProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick' | 'style'> {
  id?: string;

  /** Visual size. `sm` = 16px tall, `md` = 24px tall. */
  size?: PillSize;
  /** Visual treatment. */
  variant?: PillVariant;
  /** Semantic color. */
  colorScheme?: PillColorScheme;

  /** Cap the pill's max width; long text truncates with ellipsis. */
  maxWidth?: string | number;

  /** Leading icon descriptor — pass `{ name: 'dot' }` for a colored dot. */
  leadIcon?: PillIconDescriptor | null;
  /** Trailing icon descriptor. */
  trailIcon?: PillIconDescriptor | null;
  /** Leading avatar image descriptor. */
  profileIcon?: PillProfileIconDescriptor | null;

  className?: string;
  style?: React.CSSProperties;
  /** Style applied to the inner text span. */
  textStyle?: React.CSSProperties;

  children?: React.ReactNode;

  onClick?: (e: React.MouseEvent) => void;
  /** When set, renders a trailing × that calls this handler. */
  onDelete?: (e: React.MouseEvent) => void;

  disabled?: boolean;
  /** Text weight — `true` = 600, `false` = 400. */
  bold?: boolean;
  /** Text font-size override in px. */
  fontSize?: number;

  /** Tooltip HTML content (passed as `data-tooltip-html`). */
  tooltip?: string;
  /** Tooltip target id (passed as `data-tooltip-id`). */
  tooltipId?: string;

  // ============ Deprecated — soft-shimmed ============
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.Ref<any>;

  // ============ Silently ignored ============
  /** @deprecated No longer has any effect. */
  isV4Design?: boolean;
  /** @deprecated No longer has any effect — use CSS media queries. */
  isMobile?: boolean;
  /** @deprecated Use `className`. */
  legacyClass?: string;
}

export const Pill: React.ForwardRefExoticComponent<
  PillProps & React.RefAttributes<HTMLDivElement>
>;
export default Pill;
