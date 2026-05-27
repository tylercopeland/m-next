import React, { useState } from 'react';
import PropTypes from 'prop-types';
import fieldList from '../../../testing/data/fieldListActivities.json';
import InteractionsTab from '../../../src/views/layout-designer/editors/chart-block-editor/InteractionsTab';

const propTypes = {
  hasClickEvent: PropTypes.bool,
  isLoading: PropTypes.bool,
};

function InteractionsTabWrapper({ hasClickEvent = false, isLoading = false }) {
  const [titles, setTitles] = useState({
    caption: 'Test Chart',
    yAxis: 'Amount',
    xAxis: 'Customers',
    series: 'Total',
  });
  const [drilldownEnabled, setDrilldownEnabled] = useState(true);
  const [projection, setProjection] = useState({
    id: 'Activity',
    fields: [
      { name: 'ActivityType', caption: 'Activity type', type: 'DropDown' },
      { name: 'AssignedTo', caption: 'Assigned to', type: 'DropDown' },
    ],
  });
  const [rowClickEvent, setRowClickEvent] = useState({
    appId: 'app1',
    appName: 'Alpha',
    screenId: 'screen2',
    screenName: 'Edit',
  });

  const handleChangeTitle = (value) => {
    setTitles(value);
  };

  const handleChangeProjection = (value) => {
    setProjection(value);
  };

  const handleAppChange = (app) => {
    setRowClickEvent({
      appId: app.value,
      appName: app.label,
      screenId: null,
      screenName: null,
    });
  };

  const handleScreenChange = (screen) => {
    setRowClickEvent({
      appId: rowClickEvent.appId,
      appName: rowClickEvent.appName,
      screenId: screen.value,
      screenName: screen.label,
    });
  };

  return (
    <div style={{ width: 380 }}>
      <InteractionsTab
        titles={titles}
        onChangeTitles={handleChangeTitle}
        onChangeDrilldownEnabled={() => setDrilldownEnabled(!drilldownEnabled)}
        onChangeDrilldownProjection={handleChangeProjection}
        fieldList={fieldList}
        tableName='Activity'
        hasDrilldown={drilldownEnabled}
        hasClickEvent={hasClickEvent}
        projection={projection}
        onPropertySelected={() => {}}
        onAppChange={handleAppChange}
        onScreenChange={handleScreenChange}
        rowClickEvent={rowClickEvent}
        appList={[
          { id: 'app1', caption: 'Alpha' },
          { id: 'app2', caption: 'Beta' },
          { id: 'app3', caption: 'Delta' },
          { id: 'app4', caption: 'Gamma' },
        ]}
        screenList={[
          { id: 'screen1', caption: 'List', viewFriendlyName: 'Activity' },
          { id: 'screen2', caption: 'Edit', viewFriendlyName: 'Activity' },
          { id: 'screen3', caption: 'Report', viewFriendlyName: 'Activity' },
          { id: 'screen4', caption: 'Preferences', viewFriendlyName: 'Activity' },
        ]}
        isAppListLoading={isLoading}
        isScreenListLoading={isLoading}
        isRowClickActionLoading={isLoading}
        expandAll
      />
    </div>
  );
}

InteractionsTabWrapper.propTypes = propTypes;
export default InteractionsTabWrapper;
