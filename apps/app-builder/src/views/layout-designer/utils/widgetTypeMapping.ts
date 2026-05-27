/**
 * Centralized widget type mapping utilities.
 *
 * Consolidates the 3 overlapping lookup tables that existed in LayoutCanvasWrapper:
 *   - mapToWidgetType  (any input → WidgetType)
 *   - getControlTypeCode  (WidgetType → backend type code)
 *   - TYPE_CODE_TO_WIDGET_MAP  (backend type code → WidgetType)
 *
 * Plus CSS class and display caption lookups.
 */
import { WIDGETS } from '@m-next/runtime-interface';
import { WidgetType } from '@m-next/layout-canvas';

// ---------------------------------------------------------------------------
// Core type map — maps every known input string to a canonical WidgetType
// ---------------------------------------------------------------------------

interface ControlLike {
  typeOverride?: string;
  [key: string]: unknown;
}

/**
 * Master lookup table. Keys are case-sensitive; the caller normalises before
 * querying when needed. Grouped by category for maintainability.
 */
const TYPE_MAP: Record<string, WidgetType> = {
  // === UPPERCASE TYPE CODES (from backend controls) ===
  BTN: WIDGETS.BUTTON,
  TXT: WIDGETS.TEXTBOX,
  LBL: WIDGETS.LABEL,
  DRP: WIDGETS.DROPDOWN,
  CHK: WIDGETS.CHECKBOX,
  HTML: WIDGETS.HTMLEDITOR,
  HTM: WIDGETS.HTMLEDITOR,
  SEC: WIDGETS.SECTION,
  GRD: WIDGETS.DATATABLE,
  CHT: WIDGETS.CHART,
  RAD: WIDGETS.RADIOBOX,
  DTP: WIDGETS.DATETIMEPICKER,
  IMG: WIDGETS.PICTURE,
  PIC: WIDGETS.PICTURE,
  BGR: WIDGETS.BUTTONGROUP,
  'F-BLOCK': WIDGETS.FIELD_BLOCK,
  TGL: WIDGETS.TOGGLE,
  TAG: WIDGETS.TAGLIST,
  DOC: WIDGETS.DOCUMENTSWIDGET,
  SIG: WIDGETS.SIGNATURE,
  REC: WIDGETS.RECURRENCE,
  MAP: WIDGETS.MAP,
  GAL: WIDGETS.GALLERY,
  ADR: WIDGETS.ADDRESSLOOKUP,
  TXA: WIDGETS.TEXTAREA,
  CAL: WIDGETS.CALENDAR,
  APR: WIDGETS.APPRIBBON,
  BGI: WIDGETS.BUTTONGROUPITEM,
  EDT: WIDGETS.DATATABLE,
  'L-CON': WIDGETS.LAYOUT_CONTAINER,
  SYW: WIDGETS.SYNCWIDGET,

  // === LOWERCASE TYPE CODES ===
  btn: WIDGETS.BUTTON,
  txt: WIDGETS.TEXTBOX,
  lbl: WIDGETS.LABEL,
  sec: WIDGETS.SECTION,
  drp: WIDGETS.DROPDOWN,
  chk: WIDGETS.CHECKBOX,
  txa: WIDGETS.TEXTAREA,
  grd: WIDGETS.DATATABLE,
  edt: WIDGETS.DATATABLE,
  card: WIDGETS.SECTION,
  cht: WIDGETS.CHART,
  cal: WIDGETS.CALENDAR,
  doc: WIDGETS.DOCUMENTSWIDGET,
  dtp: WIDGETS.DATETIMEPICKER,
  adr: WIDGETS.ADDRESSLOOKUP,
  rad: WIDGETS.RADIOBOX,
  tgl: WIDGETS.TOGGLE,
  pic: WIDGETS.PICTURE,
  sig: WIDGETS.SIGNATURE,
  htm: WIDGETS.HTMLEDITOR,
  rec: WIDGETS.RECURRENCE,
  tag: WIDGETS.TAGLIST,
  bgr: WIDGETS.BUTTONGROUP,
  bgi: WIDGETS.BUTTONGROUPITEM,
  gal: WIDGETS.GALLERY,
  'l-con': WIDGETS.LAYOUT_CONTAINER,
  syw: WIDGETS.SYNCWIDGET,

  // === CAMELCASE / LOWERCASE STRING NAMES ===
  button: WIDGETS.BUTTON,
  textbox: WIDGETS.TEXTBOX,
  label: WIDGETS.LABEL,
  dropdown: WIDGETS.DROPDOWN,
  checkbox: WIDGETS.CHECKBOX,
  textarea: WIDGETS.TEXTAREA,
  grid: WIDGETS.DATATABLE,
  section: WIDGETS.SECTION,
  chart: WIDGETS.CHART,
  calendar: WIDGETS.CALENDAR,
  attachments: WIDGETS.DOCUMENTSWIDGET,
  dateTimePicker: WIDGETS.DATETIMEPICKER,
  datetimepicker: WIDGETS.DATETIMEPICKER,
  addressLookup: WIDGETS.ADDRESSLOOKUP,
  addresslookup: WIDGETS.ADDRESSLOOKUP,
  input: WIDGETS.TEXTBOX,
  radioButton: WIDGETS.RADIOBOX,
  radiobutton: WIDGETS.RADIOBOX,
  toggle: WIDGETS.TOGGLE,
  image: WIDGETS.PICTURE,
  signature: WIDGETS.SIGNATURE,
  htmlEditor: WIDGETS.HTMLEDITOR,
  htmleditor: WIDGETS.HTMLEDITOR,
  recurrence: WIDGETS.RECURRENCE,
  tagList: WIDGETS.TAGLIST,
  taglist: WIDGETS.TAGLIST,
  buttonGroup: WIDGETS.BUTTONGROUP,
  buttongroup: WIDGETS.BUTTONGROUP,
  gallery: WIDGETS.GALLERY,
  fieldBlock: WIDGETS.FIELD_BLOCK,
  fieldblock: WIDGETS.FIELD_BLOCK,
  appRibbon: WIDGETS.APPRIBBON,
  appribbon: WIDGETS.APPRIBBON,
  layoutContainer: WIDGETS.LAYOUT_CONTAINER,
  syncWidget: WIDGETS.SYNCWIDGET,
  syncwidget: WIDGETS.SYNCWIDGET,
  map: WIDGETS.MAP,

  // === COMPONENT PALETTE DISPLAY NAMES ===
  'Text input': WIDGETS.TEXTBOX,
  'Text area': WIDGETS.TEXTAREA,
  Button: WIDGETS.BUTTON,
  Dropdown: WIDGETS.DROPDOWN,
  Checkbox: WIDGETS.CHECKBOX,
  Toggle: WIDGETS.TOGGLE,
  'Date time picker': WIDGETS.DATETIMEPICKER,
  Label: WIDGETS.LABEL,
  'HTML editor': WIDGETS.HTMLEDITOR,
  'Tag list': WIDGETS.TAGLIST,
  Signature: WIDGETS.SIGNATURE,
  Image: WIDGETS.PICTURE,
  Attachments: WIDGETS.DOCUMENTSWIDGET,
  'Radio group': WIDGETS.RADIOBOX,
  Section: WIDGETS.SECTION,
  Chart: WIDGETS.CHART,
  'Editable grid': WIDGETS.DATATABLE,
  Gallery: WIDGETS.GALLERY,
  'Address lookup': WIDGETS.ADDRESSLOOKUP,
  'Button menu': WIDGETS.BUTTONGROUP,
  'Field block': WIDGETS.FIELD_BLOCK,
  'App ribbon': WIDGETS.APPRIBBON,
  Calendar: WIDGETS.CALENDAR,
  Recurrence: WIDGETS.RECURRENCE,

  // === NUMERIC CODES ===
  '1': WIDGETS.TEXTBOX,
  '2': WIDGETS.LABEL,
  '3': WIDGETS.BUTTON,
  '4': WIDGETS.DROPDOWN,
  '5': WIDGETS.CHECKBOX,
  '6': WIDGETS.TEXTAREA,
  '7': WIDGETS.DATATABLE,
  '8': WIDGETS.SECTION,
  '9': WIDGETS.SECTION,
  '10': WIDGETS.CHART,
  '11': WIDGETS.CALENDAR,
  '12': WIDGETS.LAYOUT_CONTAINER,
};

