/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'onChange' | 'onBlur' | 'onFocus'> {
  id?: string;
  /** Visible / accessible label for the search field. */
  label?: string | null;
  name?: string | null;
  value?: string | number | object | null;
  placeholder?: string | null;
  disabled?: boolean;
  readOnly?: boolean;
  tabIndex?: number;

  /** Optional leading icon (ReactNode). Defaults to a search glyph; pass `null` to suppress. */
  leftIcon?: React.ReactNode;

  /** Show a clear (×) button inside the input when there's a value. */
  showClearButton?: boolean;

  /** If true, do not auto-focus on mount. */
  suppressAutoFocus?: boolean;
  /** If true, the input's text is selected when it receives focus. */
  selectOnFocus?: boolean;

  /** Fired with the debounced string value (not a SyntheticEvent). */
  onChange?: (value: string) => void;
  /** Fired with the current string value when the input loses focus. */
  onBlur?: (value: string) => void;
  /** Fired with the current string value when the input gains focus. */
  onFocus?: (value: string) => void;
  /** Fired (with the raw string value) before debouncing — useful for outside-controlled mirrors. */
  onRawChange?: (value: string | number | object) => void;
  /** Fired when the clear (×) button is pressed. */
  onClear?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;

  style?: React.CSSProperties;
  wrapperStyle?: React.CSSProperties;

  // ============ Deprecated — soft-shimmed ============
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.Ref<any>;
  /** @deprecated Use `readOnly` (React casing). */
  readonly?: boolean;
  /** @deprecated Use `label`. */
  caption?: string;
  /** @deprecated Use `leftIcon` as a ReactNode. */
  prefixIcon?: string;
  /** @deprecated Use the standard `aria-describedby` attribute. */
  ariaDescribedby?: string;

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

export const SearchInput: React.ForwardRefExoticComponent<
  SearchInputProps & React.RefAttributes<HTMLInputElement>
>;
export default SearchInput;
