/* eslint-disable react/no-unstable-nested-components */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@m-next/tabs';
import { colors } from '@m-next/styles';
import SvgIcon from '@m-next/svg-icon';
import CalendarResources from './CalendarResources';
import CalendarSettings from './CalendarSettings';
import '../calendar.css';

// Menu Page Constants
const MENU_PAGE = {
  RESOURCES: '1',
  SETTINGS: '2',
  WAITLIST: '3',
};

// Resource display constants
const RESOURCE_DISPLAY = {
  DEFAULT_TITLE: 'Resources',
};

const propTypes = {
  id: PropTypes.string,
  scheduler: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.elementType }),
    PropTypes.object,
  ]),
  resourceLabel: PropTypes.string,
  resourceMappedField: PropTypes.string,
  resourceTitle: PropTypes.string,
  resourceTitleFormatted: PropTypes.shape({
    forTab: PropTypes.string,
    forDropdown: PropTypes.string,
    forDisplay: PropTypes.string,
  }),
  resources: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  defaultResource: PropTypes.string,
  calendarSettings: PropTypes.shape({
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    showAllDayEvents: PropTypes.bool,
    showInactiveResources: PropTypes.bool,
  }),
  setCalendarSettings: PropTypes.func,
  selectedResources: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  onSelectResource: PropTypes.func,
  isMobile: PropTypes.bool,
  additionalTabs: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  renderAdditionalTabs: PropTypes.func,
  closeDesktopMenu: PropTypes.func,
  currentMenuPage: PropTypes.string,
  setCurrentMenuPage: PropTypes.func,
  showSettings: PropTypes.bool,
  sidebarVisibility: PropTypes.shape({
    resources: PropTypes.bool,
    waitlist: PropTypes.bool,
    settings: PropTypes.bool,
  }),
  sendAnalytics: PropTypes.func, // Function to send analytics
  isReadOnly: PropTypes.bool,
};

function CalendarMenu(props) {
  const {
    id = '',
    resourceLabel = null,
    resourceMappedField = null,
    resourceTitle = RESOURCE_DISPLAY.DEFAULT_TITLE,
    resourceTitleFormatted = null,
    resources = [],
    defaultResource = null,
    calendarSettings = null,
    setCalendarSettings = () => {},
    scheduler = null,
    selectedResources = [],
    onSelectResource = () => {},
    isMobile = false,
    additionalTabs = [],
    renderAdditionalTabs = null,
    closeDesktopMenu = () => {},
    currentMenuPage = MENU_PAGE.RESOURCES,
    setCurrentMenuPage = () => {},
    showSettings = true,
    sidebarVisibility = { resources: true, waitlist: true, settings: true },
    sendAnalytics = null, // Function to send analytics
    isReadOnly = false,
  } = props;

  const [tabs, setTabs] = useState([]);
  const [noTabsAvailable, setNoTabsAvailable] = useState(false);

  useEffect(() => {
    const allTabs = [];

    // Add Resources tab if visible
    if (sidebarVisibility.resources) {
      allTabs.push({
        id: MENU_PAGE.RESOURCES,
        caption: resourceTitleFormatted?.forTab || resourceTitle,
      });
    }

    // Add Settings tab if visible and enabled
    if (showSettings && sidebarVisibility.settings) {
      allTabs.push({
        id: MENU_PAGE.SETTINGS,
        caption: 'Settings',
      });
    }

    // Add Waitlist tab if visible
    if (additionalTabs.length > 0 && sidebarVisibility.waitlist) {
      // Find the right position to insert waitlist tab
      const waitlistTab = additionalTabs[0];
      if (waitlistTab.id === MENU_PAGE.WAITLIST) {
        // Check if it's the waitlist tab
        // Insert at position that maintains proper order
        const insertIndex = Math.min(waitlistTab.order, allTabs.length);
        allTabs.splice(insertIndex, 0, waitlistTab);
      }
    }

    // Check if we have any tabs at all
    setNoTabsAvailable(allTabs.length === 0);

    setTabs(allTabs);

    // If current tab is hidden, select first available tab
    if (allTabs.length > 0 && !allTabs.some((tab) => tab.id === currentMenuPage)) {
      setCurrentMenuPage(allTabs[0].id);
    }
  }, [
    additionalTabs,
    showSettings,
    sidebarVisibility,
    currentMenuPage,
    setCurrentMenuPage,
    resourceTitleFormatted?.forTab,
    resourceTitle,
  ]);

  function CalendarSettingTab() {
    return (
      <CalendarSettings
        scheduler={scheduler}
        settings={calendarSettings}
        setCalendarSettings={(r) => setCalendarSettings(r)}
        isMobile={isMobile}
        isReadOnly={isReadOnly}
      />
    );
  }

  function CalendarResourcesTab() {
    return (
      <CalendarResources
        scheduler={scheduler}
        resourceMappedField={resourceMappedField}
        resourceLabel={resourceLabel}
        resourceTitle={resourceTitle}
        resourceTitleFormatted={resourceTitleFormatted}
        resources={resources}
        defaultResource={defaultResource}
        selectedResources={selectedResources}
        onSelectResource={(r) => onSelectResource(r)}
        isMobile={isMobile}
        sendAnalytics={sendAnalytics}
        isReadOnly={isReadOnly}
      />
    );
  }

  const onRenderTabContent = () => {
    if (noTabsAvailable) {
      return (
        <div className='calendar-no-tabs-message' style={{ padding: '20px', textAlign: 'center' }}>
          No sidebar sections are currently enabled. Please enable at least one section in the calendar configuration.
        </div>
      );
    }

    switch (currentMenuPage) {
      case MENU_PAGE.RESOURCES:
        return sidebarVisibility.resources ? CalendarResourcesTab() : null;

      case MENU_PAGE.SETTINGS:
        return showSettings && sidebarVisibility.settings ? CalendarSettingTab() : null;

      case MENU_PAGE.WAITLIST:
        return sidebarVisibility.waitlist && renderAdditionalTabs ? renderAdditionalTabs() : null;

      default:
        return null;
    }
  };

  const onRenderTabHeaderRightIcon = () => (
    <SvgIcon
      id={`${id}-calendarMenu-Close`}
      name='calendarMenu-Close'
      title='Close Menu'
      label='Close Menu'
      size={16}
      color={colors.grey}
      onClick={() => closeDesktopMenu()}
      backgroundHoverColor={colors['grey-lighter']}
      isRound
    />
  );

  if (noTabsAvailable) {
    return (
      <div className='calendar-menu-no-tabs' style={{ padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>{!isMobile && onRenderTabHeaderRightIcon()}</div>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          No sidebar sections are currently enabled. Please enable at least one section in the calendar configuration.
        </div>
      </div>
    );
  }

  return (
    <Tabs
      id={`${id}-calendarTab`}
      tabList={tabs}
      onRenderTabContent={onRenderTabContent}
      onChange={(tabId) => setCurrentMenuPage(tabId)}
      selectedTab={currentMenuPage}
      isMobile={false}
      isLeftNavOpen={false}
      contentPanelWidth={0}
      onRenderTabHeaderRightIcon={isMobile ? null : onRenderTabHeaderRightIcon}
      containerMargin='0'
      headerStyle={{
        padding: '16px 8px 0px 8px',
        marginBottom: '16px',
      }}
      contentStyle={{
        border: 'none',
        minHeight: 0,
        backgroundColor: 'transparent',
      }}
      fullHeight
      calMenuHeight
    />
  );
}

CalendarMenu.propTypes = propTypes;
export default CalendarMenu;
