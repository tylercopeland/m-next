import React, { forwardRef, useRef } from 'react';
import { Tooltip } from 'react-tooltip';
import * as s from './Tabs.styles';
import TabHeader from './TabHeader';
import TabHeaderFixed from './TabHeaderFull';

// One-time deprecation warner — fires once per key, mirrors @m-next/input.
const warnOnce = (() => {
  const seen = new Set();
  return (key, message) => {
    if (seen.has(key) || typeof console === 'undefined') return;
    seen.add(key);
    // eslint-disable-next-line no-console
    console.warn(message);
  };
})();

let autoIdCounter = 0;

const Tabs = forwardRef(function Tabs(props, ref) {
  const {
    id: idProp,
    width = '100%',
    tabList,
    onChange = null,
    onRenderTabContent = null,
    selectedTab = null,
    onRenderTabHeader = null,
    onRenderTabHeaderMenuItem = null,
    onRenderTabHeaderRightIcon = null,

    refreshId = 0,
    containerMargin,
    tabPadding = 0,
    borderless = false,
    dyanmicHeight = false,
    contentStyle,
    headerStyle,
    containerStyle,
    legacyPadding = false,
    fullHeight = false,
    calMenuHeight = false,
    fullWidthTabs = false,
    collapsible = false,
    onTabOrderChange = null,

    // Soft-shimmed legacy props
    forwardRef: legacyForwardRef,

    // Silently ignored legacy ghosts
    isV4Design: _isV4Design,
    isMobile: _isMobile,
    legacyClass: _legacyClass,
    displayAuto: _displayAuto,
    onRenderTabHeaderMobile: _onRenderTabHeaderMobile,
  } = props;

  // Auto-generate id if not provided.
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-tabs-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  // ============ Backwards-compat translation ============

  if (legacyForwardRef) {
    warnOnce(
      'tabs-forwardRef-prop',
      '@m-next/tabs: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  const renderTabContent = () => {
    if (onRenderTabContent) {
      return onRenderTabContent();
    }
    return null;
  };

  // The active tab's panel uses aria-labelledby that matches the active tab button id.
  const activeTabButtonId = selectedTab ? `tab-${id}-${selectedTab}` : undefined;
  const tabPanelId = `tab-panel-${id}`;

  return (
    <s.TabContainer
      ref={ref ?? legacyForwardRef}
      id={`tabs-${id}`}
      width={width}
      fullHeight={fullHeight}
      containerMargin={containerMargin}
      style={containerStyle}
    >
      {tabList.length > 0 && !fullWidthTabs && (
        <TabHeader
          id={id}
          tabList={tabList}
          selectedTab={selectedTab}
          onChange={onChange}
          onRenderTabHeader={onRenderTabHeader}
          onRenderTabHeaderMenuItem={onRenderTabHeaderMenuItem}
          onRenderTabHeaderRightIcon={onRenderTabHeaderRightIcon}
          refreshId={refreshId}
          tabPadding={tabPadding}
          headerStyle={headerStyle}
          legacyPadding={legacyPadding}
          fullWidthTabs={fullWidthTabs}
          collapsible={collapsible}
          onTabOrderChange={onTabOrderChange}
        />
      )}
      {tabList.length > 0 && fullWidthTabs && (
        <TabHeaderFixed
          id={id}
          tabList={tabList}
          selectedTab={selectedTab}
          onChange={onChange}
          onRenderTabHeader={onRenderTabHeader}
          onRenderTabHeaderMenuItem={onRenderTabHeaderMenuItem}
          onRenderTabHeaderRightIcon={onRenderTabHeaderRightIcon}
          refreshId={refreshId}
          tabPadding={tabPadding}
          headerStyle={headerStyle}
          legacyPadding={legacyPadding}
          fullWidthTabs={fullWidthTabs}
        />
      )}

      {onRenderTabContent && (
        <s.TabPanel
          role='tabpanel'
          id={tabPanelId}
          aria-labelledby={activeTabButtonId}
          borderless={borderless}
          dyanmicHeight={dyanmicHeight}
          calMenuHeight={calMenuHeight}
          style={contentStyle}
        >
          {renderTabContent()}
        </s.TabPanel>
      )}
      <Tooltip id='tab-header-tooltip' />
    </s.TabContainer>
  );
});

Tabs.displayName = 'Tabs';

export default Tabs;
