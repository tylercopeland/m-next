/**
 * Constants for V3 to V4 migration
 */

export const GRID_COLUMNS = 12;

export const WIDGET_TYPES = {
  APP_RIBBON: ['APR', 'APPRIBBON'],
  ICON: ['ICO', 'ICON'],
  PAYMENT: ['PAY', 'PAYMENTWIDGET'],
  FILE_ATTACHMENT: ['FIL', 'FILEATTACHMENT'],
  GRID: 'GRD',
  EDITABLE_GRID: 'EDT',
  SECTION: ['L-SEC', 'SEC'],
  ROW: 'L-ROW',
  COLUMN: 'L-COL',
} as const;

export const CONTROL_HEIGHTS: Record<string, number> = {
  // Grid controls
  GRD: 20,  // grid defaultHeight from registry
  EDT: 20,  // grid defaultHeight from registry (editable grid)

  // Input controls
  TXT: 3,   // input defaultHeight
  TXA: 16,  // textArea defaultHeight
  ADR: 3,   // addressLookup (same as input)

  // Selection controls
  DRP: 3,   // dropdown defaultHeight
  CHK: 3,   // checkbox defaultHeight
  TGL: 3,   // toggle defaultHeight
  RAD: 4,   // radioButton defaultHeight
  DTP: 3,   // dateTimePicker defaultHeight

  // Display controls
  LBL: 4,   // label defaultHeight
  PIC: 6,   // image defaultHeight

  // Action controls
  BTN: 3,   // button defaultHeight
  BGR: 4,   // buttonGroup defaultHeight

  // Container controls
  SEC: 4,   // section defaultHeight
  'L-CON': 12,  // layoutContainer defaultHeight
  'F-BLOCK': 6, // fieldBlock defaultHeight

  // Complex controls
  HTM: 20,  // htmlEditor defaultHeight
  MAP: 12,  // map defaultHeight
  CHT: 20,  // chart defaultHeight
  GAL: 42,  // gallery defaultHeight
  CAL: 36,  // calendar defaultHeight
  SIG: 10,  // signature defaultHeight
  DOC: 10,  // attachments defaultHeight
  TAG: 3,   // tagList defaultHeight
  REC: 4,   // recurrence defaultHeight
  SYW: 1,   // syncWidget defaultHeight

  // Legacy
  TAB: 12,
  IFR: 12,
};

export const DEFAULT_CONTROL_HEIGHT = 3;

export const EXPRESSION_OPERATIONS = {
  ADD: 22,
  SUBTRACT: 23,
  DIVIDE: 24,
  MULTIPLY: 25,
  START_GROUP: 0,
  END_GROUP: 1,
} as const;

export const EXPRESSION_VALUE_TYPES = {
  FIELD: 3,
  TEXT: 9,
  NUMBER: 10,
  BOOLEAN: 12,
} as const;

export const COLUMN_TYPES = {
  FIELD: 1,
  EXPRESSION: 2,
  FORMULA: 6,
} as const;

export const FIELD_TYPES = {
  TEXT: 0,
  DECIMAL: 1,
  INTEGER: 2,
  DATETIME: 3,
  MONEY: 4,
  YESNO: 5,
  FILEATTACHMENT: 6,
  PICTURE: 7,
  DROPDOWN: 8,
  LINKED: 9,
  BUTTON: 10,
  CARDCOLUMN: 11,
  ADDRESS: 12,
  TAGS: 13,
  PHONE: 14,
  EMAIL: 15,
  PROFILEIMAGE: 16,
  ID: 17,
  USER: 18,
  DATE: 19,
  TIME: 20,
  FORMULA: 21,
} as const;

/**
 * Standard event properties that can appear on controls
 */
export const STANDARD_EVENT_PROPERTIES = [
  'onClick',
  'onChange',
  'onBlur',
  'onFocus',
  'onLoad',
  'onSave',
  'onDelete',
  'onSelect',
] as const;

/**
 * Event properties specific to certain control types
 */
export const CONTROL_SPECIFIC_EVENTS = {
  EDT: ['onActiveRowChange', 'onChangeEvent'], // Editable Grid
  GRD: ['onActiveRowChange', 'onClick'], // Grid
  CHT: ['onClick'], // Chart
  BGR: ['onClick'], // Button Group
  CAL: ['onClick'], // Calendar
} as const;
