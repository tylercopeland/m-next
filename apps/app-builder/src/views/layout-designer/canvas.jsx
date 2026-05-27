/**
 * Canvas component for rendering the layout designer.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {function} props.onControlClick - Callback function when a control is clicked.
 * @param {Object} props.error - Error object if there is an error.
 * @param {boolean} props.isLoading - Flag indicating if the content is loading.
 * @param {string} props.status - The current status of the content.
 * @param {number} props.appRibbonType - The type of the app ribbon.
 * @param {Object} props.layout - The layout object.
 * @param {Array<Object>} props.tabList - List of tabs.
 * @param {string} props.selectedControlId - The ID of the selected control.
 * @param {Object} props.selectedControlProperty - The properties of the selected control.
 * @param {function} props.onTabSettingsChange - Callback function when tab settings change.
 * @returns {JSX.Element} The rendered Canvas component.
 */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import LoadingSkeleton from '@m-next/loading-skeleton';
import Container from '@m-next/container';
import { lightTheme } from '@m-next/styles';
import { useResizeDetector } from 'react-resize-detector';
import { TAB_PANEL_WIDTH } from '@m-next/layout-canvas';
import 'simplebar-react/dist/simplebar.min.css';
import { renderRow } from './components/sectionLayout';
import TabPanelWrapper from './component-wrappers/tabPanelWrapper';
import Ribbon from './component-wrappers/ribbon/Ribbon';

// types
const propTypes = {
  onControlClick: PropTypes.func,
  error: PropTypes.instanceOf(Object),
  isLoading: PropTypes.bool,
  status: PropTypes.string,
  appRibbonType: PropTypes.number,
  layout: PropTypes.instanceOf(Object),
  tabList: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  selectedControlId: PropTypes.string,
  selectedControlProperty: PropTypes.instanceOf(Object),
  onTabSettingsChange: PropTypes.func,
};

function Canvas({
  onControlClick,
  error,
  isLoading,
  status,
  appRibbonType,
  layout,
  tabList,
  selectedControlId,
  selectedControlProperty,
  onTabSettingsChange,
}) {
  const { width: initialWidth, ref: containerRef } = useResizeDetector();
  let containerWidth = initialWidth;
  if (containerWidth === undefined) {
    // useResizeDetector is returning undefined for these values for unknown reasons.
    // SectionLayout requires a numeric width be set, so instead of undefined we use native canvas default 300
    containerWidth = 300; // Unclear where this problem is coming from.
  }
  // containerWidth -= 32;
  if (appRibbonType === 1) {
    containerWidth -= 80;
  }

  if (appRibbonType === 2) {
    containerWidth = TAB_PANEL_WIDTH;
  }

  const currentTab = useMemo(() => {
    const current = selectedControlId === 'tab-panel' ? selectedControlProperty?.id : null;
    return current;
  }, [selectedControlId, selectedControlProperty]);

  const frameWidth = useMemo(() => {
    if (appRibbonType === 1) {
      //   return 'calc(100% - 80px)';
    }
    return appRibbonType === 2 ? `${TAB_PANEL_WIDTH}px` : '100%';
  }, [appRibbonType]);

  return (
    <Container
      forwardRef={containerRef} // apparently tolerates undefined
      id='layout-designer'
      isRound
      style={{
        backgroundColor: lightTheme.background.page,
        padding: '4px 4px',
        paddingRight: 8,
      }}
      scrollable
    >
      {isLoading && !error && status === 'idle' && (
        <LoadingSkeleton count={1} width='99%' height='100%' circle={false} duration={1.4} />
      )}
      {!isLoading && error && (
        <div style={{ width: '100%', textAlign: 'center', padding: 32 }}>
          <h2>Unable to load requested screen version</h2>
        </div>
      )}
      {!isLoading && !error && status !== 'idle' && layout && (
        <div style={{ display: 'flex' }}>
          <div
            id='main-panel'
            style={{
              width: frameWidth,
              paddingTop: appRibbonType === 2 ? 8 : 0,
              borderRight: appRibbonType === 1 ? '1px solid #E4EAF0' : 'none',
              overflow: 'hidden',
            }}
            onClick={() => onControlClick(null, null)}
          >
            {layout.content.map((item, idx) => renderRow(item, idx, false, false, containerWidth - 16, onControlClick))}
          </div>
          {appRibbonType === 1 && (
            <Ribbon
              onControlClick={onControlClick}
              tabList={tabList}
              selectedTab={currentTab}
              onTabSettingsChange={onTabSettingsChange}
            />
          )}
          {appRibbonType === 2 && (
            <TabPanelWrapper onControlClick={onControlClick} tabList={tabList} selectedTab={currentTab} />
          )}
        </div>
      )}
    </Container>
  );
}

Canvas.propTypes = propTypes;
export default Canvas;
