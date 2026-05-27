import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as s from './TabsV2.styles';

const propTypes = {
  id: PropTypes.string.isRequired,
  tabList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      caption: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onChange: PropTypes.func,
  selectedTab: PropTypes.string,
  onRenderTabHeader: PropTypes.func,
  onRenderTabHeaderRightIcon: PropTypes.func,
  refreshId: PropTypes.number,
  headerStyle: PropTypes.instanceOf(Object),
};

function TabHeaderFullV2(props) {
  const {
    id = null, // {string} - Tab container id
    tabList = [], // {object[]} - All tabs (tab = { id: string; caption: string; })
    selectedTab = null, // {string} - Id of the active tab
    onChange = null, // {func} - Event handler
    onRenderTabHeader = null, // {func} - Render fn for tab header button
    onRenderTabHeaderRightIcon = null,
    refreshId = 0,
    headerStyle = null,
  } = props;

  const [currentTab, setCurrentTab] = useState(selectedTab);

  useEffect(() => {
    setCurrentTab(selectedTab);
  }, [selectedTab]);

  const handleChange = (headerId, index) => {
    setCurrentTab(headerId);
    if (onChange) {
      onChange(headerId, index);
    }
  };

  const handleTabHeaderKeyUp = (e) => {
    const selectedIndex = tabList.findIndex((x) => x.id === currentTab);
    let isStopPropigation = false;

    switch (e.which) {
      case 37: // left arrow
      case 38: // Up arrow
        if (selectedIndex > 0) {
          const newTabIndex = tabList.findIndex((x) => x.id === currentTab) - 1;
          handleChange(tabList[newTabIndex].id, newTabIndex);
        } else {
          handleChange(tabList[tabList.length - 1].id, tabList.length - 1);
        }
        isStopPropigation = true;

        break;
      case 39: // right arrow
      case 40: // down arrow
        if (selectedIndex < tabList.length - 1) {
          const newTabIndex = tabList.findIndex((x) => x.id === currentTab) + 1;
          handleChange(tabList[newTabIndex].id, newTabIndex);
        } else {
          handleChange(tabList[0].id, 0);
        }
        isStopPropigation = true;
        break;
      case 36: // home
        handleChange(tabList[0].id, 0);
        isStopPropigation = true;
        break;
      case 35: // end
        handleChange(tabList[tabList.length - 1].id, tabList.length - 1);
        isStopPropigation = true;
        break;
      default:
        break;
    }

    if (isStopPropigation) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const renderTabHeader = (tab, index) => (
    <s.TabHeader
      tabIndex={currentTab === tab.id ? '0' : -1}
      role='tab'
      aria-controls={`tab-panel-${id}`}
      aria-selected={currentTab === tab.id}
      key={`tab-${id}-${tab.id}`}
      id={`tab-${id}-${tab.id}`}
      onClick={() => handleChange(tab.id, index)}
      selected={currentTab === tab.id}
      className={`mi-TabBar-TabHeaderButton ${currentTab === tab.id ? 'selected' : ''}`}
      onKeyDown={handleTabHeaderKeyUp}
      fullWidthTabs
    >
      {onRenderTabHeader && onRenderTabHeader(tab, refreshId)}
      {!onRenderTabHeader && tab.caption}
    </s.TabHeader>
  );

  return (
    <s.TabHeaderContainer id={`tabs-header-${id}`} role='tablist' style={headerStyle}>
      {tabList?.map((tab, index) => renderTabHeader(tab, index))}
      {onRenderTabHeaderRightIcon !== null && onRenderTabHeaderRightIcon()}
    </s.TabHeaderContainer>
  );
}

TabHeaderFullV2.propTypes = propTypes;

export default TabHeaderFullV2;
