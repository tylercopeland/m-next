export const sendCalendarAnalytics = (sendAnalytics, action, additionalData = {}) => {
  if (typeof sendAnalytics === 'function') {
    sendAnalytics({
      action,
      source: 'Calendar',
      ...additionalData,
    });
  }
};

export const CalendarAnalyticsActions = {
  RESOURCE_ADDED: 'Calendar Resource Added',
  RESOURCE_REMOVED: 'Calendar Resource Removed',
  WAITLIST_SEARCHED: 'Calendar Waitlist Searched',
  WAITLIST_MOVED_FROM: 'Calendar Activity Moved from Waitlist',
  WAITLIST_MOVED_TO: 'Calendar Activity Moved to Waitlist',
  VIEW_CHANGED: 'Calendar View Changed',
  WORK_ORDER_EDITED: 'Work Order Edited',
  WORK_ORDER_DRAGGED: 'Work Order Dragged',
  NAVIGATION_ADD_EDIT_NEW_WORK_ORDER: 'Navigation - Add/Edit New Work Order',
};
