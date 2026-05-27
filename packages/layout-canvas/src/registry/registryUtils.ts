/**
 * Registry Utility Functions
 *
 * These utilities provide widget type mapping and default value lookups
 * for the layout canvas. Extracted from the unified control registry to
 * eliminate dependency on app-builder.
 *
 * @packageDocumentation
 */

import { widgets, complexValueTypes } from '@m-next/types';
import type { ValidControlType } from '@m-next/runtime-interface';
import { ValidationRuleTypes } from '@m-next/runtime-interface';
import { Guid } from '@m-next/utilities';
import { createCalendarDefaults, createChartDefaults } from './controlDefaults';

/**
 * Maps legacy widget type constants to control types
 * Used by LayoutCanvas to look up wrapper components
 */
const WIDGET_TO_CONTROL_TYPE_MAP: Record<string, ValidControlType> = {
  [String(widgets.FIELD_BLOCK)]: 'fieldBlock',
  [String(widgets.CHART)]: 'chart',
  [String(widgets.DATATABLE)]: 'grid',
  [String(widgets.GALLERY)]: 'gallery',
  [String(widgets.APPRIBBON)]: 'button', // Special case - AppRibbon uses button wrapper
  [String(widgets.CHECKBOX)]: 'checkbox',
  [String(widgets.DROPDOWN)]: 'dropdown',
  [String(widgets.BUTTON)]: 'button',
  [String(widgets.SECTION)]: 'section',
  [String(widgets.RECURRENCE)]: 'recurrence',
  [String(widgets.TAGLIST)]: 'tagList',
  [String(widgets.MAP)]: 'map',
  [String(widgets.TOGGLE)]: 'toggle',
  [String(widgets.HTMLEDITOR)]: 'htmlEditor',
  [String(widgets.ADDRESSLOOKUP)]: 'input', // Special case - AddressLookup uses input wrapper
  [String(widgets.DOCUMENTSWIDGET)]: 'attachments',
  [String(widgets.DATETIMEPICKER)]: 'dateTimePicker',
  [String(widgets.SIGNATURE)]: 'signature',
  [String(widgets.BUTTONGROUP)]: 'buttonGroup',
  [String(widgets.TEXTBOX)]: 'input',
  [String(widgets.TEXTAREA)]: 'textArea',
  [String(widgets.LABEL)]: 'label',
  [String(widgets.RADIOBOX)]: 'radioButton',
  [String(widgets.PICTURE)]: 'image',
  [String(widgets.LAYOUT_CONTAINER)]: 'layoutContainer',
  [String(widgets.CALENDAR)]: 'calendar',
  [String(widgets.SYNCWIDGET)]: 'syncWidget',
};

/**
 * Map legacy widget type to control type
 *
 * @param widgetType - Legacy widget type constant (e.g., 'BTN', 'TXT', 'EDT')
 * @returns Corresponding control type (e.g., 'button', 'input', 'grid') or undefined if not mapped
 *
 * @example
 * ```typescript
 * import { widgets } from '@m-next/types';
 * import { mapWidgetToControlType } from '@m-next/layout-canvas';
 *
 * const controlType = mapWidgetToControlType(String(widgets.BUTTON));
 * console.log(controlType); // 'button'
 * ```
 */
export function mapWidgetToControlType(widgetType: string): ValidControlType | undefined {
  return WIDGET_TO_CONTROL_TYPE_MAP[widgetType];
}

/**
 * Default values by control type
 * Used when creating new controls to initialize properties
 */