// ---------------------------------------------------------------------------
// WidgetType → backend type code (reverse lookup)
// ---------------------------------------------------------------------------

const WIDGET_TO_TYPE_CODE: Record<string, string> = {
  [WIDGETS.BUTTON]: 'BTN',
  [WIDGETS.TEXTBOX]: 'TXT',
  [WIDGETS.LABEL]: 'LBL',
  [WIDGETS.DROPDOWN]: 'DRP',
  [WIDGETS.CHECKBOX]: 'CHK',
  [WIDGETS.HTMLEDITOR]: 'HTM',
  [WIDGETS.SECTION]: 'SEC',
  [WIDGETS.DATATABLE]: 'EDT',
  [WIDGETS.CHART]: 'CHT',
  [WIDGETS.RADIOBOX]: 'RAD',
  [WIDGETS.DATETIMEPICKER]: 'DTP',
  [WIDGETS.PICTURE]: 'PIC',
  [WIDGETS.BUTTONGROUP]: 'BGR',
  [WIDGETS.FIELD_BLOCK]: 'F-BLOCK',
  [WIDGETS.TOGGLE]: 'TGL',
  [WIDGETS.TAGLIST]: 'TAG',
  [WIDGETS.DOCUMENTSWIDGET]: 'DOC',
  [WIDGETS.SIGNATURE]: 'SIG',
  [WIDGETS.RECURRENCE]: 'REC',
  [WIDGETS.MAP]: 'MAP',
  [WIDGETS.GALLERY]: 'GAL',
  [WIDGETS.ADDRESSLOOKUP]: 'ADR',
  [WIDGETS.TEXTAREA]: 'TXA',
  [WIDGETS.CALENDAR]: 'CAL',
  [WIDGETS.APPRIBBON]: 'APR',
  [WIDGETS.BUTTONGROUPITEM]: 'BGI',
  [WIDGETS.LAYOUT_CONTAINER]: 'L-CON',
  [WIDGETS.SYNCWIDGET]: 'SYW',
};

