/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { useState } from 'react';
import TabsV2 from '../src';

function TabsV2Wrapper(props) {
  const [selectedTab, setSelectedTab] = useState(props.selectedTab);
  const [tabList, setTabList] = useState(props.tabList);
  const [toggled, setToggled] = useState(false);

  const altTabs = [
    { id: 'Green', caption: 'Green' },
    { id: 'Blue', caption: 'Blue' },
    { id: 'Red', caption: 'Red' },
    { id: 'Yellow', caption: 'Yellow' },
    { id: 'Black', caption: 'Totally awesome tab color scheme version 6' },
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
      <TabsV2
        {...props}
        onChange={(tabId) => setSelectedTab(tabId)}
        selectedTab={selectedTab}
        tabList={tabList}
        onTabOrderChange={props.isDraggable ? handleReorder : null}
        onRenderTabContent={() => (
          <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '200px' }}>
            <h3>Content for: {selectedTab}</h3>
            <p>
              This is the content panel for the selected tab. You can customize this content using the
              onRenderTabContent prop.
            </p>
            <p>
              Selected tab ID: <strong>{selectedTab}</strong>
            </p>
          </div>
        )}
      />
    </div>
  );
}

export default TabsV2Wrapper;
