/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';

/**
 * Canonical shape of an address value used by `@m-next/address`.
 *
 * Five free-form street lines (the most generous shape that still maps to
 * Method's CRM contact records) plus the four locality fields.
 */
export interface AddressValue {
  Line1?: string | null;
  Line2?: string | null;
  Line3?: string | null;
  Line4?: string | null;
  Line5?: string | null;
  City?: string | null;
  State?: string | null;
  PostalCode?: string | null;
  Country?: string | null;
}

export interface AddressProps {
  /** Optional id. Auto-generated if absent; sub-field ids derive from this. */
  id?: string;
  /** Optional section heading rendered above the fields. */
  label?: string | null;
  /** Controlled value. Pass a single object — see `AddressValue`. */
  value?: AddressValue | null;
  /** Renders a 7-line loading skeleton in place of the address. */
  isLoading?: boolean;
  /** Show the editable form (`InputArea` + 4 `Input`s) instead of read-only text. */
  isEditable?: boolean;
  /** Disable all inputs (editable mode only). */
  disabled?: boolean;
  /** Marks the sub-fields as required (editable mode only). */
  required?: boolean;
  /** Container width. */
  width?: string | number;
  /** Style override for the outer container. */
  style?: React.CSSProperties;
  /**
   * Fires when any sub-field changes. Receives the full merged `AddressValue`
   * (not just the delta).
   */
  onChange?: (value: AddressValue) => void;
  onFocus?: (e: React.FocusEvent<HTMLElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLElement>) => void;

  // ============ Deprecated — soft-shimmed ============
  /** @deprecated Use `value.Line1`. */
  Line1?: string | null;
  /** @deprecated Use `value.Line2`. */
  Line2?: string | null;
  /** @deprecated Use `value.Line3`. */
  Line3?: string | null;
  /** @deprecated Use `value.Line4`. */
  Line4?: string | null;
  /** @deprecated Use `value.Line5`. */
  Line5?: string | null;
  /** @deprecated Use `value.City`. */
  City?: string | null;
  /** @deprecated Use `value.State`. */
  State?: string | null;
  /** @deprecated Use `value.PostalCode`. */
  PostalCode?: string | null;
  /** @deprecated Use `value.Country`. */
  Country?: string | null;
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.Ref<any>;
  /** @deprecated Use `label`. */
  caption?: string | null;

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

export const Address: React.ForwardRefExoticComponent<
  AddressProps & React.RefAttributes<HTMLElement>
>;
export default Address;
