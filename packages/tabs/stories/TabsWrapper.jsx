/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { useState } from 'react';
import Tabs from '../src';

function TabsWrapper(props) {
  const [selectedTab, setSelectedTab] = useState(props.selectedTab);
  const [tabList, setTabList] = useState(props.tabList);
  const [toggled, setToggled] = useState(false);

  const altTabs = [
    { id: 'Green', caption: 'Green' },
    { id: 'Blue', caption: 'Blue' },
    { id: 'Red', caption: 'Red' },
    { id: 'Yellow', caption: 'Yellow' },
    { id: 'Black', caption: 'Totally awsome tab color scheme version 6' },
    { id: 'Purple', caption: 'Purple' },
  ];
  const handleReorder = (newTabList, _srcIndex, _destIndex) => {
    setTabList(newTabList);
  };
  return (
    <div>
      <button
        type='button'
        onClick={() => {
          setTabList(toggled ? props.tabList : altTabs);
          setToggled(!toggled);
        }}
      >
        Swap Tab List
      </button>
      <Tabs
        {...props}
        onChange={(tabId) => setSelectedTab(tabId)}
        selectedTab={selectedTab}
        tabList={tabList}
        onTabOrderChange={props.isDraggable ? handleReorder : null}
      />
    </div>
  );
}

export default TabsWrapper;
