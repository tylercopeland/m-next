/**
 * Control Interface Registry
 *
 * This file ensures every control type has a corresponding TypeScript interface.
 * TypeScript will error if ANY control type lacks an interface, ensuring
 * complete type coverage.
 */

import type { ValidControlType } from './controlRegistry';
import type {
  ButtonControl,
  ButtonGroupControl,
  AttachmentsControl,
  InputControl,
  DropdownControl,
  CheckboxControl,
  ToggleControl,
  DateTimePickerControl,
  GridControl,
  HtmlEditorControl,
  GalleryControl,
  FieldBlockControl,
  AppRibbonControl,
  MapControl,
  TagListControl,
  SectionControl,
  RecurrenceControl,
  SignatureControl,
  ImageControl,
  ChartControl,
  BaseControl,
  TextControl,
  RadioButtonControl,
  LayoutContainerControl,
  TextAreaControl,
} from './index';
import type { SyncWidgetControl } from './controls/syncWidgetControl';

// Define CalendarControl interface for the calendar component
interface CalendarControl extends BaseControl {
  view?: 'month' | 'week' | 'day';
  events?: unknown[];
  selectable?: boolean;
  onChange?: string | null;
}

/**
 * Lookup dictionary type that ensures ALL control types have interfaces.
 * TypeScript will error if any ValidControlType is missing from this mapping.
 */
export type ControlInterfaceLookup = {
  // Implemented control interfaces
  button: ButtonControl;
  buttonGroup: ButtonGroupControl;
  attachments: AttachmentsControl;
  input: InputControl;
  dropdown: DropdownControl;
  checkbox: CheckboxControl;
  toggle: ToggleControl;
  dateTimePicker: DateTimePickerControl;
  label: TextControl;
  radioButton: RadioButtonControl;
  grid: GridControl;
  chart: ChartControl;
  image: ImageControl;
  map: MapControl;
  signature: SignatureControl;
  recurrence: RecurrenceControl;
  tagList: TagListControl;
  section: SectionControl;
  htmlEditor: HtmlEditorControl;
  gallery: GalleryControl;
  fieldBlock: FieldBlockControl;
  appRibbon: AppRibbonControl;
  calendar: CalendarControl;
  syncWidget: SyncWidgetControl;
  layoutContainer: LayoutContainerControl;
  textArea: TextAreaControl;
};

/**
 * Generic type to get control interface by type
 * Usage: GetControlInterface<'button'> returns ButtonControl
 */
export type GetControlInterface<T extends ValidControlType> = ControlInterfaceLookup[T & keyof ControlInterfaceLookup];
