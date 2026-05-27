import React from 'react';

import Container from '@m-next/container';
import LeftNavIcon from './leftNavIcon';

const propTypes = {};

function LeftNav() {
  return (
    <Container
      id='left-nav'
      style={{
        justifyContent: 'flex-start',
        flexDirection: 'column',
        display: 'flex',
        alignItems: 'stretch',
        rowGap: '16px',
        height: '100%',
        backgroundColor: 'transparent',
      }}
      isRound={false}
      borderless
    >
      <div style={{ flexGrow: 1 }}>
        <LeftNavIcon
          icon='dashboard'
          id='left-nav-screen-layout'
          key='left-nav-screen-layout'
          label='Layout'
          link=''
          selected
        />
      </div>
    </Container>
  );
}

LeftNav.propTypes = propTypes;
export default LeftNav;
