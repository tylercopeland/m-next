import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import PropTypes from 'prop-types';

import { selectAccountName, selectDisplayPreferences } from '../../../../common/services/sessionSlice';
import { RumComponentContextProvider } from '../../../../common/rum/RumComponentContext';
import ConfigureRelatedRecordTab from './configureRelatedRecordsTab/ConfigureRelatedRecordTab';
import { useGetAppsQuery, useGetScreensQuery } from '../../../../common/services/appsApi';
import RibbonManagement from './ribbonManagement/RibbonManagement';

// types
const propTypes = {
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
  onSendAnalytics: PropTypes.func,
  initialRelation: PropTypes.shape({
    id: PropTypes.string,
    caption: PropTypes.string,
  }),
  onTabsSettingsChange: PropTypes.func,
  tabList: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
};

function RelatedRecordsEditor({ onChange, onSelect, onSendAnalytics, initialRelation, onTabsSettingsChange, tabList }) {
  const displayPreferences = useSelector(selectDisplayPreferences);
  const accountName = useSelector(selectAccountName);

  const { data: appList, isFetching: isAppListLoading } = useGetAppsQuery({ accountName });
  const { data: screenList, isFetching: isScreenListLoading } = useGetScreensQuery({ accountName });

  const selectedRelation = useMemo(
    () => (initialRelation ? tabList.find((relation) => relation.id === initialRelation.id) : null),
    [tabList, initialRelation],
  );

  return (
    <RumComponentContextProvider componentName='RelatedRecordsEditor'>
      {!selectedRelation && initialRelation?.id !== 'new' && (
        <RibbonManagement tabList={tabList} onTabsSettingsChange={onTabsSettingsChange} onSelect={onSelect} />
      )}
      {(selectedRelation || initialRelation?.id === 'new') && (
        <ConfigureRelatedRecordTab
          rawRibbon={selectedRelation}
          displayPreferences={displayPreferences}
          onSendAnalytics={onSendAnalytics}
          onChange={onChange}
          appList={appList}
          screenList={screenList}
          isAppListLoading={isAppListLoading}
          isScreenListLoading={isScreenListLoading}
          accountName={accountName}
          expandAll
          onSelect={onSelect}
        />
      )}
    </RumComponentContextProvider>
  );
}

RelatedRecordsEditor.propTypes = propTypes;
export default RelatedRecordsEditor;