const DEFAULT_VALUES_BY_CONTROL_TYPE: Record<ValidControlType, Record<string, unknown>> = {
  button: {
    caption: 'Button',
    disabled: false,
    iconAlign: 'Left',
    visible: true,
    hideCaption: false,
    widthType: 'auto',
    classes: '',
    styles: {
      variant: 'primary',
      color: 'blue',
    },
    isV4Control: true,
    onBlur: null,
    onChange: null,
    onClick: null,
    onFocus: null,
    validationRules: null,
    validationError: null,
  },
  buttonGroup: {
    caption: 'Button Menu',
    buttons: [
      {
        id: Guid.create(),
        name: 'Menu Item 1',
        isWorking: true,
        type: 'BGI',
        defaultValue: 'Menu item 1',
        typeOverride: 'BGI',
        caption: 'Menu item 1',
        classes: '',
        disabled: false,
        hideCaption: false,
        isBound: false,
        onBlur: null,
        onChange: null,
        onClick: null,
        onFocus: null,
        styles: {},
        validationError: null,
        validationRules: null,
        visible: true,
        width: null,
        widthType: null,
      },
    ],
    hasMenuLabel: false,
    visible: true,
    disabled: false,
    hideCaption: false,
    widthType: 'auto',
    classes: '',
    styles: {},
    onBlur: null,
    onChange: null,
    onClick: null,
    onFocus: null,
    validationRules: null,
    validationError: null,
  },
  input: {
    caption: 'Input',
    placeholder: '',
    value: '',
    disabled: false,
    visible: true,
    hideCaption: false,
    widthType: 'auto',
    classes: '',
    styles: {},
    onBlur: null,
    onChange: null,
    onClick: null,
    onFocus: null,
    validationRules: [{ rule: ValidationRuleTypes.MaliciousValues, value: true, canDelete: false }],
    validationError: null,
  },
  textArea: {
    caption: 'Text Area',
    placeholder: '',
    value: '',
    rows: 4,
    disabled: false,
    visible: true,
    hideCaption: false,
    widthType: 'auto',
    classes: '',
    styles: {},
    onBlur: null,
    onChange: null,
    onClick: null,
    onFocus: null,
    validationRules: [{ rule: ValidationRuleTypes.MaliciousValues, value: true, canDelete: false }],
    validationError: null,
    defaultValue: '',
  },
  dropdown: {
    caption: 'Dropdown',
    placeholder: 'Select an option...',
    options: [],
    value: null,
    disabled: false,
    visible: true,
    hideCaption: false,
    widthType: 'auto',
    classes: '',
    styles: {},
    onBlur: null,
    onChange: null,
    onClick: null,
    onFocus: null,
    validationRules: null,
    validationError: null,
    defaultValue: null,
    model: {
      viewName: null,
      dataSource: null,
      processServerSide: false,
      distinct: false,
      columns: [],
      sorting: null,
      paging: { pageNumber: 1, pageSize: 50, totalRows: 0 },
      selectAll: false,
      selectedRecords: null,
    },

    isClearable: false,
    isFilterable: false,
    isMultiSelect: false,
    customRowText: '',
    onCustomRowClick: undefined,
    selectedValue: null, // Backwards compatibility with LayoutCanvasWrapper
    allowMultiple: false, // Backwards compatibility with LayoutCanvasWrapper
  },
  checkbox: {
    caption: 'Checkbox',
    checked: false,
    disabled: false,
    visible: true,
    hideCaption: false,
    widthType: 'auto',
    classes: '',
    styles: {},
    onBlur: null,
    onChange: null,
    onClick: null,
    onFocus: null,
    validationRules: null,
    validationError: null,
    value: false,
    defaultValue: false,
    align: 'Left',
  },
  toggle: {
    caption: 'Toggle',
    checked: false,
    disabled: false,
    visible: true,
    hideCaption: false,
    widthType: 'auto',
    classes: '',
    styles: {},
    onBlur: null,
    onChange: null,
    onClick: null,
    onFocus: null,
    validationRules: null,
    validationError: null,
    value: false,
    defaultValue: false,
  },
  radioButton: {
    caption: 'Radio Button',
    value: null,
    disabled: false,
    visible: true,
    hideCaption: false,
    widthType: 'auto',
    classes: '',
    styles: {},
    onBlur: null,
    onChange: null,
    onClick: null,
    onFocus: null,
    validationRules: null,
    validationError: null,
    position: 'horizontal',
    radiobuttons: ['Value 1', 'Value 2'],
    defaultValue: null,
  },
  dateTimePicker: {
    caption: 'Date Time Picker',
    format: 'MM/dd/yyyy',
    dtFormat: 'MMM-DD-YYYY',
    formatType: 'Short Date',
    value: null,
    disabled: false,
    visible: true,
    hideCaption: false,
    widthType: 'auto',
    classes: '',
    styles: {},
    onBlur: null,
    onChange: null,
    onClick: null,
    onFocus: null,
    validationRules: null,
    validationError: null,
    showTime: true,
    defaultValue: {
      value: 'today',
      valueType: complexValueTypes.CurrentDate,
    },
  },
  image: {
    caption: 'Picture',
    src: null,
    alt: '',
    fit: 'contain',
    visible: true,
    disabled: false,
    hideCaption: true,
    widthType: 'auto',
    classes: '',
    styles: {},
    isBound: false,
    value: '',
    defaultValue: '',
    originalName: '',
    unsetImage: 'landscape',
    isEditable: false,
    onBlur: null,
    onChange: null,
    onClick: null,
    onFocus: null,
    validationRules: null,
    validationError: null,
  },
  signature: {
    caption: 'Signature',
    value: null,
    disabled: false,
    visible: true,
    hideCaption: false,
    hideCancel: false,
    acceptCaption: 'Accept',
    cancelCaption: 'Cancel',
    onAccept: null,
    onCancel: null,
    widthType: 'auto',
    classes: '',
    styles: {},
    onBlur: null,
    onChange: null,
    onClick: null,
    onFocus: null,
    validationRules: [{ rule: ValidationRuleTypes.MaliciousValues, value: true, canDelete: false }],
    validationError: null,
    defaultValue: null,
    defaultValueWrapper: null,
  },
  attachments: {
    caption: 'Attachments',
    files: [],
    disabled: false,
    visible: true,
    hideCaption: false,
    widthType: 'auto',
    classes: '',
    styles: {},
    onBlur: null,
    onChange: null,
    onClick: null,
    onFocus: null,
    validationRules: null,
    validationError: null,
  },
  tagList: {
    caption: 'Tag List',
    tags: [],
    disabled: false,
    visible: true,
    hideCaption: false,
    widthType: 'auto',
    classes: '',
    styles: {},
    onBlur: null,
    onChange: null,
    onClick: null,
    onFocus: null,
    validationRules: null,
    validationError: null,
  },
  label: {
    content: 'Label',
    caption: 'Label',
    defaultValue: 'Label',
    fontSize: 14,
    visible: true,
    widthType: 'auto',
    classes: '',
    styles: {},
  },
  grid: {
    caption: 'Grid',
    type: widgets.DATATABLE,
    columns: [],
    visible: true,
    widthType: 'auto',
    classes: '',
    styles: {},
    isComplexType: true,
    isReadOnly: true,
    paging: { pageNumber: 1, pageSize: 10 },
    viewList: [],
    showGoToPage: false,
    showPagination: true,
    isSearchable: false,
    hideSearch: false,
    showSort: true,
    hideViewSelector: false,
    showExport: false,
    showRefresh: false,
    isSelectable: false,
    canReorderColumns: false,
    canAddMoreRows: true,
    showDeleteColumn: true,
    showDeleteConfirmation: false,
    menuItems: null,
    onActiveRowChange: null,
    newRowsCount: 3,
    addLabel: 'Add lines',
    hideCaption: true,
  },
  chart: {
    ...createChartDefaults(),
    caption: 'Chart',
    type: String(widgets.CHART), // Critical for proper rendering after reload
    visible: true,
    disabled: false,
    hideCaption: true,
    widthType: 'auto',
    classes: '',
    styles: {},
    defaultValue: 'Chart',
    onBlur: null,
    onChange: null,
    version: undefined,
    onClick: null,
    onFocus: null,
    validationRules: null,
    validationError: null,
    componentVersion: '1.0.0', // Enable dynamic width/height resizing
  },
  gallery: {
    caption: 'Gallery',
    visible: true,
    disabled: false,
    hideCaption: false,
    widthType: 'auto',
    classes: '',
    styles: {},
    // Value and defaultValue must be null - backend tries to parse as JSON, string causes parse error
    value: null,
    defaultValue: null,
    defaultValueWrapper: null,
    onBlur: null,
    onChange: null,
    onClick: null,
    onFocus: null,
    validationRules: null,
    validationError: null,
  },
  map: {
    caption: 'Map',
    type: String(widgets.MAP),
    visible: true,
    disabled: false,
    hideCaption: false,
    widthType: 'auto',
    classes: '',
    styles: {},
    onBlur: null,
    onChange: null,
    onClick: null,
    onFocus: null,
    validationRules: null,
    validationError: null,
    componentVersion: '1.0.0', // Enable dynamic width/height resizing
  },
  calendar: {
    // Note: createCalendarDefaults is called here with a placeholder GUID
    // getControlDefaults() in LayoutCanvasWrapper regenerates unique button GUIDs when control is created
    ...createCalendarDefaults('placeholder-guid', 'Calendar'),
    caption: 'Calendar',
    visible: true,
    disabled: false,
    hideCaption: true,
    widthType: 'auto',
    classes: '',
    view: 'day',
    styles: {},
    defaultValue: 'Calendar',
    onBlur: null,
    onChange: null,
    onClick: null,
    onFocus: null,
    validationRules: null,
    validationError: null,
  },
  htmlEditor: {
    caption: 'HTML Editor',
    defaultValue: null,
    content: '',
    placeholder: 'Enter content...',
    maxLength: null,
    visible: true,
    disabled: false,
    hideCaption: false,
    widthType: 'auto',
    classes: '',
    styles: {},
    onBlur: null,
    onChange: null,
    onClick: null,
    onFocus: null,
    validationRules: [{ rule: ValidationRuleTypes.MaliciousValues, value: true, canDelete: false }],
    validationError: null,
    type: 'TXT',
    typeOverride: 'HTM',
    componentVersion: '1.0.0', // Enable dynamic height resizing
  },
  recurrence: {
    caption: 'Recurrence',
    pattern: null,
    disabled: false,
    visible: true,
    hideCaption: false,
    widthType: 'auto',
    classes: '',
    styles: {},
    onBlur: null,
    onChange: null,
    onClick: null,
    onFocus: null,
    validationRules: null,
    validationError: null,
  },
  syncWidget: {
    caption: 'Sync',
    status: 'idle',
    disabled: false,
    visible: true,
    hideCaption: false,
    widthType: 'auto',
    classes: '',
    styles: {},
  },
  section: {
    caption: 'Section',
    children: [],
    visible: true,
    widthType: 'auto',
    classes: '',
    styles: {},
  },
  layoutContainer: {
    caption: 'Container',
    containerStyle: 'default',
    collapsible: true,
    showBorder: true,
    container: {
      direction: 'column',
      children: [],
      wrap: true,
      gap: 4,
      alignItems: 'start',
      justifyContent: 'start',
    },
    visible: true,
    disabled: false,
    hideCaption: false,
    widthType: 'auto',
    classes: '',
    styles: {},
  },
  addressLookup: {
    caption: 'Address',
    placeholder: 'Search address',
    value: null,
    defaultValue: null,
    disabled: false,
    visible: true,
    hideCaption: false,
    widthType: 'auto',
    classes: '',
    styles: {},
    onBlur: null,
    onChange: null,
    onClick: null,
    onFocus: null,
    validationRules: null,
    validationError: null,
  },
  fieldBlock: {
    caption: 'Field Block',
    visible: true,
    disabled: false,
    hideCaption: false,
    widthType: 'auto',
    classes: '',
    styles: {},
    onBlur: null,
    onChange: null,
    onClick: null,
    onFocus: null,
    validationRules: null,
    validationError: null,
  },
  appRibbon: {
    caption: 'App Ribbon',
    visible: true,
    disabled: false,
    hideCaption: false,
    widthType: 'auto',
    classes: '',
    styles: {},
    onBlur: null,
    onChange: null,
    onClick: null,
    onFocus: null,
    validationRules: null,
    validationError: null,
  },
  screen: {
    name: 'Screen',
  },
};

