import Container from '@m-next/container';
import CustomDashboardIcon from '@m-next/svg-icon/src/icons/CustomDashboardIcon';
import React from 'react';

function InvalidScreenDimensions() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: 40 }}>
      <Container width='auto' style={{ alignItems: 'center', height: 600, justifyContent: 'flex-start', padding: 24 }}>
        <CustomDashboardIcon />
        <h3 style={{ marginTop: 24, textAlign: 'center', marginBottom: 4 }}>
          The app builder requires a larger screen width.
        </h3>
        <p style={{ textAlign: 'center' }}>
          The app builder is designed to work at a minimum width of 1024px, you will need to resize this window or use a
          device with a larger scren.
        </p>
      </Container>
    </div>
  );
}

export default InvalidScreenDimensions;
