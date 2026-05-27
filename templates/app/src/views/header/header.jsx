import Container from '@m-next/container';
import React from 'react';
import Button from '@m-next/button';
import Pill from '@m-next/pill';

import * as s from './header.styles';

const propTypes = {};

function Header() {
  return (
    <s.Wrapper>
      <Container
        id='header'
        style={{ justifyContent: 'space-between', flexDirection: 'row', padding: '0px 16px' }}
        width='100%'
        isRound={false}
      >
        <s.LeftWrapper>
          <s.Header id='header-title'>App Template</s.Header>

          <Pill id='header-version-state' leadIcon={{ name: 'dot' }} colorScheme='blue'>
            Draft
          </Pill>
        </s.LeftWrapper>
        <s.RightWrapper>
          <Button id='header-close' value='Close' buttonStyle='ghost' />
          <Button id='header-save' value='Save' disabled />
        </s.RightWrapper>
      </Container>
    </s.Wrapper>
  );
}

Header.propTypes = propTypes;

export default Header;