/**
 * Get default property values for a component type
 *
 * @param componentType - The component/control type (e.g., 'button', 'input', 'grid')
 * @returns Default values object for the component type
 *
 * @example
 * ```typescript
 * import { getComponentDefaultsFromRegistry } from '@m-next/layout-canvas';
 *
 * const defaults = getComponentDefaultsFromRegistry('button');
 * console.log(defaults);
 * // { caption: 'Button', disabled: false, visible: true, ... }
 * ```
 */
export function getComponentDefaultsFromRegistry(componentType: ValidControlType): Record<string, unknown> {
  // Map widget type to control type if needed
  const controlType = mapWidgetToControlType(String(componentType)) || componentType;

  // Get defaults from the mapping
  const defaults = DEFAULT_VALUES_BY_CONTROL_TYPE[controlType];

  if (!defaults) {
    return {};
  }

  // Return a copy of the default values to avoid mutations
  return { ...defaults };
}

/**
 * Display restrictions by control type
 * Defines min/max width/height for responsive grid layout
 */
const DISPLAY_RESTRICTIONS_BY_CONTROL_TYPE: Record<
  ValidControlType,
  {
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
    defaultWidth: number;
    defaultHeight: number;
  }
> = {
  button: {
    minWidth: 1,
    maxWidth: 6,
    minHeight: 1,
    maxHeight: 3,
    defaultWidth: 2,
    defaultHeight: 3,
  },
  buttonGroup: {
    minWidth: 2,
    maxWidth: 6,
    minHeight: 3,
    maxHeight: 3,
    defaultWidth: 2,
    defaultHeight: 3,
  },
  input: {
    minWidth: 2,
    maxWidth: 12,
    minHeight: 4,
    maxHeight: 4,
    defaultWidth: 3,
    defaultHeight: 4,
  },
  textArea: {
    minWidth: 2,
    maxWidth: 12,
    minHeight: 5,
    maxHeight: 17,
    defaultWidth: 3,
    defaultHeight: 9,
  },
  dropdown: {
    minWidth: 2,
    maxWidth: 12,
    minHeight: 4,
    maxHeight: 4,
    defaultWidth: 3,
    defaultHeight: 4,
  },
  checkbox: {
    minWidth: 1,
    maxWidth: 6,
    minHeight: 3,
    maxHeight: 3,
    defaultWidth: 2,
    defaultHeight: 3,
  },
  toggle: {
    minWidth: 1,
    maxWidth: 4,
    minHeight: 3,
    maxHeight: 3,
    defaultWidth: 2,
    defaultHeight: 3,
  },
  radioButton: {
    minWidth: 2,
    maxWidth: 12,
    minHeight: 2,
    maxHeight: 12,
    defaultWidth: 3,
    defaultHeight: 4,
  },
  dateTimePicker: {
    minWidth: 2,
    maxWidth: 12,
    minHeight: 4,
    maxHeight: 4,
    defaultWidth: 3,
    defaultHeight: 4,
  },
  image: {
    minWidth: 1,
    maxWidth: 12,
    minHeight: 2,
    maxHeight: 24,
    defaultWidth: 2,
    defaultHeight: 6,
  },
  signature: {
    minWidth: 4,
    maxWidth: 12,
    minHeight: 14,
    maxHeight: 14,
    defaultWidth: 6,
    defaultHeight: 14,
  },
  attachments: {
    minWidth: 3,
    maxWidth: 12,
    minHeight: 12,
    maxHeight: 28,
    defaultWidth: 3,
    defaultHeight: 12,
  },
  tagList: {
    minWidth: 2,
    maxWidth: 12,
    minHeight: 4,
    maxHeight: 6,
    defaultWidth: 3,
    defaultHeight: 4,
  },
  label: {
    minWidth: 1,
    maxWidth: 12,
    minHeight: 2,
    maxHeight: 20,
    defaultWidth: 3,
    defaultHeight: 3,
  },
  grid: {
    minWidth: 4,
    maxWidth: 12,
    minHeight: 14,
    maxHeight: 200,
    defaultWidth: 12,
    defaultHeight: 35,
  },
  chart: {
    minWidth: 4,
    maxWidth: 12,
    minHeight: 8,
    maxHeight: 40,
    defaultWidth: 6,
    defaultHeight: 16,
  },
  gallery: {
    minWidth: 4,
    maxWidth: 12,
    minHeight: 22,
    maxHeight: 40,
    defaultWidth: 12,
    defaultHeight: 22,
  },
  map: {
    minWidth: 4,
    maxWidth: 12,
    minHeight: 8,
    maxHeight: 40,
    defaultWidth: 6,
    defaultHeight: 28,
  },
  calendar: {
    minWidth: 4,
    maxWidth: 12,
    minHeight: 35,
    maxHeight: 120,
    defaultWidth: 12,
    defaultHeight: 46,
  },
  htmlEditor: {
    minWidth: 4,
    maxWidth: 12,
    minHeight: 14,
    maxHeight: 40,
    defaultWidth: 12,
    defaultHeight: 14,
  },
  recurrence: {
    minWidth: 2,
    maxWidth: 12,
    minHeight: 2,
    maxHeight: 12,
    defaultWidth: 3,
    defaultHeight: 4,
  },
  syncWidget: {
    minWidth: 2,
    maxWidth: 2,
    minHeight: 2,
    maxHeight: 2,
    defaultWidth: 2,
    defaultHeight: 2,
  },
  section: {
    minWidth: 4,
    maxWidth: 12,
    minHeight: 4,
    maxHeight: 40,
    defaultWidth: 12,
    defaultHeight: 12,
  },
  layoutContainer: {
    minWidth: 3,
    maxWidth: 12,
    minHeight: 3,
    maxHeight: 40,
    defaultWidth: 12,
    defaultHeight: 16,
  },
  addressLookup: {
    minWidth: 2,
    maxWidth: 12,
    minHeight: 1,
    maxHeight: 1,
    defaultWidth: 3,
    defaultHeight: 3,
  },
  fieldBlock: {
    minWidth: 4,
    maxWidth: 12,
    minHeight: 4,
    maxHeight: 40,
    defaultWidth: 12,
    defaultHeight: 12,
  },
  appRibbon: {
    minWidth: 2,
    maxWidth: 12,
    minHeight: 1,
    maxHeight: 3,
    defaultWidth: 6,
    defaultHeight: 1,
  },
  screen: {
    minWidth: 12,
    maxWidth: 12,
    minHeight: 40,
    maxHeight: 40,
    defaultWidth: 12,
    defaultHeight: 40,
  },
};

/**
 * Get display restrictions for a component type
 *
 * @param componentType - The component/control type (e.g., 'button', 'input', 'grid')
 * @returns Display restrictions { minWidth, maxWidth, minHeight, maxHeight, defaultWidth, defaultHeight } or undefined if not configured
 *
 * @example
 * ```typescript
 * import { getDisplayRestrictionsFromRegistry } from '@m-next/layout-canvas';
 *
 * const restrictions = getDisplayRestrictionsFromRegistry('button');
 * console.log(restrictions);
 * // { minWidth: 1, maxWidth: 6, minHeight: 1, maxHeight: 3, defaultWidth: 2, defaultHeight: 3 }
 * ```
 */
export function getDisplayRestrictionsFromRegistry(componentType: ValidControlType) {
  // Map widget type to control type if needed
  const controlType = mapWidgetToControlType(String(componentType)) || componentType;

  // Get restrictions from the mapping
  const restrictions = DISPLAY_RESTRICTIONS_BY_CONTROL_TYPE[controlType];

  if (!restrictions) {
    return undefined;
  }

  // Return a copy of the display restrictions to avoid mutations
  return { ...restrictions };
}
