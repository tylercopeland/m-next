/**
 * Unified Control Registry
 * 
 * This registry is the single source of truth for all control-related components.
 * It ensures that every ValidControlType has:
 * - An editor component
 * - A wrapper component  
 * - A right panel configuration
 * 
 * TypeScript will error if ANY component is missing for a control type.
 * This eliminates redundancy and ensures complete coverage.
 */
import React from 'react';
import { 
  ValidControlType,
  RightPanelProps,
  EditorComponent,
  WrapperComponent,
  ControlConfiguration,
  UnifiedControlRegistryType,
  GalleryControl,
  SignatureControl,
  ChartControl,
  GridControl,
  LayoutContainerControl
} from '@m-next/runtime-interface';
import { widgets } from '@m-next/types';
import { 
  mapWidgetToControlType as mapWidgetToControlTypeFromRegistry,
  getComponentDefaultsFromRegistry as getComponentDefaultsFromRegistryUtils,
  getDisplayRestrictionsFromRegistry as getDisplayRestrictionsFromRegistryUtils
} from '@m-next/layout-canvas';

// Import wrappers from layout-canvas (circular dependency now resolved)
import {
  ButtonGroupWrapperRedux as ButtonGroupWrapper,
  AttachmentsWrapperRedux as AttachmentDesignerWrapper,
  ImageWrapperRedux as ImageDesignerWrapper,
  RadioGroupWrapperRedux as RadioGroupWrapper,
  RecurrenceWrapperRedux as RecurrenceDesignerWrapper,
  TagWidgetWrapperRedux as TagWidgetDesignerWrapper,
  InputWrapperRedux as InputWrapperComponent,
  DropdownWrapperRedux as DropdownDesignerWrapper,
  CheckboxWrapperRedux as CheckboxDesignerWrapper,
  TextWrapperRedux as TextDesignerWrapper,
  ButtonWrapperRedux as ButtonWrapperComponent,
  ToggleWrapperRedux as ToggleDesignerWrapper,
  DateTimePickerWrapperRedux as DateTimePickerDesignerWrapper,
  GridWrapperRedux as GridDesignerWrapper,
  ChartWrapperRedux as ChartDesignerWrapper,
  MapWrapperRedux as MapDesignerWrapper,
  SignatureWrapperRedux as SignatureDesignerWrapper,
  GalleryWrapperRedux as GalleryDesignerWrapper,
  FieldBlockWrapperRedux as FieldBlockDesignerWrapper,
  HtmlEditorWrapperRedux as HtmlEditorWrapper,
  CalendarWrapperRedux as CalendarDesignerWrapper,
  LayoutContainerWrapperRedux as LayoutContainerWrapper,
  SyncWidgetWrapperRedux as SyncWidgetWrapperComponent,
} from '@m-next/layout-canvas';
import { TextLine } from '@m-next/typeography';
import { Guid } from '@m-next/utilities';
import HtmlEditorBlockEditor from '../editors/html-editor/HtmlEditorBlockEditor';
import DateTimePickerEditor from '../editors/date-time-picker-editor/DateTimePickerEditor';
import TextEditor from '../editors/text-panel-editor/TextEditor';

// ===== WRAPPER COMPONENTS =====
// Import wrapper components from @m-next/layout-canvas
// These wrappers are now shared and can be used by both app-builder and MethodUI

// ===== HEADER COMPONENTS =====
// Import header components
import GridSettingsHeader from '../editors/grid-block-editor/GridSettingsHeader';
import CalendarSettingsHeader from '../editors/calendar-editor/CalendarSettingsHeader';
import SettingsHeader from '../editors/common/components/settings-header/SettingsHeader';


// ===== CONTROL DEFAULTS =====
// Import default values from controlDefaults
import {
  SYNC_WIDGET_DEFAULTS,
} from '@m-next/layout-canvas';

// ===== EDITOR COMPONENTS =====
// Import existing editor components
 
// @ts-expect-error - Editor modules may lack proper type definitions
const FieldBlockEditor = React.lazy(() => import('../editors/field-block-editor/fieldBlockEditor'));
 
// @ts-expect-error - Editor modules may lack proper type definitions
const ChartBlockEditor = React.lazy(() => import('../editors/chart-block-editor/ChartBlockEditor'));
 
