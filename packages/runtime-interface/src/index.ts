// =============================================================================
// TYPES
// =============================================================================

// Widget Types
export type {
  BackendControlStyles,
  WidgetColorStyling,
  WidgetIcon,
  BaseWidgetProps,
  ButtonWidgetProps,
  ButtonTranslationResult,
  AttachmentsWidgetProps,
  AttachmentsTranslationResult,
} from './types';

// Base Types
export type { ColumnFormat, BaseColumnData, BaseColumn } from './controls/baseColumn';
export type { BaseControl, BaseControlInput, WidthType, ControlValue, ControlListItem } from './controls/baseControl';
export type { BaseFilter, BaseFilterInput, FilterExpression, SortExpression } from './controls/baseFilter';
export type { BasePaging, BasePagingInput } from './controls/basePaging';
export type { ValidationRuleType } from './validationRuleTypes';

// Field Types
export type { FieldTypeId, FieldTypeName, DateFormatType } from './types/fieldTypes';
export type {
  Field,
  RuntimeField,
  DateDisplayOptions,
  DecimalDisplayOptions,
  IconColorValue,
  YesNoDisplayOptions,
  DisplayOptions,
} from './types/field';

// Control Types
export type { AttachmentsControl, AttachmentsControlInput } from './controls/attachmentsControl';
export type { ButtonControl, ButtonControlData, ButtonStyles } from './controls/buttonControl';
export type { ButtonGroupControl, ButtonGroupControlInput } from './controls/buttonGroupControl';
export type { ValidationRule } from './validationRule';
export type { InputControl, InputControlInput } from './controls/inputControl';
export type { TextAreaControl, TextAreaControlInput } from './controls/textAreaControl';
export type { DropdownControl, DropdownControlInput, DropdownOption } from './controls/dropdownControl';
export type { CheckboxControl, CheckboxControlInput } from './controls/checkboxControl';
export type { LinkControl, LinkControlInput } from './controls/linkControl';
export type { ToggleControl, ToggleControlInput } from './controls/toggleControl';
export type {
  DateTimePickerControl,
  DateTimePickerControlInput,
  DateTimePickerComplexValue,
} from './controls/dateTimePickerControl';
export type { LabelControl, LabelControlInput } from './controls/labelControl';
export type {
  RadioButtonControl,
  RadioButtonControlInput,
  RadioButtonOption,
  RadioButtonLayout,
} from './controls/radioButtonControl';
export type {
  GridControl,
  GridControlInput,
  GridColumn,
  GridSort,
  GridFilter,
  GridPaging,
  GridSelection,
  GridGrouping,
  GridExport,
} from './controls/gridControl';
export type { ChartControl, ChartControlData } from './controls/chartControl';
export type { ImageControl, ImageControlData } from './controls/imageControl';
export type { MapControl, MapControlData } from './controls/mapControl';
export type { SignatureControl, SignatureControlData } from './controls/signatureControl';
export type {
  RecurrenceControl,
  RecurrenceControlData,
  RecurrencePattern,
  RecurrenceEndType,
  WeekDay,
} from './controls/recurrenceControl';
export type { TagListControl, TagListControlData, TagItem } from './controls/tagListControl';
export type { SectionControl, SectionControlData } from './controls/sectionControl';
export type { HtmlEditorControl, HtmlEditorControlData } from './controls/htmlEditorControl';
export type { GalleryControl, GalleryControlData, GalleryItem } from './controls/galleryControl';
export type { FieldBlockControl, FieldBlockControlData } from './controls/fieldBlockControl';
export type { AppRibbonControl, AppRibbonControlData, AppRibbonItem } from './controls/appRibbonControl';
export type {
  LayoutContainerControl,
  LayoutContainerControlData,
  ContainerConfig,
} from './controls/layoutContainerControl';
export type { SyncWidgetControl, SyncWidgetControlData } from './controls/syncWidgetControl';
export type { TextControl } from './controls/textControl';
// Translator Types
export type { AttachmentsEventHandlers } from './attachments-translator';

// =============================================================================
// TRANSLATORS
// =============================================================================

// Base Translator
export { BaseControlTranslator, translateWidth as baseTranslateWidth } from './base-control-translator';

// Button Translator
export {
  ButtonControlTranslator,
  translateIcon,
  translateWidth,
  translateV4Styling,
  translateButtonControl,
} from './button-translator';

// Attachments Translator
export { AttachmentsControlTranslator, translateAttachmentsControl } from './attachments-translator';

// Button Group Translator
export { ButtonGroupControlTranslator, translateButtonGroupControl } from './button-group-translator';

// =============================================================================
// UTILITIES
// =============================================================================

// Base Utilities
export { createBaseColumn } from './controls/baseColumn';
export { createBaseControl } from './controls/baseControl';
export { createBaseFilter } from './controls/baseFilter';
export { createBasePaging } from './controls/basePaging';

// Button Utilities
export { createButtonControl, migrateButtonControl } from './controls/buttonControl';

// Button Group Utilities
export {
  createButtonGroupControl,
  migrateButtonGroupControl,
  createButtonGroupItemControl,
} from './controls/buttonGroupControl';

export { createInputControl } from './controls/inputControl';
export { createTextAreaControl } from './controls/textAreaControl';
export { createDropdownControl } from './controls/dropdownControl';
export { createCheckboxControl } from './controls/checkboxControl';
export { createLinkControl } from './controls/linkControl';
export { createToggleControl } from './controls/toggleControl';
export { createDateTimePickerControl } from './controls/dateTimePickerControl';
export { createLabelControl } from './controls/labelControl';
export { createRadioButtonControl } from './controls/radioButtonControl';
export { createGridControl } from './controls/gridControl';
export { createChartControl } from './controls/chartControl';
export { createImageControl } from './controls/imageControl';
export { createMapControl } from './controls/mapControl';
export { createSignatureControl } from './controls/signatureControl';
export { createRecurrenceControl } from './controls/recurrenceControl';
export { createTagListControl } from './controls/tagListControl';
export { createSectionControl } from './controls/sectionControl';
export { createHtmlEditorControl } from './controls/htmlEditorControl';
export { createGalleryControl } from './controls/galleryControl';
export { createFieldBlockControl } from './controls/fieldBlockControl';
export { createAppRibbonControl } from './controls/appRibbonControl';
export { createLayoutContainerControl } from './controls/layoutContainerControl';
export { createSyncWidgetControl } from './controls/syncWidgetControl';

// =============================================================================
// CONSTANTS
// =============================================================================

// Field Type Constants
export {
  FieldTypeIds,
  FieldTypeNames,
  DateFormatTypes,
  fieldTypeIdLookup,
  fieldTypeNameLookup,
} from './types/fieldTypes';

// Validation Constants
export { ValidationRuleTypes } from './validationRuleTypes';

// Widget Constants
export { WIDGETS } from './types/widgetTypes';

// =============================================================================
// CONTROL REGISTRY
// =============================================================================

// Control Registry Types
export * from './controlRegistry';
export * from './controlInterfaceRegistry';
export * from './unifiedControlRegistry';

// =============================================================================
// HOOKS
// =============================================================================

export {
  useButtonTranslation,
  useAttachmentsTranslation,
  useButtonGroupTranslation,
  useInputTranslation,
} from './hooks';