// ---------------------------------------------------------------------------
// WidgetType → CSS class name
// ---------------------------------------------------------------------------

const WIDGET_TO_CLASS: Record<string, string> = {
  [WIDGETS.BUTTON]: 'mi-button',
  [WIDGETS.TEXTBOX]: 'mi-input',
  [WIDGETS.LABEL]: 'mi-label',
  [WIDGETS.DROPDOWN]: 'mi-dropdown',
  [WIDGETS.CHECKBOX]: 'mi-checkbox',
  [WIDGETS.HTMLEDITOR]: 'mi-html-editor',
  [WIDGETS.TOGGLE]: 'mi-toggle',
  [WIDGETS.TAGLIST]: 'mi-taglist',
  [WIDGETS.DOCUMENTSWIDGET]: 'mi-attachments',
  [WIDGETS.TEXTAREA]: 'mi-textarea',
  [WIDGETS.DATATABLE]: 'mi-datatable',
  [WIDGETS.SECTION]: 'mi-section',
  [WIDGETS.CHART]: 'mi-chart',
  [WIDGETS.RADIOBOX]: 'mi-radiobox',
  [WIDGETS.DATETIMEPICKER]: 'mi-datetimepicker',
  [WIDGETS.PICTURE]: 'mi-picture',
  [WIDGETS.BUTTONGROUP]: 'mi-buttongroup',
  [WIDGETS.FIELD_BLOCK]: 'mi-fieldblock',
  [WIDGETS.SIGNATURE]: 'mi-signature',
  [WIDGETS.RECURRENCE]: 'mi-recurrence',
  [WIDGETS.MAP]: 'mi-map',
  [WIDGETS.GALLERY]: 'mi-gallery',
  [WIDGETS.ADDRESSLOOKUP]: 'mi-addresslookup',
  [WIDGETS.CALENDAR]: 'mi-calendar',
  [WIDGETS.APPRIBBON]: 'mi-appribbon',
  [WIDGETS.BUTTONGROUPITEM]: 'mi-buttongroupitem',
  [WIDGETS.LAYOUT_CONTAINER]: 'mi-layout-container',
  [WIDGETS.SYNCWIDGET]: 'mi-syncwidget',
};

