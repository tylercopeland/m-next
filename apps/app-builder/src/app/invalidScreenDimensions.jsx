import Container from '@m-next/container';
import { Z_MODAL } from '@m-next/layout-canvas';
import { CustomDashboardIcon } from '@m-next/svg-icon';
import React from 'react';

function InvalidScreenDimensions() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: Z_MODAL.INVALID_SCREEN,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background: 'rgba(255, 255, 255, 0.94)',
      }}
    >
      <Container
        width='auto'
        style={{
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: 24,
          minHeight: 280,
          maxWidth: 640,
          width: '100%',
        }}
      >
        <CustomDashboardIcon />
        <h3 style={{ marginTop: 24, textAlign: 'center', marginBottom: 4 }}>
          The app builder requires a larger screen width.
        </h3>
        <p style={{ textAlign: 'center' }}>
          The app builder is designed to work at a minimum width of 1024px, you will need to resize this window or use a
          device with a larger screen.
        </p>
      </Container>
    </div>
  );
}

export default InvalidScreenDimensions;
