import * as React from 'react';

/**
 * One element of a chips filter expression. The internal shape is
 * defined in @m-next/types; types here are deliberately loose to avoid
 * coupling app code to the internal representation.
 */
export type ChipsFilterExpression = unknown[];

export interface ChipsFilterExpressionChange {
  simple?: ChipsFilterExpression | null;
  advanced?: ChipsFilterExpression | null;
  allFiltersInvalid?: boolean;
}

export interface ChipsFilterOption {
  value: string;
  label: string;
  avatar?: string;
}

export interface ChipsFilterTag {
  name: string;
  colour: string;
}

export interface ChipsFilterField {
  name: string;
  type: string;
  caption?: string;
  [key: string]: unknown;
}

export type ChipsFilterViewType = 'Standard' | 'Personal' | 'Shared' | null;
export type ChipsFilterCurrentViewType = 'standard' | 'custom' | 'shared';

export interface ChipsFilterProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Optional. Auto-generated if omitted. */
  id?: string;
  /** Accessible group name. Falls back to `aria-label`, then "Filter chips". */
  label?: string;

  disabled?: boolean;
  fieldList?: ChipsFilterField[];
  simpleChipsExpression?: ChipsFilterExpression;
  advancedChipsExpression?: ChipsFilterExpression;
  displayPreferences?: object;
  onExpressionChange?: (change: ChipsFilterExpressionChange) => void;

  options?: ChipsFilterOption[];
  isLoading?: boolean;
  onSearch?: (field: unknown, text: string, currentExpression: ChipsFilterExpression) => void;
  searchText?: string;
  tagsList?: ChipsFilterTag[];

  viewName?: string;
  forcedTimeZone?: string;
  disableMaxWidth?: boolean;
  forceClear?: boolean;
  resetChipsTriggered?: boolean;

  // Custom views
  egCustomViewsSaveButtonEnabled?: boolean;
  onClickShowSaveGridViewDialog?: (saveAsCurrent: boolean) => void;
  onClickResetButton?: () => void;
  onChipFilterApplied?: (fieldName: string) => void;
  onChipFilterRemoved?: (fieldName: string) => void;
  viewResetButtonVisible?: boolean;
  currentViewType?: ChipsFilterCurrentViewType;
  onUpdateCurrentView?: (() => void) | null;
  canEditSharedView?: boolean;
  onUpdateSharedView?: (() => void) | null;
  setViewSaveAndResetButtonsVisible?: ((visible: boolean) => void) | null;
  hasOtherViewChanges?: boolean;
  viewType?: ChipsFilterViewType;
  updateInitialValues?: boolean;

  /** @deprecated Use the `label` prop. `caption` was the legacy field name. */
  caption?: string;
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.Ref<HTMLDivElement>;
  /** @deprecated No longer recommended at the API surface — internal layout still honours it for now. */
  isMobile?: boolean;
  /** @deprecated No longer has any effect — V4 styling is always on. */
  isV4Design?: boolean;
  /** @deprecated No longer has any effect. */
  legacyClass?: string;
  /** @deprecated No longer has any effect. */
  displayAuto?: boolean;
  /** @deprecated No longer has any effect. */
  compactStyle?: boolean;
}

export const ChipsFilter: React.ForwardRefExoticComponent<
  ChipsFilterProps & React.RefAttributes<HTMLDivElement>
>;

/**
 * Audit-flagged rename. `FilterChips` is the canonical name; `ChipsFilter`
 * remains exported as the default for backwards compatibility.
 */
export const FilterChips: typeof ChipsFilter;

export default ChipsFilter;