// @ts-expect-error - Editor modules may lack proper type definitions
const GridBlockEditor = React.lazy(() => import('../editors/grid-block-editor/GridBlockEditor'));
 
// @ts-expect-error - Editor modules may lack proper type definitions
const GalleryBlockEditor = React.lazy(() => import('../editors/gallery-block-editor/GalleryBlockEditor'));
 
// @ts-expect-error - Editor modules may lack proper type definitions
const CheckboxBlockEditor = React.lazy(() => import('../editors/checkbox-block-editor/CheckboxBlockEditor'));
 
// @ts-ignore 
const DropdownBlockEditor = React.lazy(() => import('../editors/dropdown-block-editor/DropdownBlockEditor'));
 
// @ts-ignore 
const ButtonEditor = React.lazy(() => import('../editors/button-editor/ButtonEditor'));
 
// @ts-ignore 
const LegacySectionEditor = React.lazy(() => import('../editors/legacy-section-editor/legacySectionEditor'));
 
// @ts-ignore 
const RecurrenceEditor = React.lazy(() => import('../editors/recurrence-editor/RecurrenceEditor'));
const TagWidgetBlockEditor = React.lazy(() => import('../editors/tag-widget-editor/TagWidgetBlockEditor'));
 
// @ts-ignore 
const MapBlockEditor = React.lazy(() => import('../editors/map-block-editor/MapBlockEditor'));
 
// @ts-ignore
const CalendarEditor = React.lazy(() => import('../editors/calendar-editor/CalendarEditor'));
 
// @ts-ignore
const SyncWidgetEditor = React.lazy(() => import('../editors/sync-widget-editor/SyncWidgetEditor'));

 
// @ts-ignore
const ToggleEditor = React.lazy(() => import('../editors/toggle-block-editor/ToggleBlockEditor'));

 
// @ts-ignore 
const AttachmentsWidgetEditor = React.lazy(() => import('../editors/attachments-widget-editor/AttachmentsWidgetEditor'));
const SignatureBlockEditor = React.lazy(() => import('../editors/signature-block-editor/SignatureBlockEditor'));
const ButtonMenuEditor = React.lazy(() => import('../editors/button-menu-editor/ButtonMenuEditor'));
const InputEditor = React.lazy(() => import('../editors/input-editor/InputEditor'));
const RadioGroupEditor = React.lazy(() => import('../editors/radio-group-editor/RadioGroupEditor'));
const ImageBlockEditor = React.lazy(() => import('../editors/image-block-editor/ImageBlockEditor'));
const LayoutContainerEditor = React.lazy(() => import('../editors/layout-container-editor'));


// ===== HELPER FUNCTIONS =====
const createTextHeader = (text: string) => {
  const TextHeaderComponent = () => 
    React.createElement(TextLine, { bold: true, fontSize: 'xlarge' }, text);
  TextHeaderComponent.displayName = `TextHeader_${text.replace(/\s+/g, '_')}`;
  return TextHeaderComponent;
};

const createSettingsHeader = (id: string, label: string) => {
  const SettingsHeaderComponent = () => 
    React.createElement(SettingsHeader, { crumbs: [{ id, label }] });
  SettingsHeaderComponent.displayName = `SettingsHeader_${id}`;
  return SettingsHeaderComponent;
};

const buildStandardProps = (props: RightPanelProps) => ({
  control: props.control,
  onChange: props.onControlChange,
  data: props.data,
  onSelect: props.onControlPropertySelected,
});

const buildRawControlProps = (props: RightPanelProps) => ({
  rawControl: props.control,
  onChange: props.onControlChange,
  data: props.data,
  onSelect: props.onControlPropertySelected,
  onAddAction: props.onAddAction,
});

// ===== WRAPPER ADAPTERS =====
interface WrapperAdapterProps {
  id: string;
  onControlClick?: (controlId: string) => void;
}

const ButtonWrapper: React.FC<WrapperAdapterProps> = ({ id, onControlClick }) => React.createElement(ButtonWrapperComponent, {
    id,
    onControlClick: onControlClick || (() => {})
  });

const InputWrapper: React.FC<WrapperAdapterProps> = ({ id }) => React.createElement(InputWrapperComponent, {
    id,
  });

const DropdownWrapper: React.FC<WrapperAdapterProps> = ({ id, onControlClick }) => React.createElement(DropdownDesignerWrapper, {
    id,
    onControlClick
  });

