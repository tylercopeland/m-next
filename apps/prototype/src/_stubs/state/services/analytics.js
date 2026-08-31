// Stub for MethodUI's state/services/analytics — Redux thunks for analytics.
// In kit we no-op everything; navigation clicks don't need to track.

export const sendAnalytics = () => () => {};

export const analyticsEvents = {
  leftMenu: {
    menuItemClicked: 'leftMenu.menuItemClicked',
  },
};
