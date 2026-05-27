/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';

export type MultiSelectType = 'text' | 'email';

export interface MultiSelectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onSelect'> {
  /** Optional id. Auto-generated if absent. */
  id?: string;
  className?: string;
  placeholder?: string;
  /** Initial pill values. */
  options?: string[];
  /** Input kind. `'email'` enables address validation + de-dup. */
  type?: MultiSelectType;

  /** Optional list of emails already registered — flagged on entry. */
  existingEmails?: string[];
  /** Optional list of emails belonging to another tenant — flagged on entry. */
  tenantEmails?: string[];

  /** Container height (CSS length). Defaults to `'100px'`. */
  height?: string;

  /** Render as a dropdown picker against `dropdownOptions` instead of free-text entry. */
  isDropdown?: boolean;
  /** Options available in the dropdown mode. */
  dropdownOptions?: string[];

  /** Fired when a new value is added (free-text entry or dropdown selection). */
  onChange?: (value: string) => void;
  /** Fired when a pill is deleted. For `type="email"`, also receives validity boolean. */
  onDelete?: (value: string, isValid?: boolean) => void;
  /** Fired when validation produces an error message. */
  onError?: (message: string) => void;

  /** When false (default), the first pill is locked and cannot be deleted. */
  areAllPillsDeletable?: boolean;

  // ============ Deprecated — soft-shimmed ============
  /** @deprecated Use `type`. */
  inputType?: MultiSelectType;
  /** @deprecated Use `onChange`. */
  onSelect?: (value: string) => void;
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.Ref<any>;

  // ============ Silently ignored ============
  /** @deprecated No longer has any effect. */
  isV4Design?: boolean;
  /** @deprecated No longer has any effect — use CSS media queries. */
  isMobile?: boolean;
  /** @deprecated No longer has any effect — set `height` or wrap in your own container. */
  fullSize?: boolean;
  /** @deprecated Use `className`. */
  legacyClass?: string;
  /** @deprecated No longer has any effect. */
  displayAuto?: boolean;
}

declare const MultiSelect: React.ForwardRefExoticComponent<
  MultiSelectProps & React.RefAttributes<HTMLInputElement>
>;

export default MultiSelect;
