import React from 'react';
import PropTypes from 'prop-types';

import Container from '@m-next/container';
import LeftNavIcon from './leftNavIcon';

const propTypes = {
  appId: PropTypes.string,
  screenId: PropTypes.string,
  versionId: PropTypes.string,
};

function LeftNav({ appId, screenId, versionId }) {
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
      <LeftNavIcon
        icon='dashboard'
        id='left-nav-screen-layout'
        key='left-nav-screen-layout'
        label='Layout'
        link={`./${appId}/layout/${screenId}/${versionId}`}
        selected
      />
    </Container>
  );
}

LeftNav.propTypes = propTypes;
export default LeftNav;
