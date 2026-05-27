import React, { Suspense, useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import LoadingSkeleton from '@m-next/loading-skeleton';
import { colors, lightTheme } from '@m-next/styles';
import SvgIcon from '@m-next/svg-icon';
import * as s from './tabPanelWrapper.styles';
import { selectFeatureFlags } from '../../../common/services/sessionSlice';
import { selectSelectedControlId } from '../../../common/services/screenLayoutSlice';

const Tabs = React.lazy(() => import('@m-next/tabs'));

// types
const propTypes = {
  onControlClick: PropTypes.func,
  tabList: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  selectedTab: PropTypes.string,
};

function TabPanelWrapper({ onControlClick, tabList, selectedTab }) {
  const featureFlags = useSelector(selectFeatureFlags);
  const selectedControlId = useSelector(selectSelectedControlId);

  const visibleTabs = useMemo(() => tabList?.filter((x) => x.visible), [tabList]);

  const handleClick = (headerId, e) => {
    if (!headerId) {
      onControlClick('tab-panel', null);
    } else {
      const tab = tabList.find((x) => x.id === headerId) ?? {};
      onControlClick('tab-panel', {
        id: headerId,
        caption: tab.caption,
        isStock: tab.isStock,
        visible: tab.visible,
      });
    }
    e.stopPropagation();
    e.preventDefault();
  };

  const renderTabHeaderBadge = (item, refreshId) => {
    const count = tabList.find((x) => x.id === item.id)?.recordCount;
    if (count && count > 0) {
      const countDisplay = count > 99 ? '99+' : count.toString();
      return (
        <s.TabHeaderBadge selected={selectedTab === item.id} refreshid={refreshId}>
          {countDisplay}
        </s.TabHeaderBadge>
      );
    }
    return null;
  };

  const renderTabHeader = (item, refreshId) => (
    <div>
      {item.caption}
      {renderTabHeaderBadge(item, refreshId)}
    </div>
  );

  const renderTabHeaderRightIcon = () =>
    featureFlags?.appRibbonV3Configuration ? (
      <SvgIcon
        id='tab-settings-button'
        name='settings2'
        size={16}
        color={colors.grey}
        style={{ marginLeft: 16, marginRight: 16 }}
        onClick={(e) => handleClick(null, e)}
        tooltip='Display Settings'
        tooltipId='runtime-tooltip'
      />
    ) : null;

  const renderTabContent = () => (
    <div
      id='tab-panel-content'
      style={{ height: '100%', background: colors.white }}
      onClick={(e) => handleClick(null, e)}
    />
  );

  return (
    <s.Wrapper onClick={(e) => handleClick(null, e)} selected={selectedControlId === 'tab-panel'}>
      <Suspense fallback={<LoadingSkeleton count={1} height={600} style={{ marginBottom: 8 }} />}>
        <Tabs
          id='tab-panel-wrapper'
          tabList={visibleTabs}
          onRenderTabContent={renderTabContent}
          onRenderTabHeader={renderTabHeader}
          onRenderTabHeaderMenuItem={renderTabHeader}
          onRenderTabHeaderRightIcon={renderTabHeaderRightIcon}
          containerMargin='0px'
          borderless
          dyanmicHeight
          tabPadding={4}
          containerStyle={{ backgroundColor: lightTheme.background.page }}
          headerStyle={{ paddingLeft: 8 }}
          onChange={(headerId, index, e) => handleClick(headerId, e)}
          selectedTab={selectedTab}
        />
      </Suspense>
    </s.Wrapper>
  );
}

TabPanelWrapper.propTypes = propTypes;
export default TabPanelWrapper;
