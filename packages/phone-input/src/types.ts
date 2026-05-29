import type { CSSProperties, ChangeEvent } from 'react';
import type { CountryData } from 'react-phone-input-2';

/**
 * Callback fired when the phone value changes.
 * `data` is the country metadata from react-phone-input-2, augmented with `rawPhone`
 * (the dial-code stripped from the full E.164-ish value).
 */
export type PhoneInputChangeHandler = (
  // eslint-disable-next-line no-unused-vars -- type signature only
  phoneValue: string,
  // eslint-disable-next-line no-unused-vars -- type signature only
  data: (CountryData | Record<string, unknown>) & { rawPhone?: string },
  // eslint-disable-next-line no-unused-vars -- type signature only
  event: ChangeEvent<HTMLInputElement>,
  // eslint-disable-next-line no-unused-vars -- type signature only
  formattedValue: string,
) => void;

export interface PhoneInputProps {
  /** Optional. Auto-generated when not provided. */
  id?: string;
  /** Current phone number (E.164-ish: `+14372207682`). */
  value?: string;
  /** Initial country, e.g. `'ca'`, `'us'`. */
  defaultCountry?: string;
  /** Visible label / placeholder. Rendered as a floating Caption above the input. */
  label?: string;
  /** Placeholder shown in the country-search box. */
  searchPlaceholder?: string;
  /** Whether the country-search box is shown. */
  enableSearch?: boolean;
  /** Hide the search icon inside the country-search box. */
  disableSearchIcon?: boolean;
  /** Include territories / dependencies in the country list. */
  enableTerritories?: boolean;
  /** Error message rendered below the field. When set, the field is in error state. */
  errorMessage?: string;
  /** Change handler. See `PhoneInputChangeHandler` for argument shape. */
  onChange?: PhoneInputChangeHandler | null;

  containerStyle?: CSSProperties;
  inputStyle?: CSSProperties;
  buttonStyle?: CSSProperties;
  dropdownStyle?: CSSProperties;
  searchStyle?: CSSProperties;

  // ============ Deprecated — soft-shimmed ============
  /** @deprecated Use `label`. */
  placeholder?: string;
  /** @deprecated Use `errorMessage`. */
  validationMessage?: string;
  /** @deprecated Use `onChange`. */
  handleChange?: PhoneInputChangeHandler | null;
  /** @deprecated Use `defaultCountry`. */
  country?: string;

  // ============ Silently ignored ============
  /** @deprecated No longer has any effect — V4 design is always on. */
  isV4Design?: boolean;
  /** @deprecated No longer has any effect — use CSS media queries. */
  isMobile?: boolean;
  /** @deprecated Use `className`. */
  legacyClass?: string | null;
  /** @deprecated No longer has any effect. */
  compactStyle?: boolean;
  /** @deprecated No longer has any effect. */
  displayAuto?: boolean;
}
