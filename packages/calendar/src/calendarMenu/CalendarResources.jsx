import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Query, Predicate } from '@syncfusion/ej2-data';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import Dropdown from '@m-next/dropdown';
import { sendCalendarAnalytics, CalendarAnalyticsActions } from '../calendarServices/CalendarAnalytics';

// Resource display constants
const RESOURCE_DISPLAY = {
  DEFAULT_TITLE: 'Resources',
  DROPDOWN_NAME: 'Resources', // Used for dropdown name
};

const propTypes = {
  scheduler: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.elementType }),
    PropTypes.instanceOf(Object),
  ]),
  resourceMappedField: PropTypes.string,
  resourceLabel: PropTypes.string,
  resourceTitle: PropTypes.string,
  resourceTitleFormatted: PropTypes.shape({
    forTab: PropTypes.string,
    forDropdown: PropTypes.string,
    forDisplay: PropTypes.string,
  }),
  resources: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  defaultResource: PropTypes.string,
  selectedResources: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  onSelectResource: PropTypes.oneOfType([PropTypes.func, PropTypes.instanceOf(Object)]),
  isMobile: PropTypes.bool,
  sendAnalytics: PropTypes.func,
  isReadOnly: PropTypes.bool,
};

function CalendarResources(props) {
  const {
    scheduler = null,
    resourceMappedField = null,
    resourceLabel = null,
    resourceTitle = RESOURCE_DISPLAY.DEFAULT_TITLE,
    resourceTitleFormatted = null,
    resources = [],
    defaultResource = null,
    selectedResources = [],
    onSelectResource = () => {},
    isMobile = false,
    sendAnalytics = null, // Function to send analytics
    isReadOnly = false,
  } = props;

  const prevResourceMappedField = useRef(resourceMappedField);
  const containerRef = useRef(null);

  const [availableResources, setAvailableResources] = useState([]);
  const [resourceFilter, setResourceFilter] = useState(null);
  const [maxHeight, setMaxHeight] = useState('100vh');

  // Use formatted title or fallback to legacy formatting
  const formattedDropdownTitle = resourceTitleFormatted?.forDropdown || resourceTitle.toLowerCase();

  const addResource = (resourceId) => {
    if (!resourceId || selectedResources.find((x) => x.RecordID === resourceId)) {
      return;
    }
    // Update resource lists.
    const newResource = resources.find((x) => x.RecordID === resourceId);
    const newSelected = selectedResources.concat(newResource);
    newSelected.sort((a, b) => a[resourceLabel].localeCompare(b[resourceLabel]));
    onSelectResource(newSelected);

    // Verify before shipping whether resources should be removed from list. Additional cleanup logic will likely be required for state persistence.
    // setAvailableResources(availableResources.filter(x => x.RecordID !== id));

    // TODO: Clear resource dropdown
    // Send analytics
    sendCalendarAnalytics(sendAnalytics, CalendarAnalyticsActions.RESOURCE_ADDED, {
      resourceId,
      resourceName: newResource[resourceLabel],
    });
  };

  useEffect(() => {
    setAvailableResources(resources);
    if (resources.length > 0 && selectedResources.length === 0) {
      addResource(defaultResource);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resources]);

  // sets ResourceFilter on render so events respect selected resources
  useEffect(() => {
    if (selectedResources.length > 0 && !resourceFilter) {
      let predicate;

      selectedResources.forEach((selectedResource) => {
        const resourceId = selectedResource.RecordID;

        if (!predicate) {
          predicate = new Predicate(resourceMappedField, 'equal', resourceId);
        } else {
          predicate = predicate.or(resourceMappedField, 'equal', resourceId);
        }
      });

      setResourceFilter(predicate);
      if (scheduler.current) {
        scheduler.current.eventSettings.query = new Query().where(predicate);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedResources]);

  // resourceMapppedField for accounts with custom resource dropdowns, not passed instantly on render
  useEffect(() => {
    if (resourceMappedField !== prevResourceMappedField.current) {
      prevResourceMappedField.current = resourceMappedField;
    }
  }, [resourceMappedField]);

  // Calculate max height based on the tab panel container
  useEffect(() => {
    const updateMaxHeight = () => {
      if (containerRef.current) {
        // Find the tab panel parent
        const tabPanel = containerRef.current.closest('[id^="tab-panel-"]');
        if (tabPanel) {
          const tabPanelHeight = tabPanel.offsetHeight;
          const dropdownHeight = 64; // Dropdown section height
          const margins = 16; // Account for margins
          const parentBottomPadding = 16; // Calendar.jsx flex container has 16px bottom padding

          const calculatedHeight = tabPanelHeight - dropdownHeight - margins - parentBottomPadding;
          setMaxHeight(`${Math.max(calculatedHeight, 300)}px`);
        }
      }
    };

    // Update on mount
    updateMaxHeight();

    // Add resize observer to track container height changes
    let resizeObserver;
    if (containerRef.current) {
      const tabPanel = containerRef.current.closest('[id^="tab-panel-"]');
      if (tabPanel) {
        resizeObserver = new ResizeObserver(updateMaxHeight);
        resizeObserver.observe(tabPanel);
      }
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  const selectResource = (e) => {
    addResource(e.value);
  };

  const formatResources = () => {
    const formattedResources = [];

    availableResources.forEach((obj) => {
      const isResourceSelected = selectedResources?.find((x) => x.RecordID === obj.RecordID);

      if (!isResourceSelected) {
        formattedResources.push({
          value: obj.RecordID,
          label: obj[resourceLabel],
        });
      }
    });

    return formattedResources;
  };

  const removeResource = (resourceId) => {
    const removedResource = selectedResources.find((x) => x.RecordID === resourceId);
    onSelectResource(selectedResources.filter((x) => x.RecordID !== resourceId));

    // Send analytics
    sendCalendarAnalytics(sendAnalytics, CalendarAnalyticsActions.RESOURCE_REMOVED, {
      resourceId,
      resourceName: removedResource[resourceLabel],
    });
  };

  const resourceItem = (resource) => (
    <li
      key={resource?.RecordID}
      style={{ listStyleType: 'none', padding: '12px 4px 12px 4px', borderTop: `1px solid ${colors['grey-light']}` }}
    >
      <h4>
        <span style={{ fontWeight: '600', paddingLeft: '8px' }}>{resource[resourceLabel]}</span>
        <span style={{ float: 'right' }}>
          {selectedResources.length > 1 && !isReadOnly ? (
            <SvgIcon
              id='dialog-close-icon'
              size={10}
              name='close-V4'
              color={colors.grey}
              style={{ margin: '6px 16px 0px 0px' }}
              onClick={() => removeResource(resource?.RecordID)}
            />
          ) : null}
        </span>
      </h4>
    </li>
  );

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <div
        style={{
          padding: `0px ${isMobile ? '16px' : '8px'} 0px ${isMobile ? '16px' : '8px'}`,
          width: '100%',
          height: 64,
        }}
      >
        <Dropdown
          caption={`Add ${formattedDropdownTitle}`}
          options={formatResources()}
          value={null}
          clearOnSelect
          name={RESOURCE_DISPLAY.DROPDOWN_NAME}
          id={`${scheduler.current?.id}-resourceDD`}
          onChange={selectResource}
          isV4Design
          width='100%'
          disabled={isReadOnly}
        />
      </div>
      <ul
        style={{
          margin: '-16px 0 0 0',
          borderBottom: `1px solid ${colors['grey-light']}`,
          overflowY: 'auto',
          maxHeight,
        }}
      >
        {selectedResources.map((resource) => resourceItem(resource))}
      </ul>
    </div>
  );
}
CalendarResources.propTypes = propTypes;
export default CalendarResources;
