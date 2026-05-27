/* eslint-disable react/display-name */
import React from 'react';
import { widgets } from '@m-next/types';
import { TextLine } from '@m-next/typeography';
import { getWidgetIconName } from '@m-next/layout-canvas';
import RelatedRecordsHeader from '../editors/related-records-editor/RelatedRecordsHeader';
import GridSettingsHeader from '../editors/grid-block-editor/GridSettingsHeader';
import SettingsHeader from '../editors/common/components/settings-header/SettingsHeader';
import CalendarSettingsHeader from '../editors/calendar-editor/CalendarSettingsHeader';

// Common prop builders
const buildStandardProps = (props) => ({
  control: props.control,
  onChange: props.onControlChange,
  data: props.data,
  onSelect: props.onControlPropertySelected,
});

const buildRawControlProps = (props) => ({
  rawControl: props.control,
  onChange: props.onControlChange,
  data: props.data,
  onSelect: props.onControlPropertySelected,
  onAddAction: props.onAddAction,
});

const buildAdvancedProps = (baseProps) => (props) => ({
  ...baseProps(props),
  appId: props.appId,
  screenId: props.screenId,
  versionId: props.versionId,
  onSendAnalytics: props.onSendAnalytics,
});

// Header builders
const createTextHeader = (text) => () => (
  <TextLine bold fontSize='xlarge'>
    {text}
  </TextLine>
);

const createSettingsHeader = (id, label, props) =>
{
  const newLabel = props?.control?.name || label;
  return <SettingsHeader
    crumbs={[{ id, label: newLabel }]}
    controlId={props?.control?.id}
    controlProperty={props?.controlProperty}
    onControlPropertySelected={props?.onControlPropertySelected}
    hideReferences={props?.hideReferences}
    screenData={props?.screenData}
    showDeleteIcon={props?.showDeleteIcon !== undefined ? props.showDeleteIcon : true}
    showDuplicateIcon={props?.showDuplicateIcon !== undefined ? props.showDuplicateIcon : true}
    onDelete={() => props?.onControlDelete?.(props?.control?.id)}
    onDuplicate={() => props?.onControlDuplicate?.(props?.control?.id)}
    iconName={getWidgetIconName(props?.control?.typeOverride || props?.control?.type)}
  />;
}

