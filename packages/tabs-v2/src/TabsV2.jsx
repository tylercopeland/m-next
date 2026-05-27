/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tooltip';
import * as s from './TabsV2.styles';
import TabHeaderV2 from './TabHeaderV2';
import TabHeaderFixedV2 from './TabHeaderFullV2';

const propTypes = {
  id: PropTypes.string.isRequired,
  tabList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      caption: PropTypes.string.isRequired,
    }),
  ).isRequired,
  width: PropTypes.string,
  onChange: PropTypes.func,
  onRenderTabContent: PropTypes.func,
  selectedTab: PropTypes.string,
  onRenderTabHeader: PropTypes.func,
  onRenderTabHeaderMenuItem: PropTypes.func,
  onRenderTabHeaderMobile: PropTypes.func,
  onRenderTabHeaderRightIcon: PropTypes.func,
  refreshId: PropTypes.number,
  isMobile: PropTypes.bool,
  containerMargin: PropTypes.string,
  tabPadding: PropTypes.number,
  borderless: PropTypes.bool,
  dynamicHeight: PropTypes.bool,
  contentStyle: PropTypes.instanceOf(Object),
  headerStyle: PropTypes.instanceOf(Object),
  containerStyle: PropTypes.instanceOf(Object),
  legacyPadding: PropTypes.bool,
  fullHeight: PropTypes.bool,
  calMenuHeight: PropTypes.bool,
  fullWidthTabs: PropTypes.bool,
  collapsible: PropTypes.bool,
  onTabOrderChange: PropTypes.func,
};

function TabsV2({
  id,
  width = '100%',
  tabList,
  onChange = null,
  onRenderTabContent = null,
  selectedTab = null,
  onRenderTabHeader = null,
  onRenderTabHeaderMenuItem = null,
  onRenderTabHeaderMobile = null,
  onRenderTabHeaderRightIcon = null,

  refreshId = 0,
  isMobile = false,
  containerMargin,
  tabPadding = 0,
  borderless = false,
  dynamicHeight = false,
  contentStyle,
  headerStyle,
  containerStyle,
  legacyPadding = false,
  fullHeight = false,
  calMenuHeight = false,
  fullWidthTabs = false,
  collapsible = false,
  onTabOrderChange = null,
}) {
  const renderTabContent = () => {
    if (onRenderTabContent) {
      return onRenderTabContent();
    }
    return null;
  };

  const handleChange = (headerId, index, e) => {
    if (onChange) {
      onChange(headerId, index, e);
    }
  };

  const renderItems = () =>
    tabList.map((item, index) => (
      <Fragment key={`tab-${id}-${item.id}`}>
        <div
          role='option'
          aria-selected={selectedTab === item.id}
          key={`tab-${id}-${item.id}`}
          id={`tab-${id}-${item.id}`}
          onClick={() => handleChange(item.id, index)}
        >
          {onRenderTabHeaderMobile && onRenderTabHeaderMobile(item, refreshId)}
          {!onRenderTabHeaderMobile && item.caption}
        </div>
        {selectedTab === item.id && (
          <s.TabPanel
            id={`tab-panel-${id}`}
            borderless={borderless}
            dynamicHeight={dynamicHeight}
            calMenuHeight={calMenuHeight}
          >
            {renderTabContent()}
          </s.TabPanel>
        )}
      </Fragment>
    ));

  const renderMobile = () => (
    <>
      <s.RibbonDivider />
      <s.RibbonListMobile hasItems={tabList.length > 0}>{renderItems() /* Visible Apps */}</s.RibbonListMobile>
    </>
  );

  const renderDesktop = () => (
    <s.TabContainer
      id={`tabs-${id}`}
      width={width}
      fullHeight={fullHeight}
      containerMargin={containerMargin}
      style={containerStyle}
    >
      {tabList.length > 0 && !fullWidthTabs && (
        <TabHeaderV2
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
        <TabHeaderFixedV2
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
          id={`tab-panel-${id}`}
          borderless={borderless}
          dynamicHeight={dynamicHeight}
          calMenuHeight={calMenuHeight}
          style={contentStyle}
        >
          {renderTabContent()}
        </s.TabPanel>
      )}
      <Tooltip id='tab-header-tooltip' />
    </s.TabContainer>
  );

  return isMobile ? renderMobile() : renderDesktop();
}

TabsV2.propTypes = propTypes;

export default TabsV2;
