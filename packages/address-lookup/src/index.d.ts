/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';

export interface AddressLookupOption {
  key: number;
  /** Full place name as returned by the geocoding provider. */
  label: string;
  value: number;
  /** Street-level address line, when available. */
  streetAddress?: string;
  /** Same as `label` — preserved for backwards compatibility. */
  text: string;
  /** The raw geocoding feature from the underlying provider (Mapbox). */
  raw: unknown;
  city?: string;
  zipPostalCode?: string;
  stateProvince?: string;
  country?: string;
  longitude?: number;
  latitude?: number;
}

export interface AddressLookupProps {
  /** Optional id; auto-generated if omitted. */
  id?: string;
  /** Visible label, rendered above the input via `@m-next/caption`. */
  label?: string;
  /** Fires with the full option when a suggestion is selected, or `null` when cleared. */
  onChange?: (option: AddressLookupOption | null) => void;
  /** Alias for `onChange`. */
  onSelect?: (option: AddressLookupOption | null) => void;
  /** Fires with the raw search-box value on every keystroke. */
  onInputChange?: (value: string) => void;

  width?: string | number;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;

  /** When set, the component shows error styling and renders this message below. */
  errorMessage?: string | null;

  /** Mapbox gateway base URL — used for ipgeo lookup to bias suggestions. */
  gatewayUrl: string;
  menuPlacement?: 'auto' | 'top' | 'bottom';

  // ============ Deprecated — soft-shimmed ============
  /** @deprecated Use `label`. */
  caption?: string;
  /** @deprecated Use `errorMessage`. */
  validationMessage?: string | null;
  /** @deprecated Use `errorMessage` (a non-null value implies invalid). */
  isValid?: boolean;
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.Ref<any>;

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

export const AddressLookup: React.ForwardRefExoticComponent<
  AddressLookupProps & React.RefAttributes<HTMLDivElement>
>;
export default AddressLookup;