// ---------------------------------------------------------------------------
// WidgetType → display caption
// ---------------------------------------------------------------------------

const WIDGET_TO_CAPTION: Record<string, string> = {
  [WIDGETS.BUTTON]: 'Button',
  [WIDGETS.TEXTBOX]: 'Text input',
  [WIDGETS.LABEL]: 'Label',
  [WIDGETS.DROPDOWN]: 'Dropdown',
  [WIDGETS.CHECKBOX]: 'Checkbox',
  [WIDGETS.HTMLEDITOR]: 'HTML editor',
  [WIDGETS.TOGGLE]: 'Toggle',
  [WIDGETS.TAGLIST]: 'Tag list',
  [WIDGETS.DOCUMENTSWIDGET]: 'Attachments',
  [WIDGETS.TEXTAREA]: 'Text area',
  [WIDGETS.DATATABLE]: 'Editable grid',
  [WIDGETS.SECTION]: 'Section',
  [WIDGETS.CHART]: 'Chart',
  [WIDGETS.RADIOBOX]: 'Radio group',
  [WIDGETS.DATETIMEPICKER]: 'Date time picker',
  [WIDGETS.PICTURE]: 'Picture',
  [WIDGETS.BUTTONGROUP]: 'Button menu',
  [WIDGETS.FIELD_BLOCK]: 'Field block',
  [WIDGETS.SIGNATURE]: 'Signature',
  [WIDGETS.RECURRENCE]: 'Recurrence',
  [WIDGETS.MAP]: 'Map',
  [WIDGETS.GALLERY]: 'Gallery',
  [WIDGETS.ADDRESSLOOKUP]: 'Address lookup',
  [WIDGETS.CALENDAR]: 'Calendar',
  [WIDGETS.APPRIBBON]: 'App ribbon',
  [WIDGETS.BUTTONGROUPITEM]: 'Button group item',
  [WIDGETS.LAYOUT_CONTAINER]: 'Container',
  [WIDGETS.SYNCWIDGET]: 'Sync widget',
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Maps a legacy component type string to a valid WidgetType.
 * If control is provided, checks typeOverride first (replicating old system behavior).
 */
export const mapToWidgetType = (type?: string, control?: ControlLike): WidgetType => {
  const effectiveType = control?.typeOverride || type;
  const key = effectiveType?.toString() ?? '';

  if (key && TYPE_MAP[key]) {
    return TYPE_MAP[key];
  }

  return WIDGETS.BUTTON;
};

/**
 * Maps a WidgetType to its backend type code (e.g. WIDGETS.BUTTON → 'BTN').
 */
export const getControlTypeCode = (widgetType: WidgetType): string => {
  return WIDGET_TO_TYPE_CODE[widgetType as string] || 'BTN';
};

/**
 * Maps a WidgetType to its CSS class name (e.g. WIDGETS.BUTTON → 'mi-button').
 */
export const getControlClass = (widgetType: WidgetType): string => {
  return WIDGET_TO_CLASS[widgetType as string] || 'mi-button';
};

/**
 * Maps a WidgetType to its display caption (e.g. WIDGETS.BUTTON → 'Button').
 */
export const getDefaultCaption = (widgetType: WidgetType): string => {
  return WIDGET_TO_CAPTION[widgetType as string] || 'Button';
};

/**
 * Maps a backend type code back to WidgetType (e.g. 'BTN' → WIDGETS.BUTTON).
 * Used when correcting widget types after control creation.
 */
export const typeCodeToWidgetType = (typeCode: string): WidgetType => {
  return TYPE_MAP[typeCode] || (typeCode as WidgetType);
};

/**
 * Returns true if the component type should be rendered as a grid item.
 * Sections and ButtonGroupItems are filtered out.
 */
export const shouldRenderItem = (type?: string, control?: ControlLike): boolean => {
  const mappedType = mapToWidgetType(type, control);
  return mappedType !== WIDGETS.SECTION && mappedType !== WIDGETS.BUTTONGROUPITEM;
};
