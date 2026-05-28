/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';

export interface FieldDefinition {
  name: string;
  caption?: string;
  type?: string;
  isVisible?: boolean;
  isRequired?: boolean;
  isReadOnly?: boolean;
  maxLength?: number;
  displayOptions?: Record<string, any>;
  [key: string]: any;
}

export interface TagDefinition {
  name: string;
  colour?: string;
  [key: string]: any;
}

export interface FieldBlockProps {
  /** Optional — auto-generated if absent. */
  id?: string;
  /** Field definitions that drive the rendered rows. */
  fields?: FieldDefinition[];
  /** Hide empty / unselected fields behind a "Show more" toggle. */
  collapseEmpty?: boolean;
  isLoading?: boolean;
  style?: React.CSSProperties;
  data?: Record<string, any>;
  validationErrors?: Record<string, string> | null;
  error?: string;
  onRefetch?: () => void;
  forceOpen?: boolean;
  width?: number | string;
  displayPreferences?: Record<string, any>;
  tagsList?: TagDefinition[];
  onMoreClick?: (collapsed: boolean) => void;
  showMoreRef?: React.Ref<any>;
  onSelect?: (fieldName: string) => void;
  selectedField?: string | null;
  /** 0 = read-only, 1 = edit. */
  mode?: number;
  showSave?: boolean;
  showClearAndNew?: boolean;
  showEdit?: boolean;
  saveLabel?: string;
  clearLabel?: string;
  onSaveClick?: (data: Record<string, any>) => void;
  onClearClick?: (data: Record<string, any>) => void;
  onLoadDropdownData?: (...args: any[]) => void;
  isWorking?: boolean;
  dropdownLists?: Record<string, any>;
  onImageUpload?: (...args: any[]) => void;
  onDownloadImage?: (...args: any[]) => void;
  metadata?: Record<string, any>;

  /** FormSection heading text. Renders an `<h2>` and wires `aria-labelledby`. */
  title?: string;
  /** Supporting copy rendered below the title. */
  description?: React.ReactNode;

  // ============ Deprecated — soft-shimmed ============
  /** @deprecated Use `title`. */
  caption?: string;
  /** @deprecated Use `title`. */
  heading?: string;
  /** @deprecated Use `description`. */
  hint?: React.ReactNode;
  /** @deprecated Use `description`. */
  help?: React.ReactNode;
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.Ref<any>;

  // ============ Silently ignored ============
  /** @deprecated No longer has any effect. */
  isV4Design?: boolean;
  /** @deprecated No longer has any effect — use CSS media queries. */
  isMobile?: boolean;
  /** @deprecated Use `style` / `className`. */
  legacyClass?: string;
  /** @deprecated No longer has any effect. */
  displayAuto?: boolean;
  /** @deprecated No longer has any effect. */
  compactStyle?: boolean;
}

declare const FieldBlock: React.ForwardRefExoticComponent<
  FieldBlockProps & React.RefAttributes<HTMLDivElement>
>;

/** Canonical name for the FieldBlock component (audit-driven rename). */
export const FormSection: typeof FieldBlock;

export default FieldBlock;
