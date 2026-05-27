import {
  ButtonWidget,
  DropdownWidget,
  HtmlEditorWidget,
  TextInputWidget,
  TextAreaWidget,
  RadioButtonWidget,
  SignatureWidget,
  MapWidget,
  DateTimePickerWidget,
  GridWidget,
  ContainerWidget,
  ButtonMenuWidget,
  CheckboxWidget,
  TagWidget,
  ToggleWidget,
  ChartWidget,
  DocumentsWidget,
  RecurrenceWidget,
  GalleryWidget,
  DividerWidget,
  FormulaWidget,
  SyncWidget,
} from './widget-icons';

// Define the widget icon map first to ensure type consistency
export const widgetIconMap = {
  'button-menu-widget': ButtonMenuWidget,
  'button-widget': ButtonWidget,
  'checkbox-widget': CheckboxWidget,
  'container-widget': ContainerWidget,
  'date-time-picker-widget': DateTimePickerWidget,
  'dropdown-widget': DropdownWidget,
  'grid-widget': GridWidget,
  'html-editor-widget': HtmlEditorWidget,
  'map-widget': MapWidget,
  'radio-button-widget': RadioButtonWidget,
  'signature-widget': SignatureWidget,
  'tag-widget': TagWidget,
  'text-input-widget': TextInputWidget,
  'text-area-widget': TextAreaWidget,
  'toggle-widget': ToggleWidget,
  'chart-widget': ChartWidget,
  'documents-widget': DocumentsWidget,
  'recurrence-widget': RecurrenceWidget,
  'gallery-widget': GalleryWidget,
  'divider-widget': DividerWidget,
  'formula-widget': FormulaWidget,
  'sync-widget': SyncWidget,
} as const;

// Extract the type from the keys of the actual map to ensure they stay in sync
export type WidgetIconNames = keyof typeof widgetIconMap;

// Type for the widget components themselves
export type WidgetIconComponents = (typeof widgetIconMap)[WidgetIconNames];
