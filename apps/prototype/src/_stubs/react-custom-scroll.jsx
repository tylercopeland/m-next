// Stub for the `react-custom-scroll` package. Not installed in the workspace.
// MethodUI's shared/scrollbar imports it; we don't need custom-styled
// scrollbars in kit demos — passthrough to the parent overflow handling.

import React from 'react';

const CustomScroll = ({ children, ...rest }) => (
  <div style={{ overflow: 'auto', height: '100%', width: '100%' }} {...rest}>
    {children}
  </div>
);

export default CustomScroll;