const ButtonGroupWrapperAdapter: React.FC<WrapperAdapterProps> = ({ id, onControlClick }) => React.createElement(ButtonGroupWrapper, {
    id,
    onControlClick: onControlClick || (() => {})
  });

const AttachmentsWrapper: React.FC<WrapperAdapterProps> = ({ id, onControlClick }) => React.createElement(AttachmentDesignerWrapper, {
    id,
    onControlClick: onControlClick || (() => {})
  });

const CalendarWrapper: React.FC<WrapperAdapterProps> = ({ id }) => React.createElement(CalendarDesignerWrapper, {
    id,
    canvasWidth: 900 // Default canvas width
  });

const SyncWidgetWrapper: React.FC<WrapperAdapterProps & Record<string, unknown>> = ({ onControlClick, ...restProps }) =>
  React.createElement(SyncWidgetWrapperComponent as unknown as React.ComponentType<Record<string, unknown>>, {
    ...restProps,
    onControlClick: onControlClick || (() => {}),
  });

// ===== UNIFIED REGISTRY =====
/**
 * The single source of truth for all control configurations.
 * TypeScript enforces that ALL ValidControlType entries have complete configurations.
 */

export const UnifiedControlRegistry: UnifiedControlRegistryType = {
  'layoutContainer': {
    editorName: 'LayoutContainerEditor',
    rumRoute: '/layout-designer/:screen/layout-container-editor/?',
    editor: LayoutContainerEditor as unknown as EditorComponent<LayoutContainerControl>,
    wrapper: LayoutContainerWrapper,
    widgetConstants: [String(widgets.LAYOUT_CONTAINER)],
    getHeader: createSettingsHeader('layout-container-settings', 'Container'),
    getProps: buildRawControlProps,
    displayRestrictions: getDisplayRestrictionsFromRegistryUtils('layoutContainer')!,
    defaultValues: {
      id: Guid.create(),
      type: String(widgets.LAYOUT_CONTAINER),
      name: 'layoutContainer',
      isBound: false,
      isWorking: false,
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
      onBlur: null,
      onChange: null,
      onClick: null,
      onFocus: null,
      validationRules: null,
      validationError: null,
      showIcon: false,
      icon: "account-files",
    },
  },

  'button': {
    editorName: 'ButtonEditor',
    rumRoute: '/layout-designer/:screen/button-editor/?',
    editor: ButtonEditor,
    wrapper: ButtonWrapper,
    widgetConstants: [String(widgets.BUTTON)],
    getHeader: createSettingsHeader('button-settings', 'Button'),
    getProps: (props) => ({
      key: props.control.id,
      rawControl: props.control,
      onChange: props.onControlChange,
      data: props.data,
      onActionChange: props.onActionChange,
      onAddAction: props.onAddAction,
    }),
    displayRestrictions: getDisplayRestrictionsFromRegistryUtils('button')!,
    defaultValues: getComponentDefaultsFromRegistryUtils('button')!,
  },

  'buttonGroup': {
    editorName: 'ButtonMenuEditor',
    rumRoute: '/layout-designer/:screen/button-menu-editor/?',
    editor: ButtonMenuEditor,
    wrapper: ButtonGroupWrapperAdapter,
    widgetConstants: [String(widgets.BUTTONGROUP)],
    getHeader: createSettingsHeader('button-menu-settings', 'Button menu'),
    getProps: (props) => ({
      rawControl: props.control,
      onChange: props.onControlChange,
      onAddAction: () => {
        // ButtonMenuEditor expects (control, eventName) signature
        if (props.onAddAction) {
          props.onAddAction();
        }
      },
    }),
    displayRestrictions: getDisplayRestrictionsFromRegistryUtils('buttonGroup')!,
    defaultValues: getComponentDefaultsFromRegistryUtils('buttonGroup')!,
  },

  'attachments': {
    editorName: 'AttachmentsWidgetEditor',
    rumRoute: '/layout-designer/:screen/attachment-widget-editor/?',
    editor: AttachmentsWidgetEditor,
    wrapper: AttachmentsWrapper,
    widgetConstants: [String(widgets.DOCUMENTSWIDGET)],
    getHeader: createSettingsHeader('attachment-widget-settings', 'Attachment widget'),
    getProps: buildRawControlProps,
    displayRestrictions: getDisplayRestrictionsFromRegistryUtils('attachments')!,
    defaultValues: getComponentDefaultsFromRegistryUtils('attachments')!,
  },

  'input': {
    editorName: 'InputEditor',
    rumRoute: '/layout-designer/:screen/input-editor/?',
    editor: InputEditor,
    wrapper: InputWrapper,
    widgetConstants: [String(widgets.TEXTBOX), String(widgets.ADDRESSLOOKUP)],
    getHeader: createSettingsHeader('input-settings', 'Text input'),
    getProps: buildRawControlProps,
    displayRestrictions: getDisplayRestrictionsFromRegistryUtils('input')!,
    defaultValues: getComponentDefaultsFromRegistryUtils('input')!,
  },

  'textArea': {
    editorName: 'InputEditor',
    rumRoute: '/layout-designer/:screen/input-editor/?',
    editor: InputEditor,
    wrapper: InputWrapper,
    widgetConstants: [String(widgets.TEXTAREA)],
    getHeader: createSettingsHeader('input-settings', 'Text area'),
    getProps: buildRawControlProps,
    displayRestrictions: getDisplayRestrictionsFromRegistryUtils('textArea')!,
    defaultValues: getComponentDefaultsFromRegistryUtils('textArea')!,
  },

  'dropdown': {
    editorName: 'DropdownBlockEditor',
    rumRoute: '/layout-designer/:screen/dropdown-block-editor/?',
    editor: DropdownBlockEditor,
    wrapper: DropdownWrapper,
    widgetConstants: [String(widgets.DROPDOWN)],
    getHeader: () => createSettingsHeader('dropdown-settings', 'Dropdown'),
    getProps: (props) => ({
      rawControl: props.control,
      onChange: props.onControlChange,
      onSelect: props.onControlPropertySelected,
      onActionChange: props.onActionChange,
      appId: props.appId,
      screenId: props.screenId,
      versionId: props.versionId,
      onSendAnalytics: props.onSendAnalytics,
      featureFlags: props.featureFlags,
      onAddAction: props.onAddAction,
    }),
    displayRestrictions: getDisplayRestrictionsFromRegistryUtils('dropdown')!,
    defaultValues: getComponentDefaultsFromRegistryUtils('dropdown')!,
  },

  'checkbox': {
    editorName: 'CheckboxBlockEditor',
    rumRoute: '/layout-designer/:screen/checkbox-block-editor/?',
    editor: CheckboxBlockEditor,
    wrapper: CheckboxDesignerWrapper,
    widgetConstants: [String(widgets.CHECKBOX)],
    getHeader: createSettingsHeader('checkbox-settings', 'Checkbox'),
    getProps: (props) => ({
      control: props.control,
      onChange: props.onControlChange,
      onAddAction: props.onAddAction,
    }),
    displayRestrictions: getDisplayRestrictionsFromRegistryUtils('checkbox')!,
    defaultValues: getComponentDefaultsFromRegistryUtils('checkbox')!,
  },

  'toggle': {
    editorName: 'ToggleEditor',
    rumRoute: '/layout-designer/:screen/toggle-block-editor/?',
    editor: ToggleEditor,
    wrapper: ToggleDesignerWrapper,
    widgetConstants: [String(widgets.TOGGLE)],
    getHeader: createSettingsHeader('toggle-settings', 'Toggle'),
    getProps: (props) => ({
      control: props.control,
      onChange: props.onControlChange,
      onAddAction: props.onAddAction,
    }),
    displayRestrictions: getDisplayRestrictionsFromRegistryUtils('toggle')!,
    defaultValues: getComponentDefaultsFromRegistryUtils('toggle')!,
  },

  'dateTimePicker': {
    editorName: 'DateTimePickerEditor',
    rumRoute: '/layout-designer/:screen/date-time-picker-editor/?',
    editor: DateTimePickerEditor,
    wrapper: DateTimePickerDesignerWrapper,
    widgetConstants: [String(widgets.DATETIMEPICKER)],
    getHeader: createSettingsHeader('date-time-picker-settings', 'Date Time Picker'),
    getProps: (props) => ({
      key: props.control.id,
      rawControl: props.control,
      onChange: props.onControlChange,
      onAddAction: props.onAddAction,
    }),
    displayRestrictions: getDisplayRestrictionsFromRegistryUtils('dateTimePicker')!,
    defaultValues: getComponentDefaultsFromRegistryUtils('dateTimePicker')!,
  },

  'label': {
    editorName: 'TextEditor',
    rumRoute: '/layout-designer/:screen/text-editor/?',
    editor: TextEditor,
    wrapper: TextDesignerWrapper,
    widgetConstants: [String(widgets.LABEL)],
    getHeader: createSettingsHeader('text-settings', 'Text'),
    getProps: buildRawControlProps,
    displayRestrictions: getDisplayRestrictionsFromRegistryUtils('label')!,
    defaultValues: getComponentDefaultsFromRegistryUtils('label')!,
  },

  'grid': {
    editorName: 'GridBlockEditor',
    rumRoute: '/layout-designer/:screen/grid-block-editor/?',
    editor: GridBlockEditor,
    wrapper: GridDesignerWrapper as unknown as WrapperComponent<GridControl>, // Temporary cast to bypass type issues
    widgetConstants: [String(widgets.DATATABLE)],
     
    getHeader: (props) => React.createElement(GridSettingsHeader as React.ComponentType<unknown>, {
      onChange: props.onControlChange,
      control: props.control,
      screenData: props.data,
      controlProperty: props.controlProperty,
      onControlPropertySelected: props.onControlPropertySelected,
    }),
    getProps: (props) => ({
      rawControl: props.control,
      onChange: props.onControlChange,
      data: props.data,
      onSelect: props.onControlPropertySelected,
      onActionChange: props.onActionChange,
      appId: props.appId,
      screenId: props.screenId,
      versionId: props.versionId,
      onSendAnalytics: props.onSendAnalytics,
      featureFlags: props.featureFlags,
      controlProperty: props.controlProperty,
      onAddAction: props.onAddAction,
    }),
    displayRestrictions: getDisplayRestrictionsFromRegistryUtils('grid')!,
    defaultValues: getComponentDefaultsFromRegistryUtils('grid')!,
  },

  'chart': {
    editorName: 'ChartBlockEditor',
    rumRoute: '/layout-designer/:screen/chart-block-editor/?',
    editor: ChartBlockEditor,
    wrapper: ChartDesignerWrapper as unknown as WrapperComponent<ChartControl>, // Temporary cast to bypass type issues
    widgetConstants: [String(widgets.CHART)],
    getHeader: createTextHeader('Configure chart'),
    getProps: (props) => ({
      rawControl: props.control,
      onChange: props.onControlChange,
      onActionChange: props.onActionChange,
      data: props.data,
      onSelect: props.onControlPropertySelected,
      onOpenAdvancedDesigner: props.onOpenAdvancedDesigner,
      onDrilldownSelect: props.onDrilldownSelected,
      appId: props.appId,
      screenId: props.screenId,
      versionId: props.versionId,
      onSendAnalytics: props.onSendAnalytics,
    }),
    displayRestrictions: getDisplayRestrictionsFromRegistryUtils('chart')!,
    defaultValues: getComponentDefaultsFromRegistryUtils('chart')!,
  },

  'image': {
    editorName: 'ImageBlockEditor',
    rumRoute: '/layout-designer/:screen/image-block-editor/?',
    editor: ImageBlockEditor,
    wrapper: ImageDesignerWrapper,
    widgetConstants: [String(widgets.PICTURE)],
    getHeader: createSettingsHeader('image-settings', 'Image'),
    getProps: (props) => ({
      control: props.control,
      onChange: props.onControlChange,
      onAddAction: props.onAddAction,
    }),
    displayRestrictions: getDisplayRestrictionsFromRegistryUtils('image')!,
    defaultValues: getComponentDefaultsFromRegistryUtils('image')!,
  },

  'signature': {
    editorName: 'SignatureBlockEditor',
    rumRoute: '/layout-designer/:screen/signature-block-editor/?',
    editor: SignatureBlockEditor,
    wrapper: SignatureDesignerWrapper as WrapperComponent<SignatureControl>, // Temporary cast to bypass type issues
    widgetConstants: [String(widgets.SIGNATURE)],
    getHeader: createSettingsHeader('signature-settings', 'Signature widget'),
    getProps: (props) => ({
      control: props.control,
      onChange: props.onControlChange,
      onAddAction: props.onAddAction,
    }),
    displayRestrictions: getDisplayRestrictionsFromRegistryUtils('signature')!,
    defaultValues: getComponentDefaultsFromRegistryUtils('signature')!,
  },

  'radioButton': {
    editorName: 'RadioGroupEditor',
    rumRoute: '/layout-designer/:screen/radio-group-editor/?',
    editor: RadioGroupEditor,
    wrapper: RadioGroupWrapper,
    widgetConstants: [String(widgets.RADIOBOX)],
    getHeader: createSettingsHeader('radio-group-settings', 'Radio group'),
    getProps: buildRawControlProps,
    displayRestrictions: getDisplayRestrictionsFromRegistryUtils('radioButton')!,
    defaultValues: getComponentDefaultsFromRegistryUtils('radioButton')!,
  },

  'map': {
    editorName: 'MapBlockEditor',
    rumRoute: '/layout-designer/:screen/map-block-editor/?',
    editor: MapBlockEditor,
    wrapper: MapDesignerWrapper,
    widgetConstants: [String(widgets.MAP)],
    getHeader: createSettingsHeader('map-settings', 'Map widget'),
    getProps: buildRawControlProps,
    displayRestrictions: getDisplayRestrictionsFromRegistryUtils('map')!,
    defaultValues: {
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
  },

  'htmlEditor': {
    editorName: 'HtmlEditorBlockEditor',
    rumRoute: '/layout-designer/:screen/html-editor/?',
    editor: HtmlEditorBlockEditor,
    wrapper: HtmlEditorWrapper,
    widgetConstants: [String(widgets.HTMLEDITOR)],
    getHeader: createSettingsHeader('html-editor-settings', 'HTML editor'),
    getProps: (props) => ({
      rawControl: props.control,
      onChange: props.onControlChange,
      data: props.data,
      onSelect: props.onControlPropertySelected,
      onAddAction: props.onAddAction,
    }),
    displayRestrictions: getDisplayRestrictionsFromRegistryUtils('htmlEditor')!,
    defaultValues: getComponentDefaultsFromRegistryUtils('htmlEditor')!,
  },

  'recurrence': {
    editorName: 'RecurrenceEditor',
    rumRoute: '/layout-designer/:screen/recurrence-editor/?',
    editor: RecurrenceEditor,
    wrapper: RecurrenceDesignerWrapper,
    widgetConstants: [String(widgets.RECURRENCE)],
    getHeader: createSettingsHeader('recurrence-settings', 'Recurrence widget'),
    getProps: buildRawControlProps,
    displayRestrictions: getDisplayRestrictionsFromRegistryUtils('recurrence')!,
    defaultValues: getComponentDefaultsFromRegistryUtils('recurrence')!,
  },

  'tagList': {
    editorName: 'TagWidgetBlockEditor',
    rumRoute: '/layout-designer/:screen/tag-widget-editor/?',
    editor: TagWidgetBlockEditor,
    wrapper: TagWidgetDesignerWrapper,
    widgetConstants: [String(widgets.TAGLIST)],
    getHeader: createSettingsHeader('tag-widget-settings', 'Tag List'),
    getProps: (props) => ({
      key: props.control.id,
      control: props.control,
      onChange: props.onControlChange,
    }),
    displayRestrictions: getDisplayRestrictionsFromRegistryUtils('tagList')!,
    defaultValues: getComponentDefaultsFromRegistryUtils('tagList')!,
  },

  'section': {
    editorName: 'LegacySectionEditor',
    rumRoute: '/layout-designer/:screen/section-block-editor/?',
    editor: LegacySectionEditor,
    wrapper: FieldBlockDesignerWrapper,
    widgetConstants: [String(widgets.SECTION)],
    getHeader: createSettingsHeader('section-settings', 'Section'),
    getProps: (props) => ({
      key: props.control.id,
      control: props.control,
      onChange: props.onControlChange,
    }),
    displayRestrictions: getDisplayRestrictionsFromRegistryUtils('section')!,
    defaultValues: {
      caption: 'Section',
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
  },

  'gallery': {
    editorName: 'GalleryBlockEditor',
    rumRoute: '/layout-designer/:screen/gallery-block-editor/?',
    editor: GalleryBlockEditor,
    wrapper: GalleryDesignerWrapper as WrapperComponent<GalleryControl>,
    widgetConstants: [String(widgets.GALLERY)],
    getHeader: createSettingsHeader('gallery-settings', 'Gallery'),
    getProps: (props) => ({
      rawControl: props.control,
      onChange: props.onControlChange,
      data: props.data,
      onSelect: props.onControlPropertySelected,
      onAddAction: props.onAddAction,
      appId: props.appId,
      screenId: props.screenId,
      versionId: props.versionId,
      onSendAnalytics: props.onSendAnalytics,
    }),
    displayRestrictions: getDisplayRestrictionsFromRegistryUtils('gallery')!,
    defaultValues: getComponentDefaultsFromRegistryUtils('gallery')!,
  },

  'fieldBlock': {
    editorName: 'FieldBlockEditor',
    rumRoute: '/layout-designer/:screen/field-block-editor/?',
    editor: FieldBlockEditor,
    wrapper: FieldBlockDesignerWrapper,
    widgetConstants: [String(widgets.FIELD_BLOCK)],
    getHeader: createTextHeader('Configure field block'),
    getProps: buildStandardProps,
    displayRestrictions: getDisplayRestrictionsFromRegistryUtils('fieldBlock')!,
    defaultValues: getComponentDefaultsFromRegistryUtils('fieldBlock')!,
  },

  'appRibbon': {
    editorName: 'FieldBlockEditor', // Reuse field block editor for now
    rumRoute: '/layout-designer/:screen/app-ribbon-editor/?',
    editor: FieldBlockEditor,
    wrapper: FieldBlockDesignerWrapper,
    widgetConstants: [String(widgets.APPRIBBON)],
    getHeader: createTextHeader('Configure app ribbon'),
    getProps: buildStandardProps,
    displayRestrictions: getDisplayRestrictionsFromRegistryUtils('appRibbon')!,
    defaultValues: getComponentDefaultsFromRegistryUtils('appRibbon')!
  },

  'calendar': {
    editorName: 'CalendarEditor',
    rumRoute: '/layout-designer/:screen/calendar-editor/?',
    editor: CalendarEditor,
    wrapper: CalendarWrapper,
    widgetConstants: [String(widgets.CALENDAR)],
     
    getHeader: (props) => React.createElement(CalendarSettingsHeader as React.ComponentType<unknown>, {
      control: props.control,
      controlProperty: props.controlProperty,
      onControlPropertySelected: props.onControlPropertySelected,
    }),
    getProps: (props) => ({
      rawControl: props.control,
      onChange: props.onControlChange,
      onAddAction: props.onAddAction,
      controlProperty: props.controlProperty,
      onSelect: props.onControlPropertySelected,
    }),
    displayRestrictions: getDisplayRestrictionsFromRegistryUtils('calendar')!,
    defaultValues: getComponentDefaultsFromRegistryUtils('calendar')!,
  },

  'syncWidget': {
    editorName: 'SyncWidgetEditor',
    rumRoute: '/layout-designer/:screen/sync-widget-editor/?',
    editor: SyncWidgetEditor,
    wrapper: SyncWidgetWrapper,
    widgetConstants: [String(widgets.SYNCWIDGET)],
    getHeader: createSettingsHeader('sync-widget-settings', 'Sync widget'),
    getProps: (props) => ({
      rawControl: props.control,
      onChange: props.onControlChange,
      data: props.data,
      onSelect: props.onControlPropertySelected,
      onAddAction: props.onAddAction,
    }),
    displayRestrictions: getDisplayRestrictionsFromRegistryUtils('syncWidget')!,
    defaultValues: {
      ...SYNC_WIDGET_DEFAULTS,
      caption: 'Sync widget',
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
  },
};

// ===== UTILITY FUNCTIONS =====

/**
 * Widget type to control type mapping
 * Maps the legacy widget constants to our new control types
 */
export const WIDGET_TO_CONTROL_TYPE_MAP: Record<string, ValidControlType> = {
  [String(widgets.FIELD_BLOCK)]: 'fieldBlock',
  [String(widgets.CHART)]: 'chart',
  [String(widgets.DATATABLE)]: 'grid',
  [String(widgets.GALLERY)]: 'gallery',
  [String(widgets.APPRIBBON)]: 'button', // Special case
  [String(widgets.CHECKBOX)]: 'checkbox',
  [String(widgets.DROPDOWN)]: 'dropdown',
  [String(widgets.BUTTON)]: 'button',
  [String(widgets.SECTION)]: 'section',
  [String(widgets.RECURRENCE)]: 'recurrence',
  [String(widgets.TAGLIST)]: 'tagList',
  [String(widgets.MAP)]: 'map',
  [String(widgets.TOGGLE)]: 'toggle',
  [String(widgets.HTMLEDITOR)]: 'htmlEditor',
  [String(widgets.ADDRESSLOOKUP)]: 'input',
  [String(widgets.DOCUMENTSWIDGET)]: 'attachments',
  [String(widgets.DATETIMEPICKER)]: 'dateTimePicker',
  [String(widgets.SIGNATURE)]: 'signature',
  [String(widgets.BUTTONGROUP)]: 'buttonGroup',
  [String(widgets.TEXTBOX)]: 'input',
  [String(widgets.TEXTAREA)]: 'textArea', // 🎯 USER REQUEST: Use new textArea control type
  [String(widgets.LABEL)]: 'label',
  [String(widgets.RADIOBOX)]: 'radioButton',
  [String(widgets.PICTURE)]: 'image',
  [String(widgets.LAYOUT_CONTAINER)]: 'layoutContainer',
  [String(widgets.CALENDAR)]: 'calendar',
  [String(widgets.SYNCWIDGET)]: 'syncWidget', // Add missing SYNCWIDGET mapping
};

/**
 * Get unified configuration for a specific control type
 * @param controlType - The control type to get configuration for
 * @returns The unified configuration for the control type
 */
export function getUnifiedControlConfig(controlType: ValidControlType): ControlConfiguration {
  return UnifiedControlRegistry[controlType] as ControlConfiguration;
}

/**
 * Get editor component for a specific control type
 * @param controlType - The control type to get editor for
 * @returns The editor component for the control type
 */
export function getEditorComponent(controlType: ValidControlType): EditorComponent {
  return UnifiedControlRegistry[controlType].editor as EditorComponent;
}

/**
 * Get wrapper component for a specific control type
 * @param controlType - The control type to get wrapper for
 * @returns The wrapper component for the control type
 */
export function getWrapperComponent(controlType: ValidControlType): WrapperComponent {
  return UnifiedControlRegistry[controlType].wrapper as WrapperComponent;
}

/**
 * Get right panel configuration for a specific control type
 * @param controlType - The control type to get configuration for
 * @returns The right panel configuration for the control type
 */
export function getRightPanelConfig(controlType: ValidControlType): Pick<ControlConfiguration, 'editorName' | 'rumRoute' | 'getHeader' | 'getProps'> {
  const config = UnifiedControlRegistry[controlType];
  return {
    editorName: config.editorName,
    rumRoute: config.rumRoute,
    getHeader: config.getHeader,
    getProps: config.getProps,
  };
}

/**
 * Map legacy widget type to control type
 * @param widgetType - Legacy widget type constant
 * @returns Corresponding control type or undefined if not mapped
 */
export function mapWidgetToControlType(widgetType: string): ValidControlType | undefined {
  return mapWidgetToControlTypeFromRegistry(widgetType);
}

/**
 * Check if a control type has a fully implemented configuration
 * @param controlType - The control type to check
 * @returns True if the configuration is implemented
 */
export function isConfigImplemented(controlType: ValidControlType): boolean {
  return UnifiedControlRegistry[controlType].editorName !== 'PlaceholderEditor';
}

/**
 * Get all control types that have implemented configurations
 * @returns Array of control types with implemented configurations
 */
export function getImplementedConfigTypes(): ValidControlType[] {
  return (Object.keys(UnifiedControlRegistry) as ValidControlType[])
    .filter(type => isConfigImplemented(type));
}

/**
 * Render wrapper component for a control type
 * @param type - The control type
 * @param id - The control ID
 * @returns JSX element for the wrapper component
 */
export function renderWrapper(type: ValidControlType, id: string): React.ReactElement {
  const WrapperComponent = getWrapperComponent(type);
  return React.createElement(WrapperComponent, { id });
}


export function getComponentDefaultsFromRegistry(componentType: ValidControlType): Record<string, unknown> {
  return getComponentDefaultsFromRegistryUtils(componentType);
}

/**
 * Get display restrictions for a component type from the unified registry
 * @param componentType - The component/widget type
 * @returns Display restrictions or undefined if not configured
 */
export function getDisplayRestrictionsFromRegistry(componentType: ValidControlType) {
  return getDisplayRestrictionsFromRegistryUtils(componentType);
}
