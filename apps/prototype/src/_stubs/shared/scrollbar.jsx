// Stub for MethodUI's shared/scrollbar. The real implementation imports
// `react-custom-scroll`, which isn't installed in the workspace. Kit's demo
// doesn't need a custom-styled scrollbar — native browser overflow is fine.

import React from 'react';

const ScrollBar = ({ children, offset, keepAtBottom, ...rest }) => (
  <div style={{ overflow: 'auto', height: '100%', width: '100%' }} {...rest}>
    {children}
  </div>
);

export default ScrollBar;
