/* eslint-disable react-hooks/rules-of-hooks */
/**
 * RightNav component renders the right navigation panel in the layout designer.
 * It dynamically loads different editors based on the type of control selected.
 */

import React, { Suspense, useEffect, useState, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import Container from '@m-next/container';
import LoadingSkeleton from '@m-next/loading-skeleton';
import { ErrorBoundary } from '@m-next/utilities';
import { widgets } from '@m-next/types';
import { Text, TextLine } from '@m-next/typeography';
import * as s from './rightPanel.styles';
import { useRUMRouteChange } from '../../../common/rum';
import { widgetConfig } from './config';
import { LOADING_SKELETON_PROPS, EMPTY_STATE_MESSAGES } from './constants';
import ControlReferences from '../editors/common/components/ControlReferences';

const FieldBlockEditor = React.lazy(() => import('../editors/field-block-editor/fieldBlockEditor'));
const ChartBlockEditor = React.lazy(() => import('../editors/chart-block-editor/ChartBlockEditor'));
const GridBlockEditor = React.lazy(() => import('../editors/grid-block-editor/GridBlockEditor'));
const GalleryBlockEditor = React.lazy(() => import('../editors/gallery-block-editor/GalleryBlockEditor'));
const RelatedRecordsEditor = React.lazy(() => import('../editors/related-records-editor/RelatedRecordsEditor'));
const ButtonEditor = React.lazy(() => import('../editors/button-editor/ButtonEditor'));
const ButtonMenuEditor = React.lazy(() => import('../editors/button-menu-editor/ButtonMenuEditor'));
const LegacySectionEditor = React.lazy(() => import('../editors/legacy-section-editor/legacySectionEditor'));
const RecurrenceEditor = React.lazy(() => import('../editors/recurrence-editor/RecurrenceEditor'));
const MapBlockEditor = React.lazy(() => import('../editors/map-block-editor/MapBlockEditor'));
const TagWidgetBlockEditor = React.lazy(() => import('../editors/tag-widget-editor/TagWidgetBlockEditor'));
const CheckboxBlockEditor = React.lazy(() => import('../editors/checkbox-block-editor/CheckboxBlockEditor'));
const DropdownBlockEditor = React.lazy(() => import('../editors/dropdown-block-editor/DropdownBlockEditor'));
const ToggleEditor = React.lazy(() => import('../editors/toggle-block-editor/ToggleBlockEditor'));
const HtmlEditorBlockEditor = React.lazy(() => import('../editors/html-editor/HtmlEditorBlockEditor'));
const AddressLookupBlockEditor = React.lazy(
  () => import('../editors/address-lookup-block-editor/AddressLookupBlockEditor'),
);
const AttachmentsWidgetEditor = React.lazy(
  () => import('../editors/attachments-widget-editor/AttachmentsWidgetEditor'),
);
const SignatureBlockEditor = React.lazy(() => import('../editors/signature-block-editor/SignatureBlockEditor'));
const DateTimePickerEditor = React.lazy(() => import('../editors/date-time-picker-editor/DateTimePickerEditor'));
const InputEditor = React.lazy(() => import('../editors/input-editor/InputEditor'));
const TextEditor = React.lazy(() => import('../editors/text-panel-editor/TextEditor'));
const ImageBlockEditor = React.lazy(() => import('../editors/image-block-editor/ImageBlockEditor'));
const RadioGroupEditor = React.lazy(() => import('../editors/radio-group-editor/RadioGroupEditor'));
const CalendarEditor = React.lazy(() => import('../editors/calendar-editor/CalendarEditor'));
const SyncWidgetEditor = React.lazy(() => import('../editors/sync-widget-editor/SyncWidgetEditor'));
const ScreenEditor = React.lazy(() => import('../editors/screen-editor/ScreenEditor'));
const LayoutContainerEditor = React.lazy(() => import('../editors/layout-container-editor'));

const editors = {
  FieldBlockEditor,
  ChartBlockEditor,
  GridBlockEditor,
  GalleryBlockEditor,
  RelatedRecordsEditor,
  ButtonEditor,
  ButtonMenuEditor,
  LegacySectionEditor,
  RecurrenceEditor,
  MapBlockEditor,
  TagWidgetBlockEditor,
  CheckboxBlockEditor,
  DropdownBlockEditor,
  ToggleEditor,
  HtmlEditorBlockEditor,
  AddressLookupBlockEditor,
  AttachmentsWidgetEditor,
  SignatureBlockEditor,
  DateTimePickerEditor,
  InputEditor,
  TextEditor,
  ImageBlockEditor,
  RadioGroupEditor,
  CalendarEditor,
  SyncWidgetEditor,
  ScreenEditor,
  LayoutContainerEditor,
};

const propTypes = {
  control: PropTypes.instanceOf(Object),
  controlProperty: PropTypes.instanceOf(Object),
  onControlChange: PropTypes.func,
  onActionChange: PropTypes.func,
  onRibbonChange: PropTypes.func,
  onControlPropertySelected: PropTypes.func,
  data: PropTypes.instanceOf(Object),
  featureFlags: PropTypes.instanceOf(Object),
  onOpenAdvancedDesigner: PropTypes.func,
  onDrilldownSelected: PropTypes.func,
  appId: PropTypes.string,
  screenId: PropTypes.string,
  versionId: PropTypes.string,
  onSendAnalytics: PropTypes.func,
  activeRecordId: PropTypes.string,
  onTabsSettingsChange: PropTypes.func,
  tabList: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  onAddAction: PropTypes.func,
  onScreenPropertiesChanges: PropTypes.func,
  screenData: PropTypes.instanceOf(Object),
  onControlDelete: PropTypes.func,
  onControlDuplicate: PropTypes.func,
};

// Custom hooks
const useRUMTracking = (control, currentId) => {
  useEffect(() => {
    if (!control || currentId === control.id) return;

    const config = control.typeOverride ? widgetConfig[control.typeOverride] : widgetConfig[control.type];
    const route = config?.rumRoute || '/layout-designer/:screen';
    useRUMRouteChange(route);
  }, [control, currentId]);
};

// Component factories
const createEmptyState = (message = EMPTY_STATE_MESSAGES.SELECT_OBJECT) => (
  <s.EmptyWrapper>
    <Text>{message}</Text>
  </s.EmptyWrapper>
);

const createLoadingSkeleton = () => <LoadingSkeleton {...LOADING_SKELETON_PROPS} />;

const createSuspenseWrapper = (children) => <Suspense fallback={createLoadingSkeleton()}>{children}</Suspense>;

// Widget renderers
const renderAppRibbonWidget = (props) => {
  const {
    featureFlags,
    control,
    onRibbonChange,
    data,
    onControlPropertySelected,
    appId,
    screenId,
    versionId,
    activeRecordId,
    controlProperty,
    onTabsSettingsChange,
    tabList,
  } = props;

  if (!featureFlags?.appRibbonV3Configuration) {
    return createEmptyState();
  }

  return createSuspenseWrapper(
    <editors.RelatedRecordsEditor
      rawControl={control}
      onChange={onRibbonChange}
      data={data}
      onSelect={onControlPropertySelected}
      appId={appId}
      screenId={screenId}
      versionId={versionId}
      activeRecordId={activeRecordId}
      initialRelation={controlProperty}
      expandAll
      onTabsSettingsChange={onTabsSettingsChange}
      tabList={tabList}
    />,
  );
};

const renderStandardWidget = (config, props) => {
  const Component = editors[config.editorName];
  if (!Component) {
    console.warn(`Editor component ${config.editorName} not found`);
    return createEmptyState(EMPTY_STATE_MESSAGES.UNABLE_TO_CONFIGURE);
  }

  const componentProps = config.getProps(props);

  return createSuspenseWrapper(<Component {...componentProps} />);
};

function RightNav(props) {
  // const { control, controlProperty, featureFlags, onControlPropertySelected, onTabsSettingsChange, tabList } = props;
  const { control, controlProperty, featureFlags, screenData } = props;

  const [currentId, setCurrentId] = useState(null);
  const scrollableRef = useRef(null);

  // Update current ID when control changes
  useEffect(() => {
    if (control?.id !== currentId) {
      setCurrentId(control?.id || null);
    }
  }, [control?.id, currentId]);

  // Reset scroll position when control or controlProperty changes
  useEffect(() => {
    const scrollElement = scrollableRef.current?.getScrollElement?.();
    if (scrollElement) {
      scrollElement.scrollTop = 0;
    }
  }, [control?.id, controlProperty]);

  // Handle RUM tracking
  useRUMTracking(control, currentId);

  // Memoize widget config for current control
  const currentConfig = useMemo(() => {
    if (!control) {
      return widgetConfig[widgets.SCREENDESIGN];
    }
    if (control?.typeOverride) {
      return widgetConfig[control.typeOverride];
    }
    return control?.type ? widgetConfig[control.type] : null;
  }, [control]);

  const renderContent = () => {
    if (controlProperty?.controlReferencesSelected) {
      return <ControlReferences control={control} screenData={screenData} />;
    }

    // Special handling for APPRIBBON
    if (control?.type === widgets.APPRIBBON) {
      return renderAppRibbonWidget(props);
    }

    // Standard widget rendering
    if (!currentConfig) {
      return createEmptyState();
    }

    return renderStandardWidget(currentConfig, props);
  };

  const renderHeader = () => {
    // Default header
    const defaultHeader = (
      <TextLine bold fontSize='xlarge'>
        Object properties
      </TextLine>
    );

    // Special handling for APPRIBBON header
    if (control?.type === widgets.APPRIBBON) {
      return featureFlags?.appRibbonV3Configuration ? currentConfig?.getHeader?.(props) : defaultHeader;
    }

    // Standard widget header
    if (!currentConfig) {
      return defaultHeader;
    }

    return currentConfig.getHeader?.(props) || defaultHeader;
  };

  const errorFallback = () => createEmptyState(EMPTY_STATE_MESSAGES.UNABLE_TO_CONFIGURE);

  return (
    <Container id='right-panel' isRound={false} style={{ padding: 0 }} width='100%' borderless scrollable scrollableRef={scrollableRef}>
      <s.Header>{renderHeader()}</s.Header>
      <Container
        id='right-panel-inner'
        style={{ padding: 0, marginBottom: 104 }}
        isRound={false}
        width='100%'
        borderless
      >
        <ErrorBoundary fallback={errorFallback()}>
          <div>{renderContent()}</div>
        </ErrorBoundary>
      </Container>
    </Container>
  );
}

RightNav.propTypes = propTypes;
export default RightNav;
