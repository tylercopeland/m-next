/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';

export type CardSize = 'small' | 'medium';

/** Minimal shape for a field descriptor consumed by Card. The full Field
 * definition lives in `@m-next/types`. */
export interface CardField {
  name?: string;
  caption?: string;
  type?: string;
  displayAs?: 'pill' | 'dot-pill' | string;
  displayOptions?: Record<string, any>;
  conditionalFormatting?: Array<{ value: any; color?: string }>;
  styling?: Record<string, any>;
  [key: string]: any;
}

/** Minimal shape for a tag entry consumed by Card. */
export interface CardTag {
  name?: string;
  colour?: string;
  [key: string]: any;
}

export interface CardProps {
  id?: string;
  isLoading?: boolean;
  /** Backend display-preference bag — formatting (date, number, money) is delegated to `@m-next/utilities`. */
  displayPreferences?: Record<string, any>;
  /** Available tags, looked up by name when a field has `type: 'Tags'`. */
  tagsList?: CardTag[];
  onClick?: (e: React.MouseEvent) => void;
  /** When true, renders an `<Image>` slot on the left of the card. */
  hasAvatar?: boolean;
  /** Image source / record-image token. Only shown when `hasAvatar` is true. */
  avatar?: string | null;
  /** Compact (`small`) or default (`medium`) layout. */
  size?: CardSize;
  /** The record object. Field values are read by `data[field.name]`. */
  data?: Record<string, any> | null;
  /** When true, each line is prefixed with `field.caption: `. */
  showLabels?: boolean;
  style?: React.CSSProperties;

  /** Column 1 / row 1 — header field by default (bold + larger). */
  field1?: CardField | null;
  /** Column 1 / row 2. */
  field2?: CardField | null;
  /** Column 1 / row 3. */
  field3?: CardField | null;
  /** Column 2 / row 1 — header field by default. */
  field4?: CardField | null;
  /** Column 2 / row 2. */
  field5?: CardField | null;
  /** Column 2 / row 3. */
  field6?: CardField | null;

  /** Tooltip id used by `@m-next/typeography` ellipsis detection. */
  tooltipId?: string | null;
  /** When true, trailing rows with no mapped field collapse, and unmapped
   * fields above the last-mapped row render a placeholder. */
  hideEmptyFields?: boolean;

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
  /** @deprecated No longer has any effect. */
  displayAuto?: boolean;
  /** @deprecated No longer has any effect. */
  compactStyle?: boolean;
  /** @deprecated No longer has any effect — don't render instead. */
  hidden?: boolean;
}

export const Card: React.ForwardRefExoticComponent<
  CardProps & React.RefAttributes<any>
>;
export default Card;