// Widget configuration
export const widgetConfig = {
  [widgets.FIELD_BLOCK]: {
    editorName: 'FieldBlockEditor',
    rumRoute: '/layout-designer/:screen/field-block-editor/?',
    getHeader: createTextHeader('Configure field block'),
    getProps: buildStandardProps,
  },

  [widgets.CHART]: {
    editorName: 'ChartBlockEditor',
    rumRoute: '/layout-designer/:screen/chart-block-editor/?',
    getHeader: (props) => createSettingsHeader('chart-settings', 'Chart', props),
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
  },

  [widgets.DATATABLE]: {
    editorName: 'GridBlockEditor',
    rumRoute: '/layout-designer/:screen/grid-block-editor/?',
    getHeader: (props) => (
      <GridSettingsHeader
        onChange={props.onControlChange}
        control={props.control}
        data={props.data}
        controlProperty={props.controlProperty}
        onControlPropertySelected={props.onControlPropertySelected}
        onControlDuplicate={props.onControlDuplicate}
        onControlDelete={props.onControlDelete}
        screenData={props?.screenData}
      />
    ),
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
  },

  [widgets.GALLERY]: {
    editorName: 'GalleryBlockEditor',
    rumRoute: '/layout-designer/:screen/gallery-block-editor/?',
    getHeader: (props) => createSettingsHeader('gallery-settings', 'Gallery', props),
    getProps: buildAdvancedProps((props) => ({
      rawControl: props.control,
      onChange: props.onControlChange,
      data: props.data,
      onSelect: props.onControlPropertySelected,
      onAddAction: props.onAddAction,
    })),
  },

  [widgets.APPRIBBON]: {
    editorName: 'RelatedRecordsEditor',
    rumRoute: '/layout-designer/:screen/related-records-editor/?',
    getHeader: (props) => (
      <RelatedRecordsHeader
        currentTab={props.controlProperty}
        onSelect={props.onControlPropertySelected}
        onTabsSettingsChange={props.onTabsSettingsChange}
        tabList={props.tabList}
      />
    ),
    getProps: (props) => ({
      rawControl: props.control,
      onChange: props.onRibbonChange,
      data: props.data,
      onSelect: props.onControlPropertySelected,
      appId: props.appId,
      screenId: props.screenId,
      versionId: props.versionId,
      activeRecordId: props.activeRecordId,
      initialRelation: props.controlProperty,
      expandAll: true,
      onTabsSettingsChange: props.onTabsSettingsChange,
      tabList: props.tabList,
    }),
  },

  [widgets.CHECKBOX]: {
    editorName: 'CheckboxBlockEditor',
    rumRoute: '/layout-designer/:screen/checkbox-block-editor/?',
    getHeader: (props) => createSettingsHeader('checkbox-settings', 'Checkbox', props),
    getProps: (props) => ({
      control: props.control,
      onChange: props.onControlChange,
      onAddAction: props.onAddAction,
    }),
  },

  [widgets.DROPDOWN]: {
    editorName: 'DropdownBlockEditor',
    rumRoute: '/layout-designer/:screen/dropdown-block-editor/?',
    getHeader: (props) => createSettingsHeader('dropdown-settings', 'Dropdown', props),
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
  },

  [widgets.BUTTON]: {
    editorName: 'ButtonEditor',
    rumRoute: '/layout-designer/:screen/button-editor/?',
    getHeader: (props) => createSettingsHeader('button-settings', 'Button', props),
    getProps: (props) => ({
      key: props.control.id,
      rawControl: props.control,
      onChange: props.onControlChange,
      data: props.data,
      onActionChange: props.onActionChange,
      onAddAction: props.onAddAction,
    }),
  },

  [widgets.SECTION]: {
    editorName: 'LegacySectionEditor',
    rumRoute: '/layout-designer/:screen/section-block-editor/?',
    getHeader: (props) => createSettingsHeader('section-settings', 'Section', props),
    getProps: (props) => ({
      key: props.control.id,
      control: props.control,
      onChange: props.onControlChange,
    }),
  },

  [widgets.RECURRENCE]: {
    editorName: 'RecurrenceEditor',
    rumRoute: '/layout-designer/:screen/recurrence-editor/?',

    getHeader: (props) => createSettingsHeader('recurrence-settings', 'Recurrence widget', props),
    getProps: buildRawControlProps,
  },

  [widgets.TAGLIST]: {
    editorName: 'TagWidgetBlockEditor',
    rumRoute: '/layout-designer/:screen/tag-widget-editor/?',

    getHeader: (props) => createSettingsHeader('tag-widget-settings', 'Tag List', props),
    getProps: (props) => ({
      key: props.control.id,
      control: props.control,
      onChange: props.onControlChange,
    }),
  },

  [widgets.MAP]: {
    editorName: 'MapBlockEditor',
    rumRoute: '/layout-designer/:screen/map-block-editor/?',

    getHeader: (props) => createSettingsHeader('map-settings', 'Map widget', props),
    getProps: buildRawControlProps,
  },
  [widgets.SYNCWIDGET]: {
    editorName: 'SyncWidgetEditor',
    rumRoute: '/layout-designer/:screen/sync-widget-editor/?',

    getHeader: (props) => createSettingsHeader('sync-widget-settings', 'Sync widget', props),
    getProps: buildRawControlProps,
  },
  [widgets.TOGGLE]: {
    editorName: 'ToggleEditor',
    rumRoute: '/layout-designer/:screen/toggle-block-editor/?',
    getHeader: (props) => createSettingsHeader('toggle-settings', 'Toggle', props),
    getProps: (props) => ({
      control: props.control,
      onChange: props.onControlChange,
      onAddAction: props.onAddAction,
    }),
  },
  [widgets.HTMLEDITOR]: {
    editorName: 'HtmlEditorBlockEditor',
    rumRoute: '/layout-designer/:screen/html-editor/?',

    getHeader: (props) => createSettingsHeader('html-editor-settings', 'HTML editor', props),
    getProps: (props) => ({
      rawControl: props.control,
      onChange: props.onControlChange,
      data: props.data,
      onSelect: props.onControlPropertySelected,
      onAddAction: props.onAddAction,
    }),
  },
  [widgets.ADDRESSLOOKUP]: {
    editorName: 'AddressLookupBlockEditor',
    rumRoute: '/layout-designer/:screen/address-lookup-block-editor/?',

    getHeader: (props) => createSettingsHeader('address-lookup-settings', 'Address lookup', props),
    getProps: buildRawControlProps,
  },
  [widgets.DOCUMENTSWIDGET]: {
    editorName: 'AttachmentsWidgetEditor',
    rumRoute: '/layout-designer/:screen/attachment-widget-editor/?',

    getHeader: (props) => createSettingsHeader('attachment-widget-settings', 'Attachment widget', props),
    getProps: buildRawControlProps,
  },
  [widgets.DATETIMEPICKER]: {
    editorName: 'DateTimePickerEditor',
    rumRoute: '/layout-designer/:screen/date-time-picker-editor/?',

    getHeader: (props) => createSettingsHeader('date-time-picker-settings', 'Date Time Picker', props),
    getProps: (props) => ({
      key: props.control.id,
      rawControl: props.control,
      onChange: props.onControlChange,
      onAddAction: props.onAddAction,
    }),
  },
  [widgets.SIGNATURE]: {
    editorName: 'SignatureBlockEditor',
    rumRoute: '/layout-designer/:screen/signature-block-editor/?',

    getHeader: (props) => createSettingsHeader('signature-settings', 'Signature widget', props),
    getProps: (props) => ({
      control: props.control,
      onChange: props.onControlChange,
      onAddAction: props.onAddAction,
    }),
  },
  [widgets.BUTTONGROUP]: {
    editorName: 'ButtonMenuEditor',
    rumRoute: '/layout-designer/:screen/button-menu-editor/?',
    getHeader: (props) => createSettingsHeader('button-menu-settings', 'Button menu', props),
    getProps: buildRawControlProps,
  },
  [widgets.TEXTBOX]: {
    editorName: 'InputEditor',
    rumRoute: '/layout-designer/:screen/input-editor/?',
    getHeader: (props) => createSettingsHeader('input-settings', 'Text input', props),
    getProps: buildRawControlProps,
  },
  [widgets.TEXTAREA]: {
    editorName: 'InputEditor',
    rumRoute: '/layout-designer/:screen/input-editor/?',
    getHeader: (props) => createSettingsHeader('input-settings', 'Text input', props),
    getProps: buildRawControlProps,
  },
  [widgets.LABEL]: {
    editorName: 'TextEditor',
    rumRoute: '/layout-designer/:screen/text-editor/?',
    getHeader: (props) => createSettingsHeader('text-settings', 'Text label', props),
    getProps: buildRawControlProps,
  },
  [widgets.RADIOBOX]: {
    editorName: 'RadioGroupEditor',
    rumRoute: '/layout-designer/:screen/radio-group-editor/?',
    getHeader: (props) => createSettingsHeader('radio-group-settings', 'Radio group', props),
    getProps: buildRawControlProps,
  },
  [widgets.PICTURE]: {
    editorName: 'ImageBlockEditor',
    rumRoute: '/layout-designer/:screen/image-block-editor/?',

    getHeader: (props) => createSettingsHeader('image-settings', 'Image', props),
    getProps: (props) => ({
      control: props.control,
      onChange: props.onControlChange,
      onAddAction: props.onAddAction,
    }),
  },
  [widgets.CALENDAR]: {
    editorName: 'CalendarEditor',
    rumRoute: '/layout-designer/:screen/calendar-editor/?',

    getHeader: (props) => (
      <CalendarSettingsHeader
        control={props.control}
        controlProperty={props.controlProperty}
        onControlPropertySelected={props.onControlPropertySelected}
        onControlDuplicate={props.onControlDuplicate}
        onControlDelete={props.onControlDelete}
        screenData={props?.screenData}
      />
    ),
    getProps: (props) => ({
      rawControl: props.control,
      onChange: props.onControlChange,
      controlProperty: props.controlProperty,
      onAddAction: props.onAddAction,
      onSelect: props.onControlPropertySelected,
    }),
  },
  [widgets.SCREENDESIGN]: {
    editorName: 'ScreenEditor',
    rumRoute: '/layout-designer/:screen/screen-editor/?',
    getHeader: () => createSettingsHeader('screen-settings', 'Screen properties', {hideReferences: true, showDeleteIcon: false, showDuplicateIcon: false}),
    getProps:  (props) => ({
      onChange: props.onScreenPropertiesChanges,
      onAddAction: props.onAddAction,
    }),
  },
  [widgets.LAYOUT_CONTAINER]: {
    editorName: 'LayoutContainerEditor',
    rumRoute: '/layout-designer/:screen/layout-container-editor/?',
    getHeader: (props) => createSettingsHeader('layout-container-settings', 'Container', props),
    getProps: buildRawControlProps,
  },
};
